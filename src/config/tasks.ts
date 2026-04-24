import { History, PencilLine, BookOpen, Mic2, Target, ClipboardCheck, LucideIcon } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  status: 'completed' | 'in-progress' | 'locked' | 'todo';
  startTime?: number;
  duration?: string;
}

export interface DayConfig {
  dayNumber: number;
  title: string;
  timeRemaining: string;
  tasks: Task[];
  advice: string;
}

export const WEEKLY_CONFIG: DayConfig[] = [
  {
    dayNumber: 0, // Sunday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“不用做很多，关键是让孩子真正记住。”",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（最多3个字，读写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位 / 答 ，今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 1, // Monday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“不用做很多，关键是让孩子真正记住。”",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（最多3个字，读写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位 / 答 ，今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 2, // Tuesday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“不用做很多，关键是让孩子真正记住。”",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（最多3个字，读+写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（说出为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位 / 答 / 计算，并说出今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 3, // Wednesday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“不用做很多，关键是让孩子真正记住。”",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（最多3个字，读+写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（说出为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位 / 答 / 计算，并说出今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 4, // Thursday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“不用做很多，关键是让孩子真正记住。”",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（最多3个字，读+写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（说出为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位 / 答 / 计算，并说出今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 5, // Friday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "不用做很多，关键是让孩子真正记住。",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（3个字，读写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位/答，今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 6, // Saturday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“不用做很多，关键是让孩子真正记住。”",
    tasks: [
      { id: '1', title: '复习昨天2道错题（数学）', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习错别字（3个字，读写一遍）', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今天学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题讲给家长听（为什么这样做）', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道题（今天错题或同类型）', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查：单位/答，今天最容易错的点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  }
];
