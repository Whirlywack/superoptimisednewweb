import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/MarkdownRenderer",
  component: MarkdownRenderer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Markdown renderer component with syntax highlighting, code copy functionality, and heading anchors.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: "text",
      description: "Markdown content to render",
    },
    showLineNumbers: {
      control: "boolean",
      description: "Whether to show line numbers in code blocks",
    },
    showCopyButton: {
      control: "boolean",
      description: "Whether to show copy button for code blocks",
    },
    showHeadingAnchors: {
      control: "boolean",
      description: "Whether to show anchor links for headings",
    },
    maxWidth: {
      control: "select",
      options: ["none", "prose", "narrow"],
      description: "Maximum width constraint",
    },
    variant: {
      control: "select",
      options: ["article", "documentation", "comment"],
      description: "Display variant",
    },
    enableSyntaxHighlight: {
      control: "boolean",
      description: "Whether to enable syntax highlighting",
    },
    onHeadingClick: {
      action: "heading-clicked",
      description: "Callback when heading anchor is clicked",
    },
  },
  args: {
    onHeadingClick: fn(),
  },
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `# Getting Started with React

Welcome to this comprehensive guide on building modern React applications. This tutorial will cover everything you need to know to get started.

## Prerequisites

Before we begin, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn package manager
- A code editor (VS Code recommended)

## Setting Up Your Environment

Let's start by creating a new React application:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This will create a new React application with all the necessary dependencies and start the development server.

### Project Structure

Your project structure should look like this:

\`\`\`
my-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
\`\`\`

## Creating Your First Component

Here's a simple React component to get you started:

\`\`\`jsx
import React from 'react';

function Welcome({ name }) {
  return (
    <div className="welcome">
      <h1>Hello, {name}!</h1>
      <p>Welcome to React development.</p>
    </div>
  );
}

export default Welcome;
\`\`\`

### Using the Component

To use this component in your app:

\`\`\`jsx
import Welcome from './Welcome';

function App() {
  return (
    <div className="App">
      <Welcome name="Developer" />
    </div>
  );
}
\`\`\`

## Advanced Features

React offers many powerful features for building complex applications:

- **State Management**: Use useState and useReducer for local state
- **Side Effects**: Handle API calls and subscriptions with useEffect
- **Context**: Share data across components without prop drilling
- **Performance**: Optimize with useMemo and useCallback

> **Pro Tip**: Always start with simple state management and only introduce complexity when needed. Premature optimization can lead to unnecessary complications.

### Best Practices

When building React applications, keep these principles in mind:

- Keep components small and focused
- Use functional components with hooks
- Implement proper error boundaries
- Write comprehensive tests
- Follow consistent naming conventions

## Conclusion

You now have the foundation to build amazing React applications. Continue practicing and exploring the React ecosystem to become proficient.

Happy coding! 🚀`;

const documentationMarkdown = `# API Reference

This document provides a comprehensive reference for all available API endpoints.

## Authentication

All API requests require authentication using a bearer token:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
     https://api.example.com/users
\`\`\`

## Endpoints

### Users

#### GET /users

Retrieve a list of users.

\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

#### POST /users

Create a new user.

\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secure_password"
}
\`\`\`

### Projects

#### GET /projects

List all projects.

> **Note**: This endpoint supports pagination using the \`page\` and \`limit\` query parameters.

## Error Handling

The API returns standard HTTP status codes:

- **200**: Success
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error`;

const shortMarkdown = `# Quick Note

This is a short markdown example with minimal content.

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

That's it!`;

const codeHeavyMarkdown = `# Code Examples

This document contains various code examples in different languages.

## JavaScript

\`\`\`javascript
// Function to calculate factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120
\`\`\`

## Python

\`\`\`python
# Class definition
class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, value):
        self.result += value
        return self
    
    def multiply(self, value):
        self.result *= value
        return self

# Usage
calc = Calculator()
result = calc.add(5).multiply(3).result
print(f"Result: {result}")  # Output: Result: 15
\`\`\`

## CSS

\`\`\`css
/* Modern CSS Grid Layout */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}
\`\`\``;

export const Article: Story = {
  args: {
    content: sampleMarkdown,
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "article",
  },
};

export const Documentation: Story = {
  args: {
    content: documentationMarkdown,
    showLineNumbers: false,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "documentation",
  },
};

export const CodeHeavy: Story = {
  args: {
    content: codeHeavyMarkdown,
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "article",
  },
};

export const ShortContent: Story = {
  args: {
    content: shortMarkdown,
    showLineNumbers: false,
    showCopyButton: true,
    showHeadingAnchors: false,
    maxWidth: "narrow",
    variant: "comment",
  },
};

export const NoLineNumbers: Story = {
  args: {
    content: sampleMarkdown,
    showLineNumbers: false,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "article",
  },
};

export const NoCopyButton: Story = {
  args: {
    content: sampleMarkdown,
    showLineNumbers: true,
    showCopyButton: false,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "article",
  },
};

export const NoHeadingAnchors: Story = {
  args: {
    content: sampleMarkdown,
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: false,
    maxWidth: "prose",
    variant: "article",
  },
};

export const NarrowWidth: Story = {
  args: {
    content: sampleMarkdown,
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "narrow",
    variant: "article",
  },
};

export const FullWidth: Story = {
  args: {
    content: sampleMarkdown,
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "none",
    variant: "article",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const CommentVariant: Story = {
  args: {
    content: `## User Comment

This is a shorter piece of content that might appear in a comment or discussion thread.

\`\`\`javascript
const reply = "Thanks for the helpful explanation!";
\`\`\`

The formatting is more compact for this use case.`,
    showLineNumbers: false,
    showCopyButton: true,
    showHeadingAnchors: false,
    maxWidth: "prose",
    variant: "comment",
  },
};

export const Empty: Story = {
  args: {
    content: "",
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "article",
  },
};

export const BlogPost: Story = {
  args: {
    content: `# Building Better User Interfaces

Creating intuitive and accessible user interfaces is both an art and a science. In this post, we'll explore key principles and practical techniques.

## The Foundation: User-Centered Design

Before writing a single line of code, we need to understand our users:

- Who are they?
- What are their goals?
- What challenges do they face?

> "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs

## Implementation Strategy

Here's a React component that demonstrates accessible design:

\`\`\`jsx
import React, { useState } from 'react';

function AccessibleButton({ children, onClick, disabled = false }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={\`btn \${isPressed ? 'btn--pressed' : ''}\`}
      aria-pressed={isPressed}
    >
      {children}
    </button>
  );
}
\`\`\`

### Key Accessibility Features

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- High contrast colors

## Testing Your Interface

Always test with real users and assistive technologies:

\`\`\`bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe
\`\`\`

Remember: great UX is invisible to users but makes their lives easier.`,
    showLineNumbers: true,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "article",
  },
};

export const TechnicalDocumentation: Story = {
  args: {
    content: `# Component API

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| \`children\` | \`ReactNode\` | The content to render |
| \`onClick\` | \`() => void\` | Click handler |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`variant\` | \`string\` | \`"primary"\` | Button style variant |
| \`disabled\` | \`boolean\` | \`false\` | Disabled state |

## Usage Examples

### Basic Usage

\`\`\`jsx
<Button onClick={() => console.log('clicked')}>
  Click me
</Button>
\`\`\`

### With Variants

\`\`\`jsx
<Button variant="secondary" onClick={handleClick}>
  Secondary Action
</Button>
\`\`\`

## Implementation Notes

> **Important**: Always provide meaningful labels for screen readers.

The component uses semantic HTML and follows WCAG guidelines.`,
    showLineNumbers: false,
    showCopyButton: true,
    showHeadingAnchors: true,
    maxWidth: "prose",
    variant: "documentation",
  },
};