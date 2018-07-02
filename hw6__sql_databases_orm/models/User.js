const testProduct = {
    id: 3,
    username: "Yakov",
    email: "yakov@global.com",
    password: "12345678",
    passwordHash: ""
};

export default class {

  constructor(name) {
    this.name = name;

    console.log('User module');
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }
}