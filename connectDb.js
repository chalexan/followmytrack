const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  };

  const dbPath = 'mongodb+srv://c:Protekt2019@cluster0.qju1t.mongodb.net/followmytrack?retryWrites=true&w=majority';
//const dbPath = process.env.DB_PATH;
const connect = () => {
  mongoose.connect(dbPath, options)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err))
  } 

module.exports = { connect, dbPath };
