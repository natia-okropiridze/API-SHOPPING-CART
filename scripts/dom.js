import { $getById } from "./helpers.js";
const productsRow = $getById("products");
const productModal = $getById("product-modal");
const cartProductsModal = $getById("cart-products-modal");
const pagination = $getById("pagination");
const productsParams = $getById("products-params");
const authorizationRegistrationModal = $getById('authorization-registration-modal');
const dialogBox = $getById("dialog-box");
const category = $getById("category");
export {
    productsRow, 
    productModal, 
    cartProductsModal, 
    pagination, 
    productsParams, 
    authorizationRegistrationModal,
    dialogBox,
    category
}