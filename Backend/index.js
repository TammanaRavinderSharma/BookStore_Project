const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 5000
require('dotenv').config()
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}))
//routes
const bookRoutes = require('./src/books/book.route')
const orderRoutes = require('./src/orders/order.route')
const userRoutes = require('./src/users/user.route')
const adminRoutes = require("./src/stats/admin.stats")
app.use("/api/books",bookRoutes) //“Whenever a request starts with /api/books, send it to bookRoutes to handle.”
app.use("/api/orders",orderRoutes) 
app.use('/api/auth',userRoutes)
app.use('/api/admin',adminRoutes)
//tammana1208

async function main() {
await mongoose.connect(process.env.DB_URL); //Wait until database is connected, then go to next line.
app.get('/', (req, res) => {
res.send('bookserver is running');  
});
}

main().then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});
