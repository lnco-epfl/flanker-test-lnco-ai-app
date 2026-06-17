import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

import {
  ExperimentState,
  FlankerCondition,
} from '../jspsych/experiment-state-class';
import i18n from '../jspsych/i18n';
import { TIMING } from '../utils/constants';

const info = {
  name: 'flanker-stimulus',
  parameters: {
    stimulus: {
      type: ParameterType.STRING,
      default: undefined,
    },
    condition: {
      type: ParameterType.STRING,
      default: 'congruent',
    },
    correct_response: {
      type: ParameterType.STRING, // 'left' or 'right'
      default: 'left',
    },
    display_duration: {
      type: ParameterType.INT,
      default: 5000,
    },
    inter_trial_interval: {
      type: ParameterType.INT,
      default: 2000,
    },
    show_fixation: {
      type: ParameterType.BOOL,
      default: true,
    },
    valid_responses: {
      type: ParameterType.KEYS,
      default: ['ArrowLeft', 'ArrowRight'],
    },
    allow_mouse_response: {
      type: ParameterType.BOOL,
      default: false,
    },
    trial_index: {
      type: ParameterType.INT,
      default: 0,
    },
    state: {
      type: ParameterType.COMPLEX,
      default: undefined,
    },
    show_training_feedback: {
      type: ParameterType.BOOL,
      default: false,
    },
  },
};

type Info = typeof info;

class FlankerStimulusPlugin implements JsPsychPlugin<Info> {
  static info = info;

  private responseAllowed = false;

  private responseGiven = false;

  private responseTime: number | null = null;

  private startTime: number = 0;

  constructor(private jsPsych: JsPsych) {}

  trial(displayElement: HTMLElement, trial: TrialType<Info>): void {
    const state = trial.state as ExperimentState;
    const { fontSize } = state.getGeneralSettings();
    const calibratedFontSize =
      displayElement.getAttribute('data-font-size') ?? fontSize;
    const element = displayElement;
    element.className = `flanker-trial font-${calibratedFontSize}`;

    if (trial.show_fixation) {
      const fixationDiv = document.createElement('div');
      fixationDiv.className = 'fixation-cross';
      fixationDiv.innerHTML = '+';
      displayElement.appendChild(fixationDiv);

      this.jsPsych.pluginAPI.setTimeout(() => {
        fixationDiv.remove();
        this.displayStimulus(displayElement, trial, state);
      }, TIMING.FIXATION_DURATION);
    } else {
      this.displayStimulus(displayElement, trial, state);
    }
  }

  private displayStimulus(
    displayElement: HTMLElement,
    trial: TrialType<Info>,
    state: ExperimentState,
  ): void {
    const stimulusDiv = document.createElement('div');
    stimulusDiv.className = 'flanker-stimulus-container';
    stimulusDiv.innerHTML = `<div class="flanker-stimulus">${trial.stimulus}</div>`;
    displayElement.appendChild(stimulusDiv);

    let response: 'left' | 'right' | null = null;
    this.responseGiven = false;
    this.responseAllowed = true;
    this.startTime = performance.now();
    let stimulusRemoved = false;

    const removeStimulus = (): void => {
      if (!stimulusRemoved) {
        stimulusRemoved = true;
        stimulusDiv.style.display = 'none';
        FlankerStimulusPlugin.togglePhotoDiode(false);
      }
    };

    const showFeedback = (type: 'correct' | 'incorrect' | 'miss'): void => {
      const feedbackDiv = document.createElement('div');
      if (type === 'correct') {
        feedbackDiv.className = 'nback-trial-feedback--correct';
        feedbackDiv.textContent = '✓';
      } else if (type === 'incorrect') {
        feedbackDiv.className = 'nback-trial-feedback--incorrect';
        feedbackDiv.textContent = i18n.t(
          'PRACTICE.TRIAL_FEEDBACK_FALSE_POSITIVE',
        );
      } else {
        feedbackDiv.className = 'nback-trial-feedback--incorrect';
        feedbackDiv.textContent = i18n.t('PRACTICE.TRIAL_FEEDBACK_MISS');
      }
      displayElement.appendChild(feedbackDiv);
    };

    const endTrial = (): void => {
      this.responseAllowed = false;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      document.removeEventListener('keydown', keyboardListener);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      displayElement.removeEventListener('click', mouseListener);

      const correct = response === trial.correct_response;

      if (state.isPracticeMode()) {
        state.recordPracticeResponse(
          correct,
          trial.condition as FlankerCondition,
          this.responseTime || 0,
        );
      }

      state.incrementTrial();

      const trialData = {
        stimulus: trial.stimulus,
        condition: trial.condition,
        response,
        correct_response: trial.correct_response,
        correct,
        rt: this.responseTime,
        trial_index: trial.trial_index,
        practice: state.isPracticeMode(),
      };

      const el = displayElement;
      el.innerHTML = '';
      this.jsPsych.finishTrial(trialData);
    };

    // Feedback on response: visible for at least 1000ms. The ITI acts as the
    // response window, so we wait max(1000, ITI) from the moment of the response.
    const scheduleEndAfterResponse = (): void => {
      this.jsPsych.pluginAPI.setTimeout(
        () => {
          endTrial();
        },
        Math.max(
          1000,
          TIMING.LATE_RESPONSE_BUFFER + trial.inter_trial_interval,
        ),
      );
    };

    const keyboardListener = (e: KeyboardEvent): void => {
      if (!this.responseAllowed || this.responseGiven) return;

      let pressedDirection: 'left' | 'right' | null = null;
      if (
        e.key === 'ArrowLeft' &&
        trial.valid_responses.includes('ArrowLeft')
      ) {
        pressedDirection = 'left';
      } else if (
        e.key === 'ArrowRight' &&
        trial.valid_responses.includes('ArrowRight')
      ) {
        pressedDirection = 'right';
      }

      if (!pressedDirection) return;

      this.responseGiven = true;
      response = pressedDirection;
      this.responseTime = performance.now() - this.startTime;
      removeStimulus();
      e.preventDefault();

      if (trial.show_training_feedback) {
        const isCorrect = response === trial.correct_response;
        showFeedback(isCorrect ? 'correct' : 'incorrect');
        scheduleEndAfterResponse();
      } else {
        this.jsPsych.pluginAPI.setTimeout(() => {
          endTrial();
        }, TIMING.LATE_RESPONSE_BUFFER + trial.inter_trial_interval);
      }
    };

    const mouseListener = (e: MouseEvent): void => {
      if (
        !this.responseAllowed ||
        this.responseGiven ||
        !trial.allow_mouse_response
      )
        return;

      const rect = displayElement.getBoundingClientRect();
      const centerX = rect.width / 2;
      const clickX = e.clientX - rect.left;

      this.responseGiven = true;
      response = clickX < centerX ? 'left' : 'right';
      this.responseTime = performance.now() - this.startTime;
      removeStimulus();

      if (trial.show_training_feedback) {
        const isCorrect = response === trial.correct_response;
        showFeedback(isCorrect ? 'correct' : 'incorrect');
        scheduleEndAfterResponse();
      } else {
        this.jsPsych.pluginAPI.setTimeout(() => {
          endTrial();
        }, TIMING.LATE_RESPONSE_BUFFER + trial.inter_trial_interval);
      }
    };

    document.addEventListener('keydown', keyboardListener);
    if (trial.allow_mouse_response) {
      displayElement.addEventListener('click', mouseListener);
    }

    FlankerStimulusPlugin.togglePhotoDiode(true);

    // After the stimulus display window, hide the stimulus. The ITI continues
    // as the response window. Once the full ITI has elapsed with no response,
    // close the response window and (in practice) show miss feedback.
    this.jsPsych.pluginAPI.setTimeout(() => {
      if (!this.responseGiven) {
        removeStimulus();

        this.jsPsych.pluginAPI.setTimeout(() => {
          if (!this.responseGiven) {
            if (trial.show_training_feedback) {
              // Close response window before feedback is visible
              this.responseAllowed = false;
              document.removeEventListener('keydown', keyboardListener);
              displayElement.removeEventListener('click', mouseListener);
              showFeedback('miss');
              this.jsPsych.pluginAPI.setTimeout(() => {
                endTrial();
              }, 1000);
            } else {
              endTrial();
            }
          }
        }, TIMING.LATE_RESPONSE_BUFFER + trial.inter_trial_interval);
      }
    }, trial.display_duration);
  }

  private static togglePhotoDiode(white: boolean): void {
    const photoDiode = document.getElementById('photo-diode-element');
    if (photoDiode) {
      if (white) {
        photoDiode.classList.remove('photo-diode-black');
        photoDiode.classList.add('photo-diode-white');
      } else {
        photoDiode.classList.remove('photo-diode-white');
        photoDiode.classList.add('photo-diode-black');
      }
    }
  }
}

export default FlankerStimulusPlugin;
