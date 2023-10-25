import { IonCol, IonContent, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';

import './NumpadComponent.css';
import { useEffect, useRef, useState } from 'react';
import { backspace, checkmarkCircle } from 'ionicons/icons';


interface ContainerProps {
  display?: boolean;
  description?: string;
  maxDecimal?: number;
  value?: number;
  onComplete:Function;
  onChange?:Function;

}


const NumpadComponent: React.FC<ContainerProps> = ({display, value, description, maxDecimal=5, onComplete, onChange=()=>{}}) => {

  const [theNumber, setTheNumber] = useState<number>(value??0);

  function onNumpadClick(i:number) {
    if ( i<10 && String(theNumber).length+1<=maxDecimal ) {
      setTheNumber( prevNumber => {
        onChange(Number(String(prevNumber)+i));
        return Number(String(prevNumber)+i)
      });
    }
    else if ( i == 10 ) {
      setTheNumber( prevNumber => {
        onChange(Math.trunc(prevNumber/10));
        return Math.trunc(prevNumber/10)
      });
    }
    else if ( i == 11 ) onComplete(theNumber);
  }


  useEffect( () => {
    setTheNumber(value??0);
  }, [value]);



  return (
    <div>
      { display? 
        <div className='to-middle'>
          <div className='numpad-display'>
            <div className='numpad-description'>{description??""}</div>
            <div className='numpad-number'>{theNumber}</div>
          </div>
        </div>
        : null
      }
      <div className='to-middle'>
          <IonGrid className='numpad-grid'>
            <IonRow>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(1)}} className='ion-fab-numpad-button' >1</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(2)}} className='ion-fab-numpad-button' >2</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(3)}} className='ion-fab-numpad-button' >3</IonFabButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(4)}} className='ion-fab-numpad-button' >4</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(5)}} className='ion-fab-numpad-button' >5</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(6)}} className='ion-fab-numpad-button' >6</IonFabButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(7)}} className='ion-fab-numpad-button' >7</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(8)}} className='ion-fab-numpad-button' >8</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(9)}} className='ion-fab-numpad-button' >9</IonFabButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(10)}} className='ion-fab-numpad-button' >
                  <IonIcon icon={backspace}/>
                </IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(0)}} className='ion-fab-numpad-button' >0</IonFabButton>
              </IonCol>
              <IonCol>
                <IonFabButton onClick={() => {onNumpadClick(11)}} className='ion-fab-numpad-button' >
                  <IonIcon icon={checkmarkCircle}/>
                </IonFabButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </div>
  );
};

export default NumpadComponent;
