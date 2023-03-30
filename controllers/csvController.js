const fs = require('fs'), path = require('path'), csv = require('fast-csv'), User = require("../Models/User");
// Validation middleware function
function validateUser(user) {
  const { first_name, last_name, company_name, address, city, province, postal, phone1, phone2, email, web } = user;


  // Check that the name field only contains alphabets
  if (!/^[a-zA-Z]+$/.test(first_name)) {
    throw new Error('Invalid First Name');
  }
  if (!/^[a-zA-Z]+$/.test(last_name)) {
    throw new Error('Invalid Last Name');
  }

  // Check that the email field is in the correct format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Invalid email');
  }
}
exports.create = async (req, res) => {
  const file = path.join(__dirname, '../', '/public/csv/' + req.file.filename);
  const totalRecords = [];
  let error = false;
  try {
    fs.createReadStream(file)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', async (row) => {
        try {
          validateUser(row);
          totalRecords.push(row);
        } catch (err) {
          error = {
            status: true,
            message: err.message
          };
        }
      })
      .on('end', async rowCount => {
        // Delete the CSV file
        fs.unlink(file, (err) => {
          if (err) {
            console.error(err);
          }
        });

        if (error.status) {
          res.status(400).json({ err: error.message, status: 'Invalid CSV file' });
        } else {
          const users = await User.insertMany(totalRecords);
          res.status(200).json({ status: 'CSV file uploaded', data: users });
        }
      });

  } catch (error) {
    res.status(400).json(error)
  }
};
