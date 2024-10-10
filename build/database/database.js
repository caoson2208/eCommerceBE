"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
//require chalk module to give colors to console text
const chalk_1 = __importDefault(require("chalk"));
//require database URL from properties file
// const dbURL = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@ecommerce.f2agf.mongodb.net/main?retryWrites=true&w=majority`
const dbURL = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.aiszn.mongodb.net/eCommerce?retryWrites=true&w=majority&appName=Cluster0`;
const connected = chalk_1.default.bold.cyan;
const error = chalk_1.default.bold.yellow;
const disconnected = chalk_1.default.bold.red;
const termination = chalk_1.default.bold.magenta;
const connectMongoDB = () => {
    mongoose_1.default
        .connect(dbURL)
        .then(() => console.log('MongoDB connected successfully'))
        .catch((error) => console.error('MongoDB connection error:', error));
};
exports.connectMongoDB = connectMongoDB;
mongoose_1.default.connection.on('connected', function () {
    console.log(connected('Mongoose default connection is open to MongoDB Atlas'));
});
mongoose_1.default.connection.on('error', function (err) {
    console.log(error('Mongoose default connection has occured ' + err + ' error'));
});
mongoose_1.default.connection.on('disconnected', function () {
    console.log(disconnected('Mongoose default connection is disconnected'));
});
process.on('SIGINT', function () {
    mongoose_1.default.connection.close().then(() => {
        console.log(termination('Mongoose default connection is disconnected due to application termination'));
        process.exit(0);
    });
});
const isValidId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
exports.isValidId = isValidId;
