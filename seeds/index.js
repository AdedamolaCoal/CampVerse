const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelpcamp");

const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "connection error:"));
conn.once("open", () => {
  console.log("Database Connected...");
}); // for a once time connection to the database because of 'conn.once' and not 'conn.on'.

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({}); // deletes previous db data
  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      // author = user id
      author: "6640450b81b5a1321f45e5eb",
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
          url: "https://res.cloudinary.com/dhv3cnr1o/image/upload/v1719097334/YelpCamp/bknunimwuzzvgcamppbo.avif",
          filename: "YelpCamp/bknunimwuzzvgcamppbo",
        },
        {
          url: "https://res.cloudinary.com/dhv3cnr1o/image/upload/v1719097385/YelpCamp/zyvivqsz3zvqrspldi0d.jpg",
          filename: "YelpCamp/zyvivqsz3zvqrspldi0d",
        },
        {
          url: "https://res.cloudinary.com/dhv3cnr1o/image/upload/v1719097334/YelpCamp/n1xil7vefeummj4jqwzr.jpg",
          filename: "YelpCamp/n1xil7vefeummj4jqwzr",
        },
      ],
    }); // creates new data in db based on the above logic
    await camp.save(); // saves the data in the db
  }
};

seedDB().then(() => {
  conn.close(); // closes the connection and takes the stress of forgetting to close the db and having duplicate files.
});
