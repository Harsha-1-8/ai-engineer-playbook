import { Episode } from './episode.model';

/**
 * Lesson content for the eight-episode series.
 *
 * Episodes 1–7 are fully authored as typed content blocks, each paired with an
 * interactive lab (`lab`) and a quiz (see quizzes.ts). Episode 8 is the
 * Chapter 1 finale that brings the seven lessons together.
 */
export const episodes: Episode[] = [
  {
    slug: 'episode-1',
    number: 1,
    title: 'The Case of the Missing Tokens',
    durationMinutes: 6,
    lab: 'token-budget',
    summary:
      'Discover why giving Copilot the entire project can waste AI Credits, and how focused context helps keep coding tasks on track.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'When you ask Copilot to fix a bug, what do you hand it? The entire repository? Every file you can think of? Full build logs and terminal output?',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at a common mistake: supplying far more context than the task actually requires. We will follow two developers, Rohan and Neel, who are assigned the same bug fix, and see how their different approaches to context shape the outcome.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Understand why excessive context is a problem when working with AI coding tools',
            'Identify what "relevant context" means for a specific task',
            'Recognize the difference between context quality and context quantity',
            'Apply a focused-context approach to your own AI-assisted debugging',
          ],
        },
      },
      {
        id: 'content',
        label: 'Main lesson content',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'The central theme of this episode is simple: give Copilot the relevant information, not the entire project.',
            },
            {
              kind: 'paragraph',
              text:
                'When you supply an AI tool with the whole repository, numerous unrelated files, and extensive build or terminal output, you are asking it to process far more than the task requires. The tool can still eventually resolve the issue, but it has to work through a much larger amount of context to get there.',
            },
            {
              kind: 'paragraph',
              text: 'The alternative is to identify what the task actually needs:',
            },
            {
              kind: 'list',
              items: [
                'The relevant files: the component, its template, and the code where the error occurs',
                'A focused error message',
                'A clear description of the expected behavior',
              ],
            },
            {
              kind: 'paragraph',
              text:
                'By excluding unnecessary project context, you reduce the amount of information the tool must process. Fewer AI Credits are consumed, and the path to the fix is more direct.',
            },
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'comparison',
          intro:
            'Rohan and Neel are assigned the same coding task: fixing a bug in an application where the save button remains disabled after editing a user.',
          sides: [
            {
              label: "Rohan's approach",
              badge: 'Excessive context',
              tone: 'warm',
              items: [
                'Supplies the entire repository',
                'Includes multiple files and unrelated project information',
                'Attaches full build logs and console output',
                'Provides more context than the task requires',
                'Consumes more AI Credits',
              ],
            },
            {
              label: "Neel's approach",
              badge: 'Focused context',
              tone: 'cool',
              items: [
                'Selects only the relevant files',
                'Supplies a focused error message and the relevant code',
                'Explicitly describes the expected behavior',
                'Excludes unnecessary project context',
                'Consumes fewer AI Credits',
              ],
            },
          ],
          outro:
            'Both approaches can eventually resolve the bug. The difference is how much context Copilot has to process to get there.',
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'Context quality matters more than context quantity.' },
            {
              text: "Copilot doesn't need your entire project. It needs the right context.",
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-2',
    number: 2,
    title: 'The Conversation That Never Ends',
    durationMinutes: 6,
    lab: 'context-reset',
    summary:
      'See why carrying one long conversation across unrelated tasks can blur the focus of an AI coding session, and how starting a fresh chat when you switch tasks keeps things on track.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'When you switch to a new task, do you keep working in the same chat you have been in for hours? Or do you start fresh?',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at a common habit: carrying one long conversation across unrelated tasks. We will follow two developers, Rohan and Neel, who both switch to a new task, and see how their different approaches to conversation context shape the outcome.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Understand why a long conversation can dilute the focus of an AI coding session',
            'Recognize when a task switch is a good moment to start a fresh chat',
            'Identify what context to carry forward — and what to leave behind — when starting fresh',
            'Apply a fresh-chat approach when switching between distinct tasks',
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'scenario',
          intro:
            'Rohan and Neel have both been deep in a long conversation with Copilot, working through a series of related changes. Midway through the day, each is handed a new, unrelated task.',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Rohan simply keeps going. The new task is added to the same conversation, right on top of everything that came before — the earlier changes, the questions, the dead ends.',
            },
            {
              kind: 'paragraph',
              text:
                'Neel pauses. The new task is a different kind of work, so he starts a fresh chat and brings in only the files and context that the new task actually needs.',
            },
            {
              kind: 'paragraph',
              text:
                'The contrast is not about who works harder. It is about how much of the previous conversation each of them carries into the new task.',
            },
          ],
        },
      },
      {
        id: 'comparison',
        label: 'Rohan vs Neel',
        block: {
          type: 'comparison',
          intro:
            'Both developers face the same moment: a new, unrelated task lands while a long conversation is still open. Here is how each of them handles it.',
          sides: [
            {
              label: "Rohan's approach",
              badge: 'One long conversation',
              tone: 'warm',
              items: [
                'Keeps working in the same chat from earlier in the day',
                'Carries context from unrelated tasks into the new one',
                'Adds the new task on top of an already long thread',
                'Mixes several topics in a single conversation',
                'Makes it harder for Copilot to stay focused on the current task',
              ],
            },
            {
              label: "Neel's approach",
              badge: 'Fresh chat per task',
              tone: 'cool',
              items: [
                'Starts a new chat when switching to a new task',
                'Brings in only the context the new task needs',
                'Leaves unrelated history behind',
                'Keeps each conversation focused on a single task',
                'Gives Copilot a clear, focused starting point',
              ],
            },
          ],
          outro:
            'Both can get the job done. The difference is how much unrelated context Copilot has to work through to focus on the current task.',
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'A conversation is a working context, not a permanent record.' },
            {
              text: 'When you switch tasks, start a fresh chat and bring only what the new task needs.',
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-3',
    number: 3,
    title: 'The Model Mismatch',
    durationMinutes: 7,
    lab: 'model-match',
    summary:
      'See why reaching for the most capable model for every task is not always the right call, and how matching model capability to task complexity keeps your AI-assisted work on track.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'When you start a new task, do you reach for the same model every time? Or do you consider what the task actually asks of it?',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at a common habit: treating every task as if it needs the same level of reasoning. We will follow two developers, Rohan and Neel, who face tasks of very different complexity, and see how their different approaches to choosing a model shape the outcome.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Understand why model capability should be matched to task complexity',
            'Distinguish between simpler, well-defined tasks and more complex, open-ended ones',
            'Recognize that a more capable model is not always the better choice for a given task',
            'Apply a simple decision guide when picking a model for a task',
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'scenario',
          intro:
            'Rohan and Neel are both working through a day of tasks that range from quick, well-defined changes to a gnarly, open-ended problem. Each has access to a range of models with different levels of reasoning capability.',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Rohan reaches for the most capable model for everything. The quick, well-defined changes get the same heavyweight treatment as the genuinely complex problem.',
            },
            {
              kind: 'paragraph',
              text:
                'Neel takes a moment to look at each task. The straightforward changes go to a lighter model that handles them well. The complex, open-ended problem goes to a model with more reasoning capability.',
            },
            {
              kind: 'paragraph',
              text:
                'The contrast is not about who is more careful. It is about whether the model being used actually fits the complexity of the task in front of them.',
            },
          ],
        },
      },
      {
        id: 'decision-guide',
        label: 'Decision guide',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'A useful starting point is to think about how much reasoning a task actually requires, rather than defaulting to the most capable option.',
            },
            {
              kind: 'paragraph',
              text: 'Simpler, well-defined tasks tend to share a few traits:',
            },
            {
              kind: 'list',
              items: [
                'A clear, narrow goal with an obvious expected outcome',
                'Little ambiguity about what “done” looks like',
                'Limited need to weigh trade-offs or explore alternatives',
              ],
            },
            {
              kind: 'paragraph',
              text: 'More complex, open-ended tasks tend to look different:',
            },
            {
              kind: 'list',
              items: [
                'An ambiguous or broad goal with several plausible approaches',
                'A need to reason across multiple files, constraints, or trade-offs',
                'No single obvious answer, so the model has to explore and evaluate options',
              ],
            },
            {
              kind: 'paragraph',
              text:
                'The point is not that a more capable model is always better. It is that matching the model to the task means the simpler work does not get over-served, and the genuinely hard work gets the reasoning it needs.',
            },
          ],
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'Match model capability to task complexity, not to habit.' },
            {
              text: 'A more capable model is not always the better choice — the right one is the one that fits the task.',
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-4',
    number: 4,
    title: 'The Log Overload',
    durationMinutes: 6,
    lab: 'log-hunt',
    summary:
      'See why pasting a huge, unfiltered log can bury the signal, and how sharing the relevant error message and stack trace helps keep a debugging conversation focused.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'When something breaks, what do you hand to Copilot? The entire log, every line of it? Or just the part that actually matters?',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at a common habit: pasting a large, unfiltered log in the hope that the answer is somewhere in there. We will follow two developers, Rohan and Neel, who hit the same error, and see how their different approaches to sharing diagnostic information shape the debugging conversation.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Understand why a large, unfiltered log can make it harder to focus a debugging conversation',
            'Identify the relevant error message and the useful parts of a stack trace',
            'Recognize the value of explaining the expected behavior alongside the error',
            'Apply a focused approach to sharing diagnostic information with an AI coding assistant',
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'scenario',
          intro:
            'Rohan and Neel are both working on the same application when it starts throwing an error. Each wants Copilot to help figure out what is going wrong.',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Rohan copies the entire log and pastes it in. It is a long, unfiltered dump that includes a lot of output that has nothing to do with the error.',
            },
            {
              kind: 'paragraph',
              text:
                'Neel takes a moment to look at the log. He finds the relevant error message, includes the useful part of the stack trace and the surrounding context, and explains what the application was supposed to do.',
            },
            {
              kind: 'paragraph',
              text:
                'The contrast is not about who reads logs more carefully. It is about how much of the diagnostic information each of them actually needs to share for the conversation to stay focused.',
            },
          ],
        },
      },
      {
        id: 'comparison',
        label: 'Rohan vs. Neel comparison',
        block: {
          type: 'comparison',
          intro:
            'Both developers hit the same error and want Copilot to help. Here is how each of them shares the diagnostic information.',
          sides: [
            {
              label: "Rohan's approach",
              badge: 'Unfiltered log',
              tone: 'warm',
              items: [
                'Pastes the entire, unfiltered log',
                'Includes extensive output unrelated to the error',
                'Buries the relevant error message in a lot of noise',
                'Leaves out an explanation of the expected behavior',
                'Makes it harder for Copilot to focus on the actual problem',
              ],
            },
            {
              label: "Neel's approach",
              badge: 'Relevant diagnostics',
              tone: 'cool',
              items: [
                'Identifies the relevant error message',
                'Includes the useful part of the stack trace and surrounding context',
                'Explains what the expected behavior was',
                'Leaves out unrelated log output',
                'Gives Copilot a focused starting point for the debugging conversation',
              ],
            },
          ],
          outro:
            'Both approaches can eventually lead to a fix. The difference is how much irrelevant output Copilot has to work through to find the signal.',
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'Share the relevant error message and the useful part of the stack trace, not the entire log.' },
            {
              text: 'Useful context matters more than volume — the right diagnostics keep the debugging conversation focused.',
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-5',
    number: 5,
    title: 'The Output Trap',
    durationMinutes: 7,
    lab: 'output-shaper',
    summary:
      'See why the shortest answer is not always the best one, and how guiding Copilot toward the right scope, format, and level of detail keeps the output useful.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'When Copilot answers, does it give you exactly what you need? Or a wall of text that is too broad, too long, or not shaped for the task?',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at a common frustration: getting output that is not quite right for the job. We will follow two developers, Rohan and Neel, and see how the way they ask shapes the kind of answer they get.',
            },
            {
              kind: 'paragraph',
              text:
                'The key idea is that useful output is not necessarily the shortest output. The goal is the right level of detail and format for the task in front of you.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Recognize when an AI response is unnecessarily broad or detailed',
            'Specify the desired length, format, and scope of a response',
            'Distinguish between tasks that benefit from concise answers and those that need depth',
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'scenario',
          intro:
            'Rohan and Neel are both working with Copilot on code changes, but they ask in different ways.',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Rohan asks a broad question about a code change and receives an extensive explanation that covers far more than he needed. The answer is not wrong, but it is harder to use than it needs to be.',
            },
            {
              kind: 'paragraph',
              text:
                'Neel asks a more focused question. He names the exact deliverable, the relevant scope, and the format he wants, so the answer lands closer to what he can act on.',
            },
            {
              kind: 'paragraph',
              text:
                'Later, when Neel needs to understand a complex, unfamiliar implementation, he asks for a detailed explanation instead. The same developer, a different level of detail, matched to the task.',
            },
          ],
        },
      },
      {
        id: 'guidance',
        label: 'Practical guidance',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'The most useful thing you can do is define the intended outcome, rather than simply asking for a shorter answer.',
            },
            {
              kind: 'paragraph',
              text: 'Here are a few illustrative ways to guide the response:',
            },
            {
              kind: 'list',
              items: [
                'Ask for a concise answer: "Give me a short summary of what this function does."',
                'Ask for a specific format: "List the steps as a numbered list."',
                'Ask for a focused scope: "Explain only the part that handles validation."',
                'Ask for depth when you need it: "Walk me through the reasoning, including the trade-offs."',
              ],
            },
            {
              kind: 'paragraph',
              text:
                'The point is not to demand less for its own sake. It is to ask for exactly the kind of output the task calls for.',
            },
          ],
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'Useful output is not the same as short output.' },
            {
              text: "Don't just ask for less. Ask for exactly what you need.",
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-6',
    number: 6,
    title: 'Ask or Agent?',
    durationMinutes: 6,
    lab: 'ask-or-agent',
    summary:
      'See when to ask Copilot for an explanation and when to hand it a task to carry out, and how choosing the right mode keeps your work on track.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'You can interact with an AI coding assistant in more than one way. Sometimes you want an answer; sometimes you want the work done.',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at the difference between asking for information and delegating a task. We will follow two developers, Rohan and Neel, who face different goals and choose different modes.',
            },
            {
              kind: 'paragraph',
              text:
                'Neither mode is universally better. The right choice depends on what you actually need.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Understand the distinction between Ask and Agent',
            'Identify tasks suited to explanation and guidance versus tasks involving code changes or multiple steps',
            'Recognize the importance of reviewing AI-generated changes, regardless of interaction mode',
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'scenario',
          intro:
            'Rohan and Neel are both working in the same codebase, but their goals are different.',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Rohan runs into an unfamiliar Angular component and wants to understand how it works. He uses Ask to request an explanation, so he can build up the context he needs.',
            },
            {
              kind: 'paragraph',
              text:
                'Neel needs a coordinated change across several related files. He uses Agent to carry out the multi-step task, then reviews the changes it makes.',
            },
            {
              kind: 'paragraph',
              text:
                'Either developer could have used a different mode if their goal had been different. The mode follows the objective, not the other way around.',
            },
          ],
        },
      },
      {
        id: 'decision-guide',
        label: 'Decision guide',
        block: {
          type: 'comparison',
          intro:
            'A simple way to decide is to ask yourself whether you need information or you need work done.',
          sides: [
            {
              label: 'Ask',
              badge: 'For understanding',
              tone: 'cool',
              items: [
                'Understanding unfamiliar code',
                'Asking conceptual questions',
                'Getting suggestions or explanations',
                'Exploring possible approaches before making changes',
              ],
            },
            {
              label: 'Agent',
              badge: 'For doing the work',
              tone: 'warm',
              items: [
                'Implementing a clearly specified change',
                'Performing multi-step coding tasks',
                'Making coordinated edits across files',
                'Running supported development actions as part of a task',
              ],
            },
          ],
          outro:
            'Agent still needs clear instructions, the right context, and a human review of what it does. Choosing a mode is not a reason to skip checking the result.',
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'The mode should follow the goal: information or action.' },
            {
              text: 'Ask when you need to understand. Use Agent when you need work done. Review either way.',
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-7',
    number: 7,
    title: 'Trust, But Verify',
    durationMinutes: 7,
    lab: 'spot-the-bug',
    summary:
      'See why AI-generated code is a starting point, not a finished product, and how reviewing, testing, and validating it keeps your work correct and maintainable.',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'When Copilot writes code for you, who is responsible for making sure it is right? You are.',
            },
            {
              kind: 'paragraph',
              text:
                'This episode looks at a common trap: accepting an AI-generated change because it looks plausible. An answer can look convincing while still containing mistakes, missing requirements, or unintended changes.',
            },
            {
              kind: 'paragraph',
              text:
                'We will follow two developers, Rohan and Neel, who both receive an AI-generated change and handle it very differently. Verification is part of effective AI-assisted development.',
            },
          ],
        },
      },
      {
        id: 'objectives',
        label: 'Learning objectives',
        block: {
          type: 'objectives',
          intro: 'By the end of this episode, you will be able to:',
          items: [
            'Identify important checks for AI-generated code',
            'Understand why code review and testing remain necessary',
            'Recognize that efficiency involves quality and correctness, not just minimizing AI usage',
          ],
        },
      },
      {
        id: 'scenario',
        label: 'Practical scenario',
        block: {
          type: 'scenario',
          intro:
            'Rohan and Neel both ask Copilot to make a change, and both get a result that looks reasonable at a glance.',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Rohan glances at the change, it looks fine, and he moves on. He has not checked it against what was actually asked for.',
            },
            {
              kind: 'paragraph',
              text:
                'Neel takes a moment. He checks the change against the requirements, inspects the affected code, runs the relevant tests, and looks into anything that fails or warns.',
            },
            {
              kind: 'paragraph',
              text:
                'Neither developer is being careless or careful by nature. The difference is whether the change is verified before it is trusted.',
            },
          ],
        },
      },
      {
        id: 'checklist',
        label: 'Verification checklist',
        block: {
          type: 'objectives',
          intro: 'Before you trust an AI-generated change, work through these checks:',
          items: [
            'Requirements — Does the change actually meet the requested behavior?',
            'Code review — Are the edits understandable, relevant, and consistent with the existing project?',
            'Impact — Have related components, dependencies, and potential side effects been considered?',
            'Testing — Have appropriate unit tests, integration tests, or manual checks been performed?',
            'Results — Have failures, warnings, and unexpected behavior been investigated?',
            'Final review — Are you confident enough in the change to proceed, or is more investigation needed?',
          ],
        },
      },
      {
        id: 'guidance',
        label: 'Practical guidance',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'You can ask Copilot to help with the verification itself: summarize its changes, call out its assumptions, suggest relevant tests, and explain potential risks.',
            },
            {
              kind: 'paragraph',
              text:
                'Those suggestions are a starting point, not a substitute for independently checking the implementation and the test results.',
            },
            {
              kind: 'paragraph',
              text:
                'Match the amount of verification to the risk and complexity of the change. A small, well-understood edit needs less scrutiny than a broad, cross-cutting one.',
            },
          ],
        },
      },
      {
        id: 'takeaway',
        label: 'Key takeaway',
        block: {
          type: 'takeaway',
          lines: [
            { text: 'AI assistance does not remove developer responsibility.' },
            {
              text: 'A workflow focused only on using less AI can miss the bigger goal: correct, maintainable, tested software.',
            },
            {
              text: 'AI can help write the code. You are still responsible for trusting it.',
              primary: true,
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'episode-8',
    number: 8,
    title: 'The Journey Continues',
    durationMinutes: 5,
    lab: 'workflow-builder',
    summary:
      'The AI Engineer Playbook — Chapter 1 Finale. Seven practical lessons, brought together into one workflow you can carry into your own work.',
    finale: true,
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        block: {
          type: 'prose',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'You have reached the end of Chapter 1. Across the last seven episodes, we looked at a series of practical habits for working with AI coding assistants — small, concrete choices that shape how well the tool helps you.',
            },
            {
              kind: 'paragraph',
              text:
                'This finale brings those lessons together. We will look back at the seven ideas, turn them into a single workflow you can reuse, and close the chapter with a sense of where the journey goes from here.',
            },
          ],
        },
      },
      {
        id: 'playbook',
        label: 'The Playbook',
        block: {
          type: 'episodeRecap',
          intro:
            'Seven lessons, one practical playbook. Here is what each episode set out to teach.',
          items: [
            {
              slug: 'episode-1',
              summary: 'Give Copilot the relevant context for the task, not the entire project.',
            },
            {
              slug: 'episode-2',
              summary: 'Start a fresh conversation when you switch to a different task.',
            },
            {
              slug: 'episode-3',
              summary: 'Match model capability to the complexity of the task.',
            },
            {
              slug: 'episode-4',
              summary: 'Share the relevant error message and useful stack trace, not the whole log.',
            },
            {
              slug: 'episode-5',
              summary: 'Ask for the right scope, format, and level of detail for the output.',
            },
            {
              slug: 'episode-6',
              summary: 'Use Ask for explanations and Agent for actions or multi-step work.',
            },
            {
              slug: 'episode-7',
              summary:
                'Review, test, and verify AI-generated work; token minimization alone is not an optimized workflow.',
            },
          ],
        },
      },
      {
        id: 'workflow',
        label: 'Your AI workflow',
        block: {
          type: 'workflow',
          intro:
            'The seven lessons fit together into a simple flow you can run through on any task. It is a reference, not a guarantee — adapt it to the work in front of you.',
          steps: [
            {
              label: 'Frame the task',
              description: 'Provide the relevant context and the expected behavior.',
            },
            {
              label: 'Set up the conversation',
              description: 'Start a fresh chat when the task changes.',
            },
            {
              label: 'Choose the approach',
              description: 'Match model capability and Ask/Agent mode to the work.',
            },
            {
              label: 'Guide the response',
              description: 'Specify the useful scope and format for the output.',
            },
            {
              label: 'Debug with signal',
              description: 'Share the relevant error information and logs.',
            },
            {
              label: 'Verify the result',
              description: 'Review the code, run appropriate checks, and examine the outcomes.',
            },
          ],
        },
      },
      {
        id: 'closing',
        label: 'Chapter 1 complete',
        block: {
          type: 'finaleClosing',
          completeLabel: 'Chapter 1 complete',
          message:
            'This chapter brought together seven practical habits for working with AI coding assistants — using them thoughtfully as part of your development work, with your own judgment and verification. The ideas are simple, but they compound: small, deliberate choices that keep the tool useful and the work yours.',
          signoff: 'The journey continues.',
          journeyLabel: 'Back to the Learning Journey',
        },
      },
    ],
  },
];
