"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const utility_1 = require("./utility");
const Fs = require("fs");
class QueryParser {
    constructor(descriptors) {
        const withParsers = QueryParser.assertParsers(descriptors);
        const withTargets = QueryParser.assertTargets(withParsers);
        const asPairs = QueryParser.intoPairs(withTargets);
        this.functions = new Map(asPairs);
    }
    parse(query, init) {
        const entries = Array.from(this.functions.entries());
        const hasSource = createSourceChecker(query);
        const withSources = entries.filter(hasSource);
        const appendParsed = createParsedAppender(query);
        const doParse = (value) => withSources.reduce(appendParsed, value);
        try {
            return doParse(init);
        }
        catch (error) {
            throw new errors_1.ParseError(`query parsing failed: ${error}`);
        }
    }
    static assertParsers(maybe) {
        return maybe.map((descriptor) => {
            if (!utility_1.isNullOrUndefined(descriptor.parser)) {
                return descriptor;
            }
            const withParser = Object.assign({}, descriptor, { parser: (raw) => raw });
            return withParser;
        });
    }
    static assertTargets(maybe) {
        return maybe.map((descriptor) => {
            if (!utility_1.isNullOrUndefined(descriptor.target)) {
                return descriptor;
            }
            const withTarget = Object.assign({}, descriptor, { target: descriptor.source });
            return withTarget;
        });
    }
    static intoPairs(descriptors) {
        return descriptors.map((descriptor) => [
            descriptor.source,
            { target: descriptor.target, parser: descriptor.parser }
        ]);
    }
}
exports.QueryParser = QueryParser;
exports.createBooleanQueryDescriptor = (source, target) => ({
    parser: (x) => utility_1.parseBoolean(exports.asScalar(x)),
    source,
    target,
});
exports.createIntegerQueryDescriptor = (source, target) => ({
    parser: (x) => utility_1.parseInteger(exports.asScalar(x)),
    source,
    target,
});
exports.createPathArrayQueryDescriptor = (source, target) => ({
    parser: (x) => exports.asArray(x).map((p) => Fs.readFileSync(p)),
    source,
    target,
});
exports.createPathQueryDescriptor = (source, target) => ({
    parser: (x) => Fs.readFileSync(exports.asScalar(x)),
    source,
    target,
});
exports.asScalar = (scalarOrArray) => {
    if (scalarOrArray instanceof Array) {
        const array = scalarOrArray;
        return array[array.length - 1];
    }
    const scalar = scalarOrArray;
    return scalar;
};
exports.asArray = (scalarOrArray) => {
    if (scalarOrArray instanceof Array) {
        const array = scalarOrArray;
        return array;
    }
    const scalar = scalarOrArray;
    return [scalar];
};
const createSourceChecker = (query) => ([source, _]) => !utility_1.isNullOrUndefined(query[source]);
const createParsedAppender = (query) => (previous, [source, { target, parser }]) => {
    const withParsed = Object.assign({}, previous, { [target]: parser(query[source]) });
    return withParsed;
};
//# sourceMappingURL=query_parser.js.map