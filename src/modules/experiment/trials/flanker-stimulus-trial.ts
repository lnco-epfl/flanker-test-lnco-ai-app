import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

import {
  ExperimentState,
  FlankerCondition,
} from '../jspsych/experiment-state-class';
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
    const element = displayElement;
    element.className = `flanker-trial font-${fontSize}`;

    // Show fixation cross
    if (trial.show_fixation) {
      const fixationDiv = document.createElement('div');
      fixationDiv.className = 'fixation-cross';
      fixationDiv.innerHTML = '+';
      displayElement.appendChild(fixationDiv);

      // Show fixation, then show stimulus
      this.jsPsych.pluginAPI.setTimeout(() => {
        fixationDiv.remove();
        this.displayStimulus(displayElement, trial, state);
      }, TIMING.FIXATION_DURATION);
    } else {
      // Show stimulus immediately
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

    const keyboardListener = (e: KeyboardEvent): void => {
      if (!this.responseAllowed || this.responseGiven) return;
      if (
        e.key === 'ArrowLeft' &&
        trial.valid_responses.includes('ArrowLeft')
      ) {
        this.responseGiven = true;
        response = 'left';
        this.responseTime = performance.now() - this.startTime;
        removeStimulus();
        e.preventDefault();

        // End trial after late response buffer + ITI
        this.jsPsych.pluginAPI.setTimeout(() => {
          endTrial();
        }, TIMING.LATE_RESPONSE_BUFFER + trial.inter_trial_interval);
      } else if (
        e.key === 'ArrowRight' &&
        trial.valid_responses.includes('ArrowRight')
      ) {
        this.responseGiven = true;
        response = 'right';
        this.responseTime = performance.now() - this.startTime;
        removeStimulus();
        e.preventDefault();

        // End trial after late response buffer + ITI
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

      // End trial after late response buffer + ITI
      this.jsPsych.pluginAPI.setTimeout(() => {
        endTrial();
      }, TIMING.LATE_RESPONSE_BUFFER + trial.inter_trial_interval);
    };

    document.addEventListener('keydown', keyboardListener);
    if (trial.allow_mouse_response) {
      displayElement.addEventListener('click', mouseListener);
    }

    FlankerStimulusPlugin.togglePhotoDiode(true);

    // Remove stimulus after display_duration if no response yet
    this.jsPsych.pluginAPI.setTimeout(() => {
      if (!this.responseGiven) {
        removeStimulus();

        // End trial after late response buffer + ITI
        this.jsPsych.pluginAPI.setTimeout(() => {
          endTrial();
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
