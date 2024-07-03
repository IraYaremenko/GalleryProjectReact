// src/components/Slideshow.js
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from '@mui/material';

const Slideshow = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const db = getFirestore();
      const q = query(collection(db, 'photos'));
      const querySnapshot = await getDocs(q);
      setPhotos(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchPhotos();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Container>
      <Slider {...settings}>
        {photos.map((photo, index) => (
          <div key={index}>
            <img src={photo.url} alt={photo.author} />
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default Slideshow;
