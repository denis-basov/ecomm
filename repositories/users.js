const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

/**
 * class works with users data
 */
class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  /**
   * get all users
   */
  async getAll() {
    return JSON.parse(await fs.promises.readFile(this.filename, { encoding: "utf8" }));
  }

  /**
   *  create new user
   */
  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buffer = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buffer.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);

    return record;
  }

  /**
   * comparing passwords
   */
  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString("hex");
  }

  /**
   *  write users array to file
   */
  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  /**
   *  generate random user ID
   */
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  /**
   *  get one user by ID
   */
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  /**
   *  Delete user by ID
   */
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  /**
   *  Update user by ID
   */
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  /**
   *  Get user by any filter parameter
   */
  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = false;

      for (let key in filters) {
        if (filters[key] === record[key]) {
          found = true;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository("users.json");
