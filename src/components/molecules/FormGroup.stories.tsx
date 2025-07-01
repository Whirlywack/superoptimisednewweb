import type { Meta, StoryObj } from "@storybook/react";
import { FormGroup, TextFieldGroup, CheckboxGroup, RadioButtonGroup } from "./FormGroup";
import { TextField, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

const meta: Meta = {
  title: "Design System/Molecules/FormGroup",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "FormGroup molecules that combine labels, inputs, and error/helper text for consistent form layouts. Includes specialized variants for common input types.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
    },
    error: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    required: {
      control: "boolean",
    },
  },
};

export default meta;

type FormGroupStory = StoryObj<typeof FormGroup>;
type TextFieldGroupStory = StoryObj<typeof TextFieldGroup>;
type CheckboxGroupStory = StoryObj<typeof CheckboxGroup>;
type RadioButtonGroupStory = StoryObj<typeof RadioButtonGroup>;

// Basic FormGroup Stories
export const FormGroupDefault: FormGroupStory = {
  render: (args) => (
    <FormGroup {...args}>
      <TextField placeholder="Enter your email" />
    </FormGroup>
  ),
  args: {
    label: "Email Address",
    helperText: "We'll never share your email with anyone else.",
  },
};

export const FormGroupWithError: FormGroupStory = {
  render: (args) => (
    <FormGroup {...args}>
      <TextField placeholder="Enter your password" type="password" />
    </FormGroup>
  ),
  args: {
    label: "Password",
    error: "Password must be at least 8 characters long",
    required: true,
  },
};

export const FormGroupRequired: FormGroupStory = {
  render: (args) => (
    <FormGroup {...args}>
      <TextField placeholder="Enter your full name" />
    </FormGroup>
  ),
  args: {
    label: "Full Name",
    required: true,
  },
};

// TextFieldGroup Stories
export const TextFieldGroupDefault: TextFieldGroupStory = {
  render: (args) => <TextFieldGroup {...args} />,
  args: {
    label: "Username",
    placeholder: "Enter your username",
    helperText: "Choose a unique username that others will see",
  },
};

export const TextFieldGroupWithError: TextFieldGroupStory = {
  render: (args) => <TextFieldGroup {...args} />,
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    error: "Please enter a valid email address",
    required: true,
  },
};

export const TextFieldGroupSizes: TextFieldGroupStory = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <TextFieldGroup
        size="sm"
        label="Small Input"
        placeholder="Small size input"
      />
      <TextFieldGroup
        size="md"
        label="Medium Input"
        placeholder="Medium size input (default)"
      />
      <TextFieldGroup
        size="lg"
        label="Large Input"
        placeholder="Large size input"
      />
    </div>
  ),
};

// CheckboxGroup Stories
export const CheckboxGroupDefault: CheckboxGroupStory = {
  render: (args) => <CheckboxGroup {...args} />,
  args: {
    label: "I agree to the terms and conditions",
    helperText: "You must agree to continue",
  },
};

export const CheckboxGroupWithError: CheckboxGroupStory = {
  render: (args) => <CheckboxGroup {...args} />,
  args: {
    label: "Subscribe to newsletter",
    error: "Please check this box to subscribe",
    required: true,
  },
};

export const CheckboxGroupList: CheckboxGroupStory = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <h3 className="text-h3 mb-4">Notification Preferences</h3>
      </div>
      <CheckboxGroup
        label="Email notifications"
        helperText="Receive updates via email"
        defaultChecked
      />
      <CheckboxGroup
        label="SMS notifications"
        helperText="Receive urgent updates via text"
      />
      <CheckboxGroup
        label="Push notifications"
        helperText="Receive notifications in your browser"
        defaultChecked
      />
      <CheckboxGroup
        label="Marketing emails"
        helperText="Receive promotional content and offers"
      />
    </div>
  ),
};

// RadioButtonGroup Stories
export const RadioButtonGroupDefault: RadioButtonGroupStory = {
  render: (args) => <RadioButtonGroup {...args} />,
  args: {
    label: "Choose your preferred contact method",
    name: "contact-method",
    options: [
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Text message", value: "sms" },
    ],
    helperText: "We'll use this method for important updates",
  },
};

export const RadioButtonGroupWithError: RadioButtonGroupStory = {
  render: (args) => <RadioButtonGroup {...args} />,
  args: {
    label: "Select your experience level",
    name: "experience",
    options: [
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
    ],
    error: "Please select your experience level to continue",
    required: true,
  },
};

export const RadioButtonGroupWithDisabled: RadioButtonGroupStory = {
  render: (args) => <RadioButtonGroup {...args} />,
  args: {
    label: "Choose your plan",
    name: "plan",
    options: [
      { label: "Free Plan", value: "free" },
      { label: "Pro Plan", value: "pro" },
      { label: "Enterprise Plan (Coming Soon)", value: "enterprise", disabled: true },
    ],
    defaultValue: "free",
  },
};

// Complete Form Example
export const CompleteContactForm = {
  render: () => (
    <form className="max-w-lg space-y-6">
      <div>
        <h2 className="text-h2 mb-6">Contact Us</h2>
      </div>
      
      <TextFieldGroup
        label="Full Name"
        placeholder="Enter your full name"
        required
      />
      
      <TextFieldGroup
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        helperText="We'll respond within 24 hours"
        required
      />
      
      <TextFieldGroup
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        helperText="Optional - for urgent matters only"
      />
      
      <RadioButtonGroup
        label="How can we help you?"
        name="inquiry-type"
        options={[
          { label: "General Question", value: "general" },
          { label: "Technical Support", value: "support" },
          { label: "Sales Inquiry", value: "sales" },
          { label: "Partnership", value: "partnership" },
        ]}
        required
      />
      
      <TextFieldGroup
        label="Message"
        placeholder="Tell us how we can help..."
        helperText="Please provide as much detail as possible"
        required
      />
      
      <div className="space-y-3">
        <CheckboxGroup
          label="I agree to the terms and conditions"
          required
        />
        <CheckboxGroup
          label="Subscribe to our newsletter for updates"
        />
      </div>
      
      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full">
          Send Message
        </Button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete contact form example showing all FormGroup variants working together with proper spacing and validation states.",
      },
    },
  },
};

// Form States Example
export const FormStatesExample = {
  render: () => (
    <div className="max-w-md space-y-8">
      <div>
        <h3 className="text-h3 mb-4">Form Field States</h3>
      </div>
      
      <div className="space-y-6">
        <TextFieldGroup
          label="Normal State"
          placeholder="Enter some text"
          helperText="This is a normal input field"
        />
        
        <TextFieldGroup
          label="Required Field"
          placeholder="This field is required"
          required
        />
        
        <TextFieldGroup
          label="Field with Error"
          placeholder="Enter valid data"
          error="This field contains an error"
          required
        />
        
        <TextFieldGroup
          label="Disabled Field"
          placeholder="This field is disabled"
          value="Cannot edit this"
          disabled
        />
      </div>
      
      <div className="space-y-4">
        <CheckboxGroup
          label="Normal checkbox"
          helperText="This is a normal checkbox"
        />
        
        <CheckboxGroup
          label="Required checkbox"
          required
        />
        
        <CheckboxGroup
          label="Checkbox with error"
          error="This checkbox must be checked"
        />
        
        <CheckboxGroup
          label="Disabled checkbox"
          disabled
          defaultChecked
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples showing different states that form fields can have including normal, required, error, and disabled states.",
      },
    },
  },
};