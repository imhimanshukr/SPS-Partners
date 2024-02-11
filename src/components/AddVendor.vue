<template>
  <div>
    <v-dialog v-model="$store.state.addVendorModel" max-width="600">
      <v-card>
        <v-card-title class="headline">Add Vendor</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="submitForm">

            <v-text-field
              v-model="vendorName"
              label="Vendor Name"
              :rules="[
                v => !!v || 'Vendor name is required',
              ]"
            ></v-text-field>

            <v-btn type="submit" color="primary">Add Vendor</v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeModal" color="blue darken-1" text>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vendorName: ''
    };
  },
  methods: {
    submitForm() {
      if (this.vendorName) {
        // Dispatch the action to add a vendor
        this.$store.dispatch('addVendor', this.vendorName);
        
        // Close the modal and reset the vendorName
        this.$store.state.addVendorModel = false;
        this.vendorName = '';
      }
    },
    closeModal() {
      // Close the modal and reset the vendorName without adding a vendor
      this.$store.state.addVendorModel = false;
      this.vendorName = '';
    }
  }
};
</script>
