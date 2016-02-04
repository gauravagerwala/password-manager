console.log('Starting password Manager..');

var storage = require('node-persist');
storage.initSync();

var crypto = require('crypto-js');

var argv = require('yargs')
          .command('create', 'Create an account and save its password', function (yargs){
            yargs.options({
              name: {
                demand: true,
                alias: 'n',
                description: 'The account whose data needs to be saved goes here..',
                type: 'string'
              },
              username: {
                demand: true,
                alias: 'u',
                description: 'The user name of the account to be saved goes here..',
                type: 'string'
              },
              password: {
                demand: true,
                alias: 'p',
                description: 'The password of the accout goes here..',
                type: 'string'
              },
              masterPassword: {
                demand: true,
                alias: 'm',
                description: 'The master password goes here',
                type: 'string'
              }
            }).help('help');
          }).help('help')
          .command('get','Get the password and username of stored account', function (yargs){
            yargs.options({
              name: {
                demand: true,
                alias: 'n',
                description: 'The account whose data you need to fetch..',
                type: 'string'
              },
              masterPassword: {
                demand: true,
                alias: 'm',
                description: 'The master password goes here',
                type: 'string'
              }
            }).help('help');
          }).help('help')
          .argv;

var command = argv._[0];

function getAccounts(masterPassword){

  var encryptedAccounts = storage.getItemSync('accounts');

  var bytes = crypto.AES.decrypt(accounts,masterPassword);
  var decryptedAccounts = JSON.parse(bytes.toString(crypto.enc,UTF8));

  if(typeof decryptedAccounts === 'undefined'){
    decryptedAccounts =[];
  }

  return decryptedAccounts;
}

function saveAccounts(accounts, masterPassword){

  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

  storage.setItemSync('accounts');

}

function createAccount(account, masterPassword){
  var accounts = getAccounts(masterPassword);

  accounts.push(account);

  saveAccounts(accounts,masterPassword)

  return account;
}

function getAccount(accountName, masterPassword){
  var accounts = storage.getItemSync('accounts');

  var matchedAccount;
  accounts.forEach(function(account){
    if(accountName === account.name){
      matchedAccount = account;
    }
  });
  return matchedAccount;
}

if(command === 'create'){
  var temp = createAccount({
    name: argv.n,
    userName: argv.u,
    password: argv.p
  },argv.masterPassword);
  console.log('Account created');
}else if(command == 'get'){
  var account = getAccount(argv.n, argv.masterPassword);

  if(typeof account === 'undefined'){
    console.log('Account not found!');
  }
  else{
    console.log('Account found!');
    console.log(account);
  }
}
