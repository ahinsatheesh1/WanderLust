//POST


//Index
app.get("/posts", (req,res) =>{
    res.send("GET for Post");
});

//Show
app.get("/posts/:id", (req,res) =>{
    res.send("GET for Post ID");
});

//POST
app.post("/post", (req,res) =>{
    res.send("POST for posts ");
});


//Delete-users
app.delete("/posts/:id", (req,res) =>{
    res.send("Delete Post");
});