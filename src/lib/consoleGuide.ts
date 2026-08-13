/**
 * Console guidance channel.
 *
 * Prints `[Lab]`-prefixed, styled messages so the learner can spot them
 * among noisy browser-extension output. Uses `%c` CSS styling.
 */

import type { ConsoleHint } from '@/labs/types';

const LABEL_STYLE =
  'background:#4ea1ff;color:#0f1115;padding:2px 6px;border-radius:3px;font-weight:700;';
const BODY_STYLE = 'color:#9aa3b2;';
const EMOJI_STYLE = 'font-size:13px;';

const SUCCESS_LABEL_STYLE =
  'background:#4ade80;color:#0f1115;padding:2px 6px;border-radius:3px;font-weight:700;';

/**
 * Print one hint to the console with the unified `[Lab]` prefix.
 */
export function printHint(hint: ConsoleHint): void {
  const emoji = hint.emoji ? `%c${hint.emoji} ` : '%c';
  // Order of %c placeholders must match order of style args.
  if (hint.emoji) {
    console.log(
      `%c[Lab]%c ${emoji}%c${hint.message}`,
      LABEL_STYLE,
      EMOJI_STYLE,
      BODY_STYLE,
    );
  } else {
    console.log(`%c[Lab]%c ${hint.message}`, LABEL_STYLE, BODY_STYLE);
  }
}

/**
 * Print a celebration banner when validation passes.
 */
export function printCelebration(message: string): void {
  console.log(
    `%c[Lab]%c 🎉 ${message}`,
    SUCCESS_LABEL_STYLE,
    'color:#4ade80;font-weight:600;',
  );
}

/**
 * Print a separator line to visually chunk sections.
 */
export function printSeparator(title: string): void {
  console.log(`%c── ${title} ──────────────`, 'color:#4ea1ff;font-weight:700;');
}
