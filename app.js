const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const app = express();

console.clear(); //for nodemon clean output
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

app.use(express.json());

const port = 4005;
app.listen(port, () => {
  console.log('yeah my server is listening ');
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).send({
    result: 'Success',
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body); // we get an undefined value when we make a post request
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          newTour,
        },
      });
    }
  );
  // res.send('done'); 
});
