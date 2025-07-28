import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

const FormInput = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    department: '',
    position: '',
    photo: null,
    dob: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setFormData(prev => ({ ...prev, photo: URL.createObjectURL(e.target.files[0]) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>আইডি কার্ড তথ্য</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="পূর্ণ নাম"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="আইডি নম্বর"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="বিভাগ"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="পদবি"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              আইডি কার্ড তৈরি করুন
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default FormInput;