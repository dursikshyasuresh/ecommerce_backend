import cors from "cors";

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4000",
  "https://myfrontend.com",
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman or curl)
    if (!origin) {
      return callback(null, true);
    }

    // Allow only specified origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Block other origins
    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

  // Allow cookies and authentication credentials
  credentials: true,
};

export default cors(corsOptions);