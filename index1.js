const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const users =[
    {username: "mohamad", password: "123456"},
    {username: "ali", password: "147258"}
]
const user = {
    username: "mohamad",
    password: "123456"
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

try {
    mongoose.connect("mongodb+srv://bubbles:newpass13@cluster0.iczof.mongodb.net/MoviesDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}, function(){
        console.log("Connected to Movies Database")
    }) 
} catch (error) {
    console.log(error.message)
}

const schema = mongoose.Schema({
    title: {
        type: String
    },
    year: {
        type: Number,
        min: 1000,
        max: 9999
    },
    rating: {
        type:Number,
        default: 4
    }
})

const Movies = mongoose.model("movies", schema)

app.post('/movies/add', async function(req, res) {
    if(auth(users, user.username, user.password)){
    var name = req.query.title
    var year = req.query.year
    var len = year.toString().length
    if(name == "" || year == "" || len !=4 || isNaN(year)){res.status(403).send('you cannot create a movie without providing a title and a year')}
    else{
        if(req.query.rating == "" || typeof req.query.rating === "undefined"){
            movie=new Movies({title: req.query.title, year: req.query.year, rating: 4})}
        else{
            movie=new Movies({title: req.query.title, year: req.query.year, rating: req.query.rating})
        }
    }
    const addedMovie = await movie.save()
    res.status(200).send(addedMovie)
}
else{
    res.status(402).send("Access Denied")
}
});

app.get('/movies/get', async function(req, res) {
    console.log("response started")
    try {
        const retrievedMovies = await Movies.find()
        console.log("response finished")
        res.status(200).send(retrievedMovies) 
    } catch (error) {
        console.log(error.message)
        res.status(402).send(error.message)
    }


});

app.put("/movies/update/:id", async function (req, res) {
    if(auth(users, user.username, user.password)){
    const updatedMovie = await Movies.updateOne(
        { _id: req.params.id },
        {$set:{ title: req.query.title,
            year: req.query.year,
           rating: req.query.rating }}

    )
    res.status(200).send(updatedMovie);
}
else{
    res.status(402).send("Access Denied")
}     
  });

  app.delete('/movies/delete/:id', async function(req, res) {
    if(auth(users, user.username, user.password)){
    const deletedMovie = await Movies.remove({_id: req.params.id})
    console.log(deletedMovie)
    res.send(deletedMovie)
}
else{
    res.status(402).send("Access Denied")
}
}); 

app.post("/users/add", function (req, res) {
    if (req.query.username == "" || typeof req.query.username === "undefined" || req.query.password == "" || typeof req.query.password === "undefined" || req.query.password.length != 6){
      res.status(403).send("you cannot create a user without providing a username and a password");
    } 
    else{
        createduser = {
        username: req.query.username,
        password: req.query.password
    };
        users.push(createduser);
        res.send(users);
    }
  });

  app.get("/users/get", function (req, res) {
    res.status(200).send(users);
  });

  app.put("/users/update/:id", function (req, res) {
    if (req.params.id <= 0 || req.params.id > users.length) {
      res.status(404).send("the user " + req.params.id + " does not exist");
    } 
    else if ((req.query.username == "" || typeof req.query.username === "undefined") && (req.query.password == "" || typeof rquery.password === "undefined")){
      res.status(404).send("you must provide a new username or password");
    } 
    else if (req.query.username == "" || typeof req.query.username === "undefined") {
      users[req.params.id - 1] = {
        username: users[req.params.id - 1].username,
        password: req.query.password,
    };
    }
    else if (req.query.password == "" || typeof req.query.password === "undefined") {
      users[req.params.id - 1] = {
        username: req.query.username,
        password: users[req.params.id - 1].password
    };
    } 
    else {
      users[req.params.id - 1] = {
        username: req.query.username,
        password: req.query.password
      }
    }
    res.status(200).send(users);
  });

  app.delete("/users/delete/:id", function (req, res) {
    if (req.params.id <= 0 || req.params.id > users.length){
      res.status(404).send("the user " + req.params.id + " does not exist");
    } 
    else {
      users.splice(req.params.id - 1, 1);
      res.status(200).send(users);
    }
  });
  const auth = (users, username, password) => {
    let auth = false
    users.forEach(user =>{
        if(user.username == username && user.password == password){
            auth = true
            return
        }
    })
    return auth
}



