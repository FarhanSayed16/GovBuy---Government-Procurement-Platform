// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { errorHandler } from "./middlewares/error.middleware.js";
// import { ApiError } from "./utils/ApiError.js";

// const app = express();

// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials:true,
// }))
// app.use(express.json({limit:"16kb"})) //to accept json data
// app.use(express.urlencoded({extended:true,limit:"16kb"})) //to accept the data from url
// app.use(express.static("public")); //to server static files
// app.use(cookieParser()); //to handle cookies

// //import routers
// import userRouter from "./routes/user.route.js"
// import orderRouter from "./routes/order.route.js"
// import productRouter from "./routes/product.route.js"
// import tailorRouter from "./routes/tailor.route.js"
// import measurementRouter from "./routes/measurement.route.js";
// import reviewRouter from "./routes/review.route.js"


// //router declaration
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/orders", orderRouter);
// app.use("/api/v1/products", productRouter);
// app.use("/api/v1/tailors", tailorRouter);
// app.use("/api/v1/measurements", measurementRouter);
// app.use("/api/v1/reviews", reviewRouter);


// // Catch 404 and forward to error handler - add this before errorHandler
// app.use("*", (req, _, next) => {
//     next(new ApiError(404, `Route ${req.originalUrl} not found`));
// });

// app.use(errorHandler) //It must be last

// export {app};


// For Production ==================================================================================

// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
// import rateLimit from 'express-rate-limit';
// import { errorHandler } from "./middlewares/error.middleware.js";
// import { ApiError } from "./utils/ApiError.js";

// const app = express();

// // 1. Global Middlewares =======================================================

// // Rate limiting - should be first
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per window
//     message: 'Too many requests from this IP, please try again later',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// app.use(limiter);

// // Secure headers with Helmet
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "'unsafe-inline'"],
//             styleSrc: ["'self'", "'unsafe-inline'"],
//             imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
//             connectSrc: ["'self'"],
//         }
//     }
// }));

// // Enable CORS
// app.use(cors({
//     origin: process.env.CORS_ORIGIN?.split(',') || '*',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));

// // Body parsers
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// // Data sanitization against NoSQL injection
// app.use(mongoSanitize());

// // Data sanitization against XSS
// app.use(xss());

// // Cookie parser
// app.use(cookieParser());

// // Static files
// app.use(express.static("public"));

// // 2. Routes ===================================================================
// import userRouter from "./routes/user.route.js";
// import orderRouter from "./routes/order.route.js";
// import productRouter from "./routes/product.route.js";
// import tailorRouter from "./routes/tailor.route.js";
// import measurementRouter from "./routes/measurement.route.js";
// import reviewRouter from "./routes/review.route.js";

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/orders", orderRouter);
// app.use("/api/v1/products", productRouter);
// app.use("/api/v1/tailors", tailorRouter);
// app.use("/api/v1/measurements", measurementRouter);
// app.use("/api/v1/reviews", reviewRouter);

// // 3. Error Handling ==========================================================
// // Catch 404
// app.use("*", (req, _, next) => {
//     next(new ApiError(404, `Route ${req.originalUrl} not found`));
// });

// // Global error handler
// app.use(errorHandler);

// // 4. Production Security (Optional) ===========================================
// if (process.env.NODE_ENV === 'production') {
//     // Force HTTPS
//     app.use((req, res, next) => {
//         if (req.headers['x-forwarded-proto'] !== 'https') {
//             return res.redirect(`https://${req.headers.host}${req.url}`);
//         }
//         next();
//     });
// }

// export { app };



// For development ==================================================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from 'express-rate-limit';
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

// app.get('/favicon.ico', (req, res) => res.status(204).end()); //to handle favicon error


// 1. Global Middlewares ============================

/// 1. Rate Limiting ===========
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: 'Too many requests from this IP',
    standardHeaders: true,
  });
  
  app.use(limiter);
  
  // 2. Security Headers ==================
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      }
    } : false
  }));
  
  // 3. CORS ============================
  app.use(cors({
    origin: process.env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));


// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Cookie parser
app.use(cookieParser());

// Static files
app.use(express.static("public"));

// 2. Routes ===================================================================
import userRouter from "./routes/user.route.js";
import tenderRouter from "./routes/tender.route.js"
import bidRouter from "./routes/bid.route.js"
import notificationRoutes from "./routes/notification.route.js";
import dashboardRoutes from './routes/dashboard.route.js';
import supplierRoutes from './routes/supplier.route.js';
import documentRouter from './routes/document.route.js'


app.use("/api/v1/users", userRouter);
app.use("/api/v1/tenders",tenderRouter);
app.use("/api/v1/bids",bidRouter);
app.use("/api/v1/notifications", notificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/supplier', supplierRoutes);
app.use("/api/v1/documents", documentRouter);






// 3. Error Handling ==========================================================
// Catch 404
app.use("*", (req, _, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

// 4. Production Security (Optional) ===========================================
if (process.env.NODE_ENV === 'production') {
    // Force HTTPS
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

export { app };

