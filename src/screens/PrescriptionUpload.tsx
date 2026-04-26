import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileImage, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function PrescriptionUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      // 1. Upload to Cloudinary
      const secureUrl = await uploadImageToCloudinary(selectedFile);
      
      // 2. Save order in Firestore
      await addDoc(collection(db, 'orders'), {
        userId: currentUser?.uid,
        prescriptionImage: secureUrl,
        status: 'Prescription Submitted',
        timestamp: serverTimestamp()
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-blue-600 px-6 pt-10 pb-6 rounded-b-3xl shadow-md text-white">
        <h1 className="text-2xl font-bold mb-2">Upload Prescription</h1>
        <p className="text-blue-100 text-sm">Upload a valid prescription for medicines requiring a doctor's approval.</p>
      </div>

      <div className="flex-1 p-6">
        {success ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Uploaded Successfully!</h2>
            <p className="text-gray-500 text-center">Our pharmacist will review it and update your cart shortly.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${previewURL ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              
              {previewURL ? (
                <div className="w-full relative py-4">
                  <img src={previewURL} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                </div>
              ) : (
                <>
                  <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Tap to Upload</h3>
                  <p className="text-gray-500 text-sm mt-2">Format: JPG, PNG. Max size: 5MB</p>
                </>
              )}
            </div>

            {selectedFile && !previewURL && (
               <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                 <FileImage className="text-blue-500" />
                 <span className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</span>
               </div>
            )}

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

            <div className="mt-auto pt-6">
              <button 
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Submit Prescription'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
