import { Button, Modal } from '@material-ui/core';
import React, { useState } from 'react';
import db, { storage } from '../firebase';
import './EditProfileModal.css';
import { useStateValue } from './StateProvider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        },
    }),
);

function EditProfileModal(props) {
    const [{user}] = useStateValue();
    const [newName, setNewName] = useState(user.displayName);
    const [newImageUrl, setNewImageUrl] = useState(user.photoUrl);
    const [newImage, setNewImage] = useState(null);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progress, setProgress] = useState(0);
    const classes = useStyles();

    const handleFileChange = (event) => {
        // to make sure to pick first file in case of multi selection
        if(event.target.files[0]) {
            setNewImage(event.target.files[0]);

            // sets the preview image url in the modal
            var reader = new FileReader();
            reader.onload = function() {
                setNewImageUrl(reader.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const handleSaveChanges = () => {
        if(!(newName===user.displayName && newImageUrl===user.photoUrl)){
            if(newName !== user.displayName) {
                // UPDATING THE DB
                db.collection('users').doc(user.userId).set({
                    'displayName': newName,
                }, {merge: true});

                // No need to update datalayer, since the snapshot changes, App.js will pick up new changes and send it to data layer
                // UPDATING THE DATA LAYER
                // dispatch({
                //     type: actionTypes.UPDATE_USER_NAME,
                //     newName: newName
                // });
            }

            if(newImageUrl !== user.photoUrl) {
                // We need to upload the image to the storage now
                const uploadTask = storage.ref(`images/${newImage.name}`).put(newImage);
                setShowProgressBar(true);

                uploadTask.on(
                    "state_changed",
                    
                    // because it will take time to upload. it's a asynchromous process. so we need to show progress to user.
                    // This argument is for PROGRESS BAR
                    (snapshot) => {
                        // All progress bar logic is in here.
                        const progress = Math.round(
                            (snapshot.bytesTransferred/snapshot.totalBytes)* 100
                        );  // will give a  number b/w 0 to 100.
                        setProgress(progress);
                    },
                    
                    // second argument is the error function. to handle error while uploading.
                    (error) => {
                        console.log("ERROR", error);
                        alert(error.message);
                    },

                    //This is the final part. After upload to firebase STORAGE is done.
                    () => {
                        // all the logic here. 
                        // once the upload is completed into the firebase storage, we'll get the download url of the image 
                        // and add that url to the database- firestore.
                        storage.ref("images").child(newImage.name)
                        .getDownloadURL()
                        .then((url) => {
                            // UPDATE THE DB
                            db.collection('users').doc(user.userId).set({
                                'photoUrl': url,
                            }, {merge: true});

                            // No need to update datalayer, since the snapshot changes, App.js will pick up new changes and send it to data layer
                            // UPDATE THE DATA LAYER
                            // dispatch({
                            //     type: actionTypes.UPDATE_USER_PHOTO,
                            //     newUrl: url
                            // });
                        setShowProgressBar(false);
                        props.handleModalClose();
                        })
                    }
                )
            }
        }
    }

    return (
        <>
        <Modal
            open={true} 
            onClose={() => props.handleModalClose()} 
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}>

            <div id="editProfileModal">
                <p className="modal_heading">Edit your profile</p>

                <h4>Display name</h4>
                <input className="modal_input" value={newName} onChange={(event) => setNewName(event.target.value)}/>
                
                <div className="modal_image">
                    <h4>Profile photo</h4>
                    <img src={newImageUrl} alt=""/>

                    {/* Image uploader */}
                    <label htmlFor="image_upload_input">
                        <input
                            style={{display:'none'}}
                            type="file"
                            accept="image/x-png,image/jpeg"
                            onChange={handleFileChange} 
                            id="image_upload_input"
                        />
                        <Button component="span" className="modal_upload_button">Upload an Image</Button>
                    </label>
                </div>

                <hr/>
                
                {showProgressBar ? (
                // PROGRESS BAR
                <div className={classes.root}>
                    <CircularProgress className="modal_progress_bar"
                    variant="determinate" 
                    value={progress} />
                </div>
                ):(
                <div className="modal_buttons">
                    <Button variant="contained" onClick={() => props.handleModalClose()}>Cancel</Button>
                    <Button className="modal_buttons_save" variant="contained"  onClick={handleSaveChanges} >Save Changes</Button>
                </div>
                )}
            </div>
        </Modal>
        </>
    )
}

export default EditProfileModal
