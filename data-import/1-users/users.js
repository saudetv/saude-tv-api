
const names = ["john", "joanne", "bob", "will", "chris", "mike", "anna", "jack", "peter", "paul"];
const min = 18;
const max = 100;

module.exports = names.map(name => ({
    username: name,
    password: 123456,
    name: name,
    type: 'local'
}))