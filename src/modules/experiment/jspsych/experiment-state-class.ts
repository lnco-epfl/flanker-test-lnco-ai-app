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
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns the maximum consecutive run length of equal elements in an array.
 */
function maxRunLength<T>(arr: T[]): number {
  if (arr.length === 0) return 0;
  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < arr.length; i += 1) {
    currentRun = arr[i] === arr[i - 1] ? currentRun + 1 : 1;
    if (currentRun > maxRun) maxRun = currentRun;
  }
  return maxRun;
}

/**
 * Shuffles items trying to keep max consecutive run ≤ targetMaxRun.
 * If not achievable after MAX_ATTEMPTS, relaxes the constraint by 1 and retries,
 * continuing until a valid sequence is found.
 */
function shuffleWithMaxRun<T>(items: T[], targetMaxRun = 3): T[] {
  const MAX_ATTEMPTS = 1000;
  for (let maxRun = targetMaxRun; maxRun <= items.length; maxRun += 1) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const shuffled = shuffleArray(items);
      if (maxRunLength(shuffled) <= maxRun) {
        return shuffled;
      }
    }
  }
  return shuffleArray(items);
}

/**
 * Generates a balanced sequence of Flanker trials with:
 * - Exact equal thirds for congruent / incongruent / neutral
 *   (remainder trials randomly assigned when length % 3 !== 0)
 * - Exact equal halves for left / right responses
 *   (remainder trial randomly assigned when length % 2 !== 0)
 * - No more than 3 consecutive same condition or same direction,
 *   checked independently; constraint relaxed automatically if unavoidable
 */
export function generateFlankerSequence(length: number): FlankerTrial[] {
  // --- Condition counts: equal thirds, remainder distributed randomly ---
  const baseConditionCount = Math.floor(length / 3);
  const conditionRemainder = length % 3;
  const conditionTypes = shuffleArray<FlankerCondition>([
    'congruent',
    'incongruent',
    'neutral',
  ]);
  const conditionCounts: Record<FlankerCondition, number> = {
    congruent: baseConditionCount,
    incongruent: baseConditionCount,
    neutral: baseConditionCount,
  };
  for (let i = 0; i < conditionRemainder; i += 1) {
    conditionCounts[conditionTypes[i]] += 1;
  }
  const conditionPool: FlankerCondition[] = [
    ...Array<FlankerCondition>(conditionCounts.congruent).fill('congruent'),
    ...Array<FlankerCondition>(conditionCounts.incongruent).fill('incongruent'),
    ...Array<FlankerCondition>(conditionCounts.neutral).fill('neutral'),
  ];

  // --- Direction counts: equal halves, remainder distributed randomly ---
  const baseDirectionCount = Math.floor(length / 2);
  const directionRemainder = length % 2;
  const directionTypes = shuffleArray<'left' | 'right'>(['left', 'right']);
  const directionCounts: Record<'left' | 'right', number> = {
    left: baseDirectionCount,
    right: baseDirectionCount,
  };
  if (directionRemainder > 0) {
    directionCounts[directionTypes[0]] += 1;
  }
  const directionPool: ('left' | 'right')[] = [
    ...Array<'left'>(directionCounts.left).fill('left'),
    ...Array<'right'>(directionCounts.right).fill('right'),
  ];

  // --- Shuffle each pool with max-3-in-a-row constraint (independently) ---
  const conditionSequence = shuffleWithMaxRun(conditionPool, 3);
  const directionSequence = shuffleWithMaxRun(directionPool, 3);

  // --- Zip into trials ---
  return conditionSequence.map((condition, i) =>
    createFlankerTrial(condition, directionSequence[i]),
  );
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
    );
    this.state.currentTrialIndex = 0;
    this.state.practiceMode = true;
    this.state.practiceResponses = [];
  }

  initializeMainSequence(): void {
    this.state.trials = generateFlankerSequence(
      this.flankerSettings.numberOfTrials,
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
