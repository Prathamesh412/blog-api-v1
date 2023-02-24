const express = require("express");
const env = require('dotenv');
const globalErrHandler = require("./middlewares/globalErrHandler.middleware");

// Router imports
const userRouter = require("./routes/users.routes");
const categoryRouter = require("./routes/category.routes");
const commentsRouter = require("./routes/comments.routes");
const postRouter = require("./routes/posts.routes");

// Take env file, connect it to the database
env.config();
require("./config/dbConnect")


//Start the express app
const app = express();

//--------------------Middlewares---------------//
//pass incoming payload

app.use(express.json())

//--------------------routes-------------------//

// User Routes
app.use('/api/v1/users/',userRouter);

// Posts Routes
app.use('/api/v1/posts/',postRouter);

//Category Route
app.use('/api/v1/categories/',categoryRouter);

//Comment Route
app.use('/api/v1/comments/',commentsRouter);


//-----------------Error Handling-----------------//
app.use(globalErrHandler)

//404 error
app.use("*", (req, res) => {
    console.log(req.originalUrl);
    res.status(404).json({
        message: `${req.originalUrl} - Route Not Found`,
    });
});


// Application liatening to Serve
const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server is running on Port ${PORT}`))
