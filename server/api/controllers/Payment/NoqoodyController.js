const PaymentServiceCtrl = require(`${sails.config.appPath}/api/services/Payment/Noqoody/payment`);
const BookingPassController = require(`${sails.config.appPath}/api/controllers/Device/V1/BookingPassController`);
module.exports = {
    serverGetCallbackURL: async (req, res) => {
        let params = req.allParams();
        try {
            console.log('-------------------Callback url params-------------');
            console.log(params);
            let noqoodyReferenceId = params.reference;
            if (sails.config.NOQOODY_TRANSACTION_VERIFYING.indexOf(noqoodyReferenceId) > -1) {
                return res.ok({}, sails.config.message.TRANSACTION_VERIFYING);
            }
            sails.config.NOQOODY_TRANSACTION_VERIFYING.push(noqoodyReferenceId);
            await NoQoodyLog.create(params);
            let isAddedToWallet = false;
            let error;
            try {
                isAddedToWallet = await PaymentServiceCtrl.validatePayment(noqoodyReferenceId);
            } catch (err) {
                console.log(err);
                error = err;
            }

            sails.config.NOQOODY_TRANSACTION_VERIFYING = sails.config.NOQOODY_TRANSACTION_VERIFYING.filter(function (e) { return e !== noqoodyReferenceId });
            console.log('isAddedToWallet------------------', isAddedToWallet);
            if (isAddedToWallet) {
                await BookingPassController.finalisePurchasePass(noqoodyReferenceId);
                return res.send("");
            }
            if (error) {
                throw error;
            }
            throw sails.config.message.PAYMENT_REQUEST_FAILED;
        } catch (error) {
            console.log(error);
            res.serverError({}, error);
        }
    },
}
