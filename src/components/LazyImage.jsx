import { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className, placeholder = 'blur' }) => {
    const [imageSrc, setImageSrc] = useState(placeholder === 'blur' ? null : src);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImageSrc(src);
            setImageLoading(false);
        };

        return () => {
            img.onload = null;
        };
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={`${className} transition-opacity duration-500 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default LazyImage;