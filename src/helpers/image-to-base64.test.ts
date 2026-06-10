import { describe, it, expect } from 'vitest';
import { imageToBase64, ALLOWED_IMAGE_TYPES } from './image-to-base64';

describe('ALLOWED_IMAGE_TYPES', () => {
  it('contains png and jpeg', () => {
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png');
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
  });
});

describe('imageToBase64', () => {
  it('rejects files with wrong type', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    await expect(imageToBase64(file)).rejects.toThrow(
      'Only PNG and JPEG images are allowed'
    );
  });

  it('resolves with a data URL string for valid PNG', async () => {
    const file = new File(['fake'], 'test.png', { type: 'image/png' });
    const result = await imageToBase64(file);
    expect(typeof result).toBe('string');
    expect(result).toContain('data:image/png');
  });

  it('resolves with a data URL string for valid JPEG', async () => {
    const file = new File(['fake'], 'photo.jpg', { type: 'image/jpeg' });
    const result = await imageToBase64(file);
    expect(typeof result).toBe('string');
    expect(result).toContain('data:image/jpeg');
  });
});
