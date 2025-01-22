import csv
import json

# Načíst CSV soubor
csv_file = 'steel_data.csv'
data = {}

with open(csv_file, mode='r', encoding='utf-8') as file:
    reader = csv.reader(file, delimiter=';')
    headers = []
    for i, row in enumerate(reader):
        if i == 0:
            headers = row[2:]  # První řádek obsahuje názvy veličin
        elif i == 1:
            continue  # Druhý řádek je popis jednotek, ignorujeme
        else:
            section_type, section_size = row[:2]  # Typ průřezu a velikost
            values = row[2:]  # Odpovídající hodnoty

            # Přidáme data do slovníku s typem průřezu a velikostí
            if section_type not in data:
                data[section_type] = {}
            data[section_type][section_size] = {
                'headers': headers,
                'values': values
            }

# Převést data do JavaScriptového formátu
js_data = json.dumps(data, ensure_ascii=False, indent=4)

# Uložit do .js souboru
with open('steel_data.js', 'w', encoding='utf-8') as js_file:
    js_file.write(f"const csvData = {js_data};\n")
