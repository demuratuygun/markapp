import './ListComponent.css';
import { 
    ItemReorderEventDetail, IonReorderGroup, IonReorder, 
    IonList, IonItem, IonLabel, IonDatetime, IonFooter, IonToolbar, IonTitle,
    IonGrid, IonRow, IonCol, IonModal, IonActionSheet,
    IonIcon, IonDatetimeButton, IonTabBar, IonButton, IonFabButton, createAnimation, IonRippleEffect } from '@ionic/react';
import type { Animation } from '@ionic/react';

import { useState, useEffect, useCallback, useRef } from 'react';
import { calendarClear, checkmarkCircle, checkmarkDoneCircle, chevronForwardCircle, closeCircle } from 'ionicons/icons';
import "@fontsource/bai-jamjuree";
import ListCardComponent from '../components/ListCardComponent';


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

interface ContainerProps {
  mode:string;
  head?:any;
  list:item[];
  changeDate?:Function;
  onClick?:Function;
  onReorder?:Function;
  dateMode?:boolean;
}

const isTouchDevice = 'ontouchstart' in window;
const ListComponent: React.FC<ContainerProps> = ({ mode, head, list, dateMode, onClick=(i:number,subidx?:number)=>{}, changeDate=()=>{}, onReorder=()=>{} }) => {

  // list adjusments
  const [showHeader, setShowHeader] = useState(false);
  const [listItems, setListItems] = useState<item[]>([]);
  const [expandItem, setExpandItem] = useState(-1);

  // multiple select
  const [pressTime, setPressTime] = useState(-1);
  const [selectedItemNumber, setSelectedItemNumber] = useState(0);
  const [isActionOpen, setIsActionOpen] = useState(false);


  
  useEffect(() => {
    setListItems(list);
    setSelectedItemNumber(list.filter(item=>item.selected??null).length)
  }, [list])






  // Click operations
  function handleButtonRelease(i:number, e:any) {

    if(e.changedTouches[0].pageX > e.view.outerWidth/3 && selectedItemNumber==0) return;
    let holdTime = (new Date).getTime() - pressTime;

    if(holdTime > 600 || selectedItemNumber>0) { // select operations

      if(selectedItemNumber==0) {
        setIsActionOpen(true)
      }

      let value = listItems[i]["selected"];
      setSelectedItemNumber(prev => !value? prev+1 : prev-1);
      setListItems( prevList => {
        prevList[i]["selected"] = !value;
        return [...prevList]
      });
    } else if(holdTime<120) { // onclick navigation operations
      if(!isTouchDevice)
        setTimeout(() => setExpandItem(i), 200)

    }

  }

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    onReorder(event.detail.complete(listItems));
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ;
  }



  return (
    <div>

    { head?
      <IonItem style={{paddingTop: "3vh", paddingLeft: "18px"}}>
        <IonIcon color="light" icon={calendarClear} slot="start" style={{ marginRight: 'min(5vw, 24px)', color: "#eeeeee" }}/>
        <IonLabel style={{ color: '#eeeeee', fontSize: '24px', fontWeight: 'bold' }}>{head?.header}</IonLabel>
      </IonItem> : null
    }

    <IonList mode="md" style={{paddingTop: "0px", paddingBottom: "3vh", margin: "0px"}}>
      
      <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>

        { listItems.map( (item, i) => ( 

          item.child?
        <ListCardComponent name="dd" onClicked={(subidx:number) => onClick(i,subidx)} child={item.child} header={item}/>
        :
        <IonItem button key={"item-"+i} className={'item-class'+(item.selected?" item-selected":"")}
          onClick={() => setTimeout(() => selectedItemNumber>0? null: onClick(i, -1), 200)}
          onTouchStart={() => isTouchDevice? setPressTime((new Date).getTime()):null }
          onTouchEnd={(e) => isTouchDevice? handleButtonRelease(i,e):null }
          onMouseDown={() => isTouchDevice? null:setPressTime((new Date).getTime()) }
          onMouseUp={(e) => isTouchDevice? null:handleButtonRelease(i,e)}>

            <div className='item-container'>
    
            {item.left?
              <div className='item-left'>
                <div className='item-left-text'>{item.left}</div>
              </div> : null
            }
            <div className='item-middle' style={{paddingLeft: item.left?"0px":"5%", paddingRight: "4%"}}>
              <div className='header-text'>{item.header}</div>
              {item.description?.map((description, desI) => 
                <div className='description-text' style={{ marginTop: desI==0?"0.6vw":"" }}>
                  {description.text}
                </div>)
              }
            </div>
            { item.right? 
            ( item.fixed? 
              <div  className='item-right'>
                <div className='item-right-button' id={"datetime-button-"+i}>
                  { item.right }<IonRippleEffect></IonRippleEffect>
                </div>
              <IonModal color="dark" trigger={"datetime-button-"+i} id={"datepicker-modal:"+i}>
                <IonDatetime mode="md"
                  locale="tr-RT" 
                  style={{width: dateMode? "300px":"180px", margin: dateMode? "0px":"00px" }}
                  hourCycle="h23"
                  color="leaf"
                  presentation={dateMode? "date":"time"}
                  id={"datetime-"+i}
                  value={item.right}
                  onIonChange={(e:any) => changeDate(e.detail.value, i)}
                />
                <IonItem button mode="md" color="dark">esnek birak</IonItem>
              </IonModal>
              </div>
              : 
              <IonReorder className='item-right'>
                <div className='item-right-text'>{ item.right }</div>
              </IonReorder>
            ): null 
          }
          
          </div>
        </IonItem>
        )
      )}  
      </IonReorderGroup>


      { mode == "edit"? 
        <IonItem button={true} className='item-class'>
          <IonGrid>
              <IonRow>
                  <IonCol className='mainList'>
                      <div className='descriptionListText' style={{fontSize: 20}}> +etkinlik ekle </div>
                  </IonCol>
              </IonRow>
          </IonGrid>
        </IonItem> : null
        }
    </IonList>

    

    

    <IonActionSheet mode="md"
        color="dark"
        isOpen={isActionOpen}
        buttons={[
          {
            text: 'Delete',
            role: 'destructive',
            data: {
              action: 'delete',
            },
          },
          {
            text: 'Share',
            data: {
              action: 'share',
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]}
        onDidDismiss={({ detail }) => {console.log(detail);setIsActionOpen(false)}}
      ></IonActionSheet>

      
      { false?
      <>
      <IonFabButton className='ion-fab-selected' onClick={ () => {
        setListItems( prevListItems => {
          for( let i=0; i<prevListItems.length; i++ ) 
            if(prevListItems[i]["selected"]) 
            prevListItems[i]["selected"] = false;
          return [...prevListItems]
        })
        setSelectedItemNumber(0);
      }}
        style={{position: "fixed", bottom: "1%", left: "5%", zIndex: 1000}} >
        <IonIcon color='secondary' icon={closeCircle} size="large"></IonIcon>
      </IonFabButton>
      <IonFabButton className='ion-fab-selected' onClick={() => {
        setListItems( prevListItems => {
          for( let i=0; i<prevListItems.length; i++ )
            prevListItems[i]["selected"] = true;
          return [...prevListItems]
        })
        setSelectedItemNumber(listItems.length);
      }}
        style={{position: "fixed", bottom: "1%", left: "calc(7% + 60px)", zIndex: 1000}} >
        <IonIcon color='light' icon={checkmarkDoneCircle} size="large"></IonIcon>
      </IonFabButton>
      <IonFabButton className='ion-fab-selected' onClick={() => setIsActionOpen(true)}
        style={{position: "fixed", bottom: "1%", right: "5%", zIndex: 1000}} >
        <IonIcon color='primary' icon={chevronForwardCircle} size="large"></IonIcon>
      </IonFabButton>
      </>
      :null }
    
    </div>
  );
};

export default ListComponent;
