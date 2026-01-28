import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import type { DataCollection, JsPsych } from 'jspsych';

import { AllSettingsType } from '@/modules/context/SettingsContext';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import { breakTrial } from '../trials/break-trial';
import FlankerStimulusPlugin from '../trials/flanker-stimulus-trial';
import { Timeline } from '../utils/types';

/**
 * Build main task timeline with breaks
 */
export const buildMainTask = (
  state: ExperimentState,
  updateData: (data: DataCollection, settings: AllSettingsType) => void,
  jsPsych: JsPsych,
): Timeline => {
  const timeline: Timeline = [];

  // Initialize main sequence
  state.initializeMainSequence();

  // Get settings
  const {
    displayDuration,
    interTrialInterval,
    responseKey,
    showFixationCross,
  } = state.getFlankerSettings();

  // Determine valid keyboard responses and mouse setting
  const validResponses =
    responseKey === 'mouse' ? 'NO_KEYS' : ['ArrowLeft', 'ArrowRight'];
  const allowMouse = responseKey !== 'arrows';

  // Add ready screen
  timeline.push({
    type: htmlKeyboardResponse,
    stimulus: `
      <div class="flanker-ready">
        <h2>${i18n.t('MAIN_TASK.READY_TITLE')}</h2>
        <p>${i18n.t('MAIN_TASK.READY_MESSAGE')}</p>
        <p class="continue-prompt">${i18n.t('MAIN_TASK.PRESS_TO_BEGIN')}</p>
      </div>
    `,
    choices: [' '],
  });

  // Get the full sequence
  const trials = state.getTrials();

  // Create main task trials
  for (let i = 0; i < trials.length; i += 1) {
    const trial = trials[i];

    const flankerTrial = {
      type: FlankerStimulusPlugin,
      stimulus: trial.stimulus,
      condition: trial.condition,
      display_duration: displayDuration,
      inter_trial_interval: interTrialInterval,
      show_fixation: showFixationCross,
      valid_responses: validResponses,
      allow_mouse_response: allowMouse,
      correct_response: trial.correctResponse,
      trial_index: i,
      state,
      on_finish: () => {
        // Save data after each trial
        if (updateData && jsPsych) {
          updateData(jsPsych.data.get(), state.getAllSettings());
        }
      },
    };

    timeline.push(flankerTrial);

    // Add break after trial if needed (check after incrementing counter in on_finish)
    if (
      state.getBreakSettings().enableBreaks &&
      i > 0 &&
      i < trials.length - 1 &&
      (i + 1) % state.getBreakSettings().breakFrequency === 0
    ) {
      timeline.push(breakTrial(state, jsPsych));
    }
  }

  // Add completion screen
  timeline.push({
    type: htmlKeyboardResponse,
    stimulus: `
      <div class="flanker-complete">
        <h2>${i18n.t('MAIN_TASK.COMPLETE_TITLE')}</h2>
        <p>${i18n.t('MAIN_TASK.COMPLETE_MESSAGE')}</p>
        <p class="continue-prompt">${i18n.t('MAIN_TASK.PRESS_TO_CONTINUE')}</p>
      </div>
    `,
    choices: [' '],
  });

  return timeline;
};
