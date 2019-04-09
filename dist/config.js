"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = {
    brokerFailoverStrategy: "round-robin",
    brokerUrl: "amqp://localhost",
    resultPersistent: false,
    resultSerializer: "json",
    taskDefaultDeliveryMode: "persistent",
    taskDefaultQueue: "celery",
    taskIgnoreResult: false,
    taskProtocol: 2,
    taskSerializer: "json",
};
var CertificationRequirement;
(function (CertificationRequirement) {
    CertificationRequirement[CertificationRequirement["None"] = 0] = "None";
    CertificationRequirement[CertificationRequirement["Optional"] = 1] = "Optional";
    CertificationRequirement[CertificationRequirement["Required"] = 2] = "Required";
})(CertificationRequirement = exports.CertificationRequirement || (exports.CertificationRequirement = {}));
//# sourceMappingURL=config.js.map