"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_parser_1 = require("../../query_parser");
const utility_1 = require("../../utility");
exports.parseRedisQuery = (uri) => {
    if (utility_1.isNullOrUndefined(uri.query)) {
        return {};
    }
    const parser = new query_parser_1.QueryParser([
        { source: "password" },
        query_parser_1.createBooleanQueryDescriptor("noDelay"),
    ]);
    return parser.parse(uri.query, {});
};
//# sourceMappingURL=common.js.map