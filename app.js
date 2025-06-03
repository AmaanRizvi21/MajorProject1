if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressErr = require("./utils/expressErr.js");

//require routes
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
// const user = require("./models/user.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

// const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL; // MongoDB Atlas URL

async function main() {
  // console.log("Connecting to:", dbUrl);

  // await mongoose.connect(Mongo_URL);
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); //css files use krne k liye
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //24 hours
});

store.on("error", (err) => {
  console.log("ERROR in mongo session store", err);
});

// class-55
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
    maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
  },
};

//Root Route
// app.get("/", (req, res) => {
//   res.send("Hello I am root");
// });

app.use(session(sessionOptions)); //session middleware
app.use(flash()); //flash middleware

app.use(passport.initialize()); //passport middleware
app.use(passport.session()); //passport session middleware

passport.use(new LocalStrategy(User.authenticate())); //passport local strategy
passport.serializeUser(User.serializeUser()); //serialize user
passport.deserializeUser(User.deserializeUser()); //deserialize user

//defining middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     username: "demo",
//     email: "demo@gmail.com",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

//using listing routes
app.use("/listings", listingRoutes);

//using review routes
app.use("/listings/:id/reviews", reviewRoutes);

//using user routes
app.use("/", userRoutes);

//all routes k liye
app.use((req, res) => {
  res.status(404).send("404 Page not found");
});

app.use((err, req, res, next) => {
  let { status = 400, message = "Something went Wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
