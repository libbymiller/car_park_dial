# Car Park Dial

A quick(-ish) hack to display some real-time open carpark data 
on physical dials using stepper motors.

You'll need the [AccelStepper 
library](http://www.airspayce.com/mikem/arduino/AccelStepper/).

The Bristol Open Data API is here 
[https://portal-bristol.api.urbanthings.io/#/home](https://portal-bristol.api.urbanthings.io/#/home)

It's designed to be an appliance, based on a Raspberry Pi, with an 
Arduino and two stepper motors.

Likely the callibration isn't right yet.

# Installation

## Set up your pi including the wifi

I used [these 
instructions](https://planb.nicecupoftea.org/2016/03/20/wifi-connect-quick-wifi-access-point-to-tell-a-raspberry-pi-about-a-wifi-network/) 
on a Pi 3.

## Install the pieces

     git clone https://github.com/libbymiller/car_park_dial
     cd car_park_dial
     npm install sleep serialport

# Wiring

When you wire up the Arduino to the motor drivers, the middle two wires 
need to be swapped, or it won't go backwards.

# Thanks

I used physical pieces and code from 
[Shonkbot](https://github.com/jarkman/shonkbot) and the wifi "appliance mode" from [Radiodan](http://radiodan.net).


# Pictures

<img src="img/IMG_2376.JPG" width="300px" />
<img src="img/IMG_2377.JPG" width="300px" />


