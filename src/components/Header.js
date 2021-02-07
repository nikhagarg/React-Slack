import { Avatar, Fade, Menu, MenuItem, Tooltip } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SearchIcon from '@material-ui/icons/Search';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import React, { useState } from 'react';
import './Header.css';
import { useStateValue } from './StateProvider';
import { auth } from '../firebase';
import EditProfileModal from './EditProfileModal';
import HeaderSearch from './HeaderSearch';

function Header() {
    const [{user}] = useStateValue();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const [openSearchModal, setOpenSearchModal] = useState(false);

    const handleEditProfileModalClose = () => {
        setOpenEditProfileModal(false);
        setAnchorEl(null);
    }

    const handleSearchClose = () => {
        setSearchAnchorEl(null);
        setOpenSearchModal(false);
        console.log("clicked");
    }
    
    return (
        <div className="header">
            <div class="header_left">
                {/* Time icon */}
                <Tooltip title="History" arrow>
                    <AccessTimeIcon id="header_left_timeIcon"/>
                </Tooltip>
            </div>

            <div class="header_search" onClick={(event) => {
                setSearchAnchorEl(event.currentTarget);
                setOpenSearchModal(true);
                }}>
                <SearchIcon/>
                <p> Search Nikha's Workspace</p>
            </div>

            <div class="header_right">
                {/* Help icon */}
                <Tooltip title="Help" arrow>
                    <HelpOutlineIcon/>
                </Tooltip>
                {/* Avatar for logged in user */}
                <Avatar id="header_right_avatar" onClick={(event) => setAnchorEl(event.currentTarget)}
                    alt= {user?.displayName}
                    src= {user?.photoUrl ? user?.photoUrl : "/static/images/avatar/1.jpg"}
                    variant="rounded"
                    />
            </div>

            <Menu className="header_profile_menu"
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}>
                    <MenuItem onClick={() => setOpenEditProfileModal(true)}>Edit Profile</MenuItem>
                    <MenuItem onClick={() => auth.signOut()}>Sign Out</MenuItem>
            </Menu>

            {openEditProfileModal && (
                <EditProfileModal handleModalClose={() => handleEditProfileModalClose()}/> 
            )}

            {openSearchModal && (
                    <HeaderSearch anchorEl={searchAnchorEl} handleSearchClose={() => handleSearchClose()}/>
            )}
        </div>
    )
}

export default Header;
