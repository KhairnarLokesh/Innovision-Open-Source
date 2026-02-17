# Proposed GitHub Issue: UI Consistency and State Mutation Fixes

## Description
This issue identifies several technical debts and React anti-patterns in the chapter content management system that lead to UI inconsistency and potential state-related bugs.

## Identified Problems

### 1. Inconsistent UI Components
The components `ChapterNotFound.jsx` and `ChapterError.jsx` are using hardcoded Tailwind background colors (e.g., `bg-blue-500`) and standard HTML `<button>` or `<Link>` tags without the project's standardized Shadcn UI styling. 
- **File**: `src/components/chapter_content/ChapterNotFound.jsx`
- **File**: `src/components/chapter_content/ChapterError.jsx`
- **Impact**: Breaks the design system's visual harmony.

### 2. Direct State Mutation
In the main chapter page component, a `useEffect` hook is directly mutating a copy of the `roadmap` state and then failing to use the state setter properly for certain logic, or relying on side effects that mutate objects.
- **File**: `src/components/chapter_content/page.jsx` (Lines 285-300)
- **Impact**: Can lead to unpredictable UI updates and rendering bugs.

### 3. Logic Duplication
The `calculateReadingTime` logic is duplicated between `src/components/chapter_content/page.jsx` and `src/components/chapter_content/Content.jsx`.
- **Impact**: Increases maintenance burden and risk of inconsistent calculations.

## Proposed Changes
1. Refactor `ChapterNotFound` and `ChapterError` to use the `@/components/ui/button` component.
2. Fix the state mutation in `page.jsx` by using functional state updates (`setRoadmap(prev => ...)`).
3. Extract `calculateReadingTime` into a utility function in `src/lib/utils.js` or a new `src/lib/learning-utils.js`.

## Definition of Done
- [ ] UI matches the rest of the application using Shadcn components.
- [ ] No direct state mutations in `useEffect`.
- [ ] Reading time logic is centralized.
- [ ] Application builds and runs without console warnings.
