if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbURL = process.env.ATLASDB_URL;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

/* ================= DATABASE CONNECTION ================= */

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

/* ================= SESSION STORE ================= */
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});


// const store = MongoStore.create({
//   mongoUrl: dbURL,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600,
// });

/* ================= SESSION CONFIG ================= */

// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   // app.js  (~line 50)
// cookie: {
//   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // ✅ was: Date.now() + ...
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   httpOnly: true,
// },
// };
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
/* ================= APP CONFIG ================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());

/* ================= PASSPORT CONFIG ================= */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ================= GLOBAL VARIABLES ================= */

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);

/* ================= DEMO USER ================= */

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "just-student",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

/* ================= 404 HANDLER ================= */

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).render("error.ejs", { message });
});


/* ================= SERVER ================= */

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// const dbURL = process.env.ATLASDB_URL;

// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// mongoose.connect(dbURL)
// .then(() => {
// console.log("Connected to DB");
// })
// .catch((err) => {
// console.log(err);
// });

// // app.get("/", (req, res) => {
// // res.send("Hi , I am root");
// // });


// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   crypto: {
//     secret: "mysupersecretcode",
//   },
//   touchAfter: 24 * 3600,
// });

// store.on("error",()=>{
//   console.log("ERROR in MONGO SESSION STORE",err);
// });

// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,

//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };


// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);

// // app.get("/", (req, res) => {
// //   res.send("Hi, I am root");
// // });

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));


// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// app.use((req,res,next)=>{
//   res.locals.success=req.flash("success");
//   res.locals.error=req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });


// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"just-student",
//   });

//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });

// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/users", userRouter);



// // 404 HANDLER
// app.use((req,res,next)=>{
// next(new ExpressError(404,"Page not Found!"));
// });

// // ERROR HANDLING MIDDLEWARE
// app.use((err,req,res,next)=>{
// let {statusCode = 500, message = "Something went wrong"} = err;
// res.status(statusCode).render("error.ejs",{message});
// //res.status(statusCode).send(message);
// });

// app.listen(8080, () => {
// console.log("Server is listening to port 8080");
// });
