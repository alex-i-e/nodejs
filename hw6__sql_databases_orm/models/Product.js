const testProduct = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99.99,
    options: [
        { color: 'blue' },
        { size: 'XL' }
    ]
};
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