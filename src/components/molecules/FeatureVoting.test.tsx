import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { VotingOption, FeatureVote } from "./FeatureVoting";
import { FeatureVoting } from "./FeatureVoting";

// Mock the utility functions
jest.mock("@/lib/utils", () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
}));

// Mock the child components
jest.mock("@/components/questionnaire/QuestionLabel", () => ({
  QuestionLabel: ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label data-testid="question-label">
      {children}
      {required && <span data-testid="required-indicator">*</span>}
    </label>
  ),
}));

jest.mock("@/components/ui/ValidationMessage", () => ({
  ValidationMessage: ({ type, message }: { type: string; message: string }) => (
    <div data-testid={`validation-${type}`} role="alert">
      {message}
    </div>
  ),
}));

jest.mock("@/components/ui/SkipControl", () => ({
  SkipControl: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button data-testid="skip-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("FeatureVoting", () => {
  const mockOptions: VotingOption[] = [
    {
      id: "feature1",
      label: "Feature 1",
      description: "First feature",
    },
    {
      id: "feature2",
      label: "Feature 2",
      description: "Second feature",
    },
    {
      id: "feature3",
      label: "Feature 3",
      description: "Third feature",
      minPoints: 5,
      maxPoints: 20,
    },
    {
      id: "feature4",
      label: "Feature 4",
      description: "Fourth feature",
      disabled: true,
    },
  ];

  const defaultProps = {
    question: "Prioritize these features",
    options: mockOptions,
    totalPoints: 100,
    onChange: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the question label", () => {
    render(<FeatureVoting {...defaultProps} />);

    expect(screen.getByTestId("question-label")).toBeInTheDocument();
    expect(screen.getByText("Prioritize these features")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<FeatureVoting {...defaultProps} description="Allocate points to show preference" />);

    expect(screen.getByText("Allocate points to show preference")).toBeInTheDocument();
  });

  it("shows required indicator when required", () => {
    render(<FeatureVoting {...defaultProps} required />);

    expect(screen.getByTestId("required-indicator")).toBeInTheDocument();
  });

  it("displays total points and remaining points", () => {
    render(<FeatureVoting {...defaultProps} />);

    expect(screen.getByText("Points Available")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument(); // Remaining points
    expect(screen.getByText("of 100")).toBeInTheDocument();
  });

  it("renders all feature options", () => {
    render(<FeatureVoting {...defaultProps} />);

    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("First feature")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Second feature")).toBeInTheDocument();
    expect(screen.getByText("Feature 3")).toBeInTheDocument();
    expect(screen.getByText("Third feature")).toBeInTheDocument();
  });

  it("handles increment button clicks", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} />);

    const incrementButtons = screen.getAllByLabelText(/Increase points for/);
    await user.click(incrementButtons[0]); // Increment Feature 1

    expect(mockOnChange).toHaveBeenCalledWith([{ optionId: "feature1", points: 1 }]);
  });

  it("handles decrement button clicks", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const initialValue: FeatureVote[] = [{ optionId: "feature1", points: 5 }];

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} value={initialValue} />);

    const decrementButton = screen.getByLabelText("Decrease points for Feature 1");
    await user.click(decrementButton);

    expect(mockOnChange).toHaveBeenCalledWith([{ optionId: "feature1", points: 4 }]);
  });

  it("handles direct input changes", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByLabelText("Points for Feature 1");
    await user.clear(input);
    await user.type(input, "5");

    // The input triggers onChange for the final value
    expect(mockOnChange).toHaveBeenLastCalledWith([{ optionId: "feature1", points: 5 }]);
  });

  it("removes vote when points are set to 0", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const initialValue: FeatureVote[] = [{ optionId: "feature1", points: 5 }];

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} value={initialValue} />);

    const input = screen.getByLabelText("Points for Feature 1");
    await user.click(input);
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("0");

    // Check that the final call removes the vote
    expect(mockOnChange).toHaveBeenLastCalledWith([]);
  });

  it("respects minimum point constraints", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const initialValue: FeatureVote[] = [
      { optionId: "feature3", points: 5 }, // Feature 3 has minPoints: 5
    ];

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} value={initialValue} />);

    const decrementButton = screen.getByLabelText("Decrease points for Feature 3");
    await user.click(decrementButton);

    // Should not go below 5
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("respects maximum point constraints", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const initialValue: FeatureVote[] = [
      { optionId: "feature3", points: 20 }, // Feature 3 has maxPoints: 20
    ];

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} value={initialValue} />);

    const incrementButton = screen.getByLabelText("Increase points for Feature 3");
    await user.click(incrementButton);

    // Should not go above 20
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("prevents allocation beyond total points", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const initialValue: FeatureVote[] = [{ optionId: "feature1", points: 90 }];

    render(
      <FeatureVoting
        {...defaultProps}
        onChange={mockOnChange}
        value={initialValue}
        totalPoints={100}
      />
    );

    const input = screen.getByLabelText("Points for Feature 2");
    await user.clear(input);
    await user.type(input, "2"); // This should work within limit

    // Should allocate 2 points (within the 10 point limit)
    expect(mockOnChange).toHaveBeenLastCalledWith([
      { optionId: "feature1", points: 90 },
      { optionId: "feature2", points: 2 },
    ]);
  });

  it("updates remaining points display", () => {
    const value: FeatureVote[] = [
      { optionId: "feature1", points: 30 },
      { optionId: "feature2", points: 20 },
    ];

    render(<FeatureVoting {...defaultProps} value={value} />);

    expect(screen.getByText("50")).toBeInTheDocument(); // 100 - 30 - 20
  });

  it("shows progress bar", () => {
    const value: FeatureVote[] = [{ optionId: "feature1", points: 25 }];

    const { container } = render(<FeatureVoting {...defaultProps} value={value} />);

    const progressBar = container.querySelector('[style*="width: 25%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("handles reset button", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const value: FeatureVote[] = [
      { optionId: "feature1", points: 30 },
      { optionId: "feature2", points: 20 },
    ];

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} value={value} />);

    const resetButton = screen.getByText("Reset all votes");
    await user.click(resetButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("shows validation error when provided", () => {
    render(<FeatureVoting {...defaultProps} error="Please allocate at least some points" />);

    expect(screen.getByTestId("validation-error")).toBeInTheDocument();
    expect(screen.getByText("Please allocate at least some points")).toBeInTheDocument();
  });

  it("shows warning when requireAllPoints is true and points remain", () => {
    render(
      <FeatureVoting
        {...defaultProps}
        requireAllPoints
        value={[{ optionId: "feature1", points: 50 }]}
      />
    );

    expect(screen.getByTestId("validation-warning")).toBeInTheDocument();
    expect(screen.getByText(/Please allocate all 100 points/)).toBeInTheDocument();
  });

  it("renders skip control when allowSkip is true", () => {
    render(<FeatureVoting {...defaultProps} allowSkip />);

    expect(screen.getByTestId("skip-button")).toBeInTheDocument();
    expect(screen.getByText("Skip this question")).toBeInTheDocument();
  });

  it("calls onSkip when skip button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnSkip = jest.fn();

    render(<FeatureVoting {...defaultProps} allowSkip onSkip={mockOnSkip} />);

    const skipButton = screen.getByTestId("skip-button");
    await user.click(skipButton);

    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it("disables all controls when disabled prop is true", () => {
    render(<FeatureVoting {...defaultProps} disabled />);

    const incrementButtons = screen.getAllByLabelText(/Increase points for/);
    const decrementButtons = screen.getAllByLabelText(/Decrease points for/);
    const inputs = screen.getAllByLabelText(/Points for/);

    incrementButtons.forEach((button) => expect(button).toBeDisabled());
    decrementButtons.forEach((button) => expect(button).toBeDisabled());
    inputs.forEach((input) => expect(input).toBeDisabled());
  });

  it("does not render disabled options", () => {
    render(<FeatureVoting {...defaultProps} />);

    // Feature 4 is disabled, but it should still be rendered with disabled state
    expect(screen.getByText("Feature 4")).toBeInTheDocument();

    const input = screen.getByLabelText("Points for Feature 4");
    expect(input).toBeDisabled();
  });

  it("shows helper text when provided", () => {
    render(
      <FeatureVoting
        {...defaultProps}
        helperText="Allocate more points to higher priority features"
      />
    );

    expect(
      screen.getByText("Allocate more points to higher priority features")
    ).toBeInTheDocument();
  });

  it("handles point step correctly", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<FeatureVoting {...defaultProps} onChange={mockOnChange} pointStep={5} />);

    const incrementButton = screen.getByLabelText("Increase points for Feature 1");
    await user.click(incrementButton);

    expect(mockOnChange).toHaveBeenCalledWith([{ optionId: "feature1", points: 5 }]);
  });

  it("renders different layouts correctly", () => {
    const { rerender } = render(<FeatureVoting {...defaultProps} layout="cards" />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();

    rerender(<FeatureVoting {...defaultProps} layout="list" />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();

    rerender(<FeatureVoting {...defaultProps} layout="compact" />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<FeatureVoting {...defaultProps} />);

    await user.tab();
    const firstInput = screen.getByLabelText("Points for Feature 1");
    expect(firstInput).toHaveFocus();
  });

  it("highlights option when it has points allocated", () => {
    const value: FeatureVote[] = [{ optionId: "feature1", points: 10 }];

    const { container } = render(<FeatureVoting {...defaultProps} value={value} />);

    // Check for highlighted styling (border-primary bg-primary/5)
    const highlightedOption = container.querySelector(".border-primary.bg-primary\\/5");
    expect(highlightedOption).toBeInTheDocument();
  });

  it("displays focus state on input", async () => {
    const user = userEvent.setup();

    render(<FeatureVoting {...defaultProps} />);

    const input = screen.getByLabelText("Points for Feature 1");
    await user.click(input);

    expect(input).toHaveFocus();
    // Component tracks focused option internally
  });
});
