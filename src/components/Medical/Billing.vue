<template>
  <div>
      <h4>Make payments</h4>
      <br>
      <input type="number" placeholder="Enter amount" v-model="amount">
      <br>
      <input type="text" placeholder="Receiver address (0x...)" v-model="receiver">
      <br>
      <button @click="sendPayment">Send payment</button>
      <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data(){
    return {
      account: {
        address: null,
        role: null,
        balance: null
      },
      receiver: '',
      amount: null,
      message: ''
    }
  },
  methods: {
    sendPayment() {
      if (!/^0x[0-9a-fA-F]{40}$/.test(this.receiver)) {
        this.message = 'Invalid receiver address'
        return
      }
      if (!(this.amount > 0)) {
        this.message = 'Amount must be greater than 0'
        return
      }
      this.message = 'Waiting for confirmation in MetaMask...'
      this.$Hospital.pay(this.account.address, this.receiver, this.amount)
      .then(() => this.$Hospital.balance(this.account.address))
      .then(result => {
        this.account.balance = result.c[0]
        this.message = 'Payment sent'
      })
      .catch(err => {
        this.message = 'Payment failed: ' + (err.message || err)
      })
    }
  },
  created() {
    this.account = this.$store.state.primaryAccount
  }
}
</script>
