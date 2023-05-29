const baseURL = "http://diwserver.vps.webdock.cloud:8765/"
var currentUrl = baseURL + 'products'
var currentPage = 1

$(document).ready(() => {
    fetchProducts(currentUrl);
    fetchCategories();
    onSubmitQuery();
});

async function fetchProducts(url){
    addLoading();
    await fetch(url)
    .then(res=>res.json())
    .then(json => {
        $("#products").empty();
        $.each(json.products, (_, data) => {
            $('#products').append(
                `<div class="col-lg-4 col-md-6 col-12">${buildCardProduct(data)}</div>`
            );
        });
        $(window).scrollTop(0);
        removeLoading();
    });
}

function onSubmitQuery(){
    $("#busca-form").submit((event) => {
        event.preventDefault();
        console.log($("#search-text").val());
        window.location.href = "search.html?search=" + $("#search-text").val();
    })
}

async function fetchCategories(){
    await fetch(baseURL + 'products/categories')
    .then(res=>res.json())
    .then(json => {
        $.each(json, (index, category) => {
            $("#category").append(populateCategories(index, category));
            $(".category-" + index).click(() => {
                currentUrl = baseURL + 'products/category/' + json[index];
                console.log(currentUrl);
                fetchProducts(currentUrl);
            })
        })
    })
    removeLoading();
}

function buildCardProduct(product){
    let url = `/detail.html?productId=${product.id}`;
    return `
    <div class="card m-2 product-card">
        <img src="${product.image}" class="card-img-top product-image" alt="...">
        <div class="card-body">
            <h5 class="card-title product-title">${product.title}</h5>
            ${buildDisplayCategories(product.displayCategories)}
            <p class="card-text product-description">${maxLines(product.description)}</p>
            <p class="card-text">R$ ${product.price}</p>
            <p>${buildRating(product.rating)} (${product.rating.count})</p>
            <a href="${url}" class="btn btn-primary product-detail">Detail</a>
        </div>
    </div>`;
}

function buildDisplayCategories(categories){
    let categoryString = ""
    try{
        categories.split(",").forEach(item => {
            categoryString += `<span class="badge text-bg-secondary me-1">${item}</span>`
        })
    }catch(e){ }
    return categoryString;
}

function populateCategories(index, category){
    let url = baseURL + 'products/categories/' + category;
    
    return `<li><a class="dropdown-item category-${index}">${category}</a></li>`
}

function maxLines(text){
    let maxCharacters = 150;
    if(text.length > maxCharacters){
        return text.substr(0, maxCharacters) + " ..."
    } else {
        return text;
    }
}

function buildRating(rating){
    let rate = Math.floor(rating.rate)
    let rateString = ""
    for(let i =0; i< 5; i++){
        if(i<rate){
            rateString += `
            <i class="bi bi-star-fill"></i>
        `;
        }else {
            rateString += `
            <i class="bi bi-star"></i>
        `;
        }
    }
    return rateString;
}

function addLoading(){
    $('#main-container').append(
        `
        <div id="loading-container" class="mx-auto text-center">
            <div class="lds-hourglass"></div>
            <p>Carregando itens</p>
        </div>
        `
    )
}

function removeLoading(){
    $('#loading-container').remove();
}