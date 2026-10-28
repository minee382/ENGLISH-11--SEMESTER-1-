import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GRAMMAR, GRAMMAR_BANK, buildBank, drawQuestions, normalizeProgress} from '../src/learning-data.mjs';
const source=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
const datasets=Function(source.slice(source.indexOf('const UNIT_1_VERIFIED_WORDS'),source.indexOf('const TRANSLATIONS'))+'; return VOCABULARY_DATASETS;')();
for (const [unit,words] of Object.entries(datasets)) {
  test(`${unit}: valid bank and complete grammar lessons`,()=>{
    const bank=buildBank(unit,words);
    console.log(`${unit}: ${words.length} vocabulary + ${GRAMMAR_BANK[unit].length} grammar = ${bank.length} questions`);
    assert.equal(GRAMMAR_BANK[unit].length,16);
    assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
    assert.equal(new Set(GRAMMAR_BANK[unit].map(q=>q.prompt)).size,16);
    for (const q of bank) {
      assert.equal(new Set(q.options).size,4,q.id);
      assert.equal(q.options.filter(x=>x===q.correct).length,1,q.id);
      assert.ok(q.explanation.length>20,q.id);
      assert.equal(q.unit,unit);
    }
    assert.equal(GRAMMAR[unit].rules.length,3);
    for (const r of GRAMMAR[unit].rules) for(const key of ['forms','usage','examples','mistakes','tip']) assert.ok(r[key].length);
  });
  test(`${unit}: retry changes questions without duplicates, including 20 repeated attempts`,()=>{
    const bank=buildBank(unit,words);
    let previous=[];
    for(let i=0;i<20;i++) {
      const paper=drawQuestions(bank,10,previous);
      assert.equal(paper.length,10);
      assert.equal(new Set(paper.map(q=>q.id)).size,10);
      assert.ok(paper.every(q=>!previous.some(p=>p.id===q.id)));
      previous=paper;
    }
  });
  test(`${unit}: grammar-only retry prioritizes all unseen questions; oversize paper is capped`,()=>{
    const bank=GRAMMAR_BANK[unit]; const first=drawQuestions(bank,10,[],()=>0);
    const second=drawQuestions(bank,10,first,()=>0);
    assert.equal(second.filter(q=>!first.some(p=>p.id===q.id)).length,6);
    assert.equal(drawQuestions(bank,20).length,16);
    assert.deepEqual(bank,GRAMMAR_BANK[unit]);
  });
}
test('progress imports cannot remove required arrays or accept invalid numeric values',()=>{
  const p=normalizeProgress({masteredWords:['a','a',null],mistakesNotebook:[null,{}, {wordId:'a'}],xp:'oops',streak:-1});
  assert.deepEqual(p,{masteredWords:['a'],reviewWords:[],mistakesNotebook:[{wordId:'a'}],xp:0,streak:0});
  assert.throws(()=>normalizeProgress(null));
});
test('empty banks and shuffle operations do not mutate input',()=>{
  assert.deepEqual(drawQuestions([],10),[]);
  const bank=structuredClone(GRAMMAR_BANK.unit1); const before=structuredClone(bank);
  drawQuestions(bank,10); assert.deepEqual(bank,before);
});
