import React from 'react';
import { CardContent, Typography, Avatar } from '@mui/material';

const CardDesign = React.forwardRef(({ data }, ref) => {
  return (
    <div id="id-card" ref={ref} style={{ 
      width: '300px', 
      border: '1px solid #ccc', 
      borderRadius: '10px', 
      overflow: 'hidden',
      backgroundColor: 'white',
      margin: '10px'
    }}>
      <div style={{ 
        backgroundColor: '#1976d2', 
        padding: '10px', 
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h6">স্কুলের নাম</Typography>
      </div>
      
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <Avatar 
            src={data.photo} 
            alt="Student" 
            sx={{ width: 100, height: 100, border: '2px solid #1976d2' }}
          />
        </div>
        
        <Typography variant="body1" style={{ margin: '5px 0' }}>
          <strong>নাম:</strong> {data.name}
        </Typography>
        <Typography variant="body1" style={{ margin: '5px 0' }}>
          <strong>রোল:</strong> {data.roll}
        </Typography>
        <Typography variant="body1" style={{ margin: '5px 0' }}>
          <strong>ক্লাস:</strong> {data.class} - {data.section}
        </Typography>
        <Typography variant="body1" style={{ margin: '5px 0' }}>
          <strong>জন্ম তারিখ:</strong> {data.dob}
        </Typography>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px' }}>
          <Typography variant="caption">বৈধতা: ৩১/১২/২০২৪ পর্যন্ত</Typography>
        </div>
      </CardContent>
    </div>
  );
});

export default CardDesign;