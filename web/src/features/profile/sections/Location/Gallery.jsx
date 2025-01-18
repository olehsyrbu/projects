import { useRef, useLayoutEffect, useState, Suspense } from 'react';
import useSWR from 'swr';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PropTypes from 'prop-types';
import {
  ArrowLeft28Filled as ArrowLeft,
  ArrowRight28Filled as ArrowRight,
} from '@fluentui/react-icons';
import { useMatchMedia } from '@/core/hooks';
import 'photoswipe/style.css';

export function Gallery({ images }) {
  let xs = useMatchMedia('(min-width: 460px)');

  return xs ? (
    <Suspense fallback={<GridSkeleton images={images} />}>
      <Grid images={images} />
    </Suspense>
  ) : (
    <Suspense fallback={<ImageSkeleton />}>
      <Scroll images={images} />
    </Suspense>
  );
}

function Grid({ images }) {
  let ref = useRef();

  usePhotoSwipe(ref);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {images.map((image, index) => (
        <Image key={image.url} url={image.url} alt="" />
      ))}
    </div>
  );
}

function Scroll({ images }) {
  let ref = useRef();
  let [index, setIndex] = useState(0);

  let scrollTo = (index, behavior) => {
    ref.current.children[index].scrollIntoView({
      behavior,
      inline: 'center',
      block: 'nearest',
    });
  };
  let slideToNext = () => scrollTo(index + 1, 'smooth');
  let slideToPrev = () => scrollTo(index - 1, 'smooth');

  usePhotoSwipe(ref, {
    onChange(pswp) {
      scrollTo(pswp.currIndex);
    },
  });

  let controlBtn =
    'm-0 border-none bg-transparent p-0 leading-[0] text-graphics-100 disabled:text-graphics-50';

  return (
    <div className="space-y-3">
      <div ref={ref} className="-mx-4 flex snap-x snap-mandatory overflow-auto px-4 scrollbar-hide">
        {images.map((image, index) => (
          <Intersection
            key={image.url}
            className="mr-4 w-full flex-none snap-center"
            onIntersect={() => setIndex(index)}
          >
            <Image url={image.url} alt="" />
          </Intersection>
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex items-center justify-between">
          <button className={controlBtn} onClick={slideToPrev} disabled={index === 0}>
            <ArrowLeft />
          </button>
          <span className="text-base font-bold">
            {index + 1}/{images.length}
          </span>
          <button
            className={controlBtn}
            onClick={slideToNext}
            disabled={index === images.length - 1}
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

function Image({ url, alt }) {
  let { data: image } = useSWR(url, loadImage, { suspense: true });

  return (
    <a
      className="relative block w-full pb-[75%]"
      href={url}
      data-pswp-width={image.width}
      data-pswp-height={image.height}
      data-cropped="true"
    >
      <img
        className="absolute box-border block h-full w-full border border-solid border-graphics-50 object-cover"
        src={url}
        alt={alt}
      />
      <span className="sr-only">Gallery image</span>
    </a>
  );
}

function Intersection({ onIntersect, ...rest }) {
  let ref = useRef();
  let onIntersectRef = useRef();

  onIntersectRef.current = onIntersect;

  useLayoutEffect(() => {
    let observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { threshold: 0.8 },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div {...rest} ref={ref} />;
}

function loadImage(url) {
  return new Promise((resolve) => {
    let image = new window.Image();
    image.onload = () => resolve(image);
    image.src = url;
  });
}

function usePhotoSwipe(ref, options) {
  let optionsRef = useRef();
  optionsRef.current = options;

  useLayoutEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: ref.current,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();

    lightbox.on('change', () => {
      optionsRef.current?.onChange?.(lightbox.pswp);
    });

    return () => {
      lightbox.destroy();
    };
  }, [ref, optionsRef]);
}

function GridSkeleton({ images }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {images.map((_, index) => (
        <ImageSkeleton key={index} />
      ))}
    </div>
  );
}

function ImageSkeleton() {
  return (
    <div className="animate-pulse border border-solid border-graphics-50 bg-graphics-30 pb-[75%]" />
  );
}

Gallery.propTypes = { images: PropTypes.array };
GridSkeleton.propTypes = { images: PropTypes.array };
Grid.propTypes = { images: PropTypes.array };
Scroll.propTypes = { images: PropTypes.array };
Intersection.propTypes = {
  children: PropTypes.node,
  onIntersect: PropTypes.func,
};
Image.propTypes = {
  url: PropTypes.string,
  alt: PropTypes.string,
};
