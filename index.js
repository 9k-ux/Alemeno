const mysql = require('mysql');
const XLSX = require('xlsx');
const dbConfig =require('./db/config.js');
const customer_schema=require('./db/customer_data.js');
const loan_schema=require('./db/customer_loan.js');


// Create a connection to the MySQL server
const connection = mysql.createConnection(dbConfig);

//function to create database and table

// database_creation_customer("customer_data","customers",customer_schema);
database_creation_loan("loan","customer",loan_schema);


function database_creation_customer(databasename,tablename,schema){
    connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MySQL:', err);
          return;
        }
      
        console.log('Connected to MySQL');
      
        // Create the "customer_data" database if it doesn't exist
        connection.query(`CREATE DATABASE IF NOT EXISTS ${databasename}`, (err) => {
          if (err) {
            console.error('Error creating database:', err);
            connection.end();
            return;
          }
      
          console.log(`Database ${databasename} created or already exists`);
      
          // Switch to the current database
          connection.changeUser({ database: databasename }, (err) => {
            if (err) {
              console.error(`Error switching to ${databasename}  database:`, err);
              connection.end();
              return;
            }
      
            console.log(`Switched to ${databasename} database`);
      
          
      
            connection.query(schema, (err) => {
              if (err) {
                console.error('Error creating table:', err);
              } else {
                console.log(`Table ${tablename} created or already exists`);
              }
      
              // Close the database connection
              connection.end((err) => {
                if (err) {
                  console.error('Error closing MySQL connection:', err);
                } else {
                  console.log('MySQL connection closed');
                
                    insertData_customer(databasename,tablename);

                  
                  
                }
              });
            });
          });
        });
      });
      


}


function database_creation_loan(databasename,tablename,schema){
    connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MySQL:', err);
          return;
        }
      
        console.log('Connected to MySQL');
      
        // Create the "customer_data" database if it doesn't exist
        connection.query(`CREATE DATABASE IF NOT EXISTS ${databasename}`, (err) => {
          if (err) {
            console.error('Error creating database:', err);
            connection.end();
            return;
          }
      
          console.log(`Database ${databasename} created or already exists`);
      
          // Switch to the current database
          connection.changeUser({ database: databasename }, (err) => {
            if (err) {
              console.error(`Error switching to ${databasename}  database:`, err);
              connection.end();
              return;
            }
      
            console.log(`Switched to ${databasename} database`);
      
          
      
            connection.query(schema, (err) => {
              if (err) {
                console.error('Error creating table:', err);
              } else {
                console.log(`Table ${tablename} created or already exists`);
              }
      
              // Close the database connection
              connection.end((err) => {
                if (err) {
                  console.error('Error closing MySQL connection:', err);
                } else {
                  console.log('MySQL connection closed');
                
                    insertData_loan(databasename,tablename);

                  
                  
                }
              });
            });
          });
        });
      });
      


}
function insertData_customer(databasename,tablename) {
  const workbook = XLSX.readFile('customer_data.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Reconnect to the MySQL server with the "customer_data" database selected
  const dbConfigWithData = { ...dbConfig, database: databasename };
  const connectionWithData = mysql.createConnection(dbConfigWithData);

  // Connect to the database
  connectionWithData.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }

    console.log('Connected to MySQL with "customer_health" database');

    data.forEach((row) => {
      const sql = `INSERT INTO ${tablename}(first_name, last_name, age, phone_number, monthly_salary, approved_limit) VALUES (?, ?, ?, ?, ?, ?)`;
      
      const values = [row.first_name, row.last_name, row.age, row.phone_number, row.monthly_salary, row.approved_limit];

      connectionWithData.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
        } else {
          console.log('Inserted row:', result.insertId);
        }
      });
    });

    // Close the database connection
    connectionWithData.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection:', err);
      } else {
        console.log('MySQL connection closed');
      }
    });
  });
}

function insertData_loan(databasename,tablename) {
    const workbook = XLSX.readFile('Loan_data.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
  
    // Reconnect to the MySQL server with the "customer_data" database selected
    const dbConfigWithData = { ...dbConfig, database: databasename };
    const connectionWithData = mysql.createConnection(dbConfigWithData);
  
    // Connect to the database
    connectionWithData.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
  
      console.log('Connected to MySQL with "customer_health" database');
  
      data.forEach((row) => {
        const sql = `
        INSERT INTO ${tablename} (customer_id,loan_id,loan_amount, tenure, interest_rate, monthly_payment, EMIs_paid_on_Time,start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
      `;
     
      // start date
      var exceldate = row.start_date;
        var exceldate=       exceldate.toString(2);
      var dateParts = exceldate.split("-");
      var start_date = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
      //end date
      var exceldate2 = row.end_date;
      var exceldate2= exceldate2.toString(2);
      var dateParts2 = exceldate2.split("-");

      var end_date = dateParts2[2] + "-" + dateParts2[1] + "-" + dateParts2[0];
      
       
     

      
      const values = [
        row.customer_id,
        row.loan_id,
        row.loan_amount,
        row.tenure,
        row.interest_rate,
        row.monthly_payment,
        row.emis_paid_on_time,
        row.start_date,
        row.end_date
      ];
      
        connectionWithData.query(sql, values, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
          } else {
            console.log('Inserted row:', result.insertId);
          }
        });
      });
  
      // Close the database connection
      connectionWithData.end((err) => {
        if (err) {
          console.error('Error closing MySQL connection:', err);
        } else {
          console.log('MySQL connection closed');
        }
      });
    });
  }
  