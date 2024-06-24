const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}; // Index route

module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
}; // New campground route

// ##################################---CREATE ROUTE---#############################################

module.exports.create = async (req, res) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); // req.files is an array of files uploaded thanks to MULTER and we map over it here so we can save the path and filename to the db as url and filename like we've set it in our schema/model.
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Campground Created Successfully.");
  res.redirect(`/campgrounds/${campground._id}`);
};
// ###############################################################################

module.exports.show = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds/allcamps");
  }
  res.render("campgrounds/show", { campground });
}; // Show route

module.exports.edit = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds/allcamps");
  }
  res.render("campgrounds/edit", { campground });
}; // Edit route

module.exports.update = async (req, res) => {
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  campground.geometry = geoData.features[0].geometry;
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (let files of req.body.deleteImages) {
      await cloudinary.uploader.destroy(files);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Campground Updated Successfully.");
  res.redirect(`/campgrounds/${campground._id}`);
}; // Update route

module.exports.delete = async (req, res) => {
  const deleteCamp = await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground Deleted Successfully.");
  res.redirect("/campgrounds/allcamps");
}; // Delete route
