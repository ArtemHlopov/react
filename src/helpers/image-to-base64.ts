const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

export function imageToBase64(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Promise.reject(new Error('Only PNG and JPEG images are allowed'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
