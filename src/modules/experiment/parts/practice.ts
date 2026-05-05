import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import type { DataCollection, JsPsych } from 'jspsych';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AudioNarration } from 'jspsych-audio-narration';

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
  narration: AudioNarration,
  updateData?: (data: DataCollection, settings: AllSettingsType) => void,
  jsPsych?: JsPsych,
  prologueTimeline: Timeline = [],
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

  // Add practice feedback screen
  timeline.push(practiceFeedbackTrial(state, narration));

  // Training complete screen
  // timeline.push({
  //   type: htmlButtonResponse,
  //   stimulus: `
  //     <div class="flanker-feedback">
  //       <h2>${i18n.t('PRACTICE.COMPLETE_TITLE')}</h2>
  //     </div>
  //   `,
  //   choices: [i18n.t('PRACTICE.CONTINUE_BUTTON')],
  // });

  // Comprehension check — correct answer is button index 0 ("The center arrow")
  timeline.push({
    type: htmlButtonResponse,
    stimulus: `
      <div class="flanker-feedback">
        ${i18n.t('PRACTICE.COMPREHENSION_QUESTION')}
      </div>
    `,
    choices: [
      i18n.t('PRACTICE.COMPREHENSION_OPTION_CENTER'),
      i18n.t('PRACTICE.COMPREHENSION_OPTION_SIDES'),
      i18n.t('PRACTICE.COMPREHENSION_OPTION_ALL'),
    ],
    button_layout: 'flex',
    data: { trial_type: 'comprehension_check' },
    css_classes: ['flanker-comprehension'],
    on_start: () => {
      narration.play('assets/audio/flanker_practice_comprehension.mp3');
    },
    on_finish: () => {
      narration.stop();
    },
  });

  let practiceRepeatCount = 0;

  const repeatNoticeEntry = {
    timeline: [
      {
        type: htmlButtonResponse,
        stimulus: `<div class="flanker-feedback"><p>${i18n.t('PRACTICE.REPEAT_NOTICE')}</p></div>`,
        choices: [i18n.t('FLANKER.CONTINUE_BUTTON')],
        on_start: () => {
          narration.play('assets/audio/flanker_practice_repeat.mp3');
        },
        on_finish: () => {
          narration.stop();
        },
      },
    ],
    conditional_function: () => practiceRepeatCount > 0,
  };

  // Repeat if any practice trial was wrong OR comprehension check is wrong.
  // Maximum 1 retry — always proceed after the second attempt regardless.
  const practiceLoop = {
    timeline: [repeatNoticeEntry, ...prologueTimeline, ...timeline],
    loop_function: (data: DataCollection) => {
      if (practiceRepeatCount >= 1) return false;

      type TrialRecord = Record<string, unknown>;
      const practiceTrials = data
        .filter({ practice: true })
        .values() as TrialRecord[];
      const hadMistake = !practiceTrials.some((t) => t.correct === true);

      const comprehensionTrials = data
        .filter({ trial_type: 'html-button-response' })
        .values() as TrialRecord[];
      const lastComprehension =
        comprehensionTrials[comprehensionTrials.length - 1];
      const comprehensionWrong = lastComprehension?.response !== 0;

      if (hadMistake || comprehensionWrong) {
        practiceRepeatCount += 1;
        state.initializePracticeSequence();
        return true;
      }
      return false;
    },
  };

  // Ready screen — always shown after the loop regardless of comprehension result
  return [practiceLoop];
};
