import React from 'react';
import { IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonDatetime, IonModal, IonReorder, IonRippleEffect, IonList, IonReorderGroup
} from '@ionic/react';
import { play, stop, caretUp, caretDown, calendarClear, people } from 'ionicons/icons';
import { useState, useEffect, useCallback, useRef } from 'react';

import * as d3 from 'd3';

import './DistributionComponent.css';

type RGBColor = { r: number, g: number, b: number };




interface DistributionGraphProps {
  data?:[number,number][];
  cut: number;
  percent: number;
  scores: number[];
  color?:string;
  fill?:boolean;
}

type item = {
  header:string;
  description?:any[];
  right?:string;
  left?:string;
  fixed?:boolean;
  selected?:boolean;
  child?:any[];
  divider?:boolean;
}

let groups:item[] = [
    {header: "Bursa FKM Kurs F3", left: "392", selected: true  }

  ]

const DistributionComponent: React.FC<DistributionGraphProps> = ({ 
  cut, percent, scores, color="#E7C3F380", fill,
  data=[
      [1, 200],
      [2, 500],
      [3, 400],
      [4, 180],
      [5, 310],
      [6, 370],
      [7, 370],
      [8, 290],
      [9, 300],

    ]
}) => {

  const [score, setScore] = useState<number | null>(null);


  const distClipRect = useRef<SVGRectElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Define margins and dimensions
  const width = 740;//340
  const height = 170;
  const margin = { top: 25, right: 55, bottom: 20, left: 10 };
  const innerSVGwidth = width - margin.left - margin.right;
  const innerSVGheight = height - margin.top - margin.bottom;




  function renderItem( item:item, i:number ) {
    return (
      <IonItem mode="md" button key={"chartgroupitem-"+i}  onClick={() => console.log(i)}
        className={'item-graph-class'}>
        <div className='card-item-container'>
          {item.left?
            <div className='card-item-left' >
              <div className='card-item-left-text'>{item.left}</div>
            </div> : null
          }
          <div className='card-item-middle' style={{paddingLeft: item.left?"0px":"5%", paddingRight: "5%"}}>
            <div className='card-header-text' style={(item.selected?{}:{color:"#ffffff88"})}>
              {item.header}
              </div>
              {item.description?.map(description => 
                <div className='card-description-text'>
                  {description.text}
                </div>)
              }
          </div>
          { item.right? 
            <>
            { item.fixed? 
              <div className={i>0?'card-item-right':'card-item-header-right'}>
                <div className='card-item-right-button' id={"card-datetime-button"+i}>
                  { item.right }<IonRippleEffect></IonRippleEffect>
                </div>
              </div>
                  : 
              <IonReorder className={i>0?'card-item-right':'card-item-header-right'}>
                <div className='card-item-right-text'>{ item.right }</div>
              </IonReorder>
            }
            </> 
            : null 
          }
        </div>
      </IonItem>
    )
  }

  function verticalGrid(svg:any, n:number) {
    let interval = innerSVGwidth/(n-1);
    for ( let i=0; i<n; i++ ) {
      svg.append('line')
        .attr('x1', interval*i+margin.left)
        .attr('y1', 0)
        .attr('x2', interval*i+margin.left+0.01)
        .attr('y2', height)
        .style('stroke', 'url(#lineGradient)');
    }
  }

  function horizontalGrid(svg:any, n:number) {
    let interval = innerSVGheight/(n);
    for ( let i=0; i<n; i++ ) {
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', interval*i+margin.top)
        .attr('x2', width)
        .attr('y2', interval*i+margin.top+1)
        .style('stroke', 'url(#lineGradient)');
    }
  }
  
  useEffect(() => {

    d3.select(svgRef.current).selectAll("*:not(:first-child)").remove();

    const svg = d3.select(svgRef.current);
    

    // Create scales for x and y axes
    const x = d3.scaleLinear()
      .domain([1, data.length])
      .range([0, innerSVGwidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1]+10) || 0])
      .range([innerSVGheight, 0]);
      
      
    verticalGrid(svg, innerSVGwidth/40)
    if(!fill) horizontalGrid(svg, innerSVGheight/40);

    // Create a line generator with cubic Bezier interpolation
    const line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]))
      .curve(d3.curveCatmullRom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const gback = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    
    if ( fill ) {

        g.append('path')
          .datum(data)
          .attr('fill', color+"99")
          .attr('fill-rule', 'evenodd')
          .attr('clip-path', 'url(#clip)')
          .attr('d', line as any);

        gback.append('path')
          .datum(data)
          .attr('fill', '#ffffff24')
          .attr('fill-rule', 'evenodd')
          .attr('d', line as any);
        

    } else {

        g.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 3)
          .attr('clip-path', 'url(#clip)')
          .attr('d', line as any);

    }
    
    setTimeout(() => frameRef.current?.scrollTo({
      top: 100,
      left: 10000,
      behavior: "smooth",
    }), 400);

  }, []);


  useEffect(() => {
    setScore(null)
    setTimeout( () => setScore(scores[1]), 2000 );
    if (distClipRect.current) {
      distClipRect.current.animate(fill?[
        { x: '400' },
        { x: (100-cut)*3.4 }
      ]:[
        { x: '-400' },
        { x: (100-cut)*3.4-320 }
      ]
      , {
        duration: 2000, // Animation duration, 2000ms = 2s
        iterations: 1, // Number of times the animation should repeat
        easing: 'ease-in-out', // Specifies the speed curve of the animation
        fill: 'forwards' // The animation will retain the style values from the last keyframe when the animation ends
      });
    }
  }, [cut, scores]);


  return (
    <div style={{ position: "relative", height: "auto" }}>

      <div style={{ boxShadow: "0px 15px 22px #1d1f1d44", paddingTop: "0px", paddingBottom: "0px", position:"relative",
        borderRadius: "16px", zIndex: 999, backgroundColor: "#3D3D3D77", width: "90%", margin: "5%", overflow:"clip" }}>

        <IonList style={{paddingBottom: "14px", backgroundColor: "#292B2900", zIndex: 999}}>
          <IonReorderGroup disabled={false} >
            { groups.map((group:item, i) => renderItem(group, i+1))}
          </IonReorderGroup>
        </IonList>
      
        
        <div ref={frameRef} style={{overflowX: "scroll", overflowY: "hidden", height: height+"px", padding:0, margin:0, position:"relative"}}>
          
          {["01","02","03","04","05","06","07","08"].map((num:string, i:number) => 
            <div key={"chart-index"+num} className='score-value' style={{ top:5, left:i*85.4+40 }}> {num} </div>
          )}
          <div className='score-value' style={{ bottom:96, left:700 }}> 400 </div>
          
          <svg ref={svgRef} className='svg-frame' viewBox={"0 0 "+width+" "+height} 
            onClick={(e)=> {
              const [x, y] = d3.pointer(e);
              console.log(x, y);
              
            }}>
              <defs>
              <linearGradient id="lineGradient" x1="0%" y1="100%" x2="1%" y2="0%">
                <stop offset="0%" style={{stopColor: "#ffffff11", }} />
                <stop offset="50%" style={{stopColor: "#ffffff88", }} />
                <stop offset="100%" style={{stopColor: "#ffffff11", }} />
              </linearGradient>
              <clipPath id="clip">
                <rect ref={distClipRect} x="40px" y="0" width={width} height={height}/>
              </clipPath>
            </defs>

          </svg>

        </div>
        
        <div className='score-value' style={{ bottom:20, right:11.5 }}> 380 </div>
        
        
      </div>



    </div>
  );
};

export default DistributionComponent;
