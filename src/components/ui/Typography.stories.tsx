import type { Meta, StoryObj } from "@storybook/react";
import { H1, H2, H3, H4, Paragraph, InlineCode, Link, CodeBlock, MonoText } from "./Typography";

const meta: Meta = {
  title: "Design System/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Typography components following the Superoptimised Design System. Implements the 5-color system with Inter font and optimized reading experience.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Content to display",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;

type H1Story = StoryObj<typeof H1>;
type H2Story = StoryObj<typeof H2>;
type H3Story = StoryObj<typeof H3>;
type H4Story = StoryObj<typeof H4>;
type ParagraphStory = StoryObj<typeof Paragraph>;
type InlineCodeStory = StoryObj<typeof InlineCode>;
type LinkStory = StoryObj<typeof Link>;
type CodeBlockStory = StoryObj<typeof CodeBlock>;
type MonoTextStory = StoryObj<typeof MonoText>;

export const Heading1: H1Story = {
  render: (args) => <H1 {...args} />,
  args: {
    children: "Page Title Heading",
  },
};

export const Heading2: H2Story = {
  render: (args) => <H2 {...args} />,
  args: {
    children: "Section Heading",
  },
};

export const Heading3: H3Story = {
  render: (args) => <H3 {...args} />,
  args: {
    children: "Subsection Heading",
  },
};

export const Heading4: H4Story = {
  render: (args) => <H4 {...args} />,
  args: {
    children: "Component Heading",
  },
};

export const BodyText: ParagraphStory = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "This is body text optimized for reading with a 1.6 line height and maximum 65 character width for optimal readability. The text uses the warm gray color for comfortable long-form content consumption.",
  },
};

export const MutedText: ParagraphStory = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "This is muted text used for secondary content and less important information.",
    variant: "muted",
  },
};

export const SmallText: ParagraphStory = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "This is small text used for captions, footnotes, and metadata.",
    variant: "small",
  },
};

export const InlineCodeExample: InlineCodeStory = {
  render: (args) => (
    <Paragraph>
      Here is some inline code: <InlineCode {...args} /> within a paragraph.
    </Paragraph>
  ),
  args: {
    children: "const example = 'code'",
  },
};

export const DefaultLink: LinkStory = {
  render: (args) => (
    <Paragraph>
      This paragraph contains a <Link {...args} /> that demonstrates the link styling.
    </Paragraph>
  ),
  args: {
    children: "design system link",
    href: "/design-system",
  },
};

export const ExternalLink: LinkStory = {
  render: (args) => (
    <Paragraph>
      This paragraph contains an <Link {...args} /> with external indicator.
    </Paragraph>
  ),
  args: {
    children: "external link",
    href: "https://example.com",
    external: true,
  },
};

export const MutedLink: LinkStory = {
  render: (args) => (
    <Paragraph variant="muted">
      This muted paragraph contains a <Link {...args} /> with muted styling.
    </Paragraph>
  ),
  args: {
    children: "muted link",
    href: "/example",
    variant: "muted",
  },
};

export const CodeBlockExample: CodeBlockStory = {
  render: (args) => <CodeBlock {...args} />,
  args: {
    children: `function validateMagicLink(token: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token, 'base64url'),
    Buffer.from(storedToken, 'base64url')
  );
}`,
    language: "typescript",
  },
};

export const MonoTextDefault: MonoTextStory = {
  render: (args) => <MonoText {...args} />,
  args: {
    children: "2024-03-15 14:30:00",
  },
};

export const MonoTextVariants: MonoTextStory = {
  render: () => (
    <div className="space-y-3">
      <div>
        <MonoText variant="default">2024-03-15 14:30:00</MonoText>
        <span className="ml-2 text-sm">Default variant</span>
      </div>
      <div>
        <MonoText variant="muted">Last updated: 2h ago</MonoText>
        <span className="ml-2 text-sm">Muted variant</span>
      </div>
      <div>
        <MonoText variant="small">v1.2.3</MonoText>
        <span className="ml-2 text-sm">Small variant</span>
      </div>
    </div>
  ),
};

export const MonoTextAsTime: MonoTextStory = {
  render: () => (
    <div className="space-y-2">
      <MonoText as="time">
        March 15, 2024 at 2:30 PM
      </MonoText>
      <br />
      <MonoText as="time" variant="muted">
        5 days ago
      </MonoText>
    </div>
  ),
};

export const MonoTextUseCases: MonoTextStory = {
  render: () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-h3 mb-3">Post Metadata</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Published:</span>
            <MonoText as="time">Mar 15, 2024</MonoText>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Reading time:</span>
            <MonoText variant="muted">8 min read</MonoText>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Version:</span>
            <MonoText variant="small">v2.1.0</MonoText>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-h3 mb-3">Technical Details</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Build ID:</span>
            <MonoText>build-2024-03-15-001</MonoText>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Commit SHA:</span>
            <MonoText variant="muted">a1b2c3d4e5f6</MonoText>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Environment:</span>
            <MonoText variant="small">production</MonoText>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world examples showing MonoText used for dates, versions, technical metadata, and other monospace content.",
      },
    },
  },
};

export const CompleteTypographyScale = {
  render: () => (
    <div className="space-y-8">
      <div>
        <H1>Typography Scale Demo</H1>
        <Paragraph variant="muted">
          Demonstration of the complete Superoptimised Design System typography scale
        </Paragraph>
      </div>
      
      <div className="space-y-4">
        <H2>Design Principles</H2>
        <Paragraph>
          The Superoptimised design system uses a minimal approach with hierarchy through spacing, 
          sizing, and weight rather than color. This ensures excellent readability and focuses 
          attention on content rather than interface design.
        </Paragraph>
        
        <H3>Reading Optimization</H3>
        <Paragraph>
          All body text is constrained to a maximum of 65 characters width for optimal readability 
          during sustained reading sessions. The 1.6 line height provides comfortable spacing 
          between lines of text.
        </Paragraph>
        
        <H4>Code Examples</H4>
        <Paragraph>
          Inline code like <InlineCode>const example = true</InlineCode> uses JetBrains Mono 
          for excellent developer readability. For larger code examples:
        </Paragraph>
        
        <CodeBlock language="typescript">
{`interface DesignSystemProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}`}
        </CodeBlock>
        
        <Paragraph variant="small">
          Small text is used for metadata, captions, and less important supplementary information.
        </Paragraph>
        
        <Paragraph>
          Links within content are styled with underlines and proper contrast ratios. 
          <Link href="/design-system">Internal links</Link> and 
          <Link href="https://example.com" external>external links</Link> are clearly 
          differentiated for user clarity.
        </Paragraph>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete demonstration of all typography components working together in a real content scenario.",
      },
    },
  },
};