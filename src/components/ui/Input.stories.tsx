import type { Meta, StoryObj } from "@storybook/react";
import { TextField, Checkbox, Radio, RadioGroup } from "./Input";

const meta: Meta = {
  title: "Design System/Input",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Input components for forms including text fields, checkboxes, and radio buttons. All components include accessibility features and error handling.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
  },
};

export default meta;

type TextFieldStory = StoryObj<typeof TextField>;
type CheckboxStory = StoryObj<typeof Checkbox>;
type RadioStory = StoryObj<typeof Radio>;

// TextField Stories
export const TextFieldDefault: TextFieldStory = {
  render: (args) => <TextField {...args} />,
  args: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
};

export const TextFieldWithHelper: TextFieldStory = {
  render: (args) => <TextField {...args} />,
  args: {
    label: "Username",
    placeholder: "Choose a username",
    helperText: "Must be at least 3 characters long",
  },
};

export const TextFieldWithError: TextFieldStory = {
  render: (args) => <TextField {...args} />,
  args: {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    error: "Password must be at least 8 characters",
  },
};

export const TextFieldRequired: TextFieldStory = {
  render: (args) => <TextField {...args} />,
  args: {
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
  },
};

export const TextFieldDisabled: TextFieldStory = {
  render: (args) => <TextField {...args} />,
  args: {
    label: "Disabled Field",
    placeholder: "This field is disabled",
    disabled: true,
    value: "Cannot edit this",
  },
};

export const TextFieldFilled: TextFieldStory = {
  render: (args) => <TextField {...args} />,
  args: {
    label: "Search Query",
    placeholder: "Search...",
    variant: "filled",
  },
};

export const TextFieldSizes: TextFieldStory = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <TextField
        size="sm"
        label="Small Input"
        placeholder="Small size"
      />
      <TextField
        size="md"
        label="Medium Input"
        placeholder="Medium size (default)"
      />
      <TextField
        size="lg"
        label="Large Input"
        placeholder="Large size"
      />
    </div>
  ),
};

// Checkbox Stories
export const CheckboxDefault: CheckboxStory = {
  render: (args) => <Checkbox {...args} />,
  args: {
    label: "I agree to the terms and conditions",
  },
};

export const CheckboxRequired: CheckboxStory = {
  render: (args) => <Checkbox {...args} />,
  args: {
    label: "Subscribe to newsletter",
    required: true,
  },
};

export const CheckboxWithError: CheckboxStory = {
  render: (args) => <Checkbox {...args} />,
  args: {
    label: "Accept privacy policy",
    error: "You must accept the privacy policy to continue",
  },
};

export const CheckboxDisabled: CheckboxStory = {
  render: (args) => <Checkbox {...args} />,
  args: {
    label: "This option is disabled",
    disabled: true,
  },
};

export const CheckboxChecked: CheckboxStory = {
  render: (args) => <Checkbox {...args} />,
  args: {
    label: "Pre-selected option",
    defaultChecked: true,
  },
};

export const CheckboxSizes: CheckboxStory = {
  render: () => (
    <div className="space-y-4">
      <Checkbox
        size="sm"
        label="Small checkbox"
      />
      <Checkbox
        size="md"
        label="Medium checkbox (default)"
      />
      <Checkbox
        size="lg"
        label="Large checkbox"
      />
    </div>
  ),
};

// Radio Stories
export const RadioDefault: RadioStory = {
  render: (args) => <Radio {...args} />,
  args: {
    label: "Option A",
    name: "example",
    value: "a",
  },
};

export const RadioButtons: RadioStory = {
  render: () => (
    <div className="space-y-3">
      <Radio
        label="Option 1"
        name="radio-group"
        value="1"
      />
      <Radio
        label="Option 2"
        name="radio-group"
        value="2"
        defaultChecked
      />
      <Radio
        label="Option 3"
        name="radio-group"
        value="3"
      />
    </div>
  ),
};

export const RadioGroupComponent = {
  render: () => (
    <div className="max-w-md space-y-6">
      <RadioGroup label="Choose your preferred contact method">
        <Radio
          label="Email"
          name="contact-method"
          value="email"
          defaultChecked
        />
        <Radio
          label="Phone"
          name="contact-method"
          value="phone"
        />
        <Radio
          label="Mail"
          name="contact-method"
          value="mail"
        />
      </RadioGroup>
      
      <RadioGroup 
        label="Select your experience level"
        error="Please select your experience level"
      >
        <Radio
          label="Beginner"
          name="experience"
          value="beginner"
        />
        <Radio
          label="Intermediate"
          name="experience"
          value="intermediate"
        />
        <Radio
          label="Advanced"
          name="experience"
          value="advanced"
        />
      </RadioGroup>
    </div>
  ),
};

export const RadioSizes: RadioStory = {
  render: () => (
    <div className="space-y-4">
      <Radio
        size="sm"
        label="Small radio"
        name="size-demo"
        value="sm"
      />
      <Radio
        size="md"
        label="Medium radio (default)"
        name="size-demo"
        value="md"
      />
      <Radio
        size="lg"
        label="Large radio"
        name="size-demo"
        value="lg"
      />
    </div>
  ),
};

// Complete Form Example
export const CompleteForm = {
  render: () => (
    <form className="max-w-md space-y-6">
      <div>
        <h2 className="text-h2 mb-6">Contact Form</h2>
      </div>
      
      <TextField
        label="Full Name"
        placeholder="Enter your full name"
        required
      />
      
      <TextField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required
      />
      
      <TextField
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        helperText="Optional - for urgent matters only"
      />
      
      <TextField
        label="Message"
        placeholder="Tell us how we can help..."
        required
        // Note: This would typically be a textarea
      />
      
      <RadioGroup label="How did you hear about us?">
        <Radio
          label="Search engine"
          name="source"
          value="search"
        />
        <Radio
          label="Social media"
          name="source"
          value="social"
        />
        <Radio
          label="Word of mouth"
          name="source"
          value="referral"
        />
        <Radio
          label="Other"
          name="source"
          value="other"
        />
      </RadioGroup>
      
      <div className="space-y-3">
        <Checkbox
          label="I agree to the terms and conditions"
          required
        />
        <Checkbox
          label="Subscribe to our newsletter for updates"
        />
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground h-11 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Submit Form
        </button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete form example showing all input components working together with proper spacing and layout.",
      },
    },
  },
};