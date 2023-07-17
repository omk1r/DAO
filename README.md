# Decentralized Autonomous Organization (DAO) Application

This project is a decentralized application (DApp) that interacts with a smart contract deployed on the Sepolia testnet. The smart contract represents a basic DAO that allows users to create proposals and vote on them. Members of the DAO can create proposals, vote on existing proposals, and execute approved proposals to transfer funds to specific addresses.

## Prerequisites

To run this application, ensure you have the following prerequisites installed:

1. **Metamask**: Install the Metamask browser extension to interact with the Ethereum blockchain and connect your wallet to the DApp.

2. **Node.js**: Make sure you have Node.js installed on your machine. You can download it from the official website: https://nodejs.org/

3. **Web3.js**: The Web3.js library is used to interact with the Ethereum blockchain. It should be included as a dependency in the project, so you don't need to install it separately.

## Getting Started

Follow the steps below to set up and run the application:

1. Clone the repository to your local machine.

2. Navigate to the project directory.

3. Install the project dependencies by running the following command:

```bash
npm install
```

4. Deploy the smart contract to the Sepolia testnet using Hardhat or any other Ethereum development framework. Make sure to update the `contractAddress` variable in the `App.js` file with the address of the deployed smart contract.

5. Start the development server by running:

```bash
npm start
```

6. Visit `http://localhost:3000` in your web browser to access the application.

## Usage

1. Connect your Metamask wallet by clicking the "Connect" button. You will need to approve the connection in Metamask.

2. Once connected, you can become a member of the DAO by clicking the "Become A Member" button.

3. As a member, you can create proposals by providing the amount (in ETH) and the address to which the funds should be sent. Click the "Create Proposal" button to create a proposal. Note that creating a proposal requires a fee of 10 wei.

4. All members can vote on existing proposals by clicking the "Yes" or "No" buttons.

5. After the voting period ends (2 minutes from proposal creation), any member can execute a proposal if it has received more "Yes" votes than "No" votes and if the contract has enough balance.

6. The "Ongoing Proposal" table displays all active proposals, their details, and buttons to vote and execute.

## Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, feel free to create a pull request or open an issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Disclaimer

This project is for educational purposes only and is not intended to be used in production. Use it at your own risk.

