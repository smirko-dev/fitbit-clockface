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

const infoIcon = document.getElementById("infoIcon");
const infoLabel = document.getElementById("infoLabel");

const INVISIBLE = 0.0;
const VISIBLE = 0.8;

let WeatherIcon = 'thermometer.png';
let WeatherValue = 'N/A';

// Show battery label just for Ionic
if (device.modelId != 27 ) {
  batteryLabel.style.opacity = INVISIBLE;
}
else {
  batteryLabel.style.opacity = VISIBLE;
}

// Register for the unload event
appbit.onunload = saveSettings;

// Load settings at startup
let settings = loadSettings();
applySettings(settings.info, settings.color);

// Apply and store settings
function applySettings(info, color) {
  //DEBUG console.log(`[applySettings] info=${info}, color=${color}`);
  if (typeof info !== 'undefined') {
    if (info !== 'weather') {
      infoIcon.image = `${info}.png`;
    }
    settings.info = info;
  }
  if (typeof color !== 'undefined') {
    hourLabel.style.fill = color;
    infoIcon.style.fill = color;
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
      info: "steps",
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
  if (evt.data.key === "info") {
    applySettings(evt.data.value, settings.color);
  }
  else if (evt.data.key === "color") {
    applySettings(settings.info, evt.data.value);
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

if (appbit.permissions.granted('access_calendar')) {
  appointment.initialize(() => {
    renderAppointment();
  });
}
else {
  console.warn('Missing permission: access_calendar');
}

if (appbit.permissions.granted('access_location')) {
    weather.initialize(data => {
      //DEBUG console.log(`Weather: ${data.icon} - ${data.temperature} ${data.unit} in ${data.location}`);
      data = units.temperature === "F" ? toFahrenheit(data) : data;
      WeatherValue = `${data.temperature}\u00B0 ${units.temperature}`;
      WeatherIcon = `${data.icon}`;
    });
}
else {
  console.warn('Missing permission: access_location');
}

display.addEventListener("change", () => {
  if (display.on) {
    // Update appointment and battery on display on
    renderAppointment();
    renderBattery();
  }
  else {
    // Stop updating info
    hideInfo();
  }
});

// Hide event when touched
appointmentsLabel.addEventListener("mousedown", () => {
  showInfo();
  updateInfo();
})

function renderAppointment() {
  // Upate the appointment <text> element
  if (appbit.permissions.granted('access_calendar')) {
    let event = appointment.next();
    if (event) {
      const date = fromEpochSec(event.startDate);
      appointmentsLabel.text = timeString(date) + " " + event.title;
      hideInfo();
      return;
    }
  }
  showInfo();
  updateInfo();
}

function hideInfo() {
  infoIcon.style.opacity = INVISIBLE;
  infoLabel.style.opacity = INVISIBLE;
  appointmentsLabel.style.opacity = VISIBLE;
}

function showInfo() {
  infoIcon.style.opacity = VISIBLE;
  infoLabel.style.opacity = VISIBLE;
  appointmentsLabel.style.opacity = INVISIBLE;
}

function updateInfo() {
  //DEBUG console.log(`[updateInfo] info=${settings.info}`);
  if (settings.info === 'weather') {
    infoLabel.text = WeatherValue;
    infoIcon.image = WeatherIcon;
  }
  else if (appbit.permissions.granted('access_activity')) {
      if (settings.info === 'distance') {
        infoLabel.text = today.adjusted.distance;
      }
      else if (settings.info === 'floors') {
        infoLabel.text = today.adjusted.elevationGain;
      }
      else if (settings.info === 'calories') {
        infoLabel.text = today.adjusted.calories;
      }
      else {
        infoLabel.text = today.adjusted.steps;
      }
  }
  else {
    infoLabel.text = 'N/A';
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
