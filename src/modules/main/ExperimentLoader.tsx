import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { useLocalContext } from '@lnco-ai/apps-query-client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Marked } from '@ts-stack/markdown';
import { DataCollection, JsPsych } from 'jspsych';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  AudioNarration,
  AudioNarrationControls,
} from 'jspsych-audio-narration';

import { hooks } from '@/config/queryClient';
import { parseScreenCalibration } from '@/utils/screenCalibration';

import { TrialData } from '../config/appResults';
import useExperimentResults from '../context/ExperimentContext';
import { AllSettingsType, useSettings } from '../context/SettingsContext';
import { run } from '../experiment/experiment';
import { resolveLink } from '../experiment/utils/utils';

export const ExperimentLoader: FC = () => {
  const { t } = useTranslation();
  const narration = useRef(new AudioNarration()).current;
  const settings = useSettings();
  const narrationEnabled = settings.generalSettings.enableNarration;

  useEffect(() => {
    if (!narrationEnabled) {
      // eslint-disable-next-line no-param-reassign
      narration.play = () => {};
    }
  }, [narrationEnabled, narration]);
  const localContext = useLocalContext();
  const { data: appContextData } = hooks.useAppContext();
  const screenCalibration = parseScreenCalibration(localContext);
  const localActorId =
    (localContext as { accountId?: string }).accountId ??
    (localContext as { memberId?: string }).memberId;
  let participantName = '';

  const contextActors = [
    ...((appContextData as { accounts?: { id: string; name?: string }[] })
      ?.accounts ?? []),
    ...((appContextData as { members?: { id: string; name?: string }[] })
      ?.members ?? []),
  ];

  if (localActorId) {
    participantName =
      contextActors.find((actor) => actor.id === localActorId)?.name ?? '';
  }
  const jsPsychRef = useRef<null | Promise<JsPsych>>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setCanScrollUp(scrollTop > 8);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 8);
  }, []);

  const resetAndUpdateScroll = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    updateScrollState();
  }, [updateScrollState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(updateScrollState);
    const mo = new MutationObserver(resetAndUpdateScroll);
    el.addEventListener('scroll', updateScrollState, { passive: true });
    ro.observe(el);
    mo.observe(el, { childList: true, subtree: true });
    updateScrollState();
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
      mo.disconnect();
    };
  }, [updateScrollState, resetAndUpdateScroll]);

  const scrollPage = (direction: 'up' | 'down'): void => {
    scrollRef.current?.scrollBy({
      top:
        direction === 'down'
          ? window.innerHeight * 0.6
          : -window.innerHeight * 0.6,
      behavior: 'smooth',
    });
  };

  const { status, experimentResultsAppData, setExperimentResult } =
    useExperimentResults();

  const isCompleted = (
    trials: TrialData[],
    currentSettings: AllSettingsType,
  ): boolean =>
    trials.length > 0 &&
    trials.filter((trial) => trial.practice === false).length >=
      currentSettings.flankerSettings.numberOfTrials;
  const updateData = (
    rawData: DataCollection,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    settings: AllSettingsType,
  ): void => {
    const responseArray = rawData.values();
    setExperimentResult({
      rawData: { trials: responseArray },
      settings,
    });
  };

  const assetPath = {
    images: [
      'assets/images/flanker_congruent.png',
      'assets/images/flanker_incongruent.png',
      'assets/images/flanker_neutral.png',
      t('FLANKER.ARROW_KEYS_IMAGE'),
      'assets/images/hand.png',
      'assets/images/arrow-keys-en.png',
      'assets/images/arrow-keys-fr.png',
    ],
    audio: [
      'assets/audio/flanker_practice_result.mp3',
      'assets/audio/flanker_practice_repeat.mp3',
      'assets/audio/flanker_practice_comprehension.mp3',
      'assets/audio/flanker_main_ready.mp3',
      'assets/audio/flanker_main_end.mp3',
      'assets/audio/flanker_instructions_page1.mp3',
      'assets/audio/flanker_instructions_page2.mp3',
      'assets/audio/flanker_instructions_page3.mp3',
    ],
    video: [],
    misc: [],
  };

  const [completedContent, setCompletedContent] = useState<JSX.Element | null>(
    null,
  );

  useEffect(() => {
    if (status === 'success' && !experimentResultsAppData) {
      setExperimentResult({
        rawData: { trials: [] },
        settings,
      });
    }
    if (!jsPsychRef.current && experimentResultsAppData?.rawData) {
      if (experimentResultsAppData.rawData?.trials.length === 0) {
        jsPsychRef.current = run({
          assetPaths: assetPath,
          input: {
            settings,
            results: experimentResultsAppData,
            participantName,
            screenCalibration,
          },
          narration,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          updateData: (data, settings) => updateData(data, settings),
        });
      } else if (
        isCompleted(experimentResultsAppData.rawData.trials, settings)
      ) {
        if (settings.nextStepSettings.linkToNextPage) {
          const { title, description, linkText } = settings.nextStepSettings;
          const resolvedLink = resolveLink(
            settings.nextStepSettings.link,
            participantName,
          );
          setCompletedContent(
            <div className="sd-html">
              <h3>{title}</h3>
              {/* eslint-disable react/no-danger */}
              <p
                dangerouslySetInnerHTML={{ __html: Marked.parse(description) }}
              />
              {/* eslint-enable react/no-danger */}
              <a
                className="link-to-experiment"
                target="_parent"
                href={resolvedLink}
              >
                {linkText}
              </a>
            </div>,
          );
        } else {
          setCompletedContent(
            <Typography variant="h5" style={{ backgroundColor: 'white' }}>
              You have previously completed this experiment, please reach out to
              the experimenter if this is not correct.
            </Typography>,
          );
        }
      } else {
        // Allow restart for N-back
        jsPsychRef.current = run({
          assetPaths: assetPath,
          input: {
            settings,
            results: experimentResultsAppData,
            participantName,
            screenCalibration,
          },
          narration,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          updateData: (data, settings) => updateData(data, settings),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentResultsAppData, setExperimentResult, settings, status]);

  if (completedContent) {
    return completedContent;
  }
  return (
    <>
      <div className="player-scroll-container" ref={scrollRef}>
        <div id="jspsych-display-element" />
      </div>
      {narrationEnabled && (
        <AudioNarrationControls narration={narration} position="bottom-left" />
      )}
      {canScrollDown && (
        <button
          type="button"
          className="scroll-hint scroll-hint--down"
          onClick={() => scrollPage('down')}
          aria-label={t('SCROLL_DOWN')}
        >
          {t('SCROLL_DOWN')}
        </button>
      )}
      {canScrollUp && (
        <button
          type="button"
          className="scroll-hint scroll-hint--up"
          onClick={() => scrollPage('up')}
          aria-label={t('SCROLL_UP')}
        >
          {t('SCROLL_UP')}
        </button>
      )}
    </>
  );
};
