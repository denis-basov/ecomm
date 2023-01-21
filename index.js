const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

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
app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send("Email in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  res.send("Account created");
});

app.listen(3000, () => {
  console.log("listening");
});
