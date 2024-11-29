var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var dt = require('./MyFirstModuale');

var DIR = 'data';

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload[0].filepath;

      // make the DIR if it doesn't already exist
      var destinationPath = __dirname + "\\" + DIR + "\\";
      if(!fs.existsSync(DIR))
      {
        fs.mkdirSync(DIR);
      }
      var fullpath = destinationPath + files.filetoupload[0].originalFilename;

      //
      fs.rename(oldpath, fullpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
      res.write('File uploaded and moved!');
      res.end();
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.write("The date and time are currently: " + dt.myDateTime() + "\n");
    res.write("\nMy Name is: " + dt.myName());



    if (fs.existsSync(DIR)) {
      // 1. List all files in DIR
      var filesdir = fileList(DIR);
      // => ['/usr/local/bin/babel', '/usr/local/bin/bower', ...]

      // 2. List all file names in DIR
      var filenamesret = fileList(DIR).map((file) => file.split(path.sep).slice(-1)[0]);
      // => ['babel', 'bower', ...]


      for (let i = 0; i < filesdir.length; i++) {
        res.write(filesdir[i] + '\n');
      }
    }

    return res.end();
  }
}).listen(3000);

// String -> [String]
function fileList(dir) {
  return fs.readdirSync(dir).reduce(function(list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}