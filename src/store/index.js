import { createStore } from 'vuex';


const updateLocalStorage = (data) => {
    localStorage.setItem('vendorData', JSON.stringify(data));
  };

  const getLocalStorage = () => {
    const data = localStorage.getItem('vendorData');
    return data ? JSON.parse(data) : [];
  };


export default createStore({
  state: {
    addVendorModel: false,
    vendorData: getLocalStorage(),
  },
  mutations: {
    openAddVendorModal(state) {
      state.addVendorModel = true;
    },
    closeAddVendorModal(state) {
      state.addVendorModel = false;
    },
    addVendor(state, vendorName) {
      state.vendorData.push(
        {
            vendorName: vendorName,
            vendorId: new Date().getTime(),
            partyDetail: {
              partyName: "",
              partyNumber: "",
              partyAddress: "",
              lastBillingDate: "",
            },
            productList: []
        })
        updateLocalStorage(state.vendorData);  
    },
    editVendor(state, payload){
        const vendor = state.vendorData.find(vendor => vendor.vendorId === payload.vendorId);
        vendor.vendorName = payload.vendorName;
        updateLocalStorage(state.vendorData);
    },
    deleteVendor(state, vendorId){
        state.vendorData = state.vendorData.filter(vendor => vendor.vendorId !== vendorId);
        updateLocalStorage(state.vendorData);
    },
    addPartyDetail(state, { vendorId, partyDetail }) {
        const vendor = state.vendorData.find(vendor => vendor.vendorId === vendorId);
        if (vendor) {
            vendor.partyDetail.partyName= partyDetail.partyName;
            vendor.partyDetail.partyNumber= partyDetail.partyNumber;
            vendor.partyDetail.partyAddress= partyDetail.partyAddress;
            vendor.partyDetail.lastBillingDate= partyDetail.lastBillingDate;
        }
        updateLocalStorage(state.vendorData);
    },
    addNewProduct(state, {vendorId, productDetail}){
        console.log({vendorId, productDetail});
        const vendor = state.vendorData.find(vendor => vendor.vendorId === vendorId);
        vendor.productList.push({
            productId: productDetail.productId,
            productName: productDetail.productName,
            stock: productDetail.stock,
            order: productDetail.order,
        })
        updateLocalStorage(state.vendorData);
    },
    editProductDetail(state, { vendorId, productDetail }) {
        const vendor = state.vendorData.find(vendor => vendor.vendorId === vendorId);
        if (vendor) {
            const product = vendor.productList.find(product => product.productId === productDetail.productId);
            if(product){
                console.log("product: ", product);
                product.productId= productDetail.productId;
                product.productName= productDetail.productName;
                product.stock= productDetail.stock;
                product.order= productDetail.order;
            }
        }
        updateLocalStorage(state.vendorData);
    },
    deleteProduct(state, payload){
        const vendor = state.vendorData.find(vendor => vendor.vendorId === payload.vendorId);
        if (vendor) {
            vendor.productList = vendor.productList.filter(product => product.productId !== payload.productId);
        }
        updateLocalStorage(state.vendorData);
    }
  },
  actions: {
    openAddVendorModal({ commit }) {
      commit('openAddVendorModal');
    },
    closeAddVendorModal({ commit }) {
      commit('closeAddVendorModal');
    },
    addVendor({ commit }, vendorName) {
      commit('addVendor', vendorName);
    },
    editVendor({ commit }, payload) {
      commit('editVendor', payload);
    },
    deleteVendor({ commit }, vendorId) {
      commit('deleteVendor', vendorId);
    },
    addPartyDetail({ commit }, { vendorId, partyDetail }) {
        commit('addPartyDetail', { vendorId, partyDetail });
    },
    addNewProduct({ commit }, { vendorId, productDetail }) {
        commit('addNewProduct', { vendorId, productDetail });
    },
    editProductDetail({ commit }, { vendorId, productDetail }) {
        commit('editProductDetail', { vendorId, productDetail });
    },
    deleteProduct({ commit }, payload) {
        commit('deleteProduct', payload);
    }
  },
  getters: {
    getAllVendors: state => state.vendorData
  }
});
