# Typography Reference Guide

## Design System Enforcement

This guide ensures consistent typography implementation across all components and HTML mockups.

## Primary Typography Components (USE THESE)

### Mega - `<Mega>`
- **Size**: 7.5rem desktop, 4rem mobile (clamp)
- **Use**: Page titles, major announcements
- **Weight**: 800, UPPERCASE
- **Class**: `text-mega`

### Hero - `<Hero>` 
- **Size**: 5rem desktop, 3rem mobile (clamp)
- **Use**: Main page headings
- **Weight**: 700
- **Class**: `text-hero`

### XL - `<XL>`
- **Size**: 2.5rem desktop, 1.5rem mobile (clamp) 
- **Use**: Section headings
- **Weight**: 600
- **Class**: `text-xl`

### Large - `<Large>`
- **Size**: 1.25rem (20px)
- **Use**: Subsection headings
- **Weight**: 500
- **Class**: `text-lg`

### Body - `<Body>`
- **Size**: 1rem (16px)
- **Use**: All body text, descriptions
- **Weight**: 400
- **Class**: `text-base`

### Small - `<Small>`
- **Size**: 0.875rem (14px)
- **Use**: Secondary text, metadata
- **Weight**: 400
- **Class**: `text-sm`

### Micro - `<Micro>`
- **Size**: 0.75rem (12px)  
- **Use**: Captions, fine print
- **Weight**: 400
- **Class**: `text-xs`

### Mono - `<Mono>`
- **Font**: JetBrains Mono
- **Use**: Timestamps, statistics, technical data
- **Class**: `font-mono text-sm text-warm-gray`

## HTML Element Mapping

When converting HTML mockups, use this exact mapping:

```html
<!-- WRONG: Don't use these -->
<h1 class="text-h1">...</h1>
<h2 class="text-h2">...</h2>
<p class="text-body">...</p>

<!-- CORRECT: Use these instead -->
<h1 class="text-hero">...</h1>        <!-- or text-mega for major titles -->
<h2 class="text-xl">...</h2>          <!-- Section headings -->
<h3 class="text-lg">...</h3>          <!-- Subsection headings -->
<p class="text-base">...</p>          <!-- Body text -->
<span class="text-sm">...</span>      <!-- Secondary text -->
<time class="font-mono text-sm text-warm-gray">...</time>  <!-- Timestamps -->
```

## Component Usage Examples

```tsx
// Page title
<Mega>SYSTEM QUESTIONNAIRE</Mega>

// Main heading  
<Hero>Building Decision Made</Hero>

// Section heading
<XL>Community Feedback</XL>

// Subsection heading
<Large>Recent Updates</Large>

// Body content
<Body>This is the main content text that users will read...</Body>

// Metadata
<Small>Published 2 days ago</Small>

// Technical data
<Mono>15% Complete • 3 votes • 2024-01-02</Mono>
```

## Colors (5-Color System Only)

- **Primary text**: `text-off-black dark:text-off-white`
- **Secondary text**: `text-warm-gray`  
- **Interactive elements**: `text-primary`
- **Backgrounds**: `bg-off-white dark:bg-off-black`
- **Borders**: `border-light-gray`

## Strict Rules

1. **NEVER use `text-h1`, `text-h2`, `text-h3`, `text-h4`** - These are legacy
2. **ALWAYS use design system classes**: `text-mega`, `text-hero`, `text-xl`, `text-lg`, `text-base`, `text-sm`, `text-xs`
3. **Monospace for ALL data**: timestamps, stats, counts, percentages
4. **Max reading width**: Add `max-w-reading` to body text
5. **Only primary color variations allowed**: `primary`, `primary-light`, `primary-dark`

## Quick Reference for Claude Code

When given HTML mockups:
- Large headlines → `text-hero` or `text-mega`
- Section headers → `text-xl` 
- Subsection headers → `text-lg`
- Body text → `text-base`
- Small text → `text-sm` 
- Tiny text → `text-xs`
- Any data/numbers → `font-mono text-sm text-warm-gray`