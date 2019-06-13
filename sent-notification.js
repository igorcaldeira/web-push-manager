const axios = require('axios')
var mongoose = require('mongoose')
var dateTime = require('node-datetime')

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!")
});

axios.get('http://localhost:4000/send-notification', {
    message: 'alert'
})
.then((res) => {
console.log(`statusCode: ${res.statusCode}`)
var dt = dateTime.create();
var dateString = dt.format('Y-m-d H:M:S');

var schema = new mongoose.Schema({ date: 'string' });
var AlertNotify = mongoose.model('Alerta', schema);
var alertItem = new AlertNotify({ date: dateString })
    alertItem.save(err => console.log(err))
})
.catch((error) => {
console.error(error)
})
