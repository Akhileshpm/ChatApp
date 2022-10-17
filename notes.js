const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const args = yargs(hideBin(process.argv)).argv

console.log(args);

if(args.list ==  1){
console.log(`listing notes count: ${args.list}`);
}

