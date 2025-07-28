import { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createRoot } from 'react-dom/client';

export const useIdCardGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIdCards = async (studentsData) => {
    if (!studentsData.length) {
      return { success: false, error: 'কোন ডাটা পাওয়া যায়নি' };
    }

    setIsGenerating(true);
    const zip = new JSZip();
    const imgFolder = zip.folder("student-id-cards");
    let successCount = 0;

    try {
      // টেম্পোরারি কন্টেইনার তৈরি
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      const root = createRoot(tempDiv);

      for (let i = 0; i < studentsData.length; i++) {
        try {
          const student = studentsData[i];
          
          // কার্ড রেন্ডার
          root.render(
            <div id={`card-${i}`} style={{
              width: '300px',
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '15px',
                borderRadius: '8px 8px 0 0'
              }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>স্কুল আইডি কার্ড</h3>
              </div>
              
              {/* ছবি সেকশন - 300x300 পিক্সেল */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                <img 
                  src={student.photo || 'data:image/svg+xml;base64,...'} 
                  alt="Student" 
                  style={{ 
                    width: '150px', 
                    height: '150px',
                    objectFit: 'cover',
                    border: '3px solid #1976d2',
                    borderRadius: '50%'
                  }} 
                />
              </div>
              
              {/* ছাত্র তথ্য */}
              <div style={{ marginBottom: '10px' }}>
                <p style={{ margin: '8px 0', fontSize: '14px' }}>
                  <strong>নাম:</strong> {student.name || 'N/A'}
                </p>
                <p style={{ margin: '8px 0', fontSize: '14px' }}>
                  <strong>রোল:</strong> {student.roll || 'N/A'}
                </p>
                <p style={{ margin: '8px 0', fontSize: '14px' }}>
                  <strong>ক্লাস:</strong> {student.class || 'N/A'} - {student.section || 'N/A'}
                </p>
                <p style={{ margin: '8px 0', fontSize: '14px' }}>
                  <strong>জন্ম তারিখ:</strong> {student.dob || 'N/A'}
                </p>
              </div>
              
              {/* ফুটার */}
              <div style={{ 
                marginTop: '15px', 
                textAlign: 'center', 
                fontSize: '12px',
                color: '#666',
                borderTop: '1px solid #eee',
                paddingTop: '10px'
              }}>
                <p style={{ margin: 0 }}>বৈধতা: ৩১/১২/২০২৪ পর্যন্ত</p>
              </div>
            </div>
          );

          // রেন্ডারিং সম্পূর্ণ হতে দিন
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // কার্ড ক্যাপচার
          const cardElement = document.getElementById(`card-${i}`);
          if (cardElement) {
            const dataUrl = await htmlToImage.toPng(cardElement, {
              quality: 0.95,
              pixelRatio: 2 // উচ্চ রেজোলিউশন
            });
            
            if (dataUrl && dataUrl.includes('data:image')) {
              const base64Data = dataUrl.split(',')[1];
              imgFolder.file(
                `id-card-${student.roll || student.name || i}.png`,
                base64Data,
                { base64: true }
              );
              successCount++;
            }
          }
        } catch (error) {
          console.error(`ছাত্র ${i} এর কার্ড তৈরিতে ত্রুটি:`, error);
        }
      }

      // ক্লিনআপ
      root.unmount();
      document.body.removeChild(tempDiv);

      // ZIP ফাইল তৈরি
      if (successCount > 0) {
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "student-id-cards.zip");
        return { success: true, count: successCount };
      }
      return { success: false, error: 'কোন কার্ড তৈরি করা যায়নি' };
    } catch (error) {
      console.error('কার্ড জেনারেট ত্রুটি:', error);
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generateIdCards };
};