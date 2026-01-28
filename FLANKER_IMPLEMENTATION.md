# Eriksen Flanker Task Implementation - Summary of Changes

This document summarizes the comprehensive refactoring of the N-Back app into an Eriksen Flanker Task application for the LNCO.ai neuroscience research platform.

## Overview

The N-Back working memory task has been completely replaced with an Eriksen Flanker task that:

- Displays a horizontal row of 5 arrows (center arrow + 4 flankers)
- Requires responses based on the CENTER arrow direction only
- Supports three trial conditions: congruent, incongruent, and neutral
- Includes practice with accuracy feedback per condition
- Records reaction time and accuracy for all trials
- Provides CSV and JSON download options for results

## Key Files Changed/Created

### 1. Settings Context (`src/modules/context/SettingsContext.tsx`)

**Changes:**

- Replaced `NBackSettingsType` with `FlankerSettingsType`
- New settings:
  - `numberOfTrials`: Main task trial count
  - `numberOfPracticeTrials`: Practice trial count
  - `congruentPercentage`: % congruent trials (flankers match center)
  - `incongruentPercentage`: % incongruent trials (flankers opposite)
  - `neutralPercentage`: % neutral trials (flankers are dashes)
  - `displayDuration`: Stimulus display time (ms)
  - `interTrialInterval`: Full inter-trial duration (ms)
  - `responseKey`: 'arrows' | 'mouse' | 'both'
  - `showFixationCross`: Boolean for fixation display during ITI
- Updated `AllSettingsType` to use `flankerSettings` instead of `nBackSettings`
- Updated `ALL_SETTING_NAMES` array
- Preserved backward compatibility for general/break/photoDiode settings

### 2. Experiment State Class (`src/modules/experiment/jspsych/experiment-state-class.ts`)

**Complete rewrite for Flanker logic:**

- New types:
  - `FlankerCondition`: 'congruent' | 'incongruent' | 'neutral'
  - `FlankerTrial`: Contains condition, correctResponse, and stimulus HTML
- New function `generateFlankerSequence()`:
  - Generates balanced trial sequences with configurable percentages
  - Returns shuffled `FlankerTrial[]`
- New function `createFlankerTrial()`:
  - Creates individual trials with HTML stimulus strings using arrow symbols
  - Generates congruent: ← ← ← ← ←
  - Generates incongruent: → → ← → →
  - Generates neutral: — — ← — —
- New `ExperimentState` class methods:
  - `getFlankerSettings()`: Returns flanker-specific settings
  - `initializePracticeSequence()`: Creates practice trials
  - `initializeMainSequence()`: Creates main task trials
  - `getTrials()`: Returns current trial sequence
  - `getCurrentTrial()`: Returns FlankerTrial object
  - `getPracticeAccuracyByCondition()`: Returns accuracy breakdown per condition
- Removed N-Back specific methods (sequence/target logic)

### 3. Flanker Stimulus Plugin (`src/modules/experiment/trials/flanker-stimulus-trial.ts`)

**New file - replaces NBackStimulusPlugin:**

- Parameters:
  - `stimulus`: HTML string with 5 symbols
  - `condition`: Trial type (for data recording)
  - `display_duration`: Stimulus display time
  - `inter_trial_interval`: Full ITI duration
  - `show_fixation`: Boolean for fixation cross
  - `valid_responses`: Arrow key codes
  - `allow_mouse_response`: Boolean
  - `correct_response`: 'left' | 'right'
- Features:
  - Displays fixation cross during ITI
  - Shows stimulus in center
  - Captures ArrowLeft/ArrowRight keyboard responses
  - Supports mouse responses (left vs right half-click)
  - Records RT and accuracy
  - Toggles photo-diode for EEG/MEG triggers
  - Records trial data with condition information

### 4. Practice Feedback Trial (`src/modules/experiment/trials/practice-feedback-trial.ts`)

**Updated for Flanker:**

- Shows overall accuracy and correct count
- Added breakdown by condition (congruent/incongruent/neutral)
- Removed N-Back specific metrics (hits/false positives)
- Displays accuracy percentage for each condition when applicable

### 5. Introduction Builder (`src/modules/experiment/parts/introduction.ts`)

**Updated instructions for Flanker:**

- Removed N-Back level references
- New screens:
  1. Welcome with Flanker task title
  2. Overview: Focus on center arrow, ignore flankers
  3. Task rules: Explains congruent/incongruent/neutral conditions with visual examples
  4. Response instructions: Left/right arrow keys or mouse clicks
  5. Practice intro
- Uses new i18n keys: `FLANKER.*`

### 6. Practice Builder (`src/modules/experiment/parts/practice.ts`)

**Refactored for Flanker:**

- Creates practice trials using `FlankerStimulusPlugin`
- Uses new settings: `displayDuration`, `interTrialInterval`, `showFixationCross`, `responseKey`
- Validates arrow key vs mouse response configuration
- Includes practice feedback and optional repeat loop
- Records practice responses with condition information

### 7. Task-Core Builder (`src/modules/experiment/parts/task-core.ts`)

**Refactored for Flanker:**

- Removed N-Back sequence logic
- Now uses `getTrials()` to iterate through FlankerTrial objects
- Creates trials with:
  - Stimulus HTML from trial.stimulus
  - Condition from trial.condition
  - Correct response from trial.correctResponse
- Added fixation cross support during ITI
- Maintained break logic and completion screens
- Updated messages to reference Flanker task

### 8. Main Experiment File (`src/modules/experiment/experiment.ts`)

**Updated metadata:**

- Changed title from "N-Back Working Memory Task" to "Eriksen Flanker Task"
- Updated description and function documentation

### 9. Flanker Settings View (`src/modules/settings/FlankerSettingsView.tsx`)

**New file - replaces NBackSettingsView in builder:**

- UI controls for:
  - Number of trials (main and practice)
  - Trial type percentages (congruent/incongruent/neutral)
  - Display duration (ms)
  - Inter-trial interval (ms)
  - Fixation cross toggle
  - Response method (arrows/mouse/both)
- Uses Material-UI form components
- Validates numeric ranges

### 10. Settings View (`src/modules/settings/SettingsView.tsx`)

**Updated to use FlankerSettingsView:**

- Replaced import from `NBackSettingsView` to `FlankerSettingsView`
- Changed state hooks: `nBackSettings` → `flankerSettings`
- Updated save/comparison logic for Flanker settings
- Maintains general, break, photoDiode, and next-step settings

### 11. Results View (`src/modules/answers/ResultsView.tsx`)

**Major improvements:**

- Title changed to "Flanker Task Results"
- Added CSV export functionality alongside JSON export
- New helper function `trialsToCsv()` converts trial data to CSV format
- New helper function `downloadCsv()` handles CSV file download
- Added user and user_id columns to CSV export
- Removed N-Back level column from results table
- Both JSON and CSV buttons available in toolbar and per-row downloads

### 12. Results Row (`src/modules/answers/ResultsRow.tsx`)

**Updated for Flanker:**

- Removed `nBackLevel` prop
- Added optional `csvDataDownload` prop
- Added CSV download button alongside JSON download
- Updated column headers to remove N-Back specific info
- Both download buttons with tooltips

### 13. Language Files (English & French)

**English (`src/langs/en.json`):**

- Added complete `FLANKER` section with instructions
- Updated `PRACTICE` section: added `ACCURACY_BY_CONDITION` and `CONTINUE_TITLE`
- Updated `MAIN_TASK` section: new messages for Flanker
- Added `SETTINGS.FLANKER_TITLE` and Flanker-specific settings keys
- Added keys for trial types and response methods
- Preserved all N-Back keys for potential backward compatibility

**French (`src/langs/fr.json`):**

- Complete French translations mirroring English structure
- Professional French terminology for cognitive science

## Data Structure Changes

### Trial Data Format

**Old (N-Back):**

```typescript
{
  stimulus: 5,
  response: true,
  correct_response: true,
  correct: true,
  rt: 450,
  trial_index: 23,
  practice: false
}
```

**New (Flanker):**

```typescript
{
  stimulus: "← ← ← ← ←",
  condition: "congruent",
  response: "left",
  correct_response: "left",
  correct: true,
  rt: 425,
  trial_index: 23,
  practice: false
}
```

## Feature Additions

### 1. Fixation Cross Display

- Optional fixation cross (+) during inter-trial interval
- Helps participants focus on center of screen before stimulus

### 2. Trial Condition Tracking

- Each trial includes condition label (congruent/incongruent/neutral)
- Enables condition-specific accuracy analysis
- Practice feedback shows accuracy breakdown by condition

### 3. CSV Export

- Tabular format for easy analysis in Excel/R/Python
- Includes all trial columns: stimulus, condition, response, correct, rt, etc.
- Multi-user aggregate export with user identification

### 4. Enhanced Settings UI

- Percentage controls for trial type balancing
- Discrete ITI setting (includes stimulus display time)
- Fixation cross toggle

## Backward Compatibility

- Preserved `generalSettings`, `breakSettings`, `photoDiodeSettings`, `nextStepSettings`
- Maintained N-Back language keys for potential dual-task support
- Same experiment architecture (builder/player/analytics contexts)
- Identical photo-diode triggering mechanism for EEG/MEG

## Testing Checklist

When testing the implementation, verify:

- [ ] Builder context: Flanker settings UI loads and saves correctly
- [ ] Player context: Flanker task runs through full experiment flow
- [ ] Practice phase: Shows correct instructions, accepts responses, provides feedback by condition
- [ ] Main task: Correct trial sequencing with configured percentages
- [ ] Breaks: Show when enabled between trials
- [ ] Results: Accurately calculate accuracy per trial and per condition
- [ ] Data download: Both JSON and CSV export correctly
- [ ] Arrow key vs mouse responses work as configured
- [ ] Fixation cross displays (if enabled)
- [ ] Photo-diode toggles (if enabled)
- [ ] All i18n keys resolve (French/English)
- [ ] No console errors or warnings

## Known Limitations & Future Enhancements

1. **Custom sequences**: Could be added similar to N-Back if needed
2. **Arrow rendering**: Currently uses Unicode arrows (←, →, —) - could be enhanced with graphics
3. **Adaptive difficulty**: Could implement staircase procedures for different populations
4. **Feedback timing**: Could add immediate accuracy feedback on each trial if desired
5. **Audio cues**: Could add beep for incorrect responses during practice

## Migration Notes for Researchers

- Existing N-Back data remains in database
- New Flanker tasks will use `flankerSettings` instead of `nBackSettings`
- CSV export provides standardized format for statistical analysis
- Condition labels enable targeted analysis of flanker effects (Stroop-like interference)
