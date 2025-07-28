import React from 'react';
import { CardContent, Typography, Avatar, Paper, TextField, Box } from '@mui/material';

const SingleCard = React.forwardRef((props, ref) => {
  const [formData, setFormData] = React.useState({
    name: '',
    roll: '',
    class: '',
    section: '',
    dob: '',
    photo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Paper elevation={3} ref={ref} sx={{ width: 300, mx: 'auto', my: 2 }}>
      <Box sx={{ bgcolor: 'primary.main', py: 1, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          স্কুলের নাম
        </Typography>
      </Box>
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Avatar
            src={formData.photo}
            sx={{ width: 100, height: 100, border: '2px solid', borderColor: 'primary.main' }}
          />
        </Box>
        
        <Typography><strong>নাম:</strong> {formData.name}</Typography>
        <Typography><strong>রোল:</strong> {formData.roll}</Typography>
        <Typography><strong>ক্লাস:</strong> {formData.class}-{formData.section}</Typography>
        <Typography><strong>জন্ম তারিখ:</strong> {formData.dob}</Typography>
      </CardContent>
    </Paper>
  );
});

SingleCard.displayName = 'SingleCard';

export default SingleCard;