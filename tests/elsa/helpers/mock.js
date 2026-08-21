function createMockRes() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
}

function createMockReq({ headers = {}, user } = {}) {
    return {
        headers,
        header(name) {
            return headers[name.toLowerCase()];
        },
        user
    };
}

module.exports = { createMockReq, createMockRes };
