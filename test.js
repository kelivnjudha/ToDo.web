
const test = require('./models/manageData');

console.log(test);

const testUse = new test('Ploy', 'piiiii');
testUse.register().then(resolve => console.log(resolve)).catch(reject => console.log(reject));