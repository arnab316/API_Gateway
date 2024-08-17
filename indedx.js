const express = require('express');
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware')
const  rateLimit = require('express-rate-limit')
const axios = require('axios')

const app = express();
const PORT = 3001;


const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	
})
app.use(morgan('combined'));
app.use(limiter)

app.use('/bookingservice', (req, res, next) =>{
   console.log(req.headers['x-access-token']);
   next();
})

//* proxy request to backend server
app.use('/bookingservice', 
   createProxyMiddleware({ target: 'http://localhost:3009/', changeOrigin: true, 
      pathRewrite: {
         '^/bookingservice': '', //! This removes the /bookingservice prefix
     },
   }));
app.get('/home',(req,res)=>{
   return res.json({message:'OK'})
});

app.listen(PORT, ()=>{
     console.log(`server running ${PORT}`);
});
