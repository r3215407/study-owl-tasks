'use client';

import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, History, X, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReviewProblem,
  formatDate,
  getNextReviewDate,
  loadReviewProblems,
  saveReviewProblems,
  getReviewProblemsForDate,
  getProblemsCreatedOnDate,
  getProblemsReviewedOnDate,
  REVIEW_INTERVALS,
} from '@/types/problems';

export default function ReviewProblemsPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<ReviewProblem[]>([]);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemImage, setNewProblemImage] = useState<string>('');
  const [newProblemDate, setNewProblemDate] = useState<string>(formatDate(new Date()));
  const [viewingDate, setViewingDate] = useState<string | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const todayStr = formatDate(new Date());

  // Load from localStorage
  useEffect(() => {
    setProblems(loadReviewProblems());
  }, []);

  // Save to localStorage whenever problems change
  const saveProblemsList = useCallback((updated: ReviewProblem[]) => {
    setProblems(updated);
    saveReviewProblems(updated);
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
  const todayReviewProblems = getReviewProblemsForDate(problems, todayStr, 10);
  // Check which ones have been reviewed today already
  const todayReviewedIds = new Set(
    problems.filter(p => p.reviewDates.includes(todayStr)).map(p => p.id)
  );

  // --- Viewing date info ---
  const viewDateProblemsCreated = viewingDate ? getProblemsCreatedOnDate(problems, viewingDate) : [];
  const viewDateProblemsReviewed = viewingDate ? getProblemsReviewedOnDate(problems, viewingDate) : [];

  // --- Handlers ---
  const openAddModal = () => {
    setNewProblemDate(todayStr);
    setNewProblemTitle('');
    setNewProblemImage('');
    setShowAddModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewProblemImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAddProblem = () => {
    if (!newProblemTitle.trim() && !newProblemImage) {
      alert('请至少输入描述或上传一张错题图片');
      return;
    }

    const nextDate = getNextReviewDate(newProblemDate, 0); // 录入后等待第1次复习
    const newEntry: ReviewProblem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: newProblemTitle.trim() || '未命名错题',
      image: newProblemImage || undefined,
      createdDate: newProblemDate,
      reviewCount: 0,
      reviewDates: [],
      nextReviewDate: nextDate || newProblemDate,
      mastered: false,
    };

    saveProblemsList([...problems, newEntry]);
    setNewProblemTitle('');
    setNewProblemImage('');
    setShowAddModal(false);
  };

  const handleReview = (problemId: string) => {
    const updated = problems.map(p => {
      if (p.id !== problemId) return p;
      if (p.mastered) return p;
      if (p.reviewDates.includes(todayStr)) return p; // Already reviewed today

      const newCount = p.reviewCount + 1;
      const isMastered = newCount >= REVIEW_INTERVALS.length;
      const nextDate = isMastered ? p.nextReviewDate : getNextReviewDate(p.createdDate, newCount);

      return {
        ...p,
        reviewCount: newCount,
        reviewDates: [...p.reviewDates, todayStr],
        nextReviewDate: nextDate || p.nextReviewDate,
        mastered: isMastered,
      };
    });
    saveProblemsList(updated);
  };

  const handleDeleteProblem = (problemId: string) => {
    if (confirm('确定要删除这个错题吗？')) {
      saveProblemsList(problems.filter(p => p.id !== problemId));
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
  const totalProblems = problems.length;
  const masteredProblems = problems.filter(p => p.mastered).length;

  return (
    <div className="bg-[#D8E5EE] min-h-screen font-sans text-[#333]">
      <div className="max-w-md mx-auto bg-transparent min-h-screen flex flex-col pb-10">

        {/* Header */}
        <div className="pt-4 pb-2 px-4">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#EBECEF] hover:bg-[#E0E1E4] transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-2xl font-black text-black">数学错题复习</h1>
          </div>
          {/* Stats bar */}
          <div className="flex items-center gap-4 px-2 mt-2 mb-1">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
              <History className="w-4 h-4 text-[#0066EE]" />
              <span>总计 <span className="text-black font-bold">{totalProblems}</span> 题</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>已掌握 <span className="text-black font-bold">{masteredProblems}</span> 题</span>
            </div>
          </div>
        </div>

        {/* Month Calendar */}
        <div className="px-4 mb-3">
          <div className="bg-[#EBECEF] rounded-[24px] overflow-hidden transition-all duration-300">
            <div 
              className={`flex items-center justify-between cursor-pointer px-5 py-4 hover:bg-[#E0E1E4] transition-colors ${isCalendarExpanded ? 'pb-2' : ''}`}
              onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
            >
              <h3 className="text-base font-bold text-black">复习日历</h3>
              <div className="flex items-center gap-2">
                {!isCalendarExpanded && (
                  <span className="text-sm text-gray-500 font-medium">
                    {calendarYear}年{calendarMonth + 1}月
                  </span>
                )}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCalendarExpanded ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {isCalendarExpanded && (
              <div className="px-5 pb-5">
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D8E2ED] transition-colors active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h3 className="text-base font-bold text-black">
                    {calendarYear}年{calendarMonth + 1}月
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D8E2ED] transition-colors active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Weekday Labels */}
                <div className="grid grid-cols-7 mb-2">
                  {['一', '二', '三', '四', '五', '六', '日'].map(label => (
                    <div key={label} className="text-center text-xs font-bold text-gray-400 py-1">
                      {label}
                    </div>
                  ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="h-10" />;
                    }

                    const dateStr = getDateStr(day);
                    const isToday = dateStr === todayStr;
                    const isViewing = dateStr === viewingDate;
                    const hasCreated = getProblemsCreatedOnDate(problems, dateStr).length > 0;
                    const hasReviewed = getProblemsReviewedOnDate(problems, dateStr).length > 0;

                    return (
                      <button
                        key={`day-${day}`}
                        onClick={() => handleCalendarDayClick(day)}
                        className={`h-10 flex flex-col items-center justify-center rounded-full relative transition-all duration-200
                          ${isViewing
                            ? 'bg-[#0066EE] text-white scale-110 shadow-lg'
                            : isToday
                              ? 'bg-black text-white font-bold'
                              : 'text-gray-700 hover:bg-[#D8E2ED]'
                          }
                        `}
                      >
                        <span className="text-sm leading-none">{day}</span>
                        {/* Indicator dots */}
                        <div className="flex gap-0.5 mt-0.5 absolute -bottom-0.5">
                          {hasCreated && (
                            <div className={`w-1 h-1 rounded-full ${isViewing || isToday ? 'bg-white/70' : 'bg-red-400'}`} />
                          )}
                          {hasReviewed && (
                            <div className={`w-1 h-1 rounded-full ${isViewing || isToday ? 'bg-white/70' : 'bg-green-400'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
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
            <div className="bg-[#EBECEF] rounded-[24px] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-black">
                  {viewingDate} 详情
                </h3>
                <button
                  onClick={() => setViewingDate(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#D8E2ED] transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {viewDateProblemsCreated.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-400 mb-1.5">当日录入</p>
                  <div className="flex flex-col gap-2">
                    {viewDateProblemsCreated.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-2.5 bg-[#D8E2ED] rounded-2xl">
                        {p.image && (
                          <img
                            src={p.image}
                            alt="problem"
                            onClick={() => setZoomImageUrl(p.image || null)}
                            className="w-10 h-10 object-cover rounded-lg cursor-zoom-in"
                          />
                        )}
                        <span className="text-sm font-medium text-black">{p.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewDateProblemsReviewed.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1.5">当日复习</p>
                  <div className="flex flex-col gap-2">
                    {viewDateProblemsReviewed.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2.5 bg-green-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          {p.image && (
                            <img
                              src={p.image}
                              alt="problem"
                              onClick={() => setZoomImageUrl(p.image || null)}
                              className="w-10 h-10 object-cover rounded-lg cursor-zoom-in"
                            />
                          )}
                          <span className="text-sm font-medium text-green-700">{p.title}</span>
                        </div>
                        <span className="text-xs font-bold text-green-600">({p.reviewCount}/{REVIEW_INTERVALS.length})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewDateProblemsCreated.length === 0 && viewDateProblemsReviewed.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">当日无记录</p>
              )}
            </div>
          </div>
        )}

        {/* Today's Review List */}
        <div className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-base font-bold text-black">
              今日待复习
            </h3>
            <span className="text-sm font-medium text-gray-400">
              {todayReviewProblems.length > 0
                ? `${todayReviewProblems.filter(p => todayReviewedIds.has(p.id)).length}/${todayReviewProblems.length} 已完成`
                : '暂无'
              }
            </span>
          </div>

          {todayReviewProblems.length === 0 ? (
            <div className="bg-[#EBECEF] rounded-[24px] p-8 text-center">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">今日没有需要复习的数学错题</p>
              <p className="text-xs text-gray-300 mt-1">点击下方按钮录入新的数学错题</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {todayReviewProblems.map(problem => {
                const isReviewedToday = todayReviewedIds.has(problem.id);
                const progress = problem.reviewCount;
                const total = REVIEW_INTERVALS.length;

                return (
                  <div
                    key={problem.id}
                    className={`flex items-center gap-4 p-4 rounded-[20px] transition-all duration-200
                      ${isReviewedToday
                        ? 'bg-[#E8F5E9]'
                        : 'bg-[#EBECEF] hover:bg-[#E5E7EB] cursor-pointer active:scale-[0.98]'
                      }
                    `}
                  >
                    {/* Thumbnail Image or Icon */}
                    {problem.image ? (
                      <div className="w-14 h-14 relative flex-shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <img
                          src={problem.image}
                          alt="problem thumbnail"
                          onClick={(e) => { e.stopPropagation(); setZoomImageUrl(problem.image || null); }}
                          className="w-full h-full object-cover cursor-zoom-in"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl shadow-sm">
                        <History className="w-6 h-6 text-[#0066EE]" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-black truncate block">
                          {problem.title}
                        </span>
                        {problem.mastered && (
                          <span className="text-xs bg-[#F59E0B] text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                            已掌握
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 flex-shrink-0">已复习 {progress}/{total}</span>
                        {/* Mini progress bar */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: total }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-1.5 rounded-full transition-colors ${
                                i < progress ? 'bg-[#0066EE]' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isReviewedToday ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReview(problem.id); }}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066EE] text-white hover:bg-[#0055CC] transition-colors active:scale-95 shadow-md"
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProblem(problem.id); }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
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

        {/* All problems (not mastered, not due today) */}
        {(() => {
          const todayIds = new Set(todayReviewProblems.map(p => p.id));
          const otherProblems = problems.filter(p => !p.mastered && !todayIds.has(p.id));
          if (otherProblems.length === 0) return null;
          return (
            <div className="px-4 mb-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-base font-bold text-black">待复习（未到期）</h3>
                <span className="text-sm font-medium text-gray-400">{otherProblems.length} 题</span>
              </div>
              <div className="bg-[#EBECEF] rounded-[24px] p-4 flex flex-col gap-2">
                {otherProblems.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 bg-white rounded-2xl">
                    {p.image && (
                      <img
                        src={p.image}
                        alt="problem"
                        onClick={() => setZoomImageUrl(p.image || null)}
                        className="w-9 h-9 object-cover rounded-lg cursor-zoom-in"
                      />
                    )}
                    <span className="text-sm font-bold text-black truncate flex-1">{p.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 pr-1">{p.reviewCount}/{REVIEW_INTERVALS.length}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Mastered problems */}
        {masteredProblems > 0 && (
          <div className="px-4 mb-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-base font-bold text-black">已掌握 🎉</h3>
              <span className="text-sm font-medium text-gray-400">{masteredProblems} 题</span>
            </div>
            <div className="bg-[#EBECEF] rounded-[24px] p-4 flex flex-col gap-2">
              {problems.filter(p => p.mastered).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 bg-[#FEF3C7] rounded-2xl">
                  {p.image && (
                    <img
                      src={p.image}
                      alt="problem"
                      onClick={() => setZoomImageUrl(p.image || null)}
                      className="w-9 h-9 object-cover rounded-lg cursor-zoom-in"
                    />
                  )}
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0" />
                  <span className="text-sm font-bold text-[#92400E] truncate flex-1">{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="px-4 mt-2">
          <button
            onClick={openAddModal}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-[20px] bg-[#0066EE] text-white font-bold text-base hover:bg-[#0055CC] transition-all active:scale-[0.98] shadow-lg"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>录入新的数学错题</span>
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
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] p-6 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-black mb-1">录入数学错题</h3>
            <p className="text-sm text-gray-400 mb-4">
              选择日期并填写题目描述，上传一张错题照片(支持本地存储)
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="date"
                value={newProblemDate}
                onChange={e => setNewProblemDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F2F2F7] border-2 border-transparent focus:border-[#0066EE] outline-none text-base font-medium text-black transition-colors"
              />
              
              <input
                type="text"
                value={newProblemTitle}
                onChange={e => setNewProblemTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddProblem(); }}
                placeholder="错题描述（如：多边形内角和算错）"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-[#F2F2F7] border-2 border-transparent focus:border-[#0066EE] outline-none text-base font-medium text-black placeholder:text-gray-300 transition-colors"
              />

              {/* Local Image Upload Area */}
              <div 
                onClick={triggerFileSelect}
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-[#F8F9FA] hover:bg-[#F2F3F5] cursor-pointer transition-colors"
              >
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                
                {newProblemImage ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                    <img 
                      src={newProblemImage}
                      alt="new problem preview"
                      className="max-h-full object-contain"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setNewProblemImage(''); }}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 py-2">
                    <Upload className="w-8 h-8 text-gray-300" />
                    <span className="text-sm font-bold">点击上传错题照片</span>
                    <span className="text-xs">支持任意图片格式，存储于本地</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3.5 rounded-2xl bg-[#F2F2F7] text-gray-500 font-bold text-base hover:bg-[#E5E7EB] transition-colors active:scale-[0.98]"
              >
                取消
              </button>
              <button
                onClick={handleAddProblem}
                className="flex-1 py-3.5 rounded-2xl bg-[#0066EE] text-white font-bold text-base hover:bg-[#0055CC] transition-colors active:scale-[0.98] shadow-md"
              >
                确认录入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setZoomImageUrl(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setZoomImageUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-4xl max-h-[85vh] p-4 flex items-center justify-center">
            <img 
              src={zoomImageUrl}
              alt="Zoomed problem view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
