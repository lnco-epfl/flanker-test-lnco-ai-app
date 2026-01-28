import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import { TIMING } from '../utils/constants';
import { Trial } from '../utils/types';

export const practiceFeedbackTrial = (state: ExperimentState): Trial => ({
  type: htmlKeyboardResponse,
  stimulus: () => {
    const accuracy = state.getPracticeAccuracy();
    const correct = state.getPracticeCorrectCount();
    const total = state.getPracticeTotalCount();

    const congruent = state.getPracticeAccuracyByCondition('congruent');
    const incongruent = state.getPracticeAccuracyByCondition('incongruent');
    const neutral = state.getPracticeAccuracyByCondition('neutral');

    return `
      <div class="flanker-feedback">
        <h2>${i18n.t('PRACTICE.FEEDBACK_TITLE')}</h2>
        <p>${i18n.t('PRACTICE.FEEDBACK_TEXT')}</p>
        <div class="feedback-stats">
          <p><strong>${i18n.t('PRACTICE.CORRECT_COUNT')}</strong> ${correct}/${total}</p>
          <p><strong>${i18n.t('PRACTICE.ACCURACY')}</strong> ${accuracy.toFixed(1)}%</p>
          <hr />
          <h3>${i18n.t('PRACTICE.ACCURACY_BY_CONDITION')}</h3>
          ${
            congruent.total > 0
              ? `<p><strong>${i18n.t('FLANKER.CONGRUENT')}</strong> ${congruent.correct}/${congruent.total} (${congruent.accuracy.toFixed(1)}%)</p>`
              : ''
          }
          ${
            incongruent.total > 0
              ? `<p><strong>${i18n.t('FLANKER.INCONGRUENT')}</strong> ${incongruent.correct}/${incongruent.total} (${incongruent.accuracy.toFixed(1)}%)</p>`
              : ''
          }
          ${
            neutral.total > 0
              ? `<p><strong>${i18n.t('FLANKER.NEUTRAL')}</strong> ${neutral.correct}/${neutral.total} (${neutral.accuracy.toFixed(1)}%)</p>`
              : ''
          }
        </div>
        <p class="continue-prompt">${i18n.t('PRACTICE.PRESS_TO_CONTINUE')}</p>
      </div>
    `;
  },
  choices: [' '],
  post_trial_gap: TIMING.POST_TRIAL_GAP,
});
