<template>
  <v-container>
    <v-text-field
      placeholder="Search Vendor"
      variant="solo-filled"
      dense
      flat
      clearable
      v-model="searchVendor"
      v-if="vendorData?.length > 0"
      class="search-vendor"
    ></v-text-field>
    <v-expansion-panels v-if="vendorData?.length > 0" class="scroll-vendor">
      <v-expansion-panel
        v-for="(vendor, index) in filteredVendorData"
        :key="index"
      >
        <v-expansion-panel-title expand-icon="mdi-menu-down">
          <div class="d-flex justify-space-between align-center w-100">
            <p class="font-weight-medium text-uppercase">
              {{ vendor.vendorName }}
            </p>
            <div>
              <v-icon color="blue" @click="downloadVendorData(vendor)"
                >mdi-download</v-icon
              >
              <v-icon
                color="blue"
                class="mx-2"
                @click="
                  showEditVendorModal = true;
                  selectedVendorId = vendor.vendorId;
                  editedVendorName = vendor.vendorName;
                "
                >mdi-pencil</v-icon
              >
              <v-icon
                color="red"
                @click="
                  deleteAlertModal = true;
                  selectedVendorId = vendor.vendorId;
                "
                >mdi-delete</v-icon
              >
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-flex>
            <v-chip
              size="x-small"
              variant="flat"
              color="grey"
              class="ma-1 font-italic"
            >
              {{
                vendor.partyDetail.partyName
                  ? vendor.partyDetail.partyName
                  : "No Party name"
              }}
            </v-chip>
            <v-chip
              size="x-small"
              variant="flat"
              color="grey"
              class="ma-1 font-italic"
            >
              {{
                vendor.partyDetail.partyNumber
                  ? vendor.partyDetail.partyNumber
                  : "No Party Number"
              }}
            </v-chip>
            <v-chip
              size="x-small"
              variant="flat"
              color="grey"
              class="ma-1 font-italic"
            >
              {{
                vendor.partyDetail.partyAddress
                  ? vendor.partyDetail.partyAddress
                  : "No Party Address"
              }}
            </v-chip>
            <v-chip
              size="x-small"
              variant="flat"
              color="grey"
              class="ma-1 font-italic"
            >
              {{
                vendor.partyDetail.lastBillingDate
                  ? vendor.partyDetail.lastBillingDate
                  : "No Last Billing Date"
              }}
            </v-chip>
            <v-btn
              size="x-small"
              color="blue-accent-2"
              class="text-white"
              @click="openPartyModel(vendor.vendorId, vendor.partyDetail)"
              >{{
                vendor.partyDetail.partyName ||
                vendor.partyDetail.partyName ||
                vendor.partyDetail.partyName ||
                vendor.partyDetail.partyName
                  ? "Edit Party Details"
                  : "Add Party Details"
              }}</v-btn
            >
          </v-flex>

          <v-table v-if="vendor.productList.length > 0">
            <thead>
              <tr>
                <th class="text-left">S.No</th>
                <th class="text-left">Product</th>
                <th class="text-left">Stock</th>
                <th class="text-left">Order</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in vendor.productList" :key="index">
                <td>{{ index + 1 }}</td>
                <td style="width: 60px">{{ product.productName }}</td>
                <td>{{ product.stock }} {{product.productUnit}}</td>
                <td>{{ product.order }} {{product.productUnit}}</td>
                <td class="d-flex align-center">
                  <v-icon
                    class="ml-2 cursor-pointer"
                    color="blue-darken-2"
                    @click="openProductDetail(product, vendor.vendorId)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    class="ml-2 cursor-pointer"
                    color="red-darken-2"
                    @click="
                      openDeleteProductModel(vendor.vendorId, product.productId)
                    "
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
          <p class="text-center w-100 mt-3 text-grey" v-else>
            No product list available 😢
          </p>
          <v-btn
            color="blue-lighten-1 text-white"
            class="my-2 text-center w-100"
            @click="
              addNewProductModal = true;
              selectedVendorId = vendor.vendorId;
            "
            >Add Product</v-btn
          >
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-else>
      <img src="../assets/no-task.webp" width="100%" alt="" />
      <p class="text-center text-grey">No any Vendor Added 😢</p>
    </div>
    <v-btn
      color="primary"
      class="my-2 text-center w-100"
      @click="$store.dispatch('openAddVendorModal')"
      >Add Vendor</v-btn
    >

    <!-- Add Party Modal -->
    <v-dialog v-model="addPartyModal" max-width="600">
      <v-card>
        <v-card-title>Party Detail</v-card-title>
        <v-card-text>
          <v-form ref="addPartyForm" @submit.prevent="addPartyDetail">
            <v-text-field
              v-model="addParty.partyName"
              label="Party Name"
              required
              variant="solo"
              :rules="[(v) => !!v || 'Party Name is required']"
            ></v-text-field>
            <v-text-field
              v-model="addParty.partyNumber"
              label="Party Number"
              type="number"
              required
              variant="solo"
              :rules="[(v) => !!v || 'Party Number is required']"
            ></v-text-field>
            <v-text-field
              v-model="addParty.partyAddress"
              label="Party Address"
              required
              variant="solo"
              :rules="[(v) => !!v || 'Party Address is required']"
            ></v-text-field>
            <v-text-field
              v-model="addParty.lastBillingDate"
              label="Last Billling Date"
              required
              type="date"
              variant="solo"
              format="DD-MM-YYY"
              :rules="[(v) => !!v || 'Last Billling Date is required']"
            ></v-text-field>
            <v-btn type="submit" color="primary">Save</v-btn>
            <v-btn @click="closePartyForm" class="ml-2">Close</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Add New Product Modal -->
    <v-dialog v-model="addNewProductModal" max-width="600">
      <v-card>
        <v-card-title>Add Product</v-card-title>
        <v-card-text>
          <v-form ref="addProductForm" @submit.prevent="addNewProductList">
            <v-text-field
              v-model="newProductDetail.productName"
              label="Product Name"
              required
              :rules="[(v) => !!v || 'Product Name is required']"
            ></v-text-field>
            <v-text-field
              v-model="newProductDetail.stock"
              label="Stock"
              type="number"
              required
              :rules="[
                (v) => !!v || 'Stock is required',
                (v) => v >= 0 || 'Stock must be a non-negative number',
              ]"
            ></v-text-field>
            <v-text-field
              v-model="newProductDetail.order"
              label="Order"
              type="number"
              required
              :rules="[(v) => !!v || 'Order is required']"
            ></v-text-field>
            <v-radio-group label="Select Unit" v-model="newProductDetail.productUnit">
              <div class="d-flex">
              <v-radio label="Kg" value="Kg" color="green"></v-radio>
              <v-radio label="Piece" value="PC" color="green"></v-radio>
              <v-radio label="Case" value="Case" color="green"></v-radio>
              </div>
            </v-radio-group>
            <v-btn type="submit" color="primary">Save</v-btn>
            <v-btn @click="closeProductForm" class="ml-2">Close</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Product Modal -->
    <v-dialog v-model="editProductFormModal" max-width="600">
      <v-card>
        <v-card-title>Edit Product</v-card-title>
        <v-card-text>
          <v-form ref="editProductForm" @submit.prevent="editProductDetail">
            <v-text-field
              v-model="editedProduct.productName"
              label="Product Name"
              required
              :rules="[(v) => !!v || 'Product Name is required']"
            ></v-text-field>
            <v-text-field
              v-model="editedProduct.stock"
              label="Stock"
              type="number"
              required
              :rules="[
                (v) => !!v || 'Stock is required',
                (v) => v >= 0 || 'Stock must be a non-negative number',
              ]"
            ></v-text-field>
            <v-text-field
              v-model="editedProduct.order"
              label="Order"
              type="number"
              required
              :rules="[(v) => !!v || 'Order is required']"
            ></v-text-field>
            <v-btn type="submit" color="primary" class="mr-2">Edit</v-btn>
            <v-btn @click="closeEditProductForm">Close</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Product Alert Modal -->
    <v-dialog v-model="deleteProductAlertModal" max-width="400">
      <v-card>
        <v-card-title>Delete Vendor</v-card-title>
        <v-card-text>
          Are you sure you want to delete this vendor?
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteProduct">Delete</v-btn>
          <v-btn
            @click="
              deleteProductAlertModal = false;
              selectedVendorId = null;
              selectedProductId = null;
            "
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Vendor Alert Modal -->
    <v-dialog v-model="deleteAlertModal" max-width="400">
      <v-card>
        <v-card-title>Delete Vendor</v-card-title>
        <v-card-text>
          Are you sure you want to delete this vendor?
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteVendor">Delete</v-btn>
          <v-btn @click="deleteAlertModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Vendor Name -->
    <v-dialog v-model="showEditVendorModal" max-width="600">
      <v-card>
        <v-card-title class="headline">Edit Vendor Name</v-card-title>
        <v-card-text>
          <v-form ref="editedVendorName" @submit.prevent="editVendorName">
            <v-text-field
              v-model="editedVendorName"
              label="Vendor Name"
              :rules="[(v) => !!v || 'Vendor name is required']"
            ></v-text-field>

            <v-btn type="submit" color="primary">Edit Vendor Name</v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="showEditVendorModal = false"
            color="blue darken-1"
            text
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data: () => ({
    deleteAlertModal: false,
    editFormModal: false,
    showEditVendorModal: false,
    editedVendorName: "",
    addPartyModal: false,
    selectedVendorId: null,
    addParty: {
      partyName: "",
      partyNumber: "",
      partyAddress: "",
      lastBillingDate: "",
    },
    addNewProductModal: false,
    newProductDetail: {
      productId: null,
      productName: "",
      stock: "",
      order: "",
      productUnit: null,
    },
    editProductFormModal: false,
    editedProduct: {
      productId: null,
      productName: "",
      stock: "",
      order: "",
    },
    selectedProductId: null,
    deleteProductAlertModal: false,
    searchVendor: "",
  }),
  computed: {
    ...mapGetters(["getAllVendors"]),
    vendorData() {
      return this.getAllVendors;
    },
    filteredVendorData() {
      if (!this.searchVendor) {
        return this.vendorData;
      }

      const lowerCaseSearch = this.searchVendor.toLowerCase();
      return this.vendorData.filter((vendor) =>
        vendor.vendorName.toLowerCase().includes(lowerCaseSearch)
      );
    },
  },
  methods: {
    openPartyModel(vendorId, partyDetail) {
      this.selectedVendorId = vendorId;
      (this.addParty = {
        partyName: partyDetail.partyName,
        partyNumber: partyDetail.partyNumber,
        partyAddress: partyDetail.partyAddress,
        lastBillingDate: partyDetail.lastBillingDate,
      }),
        (this.addPartyModal = true);
    },
    addPartyDetail() {
      if (this.$refs.addPartyForm.validate()) {
        this.$store.dispatch("addPartyDetail", {
          vendorId: this.selectedVendorId,
          partyDetail: this.addParty,
        });
        this.closePartyForm();
      }
    },
    closePartyForm() {
      this.addPartyModal = false;
      this.selectedVendorId = null;
      this.$refs.addPartyForm.reset();
    },
    editPartyDetail(detail, editPart) {
      console.log({ detail, editPart });
    },

    addNewProductList() {
      if (this.$refs.addProductForm.validate()) {
        this.newProductDetail.productId = new Date().getTime();
        this.$store.dispatch("addNewProduct", {
          vendorId: this.selectedVendorId,
          productDetail: this.newProductDetail,
        });
        this.closeProductForm();
      }
    },
    closeProductForm() {
      this.addNewProductModal = false;
      this.selectedVendorId = null;
      this.$refs.addProductForm.reset();
    },

    openProductDetail(product, vendorId) {
      this.selectedVendorId = vendorId;
      this.editedProduct = {
        productId: product.productId,
        productName: product.productName,
        stock: product.stock,
        order: product.order,
      };
      this.editProductFormModal = true;
    },
    editProductDetail() {
      if (this.$refs.editProductForm.validate()) {
        console.log("Save Edit:", this.editedProduct);
        this.$store.dispatch("editProductDetail", {
          vendorId: this.selectedVendorId,
          productDetail: this.editedProduct,
        });
        this.closeEditProductForm();
      }
    },
    closeEditProductForm() {
      this.$refs.editProductForm.reset();
      this.editProductFormModal = false;
    },
    openDeleteProductModel(vendorId, productId) {
      this.selectedProductId = productId;
      this.selectedVendorId = vendorId;
      this.deleteProductAlertModal = true;
    },
    deleteProduct() {
      const selectedVendorId = this.selectedVendorId;
      const selectedProductId = this.selectedProductId;
      const payload = {
        vendorId: this.selectedVendorId,
        productId: this.selectedProductId,
      };
      this.$store.dispatch("deleteProduct", payload);
      this.deleteProductAlertModal = false;
    },
    editVendorName() {
      if (this.$refs.editedVendorName.validate()) {
        const payload = {
          vendorName: this.editedVendorName,
          vendorId: this.selectedVendorId,
        };
        this.$store.dispatch("editVendor", payload);
        this.showEditVendorModal = false;
      }
    },
    deleteVendor() {
      this.$store.dispatch("deleteVendor", this.selectedVendorId);
      this.deleteAlertModal = false;
    },
    downloadVendorData(vendorData) {
      const pdf = new jsPDF();
      let y = 20;
      pdf.setFontSize(20);
      pdf.setTextColor(40);
      const vendorName =
        vendorData.vendorName.toUpperCase() || "No Vendor Name";
      const textWidth =
        (pdf.getStringUnitWidth(vendorName) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const x = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(vendorName, x, y);
      y += 10;

      pdf.setFontSize(12);
      const partyDetails = [
        {
          label: "Party Name:",
          value: vendorData.partyDetail.partyName || "No Party Name",
        },
        {
          label: "Party Number:",
          value: vendorData.partyDetail.partyNumber || "No Party Number",
        },
        {
          label: "Party Address:",
          value: vendorData.partyDetail.partyAddress || "No Party Address",
        },
        {
          label: "Last Billing Date:",
          value:
            vendorData.partyDetail.lastBillingDate || "No Last Billing Date",
        },
      ];
      partyDetails.forEach((detail) => {
        pdf.text(`${detail.label} ${detail.value}`, 10, y);
        y += 5;
      });

      const productList = vendorData.productList;
      if (productList.length > 0) {
        const columns = ["S.No", "Product Name", "Stock", "Order"];
        const rows = productList.map((product, index) => [
          index + 1,
          product.productName,
          product.stock,
          product.order,
        ]);
        pdf.autoTable({ startY: y, head: [columns], body: rows });
      } else {
        pdf.text("No product list available 😢", 10, y);
      }

      pdf.save(
        `${vendorData.vendorName}_${vendorData?.partyDetail?.lastBillingDate}.pdf`
      );
    },
  },
};
</script>

<style scoped>
.scroll-vendor {
  max-height: 80vh;
  overflow-y: scroll;
}
.v-expansion-panel-title {
  padding: 16px 10px !important;
}
</style>