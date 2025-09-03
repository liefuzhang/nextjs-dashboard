import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'

export async function saveUploadedFile(file: File): Promise<string> {
  // Validate file
  if (!file || file.size === 0) {
    throw new Error('No file provided')
  }

  // Validate file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 5MB limit')
  }

  // Validate file type (images only)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed')
  }

  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const uniqueFilename = `customers/${randomUUID()}.${fileExtension}`
    
    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
    })
    
    // Return the public URL
    return blob.url
  } catch (error) {
    console.error('File upload failed:', {
      error: error instanceof Error ? error.message : error,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      stack: error instanceof Error ? error.stack : undefined
    })
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getFileFromFormData(formData: FormData, fieldName: string): File | null {
  const file = formData.get(fieldName) as File
  if (!file || file.size === 0) {
    return null
  }
  return file
}