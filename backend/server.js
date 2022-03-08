const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pool = require("./db");
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("server started at port 5000");
});
