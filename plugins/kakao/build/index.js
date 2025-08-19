"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuth = void 0;
const withKakao_1 = require("./withKakao");
const withAuth = (config, { kakao, facebook }) => {
    if (kakao) {
        config = (0, withKakao_1.withKakao)(config, kakao);
    }
    if (facebook) { }
    return config;
};
exports.withAuth = withAuth;
exports.default = exports.withAuth;
