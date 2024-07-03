// src/components/UploadPhoto.js
import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { TextField, Button, Container, Typography, Box, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Modal, Avatar, ListItemAvatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage, db, auth } from '../firebase';
import { signOut } from "firebase/auth";

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      const querySnapshot = await getDocs(collection(db, 'photos'));
      const photosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPhotos(photosData);
    };

    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    const fileRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    const docRef = await addDoc(collection(db, 'photos'), {
      url,
      author,
      tags: tags.split(',').map(tag => tag.trim()),
      timestamp: Timestamp.fromDate(new Date())
    });

    setPhotos([...photos, { id: docRef.id, url, author, tags: tags.split(',').map(tag => tag.trim()) }]);
    setOpen(false); // Close the modal after uploading
  };

  const handleDelete = async (id, fileUrl) => {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    await deleteDoc(doc(db, 'photos', id));
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container component="main" maxWidth="sm" style={{ position: 'relative' }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ mt: 5, mb: 5 }}
      >
        Logout
      </Button>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography component="h1" variant="h5">
          Photos
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 3, mb: 2 }}>
          Upload Photo
        </Button>
        <List>
          {photos.map(photo => (
            <ListItem key={photo.id}>
              <ListItemAvatar>
                <Avatar src={photo.url} />
              </ListItemAvatar>
              <ListItemText
                primary={photo.author}
                secondary={photo.tags.join(', ')}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(photo.id, photo.url)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          component="div"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Upload Photo
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="contained" color="primary" component="span">
                Choose File
              </Button>
            </label>
            <TextField
              margin="normal"
              required
              fullWidth
              id="author"
              label="Author"
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="tags"
              label="Tags (comma separated)"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleUpload}
            >
              Upload Photo
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UploadPhoto;
