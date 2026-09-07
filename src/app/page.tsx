'use client';

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FishSymbol,
  Play,
  RotateCcw,
  Timer,
  Trophy,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DayConfig, WEEKLY_CONFIG } from '@/config/tasks';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDuration(value?: string) {
  if (!value) return 0;
  const minutes = Number(value.match(/(\d+)分/)?.[1] ?? 0);
  const seconds = Number(value.match(/(\d+)秒/)?.[1] ?? 0);
  return minutes * 60 + seconds;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${String(seconds).padStart(2, '0')}秒`;
}

function SharkBadge({ progress }: { progress: number }) {
  return (
    <div className="shark-visual" aria-label={`鲨鱼能量 ${progress}%`}>
      <Image
        src="/assets/shark-megalodon-stylized.png"
        alt="橙色轮廓光下的卡通巨齿鲨"
        fill
        priority
        sizes="(max-width: 540px) 44vw, 300px"
      />
      <span className="shark-caption">鲨鱼能量 {progress}%</span>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const todayKey = toDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [dayConfig, setDayConfig] = useState<DayConfig | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const date = new Date(`${selectedDate}T12:00:00`);
    const defaults = WEEKLY_CONFIG.find((item) => item.dayNumber === date.getDay()) ?? WEEKLY_CONFIG[1];
    const stored = localStorage.getItem(`study-owl-tasks-${selectedDate}`);
    let nextConfig = defaults;
    if (!stored) {
      const timer = window.setTimeout(() => setDayConfig(nextConfig), 0);
      return () => window.clearTimeout(timer);
    }
    try {
      const savedTasks = JSON.parse(stored) as DayConfig['tasks'];
      nextConfig = {
        ...defaults,
        tasks: defaults.tasks.map((task) => ({ ...task, ...savedTasks.find((saved) => saved.id === task.id), icon: task.icon })),
      };
    } catch { /* Fall back to the weekday defaults. */ }
    const timer = window.setTimeout(() => setDayConfig(nextConfig), 0);
    return () => window.clearTimeout(timer);
  }, [selectedDate]);

  useEffect(() => {
    if (!dayConfig) return;
    const tasks = dayConfig.tasks.map(({ id, status, subtitle, startTime, duration }) => ({ id, status, subtitle, startTime, duration }));
    localStorage.setItem(`study-owl-tasks-${selectedDate}`, JSON.stringify(tasks));
  }, [dayConfig, selectedDate]);

  const completed = dayConfig?.tasks.filter((task) => task.status === 'completed').length ?? 0;
  const total = dayConfig?.tasks.length ?? 0;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const isToday = selectedDate === todayKey;
  const selectedDateObject = new Date(`${selectedDate}T12:00:00`);
  const totalTime = dayConfig?.tasks.reduce((sum, task) => sum + parseDuration(task.duration), 0) ?? 0;

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const leading = new Date(year, month, 1).getDay();
    const length = new Date(year, month + 1, 0).getDate();
    return [...Array.from({ length: leading }, () => null), ...Array.from({ length }, (_, index) => new Date(year, month, index + 1))];
  }, [calendarMonth]);

  const handleTask = (taskId: string) => {
    if (!dayConfig || !isToday) return;
    if (taskId === '1') return router.push('/review-problems');
    if (taskId === '2') return router.push('/review-chars');
    const task = dayConfig.tasks.find((item) => item.id === taskId);
    if (!task) return;

    if (task.status === 'completed') {
      if (!window.confirm('要让这项任务重新出发吗？')) return;
      setDayConfig({
        ...dayConfig,
        tasks: dayConfig.tasks.map((item) => item.id === taskId
          ? { ...item, status: 'todo', subtitle: undefined, duration: undefined, startTime: undefined }
          : item),
      });
      return;
    }

    const completing = task.status === 'in-progress';
    setDayConfig({
      ...dayConfig,
      tasks: dayConfig.tasks.map((item) => {
        if (item.id !== taskId) return item;
        if (!completing) return { ...item, status: 'in-progress', subtitle: '潜航中', startTime: Date.now() };
        return {
          ...item,
          status: 'completed',
          subtitle: '已完成',
          duration: formatDuration(Math.max(1, Math.round((Date.now() - (item.startTime ?? Date.now())) / 1000))),
        };
      }),
    });
  };

  if (!dayConfig) return <main className="ocean-app" />;

  return (
    <main className="ocean-app">
      <div className="app-shell">
        <header className="command-header">
          <div className="brand-row">
            <div className="brand-mark" aria-hidden="true"><FishSymbol size={24} strokeWidth={2.6} /></div>
            <div><h1>鲨鱼任务局</h1><p className="brand-subtitle">每日学习训练</p></div>
            <div className="streak" title="今日完成任务"><Trophy size={18} /><span><b>{completed}</b> / {total}</span></div>
          </div>

          <section className="mission-brief" aria-labelledby="mission-title">
            <div className="brief-copy">
              <h2 id="mission-title">向深海前进</h2>
              <p>{completed === total ? '任务全部完成，今天的你是深海之王！' : `完成 ${total - completed} 项训练，给小鲨鱼补满能量。`}</p>
              <div className="progress-track" aria-label={`今日进度 ${progress}%`}><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
              <div className="progress-meta"><strong>{progress}%</strong><span>{completed} / {total} 已完成</span></div>
            </div>
            <SharkBadge progress={progress} />
          </section>
        </header>

        <section className="mission-content">
          <div className="date-toolbar">
            <button className="date-trigger" onClick={() => setCalendarOpen((value) => !value)} aria-expanded={calendarOpen}>
              <CalendarDays size={18} />
              <span>{isToday ? '今天' : `${selectedDateObject.getMonth() + 1}月${selectedDateObject.getDate()}日`} · 周{WEEKDAYS[selectedDateObject.getDay()]}</span>
              <ChevronDown size={17} className={calendarOpen ? 'rotate' : ''} />
            </button>
            <div className="time-stat"><Clock3 size={17} /><span>训练 {formatDuration(totalTime)}</span></div>
          </div>

          {calendarOpen && (
            <div className="calendar-panel">
              <div className="calendar-head">
                <button aria-label="上个月" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><ChevronLeft /></button>
                <strong>{calendarMonth.getFullYear()} / {String(calendarMonth.getMonth() + 1).padStart(2, '0')}</strong>
                <button aria-label="下个月" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}><ChevronRight /></button>
              </div>
              <div className="calendar-grid weekday-row">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
              <div className="calendar-grid">
                {calendarDays.map((date, index) => date ? (
                  <button
                    key={toDateKey(date)}
                    className={`${toDateKey(date) === selectedDate ? 'selected' : ''} ${toDateKey(date) === todayKey ? 'today' : ''}`}
                    onClick={() => { setSelectedDate(toDateKey(date)); setCalendarOpen(false); }}
                  >{date.getDate()}</button>
                ) : <span key={`empty-${index}`} />)}
              </div>
            </div>
          )}

          <div className="section-heading">
            <div><h2>训练清单</h2></div>
            <span>{isToday ? '点击任务开始计时' : '历史记录只读'}</span>
          </div>

          <div className="task-list">
            {dayConfig.tasks.map((task, index) => {
              const Icon = task.icon;
              const reviewTask = task.id === '1' || task.id === '2';
              const active = task.status === 'in-progress';
              const done = task.status === 'completed';
              const elapsed = active && now && task.startTime ? Math.max(0, Math.floor((now - task.startTime) / 1000)) : 0;
              return (
                <button key={task.id} className={`mission-task ${active ? 'active' : ''} ${done ? 'done' : ''}`} onClick={() => handleTask(task.id)} disabled={!isToday}>
                  <span className="task-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="task-icon"><Icon size={23} /></span>
                  <span className="task-copy">
                    <strong>{task.title}</strong>
                    <small>{done ? `用时 ${task.duration}` : active ? `潜航计时 ${formatDuration(elapsed)}` : reviewTask ? '进入专项复习舱' : '准备就绪'}</small>
                  </span>
                  <span className="task-action" aria-hidden="true">{done ? <Check /> : active ? <Timer /> : reviewTask ? <ChevronRight /> : <Play />}</span>
                </button>
              );
            })}
          </div>

          <aside className="captain-note"><RotateCcw size={18} /><p><span>船长提示</span>{dayConfig.advice.replace(/[“”]/g, '')}</p></aside>
        </section>
      </div>
    </main>
  );
}
