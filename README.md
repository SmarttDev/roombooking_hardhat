# Room Booking Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a room booking contract, a test for that contract, a script that deploys that contract (use Hardhat deploy), and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat --network <networkName> deploy
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```


# How to use the Dapp

Connect with your Metamask with an Hardhat test account.

Mnemonic for this Hardhat test account can be found in hardhat.config.ts file.

Admin user for Coke company is first address and Pepsi company the second address.

You can add other address in each company's whitelist.

Each address in the whitelist can reserve a room in its company calendar.

Only the addresses that have reserved a room can cancel the reservation.

# Contract Address

Ropsten -> 0xB07432cd6f0801F8A1649931b45Fcf8ed5FB0e71