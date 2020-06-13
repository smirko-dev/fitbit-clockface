import { battery } from "power";
import document from "document";
import { preferences } from "user-settings";
import { display } from "display";
import { me } from "appbit";
import * as util from "../common/utils";
import * as appointment from "./appointment";
import * as clock from "./clock";
import { fromEpochSec, timeString } from "../common/utils";

// Update the clock every minute
//clock.granularity = "seconds";

// Get a handle on the <text> elements
const hourLabel = document.getElementById("hourLabel");
const minuteLabel = document.getElementById("minuteLabel");
const secondLabel = document.getElementById("secondLabel");
const dateLabel = document.getElementById("dateLabel");
const appointmentsLabel = document.getElementById("appointmentsLabel");
const batteryLabel = document.getElementById("batteryLabel");

clock.initialize("seconds", data => {
  // Clock ticked, update UI
  hourLabel.text = data.hours;
  minuteLabel.text = data.minutes;
  secondLabel.text = data.seconds;
  dateLabel.text = data.date;
  //renderAppointment();
});


// Update the <text> element every time when battery changed
battery.onchange = (evt) => {
  batteryLabel.text = Math.floor(battery.chargeLevel).toString() + "%";
}

appointment.initialize(() => {
  // We have fresh calendar data
  renderAppointment();
});

// Update appointment on display on
display.addEventListener("change", () => {
   if (display.on) {
     renderAppointment();
   }
});

// Render appointment
function renderAppointment() {
  let event = appointment.next();
  if (event) {
    const date = fromEpochSec(event.startDate);
    appointmentsLabel.text = timeString(date) + " " + event.title;
  }
}
