import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AudioNarration } from 'jspsych-audio-narration';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n, { getNarrationSrc } from '../jspsych/i18n';
import { Trial } from '../utils/types';

export const practiceFeedbackTrial = (
  state: ExperimentState,
  narration: AudioNarration,
): Trial => ({
  type: htmlKeyboardResponse,
  stimulus: () => {
    const accuracy = state.getPracticeAccuracy();
    const correct = state.getPracticeCorrectCount();
    const total = state.getPracticeTotalCount();

    return `
      <div class="flanker-feedback">
        <h2>${i18n.t('PRACTICE.FEEDBACK_TITLE')}</h2>
        <p>${i18n.t('PRACTICE.FEEDBACK_TEXT')}</p>
        <div class="feedback-stats">
          <p><strong>${i18n.t('PRACTICE.CORRECT_COUNT')}</strong> ${correct}/${total}</p>
          <p><strong>${i18n.t('PRACTICE.ACCURACY')}</strong> ${accuracy.toFixed(1)}%</p>
        </div>
        <p class="continue-prompt">${i18n.t('PRACTICE.PRESS_TO_CONTINUE')}</p>
      </div>
    `;
  },
  choices: [' '],
  on_start: () => {
    narration.play(getNarrationSrc('flanker_practice_result'));
  },
  on_finish: () => {
    narration.stop();
  },
});
