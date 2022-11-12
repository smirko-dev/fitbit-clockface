import calendars from "calendars";
import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";

import { toEpochSec } from "../common/utils";
import { calendarFile, weatherFile, millisecondsPerMinute } from "../common/constants";

import { settingsStorage } from "settings";
import * as messaging from "messaging";

import { weather, WeatherCondition } from "../common/weather";

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
    else if (evt.key === "info") {
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

// Update all data
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
    .catch(error => {
      // Inform the user about the error
      console.error(error);
      console.error(error.stack);
    });
}

// Refresh calendar data
function refreshEvents() {
  let dataEvents = [];
  calendars
    .searchSources()
    .then(results => {
      return calendars.searchCalendars();
    })
    .then(results => {
      const start = new Date();
      const end = new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const eventsQuery = {startDate: start, endDate: end};
      return calendars.searchEvents(eventsQuery);
    })
    .then(results => {
      results.forEach(event => {
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
    console.warn(`Failed to enqueue calendar data. Error: ${error}`);
  });
}

// Send data
function sendWeatherFile(data) {
  outbox.enqueue(weatherFile, cbor.encode(data)).catch(error => {
    console.warn(`Failed to enqueue weather data. Error: ${error}`);
  });
}

// Find the icon for a weather conditionCode
function findWeatherConditionIcon(condition) {
  switch (condition) {
    case WeatherCondition.ClearNight:
    case WeatherCondition.MostlyClearNight:
      return 'weather-night.png';
    case WeatherCondition.Cloudy:
    case WeatherCondition.Overcast:
      return 'weather-cloudy.png';
    case WeatherCondition.Cold:
      return 'weather-snowflake-alert.png';
    case WeatherCondition.Flurries:
      return 'weather-snowy.png';
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
      return 'weather-snowflake-alert.png';
    case WeatherCondition.IntermittentCloudsDay:
    case WeatherCondition.MostlyCloudyDay:
      return 'weather-partly-cloudy.png';
    case WeatherCondition.IntermittentCloudsNight:
    case WeatherCondition.MostlyCloudyNight:
      return 'weather-night-partly-cloudy.png';
    case WeatherCondition.MostlyCloudyWithShowersDay:
    case WeatherCondition.MostlyCloudyWithShowersNight:
    case WeatherCondition.PartlyCloudyWithShowersNight:
    case WeatherCondition.PartlySunnyWithShowersDay:
      return 'weather-partly-rainy.png.png';
    case WeatherCondition.PartlySunnyWithFlurriesDay:
    case WeatherCondition.MostlyCloudyWithFlurriesDay:
    case WeatherCondition.MostlyCloudyWithFlurriesNight:
    case WeatherCondition.MostlyCloudyWithSnowDay:
    case WeatherCondition.MostlyCloudyWithSnowNight:
      return 'weather-partly-snowy.png';
    case WeatherCondition.MostlyCloudyWithThunderstormsDay:
    case WeatherCondition.MostlyCloudyWithThunderstormsNight:
    case WeatherCondition.PartlyCloudyWithThunderstormsNight:
    case WeatherCondition.PartlySunnyWithThunderstormsDay:
    case WeatherCondition.Thunderstorms:
      return 'weather-lightning.png';
    case WeatherCondition.MostlySunnyDay:
    case WeatherCondition.PartlySunnyDay:
      return 'weather-partly-cloudy.png';
    case WeatherCondition.Rain:
      return 'weather-rainy.png';
    case WeatherCondition.RainAndSnow:
    case WeatherCondition.Sleet:
      return 'weather-snowy-rainy.png';
    case WeatherCondition.Showers:
      return 'weather-pouring.png';
    case WeatherCondition.Snow:
      return 'weather-snowflake.png';
    case WeatherCondition.SunnyDay:
      return 'weather-sunny.png';
    case WeatherCondition.Windy:
      return 'weather-windy.png';
    case WeatherCondition.PartlyCloudyNight:
      return 'weather-night-partly-cloudy.png';
    default:
      console.warn(`Unused weather icon: ${condition}`);
      return 'thermometer.png';
  }
}
