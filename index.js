const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");

const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : './tmp/'
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//start app
const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let data = req.files.data;

      console.log(1);
      data.mv("./uploads/" + data.name);

      console.log(2);

     
      //send response
      res.send({
          status: true,
          message: 'File is uploaded',
          data: {
              name: data.name,
              mimetype: data.mimetype,
              size: data.size
          }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/upload-photos", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let data = [];

      //loop all files
      _.forEach(_.keysIn(req.files.photos), (key) => {
        let photo = req.files.photos[key];

        //move photo to uploads directory
        photo.mv("./uploads/" + photo.name);

        //push file details
        data.push({
          name: photo.name,
          mimetype: photo.mimetype,
          size: photo.size,
        });
      });

      //return response
      res.send({
        status: true,
        message: "Files are uploaded",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/download", function (req, res) {
  console.log(1);
  var fileName = req.query.fileName;
  console.log(2);
  const file = `./uploads/${fileName}`;
  console.log(3);
  res.download(file); // Set disposition and send it.
});
