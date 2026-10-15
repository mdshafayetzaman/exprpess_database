import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const app = express()
const port = 5001

app.use(cors())
app.use(express.json())

const uri = `mongodb://${process.env.DB_USERS}:${process.env.DB_PASS}@ac-djrpurl-shard-00-00.7xnwnzw.mongodb.net:27017,ac-djrpurl-shard-00-01.7xnwnzw.mongodb.net:27017,ac-djrpurl-shard-00-02.7xnwnzw.mongodb.net:27017/?ssl=true&replicaSet=atlas-viv4el-shard-0&authSource=admin`

const client = new MongoClient(uri)

let usersCollection

async function connectToMongoDB() {
  await client.connect()

  const database = client.db('simple_database')
  usersCollection = database.collection('users')

  console.log('You successfully connected to MongoDB!')
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', async (req, res) => {
  try {
    const allValues = await usersCollection.find({}).toArray()
    res.json(allValues)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

async function startServer() {
  try {
    await connectToMongoDB()

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

startServer()
 