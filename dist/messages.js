"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["Failure"] = "FAILURE";
    Status["Pending"] = "PENDING";
    Status["Received"] = "RECEIVED";
    Status["Retry"] = "RETRY";
    Status["Revoked"] = "REVOKED";
    Status["Started"] = "STARTED";
    Status["Success"] = "SUCCESS";
})(Status = exports.Status || (exports.Status = {}));
var ContentTypeMime;
(function (ContentTypeMime) {
    ContentTypeMime["Json"] = "application/json";
    ContentTypeMime["Yaml"] = "application/x-yaml";
})(ContentTypeMime = exports.ContentTypeMime || (exports.ContentTypeMime = {}));
var ContentEncodingMime;
(function (ContentEncodingMime) {
    ContentEncodingMime["Utf8"] = "utf-8";
    ContentEncodingMime["Base64"] = "base64";
})(ContentEncodingMime = exports.ContentEncodingMime || (exports.ContentEncodingMime = {}));
var CompressionMime;
(function (CompressionMime) {
    CompressionMime["Zlib"] = "application/x-gzip";
})(CompressionMime = exports.CompressionMime || (exports.CompressionMime = {}));
//# sourceMappingURL=messages.js.map