import "babel-register";
import Product from "./models/Product";
import User from "./models/User";
import config from "./config/config.json";

console.log('test app.js init...');
console.log('app name...', config.name);

const product = new Product('new product');
const user = new User('new user');
