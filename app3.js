const express = require("express");
const mongoose=require("mongoose")

let users = require("./MOCK_DATA.json");


const connect=() =>{
    return mongoose.connect("mongodb://127.0.0.1:27017/test");
};

const userSchema=new mongoose.Schema({
    first_name:{type: String,required:true},
    last_name:{type:String,required:false},
    email:{type:String,required:true,unique:true},
    gender:{type:String,required:false,default:"Male"},
    age:{type:Number,required:true},
});

const User=mongoose.model("user",userSchema);


const app = express();
app.use(express.json());


app.post("/users", async(req,res)=>{
    try{
    const user=await User.create(req.body);
    res.status(201).send(user);
    }catch(e){
        res.status(500).json({status:e.message});
    }
});

app.get("/users", async(req,res)=>{
    const users=await User.find({email:"a@a.com"}).lean().exec();
    res.send({users});
});
app.get("/users/:id", async(req,res)=>{
    try{
    const user=await User.findById(req.params.id);
    res.send({user});
    }
    catch(e){
        res.status(500).json({status:e.message});
    }

});
app.patch("/users/:id",async(req,res)=>{
        try{
            const user=await User.findByIdAndUpdate(req.params.id, req.body,{
                new:true,
            })
            .lean().exec();
            return res.status(201).send(user);
        }catch(e){
            return res.status(500).json({message:e.message,status:"failed"});
        }
    });
   
app.delete("/users/:id",async(req,res)=>{
    try{
    const user=await User.findOneAndDelete(req.params.id).lean().exec();

    res.status(200).send(user);
    
    }

catch(e){
    return res.status(500).json({message:e.message,status:"failed"});
}
});

app.listen(245,async function(){
    await connect();
    console.log("listening on port 245");
});
