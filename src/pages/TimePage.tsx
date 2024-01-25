import { IonAccordion, IonAccordionGroup, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonRange, IonRippleEffect, IonRouterLink, IonRow, IonTitle, IonToolbar, ScrollDetail } from '@ionic/react';

import CalendarComponent from '../components/CalendarComponent';
import ListComponent from '../components/ListComponent';
import TimerComponent from '../components/playlist/TimerComponent';
import './TimePage.css';
import { useEffect, useRef, useState } from 'react';
import { arrowBackOutline, closeOutline, playSkipForward, playSkipBack, add, construct } from 'ionicons/icons';
import AnswerSheet from '../components/playlist/AnswerSheet';
import DistributionComponent from '../components/charts/DistributionComponent';

import { useHistory } from 'react-router';
import { AnimationBuilder, createAnimation } from '@ionic/react';
import BookListComponent from '../components/BookListComponent';
import PlaylistPage from '../components/playlist/PlaylistComponent';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { motion, useScroll, useTransform } from "framer-motion";

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



const TimePage: React.FC = () => {

  const toPlaylistPage = useRef<HTMLIonRouterLinkElement>(null!);

  const [tasks, setTasks] = useState<item[]>([]);
  const [playlist, setPlaylist] = useState<item[]>([]);

  const [expandedItem, setExpandedItem] = useState(-1);
  const [calenderExpanded, setCalenderExpanded] = useState(false);
  const [sackOpen, setSackOpen] = useState(false);

  const [timer, setTimer] = useState<number>(0);
  const [condanseHeader, setCondanseHeader] = useState<boolean>(false);


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
    
    setExpandedItem(i);


  }
  const contentRef = useRef<HTMLIonContentElement | null>(null);

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

  function handleScroll(ev: CustomEvent<ScrollDetail>) {
    setCondanseHeader(ev.detail.scrollTop < 10 ? false : true );
  }

  function handleSlide(index:number) {
    console.log(
      `Slider Changed to: ${index + 1}`
    );
  }



  return (
    <IonPage>
      
      <IonHeader>
        <motion.div className='timeHeaderBar'>
          <div style={{float:"left", fontWeight: "bold"}}>02 Şubat</div>
          <div style={{float:"right" }} onClick={()=>setSackOpen(true)}>hafta 37</div>  
          {condanseHeader?null:<><br/><div style={{float:"left", color: "#606060" }}> 271 dk </div></>}
        </motion.div>
      </IonHeader>

      <IonContent fullscreen scrollEvents={true} onIonScroll={handleScroll}>

        <div style={{ paddingTop: "12vh" }}></div>
        
        {/* 
        <div style={{backgroundColor: "#333333"}} className={calenderExpanded?'fixed-header':''} >
          <CalendarComponent expanded={(is:boolean)=>setCalenderExpanded(is)} />
        </div>
         */}

        <Slider dots={false} infinite={false} afterChange={handleSlide}>

        <div style={{ marginTop: "3vh", height:"100vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        <div style={{ marginTop: "3vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        <div style={{ marginTop: "3vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        <div style={{ marginTop: "3vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        <div style={{ marginTop: "3vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        <div style={{ marginTop: "3vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        <div style={{ marginTop: "3vh" }}>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}
          />
        </div>

        </Slider>

          

      </IonContent>


      <IonModal isOpen={sackOpen} onIonModalDidDismiss={()=>setSackOpen(false)} initialBreakpoint={0.9} breakpoints={[ 0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.9]}>
        <IonContent>
          <div className='sack-header'>hafta 37</div>
          <BookListComponent mode="" list={tasks} 
            changeDate={changeDate}
            onClick={onItemClick}
            onReorder={changeOrder}/>
        </IonContent>
      </IonModal>

      <IonModal isOpen={expandedItem>=0} >
        <PlaylistPage exit={()=> setExpandedItem(-1)}/>
      </IonModal>


    </IonPage>
  );
};

export default TimePage;
