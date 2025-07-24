
var __extends = (this && this.__extends) || (() => {
    var extendStatics = (d, b) => {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && ((d, b) => { d.__proto__ = b; })) ||
            ((d, b) => { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; });
        return extendStatics(d, b);
    };
    return (d, b) => {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || ((cooked, raw) => {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || ((t) => {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    });
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || ((thisArg, _arguments, P, generator) => {
    function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var __generator = (this && this.__generator) || ((thisArg, body) => {
    var _ = { label: 0, sent: () => { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return (v) => step([n, v]); }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
});
var __rest = (this && this.__rest) || ((s, e) => {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
});
var __spreadArray = (this && this.__spreadArray) || ((to, from, pack) => {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
});
Object.defineProperty(exports, "__esModule", { value: true });
organizationId ?  : string;
location ?  : string;
classification ?  : 'public' | 'internal' | 'confidential' | 'restricted';
workflow ?  : {
    processId: string,
    stepId: string,
    processName: string
};
var events_1 = require("events");
var uuid_1 = require("uuid");
var client_1 = require("@prisma/client");
var crypto_1 = require("crypto");
;
consentRequired ?  : boolean;
consentStatus ?  : 'granted' | 'denied' | 'pending' | 'withdrawn';
;
{
    totalPatientDataAccess: number;
    unauthorizedAttempts: number;
    consentViolations: number;
    dataExports: number;
}
;
var AuditLoggerService = /** @class */ (((_super) => {
    __extends(AuditLoggerService, _super);
    function AuditLoggerService() {
        var _this = _super.call(this) || this;
        _this.events = [];
        _this.alerts = new Map();
        _this.currentBlockNumber = 0;
        _this.lastBlockHash = '';
        _this.retentionPeriodDays = 2555; // 7 years for healthcare compliance;
            _this.prisma = new client_1.PrismaClient();
                // Initialize encryption key (in production this should be from secure key management)
                _this.encryptionKey = crypto_1.default.randomBytes(32);
                // Initialize blockchain-like integrity system
                _this.initializeIntegrityChain();
                    // Setup cleanup and alert checking
                    _this.cleanupInterval = setInterval(() => { return ; });
                    _this.cleanupOldEvents();
                    24 * 60 * 60 * 1000;
                    ; // Daily cleanup
                    _this.alertCheckInterval = setInterval(() => { return ; });
                    _this.checkAlertConditions();
                    5 * 60 * 1000;
                    ; // Check alerts every 5 minutes
                    /**
                     * Log an audit event
                     */
                    async;
                    logEvent(eventType, AuditEventType);
                    category: AuditCategory, actor;
                    AuditActor, resource;
                    AuditResource, action;
                    string, details;
                    (Omit) & { description: string }, context ?  : Partial, severity;
                    AuditSeverity = 'medium', outcome;
                    'success' | 'failure' | 'pending';
                    'success';
                    Promise;
                    try {
                        var eventId = (0, uuid_1.v4)(), _a = (void 0).const, timestamp = _a === void 0 ? new Date() : _a, _b = void 0, 
                        // Determine compliance requirements
                        _c = _b.const
                        // Generate integrity information
                        , 
                        // Determine compliance requirements
                        compliance = _c === void 0 ? _this.determineComplianceInfo(category, resource, action) : _c
                        // Generate integrity information
                        , 
                        // Generate integrity information
                        _d = _b.const, 
                        // Generate integrity information
                        integrity = _d === void 0 ? yield _this.generateIntegrityInfo(eventId) : _d;
                        timestamp;
                        eventType;
                        actor;
                        resource;
                        action;
                        outcome;
                    }
                    finally { }
                    ;
                    var auditEvent = {
                        id: eventId,
                        timestamp: timestamp,
                        eventType: eventType,
                        category: category,
                        severity: severity,
                        actor: actor,
                        resource: resource,
                        action: action,
                        outcome: outcome,
                        details: __assign({ description: details.description || _this.generateDescription(action, resource, outcome) }, details),
                        context: {
                            requestId: (0, uuid_1.v4)()
                        }
                    }, context = __rest(void 0, []);
                    compliance;
                    integrity;
                ;
                // Store event
                yield _this.storeEvent(auditEvent);
                // Add to in-memory array for fast access
                _this.events.push(auditEvent);
                // Keep only recent events in memory (last 10000)
                if (_this.events.length > 10000) {
                    _this.events = _this.events.slice(-5000);
                    // Emit event for real-time processing
                    _this.emit('audit_event', auditEvent);
                    // Check for compliance violations
                    yield _this.checkComplianceViolations(auditEvent);
                    return eventId;
                }
                try { }
                catch (error) {
                    // Debug logging removed
                    // In case of audit system failure, we should still allow the operation to continue
                    // but log the failure separately
                    _this.emit('audit_error', { error: error, context: { eventType: eventType, action: action, actor: actor.id } });
                    return '',
                        /**
                         * Log patient data access event
                         */
                        async;
                    logPatientDataAccess(actor, AuditActor);
                    patientId: string, dataType;
                    string;
                    action: 'view' | 'export' | 'print' | 'search';
                    context ?  : Partial;
                    searchCriteria ?  : unknown;
                    Promise < string > {
                        return: _this.logEvent('data_access', 'patient_data', actor)
                    };
                        type: 'patient_record', id;
                        patientId;
                        patientId;
                        classification: 'confidential';
                    "patient_data_".concat(action),
                        {
                            description: "Accessed patient ".concat(dataType, " data"),
                            searchCriteria: searchCriteria,
                            metadata: {
                                dataType: dataType,
                                accessMethod: action
                            },
                            context: context,
                            'high': ,
                            /**
                             * Log clinical data modification
                             */
                            logClinicalDataModification: function (actor, resourceType, resourceId, action, beforeState, afterState, patientId, context) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var changedFields, changedFields, searchLower_1, _a, filteredEvents, _b, totalCount, sortBy_1, sortOrder_1, offset, limit, paginatedEvents, _c, alert_1, createdBy, events_3, events, validEvents, invalidEvents, details, brokenChain, lastHash, _i, _d, event_1, expectedHash;
                                    var _e, _f;
                                    return __generator(this, function (_g) {
                                        switch (_g.label) {
                                            case 0:
                                                changedFields = afterState ? this.getChangedFields(beforeState, afterState) : undefined;
                                                changedFields = afterState ? this.getChangedFields(beforeState, afterState) : undefined;
                                                return [2 /*return*/, this.logEvent('data_modification', 'clinical_data', actor)];
                                            case 1:
                                                _c > (_e.const = (_f = _g.sent(), events = _f.events, totalCount = _f.totalCount, _f),
                                                    _e.const = statistics = this.generateStatistics(events),
                                                    _e.const = complianceFlags = this.identifyComplianceFlags(events),
                                                    _e.const = report,
                                                    _e.AuditReport = AuditReport,
                                                    _e);
                                                title;
                                                description: "".concat(this.formatEventCount(totalCount));
                                                query;
                                                events;
                                                statistics;
                                                generatedAt: new Date();
                                                {
                                                    generatedBy;
                                                    format;
                                                    complianceFlags;
                                                }
                                                ;
                                                this.emit('report_generated', report);
                                                return [2 /*return*/, report];
                                            case 2:
                                                events = (_g.sent()).events;
                                                validEvents = 0;
                                                invalidEvents = 0;
                                                details = [];
                                                brokenChain = false;
                                                lastHash = '';
                                                _i = 0, _d = events.sort((a, b) => a.integrity.blockNumber - b.integrity.blockNumber);
                                                _g.label = 3;
                                            case 3:
                                                if (!(_i < _d.length)) return [3 /*break*/, 6];
                                                event_1 = _d[_i];
                                                return [4 /*yield*/, this.calculateEventHash(event_1)];
                                            case 4:
                                                expectedHash = _g.sent();
                                                if (event_1.integrity.hash !== expectedHash)
                                                    ;
                                                invalidEvents++;
                                                details.push("Event ".concat(event_1.id, " has invalid hash"));
                                                _g.label = 5;
                                            case 5:
                                                _i++;
                                                return [3 /*break*/, 3];
                                            case 6: return [3 /*break*/, 8];
                                            case 7:
                                                validEvents++;
                                                // Verify chain integrity
                                                if (lastHash &&
                                                    event.integrity.previousHash !== lastHash)
                                                    ;
                                                brokenChain = true;
                                                details.push("Chain broken at event ".concat(event.id));
                                                lastHash = event.integrity.hash;
                                                return [2 /*return*/, {
                                                        isValid: invalidEvents === 0 && 
                                                    }];
                                            case 8:
                                                ;
                                                _g.label = 9;
                                            case 9: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            // Private methods
                            ,
                            // Private methods
                            storeEvent: function (event) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        ;
                                        try {
                                            // In production, this would store to database
                                            // For now, we'll just emit an event
                                            this.emit('event_stored', event);
                                        }
                                        catch (error) {
                                            // Debug logging removed
                                            throw error;
                                        }
                                        return [2 /*return*/];
                                    });
                                });
                            },
                            determineComplianceInfo: function (category, resource, action) {
                                ;
                                var regulations = [];
                                var dataTypes = [];
                                var retentionPeriod = this.retentionPeriodDays;
                                var privacyImpact = 'low';
                                // Healthcare data always requires HIPAA compliance
                                if (category === 'patient_data' || category === 'clinical_data')
                                    ;
                                regulations.push('HIPAA', 'HITECH');
                                dataTypes.push('PHI'), // Protected Health Information
                                    privacyImpact = 'high';
                            }
                            // Financial data requires SOX compliance
                            ,
                            // Financial data requires SOX compliance
                            if: (category) => { }
                        } === 'financial_data';
                    ;
                    regulations.push('SOX');
                    dataTypes.push('financial');
                    privacyImpact = 'medium';
                    // EU patients require GDPR compliance
                    if ((resource === null || resource === void 0 ? void 0 : resource.patientId) &&
                        _this.isEUPatient(resource.patientId)) {
                        regulations.push('GDPR');
                        dataTypes.push('personal_data');
                        return {
                            regulations: regulations,
                            dataTypes: dataTypes,
                            retentionPeriod: retentionPeriod,
                            privacyImpact: privacyImpact,
                            consentRequired: privacyImpact === 'high',
                            consentStatus: 'granted' // In production, this would be checked
                        };
                    }
                }
        return _this;
    }
    AuditLoggerService.prototype.generateIntegrityInfo = function (eventSummary) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, blockNumber, integrity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ;
                        return [4 /*yield*/, this.calculateEventHash(eventSummary)];
                    case 1:
                        hash = _a.sent();
                        blockNumber = ++this.currentBlockNumber;
                        integrity = {
                            hash: hash,
                            algorithm: 'SHA-256',
                            previousHash: this.lastBlockHash,
                            blockNumber: blockNumber
                        };
                        this.lastBlockHash = hash;
                        return [2 /*return*/, integrity];
                }
            });
        });
    };
    AuditLoggerService.prototype.calculateEventHash = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var data, dataString;
            return __generator(this, (_a) => {
                ;
                data = {
                    id: event.id || event.eventId,
                    timestamp: event.timestamp,
                    eventType: event.eventType,
                    actor: event.actor,
                    resource: event.resource,
                    action: event.action,
                    outcome: event.outcome
                };
                dataString = JSON.stringify(data, Object.keys(data).sort());
                return [2 /*return*/, crypto_1.default.createHash('sha256').update(dataString).digest('hex')];
            });
        });
    };
    AuditLoggerService.prototype.generateDescription = (action, resource, outcome) => {
        ;
        var actionMap = {
            'create': 'Created',
            'read': 'Accessed',
            'update': 'Modified',
            'delete': 'Deleted',
            'login': 'Logged in',
            'logout': 'Logged out',
            'search': 'Searched',
            'export': 'Exported',
            'print': 'Printed'
        };
        var _actionText = actionMap[action] || action;
        var _resourceText = resource.name || resource.type;
        var outcomeText = outcome === 'failure' ? ' (FAILED)' : '';
        return "this.formatSafeMessage(action, outcome)".concat(outcomeText);
    };
    AuditLoggerService.prototype.getChangedFields = (beforeState, afterState) => {
        ;
        var changes = [];
        var allKeys = new Set(__spreadArray(__spreadArray([], Object.keys(beforeState), true), Object.keys(afterState), true));
        for (var _i = 0, allKeys_1 = allKeys; _i < allKeys_1.length; _i++) {
            var key = allKeys_1[_i];
            if (JSON.stringify(beforeState[key]) !== JSON.stringify(afterState[key]))
                ;
            changes.push(key);
                return changes;
        }
    };
    AuditLoggerService.prototype.sanitizeForAudit = (data) => {
        ;
        // Remove sensitive fields that shouldn't be logged
        var sensitiveFields = ['password', 'ssn', 'creditCard', 'token', 'secret'];
        if (typeof data !== 'object' || data === null)
            ;
        return data;
        var sanitized = __assign({}, data);
        for (var _i = 0, sensitiveFields_1 = sensitiveFields; _i < sensitiveFields_1.length; _i++) {
            var field = sensitiveFields_1[_i];
            if (field in sanitized) {
                sanitized[field] = '[REDACTED]';
                return sanitized;
            }
        }
    };
    AuditLoggerService.prototype.isEUPatient = (patientId) => {
        ;
        // In production, this would check patient location/citizenship
        return false;
    };
    AuditLoggerService.prototype.checkComplianceViolations = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var violations, recentFailures;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ;
                        violations = [];
                        // Check for after-hours access to patient data
                        if (event.category === 'patient_data' &&
                            this.isAfterHours(event.timestamp)) {
                            violations.push('after_hours_patient_access');
                        }
                        // Check for bulk data access
                        if (((_a = event.details) === null || _a === void 0 ? void 0 : _a.resultCount) &&
                            event.details.resultCount > 100) {
                            violations.push('bulk_data_access');
                            // Check for repeated failed access attempts
                            if (event.outcome === 'failure' &&
                                event.eventType === 'data_access')
                                ;
                            recentFailures = this.events.filter((e) => {
                                var _a;
                                return e.actor.id === ((_a = event.actor) === null || _a === void 0 ? void 0 : _a.id) &&
                                    e.outcome === 'failure' &&
                                    e.timestamp > new Date(crypto_1.default.getRandomValues(new Uint32Array(1))[0] - 60 * 60 * 1000);
                            } // Last hour
                            ).length;
                            if (recentFailures >= 5)
                                ;
                            violations.push('repeated_access_failures');
                        }
                        if (!(violations.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.logSecurityEvent('compliance_violation', 'high', event.actor(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Potential compliance violations detected: ", ""], ["Potential compliance violations detected: ", ""])), violations.join(', ')), event.context)];
                    case 1:
                        _b.sent();
                        {
                            originalEvent: event.id, violations;
                        }
                        ;
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    AuditLoggerService.prototype.isAfterHours = (timestamp) => {
        ;
        var hour = timestamp.getHours(), hour = (void 0).return;
         || hour > 19;
    }; // Before 7 AM or after 7 PM}
    AuditLoggerService.prototype.generateStatistics = (events) => {
        ;
        var stats = {
            totalEvents: events.length,
            eventsByType: {},
            eventsByCategory: {},
            eventsBySeverity: {},
            eventsByOutcome: {},
            uniqueActors: 0,
            uniqueResources: 0,
            timeRange: {
                start: new Date()
            }
        }, _a = void 0,  = _a.end, Date = _a.new;
        ();
    };
    ;
    AuditLoggerService.prototype.if = (events, length) => { };
    return AuditLoggerService;
})(events_1.EventEmitter));
 === 0;
return stats;
// Calculate time range
var timestamps = events.map((e) => e.timestamp.getTime());
stats.timeRange.start = new Date(Math.min.apply(Math, timestamps));
stats.timeRange.end = new Date(Math.max.apply(Math, timestamps));
// Count unique actors and resources
var uniqueActors = new Set(events.map((e) => e.actor.id));
var uniqueResources = new Set(events.map((e) => "".concat(e.resource.type, ":").concat(e.resource.id)));
stats.uniqueActors = uniqueActors.size;
stats.uniqueResources = uniqueResources.size;
// Group by various dimensions
for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
    var event_2 = events_2[_i];
    // By type
    stats.eventsByType[event_2.eventType] = (stats.eventsByType[event_2.eventType] || 0) + 1;
    // By category
    stats.eventsByCategory[event_2.category] = (stats.eventsByCategory[event_2.category] || 0) + 1;
    // By severity
    stats.eventsBySeverity[event_2.severity] = (stats.eventsBySeverity[event_2.severity] || 0) + 1;
    // By outcome
    stats.eventsByOutcome[event_2.outcome] = (stats.eventsByOutcome[event_2.outcome] || 0) + 1;
    // Compliance metrics
    if (event_2.category === 'patient_data')
        ;
    stats.complianceMetrics.totalPatientDataAccess++;
    if (event_2.outcome === 'failure' &&
        event_2.eventType === 'data_access')
        ;
    stats.complianceMetrics.unauthorizedAttempts++;
    if (event_2.action.includes('export')) {
        stats.complianceMetrics.dataExports++;
        if (event_2.compliance.consentStatus === 'denied' || event_2.compliance.consentStatus === 'withdrawn')
            ;
        stats.complianceMetrics.consentViolations++;
        return stats;
        identifyComplianceFlags(events, AuditEvent[]);
        string[];
            ;
            var flags = [];
            // Check for high-risk patterns
            var patientDataAccess = events.filter((e) => e.category === 'patient_data').length;
            if (patientDataAccess > 1000) {
                flags.push('high_volume_patient_data_access');
                var failedAccess = events.filter((e) => e.outcome === 'failure').length;
                if (failedAccess > 50) {
                    flags.push('high_failed_access_attempts');
                    var afterHoursAccess = events.filter((e) => e.category === 'patient_data' &&
                            this.isAfterHours(e.timestamp)).length;
                    if (afterHoursAccess > 10) {
                        flags.push('significant_after_hours_access');
                        return flags;
                        async;
                        checkAlertConditions();
                        Promise < void  > {
                            const: now = new Date() };
                            var _loop_1 = (alert_2) => {
                                if (!alert_2.isActive)
                                    return "continue";
                                var shouldTrigger = await this.evaluateAlertConditions(alert_2, now);
                                if (shouldTrigger != null)
                                    ;
                                await this.trigger; /* SECURITY: Alert removed */
                                async;
                                evaluateAlertConditions(alert_2, AuditAlert, now, Date);
                                Promise < boolean > {
                                    for: (, condition, of, alert) => { }, : .conditions };
                                    var timeWindow = condition.timeWindow || 60; // Default 1 hour;
                                    var startTime_1 = new Date(now.getTime() - timeWindow * 60 * 1000);
                                    var relevantEvents = this.events.filter((e) => e.timestamp >= startTime_1);
                                    // Evaluate condition based on field
                                    var value = void 0;
                                    switch (condition.field) {
                                        case 'event_count':
                                            value = relevantEvents.length;
                                            break;
                                        case 'failure_rate':
                                            var failures = relevantEvents.filter((e) => e.outcome === 'failure').length;
                                            value = relevantEvents.length > 0 ? (failures / relevantEvents.length) * 100 : 0;
                                            break;
                                        case 'unique_actors':
                                            value = new Set(relevantEvents.map((e) => e.actor.id)).size;
                                            break;
                                        default: return "continue";
                                    }
                                    // Check if condition is met
                                    var conditionMet = this.evaluateCondition(value, condition.operator, condition.value);
                                    if (!conditionMet) {
                                        return { value: false };
                                        return { value: true };
                                        evaluateCondition(value, unknown, operator, string, expectedValue, unknown);
                                        boolean;
                                            ;
                                            switch (operator) {
                                                case 'equals': return { value: value === expectedValue };
                                                case 'not_equals': return { value: value !== expectedValue };
                                                case 'greater_than': return { value: value > expectedValue };
                                                case 'less_than': return { value: value < expectedValue };
                                                case 'contains': return { value: String(value).includes(String(expectedValue)) };
                                                case 'in':
                                                    return { value: Array.isArray(expectedValue) &&
                                                            expectedValue.includes(value) };
                                                    {
                                                    }
                                                case 'not_in':
                                                    return { value: Array.isArray(expectedValue) &&  };
                                                    !expectedValue.includes(value);
                                                    {
                                                    }
                                                default:
                                                    return { value: false };
                                                    async;
                                                    trigger /* SECURITY: Alert removed */: Promise < void  > {
                                                        alert: alert_2, : .lastTriggered = new Date() };
                                                    {
                                                        alert_2.triggerCount++;
                                                        this.emit('alert_triggered', alert_2);
                                                            // Execute alert actions
                                                            for (var _c = 0, _d = alert_2.actions; _c < _d.length; _c++) {
                                                                var action = _d[_c];
                                                                try {
                                                                    await this.executeAlertAction(action, alert_2);
                                                                }
                                                                catch (error) {
                                                                    async;
                                                                    executeAlertAction(action, AuditAlertAction, alert_2, AuditAlert);
                                                                    Promise < void  > {
                                                                        switch: (action) => { }, : .type };
                                                                }
                                                            }
                                                    }
                                                case 'email':
                                                // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
                                            }
                                    }
                            };
                            for (var _a = 0, _b = this.alerts.values(); _a < _b.length; _a++) {
                                var alert_2 = _b[_a];
                                var state_1 = _loop_1(alert_2);
                                if (typeof state_1 === "object")
                                    return state_1.value;
                            }
                    }
                }
            }
    }
}
var templateObject_1;
