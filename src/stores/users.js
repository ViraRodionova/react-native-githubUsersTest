import { types, flow, getSnapshot } from 'mobx-state-tree';

import api from '../apiSingleton.js';

import User from './models/User.js';

const properties = {
    users      : types.array(User),
    followers  : types.array(User),
    activeUser : types.maybe(types.reference(User))
};

const initialState = {
    users      : [],
    followers  : [],
    activeUser : null
};

const actions = self => ({
    load : flow(function* load(offset = 0, limit = 30) {
        let users = [];
        try {
            users = yield api.users.list(offset, limit);
        } catch (error) {
            console.log('UsersStoreError - load(): ', error);
        } finally {
            return users;
        }
    }),
    loadMoreUsers : flow(function* load(limit = 30) {
        const users = yield self.load(self.users[self.users.length - 1].id, limit);

        self.users = [ ...self.users, ...users ];
    }),
    loadFollowers : flow(function* loadFollowers() {
        let followers = [];
        try {
            followers = self.activeUser
                ? yield api.users.followers(self.activeUser.login)
                : [];
        } catch (error) {
            console.log('UsersStoreError - loadFollowers(): ', error);
        } finally {
            return followers;
        }
    }),
    setActiveUser : flow(function* setActiveUser(id) {
        self.activeUser = id;
        self.followers  = yield self.loadFollowers();
    }),
    clearActiveUser() {
        self.activeUser = null;
        self.followers  = [];
    },
    _prepare : flow(function* _prepare() {
        self.users = yield self.load();
        // console.warn('users', self.users.length);
        
    }),
    _clearStore(keysToLeave = []) {
        Object.keys(initialState).forEach(k => {
            if (!keysToLeave.includes(k)) self[k] = initialState[k];
        });
    }
});

const UsersStore = types
    .model(properties)
    .actions(actions)
    .create(initialState);

export default UsersStore;
