import type { Meta, StoryObj } from '@storybook/react';
import { 
  TypographyScale, 
  FontSpecimen, 
  TypographyShowcase, 
  ReadingExample, 
  TypographyGuidelines,
  TypographySpecification 
} from './TypographyScale';

const meta = {
  title: 'Developer Experience/TypographyScale',
  component: TypographyScale,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Typography documentation components showing font scales, specimens, and usage guidelines. Essential for design system documentation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    typography: {
      control: 'object',
      description: 'Array of typography specifications to display',
    },
    showSpecs: {
      control: 'boolean',
      description: 'Whether to show detailed specifications for each type style',
    },
    showExamples: {
      control: 'boolean',
      description: 'Whether to show example text or just the style name',
    },
  },
} satisfies Meta<typeof TypographyScale>;

export default meta;
type Story = StoryObj<typeof meta>;

const typographySystem: TypographySpecification[] = [
  {
    name: 'Display Large',
    fontSize: '3rem',
    fontWeight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    marginBottom: '2rem',
    className: 'text-5xl font-bold leading-tight tracking-tight text-off-black',
    description: 'Large display text for hero sections and major headings',
    usage: ['Hero headings', 'Landing page titles', 'Marketing headers'],
    example: 'Building in Public with Radical Transparency',
  },
  {
    name: 'Heading 1',
    fontSize: '2.25rem',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '2rem',
    className: 'text-h1 font-bold text-off-black',
    description: 'Primary page headings and article titles',
    usage: ['Page titles', 'Article headlines', 'Section headers'],
    example: 'Understanding Modern Web Development',
  },
  {
    name: 'Heading 2',
    fontSize: '1.875rem',
    fontWeight: '600',
    lineHeight: '1.3',
    marginBottom: '1.5rem',
    className: 'text-h2 font-semibold text-off-black',
    description: 'Secondary headings and major subsections',
    usage: ['Major subsections', 'Chapter headings', 'Feature titles'],
    example: 'Component Architecture Patterns',
  },
  {
    name: 'Heading 3',
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '1.4',
    marginBottom: '1.25rem',
    className: 'text-h3 font-semibold text-off-black',
    description: 'Subsection headings and component titles',
    usage: ['Subsection titles', 'Component names', 'Feature descriptions'],
    example: 'State Management with Context',
  },
  {
    name: 'Heading 4',
    fontSize: '1.25rem',
    fontWeight: '500',
    lineHeight: '1.4',
    marginBottom: '1rem',
    className: 'text-h4 font-medium text-off-black',
    description: 'Minor headings and property names',
    usage: ['Property names', 'Minor sections', 'List headers'],
    example: 'Implementation Details',
  },
  {
    name: 'Body Text',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6',
    marginBottom: '1rem',
    className: 'text-body text-off-black',
    description: 'Primary body text optimized for reading',
    usage: ['Paragraphs', 'Article content', 'Descriptions'],
    example: 'This is the primary body text used throughout the application. It\'s optimized for sustained reading with a comfortable line height and high contrast.',
  },
  {
    name: 'Small Text',
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.5',
    marginBottom: '0.75rem',
    className: 'text-small text-warm-gray',
    description: 'Supporting text and metadata',
    usage: ['Captions', 'Metadata', 'Helper text', 'Timestamps'],
    example: 'Posted 3 hours ago • 5 min read • Technology',
  },
  {
    name: 'Code Text',
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.4',
    className: 'text-code font-mono bg-light-gray px-2 py-1 rounded',
    description: 'Inline code and technical references',
    usage: ['Inline code', 'API endpoints', 'File names', 'Terminal commands'],
    example: 'npm install @superoptimised/components',
  },
];

const interWeights = [
  { weight: '400', name: 'Regular', className: 'font-normal' },
  { weight: '500', name: 'Medium', className: 'font-medium' },
  { weight: '600', name: 'Semibold', className: 'font-semibold' },
  { weight: '700', name: 'Bold', className: 'font-bold' },
];

const jetbrainsWeights = [
  { weight: '400', name: 'Regular', className: 'font-normal' },
  { weight: '500', name: 'Medium', className: 'font-medium' },
  { weight: '600', name: 'Semibold', className: 'font-semibold' },
  { weight: '700', name: 'Bold', className: 'font-bold' },
];

export const BasicTypographyScale: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Typography Scale</h2>
          <p className="text-warm-gray">
            Complete typography system with specifications, usage guidelines, and copy functionality.
          </p>
        </div>

        <TypographyScale 
          typography={typographySystem}
          showSpecs={true}
          showExamples={true}
        />
      </div>
    </div>
  ),
};

export const FontSpecimens: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Font Specimens</h2>
          <p className="text-warm-gray">
            Detailed specimens of our primary and monospace font families.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <FontSpecimen
            fontFamily="Inter, system-ui, sans-serif"
            fontName="Inter"
            description="Our primary font family, chosen for exceptional readability in both digital and print contexts. Features comprehensive language support and optical sizing."
            weights={interWeights}
            example="Building transparent software with authentic communication"
          />

          <FontSpecimen
            fontFamily="'JetBrains Mono', 'Monaco', 'Consolas', monospace"
            fontName="JetBrains Mono"
            description="Monospace font specifically designed for developers. Features enhanced readability for code, distinctive character shapes, and programming ligatures."
            weights={jetbrainsWeights}
            example="const message = 'Hello, world!';"
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-h3 font-semibold text-off-black">Font Features</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <h4 className="font-semibold text-off-black mb-3">Inter Features</h4>
              <ul className="space-y-2 text-warm-gray">
                <li>• Optimized for user interfaces</li>
                <li>• High readability at small sizes</li>
                <li>• Comprehensive character set</li>
                <li>• OpenType features support</li>
                <li>• Multiple weights and styles</li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <h4 className="font-semibold text-off-black mb-3">JetBrains Mono Features</h4>
              <ul className="space-y-2 text-warm-gray">
                <li>• Programming ligatures</li>
                <li>• Clear distinction between similar characters</li>
                <li>• Optimized for long coding sessions</li>
                <li>• Consistent character width</li>
                <li>• Enhanced @ # & symbols</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ReadingExperience: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Reading Experience</h2>
          <p className="text-warm-gray">
            Example article demonstrating our typography in a real reading context.
          </p>
        </div>

        <ReadingExample
          title="The Future of Component-Driven Development"
          content={`In the rapidly evolving landscape of web development, component-driven architecture has emerged as a fundamental paradigm that reshapes how we think about building user interfaces. This approach represents more than just a technical methodology—it embodies a philosophy of modularity, reusability, and maintainability that addresses the complex challenges of modern software development.

The concept of component-driven development centers around breaking down user interfaces into discrete, self-contained units of functionality. Each component encapsulates its own logic, styling, and behavior, creating a system where individual pieces can be developed, tested, and maintained independently while still functioning cohesively within the larger application ecosystem.

This methodology offers compelling advantages for development teams working on complex applications. By establishing clear boundaries between different parts of the interface, developers can work more efficiently, reduce code duplication, and create more predictable and testable systems. The isolation provided by components also enables better collaboration among team members, as different developers can work on separate components without interfering with each other's progress.

Furthermore, component-driven architecture aligns perfectly with modern development practices such as design systems, automated testing, and continuous integration. When components are designed with clear interfaces and well-defined responsibilities, they become building blocks that can be combined in countless ways to create rich, interactive user experiences.

The future of this approach lies in its continued evolution toward more sophisticated patterns of composition, better tooling for component development and documentation, and deeper integration with emerging technologies like server-side rendering and edge computing. As we move forward, the principles of component-driven development will undoubtedly continue to influence how we architect and build digital experiences.`}
        />
      </div>
    </div>
  ),
};

export const ResponsiveTypography: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Responsive Typography</h2>
          <p className="text-warm-gray">
            How our typography adapts across different screen sizes and devices.
          </p>
        </div>

        <div className="space-y-8">
          <h3 className="text-h3 font-semibold text-off-black">Scaling Examples</h3>
          
          <div className="grid gap-8">
            {/* Mobile */}
            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-off-black">Mobile (< 768px)</h4>
                <span className="text-small text-warm-gray bg-light-gray px-3 py-1 rounded">320px - 767px</span>
              </div>
              
              <div className="max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-off-black leading-tight">Mobile-Optimized Heading</h1>
                <h2 className="text-xl font-semibold text-off-black">Subheading for Mobile</h2>
                <p className="text-base text-off-black leading-relaxed">
                  Typography on mobile prioritizes readability with generous line heights and 
                  appropriately sized text that works well with thumb navigation.
                </p>
                <p className="text-small text-warm-gray">
                  Metadata and supporting information remain clearly readable.
                </p>
              </div>
            </div>

            {/* Tablet */}
            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-off-black">Tablet (768px+)</h4>
                <span className="text-small text-warm-gray bg-light-gray px-3 py-1 rounded">768px - 1023px</span>
              </div>
              
              <div className="max-w-2xl space-y-4">
                <h1 className="text-3xl font-bold text-off-black leading-tight">Tablet-Optimized Heading</h1>
                <h2 className="text-2xl font-semibold text-off-black">Enhanced Subheading</h2>
                <p className="text-lg text-off-black leading-relaxed">
                  On tablets, we can afford slightly larger text sizes while maintaining excellent 
                  readability. The increased screen real estate allows for better visual hierarchy 
                  and more comfortable reading experiences.
                </p>
                <p className="text-base text-warm-gray">
                  Supporting text scales proportionally to maintain visual balance.
                </p>
              </div>
            </div>

            {/* Desktop */}
            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-off-black">Desktop (1024px+)</h4>
                <span className="text-small text-warm-gray bg-light-gray px-3 py-1 rounded">1024px+</span>
              </div>
              
              <div className="max-w-4xl space-y-6">
                <h1 className="text-4xl font-bold text-off-black leading-tight">Desktop-Enhanced Typography</h1>
                <h2 className="text-2xl font-semibold text-off-black">Full Hierarchy Display</h2>
                <p className="text-lg text-off-black leading-relaxed">
                  Desktop displays allow for the full expression of our typographic hierarchy. 
                  Generous whitespace, optimal line lengths, and enhanced contrast create an 
                  ideal reading environment for long-form content and detailed interfaces.
                </p>
                <p className="text-base text-warm-gray">
                  The complete system shines on large screens with room for complex layouts 
                  and sophisticated information architecture.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Responsive Strategy</h4>
            <div className="grid md:grid-cols-2 gap-4 text-blue-700">
              <div>
                <h5 className="font-medium mb-2">Fluid Scaling</h5>
                <p className="text-small">
                  Typography scales smoothly between breakpoints using CSS clamp() 
                  functions for natural size progression.
                </p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Line Length Control</h5>
                <p className="text-small">
                  Maximum line lengths are enforced to maintain readability 
                  regardless of screen size or viewport width.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TypographyGuidelines_Story: Story = {
  name: 'Typography Guidelines',
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Typography Guidelines</h2>
          <p className="text-warm-gray">
            Best practices and implementation guidelines for consistent typography.
          </p>
        </div>

        <TypographyGuidelines />
      </div>
    </div>
  ),
};

export const CompleteTypographySystem: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <TypographyShowcase
        title="Superoptimised Typography System"
        description="A comprehensive typography system designed for authentic transparency and optimal readability. Built with Inter and JetBrains Mono for exceptional developer and user experiences."
      >
        {/* Typography Scale */}
        <section>
          <TypographyScale 
            typography={typographySystem}
            showSpecs={true}
            showExamples={true}
          />
        </section>

        {/* Font Specimens */}
        <section className="space-y-8">
          <h2 className="text-h2 font-semibold text-off-black">Font Families</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <FontSpecimen
              fontFamily="Inter, system-ui, sans-serif"
              fontName="Inter"
              description="Primary font optimized for user interfaces and sustained reading"
              weights={interWeights.slice(0, 3)}
              example="Transparent development process"
            />

            <FontSpecimen
              fontFamily="'JetBrains Mono', monospace"
              fontName="JetBrains Mono"
              description="Developer-focused monospace font with enhanced readability"
              weights={jetbrainsWeights.slice(0, 2)}
              example="const isPublic = true;"
            />
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <h2 className="text-h2 font-semibold text-off-black">Real-World Application</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Article Preview */}
            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <h3 className="text-h3 font-semibold text-off-black mb-4">Article Layout</h3>
              <article className="space-y-4">
                <h1 className="text-h1 font-bold text-off-black">Building Better APIs</h1>
                <div className="text-small text-warm-gray">
                  March 15, 2024 • 8 min read
                </div>
                <p className="text-body text-off-black">
                  Designing APIs that developers love requires careful attention to both 
                  technical implementation and developer experience...
                </p>
                <code className="text-code bg-light-gray px-2 py-1 rounded">
                  GET /api/v1/users
                </code>
              </article>
            </div>

            {/* Interface Elements */}
            <div className="p-6 bg-white border border-light-gray rounded-lg">
              <h3 className="text-h3 font-semibold text-off-black mb-4">Interface Elements</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Project Name
                  </label>
                  <input 
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg text-body"
                    placeholder="Enter project name"
                  />
                </div>
                
                <button className="px-4 py-2 bg-primary text-off-white rounded-lg font-medium">
                  Create Project
                </button>
                
                <p className="text-small text-warm-gray">
                  This will create a new public repository in your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section>
          <TypographyGuidelines />
        </section>
      </TypographyShowcase>
    </div>
  ),
};