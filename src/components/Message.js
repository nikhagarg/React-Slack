import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import db from '../firebase';
import './Message.css';

function Message({message, senderId, timestamp}) {
    const [sender, setSender] = useState(null);
    const msg_time = new Date(timestamp?.toDate()).toUTCString();

    useEffect(() => {
        db.collection('users').doc(senderId).onSnapshot(docSnapshot => {
            setSender(docSnapshot.data())
        })
    },[senderId]);

    console.log("SENDER Of Msg>>",message," IS ", sender);
    return (
        <>
        {sender && (
            <div className="message">
            <Avatar class="message_userImage"
                src={sender?.photoUrl} alt={sender?.displayName}
                variant="rounded"/>
            <div class="message_info">
                <h4 class="message_user_name">
                    {sender?.displayName} 
                    <span className="message_timestamp">{msg_time}</span>
                </h4>
                <p>
                    {message}
                </p>
            </div>
        </div>
        )}
        </>
    )
}

export default Message
