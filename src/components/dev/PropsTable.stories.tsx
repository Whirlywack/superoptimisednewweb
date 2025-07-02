import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Star, Settings } from 'lucide-react';
import { PropsTable, ComponentDocumentation, PropTypesBadge, QuickReference, PropDefinition } from './PropsTable';

const meta = {
  title: 'Developer Experience/PropsTable',
  component: PropsTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Documentation components for displaying component props, types, and usage examples. Perfect for design system documentation and Storybook.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    props: {
      control: 'object',
      description: 'Array of prop definitions to display',
    },
    title: {
      control: 'text',
      description: 'Title for the props table',
    },
  },
} satisfies Meta<typeof PropsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleButtonProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to display inside the button',
  },
  {
    name: 'variant',
    type: '"primary" | "secondary" | "outline" | "ghost"',
    required: false,
    defaultValue: '"primary"',
    description: 'Visual style variant of the button',
    options: ['primary', 'secondary', 'outline', 'ghost'],
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    required: false,
    defaultValue: '"md"',
    description: 'Size of the button affecting padding and font size',
    options: ['sm', 'md', 'lg'],
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Whether the button is disabled and non-interactive',
  },
  {
    name: 'loading',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Shows loading spinner and disables interaction',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    required: false,
    description: 'Icon to display before the button text',
  },
  {
    name: 'onClick',
    type: '(event: MouseEvent) => void',
    required: false,
    description: 'Function called when button is clicked',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes to apply to the button',
  },
];

export const BasicPropsTable: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Props Documentation Table</h2>
          <p className="text-warm-gray">
            Displays component props with types, requirements, defaults, and descriptions.
          </p>
        </div>

        <PropsTable 
          props={sampleButtonProps}
          title="Button Component Props"
        />
      </div>
    </div>
  ),
};

export const FullComponentDocumentation: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <ComponentDocumentation
          componentName="Button"
          description="A versatile button component with multiple variants, sizes, and states. Supports icons, loading states, and follows accessibility best practices."
          props={sampleButtonProps}
          examples={[
            {
              title: "Basic Usage",
              description: "Simple button with text content",
              code: `<Button>Click me</Button>`,
              component: (
                <button className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Click me
                </button>
              ),
            },
            {
              title: "With Variants",
              description: "Different visual styles for various contexts",
              code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`,
              component: (
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Primary
                  </button>
                  <button className="px-4 py-2 bg-warm-gray text-off-white rounded-lg hover:bg-off-black focus:outline-none focus:ring-2 focus:ring-warm-gray focus:ring-offset-2">
                    Secondary
                  </button>
                  <button className="px-4 py-2 border border-primary text-primary bg-white rounded-lg hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Outline
                  </button>
                  <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Ghost
                  </button>
                </div>
              ),
            },
            {
              title: "With Icons",
              description: "Buttons with leading icons for better visual hierarchy",
              code: `<Button icon={<Heart className="h-4 w-4" />}>
  Favorite
</Button>
<Button icon={<Star className="h-4 w-4" />}>
  Star
</Button>`,
              component: (
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Heart className="h-4 w-4" />
                    Favorite
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-off-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
                    <Star className="h-4 w-4" />
                    Star
                  </button>
                </div>
              ),
            },
            {
              title: "Different Sizes",
              description: "Small, medium, and large sizes for different contexts",
              code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
              component: (
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 text-small bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Small
                  </button>
                  <button className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Medium
                  </button>
                  <button className="px-6 py-3 text-lg bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Large
                  </button>
                </div>
              ),
            },
            {
              title: "States",
              description: "Disabled and loading states",
              code: `<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>`,
              component: (
                <div className="flex gap-3">
                  <button 
                    disabled
                    className="px-4 py-2 bg-primary text-off-white rounded-lg opacity-50 cursor-not-allowed"
                  >
                    Disabled
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const PropTypesBadges: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Prop Types Badges</h2>
          <p className="text-warm-gray">
            Color-coded badges for different TypeScript prop types.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-h4 font-semibold text-off-black mb-4">Common Prop Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-light-gray">
                <h4 className="font-semibold text-off-black mb-3">Primitive Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="string" />
                    <span className="text-warm-gray">Text values</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="number" />
                    <span className="text-warm-gray">Numeric values</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="boolean" />
                    <span className="text-warm-gray">True/false values</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-light-gray">
                <h4 className="font-semibold text-off-black mb-3">React Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="React.ReactNode" />
                    <span className="text-warm-gray">Any renderable content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="React.ComponentProps<'button'>" />
                    <span className="text-warm-gray">HTML element props</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-light-gray">
                <h4 className="font-semibold text-off-black mb-3">Function Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="() => void" />
                    <span className="text-warm-gray">Simple callback</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type="(value: string) => void" />
                    <span className="text-warm-gray">Callback with parameter</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-light-gray">
                <h4 className="font-semibold text-off-black mb-3">Union Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type='"sm" | "md" | "lg"' />
                    <span className="text-warm-gray">Size options</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PropTypesBadge type='string | number' />
                    <span className="text-warm-gray">Multiple types</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const QuickReferenceGuide: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Component Quick Reference</h2>
          <p className="text-warm-gray">
            Overview of multiple components with their key props and import paths.
          </p>
        </div>

        <QuickReference
          components={[
            {
              name: 'Button',
              description: 'Interactive button component with multiple variants and states',
              importPath: "import { Button } from '@/components/ui/Button';",
              keyProps: ['children', 'variant', 'size', 'disabled', 'onClick'],
            },
            {
              name: 'Input',
              description: 'Form input field with validation and error states',
              importPath: "import { Input } from '@/components/ui/Input';",
              keyProps: ['value', 'onChange', 'placeholder', 'error', 'required'],
            },
            {
              name: 'Modal',
              description: 'Overlay dialog component with focus management',
              importPath: "import { Modal } from '@/components/molecules/Modal';",
              keyProps: ['isOpen', 'onClose', 'title', 'children'],
            },
            {
              name: 'Dropdown',
              description: 'Accessible dropdown menu with keyboard navigation',
              importPath: "import { Dropdown } from '@/components/molecules/Dropdown';",
              keyProps: ['trigger', 'items', 'onSelect', 'placement'],
            },
            {
              name: 'Toast',
              description: 'Notification component for user feedback',
              importPath: "import { Toast } from '@/components/molecules/Toast';",
              keyProps: ['message', 'type', 'duration', 'onDismiss'],
            },
            {
              name: 'Card',
              description: 'Container component for grouping related content',
              importPath: "import { Card } from '@/components/molecules/Card';",
              keyProps: ['children', 'variant', 'padding', 'shadow'],
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const ComplexPropsExample: Story = {
  render: () => {
    const complexFormProps: PropDefinition[] = [
      {
        name: 'fields',
        type: 'Array<FormField>',
        required: true,
        description: 'Array of form field configurations including validation rules',
      },
      {
        name: 'initialValues',
        type: 'Record<string, any>',
        required: false,
        defaultValue: '{}',
        description: 'Initial values for form fields',
      },
      {
        name: 'validationSchema',
        type: 'ZodSchema | YupSchema',
        required: false,
        description: 'Schema for form validation using Zod or Yup',
      },
      {
        name: 'onSubmit',
        type: '(values: FormData, helpers: FormHelpers) => Promise<void> | void',
        required: true,
        description: 'Function called when form is submitted with valid data',
      },
      {
        name: 'onFieldChange',
        type: '(fieldName: string, value: any, allValues: FormData) => void',
        required: false,
        description: 'Callback fired when any field value changes',
      },
      {
        name: 'layout',
        type: '"vertical" | "horizontal" | "grid" | "inline"',
        required: false,
        defaultValue: '"vertical"',
        description: 'Layout strategy for arranging form fields',
        options: ['vertical', 'horizontal', 'grid', 'inline'],
      },
      {
        name: 'submitButton',
        type: 'ButtonProps | React.ReactNode | false',
        required: false,
        defaultValue: 'true',
        description: 'Custom submit button configuration or element, false to hide',
      },
      {
        name: 'resetButton',
        type: 'ButtonProps | React.ReactNode | false',
        required: false,
        defaultValue: 'false',
        description: 'Custom reset button configuration or element',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Shows loading state and disables form interactions',
      },
      {
        name: 'errorSummary',
        type: 'boolean | "top" | "bottom"',
        required: false,
        defaultValue: 'false',
        description: 'Display validation errors summary at top or bottom of form',
      },
      {
        name: 'autoSave',
        type: 'boolean | { debounceMs: number; exclude: string[] }',
        required: false,
        defaultValue: 'false',
        description: 'Automatically save form data with optional debouncing and field exclusions',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes to apply to the form container',
      },
    ];

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Complex Component Props</h2>
            <p className="text-warm-gray">
              Example of documenting a complex form component with many prop types.
            </p>
          </div>

          <PropsTable 
            props={complexFormProps}
            title="FormBuilder Component Props"
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-h4 font-semibold text-yellow-800 mb-2">Complex Types Reference</h3>
            <div className="space-y-2 text-small">
              <div>
                <code className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">FormField</code>
                <span className="text-yellow-700 ml-2">
                  Interface with name, type, label, validation, etc.
                </span>
              </div>
              <div>
                <code className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">FormHelpers</code>
                <span className="text-yellow-700 ml-2">
                  Utilities like setFieldError, setSubmitting, resetForm
                </span>
              </div>
              <div>
                <code className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">ButtonProps</code>
                <span className="text-yellow-700 ml-2">
                  Standard button component props (variant, size, etc.)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};