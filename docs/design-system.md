# Superoptimised Design System

## Overview

The Superoptimised design system is built on the principles of **authentic transparency**, **community focus**, and **professional credibility**. It implements a minimal 5-color system with carefully crafted typography to support both developer learning content and professional corporate evaluation.

## Design Principles

1. **Transparency Over Polish** - Embrace authentic imperfection rather than artificial perfectionism
2. **Community Voices First** - Highlight contributor feedback prominently throughout the experience
3. **Content Accessibility** - Ensure all users can consume educational content effectively
4. **Progressive Disclosure** - Surface overview information quickly, provide depth on demand
5. **Honest Communication** - Visual design reinforces authentic, straightforward communication style

## Color System

### 5-Color System Philosophy

The design system uses a minimal approach with 4 base colors plus 1 variable accent color to maximize focus on content rather than interface design.

### Color Palette

| Color Type    | Hex Code | Tailwind Class | Usage |
|:-------------|:---------|:---------------|:------|
| **Off-Black** | `#1a1a1a` | `off-black` | Headers, emphasis text |
| **Off-White** | `#fafafa` | `off-white` | Backgrounds, light text |
| **Warm Gray** | `#6b7280` | `warm-gray` | Body text, secondary content |
| **Light Gray** | `#f3f4f6` | `light-gray` | Borders, dividers, subtle backgrounds |
| **Primary** | `#64748b` | `primary` | Action items, links, interactive elements |

### Color Usage Guidelines

- **High contrast ratios**: 4.5:1 minimum for body text, 3:1 for larger text
- **Desaturated blue accent** conveys professional competence without corporate coldness
- **Warm grays** provide comfortable reading experience for long-form content
- **Restrained color usage** makes the accent color more impactful

## Typography

### Font Stack

- **Primary**: Inter - Exceptional readability for long-form content, professional yet approachable
- **Monospace**: JetBrains Mono - Created specifically for developers, excellent for code snippets

### Typography Scale

| Element | Size | Weight | Line Height | Margin Bottom | Tailwind Class |
|:--------|:-----|:-------|:------------|:-------------|:---------------|
| H1 | 2.25rem | 700 | 1.2 | 2rem | `text-h1` |
| H2 | 1.875rem | 600 | 1.3 | 1.5rem | `text-h2` |
| H3 | 1.5rem | 600 | 1.4 | 1.25rem | `text-h3` |
| H4 | 1.25rem | 500 | 1.4 | 1rem | `text-h4` |
| Body | 1rem | 400 | 1.6 | 1rem | `text-body` |
| Small | 0.875rem | 400 | 1.5 | 0.75rem | `text-small` |
| Code | 0.875rem | 400 | 1.4 | 1rem | `text-code` |

### Typography Usage

- **Hierarchy through spacing, sizing, and weight** rather than color
- **Max 65ch reading width** for optimal readability of long-form content
- **1.6 line height** for body text optimized for sustained reading

## Spacing System

### Spacing Scale

| Name | Value | Tailwind Class | Usage |
|:-----|:------|:---------------|:------|
| Section | 3rem | `section` | Between major content sections |
| Component | 2rem | `component` | Between different UI components |
| Paragraph | 1rem | `paragraph` | Between paragraphs |
| List | 0.5rem | `list` | Between list items |

### Content Rhythm

- **Section spacing**: 3rem between major content sections
- **Paragraph spacing**: 1rem between paragraphs for comfortable reading
- **Component spacing**: 2rem between different UI components

## Responsive Breakpoints

| Breakpoint | Min Width | Target Devices | Design Priority |
|:-----------|:----------|:---------------|:----------------|
| **Mobile** | 320px | Smartphones, social media traffic | Primary focus |
| **Tablet** | 768px | iPads, larger phones | Content optimization |
| **Desktop** | 1024px | Laptops, smaller desktops | Professional evaluation |
| **Wide** | 1440px | Large desktops, external monitors | Enhanced experience |

## Component Library

### Typography Components

```tsx
import { H1, H2, H3, H4, Paragraph, Link, CodeBlock, InlineCode } from '@/components/ui/Typography';

// Usage examples
<H1>Page Title</H1>
<H2>Section Heading</H2>
<Paragraph>Body content with optimal line height for reading.</Paragraph>
<Link href="/journey" external>External Link</Link>
<CodeBlock language="typescript">const example = "code";</CodeBlock>
<InlineCode>inline code</InlineCode>
```

### Layout Components

```tsx
import { PageContainer, MainContent, Section, Grid, Flex } from '@/components/layout/PageContainer';

// Usage examples
<PageContainer variant="reading">
  <MainContent>
    <Section spacing="default">
      <Grid cols={3} gap="md" responsive>
        <div>Grid item 1</div>
        <div>Grid item 2</div>
        <div>Grid item 3</div>
      </Grid>
    </Section>
  </MainContent>
</PageContainer>
```

### Button Components

```tsx
import { Button, IconButton, LinkButton } from '@/components/ui/Button';

// Usage examples
<Button variant="primary" size="md">Primary Action</Button>
<Button variant="outline" loading>Loading State</Button>
<IconButton icon={<MenuIcon />} aria-label="Open menu" />
<LinkButton href="/projects" variant="secondary">View Projects</LinkButton>
```

### Card Components

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CommunityResponseCard,
  ProjectShowcaseCard 
} from '@/components/ui/Card';

// Basic card
<Card variant="bordered">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Community response card
<CommunityResponseCard 
  author="username"
  timestamp="2 hours ago"
  variant="response-highlight"
>
  Community feedback content
</CommunityResponseCard>

// Project showcase card
<ProjectShowcaseCard
  title="Project Name"
  description="Project description"
  technologies={["React", "TypeScript", "Tailwind"]}
  status="in-progress"
  href="/projects/example"
/>
```

### Newsletter Components

```tsx
import { NewsletterSignup, CurrentFocusBanner } from '@/components/ui/Newsletter';

// Newsletter signup variants
<NewsletterSignup variant="card" />
<NewsletterSignup variant="inline" />
<NewsletterSignup variant="banner" />

// Current building focus
<CurrentFocusBanner
  title="Building Magic Link System"
  description="Creating anonymous community feedback system"
  progress={75}
  ctaText="Follow Progress"
  ctaHref="/journey/magic-links"
/>
```

### Layout Structure

```tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageContainer, MainContent } from '@/components/layout/PageContainer';

// Standard page layout
<div className="min-h-screen flex flex-col">
  <Header />
  <MainContent>
    <PageContainer variant="reading">
      {/* Page content */}
    </PageContainer>
  </MainContent>
  <Footer />
</div>
```

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Color contrast**: 4.5:1 minimum for body text, 3:1 for larger text
- **Focus indicators**: Clear, high-contrast focus rings for keyboard navigation
- **Touch targets**: Minimum 44px click areas for mobile interactions
- **Semantic HTML**: Proper heading hierarchy, alt text, form labels
- **Screen reader support**: Descriptive labels and ARIA attributes

### Testing Checklist

- [ ] All interactive elements have proper focus indicators
- [ ] Color contrast meets WCAG standards
- [ ] Touch targets meet minimum size requirements
- [ ] Screen reader can navigate content logically
- [ ] Keyboard navigation works for all interactive elements
- [ ] Alt text provided for all images
- [ ] Form labels are properly associated

## Utility Functions

### Class Name Utility

```tsx
import { cn } from '@/lib/utils';

// Conditional class merging with Tailwind CSS
const className = cn(
  "base-classes",
  condition && "conditional-classes",
  anotherCondition ? "true-classes" : "false-classes"
);
```

### Typography Utilities

```tsx
import { typography, spacing, colors, accessibility } from '@/lib/utils';

// Pre-defined style combinations
<div className={typography.h1}>Heading</div>
<div className={spacing.section}>Section spacing</div>
<div className={colors.primary}>Primary color</div>
<button className={accessibility.focusRing}>Accessible button</button>
```

## Performance Considerations

### Font Loading

- **Font-display: swap** for performance optimization
- **Preload strategy** for critical fonts
- **Font feature settings** enabled for Inter

### Image Optimization

- **WebP format** with progressive loading
- **Lazy loading** for below-fold content
- **Responsive images** with proper sizing

### Animation Guidelines

- **Subtle, purposeful animations** that enhance rather than distract
- **Respect prefers-reduced-motion** for accessibility
- **60fps performance** with hardware acceleration where appropriate

## Development Guidelines

### Component Structure

```tsx
// Standard component template
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'alternative';
}

export function Component({ children, variant = 'default', className, ...props }: ComponentProps) {
  return (
    <div
      className={cn(
        "base-styles",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`QuestionnaireForm.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useQuestionnaire.ts`)
- **Utilities**: camelCase (`validateMagicLink()`)
- **CSS Classes**: kebab-case with BEM methodology where appropriate

### File Organization

```
src/
├── components/
│   ├── ui/           # Base UI components
│   ├── layout/       # Layout components
│   └── feature/      # Feature-specific components
├── lib/
│   └── utils.ts      # Utility functions
└── styles/
    └── globals.css   # Global styles and design tokens
```

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **Progressive enhancement** for older browsers
- **Graceful degradation** for unsupported features

## Updates and Versioning

- **Semantic versioning** for design system releases
- **Backward compatibility** maintained for one major version
- **Migration guides** provided for breaking changes
- **Regular accessibility audits** and updates