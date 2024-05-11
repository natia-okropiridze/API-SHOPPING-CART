import {API_URL, PRE_PAGE, TOTAL, COLLECTIONS} from "./config.js";
import { _product, _col, _page, _productsParams, _option, _admin} from "./components.js";
import { productsRow, pagination, productsParams, category } from "./dom.js";
import { $render } from "./helpers.js";
import { init, insert, select } from "./storage.js";
import { getProductsParams, generatePagination } from "./functions.js";
import { _get_ } from "./http.js";

window.addEventListener("DOMContentLoaded", async () => {
    init(COLLECTIONS)
    let isAuth = false
    if(localStorage.hasOwnProperty("admin") ) {
        const [admin] = select('admin')
        isAuth = true
        $render(productsParams, _productsParams(getProductsParams(admin.id)))
    } else {
        $render(productsParams, _admin({}))
    }
    const categories = await _get_(`${API_URL}/products/categories`)
    const categoryTemplates = categories.map((category) => _option({id: crypto.randomUUID(), value: category, title: category}))
                            .join("")
    $render(category, categoryTemplates)

    // const data = await _get_(`${API_URL}/products?limit=${PRE_PAGE}`)
    const data = await _get_(`${API_URL}/products?limit=100`)
    localStorage.setItem('products', JSON.stringify(data.products))
    const postTemplates = data.products.slice(0, PRE_PAGE).map((product) => _product({...product, isShow: true, isAuth }))
                .map((product) => _col(product, ["col-lg-4", "col-md-6", "mb-4"]))
                .join("")
    $render(productsRow, postTemplates)
    // GeneratePagination
    generatePagination(select('products'))
})

