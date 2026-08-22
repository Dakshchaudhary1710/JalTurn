import os
import re

directory = 'c:/Users/HP/JalTurn/frontend/src/components'
files = [f for f in os.listdir(directory) if f.endswith('.jsx')]

for f in files:
    path = os.path.join(directory, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content
    # Tailwind classes
    new_content = re.sub(r'\btext-slate-950\b', 'text-white', new_content)
    new_content = re.sub(r'\btext-slate-900\b', 'text-white', new_content)
    new_content = re.sub(r'\btext-slate-800\b', 'text-slate-100', new_content)
    new_content = re.sub(r'\btext-slate-700\b', 'text-slate-200', new_content)
    new_content = re.sub(r'\btext-slate-600\b', 'text-slate-300', new_content)
    new_content = re.sub(r'\btext-slate-500\b', 'text-slate-400', new_content)
    
    new_content = re.sub(r'\btext-gray-900\b', 'text-white', new_content)
    new_content = re.sub(r'\btext-gray-800\b', 'text-gray-100', new_content)
    new_content = re.sub(r'\btext-gray-700\b', 'text-gray-200', new_content)
    new_content = re.sub(r'\btext-black\b', 'text-white', new_content)
    
    # Inline colors
    new_content = new_content.replace('color:"#1A1814"', 'color:"#ffffff"')
    new_content = new_content.replace('color: "#1A1814"', 'color: "#ffffff"')
    new_content = new_content.replace('color:"#3A3630"', 'color:"#f8fafc"')
    new_content = new_content.replace('color: "#3A3630"', 'color: "#f8fafc"')
    new_content = new_content.replace('color:"#5C5448"', 'color:"#e2e8f0"')
    new_content = new_content.replace('color: "#5C5448"', 'color: "#e2e8f0"')
    new_content = new_content.replace('color:"#7A7060"', 'color:"#cbd5e1"')
    new_content = new_content.replace('color: "#7A7060"', 'color: "#cbd5e1"')
    new_content = new_content.replace('color:"#9A8E80"', 'color:"#94a3b8"')
    new_content = new_content.replace('color: "#9A8E80"', 'color: "#94a3b8"')
    
    new_content = new_content.replace('color:"black"', 'color:"white"')
    new_content = new_content.replace('color: "black"', 'color: "white"')

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Updated {f}')
