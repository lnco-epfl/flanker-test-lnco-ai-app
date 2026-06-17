import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import i18n from '../jspsych/i18n';
import { Timeline } from '../utils/types';

export const buildGetReadyGo = (): Timeline => [
  {
    type: htmlKeyboardResponse,
    choices: 'NO_KEYS',
    stimulus: `<div class="countdown-get-ready">${i18n.t('COUNTDOWN.GET_READY')}</div>`,
    trial_duration: 2000,
  },
  {
    type: htmlKeyboardResponse,
    choices: 'NO_KEYS',
    stimulus: `<div class="countdown-go">${i18n.t('COUNTDOWN.GO')}</div>`,
    trial_duration: 800,
  },
];
