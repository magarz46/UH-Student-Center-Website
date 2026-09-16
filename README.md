
# CIS2336 Project: UH Sugar Land Student Center Website

Semester project for CIS 2336 Web Application Development at the University of Houston. This website provides information and room booking services for the UH Sugar Land Student Center.

## Features

- **Home Page** - Simple yet elegant homepage that integrates images, quick links, and a dynamic top nav bar built with JavaScript.
- **Room Booking System** — Reserve study rooms with backend form validation and JavaScript logic.
- **FAQ Page** — Frequently asked questions about Student Center services in a collapsible format
- **AI-Assisted Development** — Built with Copilot AI assistance for structure, validation, and debugging

## Installation & Setup

### Prerequisites
- Modern Web Browser
- node.js
- VS Code
- Live Server VS Code Extension

### Running the Project

1. Open the repository using VS Code
2. Install the Live Server extension for VS Code
3. Click "Go Live" in the bottom right corner of the VS Code window.

### Running the Backend Server

1. Install node.js 
2. Open the project in VS Code
3. Navigate to /backend
4. Change directory to /backend (cd backend)
5. Type these commands in the terminal:
    ~~~
    npm init -y
    npm install express
    npm install cors
    node app.js
    ~~~
6. The server is now running, press "CTRL + C" to stop the server.    


## Project Structure

```
semester-project-magarz46/
├── frontend/
│   ├── index.html
│   ├── room-booking.html
│   ├── faq.html
│   ├── contact.html
│   ├── references.html
│   ├── script.js
│   ├── styles.css
│   └── pictures/
├── backend/
│   └── app.js
└── README.md
```

## Site Navigation

| Page | URL | Purpose |
|------|-----|---------|
| **Home** | `index.html` | Welcome and Student Center services overview |
| **Room Booking** | `room-booking.html` | Reserve study rooms with a simple booking form |
| **FAQ** | `faq.html` | Frequently asked questions |
| **Contact** | `contact.html` | Developer contact information |
| **References** | `references.html` | AI prompts and development process |

## Form Validation Rules

- **All Fields Required** — Full name, email, room selection, date, start time, and end time must be completed
- **Conflict Detection** — Checks for double-booking by comparing requested time against existing room reservations
- **Time Overlap Prevention** — Prevents booking if the requested time slots overlap with confirmed bookings for that room
- **Success Feedback** — Displays success message on successful submission
- **Error Feedback** - Displays an error message if the requested room conflicts with existing reservations

## Frontend Code

The frontend is a multi-page static site in `/frontend` built with HTML, CSS, and JavaScript.

- **HTML Pages**
    - `index.html` is the landing page and includes the site banner, service summary, image cards, and quick links to key pages.
    - `room-booking.html` contains the room list and booking form (`roomBookingForm`) with fields for name, email, room, date, start time, and end time.
    - `faq.html` uses semantic `<details>` and `<summary>` elements for expandable FAQ items.
    - `contact.html` provides developer contact details.
    - `references.html` documents AI-assisted development prompts and outcomes.

- **Shared JavaScript (`script.js`)**
    - Controls dynamic navigation highlighting by checking the current page filename and applying underline/shadow styles to the active tab.
    - Adds hover effects to navigation links.
    - Handles room-booking form submission with `fetch()` to `http://localhost:8080/bookings`.
    - Prevents default form behavior, gathers form values, sends JSON to the backend, and reads the backend response text.
    - Redirects users to `http://localhost:8080/booking-result` with query parameters (`status` and `message`) so users see a confirmation/decline result page.
    - Displays a fallback error message (`Unable to reach backend server.`) if the backend is unavailable.

- **Styling (`styles.css`)**
    - Uses CSS custom properties (`:root`) for theme colors, making it easier to keep styles consistent.
    - Defines reusable layout classes such as `.container`, `.outline-block`, and `.outline-grid` for consistent page structure.
    - Styles page-specific components including image cards, room cards, booking form fields, and submit buttons.



## Backend Code

The backend is an Express server in `/backend/app.js` that receives booking requests and performs validation/conflict checks.

- **Server Setup**
    - Uses `express` for routing and request handling.
    - Uses `cors` so frontend pages served from a different local origin (Live Server) can call backend endpoints.
    - Enables `express.urlencoded()` and `express.json()` to parse form/JSON data.

- **In-Memory Booking Store**
    - `roomSchedule` is an object keyed by room name.
    - Each room stores an array of booking records with `date`, `start`, `end`, `fullName`, and `email`.

- **Time Comparison Utility**
    - `toMinutes(time)` converts `HH:MM` strings to total minutes.
    - This allows reliable numeric comparison when validating start/end times and overlap checks.

- **POST `/bookings` Route**
    - Reads and normalizes form input from the request body.
    - Validates required fields. If any are missing, responds with HTTP 400 and an error message.
    - Validates time order (`start < end`). Invalid ranges return HTTP 400.
    - Checks booking conflicts using overlap logic:
        - requested start is before an existing booking's end.
        - requested end is after an existing booking's start.
    - If overlap exists, responds with HTTP 409 (conflict).
    - If no conflict, saves the booking in `roomSchedule` and returns HTTP 200 with a confirmation message.

- **GET `/booking-result` Route**
    - Returns a simple HTML page that displays booking status and message.
    - Uses query parameters (`status`, `message`) sent by the frontend redirect.
    - Applies different heading text/colors for confirmed vs declined requests.

- **Runtime**
    - Server listens on port `8080` and logs startup URL to the console.

## Author

**Michael Anthony Garza**  
CIS 2336 Semester Project  
Spring 2026