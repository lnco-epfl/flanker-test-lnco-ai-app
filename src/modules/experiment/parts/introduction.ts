import FullscreenPlugin from '@jspsych/plugin-fullscreen';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import { Timeline, Trial } from '../utils/types';

/**
 * Fullscreen entry screen with instructions
 */
const experimentBeginTrial = (): Trial => ({
  type: FullscreenPlugin,
  choices: [i18n.t('FLANKER.START_BUTTON')],
  message: `
    <div class="flanker-intro">
      <h1>${i18n.t('FLANKER.WELCOME_TITLE')}</h1>
      <p>${i18n.t('FLANKER.WELCOME_MESSAGE')}</p>
    </div>
  `,
  fullscreen_mode: true,
});

/**
 * Detailed task instructions
 */
const taskInstructions = (): Trial[] => [
  {
    type: FullscreenPlugin,
    choices: [i18n.t('FLANKER.CONTINUE_BUTTON')],
    message: `
      <div class="flanker-ready">
        <h2>${i18n.t('FLANKER.INSTRUCTIONS_TITLE')}</h2>
        <p>${i18n.t('FLANKER.INSTRUCTIONS_OVERVIEW')}</p>
        <p>${i18n.t('FLANKER.INSTRUCTIONS_CENTER_FOCUS')}</p>
      </div>
    `,
  },
  {
    type: FullscreenPlugin,
    choices: [i18n.t('FLANKER.CONTINUE_BUTTON')],
    message: `
      <div class="flanker-ready">
        <h2>${i18n.t('FLANKER.RESPONSE_INSTRUCTIONS_TITLE')}</h2>
        <p>${i18n.t('FLANKER.RESPONSE_LEFT')}</p>
        <p>${i18n.t('FLANKER.RESPONSE_RIGHT')}</p>
        <p class="important">${i18n.t('FLANKER.IGNORE_FLANKERS')}</p>
        <p class="important">${i18n.t('FLANKER.SPEED_ACCURACY_BALANCE')}</p>
      </div>
    `,
  },
  {
    type: FullscreenPlugin,
    choices: [i18n.t('FLANKER.START_PRACTICE_BUTTON')],
    message: `
      <div class="flanker-ready">
        <h2>${i18n.t('FLANKER.PRACTICE_INTRO_TITLE')}</h2>
        <p>${i18n.t('FLANKER.PRACTICE_INTRO_MESSAGE')}</p>
        <p>${i18n.t('FLANKER.READY_MESSAGE')}</p>
      </div>
    `,
  },
];

/**
 * Build introduction timeline
 */
export const buildIntroduction = (state: ExperimentState): Timeline => {
  const instructionTimeline: Timeline = [];

  // Skip instructions if configured
  if (state.getGeneralSettings().skipInstructions) {
    instructionTimeline.push(experimentBeginTrial());
    return instructionTimeline;
  }

  // Full introduction sequence
  instructionTimeline.push(experimentBeginTrial());
  instructionTimeline.push(...taskInstructions());

  return instructionTimeline;
};
