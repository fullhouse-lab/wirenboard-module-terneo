var MODULE_NAME 		= "terneo";
var MODULE_VERSION  = "1.5.0";

exports.start = function(config) {
	if (!validateConfig(config)) return;

	//  device  //
	createDevice(config);

	//  topics map  //
	var topicsMap = getTopicsMap(config);

	//  proxy  //
	setProxy(config.id, getProxyTasks(topicsMap));

	//  rules  //
  createRule_RANGE_target(config);

  log(config.id + ": Started (" + MODULE_NAME + " ver. " + MODULE_VERSION + ")");
};

//  Validate config  //

var validateConfig = function(_config) {
  if (!_config) {
    log("Error: " + MODULE_NAME + ": No config");
    return false;
  }

  if (!_config.id || !_config.id.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad id");
    return false;
  }

  if (!_config.title || !_config.title.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad title");
    return false;
  }

  return true;
}

//
//  Device  //
//

function createDevice(config) {
	var cells = {
    proxy_connected: 	{ type: "value", 	value: 0, forceDefault: true, readonly: false },

		target: 	   { type: "range", value: 0, max: 40, forceDefault: true, readonly: false },
		temperature: { type: "temperature", 	value: 0, forceDefault: true, readonly: false },
		load: 	     { type: "value", 	value: 0, forceDefault: true, readonly: false },
	}

	defineVirtualDevice(config.id, {
	  title: config.title,
	  cells: cells
	});
}

//
//  Topics map  //
//

function getTopicsMap(config) {
	topicsMap = {};

  topicsMap["temperature"] = {
    from: config.mqtt_prefix + "/" + config.mqtt_clientId + "/floorTemp",
    to:   "/devices/" + config.id + "/controls/temperature"
  };

  topicsMap["target"] = {
    from: config.mqtt_prefix + "/" + config.mqtt_clientId + "/setTemp",
    to:   "/devices/" + config.id + "/controls/target"
  };

  topicsMap["load"] = {
    from: config.mqtt_prefix + "/" + config.mqtt_clientId + "/load",
    to:   "/devices/" + config.id + "/controls/load"
  };

	return topicsMap;
}

//
//  Proxy  //
//

function getProxyTasks(topicsMap)
	var tasks = [];
	Object.keys(topicsMap).forEach(function(item) {
		tasks.push('{'
			+ '"task": "add",'
			+ '"from": "' + topicsMap[item].from + '",'
			+ '"to": "' + topicsMap[item].to + '"'
			+ '}');
	});

	return tasks;
}

function setProxy(device_id, proxyTasks) {
	// log("Proxy tasks: ");
	// proxyTasks.forEach(function(task) {
	// 	log(task);
	// });

	setInterval(function(){
		//  wait service started  //
		if (dev["mqtt-proxy"]["connected"] !== 1) return;

		//  set topics  //
		if (dev[device_id]["proxy_connected"] !== 1) {
			dev[device_id]["proxy_connected"] = 1;
			log(device_id + ": Connected to proxy");

			proxyTasks.forEach(function(task) {
				dev["mqtt-proxy"]["config"] = task;
			});
		}
	}, 1000);
}

//
//  Rules  //
//

function createRule_RANGE_target(config) {
	defineRule({
    whenChanged: config.id + "/target",
    then: function (newValue, devName, cellName) {
			log(config.id + ": New target: " + newValue);
      publish(config.mqtt_prefix + "/" + config.mqtt_clientId + "/setTemp", newValue);
		}
	});
}
