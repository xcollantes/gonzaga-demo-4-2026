import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import * as React from 'react';
import { A11y, Grid, Navigation, Pagination, Scrollbar, Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Helper to calculate spacing for items
export const getEvenlySpacedItemStyle = (
  visibleItems: number,
  spaceBetween: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const dimension = orientation === 'horizontal' ? 'width' : 'height';
  const totalSpacing = spaceBetween * (visibleItems - 1);
  return {
    [dimension]: `calc((100% - ${totalSpacing}px) / ${visibleItems})`,
  };
};

/**
 * Helper to get image-based sizing styles
 * This allows the carousel to size based on the content rather than fixed counts
 */
export const getImageBasedItemStyle = (
  baseSize: string = 'auto',
  minSize?: string,
  maxSize?: string,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const dimension = orientation === 'horizontal' ? 'width' : 'height';
  return {
    [dimension]: baseSize,
    ...(minSize ? { [`min-${dimension}`]: minSize } : {}),
    ...(maxSize ? { [`max-${dimension}`]: maxSize } : {}),
  };
};

interface SwiperCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SwiperCarousel = React.forwardRef<
  HTMLDivElement,
  SwiperCarouselProps
>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      role='region'
      aria-roledescription='carousel'
      {...props}
    >
      {children}
    </div>
  );
});
SwiperCarousel.displayName = 'SwiperCarousel';

interface SwiperInstance {
  isBeginning: boolean;
  isEnd: boolean;
  // Add other properties as needed
}

interface SwiperCarouselContentProps extends React.ComponentProps<typeof Swiper> {
  className?: string;
  children?: React.ReactNode;
  autoSize?: boolean;
  baseItemSize?: string;
  minItemSize?: string;
  maxItemSize?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SwiperCarouselContent = React.forwardRef<any, SwiperCarouselContentProps>(({
  className,
  children,
  autoSize = false,
  baseItemSize = 'auto',
  minItemSize,
  maxItemSize,
  ...props
}, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = React.useRef<any>(null);
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    swiper: swiperRef.current?.swiper,
    isBeginning,
    isEnd,
  }));

  const handleSlideChange = (swiper: SwiperInstance) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleInit = (swiper: SwiperInstance) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <Swiper
      ref={swiperRef}
      modules={[Navigation, Pagination, Scrollbar, A11y, Virtual, Grid]}
      className={cn('overflow-hidden', className)}
      direction={props.direction || 'horizontal'}
      spaceBetween={props.spaceBetween !== undefined ? props.spaceBetween : 16}
      slidesPerView={autoSize ? 'auto' : (props.slidesPerView || 1)}
      navigation={props.navigation || false}
      pagination={props.pagination || false}
      scrollbar={props.scrollbar || false}
      virtual={props.virtual || false}
      centeredSlides={props.centeredSlides || false}
      grid={props.grid || undefined}
      onSlideChange={(swiper) => {
        handleSlideChange(swiper);
        if (props.onSlideChange) props.onSlideChange(swiper);
      }}
      onInit={(swiper) => {
        handleInit(swiper);
        if (props.onInit) props.onInit(swiper);
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        // Apply sizing based on image content when autoSize is true
        const slideStyle = autoSize
          ? getImageBasedItemStyle(
            baseItemSize,
            minItemSize,
            maxItemSize,
            props.direction === 'vertical' ? 'vertical' : 'horizontal'
          )
          : undefined;

        return (
          <SwiperSlide key={index} virtualIndex={index} style={slideStyle}>
            {child}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
});
SwiperCarouselContent.displayName = 'SwiperCarouselContent';

interface SwiperCarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SwiperCarouselItem = React.forwardRef<
  HTMLDivElement,
  SwiperCarouselItemProps
>(({
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role='group'
      aria-roledescription='slide'
      className={cn('min-w-0 shrink-0 grow-0', className)}
      {...props}
    />
  );
});
SwiperCarouselItem.displayName = 'SwiperCarouselItem';

interface SwiperCarouselControlProps extends React.ComponentProps<typeof Button> {
  direction: 'prev' | 'next';
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
  isHidden?: boolean;
}

const SwiperCarouselControl = React.forwardRef<
  HTMLButtonElement,
  SwiperCarouselControlProps
>(({
  className,
  variant = 'outline',
  size = 'icon',
  direction,
  orientation = 'horizontal',
  onNavigate,
  isHidden = false,
  ...props
}, ref) => {
  if (isHidden) {
    return null;
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full z-10',
        className
      )}
      onClick={onNavigate}
      {...props}
    >
      {orientation === 'horizontal' ? (
        direction === 'prev' ? (
          <ChevronLeft className='h-4 w-4' />
        ) : (
          <ChevronRight className='h-4 w-4' />
        )
      ) : (
        direction === 'prev' ? (
          <ChevronUp className='h-4 w-4' />
        ) : (
          <ChevronDown className='h-4 w-4' />
        )
      )}
      <span className='sr-only'>
        {direction === 'prev' ? 'Previous slide' : 'Next slide'}
      </span>
    </Button>
  );
});
SwiperCarouselControl.displayName = 'SwiperCarouselControl';

export {
  SwiperCarousel,
  SwiperCarouselContent,
  SwiperCarouselControl,
  SwiperCarouselItem
};
