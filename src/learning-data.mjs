export function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// Prioritize questions outside the previous paper. Never repeat an identical paper
// when another question is available, even with a deterministic random source.
export function drawQuestions(bank, count, previous = [], rng = Math.random) {
  const prior = new Set(previous.map(q => q.id));
  const fresh = shuffle(bank.filter(q => !prior.has(q.id)), rng);
  const old = shuffle(bank.filter(q => prior.has(q.id)), rng);
  return shuffle([...fresh, ...old].slice(0, Math.min(count, bank.length)), rng)
    .map(q => ({ ...q, options: shuffle(q.options, rng) }));
}
const rule = (title, forms, usage, examples, mistakes, tip) => ({ title, forms, usage, examples, mistakes, tip });
export const GRAMMAR = {
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
export const GRAMMAR_BANK = Object.fromEntries(Object.entries(RAW).map(([unit, rows]) => [unit, rows.map(([prompt,correct,wrong,explanation],i) => ({id:`${unit}-g${i+1}`, unit, kind:'grammar', prompt, correct, options:[correct,...wrong], explanation}))]));
export function buildBank(unit, words) {
  const valid = words.filter(w => w.word && w.vietnamese);
  // Unique meanings keep the displayed answers unambiguous.
  const vocabulary = valid.flatMap(w => {
    const meanings = [...new Set(valid.filter(x => x.vietnamese !== w.vietnamese).map(x => x.vietnamese))];
    if (meanings.length < 3) return [];
    return [{id:`${unit}-v-${w.id}`,unit,kind:'vocabulary',prompt:`“${w.word}” có nghĩa là gì? / What does “${w.word}” mean?`,correct:w.vietnamese,options:[w.vietnamese,...shuffle(meanings).slice(0,3)],explanation:`${w.word} (${w.pos}) = ${w.vietnamese}. Ví dụ / Example: ${w.example}`,wordId:w.id}];
  });
  return [...GRAMMAR_BANK[unit], ...vocabulary];
}

export function normalizeProgress(data) {
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
