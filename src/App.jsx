import PastelHome from './PastelHome.jsx';
import PracticeSetup from './PracticeSetup.jsx';
import {getQuestionBank} from './question-bank.mjs';
import {loadHistory, saveHistory, normalizeHistory, beginSession, submitSession, isCorrect, applyQuizResult, uniqueValidQuestions} from './smart-replay.mjs';
import { GRAMMAR, buildBank, drawQuestions, shuffle, normalizeProgress } from './learning-data.mjs';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Brain, Trophy, Volume2, ArrowLeft, ArrowRight, RotateCw, 
  CheckCircle2, XCircle, Search, Sparkles, Languages, Save, Download, 
  Upload, HelpCircle, RefreshCw, Layers, Award, BarChart3, BookmarkCheck,
  AlertCircle, Dumbbell, Gamepad2, FileText, ChevronRight, Check, Shuffle,
  Filter, Zap, Star, Flame, CornerDownRight, Eye
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('home');
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
    <div className="min-h-screen bg-[#fff6f0] text-slate-800 font-sans flex flex-col">
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
              active={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
              icon={<Sparkles className="w-4 h-4" />}
              label={lang === 'vi' ? 'Trang chủ' : 'Home'}
            />
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

      {/* EXISTING STATS & BACKUP REMAIN ACCESSIBLE ON LEARNING TABS */}
      {activeTab !== 'home' && <section className="bg-gradient-to-r from-teal-700 via-emerald-600 to-sky-700 text-white py-5 px-4 shadow-inner">
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
      </section>}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full">
        {activeTab !== 'home' && activeTab !== 'vocab' && activeTab !== 'mistakes' && <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Chọn Unit">{Object.keys(VOCABULARY_DATASETS).map((id,i)=><button key={id} aria-pressed={id===selectedUnitId} onClick={()=>setSelectedUnitId(id)} className={`rounded-xl px-4 py-2 text-sm font-bold border ${id===selectedUnitId ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-teal-50'}`}>Unit {i+1}</button>)}</div>}

        {activeTab === 'home' && (
          <PastelHome
            lang={lang}
            unitId={selectedUnitId}
            selectUnit={setSelectedUnitId}
            words={activeUnitWords}
            unitIds={Object.keys(VOCABULARY_DATASETS)}
            progress={userProgress}
            navigate={setActiveTab}
            onExport={handleExportBackup}
            onImport={handleImportBackup}
          />
        )}

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
