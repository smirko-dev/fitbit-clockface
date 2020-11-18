import document from "document";
import { battery } from "power";
import { preferences } from "user-settings";
import { display } from "display";
import { today } from 'user-activity';
import { me } from "appbit";
import { me as device } from "device";
import * as util from "../common/utils";
import * as appointment from "./appointment";
import * as clock from "./clock";
import { fromEpochSec, timeString } from "../common/utils";

// Get a handle on the <text> elements
const hourLabel = document.getElementById("hourLabel");
const minuteLabel = document.getElementById("minuteLabel");
const dateLabel = document.getElementById("dateLabel");
const appointmentsLabel = document.getElementById("appointmentsLabel");
const batteryImage = document.getElementById("batteryImage");
const batteryLabel = document.getElementById("batteryLabel");

const activityIcon = document.getElementById("activityIcon");
const activityLabel = document.getElementById("activityLabel");

clock.initialize("minutes", data => {
  // Update <text> elements with each tick
  hourLabel.text = data.hours;
  minuteLabel.text = data.minutes;
  dateLabel.text = data.date;
  // Update appointment
  renderAppointment();
  // Update battery
  renderBattery();
});

battery.onchange = (evt) => {
  renderBattery();
}

appointment.initialize(() => {
  // Update appointment with new data
  renderAppointment();
});

display.addEventListener("change", () => {
  // Update appointment on display on
  if (display.on) {
    renderAppointment();
    renderBattery();
  }
});

function renderAppointment() {
  // Upate the appointment <text> element
  let event = appointment.next();
  if (event) {
    const date = fromEpochSec(event.startDate);
    appointmentsLabel.text = timeString(date) + " " + event.title;
    hideActivity();
  }
  else {
    appointmentsLabel.text = ""
    renderActivity();
  }
}

function hideActivity() {
  activityIcon.image = ""
  activityLabel.text = ""
}

function renderActivity() {
  activityIcon.image = "shoe-print.png"
  activityLabel.text = today.adjusted.steps
}

function renderBattery() {
  // Update the battery <text> element every time when battery changed
  // Show <text> just on Ionic
  if (device.modelId != 27 ) {
    batteryLabel.text = "";
  }
  else {
    batteryLabel.text = Math.floor(battery.chargeLevel) + "%";
  }
  
  // Update battery icon
  const level = Math.floor(battery.chargeLevel / 10) * 10;
  if (level < 20) {
    batteryImage.image = `battery-alert.png`;
  } else {
    batteryImage.image = `battery-${Math.floor(battery.chargeLevel / 10) * 10}.png`;
  }
}
