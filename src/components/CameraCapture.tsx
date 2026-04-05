/** Show a camera selfie to take a photo. */

import FaceOverlay from '@/components/camera-overlay/face';
import { Button } from '@/components/ui/Button';
import { toastError } from '@/lib/toast';
import { Camera, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';


interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  aspectRatio?: number; // e.g., 1 for square, 3/4 for portrait
  showFaceOverlay?: boolean;
}

export default function CameraCapture(
  { onCapture, onClose, showFaceOverlay = true, aspectRatio = 1 }: CameraCaptureProps
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGuide] = useState(true);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setIsLoading(true);
        console.log('Attempting to access camera...');
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        console.log('Camera access granted:', currentStream.active, 'tracks:', currentStream.getVideoTracks().length);
        setStream(currentStream);

        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;

          // Add loadedmetadata event listener
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            setIsLoading(false);
            videoRef.current?.play().catch(playError => {
              console.error('Error attempting to play video:', playError);
              setError('Could not play the video stream. Please check your browser permissions.');
              toastError('Error with camera. Please check your browser permissions.');
            });
          };

          // Add playing event listener
          videoRef.current.onplaying = () => {
            console.log('Video is now playing');
            setIsLoading(false);
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access the camera. Please check permissions.');
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      // Cleanup: Stop the stream tracks when the component unmounts or stream changes
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Run only once on mount

  const handleCapture = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Calculate dimensions based on aspect ratio
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        let drawWidth = videoWidth;
        let drawHeight = videoHeight;
        let offsetX = 0;
        let offsetY = 0;

        // Adjust drawing dimensions to fit the desired aspect ratio within the video feed
        if (videoWidth / videoHeight > aspectRatio) {
          // Video is wider than aspect ratio (crop sides)
          drawWidth = videoHeight * aspectRatio;
          offsetX = (videoWidth - drawWidth) / 2;
        } else {
          // Video is taller than aspect ratio (crop top/bottom)
          drawHeight = videoWidth / aspectRatio;
          offsetY = (videoHeight - drawHeight) / 2;
        }

        // Set canvas size to match desired output dimensions (can be scaled later)
        // Let's use a reasonable fixed size for the canvas to avoid huge files
        const outputWidth = 600;
        canvas.width = outputWidth;
        canvas.height = outputWidth / aspectRatio;

        // Flip the canvas horizontally to match the mirrored preview
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        // Draw the cropped/adjusted video frame onto the canvas
        context.drawImage(
          video,
          offsetX,          // Source X
          offsetY,          // Source Y
          drawWidth,        // Source Width
          drawHeight,       // Source Height
          0,                // Destination X
          0,                // Destination Y
          canvas.width,     // Destination Width
          canvas.height     // Destination Height
        );

        // Convert canvas to Blob, then to File
        canvas.toBlob(blob => {
          if (blob) {
            const fileName = `capture-${Date.now()}.jpg`;
            const file = new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() });
            onCapture(file); // Pass the file back to the parent
          } else {
            console.error('Failed to create blob from canvas');
            setError('Failed to capture image.');
          }
        }, 'image/jpeg', 0.9); // Use JPEG format with 90% quality
      }
    } else {
      setError('Camera not ready or stream not available.');
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
      <div className='bg-card p-4 rounded-lg max-w-lg w-full relative'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleClose}
          className='absolute top-2 right-2 text-muted-foreground'
          aria-label='Close camera'
        >
          <X className='h-5 w-5' />
        </Button>
        {error && (
          <div className='text-destructive text-center mb-4 p-2 bg-destructive/10 rounded'>
            {error}
          </div>
        )}
        <div className='relative aspect-w-1 aspect-h-1 bg-muted rounded overflow-hidden mb-4' style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center text-muted-foreground'>
              Starting camera...
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className='absolute inset-0 w-full h-full object-cover'
            style={{
              display: stream ? 'block' : 'none',
              transform: 'scaleX(-1)' // Flip horizontally
            }}
          />

          {/* Positioning overlay */}
          {showGuide && stream && !isLoading && (
            <div className='absolute inset-0 pointer-events-none'>
              <div className='h-full w-full flex flex-col items-center justify-center'>

                {showFaceOverlay && <FaceOverlay />}

              </div>
            </div>
          )}
        </div>
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className='flex justify-between items-center relative'>
          <Button
            variant='outline'
            onClick={(e) => handleClose(e)}
            type='button'
            aria-label='Cancel'
            size='sm'
            className='absolute left-0'
          >
            <X className='h-5 w-5' />
          </Button>

          <div className='w-full flex justify-center'>
            <Button
              onClick={(e) => handleCapture(e)}
              disabled={!stream || !!error || isLoading}
              className='action-btn'
              type='button'
              aria-label='Capture photo'
              size='sm'
              variant='default'
            >
              <Camera className='h-6 w-6' />
            </Button>
          </div>
        </div>
        {/* {stream && !isLoading && (
            <Button
              variant='ghost'
              onClick={() => setShowGuide(!showGuide)}
              type='button'
              className='ml-auto'
            >
              {showGuide ? <><Smile className='h-4 w-4' /></> : (
                <div className='relative'>
                  <Smile className='h-4 w-4' />
                  <X className='h-4 w-4 absolute top-0 left-0 text-destructive opacity-80' />
                </div>
              )}
            </Button>
          )} */}
      </div>
    </div>
  );
};
