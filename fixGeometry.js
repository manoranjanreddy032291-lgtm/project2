const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("./models/listing.js");
require("dotenv").config();

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

async function fixGeometry() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  console.log("Connected to DB");

  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings`);

  for (let listing of listings) {
    try {
      const geoData = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1,
      }).send();

      if (geoData.body.features.length > 0) {
        listing.geometry = geoData.body.features[0].geometry;
        await listing.save();
        console.log(`Fixed: ${listing.title} → ${listing.geometry.coordinates}`);
      }
    } catch (err) {
      console.log(`Failed for ${listing.title}:`, err.message);
    }
  }

  console.log("Done!");
  mongoose.connection.close();
}

fixGeometry();