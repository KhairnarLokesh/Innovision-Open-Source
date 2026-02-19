# Assigned Issues - API Requirements Breakdown

## 📋 Your Assigned Issues (13 Total)

### Issues That Need NEW APIs ✅

#### #96 - Course Sharing Feature
**APIs Needed:**
- `POST /api/courses/public/[id]/route.js` - Make course public/private
- `GET /api/courses/public/[id]/route.js` - Fetch public course data (no auth)
- `POST /api/analytics/share/route.js` - Track share analytics (optional)

**Why:** Need to serve course data publicly without authentication

---

#### #99 - Course Duplication Feature
**APIs Needed:**
- `POST /api/roadmap/duplicate/route.js` - Duplicate course with all chapters

**Why:** Need server-side logic to copy Firestore documents

---

#### #100 - Course Export (PDF/Markdown)
**APIs Needed:**
- `POST /api/roadmap/export/route.js` - Generate PDF/Markdown from course data
- `GET /api/roadmap/export/[id]/route.js` - Download exported file

**Why:** Server-side PDF generation and file handling

---

#### #101 - Course Completion Certificate
**APIs Needed:**
- `POST /api/certificates/generate/route.js` - Generate certificate on completion
- `GET /api/certificates/[userId]/route.js` - Get user's certificates
- `GET /api/certificates/verify/[certificateId]/route.js` - Verify certificate authenticity

**Why:** Server-side certificate generation with unique IDs

---

#### #103 - Bulk Actions for Courses
**APIs Needed:**
- `POST /api/roadmap/bulk/route.js` - Handle bulk delete/archive/export
- `DELETE /api/roadmap/bulk/route.js` - Bulk delete
- `PATCH /api/roadmap/bulk/route.js` - Bulk update (archive, tags)

**Why:** Efficient batch operations on multiple courses

---

#### #104 - Course Archiving Feature
**APIs Needed:**
- `PATCH /api/roadmap/[id]/archive/route.js` - Archive/unarchive course
- Or extend existing: `PATCH /api/roadmap/[id]/route.js` - Add archive field

**Why:** Update course status in Firestore

---

#### #105 - Course Rating and Review System
**APIs Needed:**
- `POST /api/reviews/route.js` - Submit review
- `GET /api/reviews/[courseId]/route.js` - Get course reviews
- `PATCH /api/reviews/[reviewId]/route.js` - Update review
- `DELETE /api/reviews/[reviewId]/route.js` - Delete review
- `POST /api/reviews/[reviewId]/vote/route.js` - Vote helpful/not helpful
- `POST /api/reviews/[reviewId]/report/route.js` - Report review

**Why:** Full CRUD operations for reviews system

---

#### #106 - Course Recommendations (AI)
**APIs Needed:**
- `GET /api/recommendations/route.js` - Get AI-generated recommendations
- `POST /api/recommendations/feedback/route.js` - Submit feedback (not interested)

**Why:** AI analysis of user history using Gemini API

---

### Issues That DON'T Need New APIs ❌

#### #94 - Course Search and Filter
**No API needed** - Frontend only (filter existing data from `/api/roadmap/all`)

---

#### #95 - Course Progress Percentage
**No API needed** - Calculate on frontend from existing course data

---

#### #97 - Dark Mode for Code Snippets
**No API needed** - Frontend theme switching only

---

#### #98 - Estimated Time to Complete
**No API needed** - Calculate on frontend (chapters × 15 mins)

---

#### #102 - Improve Loading States
**No API needed** - UI/UX improvement only

---

## 📊 Summary

### APIs to Create: 8 Issues
1. #96 - Course Sharing (2 APIs)
2. #99 - Course Duplication (1 API)
3. #100 - Course Export (2 APIs)
4. #101 - Certificates (3 APIs)
5. #103 - Bulk Actions (3 APIs)
6. #104 - Course Archiving (1 API)
7. #105 - Rating & Reviews (6 APIs)
8. #106 - Recommendations (2 APIs)

**Total New API Endpoints: ~20**

### Frontend Only: 5 Issues
1. #94 - Search & Filter
2. #95 - Progress Percentage
3. #97 - Dark Mode Code
4. #98 - Time Estimate
5. #102 - Loading States

---

## 🎯 Recommended Order (Easiest to Hardest)

### Phase 1: Frontend Only (No APIs) ⚡
1. **#97** - Dark Mode for Code Snippets (30 mins)
2. **#98** - Estimated Time to Complete (1 hour)
3. **#95** - Course Progress Percentage (2 hours)
4. **#94** - Course Search and Filter (3 hours)
5. **#102** - Improve Loading States (2 hours)

### Phase 2: Simple APIs 🔧
6. **#104** - Course Archiving (2 hours)
7. **#99** - Course Duplication (3 hours)

### Phase 3: Medium APIs 🛠️
8. **#96** - Course Sharing (4 hours)
9. **#103** - Bulk Actions (4 hours)
10. **#100** - Course Export (5 hours)

### Phase 4: Complex APIs 🚀
11. **#101** - Certificates (6 hours)
12. **#105** - Rating & Reviews (8 hours)
13. **#106** - AI Recommendations (6 hours)

---

## 📝 Issues NOT Assigned (From MD File)

These are still available in FRESH_ISSUES.md but NOT assigned to you:

### Issue #6: Course Categories/Tags System
- **Difficulty**: Medium
- **Needs API**: Yes (`/api/roadmap/tags/route.js`)

### Issue #10: Chapter Notes Feature
- **Difficulty**: Medium
- **Needs API**: Yes (`/api/notes/route.js`)

### Issue #12: Keyboard Shortcuts
- **Difficulty**: Medium
- **Needs API**: No (Frontend only)

### Issue #13: Course Preview Before Generation
- **Difficulty**: Medium
- **Needs API**: Yes (`/api/roadmap/preview/route.js`)

### Issue #14: Already covered in #103 (Bulk Actions)

### Issue #18: Course Collaboration
- **Difficulty**: Hard
- **Needs API**: Yes (Multiple APIs for groups, chat, etc.)

### Issue #19: Voice-to-Text Input
- **Difficulty**: Medium
- **Needs API**: Yes (`/api/ai/speech-to-text/route.js`)

### Issue #20: Course Templates Library
- **Difficulty**: Medium
- **Needs API**: Yes (`/api/templates/route.js`)

---

## 🎯 Quick Start Recommendation

**Start with these 5 (No APIs needed):**
1. #97 - Dark Mode for Code Snippets
2. #98 - Estimated Time to Complete
3. #95 - Course Progress Percentage
4. #94 - Course Search and Filter
5. #102 - Improve Loading States

**Then move to simple APIs:**
6. #104 - Course Archiving
7. #99 - Course Duplication

This way you can:
- Get 5 PRs done quickly (frontend only)
- Build momentum
- Then tackle API-heavy issues

---

## 💡 Pro Tips

1. **Test APIs locally first** before creating PR
2. **Use existing API patterns** from `/api/roadmap/[id]/route.js`
3. **Add error handling** to all APIs
4. **Check premium status** where needed
5. **Update Firestore security rules** for new collections

Ready to start? Pick an issue number! 🚀
