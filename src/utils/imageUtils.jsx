import React from 'react';

// Utility function to check if an image URL is valid
export const isValidImageUrl = (imageUrl) => {
    if (!imageUrl) return false;

    // Check for local uploads (backward compatibility)
    if (imageUrl.startsWith('/uploads/')) return true;

    // Check for Cloudinary URLs
    if (imageUrl.includes('cloudinary.com')) return true;

    // Check for other valid HTTP/HTTPS URLs
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return true;

    return false;
};

// Utility function to get the display URL for an image
export const getImageDisplayUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // If it's already a full URL (Cloudinary or other), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it's a local upload path, construct the full URL
    if (imageUrl.startsWith('/uploads/')) {
        return imageUrl; // The backend will serve these
    }

    return null;
};

// Component for displaying images with fallback
export const ImageWithFallback = ({
    src,
    alt,
    className,
    fallbackComponent,
    onError
}) => {
    const imageUrl = getImageDisplayUrl(src);

    if (!isValidImageUrl(src)) {
        return fallbackComponent || null;
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={onError}
        />
    );
};