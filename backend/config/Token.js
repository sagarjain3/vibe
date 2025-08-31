import jwt from "jsonwebtoken";

const getToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10y" });
        // console.log("JWT_SECRET during SIGN:", process.env.JWT_SECRET);

        return token;
    } catch (error) {
        console.log("Token generation error:", error);
        return null;
    }
};

export default getToken;
