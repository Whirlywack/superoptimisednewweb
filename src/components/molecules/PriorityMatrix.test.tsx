import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MatrixItem, MatrixSelection } from './PriorityMatrix';
import { PriorityMatrix } from './PriorityMatrix';

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

describe('PriorityMatrix', () => {
  const mockItems: MatrixItem[] = [
    {
      id: 'task1',
      label: 'Task 1',
      description: 'First task',
    },
    {
      id: 'task2',
      label: 'Task 2',
      description: 'Second task',
    },
    {
      id: 'task3',
      label: 'Task 3',
      description: 'Third task',
    },
    {
      id: 'task4',
      label: 'Task 4',
      description: 'Fourth task',
      disabled: true,
    },
  ];

  const defaultProps = {
    question: 'Prioritize these tasks',
    items: mockItems,
    onChange: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the question label', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    expect(screen.getByTestId('question-label')).toBeInTheDocument();
    expect(screen.getByText('Prioritize these tasks')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <PriorityMatrix 
        {...defaultProps} 
        description="Drag tasks into the appropriate quadrants" 
      />
    );
    
    expect(screen.getByText('Drag tasks into the appropriate quadrants')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<PriorityMatrix {...defaultProps} required />);
    
    expect(screen.getByTestId('required-indicator')).toBeInTheDocument();
  });

  it('renders all quadrants with correct labels', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    expect(screen.getByText('Quick Wins')).toBeInTheDocument();
    expect(screen.getByText('Major Projects')).toBeInTheDocument();
    expect(screen.getByText('Fill-ins')).toBeInTheDocument();
    expect(screen.getByText('Thankless Tasks')).toBeInTheDocument();
  });

  it('renders axis labels', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    expect(screen.getByText('Low Effort')).toBeInTheDocument();
    expect(screen.getByText('High Effort')).toBeInTheDocument();
    expect(screen.getByText('Low Impact')).toBeInTheDocument();
    expect(screen.getByText('High Impact')).toBeInTheDocument();
  });

  it('renders custom axis labels when provided', () => {
    render(
      <PriorityMatrix 
        {...defaultProps} 
        effortLabel={{ low: 'Easy', high: 'Hard' }}
        impactLabel={{ low: 'Minor', high: 'Major' }}
      />
    );
    
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
  });

  it('displays unplaced items', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    expect(screen.getByText('Items to place:')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('does not display disabled items in unplaced items', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    // Task 4 is disabled, so it shouldn't appear in unplaced items
    expect(screen.queryByText('Task 4')).not.toBeInTheDocument();
  });

  it('displays items in correct quadrants when positioned', () => {
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
      { itemId: 'task2', position: { effort: 'high', impact: 'low' } },
    ];

    render(<PriorityMatrix {...defaultProps} value={value} />);
    
    // Task 1 should be in Quick Wins quadrant
    const quickWinsSection = screen.getByText('Quick Wins').closest('div');
    expect(quickWinsSection).toContainElement(screen.getByText('Task 1'));
    
    // Task 2 should be in Thankless Tasks quadrant
    const thanklessSection = screen.getByText('Thankless Tasks').closest('div');
    expect(thanklessSection).toContainElement(screen.getByText('Task 2'));
  });

  it('handles drag and drop events', () => {
    const mockOnChange = jest.fn();
    render(<PriorityMatrix {...defaultProps} onChange={mockOnChange} />);
    
    const task1 = screen.getByText('Task 1');
    const quickWinsQuadrant = screen.getByText('Quick Wins').closest('div');
    
    // Simulate drag start
    fireEvent.dragStart(task1, {
      dataTransfer: {
        effectAllowed: 'move',
        setData: jest.fn(),
      },
    });
    
    // Simulate drop on Quick Wins quadrant
    fireEvent.dragOver(quickWinsQuadrant!, { preventDefault: jest.fn() });
    fireEvent.drop(quickWinsQuadrant!, {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn().mockReturnValue('task1'),
      },
    });
    
    expect(mockOnChange).toHaveBeenCalledWith([
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } }
    ]);
  });

  it('allows removing items from quadrants', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
    ];

    render(<PriorityMatrix {...defaultProps} onChange={mockOnChange} value={value} />);
    
    const removeButton = screen.getByLabelText('Remove Task 1 from matrix');
    await user.click(removeButton);
    
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('shows progress when requireAllItems is true', () => {
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
    ];

    render(
      <PriorityMatrix 
        {...defaultProps} 
        value={value} 
        requireAllItems 
      />
    );
    
    expect(screen.getByText('Progress: 1 of 3 items placed')).toBeInTheDocument();
  });

  it('shows completion indicator when all items are placed', () => {
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
      { itemId: 'task2', position: { effort: 'high', impact: 'low' } },
      { itemId: 'task3', position: { effort: 'low', impact: 'low' } },
    ];

    render(
      <PriorityMatrix 
        {...defaultProps} 
        value={value} 
        requireAllItems 
      />
    );
    
    expect(screen.getByText('✓ Complete')).toBeInTheDocument();
  });

  it('shows validation error when provided', () => {
    render(
      <PriorityMatrix 
        {...defaultProps} 
        error="Please place at least one item" 
      />
    );
    
    expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    expect(screen.getByText('Please place at least one item')).toBeInTheDocument();
  });

  it('shows warning when requireAllItems is true and items are unplaced', () => {
    render(
      <PriorityMatrix 
        {...defaultProps} 
        requireAllItems 
        value={[]}
      />
    );
    
    expect(screen.getByTestId('validation-warning')).toBeInTheDocument();
    expect(screen.getByText('Please place all items in the matrix to continue.')).toBeInTheDocument();
  });

  it('renders skip control when allowSkip is true', () => {
    render(<PriorityMatrix {...defaultProps} allowSkip />);
    
    expect(screen.getByTestId('skip-button')).toBeInTheDocument();
    expect(screen.getByText('Skip this question')).toBeInTheDocument();
  });

  it('calls onSkip when skip button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSkip = jest.fn();
    
    render(<PriorityMatrix {...defaultProps} allowSkip onSkip={mockOnSkip} />);
    
    const skipButton = screen.getByTestId('skip-button');
    await user.click(skipButton);
    
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it('disables interactions when disabled prop is true', () => {
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
    ];

    render(<PriorityMatrix {...defaultProps} disabled value={value} />);
    
    // Remove button should not be present when disabled
    expect(screen.queryByLabelText('Remove Task 1 from matrix')).not.toBeInTheDocument();
    
    // Drag should be disabled
    const task2 = screen.getByText('Task 2');
    expect(task2.closest('[draggable]')).toHaveAttribute('draggable', 'false');
  });

  it('shows helper text when provided', () => {
    render(
      <PriorityMatrix 
        {...defaultProps} 
        helperText="Drag items to prioritize them" 
      />
    );
    
    expect(screen.getByText('Drag items to prioritize them')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <PriorityMatrix 
        {...defaultProps} 
        helperText="Helper text"
        error="Error message"
      />
    );
    
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows drag and drop tip for unplaced items', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    expect(screen.getByText(/Drag and drop items from above/)).toBeInTheDocument();
  });

  it('handles drag enter and leave events for visual feedback', () => {
    render(<PriorityMatrix {...defaultProps} />);
    
    const quickWinsQuadrant = screen.getByText('Quick Wins').closest('div');
    
    // Simulate drag enter
    fireEvent.dragEnter(quickWinsQuadrant!);
    
    // Simulate drag leave
    fireEvent.dragLeave(quickWinsQuadrant!);
    
    // Component should handle these events without errors
    expect(quickWinsQuadrant).toBeInTheDocument();
  });

  it('updates selections correctly when moving items between quadrants', () => {
    const mockOnChange = jest.fn();
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
    ];

    render(<PriorityMatrix {...defaultProps} onChange={mockOnChange} value={value} />);
    
    const task1 = screen.getByText('Task 1');
    const majorProjectsQuadrant = screen.getByText('Major Projects').closest('div');
    
    // Simulate dragging task1 from Quick Wins to Major Projects
    fireEvent.dragStart(task1, {
      dataTransfer: {
        effectAllowed: 'move',
        setData: jest.fn(),
      },
    });
    
    fireEvent.drop(majorProjectsQuadrant!, {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn().mockReturnValue('task1'),
      },
    });
    
    expect(mockOnChange).toHaveBeenCalledWith([
      { itemId: 'task1', position: { effort: 'high', impact: 'high' } }
    ]);
  });

  it('renders icons when provided in items', () => {
    const itemsWithIcons: MatrixItem[] = [
      {
        id: 'task-with-icon',
        label: 'Task with Icon',
        description: 'Task description',
        icon: <span data-testid="task-icon">🚀</span>,
      },
    ];

    render(<PriorityMatrix {...defaultProps} items={itemsWithIcons} />);
    
    expect(screen.getByTestId('task-icon')).toBeInTheDocument();
  });

  it('handles empty quadrants correctly', () => {
    render(<PriorityMatrix {...defaultProps} value={[]} />);
    
    // All quadrants should show "Drop items here" hint
    const dropHints = screen.getAllByText('Drop items here');
    expect(dropHints).toHaveLength(4); // One for each quadrant
  });

  it('prevents drag operations when items are disabled', () => {
    const itemsWithDisabled: MatrixItem[] = [
      {
        id: 'disabled-task',
        label: 'Disabled Task',
        description: 'This task is disabled',
        disabled: true,
      },
    ];

    render(<PriorityMatrix {...defaultProps} items={itemsWithDisabled} />);
    
    // Disabled items should not appear in the unplaced items section
    expect(screen.queryByText('Items to place:')).not.toBeInTheDocument();
  });

  it('handles accessibility correctly', () => {
    const value: MatrixSelection[] = [
      { itemId: 'task1', position: { effort: 'low', impact: 'high' } },
    ];

    render(<PriorityMatrix {...defaultProps} value={value} />);
    
    // Remove button should have proper aria-label
    const removeButton = screen.getByLabelText('Remove Task 1 from matrix');
    expect(removeButton).toBeInTheDocument();
  });
});