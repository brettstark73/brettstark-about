import { getWFHSelection } from "../lib/wfhroulette.js";

const form = document.getElementById("wfh-form");
const seedInput = document.getElementById("seed");
const dateInput = document.getElementById("date");
const resultWeek = document.getElementById("result-week");
const resultDay = document.getElementById("result-day");
const resultReason = document.getElementById("result-reason");

async function loadReasons() {
  const response = await fetch("../reasons.json");
  if (!response.ok) {
    throw new Error("Unable to load reasons.json");
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("reasons.json must contain a non-empty array");
  }
  return data;
}

const reasonsPromise = loadReasons();

function getSelectedDate() {
  if (!dateInput.value) {
    return new Date();
  }
  const date = new Date(dateInput.value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Please enter a valid date");
  }
  return date;
}

async function updateResults(event) {
  event?.preventDefault();
  try {
    const seed = seedInput.value.trim() || "WFHroulette";
    const date = getSelectedDate();
    const reasons = await reasonsPromise;
    const selection = getWFHSelection({ date, seed, reasons });

    const weekLabel = `${selection.isoYear}-W${String(selection.isoWeek).padStart(2, "0")}`;
    resultWeek.textContent = `Week ${weekLabel}`;
    resultDay.textContent = `📅 ${selection.weekday} (${selection.dateString})`;
    resultReason.textContent = `🤷 ${selection.reason}`;
  } catch (error) {
    resultWeek.textContent = "Week";
    resultDay.textContent = "Something went wrong.";
    resultReason.textContent = error.message;
  }
}

function setDefaultDate() {
  const today = new Date();
  const tzOffset = today.getTimezoneOffset() * 60000;
  const localISODate = new Date(today.getTime() - tzOffset).toISOString().slice(0, 10);
  dateInput.value = localISODate;
}

setDefaultDate();
updateResults();
form.addEventListener("submit", updateResults);
