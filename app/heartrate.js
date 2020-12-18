
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";

const body = new BodyPresenceSensor();
const hrm = new HeartRateSensor();

let handleHeartrateCallback;

export function initialize(callback) {
  handleHeartrateCallback = callback;

  display.addEventListener("change", () => {
    console.log(`Display changed to ${display.on}`);
    if (display.on) {
      body.start();
    }
    else {
      body.stop();
    }
    refresh();
  });

  body.addEventListener("reading", () => {
    console.log(`Body presence changed to ${body.present}`);
    refresh();
  });

  hrm.addEventListener("reading", () => {
    if (!body.present || !hrm.activated) {
      update("--");
    }
    else {
      update(`${hrm.heartRate}`);
    }
  });

  if (display.on) {
    body.start();
    refresh();
  }
}

export function refresh() {
  if (!body.present || !hrm.activated) {
    update("--");
  }
  if (display.on && body.present) {
    hrm.start();
  }
  else {
    hrm.stop();
  }
}

export function update(text) {
  if (typeof handleHeartrateCallback === "function") {
    handleHeartrateCallback({text: `${text}`});
  }
}
