<template>
  <v-app>
    <v-main>
      <NavBar />
      <add-vendor/>
      <vendor-data/>
    </v-main>
  </v-app>
</template>

<script>
import AddVendor from './components/AddVendor.vue'
import NavBar from './components/NavBar.vue'
import VendorData from './components/VendorData.vue'
export default {
  components: { AddVendor, VendorData },

}

</script>
