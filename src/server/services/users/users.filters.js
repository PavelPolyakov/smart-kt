/* eslint no-console: 1 */

module.exports = {
    patched: [
        function (data, connection, hook) { // eslint-disable-line no-unused-vars
            if(connection.user._id !== data._id) {
                return false;
            }

            return data;
        }
    ]
}
