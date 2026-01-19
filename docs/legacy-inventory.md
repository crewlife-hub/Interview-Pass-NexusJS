# Legacy Interview Pass - System Inventory

## Overview

This document provides a detailed inventory of the **original Interview Pass** Google Apps Script codebase located in `/legacy/interview-pass-old/`. This is a **read-only snapshot** used as reference during the NexusJS migration.

---

## Folder Structure

```
legacy/interview-pass-old/
├── .git/                       (Git repository)
├── .clasp.json                 (Apps Script project config)
├── .gitignore
├── README.md                   (Original setup docs)
├── CLASP_CONNECTION_GUIDE.md   (Apps Script connection guide)
├── SETUP_GOOGLE_CLOUD.ps1      (PowerShell setup script)
├── SETUP_GOOGLE_CLOUD.sh       (Bash setup script)
├── STATUS.txt                  (Project status)
├── PHASE_0_COMPLETE.txt        (Phase 0 completion summary)
├── src/                        (13 .gs files synced with Apps Script)
│   ├── appsscript.json         (Apps Script manifest)
│   ├── Code.gs                 (Main entry: doGet, doPost)
│   ├── Router.gs               (Page routing, HTML rendering)
│   ├── Config.gs               (Central configuration)
│   ├── SheetIDs.gs             (Smartsheet IDs - LOCKED)
│   ├── BrandConfig.gs          (Brand settings, templates, colors)
│   ├── UIConfig.gs             (UI constants, z-index, colors)
│   ├── SmartsheetAPI.gs        (Smartsheet CRUD operations)
│   ├── GoogleSheetsAPI.gs      (Logging sheet operations)
│   ├── GmailAPI.gs             (Email sending)
│   ├── CalendarAPI.gs          (Google Calendar integration)
│   ├── LoggingService.gs       (Logging infrastructure)
│   └── EmailTemplates.gs       (Email templates by brand)
├── Config/                     (Deprecated - old structure)
├── API/                        (Deprecated - old structure)
└── package.json                (For clasp tool)
```

---

## Key Technologies

- **Language**: Google Apps Script (JavaScript)
- **Frontend**: HTML + CSS + JavaScript (embedded in Apps Script)
- **Backend**: Google Apps Script with built-in services
- **Deployment**: Google Apps Script Web App (deployed as anyone)
- **IDE**: Google Apps Script IDE (https://script.google.com)
- **Version Control**: Git + GitHub
- **Build Tool**: clasp (CLI for Apps Script)

---

## Core Modules & Features

### 1. **Code.gs** (Main Entry Point)
- `doGet(e)` – Handles all HTTP GET requests
- `doPost(e)` – Handles POST requests (form submissions, API calls)
- `initializeApplication()` – Sets up sheets and configs on first run
- `testApplicationSetup()` – Verifies all modules are loaded

**Key Exports:**
```javascript
function doGet(e) {
  const page = e.parameter.page || 'login';
  return Router.route(page);
}

function doPost(e) {
  const action = e.parameter.action;
  return Router.handleAction(action, JSON.parse(e.postData.contents));
}
```

### 2. **Router.gs** (Routing & Page Rendering)
- Routes requests to appropriate page handlers
- Renders HTML for each page
- Pages include:
  - `renderLogin()` – Login page with Google OAuth placeholder
  - `renderDashboard()` – Dashboard (Phase 5)
  - `renderCandidateWorkspace()` – Candidate portal (Phase 6)
  - `renderFollowUpCenter()` – Follow-up management (Phase 7)
  - `renderAnalytics()` – Analytics (Phase 9)

**Structure:**
```javascript
const Router = {
  route: function(page) { ... },
  handleAction: function(action, data) { ... },
  renderLogin: function() { ... },
  // ... more pages
};
```

### 3. **Config.gs** (Central Configuration)
- App metadata: name, version, company
- Google Sheets logging IDs
- Logging tab names
- Script ID and deployment info

**Key Constants:**
```javascript
const CONFIG = {
  APP_NAME: 'Interview Pass',
  APP_VERSION: '1.0.0',
  COMPANY: 'Crew Life at Sea',
  LOGGING_SPREADSHEET_ID: '1vJ4qiy4p6lOhV5OOdU9BtV9yxSSUXgGSxiqjtopNLyw',
  LOGGING_TABS: {
    MAIN: 'Main',
    KPI_CONFIG: 'KPI_Config',
    KPI_DASHBOARD: 'KPI_Dashboard',
    RECRUITER_SUMMARY: 'Recruiter_Summary',
    BRAND_SUMMARY: 'Brand_Summary',
    DAILY_TREND: 'Daily_Trend'
  }
};
```

### 4. **SheetIDs.gs** (Smartsheet IDs - LOCKED)
- Contains sensitive Smartsheet IDs for three brands
- **NEVER modify** without updating production Smartsheet access
- IDs for: bookings, failed interviews, sent to client sheets

**Brands:**
- SEACHEFS
- COSTA
- RCG

**Example:**
```javascript
function getBookingSheetId(brandId) {
  const BRAND_SHEET_IDS = {
    SEACHEFS: { bookings: '...' },
    COSTA: { bookings: '...' },
    RCG: { bookings: '...' }
  };
  return BRAND_SHEET_IDS[brandId].bookings;
}
```

### 5. **BrandConfig.gs** (Brand-Specific Settings)
- Color schemes (primary, accent, backgrounds)
- Email sender names and signatures
- Interview checklist templates
- Position categories (chef, sous chef, etc.)

**Structure:**
```javascript
const BRAND_CONFIG = {
  SEACHEFS: {
    id: 'SEACHEFS',
    name: 'SeaChefs',
    displayName: 'SeaChefs Yacht Catering',
    colors: {
      primary: '#2563EB',
      primaryLight: '#DBEAFE',
      primaryDark: '#1E40AF',
      accent: '#F59E0B',
      background: '#FEF3C7'
    },
    email: { ... },
    interviewChecklist: [ ... ],
    positions: [ ... ]
  },
  // ... COSTA, RCG
};
```

### 6. **UIConfig.gs** (UI Constants)
- Font families, sizes, weights
- Spacing units (padding, margin, gap)
- Transition timings
- Z-index layering
- Color palette

### 7. **SmartsheetAPI.gs** (Smartsheet Integration)
- CRUD operations for candidate records
- Read/write from Smartsheet sheets
- Filter and search candidates
- Track interview status

**Key Functions:**
```javascript
function getSheetData(sheetId)
function appendRowToSheet(sheetId, rowData)
function updateSheetRow(sheetId, rowId, updateData)
function searchSheetByControl(controlNumber)
function getSheetColumns(sheetId)
```

**Note:** Uses Smartsheet REST API via `UrlFetchApp.fetch()`

### 8. **GoogleSheetsAPI.gs** (Logging Infrastructure)
- Append log entries to Google Sheets
- Read logs with filters
- Update KPI dashboard tab
- Update recruiter/brand summary tabs
- Update daily trend data

**Key Functions:**
```javascript
function appendLogEntry(logEntry) { ... }
function readLogs(filters) { ... }
function updateKPIDashboard(kpiData) { ... }
function updateRecruiterSummary(recruiterData) { ... }
function ensureAllTabsExist() { ... }
```

**Logging Columns (22 total):**
1. Timestamp
2. User ID / Email
3. Action (e.g., "Interview Started")
4. Control Number (candidate ID)
5. Candidate Name
6. Position
7. Brand
8. Interview Date/Time
9. Status (scheduled, completed, failed, no-show)
10. Recruiter Name
11. Meeting Link
12. Duration
13. Notes
14. File/Module (e.g., "SmartsheetAPI")
15. Error Message (if any)
16. Browser/Device Info
17. IP Address
18. Session ID
19. Page Visited
20. Action Details (JSON)
21. Environment (dev/prod)
22. Additional Metadata (JSON)

### 9. **GmailAPI.gs** (Email Operations)
- Send interview invitations
- Send follow-up emails
- Use email templates from `EmailTemplates.gs`
- Support for HTML emails with branding

**Key Functions:**
```javascript
function sendInterviewInvite(interviewData) { ... }
function sendFollowUpEmail(candidateEmail, templateId) { ... }
function sendTranscriptEmail(interviewId, transcript) { ... }
```

### 10. **CalendarAPI.gs** (Google Calendar Integration)
- Create calendar events for interviews
- Read upcoming interviews
- Update/delete events
- Extract Google Meet links from events

**Key Functions:**
```javascript
function getCalendarEvents(startDate, endDate) { ... }
function getTodaysInterviews() { ... }
function createInterviewEvent(interviewData) { ... }
function updateInterviewEvent(eventId, updates) { ... }
function deleteInterviewEvent(eventId) { ... }
function getUpcomingInterviews(hours) { ... }
function isInterviewEvent_(event) { ... }
```

**Event Structure:**
```javascript
{
  id: event.getId(),
  title: 'Interview: Jane Doe - Executive Chef',
  description: 'Candidate info, position, notes...',
  startTime: Date,
  endTime: Date,
  location: String,
  guests: [ { email, status }, ... ],
  meetingLink: 'https://meet.google.com/...'
}
```

### 11. **LoggingService.gs** (Logging Service)
- Structured logging with levels (info, warn, error)
- Never blocks main action (async/fire-and-forget)
- Logs to Google Sheets via `GoogleSheetsAPI`
- Includes request IDs, timestamps, context

**Key Functions:**
```javascript
function log(level, message, context) { ... }
function logError(errorMsg, context) { ... }
```

### 12. **EmailTemplates.gs** (Email Templates)
- Brand-specific templates for all emails
- HTML formatting with inline CSS
- Placeholder support: {{name}}, {{date}}, {{position}}, {{link}}, etc.

**Template Types:**
- Interview Invite
- Interview Reminder (24h, 1h before)
- Interview Completed
- Transcript Sent
- Rejection Email
- Follow-up Email

**Example:**
```javascript
const EMAIL_TEMPLATES = {
  SEACHEFS: {
    INTERVIEW_INVITE: {
      subject: 'Interview Invitation - {{position}} - SeaChefs',
      body: `<html>...<p>Dear {{candidateName}},</p>...</html>`
    },
    // ... more templates
  }
};
```

---

## Authentication & Security

### Current Approach
- **No formal auth yet** (Phase 2 will add Google OAuth)
- Web app deployed "as anyone" (anyone can access)
- Uses Google user context: `Session.getActiveUser()`
- Smartsheet API token stored in environment (not in code)

### Token Storage
- Apps Script `PropertiesService` for secrets
- Environment variables via `.clasp.json` or Cloud Build

---

## Data Flows

### Interview Scheduling Flow
```
1. User opens Interview Pass web app
2. Router.renderDashboard() shows upcoming interviews from CalendarAPI
3. User clicks "Create Interview" (Phase TBD)
4. SmartsheetAPI: saves candidate data
5. CalendarAPI: creates calendar event
6. GmailAPI: sends invite email to candidate
7. LoggingService: logs all actions to Google Sheets
```

### Candidate Data Flow
```
Smartsheet (source of truth for candidates)
    ↓
SmartsheetAPI (fetch via REST)
    ↓
Router (render in HTML)
    ↓
User sees candidate list
```

### Interview Results Flow
```
Interviewer completes checklist (frontend form)
    ↓
doPost() receives form data
    ↓
SmartsheetAPI: updates candidate status
    ↓
GoogleSheetsAPI: logs result to KPI Dashboard
    ↓
GmailAPI: sends transcript/results email
    ↓
LoggingService: records action
```

---

## Integrations

### Google Services Used
- **Apps Script** – Server runtime
- **Google Sheets** – Logging & analytics
- **Google Calendar** – Interview scheduling
- **Gmail** – Email sending
- **Google Cloud** – OAuth, IAM, APIs

### Third-Party APIs
- **Smartsheet REST API** – Candidate data (via `UrlFetchApp.fetch()`)

### Authentication Methods
- **Google Apps Script built-in**: `Session.getActiveUser()` (current user context)
- **OAuth 2.0**: Not yet implemented (Phase 2)
- **API Tokens**: Smartsheet token from environment

---

## Key Files to Understand

| File | Purpose | Complexity |
|------|---------|-----------|
| Code.gs | Entry point, routing | Low |
| Router.gs | Page rendering, HTML | Medium |
| BrandConfig.gs | Brand settings | Low |
| SmartsheetAPI.gs | Candidate CRUD | Medium-High |
| CalendarAPI.gs | Calendar operations | Medium |
| EmailTemplates.gs | Email content | Low |
| GoogleSheetsAPI.gs | Logging | Medium |
| LoggingService.gs | Structured logging | Low |

---

## Known Limitations

1. **No real authentication** – anyone can access
2. **No data validation** – input not validated server-side
3. **Limited error handling** – errors may not be gracefully handled
4. **No unit tests** – all manual testing
5. **Single-threaded** – no concurrent request handling
6. **Hard-coded IDs** – Smartsheet IDs are locked in code
7. **No API documentation** – limited endpoint specs
8. **No rate limiting** – could hit Google/Smartsheet limits

---

## What's Missing (To Be Built)

- Real authentication (OAuth)
- Interview checklist (completed vs pending)
- Transcript capture & storage
- AI-assisted notes
- Multi-brand dashboard views
- KPI analytics dashboard
- Candidate follow-up workflows
- SMS notifications
- Mobile app

---

## Connection Details

### Apps Script Project
- **Script ID**: 1p90IEEWhoQeQBbLi24MeRX0HGdwijcVJ82T5HGFWjzHP1--UGhOss28a
- **IDE**: https://script.google.com
- **Deployment**: Web App (deployed as crewlife@seainfogroup.com)

### Google Cloud Project
- Linked to the above Script ID
- Enable APIs: Apps Script, Calendar, Gmail, Sheets
- OAuth configured (or needs to be in Phase 2)

### Logging Spreadsheet
- **ID**: 1vJ4qiy4p6lOhV5OOdU9BtV9yxSSUXgGSxiqjtopNLyw
- **Tabs**: Main, KPI_Config, KPI_Dashboard, Recruiter_Summary, Brand_Summary, Daily_Trend

### Smartsheet Workspace
- Three brands: SEACHEFS, COSTA, RCG
- Separate sheets for bookings, failed interviews, sent to client
- API token required for access

---

## Migration Notes

### What to Keep
- Email template content (BrandConfig colors, positions, checklist items)
- Smartsheet integration logic (adapt to Node.js client library)
- Google Calendar approach (OAuth-based calendar reads)
- Brand configurations (SEACHEFS, COSTA, RCG)

### What to Replace
- HTML rendering (use React + Next.js)
- Apps Script `doGet`/`doPost` (use Next.js API routes)
- Manual sheet operations (use Google Sheets API client library)
- Client-side JavaScript (use modern React/TypeScript)

### What to Add
- Structured error handling
- Input validation (zod schemas)
- Request logging with IDs
- Unit & integration tests
- API documentation (OpenAPI/Swagger)
- Database (optional, for non-ephemeral data)

---

## Deployment (Current Legacy)

### Local Development
```bash
cd legacy/interview-pass-old
npm install -g @google/clasp
clasp login
clasp pull  # Sync from Apps Script
# Edit files in /src/
clasp push --force  # Push changes to Apps Script
```

### Production Deployment
1. Make changes locally
2. Push to Apps Script with `clasp push`
3. Go to https://script.google.com → Deploy → New Deployment
4. Type: Web App
5. Execute as: crewlife@seainfogroup.com
6. Access: Anyone
7. Get deployment URL

---

## Testing (Current Legacy)

- Manual browser testing
- Check Apps Script logs: https://script.google.com → Execution Log
- Test endpoints by visiting deployment URL with `?page=login`, etc.

---

## Support & Debugging

### View Logs
```
https://script.google.com
→ Open Interview Pass project
→ Execution Log (or View > Logs)
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Caller does not have permission" | Grant editor role in Google Cloud IAM |
| Calendar events not appearing | Check calendar ID in CalendarAPI |
| Smartsheet returns 401 | Verify Smartsheet API token in environment |
| Email not sent | Check Gmail API is enabled in GCP |

---

## References

- **Original README**: `legacy/interview-pass-old/README.md`
- **Setup Guides**: `CLASP_CONNECTION_GUIDE.md`, `SETUP_GOOGLE_CLOUD.ps1`
- **Status**: `legacy/interview-pass-old/STATUS.txt`, `PHASE_0_COMPLETE.txt`

---

**Last Updated:** January 19, 2026
**Snapshot Date:** January 19, 2026
**Repo URL:** https://github.com/crewlife-hub/Interview-Pass
**Status:** Read-only reference for NexusJS migration
