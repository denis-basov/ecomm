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

  // get all users
  async getAll() {
    // read file contents, parse, return data
    return JSON.parse(await fs.promises.readFile(this.filename, { encoding: "utf8" }));
  }

  // create new user
  async create(attrs) {
    // get array of users from file
    const records = await this.getAll();

    // add user to array
    records.push(attrs);

    // write the updated array
    await fs.promises.writeFile(this.filename, JSON.stringify(records));
  }
}

const test = async () => {
  const repo = new UsersRepository("users.json");
  await repo.create({ email: "test@test.ru", password: "123456789" });
  const users = await repo.getAll();
  console.log(users);
};

test();
