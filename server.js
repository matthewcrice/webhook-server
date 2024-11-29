var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var dt = require('./MyFirstModuale');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload[0].filepath;

      // make the DIR if it doesn't already exist
      var destinationPath = getDataPath();
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
    res.write("My Name is: " + dt.myName() );

    var destinationPath = getDataPath();
    var filesdir = fileList(destinationPath);
    var filenamesret = fileList(destinationPath).map((file) => file.split(path.sep).slice(-1)[0]);
    for (let i = 0; i < filesdir.length; i++) {
      res.write(filesdir[i] + '\n');
    }

    res.write(destinationPath);

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

function getDataPath()
{
  var DIR = 'data';
  var localPath = "";
  if(isLocalHost)
  {
    localPath = __dirname + "\\" + DIR + "\\";
  }
  else
  {
    testWrite();
    localPath = "/app/" + DIR;
  }

  if(!fs.existsSync(localPath))
  {
    fs.mkdirSync(localPath);
  }
  return localPath;
}

function isLocalHost(hostname = window.location.hostname) {
  return ['localhost', '127.0.0.1', '', '::1'].includes(hostname)
}

function testWrite()
{
  const filePath = path.join(__dirname, 'data', 'example.txt');
  const mountPath = process.env.RAILWAY_VOLUME_MOUNT_PATH;

  fs.writeFile(path.join(mountPath, 'example.txt'), 'Hello, World!', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully!');
    }
  });
}
