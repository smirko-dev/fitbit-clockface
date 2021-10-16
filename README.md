# Fitbit Clockface

[![](https://img.shields.io/badge/Fitbit%20App%20Gallery-%2300B0B9?style=flat&logo=fitbit&logoColor=white)](https://gallery.fitbit.com/details/ae441b73-2660-407f-b796-a98d1d0583a0)
![languages](https://img.shields.io/badge/languages-JavaScript%20|%20CSS-blue)
![platform](https://img.shields.io/badge/platforms-Ionic%20|%20Versa%20|%20Versa%202%20|%20Versa%20Lite%20|%20Versa%203%20|%20Sense-silver)
![version](https://img.shields.io/badge/version-%201.5.2-green)
[![](https://img.shields.io/github/license/smirko-dev/fitbit-clockface.svg)](https://github.com/smirko-dev/fitbit-clockface/blob/master/LICENSE)
[![FitbitBuild Actions Status](https://github.com/smirko-dev/fitbit-clockface/workflows/FitbitBuild/badge.svg)](https://github.com/smirko-dev/fitbit-clockface/actions)
[![CodeQL Actions Status](https://github.com/smirko-dev/fitbit-clockface/workflows/CodeQL/badge.svg)](https://github.com/smirko-dev/fitbit-clockface/actions)

## Description

This is a simple clock face for Fitbit.
It comes with
- time (12/24hr format), date (including weekday)
- languages: de-DE, en-US
- battery icon (Ionic: and status in percentage)
- next calendar event of the current day
- user activity in case of no events (selectable in settings menu)
- six color schemes (selectable in settings menu)
- touch to hide calendar event temporarily

Find the latest published version in the [Fitbit gallery](https://gallery.fitbit.com/details/ae441b73-2660-407f-b796-a98d1d0583a0).

The clockface is based on https://github.com/Fitbit/sdk-calendar-clock/.

Icons are from https://materialdesignicons.com/ ([Apache license version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)). 

## Screenshots

![Activity](screenshots/activity.png) ![Event](screenshots/event.png)

## How to build

Choose SDK version

| SDK | Device                            |
|-----|-----------------------------------|
| 4   | Versa, Versa Lite, Versa 2, Ionic |
| 5   | Versa 3, Sense                    |

```
cp package.sdkX.json package.json
```

Run Fitbit CLI build
```
git clone git@github.com:smirko-dev/fitbit-clockface.git
cd fitbit-clockface
npm add --also=dev @fitbit/sdk
npm add --also=dev @fitbit/sdk-cli
npx fitbit-build generate-appid
npx fitbit-build
```
