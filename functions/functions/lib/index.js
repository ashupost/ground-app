"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
//var app = firebase.initializeApp(config);
//db = firebase.firestore(app);
admin.initializeApp(functions.config().firebase);
exports.firestoreInstance = admin.firestore();
/*
export const newFollowerNotification = functions.firestore
    .document('PublicUserData/{followerId}/Followers/{followedId}')
    .onCreate(event => {
        return notificationFunctions.sendNewFollowerNotification(event);
    });

export const newLikeNotification = functions.firestore
    .document('Posts/{postId}/Likes/{likeId}')
    .onCreate(event => {
        return notificationFunctions.sendPostNotication(event, LIKE_EVENT)
    });

export const newCommentNotification = functions.firestore
    .document('Posts/{postId}/Comments/{commentId}')
    .onCreate(event => {
        return notificationFunctions.sendPostNotication(event, COMMENT_EVENT)
    });

export const updateFeedAfterFollow = functions.firestore
    .document('PublicUserData/{followerId}/Following/{followedId}')
    .onCreate(event => {
        return atomicFunctions.updateFeedAfterUserAction(event, true);
    });

export const updateFeedAfterUserNewWorkout = functions.firestore
    .document('Posts/{postId}')
    .onCreate(event => {
        return atomicFunctions.updateFollowersFeed(event, false)
    });

export const updateFeedAfterUnFollow = functions.firestore
    .document('PublicUserData/{followerId}/Following/{followedId}')
    .onDelete(event => {
        return atomicFunctions.updateFeedAfterUserAction(event, false);
    });

exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
        const original = snap.data().original;
        console.log('Uppercasing', context.params.documentId, original);
        const uppercase = original.toUpperCase();
        return snap.ref.set({ uppercase }, { merge: true });
    });
*/
exports.makeUppercaseWorking = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('uppercase').set(uppercase);
});
exports.statusUpdate = functions.database.ref('/status/{userId}/status')
    .onUpdate((snapshot, context) => {
    const userId = context.params.userId;
    const afterStatus = snapshot.after.val();
    const statusChangeFirestore = {
        status: afterStatus
    };
    const userStatusFirestoreRef = exports.firestoreInstance.collection('users').doc(userId);
    userStatusFirestoreRef.set(statusChangeFirestore, { merge: true });
    return snapshot.after.ref.parent.child('sysnc').set({ sysnc: true });
});
exports.fcmSend = functions
    .database.ref('/messages/{userId}/{messageId}')
    .onUpdate((event, context) => {
    const message = event.after.val();
    const userId = context.params.userId;
    const payload = {
        notification: {
            title: message.title,
            body: message.body,
            icon: "https://placeimg.com/250/250/people"
        }
    };
    admin.database()
        .ref(`/fcmTokens/${userId}`)
        .once('value')
        .then(token => token.val())
        .then(userFcmToken => {
        return admin.messaging().sendToDevice(userFcmToken, payload);
    })
        .then(res => {
        console.log("Sent Successfully", res);
    })
        .catch(err => {
        console.log(err);
    });
});
//# sourceMappingURL=index.js.map