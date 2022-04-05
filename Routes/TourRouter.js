const express = require('express');
const fs = require('fs');
const router = express.Router();

// const app = express();
// app.use(express.json());
const tourList = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

//ROUTE HANDLERS
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

// router.get('/', (req, res) => {
//   res.send('hi');
// });

router.route('/').post(createNewTour).get(getAllTours);
router.route('/:id').put(updateTour).delete(deleteTour).get(getParticularTour);

module.exports = router;
