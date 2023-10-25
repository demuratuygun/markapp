import React from 'react';
import { IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel
} from '@ionic/react';
import { play, stop, caretUp, caretDown, calendarClear, people } from 'ionicons/icons';
import { useState, useEffect, useCallback, useRef } from 'react';

import * as d3 from 'd3';

import './DistributionComponent.css';

type RGBColor = { r: number, g: number, b: number };


interface group {
  name: string;
  left: string;
  right?: string;
}

interface DistributionGraphProps {
  data?:[number,number][];
  cut: number;
  percent: number;
  scores: number[];
  color?:string;
  fill?:boolean;
}


const DistributionComponent: React.FC<DistributionGraphProps> = ({ 
  cut, percent, scores, color="#E7C3F380", fill=false,
  data=[
      [1, 0],
      [2, 5],
      [3, 40],
      [4, 18],
      [5, 31],
      [6, 37],
      [7, 37],
      [8, 29],
      [9, 0],

    ]
}) => {

  const [score, setScore] = useState<number | null>(null);
  const distClipRect = useRef<SVGRectElement | null>(null);

  const svgbackRef = useRef<SVGSVGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Define margins and dimensions
  const width = 340;
  const height = 130;
  const margin = { top: 16, right: 10, bottom: 20, left: 10 };
  const innerSVGwidth = width - margin.left - margin.right;
  const innerSVGheight = height - margin.top - margin.bottom;



  function verticalGrid(svgback:any, n:number) {
    let interval = innerSVGwidth/(n-1);
    data.map( (n, i) => {
      console.log(interval*i+margin.right)
      svgback.append('line')
        .attr('x1', interval*i+margin.right)
        .attr('y1', 0)
        .attr('x2', interval*i+margin.right+0.01)
        .attr('y2', height)
        .style('stroke', 'url(#lineGradient)');
    });
  }

  function horizontalGrid(svgback:any, n:number) {
    let interval = innerSVGheight/(n-1);
    for ( let i=0; i<n; i++ ) {
      console.log(interval*i+margin.top)
      svgback.append('line')
        .attr('x1', 0)
        .attr('y1', interval*i+margin.top)
        .attr('x2', width)
        .attr('y2', interval*i+margin.top+1)
        .style('stroke', 'url(#lineGradient)');
    }
  }
  
  useEffect(() => {

    d3.select(svgRef.current).selectAll("*:not(:first-child)").remove();
    d3.select(svgbackRef.current).selectAll("*:not(:first-child)").remove();

    const svg = d3.select(svgRef.current);
    const svgback = d3.select(svgbackRef.current);
    

    // Create scales for x and y axes
    const x = d3.scaleLinear()
      .domain([1, data.length])
      .range([0, innerSVGwidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1]+10) || 0])
      .range([innerSVGheight, 0]);
      
      
    verticalGrid(svgback, 9)
    if(!fill) horizontalGrid(svgback, 4);

    // Create a line generator with cubic Bezier interpolation
    const line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]))
      .curve(d3.curveCatmullRom);


    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const gback = svgback.append('g')
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

      g.append('text')
        .attr('x', innerSVGwidth-57)
        .attr('y', 5)
        .attr('font-size', 26)
        .attr('font-weight', 900)
        .attr('fill', color)
        .text("%"+percent);

      
      g.append('text')
        .attr('x', 0)
        .attr('y', 113)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#ffffff55')
        .text('380');

      g.append('text')
        .attr('x', innerSVGwidth*2/3+13)
        .attr('y', 113)
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('fill', color)
        .text('396');

      g.append('text')
        .attr('x', innerSVGwidth-20)
        .attr('y', 113)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#ffffff55')
        .text('410');

    } else {

      g.append('path')
        .datum(data.slice(0,8))
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 3)
        .attr('clip-path', 'url(#clip)')
        .attr('d', line as any);


      g.append('text')
        .attr('x', innerSVGwidth-20)
        .attr('y', 110)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#ffffff55')
        .text('380');

      g.append('text')
        .attr('x', innerSVGwidth-20)
        .attr('y', 50)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', color)
        .text('396');

      g.append('text')
        .attr('x', innerSVGwidth-20)
        .attr('y', -5)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#ffffff55')
        .text('410');

    }
    


  }, []);










  let groups:group[] = [
    {name: "Bursa Erkek Lisesi 12D", left: "327", right: "%61"},
    {name: "Bursa FKM Kurs F3", left: "392", right: "%46"}

  ]
  
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
      
      <div style={{ 
        background: "radial-gradient(#84EEDB39, #84EEDB16, #84EEDB01, #1D1F1D)", width: "130vw", height: "130vw", 
        borderRadius: "50%", position: "absolute", top: "-36vw", right: "-30vw", zIndex: 10 }}>
      </div>

      <div style={{ boxShadow: "0px 15px 22px #1d1f1d44", paddingBottom: "14px", borderRadius: "16px", zIndex: 100,
        backgroundColor: "#ffffff10", width: "90%", margin: "5%", paddingTop: "calc(25vw + 40px)", }}>
        
        <svg ref={svgbackRef} className='svg-frame' viewBox={"0 0 "+width+" "+height}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="100%" x2="1%" y2="0%">
              <stop offset="0%" style={{stopColor: "#ffffff11"}} />
              <stop offset="50%" style={{stopColor: "#ffffff88", }} />
              <stop offset="100%" style={{stopColor: "#ffffff11", }} />
            </linearGradient>
          </defs>
        </svg>

        <svg ref={svgRef} className='svg-frame' viewBox={"0 0 "+width+" "+height}>
          <defs>
            <clipPath id="clip">
              <rect ref={distClipRect} x="40px" y="0" width={width} height={height}/>
            </clipPath>
          </defs>
        </svg>

        <IonGrid style={{ padding: "18px 20px 2px 20px" }}>
          <IonRow>
            <IonCol size="auto" className='card-start-page' style={{marginLeft: 0, fontSize: "min(max(13px, 4vw), 18px)", fontWeight: "600", color: "#BDBDBD44"}}>puan</IonCol>
            <IonCol className='card-start-page' style={{marginLeft: 0, fontSize: "min(max(13px, 4vw), 18px)", fontWeight: "600", color: "#BDBDBD44", textAlign: "left", paddingLeft: "4%"}}> grup</IonCol>
            <IonCol size="auto" className='card-start-page' style={{marginLeft: 0, fontSize: "min(max(13px, 4vw), 18px)", fontWeight: "600", color: "#BDBDBD44"}}>biten</IonCol>
          </IonRow>
        </IonGrid>

        { groups.map( group => 
          <IonItem key={"distibution-graph-group-"+group.name} mode="md" button className='item-graph-class'>
            <IonGrid>
              <IonRow>
                <IonCol size="auto" className='card-start-page' style={{marginLeft: 0}}>{group.left}</IonCol>
                <IonCol className='main-card-list'>
                  <div className='main-card-list-text' style={{ fontSize: "min(max(14px, 4.2vw), 20px)", fontWeight: "600", color: "#BDBDBD" }}>
                    {group.name}
                  </div>
                </IonCol>
                <IonCol size="auto" className='card-start-page' style={{marginLeft: 0}}>{group.right??null}</IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        )}

      </div>


      
    </div>
  );
};

export default DistributionComponent;
