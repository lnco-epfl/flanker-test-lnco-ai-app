import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import type { DataCollection, JsPsych } from 'jspsych';

import { AllSettingsType } from '@/modules/context/SettingsContext';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import FlankerStimulusPlugin from '../trials/flanker-stimulus-trial';
import { practiceFeedbackTrial } from '../trials/practice-feedback-trial';
import { Timeline } from '../utils/types';

/**
 * Build practice trials timeline
 */
export const buildPractice = (
  state: ExperimentState,
  updateData?: (data: DataCollection, settings: AllSettingsType) => void,
  jsPsych?: JsPsych,
): Timeline => {
  const timeline: Timeline = [];

  // Skip practice if configured
  if (state.getGeneralSettings().skipPractice) {
    return timeline;
  }

  // Initialize practice sequence
  state.initializePracticeSequence();

  // Get practice settings
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

  // Get the full sequence
  const trials = state.getTrials();

  // Create practice trials
  for (let i = 0; i < trials.length; i += 1) {
    const trial = trials[i];

    const practiceTrialObj = {
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

    timeline.push(practiceTrialObj);
  }

  // Add feedback screen
  timeline.push(practiceFeedbackTrial(state));

  // Option to repeat practice
  timeline.push({
    type: htmlKeyboardResponse,
    stimulus: `
      <div class="flanker-practice-repeat">
        <h2>${i18n.t('PRACTICE.CONTINUE_TITLE')}</h2>
        <p>${i18n.t('PRACTICE.PRESS_TO_CONTINUE')}</p>
      </div>
    `,
    choices: ['r', ' '],
    on_finish: (data: unknown) => {
      // If 'r' was pressed, restart practice
      const d = data as Record<string, unknown>;
      if (d.response === 'r') {
        d.repeat_practice = true;
      }
    },
  });

  // Conditional repetition
  const practiceLoop = {
    timeline,
    loop_function: (data: unknown) => {
      // Check the last trial for repeat_practice flag
      const d = data as Record<string, unknown> & { values: () => unknown[] };
      const lastTrial = d.values().slice(-1)[0] as
        | Record<string, unknown>
        | undefined;
      return lastTrial?.repeat_practice === true;
    },
  };

  return [practiceLoop];
};
