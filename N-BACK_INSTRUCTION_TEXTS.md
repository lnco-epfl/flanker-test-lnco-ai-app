# N-Back Working Memory Task - Instruction Texts

**Document for Neuropsychologist Review**

This document contains all instruction texts presented to participants during the N-back working memory task in English (EN) and French (FR).

---

## PART 1: WELCOME & TASK OVERVIEW

### Welcome Screen (Fullscreen entry)

**Context:** First screen when experiment begins.

**EN:**
N-Back Working Memory Task
Thank you for participating in this study. You will be performing an n-back working memory task.
In this task, you will see numbers displayed one at a time. Your job is to decide if the current number matches the number that appeared [N] position(s) back in the sequence.

**FR:**
Tâche de mémoire de travail N-Back
Merci de participer à cette étude. Vous effectuerez une tâche de mémoire de travail n-back.
Dans cette tâche, vous verrez des nombres affichés un par un. Votre travail est de décider si le nombre actuel correspond au nombre qui a apparu [N] position(s) en arrière dans la séquence.

_Note: [N] is dynamically set (1, 2, 3, or 4) based on configuration._

---

## PART 2: TASK INSTRUCTIONS (4 screens)

### Screen 1: Instructions Overview

**EN:**
Task Instructions
In this task, you will see a sequence of single-digit numbers (0-9) appearing one at a time on the screen. Each number will be displayed for a short time, followed by a brief pause before the next number appears.
The task is to monitor the sequence and respond when you notice a pattern.

**FR:**
Instructions de tâche
Dans cette tâche, vous verrez une séquence de nombres à un seul chiffre (0-9) apparaître un à la fois à l'écran. Chaque nombre s'affichera pendant un court moment, suivi d'une brève pause avant que le nombre suivant apparaisse.
La tâche consiste à surveiller la séquence et à répondre lorsque vous remarquez un motif.

---

### Screen 2: Task Rules & Examples

**EN:**
Task Rules
When you see a number that matches the number from [N] position(s) back, press the spacebar (or click the mouse) as quickly as possible.

Examples (varies by N-level):

- **1-back:** Sequence 3-3 → respond at second 3. Sequence 4-3-4 → do NOT respond (not immediately adjacent).
- **2-back:** Sequence 3-7-3 → respond at second 3. Sequence 4-4 → do NOT respond (immediately adjacent, not 2-back).
- **3-back:** Sequence 5-2-8-5 → respond at second 5. Sequence 8-3-8 → do NOT respond (only 1-back match).
- **4-back:** Sequence 1-4-7-2-1 → respond at second 1 (matches 4 positions back).

**FR:**
Règles de tâche
Lorsque vous voyez un nombre qui correspond au nombre d'il y a [N] position(s), appuyez sur la barre d'espace (ou cliquez avec la souris) aussi rapidement que possible.

Exemples: [same structure as EN, translated]

---

### Screen 3: Response Instructions

**EN:**
How to Respond
When you see a number that matches the target number from n positions back, respond immediately by pressing the spacebar or clicking the mouse.
When you see a number that does NOT match, do nothing. Simply wait for the next number to appear.
Try to be both fast and accurate. Both speed and accuracy are important for this task.

**FR:**
Comment répondre
Lorsque vous voyez un nombre qui correspond au nombre cible d'il y a n positions, répondez immédiatement en appuyant sur la barre d'espace ou en cliquant avec la souris.
Lorsque vous voyez un nombre qui ne correspond PAS, ne faites rien. Attendez simplement que le nombre suivant apparaisse.
Essayez d'être à la fois rapide et précis. La vitesse et la précision sont toutes deux importantes pour cette tâche.

---

### Screen 4: Practice Introduction

**EN:**
Practice Session
Before the main task, you will complete a short practice session. This will help you get familiar with the task.
Are you ready to begin?

**FR:**
Séance de pratique
Avant la tâche principale, vous effectuerez une courte séance de pratique. Cela vous aidera à vous familiariser avec la tâche.
Êtes-vous prêt à commencer?

---

## PART 3: PRACTICE SESSION

### Practice Trials

**Context:** Participants complete practice sequence with feedback.

- Stimulus display: [DISPLAY_DURATION] ms (default 500ms)
- Inter-stimulus interval: [ISI] ms (default 2000ms)
- Number sequence: Random or custom (0-9 digits)
- Response: Spacebar and/or mouse click (configurable)

### Practice Feedback Screen

**EN:**
Practice Complete
Thank you for completing the practice session. Here are your results:

- Correct hits: [X]
- False positives: [X]
- Correct responses: [X]
- Accuracy: [X%]
  Press spacebar to continue to the main task

**FR:**
Pratique terminée
Merci d'avoir terminé la séance de pratique. Voici vos résultats:

- Coups corrects: [X]
- Faux positifs: [X]
- Réponses correctes: [X]
- Précision: [X%]
  Appuyez sur la barre d'espace pour continuer vers la tâche principale

---

## PART 4: MAIN TASK

### Main Task Ready Screen

**EN:**
Main Task Ready
You have completed the practice session. You will now begin the main task. Remember to respond when you see a matching number!
Press spacebar to begin the main task

**FR:**
Tâche principale prête
Vous avez terminé la séance de pratique. Vous allez maintenant commencer la tâche principale. N'oubliez pas de répondre lorsque vous voyez un nombre correspondant!
Appuyez sur la barre d'espace pour commencer la tâche principale

---

### Main Task Trials

**Configuration:**

- Number of trials: [CONFIGURED_COUNT] (default 50)
- Display duration: [DISPLAY_DURATION] ms
- Inter-stimulus interval: [ISI] ms
- Response method: Spacebar and/or mouse (configurable)

---

### Task Complete Screen

**EN:**
Task Complete
Congratulations! You have completed the n-back task.
Press spacebar to continue

**FR:**
Tâche terminée
Félicitations! Vous avez terminé la tâche n-back.
Appuyez sur la barre d'espace pour continuer

---

## PART 5: BREAK SCREENS (Optional)

**Context:** Shown at configured break intervals.

**EN:**
Take a Break
You have completed a portion of the task. Feel free to take a short break.
Remaining trials: [X]
Resuming in: [COUNTDOWN] seconds
Or press spacebar to continue immediately

**FR:**
Prenez une pause
Vous avez terminé une partie de la tâche. N'hésitez pas à prendre une courte pause.
Essais restants: [X]
Reprise dans: [COUNTDOWN] secondes
Ou appuyez sur la barre d'espace pour continuer immédiatement

---

## CONFIGURATION PARAMETERS

The following settings are configurable in the Builder interface:

**N-Back Settings:**

- N-Level: 1, 2, 3, or 4
- Number of Practice Trials: (default 15)
- Number of Main Task Trials: (default 50)
- Display Duration: 100-2000 ms (default 500ms)
- Inter-Stimulus Interval: 500-5000 ms (default 2000ms)
- Response Method: Spacebar only | Mouse only | Spacebar or mouse
- Custom Practice Sequence: Optional (comma-separated digits: 3,5,2,5,7,...)
- Custom Main Task Sequence: Optional (comma-separated digits)

**Break Settings:**

- Enable Breaks: Yes/No
- Break Frequency: Every N trials (5-100)
- Break Duration: Minimum seconds (10-300)

**General Settings:**

- Skip Instructions: Yes/No
- Skip Practice: Yes/No

---

## TRIAL DATA RECORDED

Each trial records:

```
{
  stimulus: 5,                  // Displayed digit (0-9)
  response: true,               // Did participant respond?
  correct_response: true,       // Should they have responded?
  correct: true,                // response === correct_response
  rt: 450,                      // Response time (milliseconds)
  trial_index: 23,              // Position in sequence
  practice: false               // Is this practice or main task?
}
```

---

## LANGUAGE SUPPORT

All text is available in English (EN) and French (FR). Language is set by participant selection during app initialization.

---

## KEY VARIATIONS BY N-LEVEL

The task description and examples are dynamically adjusted:

- **1-back:** "number that appeared 1 position back"
- **2-back:** "number that appeared 2 positions back"
- **3-back:** "number that appeared 3 positions back"
- **4-back:** "number that appeared 4 positions back"

Examples provided are N-level specific to clarify correct vs incorrect responses.
