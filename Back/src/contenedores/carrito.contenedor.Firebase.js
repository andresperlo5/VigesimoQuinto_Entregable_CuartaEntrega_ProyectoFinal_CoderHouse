const admin = require('firebase-admin')
const { v4: uuid4 } = require('uuid')

const log = require('log4js')
log.configure({
    appenders: {
        consoleLog: { type: 'console' },
        fileLog: { type: 'file', filename: 'gral.log' }
    },
    categories: {
        default: { appenders: ['consoleLog'], level: 'error' },
        file: { appenders: ['fileLog'], level: 'error' }
    }
})

const logger = log.getLogger()

const db = admin.firestore()
class ContenedorCarritosFirebase {
    constructor(nombreCollection) {
        this.collections = db.collection(nombreCollection)
    }

    async findAll() {

        try {
            const carts = (await this.collections.get()).docs
            const res = carts.map(prod => {
                return {
                    id: prod.id,
                    producto: prod.data().producto,
                    timestamp: prod.data().timestamp,
                    userId: prod.data().userId
                }
            })
            return res
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async findOneId(id) {
        try {
            const oneCart = (await this.collections.doc(id).get()).data();
            return oneCart
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async newCart(body) {
        try {

            const obj = await this.collections.add(body)
            const newCarts = {
                id: obj.id
            }
            return newCarts

        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async ModifyOneCart(id, body) {
        try {
            const modifyCart = await this.collections.doc(id).set(body);
            return modifyCart
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async DeleteOneCart(id) {
        try {
            const delCart = await this.collections.doc(id).delete();
            return delCart

        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async SaveCart(cartEnc, idCart) {
        console.log('cartEnc', cartEnc)
        try {
            const saveCart = await this.collections.doc(idCart).set(cartEnc);
            return saveCart

        } catch (error) {
            logger.error(error)
            return error
        }
    }

}

module.exports = ContenedorCarritosFirebase;
