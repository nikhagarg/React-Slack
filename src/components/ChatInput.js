import React, { useEffect, useState } from 'react';
import './ChatInput.css';
import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import db, { timestamp } from '../firebase';
import { useStateValue } from './StateProvider';

function ChatInput({channelName, channelId, dmRecipientId, dmRecipientName}) {
    const [input, setInput] = useState('');
    const [{user}] = useStateValue();

    const handleMessageSend = (event) => {
        event.preventDefault();
        // Add the message to the db
        const messageInput = {
            senderId: user?.userId,
            timestamp: timestamp,
            message: input,
        }

        if(channelId) {
            db.collection('rooms').doc(channelId).collection('messages').add(messageInput);
        } else if(dmRecipientId) {
            // SHOULD BE AVAILABLE IN USER's DM
            db.collection('users').doc(user.userId)
            .collection('directMessages').doc(dmRecipientId)
            .collection('messages').add(messageInput);
            
            // SHOULD ALSO BE AVAIALABLE IN RECIPIENT's DM
            // Not if user is dming himself- will Duplicate the msges
            if(user.userId !== dmRecipientId) {
                db.collection('users').doc(dmRecipientId)
                .collection('directMessages').doc(user.userId)
                .collection('messages').add(messageInput);
            }
        }
        setInput('');    
    }

    function capitalise(input) {
        return input?.toUpperCase();
    }

    return (
        <div className="chatInput">
            <form>
                <input value={input}
                    placeholder={ channelId ?    
                        `Message #${channelName}` :   
                        `${user.userId!==dmRecipientId ? `Message ${capitalise(dmRecipientName)}`: 'Jot something down'}`
                    }
                    onChange = {(event) => setInput(event.target.value)}    
                />
                <IconButton onClick={handleMessageSend} type="submit">
                    <SendIcon/>
                </IconButton>
            </form>
        </div>
    )
}

export default ChatInput
