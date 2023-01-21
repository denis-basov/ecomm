const fs = require("fs");
const crypto = require("crypto");

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
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
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
