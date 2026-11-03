# Hospital EHR Blockchain Demo

An interoperable, blockchain-based Electronic Health Record (EHR) management system built on Ethereum smart contracts, Node.js wallet authentication, and a Vue.js frontend application. The platform provides decentralized role-based access control, secure wallet-signature authentication, medical data permissions, and on-chain healthcare billing.

---

## Architecture Overview

The application comprises three core components:

1. **Ethereum Smart Contracts ()**:
   - Written in Solidity  and deployed via Truffle.
   - **Entity Registration**: Registers participants (Patients, Doctors, Pharmacies, Insurance) on-chain.
   - **Access Control**: Implements patient-controlled access permissions (, , , ).
   - **On-Chain Billing**: Manages participant balances and transfers payments for medical services ().

2. **Wallet Authentication Server ()**:
   - Express.js backend providing challenge-response cryptographic login.
   - Generates single-use nonces per wallet address and verifies EIP-191 signatures using .
   - Issues short-lived JSON Web Tokens (JWT) for authenticated API access.

3. **Vue.js Frontend Client ( & )**:
   - Single Page Application built with Vue 2, Vue Router, and Vuex.
   - **Login & Registration**: Web3 / MetaMask wallet integration and role registration.
   - **Dashboard**:
     - **Permissions**: Grant and revoke doctor access to patient medical records on-chain.
     - **Billing**: Real-time balance lookup and payment execution.
     - **Data**: Medical record views and Hyperledger / Oracle cross-network data integration.

---

## Directory Structure



---

## Getting Started

### Prerequisites

- **Node.js** (v14 or compatible) & **npm**
- **Truffle Suite**: 
- **Ganache**: Local Ethereum blockchain instance (running on port  or )
- **MetaMask**: Browser extension configured to connect to your local Ganache RPC network.

---

### Installation & Local Setup

1. **Install Dependencies**:
   

2. **Start Local Blockchain (Ganache)**:
   Launch Ganache on  (Chain ID  or default).

3. **Compile & Deploy Smart Contracts**:
   Could not find suitable configuration file.
Truffle v5.11.5 (core: 5.11.5)
Node v20.20.2
Could not find suitable configuration file.
Truffle v5.11.5 (core: 5.11.5)
Node v20.20.2

4. **Start Wallet Authentication Server**:
   
   The authentication server will start on .

5. **Start Frontend Development Server**:
   
   Open  in your browser.

---

## Usage Workflow

1. **Connect Wallet**: Connect MetaMask to your local Ganache network.
2. **Authenticate**: Click to sign a cryptographic nonce message with your wallet to receive a JWT token.
3. **Register Role**: Select a participant role (Patient, Doctor, Pharmacy, or Insurance) and register on the Ethereum smart contract.
4. **Manage Permissions**: As a Patient, enter a Doctor's Ethereum address to grant or revoke medical record access on-chain.
5. **Healthcare Billing**: Check account balances and initiate direct peer-to-peer healthcare payments.
