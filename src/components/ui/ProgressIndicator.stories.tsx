import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator, QuestionnaireProgress, MultiStepProgress } from './ProgressIndicator';
import { useState } from 'react';

const meta: Meta<typeof ProgressIndicator> = {
  title: 'UI/ProgressIndicator',
  component: ProgressIndicator,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dots', 'line', 'steps', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dots: Story = {
  args: {
    current: 3,
    total: 8,
    variant: 'dots',
  },
};

export const Line: Story = {
  args: {
    current: 5,
    total: 10,
    variant: 'line',
  },
};

export const Steps: Story = {
  args: {
    current: 2,
    total: 4,
    variant: 'steps',
    showNumbers: true,
  },
};

export const Minimal: Story = {
  args: {
    current: 7,
    total: 12,
    variant: 'minimal',
  },
};

export const StepsWithLabels: Story = {
  args: {
    current: 3,
    total: 5,
    variant: 'steps',
    showLabels: true,
    labels: ['Profile', 'Skills', 'Experience', 'Preferences', 'Review'],
  },
};

export const ClickableSteps: Story = {
  render: () => {
    const [current, setCurrent] = useState(3);
    
    return (
      <ProgressIndicator
        current={current}
        total={6}
        variant="steps"
        showLabels={true}
        labels={['Start', 'Info', 'Skills', 'Goals', 'Review', 'Done']}
        clickable={true}
        onStepClick={(step) => setCurrent(step)}
      />
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">Small</h4>
        <ProgressIndicator current={3} total={6} variant="dots" size="sm" />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Medium</h4>
        <ProgressIndicator current={3} total={6} variant="dots" size="md" />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Large</h4>
        <ProgressIndicator current={3} total={6} variant="dots" size="lg" />
      </div>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium">Default</h4>
        <ProgressIndicator current={4} total={6} variant="line" color="default" />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Primary</h4>
        <ProgressIndicator current={4} total={6} variant="line" color="primary" />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Success</h4>
        <ProgressIndicator current={4} total={6} variant="line" color="success" />
      </div>
    </div>
  ),
};

// QuestionnaireProgress Stories
export const QuestionnaireProgressStory: Story = {
  render: () => (
    <QuestionnaireProgress
      currentQuestion={5}
      totalQuestions={12}
      completedQuestions={4}
      skippedQuestions={1}
      showPercentage={true}
    />
  ),
};

export const CompactProgress: Story = {
  render: () => (
    <QuestionnaireProgress
      currentQuestion={3}
      totalQuestions={8}
      variant="compact"
      showPercentage={true}
    />
  ),
};

export const DetailedProgress: Story = {
  render: () => (
    <QuestionnaireProgress
      currentQuestion={8}
      totalQuestions={15}
      completedQuestions={6}
      skippedQuestions={2}
      showDetails={true}
      variant="detailed"
    />
  ),
};

export const InteractiveProgress: Story = {
  render: () => {
    const [currentQuestion, setCurrentQuestion] = useState(3);
    const [completed, setCompleted] = useState(2);
    const [skipped, setSkipped] = useState(0);
    const totalQuestions = 10;

    const handleNext = () => {
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setCompleted(prev => prev + 1);
      }
    };

    const handleSkip = () => {
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setSkipped(prev => prev + 1);
      }
    };

    const handlePrevious = () => {
      if (currentQuestion > 1) {
        setCurrentQuestion(prev => prev - 1);
        if (completed > 0) setCompleted(prev => prev - 1);
      }
    };

    return (
      <div className="space-y-4">
        <QuestionnaireProgress
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          completedQuestions={completed}
          skippedQuestions={skipped}
          showDetails={true}
        />
        
        <div className="flex gap-2 justify-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestion === totalQuestions}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Answer
          </button>
          <button
            onClick={handleSkip}
            disabled={currentQuestion === totalQuestions}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Skip
          </button>
        </div>
      </div>
    );
  },
};

// MultiStepProgress Stories
export const MultiStepProgressStory: Story = {
  render: () => (
    <MultiStepProgress
      steps={[
        { id: 'personal', label: 'Personal Info', completed: true },
        { id: 'technical', label: 'Technical Skills', current: true },
        { id: 'experience', label: 'Experience', completed: false },
        { id: 'preferences', label: 'Preferences', completed: false },
        { id: 'review', label: 'Review', completed: false },
      ]}
    />
  ),
};

export const VerticalSteps: Story = {
  render: () => (
    <MultiStepProgress
      variant="vertical"
      steps={[
        { 
          id: 'setup', 
          label: 'Account Setup', 
          description: 'Create your developer profile',
          completed: true 
        },
        { 
          id: 'skills', 
          label: 'Technical Skills', 
          description: 'Tell us about your expertise',
          current: true 
        },
        { 
          id: 'projects', 
          label: 'Projects', 
          description: 'Share your work experience',
          completed: false 
        },
        { 
          id: 'goals', 
          label: 'Career Goals', 
          description: 'What are you looking for?',
          completed: false 
        },
      ]}
    />
  ),
};

export const StepsWithErrors: Story = {
  render: () => (
    <MultiStepProgress
      variant="vertical"
      steps={[
        { 
          id: 'info', 
          label: 'Basic Information', 
          description: 'Name, email, and contact details',
          completed: true 
        },
        { 
          id: 'validation', 
          label: 'Account Validation', 
          description: 'Please check your email for verification',
          error: true 
        },
        { 
          id: 'profile', 
          label: 'Complete Profile', 
          description: 'Add your skills and preferences',
          completed: false 
        },
      ]}
    />
  ),
};

export const ClickableMultiStep: Story = {
  render: () => {
    const [steps, setSteps] = useState([
      { id: 'basic', label: 'Basic Info', completed: true },
      { id: 'skills', label: 'Skills', current: true },
      { id: 'experience', label: 'Experience', completed: false },
      { id: 'review', label: 'Review', completed: false },
    ]);

    const handleStepClick = (stepId: string) => {
      setSteps(prevSteps => 
        prevSteps.map(step => ({
          ...step,
          current: step.id === stepId,
        }))
      );
    };

    return (
      <MultiStepProgress
        steps={steps}
        onStepClick={handleStepClick}
      />
    );
  },
};

export const SurveyProgress: Story = {
  render: () => {
    const [currentSection, setCurrentSection] = useState(2);
    
    const sections = [
      { 
        id: 'intro', 
        label: 'Introduction', 
        description: 'Welcome and basic information',
        completed: currentSection > 1,
        current: currentSection === 1,
      },
      { 
        id: 'technical', 
        label: 'Technical Background', 
        description: 'Your development experience and skills',
        completed: currentSection > 2,
        current: currentSection === 2,
      },
      { 
        id: 'preferences', 
        label: 'Work Preferences', 
        description: 'Remote work, team size, company type',
        completed: currentSection > 3,
        current: currentSection === 3,
      },
      { 
        id: 'feedback', 
        label: 'Feedback', 
        description: 'Share your thoughts and suggestions',
        completed: currentSection > 4,
        current: currentSection === 4,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Developer Survey 2024</h3>
          <p className="text-sm text-muted-foreground">Section {currentSection} of {sections.length}</p>
        </div>
        
        <MultiStepProgress
          variant="horizontal"
          steps={sections}
          onStepClick={(stepId) => {
            const stepIndex = sections.findIndex(s => s.id === stepId);
            if (stepIndex !== -1) {
              setCurrentSection(stepIndex + 1);
            }
          }}
        />
        
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
            disabled={currentSection === 1}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
          >
            Previous Section
          </button>
          <button
            onClick={() => setCurrentSection(prev => Math.min(sections.length, prev + 1))}
            disabled={currentSection === sections.length}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Next Section
          </button>
        </div>
      </div>
    );
  },
};