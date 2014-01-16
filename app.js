// Idea and a big part of the code taken from: http://backbonetutorials.com/seo-for-single-page-apps/
var express = require('express'),
    app = express(),
    server = process.argv[2] || 'liveblog16.sd-test.sourcefabric.org',
    blog_id = process.argv[3] || 1,
    url = 'http://' + server + '/content/lib/livedesk-embed/index.html?theme=default&id=' + blog_id,
    spawn = require('child_process').spawn;

var getContent = function(url, callback){
  var content = '';
  var phantom = spawn('phantomjs', ['phantom-server.js', url, server]);
  phantom.stdout.setEncoding('utf8');
  // Our phantom.js script is simply logging the output and
  // we access it here through stdout
  phantom.stdout.on('data', function(data){
    content += data.toString();
  });
  phantom.on('exit', function(code){
    if (code !== 0){
      console.log('We have an error');
    } else {
      // once our phantom.js script exits, let's call out call back
      // which outputs the contents to the page
      callback(content);
    }
  });
}

app.get(/(.*)/, function(req, res){
  getContent(url, function(content){
    res.send(content);
  });
});

app.listen(3000);
console.log('Listening on port 3000');
