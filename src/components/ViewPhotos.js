import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from "firebase/firestore";
import { Container, Grid, Card, CardMedia, Typography, TextField, Box, Chip, Button } from '@mui/material';
import { db } from '../firebase';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const ViewPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [filterTags, setFilterTags] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosCollection = collection(db, 'photos');
      const querySnapshot = await getDocs(photosCollection);
      const allPhotos = querySnapshot.docs.map(doc => doc.data());

      // Filter photos locally based on selectedTags
      const filteredPhotos = allPhotos.filter(photo =>
        selectedTags.every(tag => photo.tags.includes(tag))
      );

      setPhotos(filteredPhotos);
    };

    fetchPhotos();
  }, [selectedTags]);

  const handleTagInput = (e) => {
    setFilterTags(e.target.value);
  };

  const handleAddTag = () => {
    if (filterTags.trim()) {
      setSelectedTags([...selectedTags, filterTags.trim()]);
      setFilterTags('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const slideImages = photos.slice(0, 10).map(photo => ({
    url: photo.url,
    author: photo.author,
  }));

  return (
    <Container sx={{pt: 3}}>
            <Slide easing="ease">
        {slideImages.map((image, index) => (
          <div key={index} className="each-slide">
            <div>
              <img src={image.url} alt={image.author} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
            </div>
          </div>
        ))}
      </Slide>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <TextField
          label="Filter by tags"
          value={filterTags}
          onChange={handleTagInput}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddTag}>
          Add Tag
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
        {selectedTags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleRemoveTag(tag)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {photos.map((photo, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} sx={{mt: 2}}>
            <Card>
              <CardMedia
                component="img"
                height="250"
                image={photo.url}
                alt={photo.author}
              />
              <Box p={2}>
                <Typography variant="subtitle1">{photo.author}</Typography>
                <Typography variant="body2">{photo.tags.join(', ')}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewPhotos;
