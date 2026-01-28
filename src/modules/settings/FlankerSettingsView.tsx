import { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { FlankerSettingsType } from '../context/SettingsContext';

type Props = {
  flankerSettings: FlankerSettingsType;
  onChange: (newSettings: FlankerSettingsType) => void;
};

const FlankerSettingsView: FC<Props> = ({ flankerSettings, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (
    setting: keyof FlankerSettingsType,
    value: unknown,
  ): void => {
    onChange({
      ...flankerSettings,
      [setting]: value,
    });
  };

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant="h6">{t('SETTINGS.FLANKER_TITLE')}</Typography>

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.NUMBER_OF_TRIALS')}
        value={flankerSettings.numberOfTrials}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('numberOfTrials', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 10, max: 300 }}
      />

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.NUMBER_OF_PRACTICE_TRIALS')}
        value={flankerSettings.numberOfPracticeTrials}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('numberOfPracticeTrials', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 5, max: 50 }}
      />

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.CONGRUENT_PERCENTAGE')}
        helperText={
          t('SETTINGS.CONGRUENT_PERCENTAGE_HELP') ||
          'Percentage of congruent trials'
        }
        value={flankerSettings.congruentPercentage}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('congruentPercentage', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 0, max: 100 }}
      />

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.INCONGRUENT_PERCENTAGE')}
        helperText={
          t('SETTINGS.INCONGRUENT_PERCENTAGE_HELP') ||
          'Percentage of incongruent trials'
        }
        value={flankerSettings.incongruentPercentage}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('incongruentPercentage', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 0, max: 100 }}
      />

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.NEUTRAL_PERCENTAGE')}
        helperText={
          t('SETTINGS.NEUTRAL_PERCENTAGE_HELP') ||
          'Percentage of neutral trials (remaining after congruent + incongruent)'
        }
        value={flankerSettings.neutralPercentage}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('neutralPercentage', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 0, max: 100 }}
      />

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.DISPLAY_DURATION')}
        helperText={t('SETTINGS.DISPLAY_DURATION_HELP')}
        value={flankerSettings.displayDuration}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('displayDuration', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 500, max: 10000, step: 100 }}
      />

      <TextField
        fullWidth
        type="number"
        label={t('SETTINGS.ITI')}
        helperText={
          t('SETTINGS.ITI_HELP') ||
          'Inter-trial interval (including stimulus display time)'
        }
        value={flankerSettings.interTrialInterval}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange('interTrialInterval', parseInt(e.target.value, 10))
        }
        inputProps={{ min: 500, max: 5000, step: 100 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={flankerSettings.showFixationCross}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('showFixationCross', e.target.checked)
            }
          />
        }
        label={
          t('SETTINGS.SHOW_FIXATION_CROSS') ||
          'Show fixation cross during inter-trial interval'
        }
      />

      <FormControl fullWidth>
        <InputLabel>{t('SETTINGS.RESPONSE_KEY')}</InputLabel>
        <Select
          value={flankerSettings.responseKey}
          onChange={(e) => {
            const value = e.target.value as 'arrows' | 'mouse' | 'both';
            handleChange('responseKey', value);
          }}
          label={t('SETTINGS.RESPONSE_KEY')}
        >
          <MenuItem value="arrows">
            {t('SETTINGS.ARROW_KEYS_ONLY') || 'Arrow keys only'}
          </MenuItem>
          <MenuItem value="mouse">{t('SETTINGS.MOUSE_ONLY')}</MenuItem>
          <MenuItem value="both">
            {t('SETTINGS.ARROW_KEYS_OR_MOUSE') || 'Arrow keys or mouse'}
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default FlankerSettingsView;
