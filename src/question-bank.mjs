import imported from './unit1-source-bank.json' with {type:'json'};
import {buildBank, GRAMMAR} from './learning-data.mjs';

// Stable IDs from Phase 2 are retained. Legacy provenance is explicitly distinguished
// from newly checked DOCX imports; no document question numbers are invented.
const family=w=>{
  const term=w.word.toLowerCase();
  if(/(?:fit|health|in (?:good )?shape|well-being)/.test(term))return 'health-and-fitness';
  if(/recipe/.test(term))return 'recipe';
  if(/germ|bacteri|microorganism/.test(term))return 'microbes';
  return term;
};
const stopWords=new Set(['sự','các','một','của','việc','những','với','cho','làm','cách','người','điều','thứ','được']);
const meaningTokens=w=>new Set(w.vietnamese.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N} ]/gu,' ').split(/\s+/).filter(t=>t.length>1&&!stopWords.has(t)));
function meaningOptions(word,words) {
  const tokens=meaningTokens(word);
  const anchors=['recipe','treadmill','diameter','energy','ingredient','nutritious','infectious','repetitive','regular','mental','physical'];
  const candidates=[...words].sort((a,b)=>{
    const score=w=>(w.pos===word.pos?0:100)+(anchors.includes(w.word)?anchors.indexOf(w.word):50);
    return score(a)-score(b);
  });
  const choices=[word.vietnamese];
  for(const candidate of candidates){
    if(candidate.id===word.id||family(candidate)===family(word)||choices.includes(candidate.vietnamese))continue;
    // Avoid shared content words and known equivalent meanings, e.g. healthy/fit.
    if([...meaningTokens(candidate)].some(t=>tokens.has(t)))continue;
    choices.push(candidate.vietnamese);if(choices.length===4)break;
  }
  // A short validated bank is returned honestly; the selector rejects incomplete MCQs.
  return choices;
}

export function getQuestionBank(unit, words) {
  const byId = new Map(words.map(w=>[w.id,w]));
  const legacy = buildBank(unit, words).map(q=>{
    const word=byId.get(q.wordId);
    return {...q, ...(word?{options:meaningOptions(word,words)}:{}), topic:q.kind==='grammar' ? GRAMMAR[unit].title : 'Vocabulary: '+word.word,
      exerciseType:q.kind==='grammar' ? 'verb-forms' : 'multiple-choice',
      difficulty:word?.difficulty || 'medium', content:q.prompt, correctAnswer:q.correct,
      sourceRef:q.kind==='grammar' ? `Existing English Success 11 · Phase 2 authored item · ${q.id}` : `Existing vocabulary record ${word.id}; generated meaning prompt · ${word.sourceRef} (source label retained from supplied app)`,
      source:{origin:'existing-app',recordId:q.id,documentVerified:false},validated:true};
  });
  return [...legacy,...imported.filter(q=>q.unit===unit)];
}
export const UNIT1_SOURCE_QUESTIONS = imported;
