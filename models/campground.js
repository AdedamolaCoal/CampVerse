const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// virtual for the map cluster
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

// DELETE MIDDLEWARE THAT DELETES ALL THE REVIEW TIED WITH A FARM WHEN A FARM IS DELETED
CampgroundSchema.post("findOneAndDelete", async function (camp) {
  // if (camp.reviews.length) {
  // const res = await review.deleteMany({ _id: { $in: camp.reviews } }); // delete all reviews that have an id that is in the camp.reviews array
  // console.log(res);
  // }

  // OR
  if (camp) {
    await review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
  }
  console.log(camp);
});

module.exports = mongoose.model("Campground", CampgroundSchema);
