import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ww = width;
export const wh = height;

export default {
    ww,
    wh
};