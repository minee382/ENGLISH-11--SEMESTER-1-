import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
await build({entryPoints:['src/main.jsx'],bundle:true,minify:true,outfile:'dist/app.js',define:{'process.env.NODE_ENV':'"production"'}});
execFileSync('node',['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/style.css','-o','dist/style.css','--minify'],{stdio:'inherit'});
