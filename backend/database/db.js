const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'db.json');

// Default database structure with rich content
const getDefaultData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Muthengia2040#', salt);
  const ownerPasswordHash = bcrypt.hashSync('Tesh@2026', salt);

  return {
    users: [
      {
        id: "admin-1",
        name: "Tevin Muthengia",
        username: "Kenyan Giant",
        email: "tevinmuthengia@gmail.com",
        password: adminPasswordHash,
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "owner-1",
        name: "Teddy Collins Mwangi",
        username: "Tesh",
        email: "thecommonmass@gmail.com",
        password: ownerPasswordHash,
        role: "admin",
        createdAt: new Date().toISOString()
      }
    ],
    siteContent: {
      hero: {
        title: "The Common Mass Arts (TCM Arts)",
        subtitle: "Cultivating Social Well-being, Balance & Harmony",
        description: "A diverse creative hub designed to enhance brain plasticity, cognitive focus, coordination, and physical poise. Experience the beautiful intersection of Fine Arts, Slalom Skating, and Chess.",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop"
      },
      fineArts: {
        title: "Fine Arts Studio",
        description: "Unleash your creativity and master visual expression. From classical commissions to contemporary classes, explore art in its purest forms.",
        classesIntro: "We offer professional, structured fine arts classes across a wide range of mediums including Pencil & Pen sketching, Oil paints, Acrylics, Watercolors, and Oil Pastels."
      },
      skating: {
        title: "Skating & Slalom Academy",
        description: "Improve your coordination, balance, and neural plasticity through dynamic movement. We specialize in slalom freestyle training, private classes, and active brand activations.",
        servicesIntro: "Whether you want to navigate slalom cones with high precision, join as an annual member, or schedule brand-enhancing skating activations, we provide world-class training.",
        membershipPrice: 15000
      },
      chess: {
        title: "Chess & Mind Sports",
        description: "Sharpen your intellect, enhance strategic thinking, and build focus. Join our chess community for private tutoring and casual or competitive board gaming.",
        tutoringIntro: "From mastering opening theories to endgame strategies, our personalized 1-on-1 tutoring sessions cater to beginners, intermediate players, and advanced competitors.",
        casualPrice: 4000,
        proPrice: 10000
      }
    },
    gallery: [
      {
        id: "art-1",
        title: "Whispers of the Mass",
        description: "A contemporary oil painting depicting the silent connection between urban architecture and human well-being.",
        medium: "Oil on Canvas",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
        price: 35000,
        isSold: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "art-2",
        title: "Geometric Logic",
        description: "A meticulous acrylic painting exploring mathematical symmetries, inspired by the strategies of chess.",
        medium: "Acrylic on Canvas",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
        price: 28000,
        isSold: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "art-3",
        title: "Fluid Kinematics",
        description: "A watercolor and pen illustration capturing the dynamic grace of slalom freestyle skating.",
        medium: "Watercolor & Ink",
        imageUrl: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=800&auto=format&fit=crop",
        price: 19500,
        isSold: false,
        createdAt: new Date().toISOString()
      }
    ],
    classes: [
      {
        id: "class-1",
        category: "fine-arts",
        title: "Mastering Oil Painting",
        description: "Learn color blending, brush techniques, canvas preparation, and texture application.",
        schedule: "Saturdays, 10:00 AM - 12:30 PM",
        price: 4500
      },
      {
        id: "class-2",
        category: "fine-arts",
        title: "Pencil & Pen Portraiture",
        description: "Focus on anatomical accuracy, shading, facial features, and expressions.",
        schedule: "Wednesdays, 5:30 PM - 7:30 PM",
        price: 3000
      },
      {
        id: "class-3",
        category: "skating",
        title: "Slalom Freestyle Basics",
        description: "Master simple maneuvers, cross-overs, and fundamental cone drills.",
        schedule: "Sundays, 3:00 PM - 4:30 PM",
        price: 2500
      },
      {
        id: "class-4",
        category: "skating",
        title: "Elite Slalom & Flow",
        description: "Advanced footwork, wheeling, and seamless combo styling over speed cones.",
        schedule: "Sundays, 4:30 PM - 6:00 PM",
        price: 3500
      },
      {
        id: "class-5",
        category: "chess",
        title: "Strategic Opening & Middle Game",
        description: "Learn standard openings, tactical sequences, pawn structures, and positional advantages.",
        schedule: "Fridays, 6:00 PM - 7:30 PM",
        price: 2000
      }
    ],
    bookings: [],
    commissions: []
  };
};

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial initialization
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(getDefaultData(), null, 2), 'utf-8');
}

const db = {
  read: () => {
    try {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading database. Re-initializing...", err);
      const defaultData = getDefaultData();
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
  },

  write: (data) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error("Error writing to database:", err);
      return false;
    }
  }
};

module.exports = db;
