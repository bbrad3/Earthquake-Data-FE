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
const locationsLink = document.querySelector('#Locations-link')

const views = document.querySelectorAll('.view')
const homeView = document.querySelector('#homeView')
const signupView = document.querySelector('#signupView')
const loginView = document.querySelector('#loginView')
const profileView = document.querySelector('#profileView')

const locationsView = document.querySelector('#locationsView')
const allLocationsDiv = document.querySelector('#allLocations')

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
    if(localStorage.getItem('userId') && localStorage.getItem('userId') !== undefined){
        signupLink.classList.add('hidden')
        loginLink.classList.add('hidden')
        logoutLink.classList.remove('hidden')
        profileLink.classList.remove('hidden')
        locationsLink.classList.remove('hidden')
    } else {
        signupLink.classList.remove('hidden')
        loginLink.classList.remove('hidden')
        logoutLink.classList.add('hidden')
        profileLink.classList.add('hidden')
        locationsLink.classList.remove('hidden')
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
        const data = response.data
        if(data.status === 200) {
            localStorage.setItem('userId', data.userId)
            goHome()
            checkLoggedIn()
            alert(`Welcome ${data.user.username}`)
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
        console.log('signin response', response.status, response)
        const data = response.data
        if(data.status === 200) {
            localStorage.setItem('userId', data.userId)
            goHome()
            checkLoggedIn()
            alert(`Welcome ${data.user.username}`)
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


// LOCATIONS
locationsLink.addEventListener('click', async (e) => {
    e.preventDefault
    getAllLocations()
})
async function getAllLocations() {
    try {
        const response = await axios.get(`${backendUrl}/locations/all`)
        console.log('LOCATIONS RESPONSE', response.status, response)
        const data = response.data
        if(data.status === 200) {
            console.log('Here is your locations data...', data)
            hideViews()
            buildLocationsDisplay(data.locations)
            locationsView.classList.remove('hidden')
        }
    } catch (error) {
        console.log('getAllLocations Error:', error)
    }
}
function buildLocationsDisplay(data) {
    // city, country, latitude, longitude
    data.forEach(local => {
        const row = document.createElement('div')
        row.classList.add('locationRow')
        allLocationsDiv.append(row)
    
        const city = document.createElement('p')
        city.classList.add('city')
        city.innerHTML = `City: ${local.city}`
        row.append(city)

        const country = document.createElement('p')
        country.classList.add('country')
        country.innerHTML = `Country: ${local.country}`
        row.append(country)

        const latitude = document.createElement('p')
        latitude.classList.add('latitude')
        latitude.innerHTML = `Latitude: ${local.latitude}`
        row.append(latitude)

        const longitude = document.createElement('p')
        longitude.classList.add('longitude')
        longitude.innerHTML = `Longitude: ${local.longitude}`
        row.append(longitude)

    })
}