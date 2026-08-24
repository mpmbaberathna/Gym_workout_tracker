import { forwardRef, useState } from 'react';

/* accessible image component with loading states and proper alt text @param {object} props - component props @param {string} props.src - image source url @param {string} props.alt - alternative text for the image (required for accessibility) @param {string} [props.classname=''] - additional css classes @param {boolean} [props.lazy=true] - whether to use lazy loading @param {boolean} [props.decorative=false] - whether image is decorative (sets alt to empty string) @param {react.reactnode} [props.fallback] - fallback content when image fails to load @param {function} [props.onload] - callback when image loads successfully @param {function} [props.onerror] - callback when image fails to load @param {'eager'|'lazy'} [props.loading='lazy'] - loading behavior @param {string} [props.sizes] - sizes attribute for responsive images @param {string} [props.srcset] - source set for responsive images */
const Image = forwardRef(({
  src,
  alt,
  className = '',
  lazy = true,
  decorative = false,
  fallback,
  onLoad,
  onError,
  loading = 'lazy',
  sizes,
  srcSet,
  ...props
}, ref) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // handle decorative images
  const imageAlt = decorative ? '' : alt;

  // validate required alt text for non-decorative images
  if (!decorative && !alt) {
    console.warn('Image component: alt text is required for accessibility. Use decorative={true} for decorative images.');
  }

  const handleLoad = (e) => {
    setImageLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    setImageLoading(false);
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  // show fallback if image failed to load
  if (imageError && fallback) {
    return fallback;
  }

  // show default error state if no fallback provided
  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        role="img"
        aria-label={decorative ? undefined : `Failed to load image: ${alt}`}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* loading state */}
      {imageLoading && (
        <div
          className={`animate-pulse bg-brand-border ${className}`}
          aria-label="Loading image"
        >
          <div className="w-full h-full bg-gray-300 rounded"></div>
        </div>
      )}

      {/* actual image */}
      <img
        ref={ref}
        src={src}
        alt={imageAlt}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        loading={lazy ? loading : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        srcSet={srcSet}
        {...props}
      />
    </>
  );
});

Image.displayName = 'Image';

export default Image;