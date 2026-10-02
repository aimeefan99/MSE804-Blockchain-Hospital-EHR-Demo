<template>
  <div class="">
<h4>Register here</h4>
<br>
<label v-if="address">Wallet address: {{ address }}</label>
<br>
<select v-model="role">
  <option disabled value="">Select role</option>
  <option value="Doctor">Doctor</option>
  <option value="Patient">Patient</option>
  <option value="Pharmacy">Pharmacy</option>
</select>
<br>
<button @click="register" v-if="isPossible">Register</button>
<p class="error" v-if="error.state">{{ error.message }}</p>
<br>
<router-link class="link" to="/" v-if="!isLoggedIn">already registered: Log in</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: '',
      error: {
        state: false,
        message: ''
      },
      address: null
    }
  },
  methods: {
    register() {
      this.error.state = false
      let address = null
      // Register the wallet the user controls in MetaMask, not an account picked by number
      this.$Hospital.init()
      .then(() => {
        address = this.$Hospital.accounts()[0]
        this.address = address
        return this.$Hospital.register(address, this.role)
      })
      .then(response => {
        this.error.state = true
        this.error.message = 'Registration successful: ' + response.tx + ' Please log in.'
        // Also register in Hyperledger; ignored when the Composer backend is offline
        this.$Hospital.add(address, this.role).catch(() => {})
      })
      .catch(err => {
        this.error.state = true
        this.error.message = 'Registration not successful: ' + (err.message || err)
      })
    }
  },
  computed: {
    isLoggedIn() {
      console.log(this.$store.getters.isLoggedIn)
      return this.$store.getters.isLoggedIn
    },
    isPossible() {
      if(this.role === 'Doctor' || this.role === 'Patient' || this.role === 'Pharmacy'){
        return true
      }
      else{
        return false
      }
    }
  }
}
</script>

