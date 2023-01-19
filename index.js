const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // use auto parser

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

// Request main page, method = POST
app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Account created");
});

app.listen(3000, () => {
  console.log("listening");
});
