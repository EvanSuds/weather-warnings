# Weather Warnings
A lightweight and simple Tizen OS 4.0 wearable web application that displays Met Office weather warnings in effect in the region (England, Wales and NI only for now, Scotland is still a WIP!)

## Prerequisites
You will need to provide your own API key for the [Reverse Geocoding API](https://rapidapi.com/bigdatacloud-pty-ltd-bigdatacloud-pty-ltd-default/api/reverse-geocoding-to-city) and insert it into the JS File before running.

This app will run on any **Tizen 4.0** smartwatch but has not been tested on later versions and is **not compatable with earlier versions** due to there being different permission models. 

You will also need to set up your own certificate if you want to run this on a smartwatch and not an emulator. See [here](https://samsung.github.io/Tizen.CircularUI/guide/CreatingCertificates.html) for more information. (Note: Samsung devices require a Samsung certificate, other Tizen devices require a Tizen certificate)

## Development
This project can be imported into [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download) which allows for the app to be ran on an emulator (Intel HAXM required) or a wearable running Tizen OS. If you want to run this on a Samsung device, you will need to install the Samsung Certificate Extension and the Samsung Wearable Extension, installable from the Extension SDK section of Tizen Studio's package manager.
