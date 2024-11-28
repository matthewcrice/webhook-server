/*
const express = require("express");

// Create an Express app and listen for incoming requests on port 3000
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

// Use middleware to parse incoming requests with JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Handle GET requests to the root URL
router.get("/", (req, res) => {
  res.send("Welcome Matthew Rice");
});

// Handle POST requests to specific URLs i.e. webhook endpoints
router.post("/webhook-1", (req, res) => {
  console.log(req.body);
  res.send("Webhook 1 successfully received.");
});

router.post("/webhook-2", (req, res) => {
  console.log(req.body);
  res.send("Webhook 2 successfully received.");
});

// Mount the router middleware
app.use(router);

// Start the server and listen for incoming connections
app.listen(port, () => {
  console.log(`Server running at https://localhost:${port}/`);
});
*/
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var dt = require('./MyFirstModuale');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload[0].filepath;
      console.log(oldpath);
      var newpath = __dirname + "\\" + files.filetoupload[0].originalFilename;
      console.log(newpath);
      fs.rename(oldpath, newpath, function (err) {
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
    return res.end();
  }
}).listen(3000);