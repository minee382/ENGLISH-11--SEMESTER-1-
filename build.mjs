import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,copyFileSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
await build({entryPoints:['src/main.jsx'],bundle:true,minify:true,outfile:'dist/app.js',define:{'process.env.NODE_ENV':'"production"'},loader:{'.svg':'dataurl','.png':'dataurl','.jpg':'dataurl','.webp':'dataurl'}});
execFileSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/style.css','-o','dist/style.css','--minify'],{stdio:'inherit'});
writeFileSync('dist/index.html',`<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#fff6f0"><meta name="description" content="English Success 11 — luyện từ vựng, ngữ pháp và luyện thi Units 1–4"><title>English Success 11</title><link rel="stylesheet" href="./style.css"></head>\n<body><div id="root"></div><script defer src="./app.js"></script></body>\n</html>\n`);
console.log('Build ready: dist/index.html, dist/app.js, dist/style.css');
