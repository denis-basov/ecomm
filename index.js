const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <div>
        <form>
            <input placeholder="email"><br>
            <input placeholder="password"><br>
            <input placeholder="password confirmation"><br>
            <button>Sign Up</button>
        </form>
    </div>
  `);
});

app.listen(3000, () => {
  console.log("listening");
});
