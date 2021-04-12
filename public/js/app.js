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
const userInfoDiv = document.querySelector('#userInfo')
const savedLocationsDiv = document.querySelector('#savedLocations')

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

// PROFILE
profileLink.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
        const userId = localStorage.getItem('userId')
        const response = await axios.get(`${backendUrl}/user/find`, {
            headers: {
                authorization: userId
            }
        })
        // console.log('PROFILE RESPONSE', response)
        const data = response.data
        if(data.status === 200){
            console.log('user', data.user)
            buildUserProfile(data.user)
        }
    } catch (error) {
        console.log('Profile link error:', error)
    }
})
function buildUserProfile(user) {
    // userInfo
    const username = document.createElement('p')
    username.innerHTML = `${user.username}`
    userInfoDiv.append(username)

    const email = document.createElement('p')
    email.innerHTML = `${user.email}`
    userInfoDiv.append(email)

    const memberSince = document.createElement('p')
    memberSince.innerHTML = `${user.createdAt.slice(0,11)}`
    userInfoDiv.append(memberSince)

    // savedLocations
    buildLocationsDisplay(user.locations, savedLocationsDiv) // will need to refactor to make work
}

// LOCATIONS
locationsLink.addEventListener('click', async (e) => {
    e.preventDefault
    getAllLocations()
})
async function getAllLocations() {
    try {
        const response = await axios.get(`${backendUrl}/locations/all`)
        // console.log('LOCATIONS RESPONSE', response.status, response)
        const data = response.data
        if(data.status === 200) {
            // console.log('Here is your locations data...', data)
            hideViews()
            buildLocationsDisplay(data.locations, allLocationsDiv)
            locationsView.classList.remove('hidden')
        }
    } catch (error) {
        console.log('getAllLocations Error:', error)
    }
}
function buildLocationsDisplay(data, parentDiv) {
    // add/remove, city, country, latitude, longitude
    buildLocationLabels()

    data.forEach(local => {
        const row = document.createElement('div')
        row.classList.add('locationRow')
        parentDiv.append(row)

        const imgP = document.createElement('p')
        const imgBtn = document.createElement('img')
        if(parentDiv === savedLocationsDiv) {
            imgBtn.setAttribute('src', '../assets/flaticon/png/006-x-button.png')
        } else if(parentDiv === allLocationsDiv) {
            imgBtn.setAttribute('src', '../assets/flaticon/png/005-plus.png')
        }
        imgP.append(imgBtn)
        row.append(imgP)

        const city = document.createElement('p')
        city.classList.add('city')
        city.innerHTML = `${local.city}`
        row.append(city)

        const country = document.createElement('p')
        country.classList.add('country')
        country.innerHTML = `${local.country}`
        row.append(country)

        const latitude = document.createElement('p')
        latitude.classList.add('latitude')
        latitude.innerHTML = `${local.latitude}`
        row.append(latitude)

        const longitude = document.createElement('p')
        longitude.classList.add('longitude')
        longitude.innerHTML = `${local.longitude}`
        row.append(longitude)

        imgBtn.addEventListener('click', (e) => { // associate location to user
            if(e.target.getAttribute('src') === '../assets/flaticon/png/005-plus.png') {
                e.target.setAttribute('src', '../assets/flaticon/png/004-checked.png')
                associateLocation(local)
            } else if(e.target.getAttribute('src') === '../assets/flaticon/png/006-x-button.png') {
                deleteAssociation(local)
            }
        })
    })
}
function buildLocationLabels() {
    const row = document.createElement('div')
    row.classList.add('locationRow')
    allLocationsDiv.append(row)

    const favPlaceholder = document.createElement('p')
    favPlaceholder.classList.add('columnLabel')
    row.append(favPlaceholder)
    
    const cityLabel = document.createElement('p')
    cityLabel.classList.add('columnLabel')
    cityLabel.innerHTML = `City`
    row.append(cityLabel)

    const countryLabel = document.createElement('p')
    countryLabel.classList.add('columnLabel')
    countryLabel.innerHTML = `Country`
    row.append(countryLabel)

    const latitudeLabel = document.createElement('p')
    latitudeLabel.classList.add('columnLabel')
    latitudeLabel.innerHTML = `Latitude`
    row.append(latitudeLabel)

    const longitudeLabel = document.createElement('p')
    longitudeLabel.classList.add('columnLabel')
    longitudeLabel.innerHTML = `Longitude`
    row.append(longitudeLabel)
}

async function associateLocation(local) {
    try {
        const userId = localStorage.getItem('userId')
        const response = await axios.post(`${backendUrl}/locations/associate`, {
            headers: {
                authorization: userId,
                local
            }
        })
        console.log('ASSOCIATE RESPONSE', response)
        if(response.status === 200) {
            console.log(response.data.message, response.data.association)
        }
    } catch (error) {
        console.log('Association error:', error)
    }
}
async function deleteAssociation(local) {
    try {
        console.log('local', local)
        const userId = localStorage.getItem('userId')
        const response = await axios.delete(`${backendUrl}/locations/un-associate`, {
            headers: {
                authorization: userId,
            },
            local
        })
        console.log('UNASSOCIATE RESPONSE', response)
        if(response.status === 200) {
            console.log(response.data.message, response.data.association)
        }
    } catch (error) {
        console.log('Un-Association error:', error)
    }
}