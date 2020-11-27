
import { preferences } from "user-settings";

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
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
  if (day == 21) {
    return "21st"
  }
  else if (day == 22) {
    return "22nd"
  }
  else if (day == 23) {
    return "23rd"
  }
  if (day == 31) {
    return "31st"
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
