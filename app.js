console.log('Starting password Manager..');

var storage = require('node-persist');
storage.initSync();

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
              }
            }).help('help');
          }).help('help')
          .argv;

var command = argv._[0];

function createAccount(account){
  var accounts = storage.getItemSync('accounts');

  if(typeof accounts === 'undefined'){
    accounts = [];
  }

  accounts.push(account);
  storage.setItemSync('accounts',accounts);

  return account;
}

function getAccount(accountName){
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
  });
  console.log('Account created');
}else if(command == 'get'){
  var account = getAccount(argv.n);

  if(typeof account === 'undefined'){
    console.log('Account not found!';)
  }
  else{
    console.log('Account found!');
    console.log(account);
  }
}
