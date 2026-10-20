// Responsive, format-negotiated images. f_auto/q_auto cuts bytes on low-end phones and slow networks.
import { getStore } from './store.js';
import { paths } from './paths.js';

const WIDTHS = [160, 320, 480, 720];

export function imageUrl(kind, name, w = 480) {
  return getStore().url(paths.imageId(kind, name), {
    resourceType: 'image',
    tx: { transformation: [{ width: w, crop: 'limit', fetch_format: 'auto', quality: 'auto' }] },
  });
}
export function imageSet(kind, name, sizes = '(max-width: 600px) 90vw, 480px') {
  return { src: imageUrl(kind, name, 480), srcset: WIDTHS.map((w) => `${imageUrl(kind, name, w)} ${w}w`).join(', '), sizes, alt: name };
}
