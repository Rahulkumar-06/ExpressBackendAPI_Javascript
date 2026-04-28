import express from "express";
import {EmployeeValidationScema} from "./utilits/employeeValidation.js";
import { validationResult, matchedData, checkSchema } from "express-validator";
import cookieParser from "cookie-parser";

const app = express();

const PORT = 3000;
const db = [{id:1 , name : "Rahul" , role : "Server Techniction"}, // This is a Duplicate DB For This API Project 
            {id:2 , name : "Kumar" , role : "Server Techniction"},
            {id:3 , name : "Kamalesh", role : "Python Developer"},
            {id:4 , name : "Rohith", role : "Ui Ux Designer"},
            {id:5 , name : "Surendher", role : "Acountent"},
            {id:6 , name : "Shiva", role : "Data Enginear"},
            {id:7 , name : "Abi",  role : "System Admin"},
            {id:8 , name : "Suryea", role : "Angular Devloper"}
];


app.use(express.json());            //MidleWere This Execute Json to JavaScript Object in Request.Body
app.use(cookieParser());

const findIsId = (req,res,next)=>{   // This is my Manual MidleWere For Validation if Not A Number in Params in Request
    const id = parseInt(req.params.id);
    if(Number.isNaN(id)){
           return res.status(400).send("Not a Number");
        }
        req.id=id;
    next();
}

app.get("/",(req,res)=>{         // Just Greeting method and this is Get method 
        res.cookie("role","admin", {maxAge:6000 * 60});
        res.send({msg:"Welcome to our Web Server..."});
});

app.get("/employees",(req,res)=>{              // This is also Get Method Due to search

    if(req.cookies.role && req.cookies.role === "admin"){

    const {name,value} = req.query;
    if(name && value){
         if (!db[0].hasOwnProperty(name)) {
            return res.status(400).json({ error: "Invalid field name" });
        }
      const result = db.filter((emp)=>{
           return emp[name]?.toString().toLowerCase().includes(value.toLowerCase());
        });
        return res.status(200).json(result);
    }
        res.status(200).json(db);
    }else{
        res.status(401).send("Your not a Admin only Admin access this datam");
    }
});

app.get("/employee/:id",findIsId,(req,res)=>{         //This is Get Method But Include With Request Params like 
    const id = req.id;                                //AccessById in To The Duplicate DB 
    const data = db.find((data)=>{
       return data.id === id;
    });
    if(data){
        res.send(data);
    }else{
        res.status(404).send("Data is not Found");
    }

});
app.post("/addemp",checkSchema(EmployeeValidationScema),(req,res)=>{ 
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({err:result.array()});
    }                                        //This is the Post Method For Create the Employee in to the Duplicate DB and 
    const data = matchedData(req);           //Obviously This is Not Saved where we Off the server means it lost the memory.
      const newemp = {                       //only in runtime is saves. i just try to build the API in Express
        id: db.length + 1,
        ...data
    };                 
    db.push(newemp); 
    res.status(201).json(newemp);             

});


app.put("/update/:id",findIsId,(req,res)=>{          //This is Put method like Update Opration Already we have this data in our Db
        const id = req.id;                           //if we need to change or overWrite in this method
        const {name,role} = req.body; 
        const emp = db.find((e)=>{
           return e.id === id;
        });
        if(!emp){
            return res.status(404).send("Employe is not Found");
        }
        emp.name = name || emp.name;
        emp.role = role || emp.role;

        res.json(emp);

});
app.patch("/patch/:id",findIsId,(req,res)=>{
    const id = req.id;
    const data = req.body;
    if(!data){
        return res.status(404).send("Data is not Send to our Server");
    }
    const index = db.findIndex(e=> e.id === id);
    if(index === -1){
        return res.status(404).send("Employee is not found");
    }
    db[index] = {...db[index],...data};
    res.status(202).send("Patched");
});

app.delete("/emp/delete/:id",findIsId,(req,res)=>{   //Delete Opration
        const id = req.id;
        const index = db.findIndex(e=>e.id === id);
        if(index === -1){
            return res.status(404).send("Employee is not Found");
        }
        db.splice(index,1);
        res.send("Employee Deleted Sucessfully...")

});


app.listen(PORT,()=>{                   //This is a Server Configuration like to set the port number is 3000 
    console.log(`The Server is Started in ${PORT}`);
});