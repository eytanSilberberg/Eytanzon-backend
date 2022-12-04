const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await dbService.getCollection('any')
        const anys = await collection.find({}).toArray()
        const anyMinis = anys.map(any => {

            return { _id: any._id, title: any.title, createdBy: { ...any.createdBy }, style: any.style, isStarred: any.isStarred, createdAt: any.createdAt }
        })
        return anyMinis
    } catch (err) {
        logger.error('cannot find anys', err)
        throw err
    }
}

async function getById(anyId) {
    try {
        const collection = await dbService.getCollection('any')
        const any = collection.findOne({ _id: ObjectId(anyId) })
        return any
    } catch (err) {
        logger.error(`while finding any ${anyId}`, err)
        throw err
    }
}

async function remove(anyId) {
    try {
        const collection = await dbService.getCollection('any')
        await collection.deleteOne({ _id: ObjectId(anyId) })
        return anyId
    } catch (err) {
        logger.error(`cannot remove any ${anyId}`, err)
        throw err
    }
}

async function add(any) {
    try {
        const anyToAdd =
        {
            title: any.title,
            createdAt: Date.now(),
            isStarred: any.isStarred,
            createdBy: any.creator,
            style: { background: any.backgroundOption, backgroundColor: any.backgroundColor },
            lastVisit: any.lastVisit,
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
            members: [any.creator],
            groups: [],
            activities: [],
            cmpsOrder: [
                "status-picker",
                "member-picker",
                "date-picker"
            ]
        }



        const collection = await dbService.getCollection('any')
        const addedAny = await collection.insertOne(anyToAdd)

        return addedAny.ops
    } catch (err) {
        logger.error('cannot insert any', err)
        throw err
    }
}
async function update(any) {

    try {
        const id = ObjectId(any._id)
        delete any._id
        const collection = await dbService.getCollection('any')
        await collection.updateOne({ _id: id }, { $set: { ...any } })
        return any
    } catch (err) {
        logger.error(`cannot update any ${anyId}`, err)
        throw err
    }
}

async function updateMini(any) {
    try {
        const id = ObjectId(any._id)
        delete any._id
        const collection = await dbService.getCollection('any')

        await collection.updateOne({ _id: id }, { $set: { ...any } })
        any._id = id

        return any
    } catch {

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
    updateMini
}