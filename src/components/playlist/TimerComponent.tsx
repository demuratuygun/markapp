import React, { useRef } from 'react';
import { IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonModal, IonDatetime, IonButton, IonPicker
} from '@ionic/react';
import { play, pause, closeCircle, pauseCircle, playCircle, stopCircle } from 'ionicons/icons';
import { useState, useEffect, useCallback } from 'react';

import './TimerComponent.css';
import NumpadComponent from '../NumpadComponent';



interface ContainerProps {
  completed?:number;
  pickTime:Function;
  onComplete?:Function;

}

let countInterval: NodeJS.Timer | null = null;
const TimerComponent: React.FC<ContainerProps> = ({completed=0, pickTime, onComplete=()=>{}}) => {

  const [timer, setTimer] = useState(completed);
  const [playing, setPlaying] = useState<number>(0);
  const [timePassed, setTimePassed] = useState<number>(0);
  const [numpadOpen, setNumpadOpen] = useState<boolean>(false);

  let int = Math.trunc;
  const playingRef = useRef(playing);
  const timePassedRef = useRef(timePassed);


  useEffect(() => {
    playingRef.current = playing;
    timePassedRef.current = timePassed;

    if( playing > 0 ) {
      countInterval = setInterval(() => setTimer(timePassed + int(((new Date()).getTime()-playing)/1000)), 1000);
    }
  }, [playing]);

  const handleVisibilityChange = useCallback(() => {
      if( playingRef.current == 0 ) return;
      if (document.hidden) {
        if( countInterval ) { 
          clearInterval(countInterval);
          countInterval = null;
        }
      } else 
        countInterval = setInterval(() => setTimer(timePassedRef.current + int(((new Date()).getTime()-playingRef.current)/1000)), 1000);
      
    }, []);

  useEffect(() => {
    setTimePassed(completed);
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (countInterval) clearInterval(countInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [])

  useEffect(() => {

    console.log(completed);
    setTimer(completed);
    setTimePassed(completed);

  }, [completed]);

  function onPick() {
    if(playing>0) { 
      setTimePassed(prevTime => prevTime+int(((new Date()).getTime()-playing)/1000));
      if( countInterval ) { 
        clearInterval(countInterval);
        countInterval = null;
      }
      setPlaying( 0 );
    }
    setNumpadOpen(prevNum=>!prevNum);

  }
  
  function pausePlay(play:boolean) {
    if(play) {
      setPlaying( (new Date()).getTime() );
    } else {
      setTimePassed(prevTime => prevTime+int(((new Date()).getTime()-playing)/1000));
      if( countInterval ) { 
        clearInterval(countInterval);
        countInterval = null;
      }
      setPlaying( 0 );
    }
  }
  


  return (

    <div style={{margin: "0%", backgroundColor: "#67590"}}>
      <IonGrid>

        <IonRow className='timer' style={{ textAlign: "center", width: "100%", padding:0 }}>
          <IonCol style={{display: "flex", justifyContent: "center"}}>
            <div className='timer-container'  onClick={() => onPick()}>
              { Math.floor(timer/6000)>0? 
                <div className='num-box'>{Math.floor(timer/6000)%10}</div> : null }
              <div className='num-box'>{Math.floor(timer/600)%10}</div>
              <div className='num-box'>{`${Math.floor(timer/60)%10}`}</div>
              <div style={{ width: "52px", float: "left"}}>
                <div className='num-box-second'>{timer%10}</div>
                <div className='num-box-second'>{int((timer % 60)/10)}</div>
              </div>
            </div>
            <div className='ion-fab-button play' style={{margin: "1px 0px 0px 40px", display: numpadOpen? "none":"block" }} onClick={() => pausePlay(!playing)}>
              <IonIcon color='light' style={{transform: playing?"scaleX(1.3)":"", fontSize: "32px"}} icon={playing? pause : play}></IonIcon>
            </div>
          </IonCol>
        </IonRow>

        
        { numpadOpen?
          <IonRow style={{marginBottom: "12px"}}>
            <IonCol >
              <NumpadComponent 
                  value={Math.trunc(timer/60)} maxDecimal={3}
                  onChange={(i:number) => {setTimer(i*60);setTimePassed(i*60);}} 
                  onComplete={(i:number) => setNumpadOpen(false)} 
                />
            </IonCol>
          </IonRow>
          : null
        }
        
        
      </IonGrid>
    </div>
  );
};

export default TimerComponent;


/*

const workerRef = useRef<Worker>(new Worker(new URL('../workers/timer.worker.ts', import.meta.url)));

<div>{`${String(Math.floor(timer/60)).padStart(2,'0')}`}</div>
  <div style={{gridColumn: 2}}>:</div>
<div>{`${String(timer % 60).padStart(2,'0')}`}</div>

workerRef.current.postMessage({name:"set", amount:completed});


<IonPicker trigger="timer-display" className='timer-picker' onWillPresent={()=>pausePlay(false)}
  columns={[
    { name: 'dakika', options: minutes.map(i => ({text: i, value: i,})), selectedIndex: timer/60 },
    { name: 'saniye', options: seconds.map(i => ({text: i, value: i,})), selectedIndex: (timer%60)/5 }
  ]}
  buttons={[
    { text: 'sıfırla', cssClass: "button-left", handler: (value) => onPick("00","00")},
    { text: 'iptal', role: 'cancel' },
    { text: 'tamam', handler: (value) => onPick(value.dakika.text, value.saniye.text)}
  ]}
/>

*/