  var fs = require('fs'); 
  var http = require('http'),
    url = require('url'),
    formidable = require('formidable')
    util = require('util');

  var server = http.createServer().listen(8080);
  var htmlFile; 

  fs.readFile('./test.html', function(err, data) {
      if (err){
          throw err;
      }   
      htmlFile = data;
  });

  server.on('request', function(request, response) {
      // console.dir(request.body); 
      if (request.method === 'POST') {
    var form = new formidable.IncomingForm(),
      fields = [],
      files = [];

    form.on('error', function(err){
      response.writeHead(200, {'content-type': 'text/plain'});
      response.end('error:\n\n' + util.inspect(err));
    });

    form.on('field', function(field, value){
      // console.log(field, value);
      fields.push([field, value]);
    });

    form.on('file', function(field, file){
      console.log(field, file);
      files.push([field, file]);
    });

    form.on('end', function(){
      console.log('-> upload done');
      response.writeHead(200, {'content-type': 'text/plain'});
      response.write('Received fields:\n\n ' + util.inspect(fields));
      response.write('\n\n');
      response.end('received files:\n\n ' + util.inspect(files));
    });

    form.encoding = 'utf-8';
    form.uploadDir = './img';
    form.keepExtensions = true;
    form.parse(request);
  } else if (request.method === 'GET') {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(htmlFile);
      response.end();

      
      }
  });
