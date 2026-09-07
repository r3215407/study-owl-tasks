'use client';

import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, PencilLine, X, Sparkles } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MisspelledChar,
  formatDate,
  getNextReviewDate,
  loadMisspelledChars,
  saveMisspelledChars,
  getReviewCharsForDate,
  getCharsCreatedOnDate,
  getCharsReviewedOnDate,
  REVIEW_INTERVALS,
} from '@/types/misspelled';

export default function ReviewCharsPage() {
  const router = useRouter();
  const [chars, setChars] = useState<MisspelledChar[]>([]);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0-indexed
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCharInput, setNewCharInput] = useState('');
  const [newCharDate, setNewCharDate] = useState<string>(formatDate(new Date()));
  const [viewingDate, setViewingDate] = useState<string | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const todayStr = formatDate(new Date());

  // Load from localStorage
  useEffect(() => {
    const timer = window.setTimeout(() => setChars(loadMisspelledChars()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Save to localStorage whenever chars change
  const saveChars = useCallback((updated: MisspelledChar[]) => {
    setChars(updated);
    saveMisspelledChars(updated);
  }, []);

  // --- Calendar Logic ---
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
  // Convert to Monday-first: 0=Mon, 1=Tue, ..., 6=Sun
  const firstDayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const getDateStr = (day: number) => {
    const m = String(calendarMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${calendarYear}-${m}-${d}`;
  };

  // --- Today's review list ---
  const todayReviewChars = getReviewCharsForDate(chars, todayStr, 10);
  // Check which ones have been reviewed today already
  const todayReviewedIds = new Set(
    chars.filter(c => c.reviewDates.includes(todayStr)).map(c => c.id)
  );

  // --- Viewing date info ---
  const viewDateCharsCreated = viewingDate ? getCharsCreatedOnDate(chars, viewingDate) : [];
  const viewDateCharsReviewed = viewingDate ? getCharsReviewedOnDate(chars, viewingDate) : [];

  // --- Handlers ---
  const openAddModal = () => {
    setNewCharDate(todayStr);
    setNewCharInput('');
    setShowAddModal(true);
  };

  const handleAddChars = () => {
    if (!newCharInput.trim()) return;
    // Split by comma, space, or newline
    const newCharsArr = newCharInput
      .split(/[,，\s\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newEntries: MisspelledChar[] = newCharsArr.map(char => {
      const nextDate = getNextReviewDate(newCharDate, 0); // 录入后等待第1次复习
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        char,
        createdDate: newCharDate,
        reviewCount: 0, // 未复习过
        reviewDates: [],
        nextReviewDate: nextDate || newCharDate,
        mastered: false,
      };
    });

    saveChars([...chars, ...newEntries]);
    setNewCharInput('');
    setShowAddModal(false);
  };

  const handleReview = (charId: string) => {
    const updated = chars.map(c => {
      if (c.id !== charId) return c;
      if (c.mastered) return c;
      if (c.reviewDates.includes(todayStr)) return c; // Already reviewed today

      const newCount = c.reviewCount + 1;
      const isMastered = newCount >= REVIEW_INTERVALS.length;
      const nextDate = isMastered ? c.nextReviewDate : getNextReviewDate(c.createdDate, newCount);

      return {
        ...c,
        reviewCount: newCount,
        reviewDates: [...c.reviewDates, todayStr],
        nextReviewDate: nextDate || c.nextReviewDate,
        mastered: isMastered,
      };
    });
    saveChars(updated);
  };

  const handleDeleteChar = (charId: string) => {
    if (confirm('确定要删除这个错别字吗？')) {
      saveChars(chars.filter(c => c.id !== charId));
    }
  };

  const handleCalendarDayClick = (day: number) => {
    const dateStr = getDateStr(day);
    if (viewingDate === dateStr) {
      setViewingDate(null);
    } else {
      setViewingDate(dateStr);
    }
  };

  // --- Statistics ---
  const totalChars = chars.length;
  const masteredChars = chars.filter(c => c.mastered).length;

  return (
    <div className="review-ocean min-h-screen font-sans">
      <div className="review-shell min-h-screen flex flex-col pb-10">

        {/* Header */}
        <div className="pt-4 pb-2 px-4">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.back()}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#101D24] hover:bg-[#16262E] transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-[#F5F7F5]" />
            </button>
            <h1 className="text-2xl font-black text-[#F5F7F5]">错别字复习</h1>
          </div>
          {/* Stats bar */}
          <div className="flex items-center gap-4 px-2 mt-2 mb-1">
            <div className="flex items-center gap-1.5 text-sm text-[#A9BDC4] font-medium">
              <PencilLine className="w-4 h-4 text-[#F5D32F]" />
              <span>总计 <span className="text-[#F5F7F5] font-bold">{totalChars}</span> 字</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#A9BDC4] font-medium">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>已掌握 <span className="text-[#F5F7F5] font-bold">{masteredChars}</span> 字</span>
            </div>
          </div>
        </div>

        {/* Month Calendar */}
        <div className="px-4 mb-3">
          <div className="bg-[#101D24] rounded-lg overflow-hidden transition-all duration-300">
            <button
              type="button"
              aria-expanded={isCalendarExpanded}
              className={`flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#16262E] transition-colors ${isCalendarExpanded ? 'pb-2' : ''}`}
              onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
            >
              <h3 className="text-base font-bold text-[#F5F7F5]">复习日历</h3>
              <div className="flex items-center gap-2">
                {!isCalendarExpanded && (
                  <span className="text-sm text-[#A9BDC4] font-medium">
                    {calendarYear}年{calendarMonth + 1}月
                  </span>
                )}
                <ChevronRight className={`w-5 h-5 text-[#A9BDC4] transition-transform duration-200 ${isCalendarExpanded ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {isCalendarExpanded && (
              <div className="px-5 pb-5">
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1B3036] transition-colors active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-[#C5D2D6]" />
              </button>
              <h3 className="text-base font-bold text-[#F5F7F5]">
                {calendarYear}年{calendarMonth + 1}月
              </h3>
              <button
                onClick={nextMonth}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1B3036] transition-colors active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-[#C5D2D6]" />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 mb-2">
              {['一', '二', '三', '四', '五', '六', '日'].map(label => (
                <div key={label} className="text-center text-xs font-bold text-[#A9BDC4] py-1">
                  {label}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-11" />;
                }

                const dateStr = getDateStr(day);
                const isToday = dateStr === todayStr;
                const isViewing = dateStr === viewingDate;
                const hasCreated = getCharsCreatedOnDate(chars, dateStr).length > 0;
                const hasReviewed = getCharsReviewedOnDate(chars, dateStr).length > 0;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => handleCalendarDayClick(day)}
                    className={`h-11 flex flex-col items-center justify-center rounded-full relative transition-all duration-200
                      ${isViewing
                        ? 'bg-[#F5D32F] text-[#071117] scale-110 shadow-lg'
                        : isToday
                          ? 'bg-black text-white font-bold'
                          : 'text-[#C5D2D6] hover:bg-[#1B3036]'
                      }
                    `}
                  >
                    <span className="text-sm leading-none">{day}</span>
                    {/* Indicator dots */}
                    <div className="flex gap-0.5 mt-0.5 absolute -bottom-0.5">
                      {hasCreated && (
                        <div className={`w-1 h-1 rounded-full ${isViewing || isToday ? 'bg-[#1B3036]/70' : 'bg-red-400'}`} />
                      )}
                      {hasReviewed && (
                        <div className={`w-1 h-1 rounded-full ${isViewing || isToday ? 'bg-[#1B3036]/70' : 'bg-green-400'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#A9BDC4]">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>有录入</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>有复习</span>
              </div>
            </div>
              </div>
            )}
          </div>
        </div>

        {/* Viewing specific date detail */}
        {viewingDate && viewingDate !== todayStr && (
          <div className="px-4 mb-3">
            <div className="bg-[#101D24] rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#F5F7F5]">
                  {viewingDate} 详情
                </h3>
                <button
                  onClick={() => setViewingDate(null)}
                  className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1B3036] transition-colors"
                >
                  <X className="w-4 h-4 text-[#A9BDC4]" />
                </button>
              </div>
              {viewDateCharsCreated.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-[#A9BDC4] mb-1.5">当日录入</p>
                  <div className="flex flex-wrap gap-2">
                    {viewDateCharsCreated.map(c => (
                      <span key={c.id} className="px-3 py-1 bg-[#1B3036] rounded-full text-sm font-medium text-[#F5F7F5]">
                        {c.char}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewDateCharsReviewed.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#A9BDC4] mb-1.5">当日复习</p>
                  <div className="flex flex-wrap gap-2">
                    {viewDateCharsReviewed.map(c => (
                      <span key={c.id} className="px-3 py-1 bg-green-100 rounded-full text-sm font-medium text-green-700">
                        {c.char} ({c.reviewCount}/{REVIEW_INTERVALS.length})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewDateCharsCreated.length === 0 && viewDateCharsReviewed.length === 0 && (
                <p className="text-sm text-[#A9BDC4] text-center py-2">当日无记录</p>
              )}
            </div>
          </div>
        )}

        {/* Today's Review List */}
        <div className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-base font-bold text-[#F5F7F5]">
              今日待复习
            </h3>
            <span className="text-sm font-medium text-[#A9BDC4]">
              {todayReviewChars.length > 0
                ? `${todayReviewChars.filter(c => todayReviewedIds.has(c.id)).length}/${todayReviewChars.length} 已完成`
                : '暂无'
              }
            </span>
          </div>

          {todayReviewChars.length === 0 ? (
            <div className="bg-[#101D24] rounded-lg p-8 text-center">
              <PencilLine className="w-10 h-10 text-[#C5D2D6] mx-auto mb-3" />
              <p className="text-sm text-[#A9BDC4] font-medium">今日没有需要复习的字</p>
              <p className="text-xs text-[#C5D2D6] mt-1">点击下方按钮录入新的错别字</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {todayReviewChars.map(char => {
                const isReviewedToday = todayReviewedIds.has(char.id);
                const progress = char.reviewCount;
                const total = REVIEW_INTERVALS.length;

                return (
                  <div
                    key={char.id}
                    className={`flex items-center gap-4 p-4 rounded-md transition-all duration-200
                      ${isReviewedToday
                        ? 'bg-[#12332F]'
                        : 'bg-[#101D24] hover:bg-[#16262E] cursor-pointer active:scale-[0.98]'
                      }
                    `}
                  >
                    {/* Character */}
                    <div className="w-12 h-12 flex items-center justify-center bg-[#1B3036] rounded-md shadow-sm">
                      <span className="text-xl font-black text-[#F5D32F]">{char.char}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#F5F7F5]">
                          {char.char}
                        </span>
                        {char.mastered && (
                          <span className="text-xs bg-[#F59E0B] text-white px-2 py-0.5 rounded-full font-bold">
                            已掌握
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#A9BDC4]">已复习 {progress}/{total}</span>
                        {/* Mini progress bar */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: total }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-1.5 rounded-full transition-colors ${
                                i < progress ? 'bg-[#F5D32F]' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {!isReviewedToday ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReview(char.id); }}
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#F5D32F] text-[#071117] hover:bg-[#D8BA22] transition-colors active:scale-95 shadow-md"
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChar(char.id); }}
                        className="w-11 h-11 flex items-center justify-center rounded-full text-[#A9BDC4] hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All characters (not mastered, not due today) */}
        {(() => {
          const todayIds = new Set(todayReviewChars.map(c => c.id));
          const otherChars = chars.filter(c => !c.mastered && !todayIds.has(c.id));
          if (otherChars.length === 0) return null;
          return (
            <div className="px-4 mb-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-base font-bold text-[#F5F7F5]">待复习（未到期）</h3>
                <span className="text-sm font-medium text-[#A9BDC4]">{otherChars.length} 字</span>
              </div>
              <div className="bg-[#101D24] rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {otherChars.map(c => (
                    <div key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3036] rounded-full">
                      <span className="text-sm font-bold text-[#F5F7F5]">{c.char}</span>
                      <span className="text-xs text-[#A9BDC4]">{c.reviewCount}/{REVIEW_INTERVALS.length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mastered characters */}
        {masteredChars > 0 && (
          <div className="px-4 mb-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-base font-bold text-[#F5F7F5]">已掌握 🎉</h3>
              <span className="text-sm font-medium text-[#A9BDC4]">{masteredChars} 字</span>
            </div>
            <div className="bg-[#101D24] rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {chars.filter(c => c.mastered).map(c => (
                  <div key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] rounded-full">
                    <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                    <span className="text-sm font-bold text-[#92400E]">{c.char}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="px-4 mt-2">
          <button
            onClick={openAddModal}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-md bg-[#F5D32F] text-[#071117] font-bold text-base hover:bg-[#D8BA22] transition-all active:scale-[0.98] shadow-lg"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>录入新的错别字</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="h-8" />
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          {/* Modal Content */}
          <div className="relative w-full max-w-[720px] bg-[#1B3036] rounded-t-[28px] p-6 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-[#F5F7F5] mb-1">录入错别字</h3>
            <p className="text-sm text-[#A9BDC4] mb-4">
              选择日期并输入错别字，多个字用逗号或空格分隔
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="date"
                value={newCharDate}
                onChange={e => setNewCharDate(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#16262E] border-2 border-transparent focus:border-[#F5D32F] outline-none text-base font-medium text-[#F5F7F5] transition-colors"
              />
              <input
                type="text"
                value={newCharInput}
                onChange={e => setNewCharInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddChars(); }}
                placeholder="例如：课，做，场"
                autoFocus
                className="w-full px-4 py-3 rounded-md bg-[#16262E] border-2 border-transparent focus:border-[#F5D32F] outline-none text-base font-medium text-[#F5F7F5] placeholder:text-[#C5D2D6] transition-colors"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-md bg-[#16262E] text-[#A9BDC4] font-bold text-base hover:bg-[#16262E] transition-colors active:scale-[0.98]"
              >
                取消
              </button>
              <button
                onClick={handleAddChars}
                className="flex-1 py-3 rounded-md bg-[#F5D32F] text-[#071117] font-bold text-base hover:bg-[#D8BA22] transition-colors active:scale-[0.98] shadow-md"
              >
                确认录入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


