import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import db from '../firebase';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import './DirectMessage.css'
import Message from './Message';
import { useStateValue } from './StateProvider';

function DirectMessage() {
    const { dmRecipientId } = useParams();
    const [{user}] = useStateValue();
    const [dmMessages, setDmMessages] = useState([]);
    const [recipientDetails, setRecipientDetails] = useState(null);

    useEffect(() => {
        if(dmRecipientId) {
            db.collection('users').doc(dmRecipientId).onSnapshot(docSnapshot => {
                setRecipientDetails(docSnapshot.data())
            })
        }
    },[dmRecipientId]);    

    useEffect(() => {
        if(dmRecipientId) {
            db.collection('users').doc(user.userId)
            .collection('directMessages').doc(dmRecipientId)
            .collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
                setDmMessages(snapshot.docs.map(doc => doc.data()))

                //To scroll to the bottom of the page on initializing the app.
                // var body = document.getElementsByClassName("directMessage_body");
                // body.scrollTop = body.scrollHeight;
            });
        }
    },[dmRecipientId, user])

    return (
        <div className="directMessage">
            {/* Header */}
            <div class="directMessage_header">
                <ChatHeader dmRecipientName={recipientDetails?.displayName}/>
            </div>

            {/* Messages */}
            <div className="directMessage_body">
                <div class="dm_body_header">
                    <div class="dm_body_info">
                        <Avatar className="directMessage_body_avatar"
                        src={recipientDetails?.photoUrl} alt={recipientDetails?.displayName}
                        variant="rounded"/>
                        <h3>{recipientDetails?.displayName}</h3>
                    </div>
                    
                    {user.userId !== dmRecipientId ?
                        <h3>
                            This is the very beginning of your direct message history with <strong>{recipientDetails?.displayName}</strong>. Only the two of you are in this conversation, and no one else can join it. Learn More.
                        </h3> : <h3>
                        <strong>This is your space.</strong> Draft messages, list your to-dos, or keep links and files handy. You can also talk to yourself here, but please bear in mind you’ll have to supply both sides of the conversation.
                        </h3>
                    }
                </div>
                
                {
                    dmRecipientId && dmMessages?.map(({message, senderId, timestamp}) => (
                        <Message message={message} senderId={senderId} timestamp={timestamp}/>
                    ))
                }
            </div>
            <div className="directMessage_footer">
                {/* CREATE A New MESSAGE IN THE CHAT */}
                <ChatInput dmRecipientId={dmRecipientId} dmRecipientName={recipientDetails?.displayName}/>
            </div>
        </div>
    )
}

export default DirectMessage
