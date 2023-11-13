module.exports = `
        CREATE TABLE IF NOT EXISTS customer (
            customer_id INT,
            loan_id INT ,
            loan_amount DECIMAL(10, 2),
            tenure INT,
            interest_rate DECIMAL(5, 2),
            monthly_payment DECIMAL(10, 2),
            EMIs_paid_on_Time INT,
            start_date DATE,
            end_date DATE
        );
      `;
      