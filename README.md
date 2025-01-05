# ClearCut - AI Background Removal Tool

ClearCut is a web-based application that leverages the power of Transformers.js to remove backgrounds from images directly in your browser. Built with Next.js and TypeScript, it provides a seamless, privacy-focused solution for background removal tasks.

## Features

- Browser-based background removal using AI
- Real-time preview
- Drag and drop interface
- Privacy-first (all processing happens client-side)
- Responsive design
- Download results with transparency

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/derrtaderr/BackgroundTool.git
cd BackgroundTool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Upload an image by dragging and dropping it into the upload area or clicking to select a file
2. Click "Remove Background" to process the image
3. Once processing is complete, you can download the result with a transparent background
4. The processed image will be saved as a PNG file with transparency

## Technical Details

- Built with Next.js 14
- Uses Transformers.js for AI-powered background removal
- Implements the U2NET model for semantic segmentation
- Client-side processing for enhanced privacy
- Responsive design with Tailwind CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
