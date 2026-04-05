import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: (file: File) => void;
  accept?: string;
  className?: string;
}

export function UploadButton({ onUpload, accept = "image/*", className }: UploadButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={className}>
      <Input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="w-full action-btn"
      >
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
}
