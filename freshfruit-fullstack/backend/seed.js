require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const sampleProducts = [
  { name: "Red Apples", description: "Crisp, sweet and fresh red apples.", price: 140, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80", category: "Fresh Fruits", stock: 40 },
  { name: "Bananas", description: "Naturally sweet bananas, perfect for every day.", price: 60, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80", category: "Fresh Fruits", stock: 60 },
  { name: "Oranges", description: "Juicy oranges packed with refreshing flavour.", price: 90, image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=80", category: "Citrus", stock: 35 },
  { name: "Strawberries", description: "Bright, juicy strawberries with a sweet taste.", price: 180, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=80", category: "Berries", stock: 20 },
  { name: "Green Grapes", description: "Fresh seedless grapes, sweet and crunchy.", price: 110, image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=80", category: "Fresh Fruits", stock: 25 },
  { name: "Mangoes", description: "Golden mangoes with a rich tropical flavour.", price: 160, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80", category: "Tropical", stock: 30 },
  { name: "Pineapple", description: "A tangy-sweet tropical fruit for a sunny day.", price: 85, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=80", category: "Tropical", stock: 18 },
  { name: "Watermelon", description: "Refreshing watermelon with plenty of juicy goodness.", price: 45, image: "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=700&q=80", category: "Melons", stock: 15 },
  { name: "Papaya", description: "Ripe papaya with a naturally sweet flavour.", price: 70, image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=700&q=80", category: "Tropical", stock: 22 },
  { name: "Pomegranate", description: "Juicy pomegranate seeds bursting with flavour.", price: 150, image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&w=700&q=80", category: "Fresh Fruits", stock: 24 },
  { name: "Kiwi", description: "Sweet and tangy green kiwi fruit.", price: 200, image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=700&q=80", category: "Fresh Fruits", stock: 18 },
  { name: "Green Pears", description: "Tender, juicy pears with a delicate sweetness.", price: 130, image: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=700&q=80", category: "Fresh Fruits", stock: 20 },
  { name: "Guava", description: "Fresh guava with a fragrant tropical taste.", price: 80, image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=700&q=80", category: "Tropical", stock: 26 },
  { name: "Blueberries", description: "Small, sweet blueberries for a tasty snack.", price: 220, image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=700&q=80", category: "Berries", stock: 12 },
  { name: "Dragon Fruit", description: "Colourful dragon fruit with a mild, refreshing taste.", price: 190, image: "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=700&q=80", category: "Tropical", stock: 10 }
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/freshfruit"
    );

    let added = 0;
    let alreadyExists = 0;

    // Add only missing fruits. Existing products, prices and stock are preserved.
    for (const fruit of sampleProducts) {
      const result = await Product.updateOne(
        { name: fruit.name },
        { $setOnInsert: fruit },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        added += 1;
        console.log(`Added: ${fruit.name}`);
      } else {
        alreadyExists += 1;
      }
    }

    console.log(`\nSeed completed: ${added} new fruits added; ${alreadyExists} already existed.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
