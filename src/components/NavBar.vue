<template>
      <v-app-bar
        color="teal-lighten-2"
      >
        <img
        src="../assets/logo.png" width="100px" style="margin-left: -6px;"
        />
        <p class="tagline">आपकी ज़रूरतों का साथी</p>
        <v-spacer></v-spacer>
        <img
        src="../assets/mahadev.png" width="70px" class="ml-14"
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
        color="#B71C1C"
        variant="flat"
        class="ml-2 pa-2"
        @click="deleteAllDataModal = true;"
        style="margin-right: 16px;"
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
.tagline{
  position: relative;
    left: -20px;
    bottom: -20px;
    color: #ff0000a6;
    font-size: 15px;
    font-weight: 600;
}
</style>
