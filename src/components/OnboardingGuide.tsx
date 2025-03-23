
import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  title: string;
  description: string;
  placement: 'left' | 'right' | 'top' | 'bottom';
  highlightSelector?: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to Course Explorer',
    description: 'Browse through thousands of courses and find exactly what you need.',
    placement: 'bottom',
  },
  {
    title: 'Search courses',
    description: 'Type keywords to quickly find specific courses.',
    placement: 'bottom',
    highlightSelector: '.search-input',
  },
  {
    title: 'Filter options',
    description: 'Narrow down courses by faculty, type, language, and semester.',
    placement: 'bottom',
    highlightSelector: '.filter-panel',
  },
  {
    title: 'Course tree',
    description: 'Browse through the hierarchical view of courses organized by semester and type.',
    placement: 'right',
    highlightSelector: '.course-tree',
  },
  {
    title: 'Calendar view',
    description: 'Switch to calendar view to see course schedules visually.',
    placement: 'bottom',
    highlightSelector: '.calendar-button',
  },
];

const OnboardingGuide: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if the user has seen the onboarding
    const onboardingSeen = localStorage.getItem('onboardingSeen');
    if (!onboardingSeen) {
      setTimeout(() => setShowGuide(true), 1000);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  
  const handleClose = () => {
    setShowGuide(false);
    localStorage.setItem('onboardingSeen', 'true');
    setHasSeenOnboarding(true);
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentTip = steps[currentStep];
  
  return (
    <>
      {showGuide && currentTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg max-w-md p-6 relative">
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <h3 className="font-medium text-lg mb-2">{currentTip.title}</h3>
            <p className="text-muted-foreground mb-4">{currentTip.description}</p>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNextStep}>
                {currentStep < steps.length - 1 ? 'Next' : 'Done'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {hasSeenOnboarding && (
        <div className="fixed bottom-4 right-4 z-40">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h3 className="font-medium">Need help?</h3>
                <p className="text-sm text-muted-foreground">
                  Click below to restart the guided tour and learn how to use the course explorer.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setCurrentStep(0);
                    setShowGuide(true);
                  }}
                >
                  Start guided tour
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};

export default OnboardingGuide;
