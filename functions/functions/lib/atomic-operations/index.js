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
const _ = require("lodash");
const index_1 = require("../index");
function updateFeedAfterUserAction(event, follow) {
    return __awaiter(this, void 0, void 0, function* () {
        // noinspection TypeScriptUnresolvedVariable
        const followerId = event.params.followerId;
        // noinspection TypeScriptUnresolvedVariable
        const followedId = event.params.followedId;
        const followerFeedRef = index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(followerId).collection(constants_1.FEED);
        try {
            //Get the posts from the followed user
            const followedUserPosts = yield getLastMonthUserPosts(followedId);
            // console.log('User ', followedId, ' have ', followedUserPosts.length, ' posts');
            //Check if the followed user have posts
            if (followedUserPosts.length == 0) {
                return console.log('User ', followedId, ' doesnt have posts');
            }
            //Generate the right amount of batches
            const batches = _.chunk(followedUserPosts, constants_1.MAX_BATCH_SIZE)
                .map(postSnapshots => {
                const writeBatch = index_1.firestoreInstance.batch();
                if (follow) {
                    postSnapshots.forEach(post => {
                        // console.log('Writing ', post.id, ' in feed ', followerId);
                        writeBatch.set(followerFeedRef.doc(post.id), post.data());
                    });
                }
                else {
                    postSnapshots.forEach(post => {
                        // console.log('Deleting ', post.id, ' in feed ', followerId);
                        writeBatch.delete(followerFeedRef.doc(post.id));
                    });
                }
                return writeBatch.commit();
            });
            yield Promise.all(batches);
            console.log('Feed for user ', followerId, ' updated after follow, ', follow, ' user ', followedId);
        }
        catch (err) {
            console.error('Failed updating the feed of the user ', followerId, 'after follow user ', followerId, 'with error', err);
        }
    });
}
exports.updateFeedAfterUserAction = updateFeedAfterUserAction;
function updateFollowersFeed(event, isDeletion) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = event.params.postId;
        const authorId = event.data.data().author.uid;
        const privateUserdataRef = index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA);
        try {
            //Retrieve the Id's from all the followers of the post author
            const authorFollowers = yield getUserFollowersIds(authorId);
            //Check if the user have followers
            if (authorFollowers.length == 0) {
                return console.log('There are no followers to update feed.');
            }
            //Generate the right amount of batches
            const batches = _.chunk(authorFollowers, constants_1.MAX_BATCH_SIZE)
                .map(userIds => {
                const writeBatch = index_1.firestoreInstance.batch();
                if (isDeletion) {
                    userIds.forEach(userId => {
                        // console.log('Deleting post ', postId, ' in user ', userId, ' feed');
                        writeBatch.delete(privateUserdataRef.doc(userId).collection(constants_1.FEED).doc(postId));
                    });
                }
                else {
                    userIds.forEach(userId => {
                        // console.log('Writing post ', postId, ' in user ', userId, ' feed');
                        writeBatch.set(privateUserdataRef.doc(userId).collection(constants_1.FEED).doc(postId), event.data.data());
                    });
                }
                return writeBatch.commit();
            });
            yield Promise.all(batches);
            console.log('The feed of ', authorFollowers.length, ' have been update');
        }
        catch (err) {
            console.error('Failed updating the users feed after the user', authorId, ' posted ', postId, 'with error', err);
        }
    });
}
exports.updateFollowersFeed = updateFollowersFeed;
function updateAuthorInUserReferences(userId, newUsername, photoUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const privateDataReference = index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA);
        const userFeedReference = privateDataReference.doc(userId).collection(constants_1.FEED);
        const postReference = index_1.firestoreInstance.collection(constants_1.POSTS);
        const eventReference = index_1.firestoreInstance.collection(constants_1.EVENTS);
        const updateReferences = [];
        const newAuthor = {
            username: newUsername,
            photoUrl: photoUrl,
            uid: userId
        };
        try {
            //Retrieve the user current followers to update all the references of their feeds
            const userFollowers = yield getUserFollowersIds(userId);
            //for each follower, retrieve their posts in the feed which author is our user
            userFollowers.forEach((followerId) => __awaiter(this, void 0, void 0, function* () {
                const postFeedsFromCurrentUser = yield getPostsFromUserFeedFilterByUser(userId, followerId);
                //Add the references to update the post for each user
                Array.prototype.push.apply(updateReferences, postFeedsFromCurrentUser.map(post => privateDataReference.doc(followerId).collection(constants_1.FEED).doc(post.id)));
            }));
            //Retrieve the posts created by the user and add them to the referencesMap
            const userPosts = yield getUserPostsIds(userId);
            Array.prototype.push.apply(updateReferences, userPosts.map(postId => postReference.doc(postId)));
            Array.prototype.push.apply(updateReferences, userPosts.map(postId => userFeedReference.doc(postId)));
            //Retrieve the likes done by the user and add them to the referencesMap
            const userLikes = yield getUserLikes(userId);
            Array.prototype.push.apply(updateReferences, userLikes.map(like => postReference.doc(like.data().postId).collection(constants_1.LIKES).doc(like.id)));
            //Retrieve the comments of the user and add them to the referencesMap
            const userComments = yield getUserComments(userId);
            Array.prototype.push.apply(updateReferences, userComments.map(comment => postReference.doc(comment.data().postId).collection(constants_1.COMMENTS).doc(comment.id)));
            //Retrieve the events made by the user
            const userEvents = yield getEventsMadeByUser(userId);
            Array.prototype.push.apply(updateReferences, userEvents.map(event => eventReference.doc(event.id)));
            //Generate the right amount of batches
            const batches = _.chunk(updateReferences, constants_1.MAX_BATCH_SIZE)
                .map(dataRefs => {
                const writeBatch = index_1.firestoreInstance.batch();
                dataRefs.forEach(ref => {
                    writeBatch.update(ref, 'author', newAuthor);
                });
                return writeBatch.commit();
            });
            yield Promise.all(batches);
            console.log('The author of ', userId, ' have been update in ', updateReferences.length, ' places');
        }
        catch (err) {
            console.error('There was an error trying to update the references of the user', userId, ' error: ', err);
        }
    });
}
function getUserPostsIds(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPosts = yield index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(userId).collection(constants_1.AUTHOR_OF_POSTS).get();
        return userPosts.docs.map(postSnapshot => postSnapshot.id);
    });
}
function getPostsFromUserFeedFilterByUser(userId, filterByAuthorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const feedPostsQuery = yield index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(userId).collection(constants_1.FEED)
            .where('author.uid', '==', filterByAuthorId).get();
        return feedPostsQuery.docs;
    });
}
function getUserLikes(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userLikesQuery = yield index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(userId).collection(constants_1.AUTHOR_OF_LIKES).get();
        return userLikesQuery.docs;
    });
}
function getEventsMadeByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventsMadeByUserQuery = yield index_1.firestoreInstance.collection('PrivateUserData')
            .doc(userId).collection(constants_1.EVENTS)
            .where('interactionUser', '==', userId).get();
        return eventsMadeByUserQuery.docs;
    });
}
function getUserComments(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userCommentsQuery = yield index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(userId).collection(constants_1.AUTHOR_OF_COMMENTS).get();
        return userCommentsQuery.docs;
    });
}
function getUserFollowersIds(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const followers = yield index_1.firestoreInstance.collection(constants_1.PUBLIC_USER_DATA).doc(userId).collection(constants_1.FOLLOWERS).get();
        return followers.docs.map(followerSnapshot => followerSnapshot.id);
    });
}
function getLastMonthUserPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const priorDateTimeStamp = new Date().setDate(today.getDate() - 30);
        const priorDate = new Date(priorDateTimeStamp);
        const userPostsQuery = yield index_1.firestoreInstance.collection(constants_1.PRIV_USER_DATA).doc(userId).collection(constants_1.AUTHOR_OF_POSTS)
            .where('creationDate', '>=', priorDate)
            .get();
        return userPostsQuery.docs;
    });
}
//# sourceMappingURL=index.js.map