const express = require('express')
const app = express()

const routesReport = require('rowdy-logger').begin(app)
const path = require('path')

app.get('/', (req, res) => {
    const filepath = path.join(__dirname, 'index.html')
    res.sendFile(filepath)
  })
  
app.get('/js/orbitControls.js', (req, res) => {
  const filepath = path.join(__dirname, './js/orbitControls.js')
  res.sendFile(filepath)
})
app.get('/js/three.js', (req, res) => {
  const filepath = path.join(__dirname, './js/three.js')
  res.sendFile(filepath)
})

app.get('/js/points.json', (req, res) => {
  const filepath = path.join(__dirname, './js/points.json')
  res.sendFile(filepath)
})

// app.get('/js/globe.js', (req, res) => {
//   const filepath = path.join(__dirname, './js/globe.js')
//   res.sendFile(filepath)
// })
app.get('/js/tryAgain.js', (req, res) => {
  const filepath = path.join(__dirname, './js/tryAgain.js')
  res.sendFile(filepath)
})

app.get('/js/app.js', (req, res) => {
  const filepath = path.join(__dirname, './js/app.js')
  res.sendFile(filepath)
})

app.get('/style.css', (req, res) => {
  const filepath = path.join(__dirname, 'style.css')
  res.type('css').sendFile(filepath)
})

app.get('/misc/dots.jpg', (req, res) => {
  const filepath = path.join(__dirname, 'misc/dots.jpg')
  res.type('css').sendFile(filepath)
})

app.get('/misc/space.jpg', (req, res) => {
  const filepath = path.join(__dirname, 'misc/space.jpg')
  res.type('css').sendFile(filepath)
})

const port = process.env.PORT || 5500
app.listen(port, () => {
    routesReport.print()
})