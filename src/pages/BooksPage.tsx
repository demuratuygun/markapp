import { IonContent, IonHeader, IonIcon, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TimerComponent from '../components/TimerComponent';
import './BooksPage.css';
import AnswerSheet from '../components/AnswerSheet';
import ListComponent from '../components/ListComponent';
import DistributionComponent from '../components/DistributionComponent';
import { useEffect, useRef } from 'react';
import { alertCircle, arrowRedo, calendarClear } from 'ionicons/icons';



type item = {
  header:string;
  description?:any[];
  right?:string;
  left?:string;
  fixed?:boolean;
  selected?:boolean;
  
  shedule?:Date;
  estimete?:number;

}


const BooksPage: React.FC = () => {
  
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  

  let thelist:item[] = [
    { header: "Fizik Bilimine Giriş", left: "12", right: "12/04", shedule: new Date("10/1/2023, 11:20:00 AM"), estimete: 40, fixed: true, },
    { header: "Madde ve Özellikleri", left: "52", right: "12/04", shedule: new Date("10/1/2023, 12:40:00 AM"),  },
    { header: "Sıvıların Kaldırma Kuvveti", left: "83", right: "12/04", shedule: new Date("10/1/2023, 13:10:00 PM"), fixed: false, selected: false },
    { header: "Basınç", left: "112", right: "12/04", shedule: new Date("10/1/2023, 14:00:00 PM"), fixed: false },
    { header: "Isı, Sıcaklık ve Genleşme", left: "138", right: "12/04", shedule: new Date("10/1/2023, 11:20:00 AM"), estimete: 40, fixed: false,},
    { header: "Hareket ve Kuvvet", left: "182", right: "12/04", shedule: new Date("10/1/2023, 12:40:00 AM"),  },
    { header: "Dinamik", left: "210", right: "12/04", shedule: new Date("10/1/2023, 13:10:00 PM"), fixed: false, selected: false },
    { header: "İş, Güç ve Enerji", left: "243", right: "12/04", shedule: new Date("10/1/2023, 14:00:00 PM"), fixed: false },
    { header: "Elektrik ve Manyetizma", left: "278", right: "12/04", shedule: new Date("10/1/2023, 11:20:00 AM"), estimete: 40, fixed: false,},
    { header: "Elektrostatik", left: "293", right: "12/04", shedule: new Date("10/1/2023, 12:40:00 AM"),  },
    { header: "Dalgalar", left: "327", right: "12/04", shedule: new Date("10/1/2023, 13:10:00 PM"), fixed: false, selected: false },
    { header: "Optik", left: "354", right: "12/04", shedule: new Date("10/1/2023, 14:00:00 PM"), fixed: false },
  ]


  




  return (
    <IonPage>

      <IonContent ref={contentRef} scrollEvents={true} fullscreen>
      
        <DistributionComponent scores={[120, 391, 493]} cut={10} percent={19} color="#F0C5FF" />

        <div className='publisher-header'>Karekok 2023</div>
        <div className='fixed-header book-header-class' onClick={()=>contentRef.current?.scrollToTop(500)}>
          <div>MY Matematik 2</div>
        </div>
        
        <div style={{ width: "100%", height: "24px", padding: "0px 7vw"}} >
          <div style={{ width:"100%", color: '#444444', fontSize: '15px', fontWeight: 'bold', textAlign: "center"}}>
            <div style={{ float:"left", paddingLeft: "1vw" }}>sayfa</div>
            <div style={{ float: "left", paddingLeft: "4vw" }}>konu</div>
            <div style={{ float:"right", }}>son tarih</div>
          </div>
        </div>

        <div style={{width: "100vw", minHeight: "100%", marginTop: "3vh"}}>
          <ListComponent mode="" list={thelist} dateMode />
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default BooksPage;
