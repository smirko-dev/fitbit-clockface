import { inbox } from "file-transfer";
import { readFileSync } from "fs";

import { weatherFile, weatherType } from "../common/constants";

let data;
let handleCallback;

export function current() {
  return data;
}

export function initialize(callback) {
  handleCallback = callback;
  data = loadData();
  inbox.addEventListener("newfile", fileHandler);
  fileHandler();
  updatedData();
}

function fileHandler() {
  let fileName;
  do {
    fileName = inbox.nextFile();
    if (fileName === weatherFile) {
      console.log('Load ' + fileName);
      data = loadData();
      updatedData();
    }
  } while (fileName);
}

function loadData() {
  try {
    return readFileSync(`/private/data/${weatherFile}`, weatherType);
  } catch (ex) {
    console.error(`loadData() failed. ${ex}`);
    return;
  }
}

function existsData() {
  if (data === undefined) {
    console.warn("Weather: No data found.");
    return false;
  }
  return true;
}

function updatedData() {
  if (typeof handleCallback === "function" && existsData()) {
    handleCallback(data);
  }
}
