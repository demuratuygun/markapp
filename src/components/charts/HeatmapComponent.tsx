import React from 'react';
import { IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonDatetime, IonModal, IonReorder, IonRippleEffect, IonList, IonReorderGroup
} from '@ionic/react';
import { play, stop, caretUp, caretDown, calendarClear, people } from 'ionicons/icons';
import { useState, useEffect, useCallback, useRef } from 'react';

import * as d3 from 'd3';

import './HeatmapComponent.css';



interface DistributionGraphProps {
  data:number[];
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

let groups:item[] = [{ header: "Bursa FKM Kurs F3", left: "392", selected: true  }]

const HeatmapComponent: React.FC<DistributionGraphProps> = ({ 
  cut, percent, scores, color="#E7C3F380", fill, data
}) => {

  const [datum, setDatum] = useState<[number,number][]>([]);
  const [Yaxis, setYaxis] = useState<number[]>([]);


  const distClipRect = useRef<SVGRectElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Define margins and dimensions
  const width = 740;//340
  const height = 170;
  const margin = { top: 25, right: 10, bottom: 20, left: 10 };
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


  function generateCalendar() {

    let today = new Date();
    today.getFullYear();


  }




  return (
    <div style={{ position: "relative", height: "auto" }}>

      <div style={{ boxShadow: "0px 15px 22px #1d1f1d44", paddingTop: "0px", paddingBottom: "0px", position:"relative",
        borderRadius: "16px", zIndex: 999, backgroundColor: "#3D3D3D77", width: "90%", margin: "5%", overflow:"clip" }}>

        <IonList style={{paddingBottom: "14px", backgroundColor: "#292B2900", zIndex: 999}}>
          <IonReorderGroup disabled={false} >
            { groups.map((group:item, i) => renderItem(group, i+1))}
          </IonReorderGroup>
        </IonList>
      
      <div className='calender-div'>
        {[1,2,3,4,5,6,7,8,9].map((m,mi) => 
        <div className='month-div'>
          <div className='month-num' style={{color:(mi<2? "#6EF4B4":"#9D9D9D")+(60+Math.floor(Math.random()*50))}}>{String(mi+3).padStart(2, "0")}</div>
          {[1,2,3,4,5].map((w,wi) => 
          <div className='week-div'>
            { data.slice(0,7).map((d,i) => {
              let alpha = 16+Math.floor(Math.random()*80);
              return (
                <div className='day-box' style={{
                backgroundColor: (mi<2? "#6EF4B4":"#9D9D9D")+alpha, 
                boxShadow: "-4px 7px 12px #6EF4B4"+(mi<2? alpha:"00")
              }}> </div>
              )
            }
              
            )}
          </div>
          )}
        </div>
        )}
      </div>
      
      </div>

    </div>
  );
};

export default HeatmapComponent;
