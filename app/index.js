import { me as appbit } from "appbit";
import document from "document";
import { battery } from "power";
import { display } from "display";
import { today } from 'user-activity';
import { me as device } from "device";
import { units } from "user-settings";
import * as fs from "fs";
import * as appointment from "./appointment";
import * as weather from "./weather";
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

const weatherLabel = document.getElementById("weatherLabel");
const weatherImage = document.getElementById("weatherImage");

// Visibility values
const INVISIBLE = 0.0;
const VISIBLE = 0.8;

// Current weather status
weatherImage.image = 'thermometer.png';
weatherLabel.text = 'N/A';

// Permissions
const CalendarPermissionGranted = appbit.permissions.granted('access_calendar');
const ActivityPermissionGranted = appbit.permissions.granted('access_activity');
const LocationPermissionGranted = appbit.permissions.granted('access_location');

if (!CalendarPermissionGranted) {
  console.warn('Missing permission: access_location');
}

if (!ActivityPermissionGranted) {
  console.warn('Missing permission: access_location');
}

if (!LocationPermissionGranted) {
  console.warn('Missing permission: access_location');
}

// Register for the unload event
appbit.onunload = saveSettings;

// Load settings at startup
let settings = loadSettings();
applySettings(settings.activity, settings.color, settings.info);

// Apply and store settings
function applySettings(activity, color, info) {
  //DEBUG console.log(`[applySettings] activity=${activity}, color=${color}, info=${info}`);
  if (typeof activity !== 'undefined') {
    activityIcon.image = `${activity}.png`;
    settings.activity = activity;
  }
  if (typeof color !== 'undefined') {
    hourLabel.style.fill = color;
    activityIcon.style.fill = color;
    weatherImage.style.fill = color;
    settings.color = color;
  }
  if (typeof info !== 'undefined') {
    settings.info = info;
    if (info === 'battery') {
      weatherImage.style.opacity = INVISIBLE;
      weatherLabel.style.opacity = INVISIBLE;
      batteryImage.style.opacity = VISIBLE;
      renderBattery();
    }
    else if (info === 'weather') {
      batteryImage.style.opacity = INVISIBLE;
      batteryLabel.style.opacity = INVISIBLE;
      weatherImage.style.opacity = VISIBLE;
      weatherLabel.style.opacity = VISIBLE;
      renderWeather();
    }
    else {
      batteryImage.style.opacity = INVISIBLE;
      batteryLabel.style.opacity = INVISIBLE;
      weatherImage.style.opacity = INVISIBLE;
      weatherLabel.style.opacity = INVISIBLE;
    }
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
      color: "#2490DD",
      info: "battery"
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
    applySettings(evt.data.value, settings.color, settings.info);
  }
  else if (evt.data.key === "color") {
    applySettings(settings.activity, evt.data.value, settings.info);
  }
  else if (evt.data.key === "info") {
    applySettings(settings.activity, settings.color, evt.data.value);
  }
  renderAppointment();
}

// Clock callback
clock.initialize("minutes", data => {
  hourLabel.text = data.hours;
  minuteLabel.text = data.minutes;
  dateLabel.text = data.date;
  
  renderAppointment();
});

// Battery change callback
battery.onchange = (evt) => {
  renderBattery();
}

// Appointment callback
appointment.initialize(() => {
  renderAppointment();
});

// Weather callback
weather.initialize(data => {
  renderWeather();
});

// Update weather
function renderWeather() {
  let data = weather.current();
  if (data) {
    //DEBUG console.log(`Weather: ${data.icon} - ${data.temperature} ${data.unit} in ${data.location}`);
    data = units.temperature === "F" ? toFahrenheit(data) : data;
    weatherLabel.text = `${data.temperature}\u00B0${units.temperature}`;
    weatherImage.image = `${data.icon}`;
  }
});

// Display callback
display.addEventListener("change", () => {
  if (display.on) {
    // Update content on display on
    renderAppointment();
    renderBattery();
    renderWeather();
  }
  else {
    // Stop updating activity
    hideActivity();
  }
});

// Appointment touch callback
appointmentsLabel.addEventListener("mousedown", () => {
  showActivity();
  updateActivity();
})

// Update appointment
function renderAppointment() {
  let event = appointment.next();
  if (event) {
    const date = fromEpochSec(event.startDate);
    appointmentsLabel.text = timeString(date) + " " + event.title;
    // Hide activity
    hideActivity();
  }
  else {
    // Show and update activity
    showActivity();
    updateActivity();
  }
}

// Hide activity
function hideActivity() {
  activityIcon.style.opacity = INVISIBLE;
  activityLabel.style.opacity = INVISIBLE;
  appointmentsLabel.style.opacity = VISIBLE;
}

// Show activity
function showActivity() {
  activityIcon.style.opacity = VISIBLE;
  activityLabel.style.opacity = VISIBLE;
  appointmentsLabel.style.opacity = INVISIBLE;
}

// Update activity
function updateActivity() {
  //DEBUG console.log(`[updateActivity] info=${settings.info}`);
  if (settings.info === 'distance') {
    activityLabel.text = today.adjusted.distance;
  }
  else if (settings.info === 'floors') {
    activityLabel.text = today.adjusted.elevationGain;
  }
  else if (settings.info === 'calories') {
    activityLabel.text = today.adjusted.calories;
  }
  else {
    activityLabel.text = today.adjusted.steps;
  }
}

// Update battery
function renderBattery() {
  // Update the battery <text> element every time when battery changed
  batteryLabel.text = Math.floor(battery.chargeLevel) + "%";
  if (device.modelId != 27) {
      batteryLabel.style.opacity = INVISIBLE;
  }
  else {
      batteryLabel.style.opacity = VISIBLE;
  }
  
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
