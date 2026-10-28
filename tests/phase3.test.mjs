import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {getQuestionBank,UNIT1_SOURCE_QUESTIONS} from '../src/question-bank.mjs';
import {GRAMMAR,normalizeProgress} from '../src/learning-data.mjs';
import {HISTORY_KEY,PROGRESS_KEY,uniqueValidQuestions,validateQuestion,beginSession,submitSession,loadHistory,selectQuestions,eligibleQuestions,isCorrect,applyQuizResult,contentKey} from '../src/smart-replay.mjs';
const src=readFileSync('src/App.jsx','utf8');
function datasets(code){return Function(code.slice(code.indexOf('const UNIT_1_VERIFIED_WORDS'),code.indexOf('const TRANSLATIONS'))+';return VOCABULARY_DATASETS;')();}
const words=datasets(src),bank=getQuestionBank('unit1',words.unit1);
const memory=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};};
const config={unit:'unit1',focus:'mixed',exerciseType:'mixed',difficulty:'mixed',count:10,review:false};
function rng(seed=1234){let value=seed;return ()=>((value=(1664525*value+1013904223)>>>0)/4294967296);}
for (const focus of ['grammar','mixed']) {
 test(`${focus}: 3 consecutive ten-question sessions across history reloads have 30 unique IDs and valid shuffled answers`,()=>{
  const storage=memory(),random=rng(345),seen=new Set();
  for(let session=0;session<3;session++){
   const next=beginSession(bank,{...config,focus},storage,1000+session,random);
   assert.equal(next.paper.length,10);assert.ok(next.saved);
   assert.equal(new Set(next.paper.map(contentKey)).size,10);
   for(const q of next.paper){assert.ok(!seen.has(q.id),`repeated ${q.id}`);seen.add(q.id);if(q.options){assert.equal(q.options.filter(o=>o===q.correct).length,1);assert.ok(isCorrect(q,q.correct));}}
   const answers=Object.fromEntries(next.paper.map(q=>[q.id,q.correct]));
   const result=submitSession(next.session,next.paper,answers,storage,1100+session);
   assert.equal(result.score,10);assert.equal(loadHistory(storage).sessions.length,session+1);
  }
  assert.equal(seen.size,30);
 });
}
test('Unit 1 has exactly 70 unique source additions, 50 grammar, 124 vocabulary and 16 exam-skill questions',()=>{
 assert.equal(UNIT1_SOURCE_QUESTIONS.length,70);assert.equal(bank.length,190);
 assert.equal(uniqueValidQuestions(bank).length,190);
 assert.deepEqual(Object.fromEntries(['grammar','vocabulary','exam'].map(k=>[k,bank.filter(q=>q.kind===k).length])),{grammar:50,vocabulary:124,exam:16});
 for(const q of bank){assert.ok(validateQuestion(q),q.id);assert.equal(q.correctAnswer,q.correct);assert.equal(q.content,q.prompt);}
 for(const q of UNIT1_SOURCE_QUESTIONS){assert.ok(q.source.filename.endsWith('.docx'));assert.ok(q.source.libraryFileId.startsWith('libfile_'));assert.ok(q.source.paragraphs.length===2);}
});
test('fresh storage does not inherit another browser history; reload persists selections even before submission',()=>{
 const a=memory();const first=beginSession(bank,config,a,1000,rng(12));
 const next=beginSession(bank,config,a,1001,rng(12));
 assert.ok(next.paper.every(q=>!first.paper.some(p=>p.id===q.id)));
 assert.equal(Object.keys(loadHistory(memory()).questions).length,0);
});
test('unattempted questions first; least recently seen first when exhaustion occurs',()=>{
 const small=bank.filter(q=>q.kind==='grammar').slice(0,4);
 const history={version:1,sessions:[],questions:Object.fromEntries(small.map((q,i)=>[q.id,{attempts:1,lastCorrect:true,lastSeen:(i+1)*100,seenCount:1}]))};
 history.questions[small[3].id].attempts=0;
 const selected=selectQuestions(small,{...config,count:2},history,()=>0.5);
 assert.deepEqual(new Set(selected.map(q=>q.id)),new Set([small[3].id,small[0].id]));
});
test('Review Mistakes contains unresolved incorrect answers; normal practice does not promote old mistakes above unseen',()=>{
 const storage=memory();const first=beginSession(bank,config,storage,1000,rng());
 const answers=Object.fromEntries(first.paper.map((q,i)=>[q.id,i<3?'wrong':q.correct]));
 submitSession(first.session,first.paper,answers,storage,2000);
 const review=beginSession(bank,{...config,review:true,count:30},storage,3000,rng());
 assert.equal(review.paper.length,3);assert.ok(review.paper.every(q=>first.paper.slice(0,3).some(p=>p.id===q.id)));
 const normal=beginSession(bank,config,storage,4000,rng());assert.ok(normal.paper.every(q=>!first.paper.some(p=>p.id===q.id)));
 const fixed=Object.fromEntries(review.paper.map(q=>[q.id,q.correct]));submitSession(review.session,review.paper,fixed,storage,5000);
 assert.equal(eligibleQuestions(bank,{...config,review:true},loadHistory(storage)).length,0);
});
test('oversize and empty selections are capped with no fabricated IDs, source items or repeated content',()=>{
 const small=bank.filter(q=>q.exerciseType==='sentence-transformation');const storage=memory();
 const next=beginSession(small,{...config,count:30},storage,1000,rng());
 assert.equal(next.available,5);assert.equal(next.paper.length,5);
 assert.ok(next.paper.every(q=>small.some(p=>p.id===q.id)));
 const none=beginSession(bank,{...config,focus:'exam',exerciseType:'verb-forms'},storage);
 assert.equal(none.paper.length,0);assert.equal(none.session,null);
});
test('difficulty and exercise filters only select matching items; selection cannot mutate canonical options',()=>{
 const before=structuredClone(bank);
 const result=beginSession(bank,{...config,difficulty:'hard',exerciseType:'sentence-transformation'},memory(),1000,rng());
 assert.equal(result.paper.length,5);assert.ok(result.paper.every(q=>q.difficulty==='hard'&&q.exerciseType==='sentence-transformation'));
 assert.deepEqual(bank,before);
});
test('text answers normalize case, punctuation, apostrophes and sequence spacing without accepting wrong grammar',()=>{
 const transform=bank.find(q=>q.id==='u1-doc01-ex2-q07');assert.ok(isCorrect(transform,'i HAVE NOT tried doing morning exercises before!'));
 assert.ok(!isCorrect(transform,'I never try doing morning exercises before.'));
 const arrange=bank.find(q=>q.id==='u1-doc01-ex7-q01');assert.ok(isCorrect(arrange,'C - A - B'));assert.ok(!isCorrect(arrange,'a-b-c'));
});
test('submission is idempotent; quiz mistakes are stored while XP, streak, progress and extension fields are preserved',()=>{
 const storage=memory();const progress={xp:345,streak:9,masteredWords:['u1-001'],reviewWords:['u1-002'],mistakesNotebook:[{id:'legacy',wordId:'u2-001'}],custom:{keep:true}};
 storage.setItem(PROGRESS_KEY,JSON.stringify(progress));
 const old=storage.getItem(PROGRESS_KEY);const next=beginSession(bank,config,storage,1000,rng());assert.equal(storage.getItem(PROGRESS_KEY),old);
 const answers=Object.fromEntries(next.paper.map((q,i)=>[q.id,i===0?'wrong':q.correct]));
 const result=submitSession(next.session,next.paper,answers,storage,2000);assert.equal(result.score,9);
 assert.ok(submitSession(next.session,next.paper,answers,storage,3000).alreadySubmitted);
 const after=applyQuizResult(progress,next.paper,answers,2000);
 assert.equal(after.xp,390);assert.equal(after.streak,9);assert.deepEqual(after.masteredWords,progress.masteredWords);assert.deepEqual(after.reviewWords,progress.reviewWords);assert.deepEqual(after.custom,progress.custom);
 assert.equal(after.mistakesNotebook.length,2);assert.ok(after.mistakesNotebook.some(m=>m.id==='legacy'));
 assert.deepEqual(normalizeProgress(after),after);
});
test('legacy vocabulary mistakes remain eligible for Review Mistakes',()=>{
 const storage=memory();storage.setItem(PROGRESS_KEY,JSON.stringify({mistakesNotebook:[{wordId:'u1-001',id:'legacy'}]}));
 const next=beginSession(bank,{...config,review:true},storage,1000,rng());assert.deepEqual(next.paper.map(q=>q.id),['unit1-v-u1-001']);
});
test('all original vocabulary records, grammar lessons and unrelated activity components remain unchanged',async()=>{
 const oldSrc=execFileSync('git',['show','phase2-working-20261028:src/App.jsx'],{encoding:'utf8'});
 assert.deepEqual(datasets(oldSrc),words);
 for(const name of ['NavTab','VocabLabView','FlashcardMode','MultipleChoiceMode','SpellingMode','WordMatchingMode','MiniGamesView']){
   const pattern=new RegExp(`function ${name}\\([^]*?(?=\\nfunction |$)`);
   assert.equal(src.match(pattern)?.[0],oldSrc.match(pattern)?.[0],name);
 }
 const oldData=execFileSync('git',['show','phase2-working-20261028:src/learning-data.mjs'],{encoding:'utf8'});
 const oldModule=await import('data:text/javascript;base64,'+Buffer.from(oldData).toString('base64'));
 assert.deepEqual(GRAMMAR,oldModule.GRAMMAR);
 assert.ok(src.includes("localStorage.setItem('es11_student_an_progress'"));
});
test('duplicate IDs/content and incomplete questions are rejected by selection, not deleted from source records',()=>{
 const q=bank[0];const inputs=[q,{...q,id:'alias'}, {...q,correct:'not an option'}, {...q,id:'x',explanation:''}];
 assert.equal(uniqueValidQuestions(inputs).length,1);assert.equal(inputs.length,4);
 const unit2=getQuestionBank('unit2',words.unit2);assert.equal(unit2.length,125);assert.equal(uniqueValidQuestions(unit2).length,123);
});
test('unavailable localStorage returns an explicit unsaved result without disabling practice',()=>{
 const storage={getItem:()=>null,setItem:()=>{throw new Error('Quota');}};
 const next=beginSession(bank,config,storage);assert.equal(next.saved,false);assert.equal(next.paper.length,10);
});
test('healthy and fit-equivalent meanings do not compete as vocabulary distractors',()=>{
 const healthy=bank.find(q=>q.id==='unit1-v-u1-002a');
 const fitMeanings=words.unit1.filter(w=>/fit|healthy|healthful|in (?:good )?shape/.test(w.word)).map(w=>w.vietnamese);
 assert.ok(healthy.options.filter(o=>o!==healthy.correct).every(o=>!fitMeanings.includes(o)));
 for(const q of bank.filter(q=>q.kind==='vocabulary'&&q.wordId))assert.equal(q.options.length,4,q.id);
});
