// MultiStepper.pde
// -*- mode: C++ -*-
//
// Shows how to multiple simultaneous steppers
// Runs one stepper forwards and backwards, accelerating and decelerating
// at the limits. Runs other steppers at the same time
//
// Copyright (C) 2009 Mike McCauley
// $Id: MultiStepper.pde,v 1.1 2011/01/05 01:51:01 mikem Exp mikem $
#include <AccelStepper.h>


// Define some steppers and the pins the will use
// The middle pins must be swapped or it won't go backwards!
AccelStepper stepper1(AccelStepper::FULL4WIRE, 2, 3, 4, 5); 
AccelStepper stepper2(AccelStepper::HALF4WIRE, 6, 7, 8, 9);


void setup()
{  
    Serial.begin(57600);
    stepper1.setMaxSpeed(200.0);
    stepper1.setAcceleration(100.0);
    stepper2.setMaxSpeed(200.0);
    stepper2.setAcceleration(100.0);

    // needs a better way of resetting these
    // this works as a one-off
    //stepper1.setCurrentPosition(0);
    //stepper2.setCurrentPosition(0);

}

int x;
String str;

void loop()
{

    //expects t=int or s=int
    if(Serial.available() > 0)
    {
        str = Serial.readStringUntil('=');
        x = Serial.parseInt();
        if(str == "t"){
            Serial.println(str+" t is "+x);
            stepper1.moveTo(x);

        }else{
          if(str == "s"){
            Serial.println(str+" s is "+x);          
            stepper2.moveTo(x);

          }
        }
    }
  
  stepper1.run();
  stepper2.run();

}
