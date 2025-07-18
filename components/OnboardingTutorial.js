import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import { HelpCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';

const OnboardingTutorial = ({ run, setRun, steps = [], onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Set client-side flag and check tutorial status
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const tutorialSeen = localStorage.getItem('onboarding-tutorial-seen');
      setHasSeenTutorial(!!tutorialSeen);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setStepIndex(0);
      
      // Mark tutorial as seen
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding-tutorial-seen', 'true');
      }
      setHasSeenTutorial(true);
      
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleSkip = () => {
    setRun(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding-tutorial-seen', 'true');
    }
    setHasSeenTutorial(true);
  };

  const handleRemindLater = () => {
    setRun(false);
    // Don't mark as seen, so it can show again later
  };

  const customStyles = {
    options: {
      primaryColor: '#002fa7',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
    },
    tooltip: {
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      padding: '20px',
      maxWidth: '400px',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    tooltipTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#002fa7',
    },
    tooltipContent: {
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '16px',
    },
    buttonNext: {
      backgroundColor: '#002fa7',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    buttonBack: {
      color: '#666666',
      marginRight: '8px',
      padding: '8px 16px',
      fontSize: '14px',
    },
    buttonSkip: {
      color: '#666666',
      fontSize: '14px',
    },
  };

  const customLocale = {
    back: t('tutorial.back'),
    close: t('tutorial.close'),
    last: t('tutorial.finish'),
    next: t('tutorial.next'),
    skip: t('tutorial.skip'),
  };

  // Don't render on server side
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        run={run}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        steps={steps}
        stepIndex={stepIndex}
        styles={customStyles}
        locale={customLocale}
        disableOverlayClose={true}
        disableCloseOnEsc={false}
        hideCloseButton={false}
        spotlightClicks={true}
        spotlightPadding={4}
      />
      
      {/* Custom Skip/Remind Later Modal */}
      {run && (
        <div className="fixed top-4 right-4 z-[10001] bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-[#002fa7]" />
            <span className="font-medium text-gray-900">{t('nav.tutorial')} Options</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              {t('tutorial.skip')}
            </button>
            <button
              onClick={handleRemindLater}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              {t('tutorial.remindLater')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingTutorial;