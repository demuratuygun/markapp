import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, createAnimation } from '@ionic/react';
import { useState, useEffect, useCallback, useRef } from 'react';

import TimerComponent from '../components/TimerComponent';
import AnswerSheet from '../components/AnswerSheet';
import type { Animation } from '@ionic/react';
import DistributionComponent from '../components/DistributionComponent';

const GroupPage: React.FC = () => {

  // animations
  const cardEl = useRef<HTMLDivElement | null>(null);
  const animation = useRef<Animation | null>(null);



  return (
    <IonPage>
      <IonContent fullscreen>
        
        
        
      </IonContent>
    </IonPage>
  );
};

export default GroupPage;
