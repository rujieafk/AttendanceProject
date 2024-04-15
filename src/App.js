import { AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    eventId: '',
    employeeId: '',
    name: '',
    time: ''
  });
  const [thisGuestList, setGuestList] = useState('');
  const [thisResultList, setResultList] = useState('');

  const [thisEvent, setEventName] = useState('');
  const [thisTime, setTime] = useState('');
  const [activeInput, setActiveInput] = useState(null);

  useEffect(() => {
    fetchEventName();
    updateCurrentTime();
    
  }, []);

  useEffect(() => {
    // fetchGuestList(); // Run fetchGuestList on every render
  }, [thisGuestList]); // Add thisGuestList as a dependency to rerun the effect

  const fetchEventName = async () => {
    try {
      const response = await fetch('http://localhost:5000/getEventName');
      if (response.ok) {
        const data = await response.json();
        setEventName(data[0]);

        setGuestList(data[0].eventId);
      } else {
        console.error('Failed to fetch event name:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching event name:', error);
    }
  };

  const updateCurrentTime = () => {
    const showdate = new Date();
    let hours = showdate.getHours();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // 12-hour format
    const resultCurrentTime = hours + ' : ' + showdate.getMinutes() + ' ' + amOrPm;

    console.log("Current Time:", resultCurrentTime); 

    setTime(resultCurrentTime);
  };

  // const fetchGuestList = async () => {
  //   try {
  //       const response = await fetch('http://localhost:5000/getGuestList', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ eventId: thisGuestList })
  //       });
  //       if (!response.ok) {
  //           throw new Error('Failed to fetch guest list data');
  //       }
  //       const responseData = await response.json();
  //       console.log(responseData);
  //       setResultList(responseData)
  //   } catch (error) {
  //       console.error('Error:', error.message);
  //   }
  // };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleInputClick = (field) => {
    setActiveInput(field);

    setFormData({
      ...formData,
      employeeId: field === 'employeeId' ? formData.employeeId : '',
      name: field === 'name' ? formData.name : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      formData.eventId = thisEvent.eventId;
      formData.time = thisTime;

      const checkResponse = await fetch('http://localhost:5000/checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: formData.eventId, employeeId: formData.employeeId }),
      });
      
      if (!checkResponse.ok) {
        console.error('Failed to check employee ID:', checkResponse.statusText);
        return;
      }
  
      const checkData = await checkResponse.json();
      if (checkData.exists) {
        const response = await fetch('http://localhost:5000/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          console.log('Registration successful');
          alert('Registration successful');
          setFormData({
            eventId: '',
            employeeId: '',
            name: '',
            time: ''
          });
        } else {
          console.error('Registration failed:', response.statusText);
        }
      } else {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          console.log('Registration successful');
          alert('Registration successful');
          setFormData({
            eventId: '',
            employeeId: '',
            name: '',
            time: ''
          });
        } else {
          console.error('Registration failed:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    window.location.reload();
  };


  return (
    <div className="background">
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div>
            <h2 className="titleNames1">Event </h2>
          </div>
          <div className="container">
            <input
              type="text"
              className="textbox"
              id="eventId"
              value={thisEvent.eventId}
              onChange={handleChange}
              hidden
            />
            <label type="text" className="textbox">{thisEvent.name ? thisEvent.name : 'No Active Event'}</label>
          </div>
          <div>
            <h4 className="titleNames2">Employee ID</h4>
          </div>

          <div className="container">
            <input
              type="text"
              className="textbox"
              id="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              onClick={() => handleInputClick('employeeId')}
              readOnly={activeInput === 'name'}
              style={{ backgroundColor: activeInput === 'name' ? '#808080' : 'white' }}
            />
          </div>
          <div className='center-or' style={{ position: 'relative' }}>
            <span className="line"></span>
            <label style={{ position: 'relative', zIndex: '1' }}>or</label>
            <span className="line"></span>
          </div>
          <div>
            <h4 className="titleNames">Name</h4>
          </div>

          <div className="container">
            <input
              type="text"
              className="textbox"
              id="name"
              value={formData.name}
              onChange={handleChange}
              onClick={() => handleInputClick('name')}
              readOnly={activeInput === 'employeeId'}
              style={{ backgroundColor: activeInput === 'employeeId' ? '#808080' : 'white' }}
            />
          </div>
          <div>
            <label type="text" className="textbox" hidden>Current time: {thisTime}</label>
          </div>
          <div className="container-btn">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="box">
        <div>
          <h2 className="titleNames1">Guest List </h2>
          <div className="guess-border">
          
            {thisResultList && thisResultList.length > 0 ? (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Attendance</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thisResultList.map((employee, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{employee.employeeId}</td>
                        <td>{employee.name}</td>
                        <td>{employee.attendance ? <AiFillCheckCircle/> : <AiFillCloseCircle/>}</td>
                        <td>{employee.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No guests registered yet.</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
