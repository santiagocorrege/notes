const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json()) //To have request body
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan((function (tokens, req, res) {
    
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.type(req, res)
    ].join(' ')
  }),'combined'))

let notes = [
    {
        id: 1,    
        content: "HTML is easy",    
        important: true  
    },  
    {    
        id: 2,    
        content: "Browser can execute only JavaScript",    
        important: false  
    },  
    {    
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        important: true  
    }  
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    console.log(request.headers);
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
  })

  app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter( e => e.id !== id)
    console.log(id);
    res.status(204).end()
  })

  const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1;
  }


  app.post('/api/notes', (req, res) => {
    const body = req.body
    console.log(body);
    if(!body.content){
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)

    res.json(note)
  })



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} Back-Ejercise1`)
})

// With node
// const http = require('http')

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
//   })
  
//   const PORT = 3001
//   app.listen(PORT)
//   console.log(`Server running on port ${PORT}`)