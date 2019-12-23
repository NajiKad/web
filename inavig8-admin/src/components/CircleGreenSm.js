import React from 'react';
import { Circle } from 'react-konva';


const CIRC_RADIUS_SM = 3;


const CircleGreenSm = (props) => {
    const handleCircleGreenSmClick = (e) => {
      console.log('small green circle clicked');
    }
    return <Circle 
            x={props.x} 
            y={props.y} 
            radius={CIRC_RADIUS_SM} 
            name={props.name}
            fill="green" 
            draggable              
            onDragStart={props.handleDragCircStart}
            onDragEnd={props.handleDragCircEnd}
            onClick={handleCircleGreenSmClick}
            onMouseMove={props.handleMouseMove}
            onMouseOut={props.handleMouseOut}
            shadowBlur={1} />;
  };


  export default CircleGreenSm;