import { Avatar, Fade, Menu, MenuItem } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import db from '../firebase';
import './HeaderSearch.css'
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';

function HeaderSearch(props) {
    const [input, setInput] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(props.anchorEl);
    const history = useHistory();
    const [{}, dispatch] = useStateValue();

    useEffect(() => {
        db.collection('users').onSnapshot(snapshot => {
            setSearchData(snapshot.docs.map(doc => ({
                id: doc.id,
                displayName: doc.data().displayName,
                photoUrl: doc.data().photoUrl
            })))
        }); 
    },[])

    function formatName(name) {
        // remove all whitespaces using regex
        var x= name.replace(/\s/gm,'');
        return x;
    }

    const handleItemSelection = (e, dmId) => {
        if(dmId) {
            history.push(`/dm/${dmId}`);
            //Also highlight the corresponding sidebar option. 
            dispatch({
                type: actionTypes.HIGHLIGHT_HANDLE,
                selectedType: 'DM',
                id: dmId
            })
        }
        setAnchorEl(null);
        props.handleSearchClose();
    }

    return (
        <>
            <Menu className="header_search_menu"
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => {
                    setAnchorEl(null);
                    props.handleSearchClose();
                }}
                TransitionComponent={Fade}>
                <MenuItem className="search_menu_item_input">
                    <SearchIcon id="seach_icon"/>
                    <input placeholder="Input search. Beep Beep."
                    className="header_search_input"
                    value = {input}
                    onChange= {event => setInput(event.target.value)}></input>
                </MenuItem>

                {
                    searchData.filter(data => {
                        if(input === '') {
                            return data;
                        } else if(formatName(data.displayName).toLowerCase().includes(formatName(input).toLowerCase())){
                            return data;
                        }
                    }).map(data => (
                        <div className="search_menu_item" onClick={event => handleItemSelection(event, data.id)}>
                            <Avatar id="menu_item_avatar"
                            alt= {data?.displayName}
                            src= {data?.photoUrl ? data.photoUrl : "/static/images/avatar/1.jpg"}
                            variant="rounded"/>
                            <p>{data?.displayName}</p>
                        </div>
                    ))
                }
                <hr id="hr"/>
            </Menu>

            
            
        </>
    )
}

export default HeaderSearch
