Module to control terneo wall monitor

##  Preparation

Please connect your device to the internet

Install NodeJS, if it is not yet
```
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs git make g++ gcc build-essential
```

Install this `wirenboard-mqtt-proxy` to global space
```
npm i -g wirenboard-mqtt-proxy
```

Start the proxy
```
wirenboard-mqtt-proxy start
```

To enable proxy autorun on boot use it
```
wirenboard-mqtt-proxy enable
```

##  Install

To install this packet use `wirenboard-module` command. Install it if necessary
```
npm i -g wirenboard-module
```

Add ebus module and rule
```
wirenboard-module terneo
```

##  Accessory to HomeBridge (using mqttthing)

```json
"accessories": [
  {
      "comment": "-------------------------  Heater 1 floor  -------------------------",
      "type": "thermostat",
      "name": "Отопление 1 этаж",
      "topics": {
          "getCurrentTemperature": "/devices/heating_floor_1/controls/temperature",
          "getTargetTemperature": "/devices/heating_floor_1/controls/target",
          "setTargetTemperature": "/devices/heating_floor_1/controls/target/on",
          "setTargetHeatingCoolingState": "/devices/heating_floor_1/controls/power/on",
          "getTargetHeatingCoolingState": "/devices/heating_floor_1/controls/power",
          "getCurrentHeatingCoolingState": "/devices/heating_floor_1/controls/load"
      },
      "minTemperature": 0,
      "maxTemperature": 40,
      "restrictHeatingCoolingState": [
          0,
          1
      ],
      "heatingCoolingStateValues": [
          0,
          1
      ],
      "accessory": "mqttthing"
  }
]
```

----

Best regards
- **FullHouse team**
- https://fullhouse-online.ru
- support@fullhouse-online.ru
