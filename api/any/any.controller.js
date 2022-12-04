const anyService = require('./any.service');
const logger = require('../../services/logger.service')

// GET LIST
async function getAnys(req, res) {

  try {
    logger.debug('Getting Anys')
    var queryParams = req.query
    const anys = await anyService.query(queryParams)
    res.json(anys);
  } catch (err) {
    logger.error('Failed to get anys', err)
    res.status(500).send({ err: 'Failed to get anys' })
  }
}

// GET BY ID 
async function getAnyById(req, res) {
  try {
    const anyId = req.params.id;
    const any = await anyService.getById(anyId)
    res.json(any)
  } catch (err) {
    logger.error('Failed to get any', err)
    res.status(500).send({ err: 'Failed to get any' })
  }
}

// POST (add any)
async function addAny(req, res) {
  logger.debug('adding')

  try {
    const any = req.body;
    const addedAny = await anyService.add(any)
    res.json(addedAny)
  } catch (err) {
    logger.error('Failed to add any', err)
    res.status(500).send({ err: 'Failed to add any' })
  }
}

// PUT (Update any)
async function updateAny(req, res) {
  try {
    const any = req.body;
    const updatedAny = await anyService.update(any)
    res.json(updatedAny)
  } catch (err) {
    logger.error('Failed to update any', err)
    res.status(500).send({ err: 'Failed to update any' })

  }
}

// DELETE (Remove any)
async function removeAny(req, res) {
  try {
    const anyId = req.params.id;
    const removedId = await anyService.remove(anyId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove any', err)
    res.status(500).send({ err: 'Failed to remove any' })
  }
}

module.exports = {
  getAnys,
  getAnyById,
  addAny,
  updateAny,
  removeAny
}
