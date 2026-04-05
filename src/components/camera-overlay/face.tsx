import SmileOverlay from "@/components/camera-overlay/smile";

/* Face outline - positioned above the video */
export default function FaceOverlay() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SmileOverlay />
    </div>
  )
}
