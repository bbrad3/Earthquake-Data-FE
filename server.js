const express = require('express')
const morgan = require('morgan')
const app = express()

const routesReport = require('rowdy-logger').begin(app)
const path = require('path')
const replaceInFile = require('replace-in-file')

// MIDDLEWARE
app.use(async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      await replaceInFile({
        files: path.join(__dirname, 'app.js'),
        from: 'http://localhost:3001',
        to: 'https://earthquake-data-be.herokuapp.com'
      })
    }
    next()
  } catch (error) {
    console.error('Replace-in-file error:', error)
  }
})
app.use(morgan('dev'))
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'misc')))
// app.use(express.static(path.join(__dirname, 'js')))

// app.get('/', (req, res) => {
//     const filepath = path.join(__dirname, 'index.html')
//     res.sendFile(filepath)
// })
  
// app.get('/js/orbitControls.js', (req, res) => {
//   const filepath = path.join(__dirname, './js/orbitControls.js')
//   res.sendFile(filepath)
// })
// app.get('/js/three.js', (req, res) => {
//   const filepath = path.join(__dirname, './js/three.js')
//   res.sendFile(filepath)
// })

// app.get('/js/points.json', (req, res) => {
//   const filepath = path.join(__dirname, './js/points.json')
//   res.sendFile(filepath)
// })

// // // app.get('/js/globe.js', (req, res) => {
// // //   const filepath = path.join(__dirname, './js/globe.js')
// // //   res.sendFile(filepath)
// // // })
// app.get('/js/tryAgain.js', (req, res) => {
//   const filepath = path.join(__dirname, './js/tryAgain.js')
//   res.sendFile(filepath)
// })

// app.get('/js/app.js', (req, res) => {
//   const filepath = path.join(__dirname, './js/app.js')
//   res.sendFile(filepath)
// })

// app.get('/style.css', (req, res) => {
//   const filepath = path.join(__dirname, 'style.css')
//   res.type('css').sendFile(filepath)
// })

// app.get('/misc/dots.jpg', (req, res) => {
//   const filepath = path.join(__dirname, 'misc/dots.jpg')
//   res.type('css').sendFile(filepath)
// })

// app.get('/misc/space.jpg', (req, res) => {
//   const filepath = path.join(__dirname, 'misc/space.jpg')
//   res.type('css').sendFile(filepath)
// })

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
    routesReport.print()
    console.log(`Server listening on port ${PORT}`)
})