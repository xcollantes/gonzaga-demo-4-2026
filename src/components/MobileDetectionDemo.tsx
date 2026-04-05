import { useMobile } from '@/contexts/MobileContext';
import React from 'react';

export function MobileDetectionDemo() {
  const { isMobile } = useMobile();

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
      <h3 className="text-lg font-medium mb-2">Device Detection</h3>
      <div className="flex flex-col space-y-2">
        <p className="text-sm">
          Current device type: <strong>{isMobile ? 'Mobile' : 'Desktop'}</strong>
        </p>
        <p className="text-sm">
          Viewport width: <span id="viewport-width" className="font-mono">Calculating...</span>
        </p>
        <div className={`p-2 rounded ${isMobile ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
          <p className="text-sm">
            {isMobile
              ? 'Mobile-optimized UI is active'
              : 'Desktop UI is active'}
          </p>
        </div>

        {/* Hidden script to update viewport width */}
        <script dangerouslySetInnerHTML={{
          __html: `
            function updateViewportWidth() {
              const element = document.getElementById('viewport-width');
              if (element) element.textContent = window.innerWidth + 'px';
            }
            updateViewportWidth();
            window.addEventListener('resize', updateViewportWidth);
          `
        }} />
      </div>
    </div>
  );
}