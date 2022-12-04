const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getAnys, getAnyById, addAny, updateAny, removeAny } = require('./any.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getAnys)
router.get('/:id', getAnyById)
router.post('/', addAny)
router.put('/:id', updateAny)
router.delete('/:id', removeAny)
// router.post('/', requireAuth, requireAdmin, addAny)
// router.put('/:id', requireAuth, requireAdmin, updateAny)
// router.delete('/:id', requireAuth, requireAdmin, removeAny)


// debug routes
// router.post('/', addAny)
// router.put('/:id', updateAny)
// router.delete('/:id', removeAny)

module.exports = router