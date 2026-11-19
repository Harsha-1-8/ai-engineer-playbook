import { LabKind } from './episode.model';

/** Short, display-friendly names for each interactive lab. */
export const LAB_NAMES: Record<LabKind, string> = {
  'token-budget': 'context builder',
  'context-reset': 'fresh-chat decision',
  'model-match': 'model router',
  'log-hunt': 'log hunt',
  'output-shaper': 'prompt shaper',
  'ask-or-agent': 'ask or agent cards',
  'spot-the-bug': 'code review',
  'workflow-builder': 'assemble the playbook',
};
