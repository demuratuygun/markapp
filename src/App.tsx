import { Redirect, Route } from 'react-router-dom';
import { useState } from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  createAnimation,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { people, library, bookmark, time } from 'ionicons/icons';
import TimePage from './pages/TimePage';
import MarksPage from './pages/MarksPage';
import BooksPage from './pages/BooksPage';
import GroupPage from './pages/GroupPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import PlaylistPage from './components/playlist/PlaylistComponent';

setupIonicReact();

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('time');

  const slideAnimation = (baseEl: HTMLElement, opts: any) => {
    const enteringAnimation = createAnimation()
      .addElement(opts.enteringEl)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .duration(300)
      .easing('ease-out');
  
    const leavingAnimation = createAnimation()
      .addElement(opts.leavingEl)
      .fromTo('transform', 'translateX(0)', 'translateX(-100%)')
      .duration(300)
      .easing('ease-in');
  
    return createAnimation().addAnimation([enteringAnimation, leavingAnimation]);
  };
  

  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs onIonTabsDidChange={(e) => setSelectedTab(e.detail.tab)}>
        <IonRouterOutlet animation={slideAnimation}>
          <Route exact path="/time">
            <TimePage />
          </Route>
          <Route exact path="/marks">
            <MarksPage />
          </Route>
          <Route path="/books">
            <BooksPage />
          </Route>
          <Route path="/group">
            <GroupPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/time" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar selectedTab="time" mode="md" slot="bottom" style={{padding: "0px 8%"}}>
          <IonTabButton tab="time" href="/time">
            <IonIcon aria-hidden="true" icon={time} />
          </IonTabButton>
          <IonTabButton tab="marks" href="/marks" >
            <IonIcon aria-hidden="true" icon={bookmark} />
          </IonTabButton>
          <IonTabButton tab="books" href="/books">
            <IonIcon aria-hidden="true" icon={library}/>
          </IonTabButton>
          <IonTabButton tab="groups" href="/group">
            <IonIcon aria-hidden="true" icon={people}/>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
)};

export default App;
