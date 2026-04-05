import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { setupFadeInOnScroll } from '../view-first-animation-utils';

type FadeInViewOptions = {
  rootMargin?: string;
  threshold?: number;
  selector?: string;
  enabled?: boolean;
};

/**
 * React hook to setup fade-in animations when elements come into view
 *
 * @example
 * ```tsx
 * // Basic usage
 * const MyComponent = () => {
 *   useFadeInView();
 *   return (
 *     <div>
 *       <div className="view-first-fade-in">This fades in when it comes into view</div>
 *       <div className="view-first-fade-in-300">This fades in faster</div>
 *     </div>
 *   );
 * };
 *
 * // With custom options
 * const MyComponent = () => {
 *   useFadeInView({
 *     rootMargin: '0px 0px -100px 0px', // Trigger when 100px from bottom of viewport
 *     threshold: 0.2, // Trigger when 20% visible
 *   });
 *
 *   return (
 *     <div>
 *       <div className="view-first-fade-in">This fades in when it comes into view</div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useFadeInView({
  rootMargin = '0px',
  threshold = 0.1,
  selector = '.view-first-fade-in, .view-first-fade-in-100, .view-first-fade-in-300, .view-first-fade-in-400, .view-first-fade-in-500, .view-first-fade-in-600',
  enabled = true
}: FadeInViewOptions = {}) {
  const observerRef = useRef<ReturnType<typeof setupFadeInOnScroll> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    observerRef.current = setupFadeInOnScroll({ rootMargin, threshold, selector });

    // Cleanup function
    return () => {
      if (observerRef.current?.observer) {
        observerRef.current.observer.disconnect();
      }
    };
  }, [rootMargin, threshold, selector, enabled]);

  // Add router change event handler to refresh animations
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Handle route change complete event
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        observerRef.current?.refresh?.();
      }, 100); // Small delay to ensure DOM is updated
    };

    // Subscribe to Next.js router events
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router, enabled]);

  // Memoize the refresh function to prevent unnecessary re-renders
  const refresh = useCallback(() => {
    observerRef.current?.refresh?.();
  }, []);

  return { refresh };
}

/**
 * React hook for a single element fade-in when it comes into view
 */
export function useElementFadeIn<T extends HTMLElement = HTMLDivElement>(options: {
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
} = {}) {
  const { rootMargin = '0px', threshold = 0.1, enabled = true } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, enabled]);

  return elementRef;
}