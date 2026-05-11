const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({
  accessToken: mapToken,
});

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.newlisting = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postlisting = async (req, res) => {

  const geoData = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;

  newListing.geometry = geoData.body.features[0].geometry;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();

  req.flash("success", "New listing created");

  res.redirect(`/listings/${newListing._id}`);
};

module.exports.showlisting = async (req, res) => {

  const { id } = req.params;

  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!list) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { list });
};

module.exports.geteditform = async (req, res) => {

  const { id } = req.params;

  const list = await Listing.findById(id);

  if (!list) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { list });
};

module.exports.editlisting = async (req, res) => {

  const { id } = req.params;

  let updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    {
      runValidators: true,
      new: true,
    }
  );

  if (req.file) {
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await updatedListing.save();
  }

  req.flash("success", "Listing updated");

  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {

  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted");

  res.redirect("/listings");
};