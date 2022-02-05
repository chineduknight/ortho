/* eslint-disable no-console */
import 'colors';
import express from 'express'
import dotenv from "dotenv"
import morgan from 'morgan'
import helmet from 'helmet';
import { register, login, getUser, postQuestion } from './controller';
import cors from 'cors';



dotenv.config()
const app = express();


app.use(cors());
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Set static folder
app.use(express.static('public'));

app.get("/", (req, res) => res.send("Express  Server"));

app.post("/users/auth/register/", register)
app.post("/users/auth/login/", login)
app.get("/users/", getUser)
app.post("/question/", postQuestion)

app.all("*", (req, res) => res.status(404).json({ data: "Route not found" }));




const PORT = process.env.PORT || 3434;
app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
