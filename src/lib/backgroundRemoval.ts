import { pipeline } from '@xenova/transformers';

export async function removeBackground(imageFile: File): Promise<string> {
  try {
    // Create a pipeline for image segmentation using segment-anything
    const segmenter = await pipeline('image-segmentation', 'Xenova/segment-anything-vit-b', {
      quantized: true
    });

    // Convert File to Image
    const image = await createImageFromFile(imageFile);
    
    // Create a canvas for processing
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    
    // Draw the original image
    ctx.drawImage(image, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Process the image using the model
    const results = await segmenter(canvas.toDataURL('image/jpeg'));
    const result = Array.isArray(results) ? results[0] : results;
    
    // Convert mask data to Float32Array if it isn't already
    const maskData = result.mask instanceof Float32Array 
      ? result.mask 
      : new Float32Array(Object.values(result.mask));

    // Create a new ImageData for the result
    const outputData = new Uint8ClampedArray(imageData.data.length);
    
    // Copy the original image data
    for (let i = 0; i < imageData.data.length; i += 4) {
      outputData[i] = imageData.data[i];       // R
      outputData[i + 1] = imageData.data[i + 1]; // G
      outputData[i + 2] = imageData.data[i + 2]; // B
      
      // Apply the mask to the alpha channel
      const maskIndex = i / 4;
      // For segment-anything, higher values indicate foreground
      outputData[i + 3] = Math.round(maskData[maskIndex] * 255); // Alpha
    }
    
    // Create new ImageData and put it back on the canvas
    const outputImageData = new ImageData(outputData, canvas.width, canvas.height);
    ctx.putImageData(outputImageData, 0, 0);
    
    // Convert to base64
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error('Failed to remove background');
  }
}

async function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
} 