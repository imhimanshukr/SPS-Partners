<template>
  <v-container class="pt-2">
    <v-text-field
      placeholder="Search Vendor"
      variant="solo-filled"
      dense
      flat
      clearable
      v-model="searchVendor"
      v-if="vendorData?.length > 0"
      class="search-vendor mb-1"
      hide-details
    ></v-text-field>

    <v-expansion-panels v-if="vendorData?.length > 0" class="scroll-vendor">
      <v-expansion-panel
        v-for="(vendor, index) in filteredVendorData"
        :key="index"
      >
        <v-expansion-panel-title expand-icon="mdi-menu-down">
          <div class="d-flex justify-space-between align-center w-100">
            <p class="font-weight-medium text-uppercase">
              <span class="truncate-text">{{ vendor.vendorName }}</span
              ><br />
              <i style="font-size: 10px; color: gray">
                {{ formatDate(vendor.partyDetail.lastBillingDate) }}
              </i>
            </p>

            <div style="min-width: 150px" class="text-right" @click.stop>
              <v-icon @click="copyVendorData(vendor)" color="#660000">
                mdi-content-duplicate
              </v-icon>

              <v-icon
                color="#1c4966"
                class="mx-1"
                @click="
                  showEditVendorModal = true;
                  selectedVendorId = vendor.vendorId;
                  editedVendorName = vendor.vendorName;
                "
              >
                mdi-pencil-box
              </v-icon>

              <v-icon
                color="#B71C1C"
                @click="
                  deleteAlertModal = true;
                  selectedVendorId = vendor.vendorId;
                "
              >
                mdi-trash-can
              </v-icon>

              <v-icon
                color="light-green-darken-4"
                @click="downloadVendorData(vendor, 'vendor')"
                class="mx-1"
              >
                mdi-folder-download
              </v-icon>

              <v-icon
                color="purple"
                @click="downloadVendorData(vendor, 'bill')"
              >
                mdi-content-save
              </v-icon>

              <!-- 🧾 EPOS-only PDF (3-column) -->
              <v-icon
                color="teal-darken-2"
                class="ml-1"
                @click="downloadVendorDataEpos(vendor)"
              >
                mdi-printer-pos
              </v-icon>
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

            <a
              :href="
                'tel:' +
                (vendor.partyDetail.partyNumber
                  ? vendor.partyDetail.partyNumber
                  : '')
              "
            >
              <v-chip
                size="x-small"
                variant="flat"
                color="grey"
                class="ma-1 font-italic"
                @click.stop
              >
                {{
                  vendor.partyDetail.partyNumber
                    ? vendor.partyDetail.partyNumber
                    : "No Party Contact"
                }}
              </v-chip>
            </a>

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
                  ? this.formatDate(vendor.partyDetail.lastBillingDate)
                  : "No Last Billing Date"
              }}
            </v-chip>

            <v-btn
              size="x-small"
              color="blue-accent-2"
              class="text-white"
              @click="openPartyModel(vendor.vendorId, vendor.partyDetail)"
            >
              {{
                vendor.partyDetail.partyName ||
                vendor.partyDetail.partyName ||
                vendor.partyDetail.partyName ||
                vendor.partyDetail.partyName
                  ? "Edit Party Details"
                  : "Add Party Details"
              }}
            </v-btn>
          </v-flex>

          <v-table
            v-if="vendor.productList.length > 0"
            height="200px"
            fixed-header
            :hover="true"
          >
            <thead>
              <tr>
                <th class="text-left" style="width: 30px">S.No</th>
                <th class="text-left">Product</th>
                <th class="text-left">Purchase Rate</th>
                <th class="text-left">Stock</th>
                <th class="text-left">Order</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in vendor.productList" :key="index">
                <td>{{ index + 1 }}</td>
                <td style="text-transform: capitalize">
                  {{
                    product.productName.charAt(0).toUpperCase() +
                    product.productName.slice(1).toLowerCase()
                  }}
                </td>
                <td>
                  {{ product.purchaseRate }}
                  {{ product.purchaseRate ? product.productUnit : "" }}
                </td>
                <td>
                  {{ product.stock }}
                  {{ product.stock ? product.productUnit : "" }}
                </td>
                <td>
                  {{ product.order }}
                  {{ product.order ? product.productUnit : "" }}
                </td>
                <td class="d-flex align-center">
                  <v-icon
                    class="ml-2 cursor-pointer"
                    color="blue-darken-2"
                    @click="openProductDetail(product, vendor.vendorId)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    class="ml-2 cursor-pointer"
                    color="red-darken-2"
                    @click="
                      openDeleteProductModel(vendor.vendorId, product.productId)
                    "
                  >
                    mdi-delete
                  </v-icon>
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
          >
            Add Product
          </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-else>
      <img src="../assets/no-task.webp" width="100%" alt="" />
      <p class="text-center text-grey">No any Vendor Added 😢</p>
    </div>

    <div>
      <v-btn
        color="primary"
        class="my-2 text-center w-100"
        @click="$store.dispatch('openAddVendorModal')"
      >
        Add Vendor
      </v-btn>
    </div>

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
            ></v-text-field>

            <v-text-field
              v-model="addParty.partyNumber"
              label="Party Contact"
              type="number"
              required
              variant="solo"
              :maxlength="10"
            ></v-text-field>

            <v-text-field
              v-model="addParty.partyAddress"
              label="Party Address"
              required
              variant="solo"
            ></v-text-field>

            <v-text-field
              v-model="addParty.lastBillingDate"
              label="Last Billling Date"
              required
              type="date"
              variant="solo"
              format="DD-MM-YYY"
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
            <v-combobox
              v-model="newProductDetail.productName"
              label="Product Name"
              variant="solo"
              :items="$store.getters.productNames"
              no-data-text="Not available, please add!"
            ></v-combobox>

            <v-text-field
              v-model="newProductDetail.purchaseRate"
              label="Purchnage Rate"
              type="number"
              variant="solo"
              required
            ></v-text-field>

            <v-text-field
              v-model="newProductDetail.stock"
              label="Stock"
              type="number"
              variant="solo"
              required
            ></v-text-field>

            <v-text-field
              v-model="newProductDetail.order"
              label="Order"
              type="number"
              variant="solo"
            ></v-text-field>

            <v-select
              label="Select Unit"
              :items="['Kg', 'GM', 'Piece', 'Box', 'Case']"
              v-model="newProductDetail.productUnit"
              variant="solo"
            ></v-select>

            <v-text-field
              v-model="newProductDetail.productUnit"
              placeholder="Custom Unit"
            ></v-text-field>

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
            <v-combobox
              label="Product Name"
              v-model="editedProduct.productName"
              variant="solo"
              :items="$store.getters.productNames"
              no-data-text="Not available, please add!"
            ></v-combobox>

            <v-text-field
              v-model="editedProduct.purchaseRate"
              label="Purchnage Rate"
              type="number"
              variant="solo"
            ></v-text-field>

            <v-text-field
              v-model="editedProduct.stock"
              label="Stock"
              type="number"
              variant="solo"
            ></v-text-field>

            <v-text-field
              v-model="editedProduct.order"
              label="Order"
              type="number"
              variant="solo"
            ></v-text-field>

            <v-select
              label="Select Unit"
              :items="['Kg','GM', 'Piece', 'Box', 'Case']"
              v-model="editedProduct.productUnit"
              variant="solo"
            ></v-select>

            <v-text-field
              v-model="editedProduct.productUnit"
              placeholder="Custom Unit"
            ></v-text-field>

            <v-btn type="submit" color="primary" class="mr-2"> Edit </v-btn>
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
          >
            Cancel
          </v-btn>
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
              variant="solo"
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
import logo from "../assets/logo.png";

export default {
  data: () => ({
    tab: "one",
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
      lastBillingDate: null,
    },
    addNewProductModal: false,
    newProductDetail: {
      productId: null,
      productName: null,
      stock: "",
      order: "",
      purchaseRate: "",
      productUnit: null,
    },
    editProductFormModal: false,
    editedProduct: {
      productId: null,
      productName: null,
      stock: "",
      order: "",
      purchaseRate: "",
      productUnit: null,
    },
    selectedProductId: null,
    deleteProductAlertModal: false,
    searchVendor: "",
    productName: "",
  }),
  computed: {
    ...mapGetters(["getAllVendors", "productNames"]),
    vendorData() {
      return this.getAllVendors;
    },
    productNameList() {
      return this.productNames;
    },
    filteredVendorData() {
      let vendorData;
      if (!this.searchVendor) {
        vendorData = this.vendorData.sort(
          (a, b) => a.vendorName - b.vendorName
        );
      } else {
        const lowerCaseSearch = this.searchVendor.toLowerCase();
        vendorData = this.vendorData.filter((vendor) =>
          vendor.vendorName.toLowerCase().includes(lowerCaseSearch)
        );
      }
      vendorData.sort((a, b) => {
        const vendorNameA = a.vendorName.toUpperCase();
        const vendorNameB = b.vendorName.toUpperCase();

        if (vendorNameA < vendorNameB) {
          return -1;
        }
        if (vendorNameA > vendorNameB) {
          return 1;
        }
        return 0;
      });
      return vendorData;
    },
  },
  methods: {
    openPartyModel(vendorId, partyDetail) {
      this.selectedVendorId = vendorId;
      this.addParty = {
        partyName: partyDetail.partyName,
        partyNumber: partyDetail.partyNumber,
        partyAddress: partyDetail.partyAddress,
        lastBillingDate: partyDetail.lastBillingDate,
      };
      this.addPartyModal = true;
    },
    addPartyDetail() {
      this.$store.dispatch("addPartyDetail", {
        vendorId: this.selectedVendorId,
        partyDetail: this.addParty,
      });
      this.closePartyForm();
    },
    closePartyForm() {
      this.addPartyModal = false;
      this.selectedVendorId = null;
      this.$refs.addPartyForm.reset();
    },

    addNewProductList() {
      this.newProductDetail.productId = new Date().getTime();
      this.$store.dispatch("addNewProduct", {
        vendorId: this.selectedVendorId,
        productDetail: this.newProductDetail,
      });
      this.closeProductForm();
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
        purchaseRate: product.purchaseRate,
        productUnit: product.productUnit,
      };
      this.editProductFormModal = true;
    },
    editProductDetail() {
      this.$store.dispatch("editProductDetail", {
        vendorId: this.selectedVendorId,
        productDetail: this.editedProduct,
      });
      this.closeEditProductForm();
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

    // 🔥 PDF download: table bordered + black text
    downloadVendorData(vendorData, status) {
      const pdf = new jsPDF();
      let y = 20;

      const logoImg = new Image();
      logoImg.src = logo;
      pdf.addImage(logoImg, "PNG", 7, 0, 30, 30);

      const vendorName = (
        vendorData.vendorName || "No Vendor Name"
      ).toUpperCase();
      const textWidth =
        (pdf.getStringUnitWidth(vendorName) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const x = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(20);
      pdf.text(vendorName, x, y);
      y += 6;

      const mobileNumber = "7979769612, 8863811908";
      const address = "Thathopur, Baheri";
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.textWithLink(mobileNumber, 14, y, { url: `tel:${mobileNumber}` });
      pdf.text(address, 14, y + 3);

      const lastBillingDate = this.formatDate(
        vendorData.partyDetail.lastBillingDate
      );

      if (status !== "bill") {
        const partyDetails = [
          vendorData.partyDetail.partyName || "No Party Name",
          vendorData.partyDetail.partyNumber || "No Party Contact",
          vendorData.partyDetail.partyAddress || "No Party Address",
          lastBillingDate || "No Last Billing Date",
        ];

        const partyDetailColumns = [
          "Name",
          "Mobile",
          "Address",
          "Last Billing Date",
        ];
        const partyDetailRows = [partyDetails];

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);

        pdf.autoTable({
          startY: y + 6,
          head: [partyDetailColumns],
          body: partyDetailRows,
          theme: "grid",
          styles: {
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            font: "helvetica",
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
          },
        });

        y = pdf.autoTable.previous.finalY + 5;

        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.2);
        pdf.line(90, y, pdf.internal.pageSize.width - 90, y);
        y += 5;

        const productList = vendorData.productList;
        if (productList.length > 0) {
          const columns = [
            "S.No",
            "Product Name",
            "Purchase Rate",
            "Stock",
            "Order",
          ];
          const rows = productList.map((product, index) => [
            index + 1,
            product.productName,
            product.purchaseRate
              ? product.purchaseRate + " " + product.productUnit
              : "",
            product.stock ? product.stock + " " + product.productUnit : "",
            product.order ? product.order + " " + product.productUnit : "",
          ]);

          pdf.autoTable({
            startY: y,
            head: [columns],
            body: rows,
            theme: "grid",
            styles: {
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.2,
              font: "helvetica",
            },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.2,
              fontStyle: "bold",
            },
            bodyStyles: {
              fillColor: [255, 255, 255],
            },
          });
        }
      } else {
        const productList = vendorData.productList;
        if (productList.length > 0) {
          y += 5;
          const columns = ["S.No", "Product Name", "Order"];
          const rows = productList.map((product, index) => [
            index + 1,
            product.productName,
            product.order ? product.order + " " + product.productUnit : "",
          ]);

          pdf.autoTable({
            startY: y,
            head: [columns],
            body: rows,
            theme: "grid",
            styles: {
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.2,
              font: "helvetica",
            },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.2,
              fontStyle: "bold",
            },
            bodyStyles: {
              fillColor: [255, 255, 255],
            },
          });
        } else {
          const margin = 10;
          const text = "No product list available";
          pdf.setFontSize(30);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(0, 0, 0);
          const msgWidth =
            (pdf.getStringUnitWidth(text) * pdf.internal.getFontSize()) /
            pdf.internal.scaleFactor;
          const xCenter = (pdf.internal.pageSize.width - msgWidth) / 2;
          pdf.text(text, xCenter, y + margin * 3);
        }
      }

      pdf.save(`${vendorData.vendorName} ${lastBillingDate || ""}.pdf`);
    },

    // 🧾 EPOS printer-friendly download

downloadVendorDataEpos(vendorData) {
  const productList = vendorData.productList || [];
  if (!productList.length) {
    alert("No products to print for EPOS.");
    return;
  }

  const rows = productList.map((product, index) => {
    const qty = product.order || "";
    const unit = product.productUnit ? ` ${product.productUnit}` : "";
    return [
      index + 1,
      product.productName,
      `${qty}${unit}` || "",
    ];
  });

  const baseHeight = 45;
  const rowHeight = 7.5;
  const minHeight = 90; 
  const pageHeight = Math.max(minHeight, baseHeight + rows.length * rowHeight);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, pageHeight],
  });

  const pageWidth = pdf.internal.pageSize.getWidth();

  const logoImg = new Image();
  logoImg.src = logo;
  pdf.addImage(logoImg, "PNG", 4, 2, 16, 16);

  const vendorName = (vendorData.vendorName || "").toUpperCase();

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(13);

  const vendorTextWidth = pdf.getTextWidth(vendorName);
  const vendorX = (pageWidth - vendorTextWidth) / 2;
  pdf.text(vendorName, vendorX, 10);

  const mobile = "7979769612, 8863811908";
  const address = "Thathopur, Baheri";

  pdf.setFontSize(9);
  pdf.text(mobile, (pageWidth - pdf.getTextWidth(mobile)) / 2, 15);
  pdf.text(address, (pageWidth - pdf.getTextWidth(address)) / 2, 19);

  const startY = 25;

  pdf.autoTable({
    startY,
    head: [["S.No", "Product", "Quantity"]],
    body: rows,
    theme: "grid",
    margin: { left: 4, right: 4 },
    styles: {
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
      font: "helvetica",
      fontSize: 9,
      halign: "left",
      valign: "middle",
      cellPadding: 1.5,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "left" },
      1: { cellWidth: 38, halign: "left" },
      2: { cellWidth: 22, halign: "left" },
    },
  });

  // 🔹 AUTO TABLE END POSITION
  const finalY = pdf.lastAutoTable.finalY || startY + rows.length * rowHeight;

  // ------------------------------------------
  // ⭐ FOOTER:
  // ------------------------------------------
  const footerText = "SPS - Aapke Zaruraton Ka Saathi";
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");

  const footerWidth = pdf.getTextWidth(footerText);
  const footerX = (pageWidth - footerWidth) / 2;

  // Footer ko bottom me lagao (5mm margin)
  const footerY = pageHeight - 2;

  pdf.text(footerText, footerX, footerY);

  // ------------------------------------------

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const todayStr = `${day}-${month}-${year}`;

  pdf.save(`${vendorData.vendorName} ${todayStr}.pdf`);
},


    copyVendorData(vendorData) {
      this.$store.dispatch("copyVendor", vendorData);
    },

    formatDate(value) {
      if (!value) return "";
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    addProductName() {
      if (this.productName) {
        this.$store.dispatch("addProductName", this.productName);
        this.productName = "";
      }
    },
  },
};
</script>

<style scoped>
.scroll-vendor {
  max-height: 70vh;
  overflow-y: scroll;
}
.v-expansion-panel-title {
  padding: 16px 10px !important;
}
th,
td {
  white-space: nowrap;
}
.truncate-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 135px;
}
</style>
