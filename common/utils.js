
import { preferences } from "user-settings";

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Convert celcius to fahrenheit
export function toFahrenheit(data) {
  if (data.unit.toLowerCase() === "celsius") {
     data.temperature =  Math.round((data.temperature * 1.8) + 32.0);
     data.unit = "Fahrenheit";
  }  
  return data;
}
// Return day as a string
export function dayString(day) {
  if (day == 1) {
    return "1st"
  }
  else if (day == 2) {
    return "2nd"
  }
  else if (day == 3) {
    return "3rd"
  }
  return day.toString() + "th";
}

// Return date to seconds since epoch
export function toEpochSec(date) {
  return Math.floor(date.getTime() / 1000);
}

// Return seconds since epoch to date
export function fromEpochSec(seconds) {
  return new Date(seconds * 1000);
}


// Return time string from date
export function timeString(date) {
  const mins = zeroPad(date.getMinutes());
  let hours = zeroPad(date.getHours());
  let prefix = ``;
  if (preferences.clockDisplay === "12h") {
    // 12h format
    prefix = hours > 12 ? "pm" : "am";
    hours = hours % 12 || 12;
  }
  const result = `${hours}:${mins}${prefix}`; 
  return result;
}
