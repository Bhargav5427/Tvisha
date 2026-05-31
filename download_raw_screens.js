import fs from 'fs';
import path from 'path';
import https from 'https';

const screens = [
  { name: 'logo.svg', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzlhNmQxZjRkNzk2MzQ1MTdhZWNjMjZiOWJjZjMwYTc1EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'home.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdkNDUwN2FhNzgwODQ2ZTFiNzFmMzUzYmM4MmU2ZmRhEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'collections.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU5ZmU3YjU5MzA1NzQ0ZDk5NDc5OWNjODY1ZmI3NTg1EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'details.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzJjYmMzMjE0MjgzOTRhODM5MzAwZTY1Y2MwODA2MzhjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'checkout.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FiNzAyY2ZlN2Y3YTQ0OGNiNDZhNTAxOTc0ZDY2OWY4EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'about.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzBiNTk3NzMyMjZmNzQ5NzliMDlhODFjYWU0NjFiYWU5EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'contact.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzkxNmE5YTNmYjgyYTRjNTlhNGY5OTY1NmQ1NzY4NjVjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'admin_dashboard.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA0NDc0M2Y0Y2YxOTRiMTM5YjkxZjIxY2ViOWU1YzZiEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'admin_inventory.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc1M2EyYmY0OTQ5YjQ1NTk5N2Y2YmI0ZjQ1YThkZGVjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'admin_orders.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2E1ZDM2NWQzOGQ3YjRlNGQ4ZTdiZmY1OTg3N2EwODZjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' },
  { name: 'admin_users.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzIyYTFmZDM0NTA5NDRmYzhhMWU4Mzg3MjcwYTIzMWJjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086' }
];

const outputDir = path.resolve('temp_html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('Starting download of Stitch screens...');

const downloadFile = (file) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(outputDir, file.name);
    const fileStream = fs.createWriteStream(dest);
    
    https.get(file.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${file.name}: Status ${response.statusCode}`));
        return;
      }
      
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${file.name}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

Promise.all(screens.map(downloadFile))
  .then(() => {
    console.log('All screens downloaded successfully to temp_html/');
  })
  .catch((err) => {
    console.error('Error downloading screens:', err);
  });
