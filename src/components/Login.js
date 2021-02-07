import { Button } from '@material-ui/core';
import React from 'react';
import db, { auth, provider } from '../firebase';
import './Login.css';

function Login() {
    
    const handleGoogleSignIn = () => {
        // Google authentification.
        // Really easy
        auth.signInWithPopup(provider)
        .then(result => {
            console.log(result);
            // we do not need to dispatch action(set user) from here. In app.js listener will listen to the auth state changed and dispatch action to the data layer from there.
            // dispatch({
            //     type: actionTypes.SET_USER,
            //     user: result.user
            // })

            // Add User to db collection-USERS only if USER is NEW USER
            if(result.additionalUserInfo?.isNewUser) {
                const {user} = result;
                db.collection('users').doc(user.uid).set({
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                    email: user.email
                });
            }
            
        })
        .catch(error => {
            alert(error.message);
        });
    }

    return (
        <div className="login">
            <div class="login_container">
                <img 
                    src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" 
                    alt="" />
                <h1>Sign in to Nikha's Workspace</h1>
                <p>nikha-workspace.slack.com</p>
                <Button onClick={handleGoogleSignIn}> Sign In with Google</Button>
            </div>
        </div>
    )
}

export default Login;
