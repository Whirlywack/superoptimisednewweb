import type { Meta, StoryObj } from '@storybook/react';
import { ValidationMessage, ValidationSummary, FieldValidation, useValidation } from './ValidationMessage';
import { useState } from 'react';

const meta: Meta<typeof ValidationMessage> = {
  title: 'UI/ValidationMessage',
  component: ValidationMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['error', 'warning', 'success', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'bordered', 'inline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    message: 'This field is required',
    type: 'error',
  },
};

export const Warning: Story = {
  args: {
    message: 'This action cannot be undone',
    type: 'warning',
  },
};

export const Success: Story = {
  args: {
    message: 'Your response has been saved successfully',
    type: 'success',
  },
};

export const Info: Story = {
  args: {
    message: 'This information will be kept confidential',
    type: 'info',
  },
};

export const Subtle: Story = {
  args: {
    message: 'Please check your input',
    type: 'error',
    variant: 'subtle',
  },
};

export const Bordered: Story = {
  args: {
    message: 'Important: This action requires confirmation',
    type: 'warning',
    variant: 'bordered',
  },
};

export const Inline: Story = {
  args: {
    message: 'Invalid email format',
    type: 'error',
    variant: 'inline',
  },
};

export const Dismissible: Story = {
  args: {
    message: 'This message can be dismissed',
    type: 'info',
    dismissible: true,
    onDismiss: () => console.log('Message dismissed'),
  },
};

export const LargeSize: Story = {
  args: {
    message: 'This is a large validation message with more prominent styling',
    type: 'success',
    size: 'lg',
  },
};

export const SmallSize: Story = {
  args: {
    message: 'Small validation message',
    type: 'error',
    size: 'sm',
  },
};

export const WithoutIcon: Story = {
  args: {
    message: 'This message has no icon',
    type: 'info',
    showIcon: false,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-3">
      <ValidationMessage message="This is an error message" type="error" />
      <ValidationMessage message="This is a warning message" type="warning" />
      <ValidationMessage message="This is a success message" type="success" />
      <ValidationMessage message="This is an info message" type="info" />
    </div>
  ),
};

// ValidationSummary Stories
export const ValidationSummaryStory: Story = {
  render: () => (
    <ValidationSummary
      errors={[
        'Email field is required',
        'Password must be at least 8 characters',
        'Please accept the terms and conditions',
      ]}
      warnings={[
        'Username should be unique',
        'Consider using a stronger password',
      ]}
    />
  ),
};

export const LongErrorList: Story = {
  render: () => (
    <ValidationSummary
      errors={[
        'Email field is required',
        'Password must be at least 8 characters',
        'Password must contain at least one uppercase letter',
        'Password must contain at least one number',
        'Password must contain at least one special character',
        'Please accept the terms and conditions',
        'First name is required',
        'Last name is required',
        'Phone number format is invalid',
        'Date of birth is required',
      ]}
      maxVisible={3}
      collapsible={true}
    />
  ),
};

export const EmptyValidation: Story = {
  render: () => (
    <ValidationSummary
      errors={[]}
      warnings={[]}
    />
  ),
};

// FieldValidation Stories
export const FieldValidationStory: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input type="email" className="w-full p-2 border rounded" />
        <FieldValidation
          errors={['Email is required', 'Invalid email format']}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input type="text" className="w-full p-2 border rounded" />
        <FieldValidation
          warnings={['Username should be unique']}
          showCount={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input type="password" className="w-full p-2 border rounded" />
        <FieldValidation
          success="Password strength: Strong"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <input type="password" className="w-full p-2 border rounded" />
        <FieldValidation
          info="Must match the password above"
        />
      </div>
    </div>
  ),
};

// useValidation Hook Stories
export const ValidationHookStory: Story = {
  render: () => {
    const validation = useValidation();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
    });

    const validateForm = () => {
      validation.clearAll();

      // Email validation
      if (!formData.email) {
        validation.addError('email', 'Email is required');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        validation.addError('email', 'Invalid email format');
      }

      // Password validation
      if (!formData.password) {
        validation.addError('password', 'Password is required');
      } else if (formData.password.length < 8) {
        validation.addError('password', 'Password must be at least 8 characters');
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        validation.addWarning('password', 'Consider adding an uppercase letter');
      }

      // Confirm password validation
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        validation.addError('confirmPassword', 'Passwords do not match');
      }
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      validation.clearField(field);
    };

    return (
      <div className="max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Form Validation Example</h3>
        
        {validation.hasErrors() && (
          <ValidationSummary
            errors={validation.getAllErrors()}
            warnings={validation.getAllWarnings()}
          />
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <FieldValidation
            errors={validation.getFieldErrors('email')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <FieldValidation
            errors={validation.getFieldErrors('password')}
            warnings={validation.getFieldWarnings('password')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <FieldValidation
            errors={validation.getFieldErrors('confirmPassword')}
          />
        </div>

        <button
          type="button"
          onClick={validateForm}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Validate Form
        </button>

        <div className="text-xs text-muted-foreground">
          <p>Form has errors: {validation.hasErrors() ? 'Yes' : 'No'}</p>
          <p>Form has warnings: {validation.hasWarnings() ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  },
};

export const DeveloperFormValidation: Story = {
  render: () => {
    const validation = useValidation();
    const [formData, setFormData] = useState({
      experience: '',
      githubUrl: '',
      technologies: '',
    });

    const validateDeveloperForm = () => {
      validation.clearAll();

      // Experience validation
      if (!formData.experience) {
        validation.addError('experience', 'Years of experience is required');
      } else if (parseInt(formData.experience) < 0) {
        validation.addError('experience', 'Experience cannot be negative');
      } else if (parseInt(formData.experience) > 50) {
        validation.addWarning('experience', 'That\'s impressive experience!');
      }

      // GitHub URL validation
      if (formData.githubUrl && !formData.githubUrl.includes('github.com')) {
        validation.addError('githubUrl', 'Please provide a valid GitHub URL');
      }

      // Technologies validation
      if (!formData.technologies) {
        validation.addWarning('technologies', 'Consider listing your preferred technologies');
      }
    };

    return (
      <div className="max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Developer Profile Validation</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Years of Experience</label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="5"
          />
          <FieldValidation
            errors={validation.getFieldErrors('experience')}
            warnings={validation.getFieldWarnings('experience')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub Profile (Optional)</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="https://github.com/username"
          />
          <FieldValidation
            errors={validation.getFieldErrors('githubUrl')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Technologies</label>
          <textarea
            value={formData.technologies}
            onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="React, TypeScript, Node.js..."
            rows={3}
          />
          <FieldValidation
            warnings={validation.getFieldWarnings('technologies')}
            info="List the technologies you work with most frequently"
          />
        </div>

        <button
          type="button"
          onClick={validateDeveloperForm}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Validate Profile
        </button>
      </div>
    );
  },
};