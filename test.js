const test = require('./models/manageData');

console.log(test);

const testUse = new test('Ploy', 'newpass');
testUse.theme().then(resolve => {console.log(resolve)}).catch(reject => {console.log(reject)});