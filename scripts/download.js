import https from 'https';
import fs from 'fs';
import path from 'path';

const urls = [
  { name: 'hero_bg.jpg', url: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80' },
  { name: 'gallery_1.jpg', url: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'gallery_2.jpg', url: 'https://images.unsplash.com/photo-1568212678832-6a7c3f3f5087?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'gallery_3.jpg', url: 'https://images.unsplash.com/photo-1628172421375-7b565a0db8db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'gallery_4.jpg', url: 'https://images.unsplash.com/photo-1510484050218-e3acba07ced0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { name: 'event_1.jpg', url: 'https://images.unsplash.com/photo-1541814674722-ad0b36214341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'event_2.jpg', url: 'https://images.unsplash.com/photo-1568212678832-6a7c3f3f5087?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'event_3.jpg', url: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const dir = path.join(process.cwd(), 'public', 'images');
fs.mkdirSync(dir, { recursive: true });

async function download() {
  for (const item of urls) {
    const dest = path.join(dir, item.name);
    await new Promise((resolve, reject) => {
      https.get(item.url, (res) => {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${item.name}`);
          resolve(null);
        });
      }).on('error', (err) => {
        console.error(`Error downloading ${item.name}: ${err.message}`);
        reject(err);
      });
    });
  }
}

download().then(() => console.log('All downloads completed!'));
