import { QuizQuestion } from './episode.model';

/**
 * End-of-episode knowledge checks, keyed by episode slug.
 * The finale has no quiz: its lab (the workflow builder) is the final check.
 */
export const quizzes: Record<string, QuizQuestion[]> = {
  'episode-1': [
    {
      prompt:
        "A form's save button stays disabled after an edit. What is the best context to give Copilot?",
      options: [
        'The whole repository, so nothing is missed',
        'The component, its template, the error and the expected behavior',
        'The full build log plus package-lock.json',
        'Just the sentence "the save button is broken"',
      ],
      answer: 1,
      explanation:
        'Relevant files, a focused error and the expected behavior give Copilot everything it needs and nothing it has to wade through.',
    },
    {
      prompt: 'What is the real cost of over-supplying context?',
      options: [
        'Copilot refuses to answer',
        'Nothing; more context is always safer',
        'More to process, more credits used, and a less direct path to the fix',
        'The editor slows down',
      ],
      answer: 2,
      explanation:
        'The tool can often still solve it, but it has to process far more than the task needs to get there.',
    },
    {
      prompt: "Which statement captures the episode's core idea?",
      options: [
        'Context quantity beats context quality',
        'Context quality matters more than context quantity',
        'Never attach files to a prompt',
        'Always attach the build output',
      ],
      answer: 1,
      explanation: 'Copilot does not need your entire project. It needs the right context.',
    },
  ],
  'episode-2': [
    {
      prompt:
        'You have spent the morning on an auth refactor. A new, unrelated reporting task arrives. What do you do?',
      options: [
        'Keep going in the same chat; it already knows the codebase',
        'Start a fresh chat and bring only what the reporting task needs',
        "Paste the whole morning's conversation into a new chat",
        'Switch to a different model in the same chat',
      ],
      answer: 1,
      explanation:
        'A task switch is the natural moment for a fresh chat. Carry forward only the context the new task needs.',
    },
    {
      prompt: 'Why does one long, mixed conversation hurt?',
      options: [
        'Chats have a hard limit of ten messages',
        'Unrelated history dilutes the focus on the current task',
        'Copilot deletes earlier messages',
        'It does not; longer is always better',
      ],
      answer: 1,
      explanation:
        'Earlier topics, questions and dead ends all stay in play, which makes it harder to stay focused on the work in front of you.',
    },
    {
      prompt: 'Which best describes a conversation with an AI assistant?',
      options: [
        'A permanent record of the project',
        'A working context for one task',
        'A backup of your code',
        'A replacement for documentation',
      ],
      answer: 1,
      explanation: 'A conversation is a working context, not a permanent record.',
    },
  ],
  'episode-3': [
    {
      prompt: 'Which task most clearly calls for a model with more reasoning capability?',
      options: [
        'Renaming a variable inside one file',
        'Adding aria-labels to a form',
        'Choosing a caching strategy across several services with competing trade-offs',
        'Converting a date to ISO format',
      ],
      answer: 2,
      explanation:
        'Open-ended work with trade-offs across files or services is where extra reasoning pays off.',
    },
    {
      prompt: 'What is a typical trait of a simpler, well-defined task?',
      options: [
        'Several plausible approaches',
        'Little ambiguity about what "done" looks like',
        'Needs reasoning across many constraints',
        'No single obvious answer',
      ],
      answer: 1,
      explanation:
        'A clear, narrow goal with an obvious expected outcome is the hallmark of a simpler task.',
    },
    {
      prompt: 'What should drive your choice of model?',
      options: [
        'Habit',
        'Whatever is newest',
        'The complexity of the task',
        'The length of the prompt',
      ],
      answer: 2,
      explanation: 'Match model capability to task complexity, not to habit.',
    },
  ],
  'episode-4': [
    {
      prompt: 'Your app throws an error and the log is 2,000 lines long. What do you share?',
      options: [
        'All 2,000 lines, so nothing is hidden',
        'Only the last line of the log',
        'The relevant error, the useful part of the stack trace and the expected behavior',
        'A screenshot of the terminal',
      ],
      answer: 2,
      explanation:
        'Signal over volume: the error, the frames that point at your code, and what should have happened.',
    },
    {
      prompt: 'Which stack frames are usually the most useful?',
      options: [
        'Frames deep inside node_modules',
        'Frames that point into your own application code',
        'Bundler and dev-server output',
        'Deprecation warnings',
      ],
      answer: 1,
      explanation:
        'Frames in your own code show where the failure meets your logic. Framework internals rarely add much.',
    },
    {
      prompt: 'Why explain the expected behavior alongside the error?',
      options: [
        'It is required by Copilot',
        'It tells the assistant what "fixed" means, not just what broke',
        'It makes the prompt longer',
        'It is not useful',
      ],
      answer: 1,
      explanation:
        'An error says what went wrong. The expected behavior says what right looks like.',
    },
  ],
  'episode-5': [
    {
      prompt: 'You need a quick reminder of what a function does before stand-up. The best ask is…',
      options: [
        '"Explain this code."',
        '"Give me a two-line summary of what validateOrder() does."',
        '"Walk me through every trade-off in this file."',
        '"Rewrite this file."',
      ],
      answer: 1,
      explanation:
        'Name the deliverable, the scope and the format, and the answer lands where you can use it.',
    },
    {
      prompt: 'When is a long, detailed explanation the right output?',
      options: [
        'Never; shorter is always better',
        'When you need to understand a complex, unfamiliar implementation',
        'When you only need a summary',
        'When the change is a one-line fix',
      ],
      answer: 1,
      explanation: 'Useful output is not the same as short output. Depth should match the task.',
    },
    {
      prompt: 'What is the most effective way to improve an AI response?',
      options: [
        'Ask it to be shorter',
        'Define the intended outcome: scope, format and level of detail',
        'Ask the same question again',
        'Use a bigger model',
      ],
      answer: 1,
      explanation: "Don't just ask for less. Ask for exactly what you need.",
    },
  ],
  'episode-6': [
    {
      prompt: 'You want to understand how an unfamiliar Angular component works. Which mode?',
      options: ['Ask', 'Agent'],
      answer: 0,
      explanation: 'You need information, not changes. Ask builds understanding first.',
    },
    {
      prompt: 'You need a coordinated change across several related files. Which mode?',
      options: ['Ask', 'Agent'],
      answer: 1,
      explanation: 'Multi-step, multi-file work is what Agent is for, followed by your review.',
    },
    {
      prompt: 'After Agent finishes a multi-file change, you should…',
      options: [
        'Commit straight away; Agent already checked it',
        'Review the changes, the same as any other code',
        'Ask Agent whether it is correct and trust the answer',
        'Revert and redo it by hand',
      ],
      answer: 1,
      explanation:
        'Choosing a mode is not a reason to skip checking the result. Review either way.',
    },
  ],
  'episode-7': [
    {
      prompt: 'An AI-generated change looks plausible and compiles. What is the next step?',
      options: [
        'Merge it; it compiles',
        'Check it against the requirements, inspect the code and run the relevant tests',
        'Ask for a second version and pick the shorter one',
        'Delete the tests that fail',
      ],
      answer: 1,
      explanation: 'Plausible is not the same as correct. Verify before you trust.',
    },
    {
      prompt: 'How much verification does a change need?',
      options: [
        'The same amount for every change',
        'None if the AI wrote it',
        "Matched to the change's risk and complexity",
        'Only for UI changes',
      ],
      answer: 2,
      explanation:
        'A small, well-understood edit needs less scrutiny than a broad, cross-cutting one.',
    },
    {
      prompt: 'Who is responsible for AI-generated code you merge?',
      options: ['The AI', 'The reviewer only', 'You', 'Nobody'],
      answer: 2,
      explanation: 'AI can help write the code. You are still responsible for trusting it.',
    },
  ],
};
