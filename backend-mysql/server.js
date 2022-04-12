require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const session = require("express-session");

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
          console.log(results);
          if (results.length > 0) {
            const id = results[0].id;
            const token = jwt.sign({ id, username }, process.env.JWT_KEY, {
              expiresIn: "24h",
            });
            res.json({ auth: true, token: token, user: results[0].username });
          } else {
            res.status(501).send([
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
    var vCardsJS = require("vcards-js");

    const mycard = vCardsJS();

    const { name, designation, email, phone, whatsapp, linkedin } = req.body;
    const filename = req.file ? name + ".png" : "";

    try {
      pool.getConnection((err, connection) => {
        connection.query(
          "INSERT INTO barracud_cardtable(name, designation,phone,whatsapp,email,linkedin,profileimage)VALUES (?,?,?,?,?,?,?)",
          [name, designation, phone, whatsapp, email, linkedin, filename],
          (err, data) => {
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
              res.status(200).json({ name: name, msg: "Card Added" });
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
        "SELECT * FROM barracud_cardtable where name =  ?",
        [name],
        (err, results) => {
          results.length > 0
            ? res.status(200).json(results[0])
            : res.status(501).send([
                {
                  status: "error",
                  message: "Data not found",
                },
              ]);
          if (err) {
            res.status(501).send([
              {
                status: "error",
                message: err,
              },
            ]);
          }
          pool.releaseConnection(connection);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});

//getting cardslist

app.get("/cardslist", verifyJWT, async (req, res) => {
  try {
    const { page_size, page, search } = req.query;
    let pageSize = parseInt(page_size);
    let pageNumber = (parseInt(page) - 1) * 10;
    let result = {};
    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT  name,designation,profileimage FROM barracud_cardtable  WHERE name LIKE ? ORDER BY name LIMIT ?,?",
        [`${search}%`, pageNumber, pageSize],
        (err, results) => {
          if (err) {
            res.status(501).send([
              {
                status: "error",
                message: msg,
              },
            ]);
          }
          result.cardList = results;
        }
      );
    });
    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT COUNT(1) as total FROM barracud_cardtable  WHERE name LIKE ? ",
        [`${search}%`],
        (err, results) => {
          if (err) {
            res.status(501).send([
              {
                status: "error",
                message: msg,
              },
            ]);
          }
          result.totalCards = results[0].total;
          res.status(200).json(result);
        }
      );
    });
  } catch (error) {}
});

// getting a card with name

app.get("/carddetails/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    pool.getConnection((err, connection) => {
      connection.query(
        "SELECT * FROM barracud_cardtable where card_id = ?",
        [id],
        (err, results) => {
          results.length > 0
            ? res.status(200).json(results[0])
            : res.status(501).send([
                {
                  status: "error",
                  message: "Data not found",
                },
              ]);
          pool.releaseConnection(connection);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});

// updating a card with id

app.put("/card/:id", verifyJWT, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    var vCardsJS = require("vcards-js");
    const mycard = vCardsJS();
    const { name, designation, email, phone, whatsapp, linkedin } = req.body;
    const filename = req.file ? name + ".png" : "";
    console.log(id);

    try {
      pool.getConnection((err, connection) => {
        connection.query(
          "UPDATE  barracud_cardtable SET name=?,designation=?,phone=?,whatsapp=?,email=?,linkedin=? where card_id=?",
          [name, designation, phone, whatsapp, email, linkedin, id],
          (err, data) => {
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
              res.status(200).json({ name: name, msg: "Card Updated" });
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  } catch (err) {}
});

//deleting a card

app.delete("/card/:id", async (req, res) => {
  try {
    const { id } = req.params;
    pool.getConnection((err, connection) => {
      connection.query(
        "DELETE FROM  barracud_cardtable where card_id=?",
        [id],
        (err, data) => {
          if (err) {
            console.log(err);
          }
          if (!err) {
            res.status(200).json({ message: "data deleted" });
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
