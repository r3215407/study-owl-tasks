export interface MisspelledChar {
  id: string;              // 唯一 ID（时间戳 + 随机数）
  char: string;            // 错别字内容
  createdDate: string;     // 录入日期 YYYY-MM-DD
  reviewCount: number;     // 已完成复习次数（0-4）
  reviewDates: string[];   // 每次复习完成的日期 YYYY-MM-DD[]
  nextReviewDate: string;  // 下一次应复习日期 YYYY-MM-DD
  mastered: boolean;       // 是否已掌握（reviewCount >= 4）
}

// 记忆曲线：录入后第1天 → 第3天 → 第7天 → 第14天
export const REVIEW_INTERVALS = [1, 3, 7, 14];

export const STORAGE_KEY = 'study-owl-misspelled-chars';

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 计算下一次复习日期
 * @param createdDate 录入日期
 * @param currentReviewCount 当前已完成复习次数（即将变成这个值）
 */
export function getNextReviewDate(createdDate: string, currentReviewCount: number): string | null {
  if (currentReviewCount >= REVIEW_INTERVALS.length) {
    return null; // 已掌握
  }
  const base = new Date(createdDate);
  base.setDate(base.getDate() + REVIEW_INTERVALS[currentReviewCount]);
  return formatDate(base);
}

/**
 * 从 localStorage 读取所有错别字
 */
export function loadMisspelledChars(): MisspelledChar[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * 保存错别字到 localStorage
 */
export function saveMisspelledChars(chars: MisspelledChar[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

/**
 * 获取某一天需要复习的字（最多 maxCount 个）
 */
export function getReviewCharsForDate(chars: MisspelledChar[], dateStr: string, maxCount: number = 10): MisspelledChar[] {
  const pending = chars
    .filter(c => !c.mastered && c.nextReviewDate <= dateStr)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  return pending.slice(0, maxCount);
}

/**
 * 获取某一天录入的字
 */
export function getCharsCreatedOnDate(chars: MisspelledChar[], dateStr: string): MisspelledChar[] {
  return chars.filter(c => c.createdDate === dateStr);
}

/**
 * 获取某一天完成了复习的字
 */
export function getCharsReviewedOnDate(chars: MisspelledChar[], dateStr: string): MisspelledChar[] {
  return chars.filter(c => c.reviewDates.includes(dateStr));
}
