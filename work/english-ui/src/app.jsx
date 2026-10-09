import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Bookmark, CircleUserRound, ArrowUpRight, ArrowLeft, ArrowRight, ChevronRight, Search, Play, Pause, Volume2, SkipBack, SkipForward, Eye, EyeOff, X, Download, Upload, SlidersHorizontal, Headphones, Leaf, Sparkles, Coffee, ShoppingBasket, Store, Shirt, Receipt, Utensils, CookingPot, ChefHat, WashingMachine, Hand, Package, BatteryCharging, TramFront, Ticket, Bike, Trees, MessagesSquare, Plane, Luggage, BedDouble, CarFront, LifeBuoy } from 'lucide-react';
import { chapters, getLesson } from './data.js';
import { isNative, nativeVoices, nativeStop, nativeSpeak, nativeExportRecords } from './native-services.js';

const icons = { Coffee, ShoppingBasket, Store, Shirt, Receipt, Utensils, CookingPot, ChefHat, WashingMachine, Hand, Package, BatteryCharging, TramFront, Ticket, Bike, Trees, BookOpen, MessagesSquare, Plane, Luggage, BedDouble, CarFront, LifeBuoy };
const storageKey = 'scene-english-ui-v1';
// Category prefixes and totals follow the manuscript registry, including workplace chapters.
const categoryPrefixes = { daily: 'D', travel: 'T', work: 'W' };
const chapterLabel = id => id.startsWith('W') ? 'WORK' : id.startsWith('T') ? 'TRAVEL' : 'CHAPTER';
// Retain legacy learned IDs only for backup compatibility; the UI no longer tracks progress.
const defaults = { favorites: [], learned: [], last: null, speed: 1, chinese: true, fontSize: 18, voice: '' };
// Validate persisted sentence IDs before rendering favorites or merging old backups.
const sentenceRegistry = new Map(chapters.flatMap(ch => {
  const lesson = getLesson(ch);
  return [...lesson.lines, ...lesson.dialogues.flatMap(d => d.lines), ...lesson.branches.flatMap(d => d.lines)].map(s => [s.id, s]);
}));
function validateData(value) {
  if (!value || typeof value !== 'object') throw new Error('学习记录格式不正确');
  const ids = name => Array.isArray(value[name]) ? [...new Set(value[name])].filter(id => sentenceRegistry.has(id)) : [];
  return {
    favorites: ids('favorites'), learned: ids('learned'),
    last: chapters.some(c => c.id === value.last) ? value.last : null,
    speed: [0.75, 1, 1.25].includes(value.speed) ? value.speed : 1,
    chinese: typeof value.chinese === 'boolean' ? value.chinese : true,
    fontSize: [18, 20, 22].includes(value.fontSize) ? value.fontSize : 18,
    voice: typeof value.voice === 'string' ? value.voice : '',
  };
}
function readData() {
  try {
    const raw = localStorage.getItem(storageKey);
    return { data: raw ? validateData(JSON.parse(raw)) : defaults, error: '' };
  } catch (error) {
    console.error('Cannot read learning records:', error);
    return { data: defaults, error: '学习记录未能读取，当前使用临时记录。' };
  }
}
const initial = readData();
function routeFromHash() {
  const hash = window.location.hash.slice(1);
  if (chapters.some(ch => ch.id === hash)) return { page: 'lesson', chapterId: hash };
  return { page: ['favorites', 'profile'].includes(hash) ? hash : 'chapters', chapterId: null };
}
const initialRoute = routeFromHash();

function IconButton({ icon: Icon, label, className = '', ...props }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} data-tooltip={label} {...props}><Icon size={20} aria-hidden="true" /></button>;
}
function Brand() {
  return <div className="brand"><span className="brand-symbol"><BookOpen size={21} /></span><div><strong>日常英语</strong><span>SCENE ENGLISH</span></div></div>;
}

function App() {
  // Learning data persists locally; navigation, search and playback are transient UI state.
  const [data, setData] = useState(initial.data);
  const [page, setPage] = useState(initialRoute.page);
  const [chapterId, setChapterId] = useState(initialRoute.chapterId || data.last || 'D02');
  const [filter, setFilter] = useState('daily');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('core');
  const [part, setPart] = useState(0);
  const [playback, setPlayback] = useState({ status: 'idle', id: '', index: 0 });
  const [toast, setToast] = useState(initial.error);
  const [voices, setVoices] = useState([]);
  const [favoriteQuery, setFavoriteQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const speechToken = useRef(0);
  const speechTimer = useRef(null);
  const utteranceRef = useRef(null);
  const playbackRef = useRef(playback);
  const importRef = useRef(null);
  const saveBlocked = useRef(Boolean(initial.error));
  const chapter = chapters.find(c => c.id === chapterId);
  const lesson = getLesson(chapter);
  const groups = tab === 'dialogue' ? lesson.dialogues : lesson.branches;
  // Quick reference alternates expression and example in the existing playback queue.
  const referenceLines = lesson.quickReference.flatMap(entry => [
    { id: entry.id, chapterId, en: entry.en },
    { id: `${entry.id}-EX`, chapterId, en: entry.exampleEn },
  ]);
  const lines = page === 'favorites'
    ? data.favorites.map(id => sentenceRegistry.get(id)).filter(s => `${s.en} ${s.zh}`.toLowerCase().includes(favoriteQuery.toLowerCase()))
    : tab === 'reference' ? referenceLines : tab === 'core' ? lesson.lines : groups[part]?.lines || [];
  const activeLine = lines.find(s => s.id === playback.id) || lines[0];
  const change = patch => { saveBlocked.current = false; setData(old => ({ ...old, ...patch })); };

  useEffect(() => {
    if (saveBlocked.current) return;
    try { localStorage.setItem(storageKey, JSON.stringify(data)); }
    catch (error) { console.error('Cannot persist learning records:', error); setToast('记录保存失败，关闭页面前请导出备份。'); }
  }, [data]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (isNative) {
      let active = true;
      const update = () => nativeVoices().then(result => {
        if (active) setVoices(result);
      }).catch(error => {
        console.error('Cannot load Android English voices:', error);
        if (active) setToast('英语音色未能读取，请检查手机系统的文字转语音设置。');
      });
      update();
      const visible = () => { if (!document.hidden) update(); };
      document.addEventListener('visibilitychange', visible);
      return () => { active = false; document.removeEventListener('visibilitychange', visible); };
    }
    if (!('speechSynthesis' in window)) return;
    const update = () => setVoices(window.speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)));
    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, []);
  useEffect(() => { playbackRef.current = playback; }, [playback]);
  useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hidden);
    const pop = () => {
      stop();
      const route = routeFromHash(); setPage(route.page);
      if (route.chapterId) { setChapterId(route.chapterId); setTab('core'); setPart(0); }
      setPlayback({ status: 'idle', id: '', index: 0 });
    };
    window.addEventListener('popstate', pop);
    return () => { stop(); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('popstate', pop); };
  }, []);

  function stop() {
    speechToken.current += 1;
    clearTimeout(speechTimer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setPlayback(old => ({ ...old, status: 'idle' }));
    return isNative ? nativeStop() : Promise.resolve();
  }
  function navigate(next) {
    stop(); setPage(next); setQuery(''); setFavoriteQuery(''); window.scrollTo({ top: 0 });
    window.history.pushState({ page: next }, '', `#${next}`);
  }
  function togglePlayback(index) {
    const status = playbackRef.current.status;
    if (status === 'loading') { stop(); return; }
    if (status === 'playing') {
      // Android TTS has no word-level pause; resume restarts the current sentence.
      if (isNative) stop();
      else window.speechSynthesis.pause();
      setPlayback(old => ({ ...old, status: 'paused' }));
    } else if (status === 'paused') {
      if (isNative) { speak(index, true); return; }
      window.speechSynthesis.resume();
      setPlayback(old => ({ ...old, status: 'playing' }));
    } else speak(index, true);
  }
  function openChapter(id) {
    stop(); setChapterId(id); setPage('lesson'); setTab('core'); setPart(0);
    setPlayback({ status: 'idle', id: '', index: 0 }); change({ last: id });
    window.history.pushState({ chapter: id }, '', `#${id}`); window.scrollTo({ top: 0 });
  }
  function switchTab(next) {
    stop(); setTab(next); setPart(0); setPlayback({ status: 'idle', id: '', index: 0 });
  }
  // A generation token prevents cancelled or previous utterances from advancing the queue.
  function speak(index, continuous = false, queue = lines) {
    const stopped = stop();
    const sentence = queue[index];
    if (!sentence) return;
    if (isNative) {
      speakAndroid(index, continuous, queue, stopped, speechToken.current);
      return;
    }
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setToast('当前浏览器不支持朗读。'); return;
    }
    const token = speechToken.current;
    const utterance = new SpeechSynthesisUtterance(sentence.en);
    utteranceRef.current = utterance;
    const voice = voices.find(v => v.voiceURI === data.voice) || voices.find(v => v.lang === 'en-US') || voices[0];
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-US'; utterance.rate = data.speed;
    setPlayback({ status: 'loading', id: sentence.id, index });
    speechTimer.current = setTimeout(() => {
      if (token !== speechToken.current) return;
      stop(); setToast('朗读未能启动，请在“我的”中更换英语音色。');
    }, 12000);
    utterance.onstart = () => {
      if (token !== speechToken.current) return;
      clearTimeout(speechTimer.current);
      setPlayback({ status: 'playing', id: sentence.id, index });
      document.querySelector(`[data-sentence="${sentence.id}"]`)?.scrollIntoView({ block: 'nearest' });
    };
    utterance.onend = () => {
      if (token !== speechToken.current) return;
      clearTimeout(speechTimer.current); utteranceRef.current = null;
      setPlayback({ status: 'idle', id: sentence.id, index });
      if (continuous && index + 1 < queue.length) {
        speechTimer.current = setTimeout(() => { if (token === speechToken.current) speak(index + 1, true, queue); }, 450);
      }
    };
    utterance.onerror = event => {
      if (token !== speechToken.current) return;
      console.error('Speech playback failed:', event.error);
      stop(); setToast('朗读失败，请检查设备语音设置或更换英语音色。');
    };
    try { window.speechSynthesis.speak(utterance); }
    catch (error) { console.error('Speech request failed:', error); stop(); setToast('朗读暂时不可用，请稍后再试。'); }
  }
  // Check cancellation after each asynchronous boundary and only advance after native onDone.
  async function speakAndroid(index, continuous, queue, stopped, token) {
    const sentence = queue[index];
    setPlayback({ status: 'loading', id: sentence.id, index });
    try {
      await stopped;
      if (token !== speechToken.current) return;
      const voice = voices.find(v => v.voiceURI === data.voice)
        || voices.find(v => v.lang === 'en-US' && v.localService)
        || voices.find(v => v.localService) || voices.find(v => v.lang === 'en-US') || voices[0];
      setPlayback({ status: 'playing', id: sentence.id, index });
      document.querySelector(`[data-sentence="${sentence.id}"]`)?.scrollIntoView({ block: 'nearest' });
      speechTimer.current = setTimeout(() => {
        if (token !== speechToken.current) return;
        stop(); setToast('朗读未能完成，请检查手机语音引擎或更换英语音色。');
      }, 90000);
      await nativeSpeak(sentence.en, voice, data.speed, () => token === speechToken.current);
      if (token !== speechToken.current) return;
      clearTimeout(speechTimer.current);
      setPlayback({ status: 'idle', id: sentence.id, index });
      if (continuous && index + 1 < queue.length) {
        speechTimer.current = setTimeout(() => {
          if (token === speechToken.current) speak(index + 1, true, queue);
        }, 450);
      }
    } catch (error) {
      if (token !== speechToken.current) return;
      console.error('Android speech failed:', error);
      stop(); setToast(error.message || '朗读失败，请检查手机系统的英语语音设置。');
    }
  }
  function toggleFavorite(id) {
    if (page === 'favorites') stop();
    const exists = data.favorites.includes(id);
    change({ favorites: exists ? data.favorites.filter(x => x !== id) : [...data.favorites, id] });
    setToast(exists ? '已取消收藏' : '已加入收藏');
  }
  async function exportRecords() {
    if (exporting) return;
    setExporting(true);
    try {
      const record = { format: 'scene-english-records', version: 1, data };
      if (isNative) {
        await nativeExportRecords(record);
        return;
      }
      const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'scene-english-records.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setToast('学习记录已导出');
    } catch (error) {
      console.error('Cannot export learning records:', error);
      setToast('记录导出未完成，请重试。');
    } finally { setExporting(false); }
  }
  async function importRecords(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('记录文件不能超过 1 MB');
      const record = JSON.parse(await file.text());
      if (record.format !== 'scene-english-records' || record.version !== 1) throw new Error('请选择本应用导出的记录文件');
      const restored = validateData(record.data);
      stop(); change({ ...restored, favorites: [...new Set([...data.favorites, ...restored.favorites])], learned: [...new Set([...data.learned, ...restored.learned])] });
      setToast('学习记录已合并');
    } catch (error) { console.error('Cannot import records:', error); setToast(error.message || '导入失败，请检查文件。'); }
    finally { event.target.value = ''; }
  }

  const nav = <>{[['chapters', BookOpen, '章节'], ['favorites', Bookmark, '收藏'], ['profile', CircleUserRound, '我的']].map(([id, Icon, name]) => <button key={id} className={`nav-item ${(page === id || id === 'chapters' && page === 'lesson') ? 'active' : ''}`} onClick={() => navigate(id)} aria-current={page === id ? 'page' : undefined}><Icon size={21} /><span>{name}</span>{id === 'favorites' && data.favorites.length > 0 && <small>{data.favorites.length}</small>}</button>)}</>;

  function sentenceRow(s, i, mode = 'core') {
    const active = playback.id === s.id;
    const favorite = data.favorites.includes(s.id);
    return <article key={s.id} data-sentence={s.id} className={`sentence ${active ? 'selected' : ''} ${mode === 'dialogue' ? 'dialogue-sentence' : ''}`}>
      <div className="sentence-gutter">{mode === 'dialogue' ? <span className={`role-dot ${s.role === '顾客' ? 'customer' : ''}`}>{s.role.slice(0, 1)}</span> : <span className="sentence-number">{String(i + 1).padStart(2, '0')}</span>}</div>
      <div className="sentence-body">
        <div className="sentence-meta"><span>{s.role}</span><span className="tone">{s.tone}</span>{active && playback.status === 'playing' && <span className="speaking-label">朗读中</span>}<div className="sentence-actions"><IconButton icon={active && playback.status !== 'idle' ? Pause : Volume2} label={active && playback.status !== 'idle' ? '停止朗读' : `播放第 ${i + 1} 句`} className={active ? 'sound active' : 'sound'} onClick={() => active && playback.status !== 'idle' ? stop() : speak(i)} /><IconButton icon={Bookmark} label={favorite ? '取消收藏' : '收藏句子'} className={favorite ? 'bookmarked' : ''} aria-pressed={favorite} onClick={() => toggleFavorite(s.id)} /></div></div>
        <button className="sentence-read" onClick={() => speak(i)} aria-label={`朗读：${s.en}`}><span className="english" lang="en">{s.en}</span></button>
        {data.chinese && <p className="translation">{s.zh}</p>}
        {s.note && <div className="usage-note"><Sparkles size={13} /><p>{s.note}</p></div>}
        {mode === 'favorite' && <button className="origin-link" onClick={() => openChapter(s.chapterId)}>{chapters.find(c => c.id === s.chapterId)?.title}<ArrowUpRight size={12} /></button>}
      </div>
    </article>;
  }

  function catalog() {
    const filtered = chapters.filter(ch => (filter === 'all' || ch.id.startsWith(categoryPrefixes[filter])) && `${ch.title} ${ch.english} ${ch.example} ${ch.task}`.toLowerCase().includes(query.toLowerCase()));
    const groupNames = [...new Set(filtered.map(ch => ch.group))];
    const resume = chapters.find(c => c.id === data.last) || chapters[1];
    return <>
      <div className="page-heading catalog-heading"><p>{[['D', '日常生活'], ['T', '旅行交流'], ['W', '职场沟通']].map(([prefix, label]) => `${label} ${chapters.filter(ch => ch.id.startsWith(prefix)).length} 章`).join(' · ')}</p><div className="heading-extra"><span className="local-badge"><Leaf size={14} />个人学习</span><IconButton icon={SlidersHorizontal} label="学习设置" onClick={() => navigate('profile')} /></div></div>
      <section className="resume-band"><div className="resume-main"><div className="resume-copy"><h2>{resume.title}</h2><p lang="en">{resume.english}</p></div><button className="primary" onClick={() => openChapter(resume.id)}>{data.last ? '继续学习' : '开始学习'}<ArrowRight size={17} /></button></div></section>
      <div className="progress-strip"><span><Bookmark size={14} />{data.favorites.length} 句收藏</span></div>
      <section className="catalog-section"><div className="section-top"><h2>场景章节 <span>{filtered.length}</span></h2><div className="segmented" aria-label="章节分类">{[['daily', '日常'], ['travel', '旅行'], ['work', '职场'], ['all', '全部']].map(([id, label]) => <button key={id} aria-pressed={filter === id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>)}</div></div>
      <label className="search-field"><Search size={18} /><input aria-label="搜索章节" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索场景或英文表达" />{query && <IconButton icon={X} label="清空搜索" onClick={() => setQuery('')} />}</label>
      {groupNames.map((name, groupIndex) => <section className="chapter-group" key={name}><div className="group-heading"><span className={`group-line color-${groupIndex % 4}`} /><h3>{name}</h3><span>{filtered.filter(ch => ch.group === name).length} 章</span></div><div className="chapter-grid">{filtered.filter(ch => ch.group === name).map(ch => {
        const Icon = icons[ch.icon] || BookOpen;
        return <button className={`chapter-card ${ch.id === data.last ? 'last-visited' : ''}`} key={ch.id} onClick={() => openChapter(ch.id)}><span className={`chapter-icon color-${groupIndex % 4}`}><Icon size={24} strokeWidth={1.65} /></span><div className="chapter-copy"><div className="chapter-label"><span>{chapterLabel(ch.id)} {ch.id.slice(1)}</span><span className="status-ready">文稿初稿</span></div><h4>{ch.title}</h4><p>{ch.task}</p></div><ChevronRight className="card-arrow" size={18} /></button>;
      })}</div></section>)}
      {!filtered.length && <div className="empty-state"><Search size={30} /><h3>没有找到相关章节</h3><button className="text-button" onClick={() => { setQuery(''); setFilter('all'); }}>查看全部章节<ArrowRight size={15} /></button></div>}</section>
    </>;
  }

  function lessonView() {
    return <><div className="lesson-heading"><span className="eyebrow green">{chapterLabel(chapter.id)} {chapter.id.slice(1)}<span className="divider-dot" />{chapter.group}</span><h1>{chapter.title}</h1><p lang="en">{chapter.english}</p></div>
      <div className="scenario"><span className="scenario-label">这次的场景</span><p>{lesson.scenario}</p></div>
      <div className="lesson-tabs" role="tablist" aria-label="学习内容">{[['core', '核心句'], ['dialogue', '对话练习'], ['branch', '场景变化'], ['reference', '语句速查']].map(([id, label]) => <button role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} key={id} onClick={() => switchTab(id)}>{label}{id === 'core' && <span>{lesson.lines.length}</span>}</button>)}<IconButton icon={data.chinese ? Eye : EyeOff} label={data.chinese ? '隐藏中文' : '显示中文'} aria-pressed={data.chinese} onClick={() => change({ chinese: !data.chinese })} /></div>
      {(tab === 'dialogue' || tab === 'branch') && groups.length > 0 && <div className="dialogue-picker">{groups.map((d, i) => <button className={part === i ? 'active' : ''} key={d.title} onClick={() => { stop(); setPart(i); setPlayback({ status: 'idle', id: '', index: 0 }); }}>{d.title}</button>)}</div>}
      {tab === 'reference' ? <ol className="quick-reference-list">{lesson.quickReference.map((entry, i) => {
        const playingTerm = playback.id === entry.id && playback.status !== 'idle';
        const playingExample = playback.id === `${entry.id}-EX` && playback.status !== 'idle';
        return <li className="quick-reference-entry" key={entry.id} data-reference={entry.id}>
          <div className={`reference-heading ${playingTerm ? 'reference-playing' : ''}`} data-sentence={entry.id}><div><h3 lang="en">{entry.en}</h3>{data.chinese && <p className="reference-meaning">{entry.zh}</p>}</div><IconButton icon={playingTerm ? Pause : Volume2} label={playingTerm ? '停止朗读' : `朗读词语：${entry.en}`} onClick={() => playingTerm ? stop() : speak(i * 2)} /></div>
          <div className="reference-phonetics">{entry.keyword !== entry.en && <span className="reference-keyword">关键词 {entry.keyword}</span>}<span>英 /{entry.phonetics.uk}/</span><span>美 /{entry.phonetics.us}/</span></div>
          <p className="reference-note">{entry.note}</p>
          <div className={`reference-example ${playingExample ? 'reference-playing' : ''}`} data-sentence={`${entry.id}-EX`}><button className="reference-example-read" aria-label={playingExample ? '停止朗读例句' : `朗读例句：${entry.exampleEn}`} onClick={() => playingExample ? stop() : speak(i * 2 + 1)}><Volume2 size={16} aria-hidden="true" /><span lang="en">{entry.exampleEn}</span></button>{data.chinese && <p className="reference-example-translation">{entry.exampleZh}</p>}</div>
        </li>;
      })}</ol> : <div className="sentence-list">{lines.map((s, i) => sentenceRow(s, i, tab === 'core' ? 'core' : 'dialogue'))}</div>}
      {!lines.length && <div className="empty-state"><BookOpen size={32} /><h3>这部分文稿还在整理中</h3><button className="text-button" onClick={() => switchTab('core')}>查看核心句<ArrowRight size={16} /></button></div>}
      {(chapter.ready || chapter.sample) && tab === 'core' && <div className="lesson-end"><button className="text-button" onClick={() => switchTab('dialogue')}>进入对话练习<ArrowRight size={16} /></button></div>}
    </>;
  }
  function favoritesView() {
    return <><div className="page-heading"><div><span className="eyebrow">WORDS TO KEEP</span><h1>我的收藏<span className="heading-dot coral">.</span></h1><p>{data.favorites.length} 句想记住的表达。</p></div><span className="large-page-icon coral"><Bookmark size={32} strokeWidth={1.5} /></span></div><label className="search-field"><Search size={18} /><input aria-label="搜索收藏" placeholder="搜索英文或中文" value={favoriteQuery} onChange={e => setFavoriteQuery(e.target.value)} />{favoriteQuery && <IconButton icon={X} label="清空搜索" onClick={() => setFavoriteQuery('')} />}</label><div className="sentence-list">{lines.map((s, i) => sentenceRow(s, i, 'favorite'))}</div>{!lines.length && <div className="empty-state"><Bookmark size={34} strokeWidth={1.5} /><h3>{favoriteQuery ? '没有找到匹配的表达' : '还没有收藏的句子'}</h3><button className="text-button" onClick={() => favoriteQuery ? setFavoriteQuery('') : navigate('chapters')}>{favoriteQuery ? '查看所有收藏' : '去选一章学习'}<ArrowRight size={16} /></button></div>}</>;
  }
  function profileView() {
    return <><div className="page-heading"><div><span className="eyebrow">YOUR LEARNING SPACE</span><h1>我的学习<span className="heading-dot">.</span></h1><p>按自己的节奏，一句一句积累。</p></div><span className="large-page-icon"><CircleUserRound size={32} strokeWidth={1.5} /></span></div><section className="stats-band"><div><strong>{data.favorites.length}</strong><span>收藏表达</span></div></section><section className="settings-section"><h2>朗读与阅读</h2><div className="setting-row"><div><span>播放语速</span><small>英文朗读</small></div><select aria-label="默认播放语速" value={data.speed} onChange={e => { stop(); change({ speed: Number(e.target.value) }); }}><option value="0.75">0.75×</option><option value="1">1.0×</option><option value="1.25">1.25×</option></select></div><div className="setting-row"><div><span>英语音色</span><small>{voices.length ? '设备可用音色' : '使用设备默认英语音色'}</small></div><select aria-label="英语音色" value={data.voice} onChange={e => { stop(); change({ voice: e.target.value }); }}><option value="">默认英语音色</option>{voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}{isNative ? (v.localService ? " · 离线" : " · 联网") : ""}</option>)}</select></div><div className="setting-row"><span>中文释义</span><label className="toggle"><input type="checkbox" aria-label="显示中文释义" checked={data.chinese} onChange={e => change({ chinese: e.target.checked })} /><span /></label></div><div className="setting-row"><span>英文字号</span><div className="segmented">{[18, 20, 22].map(size => <button key={size} className={data.fontSize === size ? 'active' : ''} aria-pressed={data.fontSize === size} onClick={() => change({ fontSize: size })}>{size === 18 ? '标准' : size === 20 ? '较大' : '大'}</button>)}</div></div></section><section className="settings-section"><h2>学习记录</h2><div className="setting-row"><span>导出记录</span><button className="secondary" disabled={exporting} onClick={exportRecords}><Download size={16} />{exporting ? "导出中" : "导出"}</button></div><div className="setting-row"><span>导入并合并记录</span><button className="secondary" onClick={() => importRef.current.click()}><Upload size={16} />导入</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importRecords} /></div></section></>;
  }

  const currentIndex = Math.max(0, lines.findIndex(s => s.id === activeLine?.id));
  return <div className={`app-shell ${page === 'lesson' || page === 'favorites' && lines.length ? 'has-player' : ''}`} style={{ '--english-size': `${data.fontSize}px` }}>
    <aside className="sidebar"><Brand /><nav aria-label="主导航">{nav}</nav><div className="sidebar-bottom"><Headphones size={18} /><span>一点时间，一点进步。</span></div></aside>
    <div className="main-shell"><header className={`topbar ${page === 'lesson' ? 'lesson-topbar' : ''}`}>{page === 'lesson' ? <><IconButton icon={ArrowLeft} label="返回章节" onClick={() => navigate('chapters')} /><span>{chapter.title}</span><IconButton icon={SlidersHorizontal} label="学习设置" onClick={() => navigate('profile')} /></> : <><Brand /><span className="topbar-label">生活里的每一句</span><IconButton icon={CircleUserRound} label="我的学习" onClick={() => navigate('profile')} /></>}</header><main id="main" className={page === 'lesson' ? 'lesson-main' : ''}>{page === 'chapters' ? catalog() : page === 'lesson' ? lessonView() : page === 'favorites' ? favoritesView() : profileView()}</main></div>
    {(page === 'lesson' || page === 'favorites') && lines.length > 0 && <div className="player"><div className="player-inner"><div className="player-info"><span className="player-counter">{String(currentIndex + 1).padStart(2, '0')}<span> / {String(lines.length).padStart(2, '0')}</span></span><span className="player-title">{playback.status === 'loading' ? '正在准备朗读' : playback.status === 'playing' ? '正在朗读' : playback.status === 'paused' ? '已暂停' : '顺序播放'}</span></div><div className="player-controls"><IconButton icon={SkipBack} label="上一句" disabled={currentIndex === 0} onClick={() => speak(currentIndex - 1)} /><IconButton icon={playback.status === 'playing' || playback.status === 'loading' ? Pause : Play} label={playback.status === 'loading' ? '停止播放' : playback.status === 'playing' ? '暂停播放' : playback.status === 'paused' ? '继续播放' : '顺序播放'} className="play-main" onClick={() => togglePlayback(currentIndex)} /><IconButton icon={SkipForward} label="下一句" disabled={currentIndex === lines.length - 1} onClick={() => speak(currentIndex + 1)} /></div><select className="speed-select" aria-label="播放语速" value={data.speed} onChange={e => { stop(); change({ speed: Number(e.target.value) }); }}><option value="0.75">0.75×</option><option value="1">1.0×</option><option value="1.25">1.25×</option></select></div><div className="player-progress"><span style={{ width: `${(currentIndex + 1) / lines.length * 100}%` }} /></div></div>}
    <nav className="bottom-nav" aria-label="底部导航">{nav}</nav>
    {toast && <div className="toast" role="status"><span>{toast}</span><IconButton icon={X} label="关闭提示" onClick={() => setToast('')} /></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
