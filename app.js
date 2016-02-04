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
  var decryptedAccounts = [];

  //decrypt
  if(typeof encryptedAccounts !== 'undefined'){

  var bytes = crypto.AES.decrypt(encryptedAccounts,masterPassword);
  decryptedAccounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
  }

  return decryptedAccounts;
}

function saveAccounts(accounts, masterPassword){

  //encrypt
  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

  storage.setItemSync('accounts', encryptedAccounts.toString());

  return encryptedAccounts;
}

function createAccount(account, masterPassword){
  var accounts = getAccounts(masterPassword);

  accounts.push(account);

  saveAccounts(accounts,masterPassword)

  return account;
}

function getAccount(accountName, masterPassword){
  var accounts = getAccounts(masterPassword);

  var matchedAccount;
  accounts.forEach(function(account){
    if(accountName === account.name){
      matchedAccount = account;
    }
  });
  return matchedAccount;
}

if(command === 'create'){
  try{
      var temp = createAccount({
      name: argv.n,
      userName: argv.u,
      password: argv.p
    },argv.masterPassword);
    console.log('Account created');
  }catch(e){
    console.log('Unable to create account. Error is: '+ e.message);
  }

}else if(command == 'get'){
  try{
    var account = getAccount(argv.n, argv.masterPassword);

    if(typeof account === 'undefined'){
      console.log('Account not found!');
    }
    else{
      console.log('Account found!');
      console.log(account);
    }
  }catch(e){
    console.log('Unable to fetch account . Error is : '+ e.message);
  }

}
