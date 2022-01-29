---
layout: post
title:  "SMS (And More) From The Comfort Of My Keyboard"
date:   2022-01-23 20:37:00 -0500
categories: scrcpy sms linux android
---
As I am on my computer most of the day, one thing that has always bothered me was having to switch between tasks on my smartphone and computer, knowing perfectly well that my computer could handle the job of both. 

For example, I receive a number of SMS text messages throughout the day. It would be more efficient to respond to these messages from my computer rather than have to stop what I am doing, pick up my smartphone, type a response with my thumbs, and then go back to my computer keyboard.

Some of you may be thinking to yourself right now, "But isn't this a problem Apple solved with iPhone and Messages?" If I had an iPhone and a Mac computer with the messages app, you would be correct accoding to [this](https://support.apple.com/en-us/HT202549) support article. However, I have a [Motorola One 5G Ace](https://www.motorola.com/us/smartphones-motorola-one-5g-ace/p?skuId=537) Android smartphone and a [Dell XPS 13 9300](https://www.dell.com/en-us/shop/dell-laptops/new-xps-13-laptop/spd/xps-13-9300-laptop/xn9300cto230s?view=configurations&configurationid=27067850-5670-46ef-a8f1-3c9e9cce020a) laptop running Ubuntu, therefore I needed to devise a solution myself.

I began by researching ways to receive text messages on a computer. Since I use [Signal](https://signal.org/) as my SMS app on my Android device, I began exploring if they had a desktop application. It turns out that they do, but as [this](https://github.com/signalapp/Signal-Desktop/issues/1645) GitHub feature request states, they currently don't support SMS messages on the desktop and don't intend to do so. Thus, the Signal desktop app is only useful for communication between two Signal users. This didn't meet my criteria of being able to send SMS messages.

After this, I realized that sending SMS messages from a computer was too narrow of a focus. What I really wanted to do was control my Android smartphone from my computer. This would not only let me send SMS text messages, but also do anything my smartphone is capable from from the comfort of my keyboard.

I shifted focus and my research led to [AirDroid](https://www.airdroid.com/). This service allows you to access and control an Andorid device from over the web. The idea seems cool, but as I explored it more, I was asked to create an account and it seemed like some of the services were hidden behind a pay wall. I didn't enjoy this, so I decided to keep searching.

I also found [Vysor](https://www.vysor.io/), which seemed promising, but required you to sign in with a Google Account in order to run the program (at least according to this YouTube [video](https://www.youtube.com/watch?v=olzCJJEg98o)). I didn't see why this was necessary at all, so the search continued.

Seeing as there were multiple commerical options, I figured there must be some open source code this was all rooted from, most likely [Android Device Bridge](https://developer.android.com/studio/command-line/adb). This led me to the GitHub [repository](https://github.com/Genymobile/scrcpy) of `scrcpy`. Finally, an open-source solution using `adb` without unncessary account creation or third-party integrations!

I cloned the repository for `scrcpy` and followed the directions in [BUILD.md](https://github.com/Genymobile/scrcpy/blob/master/BUILD.md) to build the proram myself. The directions for the [Ubuntu build](https://github.com/Genymobile/scrcpy/blob/master/BUILD.md#debianubuntu) were spot-on for me, down to the comment about needing to update the `meson` Python package.

Once I had built `scrcpy`, I followed the directions provided to connect with my Android smartphone. (This is an important time to highlight the fact that in order for `scrcpy` to find your device, [developer mode needs to be actiavted and USB debugging needs to be enabled!](https://developer.android.com/studio/debug/dev-options#enable))

Since I was most interested in connecting with my Android device wirelessly, I focused on the [TCP/IP portion](https://github.com/Genymobile/scrcpy#tcpip-wireless) of the directions. This involved me having to find the IP address my Android device which I was able to find in the <i>About this device</i> portion of the settings on my phone. `scrcpy` comes with a `--tcpip` flag that is suppossed to find your Android device given it's IP address. However, that kept giving me errors like the below.

```bash
$ scrcpy --tcpip=192.168.1.1:5555
scrcpy 1.21 <https://github.com/Genymobile/scrcpy>
INFO: Connected to 192.168.1.1:5555
adb: error: failed to get feature set: device offline
ERROR: "adb push" returned with value 1
ERROR: Server connection failed
```

My device was in-fact online and connected to the same WiFi network as my Ubuntu machine, so I wasn't sure why I was seeing this message over and over again. I had to resort to connecting to my Android device [manually](https://github.com/Genymobile/scrcpy#manual), but this worked like a charm and I was able to mirror my Android device after doing this.

Since I had to add the extra step of connecting with `adb` manually, I thought it would be useful to create shell script to complete all of these steps. And then once I had the shell script completed, I thought to myself, <i>"Why don't I try building a desktop application?"</i> This was something I had never done before, so I [read about](https://help.ubuntu.com/community/UnityLaunchersAndDesktopFiles) `.desktop` files in Ubuntu and not before long had an app icon in my favorites bar for launching this shell script (complete with prompt and warning boxes!)

I included the source code for my shell script and `.desktop` file below. This was fun task to complete and I have to give a shoutout to the open source community behind `scrcpy` for putting together some awesome software. I have been using this for a few days now and haven't had any issues. It's been really nice to be able to see my incoming text messages on my computer.

# Pictures
{% capture path %}
    {{ site.url }}/assets/2022-01-23-scrcpy-sms/ip_address.png
{% endcapture %}
{% include blog_post_image.html path=path description='Prompt Box for IP Address' %}

{% capture path %}
    {{ site.url }}/assets/2022-01-23-scrcpy-sms/error.png
{% endcapture %}
{% include blog_post_image.html path=path description='Warning Box' %}

{% capture path %}
    {{ site.url }}/assets/2022-01-23-scrcpy-sms/android_mirror.png
{% endcapture %}
{% include blog_post_image.html 
    path=path 
    description='Android mirroring in action, featuring the last important thing I searched for.'
%}

# Code
<script src="https://gist.github.com/5cotts/0f23ce3ca9f391674a334dd6f54e61f9.js"></script>