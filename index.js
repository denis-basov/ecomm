const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // use auto parser
app.use(cookieSession({ keys: ["23jhkj3hdf89sdfhnjk48sdfnljm4e"] })); // use cookie encrypt

// Request main page, method = GET
app.get("/", (req, res) => {
  // Send html to client
  res.send(`
    <div>
        <p>Your ID is: ${req.session.userId}</p>
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

  // create a user in repo
  const user = await usersRepo.create({ email, password });

  // store the ID inside the cookie
  req.session.userId = user.id;

  res.send("Account created");
});

app.listen(3000, () => {
  console.log("listening");
});
