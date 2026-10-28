import React from 'react';
import {ArrowRight, ChevronRight, Download, Upload} from 'lucide-react';
// Non-destructive Phase A: dashboard only. Every shortcut opens the real existing module.
function BrainBuddy({ className = '', pose = 'wave' }) {
  return <svg className={className} viewBox="0 0 260 250" role="img" aria-label="Brain Buddy, linh vật bộ não hồng dễ thương" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="brainPeach" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ffb1c6"/><stop offset="1" stopColor="#ff6f9d"/></linearGradient></defs>
    <ellipse cx="131" cy="220" rx="82" ry="11" fill="#eaa5a1" opacity=".17"/>
    <path d="M93 189 Q81 209 67 215" fill="none" stroke="#92475f" strokeWidth="9" strokeLinecap="round"/>
    <path d="M161 188 Q172 208 188 211" fill="none" stroke="#92475f" strokeWidth="9" strokeLinecap="round"/>
    <path d="M66 137 Q37 147 29 121" fill="none" stroke="#92475f" strokeWidth="9" strokeLinecap="round"/>
    <path d={pose === 'wave' ? 'M193 132 Q226 115 224 79' : 'M193 132 Q223 149 238 133'} fill="none" stroke="#92475f" strokeWidth="9" strokeLinecap="round"/>
    <circle cx={pose === 'wave' ? '224' : '238'} cy={pose === 'wave' ? '74' : '133'} r="12" fill="#ffb2c8" stroke="#92475f" strokeWidth="3"/>
    <path d="M74 60 C47 31 73 11 101 20 C115 4 150 10 161 26 C195 15 220 43 210 73 C236 96 219 123 204 128 C217 159 194 189 164 185 C148 208 119 202 107 190 C78 203 49 183 55 156 C30 140 35 109 55 97 C42 82 52 64 74 60Z" fill="url(#brainPeach)" stroke="#a94f74" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M111 32 Q92 46 103 65 Q80 77 101 98 M154 33 Q172 49 153 71 Q179 83 164 104 M74 111 Q89 126 78 147 M191 112 Q175 129 187 149 M125 152 Q135 168 122 181" fill="none" stroke="#e86d9b" opacity=".65" strokeWidth="5" strokeLinecap="round"/>
    <ellipse cx="99" cy="125" rx="8" ry="11" fill="#482b43"/><ellipse cx="161" cy="125" rx="8" ry="11" fill="#482b43"/>
    <circle cx="101" cy="122" r="2.5" fill="white"/><circle cx="163" cy="122" r="2.5" fill="white"/>
    <ellipse cx="79" cy="145" rx="13" ry="7" fill="#f55f84" opacity=".55"/><ellipse cx="182" cy="145" rx="13" ry="7" fill="#f55f84" opacity=".55"/>
    <path d="M116 144 Q130 158 144 144" fill="none" stroke="#743552" strokeWidth="4" strokeLinecap="round"/>
    <path d="M60 218 h22 M177 215 h25" stroke="#92475f" strokeWidth="8" strokeLinecap="round"/>
  </svg>;
}

export default function PastelHome({ lang, unitId, unitIds, selectUnit, words, progress, navigate, onExport, onImport }) {
  const vi = lang === 'vi';
  const mastered = words.filter(w => progress.masteredWords.includes(w.id)).length;
  const pct = words.length ? Math.round(mastered / words.length * 100) : 0;
  const modules = [
    ['vocab','📚',vi ? 'Từ vựng' : 'Vocabulary',vi ? 'Flashcards & luyện nhớ' : 'Flashcards and recall','peach'],
    ['grammar','✏️',vi ? 'Ngữ pháp' : 'Grammar',vi ? 'Công thức & bài tập' : 'Rules and practice','lavender'],
    ['exam','📝',vi ? 'Luyện thi' : 'Exam practice',vi ? 'Đề luyện tập thông minh' : 'Smart question practice','yellow'],
    ['games','🎮',vi ? 'Trò chơi' : 'Games',vi ? 'Học vui, nhớ lâu' : 'Play to learn','mint'],
    ['mistakes','💡',vi ? 'Sổ lỗi sai' : 'Mistakes',vi ? 'Ôn tập những câu sai' : 'Review your mistakes','pink']
  ];
  return <div className="pastel-home">
    <div className="pastel-intro"><span className="pastel-eyebrow">✦ ENGLISH SUCCESS 11 ✦</span><h2>{vi ? 'Chào An! ' : 'Hello, An! '}<span>👋</span></h2><p>{vi ? 'Hôm nay mình cùng học thêm một chút nhé!' : 'A little progress every day adds up!'}</p></div>
    <section className="pastel-hero" aria-label="Continue learning">
      <div className="pastel-hero-copy"><span className="pastel-pill">✦ {vi ? 'HỌC TIẾP NÀO' : 'KEEP LEARNING'}</span><h3>{vi ? 'Sẵn sàng khám phá tiếng Anh?' : 'Ready for English adventures?'}</h3><p>{vi ? 'Brain Buddy sẽ đồng hành cùng An mỗi ngày!' : 'Brain Buddy is here to cheer you on!'}</p><button className="pastel-primary" onClick={()=>navigate('vocab')}>{vi ? 'Tiếp tục học' : 'Continue learning'} <ArrowRight size={17}/></button></div><BrainBuddy className="pastel-mascot" />
    </section>
    <div className="pastel-stats"><div className="pastel-stat"><span className="pastel-stat-icon">⚡</span><span><b>{progress.xp} XP</b><small>{vi ? 'Điểm kinh nghiệm' : 'Experience points'}</small></span></div><div className="pastel-stat"><span className="pastel-stat-icon">🔥</span><span><b>{progress.streak} {vi ? 'ngày' : 'days'}</b><small>{vi ? 'Chuỗi học tập' : 'Learning streak'}</small></span></div><div className="pastel-stat"><span className="pastel-stat-icon">🌟</span><span><b>{progress.masteredWords.length}</b><small>{vi ? 'Từ đã ghi nhớ' : 'Words mastered'}</small></span></div></div>
    <div className="pastel-section-heading"><h3>{vi ? 'Hành trình học tập' : 'Your learning journey'} <span>🌷</span></h3><span>{vi ? 'Dữ liệu thật của An' : 'Your real progress'}</span></div>
    <div className="pastel-unit-card"><div><span className="pastel-unit-tag">UNIT {unitId.replace('unit','')}</span><h4>{({unit1:'A Long and Healthy Life',unit2:'The Generation Gap',unit3:'Cities of the Future',unit4:'ASEAN and Viet Nam'})[unitId]}</h4><p>{mastered} / {words.length} {vi ? 'từ đã ghi nhớ' : 'words mastered'}</p></div><div className="pastel-progress"><strong>{pct}%</strong><div className="pastel-progress-track"><div style={{width:`${pct}%`}}/></div></div></div>
    <div className="pastel-units" role="group" aria-label="Select Unit">{unitIds.map((id,i)=><button key={id} className={id===unitId?'selected':''} aria-pressed={id===unitId} onClick={()=>selectUnit(id)}>Unit {i+1}</button>)}</div>
    <div className="pastel-section-heading"><h3>{vi ? 'Góc học tập của An' : 'Choose your activity'} <span>✨</span></h3></div>
    <div className="pastel-module-grid">{modules.map(([id,emoji,title,sub,color])=><button key={id} className={`pastel-module ${color}`} onClick={()=>navigate(id)}><span className="pastel-module-emoji" aria-hidden="true">{emoji}</span><span className="pastel-module-copy"><b>{title}</b><small>{sub}</small></span><ChevronRight size={19}/></button>)}</div>
    <div className="pastel-backup"><span>☁️ {vi ? 'Sao lưu tiến độ học' : 'Back up your progress'}</span><div><button onClick={onExport}><Download size={15}/> Export</button><label><Upload size={15}/> Import<input type="file" accept=".json" onChange={onImport} className="hidden"/></label></div></div>
  </div>;
}


