import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import { fileToDataUrl } from '../utils/helper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

// Upload an image or link a youtube video, if being used in editing page
export default function MediaCard ({ isEditing = true, question, setQuestion, classes }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  function handleImage (e) {
    fileToDataUrl(e.target.files[0])
      // .then(url => urlreplace(/data:image\/png;base64,\s*/, ''))
      .then(base => setQuestion({ ...question, mediaSrc: base }))
      .catch(err => console.error(err.message));
  }

  // Can not resolve CORB :(
  function handleVideo () {
    setQuestion({ ...question, mediaType: 'video', mediaSrc: videoSrc })
    setVideoSrc('');
    handleCloseDialog();
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setVideoSrc('');
    setOpenDialog(false);
  };

  return (
    <Card className={classes.mediaCard} variant='outlined'>
      <CardActionArea>
        <CardMedia
          className={classes.image}
          component={question.mediaType === 'image' ? 'img' : 'video'}
          alt="media"
          height="160"
          src={question.mediaSrc}
          title="media"
        />
      </CardActionArea>
      {isEditing &&
        <CardActions>
          <input
            accept="image/png"
            className={classes.fileInput}
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => handleImage(e)}
          />
          <label htmlFor="contained-button-file">
            <Button variant="text" color="primary" component="span">
              Upload image
            </Button>
          </label>
          <Divider className={classes.divider} orientation="vertical" />
          <Button size="small" color="primary" onClick={handleOpenDialog}>
            youtube video
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Link a video</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Type the link to a youtube video below
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Video address"
                type="text"
                fullWidth
                autoComplete='off'
                value={videoSrc}
                onChange={(e) => setVideoSrc(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleVideo} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </CardActions>
      }
    </Card>
  )
}

MediaCard.propTypes = {
  isEditing: PropTypes.bool,
  question: PropTypes.object,
  setQuestion: PropTypes.func,
  classes: PropTypes.object,
}
