#!/bin/bash
set -e
cd "$(dirname "$0")"
OUT="$(cd .. && pwd)/next/index.html"
{
cat <<'H'
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0b0a0e">
<title>Eternal Hoard – The Last Warmth</title>
<link rel="icon" href="../icon-192.png">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap">
<style>
H
cat style.css
echo '</style></head><body><div id="app"></div><script>'
cat sil.js data.js engine.js story.js chapter2.js chapter3.js battle.js ui.js
echo '</script></body></html>'
} > "$OUT"
node -e "const fs=require('fs');const h=fs.readFileSync('$OUT','utf8');const js=h.split('<script>')[1].split('</script>')[0];new Function(js);console.log('syntax ok',Math.round(h.length/1024)+'KB')"
