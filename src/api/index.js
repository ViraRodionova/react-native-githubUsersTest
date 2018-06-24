import ApiClient from './ApiClient';

import UsersAPI from './Users.js';

export default function apiConstruct(config) {
    if (!config || !config.apiPrefix) throw new Error('[config.apiPrefix] required');

    const api = new ApiClient({ prefix: config.apiPrefix });

    return {
        apiClient : api,
        users     : new UsersAPI({ apiClient: api })
    };
}
