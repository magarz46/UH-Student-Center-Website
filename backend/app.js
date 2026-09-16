const express = require("express");
const cors = require("cors");

const app = express();

// Parse JSON/form bodies and allow browser requests from frontend.
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// bookings grouped by room name
const roomSchedule = {};

// Convert HH:MM to minutes so time ranges can be compared safely.
function toMinutes(time) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
}

// POST route for booking form
app.post("/bookings", (req, res) => {
  const fullName = (req.body.fullName || "").trim();
  const email = (req.body.email || "").trim();
  const room = req.body.requestedRoom || "";
  const date = req.body.bookingDate || "";
  const start = req.body.startTime || "";
  const end = req.body.endTime || "";

  console.log("Form Data:", { fullName, email, room, date, start, end });


  // 1) Required fields
  if (!fullName || !email || !room || !date || !start || !end) {
    return res.status(400).send("Please complete all fields.");
  }

  // 2) Basic time order
  if (toMinutes(start) >= toMinutes(end)) {
    return res.status(400).send("End time must be later than start time.");
  }

  // 3) Conflict check: reject when requested range overlaps an existing booking.
  const bookings = roomSchedule[room] || [];

  for (let i = 0; i < bookings.length; i += 1) {
    const booking = bookings[i];

    if (booking.date === date) {
      const startConflict = toMinutes(start) < toMinutes(booking.end);
      const endConflict = toMinutes(end) > toMinutes(booking.start);

      if (startConflict && endConflict) {
        return res.status(409).send(`${room} is unavailable, please choose a different time.`);
      }
    }
  }

  bookings.push({ date, start, end, fullName, email });
  roomSchedule[room] = bookings;

  return res.status(200).send(`${room} is reserved for ${date} at ${start} hrs.`);
});

// GET route that serves a simple booking confirmation/decline web page
app.get("/booking-result", (req, res) => {

  // status/message come from query params set by frontend redirect.
  let status = "declined";
  if (req.query.status === "confirmed") {
    status = "confirmed";
  }

  let message = req.query.message;
  if (!message) {
    if (status === "confirmed") {
      message = "Booking confirmed.";
    } else {
      message = "Booking declined.";
    }
  }

  let heading = "Booking Declined";
  let headingColor = "#b00020";
  if (status === "confirmed") {
    heading = "Booking Confirmed";
    headingColor = "#156c2f"
  }

  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Booking Result</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 2rem; background-color: #f7fafc; color: #1f2937;">
     <div style="max-width: 600px; padding: 1.25rem; border: 1px solid #d1d5db; border-radius: 10px; background: white;">
      <h1 style="color: ${headingColor}; margin-top: 0;">${heading}</h1>
      <p>${message}</p>
      <a href="http://localhost:5500/frontend/room-booking.html">Back to booking form</a>
    </body>
    </html>
  `);
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});