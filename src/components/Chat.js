import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './Chat.css';
import db from '../firebase';
import Message from './Message';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

function Chat() {
    const { roomId } = useParams();
    const [roomDetails, setRoomDeatils] = useState(null);
    const [roomMessages, setRoomMessages] = useState([]);

    // pulling the channel name from the db
    useEffect(()=> {
        if(roomId) {
            db.collection('rooms').doc(roomId)
            .onSnapshot(docSnapshot => (
                setRoomDeatils(docSnapshot.data())
            ))

            db.collection('rooms').doc(roomId)
            .collection('messages').orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => (
                setRoomMessages(snapshot.docs.map(doc => doc.data()))
            ))
        }
    },[roomId]); // update this code everytime roomId changes

    console.log("room details:", roomDetails);
    console.log("room messages:", roomMessages);


    return (
        <div className="chat">
            {/* Header */}
            <div class="chat_header">
                <ChatHeader channelName={roomDetails?.name}/>
            </div>

            {/* Messages */}
            <div class="chat_body">
                <div class="chat_body_header">
                    <h2>#{roomDetails?.name}</h2>
                    <h3>This is the very beginning of the <strong>#{roomDetails?.name}</strong> channel.</h3>
                </div>

                {
                    roomMessages?.map(({message, senderId, timestamp}) => (
                        <Message message={message} senderId={senderId} timestamp={timestamp}/>
                    ))
                }
            </div>

            {/* CREATE A New MESSAGE IN THE ROOM */}
            <div class="chat_footer">
                <ChatInput channelName={roomDetails?.name} channelId={roomId}/>
            </div>
        </div>
    )
}

export default Chat
