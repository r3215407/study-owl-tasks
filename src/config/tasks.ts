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
    advice: "“教育是慢的艺术，请给孩子多一点成长的空间。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 1, // Monday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“平和的心态是家长的必修课，耐心是最好的教鞭。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 2, // Tuesday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“接纳孩子的慢，才能发现他进步时的闪光点。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 3, // Wednesday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“当你感到急躁时，请记得进步需要一点点积累。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 4, // Thursday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“少一分催促，多一分鼓励，让孩子在安稳中学习。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 5, // Friday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“情绪稳定是家长的底色，也是孩子专注的源泉。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  },
  {
    dayNumber: 6, // Saturday
    title: "今日训练：作业巩固 + 复习",
    timeRemaining: "20-30 MINS",
    advice: "“每一个成长的瞬间，都值得我们用耐心去守候。”",
    tasks: [
      { id: '1', title: '复习昨日2道数学错题', icon: History, color: '#58cc02', status: 'todo' },
      { id: '2', title: '复习3个错别字(读写)', icon: PencilLine, color: '#58cc02', status: 'locked' },
      { id: '3', title: '完成今日学校作业', icon: BookOpen, color: '#1cb0f6', status: 'locked' },
      { id: '4', title: '选1题向家长讲思路', icon: Mic2, color: '#ff9600', status: 'locked' },
      { id: '5', title: '巩固2道今日/同类题', icon: Target, color: '#1cb0f6', status: 'locked' },
      { id: '6', title: '检查单位/答/易错点', icon: ClipboardCheck, color: '#afafaf', status: 'locked' }
    ]
  }
];
