const CatchError = (error, res) => {
    console.error(error.message);
    return res.status(500).send("Server error");
}

export default {
    CatchError: CatchError
}