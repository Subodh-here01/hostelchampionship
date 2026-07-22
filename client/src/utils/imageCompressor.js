/**
 * Compresses an image file (JPEG/PNG/etc) using HTML5 Canvas.
 * @param {File} file The original file.
 * @param {Object} options Compression options.
 * @param {number} options.maxWidth The maximum width of the output image.
 * @param {number} options.maxHeight The maximum height of the output image.
 * @param {number} options.quality The image quality (0.0 to 1.0).
 * @returns {Promise<string>} A promise that resolves to the compressed Base64 Data URL.
 */
export const compressImage = (file, { maxWidth = 1200, maxHeight = 1200, quality = 0.7 } = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to base64 jpeg
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
