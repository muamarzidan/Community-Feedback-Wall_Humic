import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { validateImageDimension } from '@/utils/imageValidator';


const NoteModal = ({ isOpen, onClose, onSave, note = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    backgroundColor: '#fbbf24',
    image: null,
    imagePreview: null,
    delete_image: false
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const colorOptions = [
    { name: 'Yellow', value: '#FFFB00' },
    { name: 'Pink', value: '#FECBEB' },
    { name: 'Blue', value: '#B5D9FF' },
    { name: 'Green', value: '#9DFFCB' },
    { name: 'Purple', value: '#F2C5FF' },
  ];
  
  const isAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
  };
  
  const measureTextHeight = (text, fontStyle, maxWidth, lineHeight) => {
    if (!text) return 0;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontStyle;
    
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length * lineHeight;
  };
  const calculateNoteHeight = () => {
    const cardWidth = 355;
    const padding = 16;
    const contentWidth = cardWidth - (padding * 2); // 323px
    
    // Ukur tinggi title
    const titleHeight = measureTextHeight(
      formData.title,
      18,
      'bold 18px Arial',
      contentWidth,
      24
    );
    
    // Ukur tinggi description
    const descHeight = measureTextHeight(
      formData.description,
      15,
      '15px Arial',
      contentWidth,
      20
    );
    
    // Hitung tinggi image jika ada
    let imageHeight = 0;
    if (formData.image || formData.imagePreview) {
      // Estimasi tinggi image (akan disesuaikan dengan aspect ratio actual)
      // Untuk preview, kita estimasi max height 200px
      imageHeight = 200;
    }
    
    // Total height calculation
    const headerHeight = 5;
    const headerGap = isAuthenticated() ? 36 : 24;
    let totalHeight = padding; // Top padding
    
    totalHeight += headerHeight + headerGap; // Header section
    totalHeight += titleHeight + 8; // Title + gap
    
    if (imageHeight > 0) {
      totalHeight += imageHeight + 12; // Image + gap
    }
    
    if (descHeight > 0) {
      totalHeight += descHeight + 12; // Description + gap
    }
    
    totalHeight += 26 + 20; // Reactions section + gap
    totalHeight += 16; // Date section
    totalHeight += padding; // Bottom padding
    
    return Math.ceil(totalHeight);
  };
  
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        description: note.description || '',
        email: note.email || '',
        backgroundColor: note.backgroundColor || '#fbbf24',
        image: null,
        imagePreview: note.image || null,
        delete_image: false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        email: '',
        backgroundColor: '#fbbf24',
        image: null,
        imagePreview: null,
        delete_image: false
      });
    };
  }, [note, isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (!isAuthenticated() && !formData.email.trim()) {
      alert('Email is required for guest users');
      return;
    };
    
    // Hitung height sebelum submit
    const calculatedHeight = calculateNoteHeight();
    
    console.log('CALCULATED NOTE HEIGHT:', {
      title: formData.title,
      description: formData.description,
      hasImage: !!formData.image || !!formData.imagePreview,
      calculatedHeight: calculatedHeight,
      timestamp: new Date().toISOString()
    });
    
    const noteData = {
      ...formData,
      id: note?.id || Date.now(),
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      height: calculatedHeight, // Tambahkan height
    };

    // Remove imagePreview from data sent to API
    delete noteData.imagePreview;
    
    onSave(noteData);
    onClose();
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    setImageError('');

    try {
      // File size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size must be less than 5MB');
        setImageLoading(false);
        return;
      }

      // File type check
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setImageError('Only JPG, PNG, or WEBP files are allowed');
        setImageLoading(false);
        return;
      }

      // Validate image dimension (max 3000x3000)
      const result = await validateImageDimension(file);

      if (!result.isValid) {
        setImageError(result.message);
        setImageLoading(false);
        return;
      }

      // Dimension valid, use original file
      setFormData(prev => ({
        ...prev,
        image: result.file,
        imagePreview: URL.createObjectURL(result.file),
        delete_image: false
      }));

      // Clear any previous errors
      setImageError('');
    } catch (error) {
      console.error('Error processing image:', error);
      setImageError('Failed to process image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null,
      delete_image: note?.image ? true : false // Only set delete flag if there was an existing image
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors cursor-pointer hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email (Only for guest users) */}
          {!isAuthenticated() && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">Required for guest users</p>
            </div>
          )}
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note title..."
              required
            />
          </div>
          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note description..."
            />
          </div>
          {/* Background Color */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange('backgroundColor', color.value)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.backgroundColor === color.value
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          {isAuthenticated() && (
            <div>
              {imageError && (
                <div className={`mb-2 p-2 text-sm rounded-lg ${
                  imageError.startsWith('✓') 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {imageError}
                </div>
              )}
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-40 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={imageLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={imageLoading}
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        <span className="text-sm text-gray-600">Processing image...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or WEBP. Max 5MB and 3000x3000px dimension.
              </p>
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              {note ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;