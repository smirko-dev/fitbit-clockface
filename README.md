# Fitbit Clockface

[![](https://img.shields.io/badge/Fitbit%20App%20Gallery-%2300B0B9?style=flat&logo=fitbit&logoColor=white)](https://gallery.fitbit.com/details/ae441b73-2660-407f-b796-a98d1d0583a0)
![languages](https://img.shields.io/badge/languages-JavaScript%20|%20CSS-blue)
![platform](https://img.shields.io/badge/platforms-Ionic%20|%20Versa%20|%20Versa%202%20|%20Versa%20Lite%20|%20Versa%203%20|%20Sense-silver)
[![version](https://img.shields.io/badge/version-%201.7.1-blue)](https://github.com/smirko-dev/fitbit-clockface/blob/master/CHANGELOG.md)
[![](https://img.shields.io/badge/license-MIT-blue)](https://github.com/smirko-dev/fitbit-clockface/blob/master/LICENSE)
[![FitbitBuild Actions Status](https://github.com/smirko-dev/fitbit-clockface/workflows/FitbitBuild/badge.svg)](https://github.com/smirko-dev/fitbit-clockface/actions)
[![CodeQL Actions Status](https://github.com/smirko-dev/fitbit-clockface/workflows/CodeQL/badge.svg)](https://github.com/smirko-dev/fitbit-clockface/actions)
[![Github All Releases](https://img.shields.io/github/downloads/smirko-dev/fitbit-clockface/total.svg)](https://github.com/smirko-dev/fitbit-clockface/releases)

## Description

This is a simple clock face for Fitbit.
It comes with
- time (12/24hr format), date (including weekday)
- languages: de-DE, en-US
- next calendar event of the current day
- additional info
  - battery icon (Ionic: and status in percentage)
  - current weather
- user activity in case of no events 
  - steps
  - distance
  - floors
  - calories
- six color schemes (selectable in settings menu)
- touch to hide calendar event temporarily

Find the latest published version in the [Fitbit gallery](https://gallery.fitbit.com/details/ae441b73-2660-407f-b796-a98d1d0583a0).

The clockface is based on [sdk-calendar-clock](https://github.com/Fitbit/sdk-calendar-clock) ([MIT License](https://github.com/Fitbit/sdk-calendar-clock/blob/master/LICENCE)) and [sdk-weather-clock](https://github.com/Fitbit/sdk-weather-clock) ([MIT License](https://github.com/Fitbit/sdk-weather-clock/blob/master/LICENCE)).

Icons are from https://materialdesignicons.com/ ([Apache license version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)) and from https://github.com/Fitbit/sdk-design-assets ([Design Asset License](https://github.com/Fitbit/sdk-design-assets/blob/master/LICENCE.txt)).

## Screenshots

![Activity](screenshots/activity.png) ![Event](screenshots/event.png)

## How to build

Clone the repository

```
git clone git@github.com:smirko-dev/fitbit-clockface.git
cd fitbit-homeassistant
```

Choose SDK version

| SDK | Device                            |
|-----|-----------------------------------|
| 4   | Versa, Versa Lite, Versa 2, Ionic |
| 6   | Versa 3, Sense                    |

```
cp package.sdkX.json package.json
```

Setup SDK and build the application

```
npm add --also=dev @fitbit/sdk
npm add --also=dev @fitbit/sdk-cli
npx fitbit-build generate-appid
npx fitbit-build
```
