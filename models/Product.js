export default class {

  constructor(name) {
    this.name = name;

    console.log('Product module');
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }
}