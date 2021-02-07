import React from 'react';
import { useHistory } from 'react-router-dom';
import db from '../firebase';
import './SidebarOption.css'
import {Avatar} from '@material-ui/core';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';

// Icon with 'I' bcz its a component
function SidebarOption({type, Icon, title, id, handleChannelExp, handleDmsExpansion, avatar}) {
    const [{handleHighlighted}, dispatch] = useStateValue();
    const history = useHistory();

    // HANDLE ACTIVITY/CHANNEL/DM SELECTION
    const handleSelectChannel = () => {
        console.log("Select Channel Clicked");
        const highlightItem = {
            type: actionTypes.HIGHLIGHT_HANDLE,
            selectedType: type,
            id: id ? id:title
        }

        //  when you select a CHANNEL/DM/ACTIVITY, we'll push the next page into history, basically we'll redirect
        if(type==='CHANNEL') {
            history.push(`/room/${id}`);
            dispatch(highlightItem);
        } else if(type==="DM") {
            history.push(`/dm/${id}`);
            dispatch(highlightItem);
        } else if(type === "ACTIVITY"){
            history.push(`/activity/${title}`);
            dispatch(highlightItem);
        } else if(type==="ALL_CHANNELS") {
            handleChannelExp();
        } else if(type==="ALL_DMS") {
            handleDmsExpansion();
        } else if(type === "ADD_CHANNEL") {
            console.log("Add Channel Clicked");
            const channelName = prompt("Add a channel name");
            if(channelName) {
                db.collection('rooms').add({
                    name: channelName
                });
            }
        } 
    }

    // To highlight the particular handle when clicked
    function highlightClass(divClass) {
        if(handleHighlighted.selectedType===type && handleHighlighted.id===(id||title)) {
                return divClass + ' ' + 'sidebar_highlight';
        }
        return divClass;
    }

    return (
        <div className="sidebarOption" onClick={handleSelectChannel}>
            {(type==="ACTIVITY" || type==="ALL_CHANNELS" || type==="ADD_CHANNEL" || type==="ALL_DMS") && (
                <div className={highlightClass("sidebarOption_with_icon")}>
                    <Icon className="sidebarOption_icon"/>
                    <h3>{title}</h3>
                </div>
            )}
            
            {type==="CHANNEL" && (
                <h3 className={highlightClass("sidebarOption_channel")}>
                    <span className="sidebarOption_hash">#</span>{title}
                </h3>
            )}

            {type==="DM" && (
                <div className={highlightClass("sidebarOption_with_avatar")}>
                    <Avatar id="sidebar_dm_avatar"
                    alt= {title}
                    src= {avatar}
                    variant="rounded"/>
                    <h3>{title}</h3>
                </div>
            )}
        </div>
    )
}

export default SidebarOption
