import { Router } from "express";

const user_routes = Router();

const users = [
    {id:1, name:"Alex"},
    {id:2, name:"Will"},
]

user_routes.route('/')
    .get((req,res) =>{
        res.json(users);
    })
   
user_routes.route('/:id')
    .get((req,res) =>{
        const id = parseInt(req.params.id);
        const user = users.find((el) => el.id === id);
        res.json(user);
    })
    .delete((req,res)=>{})
    .put((req,res)=>{})
    

export default user_routes;
