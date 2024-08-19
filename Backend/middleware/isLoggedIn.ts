const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ msg: "Not logged in" });
    }
}

export default isLoggedIn;