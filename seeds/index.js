const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/campverse");

const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "connection error:"));
conn.once("open", () => {
  console.log("Database Connected...");
}); // for a once time connection to the database because of 'conn.once' and not 'conn.on'.

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({}); // deletes previous db data
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      // author = user id
      author: "66d6855f7efed56e921cb8ff",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "A wonderful journey into natures most beautiful places.",
      price: Math.floor(Math.random() * 20) + 10,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dhv3cnr1o/image/upload/v1719096327/CampVerse/zdoqluienpf8vkqzzfoe.webp",
          filename: "CampVerse/zdoqluienpf8vkqzzfoe",
        },
        {
          url: "https://res.cloudinary.com/dhv3cnr1o/image/upload/v1723925803/CampVerse/wjtsfjir7sxpo91llzeq.jpg",
          filename: "CampVerse/wjtsfjir7sxpo91llzeq",
        },
        {
          url: "https://res.cloudinary.com/dhv3cnr1o/image/upload/v1719097334/CampVerse/bknunimwuzzvgcamppbo.avif",
          filename: "CampVerse/bknunimwuzzvgcamppbo",
        },
      ],
    }); // creates new data in db based on the above logic
    await camp.save(); // saves the data in the db
  }
};

seedDB().then(() => {
  conn.close(); // closes the connection and takes the stress of forgetting to close the db and having duplicate files.
});
