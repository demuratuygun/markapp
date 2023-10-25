import './CalendarComponent.css';
import { 
  IonGrid, IonRow, IonCol, IonRefresher, IonRefresherContent, RefresherEventDetail,
  IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonItem, IonText, IonContent
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { calendarClear, caretDown } from 'ionicons/icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/effect-fade';

interface ContainerProps {
  expanded:Function;

}

type Day = {
  date: Date;
  load: number;
};

const CalendarComponent: React.FC<ContainerProps> = ({ expanded }) => {

  const [calendarView, setCalendarView] = useState("week")
  const [focusMonth, setFocusMonth] = useState(new Date())
  const [focusDate, setFocusDate] = useState(new Date())

  const [weekIndex, setWeekIndex] = useState(0)
  const [calendar, setCalendar] = useState<Day[][]>([[]]);
  const [monthList, setMonthList] = useState([new Date()])

    function onMonthChange( date: Date ) {
      
      let theMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      theMonth.setMonth( theMonth.getMonth() -1 )
      
      let monthList = []
      for(let i=0; i<6; i++) {
        monthList.push( new Date(theMonth) )
        theMonth.setMonth( theMonth.getMonth() +1 )
      }
      
      setMonthList(monthList)
    }

    function generateMonth(date:Date): Day[][] {

      let thedate = new Date(date.getFullYear(), date.getMonth(), 1);
      thedate.setDate(thedate.getDate() - ((thedate.getDay()+6)%7));
      
      // Initialize the calendar and the current day
      let theMonth: Day[][] = [];
      let week: Day[] = [];

      let lastday = new Date(date.getFullYear(), date.getMonth(), 1);
      lastday.setMonth(lastday.getMonth()+1)
      while( thedate.getTime() < lastday.getTime() || (thedate.getDay()+6)%7 != 0 ) {
        
        week.push({date: new Date(thedate), load: Math.max(0.05, Math.random())})
        
        if( (thedate.getDay()+6)%7 == 6 ) {
          theMonth.push(week);
          week = [];
        }
        thedate.setDate(thedate.getDate()+1);
      }
      return theMonth;
    }

    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {

      setCalendarView( prevWeekList => {
        expanded(prevWeekList=="calendar");
        return prevWeekList=="week"? "calendar": "week";
      });
      
      setTimeout(() => {
        // Any calls to load data go here
        event.detail.complete();
      }, 0);
    }

    useEffect(() => {
      
      let newcal = generateMonth(focusMonth)
      setCalendar(newcal);
      onMonthChange(focusMonth);
      
      let today = new Date()
      if( focusMonth.getFullYear() == today.getFullYear() && focusMonth.getMonth() == today.getMonth() ) {
        let thedate = new Date(today.getFullYear(), today.getMonth(), 1);
        let position = ((thedate.getDay()+6)%7) + today.getDate() -1
        setWeekIndex( Math.floor(position/7) )
      } else setWeekIndex(0);
      
      
    }, [focusMonth]);


  return (
    <>

      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <IonGrid className='calendarGrid' style={{ padding: calendarView=="week"?"8px 11%":"2% 8% 10% 8%", margin: calendarView=="week"?"0px":'3%' }}>
  
        <IonIcon color="light" icon={calendarClear} slot="start" style={{ marginRight: 'min(5vw, 24px)', color: "#eeeeee" }}/>

        { calendarView=="week"? <></>: 
           <IonRow style={{ margin: "5px 0px 10px 0px", fontSize: "19px", color: "#ffffff33", fontWeight: "lighter", textAlign: "center"}}>
            <IonCol className='months'>
              { monthList.map((m, i) =>
                <div key={"month"+i} className='month disable-select' 
                  onClick={() => {if(i!=1) setFocusMonth(m)} }
                  style={i==1?{color: "#ffffff99", fontWeight: "bold"}:{}}>
                    <strong>{(m.getMonth()==0? m.getFullYear()+" ": "")}</strong>
                    {m.toLocaleString('tr-TR', { month: 'long' })}
                </div>
              )}
            </IonCol>
          </IonRow>
        }
        {( calendarView=="week"? [calendar[weekIndex]]: calendar ).map((week, index) => 
          <IonRow key={"week"+index} style={{paddingTop: "5px", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
            {week?.map((d, i) => 
              <IonCol key={"day"+i} className='disable-select' style={d.date.getMonth()!=focusMonth.getMonth() && (calendarView=="calendar")? {color: "#444444", fontWeight: "lighter"}: 
                (focusDate.toLocaleString('en-EN').split(",")[0] == d.date.toLocaleString('en-EN').split(",")[0] ? { color: "#6EF4B4", fontWeight: "bold" }: {color: "#777777"})}>
                <div style={{zIndex: 1000, opacity: d.load+0.4}}>{d.date.getDate()}</div>
                <div className='timeline' style={{}}></div>
              </IonCol> )}
          </IonRow>
        )}
      </IonGrid>

    </>
  );
};

export default CalendarComponent;
