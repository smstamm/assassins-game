const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.post('/api', (req, res) => {
  const assassinsAndTargets = assignAssassins(req.body)
  Object.keys(assassinsAndTargets).forEach(assignment => {
    // Configure the mailoptions object
    const mailOptions = {
      from: 'me@stephstamm.io',
      to: assassinsAndTargets[assignment].email,
      subject: "Game target",
      text: `Your target is: ${assassinsAndTargets[assignment].target}`
    }

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function assignAssassins(names) {
  // Schwartzian transform to randomize names
  const generateRandomAssassins = () =>
    names
      .map((name) => ({ name: name, sort: Math.random() }))
      .sort((a, b) => {
        return a.name.sort - b.name.sort
      })
      .map(({ name }) => name)

  const generateNonMatchingTargets = () => {
    const assassinsCopy = [...assassins]
    const shiftedName = assassinsCopy.shift()
    assassinsCopy.push(shiftedName)

    return assassinsCopy
  }

  const assassins = generateRandomAssassins()
  const targets = generateNonMatchingTargets()
  
  let assignments = {}

  do {
    assassins.forEach((assassin, index) => {
      assignments = {
        ...assignments,
        [assassin.name]: {
          target: targets[index].name,
          email: assassin.email,
        },
      }

      assassins.splice(index, 1)
      targets.splice(index, 1)
    })
  } while (assassins.length > 0)
  return assignments
}

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'api',
    pass: '04bbe3c34bd4702ec9a9cf9d747b5db8',
  }
})
