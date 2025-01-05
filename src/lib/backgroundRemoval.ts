import { pipeline } from '@xenova/transformers';

export async function removeBackground(imageFile: File): Promise<string> {
  try {
    // Create a pipeline for image segmentation
    const segmenter = await pipeline('image-segmentation', 'Xenova/u2net');

    // Convert File to Image and get its data
    const image = await createImageFromFile(imageFile);
    const imageData = await getImageData(image);

    // Process the image
    const result = await segmenter(imageData);

    // Get the mask from the first (and only) segment
    const mask = result[0].mask;

    // Apply the mask to the original image
    return await applyMaskToImage(image, mask);
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

async function getImageData(image: HTMLImageElement): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

async function applyMaskToImage(
  image: HTMLImageElement,
  mask: Float32Array
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;

  // Draw the original image
  ctx.drawImage(image, 0, 0);

  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Apply the mask
  for (let i = 0; i < imageData.data.length; i += 4) {
    const maskIndex = i / 4;
    imageData.data[i + 3] = mask[maskIndex] * 255; // Alpha channel
  }

  // Clear the canvas and draw the masked image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);

  // Convert to base64
  return canvas.toDataURL('image/png');
} 