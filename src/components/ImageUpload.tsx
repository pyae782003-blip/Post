"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Get secure signature from our backend
      const signResponse = await fetch("/api/cloudinary/sign", { method: "POST" });
      const signData = await signResponse.json();

      if (!signResponse.ok) {
        throw new Error(signData.error || "Failed to get upload signature");
      }

      // 2. Upload file to Cloudinary with signature
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.api_key);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();
      onChange(uploadData.secure_url);
    } catch (error) {
      toast.error("Failed to upload image.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-800">
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Image
          fill
          src={value}
          alt="Uploaded preview"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group relative">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-slate-400 dark:text-slate-500 animate-spin mb-2" />
          ) : (
            <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2 group-hover:text-blue-500 transition-colors" />
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isUploading ? (
              "Uploading to Cloudinary..."
            ) : (
              <>
                <span className="font-semibold">Click to upload</span> an image
              </>
            )}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
