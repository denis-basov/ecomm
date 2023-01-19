const express = require("express");
const app = express();

// Request main page, method = GET
app.get("/", (req, res) => {
  // Send html to client
  res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"><br>
            <input name="password" placeholder="password"><br>
            <input name="passwordConfirmation" placeholder="password confirmation"><br>
            <button>Sign Up</button>
        </form>
    </div>
  `);
});

const bodyParser = (req, res, next) => {
  if (req.method === "POST") {
    req.on("data", (data) => {
      const parsed = data.toString("utf8").split("&"); // recieve data, parse to array of strings
      const formData = {}; // object for formated data
      for (let pair of parsed) {
        // loop through array
        const [key, value] = pair.split("="); // split every element by '=' on two var
        formData[key] = value; // add data to final object
      }
      req.body = formData;
      next();
    });
  } else {
    next();
  }
};

// Request main page, method = POST
app.post("/", bodyParser, (req, res) => {
  console.log(req.body);
  res.send("Account created");
});

app.listen(3000, () => {
  console.log("listening");
});
