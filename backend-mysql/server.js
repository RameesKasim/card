const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pool = require("./db");

const app = express();

// connect to mysql

// mysql.connect((err) => {
//   if (err) {
//     console.log(err);
//     throw err;
//   }
//   console.log("mysql connected");
// });

//saving profile image to server

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name + ".png");
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

    const { name, designation, email, phone, whatsapp, linkedin } = req.body;
    const filename = req.file ? name + ".png" : "";

    pool.getConnection((err, connection) => {
      connection.query(
        "INSERT INTO cardtable(name, designation,phone,whatsapp,email,linkedin,profileimage)VALUES (?,?,?,?,?,?,?)",
        [name, designation, phone, whatsapp, email, linkedin, filename],
        (err, data) => {
          res.status(200).json({ name: name });
          if (err) {
            console.log(err);
            const errorString = err.sqlMessage;
            let msg = "";
            if (err.errno == 1062) {
              errorString.includes("name") && (msg = "User already exits");
              errorString.includes("email") && (msg = "Email already exits");
              errorString.includes("phone") &&
                (msg = "Phone number already exits");
              errorString.includes("whatsapp") &&
                (msg = "WhatsApp number already exits");
              errorString.includes("linkedin") &&
                (msg = "Linkedin id already exits");
            } else msg = "Data already exist";

            res.status(501).send([
              {
                status: "error",
                message: msg,
              },
            ]);
          }
        }
      );
    });

    mycard.email = email;
    mycard.cellPhone = phone;
    mycard.workPhone = whatsapp;
    mycard.lastName = name;
    mycard.title = designation;
    mycard.url = `https://www.linkedin.com/in/${linkedin}`;
    mycard.socialUrls["linkedIn"] = `https://www.linkedin.com/in/${linkedin}`;
    req.file && mycard.photo.embedFromFile(`./uploads/${filename}`);

    mycard.saveToFile(`./vcards/${name}.vcf`);

    pool.releaseConnection(connection);
  } catch (error) {
    // console.log(error);
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

    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT * FROM cardtable where name = ?",
        [name],
        (err, results) => {
          res.status(200).json(results[0]);
          console.log(results);
          pool.releaseConnection(connection);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("server started at port 5000");
});
