const express = require("express");
const app = express();
const users=require("./routes/user.js");

app.get("/",(req,res) => {
    res.send("Hi , i am root!");

})

app.use("/users", users);


app.listen(3000, () => {
    console.log("server is listening to 3000");
});
