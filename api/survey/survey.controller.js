const surveyService = require('./survey.service');
const logger = require('../../services/logger.service')



async function getSurveys(req, res) {
    try {
        logger.debug('Getting surveys')
        var queryParams = req.query
        const surveys = await surveyService.query(queryParams)
        res.json(surveys);
    } catch (err) {
        logger.error('Failed to get anys', err)
        res.status(500).send({ err: 'Failed to get anys' })
    }
}

async function updateMany(req, res) {
    try {
        const newAnswers = req.query
        const surveys = await surveyService.updateAnswers(newAnswers)
        res.json(surveys)
    } catch (error) {

    }
}

module.exports = {
    getSurveys,
    updateMany
}