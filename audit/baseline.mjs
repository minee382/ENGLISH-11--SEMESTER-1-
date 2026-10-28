import {readFileSync,writeFileSync} from 'node:fs';
import {GRAMMAR_BANK,buildBank} from '../src/learning-data.mjs';
const src=readFileSync('src/App.jsx','utf8');
const words=Function(src.slice(src.indexOf('const UNIT_1_VERIFIED_WORDS'),src.indexOf('const TRANSLATIONS'))+';return VOCABULARY_DATASETS;')();
const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[“”"'‘’.,!?;:]/g,'').replace(/\s+/g,' ').trim();
const duplicates=(arr,key)=>Object.entries(Object.groupBy(arr,key)).filter(([_,v])=>v.length>1).map(([key,v])=>({key,ids:v.map(q=>q.id)}));
const units=Object.fromEntries(Object.entries(words).map(([unit,w])=>{
 const bank=buildBank(unit,w);return [unit,{vocabularyRecords:w.length,grammar:GRAMMAR_BANK[unit].length,vocabulary:bank.filter(q=>q.kind==='vocabulary').length,examPool:bank.length,exerciseTypes:{'multiple-choice':bank.length},uniqueContent:new Set(bank.map(q=>norm(q.prompt))).size,duplicateIds:duplicates(bank,q=>q.id),duplicateContent:duplicates(bank,q=>norm(q.prompt)),missingAnswers:bank.filter(q=>!q.correct).map(q=>q.id),missingExplanations:bank.filter(q=>!q.explanation).map(q=>q.id),missingTopic:bank.filter(q=>!q.topic).length,missingDifficulty:bank.filter(q=>!q.difficulty).length,missingSource:bank.filter(q=>!q.sourceRef).length}];
}));
const report={commit:'29e0598c8d3a1360a1db526946b68ca00e244f4f',units};writeFileSync('audit/before.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
