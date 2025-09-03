"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentImageUrl?: string;
  customerName?: string;
  disabled?: boolean;
}

export default function AvatarUpload({
  currentImageUrl,
  customerName = "",
  disabled = false,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayImageUrl = previewUrl || currentImageUrl;
  const fallbackText = getInitials(customerName) || "U";

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>

      <div className="flex items-center gap-4">
        {/* Avatar Preview */}
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={displayImageUrl || undefined}
              alt={customerName}
            />
            <AvatarFallback className="text-lg">
              {displayImageUrl ? null : <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>

          {/* Remove button for uploaded images */}
          {(previewUrl || currentImageUrl) && !disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled}
          >
            <Upload className="w-4 h-4 mr-2" />
            {currentImageUrl || previewUrl ? "Change Photo" : "Upload Photo"}
          </Button>

          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF (max. 2MB)
          </p>
        </div>

        {/* Hidden file input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
          name="avatar"
        />
      </div>
    </div>
  );
}
