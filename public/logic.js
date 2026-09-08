/*====================================================================================================
    FATORA SYSTEM CRUD
    MAIN LOGIC
====================================================================================================*/


/*====================================================================================================
    STEP 01 ==> DOM ELEMENTS
====================================================================================================*/


//============================================================
// Add Product Inputs
//============================================================

const inpPhoneName =
    document.getElementById("inpPhoneName");

const inpPhonePrice =
    document.getElementById("inpPhonePrice");

const inpPhoneQts =
    document.getElementById("inpPhoneQts");


//============================================================
// Update Product Inputs
//============================================================

const inpPhoneName2 =
    document.getElementById("inpPhoneName2");

const inpPhonePrice2 =
    document.getElementById("inpPhonePrice2");

const inpPhoneQts2 =
    document.getElementById("inpPhoneQts2");


//============================================================
// Table
//============================================================

const tbodyTable =
    document.getElementById("tbodyTable");


//============================================================
// Search
//============================================================

const searchInput =
    document.getElementById("searchInput");


//============================================================
// Statistics
//============================================================

const productsCount =
    document.getElementById("productsCount");

const quantityCount =
    document.getElementById("quantityCount");

const total =
    document.getElementById("total");


//============================================================
// Results Count
//============================================================

const resultsCount =
    document.getElementById("resultsCount");


//============================================================
// Empty State
//============================================================

const emptyState =
    document.getElementById("emptyState");


//============================================================
// Buttons
//============================================================

const addProductButton =
    document.getElementById("addProductButton");

const updateProductButton =
    document.getElementById("updateProductButton");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");


//============================================================
// Delete Product Name
//============================================================

const deleteProductName =
    document.getElementById("deleteProductName");


//============================================================
// Current Date
//============================================================

const currentDate =
    document.getElementById("currentDate");



/*====================================================================================================
    STEP 02 ==> ERROR ELEMENTS
====================================================================================================*/


const nameError =
    document.getElementById("nameError");

const priceError =
    document.getElementById("priceError");

const qtsError =
    document.getElementById("qtsError");


const updateNameError =
    document.getElementById("updateNameError");

const updatePriceError =
    document.getElementById("updatePriceError");

const updateQtsError =
    document.getElementById("updateQtsError");



/*====================================================================================================
    STEP 03 ==> BOOTSTRAP ELEMENTS
====================================================================================================*/


const addProductModalElement =
    document.getElementById("addProductModal");

const updateProductModalElement =
    document.getElementById("updateProductModal");

const deleteProductModalElement =
    document.getElementById("deleteProductModal");

const successToastElement =
    document.getElementById("successToast");


let addProductModal = null;

let updateProductModal = null;

let deleteProductModal = null;

let successToast = null;



/*====================================================================================================
    STEP 04 ==> APPLICATION VARIABLES
====================================================================================================*/


let products = [];

let currentUpdateIndex = -1;

let currentDeleteIndex = -1;

let currentSearchValue = "";



/*====================================================================================================
    STEP 05 ==> INITIALIZE BOOTSTRAP
====================================================================================================*/


function initializeBootstrapComponents() {

    if (typeof bootstrap === "undefined") {

        console.error(
            "Bootstrap JavaScript is not loaded."
        );

        return;

    }


    if (addProductModalElement) {

        addProductModal =
            new bootstrap.Modal(
                addProductModalElement
            );

    }


    if (updateProductModalElement) {

        updateProductModal =
            new bootstrap.Modal(
                updateProductModalElement
            );

    }


    if (deleteProductModalElement) {

        deleteProductModal =
            new bootstrap.Modal(
                deleteProductModalElement
            );

    }


    if (successToastElement) {

        successToast =
            new bootstrap.Toast(
                successToastElement,
                {
                    delay: 2500
                }
            );

    }

}



/*====================================================================================================
    STEP 06 ==> LOCAL STORAGE
====================================================================================================*/


//============================================================
// Load Products
//============================================================

function loadProducts() {

    try {

        const storedProducts =
            localStorage.getItem(
                "fatoraProducts"
            );


        if (!storedProducts) {

            products = [];

            return;

        }


        const parsedProducts =
            JSON.parse(
                storedProducts
            );


        if (!Array.isArray(parsedProducts)) {

            products = [];

            return;

        }


        products =
            parsedProducts.map(
                function (product) {

                    return {

                        namePhone:
                            String(
                                product.namePhone || ""
                            ),

                        pricePhone:
                            Number(
                                product.pricePhone
                            ) || 0,

                        QtsPhone:
                            Number(
                                product.QtsPhone
                            ) || 0

                    };

                }
            );

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        products = [];

    }

}


//============================================================
// Save Products
//============================================================

function saveProducts() {

    try {

        localStorage.setItem(
            "fatoraProducts",
            JSON.stringify(products)
        );

    } catch (error) {

        console.error(
            "Error saving products:",
            error
        );

    }

}



/*====================================================================================================
    STEP 07 ==> RENDER PRODUCTS
====================================================================================================*/


function renderProducts() {

    if (!tbodyTable) {

        return;

    }


    tbodyTable.innerHTML = "";


    //========================================================
    // Filter
    //========================================================

    const filteredProducts =
        products.filter(
            function (product) {

                return product.namePhone
                    .toLowerCase()
                    .includes(
                        currentSearchValue.toLowerCase()
                    );

            }
        );


    //========================================================
    // Results Count
    //========================================================

    updateResultsCount(
        filteredProducts.length
    );


    //========================================================
    // Empty State
    //========================================================

    if (filteredProducts.length === 0) {

        emptyState.style.display = "block";

        updateStatistics();

        return;

    }


    emptyState.style.display = "none";


    //========================================================
    // Create Rows
    //========================================================

    filteredProducts.forEach(
        function (product) {

            const originalIndex =
                products.indexOf(product);


            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>

                    <span class="product-number">
                        #${String(originalIndex + 1).padStart(2, "0")}
                    </span>

                </td>


                <td>

                    <div class="product-cell">

                        <div class="product-icon">

                            <i class="fa-solid fa-mobile-screen-button"></i>

                        </div>

                        <strong>
                            ${escapeHTML(product.namePhone)}
                        </strong>

                    </div>

                </td>


                <td>

                    <span class="price-value">

                        ${formatNumber(product.pricePhone)}

                    </span>

                    <span class="currency">
                        EGP
                    </span>

                </td>


                <td>

                    <span class="quantity-badge">

                        ${formatNumber(product.QtsPhone)}

                    </span>

                </td>


                <td>

                    <span class="product-total">

                        ${formatNumber(
                            product.pricePhone *
                            product.QtsPhone
                        )}

                        <span class="currency">
                            EGP
                        </span>

                    </span>

                </td>


                <td>

                    <div class="actions-wrapper">

                        <button
                            type="button"
                            class="action-btn update-btn"
                            data-action="update"
                            data-index="${originalIndex}"
                            title="Update Product"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="action-btn delete-btn"
                            data-action="delete"
                            data-index="${originalIndex}"
                            title="Delete Product"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            tbodyTable.appendChild(tr);

        }
    );


    //========================================================
    // Statistics
    //========================================================

    updateStatistics();

}



/*====================================================================================================
    STEP 08 ==> STATISTICS
====================================================================================================*/


function updateStatistics() {


    //========================================================
    // Products
    //========================================================

    const productsNumber =
        products.length;


    //========================================================
    // Quantity
    //========================================================

    const totalQuantity =
        products.reduce(
            function (sum, product) {

                return sum +
                    Number(product.QtsPhone || 0);

            },
            0
        );


    //========================================================
    // Total Value
    //========================================================

    const totalValue =
        products.reduce(
            function (sum, product) {

                const price =
                    Number(
                        product.pricePhone
                    ) || 0;


                const quantity =
                    Number(
                        product.QtsPhone
                    ) || 0;


                return sum +
                    price * quantity;

            },
            0
        );


    //========================================================
    // Update DOM
    //========================================================

    productsCount.textContent =
        formatNumber(productsNumber);


    quantityCount.textContent =
        formatNumber(totalQuantity);


    total.textContent =
        formatNumber(totalValue);

}



/*====================================================================================================
    STEP 09 ==> RESULTS COUNT
====================================================================================================*/


function updateResultsCount(count) {

    if (!resultsCount) {

        return;

    }


    resultsCount.textContent =
        `${count} ${count === 1 ? "product" : "products"}`;

}



/*====================================================================================================
    STEP 10 ==> ADD PRODUCT
====================================================================================================*/


function addProduct() {


    //========================================================
    // Clear Old Errors
    //========================================================

    clearAddErrors();


    //========================================================
    // Get Values
    //========================================================

    const name =
        inpPhoneName.value.trim();

    const price =
        Number(inpPhonePrice.value);

    const quantity =
        Number(inpPhoneQts.value);


    //========================================================
    // Validate
    //========================================================

    const isValid =
        validateAddProduct(
            name,
            price,
            quantity
        );


    if (!isValid) {

        return;

    }


    //========================================================
    // Create Product
    //========================================================

    const newProduct = {

        namePhone: name,

        pricePhone: price,

        QtsPhone: quantity

    };


    //========================================================
    // Add
    //========================================================

    products.push(
        newProduct
    );


    //========================================================
    // Save
    //========================================================

    saveProducts();


    //========================================================
    // Refresh
    //========================================================

    renderProducts();


    //========================================================
    // Clear
    //========================================================

    clearAddInputs();


    //========================================================
    // Close Modal
    //========================================================

    if (addProductModal) {

        addProductModal.hide();

    }


    //========================================================
    // Toast
    //========================================================

    showToast(
        "Product added successfully."
    );

}



/*====================================================================================================
    STEP 11 ==> VALIDATE ADD PRODUCT
====================================================================================================*/


function validateAddProduct(
    name,
    price,
    quantity
) {

    let isValid = true;


    //========================================================
    // Name
    //========================================================

    if (!name) {

        showError(
            inpPhoneName,
            nameError,
            "Product name is required."
        );

        isValid = false;

    }


    //========================================================
    // Price
    //========================================================

    if (
        inpPhonePrice.value.trim() === "" ||
        !Number.isFinite(price) ||
        price <= 0
    ) {

        showError(
            inpPhonePrice,
            priceError,
            "Please enter a valid price."
        );

        isValid = false;

    }


    //========================================================
    // Quantity
    //========================================================

    if (
        inpPhoneQts.value.trim() === "" ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        showError(
            inpPhoneQts,
            qtsError,
            "Please enter a valid quantity."
        );

        isValid = false;

    }


    return isValid;

}



/*====================================================================================================
    STEP 12 ==> OPEN UPDATE MODAL
====================================================================================================*/


function openUpdateModal(index) {

    if (
        index < 0 ||
        index >= products.length
    ) {

        return;

    }


    currentUpdateIndex = index;


    const product =
        products[index];


    inpPhoneName2.value =
        product.namePhone;


    inpPhonePrice2.value =
        product.pricePhone;


    inpPhoneQts2.value =
        product.QtsPhone;


    clearUpdateErrors();


    if (updateProductModal) {

        updateProductModal.show();

    }

}



/*====================================================================================================
    STEP 13 ==> UPDATE PRODUCT
====================================================================================================*/


function updateProduct() {

    if (
        currentUpdateIndex < 0 ||
        currentUpdateIndex >= products.length
    ) {

        return;

    }


    clearUpdateErrors();


    const name =
        inpPhoneName2.value.trim();

    const price =
        Number(inpPhonePrice2.value);

    const quantity =
        Number(inpPhoneQts2.value);


    let isValid = true;


    //========================================================
    // Name
    //========================================================

    if (!name) {

        showError(
            inpPhoneName2,
            updateNameError,
            "Product name is required."
        );

        isValid = false;

    }


    //========================================================
    // Price
    //========================================================

    if (
        inpPhonePrice2.value.trim() === "" ||
        !Number.isFinite(price) ||
        price <= 0
    ) {

        showError(
            inpPhonePrice2,
            updatePriceError,
            "Please enter a valid price."
        );

        isValid = false;

    }


    //========================================================
    // Quantity
    //========================================================

    if (
        inpPhoneQts2.value.trim() === "" ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        showError(
            inpPhoneQts2,
            updateQtsError,
            "Please enter a valid quantity."
        );

        isValid = false;

    }


    if (!isValid) {

        return;

    }


    //========================================================
    // Update
    //========================================================

    products[currentUpdateIndex] = {

        namePhone: name,

        pricePhone: price,

        QtsPhone: quantity

    };


    //========================================================
    // Save
    //========================================================

    saveProducts();


    //========================================================
    // Refresh
    //========================================================

    renderProducts();


    //========================================================
    // Reset
    //========================================================

    currentUpdateIndex = -1;


    //========================================================
    // Close
    //========================================================

    if (updateProductModal) {

        updateProductModal.hide();

    }


    //========================================================
    // Toast
    //========================================================

    showToast(
        "Product updated successfully."
    );

}



/*====================================================================================================
    STEP 14 ==> OPEN DELETE MODAL
====================================================================================================*/


function openDeleteModal(index) {

    if (
        index < 0 ||
        index >= products.length
    ) {

        return;

    }


    currentDeleteIndex = index;


    const product =
        products[index];


    deleteProductName.textContent =
        product.namePhone;


    if (deleteProductModal) {

        deleteProductModal.show();

    }

}



/*====================================================================================================
    STEP 15 ==> DELETE PRODUCT
====================================================================================================*/


function deleteProduct() {

    if (
        currentDeleteIndex < 0 ||
        currentDeleteIndex >= products.length
    ) {

        return;

    }


    const deletedProduct =
        products[currentDeleteIndex];


    //========================================================
    // Delete
    //========================================================

    products.splice(
        currentDeleteIndex,
        1
    );


    //========================================================
    // Save
    //========================================================

    saveProducts();


    //========================================================
    // Refresh
    //========================================================

    renderProducts();


    //========================================================
    // Reset
    //========================================================

    currentDeleteIndex = -1;


    //========================================================
    // Close
    //========================================================

    if (deleteProductModal) {

        deleteProductModal.hide();

    }


    //========================================================
    // Toast
    //========================================================

    showToast(
        `"${deletedProduct.namePhone}" deleted successfully.`
    );

}



/*====================================================================================================
    STEP 16 ==> SEARCH
====================================================================================================*/


function searchProducts() {

    currentSearchValue =
        searchInput.value.trim();


    renderProducts();

}



/*====================================================================================================
    STEP 17 ==> CLEAR ADD INPUTS
====================================================================================================*/


function clearAddInputs() {

    inpPhoneName.value = "";

    inpPhonePrice.value = "";

    inpPhoneQts.value = "";


    clearAddErrors();

}



/*====================================================================================================
    STEP 18 ==> ADD ERRORS
====================================================================================================*/


function clearAddErrors() {

    clearError(
        inpPhoneName,
        nameError
    );


    clearError(
        inpPhonePrice,
        priceError
    );


    clearError(
        inpPhoneQts,
        qtsError
    );

}



/*====================================================================================================
    STEP 19 ==> UPDATE ERRORS
====================================================================================================*/


function clearUpdateErrors() {

    clearError(
        inpPhoneName2,
        updateNameError
    );


    clearError(
        inpPhonePrice2,
        updatePriceError
    );


    clearError(
        inpPhoneQts2,
        updateQtsError
    );

}



/*====================================================================================================
    STEP 20 ==> SHOW ERROR
====================================================================================================*/


function showError(
    input,
    errorElement,
    message
) {

    if (!input || !errorElement) {

        return;

    }


    input.classList.add(
        "input-invalid"
    );


    errorElement.textContent =
        message;

}



/*====================================================================================================
    STEP 21 ==> CLEAR ERROR
====================================================================================================*/


function clearError(
    input,
    errorElement
) {

    if (!input || !errorElement) {

        return;

    }


    input.classList.remove(
        "input-invalid"
    );


    errorElement.textContent =
        "";

}



/*====================================================================================================
    STEP 22 ==> TOAST
====================================================================================================*/


function showToast(message) {

    if (!successToast) {

        return;

    }


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (toastMessage) {

        toastMessage.textContent =
            message;

    }


    successToast.show();

}



/*====================================================================================================
    STEP 23 ==> FORMAT NUMBER
====================================================================================================*/


function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

}



/*====================================================================================================
    STEP 24 ==> ESCAPE HTML
====================================================================================================*/


function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}



/*====================================================================================================
    STEP 25 ==> CURRENT DATE
====================================================================================================*/


function displayCurrentDate() {

    if (!currentDate) {

        return;

    }


    const today =
        new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

}



/*====================================================================================================
    STEP 26 ==> TABLE ACTIONS
====================================================================================================*/


tbodyTable.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".action-btn"
            );


        if (!button) {

            return;

        }


        const index =
            Number(
                button.dataset.index
            );


        const action =
            button.dataset.action;


        if (action === "update") {

            openUpdateModal(index);

        }


        if (action === "delete") {

            openDeleteModal(index);

        }

    }
);



/*====================================================================================================
    STEP 27 ==> BUTTON EVENTS
====================================================================================================*/


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        addProduct
    );

}


if (updateProductButton) {

    updateProductButton.addEventListener(
        "click",
        updateProduct
    );


}


if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        deleteProduct
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );

}



/*====================================================================================================
    STEP 28 ==> ENTER KEY
====================================================================================================*/


[
    inpPhoneName,
    inpPhonePrice,
    inpPhoneQts

].forEach(
    function (input) {

        if (!input) {

            return;

        }


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    addProduct();

                }

            }
        );

    }
);


[
    inpPhoneName2,
    inpPhonePrice2,
    inpPhoneQts2

].forEach(
    function (input) {

        if (!input) {

            return;

        }


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    updateProduct();

                }

            }
        );

    }
);



/*====================================================================================================
    STEP 29 ==> MODAL EVENTS
====================================================================================================*/


if (addProductModalElement) {

    addProductModalElement.addEventListener(
        "hidden.bs.modal",
        function () {

            clearAddInputs();

        }
    );

}


if (updateProductModalElement) {

    updateProductModalElement.addEventListener(
        "hidden.bs.modal",
        function () {

            currentUpdateIndex = -1;

            clearUpdateErrors();

        }
    );

}


if (deleteProductModalElement) {

    deleteProductModalElement.addEventListener(
        "hidden.bs.modal",
        function () {

            currentDeleteIndex = -1;

        }
    );

}



/*====================================================================================================
    STEP 30 ==> SEARCH SHORTCUT
====================================================================================================*/


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "/" &&
            document.activeElement !== searchInput
        ) {

            event.preventDefault();

            searchInput.focus();

        }

    }
);



/*====================================================================================================
    STEP 31 ==> INITIALIZE APPLICATION
====================================================================================================*/


initializeBootstrapComponents();

loadProducts();

renderProducts();

displayCurrentDate();