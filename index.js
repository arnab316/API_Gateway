const express = require('express');
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware')
const  rateLimit = require('express-rate-limit')
const axios = require('axios')

const app = express();
const PORT = 3001;


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	
})
app.use(morgan('combined'));
app.use(limiter)

app.use('/bookingservice', async(req, res, next) =>{

   
       try {
         const response = await axios.get('http://localhost:3005/api/v1/isAuthenticated', {
            headers: { 'x-access-token': req.headers['x-access-token'] }
         })    
         if(response.data.success){

            next();
         }else {
            res.status(401).json({message: "invalid token"});
         }
       } catch (error) {
         return res.status(401).json({
            message: "invalid token"
         })
       }
  

   
})

//* proxy request to booking service
app.use('/bookingservice', 
   createProxyMiddleware({ target: 'http://localhost:3009/', changeOrigin: true, 
      pathRewrite: {
         '^/bookingservice': '', //! This removes the /bookingservice prefix
     },
   }));
//* proxy request to auth service
app.use('/authservice',createProxyMiddleware({target:'http://localhost:3005/', changeOrigin: true,
   pathRewrite: {
      '^/authservice': '', 
   },
}))

//* proxy request to flight create service

app.use('/flightbooking',createProxyMiddleware({ target: 'http://localhost:3007',
    changeOrigin: true,
    pathRewrite:{
       '^/flightbooking': '',
    } 
   
   }));



app.get('/home',(req,res)=>{
   return res.json({message:'OK'})
});

app.listen(PORT, ()=>{
     console.log(`server running ${PORT}`);
});
