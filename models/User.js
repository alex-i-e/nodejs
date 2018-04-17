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