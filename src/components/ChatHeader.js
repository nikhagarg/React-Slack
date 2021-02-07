import React from 'react'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import InfoIcon from '@material-ui/icons/Info';
import './ChatHeader.css';

function ChatHeader({channelName, dmRecipientName}) {
    return (
        <div className="chatHeader">
            <div class="chat_header_left">
                <h4 className="chat_header_channelName">
                    {channelName? (
                        <strong># {channelName}</strong>
                    ):(
                        <strong> {dmRecipientName}</strong>
                    )}
                    <StarBorderIcon/>
                </h4>
            </div>


            <div class="chat_header_right">
                <p><InfoIcon/> Details</p>
            </div>
        </div>
    )
}

export default ChatHeader
