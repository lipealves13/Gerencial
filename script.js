const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionsName = document.querySelector('#text')
const inputTransactionsAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.
getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updateLocalStorage()
    init()

}


const addTransactionsIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${transaction.name} <span>${operator} R$ ${amountWithoutOperator} 
    </span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `
    transactionsUl.prepend(li)
}


const updateBalanceValues = () => {
    const transactionsAmount = transactions
        .map(transaction => transaction.amount)
    const total = transactionsAmount
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionsAmount
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmount
            .filter(value => value < 0)
            .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}
const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionsIntoDOM)
    updateBalanceValues()
}
init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}



const addToTransactionsArray = (transactionsName, transactionsAmount) => {
    const generateID = Math.round(Math.random() * 10000)
    transactions.push({
        id: generateID,
        name: transactionsName,
        amount: Number(transactionsAmount)
    })
}

const cleanInputs = () => {
    inputTransactionsName.value = ''
    inputTransactionsAmount.value = ''
    location.reload()
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionsName = inputTransactionsName.value.trim()
    const transactionsAmount = inputTransactionsAmount.value.trim()
    const isSomeInputEmpty = transactionsAmount === '' || transactionsName === ''
    if (isSomeInputEmpty) {
        alert('Por favor, preencha todos os campos')
        return
    }
    addToTransactionsArray(transactionsName, transactionsAmount)
    init()
    updateLocalStorage()
    cleanInputs()

}
form.addEventListener('submit', handleFormSubmit)
