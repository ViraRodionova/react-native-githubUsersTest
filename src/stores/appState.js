import { NetInfo }     from 'react-native';
import { types, flow } from 'mobx-state-tree';

const properties = {
    isConnected : types.boolean
};

const initialState = {
    isConnected : true
};

const actions = self => ({
    startListeningConnection : flow(function* startListeningConnection() {
        self.changeConnectionStatus(yield NetInfo.isConnected.fetch());

        NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
            self.changeConnectionStatus(isConnected);
        });
    }),
    getConnectionStatus : flow(function* getConnectionStatus() {
        return yield NetInfo.isConnected.fetch();
    }),
    changeConnectionStatus(isConnected) {
        self.isConnected = isConnected;
    },
    _prepare : flow(function* _prepare() {
        yield slef.startListeningConnection();
    }),
    _clearStore(keysToLeave = []) {
        Object.keys(initialState).forEach(k => {
            if (!keysToLeave.includes(k)) self[k] = initialState[k];
        });
    }
});

const AppStateStore = types
    .model(properties)
    .actions(actions)
    .create(initialState);

export default AppStateStore;
