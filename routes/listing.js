const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postlisting)
  );

router.get(
  "/new",
  isLoggedIn,
  listingController.newlisting
);

router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editlisting)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deletelisting)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.geteditform)
);

module.exports = router;