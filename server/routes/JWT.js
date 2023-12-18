const jwt = require('jsonwebtoken')

const createTokens = (user) => {
    const accessToken = jwt.sign({id:user.id}, "jwtSecret", {
        expiresIn: 300,
    });

    return accessToken;
}

const getIdFromToken = (tokenFromStorage) => {
    const token = tokenFromStorage;
    
        jwt.verify(token,"jwtSecret", (err,decoded) => {
            if(err)
            {
               console.log("Couldn't authenticate token!")
            }
            else
            {
                const userId = decoded.id;
                console.log(userId);
                return userId;
            }
        });
}


module.exports = {createTokens,getIdFromToken};