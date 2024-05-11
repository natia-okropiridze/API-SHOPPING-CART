import { API_URL, PRE_PAGE } from "./config.js"
import {productPopup, cartProductsPopup, authorizationRegistrationPopup} from "./services.js"
import { $render, $insertHtml, $getById } from "./helpers.js"
import { _product, _spinner, _productsParams, _tableHeader, _tableFooter, _tableRow, _alert, _page, _col } from "./components.js"
import { productModal, productsRow, pagination as pg, productsParams, cartProductsModal, authorizationRegistrationModal, dialogBox } from "./dom.js"
import { select, insert, update } from "./storage.js"
import { _get_ } from "./http.js";
const showProduct = (e) => {
    const productId = e.dataset.id
    // const productURL = [API_URL, "/products", `/${productId}`].join('')
    const productURL  = `${API_URL}/products/${productId}`
    e.disabled = true
    fetch(productURL)
    .then( response => response.status === 200 ? response.json() : null)
    .then((product) => {
        if (product) {
            $render(productModal?.querySelector(".modal-body"), _product({...product, isShow:false}))
            productPopup.show()
            e.disabled = false
        }
    });
}
/**
 * 
 * @param { HTMLFormElement | null } e 
 */
const pagination = (e) => {
    /**
     * @type {Number}
     */
    const page = Number(e?.dataset.page)
    const skip = (page - 1) * PRE_PAGE
    const limit = page * PRE_PAGE
    // const url = `${API_URL}/products?limit=${PRE_PAGE}&skip=${skip}`
    const products = select('products')
    let items = Array.from(pg.children)
    items.forEach((item) => {
        const page = item.children[0]
        page.disabled = false
        page.classList.remove('active')
    })
    e.disabled = true
    e?.classList.add('active')
    $render(e, _spinner({id: crypto.randomUUID()}))
    setTimeout(() => {
        const templates = products.slice(skip, limit).map((product) => _product({...product, isShow: true }))
                    .map((product) => _col(product, ["col-lg-4", "col-md-6", "mb-4"]))
                    .join("")
        $render(productsRow, templates)
        $render(e, page)

        // fetch(url)
        // .then( response => response.status === 200 ? response.json() : null)
        // .then((data) => {
        //     if (data) {
        //         const templates = data.products.map((product) => _product({...product, isShow: true }))
        //             .map((product) => _col(product, ["col-lg-4", "col-md-6", "mb-4"]))
        //             .join("")
        //         $render(productsRow, templates)
        //         $render(e, page)
        //     }
        // });
    }, 1000)
}
/**
 * 
 * @param {HTMLElement | null} e 
 */
const addProductToCart = async(e) => {
    const productId = Number(e?.dataset.id)
    const [admin] = select('admin')
    const carts = select('carts')
    let cart = carts.find((cart) => cart.userId === admin.id)
    if(!cart) {
        cart = {
            id: crypto.randomUUID(),
            userId: admin.id,
            products: []
        }
        insert('carts', cart)
    }

    const product = cart.products.find((product) => product.id === productId)
    if(product) {
        cart = {
            ...cart,
            products: cart.products.map((product) => product.id === productId ? {...product, quantity: product.quantity + 1} : product)
        }
        update('carts', cart, cart.id)
        $render(productsParams, _productsParams(getProductsParams(admin.id)))
    } else {
        const product = await _get_(`${API_URL}/products/${productId}`) 
        cart.products.push({...product, quantity: 1})
        update('carts', cart, cart.id)
        $render(productsParams, _productsParams(getProductsParams(admin.id)))
        
    }
}
/**
 * 
 * @param {String | number} userId 
 */
const getProductsParams = (userId) => {
    const carts = select("carts")
    const cart = carts.find((cart) => cart.userId === userId)
    if(!cart) return {id:crypto.randomUUID(), quantity: 0, price: 0}
    const productsQuantity = cart.products.reduce((accumulator, item) => {
        return accumulator + item.quantity;
    }, 0);
    const productsPrice = cart.products.reduce((accumulator, item) => {
        return accumulator + (item.quantity * item.price);
    }, 0);
    return {id:crypto.randomUUID(), quantity: productsQuantity, price: productsPrice}
} 

/**
 * 
 * @param {HTMLElement | null} e 
 */
const getCartProducts = (e) => {
    const [admin] = select('admin')
    const carts = select('carts')
    const cart = carts.find((cart) => cart.userId === admin.id)
    const productsPrice = cart.products.reduce((accumulator, item) => {
        return accumulator + (item.quantity * item.price);
    }, 0);
    getUserProducts(admin.id)
    cartProductsPopup.show()

}

/**
 * 
 * @param {HTMLFormElement | null} e 
 */
const deleteProduct = (e) => {
    if(confirm('Are you sure you want to delete this product?')) {
        e.disabled = true
        setTimeout(() => {
            const [admin] = select('admin')
            const productId = Number(e?.dataset.id)
            const carts = select('carts')
            let cart = carts.find((cart) => cart.userId === admin.id)
            const updatedProducts = cart.products.filter((product) => product.id !== productId) 
            cart = {
                ...cart,
                products: updatedProducts
            }
            const updated = update('carts', cart, cart.id)
            if (updated.ok) {
                $render(productsParams, _productsParams(getProductsParams(admin.id)))
                getUserProducts(admin.id)
            }
        }, 1000)
        
    }
}
/**
 * 
 * @param {String | number} userId 
 */
const getUserProducts = (userId) => {
    const carts = select('carts')
    const cart = carts.find((cart) => cart.userId === userId)
    const productsPrice = cart.products.reduce((accumulator, item) => {
        return accumulator + (item.quantity * item.price);
        }, 0);
    const rows = []
    rows.push(_tableHeader({}))
    cart.products.forEach((product) => rows.push(_tableRow(product)))
    rows.push(_tableFooter({id: crypto.randomUUID(), price: productsPrice}))
    const table = cartProductsModal?.querySelector('.table')
    $render(table, rows.join(''))
}

/**
 * 
 * @param {HTMLFormElement | null} e 
 */
const registrationOrAuthorization = (e) => {
    const selector = [e?.dataset.template, 'template'].join('-')
    const template = $getById(selector)
    const fragment = template?.content?.cloneNode(true);
    const modalBody = authorizationRegistrationModal?.querySelector('.modal-body')
    if (modalBody?.children.length) {
        const children = [...modalBody.children]
        children.forEach(child => child.remove())
    }
    modalBody?.appendChild(fragment)
    authorizationRegistrationPopup.show()
}

const registration = (e) => {
    e.preventDefault()
    const {email, password, re_password} = e.target
    const errors = []
    const users = select('users')
    const user = users.find((user) => user.email === email.value.trim())
    
    if(user) errors.push('email already exists')
    if(password.value.trim() < 6) errors.push('password min length must be 6 characters')
    if(password.value.trim() !== re_password.value.trim()) errors.push('password not match')
    
    if(!errors.length) {
        const user = {
            id: crypto.randomUUID(),
            email: email.value.trim(),
            password: password.value.trim()
        }
        const userCart = {
            id: crypto.randomUUID(),
            userId: user.id,
            products: []
        }

        insert('users', user)
        delete user.password
        insert('admin', user)
        insert('carts', userCart)
        e.target.reset()
        alert('registration successful')
        window.location.reload()
    }
}

const authorization = (e) => {
    e.preventDefault()
    const {email, password} = e.target
    const errors = []
    const users = select('users')
    const user = users.find(user => user.email === email.value.trim() && user.password === password.value.trim())
    if(user) {
        delete user.password
        insert('admin', user)
        alert('authorization successful')
        window.location.reload()
    } else {
        alert('authorization not successful')
        window.location.reload()
    }
}

const logOut = () => {
    localStorage.removeItem('admin')
    window.location.reload()
}

const userMessage = () => {
    $render(dialogBox, _alert({ id: crypto.randomUUID(), message: "Only After Reg Or Auth", status: 'danger' }))
    setTimeout(() => {
        $render(dialogBox, '')
    }, 3000)
}
/**
 * 
 * @param {HTMLFormElement} e 
 */
const filteredByCategory = async (e) => {
    const category = e.value
    e.disabled = true
    const url = `${API_URL}/products/category/${category}`
    const data = await _get_(url)
    localStorage.setItem('products', JSON.stringify(data.products))
    let isAuth = false
    if(localStorage.hasOwnProperty("admin") ) isAuth = true
    const templates = data.products.slice(0, PRE_PAGE).map((product) => _product({...product, isShow: true, isAuth }))
                .map((product) => _col(product, ["col-lg-4", "col-md-6", "mb-4"]))
                .join("")
    $render(productsRow, templates)
    e.disabled = false
    generatePagination(select('products'))
    // fetch(`${API_URL}/products/category/${category}`)
    // .then( response => response.status === 200 ? response.json() : null)
    // .then((data) => {
    //     if (data) {
    //         let isAuth = false
    //         if(localStorage.hasOwnProperty("admin") ) isAuth = true
    //         const templates = data.products.map((product) => _product({...product, isShow: true, isAuth }))
    //             .map((product) => _col(product, ["col-lg-4", "col-md-6", "mb-4"]))
    //             .join("")
    //         $render(productsRow, templates)
    //         e.disabled = false
    //     }
        
    // });
}
/**
 * 
 * @param {Array} arr 
 */
const generatePagination = (arr) => {
    const pages = Math.ceil(arr.length / PRE_PAGE)
    const pageTLP = []
    for(let i = 1; i <= pages; i++) pageTLP.push(_page({id: crypto.randomUUID(), page: i}))
    $render(pg, pageTLP.join("")) 
}
/**
 * 
 * @param {HTMLFormElement} e 
 */
const incrementProduct = (e) => {
    e.disabled = true
    const productId = Number(e.dataset.productId)
    const [admin] = select("admin")
    const carts = select("carts")
    let productCard = carts.find((cart) => cart.userId === admin.id)
    // const product = productCard.products.find((product) => product.id === productId)
    productCard = {
        ...productCard,
        products: productCard.products.map((product) => {
            return product.id === productId ? {...product, quantity: product.quantity + 1} : product
        })
    }
    
    if(update ("carts", productCard, productCard.id).ok) {
        setTimeout(() => {
            $render(productsParams, _productsParams(getProductsParams(admin.id)))
            getUserProducts(admin.id)
            e.disabled = false
        }, 1000)
    }
}
/**
 * 
 * @param {HTMLFormElement} e 
 */
const decrementProduct = (e) => {
    const productId = Number(e.dataset.productId)
    const [admin] = select("admin")
    const carts = select("carts")
    let productCard = carts.find((cart) => cart.userId === admin.id)
    let updatedProduct = productCard.products.find((product) => product.id === productId)
    if (updatedProduct.quantity > 1) {
        updatedProduct = {
            ...updatedProduct,
            quantity: updatedProduct.quantity - 1
        }
    }
    productCard = {
        ...productCard,
        products: productCard.products.map((product) => {
            return product.id === productId ? updatedProduct : product
        })
    }
    
    if(update ("carts", productCard, productCard.id).ok) {
        $render(productsParams, _productsParams(getProductsParams(admin.id)))
        getUserProducts(admin.id)
    }
}

export {
    showProduct, 
    pagination, 
    addProductToCart, 
    getProductsParams, 
    getCartProducts,
    deleteProduct,
    registrationOrAuthorization,
    registration,
    authorization,
    logOut,
    userMessage,
    filteredByCategory,
    generatePagination,
    incrementProduct,
    decrementProduct
}