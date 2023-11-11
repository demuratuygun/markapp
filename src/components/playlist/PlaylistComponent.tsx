import { IonAccordion, IonAccordionGroup, IonCard, IonCol, IonContent, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonRange, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/react';

import ListComponent from '../ListComponent';
import TimerComponent from './TimerComponent';
import { useEffect, useRef, useState } from 'react';
import {  closeOutline, playSkipForward, playSkipBack } from 'ionicons/icons';
import AnswerSheet from './AnswerSheet';

interface ContainerProps {
  exit: Function;
}

type item = {
  header:string;
  description?:any[];
  right?:string;
  left?:string;
  fixed?:boolean;
  selected?:boolean;
  child?:item[];
  shedule:Date;
  duration:number;
  divider?:boolean;
}



const PlaylistPage: React.FC<ContainerProps> = ({ exit }) => {

  const toPlaylistPage = useRef<HTMLIonRouterLinkElement>(null!);
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const [tasks, setTasks] = useState<item[]>([]);
  const [playlist, setPlaylist] = useState<item[]>([]);
  const [timer, setTimer] = useState<number>(0);
  
  

  useEffect(() => {

    // api call for daily tasks if not exisits in local
    setTasks([
      { header: "MY Matematik 2", description: [{text:"Trigonometri, 134-139"},{text:"Yol Problemleri, 140-152"}], shedule: new Date("10/16/2023, 11:20:00 AM"), duration: 40,  selected: false},
      { header: "Acil Fizik Fasikul", description: [{text:"Periyodik Problemler, 134-139"}], shedule: new Date("10/16/2023, 13:10:00 PM"), duration: 20,  },
      { header: "Limit Paragraf Sorubankasi", description: [{text:"Cumlede Anlam, 134-153"}], shedule: new Date("10/16/2023, 14:00:00 PM"), duration: 296,  },
      
    ]);

    //updateTime();
    durationText();

  }, []);

  
  function onItemClick(i:number, sub?:number) {
    
    setPlaylist(updateTime([
        { left: "129", header: "Test 1 kolay", shedule: new Date("10/1/2023, 11:20:00 AM"), duration: 18, fixed: true },
        { left: "132", header: "Test 2 kolay", shedule: new Date("10/1/2023, 12:40:00 AM"), duration: 14 },
        { left: "134", header: "Test 3 orta", shedule: new Date("10/1/2023, 13:10:00 PM"), duration: 17 },
        { left: "139", header: "Test 4 zor", shedule: new Date("10/1/2023, 14:00:00 PM"), duration: 12 },
        { left: "142", header: "Test 5 zor", shedule: new Date("10/1/2023, 14:00:00 PM"), duration: 14 },
      ]));
    
    //setTimer(0);
    toPlaylistPage.current.click();


  }
  

  // converts duration to right text on tasks list
  function durationText() {
    setTasks( prevTasks => {
      for(let i=0; i<prevTasks.length; i++) {
        let e = prevTasks[i].duration;
        if(e>199) prevTasks[i].right = Math.ceil(e/60)+"sa";
        else prevTasks[i].right = e+"dk";
      }
      return [...prevTasks];
    })
  }

  function updateTime(list:item[]) {
    let now = (new Date()).getTime();
    let time = new Date();

    for( let i=0; i<list.length; i++ ) {
      if(list[i].shedule.getTime() < now) {
        list[i].fixed = false;
      }
      if( list[i].fixed ) {
        time = list[i].shedule;
        list[i].right = time.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      else {
        list[i].shedule = new Date(time);
        list[i].right = time.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit', hour12: false });
      } 
      time.setTime(time.getTime() + list[i].duration*60000);
    }
    return list;
  }

  function changeDate(t:string, i:number) {
    console.log(t, i);
    setTasks( prevList => {
      prevList[i].right = t;
      let shedule = prevList[i].shedule;
      shedule.setHours(parseInt(t.split(":")[0]))
      shedule.setMinutes(parseInt(t.split(":")[1]))
      console.log(prevList);
      return prevList;
    });
    //updateTime();
  }

  function changeOrder(neworder:any[]) {
    setTasks(neworder);
    //updateTime();
  }


  return (
    <IonPage>
      
      <IonContent ref={contentRef} scrollEvents={true}>

        <div style={{ overflowY: "scroll", width:"100vw", height: "100%", position: "relative" }}>

        <IonIcon icon={closeOutline} onClick={()=> exit()} 
          style={{ position: "absolute", top: "4%", right: "8%", fontSize: "32px", color: "#505050", zIndex: 1000 }} 
        ></IonIcon>
          
          <ListComponent mode="" dateMode changeDate={changeDate} onClick={onItemClick} onReorder={changeOrder}
            list={[
              { header: "MY Matematik 2", description: [{text: "Trigonometri, 132-141"}], selected: false, child: [
                { left: "129", header: "Test 1 kolay", right: "04:50", shedule: new Date("10/1/2023, 11:20:00 AM"), duration: 18, fixed: true },
                { left: "132", header: "Test 2 kolay", right: "04:50", shedule: new Date("10/1/2023, 12:40:00 AM"), duration: 14, selected: true },
                { left: "134", header: "Test 3 orta", right: "04:50", shedule: new Date("10/1/2023, 13:10:00 PM"), duration: 17 },
                { left: "139", header: "Test 4 zor", right: "04:50", shedule: new Date("10/1/2023, 14:00:00 PM"), duration: 12 },
                { left: "142", header: "Test 5 zor", right: "04:50", shedule: new Date("10/1/2023, 14:00:00 PM"), duration: 14 }
              ]},
            ]}
          />

          <div onClick={()=> contentRef.current?.scrollToTop(500)} className='fixed-header'
            style={{margin: "45px 0px 20px 0px", zIndex:999, backgroundColor: "#1D1F1Daa", backdropFilter: "blur(5px)"}}>
            <TimerComponent completed={timer} onComplete={()=>{}} pickTime={(t:number)=> setTimer(t)}/>
          </div>
          
          <div style={{marginTop: "16%", marginBottom: "16%"}}>
            <AnswerSheet page={132} mode="answer"></AnswerSheet>
          </div>
          
          <div style={{ width: "100%", height: "80px"}}>
            <IonIcon icon={playSkipForward} onClick={()=> {setTimer(-1);}}
              style={{ float: "right", padding: "20px", paddingRight: "30px", fontSize: "32px", color: "#444444" }} 
            />
            <IonIcon icon={playSkipBack} onClick={()=> {setTimer(-1);}}
              style={{ float: "left", padding: "20px", paddingLeft: "30px", fontSize: "32px", color: "#444444" }} 
            />
            <div style={{ float: "right", padding: "20px", paddingRight: "0px", fontSize: "24px", color: "#555555"  }}>sonraki test</div>
            
          </div>


        </div>
        </IonContent>


    </IonPage>
  );
};

export default PlaylistPage;
