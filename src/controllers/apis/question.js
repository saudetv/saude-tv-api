const express = require('express');
const QuestionServiceClass = require('../../services/questions');
const questionService = new QuestionServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', authMiddleware, questionService.index);
router.get('/:id', questionService.show);
router.post('/', authMiddleware, questionService.store);
router.put('/:id', questionService.update);
router.delete('/:id', questionService.destroy);
router.patch("/:id", questionService.update);

module.exports = router;
