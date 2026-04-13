# Eriksen Flanker Task - Instruction Texts

**Document for Neuropsychologist Review**

This document contains all instruction texts presented to participants during the Eriksen Flanker task in English (EN) and French (FR).

---

## PART 1: WELCOME & TASK OVERVIEW

### Welcome Screen (Fullscreen entry)

**Context:** First screen when experiment begins. Initiates fullscreen mode.

**EN:**
Eriksen Flanker Task
Thank you for participating in this study. You will be performing an Eriksen Flanker task.

**FR:**
Tâche Eriksen Flanker
Merci de participer à cette étude. Vous effectuerez une tâche Eriksen Flanker.

**Button:** "Start Fullscreen" / "Démarrer le plein écran"

---

## PART 2: TASK INSTRUCTIONS (3 screens)

### Screen 1: Instructions Overview

**Context:** First instruction screen explaining the basic task structure.

**EN:**
Task Instructions
In this task, you will see a row of five symbols on the screen. The middle symbol is always an arrow pointing either left or right. Your job is to identify the direction of the middle arrow and respond accordingly, ignoring the surrounding symbols.

Remember to focus on the center arrow. The surrounding symbols may or may not point in the same direction, but you should only respond based on the center arrow.

**FR:**
Instructions de la Tâche
Dans cette tâche, vous verrez une rangée de cinq symboles à l'écran. Le symbole du milieu est toujours une flèche pointant vers la gauche ou la droite. Votre tâche est d'identifier la direction de la flèche du centre et de répondre en conséquence, en ignorant les symboles environnants.

N'oubliez pas de vous concentrer sur la flèche du centre. Les symboles environnants peuvent ou non pointer dans la même direction, mais vous ne devez répondre que sur la base de la flèche du centre.

**Button:** "Continue" / "Continuer"

---

### Screen 2: Response Instructions

**Context:** Explains how to respond and emphasizes speed/accuracy balance.

**EN:**
How to Respond
If the CENTER arrow points LEFT, press the LEFT arrow key (or click on the left side of the screen).
If the CENTER arrow points RIGHT, press the RIGHT arrow key (or click on the right side of the screen).

Important: You must ignore the direction of the surrounding symbols and only respond to the center arrow.

Try to be both fast and accurate. Both speed and accuracy are important for this task.

**FR:**
Comment Répondre
Si la flèche du CENTRE pointe vers la GAUCHE, appuyez sur la touche flèche GAUCHE (ou cliquez sur le côté gauche de l'écran).
Si la flèche du CENTRE pointe vers la DROITE, appuyez sur la touche flèche DROITE (ou cliquez sur le côté droit de l'écran).

Important: Vous devez ignorer la direction des symboles environnants et ne répondre que sur la flèche du centre.

Essayez d'être à la fois rapide et précis. La rapidité et la précision sont toutes deux importantes pour cette tâche.

**Button:** "Continue" / "Continuer"

---

### Screen 3: Practice Introduction

**Context:** Final instruction screen before practice begins.

**EN:**
Practice Session
Before the main task, you will complete a short practice session. This will help you get familiar with the task and understand how to distinguish the center arrow from the surrounding symbols.

Are you ready to begin?

**FR:**
Séance de Pratique
Avant la tâche principale, vous complèterez une courte séance de pratique. Cela vous aidera à vous familiariser avec la tâche et à comprendre comment distinguer la flèche du centre des symboles environnants.

Êtes-vous prêt à commencer?

**Button:** "Start Practice" / "Commencer la Pratique"

---

## PART 3: PRACTICE SESSION

### Trial Types

Participants will see three types of trials during practice:

#### 1. Congruent Trials
**Visual:** ← ← ← ← ← (all arrows point same direction)
**Description (EN):** All five arrows point in the same direction.
**Description (FR):** Les cinq flèches pointent dans la même direction.

#### 2. Incongruent Trials
**Visual:** → → ← → → (flankers opposite to center)
**Description (EN):** The center arrow points in one direction, but the surrounding arrows point in the opposite direction.
**Description (FR):** La flèche du centre pointe dans une direction, mais les flèches environnantes pointent dans la direction opposée.

#### 3. Neutral Trials
**Visual:** — — ← — — (flankers are dashes)
**Description (EN):** The surrounding symbols are dashes (—), only the center arrow conveys direction.
**Description (FR):** Les symboles environnants sont des tirets (—), seule la flèche du centre transmet la direction.

---

### Practice Trial Sequence

**Configuration:**
- Number of practice trials: [CONFIGURED_COUNT] (default 10)
- Display duration: [DISPLAY_DURATION] ms (default 2000ms)
- Inter-trial interval: [ITI] ms (default 2000ms)
- Fixation cross: [SHOW_FIXATION] (default: shown for 300ms before each trial)
- Response method: Arrow keys and/or mouse click (configurable)

**Trial Flow:**
1. Fixation cross (+) appears for 300ms (if enabled)
2. Flanker stimulus appears (5 symbols)
3. Participant responds or stimulus disappears after display duration
4. Blank screen or fixation for inter-trial interval
5. Next trial begins

---

### Practice Feedback Screen

**Context:** Shown after completing all practice trials. Displays overall and condition-specific accuracy.

**EN:**
Practice Complete
Thank you for completing the practice session. Here are your results:

**Correct responses:** [X]/[TOTAL]
**Accuracy:** [X%]

---

**Accuracy by condition:**
**Congruent** [X]/[TOTAL] ([X%])
**Incongruent** [X]/[TOTAL] ([X%])
**Neutral** [X]/[TOTAL] ([X%])

Press spacebar to continue to the main task

**FR:**
Pratique Terminée
Merci d'avoir complété la séance de pratique. Voici vos résultats:

**Réponses correctes:** [X]/[TOTAL]
**Précision:** [X%]

---

**Précision par condition:**
**Congruent** [X]/[TOTAL] ([X%])
**Incongruent** [X]/[TOTAL] ([X%])
**Neutre** [X]/[TOTAL] ([X%])

Appuyez sur la barre d'espace pour continuer vers la tâche principale

**Note:** Participants can press 'r' to repeat practice or spacebar to continue. Only condition types that appeared in practice are shown.

---

## PART 4: MAIN TASK

### Main Task Ready Screen

**Context:** Transition screen between practice and main task.

**EN:**
Main Task Ready
You have completed the practice session. You will now begin the main task. Remember to focus on the center arrow and ignore the surrounding symbols!

Press spacebar to begin the main task

**FR:**
Tâche Principale Prête
Vous avez complété la séance de pratique. Vous commencerez maintenant la tâche principale. N'oubliez pas de vous concentrer sur la flèche du centre et d'ignorer les symboles environnants!

Appuyez sur la barre d'espace pour commencer la tâche principale

---

### Main Task Trials

**Configuration:**
- Number of trials: [CONFIGURED_COUNT] (default 60)
- Congruent percentage: [CONGRUENT_%] (default 33%)
- Incongruent percentage: [INCONGRUENT_%] (default 33%)
- Neutral percentage: [NEUTRAL_%] (default 34%, calculated as remainder)
- Display duration: [DISPLAY_DURATION] ms (default 2000ms)
- Inter-trial interval: [ITI] ms (default 2000ms)
- Fixation cross: [SHOW_FIXATION] (default: shown)
- Response method: Arrow keys and/or mouse (configurable)

**Trial Flow:**
Same as practice trials. All trials are randomly ordered with balanced distribution of trial types based on configured percentages.

---

### Task Complete Screen

**Context:** Shown after completing all main task trials.

**EN:**
Task Complete
Congratulations! You have completed the Flanker task.

Press spacebar to continue

**FR:**
Tâche Complète
Félicitations! Vous avez complété la tâche Flanker.

Appuyez sur la barre d'espace pour continuer

---

## PART 5: BREAK SCREENS (Optional)

**Context:** Shown at configured break intervals during main task if breaks are enabled.

**EN:**
Take a Break
You have completed a portion of the task. Feel free to take a short break.

Resuming in: [COUNTDOWN] seconds
Or press spacebar to continue immediately

**FR:**
Prenez une Pause
Vous avez complété une partie de la tâche. N'hésitez pas à prendre une courte pause.

Reprise dans: [COUNTDOWN] secondes
Ou appuyez sur la barre d'espace pour continuer immédiatement

**Note:** Break countdown automatically continues after configured duration, or participant can press spacebar to skip.

---

## CONFIGURATION PARAMETERS

The following settings are configurable in the Builder interface:

### Flanker Task Settings

**Trial Composition:**
- Number of Main Task Trials: 1-200 (default: 60)
- Number of Practice Trials: 1-50 (default: 10)
- Congruent Trials (%): 0-100 (default: 33)
- Incongruent Trials (%): 0-100 (default: 33)
- Neutral Trials (%): Auto-calculated remainder (default: 34)

**Timing:**
- Display Duration: 100-10000 ms (default: 2000ms)
  - How long the stimulus remains visible
- Inter-Trial Interval (ITI): 500-5000 ms (default: 2000ms)
  - Blank time between stimulus offset and next trial
- Fixation Cross: Show/Hide (default: shown for 300ms before each trial)

**Response Method:**
- Arrow keys only (default)
- Mouse click only (left/right side of screen)
- Arrow keys or mouse click

### Break Settings

- Enable Breaks: Yes/No (default: No)
- Break Frequency: Every N trials, 5-100 (default: 30)
- Break Duration: Minimum seconds, 10-300 (default: 30)

### General Settings

- Font Size: Small | Normal | Large | Extra-Large (default: Normal)
- Skip Instructions: Yes/No (default: No)
  - If enabled, shows only welcome screen before practice
- Skip Practice: Yes/No (default: No)
  - If enabled, goes directly to main task

### Photo-Diode Settings

- Position: Top-left | Top-right | Customize | Off (default: Off)
- Custom positioning available (left, top, height, width in pixels)
- Test mode available to verify photo-diode placement
- Photo-diode toggles white/black with each stimulus presentation for hardware synchronization

---

## TRIAL DATA RECORDED

Each trial records the following data:

```json
{
  "stimulus": "← ← → ← ←",           // HTML stimulus displayed (5 symbols)
  "condition": "incongruent",         // Trial type: congruent | incongruent | neutral
  "response": "right",                // Participant's response: left | right | null
  "correct_response": "right",        // Correct answer based on center arrow
  "correct": true,                    // Whether response matches correct_response
  "rt": 543,                          // Response time in milliseconds (null if no response)
  "trial_index": 15,                  // Position in sequence
  "practice": false                   // Is this practice or main task?
}
```

---

## LANGUAGE SUPPORT

All text is available in English (EN) and French (FR). Language is set by participant selection during app initialization via the Graasp platform.

---

## RESPONSE TIMING DETAILS

**Response Window:**
- Responses accepted during stimulus presentation and for 100ms after stimulus offset
- If participant responds during display, stimulus immediately disappears
- If no response during display duration, stimulus disappears automatically
- Trial ends after inter-trial interval (+ 100ms late response buffer)

**Mouse Response (if enabled):**
- Click on left half of screen = left response
- Click on right half of screen = right response
- Vertical position does not matter

---

## STIMULUS PRESENTATION

**Visual Format:**
- Five symbols displayed horizontally in a row
- Symbols are SVG arrows (← or →) or dash symbols (—)
- Center symbol is always an arrow indicating the correct response
- Flanker symbols (positions 1, 2, 4, 5) vary by condition

**Font Sizes:**
- Small: Smaller text/symbol size
- Normal: Standard size (default)
- Large: Increased size for visibility
- Extra-Large: Maximum size for accessibility

---

## PRACTICE ACCURACY TRACKING

During practice, the system tracks:
- Total correct responses
- Overall accuracy percentage
- Accuracy by condition (congruent, incongruent, neutral)
- Response times for each trial

This data is displayed in the practice feedback screen and can inform whether participants need to repeat practice.

---

## EXPERIMENTAL DESIGN NOTES

**Typical Flanker Effect:**
- Congruent trials: Faster responses, higher accuracy
- Incongruent trials: Slower responses, lower accuracy (interference effect)
- Neutral trials: Intermediate performance

**Recommended Settings for Standard Flanker:**
- 60+ main task trials for reliable data
- Equal distribution of trial types (33/33/34%)
- Display duration: 1500-2000ms
- ITI: 1000-2000ms
- Response method: Arrow keys (more precise than mouse)

**Photo-Diode Usage:**
- Essential for EEG/MEG studies requiring precise stimulus timing
- Toggles white/black with each stimulus presentation
- Position in corner of screen to avoid participant's visual field
