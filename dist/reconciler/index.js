"use strict";
// Reconciler: index.js
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var errors_1 = require("../errors");
var utils_1 = require("../utils");
var Client = __importStar(require("rosetta-node-sdk-client"));
var sleep_1 = __importDefault(require("../utils/sleep"));
var _AccountCurrency = Client.AccountCurrency;
var RECONCILIATION_INACTIVE_SLEEP_MS = 5000;
var RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT = 200;
var defaults = {
    highWaterMark: -1,
    lookupBalanceByBlock: true,
    requiredDepthInactive: 500,
    waitToCheckDiff: 10 * 1000,
    waitToCheckDiffSleep: 5000,
    inactiveFrequency: RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT,
    withSeenAccounts: []
};
var RECONCILIATION_ACTIVE = 'ACTIVE';
var RECONCILIATION_INACTIVE = 'INACTIVE';
var RECONCILIATION_ERROR_HEAD_BEHIND_LIVE = 'ERROR_HEAD_BEHIND_LIVE';
var RECONCILIATION_ERROR_ACCOUNT_UPDATED = 'ACCOUNT_UPDATED';
var RECONCILIATION_ERROR_BLOCK_GONE = 'BLOCK_GONE';
var RosettaReconciler = /** @class */ (function () {
    function RosettaReconciler(args) {
        if (args === void 0) { args = {}; }
        var networkIdentifier = args.networkIdentifier, helper = args.helper, handler = args.handler, fetcher = args.fetcher;
        var configuration = Object.assign({}, defaults, args);
        this.network = networkIdentifier;
        this.helper = helper;
        this.handler = handler;
        this.fetcher = fetcher;
        this.highWaterMark = configuration.lookupBalanceByBlock;
        this.lookupBalanceByBlock = configuration.lookupBalanceByBlock;
        this.interestingAccounts = configuration.interestingAccounts || [];
        this.inactiveQueue = [];
        this.seenAccounts = this.handleSeenAccounts(configuration.withSeenAccounts);
        this.requiredDepthInactive = configuration.requiredDepthInactive;
        this.waitToCheckDiff = configuration.waitToCheckDiff;
        this.waitToCheckDiffSleep = configuration.waitToCheckDiffSleep;
        this.inactiveFrequency = configuration.inactiveFrequency;
        this.changeQueue = [];
    }
    RosettaReconciler.prototype.handleSeenAccounts = function (seenAccounts) {
        var _this = this;
        var seen = {};
        seenAccounts.forEach(function (s) {
            _this.inactiveQueue.push({ entry: s });
            seen[utils_1.Hash(s)] = {};
        });
        return seen;
    };
    RosettaReconciler.prototype.queueChanges = function (blockIdentifier, balanceChangesArray) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, account, skipAccount, balanceChangesArray_1, balanceChangesArray_1_1, change, balanceChangesArray_2, balanceChangesArray_2_1, change, e_1_1;
            var e_2, _c, e_3, _d, e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        try {
                            for (_a = __values(this.interestingAccounts), _b = _a.next(); !_b.done; _b = _a.next()) {
                                account = _b.value;
                                skipAccount = false;
                                try {
                                    for (balanceChangesArray_1 = (e_3 = void 0, __values(balanceChangesArray)), balanceChangesArray_1_1 = balanceChangesArray_1.next(); !balanceChangesArray_1_1.done; balanceChangesArray_1_1 = balanceChangesArray_1.next()) {
                                        change = balanceChangesArray_1_1.value;
                                        if (utils_1.Hash(account) == utils_1.Hash(change)) {
                                            skipAccount = true;
                                            break;
                                        }
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (balanceChangesArray_1_1 && !balanceChangesArray_1_1.done && (_d = balanceChangesArray_1["return"])) _d.call(balanceChangesArray_1);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                if (skipAccount)
                                    continue;
                                balanceChangesArray.push({
                                    account_identifier: account.account,
                                    currency: account.currency,
                                    block_identifier: '0'
                                });
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 8]);
                        balanceChangesArray_2 = __values(balanceChangesArray), balanceChangesArray_2_1 = balanceChangesArray_2.next();
                        _f.label = 2;
                    case 2:
                        if (!!balanceChangesArray_2_1.done) return [3 /*break*/, 5];
                        change = balanceChangesArray_2_1.value;
                        return [4 /*yield*/, this.inactiveAccountQueue(false, new _AccountCurrency(change.account, change.currency), blockIdentifier)];
                    case 3:
                        _f.sent();
                        if (!this.lookupBalanceByBlock) {
                            if (blockIdentifier.index < this.highWaterMark) {
                                return [3 /*break*/, 4];
                            }
                            this.changeQueue.push(change);
                        }
                        else {
                            this.changeQueue.push(change);
                        }
                        _f.label = 4;
                    case 4:
                        balanceChangesArray_2_1 = balanceChangesArray_2.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (balanceChangesArray_2_1 && !balanceChangesArray_2_1.done && (_e = balanceChangesArray_2["return"])) _e.call(balanceChangesArray_2);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.prototype.compareBalance = function (accountIdentifier, currency, amount, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var head, exists, _a, cachedBalance, balanceBlock, difference;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.helper.currentBlock()];
                    case 1:
                        head = _b.sent();
                        if (blockIdentifier.index > head.index) {
                            throw new errors_1.ReconcilerError("Live block " + blockIdentifier.index + " > head block " + head.index, RECONCILIATION_ERROR_HEAD_BEHIND_LIVE);
                        }
                        return [4 /*yield*/, this.helper.blockExists(blockIdentifier)];
                    case 2:
                        exists = _b.sent();
                        if (!exists) {
                            throw new errors_1.ReconcilerError("Block gone! Block hash = " + blockIdentifier.hash, RECONCILIATION_ERROR_BLOCK_GONE);
                        }
                        return [4 /*yield*/, this.helper.accountBalance(accountIdentifier, currency, head)];
                    case 3:
                        _a = _b.sent(), cachedBalance = _a.cachedBalance, balanceBlock = _a.balanceBlock;
                        if (blockIdentifier.index < balanceBlock.index) {
                            throw new errors_1.ReconcilerError("Account updated: " + JSON.stringify(accountIdentifier) + " updated at blockheight " + balanceBlock.index, RECONCILIATION_ERROR_ACCOUNT_UPDATED);
                        }
                        difference = utils_1.SubtractValues(cachedBalance.value, amount);
                        return [2 /*return*/, {
                                difference: difference,
                                cachedBalance: cachedBalance.value,
                                headIndex: head.index
                            }];
                }
            });
        });
    };
    RosettaReconciler.prototype.bestBalance = function (accountIdentifier, currency, partialBlockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.lookupBalanceByBlock) {
                            partialBlockIdentifier = null;
                        }
                        return [4 /*yield*/, this.getCurrencyBalance(this.fetcher, this.network, accountIdentifier, currency, partialBlockIdentifier)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RosettaReconciler.prototype.shouldAttemptInactiveReconciliation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var head, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.helper.currentBlock()];
                    case 1:
                        head = _a.sent();
                        if (head.index < this.highWaterMark) {
                            if (this.debugLogging)
                                this.logger.verbose('Waiting to continue inactive reconciliation until reaching high water mark...');
                            return [2 /*return*/, { shouldAttempt: false, head: null }];
                        }
                        return [2 /*return*/, { shouldAttempt: true, head: head }];
                    case 2:
                        e_4 = _a.sent();
                        if (this.debugLogging)
                            this.logger.verbose('Waiting to start inactive reconciliation until a block is synced...');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, { shouldAttempt: false, head: null }];
                }
            });
        });
    };
    RosettaReconciler.prototype.accountReconciliation = function (accountIdentifier, currency, amount, blockIdentifier, isInactive) {
        return __awaiter(this, void 0, void 0, function () {
            var accountCurrency, difference, cachedBalance, headIndex, result, e_5, _a, diff, reconciliationType, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        accountCurrency = {
                            account_identifier: accountIdentifier,
                            currency: currency
                        };
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 19];
                        difference = void 0;
                        cachedBalance = void 0;
                        headIndex = void 0;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 14]);
                        return [4 /*yield*/, this.compareBalance(accountIdentifier, currency, amount, blockIdentifier)];
                    case 3:
                        result = _b.sent();
                        (difference = result.difference, cachedBalance = result.cachedBalance, headIndex = result.headIndex);
                        return [3 /*break*/, 14];
                    case 4:
                        e_5 = _b.sent();
                        if (!(e_5 instanceof errors_1.ReconcilerError)) return [3 /*break*/, 12];
                        _a = e_5.type;
                        switch (_a) {
                            case RECONCILIATION_ERROR_HEAD_BEHIND_LIVE: return [3 /*break*/, 5];
                            case RECONCILIATION_ERROR_ACCOUNT_UPDATED: return [3 /*break*/, 8];
                            case RECONCILIATION_ERROR_BLOCK_GONE: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 5:
                        diff = blockIdentifier.index - headIndex;
                        if (!(diff < this.waitToCheckDiff)) return [3 /*break*/, 7];
                        return [4 /*yield*/, sleep_1["default"](this.waitToCheckDiffSleep)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 7:
                        // Don't wait to check if we are very far behind
                        console.info("Skipping reconciliation for " + JSON.stringify(accountCurrency) + ":" + (" " + diff + " blocks behind"));
                        // Set a highWaterMark to not accept any new
                        // reconciliation requests unless they happened
                        // after this new highWaterMark.
                        throw new errors_1.ReconcilerError('not implemented');
                    case 8:
                        {
                            // Either the block has not been processed in a re-org yet
                            // or the block was orphaned
                            return [3 /*break*/, 11];
                        }
                        _b.label = 9;
                    case 9:
                        {
                            // If account was updated, it must be
                            // enqueued again
                            return [3 /*break*/, 11];
                        }
                        _b.label = 10;
                    case 10: return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12: throw e_5;
                    case 13: return [3 /*break*/, 14];
                    case 14:
                        reconciliationType = RECONCILIATION_ACTIVE;
                        if (isInactive) {
                            reconciliationType = RECONCILIATION_INACTIVE;
                        }
                        if (!(difference != '0')) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.handler.reconciliationFailed(reconciliationType, accountCurrency.account_identifier, accountCurrency.currency, cachedBalance, amount, blockIdentifier)];
                    case 15:
                        error = _b.sent();
                        if (error)
                            throw error;
                        _b.label = 16;
                    case 16: return [4 /*yield*/, this.inactiveAccountQueue(isInactive, accountCurrency, blockIdentifier)];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, this.handler.reconciliationSucceeded(reconciliationType, accountCurrency.account_identifier, accountCurrency.currency, amount, blockIdentifier)];
                    case 18: return [2 /*return*/, _b.sent()];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.ContainsAccountCurrency = function (accountCurrencyMap, accountCurrency) {
        var element = accountCurrencyMap[utils_1.Hash(accountCurrency)];
        return element != null;
    };
    RosettaReconciler.prototype.inactiveAccountQueue = function (isInactive, accountCurrency, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var shouldEnqueueInactive;
            return __generator(this, function (_a) {
                shouldEnqueueInactive = false;
                if (!isInactive &&
                    !RosettaReconciler.ContainsAccountCurrency(this.seenAccounts, accountCurrency)) {
                    this.seenAccounts[utils_1.Hash(accountCurrency)] = {};
                    shouldEnqueueInactive = true;
                }
                if (isInactive || shouldEnqueueInactive) {
                    this.inactiveQueue.push({
                        entry: accountCurrency,
                        last_check: blockIdentifier
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    RosettaReconciler.prototype.reconcileActiveAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceChange, _a, block, value;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 3];
                        balanceChange = this.changeQueue.shift();
                        if (balanceChange.block.index < this.highWaterMark)
                            return [3 /*break*/, 0];
                        return [4 /*yield*/, this.bestBalance(balanceChange.account_identifier, balanceChange.currency, utils_1.constructPartialBlockIdentifier(balanceChange.block))];
                    case 1:
                        _a = _b.sent(), block = _a.block, value = _a.value;
                        return [4 /*yield*/, this.accountReconciliation(balanceChange.account_identifier, balanceChange.currency, value, block, false)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.prototype.reconcileInactiveAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, shouldAttempt, head, queueLen, nextAccount, nextValidIndex, _b, block, amount;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.shouldAttemptInactiveReconciliation()];
                    case 1:
                        _a = _c.sent(), shouldAttempt = _a.shouldAttempt, head = _a.head;
                        if (!!shouldAttempt) return [3 /*break*/, 3];
                        return [4 /*yield*/, sleep_1["default"](RECONCILIATION_INACTIVE_SLEEP_MS)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 0];
                    case 3:
                        queueLen = this.inactiveQueue.length;
                        if (!(queueLen == 0)) return [3 /*break*/, 5];
                        if (this.debugLogging) {
                            this.logger.verbose('No accounts ready for inactive reconciliation (0 accounts in queue)');
                        }
                        return [4 /*yield*/, sleep_1["default"](RECONCILIATION_INACTIVE_SLEEP_MS)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 0];
                    case 5:
                        nextAccount = this.inactiveQueue[0];
                        nextValidIndex = -1;
                        throw new errors_1.ReconcilerError('Not implemented');
                    case 6:
                        _b = _c.sent(), block = _b.block, amount = _b.value;
                        return [4 /*yield*/, this.accountReconciliation(nextAccount.entry.account_identifier, nextAccount.entry.currency, amount, block, true)];
                    case 7:
                        _c.sent();
                        // Always re-enqueue accounts after they have been inactively
                        // reconciled. If we don't re-enqueue, we will never check
                        // these accounts again.
                        this.inactiveAccountQueue(true, nextAccount.entry, block);
                        return [3 /*break*/, 10];
                    case 8:
                        if (this.debugLogging) {
                            this.logger.verbose("No accounts ready for inactive reconciliation " +
                                ("(" + queueLen + " account(s) in queue, will reconcile next account at index " + nextValidIndex + ")"));
                        }
                        return [4 /*yield*/, sleep_1["default"](RECONCILIATION_INACTIVE_SLEEP_MS)];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [3 /*break*/, 0];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.prototype.reconcile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // ToDo: Multithreading support (worker?)
                    return [4 /*yield*/, Promise.all([
                            this.reconcileActiveAccounts(),
                            this.reconcileInactiveAccounts(),
                        ])];
                    case 1:
                        // ToDo: Multithreading support (worker?)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.extractAmount = function (amountArray, currency) {
        var e_6, _a;
        try {
            for (var amountArray_1 = __values(amountArray), amountArray_1_1 = amountArray_1.next(); !amountArray_1_1.done; amountArray_1_1 = amountArray_1.next()) {
                var b = amountArray_1_1.value;
                if (utils_1.Hash(b.currency) != utils_1.Hash(currency))
                    continue;
                return b;
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (amountArray_1_1 && !amountArray_1_1.done && (_a = amountArray_1["return"])) _a.call(amountArray_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        throw new Error("Could not extract amount for " + JSON.stringify(currency));
    };
    RosettaReconciler.prototype.getCurrencyBalance = function (fetcher, networkIdentifier, accountIdentifier, currency, partialBlockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, liveBlock, liveBalances, liveAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetcher.accountBalanceRetry(networkIdentifier, accountIdentifier, partialBlockIdentifier)];
                    case 1:
                        _a = _b.sent(), liveBlock = _a.liveBlock, liveBalances = _a.liveBalances;
                        try {
                            liveAmount = RosettaReconciler.extractAmount(liveBalances, currency);
                            return [2 /*return*/, {
                                    block: liveBlock,
                                    value: liveAmount.value
                                }];
                        }
                        catch (e) {
                            throw new errors_1.ReconcilerError("Could not get " + JSON.stringify(currency) + " currency balance" +
                                (" for " + JSON.stringify(accountIdentifier) + ": " + e.message));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.defaults = defaults;
    return RosettaReconciler;
}());
var AccountCurrency = /** @class */ (function () {
    function AccountCurrency(opts) {
        if (typeof opts == 'object' &&
            opts.accountIdentifier) {
            var _a = opts, accountIdentifier = _a.accountIdentifier, currency = _a.currency;
            this.account = accountIdentifier;
            this.currency = currency;
        }
        else {
            // @ts-ignore
            var _b = __read(arguments, 2), accountIdentifier = _b[0], currency = _b[1];
            this.account = arguments[0];
            this.currency = arguments[1];
        }
    }
    return AccountCurrency;
}());
exports["default"] = RosettaReconciler;