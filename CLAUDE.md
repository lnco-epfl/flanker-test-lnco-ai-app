# Flanker Test App — Claude Reference

This is a standalone Graasp app implementing the **Eriksen Flanker Task**, a cognitive psychology experiment measuring selective attention. It lives in `LNCOai/apps/` outside the main platform monorepo.

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Experiment engine:** jsPsych 8 (`jspsych`, `@jspsych/plugin-*`)
- **UI:** MUI v6 + Emotion
- **Platform integration:** `@graasp/apps-query-client`, `@graasp/sdk` v4.9
- **Styles:** SCSS (`src/modules/experiment/styles/main.scss`)
- **i18n:** i18next, translations in `src/langs/en.json` and `src/langs/fr.json`
- **Package manager:** Yarn 4

## Two Distinct Views

### Player View (participant-facing)
The player view runs the jsPsych experiment. It has no React UI beyond a single `<div id="jspsych-display-element" />` that jsPsych takes over entirely.

- `PlayerView` → `ExperimentLoader` → calls `run()` from `experiment.ts`
- `ExperimentLoader` checks prior results: starts the experiment if none, shows a "already completed" message otherwise
- All visual output during the experiment is controlled by jsPsych and SCSS, not React/MUI
- Relevant code: `src/modules/experiment/`, `src/modules/main/PlayerView.tsx`, `src/modules/main/ExperimentLoader.tsx`

### Builder View (experimenter-facing)
The builder view is pure React/MUI. Admins see two tabs: **Results** and **Settings**. Non-admin users in the builder context see the PlayerView instead.

- `BuilderView` → `AdminView` (for Admin permission) or `PlayerView` (for Read permission)
- `AdminView` has two tabs: `ResultsView` (results table) and `SettingsView` (all settings panels)
- Settings are grouped into panels: General, Flanker, Break, PhotoDiode, NextStep
- Relevant code: `src/modules/main/BuilderView.tsx`, `src/modules/main/AdminView.tsx`, `src/modules/settings/`, `src/modules/answers/`

## Project Structure

```
src/
├── config/            # App-level config (queryClient, appData, appResults, selectors, env)
├── langs/             # i18n translation files (en.json, fr.json)
├── modules/
│   ├── answers/       # [BUILDER] Results display (ResultsView, ResultsRow)
│   ├── common/        # Shared UI (Loader, CustomToasts)
│   ├── config/        # App settings/results type definitions
│   ├── context/       # React contexts (SettingsContext, ExperimentContext)
│   ├── experiment/    # [PLAYER] All jsPsych experiment logic
│   │   ├── jspsych/   # ExperimentState class, i18n bridge
│   │   ├── parts/     # Timeline segments (introduction, practice, task-core)
│   │   ├── styles/    # main.scss — experiment-only styles
│   │   ├── trials/    # Individual trial types
│   │   ├── triggers/  # Serial port / trigger support
│   │   └── utils/     # Types, constants, utils
│   ├── main/          # Top-level view routing (PlayerView, BuilderView, AdminView, ExperimentLoader)
│   └── settings/      # [BUILDER] Settings UI panels
└── utils/             # Shared hooks
```

## Settings

Five setting groups, all persisted via Graasp app settings API:

| Name | Key fields |
|------|-----------|
| `generalSettings` | `fontSize`, `skipInstructions`, `skipPractice` |
| `flankerSettings` | `numberOfTrials`, `numberOfPracticeTrials`, `congruentPercentage`, `incongruentPercentage`, `neutralPercentage`, `displayDuration`, `interTrialInterval`, `responseKey`, `showFixationCross` |
| `breakSettings` | `enableBreaks`, `breakFrequency`, `breakDuration` |
| `photoDiodeSettings` | `usePhotoDiode`, position/size overrides |
| `nextStepSettings` | `linkToNextPage`, `title`, `description`, `link`, `linkText` |

## Experiment Flow

1. Preload assets
2. Introduction (skippable via `skipInstructions`)
3. Practice block (skippable via `skipPractice`)
4. Main task
5. End page with optional link to next experiment

## Development

```bash
yarn dev          # start dev server
yarn build        # production build
yarn lint         # ESLint
yarn type-check   # TypeScript check
```
