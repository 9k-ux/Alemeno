module.exports = `
        CREATE TABLE IF NOT EXISTS customers (
          customer_id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          age INT,
          phone_number VARCHAR(15),
          monthly_salary DECIMAL(10, 2),
          approved_limit DECIMAL(10, 2)
        );
      `;
      