# Animation Effects

## Fade-In Animation

This document describes how to implement fade-in animations for elements in the
client portal application.

## Overview

Fade-in animations provide subtle visual cues to users as elements appear on the
page, creating a more engaging and polished user experience. Our application
provides several ways to implement fade-in effects, depending on your use case.

## View-First Animation System

Our recommended approach is the view-first animation system, which triggers animations when elements enter the viewport.

### 1. Using View-First CSS Classes

Add one of these CSS classes to any element you want to animate when it scrolls into view:

```tsx
<div className="view-first-fade-in">This fades in when it comes into view</div>
```

Available view-first classes with different durations:

- `view-first-fade-in`: 0.8s duration (default)
- `view-first-fade-in-100`: 0.1s duration (very fast)
- `view-first-fade-in-300`: 0.3s duration (fast)
- `view-first-fade-in-400`: 0.4s duration (medium-fast)
- `view-first-fade-in-500`: 0.5s duration (medium)
- `view-first-fade-in-600`: 0.6s duration (medium-slow)

### 2. Using the useFadeInView Hook

For more control, use the `useFadeInView` hook in your component:

```tsx
import { useFadeInView } from "@/lib/hooks/useFadeInView"

function MyComponent() {
  // Initialize with default settings
  useFadeInView()

  return (
    <div>
      <div className="view-first-fade-in">
        This fades in when it comes into view
      </div>
      <div className="view-first-fade-in-300">This fades in faster</div>
    </div>
  )
}
```

With custom options:

```tsx
import { useFadeInView } from "@/lib/hooks/useFadeInView"

function MyComponent() {
  // Custom configuration
  useFadeInView({
    rootMargin: "0px 0px -100px 0px", // Trigger when 100px from bottom of viewport
    threshold: 0.2, // Trigger when 20% visible
  })

  return (
    <div>
      <div className="view-first-fade-in">
        This fades in when it comes into view
      </div>
    </div>
  )
}
```

### 3. Single Element Animation

For individual elements, use the `useElementFadeIn` hook:

```tsx
import { useElementFadeIn } from "@/lib/hooks/useFadeInView"

function SingleElementFade() {
  const elementRef = useElementFadeIn()

  return (
    <div ref={elementRef} className="view-first-fade-in">
      This element will fade in when it comes into view
    </div>
  )
}
```

## Staggered Animation

For creating staggered animations (elements that fade in one after another):

```tsx
import { useEffect } from "react"
import { applyStaggeredFadeIn } from "@/lib/view-first-animation-utils"

function StaggeredList() {
  useEffect(() => {
    // Apply staggered animations to a list of items
    applyStaggeredFadeIn(
      ".staggered-container", // Container selector
      100, // 100ms between each animation
      0 // no initial delay
    )
  }, [])

  return (
    <ul className="staggered-container">
      <li className="view-first-fade-in">Item 1</li>
      <li className="view-first-fade-in">Item 2</li>
      <li className="view-first-fade-in">Item 3</li>
      <li className="view-first-fade-in">Item 4</li>
    </ul>
  )
}
```

## Manual Refresh

If you dynamically add elements to the DOM after initial load, you can refresh the observer:

```tsx
function DynamicContent() {
  const { refresh } = useFadeInView()
  const [items, setItems] = useState([])

  const loadMoreItems = async () => {
    const newItems = await fetchItems()
    setItems([...items, ...newItems])
    // Refresh the observer to detect new elements
    setTimeout(refresh, 100)
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="view-first-fade-in">
          {item.name}
        </div>
      ))}
      <button onClick={loadMoreItems}>Load More</button>
    </div>
  )
}
```

## Implementation Details

### CSS Animation Definition

The fade-in animation is defined in `fade.css`:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hidden state before element comes into view */
.view-first-fade-in {
  opacity: 0;
  will-change: opacity, transform;
  visibility: hidden;
}

/* Animation is applied when in-view class is added */
.view-first-fade-in.in-view {
  animation: fadeIn 0.8s ease-out forwards;
  visibility: visible;
}
```

The system uses Intersection Observer to add the `.in-view` class when elements
enter the viewport.

## Best Practices

1. **Use Sparingly**: Apply fade-in effects to key UI elements, but avoid
   overusing them as this can slow down perceived performance.

2. **Keep Animations Short**: The default duration of 0.8s is generally
   appropriate. For critical UI elements, consider using shorter durations.

3. **Consider Mobile**: On mobile devices, animations can be more
   resource-intensive. Test performance on various devices.

4. **Accessibility**: Some users may prefer reduced motion. Add this to your CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .view-first-fade-in.in-view,
  .view-first-fade-in-100.in-view,
  .view-first-fade-in-300.in-view,
  .view-first-fade-in-400.in-view,
  .view-first-fade-in-500.in-view,
  .view-first-fade-in-600.in-view {
    animation: none;
    opacity: 1;
    visibility: visible;
  }
}
```

## Examples

### Section with Multiple Animated Elements

```tsx
function FeatureSection() {
  // Initialize animations with default settings
  useFadeInView()

  return (
    <section className="py-12">
      <h2 className="view-first-fade-in text-2xl font-bold">Our Features</h2>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="view-first-fade-in-300">
          <h3 className="text-xl font-bold">Feature 1</h3>
          <p>Description of this amazing feature</p>
        </div>

        <div className="view-first-fade-in-400">
          <h3 className="text-xl font-bold">Feature 2</h3>
          <p>Description of another amazing feature</p>
        </div>

        <div className="view-first-fade-in-500">
          <h3 className="text-xl font-bold">Feature 3</h3>
          <p>Description of yet another amazing feature</p>
        </div>
      </div>
    </section>
  )
}
```

## Troubleshooting

- **Elements Not Fading In**: Ensure the `useFadeInView` hook is called in your component.

- **Animation Jumping**: If elements jump during animation, ensure proper height
  management. Consider setting explicit heights for containers or use `min-height`.

- **Performance Issues**: If animations cause performance problems, reduce the
  number of animated elements or use simpler animations with shorter durations.
