import calendars from "calendars";
import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";

import { toEpochSec } from "../common/utils";
import { calendarFile, weatherFile, millisecondsPerMinute } from "../common/constants";

import { settingsStorage } from "settings";
import * as messaging from "messaging";

import { weather, WeatherCondition } from "weather";

// Update user settings 
settingsStorage.onchange = function(evt) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    if (evt.key === "info") {
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

// Set update interval and callback
companion.wakeInterval = 15 * millisecondsPerMinute;
companion.addEventListener("wakeinterval", refreshData);

function refreshData() {
  refreshEvents();
  refreshWeather();
}

refreshData();

// Refresh weather data
function refreshWeather() {
  weather
    .getWeatherData()
    .then((data) => {
       if (data.locations.length > 0) {
        sendWeatherFile({
          temperature: Math.floor(data.locations[0].currentWeather.temperature),
          condition: data.locations[0].currentWeather.weatherCondition,
          icon: findWeatherConditionIcon(data.locations[0].currentWeather.weatherCondition),
          location: data.locations[0].name,
          unit: data.temperatureUnit
        });
      }
      else {
        console.warn("No data for this location.")
      }
    })
    .catch((ex) => {
      console.error(ex);
    });
}

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
        sendCalendarFile(dataEvents);
      }
    })
    .catch(error => {
      // Inform the user about the error
      console.error(error);
      console.error(error.stack);
    });
}

// Send data
function sendCalendarFile(data) {
  outbox.enqueue(calendarFile, cbor.encode(data)).catch(error => {
    console.warn(`Failed to enqueue data. Error: ${error}`);
  });
}

// Send data
function sendWeatherFile(data) {
  outbox.enqueue(weatherFile, cbor.encode(data)).catch(error => {
    console.warn(`Failed to enqueue data. Error: ${error}`);
  });
}

// Find the icon for a weather conditionCode
function findWeatherConditionIcon(condition) {
  switch (condition) {
    case WeatherCondition.ClearNight:
    case WeatherCondition.MostlyClearNight:
      return 'weather-night.png';
    case WeatherCondition.Cloudy:
      return 'weather-cloudy.png';
    case WeatherCondition.Cold:
      return 'weather-snowflake-alert.png';
    case WeatherCondition.Flurries:
      return '';
    case WeatherCondition.Fog:
      return 'weather-fog.png';
    case WeatherCondition.FreezingRain:
      return 'weather-snowy-rainy.png';
    case WeatherCondition.HazyMoonlight:
    case WeatherCondition.HazySunshineDay:
      return 'weather-hazy.png';
    case WeatherCondition.Hot:
      return 'weather-sunny-alert.png';
    case WeatherCondition.Ice:
      return 'weather-snowflake.png';
    case WeatherCondition.IntermittentCloudsDay:
    case WeatherCondition.MostlyCloudyDay:
      return 'weather-partly-cloudy.png';
    case WeatherCondition.IntermittentCloudsNight:
    case WeatherCondition.MostlyCloudyNight:
      return 'weather-night-partly-cloudy.png';
    case WeatherCondition.MostlyCloudyWithFlurriesDay:
    case WeatherCondition.MostlyCloudyWithFlurriesNight:
    case WeatherCondition.MostlyCloudyWithShowersDay:
    case WeatherCondition.MostlyCloudyWithShowersNight:
    case WeatherCondition.MostlyCloudyWithSnowDay:
    case WeatherCondition.MostlyCloudyWithSnowNight:
    case WeatherCondition.MostlyCloudyWithThunderstormsDay:
    case WeatherCondition.MostlyCloudyWithThunderstormsNight:
    case WeatherCondition.MostlySunnyDay:
    case WeatherCondition.Overcast:
    case WeatherCondition.PartlyCloudyNight:
    case WeatherCondition.PartlyCloudyWithShowersNight:
    case WeatherCondition.PartlyCloudyWithThunderstormsNight:
    case WeatherCondition.PartlySunnyDay:
    case WeatherCondition.PartlySunnyWithFlurriesDay:
    case WeatherCondition.PartlySunnyWithShowersDay:
    case WeatherCondition.PartlySunnyWithThunderstormsDay:
    case WeatherCondition.Rain:
    case WeatherCondition.RainAndSnow:
    case WeatherCondition.Showers:
    case WeatherCondition.Sleet:
    case WeatherCondition.Snow:
    case WeatherCondition.SunnyDay:
    case WeatherCondition.Thunderstorms:
    case WeatherCondition.Windy:
      console.log(`UNUSED WEATHER ICON: ${condition}`);
      break;
  }
  return 'thermometer.png';
}
