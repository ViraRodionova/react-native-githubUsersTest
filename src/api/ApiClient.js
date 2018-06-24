import appState from '../stores/appState.js';

/**
 * Core api class of connection to server
 */
export default class ApiClient {
    constructor({ prefix = '' } = {}) {
        if (!prefix) throw new Error('[prefix] required');

        this.prefix = prefix;

        const methods = [ 'get', 'post', 'put', 'patch', 'delete' ];

        methods.forEach(method => {
            this[method] = ({ requestURL, params = {}, payload = {} }) => {
                return this._request({ requestURL, method, params, payload });
            };
        });
    }

    static CONTENT_TYPES = {
        'JSON':                  'application/json; charset=utf-8',
        'X_WWW_FORM_URLENCODED': 'application/x-www-form-urlencoded; charset=utf-8'
    }

    /**
     * Core request method
     */
    async _request({ requestURL, method, payload, params }) {
        const url     = this._getUrl(requestURL);
        const headers = this._getHeadersByMethod(method);
        const body    = this._getBodyByMethod(method, payload);
        const options = { method, headers, params };

        if (method !== 'get') options.body = body;

        if (appState.isConnected) {
            const resp       = await fetch(url, options);
            const parsedResp = await resp.json();
            
            // here should also be an error handler from the server like:
            // if (parsedResp.status === 'error') {
            //  throw parsedResp.error;
            // }

            return parsedResp;
        }

        throw new Error('No internet connection');
    }

    /**
     * Sets up token for further quiries
     * @param {String} authToken token retrieved from server
     */
    setAuthToken(authToken) {
        this.authToken = authToken;
    }

    /**
     * Sets up url prefix
     * @param {String} prefix url prefix
     */
    setPrefix(prefix = '') {
        this.prefix = prefix;
    }

    /**
     * Sets up callback for errors handling
     * @param {Function} handler callback for errors handling
     */
    setErrorHandler(handler) {
        this.onError = handler;
    }

    /**
     * Returns full url
     * @param {String} url url path
     * @returns {String}
     */
    _getUrl(url) {
        return `${this.prefix}/${url}`;
    }

    /**
     * Returns encoded body by method
     * @param {String} method http method
     * @param {*} payload     payload object
     * @returns {String}
     */
    _getBodyByMethod(method, payload) {
        return this._getBodyByContentType(this._getContentTypeByMethod(method), payload);
    }

    /**
     * Returns encoded body by content type
     * @param {String} contentType content type of body
     * @param {*} payload          payload object
     * @returns {String}
     */
    _getBodyByContentType(contentType, payload) {
        return contentType === ApiClient.CONTENT_TYPES.JSON
            ? JSON.stringify(payload)
            : this._encodeQueryString(payload);
    }

    /**
     * Returns headers by method
     * @param {String} method http method
     * @returns {*}
     */
    _getHeadersByMethod(method) {
        return {
            'Content-Type': this._getContentTypeByMethod(method),
            'X-AuthToken':  this.authToken
        };
    }

    /**
     * Returns content type by method
     * @param {String} method http method
     * @returns {String}
     */
    _getContentTypeByMethod(method) {
        return method.toLowerCase() === 'get'
            ? ApiClient.CONTENT_TYPES.X_WWW_FORM_URLENCODED
            : ApiClient.CONTENT_TYPES.JSON
    }

    /**
     * Converts payload object to query string
     * @param {*} payload payload object
     */
    _encodeQueryString(payload) {
        return Object.keys(payload).map(key => `${key}=${payload[key]}`).join('&');
    }
}
