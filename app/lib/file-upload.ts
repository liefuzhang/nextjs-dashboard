import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate unique filename
  const fileExtension = file.name.split('.').pop()
  const uniqueFilename = `${randomUUID()}.${fileExtension}`
  
  // Create the upload path (public/customers/)
  const uploadDir = join(process.cwd(), 'public', 'customers')
  const filePath = join(uploadDir, uniqueFilename)

  // Save the file
  await writeFile(filePath, buffer)
  
  // Return the public URL path
  return `/customers/${uniqueFilename}`
}

export function getFileFromFormData(formData: FormData, fieldName: string): File | null {
  const file = formData.get(fieldName) as File
  if (!file || file.size === 0) {
    return null
  }
  return file
}