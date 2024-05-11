/**
 * 
 * @param { {
 * id: string | number, 
 * images:string[], price:number, 
 * rating:number, stock:number,
 * title:string, 
 * description:string, 
 * thumbnail:string, 
 * isShow: Boolean,
 * isAuth: Boolean
 * } } _ 
 * @returns {string}
 */
const _product = (_) => {
  const { id, images, price, rating, stock, title, description, thumbnail, isShow, isAuth} = _
  const thumbnails = images.map((image) => _thumbnail({id:crypto.randomUUID(), image:image, productId: id}))
                      .map((image) => _col(image, ["col-4", "mb-4"]))
                      .join("")
  const called = isAuth ? `addProductToCart(this)`  : `userMessage()`              
  const buttons = [`<button class="btn btn-primary" data-id="${id}" onclick="${called}">Add To Cart</button>`]
  if (isShow) buttons.push(`<button class="btn btn-info" data-id="${id}" onclick="showProduct(this)">Show</button>`)
  return `<div class="card" id="${id}">
  <div class="card-header">  
    <img src="${thumbnail}" class="card-img-top" alt="...">
  </div>
  <div class="card-body">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${description}</p>
    <ul class="list-group list-group-flush">
      <li class="list-group-item price">
        <i class="bi bi-tags-fill"></i>
        <span class="options">${price}</span>
      </li>
      <li class="list-group-item rating">
        <i class="bi bi-star-fill"></i>
        <span class="options">${rating}</span>
      </li>
      <li class="list-group-item stock">
        <i class="bi bi-bag-check-fill"></i>
        <span class="options">${stock}</span>
      </li>
    </ul>
    <div class="d-flex justify-content-between">
      ${buttons.join("")}
    </div>
    
  </div>
  <div class="card-footer">
      <div class="row">
        ${thumbnails}
      </div>
  </div>
</div>`
}
/**
 * 
 * @param { { id:string | number, image:string, productId: string | number } } _ 
 * @returns {String}
 */
const _thumbnail = (_) => {
  const {id, image, productId} = _
  return `<a href="${image}" data-fancybox="p-${productId}">
            <img src="${image}" class="rounded w-100 product-thumbnail" alt="..." />
          </a>`
}
/**
 *
 * @param { { id: string | number, page: number } } _
 * @returns {String}
 */
const _page = (_) => {
  const {id, page} = _
  return `<li class="page-item" id="${id}">
            <button class="page-link" data-page="${page}" onclick="pagination(this)">${page}</button>
          </li>`
}
/**
 * 
 * @param {object | null } _
 * @returns {String}
 */
const _spinner = (_) => {
  const {id} = _
  return `<div class="spinner-border loader" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>`
}

/**
 * 
 * @param {{id: string | number, value: string, title: string}} _ 
 * @returns 
 */
const _option = (_) => {
  const {id, value, title} = _
  return `<option value="${value}" id="${id}">${title}</option>`
}

/**
 * 
 * @param {{id: string | number, quantity: number, price: number }} _ 
 * @returns {String}
 */
const _productsParams = (_) => {
  const {id, quantity, price} = _
  return `<button type="button" class="btn btn-danger" onclick="getCartProducts(this)">
            <i class="bi bi-cart-fill"></i>
          </button>
          <button type="button" class="btn btn-warning">${quantity}</button>
          <button type="button" class="btn btn-success">${price} ₾</button>
          <button type="button" class="btn btn-info" onclick="logOut()">
            <i class="bi bi-box-arrow-right"></i>
          </button>`
}
/**
 * 
 * @param {Object} _ 
 * @returns {String}
 */
const _tableHeader = (_) => {
  return `<tr>
            <th scope="col">#</th>
            <th scope="col">სურათი</th>
            <th scope="col">სახელი</th>
            <th scope="col">ბრენდი</th>
            <th scope="col">ერთეულის ფასი</th>
            <th scope="col">რაოდენობა</th>
            <th scope="col">ფასი მთლიანობაში</th>
            <th scope="col">მოდიფიცირება</th>
        </tr>`
}

/**
 * 
 * @param { {id: string | number, price: number} } _ 
 * @returns {String}
 */
const _tableFooter = (_) => {
  const {id, price} = _;
  return `<tr id="">
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">საერთო ფასი</th>
            <th scope="col">${price}</th>
            <th scope="col"></th>
        </tr>`
}
/**
 * 
 * @param {Object | null} _ 
 * @returns 
 */
const _admin = (_) => {
  return `<button type="button" class="btn btn-danger" data-template="authorization" onclick="registrationOrAuthorization(this)"> Authorization</button>
          <button type="button" class="btn btn-warning" data-template="registration" onclick="registrationOrAuthorization(this)"> Registration </button>`
}

/**
 * @param { {id: string | number, 
 *          thumbnail: string,
 *          title: string,
 *          brand: string,
 *          quantity:number,
 *          price:number
 *        }} _ 
 * @returns 
 */
const _tableRow = (_) => {
  const { id, thumbnail, title, brand, quantity, price } = _
  const disabledDecrement = quantity > 1 ? '' : 'disabled'
  return `<tr id="${id}">
            <th scope="col">${id}</th>
            <th scope="col">
              <img src="${thumbnail}" class="img-thumbnail product-image" alt="..." />
            </th>
            <th scope="col">${title}</th>
            <th scope="col">${brand}</th>
            <th scope="col">${price}</th>
            <th scope="col">
              <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" class="btn btn-danger" data-product-id="${id}" ${disabledDecrement} onclick="decrementProduct(this)"> 
                  <i class="bi bi-dash-circle"></i> 
                </button>
                <button type="button" class="btn btn-warning">${quantity}</button>
                <button type="button" class="btn btn-success" data-product-id="${id}" onclick="incrementProduct(this)"> 
                  <i class="bi bi-plus-circle"></i>
                </button>
              </div>
            </th>
            <th scope="col">${quantity * price}</th>
            <th scope="col">
              <button type="button" class="btn btn-danger" data-id="${id}" onclick="deleteProduct(this)">
                <i class="bi bi-trash-fill"></i>
              </button>
            </th>
        </tr>`
}
/**
 * 
 * @param { {id: string | Number, message: String, status: String }} _ 
 * @returns 
 */
const _alert = (_) => {
  const {id, message, status} = _;
  return `<div class="alert alert-${status}" role="alert" id="${id}">
        ${message}
      </div>`
}

/**
 * 
 * @param {string} component 
 * @param {string[]} classes 
 * @returns 
 */
const _col = (component, classes) => {
      return `<div class="${classes.join(" ")}">
                ${component}
              </div>`
}

export {
  _admin,
  _product, 
  _thumbnail, 
  _page, 
  _spinner,
  _option,
  _productsParams, 
  _tableHeader, 
  _tableFooter, 
  _tableRow, _alert, _col} 