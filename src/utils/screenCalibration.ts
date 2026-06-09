export type FontSizeOption = 'small' | 'normal' | 'large' | 'extra-large';

export type ScreenCalibration = {
  fontSize?: FontSizeOption;
  scale?: number;
  participantId?: string;
  participantCode?: string;
};

const VALID_FONT_SIZES: FontSizeOption[] = [
  'small',
  'normal',
  'large',
  'extra-large',
];

const isValidScale = (value: unknown): value is number =>
  typeof value === 'number' && value > 0.5 && value < 3;

const isValidFontSize = (value: unknown): value is FontSizeOption =>
  typeof value === 'string' &&
  VALID_FONT_SIZES.includes(value as FontSizeOption);

const isValidString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

export const parseScreenCalibration = (
  localContext: unknown,
): ScreenCalibration | undefined => {
  const calibration = (localContext as { screenCalibration?: unknown })
    ?.screenCalibration;

  if (!calibration || typeof calibration !== 'object') {
    return undefined;
  }

  const parsed: ScreenCalibration = {};
  const { fontSize, scale, participantId, participantCode } = calibration as {
    fontSize?: unknown;
    scale?: unknown;
    participantId?: unknown;
    participantCode?: unknown;
  };

  if (isValidFontSize(fontSize)) {
    parsed.fontSize = fontSize;
  }

  if (isValidScale(scale)) {
    parsed.scale = scale;
  }

  if (isValidString(participantId)) {
    parsed.participantId = participantId;
  }

  if (isValidString(participantCode)) {
    parsed.participantCode = participantCode;
  }

  return parsed.fontSize ||
    parsed.scale ||
    parsed.participantId ||
    parsed.participantCode
    ? parsed
    : undefined;
};
