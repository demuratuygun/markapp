import './ListCardComponent.css';
import { 
    ItemReorderEventDetail, IonReorderGroup, IonReorder, 
    IonList, IonItem, IonLabel, IonDatetime, IonCard,
    IonGrid, IonRow, IonCol, IonModal, IonActionSheet,
    IonIcon, IonDatetimeButton, IonRippleEffect, IonButton } from '@ionic/react';

import { useState, useEffect, useCallback } from 'react';
import { calendarClear } from 'ionicons/icons';
import "@fontsource/bai-jamjuree";


interface ContainerProps {
  name: string;
  onClicked: Function;
  header: any;
  child: any[];
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

const ListCardComponent: React.FC<ContainerProps> = ({ onClicked, header, child }) => {

  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState(new Date());
  const [headerItem, setHeaderItem] = useState<item>(header);
  const [listItems, setListItems] = useState<item[]>(child);
  
  const [isActionOpen, setIsActionOpen] = useState(false);

  useEffect(() => {
    setHeaderItem( header);
    setListItems(child);

  }, [child, header])
  

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();
  }

  function renderItem( item:item, i:number ) {
    
    return (
      <IonItem mode="md" button={true} key={"carditem-"+i} className={(i>0?'card-item-class':'card-item-header-class')+(item.selected?" card-item-selected":"")} onClick={() => onClicked(i)}>
        <div className='card-item-container'>
          {item.left?
            <div className='card-item-left' >
              <div className='card-item-left-text'>{item.left}</div>
            </div> : null
          }
          <div className='card-item-middle' style={{paddingLeft: item.left?"0px":"5%", paddingRight: "5%"}}>
            <div className='card-header-text' style={i==0?{fontSize: "min( max(16px, 4.6vw), 22px )", fontWeight: 500, color:"#ffffff"}:(item.selected?{color:"#6EF4B4"}:{})}>
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
                <IonModal color="dark" trigger={"card-datetime-button"+i} id={"carddatepicker-modal"+i}>
                  <IonDatetime mode="md"
                    className="datepicker"
                    style={{width: "180px"}}
                    hourCycle="h23"
                    locale="tr-RT"
                    color="leaf"
                    presentation="time"
                    id={"card-datetime-header"+i}
                    value={item.right}
                    onIonChange={(e:any) => {}}
                  />
                  <IonButton color="dark">esnek birak</IonButton>
                </IonModal>
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
  
  return (

    <div style={{ backgroundColor: "#292B29", padding: "5% 0% 7% 0%", margin: "0% 0%" }}>

      {renderItem(headerItem, 0)}
      
    <IonList style={{padding: "0px", backgroundColor: "#292B29"}}>

      <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>

        { listItems.map((item, i) => renderItem(item, i+1))}

        { edit?
        <IonItem button={true} className='itemClass'>
          <IonGrid>
            <IonRow>
              <IonCol className='mainList'>
                <div className='descriptionListText' style={{ fontSize: 20 }}> +etkinlik ekle </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem> : null
        }

      </IonReorderGroup>

    </IonList>

    <IonActionSheet mode="md"
        color="dark"
        isOpen={isActionOpen}
        header="Actions"
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
        onDidDismiss={() => setIsActionOpen(false)}
      ></IonActionSheet>
      </div>
  );
};

export default ListCardComponent;


