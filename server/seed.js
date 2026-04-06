const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Remove existing and create fresh default
  await SiteContent.deleteMany({});
  const content = await SiteContent.create({});
  console.log('Seeded default content:', content._id);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
