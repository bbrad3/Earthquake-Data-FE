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

// app.get('/', (req, res) => {
//     const filepath = path.join(__dirname, 'index.html')
//     res.sendFile(filepath)
// })

app.get('/app.js', (req, res) => {
  const filepath = path.join(__dirname, './app.js')
  res.sendFile(filepath)
})

// app.get('/style.css', (req, res) => {
//   const filepath = path.join(__dirname, 'style.css')
//   res.type('css').sendFile(filepath)
// })

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
    routesReport.print()
    console.log(`Server listening on port ${PORT}`)
})