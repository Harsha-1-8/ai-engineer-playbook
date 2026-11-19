import { Component, computed, output, signal } from '@angular/core';
import { LabResult } from '../lab-result';

interface CodeLine {
  no: number;
  code: string;
  issue?: { check: string; note: string };
}

/**
 * Episode 7 lab — review an AI-generated change against its requirements and
 * flag the problems. Solved when all three issues are found with at most one
 * false flag.
 */
@Component({
  selector: 'app-spot-the-bug-lab',
  templateUrl: './spot-the-bug.html',
  styleUrl: './spot-the-bug.scss',
})
export class SpotTheBugLab {
  readonly solved = output<LabResult>();

  private submits = 0;

  protected readonly requirements = [
    'Enable Save only when the form is valid and has unsaved changes.',
    'On save, PUT the user and show a success toast.',
    'If the save fails, show an error toast.',
  ];

  protected readonly lines: CodeLine[] = [
    { no: 1, code: 'export class UserEditComponent {' },
    { no: 2, code: '  private readonly api = inject(UserApi);' },
    { no: 3, code: '  private readonly toast = inject(ToastService);' },
    { no: 4, code: '  protected readonly form = buildUserForm();' },
    { no: 5, code: '' },
    { no: 6, code: '  protected get canSave(): boolean {' },
    {
      no: 7,
      code: '    return this.form.valid || this.form.dirty;',
      issue: {
        check: 'Requirements',
        note: 'Uses || instead of &&, so an invalid but edited form can be saved.',
      },
    },
    { no: 8, code: '  }' },
    { no: 9, code: '' },
    { no: 10, code: '  protected save(): void {' },
    { no: 11, code: '    const user = this.form.getRawValue();' },
    {
      no: 12,
      code: '    this.api.update(user.id, user).subscribe(() => {',
      issue: {
        check: 'Requirements',
        note: 'No error handler, so a failed save shows nothing. Requirement 3 is missing.',
      },
    },
    { no: 13, code: "      this.toast.success('User saved');" },
    { no: 14, code: '    });' },
    { no: 15, code: '  }' },
    { no: 16, code: '}' },
    { no: 17, code: '' },
    { no: 18, code: '// Also tidied this up while I was here.' },
    {
      no: 19,
      code: 'export const MAX_USERS_PER_PAGE = 10; // was 50',
      issue: {
        check: 'Impact',
        note: 'An unrequested change that silently affects every user list.',
      },
    },
  ];

  protected readonly flagged = signal<ReadonlySet<number>>(new Set());
  protected readonly submitted = signal(false);

  private readonly issueLines = this.lines.filter((l) => l.issue).map((l) => l.no);
  protected readonly totalIssues = this.issueLines.length;

  protected readonly hits = computed(
    () => this.issueLines.filter((n) => this.flagged().has(n)).length,
  );
  protected readonly falseFlags = computed(
    () => [...this.flagged()].filter((n) => !this.issueLines.includes(n)).length,
  );
  protected readonly isSolved = computed(
    () => this.hits() === this.totalIssues && this.falseFlags() <= 1,
  );

  protected toggle(line: CodeLine): void {
    if (!line.code.trim()) {
      return;
    }
    this.submitted.set(false);
    this.flagged.update((current) => {
      const next = new Set(current);
      if (next.has(line.no)) {
        next.delete(line.no);
      } else {
        next.add(line.no);
      }
      return next;
    });
  }

  protected isFlagged(no: number): boolean {
    return this.flagged().has(no);
  }

  protected submit(): void {
    this.submitted.set(true);
    this.submits++;
    if (this.isSolved()) {
      this.solved.emit({ firstTry: this.submits === 1 });
    }
  }

  protected reset(): void {
    this.flagged.set(new Set());
    this.submitted.set(false);
  }
}
