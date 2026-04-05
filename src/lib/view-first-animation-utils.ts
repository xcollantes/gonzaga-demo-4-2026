/**
 * Utility functions for view-first animations
 */

/**
 * Sets up Intersection Observer to apply fade-in animations when elements come into view
 * @param rootMargin - Margin around the root element when calculating intersections
 * @param threshold - Percentage of the element that must be visible to trigger the callback
 * @param selector - CSS selector for elements to observe (default: all elements with fade-in classes)
 */
export function setupFadeInOnScroll({
  rootMargin = '0px',
  threshold = 0.1,
  selector = '.view-first-fade-in, .view-first-fade-in-100, .view-first-fade-in-300, .view-first-fade-in-400, .view-first-fade-in-500, .view-first-fade-in-600'
}: {
  rootMargin?: string;
  threshold?: number;
  selector?: string;
} = {}) {
  if (typeof window === 'undefined') return;

  // Create observer instance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Once the animation is triggered, we don't need to observe this element anymore
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin, threshold }
  );

  // Start observing elements
  function observeElements() {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      // Reset the animation state by removing in-view class
      element.classList.remove('in-view');
      observer.observe(element);
    });
  }

  // Run once when loaded
  if (document.readyState === 'complete') {
    observeElements();
  } else {
    window.addEventListener('load', observeElements);
  }

  // Also observe new elements that might be added to the DOM later
  return {
    refresh: observeElements,
    observer
  };
}

/**
 * Apply a staggered delay to fade-in elements
 * @param containerSelector - Selector for the container with fade-in children
 * @param delayIncrement - Delay increment between each child in ms
 * @param startDelay - Initial delay for the first element in ms
 */
export function applyStaggeredFadeIn(
  containerSelector: string,
  delayIncrement = 100,
  startDelay = 0
): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const items = Array.from(container.querySelectorAll(
      '.view-first-fade-in, .view-first-fade-in-100, .view-first-fade-in-300, .view-first-fade-in-400, .view-first-fade-in-500, .view-first-fade-in-600'
    ));

    items.forEach((item, index) => {
      const delay = startDelay + (index * delayIncrement);
      (item as HTMLElement).style.animationDelay = `${delay}ms`;
    });
  });
}