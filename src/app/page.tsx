'use client';

import { X, Flame, Clock, ChevronRight, CheckCircle2, Calendar, MoreHorizontal, Plus, Check, ChevronDown, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WEEKLY_CONFIG, DayConfig } from '@/config/tasks';

const MF_BLUE = '#0066EE';
const MF_BG = '#F2F2F7';
const DAYS_SINGLE = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Home() {
  const router = useRouter();
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [currentDayConfig, setCurrentDayConfig] = useState<DayConfig | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Update current time every 10 seconds to refresh timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Load from localStorage whenever selectedDateStr changes
  useEffect(() => {
    const selectedDate = new Date(selectedDateStr);
    const dayOfWeek = selectedDate.getDay();
    const defaultConfig = WEEKLY_CONFIG.find(c => c.dayNumber === dayOfWeek) || WEEKLY_CONFIG[1];

    // Load from localStorage
    const savedData = localStorage.getItem(`study-owl-tasks-${selectedDateStr}`);
    if (savedData) {
      try {
        const savedTasks = JSON.parse(savedData);
        const mergedTasks = defaultConfig.tasks.map(defaultTask => {
          const savedTask = savedTasks.find((t: any) => t.id === defaultTask.id);
          if (savedTask) {
            return {
              ...defaultTask,
              status: savedTask.status,
              subtitle: savedTask.subtitle,
              startTime: savedTask.startTime,
              duration: savedTask.duration
            };
          }
          return defaultTask;
        });
        setCurrentDayConfig({ ...defaultConfig, tasks: mergedTasks });
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
        setCurrentDayConfig(defaultConfig);
      }
    } else {
      setCurrentDayConfig(defaultConfig);
    }
  }, [selectedDateStr]);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (currentDayConfig) {
      const serializableTasks = currentDayConfig.tasks.map(({ id, status, subtitle, startTime, duration }) => ({
        id, status, subtitle, startTime, duration
      }));
      localStorage.setItem(`study-owl-tasks-${selectedDateStr}`, JSON.stringify(serializableTasks));
    }
  }, [currentDayConfig, selectedDateStr]);

  const handleTaskClick = (taskId: string) => {
    if (!currentDayConfig) return;

    // Only allow starting/completing tasks for the current day
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = selectedDateStr === todayStr;
    if (!isToday) return;

    // 复习错别字任务：跳转到专用页面
    if (taskId === '2') {
      router.push('/review-chars');
      return;
    }

    const taskIndex = currentDayConfig.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = currentDayConfig.tasks[taskIndex];

    let updatedTasks = currentDayConfig.tasks;

    if (task.status === 'todo' || task.status === 'locked') {
      // First click: Start timer
      updatedTasks = currentDayConfig.tasks.map((t, index) => {
        if (index === taskIndex) {
          return { ...t, status: 'in-progress' as const, subtitle: '进行中', startTime: Date.now() };
        }
        return t;
      });
    } else if (task.status === 'in-progress') {
      // Second click: Stop timer
      const endTime = Date.now();
      const startTime = task.startTime || endTime;
      const durationMs = endTime - startTime;
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      const durationStr = `${minutes}分${seconds}秒`;

      updatedTasks = currentDayConfig.tasks.map((t, index) => {
        if (index === taskIndex) {
          return { ...t, status: 'completed' as const, subtitle: '已完成', duration: durationStr };
        }
        return t;
      });
    } else if (task.status === 'completed') {
      // Prompt to reset if completed
      if (confirm('该任务已完成，是否要重置并重新开始？')) {
        updatedTasks = currentDayConfig.tasks.map((t, index) => {
          if (index === taskIndex) {
            return { ...t, status: 'todo' as const, subtitle: undefined, duration: undefined, startTime: undefined };
          }
          return t;
        });
      } else {
        return;
      }
    } else {
      return;
    }

    setCurrentDayConfig({
      ...currentDayConfig,
      tasks: updatedTasks
    });
  };

  // Helper function to parse duration string "X分Y秒" into total seconds
  const parseDurationToSeconds = (durationStr: string): number => {
    const minutesMatch = durationStr.match(/(\d+)分/);
    const secondsMatch = durationStr.match(/(\d+)秒/);
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
    return minutes * 60 + seconds;
  };

  // Helper function to format total seconds back to "X分Y秒"
  const formatSecondsToDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${seconds}秒`;
  };

  if (!currentDayConfig) return null;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isToday = selectedDateStr === todayStr;
  
  const selectedDateObj = new Date(selectedDateStr);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const completedTasks = currentDayConfig.tasks.filter(t => t.status === 'completed');
  const totalTasks = currentDayConfig.tasks.length;
  const progressPercent = (completedTasks.length / totalTasks) * 100;

  const totalCompletedDurationSeconds = currentDayConfig.tasks.reduce((sum, task) => {
    if (task.status === 'completed' && task.duration) {
      return sum + parseDurationToSeconds(task.duration);
    }
    return sum;
  }, 0);

  const totalCompletedDuration = formatSecondsToDuration(totalCompletedDurationSeconds);

  return (
    <div className="bg-[#D8E5EE] min-h-screen font-sans text-[#333]">
      <div className="max-w-md mx-auto bg-transparent min-h-screen flex flex-col pb-10">

        {/* Redesigned Header based on Image */}
        <div className="pt-2 pb-6 px-4 rounded-b-[32px] mb-2">

          {/* User & Title Row */}
          <div className="flex justify-between items-center px-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/30 overflow-hidden">
                <img
                  src="https://cartea-hz.oss-cn-hangzhou.aliyuncs.com/test.png"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowCalendar(!showCalendar)}>
                <h1 className="text-2xl font-black text-black">
                  {isToday ? 'Today' : DAYS_FULL[selectedDayOfWeek]}
                </h1>
                <ChevronDown className={`w-5 h-5 mt-1 text-black transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 pr-2 ">
              <Clock className="w-4 h-4" />
              <span className="font-bold text-lg">{totalCompletedDuration}</span>
            </div>
          </div>

          {/* Calendar Row */}
          {showCalendar && (() => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const days = [];
            for (let i = 0; i < firstDayOfMonth; i++) {
              days.push(null);
            }
            for (let i = 1; i <= daysInMonth; i++) {
              days.push(new Date(year, month, i));
            }

            return (
              <div className="flex flex-col gap-2 px-2 py-4">
                <div className="flex justify-between items-center px-4 mb-2">
                  <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
                    <ChevronRight className="w-5 h-5 rotate-180 text-gray-600" />
                  </button>
                  <span className="font-bold text-gray-800">{year}年{month + 1}月</span>
                  <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-y-3 gap-x-1">
                  {DAYS_SINGLE.map((day, idx) => (
                    <div key={`header-${idx}`} className="text-center text-[11px] font-bold text-gray-400 py-1">
                      {day}
                    </div>
                  ))}
                  {days.map((dateObj, idx) => {
                    if (!dateObj) return <div key={`empty-${idx}`} />;
                    
                    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                    const isSelected = selectedDateStr === dateStr;
                    const isTodayItem = dateStr === todayStr;
                    
                    return (
                      <div key={dateStr} className="flex flex-col items-center gap-1.5 flex-1">
                        <button
                          onClick={() => {
                            setSelectedDateStr(dateStr);
                            if (dateObj.getMonth() !== currentMonth.getMonth()) {
                               setCurrentMonth(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
                            }
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                            ? 'bg-black text-white shadow-lg transform scale-110'
                            : 'border border-transparent text-gray-600 hover:border-gray-300'
                            }`}
                        >
                          <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{dateObj.getDate()}</span>
                        </button>
                        <div className="h-1 flex items-center justify-center">
                          {isTodayItem && !isSelected && <div className="w-1 h-1 bg-gray-400 rounded-full"></div>}
                          {isSelected && <div className="w-1 h-1 bg-gray-500 rounded-full"></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>


        {/* Task Cards with Gaps */}
        <div className="px-4 flex flex-col gap-3">
          {currentDayConfig.tasks.map((task) => {
            const Icon = task.icon;
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in-progress';

            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={`flex items-center gap-4 p-5 rounded-[24px] bg-[#EBECEF] transition-all ${!isToday ? 'opacity-60 cursor-default' : 'hover:bg-[#E5E7EB] cursor-pointer active:scale-[0.98]'
                  }`}
              >
                {/* Icon Container */}
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 text-[#0066EE]`} />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-base leading-tight text-black`}>
                    {task.title}
                  </h4>
                  <div className="flex flex-col mt-0.5">
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{task.duration}</span>
                      </div>
                    ) : isInProgress ? (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#0066EE]">
                        <span>进行中</span>
                        <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                        <span>{Math.max(0, Math.floor((now - (task.startTime || now)) / 60000))}</span>
                        <span>分钟</span>
                      </div>
                    ) : (
                      <p className={`text-sm font-medium text-gray-500`}>
                        {task.subtitle || (task.id === '2' ? '' : '等待开始')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isCompleted ? 'bg-[#D8E2ED] text-[#0066EE]' :
                      isInProgress ? 'bg-[#0066EE] text-white animate-pulse' : 'bg-[#D8E2ED] text-[#0066EE]'
                      }`}
                  >
                    {task.id === '2' ? (
                      <ChevronRight className="w-5 h-5 stroke-[3]" />
                    ) : isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : isInProgress ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[3]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Tip */}
        <div className="mt-auto p-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{currentDayConfig.advice}</span>
          </div>
        </div>

      </div>
    </div>
  );
}