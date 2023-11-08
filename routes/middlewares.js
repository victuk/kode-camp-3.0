require("dotenv").config();
const jwt = require("jsonwebtoken");

function isUserLoggedIn(req, res, next) {
    const authorizationHeader = req.headers.authorization;
  
    if(!authorizationHeader) {
      res.status(401).send("no-authorization-header");
      return;
    }
  
    const val = authorizationHeader.split(" ");
  
    const tokenType = val[0];
  
    const tokenValue = val[1];
  
    if(tokenType == "Bearer") {
      const decoded = jwt.verify(tokenValue, process.env.secret);
      req.decoded = decoded;
      next();
      return;
    }
  
    res.status(401).send("not-authorized");
  
  }

  function adminsOnly(req, res, next) {
    if(req.decoded.role == "admin") {
      next();
    } else {
      res.status(401).send("You are not an admin");
    }
  }


function ioAuthController(token) {
  const [tokenType, jwtKey] = token.split(" ");

  if(tokenType == "Bearer") {
    const userDetails = jwt.verify(jwtKey, process.env.secret);

    return {
      error: null,
      user: userDetails
    }
  } else {
    return {
      error: {
        message: "No valid token"
      },
      user: null
    }
  }

  

}

module.exports = {isUserLoggedIn, adminsOnly, ioAuthController}