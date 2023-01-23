const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // use auto parser
app.use(cookieSession({ keys: ["23jhkj3hdf89sdfhnjk48sdfnljm4e"] })); // use cookie encrypt

// main page
app.get("/", (req, res) => {
  const markup = `
    <div>
      <a href="/signup">Sign Up</a><br>
      <a href="/signin">Sign In</a>
    </div>
  `;
  res.send(markup);
});

// Request signup page, method = GET
app.get("/signup", (req, res) => {
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

// Request signup page, method = POST
app.post("/signup", async (req, res) => {
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

  res.send(`Account created, ${user.email.split("@")[0]}<br><a href='/signout'>Sign out</a>`);
});

// Request signout page, method = GET
app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out<br><a href='/'>Main page</a>");
});

// Request signin page, method = GET
app.get("/signin", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
          <input name="email" placeholder="email"><br>
          <input name="password" placeholder="password"><br>
          <button>Sign In</button>
      </form>
    </div>
  `);
});

// Request signin page, method = POST
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send(`Email not found`);
  }

  const isValidPassword = await usersRepo.comparePasswords(user.password, password);
  if (!isValidPassword) {
    return res.send(`Password is not correct`);
  }

  req.session.userId = user.id;
  res.send(`You are signed in, ${user.email.split("@")[0]}<br><a href='/signout'>Sign out</a>`);
});

app.listen(3000, () => {
  console.log("listening");
});
