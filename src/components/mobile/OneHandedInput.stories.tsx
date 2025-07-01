import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { OneHandedInput, type OneHandedInputAction } from './OneHandedInput';
import { 
  Camera, 
  Paperclip, 
  MapPin, 
  Calendar, 
  Hash, 
  AtSign,
  Bold,
  Italic,
  Link,
  Image,
  Code,
  Smile
} from 'lucide-react';

const meta: Meta<typeof OneHandedInput> = {
  title: 'Mobile/OneHandedInput',
  component: OneHandedInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A mobile-optimized input component designed for one-handed use with thumb-reachable controls, voice input, and contextual actions. Perfect for chat interfaces, forms, and messaging applications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'textarea', 'email', 'password', 'number', 'tel', 'url'],
    },
    size: {
      control: { type: 'select' },
      options: ['compact', 'comfortable', 'spacious'],
    },
    position: {
      control: { type: 'select' },
      options: ['bottom', 'middle', 'top', 'auto'],
    },
    validationState: {
      control: { type: 'select' },
      options: ['none', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OneHandedInput>;

function ControlledExample({ 
  initialValue = '', 
  ...props 
}: { 
  initialValue?: string; 
  [key: string]: any; 
}) {
  const [value, setValue] = useState(initialValue);
  const [submitted, setSubmitted] = useState<string[]>([]);
  
  const handleSubmit = (text: string) => {
    setSubmitted(prev => [...prev, text]);
    setValue('');
  };
  
  return (
    <div className="space-y-4">
      {/* Message History */}
      {submitted.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto p-4 bg-light-gray dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-sm text-warm-gray">Messages:</h4>
          {submitted.map((message, index) => (
            <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded text-sm">
              {message}
            </div>
          ))}
        </div>
      )}
      
      <OneHandedInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        {...props}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ControlledExample 
      placeholder="Type your message..."
      showCounter={true}
      maxLength={280}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default one-handed input with character counter and submit functionality.',
      },
    },
  },
};

export const ChatInterface: Story = {
  render: () => {
    const chatActions: OneHandedInputAction[] = [
      {
        id: 'camera',
        icon: <Camera />,
        label: 'Take photo',
        onClick: () => alert('Camera opened'),
      },
      {
        id: 'attach',
        icon: <Paperclip />,
        label: 'Attach file',
        onClick: () => alert('File picker opened'),
      },
      {
        id: 'location',
        icon: <MapPin />,
        label: 'Share location',
        onClick: () => alert('Location shared'),
      },
    ];
    
    return (
      <ControlledExample 
        type="textarea"
        placeholder="Type a message..."
        enableVoiceInput={true}
        enableEmoji={true}
        actions={chatActions}
        autoResize={true}
        maxRows={4}
        showWordCounter={true}
        enableHaptics={true}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat interface with voice input, emoji picker, and file attachments.',
      },
    },
  },
};

export const PasswordInput: Story = {
  render: () => (
    <ControlledExample 
      type="password"
      placeholder="Enter your password"
      showClearButton={false}
      submitText="Login"
      validationState="none"
      minLength={8}
      maxLength={50}
      showCounter={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password input with show/hide toggle and validation.',
      },
    },
  },
};

export const TextareaWithFormatting: Story = {
  render: () => {
    const formattingActions: OneHandedInputAction[] = [
      {
        id: 'bold',
        icon: <Bold />,
        label: 'Bold text',
        onClick: () => alert('Bold formatting applied'),
      },
      {
        id: 'italic',
        icon: <Italic />,
        label: 'Italic text',
        onClick: () => alert('Italic formatting applied'),
      },
      {
        id: 'link',
        icon: <Link />,
        label: 'Insert link',
        onClick: () => alert('Link dialog opened'),
      },
      {
        id: 'code',
        icon: <Code />,
        label: 'Code block',
        onClick: () => alert('Code block inserted'),
      },
    ];
    
    return (
      <ControlledExample 
        type="textarea"
        placeholder="Write your post..."
        actions={formattingActions}
        autoResize={true}
        maxRows={8}
        minRows={3}
        showCounter={true}
        showWordCounter={true}
        maxLength={1000}
        submitText="Publish"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Rich text editor interface with formatting tools and counters.',
      },
    },
  },
};

export const CompactSize: Story = {
  render: () => (
    <ControlledExample 
      size="compact"
      placeholder="Quick message..."
      enableVoiceInput={true}
      showCounter={true}
      maxLength={100}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact size variant for space-constrained layouts.',
      },
    },
  },
};

export const SpaciousSize: Story = {
  render: () => (
    <ControlledExample 
      size="spacious"
      type="textarea"
      placeholder="Share your thoughts..."
      enableEmoji={true}
      autoResize={true}
      maxRows={6}
      showWordCounter={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spacious size variant for better accessibility and comfort.',
      },
    },
  },
};

export const FixedBottom: Story = {
  render: () => (
    <div className="h-96 relative overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p>This simulates page content. The input is fixed at the bottom.</p>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 bg-light-gray dark:bg-gray-800 rounded">
            Sample content item {i + 1}
          </div>
        ))}
      </div>
      
      <OneHandedInput
        position="bottom"
        placeholder="Message fixed at bottom..."
        enableVoiceInput={true}
        showCounter={true}
        maxLength={200}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fixed bottom position for persistent input accessibility.',
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Success State</h3>
        <OneHandedInput
          value="Valid email@example.com"
          validationState="success"
          validationMessage="Email format is valid"
          type="email"
          showSubmitButton={false}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Warning State</h3>
        <OneHandedInput
          value="Short"
          validationState="warning"
          validationMessage="Password should be at least 8 characters"
          type="password"
          minLength={8}
          showCounter={true}
          showSubmitButton={false}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Error State</h3>
        <OneHandedInput
          value="invalid-email"
          validationState="error"
          validationMessage="Please enter a valid email address"
          type="email"
          showSubmitButton={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different validation states with contextual messages and styling.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  render: () => {
    const [currentView, setCurrentView] = useState<'chat' | 'comment' | 'post'>('chat');
    
    const chatActions: OneHandedInputAction[] = [
      {
        id: 'camera',
        icon: <Camera />,
        label: 'Camera',
        onClick: () => alert('Camera'),
      },
      {
        id: 'image',
        icon: <Image />,
        label: 'Gallery',
        onClick: () => alert('Gallery'),
      },
    ];
    
    const renderInput = () => {
      switch (currentView) {
        case 'chat':
          return (
            <OneHandedInput
              key="chat"
              type="textarea"
              placeholder="Message..."
              enableVoiceInput={true}
              enableEmoji={true}
              actions={chatActions}
              autoResize={true}
              maxRows={3}
              enableHaptics={true}
              size="comfortable"
            />
          );
        case 'comment':
          return (
            <OneHandedInput
              key="comment"
              type="textarea"
              placeholder="Add a comment..."
              enableEmoji={true}
              autoResize={true}
              maxRows={4}
              showWordCounter={true}
              maxLength={500}
              submitText="Comment"
            />
          );
        case 'post':
          return (
            <OneHandedInput
              key="post"
              type="textarea"
              placeholder="What's on your mind?"
              enableEmoji={true}
              autoResize={true}
              maxRows={6}
              minRows={3}
              showWordCounter={true}
              showCounter={true}
              maxLength={280}
              submitText="Post"
              size="spacious"
            />
          );
      }
    };
    
    return (
      <div className="max-w-sm mx-auto space-y-4">
        {/* View Switcher */}
        <div className="flex bg-light-gray dark:bg-gray-800 rounded-lg p-1">
          {(['chat', 'comment', 'post'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize",
                currentView === view
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-warm-gray hover:text-off-black dark:hover:text-off-white"
              )}
            >
              {view}
            </button>
          ))}
        </div>
        
        {/* Current Input */}
        {renderInput()}
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized examples for different use cases with haptic feedback.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <ControlledExample 
      initialValue="This input is disabled"
      disabled={true}
      placeholder="You cannot type here"
      enableVoiceInput={true}
      showCounter={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state showing how the component appears when not interactive.',
      },
    },
  },
};

export const VoiceInputDemo: Story = {
  render: () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    
    const handleVoiceStart = () => {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript('Hello, this is simulated voice input!');
        setIsListening(false);
      }, 2000);
    };
    
    const handleVoiceEnd = (text: string) => {
      setIsListening(false);
      setTranscript(text);
    };
    
    return (
      <div className="space-y-4">
        {isListening && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-800 dark:text-blue-300">Listening...</span>
            </div>
          </div>
        )}
        
        <OneHandedInput
          value={transcript}
          onChange={setTranscript}
          placeholder="Tap the mic to start voice input..."
          enableVoiceInput={true}
          onVoiceStart={handleVoiceStart}
          onVoiceEnd={handleVoiceEnd}
          showCounter={true}
          maxLength={200}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Voice input demonstration with simulated speech recognition.',
      },
    },
  },
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}