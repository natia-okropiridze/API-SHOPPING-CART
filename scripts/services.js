import { productModal, cartProductsModal, authorizationRegistrationModal } from "./dom.js"

const productPopup = new bootstrap.Modal(productModal, {
    keyboard: false
})

const cartProductsPopup = new bootstrap.Modal(cartProductsModal, {
    keyboard: false
})

const authorizationRegistrationPopup = new bootstrap.Modal(authorizationRegistrationModal, {
    keyboard: false
})

export { productPopup, cartProductsPopup, authorizationRegistrationPopup }