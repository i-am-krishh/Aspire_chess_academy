import React, { useState, useCallback } from "react";
import { X, Check, RotateCw } from "lucide-react";
import Cropper from "react-easy-crop";
import toast from 'react-hot-toast';

// Custom styles for range sliders
const sliderStyles = `
  .slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-track {
    background: #e5e7eb;
    height: 8px;
    border-radius: 4px;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: #0d9488;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider::-moz-range-track {
    background: #e5e7eb;
    height: 8px;
    border-radius: 4px;
    border: none;
  }
  
  .slider::-moz-range-thumb {
    background: #0d9488;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const CropModal = ({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete,
    aspectRatio = 1, // Default to square (1:1)
    cropShape = "rect", // "rect" or "round"
    title = "Crop Image",
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropCompleteHandler = useCallback(
        (croppedArea, croppedAreaPixels) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous");
            image.src = url;
        });

    const getRadianAngle = (degreeValue) => {
        return (degreeValue * Math.PI) / 180;
    };

    const rotateSize = (width, height, rotation) => {
        const rotRad = getRadianAngle(rotation);
        return {
            width:
                Math.abs(Math.cos(rotRad) * width) +
                Math.abs(Math.sin(rotRad) * height),
            height:
                Math.abs(Math.sin(rotRad) * width) +
                Math.abs(Math.cos(rotRad) * height),
        };
    };

    const getCroppedImg = async (
        imageSrc,
        pixelCrop,
        rotation = 0,
        flip = { horizontal: false, vertical: false }
    ) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return null;
        }

        const rotRad = getRadianAngle(rotation);
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        );

        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
        ctx.translate(-image.width / 2, -image.height / 2);

        ctx.drawImage(image, 0, 0);

        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");

        if (!croppedCtx) {
            return null;
        }

        croppedCanvas.width = pixelCrop.width;
        croppedCanvas.height = pixelCrop.height;

        croppedCtx.drawImage(
            canvas,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // Use compression helper to ensure file size is under limit
        const maxSize = 500 * 1024; // 500KB
        return await compressImageToSize(croppedCanvas, maxSize);
    };

    // Helper function to compress image until it's under size limit
    const compressImageToSize = async (canvas, maxSize, maxWidth = 1200) => {
        const qualities = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
        
        for (let quality of qualities) {
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/jpeg", quality);
            });
            
            if (blob && blob.size <= maxSize) {
                return blob;
            }
        }
        
        // If still too large, try reducing dimensions
        const scaledCanvas = document.createElement("canvas");
        const scaledCtx = scaledCanvas.getContext("2d");
        
        const scale = Math.min(maxWidth / canvas.width, maxWidth / canvas.height);
        scaledCanvas.width = canvas.width * scale;
        scaledCanvas.height = canvas.height * scale;
        
        scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        
        // Try compression again with scaled image
        for (let quality of qualities) {
            const blob = await new Promise((resolve) => {
                scaledCanvas.toBlob(resolve, "image/jpeg", quality);
            });
            
            if (blob && blob.size <= maxSize) {
                return blob;
            }
        }
        
        // Return the lowest quality version if nothing else works
        return new Promise((resolve) => {
            scaledCanvas.toBlob(resolve, "image/jpeg", 0.3);
        });
    };

    const handleSave = async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );

            if (croppedImage) {
                // Final check to ensure image is under 500KB (should be handled by compression)
                const maxSize = 500 * 1024; // 500KB in bytes
                if (croppedImage.size > maxSize) {
                    toast.error('Unable to compress image below 500KB. Please choose a different image or crop a smaller area.');
                    setIsProcessing(false);
                    return;
                }

                onCropComplete(croppedImage);
                onClose();
            }
        } catch (error) {
            console.error("Error cropping image:", error);
            toast.error("Error processing image. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        onClose();
    };

    if (!imageSrc || !isOpen) {
        return null;
    }

    return (
        <>
            <style>{sliderStyles}</style>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={handleClose}
                />

                {/* Modal Content */}
                <div className="relative bg-white border border-gray-200 max-w-[100vw] sm:max-w-[95vw] md:max-w-5xl lg:max-w-6xl max-h-[100vh] sm:max-h-[95vh] md:max-h-[95vh] w-[100vw] sm:w-[95vw] md:w-[90vw] lg:w-[80vw] h-[100vh] sm:h-auto mx-0 sm:mx-auto my-0 sm:my-auto overflow-hidden rounded-none sm:rounded-lg flex flex-col">
                    {/* Header */}
                    <div className="pb-4 px-4 md:px-6 pt-4 md:pt-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="py-4 md:py-6 px-4 md:px-6 flex-1 overflow-hidden">
                        {/* Mobile Layout - Vertical Stack */}
                        <div className="flex md:hidden flex-col space-y-4 h-full overflow-y-auto">
                            {/* Mobile Crop Area */}
                            <div className="relative w-full h-[280px] bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={aspectRatio}
                                    cropShape={cropShape}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropCompleteHandler}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    style={{
                                        containerStyle: {
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "#f7fafc",
                                        },
                                    }}
                                />
                            </div>

                            {/* Mobile Controls */}
                            <div className="flex flex-col space-y-4">
                                {/* Zoom Control */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Zoom: {Math.round(zoom * 100)}%
                                        </span>
                                        <button
                                            onClick={() => setZoom(1)}
                                            disabled={zoom === 1}
                                            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Reset zoom"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>

                                {/* Rotation Control */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Rotation: {rotation}°
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                                className="px-2 py-1 text-xs border border-teal-300 text-teal-600 rounded hover:bg-teal-50 flex items-center"
                                                title="Rotate 90° clockwise"
                                            >
                                                <RotateCw className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => setRotation(0)}
                                                disabled={rotation === 0}
                                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Reset rotation"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min={-180}
                                        max={180}
                                        step={1}
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>

                                {/* Reset All Controls */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        💡 Drag to reposition, scroll to zoom
                                    </span>
                                    <button
                                        onClick={() => {
                                            setZoom(1);
                                            setRotation(0);
                                            setCrop({ x: 0, y: 0 });
                                        }}
                                        disabled={zoom === 1 && rotation === 0}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Reset All
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Layout - Side by Side */}
                        <div className="hidden md:flex space-x-8 h-full">
                            {/* Left Side - Crop Area */}
                            <div className="flex-[2] min-w-0">
                                <div className="flex flex-col space-y-4 h-full">
                                    <h3 className="text-lg font-semibold text-gray-900 self-start">
                                        Crop Your Image
                                    </h3>
                                    <div className="relative w-full flex-1 min-h-[400px] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
                                        <Cropper
                                            image={imageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            rotation={rotation}
                                            aspect={aspectRatio}
                                            cropShape={cropShape}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropCompleteHandler}
                                            onZoomChange={setZoom}
                                            onRotationChange={setRotation}
                                            style={{
                                                containerStyle: {
                                                    width: "100%",
                                                    height: "100%",
                                                    backgroundColor: "#f7fafc",
                                                },
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">
                                        💡 Drag to reposition • Scroll to zoom • Use controls on the right
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Controls */}
                            <div className="flex-1 min-w-[300px] max-w-[350px]">
                                <div className="flex flex-col space-y-6 h-full">
                                    <h3 className="text-lg font-semibold text-gray-900 self-start">
                                        Adjust Settings
                                    </h3>

                                    {/* Zoom Control */}
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-md font-medium text-gray-700">
                                                Zoom: {Math.round(zoom * 100)}%
                                            </span>
                                            <button
                                                onClick={() => setZoom(1)}
                                                disabled={zoom === 1}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Reset zoom"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>

                                    {/* Rotation Control */}
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-md font-medium text-gray-700">
                                                Rotation: {rotation}°
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                                    className="px-3 py-1 text-sm border border-teal-300 text-teal-600 rounded hover:bg-teal-50 flex items-center space-x-1"
                                                    title="Rotate 90° clockwise"
                                                >
                                                    <RotateCw className="h-4 w-4" />
                                                    <span>90°</span>
                                                </button>
                                                <button
                                                    onClick={() => setRotation(0)}
                                                    disabled={rotation === 0}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Reset rotation"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min={-180}
                                            max={180}
                                            step={1}
                                            value={rotation}
                                            onChange={(e) => setRotation(parseInt(e.target.value))}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>

                                    {/* Reset All */}
                                    <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex flex-col space-y-3">
                                            <p className="text-sm text-gray-600 text-center">
                                                Reset all adjustments to default values
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setZoom(1);
                                                    setRotation(0);
                                                    setCrop({ x: 0, y: 0 });
                                                }}
                                                disabled={zoom === 1 && rotation === 0}
                                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Reset All Settings
                                            </button>
                                        </div>
                                    </div>

                                    {/* Spacer to push content up */}
                                    <div className="flex-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-200 px-4 md:px-6 pb-6 bg-white">
                        <div className="w-full flex flex-col space-y-3">
                            {/* Mobile Layout - Stacked Buttons */}
                            <div className="flex md:hidden flex-col w-full space-y-3">
                                <button
                                    onClick={handleSave}
                                    disabled={!croppedAreaPixels || isProcessing}
                                    className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isProcessing ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <Check className="h-5 w-5" />
                                            <span>Save Image</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Desktop Layout - Side by Side Buttons */}
                            <div className="hidden md:flex w-full justify-end space-x-3">
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 min-w-[120px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!croppedAreaPixels || isProcessing}
                                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] flex items-center justify-center space-x-2"
                                >
                                    {isProcessing ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <Check className="h-5 w-5" />
                                            <span>Save Cropped Image</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CropModal;