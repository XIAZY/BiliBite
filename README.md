# BiliBite
The most elegant Bilibili client in the west hemisphere.

# Overview
BiliBite is the first (and the only so far) Bilibili client on Apple TV. This project is mainly written in JavaScript using Apple's TVML framework, but a little bit of native Swift code is also used due to the lack of JavaScript APIs provided by Apple.

BiliBite is claimed to be the most elegant Bilibili client in the west hemisphere. This app is mostly content-focused on anime bangumis without annoying distractions. But if you are a fan of other content (like movies, TV shows or kichiku), the "Top Chart" and "Search" tab is built right for you.

# Usage
This app may not be uploaded to the App Store since I don't have a developer account and US$99 a year is clearly too much for me. As a result, a Mac computer with Xcode installed is essential to deploy the app to an Apple TV. You may be required to re-deploy the app every week due to Apple's limitation on testing without a developer certificate.

## Examples
![](https://i.imgur.com/uDkBstB.jpg)
![](https://i.imgur.com/4d1ArFh.jpg)
![](https://i.imgur.com/SebVCKv.jpg)
![](https://i.imgur.com/B9Gqqhv.png)

GIFs:

http://i.imgur.com/vGYDTyC.gif

http://i.imgur.com/NioBrKl.gif

## By the way
As a sister project of this app, I wrote an API that gives the direct video link of any bilibili video page. This API is hosted on Google Cloud Platform as a serverless function. The URL of the API is

https://us-central1-cloud-176520.cloudfunctions.net/BiliAPI

### Usage
You have to provide one of the following parameter sets using GET method
- cid (recommended for all videos)
- av && page (optional, default to be 1) (non-bangumi only)
- episodeID (bangumi only, recommended if you cannot find the cid)
- season && episode (optional, default to be 1) (bangumi only, not very stable)

Examples:
https://us-central1-cloud-176520.cloudfunctions.net/BiliAPI?cid=21630951
https://us-central1-cloud-176520.cloudfunctions.net/BiliAPI?av=830527

DON'T OVERUSE IT


# License
This project is licensed under GPL v3.

You are NOT ALLOWED to upload this app to the App Store or release any signed binary package (i.e. end-user installable) under your account without the consent from me.
