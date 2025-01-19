"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2 } from "lucide-react";


export default function FileUpload({
    onSuccess
}: { onSuccess: (res: IKUploadResponse) => void }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //on error handleSuccess handlerstartupload
    const onError = (err: { message: string }) => {
        setError(err.message);
        setUploading(false);
    }

    const handleSuccess = (response: IKUploadResponse) => {
        setError(null);
        setUploading(false);
        onSuccess(response);
    }

    const handleStartUploading = () => {
        setUploading(true);
        setError(null);
    }

    return (
        <div className="space-y-2">
            <IKUpload
                onError={onError}
                onSuccess={handleSuccess}
                onUploadStart={handleStartUploading}
                className="file-input file-input-bordered file-input-primary w-full"
                validateFile={(file: File) => {
                    const validTypes = ["image/jpeg", "image/png", "image/webp"];
                    if (!validTypes.includes(file.type)) {
                        setError("Only JPEG, PNG and WEBP files are allowed");
                        return false;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        setError("File size should be less than 5MB");
                        return false;
                    }
                    return true;
                }}
            />
            {
                uploading &&
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            }
            {error && <div className="text-error text-sm">{error}</div>}
        </div>
    )
}