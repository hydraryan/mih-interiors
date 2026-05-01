require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

const commercialPhotos = [
  "/commercial-sites-photos/4.jpeg",
  "/commercial-sites-photos/1.jpeg",
  "/commercial-sites-photos/2.jpeg",
  "/commercial-sites-photos/3.jpeg"
];

const residentialPhotos = [
  "/residential-sites-photos/16.jpeg",
  "/residential-sites-photos/17.jpeg",
  "/residential-sites-photos/18.jpeg",
  "/residential-sites-photos/1.jpeg",
  "/residential-sites-photos/3.jpeg",
  "/residential-sites-photos/4.jpeg",
  "/residential-sites-photos/5.jpeg",
  "/residential-sites-photos/6.jpeg",
  "/residential-sites-photos/7.jpeg",
  "/residential-sites-photos/8.jpeg",
  "/residential-sites-photos/9.jpeg",
  "/residential-sites-photos/10.jpeg",
  "/residential-sites-photos/11.jpeg",
  "/residential-sites-photos/12.jpeg",
  "/residential-sites-photos/13.jpeg",
  "/residential-sites-photos/14.jpeg",
  "/residential-sites-photos/15.jpeg"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Service = mongoose.model('Service', new mongoose.Schema({}, {strict: false}), 'services');
  const Project = mongoose.model('Project', new mongoose.Schema({}, {strict: false}), 'projects');
  
  // Update Projects
  const projects = await Project.find({});
  for (const proj of projects) {
    let changed = false;
    
    const isCommercial = proj.category && proj.category.toLowerCase().includes('commercial');
    const photoList = isCommercial ? commercialPhotos : residentialPhotos;
    
    // Check mainImage
    if (proj.mainImage && (proj.mainImage.includes('unsplash') || proj.mainImage.includes('civil-engineering') || proj.mainImage.includes('http') || proj.mainImage.includes('placeholder'))) {
      proj.mainImage = getRandom(photoList);
      changed = true;
    }
    
    // Check gallery
    if (proj.gallery && Array.isArray(proj.gallery)) {
      for (let i = 0; i < proj.gallery.length; i++) {
        if (proj.gallery[i].url && (proj.gallery[i].url.includes('unsplash') || proj.gallery[i].url.includes('civil-engineering') || proj.gallery[i].url.includes('http') || proj.gallery[i].url.includes('placeholder'))) {
          proj.gallery[i].url = getRandom(photoList);
          changed = true;
        }
      }
    }
    
    if (changed) {
      await Project.updateOne({_id: proj._id}, {$set: {mainImage: proj.mainImage, gallery: proj.gallery}});
    }
  }

  // Update Services
  const services = await Service.find({});
  for (const svc of services) {
    let changed = false;
    
    const isCommercial = svc.category && svc.category.toLowerCase().includes('commercial');
    const photoList = isCommercial ? commercialPhotos : residentialPhotos;
    
    if (svc.hero && svc.hero.image && (svc.hero.image.includes('unsplash') || svc.hero.image.includes('civil-engineering') || svc.hero.image.includes('http') || svc.hero.image.includes('placeholder'))) {
      svc.hero.image = getRandom(photoList);
      changed = true;
    }
    
    if (svc.sections && Array.isArray(svc.sections)) {
      for (let i = 0; i < svc.sections.length; i++) {
        if (svc.sections[i].content && svc.sections[i].content.image && (svc.sections[i].content.image.includes('unsplash') || svc.sections[i].content.image.includes('civil-engineering') || svc.sections[i].content.image.includes('http') || svc.sections[i].content.image.includes('placeholder'))) {
          svc.sections[i].content.image = getRandom(photoList);
          changed = true;
        }
      }
    }
    
    if (changed) {
      await Service.updateOne({_id: svc._id}, {$set: {hero: svc.hero, sections: svc.sections}});
    }
  }
  
  console.log("Database updated with real photos.");
  process.exit(0);
}
run();
