import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { H1, H2, Paragraph } from '../ui/Typography';
import { Icon } from '../ui/Icon';
import { Card, CardContent } from '../molecules/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { CheckCircle, Share2, Download, MailIcon, ExternalLink, ArrowRight, Gift, Users, Zap } from 'lucide-react';

export interface NextStep {
  /** Unique identifier for the step */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Icon for the step */
  icon?: React.ReactNode;
  /** Action to take (button link, callback, etc.) */
  action?: {
    type: 'link' | 'download' | 'share' | 'callback';
    label: string;
    url?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  /** Optional priority/order */
  priority?: number;
  /** Whether this step is completed */
  completed?: boolean;
}

export interface SocialShare {
  /** Platform name */
  platform: 'twitter' | 'linkedin' | 'facebook' | 'email' | 'copy-link';
  /** Share URL */
  url: string;
  /** Share text/title */
  text?: string;
  /** Optional hashtags (for Twitter) */
  hashtags?: string[];
}

export interface ThankYouScreenProps {
  /** Main heading text */
  title?: string;
  /** Subtitle or completion message */
  subtitle?: string;
  /** Detailed description */
  description?: string;
  /** Success message variant */
  variant?: 'celebration' | 'professional' | 'minimalist' | 'community';
  /** Show completion progress */
  showProgress?: boolean;
  /** Completion percentage (0-100) */
  completionProgress?: number;
  /** Time taken to complete */
  timeTaken?: string;
  /** Number of questions answered */
  questionsAnswered?: number;
  /** Total number of questions */
  totalQuestions?: number;
  /** Array of next steps for the user */
  nextSteps?: NextStep[];
  /** Social sharing options */
  socialSharing?: SocialShare[];
  /** Show social sharing section */
  showSharing?: boolean;
  /** Newsletter signup CTA */
  newsletterSignup?: {
    title: string;
    description: string;
    placeholder?: string;
    onSubmit: (email: string) => void;
  };
  /** Callback when user wants to retake */
  onRetake?: () => void;
  /** Callback when user wants to view results */
  onViewResults?: () => void;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ThankYouScreen({
  title = "Thank you for your responses!",
  subtitle,
  description = "Your feedback has been recorded and will help improve our understanding of the community.",
  variant = 'professional',
  showProgress = true,
  completionProgress = 100,
  timeTaken,
  questionsAnswered,
  totalQuestions,
  nextSteps = [],
  socialSharing = [],
  showSharing = false,
  newsletterSignup,
  onRetake,
  onViewResults,
  footerContent,
  className,
}: ThankYouScreenProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = React.useState(false);
  
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterSignup || !email.trim()) return;
    
    setIsSubmittingEmail(true);
    try {
      await newsletterSignup.onSubmit(email);
      setEmail('');
    } finally {
      setIsSubmittingEmail(false);
    }
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'celebration':
        return {
          container: 'bg-gradient-to-br from-light-gray to-off-white dark:from-gray-800 dark:to-gray-900',
          icon: 'text-primary',
          accent: 'border-primary/20',
        };
      case 'community':
        return {
          container: 'bg-gradient-to-br from-light-gray to-off-white dark:from-gray-800 dark:to-gray-900',
          icon: 'text-primary',
          accent: 'border-primary/20',
        };
      case 'minimalist':
        return {
          container: 'bg-off-white dark:bg-gray-900',
          icon: 'text-primary',
          accent: 'border-light-gray dark:border-gray-700',
        };
      default: // professional
        return {
          container: 'bg-off-white dark:bg-gray-900',
          icon: 'text-primary',
          accent: 'border-primary/20',
        };
    }
  };
  
  const styles = getVariantStyles();
  
  const formatSocialUrl = (share: SocialShare) => {
    const encodedText = encodeURIComponent(share.text || '');
    const encodedUrl = encodeURIComponent(share.url);
    
    switch (share.platform) {
      case 'twitter':
        const hashtags = share.hashtags ? share.hashtags.join(',') : '';
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${hashtags}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'email':
        return `mailto:?subject=${encodedText}&body=${encodedUrl}`;
      default:
        return share.url;
    }
  };
  
  const handleShare = async (share: SocialShare) => {
    if (share.platform === 'copy-link') {
      try {
        await navigator.clipboard.writeText(share.url);
        // Could show a toast notification here
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    } else {
      window.open(formatSocialUrl(share), '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4", styles.container, className)}>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Main Success Message */}
        <div className="text-center space-y-6">
          <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg", styles.accent)}>
            <Icon size={40} className={styles.icon}>
              <CheckCircle />
            </Icon>
          </div>
          
          <div className="space-y-3">
            <H1 className="text-3xl md:text-4xl lg:text-5xl text-off-black dark:text-off-white">
              {title}
            </H1>
            
            {subtitle && (
              <H2 className="text-xl md:text-2xl text-warm-gray">
                {subtitle}
              </H2>
            )}
            
            <Paragraph className="text-lg max-w-2xl mx-auto text-warm-gray">
              {description}
            </Paragraph>
          </div>
        </div>
        
        {/* Progress and Stats */}
        {showProgress && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-warm-gray">
                <span>Completion</span>
                <span>{completionProgress}%</span>
              </div>
              <ProgressBar 
                progress={completionProgress} 
                variant="success"
                showLabel={false}
                className="h-2"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-light-gray dark:border-gray-700">
                {questionsAnswered && totalQuestions && (
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-off-black dark:text-off-white">
                      {questionsAnswered}/{totalQuestions}
                    </div>
                    <div className="text-sm text-warm-gray">Questions</div>
                  </div>
                )}
                
                {timeTaken && (
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-off-black dark:text-off-white">
                      {timeTaken}
                    </div>
                    <div className="text-sm text-warm-gray">Time taken</div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary">
                    <Icon size={24} className="mx-auto">
                      <CheckCircle />
                    </Icon>
                  </div>
                  <div className="text-sm text-warm-gray">Complete</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary">
                    <Icon size={24} className="mx-auto">
                      <Gift />
                    </Icon>
                  </div>
                  <div className="text-sm text-warm-gray">Rewarded</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div className="space-y-6">
            <H2 className="text-2xl font-semibold text-center text-off-black dark:text-off-white">
              What's next?
            </H2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nextSteps
                .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                .map((step) => (
                  <Card key={step.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        {step.icon && (
                          <div className={cn("flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center", step.completed && "bg-primary/20 dark:bg-primary/20")}>
                            <Icon size={20} className={step.completed ? "text-primary" : "text-primary"}>
                              {step.completed ? <CheckCircle /> : step.icon}
                            </Icon>
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold text-off-black dark:text-off-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-warm-gray">
                            {step.description}
                          </p>
                          
                          {step.action && !step.completed && (
                            <Button
                              variant={step.action.variant || 'outline'}
                              size="sm"
                              onClick={() => {
                                if (step.action?.type === 'link' && step.action.url) {
                                  window.open(step.action.url, '_blank', 'noopener,noreferrer');
                                } else if (step.action?.type === 'callback' && step.action.onClick) {
                                  step.action.onClick();
                                }
                              }}
                              className="w-full"
                            >
                              {step.action.label}
                              <Icon size={16} className="ml-2">
                                <ArrowRight />
                              </Icon>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* Social Sharing */}
        {showSharing && socialSharing.length > 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <H2 className="text-lg font-semibold text-off-black dark:text-off-white">
                  Share your experience
                </H2>
                <p className="text-sm text-warm-gray">
                  Help others discover this questionnaire
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {socialSharing.map((share) => (
                  <Button
                    key={share.platform}
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(share)}
                    className="flex items-center gap-2"
                  >
                    <Icon size={16}>
                      {share.platform === 'twitter' && <Share2 />}
                      {share.platform === 'linkedin' && <Users />}
                      {share.platform === 'facebook' && <Users />}
                      {share.platform === 'email' && <MailIcon />}
                      {share.platform === 'copy-link' && <ExternalLink />}
                    </Icon>
                    <span className="capitalize">{share.platform.replace('-', ' ')}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Newsletter Signup */}
        {newsletterSignup && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <H2 className="text-lg font-semibold text-off-black dark:text-off-white flex items-center justify-center gap-2">
                  <Icon size={20}>
                    <Zap />
                  </Icon>
                  {newsletterSignup.title}
                </H2>
                <p className="text-sm text-warm-gray">
                  {newsletterSignup.description}
                </p>
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletterSignup.placeholder || "Enter your email"}
                  className="flex-1 px-4 py-2 border border-light-gray dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-off-black dark:text-off-white placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmittingEmail || !email.trim()}
                  className="px-6"
                >
                  {isSubmittingEmail ? 'Sending...' : 'Subscribe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {onViewResults && (
            <Button variant="primary" size="lg" onClick={onViewResults}>
              View My Results
            </Button>
          )}
          
          {onRetake && (
            <Button variant="outline" size="lg" onClick={onRetake}>
              Retake Questionnaire
            </Button>
          )}
        </div>
        
        {/* Footer Content */}
        {footerContent && (
          <div className="text-center text-sm text-warm-gray max-w-2xl mx-auto">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThankYouScreen;