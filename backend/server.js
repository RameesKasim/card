const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.use("/uploads", express.static("./uploads"));

app.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, designation, email, phone, phoneTwo, linkedin } = req.body;
    const filename = req.file ? name + path.extname(req.file.originalname) : "";
    const result = await pool.query(
      "INSERT INTO cardtable(name, designation,phone,phonetwo,email,linkedin,profileimage)VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING name;",
      [name, designation, phone, phoneTwo, email, linkedin, filename]
    );
    res.status(200).json(result.rows[0]);
    console.log(newid);
  } catch (error) {
    const errorString = error.detail;
    let msg = "";
    if (error.code == "23505") {
      errorString.includes("name") && (msg = "User already exits");
      errorString.includes("email") && (msg = "Email already exits");
      errorString.includes("phone") && (msg = "Phone number already exits");
      errorString.includes("linkedin") && (msg = "Linkedin id already exits");
    } else msg = "Data already exist";

    res.send(501, [
      {
        status: "error",
        message: msg,
      },
    ]);

    console.log(error);
  }
});

app.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name);
    const details = await pool.query(
      "SELECT * FROM cardtable where name = $1",
      [name]
    );
    console.log(details);

    res.status(200).json(details.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("server started at port 5000");
});
