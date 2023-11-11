import './BookListComponent.css';
import { 
    ItemReorderEventDetail, IonReorderGroup, IonReorder, 
    IonList, IonItem, IonLabel, IonDatetime, IonFooter, IonToolbar, IonTitle,
    IonGrid, IonRow, IonCol, IonModal, IonActionSheet,
    IonIcon, IonDatetimeButton, IonTabBar, IonButton, IonFabButton, createAnimation, IonRippleEffect, IonAccordion, IonAccordionGroup, IonImg, IonItemSliding, IonItemOptions, IonItemOption, IonProgressBar } from '@ionic/react';
import type { Animation } from '@ionic/react';

import { useState, useEffect, useCallback, useRef } from 'react';
import { archive, calendarClear, checkmarkCircle, checkmarkDoneCircle, chevronForwardCircle, closeCircle, heart, trash } from 'ionicons/icons';
import "@fontsource/bai-jamjuree";

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


type bookCover = {
  name:string;
  publish:string;
  type:string;
  imageURL:string;

}



const BookListComponent: React.FC<ContainerProps> = ({ mode, head, list, dateMode, onClick=(i:number,subidx?:number)=>{}, changeDate=()=>{}, onReorder=()=>{} }) => {

  // list adjusments
  const [showHeader, setShowHeader] = useState(false);
  const [bookList, setBookList] = useState<bookCover[]>([]);
  const [expandItem, setExpandItem] = useState(-1);

  // multiple select
  const [pressTime, setPressTime] = useState(-1);
  const [selectedItemNumber, setSelectedItemNumber] = useState(0);
  const [isActionOpen, setIsActionOpen] = useState(false);


  useEffect(() => {
    setBookList( [
      {publish:"Karekok 2021", name:"MY Matematik 1", type:"TYT AYT SAY MAT SORU", imageURL:"https://i.ibb.co/Nn2QpJv/image-9.png"},
      {publish:"Karekok 2021", name:"MY Matematik 1", type:"TYT AYT SAY MAT SORU", imageURL:"https://i.ibb.co/WVMrnL0/image-10.png"},
      {publish:"Karekok 2021", name:"MY Matematik 1", type:"TYT AYT SAY MAT SORU", imageURL:"https://i.ibb.co/Nn2QpJv/image-9.png"},
      {publish:"Karekok 2021", name:"MY Matematik 1", type:"TYT AYT SAY MAT SORU", imageURL:"https://i.ibb.co/WVMrnL0/image-10.png"},
    ] );

  }, []);

  
  
  const handleSlide = async (event:any) => {
    if( event.detail.amount > 60 ) {
      console.log("switch place");
    } 
  };



  return (
    <>

    <IonList mode="md" style={{paddingTop: "0px", paddingBottom: "3vh", margin: "0px"}}>
      

      
      {bookList.map((book, i) =>
        <IonItemSliding onIonDrag={(event) => handleSlide(event)}>

          <IonItem button={true} className='cover-item' onClick={()=> onClick(i, 0)}>
            <IonImg className='book-cover-image' src={book.imageURL} alt={book.name} />
            <div className='book-text-container'>
              <div className='book-subtext'> %43  23dk </div>
              <div className='book-text'> TYT Kamp Sorubankasi </div>
              <div className='book-subtext'> 134-139 Trigonometri  </div>
            </div>
          </IonItem>

          <IonItemOptions side="start"></IonItemOptions>
          <IonItemOptions side="end"></IonItemOptions>

        </IonItemSliding>
      )}

    </IonList>

    

    

    <IonActionSheet mode="md" color="dark"
        onDidDismiss={({ detail }) => {console.log(detail);setIsActionOpen(false)}}
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
            text: 'birden cok sec',
            data: {
              action: 'share',
            },
          },
          {
            text: 'tarih saat degistir',
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
      />

    </>
  );
};

export default BookListComponent;
