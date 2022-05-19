require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const vCardsJS = require("vcards-js");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

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

app.get("/", async (req, res) => {
  try {
    res.send("<div>Nodejs Backend</div>");
  } catch (error) {
    console.log(error);
  }
});

//login

app.post("/login", upload.fields([]), async (req, res) => {
  const { username, password } = req.body;
  try {
    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT * FROM barracud_logintable WHERE username=? and password=?",
        [username, password],
        (err, results) => {
          connection.release();
          console.log(results);
          if (results.length > 0) {
            const id = results[0].id;
            const token = jwt.sign({ id, username }, process.env.JWT_KEY, {
              expiresIn: "24h",
            });
            res.json({ auth: true, token: token, user: results[0].username });
          } else {
            res.status(400).send([
              {
                status: "error",
                message: "username and password doesn't match",
              },
            ]);
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).send([
      {
        status: "error",
        message: "Token not find",
      },
    ]);
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401).send([
          {
            status: "error",
            message: "Authentication Failed",
          },
        ]);
      }
      req.user = decoded.username;
      next();
    });
  }
};

//  adding a new card

app.post("/card", verifyJWT, upload.single("file"), async (req, res) => {
  try {
    const mycard = vCardsJS();
    const { name, designation, email, phone, whatsapp, linkedin } = req.body;
    const filename = req.file ? name + ".png" : "";
    const url = await name.split(" ").join("").toLowerCase();

    try {
      pool.getConnection((err, connection) => {
        connection.query(
          "INSERT INTO barracud_cardtable(url,name, designation,phone,whatsapp,email,linkedin,profileimage)VALUES (?,?,?,?,?,?,?,?)",
          [url, name, designation, phone, whatsapp, email, linkedin, filename],
          (err, data) => {
            connection.release();
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
              res.status(400).send([
                {
                  status: "error",
                  message: msg,
                },
              ]);
            }
            if (data) {
              mycard.email = email;
              mycard.cellPhone = phone;
              mycard.workPhone = whatsapp;
              mycard.lastName = name;
              mycard.title = designation;
              mycard.url = `https://www.linkedin.com/in/${linkedin}`;
              mycard.socialUrls[
                "linkedIn"
              ] = `https://www.linkedin.com/in/${linkedin}`;
              req.file && mycard.photo.embedFromFile(`./uploads/${filename}`);

              mycard.saveToFile(`./vcards/${name}.vcf`);
              res.status(200).json({ url: url, msg: "Card Added" });
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  } catch (err) {}
});

// getting a card with name

app.get("/card/:name", async (req, res) => {
  try {
    const { name } = req.params;
    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT * FROM barracud_cardtable where url =  ?",
        [name],
        (err, results) => {
          connection.release();
          if (results.length > 0) {
            if (results[0].profileimage.length > 0) {
              const file = fs.readFileSync(
                `./uploads/${results[0].profileimage}`,
                {
                  encoding: "base64",
                }
              );
              results[0].image = file;
            } else results[0].image = "";

            res.status(200).json(results[0]);
          } else {
            res.status(501).send([
              {
                status: "error",
                message: "Data not found",
              },
            ]);
          }
          if (err) {
            res.status(501).send([
              {
                status: "error",
                message: err,
              },
            ]);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});

//getting cardslist

app.get("/cardslist", verifyJWT, async (req, res, next) => {
  try {
    const { page_size, page, search } = req.query;
    let pageSize = parseInt(page_size);
    let pageNumber = (parseInt(page) - 1) * pageSize;
    let result = {};
    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT  url,name,designation,profileimage FROM barracud_cardtable  WHERE name LIKE ? ORDER BY name LIMIT ?,?",
        [`${search}%`, pageNumber, pageSize],
        (err, results) => {
          if (results) {
            let images = [];
            results.map((result) => {
              if (result.profileimage.length > 0) {
                const file = fs.readFileSync(
                  `./uploads/${result.profileimage}`,
                  {
                    encoding: "base64",
                  }
                );
                images.push(file);
              } else {
                images.push("");
              }
            });
            result.images = images;
            connection.query(
              "SELECT COUNT(1) as total FROM barracud_cardtable  WHERE name LIKE ? ",
              [`${search}%`],
              (err, restwo) => {
                connection.release();
                if (err) {
                  res.status(501).send([
                    {
                      status: "error",
                      message: msg,
                    },
                  ]);
                }
                result.totalCards = restwo[0].total;
                result.cardList = results;
                res.status(200).json(result);
              }
            );
          }
          if (err) {
            connection.release();
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
  } catch (error) {}
});

// updating a card with url

app.put("/card/:url", verifyJWT, upload.single("file"), async (req, res) => {
  try {
    const { url } = req.params;
    const mycard = vCardsJS();
    const { name, designation, email, phone, whatsapp, linkedin } = req.body;
    let filename = req.file ? name + ".png" : "";
    let updateUrl = await name.split(" ").join("").toLowerCase();
    try {
      pool.getConnection((err, connection) => {
        connection.query(
          "select profileimage from barracud_cardtable where url=?",
          [url],
          (err, data) => {
            if (err) {
              connection.release();
              res.status(501).send([
                {
                  status: "error",
                  message: "Data not found",
                },
              ]);
            }
            if (data[0].profileimage.length > 0 && !req.file)
              filename = data[0].profileimage;
            connection.query(
              "UPDATE  barracud_cardtable SET url=?, name=?,designation=?,phone=?,whatsapp=?,email=?,linkedin=?,profileimage=? where url=?",
              [
                updateUrl,
                name,
                designation,
                phone,
                whatsapp,
                email,
                linkedin,
                filename,
                url,
              ],
              (err, data) => {
                connection.release();
                if (err) {
                  console.log(err);
                  const errorString = err.sqlMessage;
                  let msg = "";
                  if (err.errno == 1062) {
                    errorString.includes("name") &&
                      (msg = "User already exits");
                    errorString.includes("email") &&
                      (msg = "Email already exits");
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
                if (data) {
                  mycard.email = email;
                  mycard.cellPhone = phone;
                  mycard.workPhone = whatsapp;
                  mycard.lastName = name;
                  mycard.title = designation;
                  mycard.url = `https://www.linkedin.com/in/${linkedin}`;
                  mycard.socialUrls[
                    "linkedIn"
                  ] = `https://www.linkedin.com/in/${linkedin}`;
                  req.file &&
                    mycard.photo.embedFromFile(`./uploads/${filename}`);
                  mycard.saveToFile(`./vcards/${name}.vcf`);
                  res
                    .status(200)
                    .json({ name: name, msg: "Card Updated", url: updateUrl });
                }
              }
            );
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  } catch (err) {}
});

//deleting a card

app.delete("/card/:name", async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name);
    app.set("vcf-path", path.join(__dirname, `vcards/${name}.vcf`));
    app.set("image-path", path.join(__dirname, `uploads/${name}.png`));

    pool.getConnection((err, connection) => {
      connection.query(
        "DELETE FROM  barracud_cardtable where name=?",
        [name],
        (err, data) => {
          if (err) {
            console.log(err);
          }
          if (data) {
            fs.unlink(app.get("vcf-path"), (err) => {
              if (err) console.log(err);
            });
            fs.unlink(app.get("image-path"), (err) => {
              if (err) console.log(err);
            });
            res.status(200).json({ message: "Card deleted" });
          }
        }
      );
    });
  } catch (err) {}
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

app.listen(5000, () => {
  console.log("server started at port 5000");
});
