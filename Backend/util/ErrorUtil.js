const CatchError = (error, res) => {
    console.error(error.message);
    return res.status(500).send("Server error");
}

module.exports = {
    CatchError: CatchError
}