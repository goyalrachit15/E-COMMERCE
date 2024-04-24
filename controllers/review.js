const review = require("../model/reviews");
const Listing = require("../model/listing");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(req.params.id);
  let newreview = new review(req.body.review);
  newreview.author = req.user._id;
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("success", "New Review saved");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
