const User = require("../model/user.js");

module.exports.rendersignupForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registered = await User.register(newUser, password);
    console.log(registered);
    req.logIn(registered, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User registered successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/user/signup");
  }
};

module.exports.loginrenderForm = (req, res) => {
  res.render("./users/login");
};

module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "User logged out");
    res.redirect("/listings");
  });
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust! You are logged in");
  redirect = res.locals.savedurl || "/listings";
  res.redirect(redirect);
};
