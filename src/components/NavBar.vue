<template>
  <v-app-bar color="#ffc923">
    <div class="logo">
      <img
        src="../assets/logo.png"
        class="logo-img"
        width="100px"
        style="margin-left: -6px"
      />
      <p class="tagline">आपके ज़रूरतों का साथी ...</p>
    </div>
    <v-spacer></v-spacer>
    <img src="../assets/mahadev.png" width="70px" class="ml-14 logo2" />

    <v-spacer></v-spacer>

    <v-btn
      color="#B71C1C"
      variant="flat"
      class="ml-2 pa-2 delete-btn"
      @click="deleteAllDataModal = true"
      style="margin-right: 16px"
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
          <v-btn @click="deleteAllDataModal = false">Cancel</v-btn>
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
    deleteAllData() {
      this.$store.state.vendorData = [];
      localStorage.removeItem("vendorData");
      this.deleteAllDataModal = false;
    },
  },
};
</script>

<style scoped>
.logo {
  position: relative;
}
.tagline {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #bb1717;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .logo-img {
    width: 75px !important;
  }
  .logo2{
    width: 60px;
  }
  .tagline {
    font-size: 10px;
  }
  .delete-btn {
    padding: 5px !important;
        font-size: 10px;
        height: 25px;
  }
  .v-app-bar {
    min-height: 55px !important;
    height: 55px !important;
  }
}
</style>
