import { pipeline } from '@xenova/transformers';

export async function removeBackground(imageFile: File): Promise<string> {
  try {
    // Create a pipeline for image segmentation
    const segmenter = await pipeline('image-segmentation', 'Xenova/detr-resnet-50-panoptic');

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
    
    // Apply the mask to create transparency
    for (let i = 0; i < imageData.data.length; i += 4) {
      const maskIndex = i / 4;
      imageData.data[i + 3] = Math.round(maskData[maskIndex] * 255); // Alpha channel
    }
    
    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);
    
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