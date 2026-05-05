import FullscreenPlugin from '@jspsych/plugin-fullscreen';
import HtmlButtonResponsePlugin from '@jspsych/plugin-html-button-response';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AudioNarration } from 'jspsych-audio-narration';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import { Timeline, Trial } from '../utils/types';

/**
 * Fullscreen entry screen with instructions
 */
const experimentBeginTrial = (): Trial => ({
  type: FullscreenPlugin,
  button_label: i18n.t('FLANKER.START_BUTTON'),
  message: `
    <div class="flanker-intro">
      <h1>${i18n.t('FLANKER.WELCOME_TITLE')}</h1>
      <p>${i18n.t('FLANKER.WELCOME_MESSAGE')}</p>
    </div>
  `,
  fullscreen_mode: true,
});

/**
 * Detailed task instructions — single comprehensive screen matching neuropsychologist spec
 */
const taskInstructions = (narration: AudioNarration): Trial[] => [
  // Page 1: Overview and response keys
  {
    type: HtmlButtonResponsePlugin,
    choices: [i18n.t('FLANKER.CONTINUE_BUTTON')],
    stimulus: `
      <div class="flanker-instructions">
        <h2>${i18n.t('FLANKER.INSTRUCTIONS_TITLE')}</h2>
        <p>${i18n.t('FLANKER.INSTRUCTIONS_OVERVIEW')}</p>
        <p>${i18n.t('FLANKER.RESPONSE_LEFT')}</p>
        <p>${i18n.t('FLANKER.RESPONSE_RIGHT')}</p>
        <p>${i18n.t('FLANKER.IMAGE_INTRO')}</p>
        <img src="assets/images/arrow-keys.png" alt="Arrow keys" class="flanker-instruction-img" />
        <p>${i18n.t('FLANKER.KEYBOARD_NOTE')}</p>
        <img src="assets/images/hand.png" alt="Keyboard layout" class="flanker-instruction-img" />
      </div>
    `,
    on_start: () => {
      narration.play('assets/audio/flanker_instructions_page1.mp3');
    },
    on_finish: () => {
      narration.stop();
    },
  },
  // Page 2: Examples
  {
    type: HtmlButtonResponsePlugin,
    choices: [i18n.t('FLANKER.CONTINUE_BUTTON')],
    stimulus: `
      <div class="flanker-instructions">
        <h3>${i18n.t('FLANKER.EXAMPLES_TITLE')}</h3>
        <p>${i18n.t('FLANKER.EXAMPLES_SUBTEXT')}</p>
        <p>${i18n.t('FLANKER.EXAMPLE_CONGRUENT')}</p>
        <img src="assets/images/flanker-congruent.png" alt="Congruent flanker example" class="flanker-instruction-img" />
        <p>${i18n.t('FLANKER.EXAMPLE_INCONGRUENT')}</p>
        <img src="assets/images/flanker-incongruent.png" alt="Incongruent flanker example" class="flanker-instruction-img" />
        <p>${i18n.t('FLANKER.EXAMPLE_NEUTRAL')}</p>
        <img src="assets/images/flanker-neutral.png" alt="Neutral flanker example" class="flanker-instruction-img" />
      </div>
    `,
    on_start: () => {
      narration.play('assets/audio/flanker_instructions_page2.mp3');
    },
    on_finish: () => {
      narration.stop();
    },
  },
  // Page 3: Reminders
  {
    type: HtmlButtonResponsePlugin,
    choices: [i18n.t('FLANKER.START_PRACTICE_BUTTON')],
    stimulus: `
      <div class="flanker-instructions">
        <p>${i18n.t('FLANKER.TRAINING_INTRO')}</p>
        <p>${i18n.t('FLANKER.DURATION_NOTE')}</p>
        <p>${i18n.t('FLANKER.FIXATION_NOTE')}</p>
        <p class="important">${i18n.t('FLANKER.REMEMBER_NOTE')}</p>
        <p>${i18n.t('FLANKER.ACCURACY_NOTE')}</p>
        <p>${i18n.t('FLANKER.ERRORS_NOTE')}</p>
      </div>
    `,
    on_start: () => {
      narration.play('assets/audio/flanker_instructions_page3.mp3');
    },
    on_finish: () => {
      narration.stop();
    },
  },
];

/** Welcome / fullscreen-entry screen — always shown once, outside any retry loop */
export const buildWelcomeScreen = (): Trial[] => [experimentBeginTrial()];

/** Detailed instruction pages — shown inside the retry loop when practice is enabled */
export const buildInstructionPages = (
  state: ExperimentState,
  narration: AudioNarration,
): Timeline => {
  if (state.getGeneralSettings().skipInstructions) return [];
  return taskInstructions(narration);
};

/**
 * Build introduction timeline
 */
export const buildIntroduction = (
  state: ExperimentState,
  narration: AudioNarration,
): Timeline => {
  const instructionTimeline: Timeline = [];

  // Skip instructions if configured
  if (state.getGeneralSettings().skipInstructions) {
    instructionTimeline.push(experimentBeginTrial());
    return instructionTimeline;
  }

  // Full introduction sequence
  instructionTimeline.push(experimentBeginTrial());
  instructionTimeline.push(...taskInstructions(narration));

  return instructionTimeline;
};
