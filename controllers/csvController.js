const fs = require('fs'), path = require('path'), csv = require('fast-csv'), User = require("../Models/User");

exports.create = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let users = [];
    let file = path.join(__dirname, '../', '/public/csv/' + req.file.filename);

    // console.log("path", file);


    let emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    let alphabeticPattern = /^[A-Za-z]+$/;
    let successCount = 0;
    let errorCount = 0;
    let errorArray = [];
    fs.createReadStream(file)
      .pipe(csv.parse({ headers: true }))
      .validate(data => data.first_name !== '' && data.last_name !== '' && emailPattern.test(data.email) && alphabeticPattern.test(data.first_name))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        successCount++;
        users.push(row);
        console.log(`ROW=${JSON.stringify(row)}`)
      })
      .on('data-invalid', (row, rowNumber) => {
        errorCount++;
        errorArray.push(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`)
        console.log(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`)
      })
      .on("end", (rowCount) => {
        if (errorCount < 0) {
          console.log(`Parsed ${rowCount} rows`)
          User.insertMany(users, {
            validate: true,
          })
          .then(async () => {
              res.status(200).json({
                error: false,
                success:
                  `Uploaded ${successCount} row successfully from ` + req.file.originalname,
                failed: `Uploaded ${errorCount} row failed from ` + req.file.originalname,
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error: error.message,
                failed: `Fail to import ${users.length} row into database!`,

              });
            });
        }else{
          res.status(500).json({
            message: errorArray,
            failed: `${errorCount} row failed ${req.file.originalname}. So It Can't be Uploaded`,
          });
        }
      });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    res.status(500).json({
      error: error.message,
      failed: "Could not upload the file: " + req.file.originalname,
    });
  }








  // try {
  //   fs.createReadStream(file)
  //     .pipe(csv.parse({ headers: true }))
  //     .validate(data => console.log(data))
  //     .on('error', error => {
  //       throw error.message;
  //     })
  //     .on('data', async (row) => {
  //       try {
  //         successCount++;
  //         totalRecords.push(row);
  //         console.log(`ROW=${JSON.stringify(row)}`)
  //       } catch (err) {
  //         console.log(err.message);
  //         error = {
  //           status: true,
  //           message: err.message
  //         };
  //       }
  //     })
  //     .on('data-invalid', (row, rowNumber, error) => {
  //       errorCount++;
  //       console.log(`${error.message}`);
  //       console.log(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}] : ${error}`)
  //     })
  //     .on('end', async rowCount => {
  //       console.log(`Parsed ${rowCount} rows`)
  //       // Delete the CSV file
  //       fs.unlink(file, (err) => {
  //         if (err) {
  //           console.error(err);
  //         }
  //       });

  //       if (error.status) {
  //         res.status(400).json({ err: error.message, status: 'Invalid CSV file' });
  //       } else {
  //         // const users = await User.insertMany(totalRecords);
  //         // res.status(200).json({ status: 'CSV file uploaded', data: users });
  //         res.status(200).json({ status: 'CSV file uploaded' });
  //       }
  //     });

  // } catch (error) {
  //   res.status(400).json(error)
  // }
};
