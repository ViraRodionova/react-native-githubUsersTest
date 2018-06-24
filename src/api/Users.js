import Base from './Base.js';

export default class UsersAPI extends Base {
    async list(offset, limit) {
        return this.apiClient.get({
            requestURL : `users?since=${offset}&per_page=${limit}`
        });
    }

    async followers(login) {
        return this.apiClient.get({
            requestURL : `users/${login}/followers`
        });
    }
}