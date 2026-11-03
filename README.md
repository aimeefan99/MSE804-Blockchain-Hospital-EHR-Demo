# Hospital EHR Blockchain Demo

An interoperable, blockchain-based Electronic Health Record (EHR) management system built on Ethereum smart contracts, Node.js wallet authentication, and a Vue.js frontend application. The platform provides decentralized role-based access control, secure wallet-signature authentication, medical data permissions, and on-chain healthcare billing.

---

## Architecture Overview

The application comprises three core components:

1. **Ethereum Smart Contracts (`contracts/Hospital.sol`)**:
   - Written in Solidity `0.4.17` and deployed via Truffle.
   - **Entity Registration**: Registers participants (Patients, Doctors, Pharmacies, Insurance) on-chain.
   - **Access Control**: Implements patient-controlled access permissions (`grantAccess`, `revokeAccess`, `didIGaveRights`, `doIHaveRights`).
   - **On-Chain Billing**: Manages participant balances and transfers payments for medical services (`sendPayment`).

2. **Wallet Authentication Server (`auth-server/index.js`)**:
   - Express.js backend providing challenge-response cryptographic login.
   - Generates single-use nonces per wallet address and verifies EIP-191 signatures using `ethers.js`.
   - Issues short-lived JSON Web Tokens (JWT) for authenticated API access.

3. **Vue.js Frontend Client (`src/` & `webpack.config.js`)**:
   - Single Page Application built with Vue 2, Vue Router, and Vuex.
   - **Login & Registration**: Web3 / MetaMask wallet integration and role registration.
   - **Dashboard**:
     - **Permissions**: Grant and revoke doctor access to patient medical records on-chain.
     - **Billing**: Real-time balance lookup and payment execution.
     - **Data**: Medical record views and Hyperledger / Oracle cross-network data integration.

---

## Directory Structure

```text
hospital-ehr-Demo-Group2/
├── auth-server/          # Node.js + Express wallet signature & JWT auth server
├── contracts/            # Solidity smart contracts (Hospital.sol, Migrations.sol)
├── hospital-ehr/         # Hyperledger Composer business network & scripts
├── migrations/           # Truffle deployment migration scripts
├── src/                  # Vue.js frontend application
│   ├── components/       # UI views (Login, Register, Dashboard, Medical panels)
│   ├── router/           # Vue Router navigation definitions
│   └── store/            # Vuex state management
├── truffle-config.js     # Truffle network configuration (Ganache / Local EVM)
├── truffle.js            # Alternative Truffle configuration
└── webpack.config.js     # Webpack bundler & dev server configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or later) & **npm**
- **Truffle Suite**: `npm install -g truffle`
- **Ganache**: `npm install -g ganache` (or Ganache GUI)
- **MetaMask**: Browser extension connected to local Ganache RPC network (`http://127.0.0.1:8545`).

---

### Installation & Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Blockchain (Ganache)**:
   ```bash
   ganache --port 8545 --networkId 1337
   ```

3. **Compile & Deploy Smart Contracts**:
   ```bash
   truffle compile
   truffle migrate --reset
   ```

4. **Start Wallet Authentication Server**:
   ```bash
   npm run auth
   ```
   The authentication server will start on `http://localhost:4001`.

5. **Start Frontend Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` in your browser.

---

## Usage Workflow

1. **Connect Wallet**: Connect MetaMask to your local Ganache network.
2. **Authenticate**: Click to sign a cryptographic nonce message with your wallet to receive a JWT token.
3. **Register Role**: Select a participant role (Patient, Doctor, Pharmacy, or Insurance) and register on the Ethereum smart contract.
4. **Manage Permissions**: As a Patient, enter a Doctor's Ethereum address to grant or revoke medical record access on-chain.
5. **Healthcare Billing**: Check account balances and initiate direct peer-to-peer healthcare payments.
