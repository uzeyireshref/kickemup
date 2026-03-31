const fs = require('fs');
const text = fs.readFileSync('C:/Users/asus/.gemini/antigravity/brain/b22e5ece-d0f1-4d70-9780-f269bc238413/.system_generated/steps/294/content.md', 'utf8');
const regex = /<img alt="([^"]+)"[^>]+src="([^"]+)"[^>]*\/>[^₺]*₺\s*([\d,.]+)/g;
let match;
let products = [];
while ((match = regex.exec(text)) !== null) {
  let img = match[2];
  if(img.includes('3840/')) img = img.replace('3840/', '1080/');
  products.push({
    name: match[1].replace(/&#x27;/g, "'"),
    price: "₺ " + match[3],
    image: img
  });
}
console.log(JSON.stringify(products.slice(0, 16), null, 2));
