/* eslint-disable no-console */
const dialogflow = require('@google-cloud/dialogflow')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// Heroku dynamically sets a port
const PORT = process.env.PORT || 5000

app.use(express.static('build'))

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/version', (req, res) => {
  res.send('1.0.1') // change this string to ensure a new version deployed
})

app.get('/api/dialogflow', function (req, res) {
  res.send('boilerchat')
})

app.post('/api/dialogflow', async function (req, res) {

  const projectId = process.env.P_ID
  const sessionId = req.body.uuid
  const query = req.body.text
  const languageCode = 'en-US'
  const credentials = {
    client_email: process.env.C_EMAIL,
    private_key: process.env.P_KEY.replace(/\\n/g, '\n'),
  }

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
    credentials,
  })
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId)

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  }

  try {
    // Send request and log result
    const responses = await sessionClient.detectIntent(request)
    console.log('Detected intent')
    const result = responses[0].queryResult
    console.log(`  Query: ${result.queryText}`)
    console.log(`  Response: ${result.fulfillmentText}`)

    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`)
    } else {
      console.log('  No intent matched.')
    }
    res.json(result.fulfillmentText)
  } catch (e) {
    console.error(e)
    res.json('I think dialogflow is down.')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})