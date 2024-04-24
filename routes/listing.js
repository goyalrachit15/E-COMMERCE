const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedin } = require("../middleware.js");
const { isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});
const listingController = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isloggedin, upload.single("listing[image]"), validateListing, wrapAsync(listingController.create));

//New route
router.get("/new", isloggedin, listingController.new);

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isloggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isloggedin, isOwner, wrapAsync(listingController.delete));

//Edit route
router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.edit));

module.exports = router;
