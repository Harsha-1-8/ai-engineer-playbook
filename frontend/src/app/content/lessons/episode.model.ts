/* ==========================================================================
   Lesson content model
   ==========================================================================
   Lesson content is authored as a list of typed, reusable blocks. Each
   block is a member of the `LessonBlock` discriminated union, keyed by its
   `type`. This keeps the data strongly typed and removes the need to parse
   authored text at render time.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Prose
   -------------------------------------------------------------------------- */

/** A single paragraph of prose. */
export interface ProseParagraph {
  kind: 'paragraph';
  text: string;
}

/** A bulleted list within prose. */
export interface ProseList {
  kind: 'list';
  items: string[];
}

/** A block of prose: interleaved paragraphs and bullet lists. */
export type ProseBlock = ProseParagraph | ProseList;

/* --------------------------------------------------------------------------
   Lesson blocks
   -------------------------------------------------------------------------- */

/** Flowing prose: one or more paragraphs and/or bullet lists. */
export interface ProseLessonBlock {
  type: 'prose';
  blocks: ProseBlock[];
}

/** Learning objectives: an intro line followed by a checklist. */
export interface ObjectivesLessonBlock {
  type: 'objectives';
  intro: string;
  items: string[];
}

/** One side of a side-by-side comparison. */
export interface ComparisonSide {
  /** Display name, e.g. "Rohan's approach". */
  label: string;
  /** Short descriptor shown as a badge, e.g. "Excessive context". */
  badge: string;
  /** Visual treatment: warm (excessive) or cool (focused). */
  tone: 'warm' | 'cool';
  /** The comparison points for this side. */
  items: string[];
}

/** A side-by-side comparison of two (or more) approaches. */
export interface ComparisonLessonBlock {
  type: 'comparison';
  intro: string;
  sides: ComparisonSide[];
  outro?: string;
}

/** A narrative scenario / case study built from prose blocks. */
export interface ScenarioLessonBlock {
  type: 'scenario';
  intro: string;
  blocks: ProseBlock[];
}

/** A single takeaway line; `primary` marks the emphasized closing line. */
export interface TakeawayLine {
  text: string;
  primary?: boolean;
}

/** The key takeaway: a short set of lines, one optionally emphasized. */
export interface TakeawayLessonBlock {
  type: 'takeaway';
  lines: TakeawayLine[];
}

/** A code example. */
export interface CodeLessonBlock {
  type: 'code';
  language: string;
  code: string;
}

/**
 * A single lesson referenced in a recap. Only the slug and a recap-specific
 * summary are authored; the episode number and title are resolved from the
 * episode list at render time so they can never drift out of sync.
 */
export interface RecapItem {
  /** The episode's routing slug, e.g. "episode-1". */
  slug: string;
  /** A concise summary of the lesson. */
  summary: string;
}

/**
 * A recap of prior lessons: a set of linked episode cards that bring earlier
 * episodes together. Generic and reusable for any "look back" section.
 */
export interface EpisodeRecapLessonBlock {
  type: 'episodeRecap';
  intro: string;
  items: RecapItem[];
}

/** A single step in a practical workflow. */
export interface WorkflowStep {
  /** Short step name, e.g. "Frame the task". */
  label: string;
  /** One-line description of what to do at this step. */
  description: string;
}

/**
 * A practical workflow: an ordered sequence of steps that synthesizes the
 * lessons into a usable, repeatable flow.
 */
export interface WorkflowLessonBlock {
  type: 'workflow';
  intro: string;
  steps: WorkflowStep[];
}

/**
 * A chapter-finale closing: a "chapter complete" moment, a closing message,
 * an emphasized sign-off line, and a link back to the learning journey.
 */
export interface FinaleClosingLessonBlock {
  type: 'finaleClosing';
  /** The "chapter complete" marker, e.g. "Chapter 1 complete". */
  completeLabel: string;
  /** A brief closing message summarizing the series' intent. */
  message: string;
  /** The emphasized sign-off line, e.g. "The journey continues." */
  signoff: string;
  /** Label for the link back to the learning journey. */
  journeyLabel: string;
}

/** Discriminated union of all lesson content blocks. */
export type LessonBlock =
  | ProseLessonBlock
  | ObjectivesLessonBlock
  | ComparisonLessonBlock
  | ScenarioLessonBlock
  | TakeawayLessonBlock
  | CodeLessonBlock
  | EpisodeRecapLessonBlock
  | WorkflowLessonBlock
  | FinaleClosingLessonBlock;

/* --------------------------------------------------------------------------
   Interactive labs & quizzes
   -------------------------------------------------------------------------- */

/** The interactive lab attached to an episode. Each maps to one component. */
export type LabKind =
  | 'token-budget'
  | 'context-reset'
  | 'model-match'
  | 'log-hunt'
  | 'output-shaper'
  | 'ask-or-agent'
  | 'spot-the-bug'
  | 'workflow-builder';

/** A single multiple-choice quiz question. */
export interface QuizQuestion {
  prompt: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answer: number;
  /** Shown after the learner answers. */
  explanation: string;
}

/* --------------------------------------------------------------------------
   Section & episode
   -------------------------------------------------------------------------- */

/**
 * A single lesson section: a heading plus one typed content block.
 * `id` is used for tracking and `aria-labelledby`; `label` is the heading.
 */
export interface LessonSection {
  id: string;
  label: string;
  block: LessonBlock;
}

/** Typed shape for a single episode in the learning series. */
export interface Episode {
  /** Stable identifier used for routing, e.g. "episode-1". */
  slug: string;
  /** Human-readable episode number, e.g. 1. */
  number: number;
  /** Episode title. */
  title: string;
  /** Short supporting description shown in lists and previews. */
  summary: string;
  /** Estimated length in minutes, including the lab. */
  durationMinutes?: number;
  /**
   * Marks this episode as a chapter finale, which renders a distinctive
   * finale hero instead of the standard one.
   */
  finale?: boolean;
  /** The interactive lab for this episode. */
  lab?: LabKind;
  /** Authored lesson sections. */
  sections?: LessonSection[];
}
