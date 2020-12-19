
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";

const bodyPresenceSensor = new BodyPresenceSensor({ frequency: 1, batch: 1 });
const heartRateSensor = new HeartRateSensor();

let handleHeartrateCallback;

export function initialize(callback) {
  handleHeartrateCallback = callback;

  display.addEventListener("change", () => {
    if (display.on) {
      console.log("Display on -> Start BodyPresenceSensor");
      bodyPresenceSensor.start();
    }
    else {
      console.log("Display off -> Stop BodyPresenceSensor");
      bodyPresenceSensor.stop();
      console.log("Display off -> Stop HeartRateSensor");
      heartRateSensor.stop();
    }
  });

  bodyPresenceSensor.addEventListener("reading", () => {
    if (bodyPresenceSensor.activated) {
      if (bodyPresenceSensor.present) {
        console.log("Body present -> Start HeartRateSensor");
        heartRateSensor.start();
      }
      else {
        console.log("Body not present -> Stop HeartRateSensor");
        heartRateSensor.stop();
        update("--");
      }
    }
  });

  heartRateSensor.addEventListener("reading", () => {
    if (!bodyPresenceSensor.present || !heartRateSensor.activated) {
      update("--");
    }
    else {
      update(`${heartRateSensor.heartRate}`);
    }
  });

  if (display.on) {
    console.log("Init -> Start BodyPresenceSensor");
    bodyPresenceSensor.start();
  }
}

export function update(text) {
  if (typeof handleHeartrateCallback === "function") {
    handleHeartrateCallback({text: `${text}`});
  }
}
