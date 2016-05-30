#include <AccelStepper.h>

AccelStepper stepper1(AccelStepper::FULL4WIRE, 2, 3, 4, 5); 
AccelStepper stepper2(AccelStepper::HALF4WIRE, 6, 7, 8, 9);

int steps_per_rev = 4096; // these motors come in two different gear rations, 

// see http://42bots.com/tutorials/28byj-48-stepper-motor-with-uln2003-driver-and-arduino-uno/ 
// and http://forum.arduino.cc/index.php?topic=71964.15

void setup() {

  Serial.begin(57600);
  
  stepper1.setMaxSpeed(200.0);
  stepper1.setAcceleration(100.0);
  
  stepper2.setMaxSpeed(200.0);
  stepper2.setAcceleration(100.0);
}

int done_reset1 = 0;
int done_reset2 = 0;

int x;
String str;

void loop() {

  if(done_reset1 == 0){
    delay(1000); 
    Serial.println("resetting 1 - moving to -"+steps_per_rev);
    stepper1.move(-steps_per_rev);

    done_reset1 = 1;
  }
  if(done_reset2 == 0){
    delay(1000); 
    Serial.println("resetting 2 - moving to -"+steps_per_rev);
    stepper2.move(-steps_per_rev);
    done_reset2 = 1;
  }

  if(done_reset1 == 1 && done_reset2 == 1){
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

}
