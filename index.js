const express = require("express");
const db = require("./data/db.js");
const server = express();
const port = 4000;

server.use(express.json());
server.listen(port, () =>
    console.log(`\n ** API running on port ${port} **\n`)
);
server.get("/", (req, res) => {
    res.send({ api: "up and running..." });
});

//GET all users
server.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.log("error on GET /api/users", error);
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});

//GET single user by id
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(`error on GET /api/users/${id}`, error);
            res.status(500).json({ error: "The user information could not be retrieved." });
        });
});

//POST to add new user
server.post("/api/users", (req, res) => {
    const userData = req.body;
    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
        db.insert(userData)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(error => {
                console.log("error on POST /users", error);
                res.status(500).json({ error: "There was an error while saving the user to the database." });
            });
    }
});

//DELETE user by id
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(removed => {
            if (removed) {
                res.status(200).json({ message: "user removed successfully", removed });
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(`error on DELETE /api/users/${id}`, error);
            res.status(500).json({ error: "The user could not be removed." });
        });
});

//PUT update user by id
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
        db.update(id, userData)
            .then(userData => {
                if (userData) {
                    res.status(200).json({ message: "user updated successfully", userData });
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." });
                }
            })
            .catch(error => {
                console.log(`error on PUT /api/users/${id}`, error);
                res.status(500).json({ error: "The user information could not be modified." });
            });
    }
})
