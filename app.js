if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const mongo_url = process.env.ATLASDB_URL;
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const multer = require("multer");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const expressError = require("./utils/expressError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");
const isOwner = require("./middleware.js");
main()
  .then(() => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.error(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const store = mongoStore.create({
  mongoUrl : mongo_url,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter: 24*3600,
})
store.on("error", ()=>{
  console.log("Eroor in mongo session store");
})
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/user", userRouter);

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("listening on 8080 port");
});
