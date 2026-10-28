import {shuffle} from './learning-data.mjs';
export const HISTORY_KEY='es11_question_history_v1';
export const PROGRESS_KEY='es11_student_an_progress';
const emptyHistory=()=>({version:1,questions:{},sessions:[]});
let memoryHistory=emptyHistory();
export const normalizeText=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
export const contentKey=q=>normalizeText(`${q.passage || ''}\n${q.prompt}`).replace(/[“”".,!?;:]/g,'');
export function validateQuestion(q) {
  const required=['id','unit','topic','exerciseType','difficulty','prompt','correct','explanation','sourceRef'];
  if(required.some(k=>typeof q[k]!=='string'||!q[k].trim())) return false;
  if(!['easy','medium','hard'].includes(q.difficulty)||q.validated!==true) return false;
  if(q.options) return q.options.length===4 && new Set(q.options.map(normalizeText)).size===q.options.length && q.options.filter(o=>o===q.correct).length===1;
  return Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.includes(q.correct);
}
export function uniqueValidQuestions(bank) {
  const ids=new Set(),content=new Set();
  return bank.filter(q=>{
    if(!validateQuestion(q)||ids.has(q.id)||content.has(contentKey(q)))return false;
    ids.add(q.id);content.add(contentKey(q));return true;
  });
}
export function normalizeHistory(data) {
  if(!data||data.version!==1||!data.questions||typeof data.questions!=='object'||Array.isArray(data.questions)||!Array.isArray(data.sessions)) return emptyHistory();
  // Retain unknown history fields for forward compatibility.
  return {...data, questions:{...data.questions},sessions:[...data.sessions]};
}
function browserStorage() {try{return globalThis.localStorage;}catch{return null;}}
export function loadHistory(storage=browserStorage()) {
  try {
    const saved=storage?.getItem(HISTORY_KEY);
    const history=saved ? normalizeHistory(JSON.parse(saved)) : storage ? emptyHistory() : normalizeHistory(memoryHistory);
    // Existing vocabulary mistakes are real prior errors and remain reviewable.
    const progress=JSON.parse(storage?.getItem(PROGRESS_KEY)||'{}');
    for(const m of (Array.isArray(progress.mistakesNotebook) ? progress.mistakesNotebook : [])) {
      const number=m.wordId?.match(/^u([1-4])-/)?.[1];
      const id=m.questionId || (number ? `unit${number}-v-${m.wordId}` : null);
      if(id&&!history.questions[id]) history.questions[id]={seenCount:1,attempts:1,incorrectCount:1,correctCount:0,lastSeen:0,lastAttempt:0,lastCorrect:false,legacyMistake:true};
    }
    return history;
  }catch{return normalizeHistory(memoryHistory);}
}
export function saveHistory(history,storage=browserStorage()) {
  memoryHistory=normalizeHistory(history);
  try {if(!storage)return false;storage.setItem(HISTORY_KEY,JSON.stringify(history));return true;}catch{return false;}
}
export function eligibleQuestions(bank,settings,history) {
  return uniqueValidQuestions(bank).filter(q=> (!settings.unit||q.unit===settings.unit)
    && (settings.focus==='mixed'||!settings.focus||q.kind===settings.focus)
    && (settings.exerciseType==='mixed'||!settings.exerciseType||q.exerciseType===settings.exerciseType)
    && (settings.difficulty==='mixed'||!settings.difficulty||q.difficulty===settings.difficulty)
    && (!settings.review||history.questions[q.id]?.lastCorrect===false));
}
export function selectQuestions(bank,settings,history=emptyHistory(),rng=Math.random) {
  const eligible=eligibleQuestions(bank,settings,history);
  const ranked=shuffle(eligible,rng).map((q,index)=>{
    const h=history.questions[q.id]||{};
    const tier=Number(h.attempts||0)===0 ? 0 : h.lastCorrect===false ? 2 : 1;
    return {q,tier,seen:Number(h.seenCount||0)>0 ? 1 : 0,last:Number(h.lastSeen||0),index};
  }).sort((a,b)=>a.tier-b.tier||a.seen-b.seen||a.last-b.last||a.index-b.index);
  const limit=Math.max(0,Math.floor(Number(settings.count)||0));
  return shuffle(ranked.slice(0,limit).map(x=>({...x.q,options:x.q.options?shuffle(x.q.options,rng):undefined})),rng);
}
export function beginSession(bank,settings,storage=browserStorage(),now=Date.now(),rng=Math.random) {
  const history=loadHistory(storage);
  const available=eligibleQuestions(bank,settings,history).length;
  const paper=selectQuestions(bank,settings,history,rng);
  if(!paper.length)return {paper,available,history,saved:true,session:null};
  const session={id:globalThis.crypto?.randomUUID?.() || `${now}-${Math.random().toString(36).slice(2)}`,settings:{...settings},questionIds:paper.map(q=>q.id),startedAt:now};
  for(const q of paper){const old=history.questions[q.id]||{};history.questions[q.id]={...old,seenCount:Number(old.seenCount||0)+1,lastSeen:now};}
  history.sessions.push(session);
  return {paper,available,session,history,saved:saveHistory(history,storage)};
}
function normalizedAnswer(answer) {
  return normalizeText(answer).replace(/\b(haven't)\b/g,'have not').replace(/\b(hasn't)\b/g,'has not').replace(/[.!?]+$/g,'').replace(/\s*-\s*/g,'-').trim();
}
export function isCorrect(q,answer) {
  if(q.options)return answer===q.correct;
  const normalized=normalizedAnswer(answer);
  return q.acceptedAnswers.some(value=>normalizedAnswer(value)===normalized);
}
export function submitSession(session,paper,answers,storage=browserStorage(),now=Date.now()) {
  const history=loadHistory(storage);const match=history.sessions.find(s=>s.id===session.id);
  if(match?.submittedAt)return {alreadySubmitted:true,history,saved:true,score:match.score};
  const score=paper.filter(q=>isCorrect(q,answers[q.id])).length;
  for(const q of paper){const old=history.questions[q.id]||{};const correct=isCorrect(q,answers[q.id]);history.questions[q.id]={...old,attempts:Number(old.attempts||0)+1,correctCount:Number(old.correctCount||0)+(correct?1:0),incorrectCount:Number(old.incorrectCount||0)+(correct?0:1),lastAttempt:now,lastAnswer:answers[q.id],lastCorrect:correct};}
  if(match)Object.assign(match,{submittedAt:now,score});else history.sessions.push({...session,submittedAt:now,score});
  return {alreadySubmitted:false,score,history,saved:saveHistory(history,storage)};
}
export function applyQuizResult(progress,paper,answers,now=Date.now()) {
  const mistakes=[...(progress.mistakesNotebook||[])];
  for(const q of paper) {
    const index=mistakes.findIndex(m=>m.questionId===q.id);
    if(isCorrect(q,answers[q.id])) {if(index>=0)mistakes.splice(index,1);continue;}
    const item={id:`question:${q.id}`,questionId:q.id,...(q.wordId?{wordId:q.wordId}:{}),word:q.prompt,vietnamese:q.topic,type:q.exerciseType,userAnswer:answers[q.id],correctAnswer:q.correct,explanation:q.explanation,sourceRef:q.sourceRef,date:new Date(now).toLocaleDateString('vi-VN')};
    if(index>=0)mistakes[index]={...mistakes[index],...item};else mistakes.push(item);
  }
  return {...progress,xp:(Number(progress.xp)||0)+paper.filter(q=>isCorrect(q,answers[q.id])).length*5,mistakesNotebook:mistakes};
}
