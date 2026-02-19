# New GitHub Issues for InnoVision

## 🎯 Fresh Issues You Can Work On

These are NEW issues I've identified that are NOT in the existing 30 open issues. Pick any to work on!

---

## 🚀 Feature Issues

### Issue #1: Add Course Search and Filter Functionality
**Difficulty**: Medium  
**Category**: Feature Enhancement  
**Labels**: `enhancement`, `good first issue`, `OSCG26`

**Problem**:
The "Your Courses" page (`/roadmap`) displays all courses but lacks search and filter capabilities. Users with many courses cannot easily find specific ones.

**Proposed Solution**:
Add a search bar and filter options to help users find courses quickly.

**Implementation Details**:
- Add search input to filter courses by title
- Add filter dropdowns for:
  - Difficulty level (fast, balanced, in-depth)
  - Completion status (in progress, completed)
  - Date created (newest first, oldest first)
- Add sort options
- Persist filter preferences in localStorage
- Show course count (e.g., "Showing 5 of 12 courses")

**Files to Modify**:
- `src/app/roadmap/page.jsx`

**Acceptance Criteria**:
- [ ] Search works in real-time
- [ ] Filters can be combined
- [ ] Clear filters button available
- [ ] Responsive on mobile
- [ ] No courses found state

---

### Issue #2: Add Course Progress Percentage Display
**Difficulty**: Easy  
**Category**: UI Enhancement  
**Labels**: `enhancement`, `ui`, `OSCG26`

**Problem**:
Course cards don't show progress percentage, making it hard to see how much of a course is completed at a glance.

**Proposed Solution**:
Add a progress bar and percentage to each course card showing completion status.

**Implementation Details**:
- Calculate progress: (completed chapters / total chapters) × 100
- Add circular progress indicator or linear progress bar
- Show percentage text (e.g., "65% complete")
- Use color coding:
  - 0-33%: Red/Orange
  - 34-66%: Yellow
  - 67-100%: Green
- Add "Continue Learning" button that goes to next incomplete chapter

**Files to Modify**:
- `src/components/Home/RoadMap.jsx`
- `src/app/roadmap/page.jsx`

**Acceptance Criteria**:
- [ ] Progress shows on all course cards
- [ ] Accurate calculation
- [ ] Smooth animations
- [ ] Works on mobile

---

### Issue #3: Implement Course Sharing Feature
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `social`, `OSCG26`

**Problem**:
Users cannot share their generated courses with friends or on social media.

**Proposed Solution**:
Add share functionality with multiple options (link, social media, QR code).

**Implementation Details**:
- Add "Share Course" button on course detail page
- Generate shareable link (public view mode)
- Create API endpoint for public course view
- Add share options:
  - Copy link
  - WhatsApp
  - Twitter/X
  - LinkedIn
  - Email
  - Generate QR code
- Track share analytics
- Add privacy toggle (public/private courses)

**Files to Create/Modify**:
- `src/app/api/courses/public/[id]/route.js`
- `src/app/courses/public/[id]/page.jsx`
- `src/components/ShareDialog.jsx`
- `src/app/roadmap/[id]/page.jsx`

**Acceptance Criteria**:
- [ ] Share button visible on course page
- [ ] Public link works without login
- [ ] Social media sharing works
- [ ] QR code generation
- [ ] Privacy controls

---

### Issue #4: Add Dark Mode for Code Snippets
**Difficulty**: Easy  
**Category**: UI Enhancement  
**Labels**: `enhancement`, `ui`, `accessibility`, `OSCG26`

**Problem**:
Code snippets in chapter content don't respect dark/light theme, causing readability issues.

**Proposed Solution**:
Make code syntax highlighting theme-aware.

**Implementation Details**:
- Update `react-syntax-highlighter` theme based on app theme
- Use `oneDark` theme for dark mode
- Use `oneLight` theme for light mode
- Ensure proper contrast in night mode
- Add theme toggle listener

**Files to Modify**:
- `src/components/MarkDown.jsx`
- `src/components/chapter_content/Content.jsx`

**Acceptance Criteria**:
- [ ] Code blocks change with theme
- [ ] Readable in all modes (light/dark/night)
- [ ] Smooth theme transitions
- [ ] Copy button still visible

---

### Issue #5: Add Estimated Time to Complete for Each Course
**Difficulty**: Easy  
**Category**: Feature  
**Labels**: `enhancement`, `OSCG26`

**Problem**:
Users don't know how long a course will take to complete before starting.

**Proposed Solution**:
Calculate and display estimated completion time based on chapter count and reading time.

**Implementation Details**:
- Calculate: (total chapters × avg reading time per chapter)
- Assume 15-20 minutes per chapter
- Display on course card: "~3 hours" or "~2 days"
- Add to course detail page
- Consider user's selected time commitment
- Show range (e.g., "2-3 hours")

**Files to Modify**:
- `src/components/Home/RoadMap.jsx`
- `src/app/roadmap/[id]/page.jsx`

**Acceptance Criteria**:
- [ ] Time estimate on course cards
- [ ] Accurate calculations
- [ ] Human-readable format
- [ ] Updates dynamically

---

### Issue #6: Add Course Categories/Tags System
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `organization`, `OSCG26`

**Problem**:
Courses are not categorized, making it hard to organize and browse by topic area.

**Proposed Solution**:
Implement a tagging system for courses with predefined categories.

**Implementation Details**:
- Add categories: Programming, Math, Science, Business, Languages, etc.
- Auto-tag courses based on AI analysis of content
- Allow manual tag editing
- Add tag filter on courses page
- Show tags as colored badges on course cards
- Create tag cloud/category browser
- Store tags in Firestore

**Files to Create/Modify**:
- `src/app/api/roadmap/tags/route.js`
- `src/components/TagSelector.jsx`
- `src/app/roadmap/page.jsx`
- Update Firestore schema

**Acceptance Criteria**:
- [ ] Tags display on course cards
- [ ] Filter by tags works
- [ ] AI auto-tagging functional
- [ ] Manual tag editing
- [ ] Tag management UI

---

### Issue #7: Implement Course Duplication Feature
**Difficulty**: Easy  
**Category**: Feature  
**Labels**: `enhancement`, `productivity`, `OSCG26`

**Problem**:
Users cannot duplicate existing courses to create variations or templates.

**Proposed Solution**:
Add "Duplicate Course" option to create a copy of an existing course.

**Implementation Details**:
- Add "Duplicate" button in course menu
- Copy all course data (chapters, content, settings)
- Append "(Copy)" to course title
- Create new Firestore document
- Show success toast
- Redirect to duplicated course
- Add confirmation dialog

**Files to Modify**:
- `src/app/api/roadmap/duplicate/route.js` (create)
- `src/components/Home/RoadMap.jsx`
- `src/app/roadmap/[id]/page.jsx`

**Acceptance Criteria**:
- [ ] Duplicate button visible
- [ ] All content copied correctly
- [ ] New course ID generated
- [ ] User redirected to copy
- [ ] Works for all course types

---

### Issue #8: Add Course Export Feature (PDF/Markdown)
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `export`, `OSCG26`

**Problem**:
Users cannot export their courses for offline reading or sharing outside the platform.

**Proposed Solution**:
Add export functionality to download courses as PDF or Markdown files.

**Implementation Details**:
- Add "Export" button in course menu
- Export formats:
  - PDF (formatted with styling)
  - Markdown (plain text)
  - JSON (data format)
- Include all chapters and content
- Add table of contents
- Preserve code formatting
- Use libraries: `jsPDF` or `html2pdf` for PDF
- Show download progress
- Make it a premium feature

**Files to Create/Modify**:
- `src/app/api/roadmap/export/route.js`
- `src/components/ExportDialog.jsx`
- `src/app/roadmap/[id]/page.jsx`

**Acceptance Criteria**:
- [ ] Export button visible
- [ ] PDF export works
- [ ] Markdown export works
- [ ] Proper formatting
- [ ] Progress indicator
- [ ] Premium check

---

### Issue #9: Add Course Completion Certificate
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `gamification`, `OSCG26`

**Problem**:
Users have no proof of course completion to share or add to resumes.

**Proposed Solution**:
Generate a completion certificate when user finishes all chapters.

**Implementation Details**:
- Trigger certificate generation on 100% completion
- Certificate includes:
  - User name
  - Course title
  - Completion date
  - InnoVision branding
  - Unique certificate ID
- Download as PDF or PNG
- Share on LinkedIn
- Store in user profile
- Add certificate gallery
- Use canvas API for generation

**Files to Create/Modify**:
- `src/app/api/certificates/generate/route.js`
- `src/components/CertificateGenerator.jsx`
- `src/app/profile/certificates/page.jsx`
- `src/app/roadmap/[id]/page.jsx`

**Acceptance Criteria**:
- [ ] Certificate auto-generates
- [ ] Professional design
- [ ] Download works
- [ ] LinkedIn sharing
- [ ] Certificate gallery
- [ ] Unique verification ID

---

### Issue #10: Add Chapter Notes Feature
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `learning`, `OSCG26`

**Problem**:
Users cannot take notes while learning, forcing them to use external tools.

**Proposed Solution**:
Add a notes panel beside chapter content for taking and saving notes.

**Implementation Details**:
- Add collapsible notes panel
- Rich text editor (bold, italic, lists)
- Auto-save notes to Firestore
- Notes organized by chapter
- Search across all notes
- Export notes
- Markdown support
- Sync across devices
- Add timestamps

**Files to Create/Modify**:
- `src/components/chapter_content/NotesPanel.jsx`
- `src/app/api/notes/route.js`
- `src/components/chapter_content/Content.jsx`

**Acceptance Criteria**:
- [ ] Notes panel toggles
- [ ] Auto-save works
- [ ] Rich text formatting
- [ ] Search functionality
- [ ] Export notes
- [ ] Mobile responsive

---

## 🐛 Bug/Improvement Issues

### Issue #11: Improve Loading States with Skeleton Screens
**Difficulty**: Easy  
**Category**: UI/UX  
**Labels**: `enhancement`, `ui`, `loading`, `OSCG26`

**Problem**:
Many pages show blank screens or spinners during data loading, creating poor UX.

**Proposed Solution**:
Replace loading spinners with skeleton screens that match content layout.

**Implementation Details**:
- Create skeleton components for:
  - Course cards
  - Chapter list
  - Profile stats
  - Leaderboard
  - Analytics charts
- Match skeleton to actual content shape
- Add shimmer animation
- Use existing `Skeleton` component from shadcn/ui
- Apply to all async data loading

**Files to Modify**:
- `src/app/roadmap/page.jsx`
- `src/app/gamification/page.jsx`
- `src/app/profile/page.jsx`
- `src/components/gamification/Leaderboard.jsx`

**Acceptance Criteria**:
- [ ] Skeletons match content layout
- [ ] Smooth shimmer animation
- [ ] Applied to all loading states
- [ ] No layout shift on load

---

### Issue #12: Add Keyboard Shortcuts for Navigation
**Difficulty**: Medium  
**Category**: Accessibility  
**Labels**: `enhancement`, `accessibility`, `a11y`, `OSCG26`

**Problem**:
Power users cannot navigate efficiently using keyboard shortcuts.

**Proposed Solution**:
Implement keyboard shortcuts for common actions.

**Implementation Details**:
- Add shortcuts:
  - `Ctrl/Cmd + K`: Open search
  - `Ctrl/Cmd + N`: New course
  - `Ctrl/Cmd + /`: Show shortcuts help
  - `G then H`: Go to home
  - `G then P`: Go to profile
  - `G then G`: Go to gamification
  - `Esc`: Close modals
  - `Arrow keys`: Navigate chapters
- Show shortcuts in tooltip/help modal
- Add visual indicator when shortcut pressed
- Make configurable

**Files to Create/Modify**:
- `src/hooks/useKeyboardShortcuts.js`
- `src/components/KeyboardShortcutsDialog.jsx`
- `src/app/layout.jsx`

**Acceptance Criteria**:
- [ ] All shortcuts work
- [ ] Help dialog shows shortcuts
- [ ] Works across browsers
- [ ] No conflicts with browser shortcuts
- [ ] Visual feedback

---

### Issue #13: Add Course Preview Before Generation
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `ux`, `OSCG26`

**Problem**:
Users commit to course generation without seeing what will be created, wasting API calls.

**Proposed Solution**:
Show a preview/outline of the course before final generation.

**Implementation Details**:
- Add "Preview" button on generate form
- Generate course outline only (no full content)
- Show:
  - Estimated chapter count
  - Chapter titles
  - Topics covered
  - Estimated time
- Allow editing outline before full generation
- Add "Looks good, generate full course" button
- Use less expensive AI call for preview

**Files to Modify**:
- `src/app/generate/page.jsx`
- `src/app/api/roadmap/preview/route.js` (create)
- `src/components/CoursePreviewDialog.jsx` (create)

**Acceptance Criteria**:
- [ ] Preview generates quickly
- [ ] Shows accurate outline
- [ ] Can edit before generation
- [ ] Saves API costs
- [ ] Good UX flow

---

### Issue #14: Add Bulk Actions for Courses
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `productivity`, `OSCG26`

**Problem**:
Users cannot perform actions on multiple courses at once (delete, archive, export).

**Proposed Solution**:
Add checkbox selection and bulk action menu.

**Implementation Details**:
- Add checkbox to each course card
- "Select All" checkbox
- Bulk actions menu:
  - Delete selected
  - Archive selected
  - Export selected
  - Add tags to selected
- Show selection count
- Confirmation dialog for destructive actions
- Keyboard shortcuts (Shift+Click for range select)

**Files to Modify**:
- `src/app/roadmap/page.jsx`
- `src/components/Home/RoadMap.jsx`
- `src/app/api/roadmap/bulk/route.js` (create)

**Acceptance Criteria**:
- [ ] Selection works smoothly
- [ ] All bulk actions functional
- [ ] Confirmation dialogs
- [ ] Undo option
- [ ] Performance with many courses

---

### Issue #15: Add Course Archiving Feature
**Difficulty**: Easy  
**Category**: Feature  
**Labels**: `enhancement`, `organization`, `OSCG26`

**Problem**:
Users can only delete courses, not archive them for later reference.

**Proposed Solution**:
Add archive functionality to hide courses without deleting them.

**Implementation Details**:
- Add "Archive" option in course menu
- Archived courses hidden from main view
- Add "Archived Courses" section/tab
- Can unarchive courses
- Archive status in Firestore
- Filter: Active | Archived | All
- Archive doesn't count toward course limit

**Files to Modify**:
- `src/app/roadmap/page.jsx`
- `src/components/Home/DeleteRoadmap.jsx` (rename to CourseActions)
- `src/app/api/roadmap/[id]/route.js`

**Acceptance Criteria**:
- [ ] Archive button works
- [ ] Archived view accessible
- [ ] Unarchive works
- [ ] Doesn't count in limits
- [ ] Bulk archive

---

### Issue #16: Add Course Rating and Review System
     
**Category**: Feature  
**Labels**: `enhancement`, `social`, `community`, `OSCG26`

**Problem**:
Users cannot rate or review courses, making it hard to identify quality content.

**Proposed Solution**:
Implement a rating and review system for courses.

**Implementation Details**:
- 5-star rating system
- Written reviews (optional)
- Rate after completing course
- Show average rating on course cards
- Review moderation
- Helpful/not helpful votes on reviews
- Sort reviews (most helpful, newest, highest/lowest)
- Report inappropriate reviews
- Store in Firestore

**Files to Create/Modify**:
- `src/app/api/reviews/route.js`
- `src/components/ReviewDialog.jsx`
- `src/components/ReviewsList.jsx`
- `src/app/roadmap/[id]/page.jsx`

**Acceptance Criteria**:
- [ ] Rating submission works
- [ ] Reviews display properly
- [ ] Average rating calculated
- [ ] Moderation system
- [ ] Helpful votes work
- [ ] Mobile responsive

---

### Issue #17: Add Course Recommendations Based on History
**Difficulty**: Hard  
**Category**: Feature (AI)  
**Labels**: `enhancement`, `ai`, `personalization`, `OSCG26`

**Problem**:
Users don't get personalized course recommendations based on their learning history.

**Proposed Solution**:
Use AI to recommend courses based on completed courses and interests.

**Implementation Details**:
- Analyze user's completed courses
- Extract topics and patterns
- Use Gemini AI for recommendations
- Show "Recommended for You" section
- Consider:
  - Completed courses
  - Bookmarked chapters
  - Time spent on topics
  - Skill level progression
- Update recommendations weekly
- Allow feedback (not interested, already know)

**Files to Create/Modify**:
- `src/app/api/recommendations/route.js`
- `src/components/RecommendedCourses.jsx`
- `src/app/roadmap/page.jsx`

**Acceptance Criteria**:
- [ ] Recommendations relevant
- [ ] Updates periodically
- [ ] Feedback mechanism
- [ ] Performance optimized
- [ ] Premium feature

---

### Issue #18: Add Course Collaboration Feature
**Difficulty**: Hard  
**Category**: Feature  
**Labels**: `enhancement`, `collaboration`, `social`, `OSCG26`

**Problem**:
Users cannot collaborate on courses or learn together with friends.

**Proposed Solution**:
Add collaborative learning features for groups.

**Implementation Details**:
- Create study groups
- Invite friends to courses
- Shared progress tracking
- Group chat/discussion
- Collaborative notes
- Group challenges
- Leaderboard within group
- Study sessions scheduling
- Real-time presence indicators

**Files to Create/Modify**:
- `src/app/api/groups/route.js`
- `src/app/groups/page.jsx`
- `src/components/GroupChat.jsx`
- `src/components/GroupProgress.jsx`

**Acceptance Criteria**:
- [ ] Group creation works
- [ ] Invites functional
- [ ] Chat real-time
- [ ] Progress syncs
- [ ] Privacy controls
- [ ] Mobile support

---

### Issue #19: Add Voice-to-Text for Course Generation
**Difficulty**: Medium  
**Category**: Feature (Accessibility)  
**Labels**: `enhancement`, `accessibility`, `ai`, `OSCG26`

**Problem**:
Users must type course prompts, which is slow and not accessible for all users.

**Proposed Solution**:
Add voice input option for course generation prompts.

**Implementation Details**:
- Add microphone button on generate form
- Use Web Speech API or Gemini Audio API
- Convert speech to text
- Support multiple languages
- Show real-time transcription
- Edit transcription before submitting
- Handle background noise
- Privacy notice for voice data

**Files to Modify**:
- `src/app/generate/page.jsx`
- `src/components/VoiceInput.jsx` (create)
- `src/app/api/ai/speech-to-text/route.js` (create)

**Acceptance Criteria**:
- [ ] Voice input works
- [ ] Accurate transcription
- [ ] Multiple languages
- [ ] Edit before submit
- [ ] Privacy compliant
- [ ] Mobile support

---

### Issue #20: Add Course Templates Library
**Difficulty**: Medium  
**Category**: Feature  
**Labels**: `enhancement`, `templates`, `productivity`, `OSCG26`

**Problem**:
Users start from scratch every time, even for common course types.

**Proposed Solution**:
Create a library of pre-made course templates.

**Implementation Details**:
- Template categories:
  - Programming (Web Dev, Python, etc.)
  - Mathematics (Algebra, Calculus)
  - Languages (Spanish, French)
  - Business (Marketing, Finance)
  - Science (Physics, Chemistry)
- Template includes:
  - Course structure
  - Chapter outlines
  - Suggested topics
  - Learning objectives
- One-click course creation from template
- Customize after selection
- Community-contributed templates
- Template preview

**Files to Create/Modify**:
- `src/app/templates/page.jsx`
- `src/app/api/templates/route.js`
- `src/components/TemplateGallery.jsx`
- `src/lib/course-templates.js`

**Acceptance Criteria**:
- [ ] Template library accessible
- [ ] Preview works
- [ ] One-click creation
- [ ] Customization options
- [ ] Community submissions
- [ ] Search/filter templates

---

