// ================== ELEMENTS ==================
const fromSelect = document.getElementById("fromStation");
const toSelect = document.getElementById("toStation");

const fromStationText = document.querySelector(".fromStation");
const toStationText = document.querySelector(".toStation");
const stationCode = document.querySelector(".stationCode");

const uts = document.querySelector(".uts");
const currentDate = document.querySelector(".currentDate");
const currentTime = document.querySelector(".currentTime");
const validDate = document.querySelector(".validDate");
const validTime = document.querySelector(".validTime");

const adText = document.querySelector(".ad");
const chText = document.querySelector(".ch");
const price = document.querySelector(".price");
const ReturnBox = document.querySelectorAll(".return");
const distanceBox = document.querySelector(".distance");

const adultInput = document.getElementById("adult");
const childInput = document.getElementById("child");
const returnCheckbox = document.getElementById("return");

let stationsData = [];
let journeyDistance = 0;

// ================== LOAD STATIONS ==================
fetch("./assets/js/station.json")
    .then(res => res.json())
    .then(data => {
        stationsData = data.stations;
        loadStations(stationsData);
        attachEvents();
        generateUTS();
        setCurrentDateTime();
        setValidDate();
    })
    .catch(err => console.error("Station load failed:", err));

// ================== LOAD DROPDOWN ==================
function loadStations(stations) {
    stations.forEach(st => {
        const opt1 = document.createElement("option");
        opt1.value = st.code;
        opt1.textContent = st.name;

        const opt2 = opt1.cloneNode(true);

        fromSelect.appendChild(opt1);
        toSelect.appendChild(opt2);
    });
}

// ================== EVENTS ==================
function attachEvents() {
    [fromSelect, toSelect, adultInput, childInput, returnCheckbox]
        .forEach(el => {
            el.addEventListener("change", updateFareUI);
            el.addEventListener("input", updateFareUI);
        });

    fromSelect.addEventListener("change", () => {
        disableSameStation();
        fromStationText.textContent =
            fromSelect.options[fromSelect.selectedIndex].text;
        stationCode.textContent = fromSelect.value;
    });

    toSelect.addEventListener("change", () => {
        toStationText.textContent =
            toSelect.options[toSelect.selectedIndex].text;
    });
}

// ================== PREVENT SAME STATION ==================
function disableSameStation() {
    const selectedFrom = fromSelect.value;
    [...toSelect.options].forEach(opt => {
        opt.disabled = opt.value === selectedFrom;
    });
    if (toSelect.value === selectedFrom) toSelect.value = "";
}

// ================== DISTANCE ==================
function getDistance(fromCode, toCode) {
    if (!fromCode || !toCode) return 0;

    const from = stationsData.find(s => s.code === fromCode);
    const to = stationsData.find(s => s.code === toCode);

    if (!from || !to) return 0;

    return Math.abs(
        Number(from.distance_km) - Number(to.distance_km)
    );
}

// ================== FARE ==================
function calculateFare(distance, adults, children, isReturn) {
    const RATE = 0.3;

    let fare =
        (adults * distance * RATE) +
        (children * distance * RATE * 0.5);

    if (isReturn) {
        fare *= 2;
        ReturnBox.forEach((r) => {
            r.style.display = 'block';
        })
    } else {
        ReturnBox.forEach((r) => {
            r.style.display = 'none';
        })
    }

    return Math.ceil(fare);
}

// ================== UPDATE UI ==================
function updateFareUI() {
    const from = fromSelect.value;
    const to = toSelect.value;

    const adults = Number(adultInput.value || 0);
    const children = Number(childInput.value || 0);
    const isReturn = returnCheckbox.checked;

    adText.textContent = adults;
    chText.textContent = children;

    if (!from || !to || from === to) {
        price.textContent = "0";
        distanceBox.textContent = "0 KM";
        return;
    }

    journeyDistance = getDistance(from, to);
    distanceBox.textContent = journeyDistance + " KM";

    const fare = calculateFare(
        journeyDistance,
        adults,
        children,
        isReturn
    );

    price.textContent = fare;
}

// ================== UTS ==================
function generateUTS() {
    uts.textContent = Math.floor(1000000000 + Math.random() * 9000000000);
}

// ================== DATE TIME ==================
function setCurrentDateTime() {
    const now = new Date();

    const date = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    let hrs = now.getHours();
    const min = String(now.getMinutes()).padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;

    currentDate.textContent = `${date}/${month}/${year}`;
    currentTime.textContent = `${hrs}:${min}${ampm}`;
}

// ================== VALID DATE ==================
function setValidDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);

    const date = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    validDate.textContent = `${date}/${month}/${year}`;
    validTime.textContent = "12:00AM";
}
