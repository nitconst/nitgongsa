const router = require('express').Router();
const tutorial = require('../controller/controller.js');

// Create document
router.post('/api/tutorial', tutorial.create);

// Retrieve all documents
router.get('/api/tutorial', tutorial.findAll);

// Retrieve single document by id
router.get('/api/tutorial/:id', tutorial.findOne);

// Update document by id
router.put('/api/tutorial/:id', tutorial.update);

// Delete document by id
router.delete('/api/tutorial/:id', tutorial.delete);

module.exports = router;
