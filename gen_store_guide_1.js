#!/usr/bin/env node

// http://nicolashery.com/parse-data-files-using-nodejs-streams/

var Transform = require('stream').Transform;
var csv = require('csv-streamify');
var JSONStream = require('JSONStream');
var sort = require('sort-stream');

var csvToJson = csv({objectMode: true});
var parser = new Transform({objectMode: true});

parser._tmp_first_letter = '';
parser._tmp_first_letter_on = true;
parser._transform = function(data, encoding, done) {
  // Because an empty line becomes [""], which data.length == 1 
  if(data.length > 1) {
    var item = data[0];
    var first_letter = item[0];
    var row = data[1];
    var highlight = data[2];

    if(this._tmp_first_letter != first_letter) {
      this._tmp_first_letter = first_letter;
      parser._tmp_first_letter_on = true; 
    }
    else {
      parser._tmp_first_letter_on = false;
    }

    // https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
    var line = '';
    if(highlight == 'TRUE') {
      line = '* ' + '**' + item + '**' + ', ' + '**' + row + '**' + '\n';
    }
    else {
      line = '* ' + item + ', ' + '**' + row + '**' + '\n';
    }

    if(parser._tmp_first_letter_on) {
      line = '## ' + this._tmp_first_letter + '\n' +line;
    }

    this.push(line);  
  }

  done();

};

var jsonToStrings = JSONStream.stringify(false);

// https://www.npmjs.com/package/sort-stream
// Sample data:
// ["Bins","9",""]
// ["Bird Seed","9",""]
// ["Biscuits","6","TRUE"]
function my_sort(a, b) {
  if(a[0] >= b[0]) {
    return 1;
  }
  else {
    return -1;
  }

}


process.stdin
.pipe(csvToJson)
.pipe(sort(my_sort))
.pipe(parser)
//.pipe(jsonToStrings)
.pipe(process.stdout);

