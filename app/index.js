import document from "document";
import { battery } from "power";
import { display } from "display";
import { today } from 'user-activity';
import { me as device } from "device";
import * as appointment from "./appointment";
import * as clock from "./clock";
import * as messaging from "messaging";
import { fromEpochSec, timeString } from "../common/utils";

// Get a handle on the <text> and <image> elements
const hourLabel = document.getElementById("hourLabel");
const minuteLabel = document.getElementById("minuteLabel");
const dateLabel = document.getElementById("dateLabel");
const appointmentsLabel = document.getElementById("appointmentsLabel");
const batteryImage = document.getElementById("batteryImage");
const batteryLabel = document.getElementById("batteryLabel");

const activityIcon = document.getElementById("activityIcon");
const activityLabel = document.getElementById("activityLabel");

const ActivitySelection = {
  DIST: 'distance',
  FLOORS: 'floors',
  CAL: 'calories',
  STEPS: 'steps'
}

let activitySelection = ActivitySelection.STEPS;
let activityIntervalID = 0;

const INVISIBLE = 0.0;
const VISIBLE = 0.8;

// Show battery label just for Ionic
if (device.modelId != 27 ) {
  batteryLabel.style.opacity = INVISIBLE;
}
else {
  batteryLabel.style.opacity = VISIBLE;
}

// Update app settings
messaging.peerSocket.onmessage = (evt) => {
  if (evt.data === "distance") {
    activitySelection = ActivitySelection.DIST;
  }
  else if (evt.data === "floors") {
    activitySelection = ActivitySelection.FLOORS;
  }
  else if (evt.data === "calories") {
    activitySelection = ActivitySelection.CAL;
  }
  else {
    activitySelection = ActivitySelection.STEPS;
  }
  renderAppointment();
}

clock.initialize("minutes", data => {
  // Update <text> elements with each tick
  hourLabel.text = data.hours;
  minuteLabel.text = data.minutes;
  dateLabel.text = data.date;
  // Update appointment
  renderAppointment();
});

battery.onchange = (evt) => {
  renderBattery();
}

appointment.initialize(() => {
  // Update appointment with new data
  renderAppointment();
});

display.addEventListener("change", () => {
  if (display.on) {
    // Update appointment and battery on display on
    renderAppointment();
    renderBattery();
  }
  else {
    // Stop updating activity info
    hideActivity();
  }
});

// Hide event when touched
appointmentsLabel.addEventListener("mousedown", () => {
  showActivity();
  updateActivity();
})

function renderAppointment() {
  // Upate the appointment <text> element
  let event = appointment.next();
  if (event) {
    const date = fromEpochSec(event.startDate);
    appointmentsLabel.text = timeString(date) + " " + event.title;
    hideActivity();
  }
  else {
    showActivity();
    updateActivity();
  }
}

function hideActivity() {
  activityIcon.style.opacity = INVISIBLE;
  activityLabel.style.opacity = INVISIBLE;
  appointmentsLabel.style.opacity = VISIBLE;
  clearInterval(activityIntervalID);
}

function showActivity() {
  activityIcon.style.opacity = VISIBLE;
  activityLabel.style.opacity = VISIBLE;
  appointmentsLabel.style.opacity = INVISIBLE;
  activityIntervalID = setInterval(updateActivity, 1500);
}

function updateActivity() {
  switch (activitySelection) {
    case ActivitySelection.DIST:
      activityIcon.image = "distance.png";
      activityLabel.text = today.adjusted.distance;
      break;
    case ActivitySelection.FLOORS:
      activityIcon.image = "floors.png";
      activityLabel.text = today.adjusted.elevationGain;
      break;
    case ActivitySelection.CAL:
      activityIcon.image = "calories.png";
      activityLabel.text = today.adjusted.calories;
      break;
    default:
      activityIcon.image = "steps.png";
      activityLabel.text = today.adjusted.steps;
      break;
  }
}

function renderBattery() {
  // Update the battery <text> element every time when battery changed
  batteryLabel.text = Math.floor(battery.chargeLevel) + "%";
  
  // Update battery icon
  const level = Math.floor(battery.chargeLevel / 10) * 10;
  if (level < 20) {
    batteryImage.image = `battery-alert.png`;
  }
  else {
    batteryImage.image = `battery-${Math.floor(battery.chargeLevel / 10) * 10}.png`;
  }
}

renderBattery();
