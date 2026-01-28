import {
  AllSettingsType,
  BreakSettingsType,
  FlankerSettingsType,
  GeneralSettingsType,
  NextStepSettings,
  PhotoDiodeSettings,
} from '@/modules/context/SettingsContext';

import { leftArrowSVG, neutralSVG, rightArrowSVG } from '../utils/constants';

/**
 * Trial condition types for Flanker task
 */
export type FlankerCondition = 'congruent' | 'incongruent' | 'neutral';

/**
 * Flanker trial definition
 */
export interface FlankerTrial {
  condition: FlankerCondition;
  correctResponse: 'left' | 'right'; // direction of center arrow
  stimulus: string; // HTML stimulus
}

/**
 * Creates a single Flanker trial with stimulus HTML
 */
function createFlankerTrial(
  condition: FlankerCondition,
  centerDirection: 'left' | 'right',
): FlankerTrial {
  const leftArrow = leftArrowSVG;
  const rightArrow = rightArrowSVG;
  const neutralSymbol = neutralSVG;
  let stimulus = '';
  let flankerSymbol = '';

  if (condition === 'congruent') {
    flankerSymbol = centerDirection === 'left' ? leftArrow : rightArrow;
    stimulus = `${flankerSymbol} ${flankerSymbol} ${
      centerDirection === 'left' ? leftArrow : rightArrow
    } ${flankerSymbol} ${flankerSymbol}`;
  } else if (condition === 'incongruent') {
    flankerSymbol = centerDirection === 'left' ? rightArrow : leftArrow;
    stimulus = `${flankerSymbol} ${flankerSymbol} ${
      centerDirection === 'left' ? leftArrow : rightArrow
    } ${flankerSymbol} ${flankerSymbol}`;
  } else {
    // neutral
    stimulus = `${neutralSymbol} ${neutralSymbol} ${
      centerDirection === 'left' ? leftArrow : rightArrow
    } ${neutralSymbol} ${neutralSymbol}`;
  }

  return {
    condition,
    correctResponse: centerDirection,
    stimulus,
  };
}

/**
 * Generates a balanced sequence of Flanker trials
 * @param length - Total number of trials
 * @param congruentPercentage - Percentage of congruent trials
 * @param incongruentPercentage - Percentage of incongruent trials
 * @returns Array of FlankerTrial objects
 */
export function generateFlankerSequence(
  length: number,
  congruentPercentage: number = 33,
  incongruentPercentage: number = 33,
): FlankerTrial[] {
  const trials: FlankerTrial[] = [];

  const congruentCount = Math.round((length * congruentPercentage) / 100);
  const incongruentCount = Math.round((length * incongruentPercentage) / 100);
  const neutralCount = length - congruentCount - incongruentCount;

  const conditions: FlankerCondition[] = [
    ...Array(congruentCount).fill('congruent'),
    ...Array(incongruentCount).fill('incongruent'),
    ...Array(neutralCount).fill('neutral'),
  ];

  // Shuffle array
  conditions.sort(() => Math.random() - 0.5);

  // Generate trials
  conditions.forEach((condition) => {
    const centerDirection = Math.random() < 0.5 ? 'left' : 'right';
    trials.push(
      createFlankerTrial(condition, centerDirection as 'left' | 'right'),
    );
  });

  return trials;
}

interface State {
  trials: FlankerTrial[];
  currentTrialIndex: number;
  practiceMode: boolean;
  practiceResponses: Array<{
    correct: boolean;
    condition: FlankerCondition;
    rt: number;
  }>;
}

export class ExperimentState {
  private state: State;

  private generalSettings: GeneralSettingsType;

  private flankerSettings: FlankerSettingsType;

  private breakSettings: BreakSettingsType;

  private photoDiodeSettings: PhotoDiodeSettings;

  private nextStepSettings: NextStepSettings;

  constructor(settings: AllSettingsType) {
    this.generalSettings = settings.generalSettings;
    this.flankerSettings = settings.flankerSettings;
    this.breakSettings = settings.breakSettings;
    this.photoDiodeSettings = settings.photoDiodeSettings;
    this.nextStepSettings = settings.nextStepSettings;

    // Initialize with empty state - will be set when experiment starts
    this.state = {
      trials: [],
      currentTrialIndex: 0,
      practiceMode: false,
      practiceResponses: [],
    };
  }

  // Getters for settings
  getGeneralSettings(): GeneralSettingsType {
    return this.generalSettings;
  }

  getFlankerSettings(): FlankerSettingsType {
    return this.flankerSettings;
  }

  getBreakSettings(): BreakSettingsType {
    return this.breakSettings;
  }

  getPhotoDiodeSettings(): PhotoDiodeSettings {
    return this.photoDiodeSettings;
  }

  getNextStepSettings(): NextStepSettings {
    return this.nextStepSettings;
  }

  getAllSettings(): AllSettingsType {
    return {
      generalSettings: this.generalSettings,
      flankerSettings: this.flankerSettings,
      breakSettings: this.breakSettings,
      photoDiodeSettings: this.photoDiodeSettings,
      nextStepSettings: this.nextStepSettings,
    };
  }

  // Sequence management
  initializePracticeSequence(): void {
    this.state.trials = generateFlankerSequence(
      this.flankerSettings.numberOfPracticeTrials,
      this.flankerSettings.congruentPercentage,
      this.flankerSettings.incongruentPercentage,
    );
    this.state.currentTrialIndex = 0;
    this.state.practiceMode = true;
    this.state.practiceResponses = [];
  }

  initializeMainSequence(): void {
    this.state.trials = generateFlankerSequence(
      this.flankerSettings.numberOfTrials,
      this.flankerSettings.congruentPercentage,
      this.flankerSettings.incongruentPercentage,
    );
    this.state.currentTrialIndex = 0;
  }

  startMainTask(): void {
    this.state.practiceMode = false;
    this.state.currentTrialIndex = 0;
  }

  getTrials(): FlankerTrial[] {
    return this.state.trials;
  }

  getCurrentTrial(): FlankerTrial {
    return this.state.trials[this.state.currentTrialIndex];
  }

  getCurrentTrialIndex(): number {
    return this.state.currentTrialIndex;
  }

  incrementTrial(): void {
    this.state.currentTrialIndex += 1;
  }

  // Practice management
  isPracticeMode(): boolean {
    return this.state.practiceMode;
  }

  recordPracticeResponse(
    correct: boolean,
    condition: FlankerCondition,
    rt: number,
  ): void {
    if (!this.state.practiceMode) {
      return;
    }

    this.state.practiceResponses.push({ correct, condition, rt });
  }

  getPracticeAccuracy(): number {
    if (this.state.practiceResponses.length === 0) {
      return 0;
    }
    const correct = this.state.practiceResponses.filter(
      (r) => r.correct,
    ).length;
    return (correct / this.state.practiceResponses.length) * 100;
  }

  getPracticeCorrectCount(): number {
    return this.state.practiceResponses.filter((r) => r.correct).length;
  }

  getPracticeTotalCount(): number {
    return this.state.practiceResponses.length;
  }

  getPracticeAccuracyByCondition(condition: FlankerCondition): {
    correct: number;
    total: number;
    accuracy: number;
  } {
    const responses = this.state.practiceResponses.filter(
      (r) => r.condition === condition,
    );
    if (responses.length === 0) {
      return { correct: 0, total: 0, accuracy: 0 };
    }
    const correct = responses.filter((r) => r.correct).length;
    return {
      correct,
      total: responses.length,
      accuracy: (correct / responses.length) * 100,
    };
  }

  // Break management
  shouldShowBreak(): boolean {
    return this.breakSettings.enableBreaks;
  }

  getBreakDuration(): number {
    return this.breakSettings.breakDuration;
  }

  // Check if experiment is complete
  isComplete(): boolean {
    return this.state.currentTrialIndex >= this.state.trials.length;
  }

  getTotalTrials(): number {
    return this.state.trials.length;
  }

  getRemainingTrials(): number {
    return this.state.trials.length - this.state.currentTrialIndex;
  }
}
