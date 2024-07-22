const express = require ('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt =require ("bcrypt");
const { sequelizeConnection } = require("./models/index");
const authrouter = require("./Routes/auth");
const user_router = require("./Routes/users");
const calendrierRouter = require("./Routes/calendrierRoute");
const projectRouter = require("./Routes/projectRoute")
const exportRouter =require("./Routes/exportRoute")
const TaskRouter=require("./Routes/taskRoute")
const DayOffRouter=require("./Routes/dayOffRoute")
const notificationRouter= require("./Routes/notificationRoute")
const cookieParser = require('cookie-parser');
const multer = require('multer');
const sendEmail =require('./utils/sendEmail')
const xlsx = require('xlsx');
const path = require('path');
const { models } = require("./models/index");
require('dotenv').config();

sequelizeConnection.sync({ force:false});
const app =express();

app.use(bodyParser.json());
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,};
  
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended:false}));

const db = require('./models');

app.use(express.json());
app.use("/auth", authrouter);
app.use("/user", user_router);
app.use("/calender", calendrierRouter);
app.use("/project", projectRouter );
app.use("/Task",TaskRouter);
app.use('/uploads', express.static('uploads'));
 app.use("/exports",exportRouter)
 app.use("/dayOff",DayOffRouter)
 app.use("/notification",notificationRouter)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads') 
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+ path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });
// Route pour l'importation du fichier
app.post('/user/import', upload.single('file'), async (req, res) => {
  const { userId } = req.body;
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const newUsers = xlsx.utils.sheet_to_json(worksheet)
  
  try {
    for (const newUser of newUsers) {
      newUser.partner_id = userId;
      const existingUser = await models.Users.findOne({ where: { email: newUser.email } });
     if (!existingUser) {
        const newPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        newUser.password = hashedPassword;
        await models.Users.create(newUser);
        const htmlMessage = `<h2>Hello ${newUser.prenom} ${newUser.nom}</h2>
          <p>Welcome To WindTime. This is your email and password to login to our application:</p>
          <p>Email: ${newUser.email}</p>
          <p>Password: ${newPassword}</p>`;
        const subject ="New Compte ";
       const emailResult = await sendEmail(newUser.email, htmlMessage, subject);
        if (emailResult) {
          console.log("Email sent successfully.");
        } else {
          console.log("Failed to send email.");
        }
      } else {
        console.log('Utilisateur déjà existant,ignoré:', newUser);
      }
    }

    console.log('Fichier importé:', req.file);
    console.log('Données de la requête:', req.body);
    
    res.status(200).send('Importation réussie');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    res.status(500).send('Erreur lors de l\'importation');
  }
})


//notification
const { Server } = require("socket.io");
const httpserver =app.listen(3001,() =>{
  console.log("Server running on port 3001");
})
const io = new Server( httpserver ,{
  cors:{
    origin: "*",
  }
})




app.use((err,req,res,next) => {
    const statusCode =err.statusCode || 500;
    const message =err.message || 'Internal Server Error ';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
    ;})

    app.set('io',io)


