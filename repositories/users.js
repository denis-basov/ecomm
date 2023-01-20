const fs = require("fs");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename; // write file name to property

    try {
      fs.accessSync(this.filename); // check access to file
    } catch (err) {
      fs.writeFileSync(this.filename, "[]"); // if error, create file
    }
  }
  async checkForFile() {}
}

new UsersRepository("users.json");
