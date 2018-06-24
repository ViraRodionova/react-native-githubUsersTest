import { StyleSheet } from 'react-native';

import { ww } from '../../utils/platform.js';

export default StyleSheet.create({
    container : {
        flex : 1
    },
    loader : {
        flex           : 1,
        justifyContent : 'center',
        alignItems     : 'center'
    },
    bottomLoader : {
        padding : 10
    },
    listItemContainer : {
        flexDirection : 'row',
        alignItems    : 'center',
        padding       : 10
    },
    avartarImage : {
        width        : 100,
        height       : 100,
        borderRadius : 8,
        resizeMode   : 'contain'
    },
    labelsContainer : {
        marginHorizontal : 10,
        width            : ww - 160,
        height           : '100%'
    },
    loginLabel : {
        fontSize     : 16,
        fontWeight   : 'bold',
        marginBottom : 7
    },
    urlLabel : {
        opacity : 0.75
    },

    arrowImage : {
        width      : 20,
        height     : 20,
        resizeMode : 'contain'
    },
    separator : {
        width           : '100%',
        height          : StyleSheet.hairlineWidth,
        backgroundColor : 'black',
        opacity         : 0.5
    },

    userInfoContainer : {
        alignItems        : 'center',
        padding           : 10,
        borderBottomWidth : 2
    }
});