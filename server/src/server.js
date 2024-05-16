const { exec } = require('child_process')
const app = require("./app");
const { connectDB } = require("./config/db");
const { PORT } = require("./secret");

// connect(MongoURI, ()=> console.log("Database Connected successfully..."))

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await connectDB();
});

/* This exec() runs terminal command. We're opening this api url with google chrome below */
// exec(`google-chrome --no-sandbox http://localhost:${PORT}`)
