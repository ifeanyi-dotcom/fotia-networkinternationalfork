import { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, placeholder = 'blur' }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.src = src;

                        const timeout = setTimeout(() => {
                            setImageLoading(false);
                            setImageError(true);
                        }, 15000);

                        img.onload = () => {
                            clearTimeout(timeout);
                            setImageSrc(src);
                            setImageLoading(false);
                            observer.unobserve(entry.target);
                        };

                        img.onerror = () => {
                            clearTimeout(timeout);
                            setImageLoading(false);
                            setImageError(true);
                            observer.unobserve(entry.target);
                        };
                    }
                });
            },
            { rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src]);

    return (
        <div ref={imgRef} className={`relative overflow-hidden bg-gray-100 ${className}`}>
            {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
            )}
            {imageSrc && !imageError && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                />
            )}
            {imageError && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Image failed to load</span>
                </div>
            )}
        </div>
    );
};

export default LazyImage;