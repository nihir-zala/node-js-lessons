
const fs = require('fs');

console.log("lesson 3");

// fs.mkdir('./files');
// console.log('File creating');
// Sync function for creating file and the put the some data over there
// fs.writeFileSync("./files/hello.txt", "Code working fine");

// Async function for creating file and the put the some data over there
// fs.writeFile("./files/hello.txt", "Async function", (error) => {});
// console.log('File created');

// console.log("File reading");
// for read file and log the file data
// let contacts = fs.readFileSync('./files/contact.txt', "utf-8");
// console.log("contacts", contacts);


console.log("File Data Appending");
fs.appendFileSync('./files/hello.txt', `${Date.now()}\n`);
console.log("File Data Appended");