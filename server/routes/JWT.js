const jwt = require('jsonwebtoken')

const createTokens = (user) => {
    const accessToken = jwt.sign({id:user.id}, "jwtSecret", {
        expiresIn: 500000,   //500000
    });

    return accessToken;
}

const getIdFromToken = async (tokenFromStorage) => {
    const token = tokenFromStorage;
    try {
        const decoded = await jwt.verify(token, "jwtSecret");
        return decoded.id;
    } catch (err) {
        console.log("Couldn't authenticate token!");
        return null;
    }
}


module.exports = {createTokens,getIdFromToken};