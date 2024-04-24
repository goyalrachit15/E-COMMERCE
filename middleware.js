const Listing = require("./model/listing");
const Review = require("./model/reviews");
const { listingSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");
const { reviewSchema } = require('./schema.js');


module.exports.isloggedin = (req, res , next) => {
    if (!req.isAuthenticated()) { 
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', "You must be logged in");
        res.redirect("/user/login");
    }
    next();
}

module.exports.savedUrl = (req, res , next) => {
    if(req.session.redirectUrl){
        res.locals.savedurl = req.session.redirectUrl;
    }
    next(); 
};

module.exports.isOwner = async(req, res , next) => {
    let { id } = req.params;
    let list =await Listing.findById(id);

    if(res.locals.user && !list.owner._id.equals(res.locals.user._id)){
        req.flash("error", "You do not have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req, res , next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(res.locals.user && !review.author.equals(res.locals.user._id)){
        req.flash("error", "You do not have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
        let { error } = listingSchema.validate(req.body);
        if (error) {
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new expressError(400, errMsg);
        } else {
          next();
        }
      }
      
module.exports.validateReview = ( req,res,next)=>{
        let {error} =reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new expressError(400,errMsg);
        }else{
            next();
        }
    };