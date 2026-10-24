import { seedImages } from '../src/cloudinary/seed.js';
import { config } from '../src/config.js';
const overwrite = process.argv.includes('--overwrite');
const n = await seedImages({ overwrite });
console.log(`${n} new image(s) uploaded (${config.cloudinary.mock ? 'mock' : 'Cloudinary'}).`);
