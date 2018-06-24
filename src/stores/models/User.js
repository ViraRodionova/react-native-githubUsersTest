import { types } from 'mobx-state-tree';

const User = types.model('User', {
    id            : types.identifier(types.number),
    login         : types.string,
    avatar_url    : types.maybe(types.string),
    html_url      : types.string,
    followers_url : types.string
});

export default User;
