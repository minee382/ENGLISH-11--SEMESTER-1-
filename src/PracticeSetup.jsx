import React from 'react';
import {eligibleQuestions,uniqueValidQuestions} from './smart-replay.mjs';
const typeLabels={
  'multiple-choice':['Trắc nghiệm nghĩa','Meaning MCQ'],
  'word-formation':['Dạng từ','Word formation'],
  'verb-forms':['Dạng động từ','Verb forms'],
  'gap-filling':['Điền vào chỗ trống','Gap filling'],
  'sentence-transformation':['Viết lại câu','Sentence transformation'],
  'sentence-arrangement':['Sắp xếp câu','Sentence arrangement'],
  'reading-comprehension':['Đọc hiểu','Reading comprehension'],
  'cloze-test':['Đọc điền từ','Cloze test']
};
export default function PracticeSetup({bank,lang,settings,onChange,onStart,history,grammarOnly=false}) {
  const vi=lang==='vi';
  const available=eligibleQuestions(bank,settings,history);
  const unseen=available.filter(q=>!history.questions[q.id]?.seenCount).length;
  const neverAttempted=available.filter(q=>!history.questions[q.id]?.attempts).length;
  const types=[...new Set(uniqueValidQuestions(bank).filter(q=>settings.focus==='mixed'||q.kind===settings.focus).map(q=>q.exerciseType))];
  const patch=values=>onChange({...settings,...values});
  return <section aria-label="Practice Setup" className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
    <div><h3 className="font-bold text-lg text-teal-900">{vi?'Thiết lập luyện tập':'Practice Setup'}</h3><p className="text-sm text-slate-500 mt-1">{settings.unit.replace('unit','Unit ')} · {vi?'Chọn cấu hình rồi bắt đầu một lượt mới.':'Choose settings, then start a new session.'}</p></div>
    <div className="flex flex-wrap gap-4 items-end">
      {!grammarOnly && <label className="text-sm font-semibold flex-1 min-w-40">{vi?'Nội dung':'Focus'}<select value={settings.focus} onChange={e=>patch({focus:e.target.value,exerciseType:'mixed'})} className="block mt-2 w-full rounded-xl border border-slate-300 p-3 bg-white"><option value="mixed">{vi?'Tổng hợp · Grammar + Vocabulary + Exam':'Mixed · Grammar + Vocabulary + Exam'}</option><option value="grammar">{vi?'Ngữ pháp':'Grammar'}</option><option value="vocabulary">{vi?'Từ vựng':'Vocabulary'}</option><option value="exam">{vi?'Bài đọc & dạng đề thi':'Reading & exam skills'}</option></select></label>}
      <label className="text-sm font-semibold flex-1 min-w-40">{vi?'Dạng bài':'Exercise type'}<select value={settings.exerciseType} onChange={e=>patch({exerciseType:e.target.value})} className="block mt-2 w-full rounded-xl border border-slate-300 p-3 bg-white"><option value="mixed">{vi?'Hỗn hợp':'Mixed'}</option>{types.map(type=><option key={type} value={type}>{typeLabels[type]?.[vi?0:1]||type}</option>)}</select></label>
      <label className="text-sm font-semibold">{vi?'Độ khó':'Difficulty'}<select value={settings.difficulty} onChange={e=>patch({difficulty:e.target.value})} className="block mt-2 rounded-xl border border-slate-300 p-3 bg-white">{['mixed','easy','medium','hard'].map((v,i)=><option key={v} value={v}>{(vi?['Hỗn hợp','Dễ','Trung bình','Khó']:['Mixed','Easy','Medium','Hard'])[i]}</option>)}</select></label>
      <label className="text-sm font-semibold">{vi?'Số câu mỗi lượt':'Paper length'}<select value={settings.count} onChange={e=>patch({count:Number(e.target.value)})} className="block mt-2 rounded-xl border border-slate-300 p-3 bg-white">{[5,10,20,30].map((n,i)=><option key={n} value={n}>{n} · {(vi?['Lượt ngắn','Nhanh','Tiêu chuẩn','Chuyên sâu']:['Short','Quick Practice','Standard Practice','Intensive Practice'])[i]}</option>)}</select></label>
    </div>
    <label className="text-sm flex gap-2 items-center"><input type="checkbox" checked={settings.review} onChange={e=>patch({review:e.target.checked})} className="accent-teal-700"/>{vi?'Ôn lỗi sai · Review Mistakes':'Review Mistakes'}</label>
    <p className="text-sm text-slate-600" aria-live="polite">{vi?`${available.length} câu hợp lệ, duy nhất · ${unseen} câu chưa từng xuất hiện · ${neverAttempted} câu chưa làm.`:`${available.length} valid unique questions · ${unseen} never seen · ${neverAttempted} never attempted.`}</p>
    {available.length<settings.count && <p role="status" className="text-sm text-amber-800">{vi?`Bạn chọn ${settings.count} câu; chỉ có ${available.length} câu phù hợp. Lượt này sẽ có ${available.length} câu, không thêm câu giả hoặc lặp câu.`:`Requested ${settings.count}; only ${available.length} match. This session will contain ${available.length} questions, with no filler or duplicates.`}</p>}
    <div className="flex flex-wrap items-center gap-4"><button type="button" disabled={!available.length} onClick={onStart} className="rounded-xl bg-teal-700 px-5 py-3 text-white font-bold disabled:opacity-50">{vi?'Bắt đầu luyện tập':'Start practice'}</button><p className="text-xs text-slate-500">{vi?'Ưu tiên câu chưa làm, sau đó câu lâu chưa gặp. Câu sai được ưu tiên ở chế độ ôn lỗi sai.':'Prioritizes unattempted questions, then older questions. Review Mistakes targets incorrect answers.'}</p></div>
    {!available.length && <p className="text-sm text-slate-600">{vi?'Không có câu phù hợp. Hãy đổi bộ lọc; nếu đang ôn lỗi sai, hiện chưa có lỗi chưa sửa trong nhóm này.':'No questions match. Change filters; Review Mistakes only includes unresolved errors.'}</p>}
  </section>;
}
