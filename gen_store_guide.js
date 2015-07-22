#!/usr/bin/env node

var Promise = require('promise');
var csv = require('csv-parse');
var fs = require('fs');
var program = require('commander');

var path = require('path');



function parseCSV(file) {
  return new Promise(function (resolve, reject) {
    // Never seen this sturcture.
    var parser = csv({delimiter: ','},
      function (err, data) {
        if (err) {
          reject(err);
        } 
        else {
          resolve(data);
        }

        parser.end();

     });

     fs.createReadStream(file).pipe(parser);

  });
}


function loop_each_element(element, index, array) {
  var item, row, highlight;
  
  if(element[0] != '') {
    item = element[0];
    row = element[1];
    highlight = element[2];

    var nl = "\n";
    var content = item + " " + row + " " + hightlight + nl;
    console.log(content);

    // http://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node
    //var my_file = fs.createWriteStream(output_file, {'flags': 'a'});

    /*
    var content = 
      nl +
      "-s-" + nl +
      item + nl + 
      row + nl +
      highlight + nl +
      "-e-" + nl;
    */

    //my_file.end(content);

  }

}


function _get_output_file(input_file) {
  var home_dir = path.resolve('.');

  var file_json = path.parse(input_file);
  var output_file = home_dir + '/output/' + file_json.name + '.md';

  return output_file;
}


// Sample input
//var input_file = __dirname + '/input/australia_melbourne_city_qv_2015_06_19.csv'; 

// Sample output
//var output_file = __dirname + '/output/australia_melbourne_city_qv_2015_06_19.md';

// Main
program
  .version('0.0.1')
  .parse(process.argv);

var input_file = program.args[0];
input_file = path.resolve(input_file);
var output_file = _get_output_file(input_file);

// Initialize
var my_file = fs.createWriteStream(output_file, {'flags': 'w'});
my_file.end('');

parseCSV(input_file).then(function(data){
  //data.sort();

  data.forEach(loop_each_element);

},function(reason){
  console.error(reason); // error;
})


