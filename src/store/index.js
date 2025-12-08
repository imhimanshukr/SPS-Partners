import { createStore } from "vuex";
import { useToast } from "vue-toastification";

const toast = useToast();

const updateLocalStorage = (data) => {
  localStorage.setItem("vendorData", JSON.stringify(data));
};

const getLocalStorage = () => {
  const data = localStorage.getItem("vendorData");
  return data ? JSON.parse(data) : [];
};

export default createStore({
  state: {
    addVendorModel: false,
    vendorData: getLocalStorage(),
    productName: [],
  },
  mutations: {
    openAddVendorModal(state) {
      state.addVendorModel = true;
    },
    closeAddVendorModal(state) {
      state.addVendorModel = false;
    },
    addVendor(state, vendorName) {
      state.vendorData.push({
        vendorName: vendorName,
        vendorId: new Date().getTime(),
        partyDetail: {
          partyName: "",
          partyNumber: "",
          partyAddress: "",
          lastBillingDate: "",
        },
        productList: [],
      });
      updateLocalStorage(state.vendorData);
      toast.success("Vendor Added! 😊");
    },
    copyVendor(state, vendorData) {
      state.vendorData.push({
        vendorName: vendorData.vendorName,
        vendorId: new Date().getTime(),
        partyDetail: vendorData.partyDetail,
        productList: vendorData.productList.map((data) => ({
          order: "",
          stock: "",
          purchaseRate: "",
          productId: Math.random().toString(36).substr(2, 9),
          productName: data.productName,
          productUnit: data.productUnit,
        })),
      });
      updateLocalStorage(state.vendorData);
      toast.success("Vendor Copied! 😊");
    },
    editVendor(state, payload) {
      const vendor = state.vendorData.find(
        (vendor) => vendor.vendorId === payload.vendorId
      );
      vendor.vendorName = payload.vendorName;
      updateLocalStorage(state.vendorData);
      toast.success("Vendor Updated! 😊");
    },
    deleteVendor(state, vendorId) {
      state.vendorData = state.vendorData.filter(
        (vendor) => vendor.vendorId !== vendorId
      );
      updateLocalStorage(state.vendorData);
      toast.error("Vendor Deleted! 😞");
    },
    addPartyDetail(state, { vendorId, partyDetail }) {
      const vendor = state.vendorData.find(
        (vendor) => vendor.vendorId === vendorId
      );
      if (vendor) {
        vendor.partyDetail.partyName = partyDetail.partyName;
        vendor.partyDetail.partyNumber = partyDetail.partyNumber;
        vendor.partyDetail.partyAddress = partyDetail.partyAddress;
        vendor.partyDetail.lastBillingDate = partyDetail.lastBillingDate;
      }
      updateLocalStorage(state.vendorData);
      toast.success("Party Details Added! 😊");
    },
    addNewProduct(state, { vendorId, productDetail }) {
      console.log({ vendorId, productDetail });
      const vendor = state.vendorData.find(
        (vendor) => vendor.vendorId === vendorId
      );
      vendor.productList.push({
        productId: productDetail.productId,
        productName: productDetail.productName,
        stock: productDetail.stock,
        order: productDetail.order,
        productUnit: productDetail.productUnit,
        purchaseRate: productDetail.purchaseRate,
      });
      updateLocalStorage(state.vendorData);
      toast.success("New Product Added! 😊");
    },
    editProductDetail(state, { vendorId, productDetail }) {
      const vendor = state.vendorData.find(
        (vendor) => vendor.vendorId === vendorId
      );
      if (vendor) {
        const product = vendor.productList.find(
          (product) => product.productId === productDetail.productId
        );
        if (product) {
          console.log("product: ", product);
          product.productId = productDetail.productId;
          product.productName = productDetail.productName;
          product.stock = productDetail.stock;
          product.order = productDetail.order;
          product.productUnit = productDetail.productUnit;
          product.purchaseRate = productDetail.purchaseRate;
        }
      }
      updateLocalStorage(state.vendorData);
      toast.success("Product Updated! 😊");
    },
    deleteProduct(state, payload) {
      const vendor = state.vendorData.find(
        (vendor) => vendor.vendorId === payload.vendorId
      );
      if (vendor) {
        vendor.productList = vendor.productList.filter(
          (product) => product.productId !== payload.productId
        );
      }
      updateLocalStorage(state.vendorData);
      toast.error("Product Deleted! 😞");
    },
    addProductName(state, productName) {
      state.productName.push(productName);
      toast.success("Product Added! 😊");
    },
    reorderProducts(state, { vendorId, products }) {
      const vendor = state.vendorData.find(v => v.vendorId === vendorId);
      if (vendor) {
        vendor.productList = products;
        updateLocalStorage(state.vendorData);
      }
    },
  },
  actions: {
    openAddVendorModal({ commit }) {
      commit("openAddVendorModal");
    },
    closeAddVendorModal({ commit }) {
      commit("closeAddVendorModal");
    },
    addVendor({ commit }, vendorName) {
      commit("addVendor", vendorName);
    },
    copyVendor({ commit }, vendorData) {
      commit("copyVendor", vendorData);
    },
    editVendor({ commit }, payload) {
      commit("editVendor", payload);
    },
    deleteVendor({ commit }, vendorId) {
      commit("deleteVendor", vendorId);
    },
    addPartyDetail({ commit }, { vendorId, partyDetail }) {
      commit("addPartyDetail", { vendorId, partyDetail });
    },
    addNewProduct({ commit }, { vendorId, productDetail }) {
      commit("addNewProduct", { vendorId, productDetail });
    },
    editProductDetail({ commit }, { vendorId, productDetail }) {
      commit("editProductDetail", { vendorId, productDetail });
    },
    deleteProduct({ commit }, payload) {
      commit("deleteProduct", payload);
    },
    addProductName({ commit }, payload) {
      commit("addProductName", payload);
    },
    reorderProducts({ commit }, payload) {
      commit('reorderProducts', payload);
    }
  },
  getters: {
    productNames: (state) => {
      const uniqueProductNames = Array.from(
        new Set(
          state.vendorData.flatMap((vendor) =>
            vendor.productList.map((product) =>
              product.productName
                ? product.productName.charAt(0).toUpperCase() +
                  product.productName.slice(1).toLowerCase()
                : ""
            )
          )
        )
      ).filter(Boolean);
      return uniqueProductNames;
    },
    getAllVendors: (state) => state.vendorData,
  },
});
