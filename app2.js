const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const app = express();

app.use(express.json());
console.clear();
const tourList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
// console.log(tourList);
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

app.post('/api/v1/tours', (req, res) => {
  const contents = req.body;
  console.log(contents);
  fs.appendFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    contents,
    (err) => {
      if (err) {
        res.status(200).json({
          status: 'Failed request',
        });
      } else {
        res.status(200).json({
          status: 'Request Successful',
          data: contents,
        });
      }
    }
  );
});

app.put('/api/v1/tours/:id', (req, res) => {
  const tourToChange = req.params.id * 1;
  let changeThisTour = tourList.find((element) => element.id === tourToChange);
  changeThisTour = req.body;
  tourList[tourToChange] = changeThisTour;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tourList),
    'utf-8',
    (err) => {
      if (err) {
        res.status(400).json({
          status: 'Failure',
        });
      } else {
        res.status(200).json({
          status: 'Success',
          data: {
            tourList,
          },
        });
      }
    }
  );
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const elementToBeDeleted = tourList.find((element) => element.id === id);
  tourList.splice(id, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tourList),
    'utf-8',
    (err) => {
      if (err) {
        res.status(400).json({
          status: 'Failed request',
        });
      } else {
        res.status(200).json({
          status: 'Success',
          data: {
            tourList,
          },
        });
      }
    }
  );
});

app.listen(portNumber, () => {
  console.log('Yeah we are live');
});