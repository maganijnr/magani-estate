import express from 'express';
import authRoutes from './routes/authRoutes.js'
const app = express();

//middewares
app.use(express.json());


app.use('/api/auth', authRoutes)


app.use((err, req, res, next) => {
   const statuscode = err.statusCode || 500
   const message = err.message || "Internal server error"

   return res.status(statuscode).json({
      success: false,
      statusCode: statuscode,
      message: message
   })
})

app.listen(4000, () => {
   console.log(`Running on port 4000`)
});