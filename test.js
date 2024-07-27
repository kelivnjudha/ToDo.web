const test = require('./models/manageData');

console.log(test);

const testUse = new test('Ploy', '200210');
testUse.register().then(
    resolve => console.log(resolve)
).catch(
    err => console.log(err)
)
