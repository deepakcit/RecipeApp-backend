const router = require("express").Router();
const Usermodel = require("../model/register");
const dotenv = require("dotenv").config();
const Recmodel = require("../model/recipe");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = process.env.SECRET_KEY;

const verifyuser = async(req,res,next)=>{
    try {
        const token = req.headers["authorization"];
        if(!token){
            return res.json({
                status:"session expire"
            })
        }
        const user = jwt.verify(token,secret);
        if(user){
            next();
        }

    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
}

router.post("/signup", async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({
            status:"Enter all details"
        })
    }
    try {
        const userexist = await Usermodel.findOne({email:email});
        if(userexist){
            return res.json({
                status:"User already exist"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);
        const user = await Usermodel.create({
            email:email,
            password:hash
        })
        res.json({
            status:"successfull",
            user
        })

    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})

router.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({
            status:"Enter all details"
        })
    }
    try {
        const user = await Usermodel.findOne({email:email});
        const pass = await bcrypt.compare(password,user.password);
        if(pass == true){
            const token = jwt.sign({user},secret);
            res.json({
                status:"successfull",
                user:user.email,
                token,
                pass
            })
        }
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})

router.get("/recipes/:email", verifyuser, async(req,res)=>{
    const {email} = req.params;
    if(!email){
        return res.json({
            status:"invalid request"
        })
    }
    try {
        const recipes = await Recmodel.find({email:email})
        if(recipes.length !=0){
            res.json({
                status:"successfull",
                recipes
            })
        } else{
            res.json({
                status:"You dont have any recipes please add some.."
            })
        }
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})

router.post("/addrecipe", verifyuser, async (req,res)=>{
    const {email,username,recipename,ingredients,instructions,image} = req.body;
    if(!email || !username || !recipename || !ingredients || !instructions || !image){
        return res.json({
            status:"Enter all details"            
        })
    }
    try {
        const newrecipe = await Recmodel.create({
            email:email,
            username:username,
            recipename:recipename,
            ingredients:ingredients,
            instructions:instructions,
            image:image
        })
        res.json({
            status:"successfull",
            newrecipe
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})

router.get("/search/:recipename", verifyuser, async(req,res)=>{
    const {recipename} = req.params
    if(!recipename){
        return res.json({
            status:"Enter recipe name to search"
        })
    }
    try {
        const recipe = await Recmodel.findOne({recipename:recipename});
        if(recipe){
            res.json({
                status:"successfull",
                recipe
            })
        } else {
            res.json({
                status:"No recipe found"
            })
        }
        
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})







module.exports = router;