const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String },
  icon: { type: String },
}, { _id: false });

const collabSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String, default: '' },
}, { _id: false });

const feedItemSchema = new mongoose.Schema({
  title: { type: String },
  thumbnail: { type: String, default: '' },
  tag: { type: String },
}, { _id: false });

const serviceItemSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
}, { _id: false });

const siteContentSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    name: { type: String, default: 'EFO KODJO' },
    subtitle: { type: String, default: 'From the Gari Bowl to Your Timeline.' },
    badgeText: { type: String, default: 'Going Viral' },
    image: { type: String, default: '' },
  },

  // Origin Section
  origin: {
    pullQuote: { type: String, default: 'Started with gari. Now I\'m the brand.' },
    story: {
      type: String,
      default: 'It started with a bowl — gari, sugar, milk, groundnuts. Efo Kodjo wasn\'t trying to build a brand. He was just making the mix everybody wanted. The Efo Kodjo Gari Mix became a street staple, a cultural moment, a vibe you had to taste to understand. From hand-mixed bowls to a name that rings across timelines, this is the origin of something real.',
    },
    image: { type: String, default: '' },
  },

  // Persona / Stats Section
  persona: {
    stats: {
      type: [statSchema],
      default: [
        { label: 'Followers', value: '250K', icon: '↑' },
        { label: 'Videos This Month', value: '47', icon: '📹' },
        { label: 'Celeb Collabs', value: '12', icon: '🤝' },
      ],
    },
    bio: {
      type: String,
      default: 'Efo Kodjo is not your average content creator. Born Eric Kodjo Abiwu in Ghana, he turned a street-side gari mix into a digital empire. He doesn\'t just make content — he makes moments. Brands call him for eyes. Celebrities call him for energy. The internet calls him inevitable. He is the proof that authenticity scales.',
    },
  },

  // Collabs Section
  collabs: {
    sectionTitle: { type: String, default: 'The Company He Keeps' },
    items: {
      type: [collabSchema],
      default: [
        { name: 'Shatta Wale', image: '' },
        { name: 'Sarkodie', image: '' },
        { name: 'Medikal', image: '' },
        { name: 'Stonebwoy', image: '' },
        { name: 'Kwesi Arthur', image: '' },
        { name: 'Hajia Bintu', image: '' },
      ],
    },
  },

  // Content Feed Section
  contentFeed: {
    items: {
      type: [feedItemSchema],
      default: [
        { title: 'Gari Mix Challenge Goes Viral', thumbnail: '', tag: '🔥 Viral' },
        { title: 'Behind the Scenes with Shatta', thumbnail: '', tag: '📢 New' },
        { title: 'Street Food to Stardom', thumbnail: '', tag: '🔥 Viral' },
        { title: 'The Making of the Mix', thumbnail: '', tag: '📢 New' },
        { title: 'Accra Night Market Takeover', thumbnail: '', tag: '🔥 Viral' },
      ],
    },
  },

  // Services Section
  services: {
    headline: { type: String, default: 'Need Eyes on Your Brand?' },
    items: {
      type: [serviceItemSchema],
      default: [
        { title: 'Brand Strategy', description: 'We don\'t guess — we position your brand where the attention already is.' },
        { title: 'Content Creation', description: 'Scroll-stopping content that makes people pause, share, and come back.' },
        { title: 'Influencer Campaigns', description: 'Access to a network that moves culture, not just metrics.' },
      ],
    },
    ctaText: { type: String, default: 'Work With Efo' },
    ctaLink: { type: String, default: 'mailto:hello@efokodjo.com' },
  },

  // Footer / Contact
  contact: {
    email: { type: String, default: 'hello@efokodjo.com' },
    tagline: { type: String, default: 'Originally from the bowl. Now in your algorithm.' },
    socials: {
      tiktok: { type: String, default: '#' },
      instagram: { type: String, default: '#' },
      youtube: { type: String, default: '#' },
      twitter: { type: String, default: '#' },
    },
  },

  // Marquee text
  marqueeText: {
    type: String,
    default: 'EFO KODJO • GARI MIX ORIGINAL • DIGITAL MARKETER • GOING VIRAL •',
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
