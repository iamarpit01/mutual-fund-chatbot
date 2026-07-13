import os
import requests
from bs4 import BeautifulSoup
import time

URLS = [
    "https://groww.in/mutual-funds/icici-prudential-large-cap-fund-direct-growth",
    "https://groww.in/mutual-funds/icici-prudential-midcap-fund-direct-growth",
    "https://groww.in/mutual-funds/icici-prudential-indo-asia-equity-fund-direct-growth",
    "https://groww.in/mutual-funds/icici-prudential-i-come-fund-direct-growth",
    "https://groww.in/mutual-funds/icici-prudential-corporate-bond-fund-direct-growth"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def clean_and_slice_html(html_content, fund_url):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Extract JSON before removing scripts
    structured_data_block = ""
    next_data = soup.find('script', id='__NEXT_DATA__')
    if next_data:
        import json
        try:
            data = json.loads(next_data.text)
            # Extract explicit metadata for the 3 upfront cards to ensure perfect semantic matching
            expense_ratio = ""
            exit_load = ""
            fund_managers_str = ""
            
            try:
                server_data = data.get("props", {}).get("pageProps", {}).get("mfServerSideData", {})
                
                # 1. Expense Ratio
                if "expense_ratio" in server_data:
                    expense_ratio = f"Expense Ratio: {server_data['expense_ratio']}%"
                
                # 2. Exit Load
                if "exit_load" in server_data:
                    exit_load = f"Exit Load: {server_data['exit_load']}"
                
                # 3. Fund Managers
                managers = server_data.get("fund_manager_details", [])
                if managers:
                    unique_managers = []
                    for m in managers:
                        if isinstance(m, dict) and "person_name" in m:
                            unique_managers.append(m["person_name"])
                    if unique_managers:
                        fund_managers_str = f"Fund Managers for this scheme: {', '.join(unique_managers)}"
                        
                fund_name = server_data.get("scheme_name", "") or server_data.get("fund_name", "")
                search_alias = fund_url.split('/')[-1].replace('-', ' ').title()
                
                # Combine them into a clean block
                structured_data_block = "\n\n"
                if search_alias: structured_data_block += f"Search Alias: {search_alias}\n"
                if fund_name: structured_data_block += f"Fund Name: {fund_name}\n"
                if expense_ratio: structured_data_block += expense_ratio + "\n"
                if exit_load: structured_data_block += exit_load + "\n"
                if fund_managers_str: structured_data_block += fund_managers_str + "\n"
                
            except Exception as e:
                print(f"Failed to parse JSON for structured data: {e}")
                structured_data_block = ""
        except Exception as e:
            print(f"Failed to parse main JSON: {e}")

    # 2. Proceed with old extraction
    for element in soup(["script", "style", "nav", "footer", "header", "svg"]):
        element.extract()
        
    text = soup.get_text(separator='\n')
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    
    start_idx = 0
    end_idx = len(lines)
    
    # Heuristic: The actual data block always starts around "NAV:" and ends before "Contact Us" or "Download the App"
    for i, line in enumerate(lines):
        if line.startswith("NAV:") and start_idx == 0:
            start_idx = max(0, i - 15)  # give some breathing room for 3Y returns above NAV
        if line in ["Contact Us", "Download the App", "Home >"]:
            end_idx = min(end_idx, i)
            
    sliced_lines = lines[start_idx:end_idx]
    return '\n'.join(sliced_lines) + structured_data_block

def scrape_data():
    os.makedirs("data", exist_ok=True)
    print("Starting data ingestion process...")
    for url in URLS:
        print(f"Fetching {url}...")
        try:
            response = requests.get(url, headers=HEADERS)
            response.raise_for_status()
            
            clean_text = clean_and_slice_html(response.text, url)
            
            filename = url.split("/")[-1] + ".txt"
            filepath = os.path.join("data", filename)
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"Source URL: {url}\n\n")
                f.write(clean_text)
                
            print(f"Successfully saved clean text to {filepath}")
            time.sleep(2)
        except Exception as e:
            print(f"Error fetching {url}: {e}")

if __name__ == "__main__":
    scrape_data()
