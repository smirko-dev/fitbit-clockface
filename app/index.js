import { me } from "appbit";
import document from "document";
import { battery } from "power";
import { display } from "display";
import { today } from 'user-activity';
import { me as device } from "device";
import * as fs from "fs";
import * as appointment from "./appointment";
import * as clock from "./clock";
import * as messaging from "messaging";
import { fromEpochSec, timeString } from "../common/utils";
import { settingsType, settingsFile } from "../common/constants";

// Get a handle on the <text> and <image> elements
const hourLabel = document.getElementById("hourLabel");
const minuteLabel = document.getElementById("minuteLabel");
const dateLabel = document.getElementById("dateLabel");
const appointmentsLabel = document.getElementById("appointmentsLabel");
const batteryImage = document.getElementById("batteryImage");
const batteryLabel = document.getElementById("batteryLabel");

const activityIcon = document.getElementById("activityIcon");
const activityLabel = document.getElementById("activityLabel");

//TODO: let activityIntervalID = 0;

const INVISIBLE = 0.0;
const VISIBLE = 0.8;

// Show battery label just for Ionic
if (device.modelId != 27 ) {
  batteryLabel.style.opacity = INVISIBLE;
}
else {
  batteryLabel.style.opacity = VISIBLE;
}

// Register for the unload event
me.onunload = saveSettings;

// Load settings at startup
let settings = loadSettings();
applySettings(settings.activity, settings.color);

// Apply and store settings
function applySettings(activity, color) {
  if (typeof activity !== 'undefined') {
    activityIcon.image = `${activity}.png`;
    settings.activity = activity;
  }
  if (typeof color !== 'undefined') {
    hourLabel.style.fill = color;
    activityIcon.style.fill = color;
    settings.color = color;
  }
}

// Load settings
function loadSettings() {
  try {
    return fs.readFileSync(settingsFile, settingsType);
  }
  catch (ex) {
    // Default values
    return {
      activity: "steps",
      color: "#2490DD"
    };
  }
}

// Save settings
function saveSettings() {
  fs.writeFileSync(settingsFile, settings, settingsType);
}

// Update settings
messaging.peerSocket.onmessage = (evt) => {
  if (evt.data.key === "activity") {
    applySettings(evt.data.value, settings.color);
  }
  else if (evt.data.key === "color") {
    applySettings(settings.activity, evt.data.value);
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
  //TODO: clearInterval(activityIntervalID);
}

function showActivity() {
  activityIcon.style.opacity = VISIBLE;
  activityLabel.style.opacity = VISIBLE;
  appointmentsLabel.style.opacity = INVISIBLE;
  //TODO: activityIntervalID = setInterval(updateActivity, 1500);
}

function updateActivity() {
  if (settings.activity === 'distance') {
    activityLabel.text = today.adjusted.distance;
  }
  else if (settings.activity === 'floors') {
    activityLabel.text = today.adjusted.elevationGain;
  }
  else if (settings.activity === 'calories') {
    activityLabel.text = today.adjusted.calories;
  }
  else {
    activityLabel.text = today.adjusted.steps;
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
