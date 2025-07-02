import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Check, AlertTriangle, X, Info, Upload, Download, Save } from 'lucide-react';
import { 
  AnnounceRegion, 
  LiveAnnouncer, 
  StatusAnnouncer, 
  LoadingAnnouncer,
  ProgressAnnouncer,
  FormAnnouncer,
  NotificationAnnouncer
} from './AnnounceRegion';

const meta = {
  title: 'Accessibility/AnnounceRegion',
  component: AnnounceRegion,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Live regions that announce dynamic content changes to screen readers. Essential for status updates, form validation, loading states, and notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Message to announce to screen readers',
    },
    priority: {
      control: 'select',
      options: ['polite', 'assertive'],
      description: 'Announcement priority - polite waits for user to finish, assertive interrupts',
    },
    atomic: {
      control: 'boolean',
      description: 'Whether to read the entire content when it changes',
    },
  },
} satisfies Meta<typeof AnnounceRegion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicAnnouncement: Story = {
  render: () => {
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

    const announceMessage = (msg: string, prio: 'polite' | 'assertive' = 'polite') => {
      setMessage(msg);
      setPriority(prio);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    };

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Live Region Announcements</h2>
            <p className="text-warm-gray mb-3">
              Click the buttons below to trigger announcements that screen readers will detect automatically.
            </p>
            <ul className="text-warm-gray text-small space-y-1">
              <li>• <strong>Polite:</strong> Waits for user to finish current activity</li>
              <li>• <strong>Assertive:</strong> Interrupts immediately (use sparingly)</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray space-y-4">
            <h3 className="text-h4 font-semibold text-off-black">Test Announcements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => announceMessage('Task completed successfully', 'polite')}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-off-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                <Check className="h-4 w-4" />
                Success (Polite)
              </button>
              
              <button
                onClick={() => announceMessage('Warning: Please review your input', 'polite')}
                className="flex items-center gap-2 px-4 py-3 bg-yellow-600 text-off-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Warning (Polite)
              </button>
              
              <button
                onClick={() => announceMessage('Critical error occurred', 'assertive')}
                className="flex items-center gap-2 px-4 py-3 bg-red-600 text-off-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                Error (Assertive)
              </button>
              
              <button
                onClick={() => announceMessage('Information updated', 'polite')}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-off-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <Info className="h-4 w-4" />
                Info (Polite)
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-lg border ${
                priority === 'assertive' 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">
                    Last announcement ({priority}):
                  </span>
                  <span>{message}</span>
                </div>
              </div>
            )}

            <AnnounceRegion message={message} priority={priority} />
          </div>
        </div>
      </div>
    );
  },
};

export const StatusUpdates: Story = {
  render: () => {
    return (
      <StatusAnnouncer>
        {(announceStatus: any) => (
          <div className="p-8 bg-off-white min-h-screen">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h2 className="text-h3 font-semibold text-off-black mb-2">Status Announcements</h2>
                <p className="text-warm-gray">
                  Real-world examples of status updates that should be announced to screen readers.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="p-6 bg-white rounded-lg border border-light-gray">
                  <h3 className="text-h4 font-semibold text-off-black mb-4">File Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => announceStatus('File uploaded successfully')}
                      className="flex items-center gap-2 px-4 py-3 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload File
                    </button>
                    
                    <button
                      onClick={() => announceStatus('File downloaded to your device')}
                      className="flex items-center gap-2 px-4 py-3 bg-green-600 text-off-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                      <Download className="h-4 w-4" />
                      Download File
                    </button>
                    
                    <button
                      onClick={() => announceStatus('Changes saved automatically')}
                      className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-off-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg border border-light-gray">
                  <h3 className="text-h4 font-semibold text-off-black mb-4">User Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => announceStatus('Added to favorites')}
                      className="w-full text-left p-3 hover:bg-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      ⭐ Add to Favorites
                    </button>
                    
                    <button
                      onClick={() => announceStatus('Shared to social media')}
                      className="w-full text-left p-3 hover:bg-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      📤 Share Content
                    </button>
                    
                    <button
                      onClick={() => announceStatus('Subscribed to newsletter')}
                      className="w-full text-left p-3 hover:bg-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      📧 Subscribe to Updates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </StatusAnnouncer>
    );
  },
};

export const LoadingStates: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const simulateLoading = (withError = false) => {
      setIsLoading(true);
      setHasError(false);
      
      setTimeout(() => {
        setIsLoading(false);
        setHasError(withError);
      }, 3000);
    };

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Loading State Announcements</h2>
            <p className="text-warm-gray">
              Loading states are announced automatically to keep screen reader users informed.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray space-y-4">
            <h3 className="text-h4 font-semibold text-off-black">Simulate Loading</h3>
            
            <div className="flex gap-3">
              <button
                onClick={() => simulateLoading(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Data (Success)
              </button>
              
              <button
                onClick={() => simulateLoading(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-off-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Data (Error)
              </button>
            </div>

            <div className="p-4 bg-light-gray rounded-lg">
              <div className="flex items-center gap-3">
                {isLoading && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                )}
                
                <span className={`font-medium ${
                  isLoading ? 'text-primary' : hasError ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isLoading 
                    ? 'Loading...' 
                    : hasError 
                    ? 'Error loading data' 
                    : 'Data loaded successfully'
                  }
                </span>
              </div>
            </div>

            <LoadingAnnouncer
              isLoading={isLoading}
              error={hasError}
              loadingMessage="Loading data, please wait"
              completedMessage="Data has been loaded successfully"
              errorMessage="Failed to load data, please try again"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const ProgressUpdates: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const startProgress = () => {
      setProgress(0);
      setIsRunning(true);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRunning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    };

    const resetProgress = () => {
      setProgress(0);
      setIsRunning(false);
    };

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Progress Announcements</h2>
            <p className="text-warm-gray">
              Progress updates are announced at 10% intervals to avoid overwhelming screen reader users.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray space-y-4">
            <h3 className="text-h4 font-semibold text-off-black">File Upload Progress</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-warm-gray">Progress: {progress}%</span>
                <div className="flex gap-2">
                  <button
                    onClick={startProgress}
                    disabled={isRunning}
                    className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Upload
                  </button>
                  
                  <button
                    onClick={resetProgress}
                    disabled={isRunning}
                    className="px-4 py-2 border border-warm-gray text-warm-gray rounded-lg hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-light-gray rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-small text-warm-gray">
                Screen readers will announce progress at: 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%
              </p>
            </div>

            <ProgressAnnouncer
              value={progress}
              max={100}
              announceEvery={10}
              label="File upload"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const FormValidation: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <FormAnnouncer>
        {(announceValidation: any, announceSuccess: any, announceError: any) => (
          <div className="p-8 bg-off-white min-h-screen">
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h2 className="text-h3 font-semibold text-off-black mb-2">Form Validation</h2>
                <p className="text-warm-gray">
                  Form validation messages are announced to screen readers automatically.
                </p>
              </div>

              <form
                className="p-6 bg-white rounded-lg border border-light-gray space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  if (!email) {
                    announceError('Email is required');
                    return;
                  }
                  
                  if (!email.includes('@')) {
                    announceValidation('Please enter a valid email address');
                    return;
                  }
                  
                  if (!password) {
                    announceError('Password is required');
                    return;
                  }
                  
                  if (password.length < 8) {
                    announceValidation('Password must be at least 8 characters long');
                    return;
                  }
                  
                  announceSuccess('Account created successfully');
                }}
              >
                <h3 className="text-h4 font-semibold text-off-black">Create Account</h3>
                
                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      if (email && !email.includes('@')) {
                        announceValidation('Email format appears invalid');
                      }
                    }}
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => {
                      if (password && password.length < 8) {
                        announceValidation('Password should be at least 8 characters');
                      }
                    }}
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter your password"
                    required
                  />
                  <p className="mt-1 text-small text-warm-gray">
                    Must be at least 8 characters long
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-off-white py-3 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        )}
      </FormAnnouncer>
    );
  },
};

export const NotificationSystem: Story = {
  render: () => {
    const [notifications, setNotifications] = useState<Array<{
      id: string;
      message: string;
      type: 'info' | 'success' | 'warning' | 'error';
      announced?: boolean;
    }>>([]);

    const addNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type, announced: false }]);
    };

    const markAsAnnounced = (id: string) => {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, announced: true } : n)
      );
    };

    const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Notification System</h2>
            <p className="text-warm-gray">
              Notifications are announced to screen readers in order, with appropriate priority levels.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray space-y-4">
            <h3 className="text-h4 font-semibold text-off-black">Add Notifications</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => addNotification('info', 'New update available')}
                className="px-3 py-2 bg-blue-600 text-off-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-small"
              >
                Info
              </button>
              
              <button
                onClick={() => addNotification('success', 'Task completed')}
                className="px-3 py-2 bg-green-600 text-off-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 text-small"
              >
                Success
              </button>
              
              <button
                onClick={() => addNotification('warning', 'Check your input')}
                className="px-3 py-2 bg-yellow-600 text-off-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 text-small"
              >
                Warning
              </button>
              
              <button
                onClick={() => addNotification('error', 'Connection failed')}
                className="px-3 py-2 bg-red-600 text-off-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 text-small"
              >
                Error
              </button>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-h4 font-semibold text-off-black">Active Notifications</h3>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border flex items-center justify-between ${
                    notification.type === 'info' ? 'bg-blue-50 border-blue-200' :
                    notification.type === 'success' ? 'bg-green-50 border-green-200' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      notification.announced ? 'bg-gray-400' : 'bg-current'
                    }`} />
                    <span className={`text-small ${
                      notification.type === 'info' ? 'text-blue-800' :
                      notification.type === 'success' ? 'text-green-800' :
                      notification.type === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      {notification.message}
                      {notification.announced && ' (announced)'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-warm-gray hover:text-off-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <NotificationAnnouncer
            notifications={notifications}
            onNotificationAnnounced={markAsAnnounced}
          />
        </div>
      </div>
    );
  },
};