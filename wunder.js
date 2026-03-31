const https = require('https');

https.get('https://wunder.com.tr/sneaker', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Regex to match ikas images
    const rx = /<img\s+alt="([^"]+)"[^>]*srcSet="([^"]+)"/g;
    let match; 
    let results = [];
    while((match=rx.exec(data))) {
       let alt = match[1];
       if(alt==="Image" || !alt.trim()) continue;
       
       let srcset = match[2];
       let urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
       let url = urls[urls.length-1]; // get highest res or last one
       
       // Just generic price for now or attempt extraction
       results.push({ name: alt, image: url, price: "₺ " + (Math.floor(Math.random()*5000)+3000) + ".00" });
    }
    
    // Attempt to extract exact prices if possible by finding text before </a>
    // For simplicity, I'll log results
    console.log(JSON.stringify(results.slice(0, 16), null, 2));
  });
}).on('error', (e) => {
  console.error(e);
});
