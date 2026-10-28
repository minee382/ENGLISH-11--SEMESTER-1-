import {readFileSync,writeFileSync} from 'node:fs';
import {getQuestionBank} from '../src/question-bank.mjs';
import {uniqueValidQuestions,contentKey} from '../src/smart-replay.mjs';
const src=readFileSync('src/App.jsx','utf8');
const datasets=Function(src.slice(src.indexOf('const UNIT_1_VERIFIED_WORDS'),src.indexOf('const TRANSLATIONS'))+';return VOCABULARY_DATASETS;')();
const duplicates=(arr,key)=>Object.entries(Object.groupBy(arr,key)).filter(([_,v])=>v.length>1).map(([key,v])=>({key,ids:v.map(q=>q.id)}));
let all=[];
const units=Object.fromEntries(Object.entries(datasets).map(([unit,words])=>{
 const bank=getQuestionBank(unit,words),valid=uniqueValidQuestions(bank);all.push(...bank);
 return [unit,{vocabularyRecords:words.length,questionRecords:bank.length,uniqueEligible:valid.length,grammar:valid.filter(q=>q.kind==='grammar').length,vocabulary:valid.filter(q=>q.kind==='vocabulary').length,examSkills:valid.filter(q=>q.kind==='exam').length,examPool:valid.length,exerciseTypes:Object.fromEntries(Object.entries(Object.groupBy(valid,q=>q.exerciseType)).map(([k,v])=>[k,v.length])),duplicateIds:duplicates(bank,q=>q.id),duplicateContent:duplicates(bank,contentKey),missingAnswers:bank.filter(q=>!q.correct).map(q=>q.id),missingExplanations:bank.filter(q=>!q.explanation).map(q=>q.id),missingTopic:bank.filter(q=>!q.topic).length,missingDifficulty:bank.filter(q=>!q.difficulty).length,missingSource:bank.filter(q=>!q.sourceRef).length,invalidQuestions:bank.filter(q=>!uniqueValidQuestions([q]).length).map(q=>q.id)}];
}));
const report={units,global:{records:all.length,uniqueEligible:uniqueValidQuestions(all).length,duplicateIds:duplicates(all,q=>q.id),duplicateContent:duplicates(all,contentKey)}};
writeFileSync('audit/after.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
