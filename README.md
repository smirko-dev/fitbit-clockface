# Fitbit Ionic Clockface

![languages](https://img.shields.io/badge/languages-JavaScript%20|%20CSS-blue)
![platform](https://img.shields.io/badge/platform-Fitbit%20Ionic-silver)
![version](https://img.shields.io/badge/version-%201.1.1-green)
[![FitbitBuild Actions Status](https://github.com/smirko-dev/fitbit-clockface/workflows/FitbitBuild/badge.svg)](https://github.com/smirko-dev/fitbit-clockface/actions)

## Description

This is a simple clock face for Fitbit Ionic.
It comes with
- time (12/24hr format), date (including weekday)
- languages: de-DE, en-EN
- battery icon with status in percentage
- next calendar event of the current day

[Fitbit gallery](https://gallery.fitbit.com/details/ae441b73-2660-407f-b796-a98d1d0583a0)

The clockface is based on https://github.com/Fitbit/sdk-calendar-clock/.

Icons are from https://materialdesignicons.com/ ([Apache license version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)). 

## Screenshot

![Screenshot](screenshot.png)

## How to build

```
git clone git@github.com:smirko-dev/fitbit-clockface.git
cd fitbit-clockface
npm add --dev @fitbit/sdk
npm add --dev @fitbit/sdk-cli
npx fitbit-build generate-appid
npx fitbit-build
```
