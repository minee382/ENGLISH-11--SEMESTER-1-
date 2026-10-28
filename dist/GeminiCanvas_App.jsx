import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Brain, Trophy, Volume2, ArrowLeft, ArrowRight, RotateCw, 
  CheckCircle2, XCircle, Search, Sparkles, Languages, Save, Download, 
  Upload, HelpCircle, RefreshCw, Layers, Award, BarChart3, BookmarkCheck,
  AlertCircle, Dumbbell, Gamepad2, FileText, ChevronRight, Check, Shuffle,
  Filter, Zap, Star, Flame, CornerDownRight, Eye
} from 'lucide-react';


// Phase 3: same targeted source modules, flattened for single-file Canvas use.
function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// Prioritize questions outside the previous paper. Never repeat an identical paper
// when another question is available, even with a deterministic random source.
function drawQuestions(bank, count, previous = [], rng = Math.random) {
  const prior = new Set(previous.map(q => q.id));
  const fresh = shuffle(bank.filter(q => !prior.has(q.id)), rng);
  const old = shuffle(bank.filter(q => prior.has(q.id)), rng);
  return shuffle([...fresh, ...old].slice(0, Math.min(count, bank.length)), rng)
    .map(q => ({ ...q, options: shuffle(q.options, rng) }));
}
const rule = (title, forms, usage, examples, mistakes, tip) => ({ title, forms, usage, examples, mistakes, tip });
const GRAMMAR = {
  unit1: {
    title: 'Past Simple & Present Perfect', subtitle: 'Quá khứ đơn và hiện tại hoàn thành',
    intro: 'Chọn thì theo mốc thời gian và mối liên hệ với hiện tại. Đừng chỉ nhìn một từ khóa riêng lẻ.',
    rules: [
      rule('1. Past Simple · Quá khứ đơn', ['(+) S + V2/ed. Với be: was/were.', '(-) S + did not + V nguyên mẫu. Với be: was/were not.', '(?) Did + S + V nguyên mẫu? / Was/Were + S ...?'],
        'Hành động hoặc chuỗi hành động đã kết thúc tại thời điểm xác định trong quá khứ; thói quen hoặc trạng thái trong một giai đoạn đã kết thúc.',
        ['She started yoga three months ago. → Cô ấy bắt đầu tập yoga cách đây ba tháng.', 'Did you exercise yesterday? — Yes, I did.', 'He was tired last night. → Tối qua anh ấy mệt.'],
        ['Sai: Did she went? → Đúng: Did she go? Sau did dùng V nguyên mẫu.', 'Sai: I have seen him yesterday. → Đúng: I saw him yesterday.'],
        'yesterday, last week, two days ago, in 2020: thường đi với quá khứ đơn. V2 bất quy tắc: go → went, eat → ate, see → saw.'),
      rule('2. Present Perfect · Hiện tại hoàn thành', ['(+) I/You/We/They + have + V3; He/She/It + has + V3.', '(-) S + have/has not + V3.', '(?) Have/Has + S + V3?'],
        'Kinh nghiệm đến hiện tại (không nêu thời gian đã kết thúc); kết quả hiện tại; trạng thái bắt đầu trong quá khứ và vẫn tiếp diễn; thành tích trong khoảng thời gian chưa kết thúc.',
        ['I have lost my keys. → Hiện giờ tôi không có chìa khóa.', 'She has lived here since 2020. → Cô ấy vẫn sống ở đây.', 'Have you ever tried yoga? — No, I have never tried it.', 'It is 10 a.m. The doctor has examined five patients so far this morning.'],
        ['Sai: She have finished. → Đúng: She has finished.', 'Sai: I have knew her for years. → Đúng: I have known her for years.'],
        'V3: go → gone, eat → eaten, see → seen, know → known. “This morning” phụ thuộc ngữ cảnh: nếu đã sang buổi chiều, dùng quá khứ đơn cho sự kiện sáng đã kết thúc.'),
      rule('3. Since / For / Already / Yet', ['since + mốc bắt đầu: since 2020 / since Monday.', 'for + khoảng thời gian: for three years / for two hours.', 'have/has + already/just/never + V3; yet thường ở cuối câu hỏi hoặc phủ định.'],
        'Since trả lời “từ khi nào”, for trả lời “bao lâu”. Already = đã rồi; just = vừa mới; yet = chưa / đã ... chưa. For cũng dùng với thì khác nếu giai đoạn đó đã kết thúc.',
        ['I have known her for five years.', 'He has not finished his workout yet.', 'She lived in Hue for two years, then moved to Hanoi. → Giai đoạn sống ở Huế đã kết thúc.'],
        ['Sai: since three years → Đúng: for three years.', 'Sai: for 2020 → Đúng: since 2020.'],
        'So sánh: I started exercising in 2022. ↔ I have exercised regularly since 2022 (vẫn tiếp tục).')
    ]
  },
  unit2: {
    title: 'Modal Verbs', subtitle: 'Nghĩa vụ, sự cần thiết và lời khuyên',
    intro: 'Phân biệt mức độ bắt buộc, điều bị cấm và điều không cần làm. Ngữ cảnh quyết định lựa chọn phù hợp.',
    rules: [
      rule('1. Must / Have to · Nghĩa vụ', ['S + must + V nguyên mẫu (không to).', 'I/You/We/They + have to + V; He/She/It + has to + V.', 'Quá khứ: had to + V. Tương lai: will have to + V.'],
        'Must nhấn mạnh nghĩa vụ mạnh hoặc yêu cầu của người nói; have to thường chỉ sự cần thiết do hoàn cảnh hoặc quy định. Hai cách có thể cùng phù hợp ở một số ngữ cảnh; đây không phải ranh giới tuyệt đối.',
        ['I must call my grandmother; I promised her. → Tôi tự thấy cần gọi.', 'Students have to wear uniforms at this school. → Quy định của trường.', 'We had to leave early yesterday. → Nghĩa vụ trong quá khứ.'],
        ['Sai: He must to go. → Đúng: He must go.', 'Sai: She have to study. → Đúng: She has to study.'],
        'Không thêm -s vào must/should. Must không có dạng quá khứ để diễn tả nghĩa vụ đã xảy ra: dùng had to.'),
      rule('2. Mustn’t ≠ Don’t have to', ['S + must not (mustn’t) + V = không được / cấm.', 'S + do/does not have to + V = không cần / không bắt buộc.', '(?) Do/Does + S + have to + V?'],
        'Mustn’t là lệnh cấm. Don’t have to cho phép tự chọn làm hoặc không làm; nó không có nghĩa là cấm.',
        ['You mustn’t use your phone during the exam. → Bị cấm.', 'You don’t have to bring lunch; food is provided. → Không cần.', 'Does she have to ask permission? — Yes, she does.'],
        ['Sai khi muốn nói “không cần”: You mustn’t come early. → You don’t have to come early.', 'Sau does dùng have to, không dùng has to.'],
        'Đọc kỹ nghĩa: prohibited / forbidden → mustn’t; optional / not necessary → don’t have to.'),
      rule('3. Should / Ought to · Lời khuyên', ['S + should + V / S + ought to + V.', 'S + should not (shouldn’t) + V.', '(?) Should + S + V?'],
        'Khuyên ai nên hoặc không nên làm điều gì. Should thường nhẹ hơn must. Ought to có nghĩa gần với should và có to trước động từ.',
        ['You should listen to your parents calmly.', 'Parents shouldn’t compare their children with others.', 'Teenagers ought to respect different opinions.'],
        ['Sai: should to listen → Đúng: should listen.', 'Sai: ought listen → Đúng: ought to listen.'],
        'Mẹo: lời khuyên hữu ích → should; nghĩa vụ mạnh → must/have to; cấm → mustn’t; không cần → don’t have to.')
    ]
  },
  unit3: {
    title: 'Stative & Linking Verbs', subtitle: 'Động từ trạng thái và động từ nối',
    intro: 'Xác định nghĩa của động từ trong câu: trạng thái, hoạt động đang diễn ra hay sự mô tả chủ ngữ.',
    rules: [
      rule('1. Stative verbs · Động từ trạng thái', ['Trạng thái hiện tại: S + V(s/es).', 'Phủ định: S + do/does not + V.', 'Thông thường tránh dạng be + V-ing khi động từ mang nghĩa trạng thái.'],
        'Các động từ chỉ nhận thức (know, understand, believe), sở hữu (own, belong), tình cảm (prefer, love) thường dùng thì đơn khi diễn tả trạng thái.',
        ['I understand the plan for the new city.', 'This bicycle belongs to Mai.', 'She prefers public transport to driving.'],
        ['Sai: I am knowing the answer. → Đúng: I know the answer.', 'Sai: This house is belonging to him. → Đúng: This house belongs to him.'],
        'Đây là cách dùng thông thường, không phải lệnh cấm mọi dạng tiếp diễn. Một số động từ đổi nghĩa khi chuyển sang hoạt động.'),
      rule('2. Một động từ, hai cách dùng', ['think = tin/cho rằng → thường dùng thì đơn.', 'think about = đang suy nghĩ/cân nhắc → có thể dùng tiếp diễn.', 'have = sở hữu → thì đơn; have a meal/meeting = hoạt động → có thể dùng tiếp diễn.'],
        'Look, smell, taste, feel có thể chỉ trạng thái/cảm nhận hoặc hoạt động có chủ ý. Đọc cả câu để xác định nghĩa.',
        ['I think smart cities are useful. / I am thinking about moving.', 'She has an electric bike. / She is having lunch now.', 'The soup tastes delicious. / The chef is tasting the soup now.'],
        ['Sai với nghĩa sở hữu: She is having two bikes. → She has two bikes.', 'Đừng chọn thì tiếp diễn chỉ vì câu có “now”; còn cần xét nghĩa của động từ.'],
        'taste/smell khi chủ động thử/nếm/ngửi có thể dùng tiếp diễn; khi mô tả đặc điểm thì thường dùng thì đơn.'),
      rule('3. Linking verbs + adjective', ['S + be/seem/appear/become/get + adjective.', 'S + look/sound/smell/taste/feel + adjective (khi làm động từ nối).', 'Động từ hành động + adverb khi trạng từ mô tả cách thực hiện hành động.'],
        'Động từ nối liên kết chủ ngữ với đặc điểm hoặc trạng thái của chính chủ ngữ; dùng tính từ làm bổ ngữ, không dùng trạng từ chỉ cách thức.',
        ['The city looks modern. → Modern mô tả city.', 'This solution sounds practical.', 'She looked carefully at the map. → Carefully mô tả hành động nhìn.'],
        ['Sai: The soup tastes deliciously. → Đúng: tastes delicious.', 'Sai: He seems happily. → Đúng: He seems happy.'],
        'Phân biệt: She looks happy (cô ấy trông vui) / She looks at the screen carefully (cô ấy nhìn kỹ).')
    ]
  },
  unit4: {
    title: 'Gerunds', subtitle: 'Danh động từ và cấu trúc V-ing',
    intro: 'Danh động từ có dạng V-ing và thực hiện vai trò của danh từ. Chọn V-ing hay to-V dựa vào cấu trúc đi trước.',
    rules: [
      rule('1. Gerund làm chủ ngữ / bổ ngữ', ['V-ing + ... + động từ chính số ít (một hoạt động).', 'S + be + V-ing khi V-ing gọi tên một hoạt động.', 'Phủ định danh động từ: not + V-ing.'],
        'Khi hoạt động là chủ đề của câu, dùng V-ing như một danh từ. Một cụm danh động từ làm chủ ngữ thường đi với động từ số ít.',
        ['Learning English helps young people communicate.', 'My favourite activity is volunteering.', 'Not listening carefully can cause misunderstandings.'],
        ['Sai: Learn English is useful. → Đúng: Learning English is useful.', 'Sai: Volunteering help us. → Đúng: Volunteering helps us.'],
        'Phân biệt: She is volunteering now (tiếp diễn) / Volunteering is rewarding (danh động từ làm chủ ngữ).'),
      rule('2. Sau động từ và giới từ', ['enjoy / avoid / finish / mind / suggest / practise / consider + V-ing.', 'Giới từ (in, on, at, about, without, after, before, for, of) + V-ing.', 'look forward to / be used to / object to + V-ing.'],
        'Sau các động từ này và sau giới từ, dùng danh động từ. “To” trong look forward to là giới từ, khác “to” trong want to learn.',
        ['They enjoy meeting students from ASEAN countries.', 'We are interested in joining the exchange.', 'I look forward to hearing from you.', 'She left without saying goodbye.'],
        ['Sai: enjoy to meet → Đúng: enjoy meeting.', 'Sai: look forward to hear → Đúng: look forward to hearing.'],
        'want / decide / hope / plan + to-V. Suggest + V-ing: suggest visiting, không dùng suggest to visit.'),
      rule('3. Stop / Remember / Try · Đổi cấu trúc, đổi nghĩa', ['stop + V-ing = ngừng việc đang làm; stop + to-V = dừng việc khác để làm gì.', 'remember + V-ing = nhớ việc đã làm; remember + to-V = nhớ phải làm.', 'try + V-ing = thử một cách; try + to-V = cố gắng làm.'],
        'Một số động từ theo sau được bởi cả V-ing và to-V nhưng nghĩa khác nhau. Cần đọc mục đích và trình tự của hành động.',
        ['He stopped smoking. / He stopped to drink some water.', 'I remember meeting her last year. / Remember to send the form tomorrow.', 'Try using a dictionary. / I tried to finish the report before midnight.'],
        ['“Stop to smoke” = dừng để hút thuốc, không phải cai thuốc.', '“Remember sending” là nhớ đã gửi; “remember to send” là nhớ phải gửi.'],
        'Chính tả V-ing: make → making; lie → lying; run → running. Không phải mọi từ tận cùng -ing đều là danh động từ.')
    ]
  }
};
// Each authored item has exactly one best answer in its stated context.
const RAW = {
unit1: [
['Nam ___ exercising three months ago.', 'started', ['has started','starts','start'], '“Three months ago” là thời điểm quá khứ xác định → quá khứ đơn: started.'],
['They ___ in this city since 2018 and still live here.', 'have lived', ['lived','are living','live'], 'Since 2018 đến hiện tại, vẫn tiếp diễn → have lived.'],
['It is 10 a.m. Dr John ___ five patients so far this morning.', 'has examined', ['examined','examines','examine'], 'So far và buổi sáng chưa kết thúc → hiện tại hoàn thành.'],
['___ you visit the health centre yesterday?', 'Did', ['Have','Do','Has'], 'Yesterday → câu hỏi quá khứ đơn: Did + S + V.'],
['She has not finished her workout ___.', 'yet', ['ago','yesterday','last night'], 'Yet thường ở cuối câu phủ định hiện tại hoàn thành.'],
['My brother ___ a new bike last week.', 'bought', ['has bought','buys','buy'], 'Last week đã kết thúc → bought, V2 của buy.'],
['We have known each other ___ five years.', 'for', ['since','ago','during'], 'Five years là khoảng thời gian → for.'],
['He has worked at this gym ___ 2021.', 'since', ['for','ago','during'], '2021 là mốc bắt đầu → since.'],
['She ___ at home yesterday evening.', 'was', ['has been','is','were'], 'Yesterday evening → quá khứ; she đi với was.'],
['Have you ever ___ yoga?', 'tried', ['try','trying','tries'], 'Have + S + V3 → tried.'],
['I ___ my keys. I cannot open the door now.', 'have lost', ['lose','am losing','have lose'], 'Kết quả còn ở hiện tại → have lost; V3 của lose là lost.'],
['They did not ___ fast food yesterday.', 'eat', ['ate','eaten','eating'], 'Sau did not dùng V nguyên mẫu → eat.'],
['Mai ___ three glasses of water so far today.', 'has drunk', ['drank','drink','has drank'], 'So far today → has + V3; drink–drank–drunk.'],
['When ___ you start your new fitness routine?', 'did', ['have','has','are'], 'Hỏi thời điểm bắt đầu đã xảy ra: When did + S + V?'],
['I lived in Hue for two years, then ___ to Hanoi in 2020.', 'moved', ['have moved','move','moving'], 'Chuỗi sự kiện đã kết thúc, có in 2020 → moved.'],
['She ___ just finished her homework.', 'has', ['have','did','is'], 'She + has + just + V3.']
],
unit2: [
['Phones are prohibited in this exam. You ___ use one.', 'mustn’t', ['don’t have to','should','ought to'], 'Prohibited = bị cấm → mustn’t.'],
['Lunch is provided, so you ___ bring your own food.', 'don’t have to', ['must','have to','must bring'], 'Đã có bữa trưa → không cần mang: don’t have to.'],
['Yesterday we ___ leave early to catch the only bus.', 'had to', ['must','have to','has to'], 'Nghĩa vụ trong quá khứ (yesterday) → had to.'],
['You look exhausted. You ___ get some rest.', 'should', ['should to','ought','shouldn’t'], 'Lời khuyên nghỉ ngơi: should + V nguyên mẫu.'],
['She ___ wear a uniform because her school requires it.', 'has to', ['have to','has','must to'], 'Chủ ngữ she là ngôi thứ ba số ít → has to + V nguyên mẫu; quy định của trường tạo nghĩa vụ.'],
['___ teenagers have to ask permission before going out?', 'Do', ['Does','Must','Have'], 'Do + chủ ngữ số nhiều + have to + V?'],
['Children ___ play with matches. It is dangerous.', 'mustn’t', ['don’t have to','ought to','should'], 'Chơi với diêm nguy hiểm, cần cấm → mustn’t.'],
['Parents ought ___ listen to their children.', 'to', ['for','with','at'], 'Cấu trúc đưa lời khuyên là ought to + động từ nguyên mẫu; không bỏ to.'],
['He should ___ his views politely.', 'express', ['expresses','to express','expressing'], 'Should + V nguyên mẫu không to.'],
['It is optional to attend. You ___ come if you are busy.', 'don’t have to', ['must','have to','should to'], 'Optional = tùy chọn → không bắt buộc.'],
['___ she have to finish this today?', 'Does', ['Do','Has','Is'], 'Does + she + have to + V?'],
['We will ___ arrive before 8 a.m. tomorrow.', 'have to', ['must','has to','had to'], 'Will have to diễn tả nghĩa vụ tương lai; không dùng will must.'],
['You ___ interrupt people while they are speaking; it is impolite.', 'shouldn’t', ['should','ought to','have to'], 'Lời khuyên không ngắt lời → shouldn’t.'],
['I must ___ my room before my friends arrive.', 'tidy', ['to tidy','tidies','tidying'], 'Sau động từ khuyết thiếu must dùng động từ nguyên mẫu không to → tidy.'],
['She does not ___ get up early on Sundays.', 'have to', ['has to','had to','must'], 'Sau does not dùng have to.'],
['Teenagers ___ respect other people’s opinions.', 'ought to', ['ought','should to','must to'], 'Ought to + V; should và must không đi với to.']
],
unit3: [
['This new transport system looks ___.', 'efficient', ['efficiently','efficiency','efficiencies'], 'Look là động từ nối → tính từ efficient mô tả system.'],
['I ___ the answer to your question.', 'know', ['am knowing','knowing','knows'], 'Know mang nghĩa trạng thái nhận thức → hiện tại đơn.'],
['The chef is ___ the soup to check the seasoning right now.', 'tasting', ['taste','tastes','tasted'], 'Chủ động nếm thử ngay lúc nói → is tasting.'],
['The soup tastes ___.', 'delicious', ['deliciously','deliciousness','delightfully'], 'Taste nối soup với đặc điểm → tính từ delicious.'],
['She ___ an electric bike; it belongs to her.', 'has', ['is having','have','having'], 'Have mang nghĩa sở hữu → has, không dùng tiếp diễn.'],
['Please call later. We are ___ lunch now.', 'having', ['have','has','had'], 'Have lunch là hoạt động → có thể dùng tiếp diễn.'],
['Your idea sounds ___.', 'interesting', ['interestingly','interest','interests'], 'Sound là động từ nối → tính từ interesting.'],
['This apartment ___ to my aunt.', 'belongs', ['is belonging','belong','belonging'], 'Belong chỉ sở hữu, apartment số ít → belongs.'],
['Be quiet. I am ___ about how to solve this problem.', 'thinking', ['think','thinks','thought'], 'Think about là hoạt động suy nghĩ đang diễn ra → am thinking.'],
['He seems ___ about the new project.', 'happy', ['happily','happiness','happierly'], 'Seem + adjective: happy.'],
['She looked ___ at the map to find the station.', 'carefully', ['careful','care','caring'], 'Look at là hành động nhìn → trạng từ carefully.'],
['The air in the park smells ___.', 'fresh', ['freshly','freshness','refresh'], 'Smell mô tả đặc điểm của air → fresh.'],
['I ___ that green spaces improve city life.', 'believe', ['am believing','believes','believing'], 'Believe mang nghĩa niềm tin → hiện tại đơn.'],
['The streets are becoming ___ as more trees grow.', 'greener', ['greenly','greenness','greenestly'], 'Become là động từ nối; greener là tính từ so sánh phù hợp.'],
['My sister ___ travelling by metro to driving.', 'prefers', ['is preferring','prefer','preferring'], 'Prefer là trạng thái sở thích; she → prefers.'],
['The children feel ___ after the long walk.', 'tired', ['tiredly','tiredness','tiringly'], 'Feel là động từ nối; tired mô tả trạng thái của children.']
],
unit4: [
['___ English helps students communicate internationally.', 'Learning', ['Learn','Learns','Learned'], 'Danh động từ làm chủ ngữ → Learning.'],
['They enjoy ___ students from other ASEAN countries.', 'meeting', ['to meet','meet','met'], 'Sau enjoy dùng danh động từ V-ing → meeting, không dùng to meet.'],
['She is interested in ___ the youth exchange.', 'joining', ['join','to join','joins'], 'Sau giới từ in dùng V-ing.'],
['I look forward to ___ from you soon.', 'hearing', ['hear','to hear','heard'], 'To trong look forward to là giới từ → hearing.'],
['We decided ___ for the volunteer programme.', 'to apply', ['applying','apply','applied'], 'Sau decide dùng to + động từ nguyên mẫu → to apply, không dùng applying.'],
['He left without ___ goodbye.', 'saying', ['say','to say','said'], 'Without là giới từ → saying.'],
['___ in community projects is rewarding.', 'Volunteering', ['Volunteer','Volunteers','Volunteered'], 'V-ing làm chủ ngữ chỉ hoạt động tình nguyện.'],
['The teacher suggested ___ a cultural festival.', 'organising', ['to organise','organise','organised'], 'Sau suggest dùng danh động từ V-ing → organising, không dùng to organise.'],
['He stopped ___ last year and has not smoked since.', 'smoking', ['to smoke','smoke','smoked'], 'Ngừng hẳn việc hút thuốc → stop smoking.'],
['After walking for an hour, we stopped ___ some water, then continued walking.', 'to drink', ['drinking','drink','drank'], 'Dừng việc đi bộ để uống nước → stop to drink.'],
['Remember ___ the application form tomorrow.', 'to send', ['sending','send','sent'], 'Nhớ phải thực hiện một việc trong tương lai → remember to send.'],
['I remember ___ her at the forum last year.', 'meeting', ['to meet','meet','meets'], 'Nhớ lại việc đã làm → remember + V-ing.'],
['They avoided ___ about sensitive topics.', 'talking', ['to talk','talk','talked'], 'Sau avoid dùng danh động từ V-ing → talking, không dùng to talk.'],
['Would you mind ___ the window?', 'opening', ['to open','open','opened'], 'Cấu trúc nhờ lịch sự Would you mind + V-ing? → opening.'],
['Mai is used to ___ with international teams.', 'working', ['work','to work','worked'], 'Be used to + V-ing = quen với việc gì.'],
['We hope ___ the exchange next summer.', 'to join', ['joining','join','joined'], 'Sau hope dùng to + động từ nguyên mẫu → to join, không dùng joining.']
]
};
const GRAMMAR_BANK = Object.fromEntries(Object.entries(RAW).map(([unit, rows]) => [unit, rows.map(([prompt,correct,wrong,explanation],i) => ({id:`${unit}-g${i+1}`, unit, kind:'grammar', prompt, correct, options:[correct,...wrong], explanation}))]));
function buildBank(unit, words) {
  const valid = words.filter(w => w.word && w.vietnamese);
  // Unique meanings keep the displayed answers unambiguous.
  const vocabulary = valid.flatMap(w => {
    const meanings = [...new Set(valid.filter(x => x.vietnamese !== w.vietnamese).map(x => x.vietnamese))];
    if (meanings.length < 3) return [];
    return [{id:`${unit}-v-${w.id}`,unit,kind:'vocabulary',prompt:`“${w.word}” có nghĩa là gì? / What does “${w.word}” mean?`,correct:w.vietnamese,options:[w.vietnamese,...shuffle(meanings).slice(0,3)],explanation:`${w.word} (${w.pos}) = ${w.vietnamese}. Ví dụ / Example: ${w.example}`,wordId:w.id}];
  });
  return [...GRAMMAR_BANK[unit], ...vocabulary];
}

function normalizeProgress(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid progress');
  return {
    ...data,
    masteredWords: Array.isArray(data.masteredWords) ? [...new Set(data.masteredWords.filter(x=>typeof x==='string'))] : [],
    reviewWords: Array.isArray(data.reviewWords) ? data.reviewWords.filter(x=>typeof x==='string') : [],
    mistakesNotebook: Array.isArray(data.mistakesNotebook) ? data.mistakesNotebook.filter(x=>x && typeof x==='object' && (typeof x.wordId==='string' || typeof x.questionId==='string')) : [],
    xp: Number.isFinite(data.xp) && data.xp >= 0 ? data.xp : 0,
    streak: Number.isFinite(data.streak) && data.streak >= 0 ? data.streak : 0
  };
}

const imported = [
  {
    "id": "u1-doc01-ex1-q011",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Many of the diseases that can be cured today ____________ likely to cause death in the past.",
    "content": "Many of the diseases that can be cured today ____________ likely to cause death in the past.",
    "correct": "were",
    "correctAnswer": "were",
    "explanation": "Có “in the past” → quá khứ đơn; chủ ngữ diseases số nhiều → were.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 11,
      "paragraphs": [
        28,
        29
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q11 · P28–P29",
    "validated": true,
    "options": [
      "are",
      "were",
      "have been",
      "will be"
    ]
  },
  {
    "id": "u1-doc01-ex1-q012",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "I have received treatment for my health problem ____________.",
    "content": "I have received treatment for my health problem ____________.",
    "correct": "recently",
    "correctAnswer": "recently",
    "explanation": "Recently đứng cuối câu hiện tại hoàn thành. Ago cần khoảng thời gian; since cần mốc bắt đầu.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 12,
      "paragraphs": [
        30,
        31
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q12 · P30–P31",
    "validated": true,
    "options": [
      "just",
      "ago",
      "since",
      "recently"
    ]
  },
  {
    "id": "u1-doc01-ex1-q016",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "I ate a lot of chips and burgers when I was younger, but I have since ____________ my eating habits.",
    "content": "I ate a lot of chips and burgers when I was younger, but I have since ____________ my eating habits.",
    "correct": "changed",
    "correctAnswer": "changed",
    "explanation": "Cấu trúc have + V3: have since changed. Không lặp have sau since.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 16,
      "paragraphs": [
        39,
        40
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q16 · P39–P40",
    "validated": true,
    "options": [
      "changing",
      "changes",
      "have changed",
      "changed"
    ]
  },
  {
    "id": "u1-doc01-ex1-q032",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "She ____________ a healthy routine last year, but this year, she has been making healthier choices every day.",
    "content": "She ____________ a healthy routine last year, but this year, she has been making healthier choices every day.",
    "correct": "didn't follow",
    "correctAnswer": "didn't follow",
    "explanation": "Last year là giai đoạn quá khứ đã kết thúc → did not + V: didn’t follow.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 32,
      "paragraphs": [
        71,
        72
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q32 · P71–P72",
    "validated": true,
    "options": [
      "doesn’t follow",
      "has followed",
      "hasn’t followed",
      "didn't follow"
    ]
  },
  {
    "id": "u1-doc01-ex1-q038",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "She has never had a headache this severe ____________, which is why she decided to visit a doctor.",
    "content": "She has never had a headache this severe ____________, which is why she decided to visit a doctor.",
    "correct": "before",
    "correctAnswer": "before",
    "explanation": "Never ... before = chưa từng ... trước đây; before phù hợp với trải nghiệm đến hiện tại.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 38,
      "paragraphs": [
        83,
        84
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q38 · P83–P84",
    "validated": true,
    "options": [
      "after",
      "before",
      "since",
      "yet"
    ]
  },
  {
    "id": "u1-doc01-ex1-q108",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "If you're tired all the time, ____________ going to bed earlier each night.",
    "content": "If you're tired all the time, ____________ going to bed earlier each night.",
    "correct": "try",
    "correctAnswer": "try",
    "explanation": "Try + V-ing đề xuất thử một cách để cải thiện tình trạng mệt mỏi → try going to bed earlier.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 108,
      "paragraphs": [
        208,
        209
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q108 · P208–P209",
    "validated": true,
    "options": [
      "remember",
      "try",
      "stop",
      "have"
    ]
  },
  {
    "id": "u1-doc01-ex1-q054",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "The doctors have discussed his treatment ____________ hours, but haven’t made a final decision.",
    "content": "The doctors have discussed his treatment ____________ hours, but haven’t made a final decision.",
    "correct": "for",
    "correctAnswer": "for",
    "explanation": "Hours là khoảng thời gian → for hours; since phải đi với mốc bắt đầu.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 54,
      "paragraphs": [
        114,
        115
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q54 · P114–P115",
    "validated": true,
    "options": [
      "for",
      "in",
      "since",
      "ago"
    ]
  },
  {
    "id": "u1-doc01-ex1-q058",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Life expectancy ____________ greatly over the past 200 years.",
    "content": "Life expectancy ____________ greatly over the past 200 years.",
    "correct": "has increased",
    "correctAnswer": "has increased",
    "explanation": "Over the past 200 years kéo dài đến hiện tại → has increased; life expectancy số ít.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 58,
      "paragraphs": [
        120,
        121
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q58 · P120–P121",
    "validated": true,
    "options": [
      "will increase",
      "increases",
      "increased",
      "has increased"
    ]
  },
  {
    "id": "u1-doc01-ex1-q061",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "How long ____________ a headache? I think you should see a doctor.",
    "content": "How long ____________ a headache? I think you should see a doctor.",
    "correct": "have you had",
    "correctAnswer": "have you had",
    "explanation": "How long hỏi độ dài trạng thái đau đầu còn liên quan hiện tại → have you had.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 61,
      "paragraphs": [
        125,
        126
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q61 · P125–P126",
    "validated": true,
    "options": [
      "have you had",
      "did you have",
      "will you have",
      "do you have"
    ]
  },
  {
    "id": "u1-doc01-ex1-q064",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Emma ____________ down on fast food significantly over the past few months because she has wanted to adopt a healthier lifestyle.",
    "content": "Emma ____________ down on fast food significantly over the past few months because she has wanted to adopt a healthier lifestyle.",
    "correct": "has cut",
    "correctAnswer": "has cut",
    "explanation": "Over the past few months liên hệ khoảng thời gian đến hiện tại → has cut.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 64,
      "paragraphs": [
        129,
        130
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q64 · P129–P130",
    "validated": true,
    "options": [
      "was cutting",
      "has cut",
      "cut",
      "had cut"
    ]
  },
  {
    "id": "u1-doc01-ex1-q074",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "I started eating more vegetables last week, but I ____________ down on sugary drinks yet.",
    "content": "I started eating more vegetables last week, but I ____________ down on sugary drinks yet.",
    "correct": "haven’t cut",
    "correctAnswer": "haven’t cut",
    "explanation": "Yet trong câu phủ định, ý chưa cắt giảm đến nay → haven’t cut.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 74,
      "paragraphs": [
        145,
        146
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q74 · P145–P146",
    "validated": true,
    "options": [
      "haven’t cut",
      "have cut",
      "didn’t cut",
      "was cutting"
    ]
  },
  {
    "id": "u1-doc01-ex1-q076",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "She ____________ out every day this week, but she ____________ a session yesterday because of a headache.",
    "content": "She ____________ out every day this week, but she ____________ a session yesterday because of a headache.",
    "correct": "has worked – missed",
    "correctAnswer": "has worked – missed",
    "explanation": "Every day this week là thành tích đến hiện tại → has worked; yesterday → missed.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 76,
      "paragraphs": [
        148,
        150
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q76 · P148–P150",
    "validated": true,
    "options": [
      "has worked – has missed",
      "has worked – missed",
      "worked – missed",
      "worked – has missed"
    ]
  },
  {
    "id": "u1-doc01-ex1-q081",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "My father ____________ late at work last month. He felt exhausted.",
    "content": "My father ____________ late at work last month. He felt exhausted.",
    "correct": "stayed",
    "correctAnswer": "stayed",
    "explanation": "Last month đã kết thúc → quá khứ đơn stayed; stay là nguyên mẫu nên không phù hợp.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 81,
      "paragraphs": [
        158,
        159
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q81 · P158–P159",
    "validated": true,
    "options": [
      "stay",
      "stayed",
      "has stayed",
      "will stay"
    ]
  },
  {
    "id": "u1-doc01-ex1-q094",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "So far, scientists ____________ many ways to help people live longer.",
    "content": "So far, scientists ____________ many ways to help people live longer.",
    "correct": "have discovered",
    "correctAnswer": "have discovered",
    "explanation": "So far = tính đến nay → have discovered; scientists số nhiều đi với have.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 94,
      "paragraphs": [
        180,
        181
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q94 · P180–P181",
    "validated": true,
    "options": [
      "discovered",
      "had discovered",
      "discover",
      "have discovered"
    ]
  },
  {
    "id": "u1-doc01-ex1-q095",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "She ____________ sugary snacks for over two years to keep her weight stable.",
    "content": "She ____________ sugary snacks for over two years to keep her weight stable.",
    "correct": "has avoided",
    "correctAnswer": "has avoided",
    "explanation": "For over two years diễn tả việc duy trì đến nay → has avoided.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 95,
      "paragraphs": [
        182,
        183
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q95 · P182–P183",
    "validated": true,
    "options": [
      "avoids",
      "has avoided",
      "was avoiding",
      "avoided"
    ]
  },
  {
    "id": "u1-doc01-ex1-q097",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Up to now, many scientists ____________ about the benefits of drinking enough water.",
    "content": "Up to now, many scientists ____________ about the benefits of drinking enough water.",
    "correct": "have written",
    "correctAnswer": "have written",
    "explanation": "Up to now = cho đến hiện tại → have written; written là V3 của write.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 97,
      "paragraphs": [
        186,
        187
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q97 · P186–P187",
    "validated": true,
    "options": [
      "have written",
      "wrote",
      "write",
      "written"
    ]
  },
  {
    "id": "u1-doc01-ex1-q098",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Have your grandparents ____________ any healthy diets to live longer?",
    "content": "Have your grandparents ____________ any healthy diets to live longer?",
    "correct": "followed",
    "correctAnswer": "followed",
    "explanation": "Have + chủ ngữ + V3 trong câu hỏi hiện tại hoàn thành → followed.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 98,
      "paragraphs": [
        188,
        189
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q98 · P188–P189",
    "validated": true,
    "options": [
      "have followed",
      "following",
      "follow",
      "followed"
    ]
  },
  {
    "id": "u1-doc01-ex1-q099",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "I ____________ doing yoga to reduce stress and improve my breathing.",
    "content": "I ____________ doing yoga to reduce stress and improve my breathing.",
    "correct": "have just started",
    "correctAnswer": "have just started",
    "explanation": "Vị trí just thường nằm giữa have/has và V3 → have just started.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 99,
      "paragraphs": [
        190,
        191
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q99 · P190–P191",
    "validated": true,
    "options": [
      "started just",
      "have just started",
      "just have started",
      "have started just"
    ]
  },
  {
    "id": "u1-doc01-ex1-q100",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Huy ____________ up jogging three times, but the first time he ____________ it was in 2015.",
    "content": "Huy ____________ up jogging three times, but the first time he ____________ it was in 2015.",
    "correct": "has taken – tried",
    "correctAnswer": "has taken – tried",
    "explanation": "Three times là trải nghiệm đến nay → has taken; in 2015 là quá khứ xác định → tried.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 100,
      "paragraphs": [
        192,
        193
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q100 · P192–P193",
    "validated": true,
    "options": [
      "has been – had tried",
      "has taken – tried",
      "took – has tried",
      "takes – tries"
    ]
  },
  {
    "id": "u1-doc01-ex1-q101",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "You should stop ____________ fast food if you want to lose weight.",
    "content": "You should stop ____________ fast food if you want to lose weight.",
    "correct": "eating",
    "correctAnswer": "eating",
    "explanation": "Stop eating = ngừng ăn. Stop to eat = dừng việc khác để ăn, trái mục đích giảm cân trong câu.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 101,
      "paragraphs": [
        194,
        195
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q101 · P194–P195",
    "validated": true,
    "options": [
      "to eating",
      "eating",
      "eat",
      "to eat"
    ]
  },
  {
    "id": "u1-doc01-ex1-q103",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Students ____________ up late at night often feel tired and stressed the next day.",
    "content": "Students ____________ up late at night often feel tired and stressed the next day.",
    "correct": "staying",
    "correctAnswer": "staying",
    "explanation": "Students staying up late = students who stay up late. Rút gọn mệnh đề quan hệ chủ động bằng V-ing.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 103,
      "paragraphs": [
        198,
        199
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q103 · P198–P199",
    "validated": true,
    "options": [
      "who stays",
      "staying",
      "stayed",
      "stay"
    ]
  },
  {
    "id": "u1-doc01-ex1-q104",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "We learned useful health tips ____________ the school nurse during our weekly class meeting.",
    "content": "We learned useful health tips ____________ the school nurse during our weekly class meeting.",
    "correct": "from",
    "correctAnswer": "from",
    "explanation": "Cấu trúc learn something from somebody = học điều gì từ ai → from.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 104,
      "paragraphs": [
        200,
        201
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q104 · P200–P201",
    "validated": true,
    "options": [
      "by",
      "of",
      "from",
      "on"
    ]
  },
  {
    "id": "u1-doc01-ex1-q107",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Teenagers should ____________ more time doing exercise instead of playing online games.",
    "content": "Teenagers should ____________ more time doing exercise instead of playing online games.",
    "correct": "spend",
    "correctAnswer": "spend",
    "explanation": "Spend time doing something = dành thời gian làm gì → spend.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 107,
      "paragraphs": [
        206,
        207
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q107 · P206–P207",
    "validated": true,
    "options": [
      "take",
      "use",
      "waste",
      "spend"
    ]
  },
  {
    "id": "u1-doc01-ex1-q109",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Many doctors advise patients to avoid ____________ to protect their lungs.",
    "content": "Many doctors advise patients to avoid ____________ to protect their lungs.",
    "correct": "smoking",
    "correctAnswer": "smoking",
    "explanation": "Sau avoid dùng V-ing → avoid smoking, không dùng to smoking hay nguyên mẫu.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 109,
      "paragraphs": [
        210,
        211
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q109 · P210–P211",
    "validated": true,
    "options": [
      "smoke",
      "to smoking",
      "smoking",
      "smoked"
    ]
  },
  {
    "id": "u1-doc01-ex1-q111",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "I remember ____________ to the hospital for a health check when I was ten.",
    "content": "I remember ____________ to the hospital for a health check when I was ten.",
    "correct": "going",
    "correctAnswer": "going",
    "explanation": "Remember + V-ing chỉ nhớ việc đã làm. “When I was ten” cho thấy đây là ký ức quá khứ → going.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 111,
      "paragraphs": [
        214,
        215
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q111 · P214–P215",
    "validated": true,
    "options": [
      "to go",
      "going",
      "went",
      "go"
    ]
  },
  {
    "id": "u1-doc01-ex1-q114",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "To begin with, you need ____________ a daily routine that includes physical activities.",
    "content": "To begin with, you need ____________ a daily routine that includes physical activities.",
    "correct": "to plan",
    "correctAnswer": "to plan",
    "explanation": "Need + to-V khi chủ ngữ cần thực hiện việc gì → need to plan.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 114,
      "paragraphs": [
        220,
        221
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q114 · P220–P221",
    "validated": true,
    "options": [
      "plan",
      "to plan",
      "planed",
      "planning"
    ]
  },
  {
    "id": "u1-doc01-ex1-q121",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "How about ____________ some yoga to relieve stress and relax your body?",
    "content": "How about ____________ some yoga to relieve stress and relax your body?",
    "correct": "doing",
    "correctAnswer": "doing",
    "explanation": "Đề xuất bằng How about + V-ing? → How about doing some yoga?",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 121,
      "paragraphs": [
        234,
        235
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q121 · P234–P235",
    "validated": true,
    "options": [
      "doing",
      "to do",
      "do",
      "to doing"
    ]
  },
  {
    "id": "u1-doc01-ex1-q122",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "Don’t ____________ to stretch your body before starting a heavy workout.",
    "content": "Don’t ____________ to stretch your body before starting a heavy workout.",
    "correct": "forget",
    "correctAnswer": "forget",
    "explanation": "Sau trợ động từ don’t dùng động từ nguyên mẫu → don’t forget.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 122,
      "paragraphs": [
        236,
        237
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q122 · P236–P237",
    "validated": true,
    "options": [
      "forgotten",
      "forgetting",
      "forgot",
      "forget"
    ]
  },
  {
    "id": "u1-doc01-ex1-q123",
    "unit": "unit1",
    "topic": "Past simple / present perfect and verb patterns",
    "kind": "grammar",
    "exerciseType": "verb-forms",
    "difficulty": "medium",
    "prompt": "We are pleased ____________ any campaign that promotes a healthy lifestyle.",
    "content": "We are pleased ____________ any campaign that promotes a healthy lifestyle.",
    "correct": "to support",
    "correctAnswer": "to support",
    "explanation": "Cấu trúc be pleased + to-V = vui khi làm điều gì → pleased to support.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 123,
      "paragraphs": [
        238,
        239
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q123 · P238–P239",
    "validated": true,
    "options": [
      "support",
      "supporting",
      "to support",
      "supported"
    ]
  },
  {
    "id": "u1-doc01-ex1-q001",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "Although Huy’s over 80, Huy’s still full ____________ energy and walks every day.",
    "content": "Although Huy’s over 80, Huy’s still full ____________ energy and walks every day.",
    "correct": "of",
    "correctAnswer": "of",
    "explanation": "Cụm full of energy = tràn đầy năng lượng → giới từ of.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 1,
      "paragraphs": [
        7,
        8
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q1 · P7–P8",
    "validated": true,
    "options": [
      "about",
      "with",
      "of",
      "on"
    ]
  },
  {
    "id": "u1-doc01-ex1-q002",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "word-formation",
    "difficulty": "easy",
    "prompt": "You should eat a ____________ diet if you want to stay healthy and avoid illness.",
    "content": "You should eat a ____________ diet if you want to stay healthy and avoid illness.",
    "correct": "balanced",
    "correctAnswer": "balanced",
    "explanation": "Trước danh từ diet cần tính từ balanced = cân bằng → a balanced diet.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 2,
      "paragraphs": [
        9,
        10
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q2 · P9–P10",
    "validated": true,
    "options": [
      "balanced",
      "balance",
      "to balance",
      "balancing"
    ]
  },
  {
    "id": "u1-doc01-ex1-q005",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "word-formation",
    "difficulty": "easy",
    "prompt": "Anna exercises every day, so she looks ____________ and healthy.",
    "content": "Anna exercises every day, so she looks ____________ and healthy.",
    "correct": "fit",
    "correctAnswer": "fit",
    "explanation": "Fit là tính từ “khỏe mạnh, cân đối”, phù hợp sau looks và song song với healthy.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 5,
      "paragraphs": [
        15,
        16
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q5 · P15–P16",
    "validated": true,
    "options": [
      "muscle",
      "fit",
      "strength",
      "energy"
    ]
  },
  {
    "id": "u1-doc01-ex1-q010",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "word-formation",
    "difficulty": "easy",
    "prompt": "Watching TV all day is an ____________ habit for children.",
    "content": "Watching TV all day is an ____________ habit for children.",
    "correct": "unhealthy",
    "correctAnswer": "unhealthy",
    "explanation": "Unhealthy là tính từ chỉ thói quen không lành mạnh; xem TV cả ngày là an unhealthy habit.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 10,
      "paragraphs": [
        26,
        27
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q10 · P26–P27",
    "validated": true,
    "options": [
      "heal",
      "health",
      "healthful",
      "unhealthy"
    ]
  },
  {
    "id": "u1-doc01-ex1-q014",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "That ____________ looks delicious, but it has too many calories for one meal, said Emma.",
    "content": "That ____________ looks delicious, but it has too many calories for one meal, said Emma.",
    "correct": "burger",
    "correctAnswer": "burger",
    "explanation": "Burger là đồ ăn có thể có nhiều calories trong một khẩu phần; label và ingredient không phải món ăn hoàn chỉnh.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 14,
      "paragraphs": [
        35,
        36
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q14 · P35–P36",
    "validated": true,
    "options": [
      "label",
      "banana",
      "ingredient",
      "burger"
    ]
  },
  {
    "id": "u1-doc01-ex1-q017",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "word-formation",
    "difficulty": "easy",
    "prompt": "The teacher prepared a fun group ____________ to help Brian practice speaking English",
    "content": "The teacher prepared a fun group ____________ to help Brian practice speaking English",
    "correct": "activity",
    "correctAnswer": "activity",
    "explanation": "Sau a fun group cần danh từ activity = hoạt động; active là tính từ, actively là trạng từ.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 17,
      "paragraphs": [
        41,
        42
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q17 · P41–P42",
    "validated": true,
    "options": [
      "activity",
      "active",
      "actively",
      "activation"
    ]
  },
  {
    "id": "u1-doc01-ex1-q022",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "We studied hard for the final ____________ because it was very important.",
    "content": "We studied hard for the final ____________ because it was very important.",
    "correct": "examination",
    "correctAnswer": "examination",
    "explanation": "Final examination = kỳ thi cuối kỳ; studied hard phù hợp với examination.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 22,
      "paragraphs": [
        50,
        51
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q22 · P50–P51",
    "validated": true,
    "options": [
      "choice",
      "appointment",
      "examination",
      "preparation"
    ]
  },
  {
    "id": "u1-doc01-ex1-q023",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "If your ____________ continues, you should see a doctor and rest more.",
    "content": "If your ____________ continues, you should see a doctor and rest more.",
    "correct": "headache",
    "correctAnswer": "headache",
    "explanation": "Headache là cơn đau có thể tiếp diễn; back, leg, stomach chỉ bộ phận cơ thể.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 23,
      "paragraphs": [
        52,
        53
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q23 · P52–P53",
    "validated": true,
    "options": [
      "back",
      "leg",
      "stomach",
      "headache"
    ]
  },
  {
    "id": "u1-doc01-ex1-q025",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "Mom: Can you check the ____________ on this bottle? Son: Sure! It says “organic and sugar – free.”",
    "content": "Mom: Can you check the ____________ on this bottle? Son: Sure! It says “organic and sugar – free.”",
    "correct": "label",
    "correctAnswer": "label",
    "explanation": "Nhãn trên chai ghi thông tin organic và sugar-free → label.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 25,
      "paragraphs": [
        56,
        58
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q25 · P56–P58",
    "validated": true,
    "options": [
      "recipe",
      "sign",
      "label",
      "logo"
    ]
  },
  {
    "id": "u1-doc01-ex1-q026",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "Flour, eggs, and sugar are the main ____________ used to make this delicious cake.",
    "content": "Flour, eggs, and sugar are the main ____________ used to make this delicious cake.",
    "correct": "ingredients",
    "correctAnswer": "ingredients",
    "explanation": "Flour, eggs, sugar là các nguyên liệu nấu ăn → ingredients.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 26,
      "paragraphs": [
        59,
        60
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q26 · P59–P60",
    "validated": true,
    "options": [
      "elements",
      "items",
      "ingredients",
      "materials"
    ]
  },
  {
    "id": "u1-doc01-ex1-q027",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "Fruits and vegetables are rich in vitamins and ____________ that help your body stay strong.",
    "content": "Fruits and vegetables are rich in vitamins and ____________ that help your body stay strong.",
    "correct": "minerals",
    "correctAnswer": "minerals",
    "explanation": "Cụm vitamins and minerals = vitamin và khoáng chất.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 27,
      "paragraphs": [
        61,
        62
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q27 · P61–P62",
    "validated": true,
    "options": [
      "minerals",
      "flavors",
      "fats",
      "chemicals"
    ]
  },
  {
    "id": "u1-doc01-ex1-q028",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "The article is ____________ useful tips for living a long and healthy life.",
    "content": "The article is ____________ useful tips for living a long and healthy life.",
    "correct": "full of",
    "correctAnswer": "full of",
    "explanation": "Full of useful tips = chứa nhiều mẹo hữu ích. Các cụm còn lại không diễn tả nội dung bài viết.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 28,
      "paragraphs": [
        63,
        64
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q28 · P63–P64",
    "validated": true,
    "options": [
      "full of",
      "away from",
      "up to",
      "proud of"
    ]
  },
  {
    "id": "u1-doc01-ex1-q030",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "Julia follows a morning ____________ that includes stretching, journaling, and a healthy breakfast.",
    "content": "Julia follows a morning ____________ that includes stretching, journaling, and a healthy breakfast.",
    "correct": "routine",
    "correctAnswer": "routine",
    "explanation": "Morning routine = nếp sinh hoạt buổi sáng, gồm nhiều hoạt động lặp lại.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 30,
      "paragraphs": [
        67,
        68
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q30 · P67–P68",
    "validated": true,
    "options": [
      "activity",
      "repetition",
      "routine",
      "option"
    ]
  },
  {
    "id": "u1-doc01-ex1-q037",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "You shouldn’t ____________ the same mistakes in your diet if you want to stay fit.",
    "content": "You shouldn’t ____________ the same mistakes in your diet if you want to stay fit.",
    "correct": "repeat",
    "correctAnswer": "repeat",
    "explanation": "Repeat the same mistakes = lặp lại cùng những lỗi sai → repeat.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 37,
      "paragraphs": [
        81,
        82
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q37 · P81–P82",
    "validated": true,
    "options": [
      "cook",
      "eat",
      "repeat",
      "plan"
    ]
  },
  {
    "id": "u1-doc01-ex1-q045",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "Bacteria are tiny ____________ that can live in your mouth or inside your body.",
    "content": "Bacteria are tiny ____________ that can live in your mouth or inside your body.",
    "correct": "organisms",
    "correctAnswer": "organisms",
    "explanation": "Organisms = các sinh vật; bacteria là sinh vật rất nhỏ, không phải khoáng chất, nhãn hay công thức.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 45,
      "paragraphs": [
        99,
        99
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q45 · P99–P99",
    "validated": true,
    "options": [
      "minerals",
      "labels",
      "recipes",
      "organisms"
    ]
  },
  {
    "id": "u1-doc01-ex1-q047",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "A healthy lung has airways with a larger ____________, which helps with breathing.",
    "content": "A healthy lung has airways with a larger ____________, which helps with breathing.",
    "correct": "diameter",
    "correctAnswer": "diameter",
    "explanation": "Diameter = đường kính; larger diameter mô tả bề rộng đường dẫn khí.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 47,
      "paragraphs": [
        103,
        104
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q47 · P103–P104",
    "validated": true,
    "options": [
      "lifestyle",
      "pressure",
      "diameter",
      "length"
    ]
  },
  {
    "id": "u1-doc01-ex1-q050",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "____________ is a serious lung disease that needs long treatment with medicine.",
    "content": "____________ is a serious lung disease that needs long treatment with medicine.",
    "correct": "Tuberculosis",
    "correctAnswer": "Tuberculosis",
    "explanation": "Trong ngữ cảnh bài học, tuberculosis là tên bệnh lao; các lựa chọn còn lại không phải tên bệnh phổi này.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 50,
      "paragraphs": [
        108,
        108
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q50 · P108–P108",
    "validated": true,
    "options": [
      "Fitness",
      "Tuberculosis",
      "Stomach",
      "Headache"
    ]
  },
  {
    "id": "u1-doc01-ex1-q053",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "You can’t see ____________, but they are everywhere—in the air, water, and food.",
    "content": "You can’t see ____________, but they are everywhere—in the air, water, and food.",
    "correct": "germs",
    "correctAnswer": "germs",
    "explanation": "Germs = vi trùng rất nhỏ, không nhìn thấy bằng mắt thường trong ngữ cảnh này.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 53,
      "paragraphs": [
        113,
        113
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q53 · P113–P113",
    "validated": true,
    "options": [
      "ingredients",
      "germs",
      "minerals",
      "squats"
    ]
  },
  {
    "id": "u1-doc01-ex1-q055",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "gap-filling",
    "difficulty": "easy",
    "prompt": "She stayed in bed because she felt ____________ and couldn’t go to work.",
    "content": "She stayed in bed because she felt ____________ and couldn’t go to work.",
    "correct": "ill",
    "correctAnswer": "ill",
    "explanation": "Felt ill = cảm thấy ốm; ngữ cảnh ở nhà, không đi làm được cần tính từ ill.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 55,
      "paragraphs": [
        116,
        116
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q55 · P116–P116",
    "validated": true,
    "options": [
      "repetitive",
      "strong",
      "ill",
      "active"
    ]
  },
  {
    "id": "u1-doc01-ex1-q056",
    "unit": "unit1",
    "topic": "Healthy life vocabulary",
    "kind": "vocabulary",
    "exerciseType": "word-formation",
    "difficulty": "easy",
    "prompt": "Stress and lack of sleep can lead to ____________ over time.",
    "content": "Stress and lack of sleep can lead to ____________ over time.",
    "correct": "serious illness",
    "correctAnswer": "serious illness",
    "explanation": "Cần cụm danh từ sau lead to: tính từ serious đứng trước danh từ illness → serious illness.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 1",
      "question": 56,
      "paragraphs": [
        117,
        117
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 1 · Q56 · P117–P117",
    "validated": true,
    "options": [
      "serious ill",
      "serious illness",
      "ill serious",
      "illness serious"
    ]
  },
  {
    "id": "u1-doc01-ex2-q01",
    "unit": "unit1",
    "topic": "Past simple / present perfect transformations",
    "kind": "grammar",
    "exerciseType": "sentence-transformation",
    "difficulty": "hard",
    "prompt": "I haven’t eaten junk food for two weeks. The last time ...",
    "content": "I haven’t eaten junk food for two weeks. The last time ...",
    "correct": "The last time I ate junk food was two weeks ago.",
    "correctAnswer": "The last time I ate junk food was two weeks ago.",
    "explanation": "Hiện tại hoàn thành phủ định + for two weeks → The last time + quá khứ đơn + was two weeks ago.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 2",
      "question": 1,
      "paragraphs": [
        241,
        244
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 2 · Q1 · P241–P244",
    "validated": true,
    "acceptedAnswers": [
      "The last time I ate junk food was two weeks ago."
    ]
  },
  {
    "id": "u1-doc01-ex2-q03",
    "unit": "unit1",
    "topic": "Past simple / present perfect transformations",
    "kind": "grammar",
    "exerciseType": "sentence-transformation",
    "difficulty": "hard",
    "prompt": "It has been six years since my father last went jogging. The last time ...",
    "content": "It has been six years since my father last went jogging. The last time ...",
    "correct": "The last time my father went jogging was six years ago.",
    "correctAnswer": "The last time my father went jogging was six years ago.",
    "explanation": "It has been + khoảng thời gian + since ... last ... → The last time ... was + khoảng thời gian + ago.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 2",
      "question": 3,
      "paragraphs": [
        248,
        249
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 2 · Q3 · P248–P249",
    "validated": true,
    "acceptedAnswers": [
      "The last time my father went jogging was six years ago."
    ]
  },
  {
    "id": "u1-doc01-ex2-q04",
    "unit": "unit1",
    "topic": "Past simple / present perfect transformations",
    "kind": "grammar",
    "exerciseType": "sentence-transformation",
    "difficulty": "hard",
    "prompt": "She started practicing yoga when she was 30. Rewrite using “since”.",
    "content": "She started practicing yoga when she was 30. Rewrite using “since”.",
    "correct": "She has practiced yoga since she was 30.",
    "correctAnswer": "She has practiced yoga since she was 30.",
    "explanation": "Hoạt động bắt đầu ở mốc “when she was 30” và tiếp diễn → hiện tại hoàn thành + since. Chấp nhận dạng hoàn thành tiếp diễn phù hợp.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 2",
      "question": 4,
      "paragraphs": [
        250,
        251
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 2 · Q4 · P250–P251",
    "validated": true,
    "acceptedAnswers": [
      "She has practiced yoga since she was 30.",
      "She has practised yoga since she was 30.",
      "She has been practicing yoga since she was 30.",
      "She has been practising yoga since she was 30."
    ]
  },
  {
    "id": "u1-doc01-ex2-q07",
    "unit": "unit1",
    "topic": "Past simple / present perfect transformations",
    "kind": "grammar",
    "exerciseType": "sentence-transformation",
    "difficulty": "hard",
    "prompt": "This is the first time I have tried doing morning exercises. Rewrite using “before”.",
    "content": "This is the first time I have tried doing morning exercises. Rewrite using “before”.",
    "correct": "I have never tried doing morning exercises before.",
    "correctAnswer": "I have never tried doing morning exercises before.",
    "explanation": "This is the first time + hiện tại hoàn thành → chưa từng làm việc ấy trước đây: have never / have not ... before.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 2",
      "question": 7,
      "paragraphs": [
        258,
        259
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 2 · Q7 · P258–P259",
    "validated": true,
    "acceptedAnswers": [
      "I have never tried doing morning exercises before.",
      "I have not tried doing morning exercises before.",
      "I haven’t tried doing morning exercises before."
    ]
  },
  {
    "id": "u1-doc01-ex2-q14",
    "unit": "unit1",
    "topic": "Past simple / present perfect transformations",
    "kind": "grammar",
    "exerciseType": "sentence-transformation",
    "difficulty": "hard",
    "prompt": "When was the last time he took a break from social media? Rewrite using “last”.",
    "content": "When was the last time he took a break from social media? Rewrite using “last”.",
    "correct": "When did he last take a break from social media?",
    "correctAnswer": "When did he last take a break from social media?",
    "explanation": "When was the last time + S + V2? → When did + S + last + V nguyên mẫu?",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 2",
      "question": 14,
      "paragraphs": [
        277,
        278
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 2 · Q14 · P277–P278",
    "validated": true,
    "acceptedAnswers": [
      "When did he last take a break from social media?"
    ]
  },
  {
    "id": "u1-doc01-ex4-q01",
    "unit": "unit1",
    "topic": "Healthy eating leaflet",
    "kind": "exam",
    "exerciseType": "cloze-test",
    "difficulty": "medium",
    "prompt": "Choose the best answer for blank (1) in the leaflet.",
    "content": "Choose the best answer for blank (1) in the leaflet.",
    "correct": "As a result",
    "correctAnswer": "As a result",
    "explanation": "As a result nối nguyên nhân bận rộn với hệ quả chọn đồ ăn nhanh.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 4",
      "question": 1,
      "paragraphs": [
        294,
        304
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 4 · Q1 · P294–P304",
    "validated": true,
    "passageId": "u1-doc01-ex4",
    "passage": "One of the main reasons our diets are unhealthy is the lack of time. With busy schedules and fast – paced lifestyles, people often turn to fast food or pre – packaged meals that are high in calories, sugar, and unhealthy fats. (1) ____________, these quick and convenient options become the default choice which leads to poor nutrition. Another factor contributing to unhealthy eating habits is the rise of mukbang videos, where hosts consume huge (2) ____________ of food in a single sitting. These videos can influence viewers to normalize overeating or to mimic similar eating (3) ____________, ultimately leading to poor food choices and health risks.\n\nTips for Healthy Eating\n\nTake some time each week to prepare a meal plan. Having healthy options readily (4) ____________ can help you avoid impulsive, unhealthy food choices when you’re busy.\n\nInstead of watching mukbang videos, try following cooking channels that share (5) ____________ for healthy and delicious meals. These can inspire you to cook at home and make better food choices.\n\nTry to (6) ____________ on your intake of processed snacks and sugary drinks. Instead, opt for fresh fruits, vegetables, and whole grains that provide better nutrition and keep you energized throughout the day.",
    "passageTitle": "Healthy Eating: A Guide to Better Living Let’s make healthier choices every day!",
    "options": [
      "In contrast",
      "For example",
      "As a result",
      "In addition"
    ]
  },
  {
    "id": "u1-doc01-ex4-q02",
    "unit": "unit1",
    "topic": "Healthy eating leaflet",
    "kind": "exam",
    "exerciseType": "cloze-test",
    "difficulty": "medium",
    "prompt": "Choose the best answer for blank (2) in the leaflet.",
    "content": "Choose the best answer for blank (2) in the leaflet.",
    "correct": "amounts",
    "correctAnswer": "amounts",
    "explanation": "Food là danh từ không đếm được → huge amounts of food, không dùng numbers.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 4",
      "question": 2,
      "paragraphs": [
        294,
        304
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 4 · Q2 · P294–P304",
    "validated": true,
    "passageId": "u1-doc01-ex4",
    "passage": "One of the main reasons our diets are unhealthy is the lack of time. With busy schedules and fast – paced lifestyles, people often turn to fast food or pre – packaged meals that are high in calories, sugar, and unhealthy fats. (1) ____________, these quick and convenient options become the default choice which leads to poor nutrition. Another factor contributing to unhealthy eating habits is the rise of mukbang videos, where hosts consume huge (2) ____________ of food in a single sitting. These videos can influence viewers to normalize overeating or to mimic similar eating (3) ____________, ultimately leading to poor food choices and health risks.\n\nTips for Healthy Eating\n\nTake some time each week to prepare a meal plan. Having healthy options readily (4) ____________ can help you avoid impulsive, unhealthy food choices when you’re busy.\n\nInstead of watching mukbang videos, try following cooking channels that share (5) ____________ for healthy and delicious meals. These can inspire you to cook at home and make better food choices.\n\nTry to (6) ____________ on your intake of processed snacks and sugary drinks. Instead, opt for fresh fruits, vegetables, and whole grains that provide better nutrition and keep you energized throughout the day.",
    "passageTitle": "Healthy Eating: A Guide to Better Living Let’s make healthier choices every day!",
    "options": [
      "amounts",
      "numbers",
      "levels",
      "qualities"
    ]
  },
  {
    "id": "u1-doc01-ex4-q03",
    "unit": "unit1",
    "topic": "Healthy eating leaflet",
    "kind": "exam",
    "exerciseType": "cloze-test",
    "difficulty": "medium",
    "prompt": "Choose the best answer for blank (3) in the leaflet.",
    "content": "Choose the best answer for blank (3) in the leaflet.",
    "correct": "behaviors",
    "correctAnswer": "behaviors",
    "explanation": "Eating behaviors = hành vi ăn uống; ngữ cảnh bắt chước cách ăn trong video.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 4",
      "question": 3,
      "paragraphs": [
        294,
        304
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 4 · Q3 · P294–P304",
    "validated": true,
    "passageId": "u1-doc01-ex4",
    "passage": "One of the main reasons our diets are unhealthy is the lack of time. With busy schedules and fast – paced lifestyles, people often turn to fast food or pre – packaged meals that are high in calories, sugar, and unhealthy fats. (1) ____________, these quick and convenient options become the default choice which leads to poor nutrition. Another factor contributing to unhealthy eating habits is the rise of mukbang videos, where hosts consume huge (2) ____________ of food in a single sitting. These videos can influence viewers to normalize overeating or to mimic similar eating (3) ____________, ultimately leading to poor food choices and health risks.\n\nTips for Healthy Eating\n\nTake some time each week to prepare a meal plan. Having healthy options readily (4) ____________ can help you avoid impulsive, unhealthy food choices when you’re busy.\n\nInstead of watching mukbang videos, try following cooking channels that share (5) ____________ for healthy and delicious meals. These can inspire you to cook at home and make better food choices.\n\nTry to (6) ____________ on your intake of processed snacks and sugary drinks. Instead, opt for fresh fruits, vegetables, and whole grains that provide better nutrition and keep you energized throughout the day.",
    "passageTitle": "Healthy Eating: A Guide to Better Living Let’s make healthier choices every day!",
    "options": [
      "proportions",
      "behaviors",
      "solutions",
      "capacities"
    ]
  },
  {
    "id": "u1-doc01-ex4-q04",
    "unit": "unit1",
    "topic": "Healthy eating leaflet",
    "kind": "exam",
    "exerciseType": "cloze-test",
    "difficulty": "medium",
    "prompt": "Choose the best answer for blank (4) in the leaflet.",
    "content": "Choose the best answer for blank (4) in the leaflet.",
    "correct": "available",
    "correctAnswer": "available",
    "explanation": "Readily available = sẵn có; chuẩn bị trước giúp tránh lựa chọn vội vàng.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 4",
      "question": 4,
      "paragraphs": [
        294,
        304
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 4 · Q4 · P294–P304",
    "validated": true,
    "passageId": "u1-doc01-ex4",
    "passage": "One of the main reasons our diets are unhealthy is the lack of time. With busy schedules and fast – paced lifestyles, people often turn to fast food or pre – packaged meals that are high in calories, sugar, and unhealthy fats. (1) ____________, these quick and convenient options become the default choice which leads to poor nutrition. Another factor contributing to unhealthy eating habits is the rise of mukbang videos, where hosts consume huge (2) ____________ of food in a single sitting. These videos can influence viewers to normalize overeating or to mimic similar eating (3) ____________, ultimately leading to poor food choices and health risks.\n\nTips for Healthy Eating\n\nTake some time each week to prepare a meal plan. Having healthy options readily (4) ____________ can help you avoid impulsive, unhealthy food choices when you’re busy.\n\nInstead of watching mukbang videos, try following cooking channels that share (5) ____________ for healthy and delicious meals. These can inspire you to cook at home and make better food choices.\n\nTry to (6) ____________ on your intake of processed snacks and sugary drinks. Instead, opt for fresh fruits, vegetables, and whole grains that provide better nutrition and keep you energized throughout the day.",
    "passageTitle": "Healthy Eating: A Guide to Better Living Let’s make healthier choices every day!",
    "options": [
      "invisible",
      "acceptable",
      "convenient",
      "available"
    ]
  },
  {
    "id": "u1-doc01-ex4-q05",
    "unit": "unit1",
    "topic": "Healthy eating leaflet",
    "kind": "exam",
    "exerciseType": "cloze-test",
    "difficulty": "medium",
    "prompt": "Choose the best answer for blank (5) in the leaflet.",
    "content": "Choose the best answer for blank (5) in the leaflet.",
    "correct": "recipes",
    "correctAnswer": "recipes",
    "explanation": "Cooking channels share recipes = các kênh nấu ăn chia sẻ công thức.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 4",
      "question": 5,
      "paragraphs": [
        294,
        304
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 4 · Q5 · P294–P304",
    "validated": true,
    "passageId": "u1-doc01-ex4",
    "passage": "One of the main reasons our diets are unhealthy is the lack of time. With busy schedules and fast – paced lifestyles, people often turn to fast food or pre – packaged meals that are high in calories, sugar, and unhealthy fats. (1) ____________, these quick and convenient options become the default choice which leads to poor nutrition. Another factor contributing to unhealthy eating habits is the rise of mukbang videos, where hosts consume huge (2) ____________ of food in a single sitting. These videos can influence viewers to normalize overeating or to mimic similar eating (3) ____________, ultimately leading to poor food choices and health risks.\n\nTips for Healthy Eating\n\nTake some time each week to prepare a meal plan. Having healthy options readily (4) ____________ can help you avoid impulsive, unhealthy food choices when you’re busy.\n\nInstead of watching mukbang videos, try following cooking channels that share (5) ____________ for healthy and delicious meals. These can inspire you to cook at home and make better food choices.\n\nTry to (6) ____________ on your intake of processed snacks and sugary drinks. Instead, opt for fresh fruits, vegetables, and whole grains that provide better nutrition and keep you energized throughout the day.",
    "passageTitle": "Healthy Eating: A Guide to Better Living Let’s make healthier choices every day!",
    "options": [
      "ingredients",
      "components",
      "recipes",
      "materials"
    ]
  },
  {
    "id": "u1-doc01-ex4-q06",
    "unit": "unit1",
    "topic": "Healthy eating leaflet",
    "kind": "exam",
    "exerciseType": "cloze-test",
    "difficulty": "medium",
    "prompt": "Choose the best answer for blank (6) in the leaflet.",
    "content": "Choose the best answer for blank (6) in the leaflet.",
    "correct": "cut down",
    "correctAnswer": "cut down",
    "explanation": "Cut down on = cắt giảm lượng tiêu thụ; các cụm còn lại không phù hợp với intake.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 4",
      "question": 6,
      "paragraphs": [
        294,
        304
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 4 · Q6 · P294–P304",
    "validated": true,
    "passageId": "u1-doc01-ex4",
    "passage": "One of the main reasons our diets are unhealthy is the lack of time. With busy schedules and fast – paced lifestyles, people often turn to fast food or pre – packaged meals that are high in calories, sugar, and unhealthy fats. (1) ____________, these quick and convenient options become the default choice which leads to poor nutrition. Another factor contributing to unhealthy eating habits is the rise of mukbang videos, where hosts consume huge (2) ____________ of food in a single sitting. These videos can influence viewers to normalize overeating or to mimic similar eating (3) ____________, ultimately leading to poor food choices and health risks.\n\nTips for Healthy Eating\n\nTake some time each week to prepare a meal plan. Having healthy options readily (4) ____________ can help you avoid impulsive, unhealthy food choices when you’re busy.\n\nInstead of watching mukbang videos, try following cooking channels that share (5) ____________ for healthy and delicious meals. These can inspire you to cook at home and make better food choices.\n\nTry to (6) ____________ on your intake of processed snacks and sugary drinks. Instead, opt for fresh fruits, vegetables, and whole grains that provide better nutrition and keep you energized throughout the day.",
    "passageTitle": "Healthy Eating: A Guide to Better Living Let’s make healthier choices every day!",
    "options": [
      "cut down",
      "write down",
      "put down",
      "die down"
    ]
  },
  {
    "id": "u1-doc01-ex7-q01",
    "unit": "unit1",
    "topic": "Healthy habits conversations",
    "kind": "exam",
    "exerciseType": "sentence-arrangement",
    "difficulty": "medium",
    "prompt": "Arrange the utterances in a meaningful order (e.g. a-b-c): a. Liam: I brush them twice a day – in the morning and before bed. b. Emma: That’s great! My dentist says brushing for at least two minutes each time really helps. c. Emma: Liam, how often do you brush your teeth?",
    "content": "Arrange the utterances in a meaningful order (e.g. a-b-c): a. Liam: I brush them twice a day – in the morning and before bed. b. Emma: That’s great! My dentist says brushing for at least two minutes each time really helps. c. Emma: Liam, how often do you brush your teeth?",
    "correct": "c-a-b",
    "correctAnswer": "c-a-b",
    "explanation": "Câu hỏi về tần suất đánh răng → trả lời hai lần mỗi ngày → lời nhận xét của Emma.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 7",
      "question": 1,
      "paragraphs": [
        342,
        343
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 7 · Q1 · P342–P343",
    "validated": true,
    "acceptedAnswers": [
      "c-a-b"
    ]
  },
  {
    "id": "u1-doc01-ex7-q02",
    "unit": "unit1",
    "topic": "Healthy habits conversations",
    "kind": "exam",
    "exerciseType": "sentence-arrangement",
    "difficulty": "medium",
    "prompt": "Arrange the utterances in a meaningful order (e.g. a-b-c): a. Ethan: Try cutting down on sugary snacks and soda. They cause cavities. b. Sophie: Ethan, I’m trying to take better care of my teeth. Any advice? c. Sophie: Good idea! I’ll eat more fruits and drink water instead.",
    "content": "Arrange the utterances in a meaningful order (e.g. a-b-c): a. Ethan: Try cutting down on sugary snacks and soda. They cause cavities. b. Sophie: Ethan, I’m trying to take better care of my teeth. Any advice? c. Sophie: Good idea! I’ll eat more fruits and drink water instead.",
    "correct": "b-a-c",
    "correctAnswer": "b-a-c",
    "explanation": "Sophie xin lời khuyên → Ethan đưa lời khuyên → Sophie đồng ý và nêu hành động.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 7",
      "question": 2,
      "paragraphs": [
        346,
        346
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 7 · Q2 · P346–P346",
    "validated": true,
    "acceptedAnswers": [
      "b-a-c"
    ]
  },
  {
    "id": "u1-doc01-ex7-q03",
    "unit": "unit1",
    "topic": "Healthy habits conversations",
    "kind": "exam",
    "exerciseType": "sentence-arrangement",
    "difficulty": "medium",
    "prompt": "Arrange the utterances in a meaningful order (e.g. a-b-c): a. Oliver: I should start doing that too. I always forget! b. Oliver: Mia, do you go to the dentist regularly? c. Mia: Yes, I have a dental check – up every six months. It helps prevent problems.",
    "content": "Arrange the utterances in a meaningful order (e.g. a-b-c): a. Oliver: I should start doing that too. I always forget! b. Oliver: Mia, do you go to the dentist regularly? c. Mia: Yes, I have a dental check – up every six months. It helps prevent problems.",
    "correct": "b-c-a",
    "correctAnswer": "b-c-a",
    "explanation": "Oliver hỏi về khám răng → Mia trả lời → Oliver nói mình cũng nên làm vậy.",
    "source": {
      "filename": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_8295bc4d80b08191a882aafe36d92016",
      "section": "Exercise 7",
      "question": 3,
      "paragraphs": [
        349,
        350
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Exercise 7 · Q3 · P349–P350",
    "validated": true,
    "acceptedAnswers": [
      "b-c-a"
    ]
  },
  {
    "id": "u1-doc02-q33",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "The word \"they\" in paragraph 2 refers to ____________.",
    "content": "The word \"they\" in paragraph 2 refers to ____________.",
    "correct": "teenagers",
    "correctAnswer": "teenagers",
    "explanation": "They nối lại chủ ngữ teenagers trong đoạn 2, trước khi so sánh giờ ngủ với người lớn.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 33,
      "paragraphs": [
        126,
        127
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q33 · P126–P127",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "adults",
      "sleepy people",
      "teenagers",
      "early risers"
    ]
  },
  {
    "id": "u1-doc02-q34",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "Which of the following is NOT mentioned in the passage as a way to improve sleep quality?",
    "content": "Which of the following is NOT mentioned in the passage as a way to improve sleep quality?",
    "correct": "Doing homework right before going to bed",
    "correctAnswer": "Doing homework right before going to bed",
    "explanation": "Đoạn 4 nói tắt thiết bị, không ngủ khi quá no và giữ lịch ngủ đều; không khuyên làm bài tập ngay trước giờ ngủ.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 34,
      "paragraphs": [
        128,
        130
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q34 · P128–P130",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "Turning off electronic devices before sleeping",
      "Avoiding going to bed on a full stomach",
      "Doing homework right before going to bed",
      "Keeping a regular sleeping schedule"
    ]
  },
  {
    "id": "u1-doc02-q35",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "What is the main idea of paragraph 2?",
    "content": "What is the main idea of paragraph 2?",
    "correct": "Teenagers need more sleep than adults and tend to wake up later",
    "correctAnswer": "Teenagers need more sleep than adults and tend to wake up later",
    "explanation": "Đoạn 2 so sánh nhu cầu ngủ và xu hướng buồn ngủ, thức dậy muộn của thiếu niên với người lớn.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 35,
      "paragraphs": [
        131,
        135
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q35 · P131–P135",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "Teenagers are naturally lazy and sleep a lot",
      "Teenagers need more sleep than adults and tend to wake up later",
      "Adults and teenagers have similar sleep needs",
      "Adults always wake up early because of work stress"
    ]
  },
  {
    "id": "u1-doc02-q36",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "The word \"boost\" in the last paragraph is OPPOSITE in meaning to ____________.",
    "content": "The word \"boost\" in the last paragraph is OPPOSITE in meaning to ____________.",
    "correct": "reduce",
    "correctAnswer": "reduce",
    "explanation": "Boost nghĩa là tăng/cải thiện; trái nghĩa trong các lựa chọn là reduce = giảm.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 36,
      "paragraphs": [
        136,
        137
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q36 · P136–P137",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "improve",
      "increase",
      "reduce",
      "support"
    ]
  },
  {
    "id": "u1-doc02-q37",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "Which of the following is TRUE according to the passage?",
    "content": "Which of the following is TRUE according to the passage?",
    "correct": "Lack of sleep can affect students’ physical and academic performance",
    "correctAnswer": "Lack of sleep can affect students’ physical and academic performance",
    "explanation": "Đoạn 3 nêu khó tập trung, kết quả thi kém hơn, dễ ốm hoặc căng thẳng khi thiếu ngủ.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 37,
      "paragraphs": [
        138,
        142
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q37 · P138–P142",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "Teenagers function better on 6 – 7 hours of sleep than adults",
      "Lack of sleep can affect students’ physical and academic performance",
      "Dinner should be eaten right before going to bed to relax the stomach",
      "Reading on a tablet before bed is a recommended activity"
    ]
  },
  {
    "id": "u1-doc02-q38",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "Which of the following best paraphrases the sentence: \"Switch off your screens as the bright light from your smartphone or tablet can wake your body up.\" in paragraph 4?",
    "content": "Which of the following best paraphrases the sentence: \"Switch off your screens as the bright light from your smartphone or tablet can wake your body up.\" in paragraph 4?",
    "correct": "The light from digital devices can keep your body awake, so turn them off before bed.",
    "correctAnswer": "The light from digital devices can keep your body awake, so turn them off before bed.",
    "explanation": "Vì ánh sáng thiết bị có thể làm cơ thể tỉnh táo nên tắt màn hình trước ngủ; phương án B giữ đúng quan hệ nguyên nhân.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 38,
      "paragraphs": [
        143,
        144
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q38 · P143–P144",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "Using your phone or tablet before sleeping helps you relax and fall asleep faster.",
      "The light from digital devices can keep your body awake, so turn them off before bed.",
      "Bright screens on phones and tablets make your body fall asleep more quickly.",
      "You should turn off your phone or tablet to save battery before going to bed."
    ]
  },
  {
    "id": "u1-doc02-q40",
    "unit": "unit1",
    "topic": "Sleep and study",
    "kind": "exam",
    "exerciseType": "reading-comprehension",
    "difficulty": "medium",
    "prompt": "Which of the following best summarizes the passage?",
    "content": "Which of the following best summarizes the passage?",
    "correct": "Understanding sleep patterns and routines helps teenagers sleep better and live healthier lives",
    "correctAnswer": "Understanding sleep patterns and routines helps teenagers sleep better and live healthier lives",
    "explanation": "Toàn bài giải thích đặc điểm ngủ của thiếu niên và thói quen giúp cải thiện giấc ngủ, học tập và sức khỏe.",
    "source": {
      "filename": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx",
      "libraryFileId": "libfile_3c4d0f76a16c81918c32aaec938b2959",
      "section": "Reading: Making the ZZZs come easy",
      "question": 40,
      "paragraphs": [
        150,
        154
      ],
      "answerBasis": "Independently checked from grammar, vocabulary or passage; no supplied answer key used."
    },
    "sourceRef": "TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx · Reading: Making the ZZZs come easy · Q40 · P150–P154",
    "validated": true,
    "passageId": "u1-doc02-sleep",
    "passage": "You're sleeping deeply when, suddenly, the alarm goes off. No! You just need five more minutes... Does this sound familiar? Well, you're not alone. Teenagers everywhere complain about a lack of sleep, but why is this?\n\nTo start with, on average, teenagers need to sleep 8 – 10 hours, compared to adults' 7 – 9. They also usually feel sleepy later at night than adults, and take longer to wake up in the morning. That's the reason why they always want to sleep in!\n\n[I] But can this tiredness actually hurt you? Unfortunately, it can. [II] If you don't get enough sleep, you find it harder to concentrate at school and you might do worse in your exams. [III] You're also more likely to become ill or suffer from stress. [IV]\n\nLuckily, there's a simple solution. Get more sleep and sleep better with a good evening routine. Firstly, eat dinner early so you don't go to bed on a full stomach. Then, about an hour before you go to bed, start doing something quiet and relaxing like reading a book. Switch off your screens as the bright light from your smartphone or tablet can wake your body up. Finally, go to bed and get up at the same time every day. This helps your body find the right time for bedtime.\n\nIf you follow these tips to get more sleep, you will boost your performance at school while staying happy and healthy. Remember, there are no dreams without sleep. So, if you want to follow your dreams, make sure you catch up on those ZZZs!",
    "passageTitle": "MAKING THE ZZZS... COME EASY",
    "options": [
      "Sleep is not important as long as you eat and study well",
      "Teenagers can sleep less if they learn to relax more during the day",
      "Understanding sleep patterns and routines helps teenagers sleep better and live healthier lives",
      "Teenagers need to avoid dreaming if they want to succeed in school"
    ]
  }
]
;

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

function getQuestionBank(unit, words) {
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
const UNIT1_SOURCE_QUESTIONS = imported;

const HISTORY_KEY='es11_question_history_v1';
const PROGRESS_KEY='es11_student_an_progress';
const emptyHistory=()=>({version:1,questions:{},sessions:[]});
let memoryHistory=emptyHistory();
const normalizeText=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const contentKey=q=>normalizeText(`${q.passage || ''}\n${q.prompt}`).replace(/[“”".,!?;:]/g,'');
function validateQuestion(q) {
  const required=['id','unit','topic','exerciseType','difficulty','prompt','correct','explanation','sourceRef'];
  if(required.some(k=>typeof q[k]!=='string'||!q[k].trim())) return false;
  if(!['easy','medium','hard'].includes(q.difficulty)||q.validated!==true) return false;
  if(q.options) return q.options.length===4 && new Set(q.options.map(normalizeText)).size===q.options.length && q.options.filter(o=>o===q.correct).length===1;
  return Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.includes(q.correct);
}
function uniqueValidQuestions(bank) {
  const ids=new Set(),content=new Set();
  return bank.filter(q=>{
    if(!validateQuestion(q)||ids.has(q.id)||content.has(contentKey(q)))return false;
    ids.add(q.id);content.add(contentKey(q));return true;
  });
}
function normalizeHistory(data) {
  if(!data||data.version!==1||!data.questions||typeof data.questions!=='object'||Array.isArray(data.questions)||!Array.isArray(data.sessions)) return emptyHistory();
  // Retain unknown history fields for forward compatibility.
  return {...data, questions:{...data.questions},sessions:[...data.sessions]};
}
function browserStorage() {try{return globalThis.localStorage;}catch{return null;}}
function loadHistory(storage=browserStorage()) {
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
function saveHistory(history,storage=browserStorage()) {
  memoryHistory=normalizeHistory(history);
  try {if(!storage)return false;storage.setItem(HISTORY_KEY,JSON.stringify(history));return true;}catch{return false;}
}
function eligibleQuestions(bank,settings,history) {
  return uniqueValidQuestions(bank).filter(q=> (!settings.unit||q.unit===settings.unit)
    && (settings.focus==='mixed'||!settings.focus||q.kind===settings.focus)
    && (settings.exerciseType==='mixed'||!settings.exerciseType||q.exerciseType===settings.exerciseType)
    && (settings.difficulty==='mixed'||!settings.difficulty||q.difficulty===settings.difficulty)
    && (!settings.review||history.questions[q.id]?.lastCorrect===false));
}
function selectQuestions(bank,settings,history=emptyHistory(),rng=Math.random) {
  const eligible=eligibleQuestions(bank,settings,history);
  const ranked=shuffle(eligible,rng).map((q,index)=>{
    const h=history.questions[q.id]||{};
    const tier=Number(h.attempts||0)===0 ? 0 : h.lastCorrect===false ? 2 : 1;
    return {q,tier,seen:Number(h.seenCount||0)>0 ? 1 : 0,last:Number(h.lastSeen||0),index};
  }).sort((a,b)=>a.tier-b.tier||a.seen-b.seen||a.last-b.last||a.index-b.index);
  const limit=Math.max(0,Math.floor(Number(settings.count)||0));
  return shuffle(ranked.slice(0,limit).map(x=>({...x.q,options:x.q.options?shuffle(x.q.options,rng):undefined})),rng);
}
function beginSession(bank,settings,storage=browserStorage(),now=Date.now(),rng=Math.random) {
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
function isCorrect(q,answer) {
  if(q.options)return answer===q.correct;
  const normalized=normalizedAnswer(answer);
  return q.acceptedAnswers.some(value=>normalizedAnswer(value)===normalized);
}
function submitSession(session,paper,answers,storage=browserStorage(),now=Date.now()) {
  const history=loadHistory(storage);const match=history.sessions.find(s=>s.id===session.id);
  if(match?.submittedAt)return {alreadySubmitted:true,history,saved:true,score:match.score};
  const score=paper.filter(q=>isCorrect(q,answers[q.id])).length;
  for(const q of paper){const old=history.questions[q.id]||{};const correct=isCorrect(q,answers[q.id]);history.questions[q.id]={...old,attempts:Number(old.attempts||0)+1,correctCount:Number(old.correctCount||0)+(correct?1:0),incorrectCount:Number(old.incorrectCount||0)+(correct?0:1),lastAttempt:now,lastAnswer:answers[q.id],lastCorrect:correct};}
  if(match)Object.assign(match,{submittedAt:now,score});else history.sessions.push({...session,submittedAt:now,score});
  return {alreadySubmitted:false,score,history,saved:saveHistory(history,storage)};
}
function applyQuizResult(progress,paper,answers,now=Date.now()) {
  const mistakes=[...(progress.mistakesNotebook||[])];
  for(const q of paper) {
    const index=mistakes.findIndex(m=>m.questionId===q.id);
    if(isCorrect(q,answers[q.id])) {if(index>=0)mistakes.splice(index,1);continue;}
    const item={id:`question:${q.id}`,questionId:q.id,...(q.wordId?{wordId:q.wordId}:{}),word:q.prompt,vietnamese:q.topic,type:q.exerciseType,userAnswer:answers[q.id],correctAnswer:q.correct,explanation:q.explanation,sourceRef:q.sourceRef,date:new Date(now).toLocaleDateString('vi-VN')};
    if(index>=0)mistakes[index]={...mistakes[index],...item};else mistakes.push(item);
  }
  return {...progress,xp:(Number(progress.xp)||0)+paper.filter(q=>isCorrect(q,answers[q.id])).length*5,mistakesNotebook:mistakes};
}

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
function PracticeSetup({bank,lang,settings,onChange,onStart,history,grammarOnly=false}) {
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

// ==========================================
// VERIFIED VOCABULARY DATASETS FOR UNITS 1, 2, 3 & 4
// Unit 1: A Long and Healthy Life (104 items - Tờ Số 01)
// Unit 2: The Generation Gap (114 items - Tờ Số 05)
// Unit 3: Cities of the Future (120 items - Tờ Số 09)
// Unit 4: ASEAN and Viet Nam (137 items - Tờ Số 13)
// ==========================================

const UNIT_1_VERIFIED_WORDS = [
  { id: 'u1-001', word: 'fitness', ipa: '/ˈfɪt.nəs/', pos: 'noun', vietnamese: 'sự khỏe mạnh, sự cân đối', example: 'Swimming is a great exercise to build overall physical fitness.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'fit', pos: 'verb', meaning: 'vừa vặn, phù hợp' }, { word: 'fit', pos: 'adjective', meaning: 'cân đối, khỏe mạnh' }], collocations: ['Physical fitness', 'Fitness routine', 'Keep fitness'] },
  { id: 'u1-001a', word: 'fit', ipa: '/fɪt/', pos: 'adjective', vietnamese: 'cân đối, khỏe mạnh', example: 'Anna exercises every day, so she looks fit and healthy.', difficulty: 'easy', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-001' },
  { id: 'u1-002', word: 'health', ipa: '/helθ/', pos: 'noun', vietnamese: 'sức khỏe', example: 'Eating fruits and vegetables regularly improves your overall health.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'healthy', pos: 'adjective', meaning: 'khỏe mạnh, lành mạnh' }, { word: 'unhealthy', pos: 'adjective', meaning: 'không khỏe mạnh' }, { word: 'healthful', pos: 'adjective', meaning: 'tốt cho sức khỏe' }, { word: 'unhealthily', pos: 'adverb', meaning: 'một cách không lành mạnh' }] },
  { id: 'u1-002a', word: 'healthy', ipa: '/ˈhelθi/', pos: 'adjective', vietnamese: 'khỏe mạnh, lành mạnh', example: 'A healthy lifestyle helps you live longer and avoid serious diseases.', difficulty: 'easy', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-002' },
  { id: 'u1-002b', word: 'unhealthy', ipa: '/ʌnˈhelθi/', pos: 'adjective', vietnamese: 'không khỏe mạnh, không lành mạnh', example: 'Watching TV all day is an unhealthy habit for children.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-002' },
  { id: 'u1-003', word: 'fast food', ipa: '/fɑːst fuːd/', pos: 'noun phrase', vietnamese: 'đồ ăn nhanh', example: 'You should cut down on fast food to maintain a healthy weight.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', collocations: ['Eat fast food', 'Avoid fast food'] },
  { id: 'u1-004', word: 'habit', ipa: '/ˈhæb.ɪt/', pos: 'noun', vietnamese: 'thói quen', example: 'Brushing your teeth twice a day is a good personal habit.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', collocations: ['Bad habit', 'Healthy habit', 'Develop a habit'] },
  { id: 'u1-005', word: 'energy', ipa: '/ˈenədʒi/', pos: 'noun', vietnamese: 'năng lượng', example: 'Ella felt full of energy after a nutritious breakfast and good sleep.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', collocations: ['Full of energy', 'Boost energy', 'Save energy'] },
  { id: 'u1-006', word: 'activity', ipa: '/ækˈtɪvəti/', pos: 'noun', vietnamese: 'hoạt động', example: 'Doing regular physical activity helps build muscle and reduce stress.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'activate', pos: 'verb', meaning: 'kích hoạt' }, { word: 'active', pos: 'adjective', meaning: 'tích cực, năng động' }, { word: 'activation', pos: 'noun', meaning: 'sự kích hoạt' }] },
  { id: 'u1-006a', word: 'activate', ipa: '/ˈæktɪveɪt/', pos: 'verb', vietnamese: 'kích hoạt, làm hoạt động', example: 'Doing squats will activate your leg muscles and build strength.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-006' },
  { id: 'u1-007', word: 'balanced diet', ipa: '/ˌbæl.ənst ˈdaɪ.ət/', pos: 'noun phrase', vietnamese: 'chế độ ăn uống cân bằng, lành mạnh', example: 'Eating a balanced diet is essential to avoid chronic illnesses.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', collocations: ['Follow a balanced diet', 'Maintain a balanced diet'] },
  { id: 'u1-008', word: 'treatment', ipa: '/ˈtriːtmənt/', pos: 'noun', vietnamese: 'sự điều trị, phương pháp chữa bệnh', example: 'He has received medical treatment for his lung infection recently.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'treat', pos: 'verb', meaning: 'điều trị, đối xử' }] },
  { id: 'u1-009', word: 'strength', ipa: '/streŋkθ/', pos: 'noun', vietnamese: 'sức mạnh, thể lực', example: 'He goes to the gym daily to improve his muscle strength.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'strong', pos: 'adjective', meaning: 'mạnh mẽ' }, { word: 'strengthen', pos: 'verb', meaning: 'củng cố, tăng cường' }] },
  { id: 'u1-010', word: 'examine', ipa: '/ɪɡˈzæmɪn/', pos: 'verb', vietnamese: 'kiểm tra, thăm khám y tế', example: 'The doctor will examine the patient to determine the cause of the headache.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'examination', pos: 'noun', meaning: 'kỳ thi, sự kiểm tra' }, { word: 'examiner', pos: 'noun', meaning: 'giám khảo, bác sĩ kiểm tra' }] },
  { id: 'u1-011', word: 'life expectancy', ipa: '/ˈlaɪf ɪkspektənsi/', pos: 'noun phrase', vietnamese: 'tuổi thọ trung bình', example: 'Improvements in medical science have increased human life expectancy.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', collocations: ['Increase life expectancy', 'Average life expectancy'] },
  { id: 'u1-012', word: 'nutrient', ipa: '/ˈnjuːtriənt/', pos: 'noun', vietnamese: 'chất dinh dưỡng', example: 'Fruits and vegetables are rich in essential nutrients and minerals.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'nutrition', pos: 'noun', meaning: 'sự dinh dưỡng' }, { word: 'nutritious', pos: 'adjective', meaning: 'bổ dưỡng' }] },
  { id: 'u1-013', word: 'bacteria', ipa: '/bækˈtɪəriə/', pos: 'noun (plural)', vietnamese: 'vi khuẩn', example: 'Washing your hands frequently stops harmful bacteria from spreading.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', synonyms: ['germs', 'microorganisms'] },
  { id: 'u1-014', word: 'virus', ipa: '/ˈvaɪə.rəs/', pos: 'noun', vietnamese: 'vi-rút', example: 'A virus can spread quickly in crowded public places.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-015', word: 'infection', ipa: '/ɪnˈfek.ʃən/', pos: 'noun', vietnamese: 'sự lây nhiễm, bệnh nhiễm trùng', example: 'Without clean water, people are more likely to get stomach infections.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', wordFamily: [{ word: 'infectious', pos: 'adjective', meaning: 'có thể lây nhiễm' }] },
  { id: 'u1-015a', word: 'infectious', ipa: '/ɪnˈfekʃəs/', pos: 'adjective', vietnamese: 'có thể lây nhiễm, nhiễm trùng', example: 'Flu is an infectious disease that spreads easily during winter.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-015' },
  { id: 'u1-016', word: 'antibiotic', ipa: '/ˌæntibaɪˈɒtɪk/', pos: 'noun', vietnamese: 'thuốc kháng sinh', example: 'You shouldn’t take antibiotics without a doctor’s prescription.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', collocations: ['Take antibiotics', 'Course of antibiotics'] },
  { id: 'u1-017', word: 'tuberculosis', ipa: '/tʃuːˌbɜː.kjəˈləʊ.sɪs/', pos: 'noun', vietnamese: 'bệnh lao phổi', example: 'Tuberculosis is a severe lung infection that requires long medical treatment.', difficulty: 'hard', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-p01', word: 'work out', ipa: '/wɜːk aʊt/', pos: 'phrasal verb', vietnamese: 'tập thể dục, tính toán', example: 'They have been working out regularly at the gym to stay fit.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-p02', word: 'give up', ipa: '/ɡɪv ʌp/', pos: 'phrasal verb', vietnamese: 'bỏ cuộc, từ bỏ (thói quen xấu)', example: 'He gave up smoking to improve his respiratory health.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-p03', word: 'suffer from', ipa: '/ˈsʌf.ər frɒm/', pos: 'phrasal verb', vietnamese: 'chịu đựng, mắc phải (bệnh tật)', example: 'Many elderly people suffer from joint pain during cold weather.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-p04', word: 'cut down on', ipa: '/kʌt daʊn ɒn/', pos: 'phrasal verb', vietnamese: 'cắt giảm (số lượng, tiêu thụ)', example: 'You should cut down on sugary drinks to lower the risk of diabetes.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-p05', word: 'get rid of', ipa: '/ɡet rɪd ɒv/', pos: 'phrasal verb', vietnamese: 'loại bỏ, giải thoát khỏi', example: 'She does morning yoga to get rid of daily stress and fatigue.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-018', word: 'burger', ipa: '/ˈbɜːɡər/', pos: 'noun', vietnamese: 'bánh mì kẹp thịt', example: 'That burger looks delicious, but it has too many calories for one meal.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-019', word: 'chip', ipa: '/tʃɪp/', pos: 'noun', vietnamese: 'khoai tây chiên', example: 'Eating too many chips can cause unwanted weight gain.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-020', word: 'life lesson', ipa: '/laɪf ˈles.ən/', pos: 'noun phrase', vietnamese: 'bài học cuộc sống', example: 'Losing his first job taught Kevin an important life lesson about responsibility.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-021', word: 'regular', ipa: '/ˈreɡjələr/', pos: 'adjective', vietnamese: 'thường xuyên, định kỳ', example: 'Taking regular health checkups helps detect diseases early.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-022', word: 'physical', ipa: '/ˈfɪzɪkl/', pos: 'adjective', vietnamese: 'thuộc về thể chất', example: 'Doing daily physical exercise keeps your body fit and active.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-023', word: 'mental', ipa: '/ˈmentl/', pos: 'adjective', vietnamese: 'thuộc về tinh thần', example: 'Meditation is a great way to relieve stress and improve your mental health.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-024', word: 'muscle', ipa: '/ˈmʌsl/', pos: 'noun', vietnamese: 'cơ bắp', example: 'Lifting heavy weights helps build chest and arm muscles.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-025', word: 'headache', ipa: '/ˈhedeɪk/', pos: 'noun', vietnamese: 'đau đầu', example: 'If your headache continues, you should rest and see a doctor.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-026', word: 'label', ipa: '/ˈleɪbl/', pos: 'noun / verb', vietnamese: 'nhãn mác; dán nhãn', example: 'Check the label on the bottle to see if the juice is organic.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-027', word: 'ingredient', ipa: '/ɪnˈɡriːdiənt/', pos: 'noun', vietnamese: 'nguyên liệu, thành phần', example: 'Flour, eggs, and sugar are the main ingredients used to make this cake.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-028', word: 'mineral', ipa: '/ˈmɪnərəl/', pos: 'noun / adjective', vietnamese: 'chất khoáng; thuộc khoáng chất', example: 'Fresh fruits provide essential vitamins and minerals for your body.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-029', word: 'repetition', ipa: '/ˌrepəˈtɪʃn/', pos: 'noun', vietnamese: 'sự lặp lại', example: 'Repetition in workout routines helps build muscle memory.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-030', word: 'routine', ipa: '/ruːˈtiːn/', pos: 'noun / adjective', vietnamese: 'sinh hoạt thường ngày; thường lệ', example: 'Following a morning routine helps start your day with energy.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-031', word: 'jump', ipa: '/dʒʌmp/', pos: 'noun / verb', vietnamese: 'cú nhảy; nhảy', example: 'Jumping on the spot gets your blood flowing quickly.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-032', word: 'recipe', ipa: '/ˈresəpi/', pos: 'noun', vietnamese: 'công thức nấu ăn', example: 'Follow this healthy recipe to cook tasty and nutritious dishes.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-033', word: 'treadmill', ipa: '/ˈtred.mɪl/', pos: 'noun', vietnamese: 'máy chạy bộ', example: 'My father walks on the treadmill every morning to keep his heart strong.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-034', word: 'disease', ipa: '/dɪˈziːz/', pos: 'noun', vietnamese: 'bệnh tật', example: 'Eating a balanced diet protects your body against serious diseases.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-035', word: 'diameter', ipa: '/daɪˈæm.ɪ.tər/', pos: 'noun', vietnamese: 'đường kính', example: 'A healthy lung has airways with a larger diameter for better breathing.', difficulty: 'hard', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-037', word: 'poison', ipa: '/ˈpɔɪzn/', pos: 'noun / verb', vietnamese: 'chất độc; đầu độc', example: 'Some cleaning products contain poison, so keep them away from children.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-038', word: 'germ', ipa: '/dʒɜːm/', pos: 'noun', vietnamese: 'vi trùng, mầm bệnh', example: 'Washing your hands with soap helps get rid of dangerous germs.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-039', word: 'flu', ipa: '/fluː/', pos: 'noun', vietnamese: 'bệnh cúm', example: 'She stayed in bed for three days because she caught the flu.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-040', word: 'illness', ipa: '/ˈɪl.nəs/', pos: 'noun', vietnamese: 'sự ốm đau, bệnh tật', example: 'Eating a balanced diet helps protect your body against common illnesses.', difficulty: 'easy', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-041', word: 'heart disease', ipa: '/ˈhɑːt dɪˌziːz/', pos: 'noun phrase', vietnamese: 'bệnh tim', example: 'Eating too much fat and salt increases the risk of heart disease.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-042', word: 'stay up', ipa: '/steɪ ʌp/', pos: 'phrasal verb', vietnamese: 'thức khuya (không đi ngủ)', example: 'You shouldn’t stay up late watching videos before an exam.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-043', word: 'stop to do sth', ipa: '/stɒp tuː duː/', pos: 'structure', vietnamese: 'dừng lại để làm gì đó khác', example: 'During his daily morning workout, he stopped to drink some water.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-044', word: 'stop doing sth', ipa: '/stɒp ˈduːɪŋ/', pos: 'structure', vietnamese: 'ngừng hẳn việc đang làm', example: 'My doctor advised me to stop eating junk food late at night.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-045', word: 'learn sth from sb', ipa: '/lɜːn frɒm/', pos: 'structure', vietnamese: 'học hỏi điều gì từ ai', example: 'We learned useful health tips from the school nurse during class.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-046', word: 'do exercise', ipa: '/duː ˈek.sə.saɪz/', pos: 'collocation', vietnamese: 'tập thể dục', example: 'Doing regular exercise every morning helps keep your mind active.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-047', word: 'spend time doing sth', ipa: '/spend taɪm ˈduːɪŋ/', pos: 'structure', vietnamese: 'dành thời gian làm việc gì', example: 'Teenagers should spend more time doing physical activities outdoor.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-048', word: 'stay healthy', ipa: '/steɪ ˈhel.θi/', pos: 'collocation', vietnamese: 'giữ gìn sức khỏe, duy trì sự khỏe mạnh', example: 'Eating a balanced diet is one of the best ways to stay healthy.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-049', word: 'try to do sth', ipa: '/traɪ tuː duː/', pos: 'structure', vietnamese: 'cố gắng làm điều gì', example: 'He is trying to build a regular exercise routine every morning.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-050', word: 'try doing sth', ipa: '/traɪ ˈduːɪŋ/', pos: 'structure', vietnamese: 'thử làm điều gì', example: 'If you can’t sleep well, try drinking warm herbal tea before bed.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-051', word: 'pay attention to', ipa: '/peɪ əˈten.ʃən tuː/', pos: 'phrasal verb', vietnamese: 'chú ý đến ai / điều gì', example: 'You should pay attention to what you eat and how much you sleep.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-052', word: 'avoid doing sth', ipa: '/əˈvɔɪd ˈduːɪŋ/', pos: 'structure', vietnamese: 'tránh làm điều gì', example: 'Many doctors advise patients to avoid smoking to protect their lungs.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-053', word: 'remember to do sth', ipa: '/rɪˈmem.bər tuː duː/', pos: 'structure', vietnamese: 'nhớ phải làm gì (chưa làm)', example: 'Remember to stretch your muscles before starting a heavy workout.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-054', word: 'remember doing sth', ipa: '/rɪˈmem.bər ˈduːɪŋ/', pos: 'structure', vietnamese: 'nhớ đã làm việc gì trong quá khứ', example: 'I remember visiting the hospital for a general health check last year.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-055', word: 'start to do / doing sth', ipa: '/stɑːt tuː duː/', pos: 'structure', vietnamese: 'bắt đầu làm điều gì', example: 'My father started jogging in the park after his doctor recommended it.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-056', word: 'to begin with', ipa: '/tuː bɪˈɡɪn wɪð/', pos: 'idiom / phrase', vietnamese: 'đầu tiên, trước hết (mở đầu lý do)', example: 'To begin with, you need a balanced daily routine that includes exercise.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-057', word: 'be suitable for', ipa: '/biː ˈsuː.tə.bəl fɔːr/', pos: 'collocation', vietnamese: 'phù hợp với ai / cái gì', example: 'This light workout plan is suitable for beginners with no gym experience.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-058', word: 'keep fit', ipa: '/kiːp fɪt/', pos: 'collocation', vietnamese: 'giữ dáng, giữ cơ thể cân đối', example: 'Doing 20 minutes of daily yoga helps me keep fit and relaxed.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-059', word: 'be ready for', ipa: '/biː ˈred.i fɔːr/', pos: 'collocation', vietnamese: 'sẵn sàng cho điều gì', example: 'When your body is ready for more exercise, you can workout longer.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-060', word: 'at least', ipa: '/æt liːst/', pos: 'idiom / phrase', vietnamese: 'ít nhất là', example: 'You should try to drink at least two liters of fresh water every day.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-061', word: 'give off', ipa: '/ɡɪv ɒf/', pos: 'phrasal verb', vietnamese: 'tỏa ra, phát ra (nhiệt, mùi...)', example: 'Some herbs give off a soothing scent that helps you relax.', difficulty: 'hard', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-062', word: 'prevent sb from doing sth', ipa: '/prɪˈvent frɒm/', pos: 'structure', vietnamese: 'ngăn ai khỏi làm việc gì', example: 'Good warm-up exercises prevent athletes from getting serious muscle injuries.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-063', word: 'organism', ipa: '/ˈɔː.ɡən.ɪ.zəm/', pos: 'noun', vietnamese: 'sinh vật, cơ thể sống', example: 'Microscopic organisms such as viruses can cause severe illness in humans.', difficulty: 'hard', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-064', word: 'fall asleep', ipa: '/fɔːl əˈsliːp/', pos: 'idiom / phrase', vietnamese: 'ngủ thiếp đi, chìm vào giấc ngủ', example: 'Listening to calm music helps people with insomnia fall asleep faster.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-065', word: 'take up', ipa: '/teɪk ʌp/', pos: 'phrasal verb', vietnamese: 'bắt đầu một thói quen / sở thích / môn thể thao', example: 'He decided to take up swimming to build muscle strength and stamina.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-066', word: 'warm up', ipa: '/wɔːm ʌp/', pos: 'phrasal verb', vietnamese: 'khởi động (trước khi tập luyện)', example: 'Always warm up for 5 minutes before starting intense workouts.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-067', word: 'build up', ipa: '/bɪld ʌp/', pos: 'phrasal verb', vietnamese: 'xây dựng, tăng cường (thể lực, sức mạnh)', example: 'Doing daily push-ups helps build up your upper body strength.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-068', word: 'lead to', ipa: '/liːd tuː/', pos: 'phrasal verb', vietnamese: 'dẫn đến, gây ra (hậu quả, bệnh tật)', example: 'Eating too much sugar and salt can lead to serious heart problems.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-069', word: 'have an effect on', ipa: '/hæv ən ɪˈfekt ɒn/', pos: 'collocation', vietnamese: 'có ảnh hưởng / tác động tới', example: 'Daily physical activity has a direct positive effect on mental health.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-070', word: 'in good shape', ipa: '/ɪn ɡʊd ʃeɪp/', pos: 'idiom / phrase', vietnamese: 'trong tình trạng thể lực tốt', example: 'Regular exercise keeps your heart and body in good shape.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-071', word: 'out of shape', ipa: '/aʊt əv ʃeɪp/', pos: 'idiom / phrase', vietnamese: 'thể lực kém, không cân đối', example: 'Sitting all day makes people get out of shape quickly.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-072', word: 'take medicine', ipa: '/teɪk ˈmed.sən/', pos: 'collocation', vietnamese: 'uống thuốc điều trị', example: 'Remember to take your medicine after meals as directed.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-073', word: 'medical checkup', ipa: '/ˈmed.ɪ.kəl ˈtʃek.ʌp/', pos: 'noun phrase', vietnamese: 'việc khám sức khỏe định kỳ', example: 'Annual medical checkups help detect health issues early.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-074', word: 'immune system', ipa: '/ɪˈmjuːn ˌsɪs.təm/', pos: 'noun phrase', vietnamese: 'hệ miễn dịch', example: 'Eating fresh vegetables boosts your immune system against viruses.', difficulty: 'medium', type: 'core', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-075', word: 'longevity', ipa: '/lɒnˈdʒev.ə.ti/', pos: 'noun', vietnamese: 'sự trường thọ, tuổi thọ', example: 'A balanced diet and regular exercise promote longevity.', difficulty: 'hard', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-076', word: 'stamina', ipa: '/ˈstæm.ɪ.nə/', pos: 'noun', vietnamese: 'sức bền, khả năng chịu đựng', example: 'Swimming helps build cardiovascular stamina.', difficulty: 'hard', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-077', word: 'hygiene', ipa: '/ˈhaɪ.dʒiːn/', pos: 'noun', vietnamese: 'vệ sinh, thói quen giữ sạch', example: 'Good personal hygiene prevents bacterial infections.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-078', word: 'food poisoning', ipa: '/ˈfuːd ˌpɔɪ.zən.ɪŋ/', pos: 'noun phrase', vietnamese: 'ngộ độc thực phẩm', example: 'Eating spoiled food can cause severe food poisoning.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-079', word: 'press-up', ipa: '/ˈpres.ʌp/', pos: 'noun', vietnamese: 'bài tập chống đẩy', example: 'Doing daily press-ups strengthens your arms and chest.', difficulty: 'easy', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-080', word: 'squat', ipa: '/skwɒt/', pos: 'noun', vietnamese: 'bài tập đứng lên ngồi xuống', example: 'Squats build lower body and leg strength.', difficulty: 'medium', type: 'extended', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01' },
  { id: 'u1-081', word: 'unhealthily', ipa: '/ʌnˈhel.θəl.i/', pos: 'adverb', vietnamese: 'một cách không lành mạnh', example: 'Eating unhealthily late at night causes weight gain.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-002' },
  { id: 'u1-082', word: 'healthful', ipa: '/ˈhel.fəl/', pos: 'adjective', vietnamese: 'có lợi cho sức khỏe', example: 'Fresh fruit juice is a healthful drink.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-002' },
  { id: 'u1-083', word: 'active', ipa: '/ˈæk.tɪv/', pos: 'adjective', vietnamese: 'tích cực, năng động', example: 'Stay active by walking every day.', difficulty: 'easy', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-006' },
  { id: 'u1-084', word: 'actively', ipa: '/ˈæk.tɪv.li/', pos: 'adverb', vietnamese: 'hết sức tích cực, chủ động', example: 'She actively participates in school sports.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-006' },
  { id: 'u1-085', word: 'activation', ipa: '/ˌæk.tɪˈveɪ.ʃən/', pos: 'noun', vietnamese: 'sự kích hoạt', example: 'Muscle activation is key before lifting weights.', difficulty: 'hard', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-006' },
  { id: 'u1-086', word: 'balanced', ipa: '/ˈbæl.ənst/', pos: 'adjective', vietnamese: 'cân bằng, hài hòa', example: 'Keep a balanced lifestyle between work and rest.', difficulty: 'easy', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-007' },
  { id: 'u1-087', word: 'treat', ipa: '/triːt/', pos: 'verb', vietnamese: 'điều trị, chữa trị', example: 'Doctors treat infections with antibiotics.', difficulty: 'easy', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-008' },
  { id: 'u1-088', word: 'strong', ipa: '/strɒŋ/', pos: 'adjective', vietnamese: 'mạnh mẽ, khỏe mạnh', example: 'He is strong enough to lift heavy boxes.', difficulty: 'easy', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-009' },
  { id: 'u1-089', word: 'strengthen', ipa: '/ˈstreŋ.θən/', pos: 'verb', vietnamese: 'củng cố, làm cho mạnh thêm', example: 'Yoga helps strengthen your back muscles.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-009' },
  { id: 'u1-090', word: 'strongly', ipa: '/ˈstrɒŋ.li/', pos: 'adverb', vietnamese: 'một cách mạnh mẽ, kiên quyết', example: 'We strongly advise getting enough sleep.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-009' },
  { id: 'u1-091', word: 'examination', ipa: '/ɪɡˌzæm.ɪˈneɪ.ʃən/', pos: 'noun', vietnamese: 'sự khám bệnh, sự kiểm tra', example: 'A complete medical examination is required.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-010' },
  { id: 'u1-092', word: 'nutrition', ipa: '/njuːˈtrɪʃ.ən/', pos: 'noun', vietnamese: 'sự dinh dưỡng', example: 'Good nutrition is essential for growing teenagers.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-012' },
  { id: 'u1-093', word: 'nutritious', ipa: '/njuːˈtrɪʃ.əs/', pos: 'adjective', vietnamese: 'bổ dưỡng', example: 'Nuts are a highly nutritious snack.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-012' },
  { id: 'u1-094', word: 'infect', ipa: '/ɪnˈfekt/', pos: 'verb', vietnamese: 'lây nhiễm', example: 'Viruses can infect thousands of people rapidly.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-015' },
  { id: 'u1-095', word: 'organic', ipa: '/ɔːˈɡæn.ɪk/', pos: 'adjective', vietnamese: 'hữu cơ', example: 'Organic vegetables are free from synthetic pesticides.', difficulty: 'medium', type: 'word_family', unit: 'unit1', sourceRef: 'Global Success 11 - Tờ số 01', parentWordId: 'u1-063' }
];

// 114 VERIFIED ITEMS FOR UNIT 2: THE GENERATION GAP (TỜ SỐ 05)
const UNIT_2_VERIFIED_WORDS = [
  { id: 'u2-001', word: 'generation gap', ipa: '/dʒen.əˈreɪ.ʃən ɡæp/', pos: 'noun phrase', vietnamese: 'khoảng cách thế hệ', example: 'The generation gap can cause misunderstandings between parents and teenagers.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-002', word: 'nuclear family', ipa: '/ˌnjuː.klɪə ˈfæm.əl.i/', pos: 'noun phrase', vietnamese: 'gia đình hạt nhân (bố mẹ và con)', example: 'A nuclear family usually consists of parents and their children living together.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-003', word: 'extended family', ipa: '/ɪkˌsten.dɪd ˈfæm.əl.i/', pos: 'noun phrase', vietnamese: 'gia đình đa thế hệ / đại gia đình', example: 'Living in an extended family allows children to bond with grandparents.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-004', word: 'breadwinner', ipa: '/ˈbredˌwɪn.ər/', pos: 'noun', vietnamese: 'trụ cột gia đình', example: 'In many traditional households, the father is the main breadwinner.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-005', word: 'conflict', ipa: '/ˈkɒn.flɪkt/', pos: 'noun / verb', vietnamese: 'mâu thuẫn, xung đột', example: 'Open communication helps resolve family conflicts peacefully.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-006', word: 'digital native', ipa: '/ˌdɪdʒ.ɪ.təl ˈneɪ.tɪv/', pos: 'noun phrase', vietnamese: 'người sinh ra trong thời đại công nghệ', example: 'Teens today are digital natives who use smartphones effortlessly.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-007', word: 'household chore', ipa: '/ˈhaʊs.həʊld tʃɔːr/', pos: 'noun phrase', vietnamese: 'công việc nhà', example: 'Sharing household chores creates a fair and happy family atmosphere.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-008', word: 'curfew', ipa: '/ˈkɜː.fjuː/', pos: 'noun', vietnamese: 'giờ giới nghiêm', example: 'My parents set a strict 9 PM curfew on weekend nights.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-009', word: 'open-minded', ipa: '/ˌəʊ.pənˈmaɪn.dɪd/', pos: 'adjective', vietnamese: 'cởi mở, khoáng đạt', example: 'Parents should be open-minded about their children’s career choices.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-010', word: 'individualism', ipa: '/ˌɪn.dɪˈvɪdʒ.u.ə.lɪ.zəm/', pos: 'noun', vietnamese: 'chủ nghĩa cá nhân, tính độc lập', example: 'Younger generations tend to value individualism and personal freedom.', difficulty: 'hard', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-011', word: 'differ', ipa: '/ˈdɪf.ər/', pos: 'verb', vietnamese: 'khác biệt, không giống', example: 'Opinions differ between generations regarding lifestyle choices.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-012', word: 'different', ipa: '/ˈdɪf.ər.ənt/', pos: 'adjective', vietnamese: 'khác nhau', example: 'Teens and parents often have different views on fashion.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-011' },
  { id: 'u2-013', word: 'difference', ipa: '/ˈdɪf.ər.əns/', pos: 'noun', vietnamese: 'sự khác biệt', example: 'Respecting age differences fosters harmony in extended families.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-011' },
  { id: 'u2-014', word: 'behavior', ipa: '/bɪˈheɪ.vjər/', pos: 'noun', vietnamese: 'hành vi, ứng xử', example: 'Good behavior at home shows respect for family members.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-015', word: 'gender', ipa: '/ˈdʒen.dər/', pos: 'noun', vietnamese: 'giới tính', example: 'Gender equality ensures equal opportunities for sons and daughters.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-016', word: 'characteristic', ipa: '/ˌkær.ək.təˈrɪs.tɪk/', pos: 'noun / adjective', vietnamese: 'đặc điểm, đặc tính', example: 'Patience is a key characteristic of good parenting.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-017', word: 'quality', ipa: '/ˈkwɒl.ə.ti/', pos: 'noun', vietnamese: 'phẩm chất, chất lượng', example: 'Spending quality time together strengthens family bonds.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-018', word: 'influence', ipa: '/ˈɪn.flu.əns/', pos: 'noun / verb', vietnamese: 'ảnh hưởng, tác động', example: 'Parents heavily influence their children’s core moral values.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-019', word: 'economic', ipa: '/ˌiː.kəˈnɒm.ɪk/', pos: 'adjective', vietnamese: 'thuộc về kinh tế', example: 'Economic stability helps parents provide better education for kids.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-020', word: 'social', ipa: '/ˈsəʊ.ʃəl/', pos: 'adjective', vietnamese: 'thuộc về xã hội', example: 'Social media platforms have changed how teenagers communicate.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-021', word: 'critical', ipa: '/ˈkrɪt.ɪ.kəl/', pos: 'adjective', vietnamese: 'mang tính tư duy phản biện / chỉ trích', example: 'Developing critical thinking skills helps teens make smart decisions.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-022', word: 'thinker', ipa: '/ˈθɪŋ.kər/', pos: 'noun', vietnamese: 'người suy nghĩ, nhà tư tưởng', example: 'An independent thinker evaluates advice before following it.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-023', word: 'digital device', ipa: '/ˈdɪdʒ.ɪ.təl dɪˈvaɪs/', pos: 'noun phrase', vietnamese: 'thiết bị kỹ thuật số', example: 'Limit screen time on digital devices before bedtime.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-024', word: 'electronic device', ipa: '/ɪˌlekˈtrɒn.ɪk dɪˈvaɪs/', pos: 'noun phrase', vietnamese: 'thiết bị điện tử', example: 'Turn off electronic devices during family dinner.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-025', word: 'experiment', ipa: '/ɪkˈsper.ɪ.mənt/', pos: 'noun / verb', vietnamese: 'thí nghiệm, sự thử nghiệm', example: 'Teenagers often experiment with new fashion trends.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-026', word: 'platform', ipa: '/ˈplæt.fɔːm/', pos: 'noun', vietnamese: 'nền tảng (công nghệ / xã hội)', example: 'Educational platforms assist students with self-study online.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-027', word: 'immigrate', ipa: '/ˈɪm.ɪ.ɡreɪt/', pos: 'verb', vietnamese: 'nhập cư', example: 'Families that immigrate to new countries adapt to new cultures.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-028', word: 'traditional', ipa: '/trəˈdɪʃ.ən.əl/', pos: 'adjective', vietnamese: 'theo truyền thống', example: 'Grandparents value traditional family meals together.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-029', word: 'culture', ipa: '/ˈkʌl.tʃər/', pos: 'noun', vietnamese: 'văn hóa', example: 'Respecting family culture bridges generational divides.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-030', word: 'control', ipa: '/kənˈtrəʊl/', pos: 'verb / noun', vietnamese: 'kiểm soát, điều khiển', example: 'Parents should guide rather than strictly control their teens.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-031', word: 'limit', ipa: '/ˈlɪm.ɪt/', pos: 'verb / noun', vietnamese: 'giới hạn, hạn chế', example: 'Setting a time limit on internet usage promotes better sleep.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-032', word: 'screen time', ipa: '/ˈskriːn taɪm/', pos: 'noun phrase', vietnamese: 'thời gian sử dụng màn hình', example: 'Excessive screen time can negatively affect eyesight.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-033', word: 'upset', ipa: '/ʌpˈset/', pos: 'adjective / verb', vietnamese: 'buồn phiền, bực mình', example: 'Don’t get upset when your parents offer constructve advice.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-034', word: 'hairstyle', ipa: '/ˈheə.staɪl/', pos: 'noun', vietnamese: 'kiểu tóc', example: 'Choosing a modern hairstyle is a form of self-expression for teens.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-035', word: 'strict', ipa: '/strɪkt/', pos: 'adjective', vietnamese: 'nghiêm khắc, khắt khe', example: 'Strict rules can sometimes cause resentment if not explained well.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-036', word: 'belief', ipa: '/bɪˈliːf/', pos: 'noun', vietnamese: 'niềm tin, tín ngưỡng', example: 'Generational beliefs evolve over time.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-037', word: 'believe', ipa: '/bɪˈliːv/', pos: 'verb', vietnamese: 'tin tưởng', example: 'Parents believe in their children’s potential.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-036' },
  { id: 'u2-038', word: 'value', ipa: '/ˈvæl.juː/', pos: 'noun / verb', vietnamese: 'giá trị; coi trọng', example: 'Always value family traditions.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-039', word: 'valuable', ipa: '/ˈvæl.ju.ə.bəl/', pos: 'adjective', vietnamese: 'quý giá, có giá trị', example: 'Grandparents offer valuable life advice.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-038' },
  { id: 'u2-041', word: 'individually', ipa: '/ˌɪn.dɪˈvɪdʒ.u.ə.li/', pos: 'adverb', vietnamese: 'một cách riêng biệt, cá nhân', example: 'Each child should be treated individually.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-010' },
  { id: 'u2-042', word: 'compete', ipa: '/kəmˈpiːt/', pos: 'verb', vietnamese: 'cạnh tranh, thi đấu', example: 'Siblings should support rather than compete with each other.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-043', word: 'competition', ipa: '/ˌkɒm.pəˈtɪʃ.ən/', pos: 'noun', vietnamese: 'cuộc cạnh tranh, cuộc thi', example: 'Healthy competition encourages self-improvement.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-042' },
  { id: 'u2-044', word: 'competitive', ipa: '/kəmˈpet.ə.tɪv/', pos: 'adjective', vietnamese: 'mang tính cạnh tranh', example: 'The academic environment can be highly competitive.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-042' },
  { id: 'u2-045', word: 'competitively', ipa: '/kəmˈpet.ə.tɪv.li/', pos: 'adverb', vietnamese: 'một cách cạnh tranh', example: 'Students perform competitively in exams.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-042' },
  { id: 'u2-046', word: 'confide', ipa: '/kənˈfaɪd/', pos: 'verb', vietnamese: 'tâm sự, giãi bày', example: 'Teens need someone to confide in when stressed.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-047', word: 'confidence', ipa: '/ˈkɒn.fɪ.dəns/', pos: 'noun', vietnamese: 'sự tự tin, lòng tin', example: 'Encouragement builds a child’s confidence.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-046' },
  { id: 'u2-048', word: 'confident', ipa: '/ˈkɒn.fɪ.dənt/', pos: 'adjective', vietnamese: 'tự tin', example: 'Be confident in expressing your ideas politely.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-046' },
  { id: 'u2-049', word: 'confidently', ipa: '/ˈkɒn.fɪ.dənt.li/', pos: 'adverb', vietnamese: 'một cách tự tin', example: 'She spoke confidently during the presentation.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-046' },
  { id: 'u2-050', word: 'differentiate', ipa: '/ˌdɪf.əˈren.ʃi.eɪt/', pos: 'verb', vietnamese: 'phân biệt', example: 'Learn to differentiate between advice and control.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-011' },
  { id: 'u2-051', word: 'agree with', ipa: '/əˈɡriː wɪð/', pos: 'phrasal verb', vietnamese: 'đồng ý với', example: 'I agree with my parents on the importance of honesty.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-052', word: 'disagree with', ipa: '/ˌdɪs.əˈɡriː wɪð/', pos: 'phrasal verb', vietnamese: 'không đồng ý với', example: 'Teens may disagree with strict house rules.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-053', word: 'argue about', ipa: '/ˈɑːɡ.juː əˈbaʊt/', pos: 'phrasal verb', vietnamese: 'tranh cãi về', example: 'Don’t argue about minor household chores.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-054', word: 'belong to', ipa: '/bɪˈlɒŋ tuː/', pos: 'phrasal verb', vietnamese: 'thuộc về', example: 'Family heirlooms belong to the whole family.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-055', word: 'care about', ipa: '/keər əˈbaʊt/', pos: 'phrasal verb', vietnamese: 'quan tâm đến', example: 'Parents deeply care about their children’s well-being.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-056', word: 'consist of', ipa: '/kənˈsɪst ɒv/', pos: 'phrasal verb', vietnamese: 'bao gồm', example: 'A nuclear family consists of parents and children.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-057', word: 'depend on', ipa: '/dɪˈpend ɒn/', pos: 'phrasal verb', vietnamese: 'phụ thuộc vào', example: 'Children depend on parents for guidance.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-058', word: 'express opinion', ipa: '/ɪkˈspres əˈpɪn.jən/', pos: 'collocation', vietnamese: 'bày tỏ ý kiến', example: 'Teens should express opinions respectfully.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-059', word: 'generational conflict', ipa: '/ˌdʒen.əˈreɪ.ʃən.əl ˈkɒn.flɪkt/', pos: 'noun phrase', vietnamese: 'xung đột thế hệ', example: 'Generational conflict can be resolved through dialogue.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-060', word: 'share views', ipa: '/ʃeər vjuːz/', pos: 'collocation', vietnamese: 'chia sẻ quan điểm', example: 'Family meetings allow everyone to share views.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-061', word: 'behave', ipa: '/bɪˈheɪv/', pos: 'verb', vietnamese: 'cư xử, ứng xử', example: 'Children learn to behave by watching their parents.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-062', word: 'behavioral', ipa: '/bɪˈheɪ.vjər.əl/', pos: 'adjective', vietnamese: 'thuộc về hành vi', example: 'Counselors provide behavioral guidance to teenagers.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-061' },
  { id: 'u2-063', word: 'economy', ipa: '/ɪˈkɒn.ə.mi/', pos: 'noun', vietnamese: 'nền kinh tế', example: 'A stable economy helps families maintain a good standard of living.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-019' },
  { id: 'u2-064', word: 'economical', ipa: '/ˌiː.kəˈnɒm.ɪ.kəl/', pos: 'adjective', vietnamese: 'tiết kiệm', example: 'Cooking at home is more economical than eating out.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-019' },
  { id: 'u2-065', word: 'economics', ipa: '/ˌiː.kəˈnɒm.ɪks/', pos: 'noun', vietnamese: 'môn kinh tế học', example: 'She is studying economics at university.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-019' },
  { id: 'u2-066', word: 'economist', ipa: '/ɪˈkɒn.ə.mɪst/', pos: 'noun', vietnamese: 'nhà kinh tế học', example: 'Economists analyze financial trends affecting households.', difficulty: 'hard', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-019' },
  { id: 'u2-067', word: 'society', ipa: '/səˈsaɪ.ə.ti/', pos: 'noun', vietnamese: 'xã hội', example: 'Family is the foundational building block of society.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-020' },
  { id: 'u2-068', word: 'sociable', ipa: '/ˈsəʊ.ʃə.bəl/', pos: 'adjective', vietnamese: 'hòa đồng, cởi mở', example: 'He is a sociable person who enjoys meeting relatives.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-020' },
  { id: 'u2-069', word: 'socialize', ipa: '/ˈsəʊ.ʃəl.aɪz/', pos: 'verb', vietnamese: 'giao lưu, kết bạn', example: 'Teens use social media to socialize with classmates.', difficulty: 'easy', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-020' },
  { id: 'u2-070', word: 'socialization', ipa: '/ˌsəʊ.ʃəl.aɪˈzeɪ.ʃən/', pos: 'noun', vietnamese: 'sự xã hội hóa', example: 'Schools play a key role in childhood socialization.', difficulty: 'hard', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-020' },
  { id: 'u2-071', word: 'curiosity', ipa: '/ˌkjʊə.riˈɒs.ə.ti/', pos: 'noun', vietnamese: 'sự tò mò, tính ham học hỏi', example: 'Encourage a child’s natural curiosity about science.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-072', word: 'immigrant', ipa: '/ˈɪm.ɪ.ɡrənt/', pos: 'noun', vietnamese: 'người nhập cư', example: 'Immigrants contribute rich diversity to local communities.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-027' },
  { id: 'u2-073', word: 'immigration', ipa: '/ˌɪm.ɪˈɡreɪ.ʃən/', pos: 'noun', vietnamese: 'sự nhập cư', example: 'New immigration laws were passed recently.', difficulty: 'medium', type: 'word_family', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05', parentWordId: 'u2-027' },
  { id: 'u2-074', word: 'hire', ipa: '/haɪər/', pos: 'verb', vietnamese: 'thuê, tuyển dụng', example: 'Some families hire tutors to help teens with studies.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-075', word: 'rudely', ipa: '/ˈruːd.li/', pos: 'adverb', vietnamese: 'một cách thô lỗ', example: 'Speaking rudely to elders is considered unacceptable.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-076', word: 'permission', ipa: '/pəˈmɪʃ.ən/', pos: 'noun', vietnamese: 'sự cho phép', example: 'Ask for permission before going out late at night.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-077', word: 'attitude', ipa: '/ˈæt.ɪ.tʃuːd/', pos: 'noun', vietnamese: 'thái độ', example: 'A positive attitude improves parent-child communication.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-078', word: 'addicted', ipa: '/əˈdɪk.tɪd/', pos: 'adjective', vietnamese: 'nghiện (game, điện thoại...)', example: 'Many teens are addicted to scrolling on smartphones.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-079', word: 'absorbed', ipa: '/əbˈzɔːbd/', pos: 'adjective', vietnamese: 'say mê, chìm đắm vào', example: 'He was so absorbed in his laptop that he forgot dinner.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-080', word: 'learn to do', ipa: '/lɜːn tuː duː/', pos: 'structure', vietnamese: 'học cách làm việc gì', example: 'Children learn to make decisions independently.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-081', word: 'hold views about', ipa: '/həʊld vjuːz əˈbaʊt/', pos: 'collocation', vietnamese: 'có quan điểm về', example: 'Grandparents hold traditional views about marriage.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-082', word: 'want sb to do', ipa: '/wɒnt tuː duː/', pos: 'structure', vietnamese: 'muốn ai làm gì', example: 'Parents want their children to succeed in life.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-083', word: 'do the housework', ipa: '/duː ðə ˈhaʊs.wɜːk/', pos: 'collocation', vietnamese: 'làm việc nhà', example: 'Teens should do the housework to assist busy parents.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-084', word: 'force sb to do', ipa: '/fɔːs tuː duː/', pos: 'structure', vietnamese: 'ép buộc ai làm gì', example: 'Parents should not force children into careers they dislike.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-085', word: 'refer to', ipa: '/rɪˈfɜːr tuː/', pos: 'phrasal verb', vietnamese: 'đề cập đến, ám chỉ', example: 'The term "digital native" refers to those born in the tech era.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-086', word: 'bridge the gap', ipa: '/brɪdʒ ðə ɡæp/', pos: 'idiom / phrase', vietnamese: 'thu hẹp khoảng cách', example: 'Open dialogue helps bridge the gap between generations.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-087', word: 'peer pressure', ipa: '/pɪər ˈpreʃ.ər/', pos: 'noun phrase', vietnamese: 'áp lực từ bạn bè cùng lứa', example: 'Teens often face strong peer pressure regarding clothing choices.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-088', word: 'curfew', ipa: '/ˈkɜː.fjuː/', pos: 'noun', vietnamese: 'giờ giới nghiêm', example: 'My parents set a strict curfew at 9 PM on weekends.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-089', word: 'mindset', ipa: '/ˈmaɪnd.set/', pos: 'noun', vietnamese: 'tư duy, định kiến suy nghĩ', example: 'Adopting a growth mindset helps resolve family differences.', difficulty: 'medium', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-090', word: 'open-minded', ipa: '/ˌəʊ.pənˈmaɪn.dɪd/', pos: 'adjective', vietnamese: 'cởi mở, rộng rãi', example: 'Parents who are open-minded build stronger bonds with teens.', difficulty: 'easy', type: 'core', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-091', word: 'table manners', ipa: '/ˈteɪ.bəl ˌmæn.əz/', pos: 'noun phrase', vietnamese: 'quy tắc ứng xử trên bàn ăn', example: 'Good table manners are taught early in traditional families.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-092', word: 'multigenerational', ipa: '/ˌmʌl.ti.dʒen.əˈreɪ.ʃən.əl/', pos: 'adjective', vietnamese: 'nhiều thế hệ', example: 'Living in a multigenerational house requires mutual respect.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-093', word: 'mutual respect', ipa: '/ˈmjuː.tʃu.əl rɪˈspekt/', pos: 'noun phrase', vietnamese: 'sự tôn trọng lẫn nhau', example: 'Mutual respect is the foundation of a healthy relationship.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-094', word: 'screen-free time', ipa: '/skriːn friː taɪm/', pos: 'noun phrase', vietnamese: 'thời gian không sử dụng màn hình', example: 'Having screen-free time during meals encourages family conversation.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-095', word: 'financially independent', ipa: '/faɪˈnæn.ʃəl.i ˌɪn.dɪˈpen.dənt/', pos: 'adjective phrase', vietnamese: 'độc lập về tài chính', example: 'Young adults aspire to become financially independent.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-096', word: 'follow suit', ipa: '/ˈfɒl.əʊ suːt/', pos: 'idiom / phrase', vietnamese: 'nói / làm theo người khác', example: 'When elder siblings study hard, younger ones often follow suit.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-097', word: 'bridge the generational divide', ipa: '/brɪdʒ ðə ˌdʒen.əˈreɪ.ʃən.əl dɪˈvaɪd/', pos: 'idiom / phrase', vietnamese: 'nối liền sự phân tách thế hệ', example: 'Shared hobbies help bridge the generational divide between grandfather and grandson.', difficulty: 'hard', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-098', word: 'set an example', ipa: '/set ən ɪɡˈzɑːm.pəl/', pos: 'collocation', vietnamese: 'nêu gương, làm gương', example: 'Parents set a good example by being polite and responsible.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-099', word: 'bridge differences', ipa: '/brɪdʒ ˈdɪf.ər.ən.sɪz/', pos: 'collocation', vietnamese: 'hòa giải sự khác biệt', example: 'Active listening helps bridge differences in family opinions.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-100', word: 'generation gap conflict', ipa: '/ˌdʒen.əˈreɪ.ʃən ɡæp ˈkɒn.flɪkt/', pos: 'noun phrase', vietnamese: 'xung đột do khoảng cách thế hệ', example: 'Clear rules reduce generation gap conflicts at home.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-101', word: 'lifestyle choices', ipa: '/ˈlaɪf.staɪl tʃɔɪsɪz/', pos: 'noun phrase', vietnamese: 'các lựa chọn phong cách sống', example: 'Teens want freedom to make their own lifestyle choices.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-102', word: 'work ethic', ipa: '/wɜːk ˈeθ.ɪk/', pos: 'noun phrase', vietnamese: 'đạo đức làm việc, tinh thần làm việc', example: 'Grandparents often instill a strong work ethic in their children.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-103', word: 'sense of responsibility', ipa: '/sens əv rɪˌspɒn.səˈbɪl.ə.ti/', pos: 'noun phrase', vietnamese: 'ý thức trách nhiệm', example: 'Doing chores fosters a strong sense of responsibility in kids.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-104', word: 'family bond', ipa: '/ˈfæm.əl.i bɒnd/', pos: 'noun phrase', vietnamese: 'sự gắn kết gia đình', example: 'Weekly dinners strengthen family bonds.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-105', word: 'express oneself', ipa: '/ɪkˈspres wʌnˈself/', pos: 'idiom / phrase', vietnamese: 'thể hiện bản thân', example: 'Teenagers use art and music to express themselves.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-106', word: 'reach a compromise', ipa: '/riːtʃ ə ˈkɒm.prə.maɪz/', pos: 'collocation', vietnamese: 'đạt được sự thỏa hiệp', example: 'Both parents and teens must compromise to avoid arguments.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-107', word: 'show gratitude', ipa: '/ʃəʊ ˈɡræt.ɪ.tʃuːd/', pos: 'collocation', vietnamese: 'bày tỏ lòng biết ơn', example: 'Show gratitude for your parents’ care and sacrifices.', difficulty: 'easy', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-108', word: 'social pressure', ipa: '/ˈsəʊ.ʃəl ˈpreʃ.ər/', pos: 'noun phrase', vietnamese: 'áp lực xã hội', example: 'Social pressure affects how teens dress and behave.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-109', word: 'technological literacy', ipa: '/ˌtek.nəˈlɒdʒ.ɪ.kəl ˈlɪt.ər.ə.si/', pos: 'noun phrase', vietnamese: 'hiểu biết công nghệ', example: 'Teens help grandparents improve their technological literacy.', difficulty: 'hard', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' },
  { id: 'u2-110', word: 'parental guidance', ipa: '/pəˈren.təl ˈɡaɪ.dəns/', pos: 'noun phrase', vietnamese: 'sự hướng dẫn của cha mẹ', example: 'Teenagers still need gentle parental guidance when navigating social media.', difficulty: 'medium', type: 'extended', unit: 'unit2', sourceRef: 'Global Success 11 - Tờ số 05' }
];

// FULL 120 VERIFIED ITEMS FOR UNIT 3: CITIES OF THE FUTURE (TỜ SỐ 09)
const UNIT_3_VERIFIED_WORDS = [
  { id: 'u3-001', word: 'exhibition', ipa: '/ˌek.sɪˈbɪʃ.ən/', pos: 'noun', vietnamese: 'cuộc triển lãm', example: 'The smart city exhibition presented green technological innovations.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-002', word: 'impact', ipa: '/ˈɪm.pækt/', pos: 'noun / verb', vietnamese: 'tác động, ảnh hưởng; có tác động', example: 'Using electric buses has a positive impact on urban air quality.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-003', word: 'vehicle', ipa: '/ˈvɪə.kəl/', pos: 'noun', vietnamese: 'phương tiện giao thông', example: 'Electric vehicles produce zero tailpipe emissions in city centers.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-004', word: 'traffic jam', ipa: '/ˈtræf.ɪk dʒæm/', pos: 'noun phrase', vietnamese: 'sự ùn tắc giao thông', example: 'Smart traffic light sensors reduce traffic jams during rush hour.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-005', word: 'city dweller', ipa: '/ˈsɪt.i ˌdwel.ər/', pos: 'noun phrase', vietnamese: 'cư dân thành phố', example: 'Many city dwellers prefer public transportation to driving personal cars.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-006', word: 'efficient', ipa: '/ɪˈfɪʃ.ənt/', pos: 'adjective', vietnamese: 'hiệu quả, có năng suất cao', example: 'Energy-efficient buildings consume significantly less electricity.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'efficiency', pos: 'noun', meaning: 'hiệu suất, hiệu quả' }, { word: 'efficiently', pos: 'adverb', meaning: 'một cách hiệu quả' }] },
  { id: 'u3-007', word: 'infrastructure', ipa: '/ˈɪn.frəˌstrʌk.tʃər/', pos: 'noun', vietnamese: 'cơ sở hạ tầng', example: 'Investing in modern infrastructure improves city living conditions.', difficulty: 'hard', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-008', word: 'high-rise', ipa: '/ˈhaɪ.raɪz/', pos: 'adjective / noun', vietnamese: 'cao tầng; tòa nhà cao tầng', example: 'High-rise apartments save ground space in densely populated metropolises.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-009', word: 'carbon footprint', ipa: '/ˌkɑː.bən ˈfʊt.prɪnt/', pos: 'noun phrase', vietnamese: 'lượng khí thải carbon', example: 'Using solar energy helps urban families lower their carbon footprint.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-010', word: 'transport', ipa: '/ˈtræn.spɔːt/', pos: 'noun / verb', vietnamese: 'giao thông vận tải; vận chuyển', example: 'Public transport systems will be completely automated in future cities.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-011', word: 'urban centre', ipa: '/ˈɜː.bən ˈsen.tər/', pos: 'noun phrase', vietnamese: 'trung tâm đô thị', example: 'Pedestrian zones make urban centres safer and less polluted.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-012', word: 'roof garden', ipa: '/ruːf ˈɡɑː.dən/', pos: 'noun phrase', vietnamese: 'vườn trên mái nhà', example: 'Roof gardens help cool down high-rise buildings during summer.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-013', word: 'skyscraper', ipa: '/ˈskaɪˌskreɪ.pər/', pos: 'noun', vietnamese: 'tòa nhà chọc trời', example: 'The futuristic skyscraper features integrated wind turbines.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-014', word: 'smoothly', ipa: '/ˈsmuːð.li/', pos: 'adverb', vietnamese: 'một cách suôn sẻ, trôi chảy', example: 'Autonomous traffic management keeps vehicles moving smoothly.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-015', word: 'architecture', ipa: '/ˈɑː.kɪ.tek.tʃər/', pos: 'noun', vietnamese: 'kiến trúc, công trình kiến trúc', example: 'Sustainable architecture emphasizes natural lighting and green materials.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'architect', pos: 'noun', meaning: 'kiến trúc sư' }, { word: 'architectural', pos: 'adjective', meaning: 'thuộc về kiến trúc' }] },
  { id: 'u3-016', word: 'suburb', ipa: '/ˈsʌb.ɜːb/', pos: 'noun', vietnamese: 'vùng ngoại ô', example: 'High-speed trains connect the peaceful suburbs directly to the city center.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'suburban', pos: 'adjective', meaning: 'thuộc ngoại ô' }] },
  { id: 'u3-017', word: 'sustain', ipa: '/səˈsteɪn/', pos: 'verb', vietnamese: 'duy trì, chống đỡ', example: 'Green initiatives help sustain high quality of life for future citizens.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'sustainable', pos: 'adjective', meaning: 'bền vững' }, { word: 'sustainability', pos: 'noun', meaning: 'sự bền vững' }, { word: 'sustainably', pos: 'adverb', meaning: 'một cách bền vững' }] },
  { id: 'u3-018', word: 'sensor', ipa: '/ˈsen.sər/', pos: 'noun', vietnamese: 'cảm biến', example: 'Smart sensors monitor air pollution levels across the urban area.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-019', word: 'biodiversity', ipa: '/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/', pos: 'noun', vietnamese: 'đa dạng sinh học', example: 'Urban parks boost local biodiversity by supporting birds and insects.', difficulty: 'hard', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-020', word: 'renewable', ipa: '/rɪˈnjuː.ə.bəl/', pos: 'adjective', vietnamese: 'có thể tái tạo', example: 'Solar and wind energy are abundant sources of renewable power.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-021', word: 'non-renewable', ipa: '/ˌnɒn.rɪˈnjuː.ə.bəl/', pos: 'adjective', vietnamese: 'không thể tái tạo', example: 'Burning non-renewable fossil fuels releases greenhouse gases into the air.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-022', word: 'eco-friendly', ipa: '/ˌiː.kəʊˈfrend.li/', pos: 'adjective', vietnamese: 'thân thiện với môi trường', example: 'Eco-friendly building materials reduce thermal pollution in big cities.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-023', word: 'computer-controlled', ipa: '/kəmˈpjuː.tər kənˈtrəʊld/', pos: 'adjective', vietnamese: 'được điều khiển bằng máy tính', example: 'Computer-controlled streetlights turn off automatically when sunrise occurs.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-024', word: 'emission', ipa: '/iˈmɪʃ.ən/', pos: 'noun', vietnamese: 'khí thải, sự phát thải', example: 'Cities must limit harmful carbon emissions from industrial factories.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-025', word: 'pedestrian zone', ipa: '/pəˈdes.tri.ən zəʊn/', pos: 'noun phrase', vietnamese: 'khu vực dành cho người đi bộ', example: 'Cars are banned in the central pedestrian zone on weekends.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-026', word: 'cycle path', ipa: '/ˈsaɪ.kəl pɑːθ/', pos: 'noun phrase', vietnamese: 'làn đường dành cho xe đạp', example: 'Expanding dedicated cycle paths encourages citizens to bike to work.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-027', word: 'livable', ipa: '/ˈlɪv.ə.bəl/', pos: 'adjective', vietnamese: 'thích hợp để sống, đáng sống', example: 'Green spaces and clean air make future smart cities more livable.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-028', word: 'living conditions', ipa: '/ˈlɪv.ɪŋ kənˈdɪʃ.ənz/', pos: 'noun phrase', vietnamese: 'điều kiện sống', example: 'Modern sanitation drastically improved overall living conditions in urban areas.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-029', word: 'rush hour', ipa: '/ˈrʌʃ ˌaʊər/', pos: 'noun phrase', vietnamese: 'giờ cao điểm', example: 'Taking the underground metro saves time during morning rush hour.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-030', word: 'interact', ipa: '/ˌɪn.təˈrækt/', pos: 'verb', vietnamese: 'tương tác, giao tiếp', example: 'Smart apps allow citizens to interact directly with municipal services.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'interaction', pos: 'noun', meaning: 'sự tương tác' }, { word: 'interactive', pos: 'adjective', meaning: 'mang tính tương tác' }] },
  { id: 'u3-031', word: 'neighbor', ipa: '/ˈneɪ.bər/', pos: 'noun', vietnamese: 'hàng xóm', example: 'Community gardens foster strong friendships among local neighbors.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'neighborhood', pos: 'noun', meaning: 'xóm giềng, khu vực lân cận' }] },
  { id: 'u3-032', word: 'privacy', ipa: '/ˈprɪv.ə.si/', pos: 'noun', vietnamese: 'sự riêng tư', example: 'Residents expressed concern about data privacy in sensor-monitored homes.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-033', word: 'sense of community', ipa: '/sens əv kəˈmjuː.nə.ti/', pos: 'noun phrase', vietnamese: 'ý thức cộng đồng', example: 'Shared green spaces enhance a strong sense of community in suburban areas.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-034', word: 'security', ipa: '/sɪˈkjʊə.rə.ti/', pos: 'noun', vietnamese: 'an ninh, sự an toàn', example: 'AI facial recognition cameras strengthen public security in smart hubs.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-035', word: 'victim', ipa: '/ˈvɪk.tɪm/', pos: 'noun', vietnamese: 'nạn nhân', example: 'Cybersecurity systems prevent citizens from becoming victims of online scams.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-036', word: 'cybercrime', ipa: '/ˈsaɪ.bə.kraɪm/', pos: 'noun', vietnamese: 'tội phạm mạng, tội phạm công nghệ cao', example: 'Smart cities must implement strict firewall protections against cybercrime.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-037', word: 'expert', ipa: '/ˈek.spɜːt/', pos: 'noun', vietnamese: 'chuyên gia', example: 'Urban planning experts advise building more public green parks.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-038', word: 'extend', ipa: '/ɪkˈstend/', pos: 'verb', vietnamese: 'mở rộng, kéo dài', example: 'The government plans to extend the metro line to outer suburban districts.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-039', word: 'flat', ipa: '/flæt/', pos: 'noun', vietnamese: 'căn hộ', example: 'She bought a modern studio flat equipped with automated smart appliances.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-040', word: 'greenhouse gas', ipa: '/ˈɡriːn.haʊs ˌɡæs/', pos: 'noun phrase', vietnamese: 'khí nhà kính', example: 'Reducing greenhouse gas emissions is critical to combating global warming.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-041', word: 'impressed', ipa: '/ɪmˈprest/', pos: 'adjective', vietnamese: 'bị ấn tượng, có ấn tượng sâu sắc', example: 'Visitors were deeply impressed by the city’s underground waste system.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-042', word: 'interrupt', ipa: '/ˌɪn.təˈrʌpt/', pos: 'verb', vietnamese: 'gián đoạn, ngắt lời', example: 'Power cuts rarely interrupt operations in self-sustaining solar cities.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-043', word: 'one-way', ipa: '/ˌwʌnˈweɪ/', pos: 'adjective', vietnamese: 'một chiều', example: 'Converting narrow streets into one-way lanes speeds up traffic flow.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-044', word: 'organize', ipa: '/ˈɔː.ɡən.aɪz/', pos: 'verb', vietnamese: 'tổ chức, sắp xếp', example: 'Community groups organize weekly neighborhood clean-up campaigns.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'organization', pos: 'noun', meaning: 'sự tổ chức, tổ chức' }] },
  { id: 'u3-045', word: 'pedal', ipa: '/ˈped.əl/', pos: 'verb / noun', vietnamese: 'đạp xe; bàn đạp', example: 'Many residents pedal to work along dedicated scenic river paths.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-046', word: 'predict', ipa: '/prɪˈdɪkt/', pos: 'verb', vietnamese: 'dự đoán', example: 'AI models predict severe weather changes and signal emergency warnings.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-047', word: 'prescription', ipa: '/prɪˈskrɪp.ʃən/', pos: 'noun', vietnamese: 'đơn thuốc', example: 'Pharmacies deliver doctor prescriptions automatically via autonomous drones.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-048', word: 'populate', ipa: '/ˈpɒp.jə.leɪt/', pos: 'verb', vietnamese: 'sinh sống, định cư', example: 'As more people populate urban zones, vertical housing becomes mandatory.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', wordFamily: [{ word: 'population', pos: 'noun', meaning: 'dân số' }] },
  { id: 'u3-049', word: 'quality', ipa: '/ˈkwɒl.ə.ti/', pos: 'noun', vietnamese: 'chất lượng', example: 'Clean energy transition improves life quality for all city residents.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-050', word: 'refund', ipa: '/ˈriː.fʌnd/', pos: 'noun / verb', vietnamese: 'sự hoàn tiền; hoàn lại tiền', example: 'Commuters receive an instant refund if smart transit experiences delays.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-051', word: 'rooftop farming', ipa: '/ˈruːf.tɒp ˈfɑː.mɪŋ/', pos: 'noun phrase', vietnamese: 'trồng trọt trên mái nhà', example: 'Rooftop farming provides fresh organic produce to downtown markets.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-052', word: 'tram', ipa: '/træm/', pos: 'noun', vietnamese: 'xe điện mặt đất', example: 'Electric trams offer quiet and pollution-free urban transportation.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-053', word: 'decision-making', ipa: '/dɪˈsɪʒ.ən ˌmeɪ.kɪŋ/', pos: 'noun phrase', vietnamese: 'quá trình ra quyết định', example: 'Smart city platforms involve citizens in transparent decision-making.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-054', word: 'apartment', ipa: '/əˈpɑːt.mənt/', pos: 'noun', vietnamese: 'căn hộ', example: 'Modern apartment blocks feature solar glass windows.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-055', word: 'appointment', ipa: '/əˈpɔɪnt.mənt/', pos: 'noun', vietnamese: 'cuộc hẹn', example: 'Residents schedule virtual doctor appointments through municipal mobile apps.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-056', word: 'card reader', ipa: '/kɑːd ˈriː.dər/', pos: 'noun phrase', vietnamese: 'máy đọc thẻ', example: 'Contactless card readers speed up passenger boarding on public buses.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-057', word: 'available', ipa: '/əˈveɪ.lə.bəl/', pos: 'adjective', vietnamese: 'có sẵn, sẵn có', example: 'Real-time parking space data is available on every driver’s smartphone.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-058', word: 'driverless bus', ipa: '/ˈdraɪ.və.ləs bʌs/', pos: 'noun phrase', vietnamese: 'xe buýt không người lái', example: 'Driverless buses run on fixed electrical routes across the smart park.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-059', word: 'efficiency', ipa: '/ɪˈfɪʃ.ən.si/', pos: 'noun', vietnamese: 'hiệu suất, tính hiệu quả', example: 'Smart grids optimize power efficiency and prevent blackout surges.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-006' },
  { id: 'u3-060', word: 'efficiently', ipa: '/ɪˈfɪʃ.ən.li/', pos: 'adverb', vietnamese: 'một cách hiệu quả', example: 'Waste management systems operate efficiently using underground vacuum tubes.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-006' },
  { id: 'u3-061', word: 'architect', ipa: '/ˈɑː.kɪ.tekt/', pos: 'noun', vietnamese: 'kiến trúc sư', example: 'Famous architects collaborate to design eco-friendly residential complexes.', difficulty: 'easy', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-015' },
  { id: 'u3-062', word: 'architectural', ipa: '/ˌɑː.kɪˈtek.tʃər.əl/', pos: 'adjective', vietnamese: 'thuộc về kiến trúc', example: 'The skyscraper won international awards for architectural excellence.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-015' },
  { id: 'u3-063', word: 'suburban', ipa: '/səˈbɜː.bən/', pos: 'adjective', vietnamese: 'thuộc vùng ngoại ô', example: 'Suburban communities offer quiet green living spaces away from city noise.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-016' },
  { id: 'u3-064', word: 'sustainable', ipa: '/səˈsteɪ.nə.bəl/', pos: 'adjective', vietnamese: 'phát triển bền vững', example: 'Sustainable urban design protects ecosystems for future generations.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-017' },
  { id: 'u3-065', word: 'sustainability', ipa: '/səˌsteɪ.nəˈbɪl.ə.ti/', pos: 'noun', vietnamese: 'sự bền vững, tính bền vững', example: 'City leaders prioritize environmental sustainability in long-term planning.', difficulty: 'hard', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-017' },
  { id: 'u3-066', word: 'sustainably', ipa: '/səˈsteɪ.nə.bli/', pos: 'adverb', vietnamese: 'một cách bền vững', example: 'Green cities recycle wastewater sustainably to preserve freshwater lakes.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-017' },
  { id: 'u3-067', word: 'interaction', ipa: '/ˌɪn.təˈræk.ʃən/', pos: 'noun', vietnamese: 'sự tương tác', example: 'Social interaction in neighborhood parks improves mental well-being.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-030' },
  { id: 'u3-068', word: 'interactive', ipa: '/ˌɪn.təˈræk.tɪv/', pos: 'adjective', vietnamese: 'mang tính tương tác', example: 'Interactive digital maps display live bus locations and arrival times.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-030' },
  { id: 'u3-069', word: 'neighborhood', ipa: '/ˈneɪ.bə.hʊd/', pos: 'noun', vietnamese: 'xóm giềng, khu vực lân cận', example: 'Our smart neighborhood features shared electric car stations.', difficulty: 'easy', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-031' },
  { id: 'u3-070', word: 'organization', ipa: '/ˌɔː.ɡən.aɪˈzeɪ.ʃən/', pos: 'noun', vietnamese: 'sự tổ chức; cơ quan, tổ chức', example: 'The environmental organization promotes citywide tree planting drives.', difficulty: 'easy', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-044' },
  { id: 'u3-071', word: 'population', ipa: '/ˌpɒp.jəˈleɪ.ʃən/', pos: 'noun', vietnamese: 'dân số', example: 'Managing rapid population growth requires smart urban housing solutions.', difficulty: 'easy', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-048' },
  { id: 'u3-072', word: 'feel free to do', ipa: '/fiːl friː tuː duː/', pos: 'structure', vietnamese: 'cứ tự nhiên / thoải mái làm gì', example: 'Feel free to contact municipal help desks for transit assistance.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-073', word: 'have an impact on', ipa: '/hæv ən ˈɪm.pækt ɒn/', pos: 'collocation', vietnamese: 'có tác động / ảnh hưởng tới', example: 'Urban greening projects have a direct positive impact on air quality.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-074', word: 'be impressed by', ipa: '/biː ɪmˈprest baɪ/', pos: 'collocation', vietnamese: 'bị ấn tượng bởi', example: 'International tourists were impressed by the efficient subway network.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-075', word: 'attract one’s attention', ipa: '/əˈtrækt əˈten.ʃən/', pos: 'collocation', vietnamese: 'thu hút sự chú ý của ai', example: 'The innovative roof garden design attracted the attention of urban architects.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-076', word: 'be expected to do', ipa: '/biː ɪkˈspek.tɪd tuː duː/', pos: 'structure', vietnamese: 'được kỳ vọng / dự đoán làm gì', example: 'Future cities are expected to generate power entirely from renewable sources.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-077', word: 'cope with', ipa: '/kəʊp wɪð/', pos: 'phrasal verb', vietnamese: 'đương đầu, giải quyết khó khăn', example: 'Smart traffic light grids help city infrastructure cope with rush hour congestion.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-078', word: 'a range of', ipa: '/ə reɪndʒ ɒv/', pos: 'idiom / phrase', vietnamese: 'một loạt các, hàng loạt', example: 'Smart city platforms offer a range of public services via mobile apps.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-079', word: 'warn sb against doing', ipa: '/wɔːn əˈɡenst ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'cảnh báo ai không nên làm gì', example: 'Safety systems warn drivers against exceeding speed limits in pedestrian zones.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-080', word: 'make room for', ipa: '/meɪk ruːm fɔːr/', pos: 'idiom / phrase', vietnamese: 'dọn chỗ / nhường chỗ cho', example: 'Old industrial buildings were demolished to make room for green public parks.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-081', word: 'care about', ipa: '/keər əˈbaʊt/', pos: 'phrasal verb', vietnamese: 'quan tâm đến', example: 'Modern city dwellers deeply care about environmental sustainability.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-082', word: 'made available for', ipa: '/meɪd əˈveɪ.lə.bəl fɔːr/', pos: 'collocation', vietnamese: 'được chuẩn bị sẵn có cho', example: 'Free Wi-Fi networks are made available for all park visitors.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-083', word: 'provide sb with sth', ipa: '/prəˈvaɪd wɪð/', pos: 'structure', vietnamese: 'cung cấp cho ai cái gì', example: 'Rooftop farms provide local communities with fresh organic vegetables.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-084', word: 'thanks to', ipa: '/θæŋks tuː/', pos: 'idiom / phrase', vietnamese: 'nhờ có, nhờ vào', example: 'Thanks to automated recycling, municipal landfill waste decreased by 60%.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-085', word: 'interact with', ipa: '/ˌɪn.təˈrækt wɪð/', pos: 'phrasal verb', vietnamese: 'tương tác với', example: 'Smart AI assistants help residents interact with home energy controls.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-086', word: 'pros and cons', ipa: '/prəʊz ænd kɒnz/', pos: 'idiom / phrase', vietnamese: 'ưu và nhược điểm', example: 'Urban planners evaluated the pros and cons of high-speed underground trains.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-087', word: 'on the other hand', ipa: '/ɒn ði ˈʌð.ər hænd/', pos: 'idiom / phrase', vietnamese: 'mặt khác, ngược lại', example: 'High-rise living saves land; on the other hand, it requires strict fire safety.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-088', word: 'smart city', ipa: '/smɑːt ˈsɪt.i/', pos: 'noun phrase', vietnamese: 'thành phố thông minh', example: 'A smart city uses digital technology to enhance living standards.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-089', word: 'urban planning', ipa: '/ˈɜː.bən ˈplæn.ɪŋ/', pos: 'noun phrase', vietnamese: 'quy hoạch đô thị', example: 'Effective urban planning prevents traffic congestion and overpopulation.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-090', word: 'solar energy', ipa: '/ˈsəʊ.lər ˈen.ə.dʒi/', pos: 'noun phrase', vietnamese: 'năng lượng mặt trời', example: 'Solar energy panels power public streetlights in future smart districts.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-091', word: 'wind power', ipa: '/wɪnd paʊər/', pos: 'noun phrase', vietnamese: 'năng lượng gió', example: 'Offshore turbines supply clean wind power to coastal metropolitan cities.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-092', word: 'public transit', ipa: '/ˈpʌb.lɪk ˈtræn.zɪt/', pos: 'noun phrase', vietnamese: 'giao thông công cộng', example: 'Improving public transit reduces reliance on personal private cars.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-093', word: 'waste management', ipa: '/weɪst ˈmæn.ɪdʒ.mənt/', pos: 'noun phrase', vietnamese: 'quản lý rác thải', example: 'Smart waste management sensors notify sanitation trucks when bins are full.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-094', word: 'green space', ipa: '/ɡriːn speɪs/', pos: 'noun phrase', vietnamese: 'không gian xanh', example: 'Cities need more green spaces to improve mental health and reduce heat.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-095', word: 'thermal pollution', ipa: '/ˈθɜː.məl pəˈluː.ʃən/', pos: 'noun phrase', vietnamese: 'ô nhiễm nhiệt', example: 'Planting trees along main streets helps decrease urban thermal pollution.', difficulty: 'hard', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-096', word: 'air quality index', ipa: '/eər ˈkwɒl.ə.ti ˈɪn.deks/', pos: 'noun phrase', vietnamese: 'chỉ số chất lượng không khí', example: 'The city’s live air quality index is displayed on outdoor electronic boards.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-097', word: 'vertical farm', ipa: '/ˈvɜː.tɪ.kəl fɑːm/', pos: 'noun phrase', vietnamese: 'nông trại thẳng đứng', example: 'Vertical farms grow fresh crops indoors using minimal land space.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-098', word: 'autonomous vehicle', ipa: '/ɔːˈtɒn.ə.məs ˈvɪə.kəl/', pos: 'noun phrase', vietnamese: 'phương tiện tự hành', example: 'Autonomous vehicles communicate with traffic signals to avoid collisions.', difficulty: 'hard', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-099', word: 'smart grid', ipa: '/smɑːt ɡrɪd/', pos: 'noun phrase', vietnamese: 'lưới điện thông minh', example: 'A smart grid balances electricity distribution according to real-time demand.', difficulty: 'hard', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-100', word: 'zero-emission', ipa: '/ˈzɪə.rəʊ iˈmɪʃ.ən/', pos: 'adjective', vietnamese: 'không phát thải', example: 'Zero-emission electric buses produce no harmful gases on city avenues.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-101', word: 'heat island effect', ipa: '/hiːt ˈaɪ.lənd ɪˈfekt/', pos: 'noun phrase', vietnamese: 'hiệu ứng đảo nhiệt đô thị', example: 'Rooftop gardens reduce the urban heat island effect during heatwaves.', difficulty: 'hard', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-102', word: 'sustainable development', ipa: '/səˈsteɪ.nə.bəl dɪˈvel.əp.mənt/', pos: 'noun phrase', vietnamese: 'phát triển bền vững', example: 'Sustainable development satisfies present needs without harming the future.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-103', word: 'urbanization', ipa: '/ˌɜː.bən.aɪˈzeɪ.ʃən/', pos: 'noun', vietnamese: 'sự đô thị hóa', example: 'Rapid urbanization requires clever transportation and sanitation solutions.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-011' },
  { id: 'u3-104', word: 'urban', ipa: '/ˈɜː.bən/', pos: 'adjective', vietnamese: 'thuộc về đô thị', example: 'Urban areas need more accessible parks for children and families.', difficulty: 'easy', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-011' },
  { id: 'u3-105', word: 'prediction', ipa: '/prɪˈdɪk.ʃən/', pos: 'noun', vietnamese: 'sự dự đoán', example: 'Weather predictions help city drainage networks prepare for storms.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-046' },
  { id: 'u3-106', word: 'predictable', ipa: '/prɪˈdɪk.tə.bəl/', pos: 'adjective', vietnamese: 'có thể dự đoán được', example: 'Automated train schedules make daily commuting completely predictable.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-046' },
  { id: 'u3-107', word: 'unpredictable', ipa: '/ˌʌn.prɪˈdɪk.tə.bəl/', pos: 'adjective', vietnamese: 'không thể dự đoán trước', example: 'Unpredictable weather patterns highlight the urgency of climate action.', difficulty: 'medium', type: 'word_family', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09', parentWordId: 'u3-046' },
  { id: 'u3-108', word: 'renewable energy', ipa: '/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/', pos: 'noun phrase', vietnamese: 'năng lượng tái tạo', example: 'Switching to renewable energy reduces dependence on coal power plants.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-109', word: 'fossil fuel', ipa: '/ˈfɒs.əl ˌfjuːəl/', pos: 'noun phrase', vietnamese: 'nhiên liệu hóa thạch', example: 'Phasing out fossil fuels is a key goal for clean smart cities.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-110', word: 'public amenity', ipa: '/ˈpʌb.lɪk əˈmiː.nə.ti/', pos: 'noun phrase', vietnamese: 'tiện ích công cộng', example: 'Modern public amenities include free fitness parks and digital libraries.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-111', word: 'connectivity', ipa: '/ˌkɒn.ekˈtɪv.ə.ti/', pos: 'noun', vietnamese: 'khả năng kết nối, tính kết nối', example: 'High-speed 5G networks ensure seamless connectivity across smart devices.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-112', word: 'recycling center', ipa: '/ˌriːˈsaɪ.klɪŋ ˈsen.tər/', pos: 'noun phrase', vietnamese: 'trung tâm tái chế', example: 'Automated recycling centers sort plastic and glass bottles efficiently.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-113', word: 'energy consumption', ipa: '/ˈen.ə.dʒi kənˈsʌmp.ʃən/', pos: 'noun phrase', vietnamese: 'sự tiêu thụ năng lượng', example: 'Smart thermostats optimize heating to reduce household energy consumption.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-114', word: 'noise pollution', ipa: '/nɔɪz pəˈluː.ʃən/', pos: 'noun phrase', vietnamese: 'ô nhiễm tiếng ồn', example: 'Electric trams help reduce urban noise pollution during evening hours.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-115', word: 'solar panel', ipa: '/ˈsəʊ.lər ˈpæn.əl/', pos: 'noun phrase', vietnamese: 'tấm pin năng lượng mặt trời', example: 'Installing solar panels on rooftops generates clean electricity for homes.', difficulty: 'easy', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-116', word: 'compact city', ipa: '/kəmˈpækt ˈsɪt.i/', pos: 'noun phrase', vietnamese: 'thành phố nén (nhỏ gọn, tiện lợi)', example: 'A compact city allows residents to walk to work within 15 minutes.', difficulty: 'hard', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-117', word: 'water treatment plant', ipa: '/ˈwɔː.tər ˈtriːt.mənt plɑːnt/', pos: 'noun phrase', vietnamese: 'nhà máy xử lý nước', example: 'Advanced water treatment plants recycle rainwater for park irrigation.', difficulty: 'medium', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-118', word: 'urban sprawl', ipa: '/ˈɜː.bən sprɔːl/', pos: 'noun phrase', vietnamese: 'sự dãn dân / phát triển đô thị tự phát', example: 'Controlled urban sprawl preserves surrounding agricultural countryside.', difficulty: 'hard', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-119', word: 'smart streetlight', ipa: '/smɑːt ˈstriːt.laɪt/', pos: 'noun phrase', vietnamese: 'đèn đường thông minh', example: 'Smart streetlights dim automatically when no pedestrians are nearby.', difficulty: 'easy', type: 'extended', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' },
  { id: 'u3-120', word: 'megacity', ipa: '/ˈmeɡ.ə.sɪt.i/', pos: 'noun', vietnamese: 'siêu đô thị (trên 10 triệu dân)', example: 'Managing public sanitation is a huge challenge in any modern megacity.', difficulty: 'medium', type: 'core', unit: 'unit3', sourceRef: 'Global Success 11 - Tờ số 09' }
];

// FULL 137 VERIFIED ITEMS FOR UNIT 4: ASEAN AND VIET NAM (TỜ SỐ 13)
const UNIT_4_VERIFIED_WORDS = [
  // Core Lexicon & Key Terms (u4-001 to u4-040)
  { id: 'u4-001', word: 'splash', ipa: '/splæʃ/', pos: 'verb / noun', vietnamese: 'bắn, tóe (nước); tiếng nước bắn', example: 'People splash water on each other to celebrate the New Year festival.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-002', word: 'monk', ipa: '/mʌŋk/', pos: 'noun', vietnamese: 'thầy tu, nhà sư', example: 'Buddhist monks walk through the village early in the morning.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-003', word: 'Buddhist', ipa: '/ˈbʊd.ɪst/', pos: 'noun / adjective', vietnamese: 'tín đồ Phật giáo; thuộc Phật giáo', example: 'Many Buddhist families visit pagodas during traditional holiday events.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-004', word: 'parade', ipa: '/pəˈreɪd/', pos: 'noun / verb', vietnamese: 'cuộc diễu hành; diễu hành', example: 'The colorful street parade attracted thousands of international tourists.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-005', word: 'prosperity', ipa: '/prɒsˈper.ə.ti/', pos: 'noun', vietnamese: 'sự thịnh vượng, phát đạt', example: 'Wishing everyone good health and prosperity in the coming year.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'prosperous', pos: 'adjective', meaning: 'thịnh vượng, phồn vinh' }, { word: 'prosper', pos: 'verb', meaning: 'phát triển, thịnh vượng' }] },
  { id: 'u4-006', word: 'ancestor', ipa: '/ˈæn.ses.tər/', pos: 'noun', vietnamese: 'ông bà, tổ tiên', example: 'Vietnamese people place fresh flowers on ancestral altars during Tet.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-007', word: 'honor', ipa: '/ˈɒn.ər/', pos: 'verb / noun', vietnamese: 'tôn vinh, kính trọng; danh dự', example: 'We celebrate cultural festivals to honor our traditional roots and history.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'honorable', pos: 'adjective', meaning: 'danh giá, đáng kính' }] },
  { id: 'u4-008', word: 'guest', ipa: '/ɡest/', pos: 'noun', vietnamese: 'khách, khách mời', example: 'Hosts offer warm hospitality and herbal tea to all welcomed guests.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-009', word: 'host', ipa: '/həʊst/', pos: 'noun / verb', vietnamese: 'chủ nhà; đăng cai, tổ chức', example: 'Viet Nam was proud to host the ASEAN Youth Leadership Summit.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-010', word: 'arrange', ipa: '/əˈreɪndʒ/', pos: 'verb', vietnamese: 'sắp xếp, sắp đặt', example: 'Organizers arrange cultural performance schedules for visiting delegates.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'arrangement', pos: 'noun', meaning: 'sự sắp xếp, thỏa thuận' }] },
  { id: 'u4-011', word: 'able', ipa: '/ˈeɪ.bəl/', pos: 'adjective', vietnamese: 'có năng lực, có thể', example: 'Young leaders are able to contribute innovative solutions to regional challenges.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'ability', pos: 'noun', meaning: 'khả năng, năng lực' }, { word: 'disable', pos: 'verb', meaning: 'làm tàn phế, vô hiệu' }, { word: 'disabled', pos: 'adjective', meaning: 'khuyết tật' }, { word: 'disability', pos: 'noun', meaning: 'sự khuyết tật' }] },
  { id: 'u4-012', word: 'represent', ipa: '/ˌrep.rɪˈzent/', pos: 'verb', vietnamese: 'đại diện cho, tượng trưng cho', example: 'Two students were chosen to represent Viet Nam at the ASEAN conference.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'representative', pos: 'noun / adjective', meaning: 'người đại diện; mang tính đại diện' }, { word: 'representation', pos: 'noun', meaning: 'sự đại diện' }] },
  { id: 'u4-013', word: 'feature', ipa: '/ˈfiː.tʃər/', pos: 'noun / verb', vietnamese: 'nét đặc trưng; có sự tham gia/mô tả', example: 'Traditional ASEAN music performances will feature prominent local singers.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-014', word: 'gender equality', ipa: '/ˈdʒen.dər iˈkwɒl.ə.ti/', pos: 'noun phrase', vietnamese: 'bình đẳng giới', example: 'Promoting gender equality is a fundamental objective across ASEAN nations.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-015', word: 'eye-opening', ipa: '/ˈaɪˌəʊ.pən.ɪŋ/', pos: 'adjective', vietnamese: 'mở rộng tầm mắt, ngạc nhiên thú vị', example: 'Attending the youth exchange program was an eye-opening cultural experience.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-016', word: 'participate', ipa: '/pɑːˈtɪs.ɪ.peɪt/', pos: 'verb', vietnamese: 'tham gia', example: 'Youth delegates from ten member states participate in workshop debates.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'participation', pos: 'noun', meaning: 'sự tham gia' }, { word: 'participant', pos: 'noun', meaning: 'người tham gia' }] },
  { id: 'u4-017', word: 'culture', ipa: '/ˈkʌl.tʃər/', pos: 'noun', vietnamese: 'văn hóa', example: 'Understanding Southeast Asian culture helps build mutual friendship.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'cultural', pos: 'adjective', meaning: 'thuộc về văn hóa' }, { word: 'culturally', pos: 'adverb', meaning: 'về mặt văn hóa' }] },
  { id: 'u4-018', word: 'relate', ipa: '/rɪˈleɪt/', pos: 'verb', vietnamese: 'liên quan, kết nối, tường thuật', example: 'Volunteers learn how issues in neighbor countries relate to their local community.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'relation', pos: 'noun', meaning: 'mối quan hệ' }, { word: 'relationship', pos: 'noun', meaning: 'mối quan hệ gắn kết' }, { word: 'relative', pos: 'noun / adjective', meaning: 'họ hàng; tương đối' }] },
  { id: 'u4-019', word: 'contribute', ipa: '/kənˈtrɪb.juːt/', pos: 'verb', vietnamese: 'đóng góp, cống hiến', example: 'Every member nation must contribute actively to maintaining regional peace.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'contribution', pos: 'noun', meaning: 'sự đóng góp' }, { word: 'contributor', pos: 'noun', meaning: 'người đóng góp' }] },
  { id: 'u4-020', word: 'leadership skill', ipa: '/ˈliː.də.ʃɪp skɪl/', pos: 'noun phrase', vietnamese: 'kỹ năng lãnh đạo', example: 'Youth workshops focus on cultivating communication and leadership skills.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-021', word: 'current issue', ipa: '/ˈkʌr.ənt ˈɪʃ.uː/', pos: 'noun phrase', vietnamese: 'vấn đề thời sự hiện nay', example: 'Delegates discussed current issues including climate change and economic development.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-022', word: 'cultural exchange', ipa: '/ˈkʌl.tʃər.əl ɪksˈtʃeɪndʒ/', pos: 'noun phrase', vietnamese: 'giao lưu văn hóa', example: 'Cultural exchange programs foster mutual understanding among young citizens.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-023', word: 'strong', ipa: '/strɒŋ/', pos: 'adjective', vietnamese: 'mạnh mẽ, kiên cố', example: 'The regional bloc seeks to build a strong economic foundation.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'strength', pos: 'noun', meaning: 'sức mạnh' }, { word: 'strengthen', pos: 'verb', meaning: 'củng cố, tăng cường' }] },
  { id: 'u4-024', word: 'goal', ipa: '/ɡəʊl/', pos: 'noun', vietnamese: 'mục tiêu, đích đến', example: 'Our primary goal is to promote sustainable economic development across ASEAN.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-025', word: 'theme', ipa: '/θiːm/', pos: 'noun', vietnamese: 'chủ đề, đề tài', example: 'The central theme of this year’s ASEAN forum is youth empowerment.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-026', word: 'community', ipa: '/kəˈmjuː.nə.ti/', pos: 'noun', vietnamese: 'cộng đồng', example: 'Building a united regional community benefits all member countries.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-027', word: 'develop', ipa: '/dɪˈvel.əp/', pos: 'verb', vietnamese: 'phát triển', example: 'Member states collaborate to develop green trade networks.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'development', pos: 'noun', meaning: 'sự phát triển' }, { word: 'developing', pos: 'adjective', meaning: 'đang phát triển' }, { word: 'developed', pos: 'adjective', meaning: 'đã phát triển' }] },
  { id: 'u4-028', word: 'volunteer', ipa: '/ˌvɒl.ənˈtɪər/', pos: 'noun / verb', vietnamese: 'tình nguyện viên; tình nguyện', example: 'Young volunteers helped organize logistics for the international festival.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'voluntary', pos: 'adjective', meaning: 'tự nguyện' }] },
  { id: 'u4-029', word: 'youth', ipa: '/juːθ/', pos: 'noun', vietnamese: 'thanh niên, tuổi trẻ', example: 'The ASEAN Youth Forum provides a platform for energetic young minds.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'youthful', pos: 'adjective', meaning: 'trẻ trung' }] },
  { id: 'u4-030', word: 'promote', ipa: '/prəˈməʊt/', pos: 'verb', vietnamese: 'thúc đẩy, quảng bá', example: 'Joint initiatives help promote regional tourism and cultural awareness.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'promotion', pos: 'noun', meaning: 'sự thăng tiến, sự quảng bá' }, { word: 'promotional', pos: 'adjective', meaning: 'mang tính quảng bá' }] },
  { id: 'u4-031', word: 'experience', ipa: '/ɪkˈspɪə.ri.əns/', pos: 'noun / verb', vietnamese: 'kinh nghiệm, trải nghiệm; trải qua', example: 'Volunteering abroad gives youth valuable life experience.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'experienced', pos: 'adjective', meaning: 'có kinh nghiệm' }] },
  { id: 'u4-032', word: 'qualified', ipa: '/ˈkwɒl.ɪ.faɪd/', pos: 'adjective', vietnamese: 'đủ năng lực, đủ trình độ', example: 'Only qualified candidates were invited to present their research.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'qualify', pos: 'verb', meaning: 'đủ điều kiện' }, { word: 'qualification', pos: 'noun', meaning: 'bằng cấp, trình độ' }] },
  { id: 'u4-033', word: 'propose', ipa: '/prəˈpəʊz/', pos: 'verb', vietnamese: 'đề xuất, kiến nghị', example: 'Delegates will propose new guidelines for cross-border student exchanges.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'proposal', pos: 'noun', meaning: 'sự đề xuất, bản đề án' }] },
  { id: 'u4-034', word: 'interview', ipa: '/ˈɪn.tə.vjuː/', pos: 'noun / verb', vietnamese: 'cuộc phỏng vấn; phỏng vấn', example: 'Applicants must pass an oral interview to secure the regional scholarship.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'interviewer', pos: 'noun', meaning: 'người phỏng vấn' }, { word: 'interviewee', pos: 'noun', meaning: 'người được phỏng vấn' }] },
  { id: 'u4-035', word: 'cover', ipa: '/ˈkʌv.ər/', pos: 'verb / noun', vietnamese: 'bao gồm, bao phủ, chi trả; vỏ bọc', example: 'The scholarship grant will cover all travel and accommodation expenses.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-036', word: 'dictionary', ipa: '/ˈdɪk.ʃən.ər.i/', pos: 'noun', vietnamese: 'từ điển', example: 'Students use bilingual dictionaries to translate Southeast Asian folk stories.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-037', word: 'peace', ipa: '/piːs/', pos: 'noun', vietnamese: 'hòa bình, sự yên bình', example: 'Maintaining regional peace and stability is a core commitment of ASEAN.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'peaceful', pos: 'adjective', meaning: 'hòa bình, yên bình' }, { word: 'peacefully', pos: 'adverb', meaning: 'một cách hòa bình' }] },
  { id: 'u4-038', word: 'aim', ipa: '/eɪm/', pos: 'noun / verb', vietnamese: 'mục đích; nhắm tới, hướng tới', example: 'The campaign aims to reduce plastic pollution in Southeast Asian seas.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-039', word: 'satisfy', ipa: '/ˈsæt.ɪs.faɪ/', pos: 'verb', vietnamese: 'làm hài lòng, đáp ứng', example: 'Candidates must satisfy all academic requirements to get admitted.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'satisfaction', pos: 'noun', meaning: 'sự hài lòng' }, { word: 'satisfied', pos: 'adjective', meaning: 'hài lòng' }, { word: 'satisfactory', pos: 'adjective', meaning: 'thỏa đáng' }] },
  { id: 'u4-040', word: 'region', ipa: '/ˈriː.dʒən/', pos: 'noun', vietnamese: 'vùng, khu vực', example: 'Southeast Asia is one of the fastest-growing economic regions globally.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'regional', pos: 'adjective', meaning: 'thuộc về khu vực' }] },
  { id: 'u4-041', word: 'apologize', ipa: '/əˈpɒl.ə.dʒaɪz/', pos: 'verb', vietnamese: 'xin lỗi', example: 'He apologized for arriving late at the international cultural reception.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'apology', pos: 'noun', meaning: 'lời xin lỗi' }] },
  { id: 'u4-042', word: 'desire', ipa: '/dɪˈzaɪər/', pos: 'noun / verb', vietnamese: 'khao khát, mong muốn', example: 'Young leaders share a strong desire to preserve their native heritage.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'desirable', pos: 'adjective', meaning: 'đáng khao khát' }] },
  { id: 'u4-043', word: 'scholarship', ipa: '/ˈskɒl.ə.ʃɪp/', pos: 'noun', vietnamese: 'học bổng', example: 'Winning an ASEAN student scholarship allowed her to study in Singapore.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-044', word: 'workshop', ipa: '/ˈwɜːk.ʃɒp/', pos: 'noun', vietnamese: 'hội thảo thực hành, buổi tập huấn', example: 'The leadership workshop equipped youth delegates with project planning skills.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-045', word: 'conference', ipa: '/ˈkɒn.fər.əns/', pos: 'noun', vietnamese: 'hội nghị', example: 'Ministers met at the annual ASEAN summit conference in Ha Noi.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-046', word: 'equality', ipa: '/iˈkwɒl.ə.ti/', pos: 'noun', vietnamese: 'sự bình đẳng', example: 'Social equality ensures equal access to educational resources for all youth.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'equal', pos: 'adjective / verb', meaning: 'bình đẳng / bằng với' }, { word: 'equally', pos: 'adverb', meaning: 'một cách bình đẳng' }] },
  { id: 'u4-047', word: 'necessary', ipa: '/ˈnes.ə.ser.i/', pos: 'adjective', vietnamese: 'cần thiết', example: 'Good communication skills are necessary when collaborating in multicultural teams.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'necessity', pos: 'noun', meaning: 'sự cần thiết' }, { word: 'necessarily', pos: 'adverb', meaning: 'chắc chắn, nhất thiết' }] },
  { id: 'u4-048', word: 'discussion', ipa: '/dɪˈskʌʃ.ən/', pos: 'noun', vietnamese: 'cuộc thảo luận, tranh luận', example: 'The group discussion generated creative ideas for regional youth projects.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'discuss', pos: 'verb', meaning: 'thảo luận' }] },
  { id: 'u4-049', word: 'fluently', ipa: '/ˈfluː.ənt.li/', pos: 'adverb', vietnamese: 'một cách lưu loát, trôi chảy', example: 'She speaks English fluently after spending two years in an exchange program.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'fluent', pos: 'adjective', meaning: 'lưu loát' }, { word: 'fluency', pos: 'noun', meaning: 'sự lưu loát' }] },
  { id: 'u4-050', word: 'approve', ipa: '/əˈpruːv/', pos: 'verb', vietnamese: 'tán thành, phê chuẩn', example: 'The council voted to approve the youth environment charter.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'approval', pos: 'noun', meaning: 'sự phê chuẩn' }] },
  { id: 'u4-051', word: 'recipient', ipa: '/rɪˈsɪp.i.ənt/', pos: 'noun', vietnamese: 'người nhận (học bổng, giải thưởng)', example: 'Scholarship recipients will be announced during the opening ceremony.', difficulty: 'hard', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'receive', pos: 'verb', meaning: 'nhận' }] },
  { id: 'u4-052', word: 'beneficial', ipa: '/ˌben.ɪˈfɪʃ.əl/', pos: 'adjective', vietnamese: 'có lợi, có ích', example: 'Youth exchange trips are highly beneficial for expanding global perspectives.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'benefit', pos: 'noun / verb', meaning: 'lợi ích / được lợi' }] },
  { id: 'u4-053', word: 'appreciate', ipa: '/əˈpriː.ʃi.eɪt/', pos: 'verb', vietnamese: 'trân trọng, đánh giá cao, cảm kích', example: 'We appreciate your dedication to supporting regional educational funds.', difficulty: 'medium', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'appreciation', pos: 'noun', meaning: 'sự trân trọng' }] },
  { id: 'u4-054', word: 'compliment', ipa: '/ˈkɒm.plɪ.mənt/', pos: 'noun / verb', vietnamese: 'lời khen; khen ngợi', example: 'The mentor gave a warm compliment on his fluent presentation.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-055', word: 'lunar calendar', ipa: '/ˈluː.nər ˈkæl.ən.dər/', pos: 'noun phrase', vietnamese: 'âm lịch', example: 'Traditional Asian holidays are celebrated according to the lunar calendar.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-056', word: 'decorate', ipa: '/ˈdek.ə.reɪt/', pos: 'verb', vietnamese: 'trang trí', example: 'Families decorate their houses with blossom flowers before Tet.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', wordFamily: [{ word: 'decoration', pos: 'noun', meaning: 'sự trang trí' }, { word: 'decorative', pos: 'adjective', meaning: 'dùng để trang trí' }] },
  { id: 'u4-057', word: 'firework', ipa: '/ˈfaɪə.wɜːk/', pos: 'noun', vietnamese: 'pháo hoa', example: 'Firework displays illuminate the night sky on New Year’s Eve.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-058', word: 'folk game', ipa: '/fəʊk ɡeɪm/', pos: 'noun phrase', vietnamese: 'trò chơi dân gian', example: 'Children enjoy playing traditional folk games during village festivals.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-059', word: 'stilt walking', ipa: '/stɪlt ˈwɔː.kɪŋ/', pos: 'noun phrase', vietnamese: 'đi cà kheo', example: 'Stilt walking requires balance and practice during festival parades.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-060', word: 'tug of war', ipa: '/ˌtʌɡ əv ˈwɔːr/', pos: 'noun phrase', vietnamese: 'trò kéo co', example: 'Tug of war is a popular competitive folk game at community gatherings.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-061', word: 'bamboo dancing', ipa: '/bæmˈbuː ˈdɑːn.sɪŋ/', pos: 'noun phrase', vietnamese: 'múa sạp (múa tre)', example: 'Dancers show remarkable agility in traditional bamboo dancing.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-062', word: 'arrangement', ipa: '/əˈreɪndʒ.mənt/', pos: 'noun', vietnamese: 'sự sắp xếp, thỏa thuận', example: 'The committee completed travel arrangements for visiting students.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-010' },
  { id: 'u4-063', word: 'ability', ipa: '/əˈbɪl.ə.ti/', pos: 'noun', vietnamese: 'khả năng, năng lực', example: 'Her natural leadership ability gained praise from team members.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-011' },
  { id: 'u4-064', word: 'disable', ipa: '/dɪsˈeɪ.bəl/', pos: 'verb', vietnamese: 'làm tàn phế, vô hiệu hóa', example: 'Technical faults can temporarily disable online application portals.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-011' },
  { id: 'u4-065', word: 'disabled', ipa: '/dɪsˈeɪ.bəld/', pos: 'adjective', vietnamese: 'khuyết tật', example: 'Community programs provide specialized vocational training for disabled youth.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-011' },
  { id: 'u4-066', word: 'disability', ipa: '/ˌdɪs.əˈbɪl.ə.ti/', pos: 'noun', vietnamese: 'sự khuyết tật', example: 'Promoting equal access for people with disabilities builds an inclusive society.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-011' },
  { id: 'u4-067', word: 'representative', ipa: '/ˌrep.rɪˈzen.tə.tɪv/', pos: 'noun / adjective', vietnamese: 'người đại diện; mang tính tiêu biểu', example: 'Each country sent two representatives to the ASEAN Youth Assembly.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-012' },
  { id: 'u4-068', word: 'participation', ipa: '/pɑːˌtɪs.ɪˈpeɪ.ʃən/', pos: 'noun', vietnamese: 'sự tham gia', example: 'Active youth participation strengthens community volunteer initiatives.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-016' },
  { id: 'u4-069', word: 'participant', ipa: '/pɑːˈtɪs.ɪ.pənt/', pos: 'noun', vietnamese: 'người tham gia', example: 'All workshop participants received certificates of completion.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-016' },
  { id: 'u4-070', word: 'cultural', ipa: '/ˈkʌl.tʃər.əl/', pos: 'adjective', vietnamese: 'thuộc về văn hóa', example: 'Cultural heritage preserves history for future generations.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-017' },
  { id: 'u4-071', word: 'relation', ipa: '/rɪˈleɪ.ʃən/', pos: 'noun', vietnamese: 'mối quan hệ, sự liên quan', example: 'Diplomatic relations between member states continue to grow stronger.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-018' },
  { id: 'u4-072', word: 'relationship', ipa: '/rɪˈleɪ.ʃən.ʃɪp/', pos: 'noun', vietnamese: 'mối quan hệ tình cảm / xã hội', example: 'Strong youth friendships foster good relationships among neighboring countries.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-018' },
  { id: 'u4-073', word: 'contribution', ipa: '/ˌkɒn.trɪˈbjuː.ʃən/', pos: 'noun', vietnamese: 'sự đóng góp, cống hiến', example: 'Her outstanding contribution to youth development was recognized with an award.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-019' },
  { id: 'u4-074', word: 'strengthen', ipa: '/ˈstreŋ.θən/', pos: 'verb', vietnamese: 'củng cố, tăng cường', example: 'Regional sports events help strengthen solidarity among ASEAN youth.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-023' },
  { id: 'u4-075', word: 'development', ipa: '/dɪˈvel.əp.mənt/', pos: 'noun', vietnamese: 'sự phát triển', example: 'Sustainable urban development balances economic goals with green protection.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-027' },
  { id: 'u4-076', word: 'developing', ipa: '/dɪˈvel.ə.pɪŋ/', pos: 'adjective', vietnamese: 'đang phát triển (kinh tế)', example: 'Developing nations benefit from ASEAN technical support programs.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-027' },
  { id: 'u4-077', word: 'developed', ipa: '/dɪˈvel.əpt/', pos: 'adjective', vietnamese: 'đã phát triển, tiên tiến', example: 'Developed economies share technological expertise with neighboring countries.', difficulty: 'easy', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-027' },
  { id: 'u4-078', word: 'promotion', ipa: '/prəˈməʊ.ʃən/', pos: 'noun', vietnamese: 'sự thúc đẩy, quảng bá', example: 'The promotion of eco-tourism creates jobs for local villagers.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-030' },
  { id: 'u4-079', word: 'proposal', ipa: '/prəˈpəʊ.zəl/', pos: 'noun', vietnamese: 'sự đề xuất, bản kiến nghị', example: 'The committee accepted the student proposal for a green campus campaign.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-033' },
  { id: 'u4-080', word: 'prosperous', ipa: '/ˈprɒs.pər.əs/', pos: 'adjective', vietnamese: 'thịnh vượng, phồn vinh', example: 'Working together creates a peaceful and prosperous Southeast Asia.', difficulty: 'medium', type: 'word_family', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', parentWordId: 'u4-005' },
  { id: 'u4-081', word: 'reply to', ipa: '/rɪˈplaɪ tuː/', pos: 'phrasal verb', vietnamese: 'trả lời, phản hồi', example: 'Please reply to the invitation email before Friday afternoon.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-082', word: 'invite sb to do', ipa: '/ɪnˈvaɪt tuː duː/', pos: 'structure', vietnamese: 'mời ai làm việc gì', example: 'Organizers invited youth leaders to share their community projects.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-083', word: 'take part in', ipa: '/teɪk pɑːt ɪn/', pos: 'phrasal verb', vietnamese: 'tham gia vào', example: 'Hundreds of students take part in the annual ASEAN cultural run.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', synonyms: ['participate in'] },
  { id: 'u4-084', word: 'participate in', ipa: '/pɑːˈtɪs.ɪ.peɪt ɪn/', pos: 'phrasal verb', vietnamese: 'tham gia vào', example: 'Delegates participate in lively round-table discussions on environmental policy.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13', synonyms: ['take part in'] },
  { id: 'u4-085', word: 'take place in', ipa: '/teɪk pleɪs ɪn/', pos: 'phrasal verb', vietnamese: 'diễn ra tại', example: 'The regional youth games will take place in Ha Noi next November.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-086', word: 'prepare for', ipa: '/prɪˈpeər fɔːr/', pos: 'phrasal verb', vietnamese: 'chuẩn bị cho', example: 'Students spend weeks preparing for the international debate competition.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-087', word: 'be qualified for', ipa: '/biː ˈkwɒl.ɪ.faɪd fɔːr/', pos: 'collocation', vietnamese: 'đủ điều kiện / trình độ cho', example: 'She is fully qualified for the youth ambassador role.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-088', word: 'depend on', ipa: '/dɪˈpend ɒn/', pos: 'phrasal verb', vietnamese: 'phụ thuộc vào', example: 'Regional economic prosperity depends on mutual trade cooperation.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-089', word: 'be related to', ipa: '/biː rɪˈleɪ.tɪd tuː/', pos: 'collocation', vietnamese: 'có liên quan đến', example: 'Many environmental issues are closely related to rapid industrial growth.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-090', word: 'be keen on doing', ipa: '/biː kiːn ɒn ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'hăng hái / thích làm việc gì', example: 'Young volunteers are keen on organizing community clean-up days.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-091', word: 'set a goal', ipa: '/set ə ɡəʊl/', pos: 'collocation', vietnamese: 'đặt ra mục tiêu', example: 'Each delegation must set a clear goal for their community action plan.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-092', word: 'achieve a goal', ipa: '/əˈtʃiːv ə ɡəʊl/', pos: 'collocation', vietnamese: 'đạt được mục tiêu', example: 'Working together helps ASEAN member states achieve their shared goals.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-093', word: 'share sth with sb', ipa: '/ʃeər wɪð/', pos: 'structure', vietnamese: 'chia sẻ cái gì với ai', example: 'Participants share creative project ideas with fellow delegates.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-094', word: 'mind doing sth', ipa: '/maɪnd ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'phiền / ngại làm việc gì', example: 'Would you mind helping us set up the cultural exhibition booths?', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-095', word: 'involve doing sth', ipa: '/ɪnˈvɒlv ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'bao gồm / đòi hỏi làm việc gì', example: 'Organizing the conference involves coordinating travel for fifty guests.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-096', word: 'suggest doing sth', ipa: '/səˈdʒest ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'gợi ý / đề xuất làm việc gì', example: 'The mentor suggested holding an online pre-conference orientation.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-097', word: 'succeed in doing sth', ipa: '/səkˈsiːd ɪn ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'thành công trong việc gì', example: 'Viet Nam succeeded in hosting a memorable ASEAN summit.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-098', word: 'raise awareness of', ipa: '/reɪz əˈweə.nəs ɒv/', pos: 'collocation', vietnamese: 'nâng cao nhận thức về', example: 'Youth workshops raise awareness of wildlife protection across ASEAN.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-099', word: 'in a variety of', ipa: '/ɪn ə vəˈraɪ.ə.ti ɒv/', pos: 'idiom / phrase', vietnamese: 'trong đa dạng các...', example: 'Youth delegates participate in a variety of cultural and athletic activities.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-100', word: 'look for', ipa: '/lʊk fɔːr/', pos: 'phrasal verb', vietnamese: 'tìm kiếm', example: 'Organizers are looking for enthusiastic youth volunteers for the festival.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-101', word: 'put out a call for', ipa: '/pʊt aʊt ə kɔːl fɔːr/', pos: 'collocation', vietnamese: 'phát động lời kêu gọi cho', example: 'The ASEAN Secretariat put out a call for youth innovation grants.', difficulty: 'hard', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-102', word: 'make arrangements for', ipa: '/meɪk əˈreɪndʒ.mənts fɔːr/', pos: 'collocation', vietnamese: 'thu xếp / chuẩn bị cho', example: 'Volunteers made ground transportation arrangements for international delegates.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-103', word: 'be beneficial to', ipa: '/biː ˌben.ɪˈfɪʃ.əl tuː/', pos: 'collocation', vietnamese: 'có lợi / có ích cho', example: 'Bilingual education programs are beneficial to young ASEAN job seekers.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-104', word: 'besides doing sth', ipa: '/bɪˈsaɪdz ˈduː.ɪŋ/', pos: 'structure', vietnamese: 'bên cạnh việc làm gì', example: 'Besides attending main lectures, students took part in interactive workshops.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-105', word: 'scare away', ipa: '/skeər əˈweɪ/', pos: 'phrasal verb', vietnamese: 'xua đuổi, làm cho khiếp sợ bỏ đi', example: 'Traditional noisy firework customs were believed to scare away bad fortune.', difficulty: 'medium', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-106', word: 'get together with', ipa: '/ɡet təˈɡeð.ər wɪð/', pos: 'phrasal verb', vietnamese: 'tụ họp, xum vầy với', example: 'Families get together with relatives to enjoy Tet holiday meals.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-107', word: 'show respect for', ipa: '/ʃəʊ rɪˈspekt fɔːr/', pos: 'collocation', vietnamese: 'bày tỏ sự tôn trọng đối với', example: 'Younger family members show respect for elders by offering formal greetings.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-108', word: 'wash away', ipa: '/wɒʃ əˈweɪ/', pos: 'phrasal verb', vietnamese: 'gột rửa, rửa sạch đi', example: 'Splashing water during Songkran symbolizes washing away past bad luck.', difficulty: 'easy', type: 'phrasal_verb', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-109', word: 'be excited about', ipa: '/biː ɪkˈsaɪ.tɪd əˈbaʊt/', pos: 'collocation', vietnamese: 'hào hứng / phấn khích về', example: 'Students are excited about taking part in the regional youth exchange program.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-110', word: 'ASEAN member state', ipa: '/ˈæs.i.æn ˈmem.bər steɪt/', pos: 'noun phrase', vietnamese: 'quốc gia thành viên ASEAN', example: 'Ten ASEAN member states collaborate closely on economic and cultural policy.', difficulty: 'easy', type: 'core', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-111', word: 'regional solidarity', ipa: '/ˈriː.dʒən.əl ˌsɒl.ɪˈdær.ə.ti/', pos: 'noun phrase', vietnamese: 'tinh thần đoàn kết khu vực', example: 'Youth exchange camps build long-lasting regional solidarity.', difficulty: 'hard', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-112', word: 'economic integration', ipa: '/ˌiː.kəˈnɒm.ɪk ˌɪn.tɪˈɡreɪ.ʃən/', pos: 'noun phrase', vietnamese: 'hội nhập kinh tế', example: 'ASEAN economic integration lowers tariffs and supports regional business.', difficulty: 'hard', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-113', word: 'youth ambassador', ipa: '/juːθ æmˈbæs.ə.dər/', pos: 'noun phrase', vietnamese: 'đại sứ thanh niên', example: 'Youth ambassadors promote ASEAN cultural identity in their home schools.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-114', word: 'cultural diversity', ipa: '/ˈkʌl.tʃər.əl daɪˈvɜː.sə.ti/', pos: 'noun phrase', vietnamese: 'sự đa dạng văn hóa', example: 'Celebrating cultural diversity builds a harmonious Southeast Asian community.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-115', word: 'sustainable development goals', ipa: '/səˈsteɪ.nə.bəl dɪˈvel.əp.mənt ɡəʊlz/', pos: 'noun phrase', vietnamese: 'các mục tiêu phát triển bền vững', example: 'Youth groups formulate initiatives aligned with sustainable development goals.', difficulty: 'hard', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-116', word: 'peace and stability', ipa: '/piːs ænd stəˈbɪl.ə.ti/', pos: 'noun phrase', vietnamese: 'hòa bình và sự ổn định', example: 'Cooperation brings long-term peace and stability to Southeast Asia.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-117', word: 'volunteer project', ipa: '/ˌvɒl.ənˈtɪər ˈprɒdʒ.ekt/', pos: 'noun phrase', vietnamese: 'dự án tình nguyện', example: 'Students participated in a rural volunteer project building community centers.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-118', word: 'cultural identity', ipa: '/ˈkʌl.tʃər.əl aɪˈden.tə.ti/', pos: 'noun phrase', vietnamese: 'bản sắc văn hóa', example: 'Maintaining native language and customs preserves national cultural identity.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-119', word: 'diplomatic relations', ipa: '/ˌdɪp.ləˈmæt.ɪk rɪˈleɪ.ʃənz/', pos: 'noun phrase', vietnamese: 'quan hệ ngoại giao', example: 'Viet Nam established strong diplomatic relations with ASEAN neighbors in 1995.', difficulty: 'hard', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-120', word: 'host nation', ipa: '/həʊst ˈneɪ.ʃən/', pos: 'noun phrase', vietnamese: 'quốc gia đăng cai', example: 'As the host nation, Singapore provided excellent facilities for delegates.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-121', word: 'opening ceremony', ipa: '/ˈəʊ.pən.ɪŋ ˈser.ɪ.mə.ni/', pos: 'noun phrase', vietnamese: 'lễ khai mạc', example: 'The opening ceremony featured traditional dances from ten nations.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-122', word: 'closing ceremony', ipa: '/ˈkləʊ.zɪŋ ˈser.ɪ.mə.ni/', pos: 'noun phrase', vietnamese: 'lễ bế mạc', example: 'Delegates exchanged souvenirs during the emotional closing ceremony.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-123', word: 'youth leadership forum', ipa: '/juːθ ˈliː.də.ʃɪp ˈfɔː.rəm/', pos: 'noun phrase', vietnamese: 'diễn đàn lãnh đạo trẻ', example: 'The youth leadership forum empowers young delegates to pitch civic ideas.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-124', word: 'cross-cultural communication', ipa: '/krɒs ˈkʌl.tʃər.əl kəˌmjuː.nɪˈkeɪ.ʃən/', pos: 'noun phrase', vietnamese: 'giao tiếp liên văn hóa', example: 'Mastering cross-cultural communication prevents misunderstandings in global teams.', difficulty: 'hard', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-125', word: 'regional cooperation', ipa: '/ˈriː.dʒən.əl kəʊˌɒp.ərˈeɪ.ʃən/', pos: 'noun phrase', vietnamese: 'hợp tác khu vực', example: 'Regional cooperation plays a crucial role in managing marine ecosystems.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-126', word: 'charity campaign', ipa: '/ˈtʃær.ə.ti kæmˈpeɪn/', pos: 'noun phrase', vietnamese: 'chiến dịch từ thiện', example: 'The youth charity campaign collected books for underprivileged village schools.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-127', word: 'community service', ipa: '/kəˈmjuː.nə.ti ˈsɜː.vɪs/', pos: 'noun phrase', vietnamese: 'phục vụ cộng đồng', example: 'High school students complete 20 hours of mandatory community service.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-128', word: 'shared values', ipa: '/ʃeəd ˈvæl.juːz/', pos: 'noun phrase', vietnamese: 'các giá trị chung', example: 'Respect, peace, and mutual aid are core shared values in Southeast Asia.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-129', word: 'apply for a scholarship', ipa: '/əˈplaɪ fɔːr ə ˈskɒl.ə.ʃɪp/', pos: 'collocation', vietnamese: 'nộp đơn xin học bổng', example: 'She spent weeks preparing certificates to apply for a scholarship in Japan.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-130', word: 'deliver a speech', ipa: '/dɪˈlɪv.ər ə spiːtʃ/', pos: 'collocation', vietnamese: 'phát biểu / đọc diễn văn', example: 'The Vietnamese youth representative delivered an inspiring speech at the summit.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-131', word: 'foster friendship', ipa: '/ˈfɒs.tər ˈfrend.ʃɪp/', pos: 'collocation', vietnamese: 'vun đắp / thắt chặt tình bản', example: 'Joint athletic games help foster friendship among young athletes.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-132', word: 'preserve heritage', ipa: '/prɪˈzɜːv ˈher.ɪ.tɪdʒ/', pos: 'collocation', vietnamese: 'bảo tồn di sản', example: 'Local communities work hard to preserve traditional folk art and songs.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-133', word: 'gain experience', ipa: '/ɡeɪn ɪkˈspɪə.ri.əns/', pos: 'collocation', vietnamese: 'tích lũy kinh nghiệm', example: 'Volunteering with international teams helps youth gain practical workplace experience.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-134', word: 'promote peace', ipa: '/prəˈməʊt piːs/', pos: 'collocation', vietnamese: 'thúc đẩy hòa bình', example: 'Educational exchange programs play a key role in promoting peace.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-135', word: 'build solidarity', ipa: '/bɪld ˌsɒl.ɪˈdær.ə.ti/', pos: 'collocation', vietnamese: 'xây dựng tinh thần đoàn kết', example: 'Cultural festivals build solidarity among youth across Southeast Asia.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-136', word: 'exchange ideas', ipa: '/ɪksˈtʃeɪndʒ aɪˈdɪəz/', pos: 'collocation', vietnamese: 'trao đổi ý tưởng', example: 'Youth workshops provide a friendly environment to exchange ideas.', difficulty: 'easy', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' },
  { id: 'u4-137', word: 'broaden horizon', ipa: '/ˈbrɔː.dən həˈraɪ.zən/', pos: 'collocation', vietnamese: 'mở rộng tầm mắt / hiểu biết', example: 'Traveling and studying abroad help broaden your cultural horizons.', difficulty: 'medium', type: 'extended', unit: 'unit4', sourceRef: 'Global Success 11 - Tờ số 13' }
];

// COMBINED VOCABULARY DATASETS
const VOCABULARY_DATASETS = {
  unit1: UNIT_1_VERIFIED_WORDS,
  unit2: UNIT_2_VERIFIED_WORDS,
  unit3: UNIT_3_VERIFIED_WORDS,
  unit4: UNIT_4_VERIFIED_WORDS
};

// TRANSLATIONS DICTIONARY
const TRANSLATIONS = {
  vi: {
    appName: 'English Success 11',
    subtitle: 'Ứng dụng tự học Tiếng Anh 11 - Curriculum Global Success',
    navVocab: 'Từ vựng (Vocab Lab)',
    navGrammar: 'Ngữ pháp (Grammar)',
    navExam: 'Luyện thi (Exam)',
    navGames: 'Trò chơi (Games)',
    navMistakes: 'Sổ tay lỗi sai',
    wordsMastered: 'Từ đã thuộc',
    practiceAccuracy: 'Độ chính xác',
    mistakesCount: 'Cần ôn lại',
    selectUnit: 'Chọn bài học',
    unit1Title: 'Bài 1: Sống lâu và khỏe mạnh',
    unit2Title: 'Bài 2: Khoảng cách thế hệ',
    unit3Title: 'Bài 3: Thành phố tương lai',
    unit4Title: 'Bài 4: ASEAN và Việt Nam',
    modesTitle: 'Chế độ rèn luyện',
    modeFlashcard: 'Thẻ ghi nhớ',
    modeMCQ: 'Trắc nghiệm nghĩa',
    modeFormation: 'Dạng của từ',
    modeSpelling: 'Chính tả',
    modeMatching: 'Ghép từ',
    flipCard: 'Nhấn để lật thẻ',
    knowIt: 'Đã thuộc',
    needReview: 'Cần học lại',
    checkAnswer: 'Kiểm tra đáp án',
    nextQuestion: 'Câu tiếp theo',
    correct: 'Chính xác! Rất tốt.',
    incorrect: 'Chưa chính xác. Hãy cố gắng hơn!',
    explanation: 'Giải thích chi tiết:',
    collocations: 'Cụm từ hay gặp (Collocations):',
    typeYourAnswer: 'Nhập từ tiếng Anh...',
    missingLetter: 'Gõ từ tiếng Anh tương ứng với nghĩa:',
    backupData: 'Sao lưu dữ liệu',
    exportBackup: 'Xuất tệp tiến độ (JSON)',
    importBackup: 'Nhập tệp tiến độ',
    noMistakes: 'Chúc mừng An! Bạn không có câu hỏi nào bị sai.',
    filterAll: 'Tất cả từ',
    filterLearning: 'Đang học',
    filterMastered: 'Đã thuộc',
    filterReview: 'Cần ôn lại',
    xpPoints: 'Điểm kinh nghiệm (XP)',
    streakDays: 'Chuỗi học tập'
  },
  en: {
    appName: 'English Success 11',
    subtitle: 'Grade 11 English Self-Study App (Global Success)',
    navVocab: 'Vocabulary Lab',
    navGrammar: 'Grammar Lab',
    navExam: 'Exam Practice',
    navGames: 'Mini Games',
    navMistakes: 'Mistake Notebook',
    wordsMastered: 'Mastered Words',
    practiceAccuracy: 'Accuracy Rate',
    mistakesCount: 'Words to Review',
    selectUnit: 'Select Unit',
    unit1Title: 'Unit 1: A Long and Healthy Life',
    unit2Title: 'Unit 2: The Generation Gap',
    unit3Title: 'Unit 3: Cities of the Future',
    unit4Title: 'Unit 4: ASEAN and Viet Nam',
    modesTitle: 'Practice Modes',
    modeFlashcard: 'Flashcards',
    modeMCQ: 'Multiple Choice',
    modeFormation: 'Word Formation',
    modeSpelling: 'Spelling Challenge',
    modeMatching: 'Word Matching',
    flipCard: 'Click/Tap to flip card',
    knowIt: 'I Know This',
    needReview: 'Needs Practice',
    checkAnswer: 'Check Answer',
    nextQuestion: 'Next Word',
    correct: 'Excellent! Correct answer.',
    incorrect: 'Not quite. Keep going!',
    explanation: 'Explanation:',
    collocations: 'Common Collocations:',
    typeYourAnswer: 'Type English word...',
    missingLetter: 'Type the matching English word:',
    backupData: 'Data Backup',
    exportBackup: 'Export Backup (JSON)',
    importBackup: 'Import Progress',
    noMistakes: 'Great job An! You have no saved mistakes.',
    filterAll: 'All Words',
    filterLearning: 'Learning',
    filterMastered: 'Mastered',
    filterReview: 'Review Needed',
    xpPoints: 'Experience Points',
    streakDays: 'Daily Streak'
  }
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [lang, setLang] = useState('vi');
  const [activeTab, setActiveTab] = useState('vocab');
  const [selectedUnitId, setSelectedUnitId] = useState('unit1');
  const [learningMode, setLearningMode] = useState('flashcard');
  const [filterState, setFilterState] = useState('all');

  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('es11_student_an_progress');
      if (saved) {
        const parsed = normalizeProgress(JSON.parse(saved));
        const idMap = { 'u1-036': 'u1-017', 'u2-040': 'u2-010' };
        return {...parsed, masteredWords: [...new Set(parsed.masteredWords.map(id=>idMap[id] || id))], mistakesNotebook: parsed.mistakesNotebook.map(m=>({...m, wordId:idMap[m.wordId] || m.wordId}))};
      }
    } catch (e) {
      console.warn("LocalStorage restricted in frame environment.");
    }
    return {
      masteredWords: [],
      reviewWords: [],
      mistakesNotebook: [],
      xp: 120,
      streak: 3
    };
  });

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('es11_student_an_progress', JSON.stringify(userProgress));
    } catch (e) {
      // Ignore fallback limits
    }
  }, [userProgress]);

  const t = TRANSLATIONS[lang];
  const activeUnitWords = VOCABULARY_DATASETS[selectedUnitId] || VOCABULARY_DATASETS.unit1;

  const totalWords = activeUnitWords.length;
  const masteredCount = activeUnitWords.filter(w => userProgress.masteredWords.includes(w.id)).length;
  const reviewCount = userProgress.mistakesNotebook.length;

  const toggleLang = () => setLang(prev => prev === 'vi' ? 'en' : 'vi');

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({...userProgress, practiceHistory:loadHistory()}, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `es11_an_progress_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (event) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && typeof parsed === 'object') {
            setUserProgress(normalizeProgress(parsed));
            if (parsed.practiceHistory?.version === 1) saveHistory(normalizeHistory(parsed.practiceHistory));
          }
        } catch (error) {
          console.error("Invalid JSON file");
        }
      };
    }
  };

  const getUnitDisplayTitle = () => {
    if (selectedUnitId === 'unit1') return t.unit1Title;
    if (selectedUnitId === 'unit2') return t.unit2Title;
    if (selectedUnitId === 'unit3') return t.unit3Title;
    if (selectedUnitId === 'unit4') return t.unit4Title;
    return t.unit1Title;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 text-white p-2.5 rounded-2xl shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-teal-700 to-sky-600 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Student An
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-700">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{userProgress.streak} {lang === 'vi' ? 'ngày' : 'days'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
              <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>{userProgress.xp} XP</span>
            </div>

            <button
              onClick={toggleLang}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Languages className="w-4 h-4 text-sky-600" />
              <span className="uppercase">{lang}</span>
            </button>
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS */}
        <nav className="bg-white border-t border-slate-100 px-4 overflow-x-auto scrollbar-none">
          <div className="max-w-6xl mx-auto flex space-x-2 py-2">
            <NavTab 
              active={activeTab === 'vocab'} 
              onClick={() => setActiveTab('vocab')}
              icon={<BookOpen className="w-4 h-4" />}
              label={t.navVocab}
            />
            <NavTab 
              active={activeTab === 'grammar'} 
              onClick={() => setActiveTab('grammar')}
              icon={<Brain className="w-4 h-4" />}
              label={t.navGrammar}
            />
            <NavTab 
              active={activeTab === 'exam'} 
              onClick={() => setActiveTab('exam')}
              icon={<FileText className="w-4 h-4" />}
              label={t.navExam}
            />
            <NavTab 
              active={activeTab === 'games'} 
              onClick={() => setActiveTab('games')}
              icon={<Gamepad2 className="w-4 h-4" />}
              label={t.navGames}
            />
            <NavTab 
              active={activeTab === 'mistakes'} 
              onClick={() => setActiveTab('mistakes')}
              icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
              label={t.navMistakes}
              count={reviewCount}
            />
          </div>
        </nav>
      </header>

      {/* DASHBOARD STATS BANNER */}
      <section className="bg-gradient-to-r from-teal-700 via-emerald-600 to-sky-700 text-white py-5 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
            <div className="text-xs text-teal-100 font-medium mb-1">{t.wordsMastered}</div>
            <div className="text-2xl font-black flex items-center justify-between">
              <span>{masteredCount} / {totalWords}</span>
              <BookmarkCheck className="w-6 h-6 text-emerald-200 opacity-90" />
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalWords > 0 ? (masteredCount / totalWords) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
            <div className="text-xs text-sky-100 font-medium mb-1">Active Unit</div>
            <div className="text-lg font-bold truncate">
              {selectedUnitId === 'unit1' && 'Unit 1: Healthy Life'}
              {selectedUnitId === 'unit2' && 'Unit 2: Generation Gap'}
              {selectedUnitId === 'unit3' && 'Unit 3: Future Cities'}
              {selectedUnitId === 'unit4' && 'Unit 4: ASEAN & Viet Nam'}
            </div>
            <div className="text-xs text-teal-200 mt-1 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Global Success 11</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
            <div className="text-xs text-amber-100 font-medium mb-1">{t.mistakesCount}</div>
            <div className="text-2xl font-black flex items-center justify-between">
              <span>{reviewCount}</span>
              <AlertCircle className="w-6 h-6 text-amber-300 opacity-90" />
            </div>
            <p className="text-[10px] text-amber-100 mt-1">Saved in LocalStorage</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex flex-col justify-between">
            <div className="text-xs text-teal-100 font-medium">{t.backupData}</div>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={handleExportBackup} 
                className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <label 
                className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full">
        {activeTab !== 'vocab' && activeTab !== 'mistakes' && <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Chọn Unit">{Object.keys(VOCABULARY_DATASETS).map((id,i)=><button key={id} aria-pressed={id===selectedUnitId} onClick={()=>setSelectedUnitId(id)} className={`rounded-xl px-4 py-2 text-sm font-bold border ${id===selectedUnitId ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-teal-50'}`}>Unit {i+1}</button>)}</div>}

        {activeTab === 'vocab' && (
          <VocabLabView 
            lang={lang}
            t={t}
            learningMode={learningMode}
            setLearningMode={setLearningMode}
            filterState={filterState}
            setFilterState={setFilterState}
            selectedUnitId={selectedUnitId}
            setSelectedUnitId={setSelectedUnitId}
            activeUnitWords={activeUnitWords}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            speakWord={speakWord}
            unitDisplayTitle={getUnitDisplayTitle()}
          />
        )}

        {activeTab === 'mistakes' && (
          <MistakesNotebookView 
            lang={lang}
            t={t}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            speakWord={speakWord}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarLabView key={selectedUnitId} 
            lang={lang}
            selectedUnitId={selectedUnitId}
            setUserProgress={setUserProgress}
          />
        )}

        {activeTab === 'exam' && (
          <ExamPracticeView key={selectedUnitId} 
            lang={lang}
            selectedUnitId={selectedUnitId}
            setUserProgress={setUserProgress}
          />
        )}

        {activeTab === 'games' && (
          <MiniGamesView key={selectedUnitId} 
            lang={lang}
            activeUnitWords={activeUnitWords}
            setUserProgress={setUserProgress}
            speakWord={speakWord}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p>English Success 11 • Interactive Practice Edition for Grade 11 Student An</p>
        <p className="mt-1 text-slate-400">Curriculum Source: Global Success Grade 11 (Tờ 01, Tờ 05, Tờ 09, Tờ 13)</p>
      </footer>
    </div>
  );
}

// NAV TAB COMPONENT
function NavTab({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
        active 
          ? 'bg-teal-600 text-white shadow-md' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full font-extrabold">
          {count}
        </span>
      )}
    </button>
  );
}

// VOCABULARY LAB MAIN VIEW
function VocabLabView({ 
  lang, t, learningMode, setLearningMode, 
  filterState, setFilterState, selectedUnitId, setSelectedUnitId,
  activeUnitWords, userProgress, setUserProgress, speakWord, unitDisplayTitle 
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const filteredWords = useMemo(() => {
    return activeUnitWords.filter(w => {
      const isMastered = userProgress.masteredWords.includes(w.id);
      const isMistake = userProgress.mistakesNotebook.some(m => m.wordId === w.id);
      if (filterState === 'mastered') return isMastered;
      if (filterState === 'learning') return !isMastered;
      if (filterState === 'review') return isMistake;
      return true;
    });
  }, [activeUnitWords, userProgress, filterState]);

  useEffect(() => {
    setCurrentWordIndex(0);
  }, [filterState, learningMode, selectedUnitId]);

  const currentWord = filteredWords[currentWordIndex] || filteredWords[0] || activeUnitWords[0];

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setCurrentWordIndex(randomIndex);
  };

  return (
    <div className="space-y-6">
      {/* UNIT SELECTOR BANNER */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-extrabold bg-teal-100 text-teal-800 px-3 py-1 rounded-lg">
              {selectedUnitId.toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Verified Source Document
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            {unitDisplayTitle}
          </h2>
        </div>

        {/* UNIT QUICK PICKER */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setSelectedUnitId('unit1')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedUnitId === 'unit1' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unit 1 ({VOCABULARY_DATASETS.unit1.length})
          </button>
          <button 
            onClick={() => setSelectedUnitId('unit2')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedUnitId === 'unit2' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unit 2 ({VOCABULARY_DATASETS.unit2.length})
          </button>
          <button 
            onClick={() => setSelectedUnitId('unit3')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedUnitId === 'unit3' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unit 3 ({VOCABULARY_DATASETS.unit3.length})
          </button>
          <button 
            onClick={() => setSelectedUnitId('unit4')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedUnitId === 'unit4' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unit 4 ({VOCABULARY_DATASETS.unit4.length})
          </button>
        </div>
      </div>

      {/* LEARNING MODE & FILTER CONTROLS */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* MODES */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setLearningMode('flashcard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              learningMode === 'flashcard' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.modeFlashcard}</span>
          </button>
          <button
            onClick={() => setLearningMode('mcq')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              learningMode === 'mcq' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.modeMCQ}</span>
          </button>
          <button
            onClick={() => setLearningMode('spelling')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              learningMode === 'spelling' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modeSpelling}</span>
          </button>
          <button
            onClick={() => setLearningMode('matching')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              learningMode === 'matching' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t.modeMatching}</span>
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterState('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${filterState === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              {t.filterAll} ({activeUnitWords.length})
            </button>
            <button
              onClick={() => setFilterState('learning')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${filterState === 'learning' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              {t.filterLearning}
            </button>
            <button
              onClick={() => setFilterState('mastered')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${filterState === 'mastered' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              {t.filterMastered}
            </button>
          </div>
        </div>
      </div>

      {/* PRACTICE MODE CARD WRAPPER */}
      {filteredWords.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <BookmarkCheck className="w-12 h-12 text-teal-500 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-800">Không có từ vựng nào trong bộ lọc này</h3>
          <p className="text-xs text-slate-500">Hãy chọn "Tất cả từ" để tiếp tục học tập.</p>
          <button 
            onClick={() => setFilterState('all')}
            className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-teal-700 cursor-pointer"
          >
            Xem tất cả từ
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
          {/* INDEX & CONTROLS */}
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-bold">
            <span>Word {currentWordIndex + 1} of {filteredWords.length}</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShuffle}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-600 flex items-center space-x-1"
                title="Shuffle"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xáo trộn</span>
              </button>
              <button
                onClick={() => setCurrentWordIndex(prev => (prev > 0 ? prev - 1 : filteredWords.length - 1))}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-600"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentWordIndex(prev => (prev < filteredWords.length - 1 ? prev + 1 : 0))}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-600"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LEARNING MODE CONTENT */}
          {learningMode === 'flashcard' && (
            <FlashcardMode 
              word={currentWord}
              t={t}
              speakWord={speakWord}
              userProgress={userProgress}
              setUserProgress={setUserProgress}
            />
          )}

          {learningMode === 'mcq' && (
            <MultipleChoiceMode 
              word={currentWord}
              allWords={activeUnitWords}
              t={t}
              speakWord={speakWord}
              setUserProgress={setUserProgress}
            />
          )}

          {learningMode === 'spelling' && (
            <SpellingMode 
              word={currentWord}
              t={t}
              speakWord={speakWord}
              setUserProgress={setUserProgress}
            />
          )}

          {learningMode === 'matching' && (
            <WordMatchingMode 
              allWords={activeUnitWords}
              t={t}
              setUserProgress={setUserProgress}
            />
          )}
        </div>
      )}
    </div>
  );
}

// FLASHCARD MODE
function FlashcardMode({ word, t, speakWord, userProgress, setUserProgress }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [word]);

  const isMastered = userProgress.masteredWords.includes(word.id);

  const toggleMastered = (e) => {
    e.stopPropagation();
    setUserProgress(prev => {
      const exists = prev.masteredWords.includes(word.id);
      const updated = exists 
        ? prev.masteredWords.filter(id => id !== word.id)
        : [...prev.masteredWords, word.id];
      return {
        ...prev,
        masteredWords: updated,
        xp: prev.xp + (!exists ? 10 : -10)
      };
    });
  };

  return (
    <div className="space-y-6">
      <div 
        onClick={() => setFlipped(!flipped)}
        className="min-h-[280px] bg-gradient-to-tr from-slate-50 to-teal-50/30 rounded-3xl border-2 border-slate-200 p-6 flex flex-col justify-between cursor-pointer hover:border-teal-400 transition shadow-inner relative select-none"
      >
        <div className="flex justify-between items-start">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-600">
            {word.type || 'core'}
          </span>
          <button
            onClick={toggleMastered}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              isMastered 
                ? 'bg-emerald-500 text-white shadow-sm' 
                : 'bg-white text-slate-400 border border-slate-200 hover:text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMastered ? t.knowIt : t.needReview}</span>
          </button>
        </div>

        {!flipped ? (
          <div className="my-auto text-center py-6">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide mb-2 flex items-center justify-center space-x-3">
              <span>{word.word}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); speakWord(word.word); }}
                className="p-2.5 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-full transition cursor-pointer"
                title="Pronounce"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </h3>
            <p className="text-slate-500 font-mono text-base mb-1">{word.ipa}</p>
            <span className="inline-block px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-md">
              {word.pos}
            </span>
            <p className="text-xs text-slate-400 mt-8 animate-pulse flex items-center justify-center space-x-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t.flipCard}</span>
            </p>
          </div>
        ) : (
          <div className="my-auto text-center py-4 space-y-4">
            <div>
              <span className="text-2xl font-extrabold text-teal-800">{word.vietnamese}</span>
              <p className="text-sm italic text-slate-700 mt-3 bg-white/80 p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                "{word.example}"
              </p>
            </div>

            {word.wordFamily && word.wordFamily.length > 0 && (
              <div className="text-left bg-sky-50 p-3 rounded-xl border border-sky-100 text-xs">
                <span className="font-bold text-sky-900">Word Family:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {word.wordFamily.map((f, i) => (
                    <span key={i} className="bg-white px-2 py-1 rounded border border-sky-200 font-medium">
                      <strong>{f.word}</strong> ({f.pos}): {f.meaning}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {word.collocations && word.collocations.length > 0 && (
              <div className="text-left bg-teal-50 p-3 rounded-xl border border-teal-100 text-xs">
                <span className="font-bold text-teal-900">{t.collocations}</span>
                <ul className="list-disc list-inside mt-1 text-slate-700 font-medium">
                  {word.collocations.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
          <span>Source: <strong className="capitalize text-slate-600">{word.sourceRef}</strong></span>
          <span>Click card to flip</span>
        </div>
      </div>
    </div>
  );
}

// MULTIPLE CHOICE MODE
function MultipleChoiceMode({ word, allWords, t, speakWord, setUserProgress }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const options = useMemo(() => {
    const distractors = allWords.filter(w => w.id !== word.id);
    const shuffledDistractors = shuffle(distractors).slice(0, 3);
    const combined = [word, ...shuffledDistractors];
    return shuffle(combined);
  }, [word, allWords]);

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [word]);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption.id === word.id;

    setUserProgress(prev => {
      let mistakes = [...prev.mistakesNotebook];
      if (!isCorrect) {
        if (!mistakes.some(m => m.wordId === word.id && m.type === 'mcq')) {
          mistakes.push({
            id: 'm_' + Date.now(),
            wordId: word.id,
            word: word.word,
            vietnamese: word.vietnamese,
            type: 'mcq',
            userAnswer: selectedOption.vietnamese,
            correctAnswer: word.vietnamese,
            date: new Date().toLocaleDateString(),
            attempts: 1
          });
        }
      }
      return { 
        ...prev, 
        mistakesNotebook: mistakes,
        xp: prev.xp + (isCorrect ? 15 : 0)
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
        <h3 className="text-3xl font-black text-slate-800 flex items-center justify-center space-x-2">
          <span>{word.word}</span>
          <button onClick={() => speakWord(word.word)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-full cursor-pointer">
            <Volume2 className="w-5 h-5" />
          </button>
        </h3>
        <p className="text-xs font-mono text-slate-500 mt-1">{word.ipa} • ({word.pos})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          let btnStyle = "border-slate-200 bg-white hover:border-teal-400 text-slate-800";
          if (selectedOption?.id === opt.id) {
            btnStyle = "border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-400 font-bold";
          }
          if (isSubmitted) {
            if (opt.id === word.id) {
              btnStyle = "border-emerald-500 bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500 font-bold";
            } else if (selectedOption?.id === opt.id) {
              btnStyle = "border-rose-500 bg-rose-100 text-rose-900 font-bold";
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => !isSubmitted && setSelectedOption(opt)}
              disabled={isSubmitted}
              className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span className="font-semibold">{opt.vietnamese}</span>
              {isSubmitted && opt.id === word.id && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
              {isSubmitted && selectedOption?.id === opt.id && opt.id !== word.id && <XCircle className="w-6 h-6 text-rose-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-3.5 rounded-2xl font-black transition shadow-md cursor-pointer text-sm ${
            selectedOption 
              ? 'bg-teal-600 hover:bg-teal-700 text-white' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {t.checkAnswer}
        </button>
      ) : (
        <div className={`p-4 rounded-2xl border-2 ${selectedOption.id === word.id ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
          <div className="flex items-center space-x-2 font-black mb-1">
            {selectedOption.id === word.id ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-emerald-900">{t.correct} (+15 XP)</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-rose-600" />
                <span className="text-rose-900">{t.incorrect}</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-700 mt-1">
            <strong>{t.explanation}</strong> "{word.word}" ({word.pos}) = "{word.vietnamese}". Example: "{word.example}"
          </p>
        </div>
      )}
    </div>
  );
}

// SPELLING MODE
function SpellingMode({ word, t, speakWord, setUserProgress }) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
  }, [word]);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setIsSubmitted(true);

    const isCorrect = userInput.trim().toLowerCase() === word.word.toLowerCase();

    if (!isCorrect) {
      setUserProgress(prev => {
        let mistakes = [...prev.mistakesNotebook];
        if (!mistakes.some(m => m.wordId === word.id && m.type === 'spelling')) {
          mistakes.push({
            id: 'm_' + Date.now(),
            wordId: word.id,
            word: word.word,
            vietnamese: word.vietnamese,
            type: 'spelling',
            userAnswer: userInput,
            correctAnswer: word.word,
            date: new Date().toLocaleDateString(),
            attempts: 1
          });
        }
        return { ...prev, mistakesNotebook: mistakes };
      });
    } else {
      setUserProgress(prev => ({ ...prev, xp: prev.xp + 15 }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <button 
          onClick={() => speakWord(word.word)}
          className="p-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition shadow-md inline-flex items-center justify-center cursor-pointer"
          title="Listen Audio"
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <div>
          <p className="text-xs text-slate-500">{t.missingLetter}</p>
          <p className="text-xl font-extrabold text-teal-800 mt-1">"{word.vietnamese}"</p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="space-y-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isSubmitted}
          placeholder={t.typeYourAnswer}
          className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-2xl focus:ring-2 focus:ring-teal-500 font-bold text-center text-lg text-slate-800"
        />

        {!isSubmitted ? (
          <button
            type="submit"
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl transition shadow-md cursor-pointer"
          >
            {t.checkAnswer}
          </button>
        ) : (
          <div className={`p-4 rounded-2xl border-2 ${userInput.toLowerCase().trim() === word.word.toLowerCase() ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
            <p className="font-extrabold text-slate-800">
              {userInput.toLowerCase().trim() === word.word.toLowerCase() ? `${t.correct} (+15 XP)` : t.incorrect}
            </p>
            <p className="text-xs text-slate-700 mt-1">
              Chính tả đúng: <strong>"{word.word}"</strong> {word.ipa}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

// WORD MATCHING MODE
function WordMatchingMode({ allWords, t, setUserProgress }) {
  const [selectedEnglish, setSelectedEnglish] = useState(null);
  const [selectedVietnamese, setSelectedVietnamese] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const subset = useMemo(() => {
    return shuffle(allWords).slice(0, 5);
  }, [allWords]);

  const englishList = useMemo(() => {
    return shuffle(subset);
  }, [subset]);

  const vietnameseList = useMemo(() => {
    return shuffle(subset);
  }, [subset]);

  const handleSelectEnglish = (w) => {
    if (matchedPairs.includes(w.id)) return;
    setSelectedEnglish(w);
    if (selectedVietnamese) {
      checkMatch(w, selectedVietnamese);
    }
  };

  const handleSelectVietnamese = (w) => {
    if (matchedPairs.includes(w.id)) return;
    setSelectedVietnamese(w);
    if (selectedEnglish) {
      checkMatch(selectedEnglish, w);
    }
  };

  const checkMatch = (eng, vi) => {
    if (eng.id === vi.id) {
      setMatchedPairs(prev => [...prev, eng.id]);
      setUserProgress(prev => ({ ...prev, xp: prev.xp + 5 }));
    }
    setSelectedEnglish(null);
    setSelectedVietnamese(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-teal-50 p-4 rounded-2xl border border-teal-100">
        <h3 className="font-extrabold text-teal-900 text-lg">Ghép từ Tiếng Anh & Nghĩa Tiếng Việt</h3>
        <p className="text-xs text-slate-600 mt-1">Nhấn 1 từ Tiếng Anh và 1 nghĩa Tiếng Việt tương ứng để ghép đôi.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* ENGLISH COLUMN */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider text-center">English</h4>
          {englishList.map(w => {
            const isMatched = matchedPairs.includes(w.id);
            const isSelected = selectedEnglish?.id === w.id;
            return (
              <button
                key={'e_' + w.id}
                onClick={() => handleSelectEnglish(w)}
                disabled={isMatched}
                className={`w-full p-3.5 rounded-2xl border-2 text-sm font-bold text-center transition cursor-pointer ${
                  isMatched 
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60' 
                    : isSelected 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400'
                }`}
              >
                {w.word}
              </button>
            );
          })}
        </div>

        {/* VIETNAMESE COLUMN */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider text-center">Tiếng Việt</h4>
          {vietnameseList.map(w => {
            const isMatched = matchedPairs.includes(w.id);
            const isSelected = selectedVietnamese?.id === w.id;
            return (
              <button
                key={'v_' + w.id}
                onClick={() => handleSelectVietnamese(w)}
                disabled={isMatched}
                className={`w-full p-3.5 rounded-2xl border-2 text-xs font-bold text-center transition cursor-pointer ${
                  isMatched 
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60' 
                    : isSelected 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400'
                }`}
              >
                {w.vietnamese}
              </button>
            );
          })}
        </div>
      </div>

      {matchedPairs.length === subset.length && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center">
          <p className="font-black text-emerald-900 text-lg">Chúc mừng! Bạn đã hoàn thành xuất sắc!</p>
        </div>
      )}
    </div>
  );
}

// MISTAKE NOTEBOOK VIEW
function MistakesNotebookView({ lang, t, userProgress, setUserProgress, speakWord }) {
  const mistakes = userProgress.mistakesNotebook || [];

  const handleRemoveMistake = (id) => {
    setUserProgress(prev => ({
      ...prev,
      mistakesNotebook: prev.mistakesNotebook.filter(m => m.id !== id)
    }));
  };

  const handleClearAll = () => {
    setUserProgress(prev => ({ ...prev, mistakesNotebook: [] }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <span>{t.navMistakes}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'vi' 
              ? 'Tự động lưu từ vựng và câu luyện tập làm sai để rèn luyện trọng tâm.' 
              : 'Automatically records incorrect answers for targeted revision.'}
          </p>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {lang === 'vi' ? 'Xóa tất cả' : 'Clear All'}
          </button>
        )}
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="text-slate-700 font-bold">{t.noMistakes}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mistakes.map((m) => (
            <div key={m.id} className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-xs space-y-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    {m.type}
                  </span>
                  <h4 className="text-lg font-black text-slate-800 mt-1 flex items-center space-x-2">
                    <span>{m.word}</span>
                    <button onClick={() => speakWord(m.word)} className="p-1 text-teal-600 hover:bg-teal-50 rounded-full cursor-pointer">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{m.vietnamese}</p>
                </div>
                <button
                  onClick={() => handleRemoveMistake(m.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Remove"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-rose-700">
                  <strong>{lang === 'vi' ? 'Bạn nhập:' : 'Your Answer:'}</strong> {m.userAnswer || '—'}
                </p>
                <p className="text-emerald-800">
                  <strong>{lang === 'vi' ? 'Đáp án đúng:' : 'Correct:'}</strong> {m.correctAnswer}
                </p>
              </div>

              {m.explanation && <p className="text-xs leading-relaxed text-slate-600">{m.explanation}</p>}
              {m.sourceRef && <p className="text-[10px] text-slate-400">{m.sourceRef}</p>}
              <div className="text-[10px] text-slate-400 text-right">
                {m.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function PracticeQuiz({ bank, lang, setUserProgress, mixed = false, requestedCount = 20, title = 'Luyện tập', download = false }) {
  const vi = lang === 'vi';
  const [settings,setSettings]=useState({unit:bank[0]?.unit||'unit1',focus:mixed?'mixed':'grammar',exerciseType:'mixed',difficulty:'mixed',count:requestedCount,review:false});
  const [history,setHistory]=useState(()=>loadHistory());
  const [activeSettings,setActiveSettings]=useState(null);
  const [paper,setPaper]=useState([]);
  const [session,setSession]=useState(null);
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [attempt,setAttempt]=useState(0);
  const [notice,setNotice]=useState('');
  const [storageWarning,setStorageWarning]=useState(false);
  const [shortfall,setShortfall]=useState(null);
  const submitLock=useRef(false);
  const score=paper.filter(q=>isCorrect(q,answers[q.id])).length;
  const answered=paper.filter(q=>String(answers[q.id]??'').trim()).length;
  const start=(config=settings)=>{
    const result=beginSession(bank,config);
    setHistory(result.history);setStorageWarning(!result.saved);
    if(!result.paper.length){setNotice(vi?'Không có câu phù hợp với cấu hình này.':'No questions match these settings.');return;}
    setPaper(result.paper);setSession(result.session);setActiveSettings({...config});setAnswers({});setSubmitted(false);setAttempt(n=>n+1);setNotice('');submitLock.current=false;
    setShortfall(result.paper.length<config.count?{requested:config.count,actual:result.paper.length}:null);
  };
  const submit=()=>{
    if(submitted||submitLock.current)return;
    if(answered<paper.length){setNotice(vi?'Hãy trả lời tất cả câu hỏi trước khi nộp bài.':'Please answer every question before submitting.');return;}
    submitLock.current=true;
    const result=submitSession(session,paper,answers);
    setHistory(result.history);setStorageWarning(!result.saved);setSubmitted(true);setNotice('');
    if(!result.alreadySubmitted)setUserProgress(p=>applyQuizResult(p,paper,answers));
  };
  const exportPaper=()=>{
    const lines=[title,...paper.map((q,i)=>`${i+1}. ${q.passage?`${q.passageTitle}\n${q.passage}\n`:''}${q.prompt}\n${q.options?q.options.map((o,j)=>`${'ABCD'[j]}. ${o}`).join('\n'):'________________________________'}`)];
    if(submitted)lines.push('\nĐÁP ÁN & GIẢI THÍCH / ANSWERS',...paper.map((q,i)=>`${i+1}. ${q.correct}\n${q.explanation}\n${q.sourceRef}`));
    const url=URL.createObjectURL(new Blob(['\ufeff'+lines.join('\n\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='english-11-practice.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  // Render questions sharing a passage together; never detach reading/cloze items.
  const groups=[];
  for(const q of paper){let group=q.passageId?groups.find(g=>g.passageId===q.passageId):null;if(!group){group={passageId:q.passageId,passage:q.passage,passageTitle:q.passageTitle,questions:[]};groups.push(group);}group.questions.push(q);}
  let displayIndex=0;
  return <section className="space-y-5" aria-label={title}>
    <PracticeSetup bank={bank} lang={lang} settings={settings} onChange={setSettings} onStart={()=>start()} history={history} grammarOnly={!mixed}/>
    {storageWarning&&<p role="alert" className="rounded-xl bg-amber-50 p-4 text-amber-900 text-sm">{vi?'Trình duyệt không lưu được lịch sử. Lượt này vẫn hoạt động, nhưng ưu tiên câu mới giữa các lần mở ứng dụng không được bảo đảm.':'History could not be saved in this browser. Cross-session replay cannot be guaranteed.'}</p>}
    {paper.length>0&&<>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-bold text-lg">{title}</h3><p className="text-sm text-slate-500">{vi?'Lượt':'Attempt'} {attempt} · {paper.length} {vi?'câu / lượt':'questions'} · {uniqueValidQuestions(bank).length} {vi?'câu duy nhất trong ngân hàng':'unique questions in pool'}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={()=>start(activeSettings)} className="flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-white font-semibold hover:bg-teal-800"><RefreshCw size={16}/>{vi?'Làm lại':'Try again'}</button>{download&&<button type="button" onClick={exportPaper} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">{submitted?(vi?'Tải đề + đáp án':'Download paper + answers'):(vi?'Tải đề':'Download paper')}</button>}</div></div>
      {shortfall&&<p role="status" className="text-sm text-amber-800">{vi?`Chỉ có ${shortfall.actual} câu duy nhất phù hợp trong số ${shortfall.requested} câu đã chọn.`:`Only ${shortfall.actual} unique questions available out of ${shortfall.requested} requested.`}</p>}
      <p className="text-sm text-slate-500">{vi?'Lịch sử được lưu trên trình duyệt này, dùng chung giữa Grammar và Exam. Khi hết câu mới, câu cũ có thể xuất hiện lại.':'History is saved in this browser and shared by Grammar and Exam. Older questions may repeat after new questions run out.'}</p>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={answered} aria-valuemax={paper.length} aria-valuemin={0} aria-label={vi?'Tiến độ trả lời':'Answer progress'}><div className="h-full bg-teal-500 transition-all" style={{width:`${answered/paper.length*100}%`}}/></div><p className="text-sm font-semibold" aria-live="polite">{answered}/{paper.length} {vi?'câu đã trả lời':'answered'}</p>
      {submitted&&<div role="status" className="rounded-2xl bg-teal-50 border border-teal-200 p-5"><h3 className="text-2xl font-bold text-teal-900">{vi?'Kết quả':'Result'}: {score}/{paper.length} · {Math.round(score/paper.length*100)}%</h3><p className="text-teal-800 mt-1">+{score*5} XP · {vi?'Xem đáp án và giải thích dưới từng câu. Câu sai đã được lưu vào Sổ tay lỗi sai.':'Review explanations below. Incorrect answers are saved in Mistake Notebook.'}</p></div>}
      {groups.map((group,g)=><div key={group.passageId||g} className="space-y-4">
        {group.passage&&<article aria-label={group.passageTitle} className="rounded-2xl border border-sky-200 bg-sky-50 p-5"><h4 className="font-bold text-sky-950 mb-3">{group.passageTitle}</h4><p className="whitespace-pre-line leading-relaxed text-sm">{group.passage}</p></article>}
        {group.questions.map(q=>{const i=displayIndex++;return <fieldset data-question-id={q.id} key={`${session.id}-${q.id}`} className="rounded-2xl bg-white border border-slate-200 p-5 min-w-0" disabled={submitted}>
          <legend className="float-left w-full mb-4 font-semibold whitespace-pre-line"><span className="text-teal-700 mr-2">{String(i+1).padStart(2,'0')}.</span>{q.prompt}<span className="block text-xs text-slate-400 font-normal mt-2">{q.exerciseType} · {q.difficulty}</span></legend>
          {q.options?<div className="clear-both grid sm:grid-cols-2 gap-3">{q.options.map((o,j)=>{const chosen=answers[q.id]===o,right=submitted&&o===q.correct,wrong=submitted&&chosen&&!right;return <label key={o} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer ${right?'bg-emerald-50 border-emerald-500':wrong?'bg-red-50 border-red-400':chosen?'bg-sky-50 border-sky-500':'border-slate-200 hover:bg-slate-50'}`}><input type="radio" className="mt-1 accent-teal-700 shrink-0" name={`${session.id}-${q.id}`} value={o} checked={chosen} onChange={()=>{setAnswers(a=>({...a,[q.id]:o}));setNotice('');}}/><span><b className="mr-2">{'ABCD'[j]}.</b>{o}{right&&<span className="ml-2 font-bold text-emerald-700">✓ {vi?'Đúng':'Correct'}</span>}{wrong&&<span className="ml-2 font-bold text-red-700">✗</span>}</span></label>;})}</div>:<div className="clear-both"><label className="text-sm text-slate-500">{vi?'Câu trả lời của bạn':'Your answer'}<input type="text" autoComplete="off" className="mt-2 block w-full border border-slate-300 rounded-xl p-3 text-slate-900" value={answers[q.id]||''} onChange={e=>{setAnswers(a=>({...a,[q.id]:e.target.value}));setNotice('');}}/></label></div>}
          {submitted&&<div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed"><p className="font-bold mb-1">{isCorrect(q,answers[q.id])?'✓':'✗'} {vi?'Đáp án':'Answer'}: {q.correct}</p><p>{q.explanation}</p><p className="text-xs text-slate-500 mt-3">{q.sourceRef}</p>{q.acceptedAnswers?.length>1&&<p className="text-xs text-slate-500 mt-2">{vi?'Các cách viết được chấp nhận':'Accepted variants'}: {q.acceptedAnswers.join(' / ')}</p>}</div>}
        </fieldset>;})}
      </div>)}
      <div className="flex flex-wrap gap-4 items-center pb-4"><button type="button" disabled={submitted} onClick={submit} className="rounded-xl bg-teal-700 px-6 py-3 text-white font-bold disabled:opacity-50">{submitted?(vi?'Đã chấm bài':'Submitted'):(vi?'Nộp bài & xem giải thích':'Submit & review')}</button><span role="alert" className="text-red-700 text-sm">{notice}</span></div>
    </>}
    {!paper.length&&notice&&<p role="alert" className="text-red-700 text-sm">{notice}</p>}
  </section>;
}

function GrammarLabView({ lang, selectedUnitId, setUserProgress }) {
  const topic = GRAMMAR[selectedUnitId];
  const bank = useMemo(()=>getQuestionBank(selectedUnitId, VOCABULARY_DATASETS[selectedUnitId]).filter(q=>q.kind === 'grammar'),[selectedUnitId]);
  return <div className="space-y-6">
    <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-sky-800 p-6 sm:p-8 text-white"><p className="text-xs font-bold uppercase tracking-widest text-teal-200 mb-2">Grammar Lab · {selectedUnitId.replace('unit','Unit ')}</p><h2 className="text-2xl sm:text-3xl font-extrabold">{topic.title}</h2><p className="mt-2 text-lg text-teal-100">{topic.subtitle}</p><p className="mt-4 max-w-3xl text-sm leading-relaxed text-teal-50">{topic.intro}</p></div>
    <p className="text-sm text-slate-500">{lang === 'vi' ? 'Giải thích bằng tiếng Việt · Ví dụ bằng tiếng Anh · Mở từng mục để học kỹ hơn.' : 'Vietnamese explanations · English examples · Expand each lesson for details.'}</p>
    {topic.rules.map((r,i)=><details key={r.title} open={i===0} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden"><summary className="cursor-pointer p-5 font-bold text-lg text-teal-900">{r.title}</summary><div className="border-t border-slate-100 p-5 space-y-5 leading-relaxed text-sm">
      <div className="rounded-xl bg-sky-50 border border-sky-100 p-4"><h4 className="font-bold text-sky-900 mb-2">Cấu trúc · Forms</h4>{r.forms.map(f=><p key={f} className="font-mono text-sky-900 my-1">{f}</p>)}</div>
      <div><h4 className="font-bold mb-1">Cách dùng · Usage</h4><p>{r.usage}</p></div>
      <div><h4 className="font-bold mb-2">Ví dụ · Examples</h4><ul className="space-y-2 list-disc pl-5">{r.examples.map(e=><li key={e}>{e}</li>)}</ul></div>
      <div className="bg-rose-50 rounded-xl p-4"><h4 className="font-bold text-rose-800 mb-2">Lỗi thường gặp · Common mistakes</h4>{r.mistakes.map(e=><p key={e} className="my-2">{e}</p>)}</div>
      <div className="bg-amber-50 rounded-xl p-4"><h4 className="font-bold text-amber-900 mb-1">Ghi nhớ & phân biệt · Key distinction</h4><p>{r.tip}</p></div>
    </div></details>)}
    <PracticeQuiz key={selectedUnitId} bank={bank} lang={lang} setUserProgress={setUserProgress} requestedCount={10} title={lang === 'vi' ? 'Kiểm tra ngữ pháp' : 'Grammar check'}/>
  </div>;
}

function ExamPracticeView({lang, selectedUnitId, setUserProgress}) {
  const bank = useMemo(()=>getQuestionBank(selectedUnitId,VOCABULARY_DATASETS[selectedUnitId]),[selectedUnitId]);
  const vi = lang === 'vi';
  return <div className="space-y-6">
    <div className="rounded-3xl bg-gradient-to-br from-sky-900 to-teal-800 p-6 sm:p-8 text-white"><p className="text-xs font-bold uppercase tracking-widest text-teal-200">Practice · {selectedUnitId.replace('unit','Unit ')}</p><h2 className="text-3xl font-extrabold mt-2">{vi ? 'Luyện thi, vững từng bước.' : 'Practice. Learn. Try again.'}</h2><p className="text-sky-100 mt-3 text-sm">{vi ? 'Luyện tập theo Unit, tự chấm điểm và hiểu vì sao đáp án đúng.' : 'Practice by unit, check your score and understand each answer.'}</p></div>
    <PracticeQuiz key={selectedUnitId} bank={bank} lang={lang} setUserProgress={setUserProgress} requestedCount={20} mixed download title={vi ? 'Đề luyện tập' : 'Practice paper'}/>
  </div>;
}

function MiniGamesView({lang,activeUnitWords,setUserProgress}) {
  const [round,setRound] = useState(1);
  return <section className="space-y-5"><div className="flex flex-wrap gap-4 items-center justify-between"><h2 className="font-bold text-2xl">{lang === 'vi' ? 'Ghép từ · Mini game' : 'Word matching · Mini game'}</h2><button onClick={()=>setRound(r=>r+1)} className="rounded-xl px-5 py-2 bg-teal-700 text-white font-semibold">{lang === 'vi' ? 'Ván mới' : 'New round'}</button></div><WordMatchingMode key={round} allWords={activeUnitWords} t={TRANSLATIONS[lang]} setUserProgress={setUserProgress}/></section>;
}
