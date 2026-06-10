import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import type { DataCollection, JsPsych } from 'jspsych';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AudioNarration } from 'jspsych-audio-narration/dist/AudioNarration';

import { AllSettingsType } from '@/modules/context/SettingsContext';

import { ExperimentState } from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import { breakTrial } from '../trials/break-trial';
import { buildCountdown } from '../trials/countdown-trial';
import FlankerStimulusPlugin from '../trials/flanker-stimulus-trial';
import { Timeline } from '../utils/types';

/**
 * Build main task timeline with breaks
 */
export const buildMainTask = (
  state: ExperimentState,
  updateData: (data: DataCollection, settings: AllSettingsType) => void,
  jsPsych: JsPsych,
  narration: AudioNarration,
  startProgress: number = 0,
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
        <p>${i18n.t('MAIN_TASK.REMINDER_INSTRUCTIONS')}</p>
        <p class="continue-prompt">${i18n.t('MAIN_TASK.PRESS_TO_BEGIN')}</p>
      </div>
    `,
    choices: [' '],
    on_start: () => {
      narration.play('assets/audio/flanker_main_ready.mp3');
    },
    on_finish: () => {
      narration.stop();
    },
  });

  // Countdown before main task trials begin
  timeline.push(buildCountdown(jsPsych));

  // Get the full sequence
  const trials = state.getTrials();
  const totalTrials = trials.length;

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
        if (jsPsych.progressBar) {
          // eslint-disable-next-line no-param-reassign
          jsPsych.progressBar.progress =
            startProgress + (0.98 - startProgress) * ((i + 1) / totalTrials);
        }
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
    on_start: () => {
      narration.play('assets/audio/flanker_main_end.mp3');
    },
    on_finish: () => {
      narration.stop();
    },
  });

  return timeline;
};
