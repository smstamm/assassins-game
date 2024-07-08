import React from 'react'

import Stack from '@mui/material/Stack'

const emailValidation = /^\S+@\S+\.\S+$/

interface FormData {
  name: string
  email: string
}

interface FormErrors {
  notEnoughAssassins: string
  invalidEmail: string
}

function App() {
  const [data, setData] = React.useState<FormData[]>([])
  const [fields, setFields] = React.useState([])
  const [formErrors, setFormErrors] = React.useState<FormErrors[]>([])
  
  const formIsValid = () => {
    const errors = []
    if (data.length < 2) {
      errors.push({ notEnoughAssassins: 'Please enter at least two assassins.' })
    }
    data.forEach(d => {
      if (!d.email.match(emailValidation)) {
        errors.push({ invalidEmail: 'Please check the format of all email addresses.' })
      }
    })
    console.log('errors', errors);
    
    return errors.length === 0
  }
  
  const submitNames = async () => {
    if (!formIsValid()) return
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'client'
        },
        body: JSON.stringify(data)
      }
      const response = await fetch('http://localhost:3001/api', options)
      if (response.ok) {
        console.log('Everything went off without a hitch')
      } else {
        console.error('Oops - something went wrong. Please try re-submitting.')
      }

    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }

  const handleInput = (key, name, value) => {
    setData(prevState => {
      if (prevState.length > 0) {
        prevState.splice(key, 1, {
          ...prevState[key],
          [name]: value
        })
        return prevState
      } else {
        prevState.push({
          [name]: value
        })
        return prevState
      }
    })
  }

  
  const fieldSet = (
    <Stack flexDirection='row' justifyContent='center' gap={12} key={fields.length} sx={{ mb: 12}}>
      <label htmlFor="" style={{ marginLeft: 12 }}>{fields.length + 1}.</label>
      <input onChange={e => handleInput(fields.length, 'name', e.target.value)} name='name' placeholder='name' required={true} type='text' />
      <input onChange={e => handleInput(fields.length, 'email', e.target.value)} name='email' pattern={emailValidation} placeholder='email' required={true} type="email" />
    </Stack>
  )

  return (
    <div className="App">
      <h1>Enter the assassins</h1>
      {fields}
      <button onClick={() => setFields([...fields, fieldSet])} style={{ marginTop: 12 }}>Add assassin +</button>
      <button onClick={submitNames}>Submit</button>
    </div>
  );
}

export default App;
