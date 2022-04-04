const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const app = express();

app.use(express.json());
console.clear();
const tourList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
const portNumber = 4008;

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    size: Object.keys(tourList).length,
    data: [tourList],
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  req.params.id = req.params.id * 1;
  console.log(req.params);
  let particularTour;
  console.log(tourList);
  particularTour = tourList.find((element) => element.id === req.params.id);
  // for (const element of tourList) {
  //   if (element.id === req.params.id) {
  //     console.log(element.id);
  //     console.log(element);
  //     particularTour = element;
  //     break;
  //   }
  // }
  res.status(200).json({
    particularTour,
  });
});

app.listen(portNumber, () => {
  console.log('Yeah we are live');
});
