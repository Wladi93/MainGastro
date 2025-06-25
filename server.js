import express from 'express'
import axios from 'axios'
import cors from 'cors'
const app = express()

const BACKEND_URL = 'https://silly-madeleine-09a6b3.netlify.app/api'

app.use(cors())
app.use(express.json())

app.get('/api/pizzas', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/pizzas`)
    res.json(response.data)
  } catch (error) {
    console.error('Fehler beim Abrufen der Pizzas:', error)
    res.status(500).json({ message: 'Fehler beim Abrufen der Pizzas' })
  }
})

app.get('/api/snacks', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/snacks`)
    res.json(response.data)
  } catch (error) {
    console.error('Fehler beim Abrufen der Snacks:', error)
    res.status(500).json({ message: 'Fehler beim Abrufen der Snacks' })
  }
})

app.get('/api/getraenke', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/getraenke`)
    res.json(response.data)
  } catch (error) {
    console.error('Fehler beim Abrufen der Getränke:', error)
    res.status(500).json({ message: 'Fehler beim Abrufen der Getränke' })
  }
})

app.get('/api/saucen', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/saucen`)
    res.json(response.data)
  } catch (error) {
    console.error('Fehler beim Abrufen der Saucen:', error)
    res.status(500).json({ message: 'Fehler beim Abrufen der Saucen' })
  }
})

app.get('/api/desserts', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/desserts`)
    res.json(response.data)
  } catch (error) {
    console.error('Fehler beim Abrufen der Desserts:', error)
    res.status(500).json({ message: 'Fehler beim Abrufen der Desserts' })
  }
})

app.post('/api/bestellung', async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/bestellung`, req.body)
    res.json(response.data)
  } catch (error) {
    console.error('Fehler beim Senden der Bestellung:', error)
    res.status(500).json({ message: 'Fehler beim Senden der Bestellung' })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
})
