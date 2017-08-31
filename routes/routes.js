/**
 * Created by prasanna_d on 8/31/2017.
 */
const express = require('express');
const router = express.Router();

//Controllers
const dashboardController = require('../controller/dashboardController');

router.post('/intent/create', dashboardController.createIntent);
router.get('/intent/get', dashboardController.getIntent);
router.post('/entity/create', dashboardController.createEntity);
router.get('/entity/get', dashboardController.getEntity);

module.exports = router;
