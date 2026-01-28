import React, { useRef, useState } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FileUploadProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  accept?: string;
  className?: string;
}

export function FileUpload<T extends FieldValues>({
  name,
  control,
  label,
  accept = 'image/*',
  className = ''
}: FileUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsUploading(true);
                    setUploadError(null);
                    try {
                      const base64 = await handleFileToBase64(file);
                      field.onChange(base64);
                    } catch (error) {
                      console.error('Error converting file to base64:', error);
                      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
                      field.onChange(''); // Clear the field on error
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }}
              />
              {field.value && !isUploading && (
                <div className="flex items-center space-x-2">
                  <img
                    src={field.value}
                    alt="Logo preview"
                    className="h-12 w-12 object-contain border border-gray-300 rounded"
                    onError={() => setUploadError('Failed to display image preview')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange('');
                      setUploadError(null);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            
            {uploadError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {uploadError}
              </div>
            )}
            
            {error && (
              <span className="text-sm text-red-600">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}