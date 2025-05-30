// ACTION TYPES
import {
  REGISTER_USER_PROCESS,
  INIT_USER_REGISTRATION,
  AUTHENTICATING,
  AUTHENTICATION,
  CLEAR_LOGIN_ERROR,
  RE_AUTHENTICATE,
  CLEAR_AUTHENTICATION,
  INIT_AUTHENTICATION,
  GET_PRODUCT_CATEGORIES_SUCCESS,
  SET_ADD_PRODUCT_LOADER,
  REMOVE_ADD_PRODUCT_LOADER,
  RESET_PRODUCT_MESSENGER,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILED,
  SEND_PRODUCT_MESSENGER,
  CLEAR_ADD_PRODUCT_ERROR,
  OPEN_ADD_CATEGORY,
  CLOSE_ADD_CATEGORY,
  FILTER_PRODUCTS,
  RESET_FILTER,
  INIT_DASHBOARD,
  INIT_DASHBOARD_FAILED,
  CLEAR_ERROR,
  SET_DASHBOARD_LOADER,
  SET_PRODUCT_DATABASE_LOADER,
  PRODUCT_DATABASE,
  PRODUCT_DATABASE_ERROR,
  CLEAR_PRODUCT_DATABASE_ERROR,
  TOGGLE_FEATURES,
  SET_ACTIVE_LINK,
  SET_EDIT_LOADER,
  CLEAR_EDIT_LOADER,
  SET_PRODUCT_LOG_LOADER,
  CLEAR_PRODUCT_LOG_LOADER,
  PRODUCT_LOG_SUCCESS,
  PRODUCT_LOG_FAILED,
  CLEAR_PRODUCTLOG_ERROR,
  DELETE_PRODUCT_PROCESS,
  DELETE_PRODUCT_INIT,
  SET_REQUISTION_LOADER,
  CLEAR_REQUISTION_LOADER,
  CLEAR_REQUISTION_MODAL,
  REQUISTION_MODAL,
  SET_VALIDATION_LOADER,
  REMOVE_VALIDATION_LOADER,
  PATIENT_DATABASE,
  WARD_DATABASE,
  PRODUCT_SALES_DATABASE,
  PRODUCT_SALES_LOADER,
  PRODUCT_SALES_DATABASE_ERROR,
  CLEAR_PRODUCT_SALES_ERROR,
} from "./actions/actionTypes/actionTypes";
// ACTION METHODS
import {
  sendProductMessenger,
  resetProductMessenger,
  clearProductError,
  openAddCategory,
  closeAddCategory,
  initProductCategories,
  addProductCategory,
  addProduct,
  fetchProductsMethod,
  deleteCategory,
  editCategoryMethod,
} from "./actions/action/inventory/addProductAction";
import { registerUser } from "./actions/action/auth/registerAction";
import {
  resetActiveLink,
  setActiveLink,
  resetFeatures,
} from "./actions/action/navigation/navigationAction";
import {
  clearAuthentication,
  reAuthenticate,
  clearLoginError,
  authenticating,
  loggingOut,
  logout,
} from "./actions/action/auth/loginAction";

import {
  filteredProducts,
  submitEditForm,
  resetFilteredProducts,
} from "./actions/action/inventory/editProductAction";
import {
  clearError,
  initDashboard,
} from "./actions/action/dashboard/dashboardAction";
import {
  clearProductDatabaseError,
  initProductDatabase,
  initPatientDatabase,
  initWardDatabase,
  initProductSalesDatabase,
  clearProductSalesError,
  filterSales,
} from "./actions/action/general/generalAction";
import {
  initProductLog,
  getProductExpiryAction,
  getPotentialExpiries,
  getOtherUnitsInventoryAction,
} from "./actions/action/inventory/productInventoryAction";
import { deleteProduct } from "./actions/action/inventory/deleteProductAction";
import {
  sendRequistion,
  validateRequistion,
  clearRequistionLoader,
  clearRequistionModal,
  setMinimumQuantityHandler,
  setReorderHandler,
} from "./actions/action/inventory/requistionAction";
import {
  addSupplier,
  getSuppliersMethod,
  receiveProductsMethod,
  exchangeProductsMethod,
  holdReceiveProducts,
  uploadReceivedItem,
} from "./actions/action/storeServices/receiveProductsAction";
import {
  prescriptionValidation,
  productSale,
  inpatientProductSale,
  requistionProductSale,
  addDeposit,
  holdPrescription,
  addWard,
  uploadPrescription,
  addOsMethod,
  getAllOs,
  addDrugTherapyProblemMethod,
  fuccProductSale,
} from "./actions/action/patientServices/prescriptionValidationAction";
import {
  searchUsers,
  fetchChats,
  setChat,
  sendMessageMethod,
  miniChats,
  getChatsMethod,
  getUsersRequest,
  createGroupChat,
  sendMessage,
  clearMessage,
  deleteChat,
  editChat,
  addNotificationMethod,
  filterNotificationMethod,
  getUsersInstitutionRequest,
  addNotificationAction,
  getNotificationMethod,
  getNotificationMessageMethod,
  setNotificationMethod,
} from "./actions/action/message/messageAction";
import {
  initRequistion,
  issueRequistionMethod,
  validateIssue,
  holdIssue,
  retrieveRequistion,
} from "./actions/action/storeServices/issueProductsAction";
import {
  deleteSale,
  addReceiptHandler,
} from "./actions/action/patientServices/productSalesAction";
import {
  initDrugTherapyProblem,
  filterDrugTherapyProblem,
} from "./actions/action/patientServices/drugTherapyProblemAction";
import {
  initReceiveRequistion,
  receiveRequistionMethod,
  completedRequistionAction,
} from "./actions/action/inventory/receiveRequistionAction";
import { initRequistions } from "./actions/action/inventory/requistionsAction";
import {
  initSupplies,
  filterSupplies,
  deleteSupply,
  getCompletedSupplies,
  editSupplierMethod,
  deleteSupplierMethod,
} from "./actions/action/storeServices/suppliesAction";
import {
  filterStoreReportRequistion,
  initStoreReportRequistion,
  initStoreVisualization,
  filterStoreVisualization,
  filterOsExpiryVisualization,
  initOsExpiryVisualization,
} from "./actions/action/storeServices/storeRequistionsAction";
import {
  registerInstitution,
  loginInstitution,
  institutionLogout,
} from "./actions/action/auth/initInstitutionAction";
import {
  componentMethod,
  getDepartmentsMethod,
  addUnitMethod,
  deleteUser,
  activateUserMethod,
  editUserMethod,
  deactivateUserMethod,
} from "./actions/action/institutionComponents/institutionComponentsAction";
import {
  addUserRoleMethod,
  getUserRoleMethod,
} from "./actions/action/userRole/userRoleAction";
import {
  getDepartments,
  getUserLogin,
  getLocationsByDepartment,
  getUnitsByDepartment,
} from "./actions/action/generalLogin/generalLogin";

import {
  validateTransfer,
  submitTransfer,
  validateStockSubmission,
} from "./actions/action/inventory/transferProductsAction";
import {
  getTransfersMethod,
  validateReceiveTransfer,
  receiveTransferProducts,
  getCompletedTransfers,
  getUnitsTransfers,
} from "./actions/action/inventory/receiveTransferProductsAction";
import {
  validateAddExpiries,
  addExpiriesMethod,
  getExpiriedProductMethod,
} from "./actions/action/inventory/addExpiriesAction";
import {
  validateProductReturn,
  returnProductMethod,
} from "./actions/action/patientServices/returnProductAction";
import {
  getOutOfStock,
  initOutOfStock,
} from "./actions/action/storeServices/outOfStockAction";
import {
  initProductsReport,
  filterProductsReport,
} from "./actions/action/inventory/productReportAction";
import {
  getPharmacovigilances,
  addFeedback,
  getFeedback,
  filterFeedback,
} from "./actions/action/patientServices/pharmacovigilanceAction";
export {
  INIT_USER_REGISTRATION,
  REGISTER_USER_PROCESS,
  AUTHENTICATING,
  AUTHENTICATION,
  CLEAR_LOGIN_ERROR,
  RE_AUTHENTICATE,
  CLEAR_AUTHENTICATION,
  INIT_AUTHENTICATION,
  GET_PRODUCT_CATEGORIES_SUCCESS,
  SET_ADD_PRODUCT_LOADER,
  REMOVE_ADD_PRODUCT_LOADER,
  RESET_PRODUCT_MESSENGER,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILED,
  SEND_PRODUCT_MESSENGER,
  CLEAR_ADD_PRODUCT_ERROR,
  OPEN_ADD_CATEGORY,
  CLOSE_ADD_CATEGORY,
  FILTER_PRODUCTS,
  RESET_FILTER,
  INIT_DASHBOARD,
  INIT_DASHBOARD_FAILED,
  CLEAR_ERROR,
  SET_DASHBOARD_LOADER,
  PRODUCT_DATABASE,
  PRODUCT_DATABASE_ERROR,
  CLEAR_PRODUCT_DATABASE_ERROR,
  SET_PRODUCT_DATABASE_LOADER,
  TOGGLE_FEATURES,
  SET_ACTIVE_LINK,
  SET_EDIT_LOADER,
  CLEAR_EDIT_LOADER,
  SET_PRODUCT_LOG_LOADER,
  CLEAR_PRODUCT_LOG_LOADER,
  PRODUCT_LOG_SUCCESS,
  PRODUCT_LOG_FAILED,
  CLEAR_PRODUCTLOG_ERROR,
  DELETE_PRODUCT_PROCESS,
  DELETE_PRODUCT_INIT,
  SET_REQUISTION_LOADER,
  CLEAR_REQUISTION_LOADER,
  CLEAR_REQUISTION_MODAL,
  REQUISTION_MODAL,
  SET_VALIDATION_LOADER,
  REMOVE_VALIDATION_LOADER,
  WARD_DATABASE,
  PATIENT_DATABASE,
  PRODUCT_SALES_DATABASE,
  PRODUCT_SALES_LOADER,
  PRODUCT_SALES_DATABASE_ERROR,
  CLEAR_PRODUCT_SALES_ERROR,
  // Navigation
  resetActiveLink,
  setActiveLink,
  resetFeatures,
  //   Messenger
  sendProductMessenger,
  resetProductMessenger,
  // initRegistration
  registerInstitution,
  loginInstitution,
  componentMethod,
  institutionLogout,
  getDepartmentsMethod,
  addUnitMethod,
  deleteUser,
  activateUserMethod,
  editUserMethod,
  deactivateUserMethod,
  // Register
  registerUser,
  // user roles
  addUserRoleMethod,
  getUserRoleMethod,
  //   Login
  getDepartments,
  getUserLogin,
  getLocationsByDepartment,
  getUnitsByDepartment,
  clearAuthentication,
  reAuthenticate,
  clearLoginError,
  authenticating,
  loggingOut,
  logout,
  // Products Report
  initProductsReport,
  filterProductsReport,
  //   AddProduct
  clearProductError,
  openAddCategory,
  closeAddCategory,
  initProductCategories,
  addProductCategory,
  addProduct,
  deleteCategory,
  fetchProductsMethod,
  editCategoryMethod,
  //   EditProduct
  filteredProducts,
  submitEditForm,
  resetFilteredProducts,
  // Add Expiries
  validateAddExpiries,
  addExpiriesMethod,
  getExpiriedProductMethod,
  //   Dashboard
  clearError,
  initDashboard,
  //   General Database
  clearProductDatabaseError,
  initProductDatabase,
  initPatientDatabase,
  initWardDatabase,
  clearProductSalesError,
  initProductSalesDatabase,
  filterSales,
  // ProductLog
  initProductLog,
  getProductExpiryAction,
  getPotentialExpiries,
  getOtherUnitsInventoryAction,
  // delete
  deleteProduct,
  // Requistion
  sendRequistion,
  validateRequistion,
  clearRequistionLoader,
  clearRequistionModal,
  initRequistions,
  filterStoreReportRequistion,
  initStoreReportRequistion,
  completedRequistionAction,
  setMinimumQuantityHandler,
  setReorderHandler,
  // Receive Requistion
  initReceiveRequistion,
  receiveRequistionMethod,
  // Transfer
  validateTransfer,
  submitTransfer,
  // Stock Taking
  validateStockSubmission,
  // Receive Transfer
  getTransfersMethod,
  validateReceiveTransfer,
  receiveTransferProducts,
  getCompletedTransfers,
  getUnitsTransfers,
  // Validation
  prescriptionValidation,
  productSale,
  inpatientProductSale,
  requistionProductSale,
  addDeposit,
  addWard,
  holdPrescription,
  uploadPrescription,
  addOsMethod,
  getAllOs,
  addDrugTherapyProblemMethod,
  fuccProductSale,
  initDrugTherapyProblem,
  filterDrugTherapyProblem,
  // Return Products
  validateProductReturn,
  returnProductMethod,
  // ProductSale
  deleteSale,
  addReceiptHandler,
  // Message
  searchUsers,
  fetchChats,
  setChat,
  sendMessageMethod,
  miniChats,
  getUsersRequest,
  createGroupChat,
  getChatsMethod,
  clearMessage,
  sendMessage,
  deleteChat,
  editChat,
  addNotificationMethod,
  filterNotificationMethod,
  getUsersInstitutionRequest,
  addNotificationAction,
  getNotificationMethod,
  getNotificationMessageMethod,
  setNotificationMethod,
  // store
  addSupplier,
  getSuppliersMethod,
  receiveProductsMethod,
  holdReceiveProducts,
  uploadReceivedItem,
  exchangeProductsMethod,
  initSupplies,
  deleteSupplierMethod,
  editSupplierMethod,
  filterSupplies,
  deleteSupply,
  getCompletedSupplies,
  initStoreVisualization,
  filterStoreVisualization,
  filterOsExpiryVisualization,
  initOsExpiryVisualization,
  // issue store
  initRequistion,
  issueRequistionMethod,
  validateIssue,
  getOutOfStock,
  initOutOfStock,
  holdIssue,
  retrieveRequistion,
  // Pharmacovigilance
  getPharmacovigilances,
  // Feedback
  addFeedback,
  getFeedback,
  filterFeedback,
};
