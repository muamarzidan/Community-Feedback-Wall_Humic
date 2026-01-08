/**
 * Image Dimension Validator
 * Max dimension: 3000x3000px
 */

const MAX_DIMENSION = 3000;

/**
 * Validate image dimension (tidak auto-resize, reject jika melebihi)
 * @param {File} file - Image file
 * @returns {Promise<{isValid: boolean, file: File, message: string}>}
 */
export const validateImageDimension = (file) => {
  return new Promise((resolve, reject) => {
    // Check if file is image
    if (!file.type.startsWith('image/')) {
      resolve({
        isValid: false,
        file: null,
        message: 'File must be an image'
      });
      return;
    }

    // Create image element untuk check dimension
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Check jika dimension valid (tidak melebihi max)
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
        resolve({
          isValid: true,
          file: file,
          message: 'Image dimension is valid',
          dimension: { width, height }
        });
        return;
      }

      // Image melebihi max dimension, REJECT
      resolve({
        isValid: false,
        file: null,
        message: `Image dimension (${width}x${height}px) exceeds maximum allowed (${MAX_DIMENSION}x${MAX_DIMENSION}px). Please resize your image before uploading.`,
        dimension: { width, height },
        maxDimension: MAX_DIMENSION
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions without loading full image
 * @param {File} file 
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format file size untuk display
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
