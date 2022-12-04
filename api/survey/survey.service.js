const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await dbService.getCollection('survey')
        const surveys = await collection.find({}).toArray()
        return surveys
    } catch (err) {
        logger.error('cannot find surveys', err)
        throw err
    }
}

async function getById(surveyId) {
    try {
        const collection = await dbService.getCollection('survey')
        const survey = collection.findOne({ _id: ObjectId(surveyId) })
        return survey
    } catch (err) {
        logger.error(`while finding survey ${surveyId}`, err)
        throw err
    }
}

async function remove(surveyId) {
    try {
        const collection = await dbService.getCollection('survey')
        await collection.deleteOne({ _id: ObjectId(surveyId) })
        return surveyId
    } catch (err) {
        logger.error(`cannot remove survey ${surveyId}`, err)
        throw err
    }
}

async function add(survey) {
    try {
        const surveyToAdd =
        {
            title: survey.title,
            createdAt: Date.now(),
            isStarred: survey.isStarred,
            createdBy: survey.creator,
            style: { background: survey.backgroundOption, backgroundColor: survey.backgroundColor },
            lastVisit: survey.lastVisit,
            labels: [
                {
                    id: 'l101',
                    title: 'Done',
                    color: '#61bd4f'
                },
                {
                    id: 'l102',
                    title: 'Progress',
                    color: '#61bd33'
                }
            ],
            members: [survey.creator],
            groups: [],
            activities: [],
            cmpsOrder: [
                "status-picker",
                "member-picker",
                "date-picker"
            ]
        }



        const collection = await dbService.getCollection('survey')
        const addedAny = await collection.insertOne(surveyToAdd)

        return addedAny.ops
    } catch (err) {
        logger.error('cannot insert survey', err)
        throw err
    }
}
async function update(survey) {

    try {
        const id = ObjectId(survey._id)
        delete survey._id
        const collection = await dbService.getCollection('survey')
        await collection.updateOne({ _id: id }, { $set: { ...survey } })
        return survey
    } catch (err) {
        logger.error(`cannot update survey ${surveyId}`, err)
        throw err
    }
}

async function updateMini(survey) {
    try {
        const id = ObjectId(survey._id)
        delete survey._id
        const collection = await dbService.getCollection('survey')


        await collection.updateOne({ _id: id }, { $set: { ...survey } })
        survey._id = id

        return survey
    } catch {

    }
}

async function updateAnswers(newAnswers) {
    console.log(newAnswers);
    const relevantIds = newAnswers.answers.map(answer => ObjectId(answer.surveyId))

    try {
        let collection = await dbService.getCollection('survey')
        const surveys = await collection.find({ _id: { "$in": relevantIds } }).toArray()
        surveys.forEach((survey, idx) => {
            const { answers } = newAnswers
            if (answers[idx].word === survey.words[0].name) {
                survey.words[0].value + 1
            } else if (answers[idx].word === survey.words[1].name) {
                survey.words[1].value += 1
            }
        })
        const mongoActions = surveys.map(survey => {
            return {
                updateOne:
                {
                    filter:
                        { _id: survey._id },
                    update:
                    {
                        $set:
                            { words: survey.words }
                    }
                }
            }

        }
        )
        console.log('mongoActions', mongoActions);
        collection = await dbService.getCollection('survey')
        await collection.bulkWrite(mongoActions)
        const updatedSurveys = await collection.find({}).toArray()
        console.log(updatedSurveys);
        return updatedSurveys

    } catch (error) {
        console.log(error);
    }
}

function _buildCriteria({ txt, label, page = 1 }) {
    const criteria = {}
    const pageSkip = 4
    const reg = { $regex: txt, $options: 'i' }
    page = +page
    if (txt) criteria.title = reg
    return criteria
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update,
    updateMini,
    updateAnswers
}