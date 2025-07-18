import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import OnboardingTutorial from './OnboardingTutorial';
import { getStepsForPage } from '../lib/tutorialSteps';
import { ScrollText } from 'lucide-react';

const TutorialContext = createContext();

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }) => {
  const [runTutorial, setRunTutorial] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const startTutorial = () => {
    setRunTutorial(true);
  };

  const stopTutorial = () => {
    setRunTutorial(false);
  };

  const handleTutorialComplete = () => {
    console.log('Tutorial completed for page:', router.pathname);
    setRunTutorial(false);
  };

  // Listen for custom events to start tutorial
  useEffect(() => {
    const handleStartTutorial = () => {
      startTutorial();
    };

    window.addEventListener('startTutorial', handleStartTutorial);
    return () => {
      window.removeEventListener('startTutorial', handleStartTutorial);
    };
  }, []);

  // Get steps for current page with translations
  const currentSteps = getStepsForPage(router.pathname, t);

  const value = {
    runTutorial,
    startTutorial,
    stopTutorial,
    currentSteps,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
      
      {/* Global Tutorial Component */}
      {currentSteps.length > 0 && (
        <OnboardingTutorial
          run={runTutorial}
          setRun={setRunTutorial}
          steps={currentSteps}
          onComplete={handleTutorialComplete}
        />
      )}
    </TutorialContext.Provider>
  );
};