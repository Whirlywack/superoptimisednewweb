import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextFeedback } from './TextFeedback';

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock the child components
jest.mock('@/components/questionnaire/QuestionLabel', () => ({
  QuestionLabel: ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label data-testid="question-label">
      {children}
      {required && <span data-testid="required-indicator">*</span>}
    </label>
  ),
}));

jest.mock('@/components/ui/ValidationMessage', () => ({
  ValidationMessage: ({ type, message }: { type: string; message: string }) => (
    <div data-testid={`validation-${type}`} role="alert">
      {message}
    </div>
  ),
}));

jest.mock('@/components/ui/SkipControl', () => ({
  SkipControl: ({ children, onSkip, disabled }: { children: React.ReactNode; onSkip: () => void; disabled?: boolean }) => (
    <button data-testid="skip-button" onClick={onSkip} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('TextFeedback', () => {
  const defaultProps = {
    question: 'What are your thoughts?',
    onChange: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the question label', () => {
    render(<TextFeedback {...defaultProps} />);
    
    expect(screen.getByTestId('question-label')).toBeInTheDocument();
    expect(screen.getByText('What are your thoughts?')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        description="Please provide detailed feedback" 
      />
    );
    
    expect(screen.getByText('Please provide detailed feedback')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<TextFeedback {...defaultProps} required />);
    
    expect(screen.getByTestId('required-indicator')).toBeInTheDocument();
  });

  it('renders textarea with correct attributes', () => {
    render(
      <TextFeedback
        {...defaultProps}
        placeholder="Enter your feedback"
        rows={6}
        maxLength={500}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter your feedback');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toHaveAttribute('maxlength', '500');
  });

  it('calls onChange when text is entered', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<TextFeedback {...defaultProps} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Test feedback');
    
    expect(mockOnChange).toHaveBeenCalledWith('Test feedback');
  });

  it('displays current value', () => {
    render(<TextFeedback {...defaultProps} value="Current feedback" />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Current feedback');
  });

  it('shows character count when maxLength is set', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        value="Test" 
        maxLength={100} 
      />
    );
    
    expect(screen.getByText('4/100')).toBeInTheDocument();
  });

  it('updates character count as user types', async () => {
    const user = userEvent.setup();
    
    render(<TextFeedback {...defaultProps} maxLength={100} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello');
    
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('prevents typing beyond maxLength', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(
      <TextFeedback 
        {...defaultProps} 
        onChange={mockOnChange}
        maxLength={5}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello World');
    
    // Should only call onChange for the first 5 characters
    expect(mockOnChange).toHaveBeenLastCalledWith('Hello');
  });

  it('shows validation error when provided', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        error="This field is required" 
      />
    );
    
    expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows minimum length warning', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        value="Short"
        minLength={10}
      />
    );
    
    expect(screen.getByTestId('validation-warning')).toBeInTheDocument();
    expect(screen.getByText(/Please provide at least 10 characters/)).toBeInTheDocument();
  });

  it('shows helper text when provided and no error', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        helperText="This is helpful information" 
      />
    );
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        helperText="This is helpful information"
        error="This field has an error"
      />
    );
    
    expect(screen.queryByText('This is helpful information')).not.toBeInTheDocument();
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
  });

  it('renders skip control when allowSkip is true', () => {
    render(<TextFeedback {...defaultProps} allowSkip />);
    
    expect(screen.getByTestId('skip-button')).toBeInTheDocument();
    expect(screen.getByText('Skip this question')).toBeInTheDocument();
  });

  it('calls onSkip when skip button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSkip = jest.fn();
    
    render(<TextFeedback {...defaultProps} allowSkip onSkip={mockOnSkip} />);
    
    const skipButton = screen.getByTestId('skip-button');
    await user.click(skipButton);
    
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it('disables textarea when disabled prop is true', () => {
    render(<TextFeedback {...defaultProps} disabled />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TextFeedback 
        {...defaultProps} 
        required
        error="Required field"
        helperText="Helper text"
        maxLength={100}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby');
  });

  it('focuses and blurs correctly', async () => {
    const user = userEvent.setup();
    
    render(<TextFeedback {...defaultProps} />);
    
    const textarea = screen.getByRole('textbox');
    
    await user.click(textarea);
    expect(textarea).toHaveFocus();
    
    await user.tab();
    expect(textarea).not.toHaveFocus();
  });

  it('handles keyboard navigation properly', async () => {
    const user = userEvent.setup();
    
    render(<TextFeedback {...defaultProps} allowSkip />);
    
    const textarea = screen.getByRole('textbox');
    const skipButton = screen.getByTestId('skip-button');
    
    // Tab to textarea
    await user.tab();
    expect(textarea).toHaveFocus();
    
    // Tab to skip button (assuming it's the next focusable element)
    await user.tab();
    expect(skipButton).toHaveFocus();
  });

  it('handles empty values correctly', () => {
    render(<TextFeedback {...defaultProps} value="" />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('');
  });

  it('preserves whitespace in values', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<TextFeedback {...defaultProps} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Line 1\n\nLine 3');
    
    expect(mockOnChange).toHaveBeenLastCalledWith('Line 1\n\nLine 3');
  });

  it('handles paste operations within character limit', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(
      <TextFeedback 
        {...defaultProps} 
        onChange={mockOnChange}
        maxLength={10}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    
    // Simulate paste operation
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', 'Hello World');
    
    fireEvent.paste(textarea, pasteEvent);
    
    // The component should handle this in the onChange handler
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    
    // Should be truncated to maxLength
    expect(mockOnChange).toHaveBeenLastCalledWith('Hello Worl');
  });
});