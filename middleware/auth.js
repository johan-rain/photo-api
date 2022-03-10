 const debug = require('debug')('books:auth');
 const jwt = require('jsonwebtoken');
 
 const validateToken = (req, res, next) => {
     // make sure Authorization header exists, otherwise bail
     if (!req.headers.authorization) {
         debug('Authorization header missing');
 
         return res.status(401).send({
             status: 'fail',
             data: 'Authorization required',
         });
     }
     
     // split Authorization header into "authSchema token"
     const [authSchema, token] = req.headers.authorization.split(' ');
     if (authSchema.toLowerCase() !== 'bearer') {
         return res.status(401).send({
             status: 'fail',
             data: 'Authorization required',
         });
     }
 
     try {
         const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         req.user = payload;

     } catch (error) {
         return res.status(401).send({
             status: 'fail',
             data: 'Authorization required',
         });
     }
     // pass request along
     next();
 };
 
 module.exports = {
     validateToken,
 };