# UI Components

## Tooltip

A tooltip component that displays informative text when users hover over, focus on, or tap an element.

### Usage

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip"
;<Tooltip>
  <TooltipTrigger>
    <button>Hover me</button>
  </TooltipTrigger>
  <TooltipContent>This is a tooltip</TooltipContent>
</Tooltip>
```

### Components

#### Tooltip

The root component that provides context for the tooltip.

| Prop        | Type              | Default     | Description                                |
| ----------- | ----------------- | ----------- | ------------------------------------------ |
| `children`  | `React.ReactNode` | Required    | The tooltip trigger and content components |
| `className` | `string`          | `undefined` | Optional CSS class names                   |

#### TooltipTrigger

The element that triggers the tooltip.

| Prop       | Type              | Default  | Description                                             |
| ---------- | ----------------- | -------- | ------------------------------------------------------- |
| `children` | `React.ReactNode` | Required | The element to trigger the tooltip                      |
| `asChild`  | `boolean`         | `false`  | When true, passes event handlers to the child component |

#### TooltipContent

The tooltip content that appears when the trigger is hovered or focused.

| Prop         | Type                                     | Default     | Description                             |
| ------------ | ---------------------------------------- | ----------- | --------------------------------------- |
| `children`   | `React.ReactNode`                        | Required    | The content of the tooltip              |
| `className`  | `string`                                 | `undefined` | Optional CSS class names                |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`     | The preferred side to place the tooltip |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'`  | Alignment along the tooltip's side      |
| `sideOffset` | `number`                                 | `5`         | Distance in pixels from the trigger     |

### Examples

#### Basic tooltip

```tsx
<Tooltip>
  <TooltipTrigger>
    <Button>Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>This is a simple tooltip</TooltipContent>
</Tooltip>
```

#### Different positions

```tsx
<Tooltip>
  <TooltipTrigger>
    <Button>Bottom tooltip</Button>
  </TooltipTrigger>
  <TooltipContent side="bottom">Appears below the button</TooltipContent>
</Tooltip>
```

#### Custom styling

```tsx
<Tooltip>
  <TooltipTrigger>
    <span className="underline cursor-help">Help text</span>
  </TooltipTrigger>
  <TooltipContent className="bg-blue-600">
    This tooltip has custom styling
  </TooltipContent>
</Tooltip>
```

See the `TooltipExample.tsx` component for more usage examples.
