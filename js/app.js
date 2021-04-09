console.log('Hello from app.js')
// GLOBAL VARIABLES
const backendUrl = 'http://localhost:3001'

// DOM SELECTORS
const navLinks = document.querySelectorAll('.nav-link')
const brandLink = document.querySelector('#Brand-link')
const signupLink = document.querySelector('#Signup-link')
const loginLink = document.querySelector('#Login-link')
const logoutLink = document.querySelector('#Logout-link')
const profileLink = document.querySelector('#Profile-link')

const views = document.querySelectorAll('.view')
const homeView = document.querySelector('#homeView')
const signupView = document.querySelector('#signupView')
const loginView = document.querySelector('#loginView')
const profileView = document.querySelector('#profileView')

const signupForm = document.querySelector('#signupForm')
const loginForm = document.querySelector('#loginForm')

// NAV LINKS
brandLink.addEventListener('click', (e) => {
    e.preventDefault()
    hideViews()
    homeView.classList.remove('hidden')
})
signupLink.addEventListener('click', (e) => {
    e.preventDefault()
    hideViews()
    signupView.classList.remove('hidden')
})
loginLink.addEventListener('click', (e) => {
    e.preventDefault()
    hideViews()
    loginView.classList.remove('hidden')
})
profileLink.addEventListener('click', (e) => {
    e.preventDefault()
    hideViews()
    profileView.classList.remove('hidden')
})

// REUSABLE FUNCTIONS
function hideViews() {
    views.forEach(view => {
        view.classList.add('hidden')
    })
}
function goHome() {
    hideViews()
    homeView.classList.remove('hidden')
}
function checkLoggedIn() {
    if(localStorage.getItem('userId')){
        signupLink.classList.add('hidden')
        loginLink.classList.add('hidden')
        logoutLink.classList.remove('hidden')
        profileLink.classList.remove('hidden')
    } else {
        signupLink.classList.remove('hidden')
        loginLink.classList.remove('hidden')
        logoutLink.classList.add('hidden')
        profileLink.classList.add('hidden')
    }
}
checkLoggedIn() // RUN ON PAGE LOAD/REFRESH

// USER
// --SIGNUP
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    userSignup()
})
async function userSignup() {
    try {
        const username = document.querySelector('#username-signup').value
        const email = document.querySelector('#email-signup').value
        const password = document.querySelector('#password-signup').value

        const response = await axios.post(`${backendUrl}/user/new`, {
            username: username,
            email: email,
            password: password
        })
        console.log('signup response', response.status, response)
        if(response.status === 200) {
            const user = response.data.user
            localStorage.setItem('userId', user.id)
            goHome()
            checkLoggedIn()
            alert(`Welcome ${user.username}`)
        }
    } catch (error) {
        console.log('userSignup Error:', error)
    }
}
// --LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    userLogin()
})
async function userLogin() {
    try {
        const email = document.querySelector('#email-login').value
        const password = document.querySelector('#password-login').value

        const response = await axios.post(`${backendUrl}/user/login`, {
            email: email,
            password: password
        })
        console.log('signup response', response.status, response)
        if(response.status === 200) {
            const user = response.data.user
            localStorage.setItem('userId', user.id)
            goHome()
            checkLoggedIn()
            alert(`Welcome ${user.username}`)
        }
    } catch (error) {
        console.log('userLogin Error:', error)
    }
}

// --LOGOUT
logoutLink.addEventListener('click', () => {
    console.log('User logged out')
    localStorage.removeItem('userId')
    goHome()
    checkLoggedIn()
})