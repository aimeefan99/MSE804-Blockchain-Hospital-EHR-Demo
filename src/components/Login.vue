<template>
  <div class="">

  <button @click="login">Connect MetaMask &amp; Sign in</button>
  <br>
  <label v-if="address">Wallet address: {{ address }}</label>
  <br>
  <p class="error" v-if="error.state">{{ error.message}}</p>
  <router-link to="/register" v-if="!isLoggedIn">if you are not registered?</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: {
        state: false,
        message: null
      },
      address: null
    }
  },
  methods: {
    login() {
      this.error.state = false
      let address = null
      let token = null
      let role = null
      // 1. Connect the wallet: the address comes from MetaMask, not from user input
      this.$Hospital.init()
      .then(() => {
        address = this.$Hospital.accounts()[0]
        this.address = address
        return this.$Hospital.signIn(address)
      })
      .then(response => {
        if (response != '1') {
          return Promise.reject(new Error('You are not registered: click below'))
        }
        // 2. Prove ownership of the address by signing a one-time message
        return this.$Hospital.authenticate(address)
      })
      .then(result => {
        token = result
        return this.$Hospital.role(address)
      })
      .then(result => {
        role = result
        return this.$Hospital.balance(address)
      })
      .then(result => {
        return this.$store.dispatch('logIn', [address, role, result.c[0], token])
      })
      .then(() => {
        this.$router.push('/dashboard')
      })
      .catch(err => {
        this.error.state = true
        this.error.message = 'Login failed: ' + (err.message || err)
      })
    }
  },
created() {
  this.$store.dispatch('logOut')
},
computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>
