#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var args = require('optimist')
      .usage('Usage: $0 --device [--in=src/pins.yaml] [--out-to-stdout] [--out=src/pins.h')
      .demand(['device'])
      .default('in', 'src/pins.yaml')
      .default('out', 'src/pins.h')
      .argv;

require('../src/generator')(args, function (err, content) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    if (args['out-to-stdout']) {
      console.log(content);
    } else {
      var outPath = process.cwd() + '/' + args.out;

      if (!canWritePath(path.dirname(outPath))) {
        console.error("Cannot write " + outPath);
        process.exit(1);
      }

      fs.writeFileSync(outPath, content);
      console.log('Done');
      process.exit(0);
    }
  }
});


function canWritePath(path) {
  var stat = fs.statSync(path),
      mode = stat.mode;

  return process.getuid() === stat.uid && (mode & 00200) ||
   process.getgid() === stat.gid && (mode & 00020) ||
   (mode & 00002);
}
