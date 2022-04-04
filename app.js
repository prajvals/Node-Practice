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

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  req.params.id = req.params.id * 1;
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'failure',
      message: 'not found ',
    });
  }
  const particularTour = tours.find((el) => req.params.id === el.id);
  console.log(particularTour);
  res.status(200).json({
    status: 'Success',
    data: {
      tour: particularTour,
    },
  });
  // res.send(particularTour);
  // console.log(req.body); // we get an undefined value when we make a post request
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'Success',
  //       data: {
  //         newTour,
  //       },
  //     });
  //   }
  // );
  // res.send('done');
});
