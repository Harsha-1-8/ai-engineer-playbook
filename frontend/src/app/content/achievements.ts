/** Facts about the learner that achievements are judged against. */
export interface AchievementContext {
  completed: number;
  total: number;
  labsSolved: number;
  flawlessLabs: number;
  perfectQuizzes: number;
  quizzes: number;
  events: ReadonlySet<string>;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Hidden achievements show as "???" until unlocked. */
  hidden?: boolean;
  check: (ctx: AchievementContext) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'hello-world',
    icon: '👋',
    title: 'Hello, world',
    description: 'Solve your first lab.',
    check: (c) => c.labsSolved >= 1,
  },
  {
    id: 'flawless',
    icon: '🎯',
    title: 'Flawless',
    description: 'Solve a lab on the first try.',
    check: (c) => c.flawlessLabs >= 1,
  },
  {
    id: 'sharpshooter',
    icon: '🏹',
    title: 'Sharpshooter',
    description: 'Solve five labs on the first try.',
    check: (c) => c.flawlessLabs >= 5,
  },
  {
    id: 'quiz-ace',
    icon: '💯',
    title: 'Quiz ace',
    description: 'Get a perfect score on a quiz.',
    check: (c) => c.perfectQuizzes >= 1,
  },
  {
    id: 'top-of-class',
    icon: '🎓',
    title: 'Top of the class',
    description: 'Perfect scores on every quiz.',
    check: (c) => c.quizzes > 0 && c.perfectQuizzes === c.quizzes,
  },
  {
    id: 'halfway',
    icon: '⛳',
    title: 'Halfway there',
    description: 'Complete four episodes.',
    check: (c) => c.completed >= 4,
  },
  {
    id: 'completionist',
    icon: '🏆',
    title: 'Completionist',
    description: 'Complete every episode in Chapter 1.',
    check: (c) => c.completed === c.total,
  },
  {
    id: 'hard-way',
    icon: '🐘',
    title: 'Learned it the hard way',
    description: "Send Copilot the entire project in Episode 1's lab.",
    check: (c) => c.events.has('rohan'),
  },
  {
    id: 'both-sides',
    icon: '🌗',
    title: 'Both sides',
    description: 'Try both the light and dark themes.',
    check: (c) => c.events.has('theme-light') && c.events.has('theme-dark'),
  },
  {
    id: 'power-user',
    icon: '⌨️',
    title: 'Power user',
    description: 'Open the command palette.',
    check: (c) => c.events.has('palette'),
  },
  {
    id: 'night-owl',
    icon: '🦉',
    title: 'Night owl',
    description: 'Solve a lab between midnight and 5 a.m.',
    check: (c) => c.events.has('night-owl'),
  },
  {
    id: 'sudo',
    icon: '🔓',
    title: 'sudo',
    description: 'Found the secret command.',
    hidden: true,
    check: (c) => c.events.has('sudo'),
  },
];
