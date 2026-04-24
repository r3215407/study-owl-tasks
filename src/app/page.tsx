'use client';

import { X, Flame, Clock, ChevronRight, CheckCircle2, Lock, Calendar, MoreHorizontal, Plus, Check, ChevronDown, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WEEKLY_CONFIG, DayConfig } from '@/config/tasks';

const MF_BLUE = '#0066EE';
const MF_BG = '#F2F2F7';
const DAYS_SINGLE = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [currentDayConfig, setCurrentDayConfig] = useState<DayConfig | null>(null);

  // Load from localStorage whenever selectedDay changes
  useEffect(() => {
    const defaultConfig = WEEKLY_CONFIG.find(c => c.dayNumber === selectedDay) || WEEKLY_CONFIG[1];

    // Load from localStorage
    const savedData = localStorage.getItem(`study-owl-tasks-${selectedDay}`);
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
  }, [selectedDay]);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (currentDayConfig) {
      const serializableTasks = currentDayConfig.tasks.map(({ id, status, subtitle, startTime, duration }) => ({
        id, status, subtitle, startTime, duration
      }));
      localStorage.setItem(`study-owl-tasks-${currentDayConfig.dayNumber}`, JSON.stringify(serializableTasks));
    }
  }, [currentDayConfig]);

  const handleTaskClick = (taskId: string) => {
    if (!currentDayConfig) return;

    // Only allow starting/completing tasks for the current day
    const isToday = selectedDay === new Date().getDay();
    if (!isToday) return;

    const taskIndex = currentDayConfig.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = currentDayConfig.tasks[taskIndex];

    let updatedTasks = currentDayConfig.tasks;

    if (task.status === 'todo') {
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
        // If we just completed a task, unlock the next one
        if (index === taskIndex + 1 && t.status === 'locked') {
          return { ...t, status: 'todo' as const };
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
      // Do nothing for 'locked' tasks on click
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

  const isToday = selectedDay === new Date().getDay();
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
              <div className="flex items-center gap-1 cursor-pointer">
                <h1 className="text-2xl font-black text-black">
                  {isToday ? 'Today' : DAYS_FULL[selectedDay]}
                </h1>
                <ChevronDown className="w-5 h-5 mt-1 text-black" />
              </div>
            </div>
            <div className="flex items-center gap-1 pr-2">
              <Clock className="w-4 h-4 fill-black text-black" />
              <span className="font-bold text-lg">{totalCompletedDuration}</span>
            </div>
          </div>

          {/* Calendar Row */}
          <div className="flex justify-between px-2">
            {DAYS_SINGLE.map((day, idx) => {
              const isSelected = selectedDay === idx;
              const isTodayItem = new Date().getDay() === idx;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-1 flex items-center justify-center">
                    {isSelected && <div className="w-1 h-1 bg-gray-500 rounded-full"></div>}
                  </div>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                    {day}
                  </span>
                  <button
                    onClick={() => setSelectedDay(idx)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                      ? 'bg-black text-white shadow-lg transform scale-110'
                      : 'border border-gray-300 text-gray-400 hover:border-gray-500'
                      }`}
                  >
                    {isSelected ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      isTodayItem && <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>


        {/* Task List Header */}
        <div className="px-5 py-4 flex justify-between items-end">
          <h3 className="text-2xl font-bold text-black">任务</h3>
          <button className="text-sm font-medium text-black hover:opacity-70 transition-opacity">查看全部</button>
        </div>

        {/* Task Cards with Gaps */}
        <div className="px-4 flex flex-col gap-3">
          {currentDayConfig.tasks.map((task) => {
            const Icon = task.icon;
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in-progress';
            const isLocked = task.status === 'locked';

            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={`flex items-center gap-4 p-5 rounded-[24px] bg-[#EBECEF] transition-all ${isLocked || !isToday ? 'opacity-60 cursor-default' : 'hover:bg-[#E5E7EB] cursor-pointer active:scale-[0.98]'
                  }`}
              >
                {/* Icon Container */}
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${isLocked ? 'text-gray-400' : 'text-[#0066EE]'}`} />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-base leading-tight ${isLocked ? 'text-gray-500' : 'text-black'}`}>
                    {task.title}
                  </h4>
                  <div className="flex flex-col mt-0.5">
                    <p className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.subtitle || (isLocked ? 'Locked' : '等待开始')}
                    </p>
                    {task.duration && (
                      <span className="text-xs text-gray-400 font-medium">
                        {task.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isCompleted ? 'bg-[#D8E2ED] text-[#0066EE]' :
                      isInProgress ? 'bg-[#0066EE] text-white animate-pulse' :
                        isLocked ? 'bg-gray-200 text-gray-400' : 'bg-[#D8E2ED] text-[#0066EE]'
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : isInProgress ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
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