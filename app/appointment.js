import { inbox } from "file-transfer";
import { readFileSync } from "fs";

import { calendarFile, calendarType } from "../common/constants";
import { toEpochSec } from "../common/utils";

let data;
let handleCallback;

export function initialize(callback) {
  handleCallback = callback;
  data = loadData();
  inbox.addEventListener("newfile", fileHandler);
  fileHandler();
  updatedData();
}

export function next() {
  if (existsData()) {
    // Exclude all-day events
    let events = data.filter(event => {
      return !event.isAllDay;
    });

    if (events.length > 0) {
      const currentDate = toEpochSec(new Date());

      // Get all future events
      let futureEvents = events.filter(event => {
        return event.startDate > currentDate;
      });

      if (futureEvents.length > 0) {
        // Get the first future appointment
        return futureEvents[0];
      }
    }
  }
  return;
}

function fileHandler() {
  let fileName;
  do {
    fileName = inbox.nextFile();
    if (fileName === calendarFile) {
      console.log('Load ' + fileName);
      data = loadData();
      updatedData();
    }
  } while (fileName);
}

function loadData() {
  try {
    return readFileSync(`/private/data/${calendarFile}`, calendarType);
  } catch (ex) {
    console.error(`Appointment: loadData() failed. ${ex}`);
    return;
  }
}

function existsData() {
  if (data === undefined) {
    console.warn("Appointment: No data found.");
    return false;
  }
  return true;
}

function updatedData() {
  if (typeof handleCallback === "function" && existsData()) {
    handleCallback();
  }
}
