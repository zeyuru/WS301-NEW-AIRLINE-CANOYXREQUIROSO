
// FLIGHT DATA

const oneWayFlights = [
  { flightNo: "5J 560", from: "MNL", to: "CEB", departDate: "2025-10-21", time: "08:00 AM", hours: "1h 15m", price: 2499, seats: 20, fare: "Promo Fare", terminal: "Terminal 3" },
  { flightNo: "5J 561", from: "MNL", to: "DVO", departDate: "2025-10-22", time: "02:30 PM", hours: "2h 00m", price: 2999, seats: 25, fare: "Regular", terminal: "Terminal 2" },
  { flightNo: "5J 562", from: "CEB", to: "MNL", departDate: "2025-10-23", time: "09:00 AM", hours: "1h 20m", price: 2599, seats: 22, fare: "Regular", terminal: "Terminal 1" },
  { flightNo: "5J 563", from: "MNL", to: "CEB", departDate: "2025-10-21", time: "11:00 AM", hours: "1h 25m", price: 2399, seats: 18, fare: "Promo Fare", terminal: "Terminal 3" },
  { flightNo: "5J 564", from: "MNL", to: "CEB", departDate: "2025-10-21", time: "03:00 PM", hours: "1h 20m", price: 2799, seats: 15, fare: "Regular", terminal: "Terminal 2" },
  { flightNo: "5J 565", from: "MNL", to: "CEB", departDate: "2025-10-21", time: "06:00 PM", hours: "1h 15m", price: 2199, seats: 10, fare: "Promo Fare", terminal: "Terminal 1" }
];

const roundTripFlights = [
  { flightNo: "5J 700", from: "MNL", to: "CEB", departTime: "07:00 AM", returnTime: "05:00 PM", departDate: "2025-10-21", returnDate: "2025-10-28", price: 4999, seats: 25, hours: "1h 20m", fare: "Regular", terminal: "Terminal 3" },
  { flightNo: "5J 701", from: "CEB", to: "DVO", departTime: "08:30 AM", returnTime: "06:30 PM", departDate: "2025-10-22", returnDate: "2025-10-29", price: 5599, seats: 18, hours: "1h 45m", fare: "Promo Fare", terminal: "Terminal 2" },
  { flightNo: "5J 702", from: "MNL", to: "ILO", departTime: "09:15 AM", returnTime: "04:30 PM", departDate: "2025-10-23", returnDate: "2025-10-30", price: 4799, seats: 20, hours: "1h 00m", fare: "Regular", terminal: "Terminal 1" },
  { flightNo: "5J 703", from: "MNL", to: "CEB", departTime: "10:00 AM", returnTime: "08:00 PM", departDate: "2025-10-21", returnDate: "2025-10-28", price: 4299, seats: 15, hours: "1h 15m", fare: "Promo Fare", terminal: "Terminal 2" },
  { flightNo: "5J 704", from: "MNL", to: "CEB", departTime: "01:30 PM", returnTime: "07:30 PM", departDate: "2025-10-21", returnDate: "2025-10-28", price: 4899, seats: 22, hours: "1h 20m", fare: "Regular", terminal: "Terminal 3" }
];


// PAGE HANDLER

const page = window.location.pathname.split("/").pop();

if (page === "booking.html") initBooking();
if (page === "select.html") initSelect();
if (page === "passenger.html") initPassenger();
if (page === "success.html") initSuccess();


// BOOKING PAGE

function initBooking() {
  const flightType = document.getElementById("flightType");
  const returnDiv = document.getElementById("returnDiv");

  flightType.addEventListener("change", () => {
    returnDiv.style.display = (flightType.value === "oneway") ? "none" : "block";
  });

  document.getElementById("searchFlights").addEventListener("click", () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const type = document.getElementById("flightType").value;
    const depart = document.getElementById("departDate").value;
    const ret = document.getElementById("returnDate").value;
    const passengers = document.getElementById("passengers").value;

    if (!from || !to) return alert("Please select origin and destination.");
    if (from === to) return alert("Origin and destination cannot be the same.");
    if (!depart) return alert("Please select a departure date.");
    if (type === "round" && !ret) return alert("Please select a return date.");
    if (passengers < 1 || passengers > 9) return alert("Passengers must be between 1 and 9.");

    const flightData = { from, to, type, depart, ret, passengers };
    localStorage.setItem("flightData", JSON.stringify(flightData));
    window.location.href = "select.html";
  });
}


// SELECT FLIGHT PAGE

function initSelect() {
  const data = JSON.parse(localStorage.getItem("flightData"));
  const container = document.getElementById("flightsContainer");
  const title = document.getElementById("selectTitle");
  const proceedBtn = document.getElementById("proceedToPassenger");
  const backBtn = document.getElementById("backToBooking");

  if (!data) {
    window.location.href = "booking.html";
    return;
  }

  title.textContent = `${data.type === "round" ? "Round Trip" : "One Way"} Flights: ${data.from} → ${data.to}`;

  
  const filterContainer = document.createElement("div");
  filterContainer.style.display = "flex";
  filterContainer.style.justifyContent = "flex-end";
  filterContainer.style.marginBottom = "12px";
  filterContainer.innerHTML = `
    <div class="fare-toggle">
      <span style="margin-right:10px;font-weight:bold;">Filter Fare:</span>
      <button class="fare-btn active" data-fare="all">All</button>
      <button class="fare-btn" data-fare="Regular">Regular</button>
      <button class="fare-btn" data-fare="Promo Fare">Promo Fare</button>
    </div>
  `;
  container.parentNode.insertBefore(filterContainer, container);


  const style = document.createElement("style");
  style.textContent = `
    .fare-btn {
      background: #f0f0f0;
      border: none;
      padding: 6px 14px;
      margin-left: 6px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.2s;
    }
    .fare-btn:hover { background: #e2e2e2; }
    .fare-btn.active {
      background: #0072CE;
      color: white;
      box-shadow: 0 0 4px rgba(0,0,0,0.2);
    }
    .original-price {
      text-decoration: line-through;
      color: #777;
      margin-right: 6px;
      font-size: 14px;
    }
    .discounted-price {
      color: #0072CE;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  function renderFlights(selectedFare = "all") {
    container.innerHTML = "";
    const flights = data.type === "oneway" ? oneWayFlights : roundTripFlights;
    const available = flights.filter(f => {
      const matchFare = selectedFare === "all" || f.fare === selectedFare;
      if (data.type === "oneway") {
        return f.from === data.from && f.to === data.to && f.departDate === data.depart && matchFare;
      } else {
        return f.from === data.from && f.to === data.to && f.departDate === data.depart && f.returnDate === data.ret && matchFare;
      }
    });

    if (available.length === 0) {
      container.innerHTML = `<div class="no-flights">No available flights found for this selection.</div>`;
      return;
    }

    available.forEach(f => {
      const div = document.createElement("div");
      div.classList.add("flight-card");

      
      let priceHTML;
      if (f.fare === "Promo Fare") {
        const originalPrice = Math.round(f.price * 1.15);
        priceHTML = `
          <span class="original-price">₱${originalPrice.toLocaleString()}</span>
          <span class="discounted-price">₱${f.price.toLocaleString()}</span>
        `;
      } else {
        priceHTML = `<b>₱${f.price.toLocaleString()}</b>`;
      }

      div.innerHTML = `
        <div class="left"><b>${f.flightNo}</b><br>${f.from} → ${f.to}</div>
        <div class="details">
          <p><b>Departure:</b> ${f.departDate} (${f.departTime || f.time})</p>
          ${f.returnDate ? `<p><b>Return:</b> ${f.returnDate} (${f.returnTime})</p>` : ""}
          <p><b>Duration:</b> ${f.hours}</p>
          <p><b>Terminal:</b> ${f.terminal}</p>
          <p><b>Seats:</b> ${f.seats}</p>
          <p><b>Fare:</b> ${f.fare}</p>
          <p><b>Price:</b> ${priceHTML}</p>
        </div>
        <div class="action">
          <button class="btn-primary selectBtn">Select Flight</button>
        </div>
      `;
      container.appendChild(div);

      div.querySelector(".selectBtn").addEventListener("click", () => {
        document.querySelectorAll(".flight-card").forEach(c => c.classList.remove("selected"));
        div.classList.add("selected");
        localStorage.setItem("selectedFlight", JSON.stringify(f));
        proceedBtn.disabled = false;
      });
    });
  }

  renderFlights();

  
  const buttons = document.querySelectorAll(".fare-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFlights(btn.dataset.fare);
    });
  });

  backBtn.addEventListener("click", () => window.location.href = "booking.html");
  proceedBtn.addEventListener("click", () => {
    if (!localStorage.getItem("selectedFlight")) {
      alert("Please select a flight first.");
      return;
    }
    window.location.href = "passenger.html";
  });
}


// PASSENGER PAGE

function initPassenger() {
  const flightData = JSON.parse(localStorage.getItem("flightData"));
  const passengerDiv = document.getElementById("passengerFormWrap");
  const submitBtn = document.getElementById("submitPassengers");
  const editBtn = document.getElementById("editFlights");

  if (!flightData) {
    alert("No booking details found. Returning to booking page.");
    window.location.href = "booking.html";
    return;
  }

  const passengerCount = parseInt(flightData.passengers) || 1;
  passengerDiv.innerHTML = "";

  for (let i = 1; i <= passengerCount; i++) {
    passengerDiv.innerHTML += `
      <div class="passenger-block">
        <h3>Passenger ${i}</h3>
        <label>Full Name:</label><input type="text" class="pname" required>
        <label>Passport No.:</label><input type="text" class="ppassport" required>
        <label>Nationality:</label><input type="text" class="pnationality" required>
        <label>Date of Birth:</label><input type="date" class="pdob" required>
        <label>Phone:</label><input type="text" class="pphone" required>
        <label>Email:</label><input type="email" class="pemail" required>
      </div>
    `;
  }

  editBtn.addEventListener("click", () => window.location.href = "select.html");

  submitBtn.addEventListener("click", () => {
    const names = document.querySelectorAll(".pname");
    const passports = document.querySelectorAll(".ppassport");
    const emails = document.querySelectorAll(".pemail");

    for (let i = 0; i < passengerCount; i++) {
      if (!names[i].value.trim() || !passports[i].value.trim() || !emails[i].value.trim()) {
        alert(`Please complete all fields for Passenger ${i + 1}.`);
        return;
      }
    }

    const passengers = [];
    for (let i = 0; i < passengerCount; i++) {
      passengers.push({
        name: names[i].value.trim(),
        passport: passports[i].value.trim(),
        nationality: document.querySelectorAll(".pnationality")[i].value.trim(),
        dob: document.querySelectorAll(".pdob")[i].value.trim(),
        phone: document.querySelectorAll(".pphone")[i].value.trim(),
        email: emails[i].value.trim()
      });
    }

    localStorage.setItem("passengerData", JSON.stringify(passengers));
    window.location.href = "success.html";
  });
}


// SUCCESS PAGE

function initSuccess() {
  const flight = JSON.parse(localStorage.getItem("selectedFlight"));
  const passengers = JSON.parse(localStorage.getItem("passengerData"));
  const content = document.getElementById("successContent");
  const bookBtn = document.getElementById("bookNow");

  if (!flight || !passengers) {
    alert("Missing booking data. Redirecting...");
    window.location.href = "booking.html";
    return;
  }

  const totalPassengers = passengers.length;
  let totalPrice = flight.price * totalPassengers;

  // Build passenger list (no discounts)
  let passengerHTML = "<ul>";
  passengers.forEach((p) => {
    passengerHTML += `
      <li>
        <b>${p.name}</b> — ${p.passport} (${p.nationality})<br>
        <b>Fare:</b> ₱${flight.price.toLocaleString()}
      </li>
    `;
  });
  passengerHTML += "</ul>";

  // Flight summary
  let html = `
    <h3>Flight Summary</h3>
    <p><b>Flight:</b> ${flight.flightNo} — ${flight.from} → ${flight.to}</p>
    <p><b>Departure:</b> ${flight.departDate} (${flight.departTime || flight.time})</p>
  `;

  if (flight.returnDate) {
    html += `<p><b>Return:</b> ${flight.returnDate} (${flight.returnTime})</p>`;
  }

  // Passenger info + total
  html += `
    <hr><h3>Passengers (${totalPassengers})</h3>
    ${passengerHTML}
    <hr>
    <p><b>Grand Total:</b> ₱${totalPrice.toLocaleString()}</p>
  `;

  content.innerHTML = html;

  // Book now → confirmation + redirect
  bookBtn.addEventListener("click", () => {
    alert("✅ Booking Successful! Thank you for flying with Cebu Pacific Airlines.");
    localStorage.clear();
    window.location.href = "home.html";
  });
}


