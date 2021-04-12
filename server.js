const express = require('express')
const app = express()

const routesReport = require('rowdy-logger').begin(app)
const path = require('path')
const replaceInFile = require('replace-in-file')

app.get('/', (req, res) => {
    const filepath = path.join(__dirname, 'index.html')
    res.sendFile(filepath)
  })
  
  app.get('/app.js', (req, res) => {
    const filepath = path.join(__dirname, 'app.js')
    res.sendFile(filepath)
  })
  
  app.get('/style.css', (req, res) => {
    const filepath = path.join(__dirname, 'style.css')
    res.type('css').sendFile(filepath)
  })

const port = process.env.PORT || 5500
app.listen(port, () => {
    routesReport.print()
})