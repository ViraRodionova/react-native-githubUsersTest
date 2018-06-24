import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { observer, inject } from 'mobx-react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Image
} from 'react-native';

import ListItem from './ListItem.js';

import styles from './UsersScreenStyles.js';

@inject('appState', 'users')
@observer
export default class UsersScreen extends Component {
    static propsTypes = {
        users     : PropTypes.object.isRequired,
        appState  : PropTypes.object.isRequired,
        navigator : PropTypes.object.isRequired,
        pageType  : PropTypes.oneOf([ 'users', 'followers' ])
    };

    static defaultProps = {
        pageType : 'users'
    };

    state = {
        isLoading : false
    };

    handleOnEndReached = async () => {
        const { pageType, users } = this.props;

        if (pageType === 'users' && users.users.length && !this.state.isLoading) {
            this.setState({ isLoading: true });
            await users.loadMoreUsers();
            this.setState({ isLoading: false });
        }
    }

    componentDidMount() {
        this.props.appState.startListeningConnection();
        if (this.props.pageType === 'users') this.props.users._prepare();
    }

    componentWillUnmount() {
        this.props.users.clearActiveUser();
    }

    handleListItemPressed = async (id) => {
        if (this.props.pageType === 'users') {
            this.props.users.setActiveUser(id);

            this.props.navigator.push({
                screen           : 'testApp.UsersScreen',
                title            : 'Followers',
                passProps        : {
                    pageType : 'followers'
                },
                animated         : true,
                animationType    : 'slide-horizontal',
                backButtonHidden : false
            });
        }
    }

    keyExtractor = (item) => item.html_url;

    renderListItem = ({ item }) => {
        const { pageType } = this.props;

        return (
            <ListItem
                data      = {item}
                showArrow = {pageType === 'users'}
                onPress   = {this.handleListItemPressed}
            />
        );
    }

    renderListSeparator = () => <View style={styles.separator} />

    renderList = () => {
        const data = this.getUsersList();

        return (
            <FlatList
                data                   = {data}
                renderItem             = {this.renderListItem}
                keyExtractor           = {this.keyExtractor}
                ItemSeparatorComponent = {this.renderListSeparator}
                onEndReachedThreshold  = {0.7}
                onEndReached           = {this.handleOnEndReached}
            />
        );
    }

    renderLoader = () => {
        return (
            <View style={styles.loader}>
                {this.props.appState.isConnected
                    ? <ActivityIndicator size='large' color='grey' />
                    : <Text>{'No internet connection'}</Text>
                }
            </View>
            );
    }

    getUsersList = () => {
        const { pageType } = this.props;
        const { users, followers } = this.props.users;

        return pageType === 'followers'
            ? followers
            : users;
    }

    renderBody = () => {
        return this.getUsersList().length
            ? this.renderList()
            : this.renderLoader();
    }

    renderUserInfo = () => {
        const { pageType } = this.props;
        const { activeUser } = this.props.users;
        const { login, avatar_url, html_url } = activeUser || {};

        return activeUser && pageType === 'followers'
            ? (
                <View style={styles.userInfoContainer}>
                    <Image source={{ uri: avatar_url }} style={styles.avartarImage} />
                    <Text style={styles.loginLabel}>{login}</Text>
                    <Text style={styles.urlLabel}>{html_url}</Text>
                </View>
            )
            : null;
    }

    renderBottomLoader = () => {
        return this.state.isLoading
            ? (
                <View style={styles.bottomLoader}>
                    <ActivityIndicator size='small' color='grey' />
                </View>)
            : null;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderUserInfo()}
                {this.renderBody()}
                {this.renderBottomLoader()}
            </View>
        );
    }
}