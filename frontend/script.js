// Dynamic top navigation bar display
const tabs = document.querySelectorAll(".nav-tab")
const currentFile = window.location.pathname.split('/').pop();

for (let i = 0; i < tabs.length; i++){
    const href = tabs[i].getAttribute("href");
    const isActive = (href === currentFile || (currentFile === "" && href === "index.html"));

    // Apply permanent styles of this is the active tab
    if (isActive) {
        tabs[i].style.textDecoration = "underline";
        tabs[i].style.textDecorationThickness = "3px";
        tabs[i].style.textUnderlineOffset = "21px";
        tabs[i].style.textShadow = "0 0 10px rgba(255, 255, 255, 0.6)";
    }

    // Add hover effect on mouseover
    tabs[i].addEventListener("mouseover", function(){
        this.style.textDecoration = "underline";
        this.style.textDecorationThickness = "3px";
        this.style.textUnderlineOffset = "21px";
        this.style.textShadow = "0 0 10px rgba(255, 255, 255, 0.6)";
    })

    // Remove hover styles on mouseout (unless it's the active tab)
    tabs[i].addEventListener("mouseout", function(){
        if (!isActive) {
            this.style.textDecoration = "none";
            this.style.textDecorationThickness = "";
            this.style.textUnderlineOffset = "";
            this.style.textShadow = "none";
        }
    })
}

// Room Booking form validation
const form = document.getElementById("roomBookingForm");

if (form) {
  const status = document.getElementById("bookingStatus");

  form.addEventListener("submit", async function(e){
    e.preventDefault();
    
    // Get all the form field values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const room = document.getElementById("requestedRoom").value;
    const date = document.getElementById("bookingDate").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;
    
    
    // Let backend perform final validation and return the message.
    try {
      const response = await fetch("http://localhost:8080/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          email,
          requestedRoom: room,
          bookingDate: date,
          startTime: start,
          endTime: end
        })
      });

      const message = await response.text();
      let bookingStatus = "declined";
      if (response.ok) {
        bookingStatus = "confirmed";
      }
      const redirectUrl = `http://localhost:8080/booking-result?status=${bookingStatus}&message=${encodeURIComponent(message)}`;
      window.location.href = redirectUrl;
    } catch (error) {
      status.textContent = "Unable to reach backend server.";
      status.style.color = "#b00020";
    }
  });
}
