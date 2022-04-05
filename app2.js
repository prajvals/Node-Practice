const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const app = express();

app.use(express.json());
console.clear();

app.use((req, res, next) => {
  console.log('Yup this is a middleware custom one');
  next();
});
const tourList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
const portNumber = 4008;
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    size: Object.keys(tourList).length,
    data: [tourList],
  });
};

const getParticularTour = (req, res) => {
  req.params.id = req.params.id * 1;
  console.log(req.params);
  let particularTour;
  // console.log(tourList);
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
};

const createNewTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};
app.route('/api/v1/tours').get(getAllTours).post(createNewTour);
app
  .route('/api/v1/tours/:id')
  .put(updateTour)
  .delete(deleteTour)
  .get(getParticularTour);

app.listen(portNumber, () => {
  console.log('Yeah we are live');
});
