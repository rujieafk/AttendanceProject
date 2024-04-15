const config = require('./dbConfig');
const Employee = require('./employee');
const sql = require('mssql');
const xlsx = require('xlsx');


//Insert to the database
const insertEmployee = async (Employee) => {
    try {
        const showdate = new Date();
        const currentTime = showdate.getHours() +' : '+ showdate.getMinutes();
        console.log("Current Time:", currentTime);
        const attendance = "1";
        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('employeeId', Employee.employeeId)
            .input('name', Employee.name)
            .input('eventId', Employee.eventId)
            .input('attendance', attendance)
            .input('time', currentTime) 
            .query(`
                INSERT INTO Employee (employeeId, name, eventId, attendance, time)
                VALUES (@employeeId, @name, @eventId, @attendance, @time)
            `); 
        return employee;
    } catch (error) {
        console.log(error);
    }
}



//Update attendance
const updateEmployee = async (Employee) => {
    try {

        const attendance = "1"; // Assuming attendance is being updated to '1'
        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('employeeId', Employee.employeeId)
            .input('eventId',  Employee.eventId)
            .input('name',  Employee.name)
            .input('attendance', attendance)
            .input('time', Employee.time)
            .query(`
                UPDATE Employee 
                SET attendance = @attendance, time = @time 
                WHERE eventId = @eventId  AND (employeeId = @employeeId OR name = @name)
            `); 
        return employee;
    } catch (error) {
        console.error("Error updating employee attendance:", error);
        throw error;
    }
}


//check id if already existing on the database
// const checker = async (Employee) => {
//     try {
//       let pool = await sql.connect(config);
//       let result = await pool
//         .request()
//         .input('eventId', Employee.eventId)
//         .input('employeeId', Employee.employeeId)
//         .input('name', Employee.name)
//         .query('SELECT COUNT(*) AS count FROM Employee WHERE eventId = @eventId AND employeeId = @employeeId AND name = @name');
  
//       return result.recordset[0].count > 0;
//     } catch (error) {
//       console.error('Error checking ID in database:', error);
//       throw error;
//     }
//   };

//true or false: check if the Id or name already exist in the database
const checker = async (Employee) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input('eventId', Employee.eventId)
        .input('employeeId', Employee.employeeId || null)
        .input('name', Employee.name || null)
        .input('time', Employee.time)
        .query('SELECT COUNT(*) AS count FROM Employee WHERE eventId = @eventId OR (employeeId = @employeeId OR name = @name)');
  
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error checking ID or name in database:', error);
      throw error;
    }
  };

//Retrieve that data from the datebase
const getEventName = async() =>{
    try{
        let pool = await sql.connect(config);
        let eventName = await pool.request().query("SELECT * from Event Where active = 1");
        console.log(eventName.recordset);
        return eventName.recordset; // Return the recordset, not the query result
    }catch(error){
        console.log(error);
        throw error;
    }
}

const getGuestList = async (eventId) => {
    try {
        let pool = await sql.connect(config);
        let guestList = await pool
            .request()
            .input('eventId', eventId)
            .query('SELECT * FROM Employee WHERE eventId = @eventId');
        
        return guestList.recordset; 
        // console.log("Backend: ", guestList.recordset);
    } catch (error) {
        console.error("Error retrieving guest list from database: ", error);
        throw error;
    }
};





module.exports = {
    insertEmployee,
    getEventName,
    updateEmployee,
    checker,
    getGuestList                     
};