// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const schemeRoutes = require("./routes/schemes");
const eligibilityRoutes = require("./routes/eligibility");
const appRoutes = require("./routes/applications");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/schemes", schemeRoutes);
app.use("/eligibility", eligibilityRoutes);
app.use("/applications", appRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => res.send("✅ GovAssist Backend Running Successfully"));

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
