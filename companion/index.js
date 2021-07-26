import calendars from "calendars";
import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";

import { toEpochSec } from "../common/utils";
import { dataFile, millisecondsPerMinute } from "../common/constants";

import { settingsStorage } from "settings";
import * as messaging from "messaging";

// Update user settings 
settingsStorage.onchange = function(evt) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    if (evt.key === "activity") {
      let data = JSON.parse(evt.newValue);
      messaging.peerSocket.send({
        key: evt.key,
        value: data["values"][0].value
      });
    }
    else {
      messaging.peerSocket.send({
        key: evt.key,
        value: JSON.parse(evt.newValue)
      });
    }
  }
}

companion.wakeInterval = 15 * millisecondsPerMinute;
companion.addEventListener("wakeinterval", refreshEvents);

refreshEvents();

// Refresh calendar data
function refreshEvents() {
  let dataEvents = [];
  calendars
    .searchSources()
    .then(results => {
      // Debug: console.log("All calendar data sources");
      return calendars.searchCalendars();
    })
    .then(results => {
      // Debug: console.log("All calendars");
      const start = new Date();
      const end = new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const eventsQuery = {startDate: start, endDate: end};
      return calendars.searchEvents(eventsQuery);
    })
    .then(results => {
      results.forEach(event => {
        // Debug: console.log("All events for the next 24 hours");
        dataEvents.push({
          title: event.title,
          location: event.location,
          startDate: toEpochSec(event.startDate),
          endDate: toEpochSec(event.endDate),
          isAllDay: event.isAllDay
        });
      });
      if (dataEvents && dataEvents.length > 0) {
        sendData(dataEvents);
      }
    })
    .catch(error => {
      // Inform the user about the error
      console.error(error);
      console.error(error.stack);
    });
}

// Send data
function sendData(data) {
  outbox.enqueue(dataFile, cbor.encode(data)).catch(error => {
    console.warn(`Failed to enqueue data. Error: ${error}`);
  });
}
