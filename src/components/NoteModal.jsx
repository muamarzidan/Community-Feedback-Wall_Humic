import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    
    const noteData = {
      ...formData,
      id: note?.id || Date.now(),
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      };
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/pdf'].includes(file.type)) {
        alert('Only JPG, PNG, or PDF files are allowed');
        return;
      };

      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
        delete_image: false
      }));
    };
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Image (Optional)
              </label>
              
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
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-500">Click to upload image</span>
                      <span className="mt-1 text-xs text-gray-400">JPG, PNG, or PDF (max 5MB)</span>
                    </div>
                  </label>
                </div>
              )}
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