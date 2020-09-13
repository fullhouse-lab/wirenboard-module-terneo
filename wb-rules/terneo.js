var terneo = require("terneo");

terneo.start({
  id: "heating_floor_1",
  title: "Heating 1 floor (Terneo)",

  mqtt_prefix: "terneo",
  mqtt_clientId: "1_floor"
});

terneo.start({
  id: "heating_floor_2",
  title: "Heating 2 floor (Terneo)",

  mqtt_prefix: "terneo",
  mqtt_clientId: "2_floor"
});
