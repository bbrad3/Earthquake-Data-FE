console.log('Hello from app.js')
// GLOBAL VARIABLES
const backendUrl = 'http://localhost:3001'
export const DATA = {
    DBLOCATIONS: [],
    QUAKES: []
}

// DOM SELECTORS
const navLinks = document.querySelectorAll('.nav-link')
const brandLink = document.querySelector('#Brand-link')
const signupLink = document.querySelector('#Signup-link')
const loginLink = document.querySelector('#Login-link')
const logoutLink = document.querySelector('#Logout-link')
const profileLink = document.querySelector('#Profile-link')
const searchLink = document.querySelector('#Search-link')
const locationsLink = document.querySelector('#Locations-link')

const views = document.querySelectorAll('.view')
const homeView = document.querySelector('#homeView')
const signupView = document.querySelector('#signupView')
const loginView = document.querySelector('#loginView')

const searchView = document.querySelector('#searchView')
const searchBtn = document.querySelector('#searchBtn')
let searchLocations = document.querySelector('#searchLocations')
const searchResults = document.querySelector('#searchResults')

const profileView = document.querySelector('#profileView')
const editProfile = document.querySelector('#editProfile')
const deleteProfile = document.querySelector('#deleteProfile')

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
searchLink.addEventListener('click', (e) => {
    e.preventDefault()
    hideViews()
    searchView.classList.remove('hidden')
    getUserLocations()
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
    while(userInfoDiv.firstChild) {
        userInfoDiv.firstChild.remove()
    }
    const row = document.createElement('form')
    row.classList.add('userForm')
    userInfoDiv.append(row)
    // row.addEventListener('submit', )

    const username = document.createElement('input')
    username.classList.add('userInfoForm')
    username.setAttribute('disabled', true)
    username.value = `${user.username}`
    row.append(username)

    const email = document.createElement('input')
    email.classList.add('userInfoForm')
    email.setAttribute('disabled', true)
    email.value = `${user.email}`
    row.append(email)

    const memberSince = document.createElement('input')
    memberSince.classList.add('userInfoForm')
    memberSince.setAttribute('disabled', true)
    memberSince.value = `${user.createdAt.slice(0,10)}`
    row.append(memberSince)

    const btns = document.createElement('div')
    userInfoDiv.append(btns)

    
    const editProfile = document.createElement('button')
    editProfile.innerHTML = 'Edit Profile'
    btns.append(editProfile)
    
    const deleteProfile = document.createElement('button')
    deleteProfile.innerHTML = 'Delete Profile'
    deleteProfile.classList.add('hidden')
    btns.append(deleteProfile)
    
    const submitProfile = document.createElement('button')
    submitProfile.innerHTML = 'Submit'
    submitProfile.classList.add('hidden')
    btns.append(submitProfile)

    editProfile.addEventListener('click', () => {
        const allImgs = document.querySelectorAll('.editImg')

        submitProfile.classList.remove('hidden')
        deleteProfile.classList.remove('hidden')
        username.removeAttribute('disabled')
        email.removeAttribute('disabled')
        for(let img of allImgs) {
            img.classList.remove('hidden')
            deleteProfile.classList.remove('hidden')
        }

        submitProfile.addEventListener('click', async () => {
            try {
                const userId = localStorage.getItem('userId')
                const response = await axios.post(`${backendUrl}/user/update`, {
                    authorization: userId,
                    email: email.value,
                    username: username.value
                })
                console.log(response)
            } catch (error) {
               console.log('Submit updated user error:', error) 
            }
        })
    })

    deleteProfile.addEventListener('click', async () => {
        try {
            const userId = localStorage.getItem('userId')

            const response = await axios.delete(`${backendUrl}/user/destroy`, {
                headers: {
                    authorization: userId
                }
            })
            console.log('DELETE RESPONSE', response)
        } catch (error) {
            console.log('Delete user error:', error)
        }
    })


    // savedLocations
    buildLocationsDisplay(user.locations, savedLocationsDiv)
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
    while(parentDiv.firstChild) {
        parentDiv.firstChild.remove()
    }
    buildLocationLabels()

    data.forEach(local => {
        const row = document.createElement('div')
        row.classList.add('locationRow')
        parentDiv.append(row)

        const imgBtn = document.createElement('img')
        const imgP = document.createElement('p')
        imgBtn.classList.add('editImg')
        if(parentDiv === savedLocationsDiv) {
            imgBtn.setAttribute('src', '../assets/flaticon/png/006-x-button.png')
            imgBtn.classList.add('hidden')
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
        const userId = localStorage.getItem('userId')
        const response = await axios.delete(`${backendUrl}/locations/un-associate`, {
            headers: {
                authorization: userId,
                localId: local.id
            }
        })
        // console.log('UNASSOCIATE RESPONSE', response)
        if(response.status === 200) {
            console.log(response.data.message, (response.data.association === 1))
        }
    } catch (error) {
        console.log('Un-Association error:', error)
    }
}

// SEARCH!!!!
async function getUserLocations() {
    try {
        const userId = localStorage.getItem('userId')
        const response = await axios.get(`${backendUrl}/user/find`, {
            headers: {
                authorization: userId
            }
        })
        // console.log('USER LOCATIONS RESPONSE', response)
        const data = response.data
        if(data.status === 200) {
            console.log('user', data.user)
            buildSearchOptions(data.user.locations)
        }
    } catch (error) {
        console.error('Could not get user locations:', error)
    }
}
function buildSearchOptions(locations) {
    const option = document.createElement('option')
    option.innerHTML = '--none--'
    searchLocations.append(option)

    locations.forEach(l => {
        const locationName = `${l.city}, ${l.country}`
        const locationCoords = `${l.latitude},${l.longitude}`

        const option = document.createElement('option')
        option.innerHTML = locationName
        option.setAttribute('value', locationCoords)
        searchLocations.append(option)
    })
}
searchBtn.addEventListener('click', () => {
    const timeFrameselect = document.querySelector('#timeframe')
    searchLocations = document.querySelector('#searchLocations')
    let timeframe = timeFrameselect.value
    let location = searchLocations.value

    console.log('location', location);
    searchForQuakes(timeframe, location)
})
async function searchForQuakes(timeframe, location) {
    try {
        let response = ''
        if(location === '--none--') {
            response = await axios.get(`${backendUrl}/search/${timeframe}`)
        } else {
            let coordsArr = location.split(',')
            let latitude = coordsArr[0]
            let longitude = coordsArr[1]
            response = await axios.get(`${backendUrl}/search/location`, {
                headers: {
                    lat: latitude,
                    long: longitude,
                    radius: 100
                }
            })
        }
        console.log('SEARCH RESPONSE', timeframe, response.data, response.data.quakes)
        buildSearchResults(response.data.quakes)
    } catch (error) {
        console.error('Time frame search error:', error)
    }
}
function buildSearchResults(quakes) {
    while(searchResults.firstChild){
        searchResults.firstChild.remove()
    }
    DATA.QUAKES = []
    // coords, depth, mag, place, type
    // coords, depth
    quakes.forEach(quake => {
        DATA.QUAKES.push(quake.coords)

        const row = document.createElement('div')
        row.classList.add('locationRow')
        searchResults.append(row)

        if(quake.mag && quake.place) {
            const place = document.createElement('p')
            place.innerHTML = quake.place
            row.append(place)

            const mag = document.createElement('p')
            mag.innerHTML = quake.mag
            row.append(mag)
        }

        const coords = document.createElement('p')
        coords.innerHTML = `${quake.coords[0]}, ${quake.coords[1]}`
        row.append(coords)

        const depth = document.createElement('p')
        depth.innerHTML = quake.depth
        row.append(depth)
    })
}
