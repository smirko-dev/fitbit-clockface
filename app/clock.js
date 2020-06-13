import clock from "clock";
import { preferences, locale  } from "user-settings";
import * as util from "../common/utils";

let handleClockTickCallback;

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
    // 12h format
    secs = hours > 12 ? "pm" : "am";
    hours = hours % 12 || 12;
  }
  hours = util.zeroPad(hours);
  
  // Date
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "September", "October", "November", "December"];
  const date = days[today.getDay()] + ", " + months[today.getMonth()] + " " + util.dayString(today.getDate());

  if (typeof handleClockTickCallback === "function") {
    handleClockTickCallback({ hours: `${hours}`, minutes : `${mins}`, seconds : `${secs}`, date : `${date}` });
  }
}
