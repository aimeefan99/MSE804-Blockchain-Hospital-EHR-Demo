import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import axios from 'axios';
import HospitalJson from './../../build/contracts/Hospital.json';

const Hospital = {
    web3Provider: null,
    web3: null,
    contract: null,
    instance: null,
    baseUrl: null,
    baseOrg: null,
    ethAccounts: null,


    init: () => {
        let self = this;
        if (!window.ethereum) {
            return Promise.reject(new Error('MetaMask is not installed'));
        }
        // Route every call through MetaMask, so transactions are signed by the user's own wallet
        // instead of by unlocked accounts on the node
        self.web3Provider = {
            sendAsync: (payload, callback) => {
                window.ethereum.request({ method: payload.method, params: payload.params })
                .then(result => callback(null, { id: payload.id, jsonrpc: '2.0', result: result }))
                .catch(error => callback(error))
            }
        };
        self.web3 = new Web3(self.web3Provider);
        // Only the account the user approves in MetaMask is exposed to the page
        let accounts = null;
        return window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
            accounts = result;
            // Make sure this site uses the local Ganache chain (chain ID 1337 = 0x539)
            return window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x539' }] })
            .catch(error => {
                // 4902: MetaMask does not know this chain yet, so ask to add it (MetaMask then switches to it)
                if (error.code === 4902 || /Unrecognized chain/i.test(error.message)) {
                    return window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x539',
                            chainName: 'Ganache',
                            rpcUrls: ['http://127.0.0.1:8545'],
                            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
                        }]
                    });
                }
                throw error;
            });
        })
        .then(() => {
            self.accounts = accounts;
            self.contract = TruffleContract(HospitalJson);
            self.contract.setProvider(self.web3Provider);
            return self.contract.deployed();
        })
        .then(instance => {
            self.instance = instance;
            self.baseUrl = 'http://localhost:3000/api/'
            self.baseOrg = 'org.acme.hospital.'
            return instance;
        });
    },

    // Wallet-signature login: sign a one-time message, the auth server verifies it and issues a JWT
    authenticate: (address) => {
        return axios.get('http://localhost:4001/nonce', { params: { address: address } })
        .then(response => window.ethereum.request({
            method: 'personal_sign',
            params: [response.data.message, address]
        }))
        .then(signature => axios.post('http://localhost:4001/verify', { address: address, signature: signature }))
        .then(response => response.data.token);
    },

    accounts: () => {
        let self = this;
        // console.log(self.accounts, ' :meh');
        return self.accounts;

    },

    register: (address, role) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.entityRegister(role, {from: address, gas:3000000})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    signIn: (address) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.checkRegistration({from: address, gas:3000000})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    details: (address) => {
        // get all details balance and role
    },

    balance: (address) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.getBalance({from: address})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    role: (address) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.getRole({from: address})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    grant: (sender, target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.grantAccess(target, {from: sender, gas:3000000})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    revoke: (sender, target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.revokeAccess(target, {from: sender, gas: 3000000})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    pay: (sender, target, amount) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.sendPayment(target, amount, {from: sender, gas:3000000})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    check: (sender, target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.didIGaveRights(target, {from: sender})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    verify: (sender, target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.doIHaveRights(target, {from, sender})
            .then(response => { resolve(response) })
            .catch(error => { reject(error) })
        });
    },

    fire: (sender, target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.instance.helperEvent(target, sender, {from: sender})
            .then(response => {resolve(response) })
            .catch(error => reject(error))
        });
    },

    add: (address, role) => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/register',{
                params: {
                    address: address,
                    role: role
                }
            })
            .then(response => { return response })
            .then(result => { resolve(result) })
            .catch(error => { reject(error) })
        });
    },

    read: (sender, target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/readData', {
                params: {
                    doctor: sender,
                    patient: target
                  }
            })
            .then(response => { return response })
                .then(result => { resolve(result.data) })
                .catch(error => { console.log(error) })
        });
    },
    
    giveE: (sender, target, item) => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/writeE', {
                params: {
                    doctor: sender,
                    patient: target,
                    medication: item
                }
            })
            .then(response => { return response })
            .then(result => { resolve(result) })
            .catch(error => { reject(error) })
        });
    },

    giveR: (sender, target, item) => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/writeR', {
                params: {
                    pharmacy: sender,
                    patient: target,
                    medication: item
                }
            })
            .then(response => { return response })
            .then(result => { resolve(result) })
            .catch(error => { reject(error) })
        });
    },
    permissions: (userId, role) => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/permissions', {
                params: {
                    userId: userId,
                    role: role
                }
            })
            .then(resp => { return resp })
            .then(result => { resolve(result) })
            .catch(error => { reject(error) })
        });
    },
    remove: (source,target) => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/revoke', {
                params: {
                    doctor: target,
                    patient: source
                }
            })
            .then(resp => { return resp })
            .then(result => { resolve(result) })
            .catch(error => { reject(error) })
        })
    }
};

export default Hospital;

