import './AnswerSheet.css';
import { 
    ItemReorderEventDetail, IonReorderGroup, IonReorder, 
    IonList, IonItem, IonLabel, IonDatetime,
    IonGrid, IonRow, IonCol, IonModal, IonActionSheet,
    IonIcon, IonDatetimeButton, IonCard, IonFabButton } from '@ionic/react';

import { useState, useEffect, useCallback } from 'react';
import { bookmark, bookmarkOutline, checkmarkCircle, backspace } from 'ionicons/icons';
import "@fontsource/bai-jamjuree";


interface ContainerProps {
  mode: string; // edit, answer, answerkey
  page: number;
  results?: boolean;
}

type Question = {
  num?: number;
  persent? : number;
  selected?: string;
  answer?: string;
  page?: number;
  bookmark?: boolean
};

const AnswerSheet: React.FC<ContainerProps> = ({ mode, page, results }) => {
  const [sheetMode, setSheetMode] = useState(mode);
  const [lastPage, setLastPage] = useState(page);
  
  const [focusIndex, setFocusIndex] = useState(mode=="answerkey"?-1:0);
  const [sheetList, setSheetList] = useState<Question[]>([
    {num: 1, persent: 86, answer: "a", page: 235, bookmark: false},
    {num: 2, persent: 61},
    {num: 3, persent: 78},
    {num: 4, persent: 53},
    {num: 5, persent: 69},
    {},
    {num: 6, persent: 69, selected: "", page: 236},
    {num: 7, persent: 61},
    {num: 8, persent: 45},
    {num: 9, persent: 45},
    {},
    {num: 10, persent: 45, page: 237},
    {num: 11, persent: 86, answer: "a", bookmark: false},
    {num: 12, persent: 61},
    {num: 13, persent: 78},
    {num: 14, persent: 53},


  ]);

  function updatefocus(index: number) {
    setFocusIndex(prevFocusIndex => {
      if(sheetList[index+1] && sheetList[index+1].num) return index+1;
      else if(sheetList[index+2]) return index+2;
      else return prevFocusIndex;
    });
  }

  function optionClick(option:string, index: number) {
    if(sheetMode == "answerkey") {
      setSheetList(prevSheetList => {
        prevSheetList[index]["answer"] = option;
        return [...prevSheetList];
      });
    } else {
      setSheetList(prevSheetList => {
          prevSheetList[index]["selected"] = option;
          return [...prevSheetList];
      });
      updatefocus(index);
    }
  }

  function revokeSelect(index: number) {
    if(sheetMode == "answerkey") {
      setSheetList(prevSheetList => {
        prevSheetList[index]["answer"] = prevSheetList[index]["selected"];
        return [...prevSheetList];
      });
    } else {
      setSheetList(prevSheetList => {
          prevSheetList[index]["selected"] = "";
          return [...prevSheetList];
      })
      setFocusIndex(index);
    }
  }

  function popQuestion() {
    setSheetList(prevSheetList => {
      let len = prevSheetList.length;
      if(len == 0 ) return prevSheetList;
      else if(len >=2 && !prevSheetList[len-2].num) return [...prevSheetList.slice(0,len-2)];
      else return [...prevSheetList.slice(0,len-1)];
    });
  }

  function addQuestion(newPage: boolean) {
    let lastQuestionNumber = 1;
    for( let q = sheetList.length-1; q>=0; q--) {
      if( sheetList[q].num ) {
        lastQuestionNumber = sheetList[q].num??1;
        break;
      }
    }
    if(newPage) {
      setSheetList(prevSheetList => {
        return [...prevSheetList, {}, {num: lastQuestionNumber+1, selected: "", page: lastPage+1}]
      })
    } else {
      setSheetList(prevSheetList => {
        return [...prevSheetList, {num: lastQuestionNumber+1, selected: ""}]
      })
    }
  }

  function assignBookmark(index: number, value: boolean) {

    setSheetList(prevSheetList => {
      console.log(prevSheetList[index]["bookmark"])
      prevSheetList[index]["bookmark"] = value;
      return [...prevSheetList];
    })
    if(value) updatefocus(index);
    else setFocusIndex(index);
  }

  useEffect(() => {
    let thepage = lastPage;
    for( let q = sheetList.length-1; q>=0; q--) {
      if( sheetList[q].page ) {
        thepage = sheetList[q].page??lastPage;
        break;
      }
    }
    
    setLastPage(thepage);
  }, [sheetList])
  

  return (
    <div style={{ width: "100%", paddingLeft: "calc(50% - 105px)", position: "relative", height: "auto" }}>
      
      <div className='cardBack'>

          { sheetList.map( (quest, i) => 
          
            (quest.num?
            <div key={"sheet-list-"+i} style={{ width: "100%", height: "40px"}}>
              {results?
                <div className='pageNum' style={{fontWeight: 300, fontSize: "16px"}}>{(quest.persent? "%"+quest.persent: "")}</div>
                :(quest.page?<div className='pageNum'>{quest.page}</div>:null)
              }
              { quest.bookmark?
                  <IonIcon onClick={() => assignBookmark(i, false)} icon={bookmark} className='bookmark'/>:
                (focusIndex==i?
                <IonIcon onClick={() => assignBookmark(i, true)} icon={bookmarkOutline} className='bookmark'/>
                :null)
              }
              <div className='questNum'>{quest.num}</div>
              
              {['a', 'b', 'c', 'd', 'e'].map( opt => 
              <div  key={"sheet-option-"+opt} className='optionWrap'>
                <IonFabButton onClick={() => optionClick(opt, i)} className='ion-fab-option-button'></IonFabButton>
                { quest.selected==opt? 
                  <div className='optionBack' 
                    onClick={() => revokeSelect(i)} 
                    style={sheetMode=="answerkey"? (quest.selected==quest.answer?{backgroundColor: "#D7EEEA"}:{backgroundColor: "#E8f7EE"}): {}}>{opt}</div>
                  :null
                }
                { sheetMode=="answerkey" && quest.answer==opt ?
                  <div className='optionBack' onClick={() => revokeSelect(i)} style={quest.selected==""?{ border: "2px solid #D7EEEA", backgroundColor: "#00000000", color: "#D7EEEA", fontWeight: 900}:{backgroundColor: "#D7EEEA"}}>{opt}</div>
                  :null
                }
              </div>
              )}
            </div>
            :
            <div  key={"sheet-list-"+i} style={{height: "15px", width: "100%"}}></div>
            )
          )}

          { sheetMode == "edit"?
          <>
            <div style={{ width: "100%", height: "40px", marginLeft: "28px"}}>
              <div className='optionWrap'>
                <IonFabButton onClick={() => popQuestion()} className='ion-fab-option-button'>
                  <IonIcon color='light' icon={backspace}/>
                </IonFabButton>
                <IonFabButton 
                  onClick={() => addQuestion(false)}
                  className='ion-fab-option-button' 
                  style={{ width: "154px" }}>
                    <p style={{color: "#ffffff"}}>soru ekle</p>
                </IonFabButton>
              </div>
            </div>
            <div style={{ width: "100%", height: "40px", marginTop: "15px", marginLeft: "28px"}}>
              <div className='pageNum' style={{opacity: 0.5}}>{lastPage+1}</div>
              <IonFabButton 
                onClick={() => addQuestion(true)}
                className='ion-fab-option-button' 
                style={{ width: "194px" }}>
                  <p style={{color: "#ffffff"}}>sonraki sayfa</p>
              </IonFabButton>
            </div>
          </>
          :null}
      </div>
    

    </div>
  );
};

export default AnswerSheet;
