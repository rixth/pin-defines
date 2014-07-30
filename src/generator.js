var fs = require('fs'),
    handlebars = require('handlebars'),
    version = require('./version').toString(),
    yaml = require('js-yaml'),
    _ = require('lodash');

var template = handlebars.compile(fs.readFileSync(__dirname + '/template.hbs').toString());

var deviceMap = yaml.safeLoad(fs.readFileSync(__dirname + '/devices/map.yaml'))

function Generator(options, callback) {
  var inPath = process.cwd() + '/' + options.in;

  if (!deviceMap[options.device]) {
    return callback("Invalid device", null);
  }

  if (!fs.existsSync(inPath)) {
    return callback("Cannot read " + inPath, null);
  }

  var devicePath = __dirname + '/devices/' + deviceMap[options.device] + '.yaml';
  var deviceData = yaml.safeLoad(fs.readFileSync(devicePath));

  try {
    var inputData = yaml.safeLoad(fs.readFileSync(inPath));
  } catch (e) {
    return callback("Error parsing input: " + e.message, null);
  }

  var map = Object.keys(inputData).reduce(function (map, name) {
    var pin = inputData[name];
    if (!deviceData.pins[pin]) {
      return callback("Pin " + pin + " (" + name + ") " + "cannot be assigned on a " + deviceData.name, null);
    }

    map.push(_.extend({
      name: name.toUpperCase()
    }, deviceData.pins[pin]));

    return map;
  }, [])

  var output = template({
    device: deviceData.name,
    version: version,
    date: (new Date).toString(),
    pins: map
  });

  callback(null, output);
}

module.exports = Generator;