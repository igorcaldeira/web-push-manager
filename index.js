const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))
const dummyDb = { subscription: [] } //dummy in memory store
const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  console.log('- saveToDatabase')
  dummyDb.subscription.push(subscription)
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body
  await saveToDatabase(subscription) //Method to save the subscription to Database
  console.log("- saveSubscription")
  res.json({ message: 'success' })
})
const vapidKeys = {
  publicKey:
    'BOVEFXQekZWIeWIbOKpEGhZzIu3wMLcMAzebU-8FVkDWwTqKnqBynS_-qC_D8lXnk8Qk3c8GbUodi7rDZx6C6D0',
  privateKey: 'TaMNAaqyCLanhGfZcbKzG8wijOdPrZtUFbnyBYiZ1xM',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:igorcaldeira@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

//function to send the notification to the subscribed device
const sendNotification = (s, dataToSend) => {
  dummyDb.subscription.forEach(sub => webpush.sendNotification(sub, dataToSend))
}

//route to test send notification
app.get('/send-notification', (req, res) => {
  console.log('- vapidKeys : "', vapidKeys, '";')
  const subscription = dummyDb.subscription //get subscription from your databse here.
  const message = 'Atenção!'
  sendNotification(subscription, message)
  res.json({ message: 'Ocorreu um alerta de queda do usuário!' })
})

//route to test send notification
app.get('/reset-keys', (req, res) => {
  dummyDb = { subscription: [] }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))