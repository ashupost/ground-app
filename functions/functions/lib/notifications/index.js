"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const admin = require("firebase-admin");
const index_1 = require("../index");
const fieldValue = admin.firestore.FieldValue;
const messagingAdmin = admin.messaging();
function sendNewFollowerNotification(event) {
    return __awaiter(this, void 0, void 0, function* () {
        // noinspection TypeScriptUnresolvedVariable
        const userId = event.params.followedId;
        // noinspection TypeScriptUnresolvedVariable
        const authorId = event.params.followerId;
        const authorUsername = event.data.data().username;
        const authorPhotoUrl = event.data.data().photoUrl;
        //An user can't send notifications to himself
        if (userId === authorId) {
            return console.log('User doesnt recieve their own notifications');
        }
        try {
            //Retrieve the events filtering by the author of the interaction and the kind of event
            const eventAlreadyExist = yield userEventExist(userId, constants_1.FOLLOW_EVENT);
            //If the event exist, means that a notification was already sent for such event and user
            if (eventAlreadyExist)
                return console.log('An event for this action have been sent already');
            //Retrieve the user data and check if the user exist
            const userData = yield getUserPrivateData(userId);
            if (!userData.exists)
                return console.log('User doc doesnt exists');
            //Get the tokens from the retrieved user
            // noinspection TypeScriptUnresolvedVariable
            const tokens = userData.data().messagingTokens;
            //Generate the payload
            const payload = {
                notification: {
                // title: 'You have a new Comment!',
                // body: `${authorName}`
                },
                data: {
                    "kind": constants_1.FOLLOW_EVENT,
                    "authorId": `${authorId}`,
                    "authorUsername": `${authorUsername}`,
                    "authorPhotoUrl": `${authorPhotoUrl}`,
                    "referenceId": `${authorId}`,
                }
            };
            //Generate the POJO of information that we are going to set for this event
            const data = {
                kind: constants_1.FOLLOW_EVENT,
                interactionUserUsername: authorUsername,
                interactionUserProfilePicture: authorPhotoUrl,
                interactionUser: authorId,
                interactionRef: authorId,
                timestamp: fieldValue.serverTimestamp()
            };
            //Send the messages
            const response = yield messagingAdmin.sendToDevice(tokens, payload);
            //Check the response to see if any notification failed and delete deprecated tokens if necessary
            response.results.forEach((result, index) => {
                const error = result.error;
                if (error) {
                    console.error('Failure sending notification to', tokens[index], error);
                    // Cleanup the tokens who are not registered anymore.
                    if (error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered') {
                        tokens.remove(index);
                    }
                }
            });
            //Generate a new promise for set the new event data and another one for update the tokens
            const privateUserDataDoc = index_1.firestoreInstance.collection('PrivateUserData').doc(userId);
            const newEventPromise = privateUserDataDoc.collection(constants_1.EVENTS).doc().set(data);
            const updateTokensPromise = privateUserDataDoc.update('messagingTokens', tokens);
            //Execute them
            yield Promise.all([newEventPromise, updateTokensPromise]);
            console.log('The process of send a new follow notification for the user ', userId, ' has finished successfully');
        }
        catch (err) {
            console.error('Failed sending a follow notification to user', userId, 'with error', err);
        }
    });
}
exports.sendNewFollowerNotification = sendNewFollowerNotification;
function sendPostNotication(event, kind) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentAuthorId = event.data.data().author.uid;
        const postId = event.params.postId;
        const postAuthorId = event.data.data().postAuthorId;
        const authorUsername = event.data.data().author.fullName;
        const authorPhotoUrl = event.data.data().author.profilePicture;
        //An user can't send notifications to himself
        if (commentAuthorId === postAuthorId) {
            return console.log('User doesnt recieve their own notifications');
        }
        try {
            //Retrieve the events filtering by the author of the interaction, the ref and the kind of event
            const eventAlreadyExist = yield userEventExist(commentAuthorId, kind, postId);
            //If the event exist, means that a notification was already sent for such event and user
            if (eventAlreadyExist)
                return console.log('An event for this action have been sent already');
            //Retrieve the user data and check if the user exist
            const userData = yield getUserPrivateData(postAuthorId);
            if (!userData.exists)
                return console.log('User doc doesnt exists');
            //Get the tokens from the retrieved user
            // noinspection TypeScriptUnresolvedVariable
            const tokens = userData.data().messagingTokens;
            //Generate the payload
            const payload = {
                notification: {
                // title: 'You have a new Comment!',
                // body: `${authorName}`
                },
                data: {
                    "kind": kind,
                    "authorId": `${commentAuthorId}`,
                    "authorUsername": `${authorUsername}`,
                    "authorPhotoUrl": `${authorPhotoUrl}`,
                    "referenceId": `${postId}`,
                }
            };
            //Generate the POJO of information that we are going to set for this event
            const data = {
                kind: kind,
                interactionUserUsername: authorUsername,
                interactionUserProfilePicture: authorPhotoUrl,
                interactionUser: commentAuthorId,
                interactionRef: postId,
                timestamp: fieldValue.serverTimestamp()
            };
            //Send the messages
            const response = yield messagingAdmin.sendToDevice(tokens, payload);
            //Check the response to see if any notification failed and delete deprecated tokens if necessary
            response.results.forEach((result, index) => {
                const error = result.error;
                if (error) {
                    console.error('Failure sending notification to', tokens[index], error);
                    // Cleanup the tokens who are not registered anymore.
                    if (error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered') {
                        tokens.remove(index);
                    }
                }
            });
            //Generate a new promise for set the new event data and another one for update the tokens
            const privateUserDataDoc = index_1.firestoreInstance.collection('PrivateUserData').doc(postAuthorId);
            const newEventPromise = privateUserDataDoc.collection(constants_1.EVENTS).doc().set(data);
            const updateTokensPromise = privateUserDataDoc.update('messagingTokens', tokens);
            //Execute them
            yield Promise.all([newEventPromise, updateTokensPromise]);
            console.log('The process of send a new follow notification for the user ', postAuthorId, ' has finished successfully');
        }
        catch (err) {
            console.error('Failed sending a follow notification to user', postAuthorId, 'with error', err);
        }
    });
}
exports.sendPostNotication = sendPostNotication;
function getUserPrivateData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(userId).get();
    });
}
function userEventExist(userId, kind, interactionRef = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let ref;
        if (interactionRef == null) {
            ref = index_1.firestoreInstance.collection('PrivateUserData')
                .doc(userId).collection(constants_1.EVENTS)
                .where('interactionUser', '==', userId)
                .where('kind', '==', kind);
        }
        else {
            ref = index_1.firestoreInstance.collection('PrivateUserData')
                .doc(userId).collection(constants_1.EVENTS)
                .where('interactionUser', '==', userId)
                .where('interactionRef', '==', interactionRef)
                .where('kind', '==', kind);
        }
        const userEvent = yield ref.get();
        return !userEvent.empty;
    });
}
//# sourceMappingURL=index.js.map