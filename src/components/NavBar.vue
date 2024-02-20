<template>
      <v-app-bar
        color="teal-lighten-2"
      >
        <img
        src="../assets/logo.png" width="100px"
        />

        <v-spacer></v-spacer>

        <!-- <v-btn
        color="blue"
        variant="flat"
        size="x-small"
        @click="$store.dispatch('openAddVendorModal')"
        >
            Add Vendor
        </v-btn> -->
        <v-btn
        color="red"
        variant="flat"
        class="ml-2"
        @click="deleteAllDataModal = true;"
        >
            Delete All
        </v-btn>

            <!-- Delete Product Alert Modal -->
    <v-dialog v-model="deleteAllDataModal" max-width="400">
      <v-card>
        <v-card-title>Delete All Data</v-card-title>
        <v-card-text class="text-red">
          Are you sure you want to permanent delete all data?
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteAllData">Delete</v-btn>
          <v-btn @click="deleteAllDataModal = false;">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-app-bar>
</template>

<script>
    export default {
        data: () => ({
            deleteAllDataModal: false,
        }),
        methods: {
            deleteAllData(){
                this.$store.state.vendorData = [];
                localStorage.removeItem('vendorData')
                this.deleteAllDataModal = false;
            }
        },
    }
</script>

<style scoped>

</style>
