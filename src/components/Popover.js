import React, { useState } from 'react'
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
        pointerEvents: 'none',
        },
        paper: {
        padding: theme.spacing(1),
        backgroundColor: 'black',
        color: 'white'
        },
    }),
);

function Popover() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    
    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                Hover with a Popover.
            </Typography>
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>I use Popover.</Typography>
            </Popover>
    </div>
    )
}

export default Popover
