import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    TouchableWithoutFeedback,
    View,
    Image,
    Text
} from 'react-native';

import images from '../../assets';

import { debounceLast } from '../../utils/debounce.js';

import styles from './UsersScreenStyles';

export default class ListItem extends PureComponent {
    static propTypes = {
        data      : PropTypes.object.isRequired,
        showArrow : PropTypes.bool,
        onPress   : PropTypes.func
    };

    static defaultProps = {
        showArrow : true,
        onPress   : () => {}
    };

    handlePress = () => {
        const { data, onPress } = this.props;

        onPress(data.id);
    }

    render() {
        const { login, avatar_url, html_url } = this.props.data;
        const { showArrow } = this.props;

        return (
            <TouchableWithoutFeedback onPress={debounceLast.delay(this.handlePress)}>
                <View style={styles.listItemContainer}>
                    <Image source={{ uri: avatar_url }} style={styles.avartarImage} />
                    <View style={styles.labelsContainer}>
                        <Text style={styles.loginLabel}>{login}</Text>
                        <Text style={styles.urlLabel}>{html_url}</Text>
                    </View>
                    {showArrow ? <Image source={images.arrow} style={styles.arrowImage} /> : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }
};