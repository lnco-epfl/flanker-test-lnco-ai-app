import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import type { JsPsych } from 'jspsych';

import { Trial } from '../utils/types';

export const buildCountdown = (jsPsych: JsPsych): Trial => ({
  type: htmlKeyboardResponse,
  choices: 'NO_KEYS',
  stimulus:
    '<div class="flanker-countdown"><span class="countdown-number">3</span></div>',
  trial_duration: null,
  on_load() {
    const el = document.querySelector(
      '.countdown-number',
    ) as HTMLElement | null;
    if (!el) return;

    const counts = ['3', '2', '1'];
    let step = 0;
    el.textContent = counts[step];
    el.classList.add('countdown-pop');

    const interval = setInterval(() => {
      step += 1;
      if (step < counts.length) {
        el.classList.remove('countdown-pop');
        el.textContent = counts[step];
        el.classList.add('countdown-pop');
      } else {
        clearInterval(interval);
        jsPsych.finishTrial();
      }
    }, 1000);
  },
});
