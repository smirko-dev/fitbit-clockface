import clock from "clock";
import { preferences, locale } from "user-settings";
import { gettext } from "i18n";
import * as util from "./utils";

let handleClockTickCallback;
let ampm = "";

export function initialize(granularity, callback) {
  clock.granularity = granularity ? granularity : "minutes";
  handleClockTickCallback = callback;
  clock.addEventListener("tick", tick);
}

export function tick(evt) {
  const today = evt ? evt.date : new Date();
  const mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
  let hours = today.getHours();

  if (preferences.clockDisplay === "12h") {
    ampm = hours > 12 ? "pm" : "am";
    secs = ampm;
    hours = hours % 12 || 12;
  } else {
    ampm = "";
  }
  hours = util.zeroPad(hours);
  
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  let date = "";

  switch (locale.language) {
    case "de-de":
      date = gettext(days[today.getDay()]) + ", " + today.getDate() + "." + gettext(months[today.getMonth()]);
      break;
    case "en-us": 
    case "en-gb": 
    default:
      date = gettext(days[today.getDay()]) + ", " + gettext(months[today.getMonth()]) + " " + util.dayString(today.getDate());
      break;
  }

  if (typeof handleClockTickCallback === "function") {
    handleClockTickCallback({ hours: `${hours}`, minutes : `${mins}`, seconds : `${secs}`, date : `${date}` });
  }
}
