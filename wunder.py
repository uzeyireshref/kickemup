import urllib.request
import re
import json
import time

urls = {
    'sneaker': 'https://wunder.com.tr/sneaker',
    'giyim': 'https://wunder.com.tr/giyim',
    'aksesuar': 'https://wunder.com.tr/aksesuar'
}

all_products = {}

img_rx = re.compile(r'<img\s+alt="([^"]+)"[^>]*srcSet="([^"]+)"')

for category, url in urls.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            matches = img_rx.findall(html)
            
            results = []
            for match in matches:
                salt = match[0]
                if salt == "Image" or salt.strip() == "": continue
                srcset = match[1]
                urls_parsed = [s.strip().split(' ')[0] for s in srcset.split(',') if s.strip()]
                img_url = urls_parsed[-1] if urls_parsed else ""
                
                if "3840/" in img_url:
                    img_url = img_url.replace("3840/", "1080/")
                
                # Assign a generic price based on category
                if category == 'sneaker': price = "₺ " + str(4000 + len(results)*100) + ".00"
                elif category == 'giyim': price = "₺ " + str(1500 + len(results)*50) + ".00"
                else: price = "₺ " + str(500 + len(results)*20) + ".00"
                
                results.append({"name": salt.replace("&#x27;", "'"), "image": img_url, "price": price, "category": category})
                if len(results) == 10: break
                
            all_products[category] = results
            print(f"Scraped 10 from {category}")
    except Exception as e:
        print("Error on", category, e)
    time.sleep(1)

with open('wunder_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_products, f, indent=2)
print("Saved to wunder_data.json")
