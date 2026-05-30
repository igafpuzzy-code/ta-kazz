# TA KAZZ - QA TEST CASE DOCUMENT
**Interactive Hiking Trail and Campsite Navigation System (Negros Occidental & Oriental)**  
**Date Generated:** May 30, 2026

---

## 1. Introduction
This Quality Assurance (QA) Test Case document is tailored for **TA KAZZ**, a web-based responsive trail guide application built with React, Vite, and TanStack Start. It details the functional tests required to validate user authentication (Firebase), the interactive map (Leaflet + OpenStreetMap), and detail guide pages for mountains, campsites, grasslands, farms, and waterfalls in Negros, along with user-generated CRUD content.

---

## 2. Scope
*   User registration and login (Firebase Auth)
*   Interactive Leaflet Map centering Negros Island with 12 destinations
*   Responsive navigation links and dashboard statistics
*   Detailed trail specifications (MASL elevation, difficulty, duration, highlights, localized mini-maps)
*   Session-based route guarding for protected directories (`/landing`, `/map`, `/mountains/$slug`)
*   **Hiker Reviews CRUD:** Logged-in users can write, edit, and delete their own star ratings & text reviews on trail detail pages (Firebase Firestore).
*   **Hiker Trail Photos CRUD:** Logged-in users can upload photos with a progress bar, view them in a gallery/lightbox, and delete their own uploaded photos (Firebase Storage + Firestore).

---

## 3. Test Environment
*   **Application Type:** Single Page / Server-Side Rendered Web Application (React + Vite + TanStack Start)
*   **Platform:** Responsive Desktop / Mobile Web Browsers (Chrome, Safari, Firefox, Edge)
*   **Backend Database & Auth:** Firebase Web SDK v9+ (Authentication, Firestore Database, and Storage Bucket)
*   **Map Service:** Leaflet / OpenStreetMap Tiles (No API keys required)
*   **Theme / Style:** Modern Emerald dark mode styling using Tailwind CSS

---

## 4. Functional Test Cases

| Test ID | Module | Scenario | Test Steps | Expected Result | Priority | Status | Remarks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-001** | Authentication | Create new user account | 1. Go to `/auth`<br>2. Toggle to "Sign up"<br>3. Enter display name, email, and password<br>4. Click "Sign up" | User account is created in Firebase and automatically logged in and redirected to `/landing`. | High | **Pass** | User displayName updates correctly. |
| **TC-AUTH-002** | Authentication | User login with valid credentials | 1. Go to `/auth`<br>2. Enter correct email & password<br>3. Click "Log in" | Firebase session is established, user is redirected to `/landing`, and user session/token is stored in Local Storage. | High | **Pass** | Auth state triggers page load successfully. Syncs session keys on login. |
| **TC-AUTH-003** | Authentication | Login with invalid credentials | 1. Go to `/auth`<br>2. Enter wrong password / email<br>3. Click "Log in" | Authentication fails, and a descriptive error message displays in the UI. | High | **Pass** | Red error alert displays. |
| **TC-AUTH-004** | Authentication | Access control & Route guards | 1. Log out of the system<br>2. Navigate directly to `/landing`, `/map`, or `/mountains/mt-mandalagan` | App detects lack of active session and redirects the browser back to `/auth`. | High | **Pass** | All secure routes guarded by `onAuthStateChanged`. |
| **TC-MAP-001** | Interactive Map | Map rendering & controls | 1. Navigate to `/map`<br>2. Inspect Leaflet canvas | Negros Island map loads, centered at `[10.4, 123.2]`, with all 12 marker pins visible. | High | **Pass** | Standard Leaflet zoom and drag are functional. |
| **TC-MAP-002** | Interactive Map | Marker popup interaction | 1. Click on a marker pin (e.g., *Mt. Mandalagan*) | Leaflet popup opens showing name, type, difficulty, location, and a clickable link to view guide. | Medium | **Pass** | Link triggers TanStack Router transition. |
| **TC-TRAIL-001** | Trail Details | Dynamic details rendering | 1. Navigate to `/mountains/mt-mandalagan` | Page renders header name, MASL, difficulty, duration, description, and list of highlights. | High | **Pass** | Content accurately matches the selected slug. |
| **TC-TRAIL-002** | Trail Details | Localized mini-map loading | 1. Scroll down the trail page to the Location section | Mini-map renders showing a single marker at the specific coordinates of the destination. | Medium | **Pass** | Map is centered on correct lat/lng. |
| **TC-CRUD-001** | Hiker Reviews | Write, view, edit, and delete trail review | 1. Navigate to any trail page (e.g., `/mountains/mt-mandalagan`) while logged in.<br>2. Pick a star rating, type a comment, and click "Post review".<br>3. Click "✏️ Edit" to change comment/rating and click "Save".<br>4. Click "🗑️ Delete" and confirm deletion. | Hiker review is successfully written, dynamically displayed, updated in-place, and fully deleted from both Firestore and the page. | High | **Pass** | Custom ratings average updates in real-time. |
| **TC-CRUD-002** | Trail Photos | Upload and delete trail photos | 1. Click "📷 Upload Photo" on any trail page.<br>2. Select an image file.<br>3. Check upload progress bar.<br>4. Hover on photo and click "🗑️ Delete". | Photo is uploaded to Firebase Storage and metadata is stored in Firestore. Progress bar tracks upload. Photo is removed when deleted. | High | **Pass** | High-fidelity image gallery and modal lightbox work flawlessly. |
| **TC-RESP-001** | Responsive Design | Layout viewport scaling | 1. Open app on desktop browser<br>2. Resize to mobile width (e.g. 375px) | Layout, navigation bar, grid list, and map dimensions dynamically scale and adjust without overflow. | Medium | **Pass** | Employs Tailwind's responsive breakpoints. |

---

## 5. Non-Functional Testing
*   **Performance:** Verify Leaflet tiles and images render quickly without blocking page interactions.
*   **Usability:** Color contrast checks against the dark emerald background (`bg-emerald-950`) to ensure text legibility.
*   **Session Persistence:** Verify that reloading the page while logged in does not sign the user out.

---

## 6. Bug Report Template

| Bug ID | Description | Severity | Steps to Reproduce | Assigned To | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Leaflet map markers fail to load if network connection to OpenStreetMap tiles times out. | High | 1. Open the app `/map` using slow mobile data or offline state.<br>2. Observe if background tiles render. | Frontend Developer | Open |
| **BUG-002** | Initial loading screen flicker occurs on guarded routes while Firebase Auth verifies active session. | Low | 1. Go to `/landing` directly when already signed in.<br>2. Observe a brief `Loading...` flash. | Frontend Developer | Open |

---

## 7. User Acceptance Testing (UAT)

| Requirement / User Story | Expected Result | Accepted (Yes / No) |
| :--- | :--- | :--- |
| **Hiker can view trail map** | Interactive map loads successfully with 12 Negros trail pins visible. | **Yes** |
| **Hiker can view trail details** | Selecting a guide displays name, difficulty, location, and MASL elevation. | **Yes** |
| **Hiker can search trails by type** | User can browse details by category (Mountain, Campsite, Waterfall, etc.). | **Yes** |
| **Hiker can secure their session** | Secure auth login and logout persist correctly using Firebase. | **Yes** |
| **Hiker can write and manage reviews** | Users can write, view, edit, and delete their own star ratings & text comments. | **Yes** |
| **Hiker can share trail photos** | Users can upload photos, view them in a gallery/lightbox, and delete their own photos. | **Yes** |

---

## 8. Conclusion
The QA testing process ensures that **TA KAZZ** functions properly across its core features including trail mapping, dynamic route details, responsive layouts, secure authentication, review CRUD, and photo CRUD features. All features pass validation.
