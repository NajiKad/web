import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Konva from 'konva';
import { Stage, Layer, Image, Rect, Text, Circle, Star } from 'react-konva';
import useImage from 'use-image';
import MapBackground from './MapBackground'
import config from '../config.json';
import ModalSetGrid from './ModalSetGrid';
import RenderGeneric from './RenderGeneric';
import RenderPath from './RenderPath';
import RenderDoor from './RenderDoor';
import RenderElevator from './RenderElevator';
import RenderStairs from './RenderStairs';
import RenderCoffee from './RenderCoffee';
import RenderUtensils from './RenderUtensils';
import RenderRestroom from './RenderRestroom';
import RenderMale from './RenderMale';
import RenderFemale from './RenderFemale';
import RenderHeartbeat from './RenderHeartbeat';
import RenderRecycle from './RenderRecycle';
import RenderFireExtinguisher from './RenderFireExtinguisher';
import RenderMapMarker from './RenderMapMarker';
import RenderSquare from './RenderSquare';
import RenderDoorOpen from './RenderDoorOpen';
import RenderDoorClosed from './RenderDoorClosed';
import RenderSquareRed from './RenderSquareRed';
import RenderSquareGrey from './RenderSquareGrey';
import RenderSquareGreen from './RenderSquareGreen';
import RenderCircleRedSm from './RenderCircleRedSm';
import RenderCircleGreySm from './RenderCircleGreySm';
import RenderCircleGreenSm from './RenderCircleGreenSm';
import RenderCircleRedLg from './RenderCircleRedLg';
import RenderCircleGreyLg from './RenderCircleGreyLg';
import RenderCircleGreenLg from './RenderCircleGreenLg';

import CircleRedSm from './CircleRedSm';
import CircleGreySm from './CircleGreySm';
import CircleGreenSm from './CircleGreenSm';
import CircleRedLg from './CircleRedLg';
import CircleGreyLg from './CircleGreyLg';
import CircleGreenLg from './CircleGreenLg';
import SquareRed from './SquareRed';
import SquareGrey from './SquareGrey';
import SquareGreen from './SquareGreen';

import Restroom from './Restroom';
import Male from './Male';
import Female from './Female';
import Coffee from './Coffee';
import Utensils from './Utensils';
import DoorOpen from './DoorOpen';
import DoorClosed from './DoorClosed';
import Stairs from './Stairs';
import Elevator from './Elevator';
import Heartbeat from './Heartbeat';
import Recycle from './Recycle';
import FireExtinguisher from './FireExtinguisher';
import MapMarker from './MapMarker';
import ImageRegular from './ImageRegular';

import Square from './Square';
import Pencil from './Pencil';
import Redo from './Redo';
import Undo from './Undo';
import Plus from './Plus';
import Minus from './Minus';
import HandPaper from './HandPaper';
import DrawPolygon from './DrawPolygon';

const STAGE_WIDTH = window.innerWidth;
const STAGE_HEIGHT = window.innerHeight;
const TOOLBAR_WIDTH = 120;
const TOOLBAR_HEIGHT = 650;
const TOOLBAR_X = 10;
const TOOLBAR_Y = 30;
const CIRC_RADIUS = 7;
const CIRC_RADIUS_SM = 3;
const SHADOW_OFFSET = 4;
const FONT_SIZE = 20;

const X = [25, 60, 95]; 
const Y = [50, 90, 130, 170, 210, 250, 290, 330, 370, 410, 450, 490, 530, 570, 610, 650];

let origX = 0;
let origY = 0;

var stage;
var mousePos;
var tooltipLayer = new Konva.Layer();
var tooltip = new Konva.Text({
  text: '',
  fontFamily: 'Calibri',
  fontSize: 18,
  padding: 5,
  textFill: 'white',
  fill: 'black',
  alpha: 0.75,
  visible: false
})

const handleClick = e => { 
  // open sidebar with focus - show delete or edit buttons
  console.log("clicked obj ", e.target)
};


let newImage = (t, pointerPosition) => ({
  // fetch new location_id?
  location_id: 7,  // fetch it
  key: 7, // location_id

  // pop up modal to input short_name and description
  short_name: "fooImage",
  description: "foo2Image",
  long_name: "fooeyImage",
  active: "true", // can we just make this a default on the creation of new objects?
  
  // x and y are pixel ref
  x: pointerPosition.x,
  y: pointerPosition.y,
  scaleX: t.attrs.scaleX,
  scaleY: t.attrs.scaleY,

  // x_coordinate and y_coordinate are relative coords
  x_coordinate: 2,
  y_coordinate: 3,
  
  object_type_id: 1,
  
  // lat and long are only set for primary or secondary objects - does each floor need them?
  latitude: 0,
  longitude: 0,

  image: t.attrs.image,

});

let newCirc = (t, pointerPosition) => ({
  // fetch new location_id?
  location_id: 7,  // fetch it
  key: 7, // location_id

  // pop up modal to input short_name and description
  short_name: "foo",
  description: "foo2",
  long_name: "fooey",
  active: "true", // can we just make this a default on the creation of new objects?
  
  // x and y are pixel ref
  x: pointerPosition.x,
  y: pointerPosition.y,

  // x_coordinate and y_coordinate are relative coords
  x_coordinate: 2,
  y_coordinate: 3,
  
  object_type_id: 1,
  
  // lat and long are only set for primary or secondary objects - does each floor need them?
  latitude: 0,
  longitude: 0,

  radius: t.attrs.radius,
  fill: t.attrs.fill,
  stroke: t.attrs.stroke

});


let newRect = (t, pointerPosition) => ({

  x: pointerPosition.x - t.attrs.width / 2,
  y: pointerPosition.y - t.attrs.height / 2,
  height: t.attrs.height,
  width: t.attrs.width,
  fill: t.attrs.fill,
  stroke: t.attrs.stroke
  // name: 
  // key: target.ref + 1
});


let newText = (t, pointerPosition) => ({

  x: pointerPosition.x - t.textWidth / 2,
  y: pointerPosition.y - t.textHeight / 2,
  fontFamily: t.attrs.fontFamily,
  fontSize: t.attrs.fontSize,
  text: t.attrs.text,
  fill: t.attrs.fill
  // name: increment name + 1?
  // key: target.ref + 1
});



class Graphics extends Component {

  constructor() {
    super()
    this.state = {
      location: [],
      objects: [],
      canvasImage: [],
      canvasRect: [],
      canvasCirc: [],
      canvasText: []
    }

    this.handleDragRectStart = this.handleDragRectStart.bind(this)
    this.handleDragRectEnd = this.handleDragRectEnd.bind(this)
    this.handleDragImageStart = this.handleDragImageStart.bind(this)
    this.handleDragImageEnd = this.handleDragImageEnd.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseOut= this.handleMouseOut.bind(this)
  }

  componentDidMount() {

		let accessToken = localStorage.getItem("admin") != null ? localStorage.getItem("CognitoIdentityServiceProvider.7qismhftk1ehili7a4qp9cc5el." + 
		JSON.parse(localStorage.getItem("admin")).username + ".idToken") : "";

    let headers = config.api.headers;
    
    const url = config.api.invokeUrl + '/location/' + this.props.location_id;
		fetch(url, 
		{
			method: "GET",
			headers,
		}).then(response => {
			return response.json();
		}).then(result => {
			this.setState(
				{
					location: result.body.data
				}
			);
			console.log("location... ", result.body.data);
		});
    
    const url2 = config.api.invokeUrl + '/objects/location/' + this.props.location_id;
		fetch(url2, 
		{
			method: "GET",
			headers,
		}).then(response => {
			return response.json();
		}).then(result => {
			this.setState(
				{
					objects: result.body.data
				}
			);
      console.log("objects... ", result.body.data);

    });
    
    
  }


  handleClick = e => { 
    // open sidebar with focus - show delete or edit buttons
    console.log("clicked obj ", e.target)
  };

  handleMouseMove = e => { 
    stage = e.target.getStage();
    mousePos = stage.getPointerPosition();

    tooltip.position({
      x: mousePos.x + 5,
      y: mousePos.y + 5
    });

    tooltip.text(e.target.attrs.text);
    tooltip.show();
    tooltipLayer.add(tooltip);
    stage.add(tooltipLayer);

    // console.log("get stage ", e.target.getStage);
    // e.target.getStage().batchdraw();
    tooltipLayer.batchDraw();
    console.log("mouse move ", e.target)
  };


  handleMouseOut = e => { 


    tooltip.hide();
    e.target.getStage().draw();
    console.log("mouse out ", e.target)
  };

  // handleDragTextStart = e => {
  //   origX = e.target.attrs.x;
  //   origY = e.target.attrs.y;
  // };

  // handleDragTextEnd = e => {

  //   const stage = e.target.getStage();
  //   const pointerPosition = stage.getPointerPosition();

  //   console.table({x: pointerPosition.x, y: pointerPosition.y});

  //   console.log("new - canvasText length before add is ", this.state.canvasText.length);
  //   console.log("target is: ", e.target);
  //   console.log("target color is: ", e.target.attrs.fill);

  //   this.setState(prevState => ({
  //     canvasText: [...prevState.canvasText, { ...newText(e.target, pointerPosition) }]
  //   }));

  //   // put draggable back to original location
  //   e.target.position({ 
  //     x: origX,
  //     y: origY
  //   });

  //   e.target.to({
  //     duration: 0.2,
  //     easing: Konva.Easings.ElasticEaseOut,
  //     shadowOffsetX: 0,
  //     shadowOffsetY: 0
  //   });

  //   e.target.getStage().draw();

  // }; // end handleDragTextEnd

  handleDragImageStart = e => {
    console.log("drag image start e: ", e);
    origX = e.target.attrs.x;
    origY = e.target.attrs.y;
    e.target.setAttrs({
      shadowOffset: {
        x: SHADOW_OFFSET,
        y: SHADOW_OFFSET
      },
      scaleX: 0.04,
      scaleY: 0.04
    });
  };  // end handleDragImageStart

  handleDragImageEnd = e => {
    console.log("drag image end e: ", e);
    console.log(origX, " ", origY);
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    console.table({x: pointerPosition.x, y: pointerPosition.y});

    console.log("new - canvasImage length before add is ", this.state.canvasImage.length);
    console.log("target is: ", e.target);
    // console.log("target color is: ", e.target.attrs.fill);

    // call to get new location_id?? and feed in to ...newCirc(location_id, e.target, pointerPosition) ??

    this.setState(prevState => ({
      canvasImage: [...prevState.canvasImage, { ...newImage(e.target, pointerPosition) }]
    }));

    // put draggable back to original location
    e.target.position({ 
      x: origX,
      y: origY
    });

    e.target.to({
      duration: 0.2,
      easing: Konva.Easings.ElasticEaseOut,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });

    e.target.getStage().draw();

  }; // end handleDragImageEnd

  handleDragCircStart = e => {
    origX = e.target.attrs.x;
    origY = e.target.attrs.y;
    e.target.setAttrs({
      shadowOffset: {
        x: SHADOW_OFFSET,
        y: SHADOW_OFFSET
      }
      // scaleX: 1.1,
      // scaleY: 1.1
    });
  };  // end handleDragCircStart

  handleDragCircEnd = e => {

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    console.table({x: pointerPosition.x, y: pointerPosition.y});

    console.log("new - canvasCirc length before add is ", this.state.canvasCirc.length);
    console.log("target is: ", e.target);
    console.log("target color is: ", e.target.attrs.fill);

    // call to get new location_id?? and feed in to ...newCirc(location_id, e.target, pointerPosition) ??

    this.setState(prevState => ({
      canvasCirc: [...prevState.canvasCirc, { ...newCirc(e.target, pointerPosition) }]
    }));

    // put draggable back to original location
    e.target.position({ 
      x: origX,
      y: origY
    });

    e.target.to({
      duration: 0.2,
      easing: Konva.Easings.ElasticEaseOut,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });

    e.target.getStage().draw();

  }; // end handleDragCircEnd


  handleDragRectStart = e => {
    origX = e.target.attrs.x;
    origY = e.target.attrs.y;
    e.target.setAttrs({
      shadowOffset: {
        x: SHADOW_OFFSET,
        y: SHADOW_OFFSET
      }
      // scaleX: 1.1,
      // scaleY: 1.1
    });
  }; // end handleDragRectStart


  handleDragRectEnd = e => {

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    console.table({x: pointerPosition.x, y: pointerPosition.y});

    console.log("new - canvasRect length before add is ", this.state.canvasRect.length);
    console.log("target is: ", e.target);
    console.log("target color is: ", e.target.attrs.fill);

    this.setState(prevState => ({
      canvasRect: [...prevState.canvasRect, { ...newRect(e.target, pointerPosition) }]
    }));

    // put draggable back to original location
    e.target.position({ 
      x: origX,
      y: origY
    });

    e.target.to({
      duration: 0.2,
      easing: Konva.Easings.ElasticEaseOut,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });

    e.target.getStage().draw();

  }; // end handleDragRectEnd

  render() {

    return (
      <div className="graphics">
        
        <Stage 
          width={STAGE_WIDTH} 
          height={STAGE_HEIGHT} 
          >
          <Layer name="background">
          {this.state.location.map((i) => (
            <MapBackground img={i.canvas_image} />
            ))}
            {/* <ModalSetGrid objects ={this.state.objects}/> */}

          </Layer>
          <Layer name="main">

              <Rect
                x={TOOLBAR_X}
                y={TOOLBAR_Y}
                width={TOOLBAR_WIDTH}
                height={TOOLBAR_HEIGHT}
                fill="white"
                stroke="lightgrey"
              />

              <CircleRedSm x={X[0] + CIRC_RADIUS} y={Y[0] + CIRC_RADIUS} />
              <CircleRedSm 
                x={X[0] + CIRC_RADIUS} 
                y={Y[0] + CIRC_RADIUS} 
                name="CircRdSm"
                onDragStart={this.handleDragCircStart}
                onDragEnd={this.handleDragCircEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <CircleGreySm x={X[1] + CIRC_RADIUS} y={Y[0] + CIRC_RADIUS} />
              <CircleGreySm
                x={X[1] + CIRC_RADIUS} 
                y={Y[0] + CIRC_RADIUS} 
                name="CircGrySm"
                onDragStart={this.handleDragCircStart}
                onDragEnd={this.handleDragCircEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <CircleGreenSm x={X[2] + CIRC_RADIUS} y={Y[0] + CIRC_RADIUS} />
              <CircleGreenSm 
                x={X[2] + CIRC_RADIUS} 
                y={Y[0] + CIRC_RADIUS} 
                name="CircGrnSm"
                onDragStart={this.handleDragCircStart}
                onDragEnd={this.handleDragCircEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <CircleRedLg x={X[0] + CIRC_RADIUS} y={Y[1] + CIRC_RADIUS} />
              <CircleRedLg 
                x={X[0] + CIRC_RADIUS} 
                y={Y[1] + CIRC_RADIUS} 
                name="CircRdLg"
                onDragStart={this.handleDragCircStart}
                onDragEnd={this.handleDragCircEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <CircleGreyLg x={X[1] + CIRC_RADIUS} y={Y[1] + CIRC_RADIUS} />
              <CircleGreyLg
                x={X[1] + CIRC_RADIUS} 
                y={Y[1] + CIRC_RADIUS} 
                name="CircGryLg"
                onDragStart={this.handleDragCircStart}
                onDragEnd={this.handleDragCircEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <CircleGreenLg x={X[2] + CIRC_RADIUS} y={Y[1] + CIRC_RADIUS} />
              <CircleGreenLg 
                x={X[2] + CIRC_RADIUS} 
                y={Y[1] + CIRC_RADIUS} 
                name="CircGrnLg"
                onDragStart={this.handleDragCircStart}
                onDragEnd={this.handleDragCircEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <SquareRed x={X[0]} y={Y[2]} />
              <SquareRed
                x={X[0]}
                y={Y[2]}
                name="Rect2"
                onDragStart={this.handleDragRectStart}
                onDragEnd={this.handleDragRectEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <SquareGrey x={X[1]} y={Y[2]} />
              <SquareGrey
                x={X[1]}
                y={Y[2]}
                name="Rect2"
                onDragStart={this.handleDragRectStart}
                onDragEnd={this.handleDragRectEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <SquareGreen x={X[2]} y={Y[2]} />
              <SquareGreen
                x={X[2]}
                y={Y[2]}
                name="Rect2"
                onDragStart={this.handleDragRectStart}
                onDragEnd={this.handleDragRectEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Restroom x={X[0]} y={Y[3]} />
              <Restroom x={X[0]} y={Y[3]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Male x={X[1] + CIRC_RADIUS} y={Y[3]} />
              <Male x={X[1] + CIRC_RADIUS} y={Y[3]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Female x={X[2] + CIRC_RADIUS} y={Y[3]} />
              <Female x={X[2] + CIRC_RADIUS} y={Y[3]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Coffee x={X[0]} y={Y[4]} />
              <Coffee x={X[0]} y={Y[4]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Utensils x={X[1]} y={Y[4]} />
              <Utensils x={X[1]} y={Y[4]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <DoorOpen x={X[0]} y={Y[5]} />
              <DoorOpen x={X[0]} y={Y[5]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
              
              <DoorClosed x={X[1]} y={Y[5]} />
              <DoorClosed x={X[1]} y={Y[5]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
            
              <Stairs x={X[0]} y={Y[6]} />
              <Stairs x={X[0]} y={Y[6]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
              
              <Elevator x={X[1]} y={Y[6]} />
              <Elevator x={X[1]} y={Y[6]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Heartbeat x={X[0]} y={Y[7]} />
              <Heartbeat x={X[0]} y={Y[7]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
              
              <Recycle x={X[0]} y={Y[8]} />
              <Recycle x={X[0]} y={Y[8]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <FireExtinguisher x={X[0]} y={Y[9]} />
              <FireExtinguisher x={X[0]} y={Y[9]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
             
              <MapMarker x={X[0]} y={Y[10]} />
              <MapMarker x={X[0]} y={Y[10]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
              
              <ImageRegular x={X[0]} y={Y[11]}/>
              <ImageRegular x={X[0]} y={Y[11]}
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
             
             <Square x={X[0]} y={Y[12]} />
              <Square x={X[0]} y={Y[12]} 
                handleDragImageStart = {this.handleDragImageStart} 
                handleDragImageEnd = {this.handleDragImageEnd}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />
              
              <Pencil x={X[0]} y={Y[13]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <DrawPolygon x={X[1]} y={Y[13]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Redo x={X[0]} y={Y[14]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Undo x={X[1]} y={Y[14]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Plus x={X[0]} y={Y[15]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <Minus x={X[1]} y={Y[15]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />

              <HandPaper x={X[2]} y={Y[15]}
                onMouseMove={this.handleMouseMove}
                onMouseOut={this.handleMouseOut}
              />


            <RenderGeneric objects={this.state.objects}/>
            <RenderPath objects={this.state.objects}/>
            <RenderDoor objects={this.state.objects}/>
            <RenderElevator objects={this.state.objects}/>
            <RenderStairs objects={this.state.objects}/>
            <RenderCoffee objects={this.state.objects}/>
            <RenderUtensils objects={this.state.objects}/>
            <RenderRestroom objects={this.state.objects}/>
            <RenderMale objects={this.state.objects}/>
            <RenderFemale objects={this.state.objects}/>
            <RenderHeartbeat objects={this.state.objects}/>
            <RenderRecycle objects={this.state.objects}/>
            <RenderFireExtinguisher objects={this.state.objects}/>
            <RenderMapMarker objects={this.state.objects}/>
            <RenderSquare objects={this.state.objects}/>
            <RenderDoorOpen objects={this.state.objects}/>
            <RenderDoorClosed objects={this.state.objects}/>
            <RenderSquareRed objects={this.state.objects}/>
            <RenderSquareGrey objects={this.state.objects}/>
            <RenderSquareGreen objects={this.state.objects}/>
            <RenderCircleRedLg objects={this.state.objects}/>
            <RenderCircleGreyLg objects={this.state.objects}/>
            <RenderCircleGreenLg objects={this.state.objects}/>
            <RenderCircleRedSm objects={this.state.objects}/>
            <RenderCircleGreySm objects={this.state.objects}/>
            <RenderCircleGreenSm objects={this.state.objects}/>

          </Layer>
        </Stage>
      </div>
    )
  }
}

export default Graphics;