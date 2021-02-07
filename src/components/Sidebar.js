import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import SidebarOption from "./SidebarOption";
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import db from '../firebase';
import { useStateValue } from './StateProvider';

function Sidebar() {
    const [{user}] = useStateValue();
    const [channels, setChannels] = useState([]);
    const [channelsExpanded, setChannelsExpanded] = useState(true);
    const [dms, setDms] = useState([]);
    const [dmsExpanded, setDmsExpanded] = useState(true);

    // run this code once when the component loads.  
    useEffect(() => {
        // get all the channels(rooms).
        db.collection('rooms').onSnapshot((snapshot) => (
            setChannels(snapshot.docs.map(doc => ({
                id: doc.id,
                channelName: doc.data().name
            })))
        ));

        // get all the users for the DMs section
        db.collection('users').onSnapshot((snapshot) => {
            setDms(snapshot.docs.map(doc => ({
                receiverId: doc.id,
                receiverName: doc.data().displayName,
                receiverImg: doc.data().photoUrl
            })))
        });

    },[]);

    return (
        <div className="sidebar">
            {/* Where we show the workspace name & online status & new msg icon */}
            <div class="sidebar_header">
                <div class="sidebar_header_info">
                    <h2>Nikha's Workspace</h2>
                    <h3>
                        <FiberManualRecordIcon/>
                        {user?.displayName}
                    </h3>
                </div>
                {/* <CreateIcon/> */}
            </div>

            {/* ALL ACTIVITY OPTIONS. */}
            <SidebarOption type="ACTIVITY" Icon={InsertCommentIcon} title="Threads"/>
            <SidebarOption type="ACTIVITY" Icon={AlternateEmailIcon} title="Mentions & reactions"/>
            <SidebarOption type="ACTIVITY" Icon={BookmarkBorderIcon} title="Saved Items"/>
            
            {/* The <hr> tag in HTML stands for horizontal rule and is used to insert a horizontal rule or a thematic break in an HTML page to divide or separate document sections. */}
            <hr/>

            {/* ALL CHANNELS HERE */}
            <SidebarOption type="ALL_CHANNELS" Icon={channelsExpanded ? ExpandMoreIcon : NavigateNextIcon} title="Channels" handleChannelExp={() => setChannelsExpanded(!channelsExpanded)}/>
            {channelsExpanded && (
                <>
                    {channels.map(({id, channelName}) => (
                        <SidebarOption type="CHANNEL" title={channelName} id={id}/>
                    ))}
                    <SidebarOption type="ADD_CHANNEL" Icon={AddIcon} title="Add Channel"/>
                </>
            )}

            <hr/>

            {/* ALL THE DMS HERE */}
            <SidebarOption type="ALL_DMS" Icon={dmsExpanded ? ExpandMoreIcon : NavigateNextIcon} title="Direct messages" handleDmsExpansion={() => setDmsExpanded(!dmsExpanded)}/>
            {/* Connect to db and get all the users available for DM */}
            {dmsExpanded && (
                <>
                    {dms.map(({receiverId, receiverName, receiverImg}) => (
                        <SidebarOption type="DM" title={receiverName} id={receiverId} avatar={receiverImg ? receiverImg: "/static/images/avatar/1.jpg"} />
                    ))}
                </>
            )}

            <hr id="end"/>

        </div>
    )
}

export default Sidebar;
