# ESLint Error Fix Strategy & Protocol

## Overview

This document outlines the comprehensive strategy for fixing all ESLint errors that are currently blocking builds and CI/CD processes. The approach prioritizes safety, testability, and minimal risk of breaking existing functionality.

## Current State Analysis

### ESLint Errors (Build Blockers) 🚨

**High Priority - Must Fix:**

1. **src/components/SpeechToTextArea.tsx**
   - `faUpload` is defined but never used
   - `setIsUploading` is assigned a value but never used

2. **src/components/accessibility/AnnounceRegion.stories.tsx**
   - `useEffect` is defined but never used
   - `LiveAnnouncer` is defined but never used

3. **src/lib/aiClient.ts**
   - Use `@ts-expect-error` instead of `@ts-ignore`
   - `e` is defined but never used (error handling)
   - `innerError` is defined but never used

4. **src/lib/inngest.ts**
   - `event` is defined but never used (function parameter)
   - `step` is defined but never used (function parameter)

5. **src/stories/questionnaire/RankingControl.stories.tsx**
   - `setItems` is assigned a value but never used (multiple instances)

### Tailwind Warnings (Non-blocking) ⚠️

**Lower Priority - Can defer:**

- Class order issues (`tailwindcss/classnames-order`)
- Deprecated v2 syntax (`h-4 w-4` → `size-4`)
- Migration warnings (`placeholder-warm-gray` → `placeholder:text-warm-gray`)
- Transform class removal for v3

## Fix Strategy

### Phase 1: Low-Risk Unused Imports/Variables (START HERE)

**Rationale**: These fixes have virtually zero risk of breaking functionality.

**Files & Fixes:**

1. **AnnounceRegion.stories.tsx** - Remove unused React imports
2. **SpeechToTextArea.tsx** - Remove unused FontAwesome import
3. **RankingControl.stories.tsx** - Remove unused state variables

**Risk Level**: 🟢 **Very Low**

- Removing unused imports/variables cannot break runtime behavior
- TypeScript compiler will catch any dependency issues

### Phase 2: Parameter & Error Handling Fixes

**Rationale**: These involve function parameters and error handling - need careful testing.

**Files & Fixes:**

1. **inngest.ts** - Prefix unused parameters with underscore
2. **aiClient.ts** - Fix error handling variables and TypeScript directives

**Risk Level**: 🟡 **Medium**

- Changes to error handling need verification
- Function parameter changes might affect type signatures

### Phase 3: Complex Component Logic

**Rationale**: State management changes require thorough component testing.

**Files & Fixes:**

1. **SpeechToTextArea.tsx** - Remove unused state setter
2. **RankingControl.stories.tsx** - Fix story component state

**Risk Level**: 🟠 **Medium-High**

- State management changes can affect component behavior
- Requires functional testing of affected components

### Phase 4: Tailwind Cleanup (DEFER)

**Rationale**: These are warnings only and don't block builds.

**Scope:**

- Class order standardization
- v2 → v3 migration
- Shorthand class adoption

**Risk Level**: 🟢 **Low** (but time-consuming)

## Testing Protocol

### Pre-Fix Checklist

```bash
# 1. Ensure clean working tree
git status

# 2. Create feature branch
git checkout -b fix/eslint-errors

# 3. Baseline testing
npm run dev  # Verify current functionality
npm run build  # Document current errors
```

### Per-Fix Testing Workflow

**For Each File Fix:**

1. **Make Single File Change**

   ```bash
   # Edit one file only
   ```

2. **Immediate Type Check**

   ```bash
   npx tsc --noEmit
   ```

3. **Build Verification**

   ```bash
   npm run build
   ```

4. **Dev Server Test**

   ```bash
   npm run dev
   # Test affected functionality manually
   ```

5. **Component-Specific Testing**

   ```bash
   # For component changes, test in browser:
   # - Page loads correctly
   # - Component renders
   # - Interactive features work
   # - No console errors
   ```

6. **Commit Individual Fix**

   ```bash
   git add [file]
   git commit -m "fix: remove unused [variable/import] in [file]"
   ```

7. **Rollback Protocol if Issues**
   ```bash
   git reset --hard HEAD~1  # Immediate rollback
   # Investigate and retry with different approach
   ```

### Component Testing Checklist

**For SpeechToTextArea.tsx:**

- [ ] Component renders without errors
- [ ] Upload functionality works (if applicable)
- [ ] Speech-to-text features function correctly
- [ ] No console errors in browser

**For AnnounceRegion.stories.tsx:**

- [ ] Storybook stories load correctly
- [ ] All story variations render
- [ ] Accessibility features work as expected

**For RankingControl.stories.tsx:**

- [ ] Ranking component stories display
- [ ] Interactive ranking functionality works
- [ ] Drag-and-drop (if present) functions correctly

**For aiClient.ts:**

- [ ] AI API calls succeed
- [ ] Error handling works correctly
- [ ] No runtime errors in AI functionality

**For inngest.ts:**

- [ ] Background job system functions
- [ ] Event handling works correctly
- [ ] No job processing errors

## Execution Plan

### Step-by-Step Implementation

**Day 1: Phase 1 (Low Risk)**

```bash
# 1. Fix AnnounceRegion.stories.tsx
#    - Remove unused useEffect, LiveAnnouncer imports
#    - Test: Storybook loads correctly

# 2. Fix SpeechToTextArea.tsx
#    - Remove unused faUpload import
#    - Test: Component renders, functionality intact

# 3. Fix RankingControl.stories.tsx
#    - Remove unused setItems variables
#    - Test: Stories load, ranking works
```

**Day 1: Phase 2 (Medium Risk)**

```bash
# 4. Fix inngest.ts
#    - Prefix unused parameters: _event, _step
#    - Test: Background jobs function correctly

# 5. Fix aiClient.ts
#    - Change @ts-ignore to @ts-expect-error
#    - Remove unused e, innerError variables
#    - Test: AI functionality works, error handling intact
```

**Day 1: Phase 3 (Higher Risk)**

```bash
# 6. Fix SpeechToTextArea.tsx
#    - Remove unused setIsUploading setter
#    - Test: Upload functionality works correctly
```

**Future: Phase 4 (Deferred)**

```bash
# Tailwind cleanup in separate PR
# - Class order fixes
# - v2 → v3 migration
# - Shorthand adoptions
```

## Success Criteria

### Build Success

- [ ] `npm run build` completes without ESLint errors
- [ ] TypeScript compilation passes
- [ ] No runtime errors in dev server

### Functionality Preservation

- [ ] All existing features work identically
- [ ] No new console errors or warnings
- [ ] Component behavior unchanged

### Code Quality

- [ ] All ESLint errors resolved
- [ ] Clean git history with atomic commits
- [ ] Updated documentation reflects changes

## Risk Mitigation

### Backup Strategy

```bash
# Before starting, create backup branch
git checkout -b backup/pre-lint-fix
git checkout main
git checkout -b fix/eslint-errors
```

### Emergency Rollback

```bash
# If major issues arise
git checkout main
git branch -D fix/eslint-errors
git checkout backup/pre-lint-fix
```

### Progressive Integration

- Fix and test one file at a time
- Commit immediately after successful test
- Never group risky changes together
- Maintain ability to bisect if issues arise

## Post-Fix Actions

### Verification

1. **Full Build Test**

   ```bash
   npm run build
   npm run start
   # Test production build
   ```

2. **Storybook Verification**

   ```bash
   npm run storybook
   # Verify all stories load correctly
   ```

3. **Integration Testing**
   ```bash
   # Test key user workflows:
   # - Homepage voting
   # - Journey timeline
   # - Blog post rendering
   # - XP system
   ```

### Documentation Updates

- [ ] Update this document with lessons learned
- [ ] Document any new linting rules adopted
- [ ] Update CLAUDE.md with linting best practices

### Prevention Measures

- [ ] Configure IDE/editor for real-time ESLint feedback
- [ ] Consider stricter pre-commit hooks
- [ ] Add ESLint error count to CI monitoring

---

## Execution Status

- [ ] **Phase 1**: Low-risk fixes
- [ ] **Phase 2**: Parameter & error handling
- [ ] **Phase 3**: Component logic fixes
- [ ] **Phase 4**: Tailwind cleanup (deferred)

**Started**: [DATE]  
**Completed**: [DATE]  
**Notes**: [Add any insights, issues, or lessons learned during execution]
