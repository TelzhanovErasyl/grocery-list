let groceryContainer = document.querySelector('.grocery__container')
let groceryList = document.querySelector('.grocery__list')
let alert = document.querySelector('.alert')
let groceryForm = document.querySelector('.grocery__form')
let input = document.getElementById('grocery')
let groceryTitle = document.querySelector('.grocery__title')
let submitBtn = document.querySelector('.btn__submit')
let cleaerBtn = document.querySelector('.btn__clear')

groceryForm.addEventListener('submit', addItem)
cleaerBtn.addEventListener('click', clearItems)
window.addEventListener('DOMContentLoaded', loadFromLocalStorage)

let editElement
let editFlag = false
let editID = ''

// ***FUNCTIONS***

function addItem(e) {
    e.preventDefault()
    let id = new Date().getTime().toString()
    let value = input.value

    if (value && !editFlag) {
        createListItem(id, value)
        addToLocalStorage(id, value)
        displayAlert('item added!', 'success')
        groceryContainer.classList.add('show-button')

        setBackToDefault()
    }

    else if (value && editFlag) {
        editElement.textContent = input.value
        editLocalStorage(editID, editElement.textContent)
        displayAlert('edited successfully', 'success')
        setBackToDefault()
    }
    else {
        displayAlert('please enter value', 'danger')
    }
}

function clearItems() {
    let items = document.querySelectorAll('.grocery__item')
    items.forEach(function (item) {
        groceryList.removeChild(item)
    })
    groceryContainer.classList.remove('show-button')
    localStorage.clear()
    displayAlert('cleared successfully!', 'success')
    setBackToDefault()
}

function deleteItem(e) {
    let element = e.currentTarget.parentElement.parentElement
    let id = element.dataset.id
    groceryList.removeChild(element)
    if (groceryList.childElementCount == 0) {
        groceryContainer.classList.remove('show-button')
    }
    removeFromLocalStorage(id)
    displayAlert('deleted successfully!', 'success')
    setBackToDefault()
}

function editItem(e) {
    let element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling
    input.value = editElement.textContent
    submitBtn.textContent = 'Edit'
    editFlag = true
    editID = element.dataset.id
}

function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(function () {
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 3000)
}

function setBackToDefault() {
    input.value = ''
    editFlag = false
    editID = ''
    submitBtn.textContent = 'Submit'
}

function addToLocalStorage(id, value) {
    let grocery = { id, value }
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage()

    items.filter(function (item) {
        if (item.id == id) {
            items.splice(item, 1)
        }
    })
    if (items.length == 0) {
        localStorage.clear()
    }
    else {
        localStorage.setItem('list', JSON.stringify(items))
    }
}

function editLocalStorage(id, value) {
    let items = getLocalStorage()
    items.map(function (item) {
        if (item.id == id) {
            item.value = value
        }
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
}

function loadFromLocalStorage() {
    let items = getLocalStorage()
    if (items.length) {
        items.forEach(function(item) {
            createListItem(item.id, item.value)
        })
        groceryContainer.classList.add('show-button')
    }
}

function createListItem(id, value) {
    let element = document.createElement('div')
    let attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)
    element.classList.add('grocery__item')

    element.innerHTML = `
            <p class="grocery__title">${value}</p>

            <div class="grocery__button-container">
                <button type='button' class="btn__edit">
                    <i class="fas fa-edit"></i>
                </button>

                <button type='button' class="btn__delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`

    groceryList.appendChild(element)
    let editBtn = document.querySelectorAll('.btn__edit')
    let deleteBtn = document.querySelectorAll('.btn__delete')

    deleteBtn.forEach(function (btn) {
        btn.addEventListener('click', deleteItem)
    })

    editBtn.forEach(function (btn) {
        btn.addEventListener('click', editItem)
    })
}