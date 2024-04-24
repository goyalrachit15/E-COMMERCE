const Listing = require("../model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const listing = await Listing.find({});
  res.render("./listings/index.ejs", { listing });
};

module.exports.new = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { list, res });
};

module.exports.create = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query : req.body.listing.location,
    limit : 1,
  })
  .send()
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename}
  newListing.geometry = response.body.features[0].geometry;
  let saved = await newListing.save();
  console.log(saved);
  req.flash("success", "New Listing saved");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl.replace("/upload","/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { listing, originalUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof  req.file!=='undefined'){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename}
  await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("success", "Listing Deleted");
  res.redirect(`/listings`);
};
