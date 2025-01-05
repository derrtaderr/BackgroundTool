'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { removeBackground } from '@/lib/backgroundRemoval';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setProcessedImage(null);
    setError(null);
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    try {
      setIsProcessing(true);
      setError(null);
      const result = await removeBackground(selectedImage);
      setProcessedImage(result);
    } catch (err) {
      setError('Failed to remove background. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ClearCut
        </h1>
        <p className="text-lg text-gray-600">
          Remove image backgrounds instantly using AI - right in your browser
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {!selectedImage ? (
          <ImageUpload onImageSelect={handleImageSelect} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Original image"
                  className="w-full h-full object-contain"
                />
              </div>
              {processedImage ? (
                <div className="aspect-video relative rounded-lg overflow-hidden bg-[url('/checkerboard.svg')]">
                  <img
                    src={processedImage}
                    alt="Processed image"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-lg">
                  {isProcessing ? (
                    <LoadingSpinner />
                  ) : (
                    <p className="text-gray-500">
                      Click "Remove Background" to process the image
                    </p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setSelectedImage(null)}
                disabled={isProcessing}
              >
                Choose Another Image
              </button>
              {!processedImage ? (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Remove Background'}
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handleDownload}
                >
                  Download Result
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
