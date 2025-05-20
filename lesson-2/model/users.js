class User {
  constructor({ name, email, id }) {
    if (id == null) {
      throw new Error('Id is required');
    }
    this.name = name;
    this.email = email;
    this.id = id;
  }
}

module.exports = {
  User,
};
