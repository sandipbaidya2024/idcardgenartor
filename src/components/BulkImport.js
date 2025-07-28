import React, { useState } from 'react';
import { 
  Button, 
  Paper, 
  Typography, 
  Grid, 
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { useIdCardGenerator } from '../hooks/useIdCardGenerator';

const BulkImport = ({ setSnackbar }) => {
  const [students, setStudents] = useState([]);
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const { isGenerating, generateIdCards } = useIdCardGenerator();

  // টেমপ্লেট ডাউনলোড ফাংশন
  const downloadTemplate = () => {
    const templateData = [
      {
        'ছাত্র/ছাত্রীর নাম': "নমুনা নাম",
        'রোল নম্বর': "101",
        'ক্লাস': "9",
        'সেকশন': "A",
        'জন্ম তারিখ': "01/01/2008",
        'ছবি (300x300 পিক্সেল)': "এখানে ছবি পেস্ট করুন"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ছাত্র তথ্য");
    
    // কলামের প্রস্থ সেট করুন
    ws['!cols'] = [
      { wch: 20 }, // নাম
      { wch: 10 }, // রোল
      { wch: 8 },  // ক্লাস
      { wch: 8 },  // সেকশন
      { wch: 12 }, // জন্ম তারিখ
      { wch: 25 }  // ছবি নির্দেশিকা
    ];

    XLSX.writeFile(wb, "ছাত্র_আইডি_কার্ড_টেমপ্লেট.xlsx");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      // এক্সেল থেকে ছবি বের করুন
      const images = {};
      if (workbook.SSF) {
        Object.entries(workbook.SSF).forEach(([name, data]) => {
          if (name.startsWith('xl/media/')) {
            images[name] = data;
          }
        });
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // ছবি প্রসেসিং
      const processedData = await Promise.all(
        jsonData.map(async (item, index) => {
          const imageKey = `xl/media/image${index+1}.jpeg`; // এক্সেলের ছবি নামের প্যাটার্ন
          
          return {
            name: item['ছাত্র/ছাত্রীর নাম'] || 'N/A',
            roll: item['রোল নম্বর'] || 'N/A',
            class: item['ক্লাস'] || 'N/A',
            section: item['সেকশন'] || 'N/A',
            dob: item['জন্ম তারিখ'] || 'N/A',
            photo: images[imageKey] 
              ? URL.createObjectURL(new Blob([images[imageKey]], { type: 'image/jpeg' }))
              : null
          };
        })
      );

      setPreviewData(processedData.slice(0, 5));
      setStudents(processedData);
      
      setSnackbar({
        open: true,
        message: `${processedData.length}টি রেকর্ড লোড হয়েছে!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('ত্রুটি:', error);
      setSnackbar({
        open: true,
        message: 'ফাইল প্রসেস করতে সমস্যা! টেমপ্লেট ব্যবহার করুন',
        severity: 'error'
      });
    }
  };

  // ... বাকি কোড

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        ছাত্র আইডি কার্ড জেনারেটর
      </Typography>

      {/* ধাপ ১: টেমপ্লেট ডাউনলোড */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          ধাপ ১: টেমপ্লেট ডাউনলোড করুন
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={downloadTemplate}
          sx={{ mb: 2 }}
        >
          টেমপ্লেট ডাউনলোড
        </Button>
        <Typography variant="body2" color="text.secondary">
          <strong>নির্দেশনা:</strong>
          <ol>
            <li>উপরের বাটনে ক্লিক করে টেমপ্লেট ডাউনলোড করুন</li>
            <li>এক্সেলে খুলে ছাত্রদের তথ্য填入 করুন</li>
            <li>ছবি যোগ করতে: Insert → Picture → Device থেকে ছবি সিলেক্ট করুন</li>
            <li>ছবির সাইজ: <strong>300x300 পিক্সেল</strong> (এক্সেলেই রিসাইজ করুন)</li>
          </ol>
        </Typography>
      </Box>

      {/* ধাপ ২: ফাইল আপলোড */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          ধাপ ২: ডাটা ফাইল আপলোড করুন
        </Typography>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          id="excel-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="excel-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            এক্সেল ফাইল সিলেক্ট করুন
          </Button>
        </label>
        {fileName && (
          <Typography>
            নির্বাচিত ফাইল: <strong>{fileName}</strong>
          </Typography>
        )}
      </Box>

      {/* ডাটা প্রিভিউ */}
      {previewData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            ডাটা প্রিভিউ (প্রথম ৫টি রেকর্ড)
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>নাম</TableCell>
                  <TableCell>রোল</TableCell>
                  <TableCell>ছবি</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>
                      {student.photo ? (
                        <img 
                          src={student.photo} 
                          alt="Student" 
                          style={{ 
                            width: '50px', 
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }} 
                        />
                      ) : 'ছবি নেই'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="primary"
            onClick={() => generateIdCards(students)}
            disabled={students.length === 0 || isGenerating}
            startIcon={isGenerating ? <CircularProgress size={24} /> : null}
            size="large"
          >
            {isGenerating ? 'তৈরি হচ্ছে...' : `সব কার্ড ডাউনলোড করুন (${students.length}টি)`}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default BulkImport;