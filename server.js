const express = require('express');
const cors = require('cors');
const dbOperation = require('./dbFiles/dbOperation');
const Employee = require('./dbFiles/employee');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/getGuestList', async (req, res) => {
  try {
      const { eventId } = req.body;
      // console.log("This eventId: ", eventId);
      const guestList = await dbOperation.getGuestList(eventId);
      res.json(guestList);
      // console.log("Server: ", guestList);
      
  } catch (error) {
      console.error("Error retrieving guest list: ", error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getEventName', async(req, res) =>{
  try {
    const eventName = await dbOperation.getEventName();
    res.json(eventName); // Sending the event name as JSON response
  } catch (error) {
    console.error("Error fetching event name:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/checker', async (req, res) => {
  try {
    const { eventId, employeeId, name } = req.body;
    const exists = await dbOperation.checker({ eventId, employeeId, name });
    res.json({ exists });
  } catch (error) {
    console.error("Error checking employee ID or name:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update', async (req, res) => {
  // Handle registration logic here
  const { eventId, employeeId, name, time } = req.body;
  // Perform necessary operations with the received data
  console.log('Received data:', eventId, employeeId, name, time);

  // Insert to Database
  let newEmp = new Employee(eventId, employeeId, name, time);
    
    try {
      await dbOperation.updateEmployee(newEmp);
      console.log('Employee inserted:', newEmp);
    } catch (error) {
      console.error("Error inserting employee:", error); // Handling error
    }

  res.status(200).json({ message: 'Registration successful' }); // or any other response as needed
});

app.post('/register', async (req, res) => {
  // Handle registration logic here
  const { eventId, employeeId, name, time } = req.body;
  // Perform necessary operations with the received data
  console.log('Received data:', eventId, employeeId, name, time);

  // Insert to Database
  let newEmp = new Employee(eventId, employeeId, name, time);
    
    try {
      await dbOperation.insertEmployee(newEmp);
      console.log('Employee inserted:', newEmp);
    } catch (error) {
      console.error("Error inserting employee:", error); // Handling error
    }

  res.status(200).json({ message: 'Registration successful' }); // or any other response as needed
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
