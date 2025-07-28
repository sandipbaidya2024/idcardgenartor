import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toPng, toJpeg } from 'html-to-image';
import { Button, ButtonGroup, Paper, Typography } from '@mui/material';
import CardDesign from './CardDesign';

const PreviewCard = ({ cardData }) => {
  const cardRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  });

  const downloadAsImage = async (format) => {
    if (cardRef.current) {
      try {
        let dataUrl;
        if (format === 'Png') {
          dataUrl = await toPng(cardRef.current);
        } else {
          dataUrl = await toJpeg(cardRef.current);
        }
        
        const link = document.createElement('a');
        link.download = `id-card-${cardData.id}.${format.toLowerCase()}`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>আইডি কার্ড প্রিভিউ</Typography>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <CardDesign data={cardData} ref={cardRef} />
      </div>
      
      <ButtonGroup variant="contained" fullWidth>
        <Button onClick={handlePrint}>প্রিন্ট করুন</Button>
        <Button onClick={() => downloadAsImage('Png')}>PNG হিসেবে সেভ করুন</Button>
        <Button onClick={() => downloadAsImage('Jpeg')}>JPEG হিসেবে সেভ করুন</Button>
      </ButtonGroup>
    </Paper>
  );
};

export default PreviewCard;