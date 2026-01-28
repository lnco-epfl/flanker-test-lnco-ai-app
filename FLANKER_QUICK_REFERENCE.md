# Quick Reference: Eriksen Flanker Task Implementation

## What Was Changed

This repository has been converted from an **N-Back Working Memory Task** to an **Eriksen Flanker Task**. All core functionality remains the same (builder/player/analytics contexts, Graasp integration, photo-diode support), but the cognitive task itself has been completely refactored.

## File Modifications Summary

| File                         | Type      | Changes                                                        |
| ---------------------------- | --------- | -------------------------------------------------------------- |
| `SettingsContext.tsx`        | Modified  | NBackSettingsType → FlankerSettingsType                        |
| `experiment-state-class.ts`  | Rewritten | Flanker trial generation & management                          |
| `flanker-stimulus-trial.ts`  | Created   | New stimulus display plugin (replaces nback-stimulus-trial.ts) |
| `introduction.ts`            | Updated   | New Flanker instructions & screens                             |
| `practice.ts`                | Updated   | Flanker practice with condition-based feedback                 |
| `task-core.ts`               | Updated   | Flanker trial sequencing & display                             |
| `experiment.ts`              | Updated   | Title & description changes                                    |
| `FlankerSettingsView.tsx`    | Created   | Settings UI for Flanker task                                   |
| `SettingsView.tsx`           | Updated   | Uses FlankerSettingsView instead of NBackSettingsView          |
| `ResultsView.tsx`            | Enhanced  | Added CSV export, updated title                                |
| `ResultsRow.tsx`             | Modified  | CSV download support, removed N-Back columns                   |
| `practice-feedback-trial.ts` | Updated   | Accuracy breakdown by condition                                |
| `en.json` & `fr.json`        | Enhanced  | Added FLANKER section, updated MAIN_TASK messages              |

**Note**: Old N-Back files (nback-stimulus-trial.ts, NBackSettingsView.tsx) remain in repository for reference or potential dual-task support.

## Trial Generation Logic

### Flanker Trial Conditions

```
Congruent:   ← ← ← ← ←  (all arrows point same direction)
Incongruent: → → ← → →  (flankers opposite to center)
Neutral:     — — ← — —  (flankers are dashes)
```

### Sequence Generation

```typescript
generateFlankerSequence(
  length: 60,                    // total trials
  congruentPercentage: 33,       // 33% congruent
  incongruentPercentage: 33,     // 33% incongruent
  neutralPercentage: 34          // 34% neutral
): FlankerTrial[]
```

## Settings Structure

```typescript
flankerSettings: {
  numberOfTrials: 60,            // main task trials
  numberOfPracticeTrials: 10,    // practice trials
  congruentPercentage: 33,       // 0-100
  incongruentPercentage: 33,     // 0-100
  neutralPercentage: 34,         // automatically filled
  displayDuration: 500,          // ms (100-2000)
  interTrialInterval: 2000,      // ms (500-5000)
  responseKey: 'arrows',         // 'arrows' | 'mouse' | 'both'
  showFixationCross: true        // boolean
}
```

## Trial Data Format

Each trial records:

```typescript
{
  stimulus: "← ← ← ← ←",         // HTML string of symbols
  condition: "congruent",        // 'congruent' | 'incongruent' | 'neutral'
  response: "left",              // 'left' | 'right' | null
  correct_response: "left",      // 'left' | 'right'
  correct: true,                 // boolean
  rt: 425,                       // reaction time in ms
  trial_index: 23,               // position in sequence
  practice: false                // boolean
}
```

## Key Components

### 1. ExperimentState Class

- `generateFlankerSequence()` - Creates balanced trial sequences
- `initializePracticeSequence()` - Setup practice trials
- `initializeMainSequence()` - Setup main task trials
- `getTrials()` - Returns FlankerTrial[]
- `getPracticeAccuracyByCondition(condition)` - Accuracy breakdown

### 2. FlankerStimulusPlugin

- Displays 5-symbol stimulus row (center arrow + 4 flankers)
- Fixation cross during inter-trial interval (optional)
- Captures left/right arrow key or mouse responses
- Records RT and accuracy
- Toggles photo-diode for EEG/MEG

### 3. FlankerSettingsView

- UI controls for all flanker-specific settings
- Percentage validation for trial types
- Range validation for timing parameters

### 4. Results Export

- **JSON**: Full raw trial data in jsPsych format
- **CSV**: Tabular format with all trial columns
- Both formats include condition labels for analysis

## Experiment Flow

```
1. Introduction Screen
   ↓
2. Task Instructions (4 screens)
   ↓
3. Practice Phase
   - 10 trials (default)
   - Feedback showing overall accuracy + breakdown by condition
   - Option to repeat
   ↓
4. Main Task
   - 60 trials (default, balanced by condition)
   - Optional breaks every 30 trials
   - Fixation cross during ITI (optional)
   ↓
5. Completion Screen
```

## Comparison: N-Back vs Flanker

| Aspect               | N-Back                   | Flanker                         |
| -------------------- | ------------------------ | ------------------------------- |
| **Response Type**    | Detect matching sequence | Identify center arrow direction |
| **Memory Load**      | Yes (1-4 back)           | No (immediate)                  |
| **Flanker Effects**  | N/A                      | Congruency & interference       |
| **Data Points**      | Stimulus (digit)         | Stimulus (5 symbols), Condition |
| **Practice Metrics** | Hits/False Positives     | Accuracy per condition          |
| **Export Formats**   | JSON only                | JSON + CSV                      |

## For Researchers Using This App

### Setting Up Flanker Experiments

1. **Builder Context**: Configure trial counts, percentages, timing, response method
2. **Player Context**: Participants complete task with practice + main trial blocks
3. **Analytics Context**: View results with condition-based accuracy breakdowns
4. **Download**: Export results as JSON or CSV for statistical analysis

### Typical Settings for Flanker Tasks

- **Clinical/Aging**: 60 total trials (30 congruent, 20 incongruent, 10 neutral)
- **Research**: 90-120 trials for robust RT analysis
- **Quick Version**: 30 trials for rapid cognitive screening
- **ITI**: 2000-2500 ms including stimulus display

### Analyzing Flanker Data

The exported CSV includes:

- **Accuracy by condition**: Compare congruent vs incongruent vs neutral
- **Reaction times**: Identify flanker interference (incongruent slower)
- **Stroop effect**: incongruent - congruent difference
- **Individual trials**: Detailed RT and accuracy per trial

## Troubleshooting

### Question: Can I still use N-Back tasks?

**Answer**: Yes. The old N-Back files remain in the repository. You could modify `SettingsContext.tsx` to support both tasks if needed.

### Question: How do I change the arrow symbols?

**Answer**: Edit `createFlankerTrial()` in `experiment-state-class.ts` to use different Unicode symbols or custom graphics.

### Question: Can I add immediate feedback per trial?

**Answer**: Modify `FlankerStimulusPlugin.ts` to add a feedback screen after each trial during practice.

### Question: How do I adjust trial type percentages?

**Answer**: Use FlankerSettingsView in the builder, or directly modify `congruentPercentage`, `incongruentPercentage`, `neutralPercentage` in default settings.

## Contact & Support

This implementation follows the LNCO.ai platform conventions documented in `.github/copilot-instructions.md`. For questions about integration with Graasp, photo-diode triggers, or serial port communication, refer to that document.
