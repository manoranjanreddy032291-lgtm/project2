const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

//  middleware (KEEP THIS ONLY)
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

//  FIXED REGISTER ROUTE
app.get("/register", (req, res) => {
    let name = req.query.name?.trim();

    if (!name) {
        req.session.name = "anonymous";
        req.flash("error", "user not registered");
    } else {
        req.session.name = name;
        req.flash("success", "user registered successfully!");
    }

    res.redirect("/hello");
});

//  FIXED HELLO ROUTE (REMOVED DUPLICATE FLASH)
app.get("/hello", (req, res) => {
    res.render("page.ejs", { 
        name: req.session.name 
    });
});



// app.use(
//     session({
//         secret:"supersecretstring",
//         resave:false,
//         saveUninitialized:true,
//     }));


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//     req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

app.listen(3000,()=>{
    console.log("server is listening to 3000");
});