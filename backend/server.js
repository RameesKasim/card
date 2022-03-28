const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const app = express();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(cors());

//generating a static url

app.use("/uploads", express.static("./uploads"));

//saving data to database

app.post("/", upload.single("file"), async (req, res) => {
  try {
    var vCardsJS = require("vcards-js");

    const mycard = vCardsJS();

    const {
      name,
      designation,
      email,
      phone,
      whatsapp,
      qualification,
      linkedin,
    } = req.body;
    const filename = req.file ? name + path.extname(req.file.originalname) : "";

    const result = await pool.query(
      "INSERT INTO cardtable(name, designation,phone,whatsapp,email,linkedin,profileimage,qualification)VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING name;",
      [
        name,
        designation,
        phone,
        whatsapp,
        email,
        linkedin,
        filename,
        qualification,
      ]
    );

    mycard.email = email;
    mycard.cellPhone = phone;
    mycard.workPhone = whatsapp;
    mycard.lastName = name;
    mycard.title = designation;
    mycard.qualification = qualification;
    mycard.url = `https://www.linkedin.com/in/${linkedin}`;
    mycard.socialUrls["linkedIn"] = `https://www.linkedin.com/in/${linkedin}`;
    req.file && mycard.photo.embedFromFile(`./uploads/${filename}`);

    mycard.saveToFile(`./vcards/${name}.vcf`);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    const errorString = error.detail;
    let msg = "";
    if (error.code == "23505") {
      errorString.includes("name") && (msg = "User already exits");
      errorString.includes("email") && (msg = "Email already exits");
      errorString.includes("phone") && (msg = "Phone number already exits");
      errorString.includes("whatsapp") &&
        (msg = "WhatsApp number already exits");
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

app.get("/vcard/:name", async (req, res) => {
  try {
    const { name } = req.params;
    res.download(`./vcards/${name}.vcf`);
  } catch (error) {
    console.log(error);
  }
});

//retrieving data

app.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const details = await pool.query(
      "SELECT * FROM cardtable where name = $1",
      [name]
    );

    res.status(200).json(details.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("server started at port 5000");
});
