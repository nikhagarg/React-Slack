import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Chat from './components/Chat';
import Login from './components/Login';
import { useStateValue } from './components/StateProvider';
import { useEffect } from 'react';
import db, { auth } from './firebase';
import { actionTypes } from './components/Reducer';
import Thread from './components/Thread';
import DirectMessage from './components/DirectMessage';

function App() {
  const [{user}, dispatch] = useStateValue();

  // IN ORDER TO SURVIVE REFRESH. DISPATCH SET USER ACTION FROM HERE IF AUTH USER IS PRESENT.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        console.log("AUTH USER>>>>>", authUser);
        //this survives refresh.
        // if you login and refresh, it uses cookie tracking and see that you are still logged in.
        // this is persistent. data layer state-user is not. this keeps you logged in.

        // SINCE ALL NEW USERS ALREADY EXISTS IN THE DATABASE, FETCH THE USER DETAILS FROM THERE AND SEND IT TO DATA LAYER
        // ONLY GET THE UID FROM HERE. 
        db.collection('users').doc(authUser.uid).onSnapshot(docSnapshot => {
          const loggedInUser = docSnapshot.data();
          if(loggedInUser) {
            dispatch({
              type: actionTypes.SET_USER,
              user: {
                photoUrl: loggedInUser.photoUrl,
                displayName: loggedInUser.displayName,
                email: loggedInUser.email,
                userId: authUser.uid,
              }
            });
          }
        });
        
      } else {
        // used is logged out
        dispatch({
          type: actionTypes.SET_USER,
          user: null
        });
      }
    })
    return () => {
      // if useEffect fires again, perform some clean up actions before you refire
      unsubscribe();
    }
  },[]);

  return (
    <div className="App">
      <Router>
      {!user? (
          <Login/>
      ):(
        <>
        {/* Header */}
        <Header/>

        <div class="app_body">
          {/* Sidebar */}
          <Sidebar/>
          
          {/* React Router - to switch b/w chats */}
          <Switch>
            {/* For CHANNELS */}
            <Route path="/room/:roomId">
              {/* CHAT */}
              <Chat/>
            </Route>

            {/* For DMS */}
            <Route path="/dm/:dmRecipientId">
              <DirectMessage/>
            </Route>

              {/* Default Route */}
            <Route path="/">
              <Thread/>
            </Route>
          </Switch>

        </div>
        </>
      )}

      </Router>
    </div>
  );
}

export default App;
