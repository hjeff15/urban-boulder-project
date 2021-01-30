const express = require('express');
const router = express.Router();
const cragController = require('../controllers/cragController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(cragController.getCrags));
router.get('/crags', catchErrors(cragController.getCrags));
router.get('/crag/:slug', catchErrors(cragController.getCragBySlug));

router.get('/createCrag', catchErrors(cragController.addCrag));
router.post('/createCrag', catchErrors(cragController.createCrag));

router.post('/crags/:id/edit', catchErrors(cragController.updateCrag));

router.get('/crags/:id/edit', catchErrors(cragController.editCrag));

module.exports = router;
