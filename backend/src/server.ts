import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import compressRoute from './routes/compress'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/compress', compressRoute)

app.get('/', (req, res) => {
  res.send('JusCleaner API Online 🚀')
})

const PORT = process.env.PORT || 3333;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Backend local: http://localhost:${PORT}`)
  })
}

export default app;