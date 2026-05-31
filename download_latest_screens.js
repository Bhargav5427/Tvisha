import fs from 'fs';
import path from 'path';
import https from 'https';

const screens = [
  {"title": "Product Inventory | TVISHA Admin", "name": "admin_inventory.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc1M2EyYmY0OTQ5YjQ1NTk5N2Y2YmI0ZjQ1YThkZGVjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Order Management | Admin Portal", "name": "admin_orders_portal.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI5YjgxMzZkYTM2NzRhMjM5YmI1Mzc4ZGU2MTg4ZWYyEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Users & Support | TVISHA Admin", "name": "admin_users.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzIyYTFmZDM0NTA5NDRmYzhhMWU4Mzg3MjcwYTIzMWJjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Admin Dashboard | TVISHA Portal", "name": "admin_dashboard.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA0NDc0M2Y0Y2YxOTRiMTM5YjkxZjIxY2ViOWU1YzZiEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "All Collections | VastraLuxe", "name": "collections_vastraluxe.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZhMjRjN2Q2ZmU4NzQ0NjE4MzZmMWY2ZWJkMGI4NzQyEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Order Management | TVISHA Admin", "name": "admin_orders_tvisha.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2E1ZDM2NWQzOGQ3YjRlNGQ4ZTdiZmY1OTg3N2EwODZjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Product Details | TVISHA", "name": "details.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzJjYmMzMjE0MjgzOTRhODM5MzAwZTY1Y2MwODA2MzhjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Checkout & Success | TVISHA", "name": "checkout.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FiNzAyY2ZlN2Y3YTQ0OGNiNDZhNTAxOTc0ZDY2OWY4EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Contact Us | TVISHA Support", "name": "contact.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzkxNmE5YTNmYjgyYTRjNTlhNGY5OTY1NmQ1NzY4NjVjEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "About Us | TVISHA Heritage", "name": "about.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzBiNTk3NzMyMjZmNzQ5NzliMDlhODFjYWU0NjFiYWU5EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "TVISHA Brand Logo", "name": "logo.svg", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzlhNmQxZjRkNzk2MzQ1MTdhZWNjMjZiOWJjZjMwYTc1EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "TVISHA - Premium Ethnic Wear Home", "name": "home.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdkNDUwN2FhNzgwODQ2ZTFiNzFmMzUzYmM4MmU2ZmRhEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "Admin Overview | VastraLuxe Portal", "name": "admin_overview_vastraluxe.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2RjMWFlZTAyY2EwNjRmMTI5ZTBiMWU1ODUyZDExODFmEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "All Collections | TVISHA", "name": "collections.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU5ZmU3YjU5MzA1NzQ0ZDk5NDc5OWNjODY1ZmI3NTg1EgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"},
  {"title": "VastraLuxe - Premium Ethnic Wear", "name": "vastraluxe_home.html", "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE2MzhjMDY1ZTY3NzRiOTY5MDUyN2VhY2ViNzI5OWFlEgsSBxD1l4aIxAMYAZIBIwoKcHJvamVjdF9pZBIVQhMyNDg1MzI2ODU5Mzk2NTE0MjUy&filename=&opi=89354086"}
];

const outputDir = path.resolve('temp_html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Starting download of updated Stitch screens...');

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
        console.log(`Downloaded ${file.name} (${file.title})`);
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
    console.log('All updated screens downloaded successfully to temp_html/');
  })
  .catch((err) => {
    console.error('Error downloading screens:', err);
  });
