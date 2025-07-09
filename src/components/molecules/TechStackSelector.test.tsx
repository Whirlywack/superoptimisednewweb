import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TechStackOption } from "./TechStackSelector";
import { TechStackSelector } from "./TechStackSelector";

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

jest.mock("@/components/ui/Input", () => ({
  Checkbox: ({
    checked,
    onChange,
    disabled,
    children,
  }: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
  }) => (
    <input
      data-testid="checkbox"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={typeof children === "string" ? children : undefined}
    />
  ),
}));

jest.mock("@/components/ui/Tag", () => ({
  Tag: ({
    children,
    onRemove,
    removable,
  }: {
    children: React.ReactNode;
    onRemove?: () => void;
    removable?: boolean;
  }) => (
    <span data-testid="tag">
      {children}
      {removable && onRemove && (
        <button data-testid="remove-tag" onClick={onRemove}>
          ×
        </button>
      )}
    </span>
  ),
}));

describe("TechStackSelector", () => {
  const mockOptions: TechStackOption[] = [
    {
      id: "react",
      label: "React",
      description: "JavaScript library for building UIs",
      category: "Frontend",
      popular: true,
    },
    {
      id: "vue",
      label: "Vue.js",
      description: "Progressive JavaScript framework",
      category: "Frontend",
    },
    {
      id: "nodejs",
      label: "Node.js",
      description: "JavaScript runtime",
      category: "Backend",
      popular: true,
    },
    {
      id: "python",
      label: "Python",
      description: "High-level programming language",
      category: "Backend",
    },
    {
      id: "postgresql",
      label: "PostgreSQL",
      description: "Advanced relational database",
      category: "Database",
    },
  ];

  const defaultProps = {
    question: "What technologies do you use?",
    options: mockOptions,
    onChange: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the question label", () => {
    render(<TechStackSelector {...defaultProps} />);

    expect(screen.getByTestId("question-label")).toBeInTheDocument();
    expect(screen.getByText("What technologies do you use?")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <TechStackSelector {...defaultProps} description="Select your preferred technologies" />
    );

    expect(screen.getByText("Select your preferred technologies")).toBeInTheDocument();
  });

  it("shows required indicator when required", () => {
    render(<TechStackSelector {...defaultProps} required />);

    expect(screen.getByTestId("required-indicator")).toBeInTheDocument();
  });

  it("renders all technology options", () => {
    render(<TechStackSelector {...defaultProps} />);

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
      expect(screen.getByText(option.description!)).toBeInTheDocument();
    });
  });

  it("handles selection changes", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<TechStackSelector {...defaultProps} onChange={mockOnChange} />);

    const checkboxes = screen.getAllByTestId("checkbox");
    await user.click(checkboxes[0]); // Click React checkbox

    expect(mockOnChange).toHaveBeenCalledWith(["react"]);
  });

  it("handles multiple selections", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<TechStackSelector {...defaultProps} onChange={mockOnChange} value={["react"]} />);

    const checkboxes = screen.getAllByTestId("checkbox");
    await user.click(checkboxes[1]); // Click Vue checkbox

    expect(mockOnChange).toHaveBeenCalledWith(["react", "vue"]);
  });

  it("handles deselection", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(
      <TechStackSelector {...defaultProps} onChange={mockOnChange} value={["react", "vue"]} />
    );

    const checkboxes = screen.getAllByTestId("checkbox");
    await user.click(checkboxes[0]); // Uncheck React

    expect(mockOnChange).toHaveBeenCalledWith(["vue"]);
  });

  it("respects maxSelections limit", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(
      <TechStackSelector
        {...defaultProps}
        onChange={mockOnChange}
        value={["react", "vue"]}
        maxSelections={2}
      />
    );

    const checkboxes = screen.getAllByTestId("checkbox");
    await user.click(checkboxes[2]); // Try to select Node.js

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("shows selected technologies as tags", () => {
    render(<TechStackSelector {...defaultProps} value={["react", "nodejs"]} />);

    expect(screen.getByText("Selected Technologies:")).toBeInTheDocument();
    // Check specifically for removable tags (selected technologies)
    const removableTags = screen.getAllByTestId("remove-tag");
    expect(removableTags).toHaveLength(2);
  });

  it("allows removing tags", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(
      <TechStackSelector {...defaultProps} onChange={mockOnChange} value={["react", "nodejs"]} />
    );

    const removeButtons = screen.getAllByTestId("remove-tag");
    await user.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(["nodejs"]);
  });

  it("groups options by category when enabled", () => {
    render(<TechStackSelector {...defaultProps} groupByCategory />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Database")).toBeInTheDocument();
  });

  it("shows search input for large option lists", () => {
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      id: `tech-${i}`,
      label: `Technology ${i}`,
      description: `Description ${i}`,
      category: "Test",
    }));

    render(<TechStackSelector {...defaultProps} options={manyOptions} />);

    expect(screen.getByPlaceholderText("Search technologies...")).toBeInTheDocument();
  });

  it("filters options based on search term", async () => {
    const user = userEvent.setup();
    const manyOptions = [
      ...mockOptions,
      { id: "angular", label: "Angular", description: "Framework", category: "Frontend" },
      { id: "django", label: "Django", description: "Python web framework", category: "Backend" },
      { id: "mysql", label: "MySQL", description: "Popular database", category: "Database" },
      { id: "mongodb", label: "MongoDB", description: "NoSQL database", category: "Database" },
      { id: "express", label: "Express", description: "Node.js framework", category: "Backend" },
    ];

    render(<TechStackSelector {...defaultProps} options={manyOptions} />);

    const searchInput = screen.getByPlaceholderText("Search technologies...");
    await user.type(searchInput, "react");

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Vue.js")).not.toBeInTheDocument();
  });

  it("shows validation error when provided", () => {
    render(<TechStackSelector {...defaultProps} error="Please select at least one technology" />);

    expect(screen.getByTestId("validation-error")).toBeInTheDocument();
    expect(screen.getByText("Please select at least one technology")).toBeInTheDocument();
  });

  it("shows selection count when enabled", () => {
    render(
      <TechStackSelector {...defaultProps} value={["react", "vue"]} showCount maxSelections={5} />
    );

    expect(screen.getByText("2/5 selections")).toBeInTheDocument();
  });

  it("shows minimum selection warning", () => {
    render(<TechStackSelector {...defaultProps} value={[]} minSelections={2} />);

    expect(screen.getByText("Please select at least 2 technologies.")).toBeInTheDocument();
  });

  it("shows maximum selection info", () => {
    render(<TechStackSelector {...defaultProps} value={["react", "vue"]} maxSelections={2} />);

    expect(screen.getByTestId("validation-info")).toBeInTheDocument();
    expect(screen.getByText("Maximum of 2 technologies can be selected.")).toBeInTheDocument();
  });

  it("renders skip control when allowSkip is true", () => {
    render(<TechStackSelector {...defaultProps} allowSkip />);

    expect(screen.getByTestId("skip-button")).toBeInTheDocument();
    expect(screen.getByText("Skip this question")).toBeInTheDocument();
  });

  it("calls onSkip when skip button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnSkip = jest.fn();

    render(<TechStackSelector {...defaultProps} allowSkip onSkip={mockOnSkip} />);

    const skipButton = screen.getByTestId("skip-button");
    await user.click(skipButton);

    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it("disables all inputs when disabled prop is true", () => {
    render(<TechStackSelector {...defaultProps} disabled />);

    const checkboxes = screen.getAllByTestId("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it("handles disabled individual options", () => {
    const optionsWithDisabled = [
      ...mockOptions,
      { id: "disabled-tech", label: "Disabled Tech", description: "Not available", disabled: true },
    ];

    render(<TechStackSelector {...defaultProps} options={optionsWithDisabled} />);

    const checkboxes = screen.getAllByTestId("checkbox");
    expect(checkboxes[checkboxes.length - 1]).toBeDisabled();
  });

  it("shows helper text when provided", () => {
    render(
      <TechStackSelector
        {...defaultProps}
        helperText="Choose technologies you're comfortable with"
      />
    );

    expect(screen.getByText("Choose technologies you're comfortable with")).toBeInTheDocument();
  });

  it("hides helper text when error is present", () => {
    render(<TechStackSelector {...defaultProps} helperText="Helper text" error="Error message" />);

    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("handles different layout variants", () => {
    const { rerender } = render(<TechStackSelector {...defaultProps} layout="grid" />);

    // Test that the component renders without error for each layout
    rerender(<TechStackSelector {...defaultProps} layout="list" />);
    rerender(<TechStackSelector {...defaultProps} layout="compact" />);

    // Each layout should render all options
    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('shows "no results" message when search returns empty', async () => {
    const user = userEvent.setup();
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      id: `tech-${i}`,
      label: `Technology ${i}`,
      description: `Description ${i}`,
      category: "Test",
    }));

    render(<TechStackSelector {...defaultProps} options={manyOptions} />);

    const searchInput = screen.getByPlaceholderText("Search technologies...");
    await user.type(searchInput, "nonexistent");

    expect(screen.getByText('No technologies found matching "nonexistent"')).toBeInTheDocument();
    expect(screen.getByText("Clear search")).toBeInTheDocument();
  });

  it("clears search when clear button is clicked", async () => {
    const user = userEvent.setup();
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      id: `tech-${i}`,
      label: `Technology ${i}`,
      description: `Description ${i}`,
      category: "Test",
    }));

    render(<TechStackSelector {...defaultProps} options={manyOptions} />);

    const searchInput = screen.getByPlaceholderText("Search technologies...");
    await user.type(searchInput, "nonexistent");

    const clearButton = screen.getByText("Clear search");
    await user.click(clearButton);

    expect(searchInput).toHaveValue("");
  });

  it("shows popular badge for popular technologies", () => {
    render(<TechStackSelector {...defaultProps} />);

    // React and Node.js are marked as popular in mockOptions
    expect(screen.getAllByText("Popular")).toHaveLength(2);
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<TechStackSelector {...defaultProps} />);

    // Tab through the component
    await user.tab();

    // First checkbox should receive focus (assuming it's the first focusable element)
    const firstCheckbox = screen.getAllByTestId("checkbox")[0];
    expect(firstCheckbox).toHaveFocus();
  });

  it("preserves selection state correctly", () => {
    const { rerender } = render(<TechStackSelector {...defaultProps} value={["react"]} />);

    // Check that React is selected
    const checkboxes = screen.getAllByTestId("checkbox");
    expect(checkboxes[0]).toBeChecked();

    // Update selection
    rerender(<TechStackSelector {...defaultProps} value={["react", "vue"]} />);

    // Both should be selected
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });
});
