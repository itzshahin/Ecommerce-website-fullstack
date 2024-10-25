const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRouter = require("./Routes/productRoutes");
const userRouter = require("./Routes/userRoutes");


const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/product", productRouter);
app.use("/api/user", userRouter);


app.listen(port, () => console.log(`Server connected at ${port}`));


// oplu almp bhdt pbhn