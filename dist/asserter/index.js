"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var errors_1 = require("../errors");
var Client = __importStar(require("rosetta-node-sdk-client"));
var Types = Client;
var utils_1 = require("../utils");
/**
 * @type module:OpenApiConfig
 * @class RosettaAsserter
 * Syntactical and semantical type validator.
 * This Asserter can be used to validate Requests/Responses.Constructors exist
 * that ease the creation of an asserter.
 + For example, `NewClientWithResponses` can be used in order to create a server
 * validator by only passing the network responses.
 */
var RosettaAsserter = /** @class */ (function () {
    function RosettaAsserter(_a) {
        var e_1, _b, e_2, _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.operationTypes, operationTypes = _e === void 0 ? [] : _e, _f = _d.operationStatuses, operationStatuses = _f === void 0 ? [] : _f, _g = _d.errorTypes, errorTypes = _g === void 0 ? [] : _g, genesisBlockIdentifier = _d.genesisBlockIdentifier, _h = _d.supportedNetworks, supportedNetworks = _h === void 0 ? [] : _h, _j = _d.historicalBalanceLookup, historicalBalanceLookup = _j === void 0 ? false : _j;
        this.operationTypes = operationTypes;
        this.genesisBlockIdentifier = genesisBlockIdentifier;
        this.supportedNetworks = supportedNetworks;
        this.historicalBalanceLookup = historicalBalanceLookup;
        this.operationStatusMap = {};
        this.errorTypeMap = {};
        this.networkIdentifier = null;
        if (operationStatuses &&
            typeof operationStatuses == 'object' &&
            Array.isArray(operationStatuses)) {
            try {
                for (var operationStatuses_1 = __values(operationStatuses), operationStatuses_1_1 = operationStatuses_1.next(); !operationStatuses_1_1.done; operationStatuses_1_1 = operationStatuses_1.next()) {
                    var operationStatus = operationStatuses_1_1.value;
                    this.operationStatusMap[operationStatus.status] =
                        operationStatus.successful;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (operationStatuses_1_1 && !operationStatuses_1_1.done && (_b = operationStatuses_1["return"])) _b.call(operationStatuses_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (errorTypes &&
            typeof errorTypes == 'object' &&
            Array.isArray(errorTypes)) {
            try {
                for (var errorTypes_1 = __values(errorTypes), errorTypes_1_1 = errorTypes_1.next(); !errorTypes_1_1.done; errorTypes_1_1 = errorTypes_1.next()) {
                    var errorType = errorTypes_1_1.value;
                    this.errorTypeMap[errorType.code] = errorType;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (errorTypes_1_1 && !errorTypes_1_1.done && (_c = errorTypes_1["return"])) _c.call(errorTypes_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    /**
     * SupportedNetworks validates an array of NetworkIdentifiers.
     * @throws {AsserterError} if the array is empty or one of the networks is invalid.
     */
    RosettaAsserter.prototype.SupportedNetworks = function (supportedNetworks) {
        var e_3, _a;
        if (!Array.isArray(supportedNetworks)) {
            throw new errors_1.AsserterError('SupportedNetworks must be an array');
        }
        if (supportedNetworks.length == 0) {
            throw new errors_1.AsserterError('NetworkIdentifier Array contains no supported networks');
        }
        var parsedNetworks = [];
        try {
            for (var supportedNetworks_1 = __values(supportedNetworks), supportedNetworks_1_1 = supportedNetworks_1.next(); !supportedNetworks_1_1.done; supportedNetworks_1_1 = supportedNetworks_1.next()) {
                var network = supportedNetworks_1_1.value;
                this.NetworkIdentifier(network);
                if (parsedNetworks.includes(utils_1.Hash(network))) {
                    throw new errors_1.AsserterError("SupportedNetwork has a duplicate: " + JSON.stringify(network));
                }
                parsedNetworks.push(utils_1.Hash(network));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (supportedNetworks_1_1 && !supportedNetworks_1_1.done && (_a = supportedNetworks_1["return"])) _a.call(supportedNetworks_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    /**
     * SupportedNetwork validates a single NetworkIdentifiers.
     * @param {Rosetta:NetworkIdentifier} networkIdentifier - NetworkIdentifier which will be validated.
     * @throws {AsserterError} if the networkIdentifier is not supported by the asserter.
     */
    RosettaAsserter.prototype.SupportedNetwork = function (networkIdentifier) {
        var index = this.supportedNetworks.findIndex(function (network) { return utils_1.Hash(network) == utils_1.Hash(networkIdentifier); });
        if (index == -1) {
            throw new errors_1.AsserterError("Network " + JSON.stringify(networkIdentifier) + " is not supported");
        }
    };
    /**
     * ValidSupportedNetwork is a wrapper method, that checks both, the validity and whether
     * the provided network is supported by the asserter.
     *
     * @param {Rosetta:NetworkIdentifier} requestNetwork - NetworkIdentifier which will be validated.
     * @throws {AsserterError} if the networkIdentifier is not valid or not supported by the asserter.
     */
    RosettaAsserter.prototype.ValidSupportedNetwork = function (requestNetwork) {
        this.NetworkIdentifier(requestNetwork);
        this.SupportedNetwork(requestNetwork);
    };
    /**
     * Validates an Rosetta:AccountBalanceRequest.
     *
     * @param {Rosetta:AccountBalanceRequest} accountBalanceRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either one of the networks is invalid or not supported, the account
     *     identifier is invalid, or if a historical request is being made by specifiying
     *     a Rosetta:PartialBlockIdentifier, although it is not supported by
     *     this asserter (historicalBalanceRequest = false).
     */
    RosettaAsserter.prototype.AccountBalanceRequest = function (accountBalanceRequest) {
        if (accountBalanceRequest == null) {
            throw new errors_1.AsserterError('AccountBalanceRequest is null');
        }
        this.ValidSupportedNetwork(accountBalanceRequest.network_identifier);
        this.AccountIdentifier(accountBalanceRequest.account_identifier);
        if (accountBalanceRequest.block_identifier == null) {
            return;
        }
        if (!this.historicalBalanceLookup) {
            throw new errors_1.AsserterError("historical balance loopup is not supported");
        }
        this.PartialBlockIdentifier(accountBalanceRequest.block_identifier);
    };
    /**
     * Validates an Rosetta:BlockRequest.
     *
     * @param {Rosetta:BlockRequest} blockRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either one of the networks is invalid or not supported, or
     *     if the specified Rosetta:PartialBlockIdentifier is invalid.
     */
    RosettaAsserter.prototype.BlockRequest = function (blockRequest) {
        if (blockRequest == null) {
            throw new errors_1.AsserterError('BlockRequest is null');
        }
        this.ValidSupportedNetwork(blockRequest.network_identifier);
        this.PartialBlockIdentifier(blockRequest.block_identifier);
    };
    /**
     * Validates an Rosetta:BlockTransactionRequest.
     *
     * @param {Rosetta:BlockTransactionRequest} blockTransactionRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     the specified Rosetta:BlockIdentifier is invalid, or the Rosetta:TransactionIdentifier
     *     is invalid.
     */
    RosettaAsserter.prototype.BlockTransactionRequest = function (blockTransactionRequest) {
        if (blockTransactionRequest == null) {
            throw new errors_1.AsserterError('BlockTransactionRequest is null');
        }
        this.ValidSupportedNetwork(blockTransactionRequest.network_identifier);
        this.BlockIdentifier(blockTransactionRequest.block_identifier);
        this.TransactionIdentifier(blockTransactionRequest.transaction_identifier);
    };
    /**
     * Validates an Rosetta:ConstructionMetadataRequest.
     *
     * @param {Rosetta:ConstructionMetadataRequest} constructionMetadataRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     the the required parameter options is missing.
     */
    RosettaAsserter.prototype.ConstructionMetadataRequest = function (constructionMetadataRequest) {
        if (constructionMetadataRequest == null) {
            throw new errors_1.AsserterError('ConstructionMetadataRequest is null');
        }
        this.ValidSupportedNetwork(constructionMetadataRequest.network_identifier);
        if (constructionMetadataRequest.options == null) {
            throw new errors_1.AsserterError('ConstructionMetadataRequest.options is null');
        }
    };
    /**
     * Validates an Rosetta:ConstructionSubmitRequest.
     *
     * @param {Rosetta:ConstructionSubmitRequest} constructionSubmitRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     or the the required signed_transaction is empty.
     */
    RosettaAsserter.prototype.ConstructionSubmitRequest = function (constructionSubmitRequest) {
        if (constructionSubmitRequest == null) {
            throw new errors_1.AsserterError('ConstructionSubmitRequest.options is null');
        }
        this.ValidSupportedNetwork(constructionSubmitRequest.network_identifier);
        if (!constructionSubmitRequest.signed_transaction) {
            throw new errors_1.AsserterError('ConstructionSubmitRequest.signed_transaction is empty');
        }
    };
    /**
     * Validates an Rosetta:MempoolTransactionRequest.
     *
     * @param {Rosetta:MempoolTransactionRequest} mempoolTransactionRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     or the Rosetta:TransactionIdentifier is invalid.
     */
    RosettaAsserter.prototype.MempoolTransactionRequest = function (mempoolTransactionRequest) {
        if (mempoolTransactionRequest == null) {
            throw new errors_1.AsserterError('MempoolTransactionRequest is null');
        }
        this.ValidSupportedNetwork(mempoolTransactionRequest.network_identifier);
        this.TransactionIdentifier(mempoolTransactionRequest.transaction_identifier);
    };
    /**
     * Validates an Rosetta:MetadataRequest.
     *
     * @param {Rosetta:MetadataRequest} metadataRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null.
     */
    RosettaAsserter.prototype.MetadataRequest = function (metadataRequest) {
        if (metadataRequest == null) {
            throw new errors_1.AsserterError('MetadataRequest is null');
        }
    };
    /**
     * Validates an Rosetta:NetworkRequest.
     *
     * @param {Rosetta:NetworkRequest} networkRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, or if the privded network is
     *     invalid or not supported.
     */
    RosettaAsserter.prototype.NetworkRequest = function (networkRequest) {
        if (networkRequest == null) {
            throw new errors_1.AsserterError('NetworkRequest is null');
        }
        this.ValidSupportedNetwork(networkRequest.network_identifier);
    };
    /**
     * Validates an Rosetta:ConstructionMetadataResponse.
     *
     * @param {Rosetta:ConstructionMetadataResponse} constructionMetadataResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the metadata property is missing.
     */
    RosettaAsserter.prototype.ConstructionMetadataResponse = function (constructionMetadataResponse) {
        if (constructionMetadataResponse == null) {
            throw new errors_1.AsserterError('ConstructionMetadataResponse cannot be null');
        }
        if (constructionMetadataResponse.metadata == null) {
            throw new errors_1.AsserterError('ConstructionMetadataResponse.metadata is null');
        }
    };
    /**
     * Validates an Rosetta:TransactionIdentifierResponse.
     *
     * @param {Rosetta:TransactionIdentifierResponse} transactionIdentifierResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the the returned Rosetta:Transactionidetifier
     *     happens to be invalid..
     */
    RosettaAsserter.prototype.TransactionIdentifierResponse = function (transactionIdentifierResponse) {
        if (transactionIdentifierResponse == null) {
            throw new errors_1.AsserterError('transactionIdentifierResponse cannot be null');
        }
        // Note, this is not in the reference implementation (Go)
        this.TransactionIdentifier(transactionIdentifierResponse.transaction_identifier);
    };
    /**
     * Validates an Rosetta:ConstructionCombineResponse.
     *
     * @param {Rosetta:ConstructionCombineResponse} constructionCombineResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the returned signed transaction
     *     is empty.
     */
    RosettaAsserter.prototype.ConstructionCombineResponse = function (constructionCombineResponse) {
        if (constructionCombineResponse == null) {
            throw new errors_1.AsserterError('constructionCombineResponse cannot be null');
        }
        if (typeof constructionCombineResponse.signed_transaction !== 'string') {
            throw new errors_1.AsserterError('constructionCombineResponse.signed_transaction must be a string');
        }
        if (!constructionCombineResponse.signed_transaction) {
            throw new errors_1.AsserterError('constructionCombineResponse.signed_transaction cannot be empty');
        }
    };
    /**
     * Validates an Rosetta:ConstructionDeriveResponse.
     *
     * @param {Rosetta:ConstructionDeriveResponse} constructionDeriveResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the returned address is empty
     */
    RosettaAsserter.prototype.ConstructionDeriveResponse = function (constructionDeriveResponse) {
        if (constructionDeriveResponse == null) {
            throw new errors_1.AsserterError('constructionDeriveResponse cannot be null');
        }
        if (typeof constructionDeriveResponse.address !== 'string') {
            throw new errors_1.AsserterError('constructionDeriveResponse.address must be a string');
        }
        if (!constructionDeriveResponse.address) {
            throw new errors_1.AsserterError('constructionDeriveResponse.address cannot be empty');
        }
    };
    /**
     * Validates an Rosetta:ConstructionDeriveRequest.
     *
     * @param {Rosetta:ConstructionDeriveRequest} constructionDeriveRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid not supported
     *     or the provided public key is invalid.
     */
    RosettaAsserter.prototype.ConstructionDeriveRequest = function (constructionDeriveRequest) {
        if (constructionDeriveRequest == null) {
            throw new errors_1.AsserterError('ConstructionDeriveRequest cannot be null');
        }
        this.ValidSupportedNetwork(constructionDeriveRequest.network_identifier);
        this.PublicKey(constructionDeriveRequest.public_key);
    };
    /**
     * Validates an Rosetta:ConstructionPreprocessRequest.
     *
     * @param {Rosetta:ConstructionPreprocessRequest} constructionPreprocessRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported
     *     or the provided operations are invalid.
     */
    RosettaAsserter.prototype.ConstructionPreprocessRequest = function (constructionPreprocessRequest) {
        if (constructionPreprocessRequest == null) {
            throw new errors_1.AsserterError('constructionPreprocessRequest cannot be null');
        }
        this.ValidSupportedNetwork(constructionPreprocessRequest.network_identifier);
        this.Operations(constructionPreprocessRequest.operations, true);
    };
    /**
     * Validates an Rosetta:ConstructionPayloadsRequest.
     *
     * @param {Rosetta:ConstructionPayloadsRequest} constructionPayloadsRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported
     *     or the provided operations are invalid.
     */
    RosettaAsserter.prototype.ConstructionPayloadsRequest = function (constructionPayloadsRequest) {
        if (constructionPayloadsRequest == null) {
            throw new errors_1.AsserterError('constructionPayloadsRequest cannot be null');
        }
        this.ValidSupportedNetwork(constructionPayloadsRequest.network_identifier);
        this.Operations(constructionPayloadsRequest.operations, true);
    };
    /**
     * Validates an Rosetta:ConstructionCombineRequest.
     *
     * @param {Rosetta:constructionCombineRequest} constructionCombineRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     the unsigned transaction is empty or if the provided signatures (Rosetta:Signature[]) are invalid.
     */
    RosettaAsserter.prototype.ConstructionCombineRequest = function (constructionCombineRequest) {
        if (constructionCombineRequest == null) {
            throw new errors_1.AsserterError('constructionCombineRequest cannot be null');
        }
        this.ValidSupportedNetwork(constructionCombineRequest.network_identifier);
        if (typeof constructionCombineRequest.unsigned_transaction !==
            'string' ||
            constructionCombineRequest.unsigned_transaction.length == 0) {
            throw new errors_1.AsserterError('unsigned_transaction cannot be empty');
        }
        this.Signatures(constructionCombineRequest.signatures);
    };
    /**
     * Validates an Rosetta:ConstructionHashRequest.
     *
     * @param {Rosetta:ConstructionHashRequest} constructionHashRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     or if the signed transaction is empty.
     */
    RosettaAsserter.prototype.ConstructionHashRequest = function (constructionHashRequest) {
        if (constructionHashRequest == null) {
            throw new errors_1.AsserterError('constructionHashRequest cannot be null');
        }
        this.ValidSupportedNetwork(constructionHashRequest.network_identifier);
        if (typeof constructionHashRequest.signed_transaction !== 'string' ||
            constructionHashRequest.signed_transaction.length == 0) {
            throw new errors_1.AsserterError('signed_transaction cannot be empty');
        }
    };
    /**
     * Validates an Rosetta:ConstructionParseRequest.
     *
     * @param {Rosetta:ConstructionParseRequest} constructionParseRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     or if the transaction is empty.
     */
    RosettaAsserter.prototype.ConstructionParseRequest = function (constructionParseRequest) {
        if (constructionParseRequest == null) {
            throw new errors_1.AsserterError('constructionParseRequest cannot be null');
        }
        this.ValidSupportedNetwork(constructionParseRequest.network_identifier);
        if (typeof constructionParseRequest.transaction !== 'string' ||
            constructionParseRequest.transaction.length == 0) {
            throw new errors_1.AsserterError('transaction cannot be empty');
        }
    };
    /**
     * Validates an Rosetta:ConstructionParseResponse.
     *
     * @param {Rosetta:ConstructionParseResponse} constructionParseResponse - Response that will be validated.
     * @param {boolean} signed - Whether expecting signers to be provided or not.
     * @throws {AsserterError} thrown if the provided response is null, no or invalid operations were returned,
     *     the signers were empty when expecting a signer information, signers were returned when not
     *     expecting them or when invalid signers were returned.
     */
    RosettaAsserter.prototype.ConstructionParseResponse = function (constructionParseResponse, signed) {
        if (signed === void 0) { signed = false; }
        if (constructionParseResponse == null) {
            throw new errors_1.AsserterError('constructionParseResponse cannot be null');
        }
        if (!constructionParseResponse.operations ||
            constructionParseResponse.operations.length == 0) {
            throw new errors_1.AsserterError('operations cannot be empty');
        }
        try {
            this.Operations(constructionParseResponse.operations, true);
        }
        catch (e) {
            throw new errors_1.AsserterError("unable to parse operations: " + e.message);
        }
        if (signed &&
            (!constructionParseResponse.signers ||
                constructionParseResponse.signers.length == 0)) {
            throw new errors_1.AsserterError('signers cannot be empty');
        }
        if (!signed) {
            if (Array.isArray(constructionParseResponse.signers) &&
                constructionParseResponse.signers.length > 0) {
                throw new errors_1.AsserterError('signers should be empty for unsigned txs');
            }
        }
        for (var i = 0; i < (constructionParseResponse.signers || []).length; ++i) {
            var signer = constructionParseResponse.signers[i];
            if (signer.length == 0) {
                throw new errors_1.AsserterError("signer " + i + " cannot be empty string");
            }
        }
    };
    /**
     * Validates an Rosetta:ConstructionPayloadsResponse.
     *
     * @param {Rosetta:ConstructionPayloadsResponse} constructionPayloadsResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, an empty unsigned transaction was returned,
     *     or if no or invalid payloads were returned.
     */
    RosettaAsserter.prototype.ConstructionPayloadsResponse = function (constructionPayloadsResponse) {
        if (constructionPayloadsResponse == null) {
            throw new errors_1.AsserterError('constructionPayloadsResponse cannot be null');
        }
        if (typeof constructionPayloadsResponse.unsigned_transaction !==
            'string' ||
            constructionPayloadsResponse.unsigned_transaction.length == 0) {
            throw new errors_1.AsserterError('unsigned transaction cannot be empty');
        }
        if (!constructionPayloadsResponse.payloads ||
            constructionPayloadsResponse.payloads.length == 0) {
            throw new errors_1.AsserterError('signing payloads cannot be empty');
        }
        for (var i = 0; i < constructionPayloadsResponse.payloads.length; ++i) {
            var payload = constructionPayloadsResponse.payloads[i];
            try {
                this.SigningPayload(payload);
            }
            catch (e) {
                throw new errors_1.AsserterError("Signing Payload " + i + " is invalid: " + e.message);
            }
        }
    };
    /**
     * Validates a PublicKey.
     *
     * @param {Rosetta:PublicKey} publicKey - public key that will be validated.
     * @throws {AsserterError} thrown if the provided publicKey is null, the property hex_bytes
     *     is empty or not a valid hexadecimal string, or the curve type is invalid.
     */
    RosettaAsserter.prototype.PublicKey = function (publicKey) {
        if (publicKey == null) {
            throw new errors_1.AsserterError('public_key cannot be null');
        }
        if (typeof publicKey.hex_bytes !== 'string' ||
            publicKey.hex_bytes.length == 0) {
            // hex
            throw new errors_1.AsserterError('public key bytes cannot be empty');
        }
        if (!this.checkHex(publicKey.hex_bytes)) {
            throw new errors_1.AsserterError("hex_bytes must be a valid hexadecimal string");
        }
        try {
            this.CurveType(publicKey.curve_type);
        }
        catch (e) {
            throw new errors_1.AsserterError("public key curve type is not supported: " + e.message);
        }
    };
    /**
     * Validates a CurveType.
     *
     * @param {Rosetta:CurveType} curveType - curve type that will be validated.
     * @throws {AsserterError} thrown if the provided curve type is not defined in the standard.
     */
    RosettaAsserter.prototype.CurveType = function (curveType) {
        switch (curveType) {
            case new Types.CurveType().secp256k1:
            case new Types.CurveType().edwards25519:
                break;
            default:
                throw new errors_1.AsserterError(JSON.stringify(curveType) + " is not a supported CurveType");
        }
    };
    /**
     * Validates a SigningPayload.
     *
     * @param {Rosetta:SigningPayload} signingPayload - Signing Payload that will be validated.
     * @throws {AsserterError} thrown if the provided object is null, an empty address was specified,
     *     the specified hex_bytes property is empty or not a valid hexadecimal string, or, if provided,
     *     the signature type is invalid.
     */
    RosettaAsserter.prototype.SigningPayload = function (signingPayload) {
        if (signingPayload == null) {
            throw new errors_1.AsserterError('signing payload cannot be null');
        }
        if (typeof signingPayload.address !== 'string' ||
            signingPayload.address.length == 0) {
            throw new errors_1.AsserterError('signing payload cannot be empty');
        }
        if (typeof signingPayload.hex_bytes != 'string' ||
            signingPayload.hex_bytes.length == 0) {
            throw new errors_1.AsserterError('signing payload bytes cannot be empty');
        }
        if (!this.checkHex(signingPayload.hex_bytes)) {
            throw new errors_1.AsserterError("hex_bytes must be a valid hexadecimal string");
        }
        if (!signingPayload.signature_type ||
            signingPayload.signature_type.length == 0) {
            return;
        }
        try {
            this.SignatureType(signingPayload.signature_type);
        }
        catch (e) {
            throw new errors_1.AsserterError("signature payload type is not valid: " + e.message);
        }
    };
    /**
     * Checks if a string consists only of hexadecimal bytes.
     *
     * @param {string} hexPayload - Hexadecimal string that will be validated.
     * @returns {boolean} if the string is hexadecimal.
     */
    RosettaAsserter.prototype.checkHex = function (hexPayload) {
        if (!hexPayload)
            return false;
        return (hexPayload.match(/^[0-9a-fA-F]+$/) != null &&
            hexPayload.length % 2 == 0);
    };
    /**
     * Validates a signature array.
     *
     * @param {Rosetta:Signature[]} signatureArray - Signature Array that will be validated.
     * @throws {AsserterError} thrown if the provided signatures are empty or invalid.
     */
    RosettaAsserter.prototype.Signatures = function (signatureArray) {
        if (signatureArray === void 0) { signatureArray = []; }
        if (!signatureArray || signatureArray.length == 0) {
            throw new errors_1.AsserterError('signatures cannot be empty');
        }
        for (var i = 0; i < signatureArray.length; ++i) {
            var signature = signatureArray[i];
            try {
                this.SigningPayload(signature.signing_payload);
            }
            catch (e) {
                throw new errors_1.AsserterError("signature " + i + " has invalid signing payload: " + e.message);
            }
            try {
                this.PublicKey(signature.public_key);
            }
            catch (e) {
                throw new errors_1.AsserterError("signature " + i + " has invalid public key: " + e.message);
            }
            try {
                this.SignatureType(signature.signature_type);
            }
            catch (e) {
                throw new errors_1.AsserterError("signature " + i + " has invalid signature type: " + e.message);
            }
            if (signature.signing_payload.signature_type &&
                signature.signing_payload.signature_type !=
                    signature.signature_type) {
                throw new errors_1.AsserterError("requested signature type does not match returned signature type");
            }
            if (!signature.hex_bytes || signature.hex_bytes.length == 0) {
                throw new errors_1.AsserterError("signature " + i + ": bytes cannot be empty");
            }
            if (!this.checkHex(signature.hex_bytes)) {
                throw new errors_1.AsserterError("hex_bytes must be a valid hexadecimal string");
            }
        }
    };
    /**
     * Validates a SignatureType.
     *
     * @param {Rosetta:SignatureType} signatureType - signature type that will be validated.
     * @throws {AsserterError} thrown if the provided signature type is not defined in the standard.
     */
    RosettaAsserter.prototype.SignatureType = function (signatureType) {
        switch (signatureType) {
            case new Types.SignatureType().ecdsa:
            case new Types.SignatureType().ecdsa_recovery:
            case new Types.SignatureType().ed25519:
                break;
            default:
                throw new errors_1.AsserterError(JSON.stringify(signatureType) + " is not a supported SignatureType");
        }
    };
    /**
     * Validates a transaction array.
     *
     * @param {Rosetta:Transaction[]} transactionIdentifiers - Transaction Array that will be validated.
     * @throws {AsserterError} thrown if the at least one of the provided transactions is invalid.
     */
    RosettaAsserter.prototype.MempoolTransactions = function (transactionIdentifiers) {
        var e_4, _a;
        try {
            for (var transactionIdentifiers_1 = __values(transactionIdentifiers), transactionIdentifiers_1_1 = transactionIdentifiers_1.next(); !transactionIdentifiers_1_1.done; transactionIdentifiers_1_1 = transactionIdentifiers_1.next()) {
                var t = transactionIdentifiers_1_1.value;
                this.TransactionIdentifier(t);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (transactionIdentifiers_1_1 && !transactionIdentifiers_1_1.done && (_a = transactionIdentifiers_1["return"])) _a.call(transactionIdentifiers_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    /**
     * Checks if a string is valid
     *
     * @param {string} input - Input that will be validated to be a string.
     * @returns {boolean} specifies whether the input is a valid non-empty string.
     */
    RosettaAsserter.prototype.validString = function (input) {
        if (typeof input !== 'string')
            return false;
        return !!input;
    };
    /**
     * Validates a network identifier.
     *
     * @param {Rosetta:NetworkIdentifier} networkIdentifier - network identifier that will be validated.
     * @throws {AsserterError} thrown if the provided network identifier is null or empty, the blockchain
     *     property is missing, the network is missing or empty or, if specified, the subnetwork identifier
     *     is invalid.
     */
    RosettaAsserter.prototype.NetworkIdentifier = function (networkIdentifier) {
        if (networkIdentifier == null)
            throw new errors_1.AsserterError('NetworkIdentifier is null');
        if (!this.validString(networkIdentifier.blockchain))
            throw new errors_1.AsserterError('NetworkIdentifier.blockchain is missing');
        if (!this.validString(networkIdentifier.network))
            throw new errors_1.AsserterError('NetworkIdentifier.network is missing');
        return this.SubNetworkIdentifier(networkIdentifier.sub_network_identifier);
    };
    /**
     * Validates a SubNetworkIdentifier.
     *
     * @param {Rosetta:SubNetworkIdentifier} subnetworkIdentifier - subnetwork identifier that will be validated.
     * @throws {AsserterError} thrown if the provided network identifier is null or empty
     */
    RosettaAsserter.prototype.SubNetworkIdentifier = function (subnetworkIdentifier) {
        // Only check if specified in the response.
        if (subnetworkIdentifier == null)
            return;
        if (!this.validString(subnetworkIdentifier.network)) {
            throw new errors_1.AsserterError('NetworkIdentifier.sub_network_identifier.network is missing');
        }
    };
    /**
     * Validates a Peer.
     *
     * @param {Rosetta:Peer} peer - peer that will be validated.
     * @throws {AsserterError} thrown if the provided peer is null or is missing a peer id.
     */
    RosettaAsserter.prototype.Peer = function (peer) {
        if (peer == null || !peer.peer_id) {
            throw new errors_1.AsserterError('Peer.peer_id is missing');
        }
    };
    /**
     * Validates a Version.
     *
     * @param {Rosetta:Version} version - version that will be validated.
     * @throws {AsserterError} thrown if the provided version is null, the
     *     property node_version is empty, or, if specified, the
     *     middleware_version is empty.
     */
    RosettaAsserter.prototype.Version = function (version) {
        if (version == null) {
            throw new errors_1.AsserterError('Version is null');
        }
        if (!this.validString(version.node_version)) {
            throw new errors_1.AsserterError('Version.node_version is missing');
        }
        if (version.middleware_version != null &&
            !this.validString(version.middleware_version)) {
            throw new errors_1.AsserterError('Version.middleware_version is missing');
        }
    };
    /**
     * Validates a StringArray.
     *
     * @param {string} name - Name of the array to be validated.
     * @param {string[]} array - Array to validate.
     * @throws {AsserterError} thrown if the provided array is empty, contains
     *     empty/invalid strings or if duplicate strings are detected.
     */
    RosettaAsserter.prototype.StringArray = function (name, array) {
        var e_5, _a;
        if (!array || array.length == 0) {
            throw new errors_1.AsserterError("No " + name + " found");
        }
        var existing = [];
        try {
            for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
                var element = array_1_1.value;
                if (!this.validString(element)) {
                    throw new errors_1.AsserterError(name + " has an empty string");
                }
                if (existing.includes(element)) {
                    throw new errors_1.AsserterError(name + " contains a duplicate element: " + element);
                }
                existing.push(element);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1["return"])) _a.call(array_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    /**
     * Validates a Timestamp.
     *
     * @param {number} timestamp - Timestamp to be checked.
     * @throws {AsserterError} thrown if the provided timestamp is not in the expected range.
     */
    RosettaAsserter.prototype.Timestamp = function (timestamp) {
        if (timestamp === void 0) { timestamp = 0; }
        if (timestamp < RosettaAsserter.MinUnixEpoch) {
            throw new errors_1.AsserterError("Timestamp " + timestamp + " is before 01/01/2000");
        }
        else if (timestamp > RosettaAsserter.MaxUnixEpoch) {
            throw new errors_1.AsserterError("Timestamp " + timestamp + " is after 01/01/2040");
        }
        else {
            return null;
        }
    };
    /**
     * Validates a NetworkStatusResponse.
     *
     * @param {Rosetta:NetworkStatusResponse} networkStatusResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null, the block identifier is invalid,
     *     the block timestamp is invalid, the genesis block identifier is invalid or if at least
     *     one of the peers is invalid.
     */
    RosettaAsserter.prototype.NetworkStatusResponse = function (networkStatusResponse) {
        var e_6, _a;
        if (networkStatusResponse == null) {
            throw new errors_1.AsserterError('networkStatusResponse is null');
        }
        this.BlockIdentifier(networkStatusResponse.current_block_identifier);
        this.Timestamp(networkStatusResponse.current_block_timestamp);
        this.BlockIdentifier(networkStatusResponse.genesis_block_identifier);
        if (!Array.isArray(networkStatusResponse.peers))
            throw new errors_1.AsserterError('Peers must be an array.');
        try {
            for (var _b = __values(networkStatusResponse.peers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var peer = _c.value;
                this.Peer(peer);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    /**
     * Validates an array of Rosetta:OperationStatus.
     *
     * @param {Rosetta:OperationStatus[]} operationStatuses - operation status array to be validated
     * @throws {AsserterError} thrown if the provided array is null or empty, not at least one successful
     *     operation was specified or if at least one of the operations' status is invalid.
     */
    RosettaAsserter.prototype.OperationStatuses = function (operationStatuses) {
        var e_7, _a;
        if (operationStatuses == null || operationStatuses.length == 0) {
            throw new errors_1.AsserterError('No Allow.operation_statuses found');
        }
        var existingStatuses = [];
        var foundSuccessful = false;
        try {
            for (var operationStatuses_2 = __values(operationStatuses), operationStatuses_2_1 = operationStatuses_2.next(); !operationStatuses_2_1.done; operationStatuses_2_1 = operationStatuses_2.next()) {
                var status = operationStatuses_2_1.value;
                if (!status.status) {
                    throw new errors_1.AsserterError('Operation.status is missing');
                }
                if (status.successful) {
                    foundSuccessful = true;
                }
                existingStatuses.push(status.status);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (operationStatuses_2_1 && !operationStatuses_2_1.done && (_a = operationStatuses_2["return"])) _a.call(operationStatuses_2);
            }
            finally { if (e_7) throw e_7.error; }
        }
        if (!foundSuccessful) {
            throw new errors_1.AsserterError('No successful Allow.operation_statuses found');
        }
        return this.StringArray('Allow.operation_statuses', existingStatuses);
    };
    /**
     * Validates an array of OperationType (string).
     *
     * @param {Rosetta:OperationTypes[]} types - operation type array to be validated
     * @throws {AsserterError} thrown if the provided array is not a valid string array.
     */
    RosettaAsserter.prototype.OperationTypes = function (types) {
        return this.StringArray('Allow.operation_statuses', types);
    };
    /**
     * Validates a Rosetta:Error type.
     *
     * @param {Rosetta:Error} error - error to be validated
     * @throws {AsserterError} thrown if the provided error is null, the error code
     *     is negative or if the message is not a valid string.
     */
    RosettaAsserter.prototype.Error = function (error) {
        if (error == null) {
            throw new errors_1.AsserterError('Error is null');
        }
        if (error.code < 0) {
            throw new errors_1.AsserterError('Error.code is negative');
        }
        if (!this.validString(error.message)) {
            throw new errors_1.AsserterError('Error.message is missing');
        }
    };
    /**
     * Validates an array of Rosetta:Error.
     *
     * @param {Rosetta:Error[]} rosettaErrors - array of errors to be validated
     * @throws {AsserterError} thrown if one or more errors is invalid, or if a duplicate
     *     error code was detected.
     */
    RosettaAsserter.prototype.Errors = function (rosettaErrors) {
        var e_8, _a;
        if (rosettaErrors === void 0) { rosettaErrors = []; }
        var statusCodeMap = {};
        try {
            for (var rosettaErrors_1 = __values(rosettaErrors), rosettaErrors_1_1 = rosettaErrors_1.next(); !rosettaErrors_1_1.done; rosettaErrors_1_1 = rosettaErrors_1.next()) {
                var rosettaError = rosettaErrors_1_1.value;
                this.Error(rosettaError);
                if (statusCodeMap[rosettaError.code] != null) {
                    throw new errors_1.AsserterError('Error code used multiple times');
                }
                statusCodeMap[rosettaError.code] = true;
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (rosettaErrors_1_1 && !rosettaErrors_1_1.done && (_a = rosettaErrors_1["return"])) _a.call(rosettaErrors_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    /**
     * Validates a Rosetta:Allow type.
     *
     * @param {Rosetta:Allow} allowed - Allow struct to be validated.
     * @throws {AsserterError} thrown if the provided Allow type is null, or if one of its
     *     specifications is invalid.
     */
    RosettaAsserter.prototype.Allow = function (allowed) {
        if (allowed == null) {
            throw new errors_1.AsserterError('Allow is null');
        }
        this.OperationStatuses(allowed.operation_statuses);
        this.OperationTypes(allowed.operation_types);
        this.Errors(allowed.errors);
    };
    /**
     * Validates a NetworkOptionsResponse.
     *
     * @param {Rosetta:NetworkOptionsResponse} networkOptionsResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null, the returned version is invalid,
     *     or if the returned Allow struct is invalid.
     */
    RosettaAsserter.prototype.NetworkOptionsResponse = function (networkOptionsResponse) {
        if (networkOptionsResponse == null) {
            throw new errors_1.AsserterError('NetworkOptions Response is null');
        }
        this.Version(networkOptionsResponse.version);
        return this.Allow(networkOptionsResponse.allow);
    };
    /**
     * Checks if a network is contained in an array of networks.
     *
     * @param {Rosetta:NetworkIdentifier[]} networks - Array of networks
     * @param {Rosetta:NetworkIdentifier} network - network to be found in networks array.
     * @returns {boolean} describes whether the network was found in the array of networks.
     */
    RosettaAsserter.prototype.containsNetworkIdentifier = function (networks, network) {
        var networkHash = utils_1.Hash(network);
        var index = networks.findIndex(function (n) { return utils_1.Hash(n) == networkHash; });
        return index >= 0;
    };
    /**
     * Validates a NetworkListResponse.
     *
     * @param {Rosetta:NetworkListResponse} networkListResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null or if at least one
     *     of the network identifiers is empty or duplicated.
     */
    RosettaAsserter.prototype.NetworkListResponse = function (networkListResponse) {
        var e_9, _a;
        if (networkListResponse == null) {
            throw new errors_1.AsserterError('NetworkListResponse is null');
        }
        var existingNetworks = [];
        try {
            for (var _b = __values(networkListResponse.network_identifiers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var network = _c.value;
                this.NetworkIdentifier(network);
                if (this.containsNetworkIdentifier(existingNetworks, network)) {
                    throw new errors_1.AsserterError('NetworkListResponse.Network contains duplicated');
                }
                existingNetworks.push(network);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    /**
     * Checks if a currency is contained in an array of currencies.
     *
     * @param {Rosetta:Currency[]} currencies - Array of currencies
     * @param {Rosetta:Currency} currency - currency to be found in currency array.
     * @returns {boolean} describes whether the currency was found in the array of currencies.
     */
    RosettaAsserter.prototype.containsCurrency = function (currencies, currency) {
        var currencyIndex = currencies.findIndex(function (a) { return utils_1.Hash(a) == utils_1.Hash(currency); });
        return currencyIndex >= 0;
    };
    /**
     * Validates an Array of Rosetta:Amount.
     *
     * @param {Rosetta:Amount[]} amountsArray - Amounts to be validated
     * @throws {AsserterError} thrown if a currency is used multiple times, or if one
     *     of the amounts is invalid.
     */
    RosettaAsserter.prototype.assertBalanceAmounts = function (amountsArray) {
        var e_10, _a;
        var currencies = [];
        try {
            for (var amountsArray_1 = __values(amountsArray), amountsArray_1_1 = amountsArray_1.next(); !amountsArray_1_1.done; amountsArray_1_1 = amountsArray_1.next()) {
                var amount = amountsArray_1_1.value;
                var containsCurrency = this.containsCurrency(currencies, amount.currency);
                if (containsCurrency) {
                    throw new errors_1.AsserterError("Currency " + amount.currency.symbol + " used in balance multiple times");
                }
                currencies.push(amount.currency);
                this.Amount(amount);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (amountsArray_1_1 && !amountsArray_1_1.done && (_a = amountsArray_1["return"])) _a.call(amountsArray_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
    };
    /**
     * Validates an Amount type.
     *
     * @param {Rosetta:Amount} amount - amount to be validated
     * @throws {AsserterError} thrown if the amount is null or empty, its value is not a valid
     *     integer (encoded as string), or if the provided currency is invalid.
     */
    RosettaAsserter.prototype.Amount = function (amount) {
        if (amount == null || amount.value == '') {
            throw new errors_1.AsserterError("Amount.value is missing");
        }
        // Allow all numbers, except e notation, or negative numbers.
        if (!/^-?[0-9]+$/.test(amount.value)) {
            throw new errors_1.AsserterError("Amount.value is not an integer: " + amount.value);
        }
        if (amount.currency == null) {
            throw new errors_1.AsserterError('Amount.currency is null');
        }
        if (!amount.currency.symbol) {
            throw new errors_1.AsserterError('Amount.currency does not have a symbol');
        }
        if (amount.currency.decimals < 0) {
            throw new errors_1.AsserterError("Amount.currency.decimals must be positive. Found: " + amount.currency.decimals);
        }
    };
    /**
     * Validates a CoinIdentifier type.
     *
     * @param {Rosetta:CoinIdentifier} coinIdentifier - identifier to be validated.
     * @throws {AsserterError} thrown if the provided coin identifier is null or empty.
     */
    RosettaAsserter.prototype.CoinIdentifier = function (coinIdentifier) {
        if (coinIdentifier == null) {
            throw new errors_1.AsserterError('coin_identifier cannot be null');
        }
        if (!this.validString(coinIdentifier.identifier)) {
            throw new errors_1.AsserterError('coin_identifier cannot be empty');
        }
    };
    /**
     * Validates a CoinAction.
     *
     * @param {Rosetta:CoinAction} coinAction - coin action to be validated.
     * @throws {AsserterError} thrown if the provided coin action is not defined in the standard.
     */
    RosettaAsserter.prototype.CoinAction = function (coinAction) {
        switch (coinAction) {
            case new Types.CoinAction().created:
            case new Types.CoinAction().spent:
                break;
            default:
                throw new errors_1.AsserterError(JSON.stringify(coinAction) + " is not a valid coin action");
        }
    };
    /**
     * Validates a CoinChange type.
     *
     * @param {Rosetta:CoinChange} coinChange - coin change to be validated.
     * @throws {AsserterError} thrown if the provided coin change type is null, or either
     *     the coin_identifier or coin_action is invalid.
     */
    RosettaAsserter.prototype.CoinChange = function (coinChange) {
        if (coinChange == null) {
            throw new errors_1.AsserterError('coin change cannot be null');
        }
        try {
            this.CoinIdentifier(coinChange.coin_identifier);
        }
        catch (e) {
            throw new errors_1.AsserterError("coin identifier is invalid: " + e.message);
        }
        try {
            this.CoinAction(coinChange.coin_action);
        }
        catch (e) {
            throw new errors_1.AsserterError("coin action is invalid: " + e.message);
        }
    };
    /**
     * Validates a Coin type.
     *
     * @param {Rosetta:Coin} coin - coin to be validated.
     * @throws {AsserterError} thrown if the provided coin type is null, or either
     *     the coin_identifier or amount is invalid.
     */
    RosettaAsserter.prototype.Coin = function (coin) {
        if (!coin) {
            throw new errors_1.AsserterError('Coin cannot be null');
        }
        try {
            this.CoinIdentifier(coin.coin_identifier);
        }
        catch (e) {
            throw new errors_1.AsserterError("coin identifier is invalid: " + e.message);
        }
        try {
            this.Amount(coin.amount);
        }
        catch (e) {
            throw new errors_1.AsserterError("coin amount is invalid: " + e.message);
        }
    };
    /**
     * Validates an array of coins.
     *
     * @param {Rosetta:Coin[]} coinArray - coin array to be validated.
     * @throws {AsserterError} thrown if the provided coin array is empty, or either
     *     the array contains duplicates or at least one of the coins is invalid.
     */
    RosettaAsserter.prototype.Coins = function (coinArray) {
        var e_11, _a;
        var ids = {};
        if (!coinArray)
            return;
        try {
            for (var coinArray_1 = __values(coinArray), coinArray_1_1 = coinArray_1.next(); !coinArray_1_1.done; coinArray_1_1 = coinArray_1.next()) {
                var coin = coinArray_1_1.value;
                try {
                    this.Coin(coin);
                }
                catch (e) {
                    throw new errors_1.AsserterError("coin is invalid: " + e.message);
                }
                if (ids[coin.coin_identifier.identifier]) {
                    throw new errors_1.AsserterError("duplicate coin identifier detected: " +
                        ("" + coin.coin_identifier.identifier));
                }
                ids[coin.coin_identifier.identifier] = true;
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (coinArray_1_1 && !coinArray_1_1.done && (_a = coinArray_1["return"])) _a.call(coinArray_1);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    /**
     * Validates a AccountBalanceResponse.
     *
     * @param {Rosetta:PartialBlockIdentifier} partialBlockIdentifier - Partial block identifier that was requested.
     * @param {Rosetta:AccountBalanceResponse} accountBalanceResponse - Response to be validated.
     * @throws {AsserterError} thrown if the provided partial block identifier is invalid, the returned balances are
     *     invalid, the coins are invalid or, if specified, the partialBlockIndex does not match the returned
     *     block identifier.
     */
    /* AccountBalanceResponse(
        partialBlockIdentifier: PartialBlockIdentifier,
        accountBalanceResponse: AccountBalanceResponse
    ) {
        this.BlockIdentifier(accountBalanceResponse.block_identifier);
        this.assertBalanceAmounts(accountBalanceResponse.balances);

        if (accountBalanceResponse.coins != null) {
            this.Coins(accountBalanceResponse.coins);
        }

        if (partialBlockIdentifier == null) {
            return;
        }

        if (
            partialBlockIdentifier.hash != null &&
            partialBlockIdentifier.hash !=
                accountBalanceResponse.block_identifier.hash
        ) {
            throw new AsserterError(
                `Request BlockHash ${partialBlockIdentifier.hash}` +
                    ` does not match Response block hash ${accountBalanceResponse.block_identifier.hash}`
            );
        }

        if (
            partialBlockIdentifier.index != null &&
            partialBlockIdentifier.index !=
                accountBalanceResponse.block_identifier.index
        ) {
            throw new AsserterError(
                `Request Index ${partialBlockIdentifier.index}` +
                    ` does not match Response block index ${accountBalanceResponse.block_identifier.index}`
            );
        }
    } */
    /**
     * Validates an OperationIdentifier.
     *
     * @param {Rosetta:OperationIdentifier} operationIdentifier - Operation Identifier to validate.
     * @param {number} index - Expected index.
     * @throws {AsserterError} thrown if the provided index is not a number, the operation identifier is null,
     *     the index does not match the index specified in the operation or if the network index is invalid.
     */
    RosettaAsserter.prototype.OperationIdentifier = function (operationIdentifier, index) {
        if (typeof index !== 'number') {
            throw new errors_1.AsserterError('OperationIdentifier: index must be a number');
        }
        if (operationIdentifier == null) {
            throw new errors_1.AsserterError('OperationIdentifier is null');
        }
        if (operationIdentifier.index != index) {
            throw new errors_1.AsserterError("OperationIdentifier.index " + operationIdentifier.index + " is out of order, expected " + index);
        }
        if (operationIdentifier.network_index != null &&
            operationIdentifier.network_index < 0) {
            throw new errors_1.AsserterError('OperationIdentifier.network_index is invalid');
        }
    };
    /**
     * Validates an AccountIdentifier.
     *
     * @param {Rosetta:AccountIdentifier} accountIdentifier - account identifier to be validated.
     * @throws {AsserterError} thrown if the provided account identifier is null, the address is missing, or
     *     if specified, the sub_account's address is missing.
     */
    RosettaAsserter.prototype.AccountIdentifier = function (accountIdentifier) {
        if (accountIdentifier == null) {
            throw new errors_1.AsserterError('Account is null');
        }
        if (!this.validString(accountIdentifier.address)) {
            throw new errors_1.AsserterError('Account.address is missing');
        }
        if (accountIdentifier.sub_account == null) {
            return;
        }
        if (!this.validString(accountIdentifier.sub_account.address)) {
            throw new errors_1.AsserterError('Account.sub_account.address is missing');
        }
    };
    /**
     * Validates an OperationStatus.
     *
     * @param {Rosetta:OperationStatus} operationStatus - operation status to be validated.
     * @throws {AsserterError} thrown if the provided status is null or empty, or if the
     *     provided status is not supported.
     */
    RosettaAsserter.prototype.OperationStatus = function (status) {
        if (status == null) {
            throw new errors_1.AsserterError('Asserter not initialized');
        }
        if (typeof status !== 'string') {
            throw new errors_1.AsserterError('OperationStatus.status must be a string');
        }
        if (status == '') {
            throw new errors_1.AsserterError('OperationStatus.status is empty');
        }
        if (this.operationStatusMap[status] == null) {
            throw new errors_1.AsserterError("OperationStatus.status " + status + " is not valid");
        }
    };
    RosettaAsserter.prototype.OperationType = function (type) {
        if (typeof type !== 'string') {
            throw new errors_1.AsserterError('OperationStatus.type must be a string');
        }
        if (type == '' || !this.operationTypes.includes(type)) {
            throw new errors_1.AsserterError("Operation.type " + type + " is invalid");
        }
    };
    RosettaAsserter.prototype.Operation = function (operation, index, construction) {
        if (construction === void 0) { construction = false; }
        if (operation == null) {
            throw new errors_1.AsserterError('Operation is null');
        }
        try {
            this.OperationIdentifier(operation.operation_identifier, index);
        }
        catch (e) {
            throw new errors_1.AsserterError("Operation.identifier is invalid in operation " + index + ": " + e.message);
        }
        try {
            this.OperationType(operation.type);
        }
        catch (e) {
            throw new errors_1.AsserterError("Operation.type is invalid in operation " + index + ": " + e.message);
        }
        if (construction) {
            if (operation.status && operation.status.length > 0) {
                throw new errors_1.AsserterError('Operation.status must be empty for construction');
            }
        }
        else {
            try {
                this.OperationStatus(operation.status);
            }
            catch (e) {
                throw new errors_1.AsserterError("Operation.status is invalid in operation " + index + ": " + e.message);
            }
        }
        if (operation.amount == null) {
            return null;
        }
        try {
            this.AccountIdentifier(operation.account);
        }
        catch (e) {
            throw new errors_1.AsserterError("operation.account is invalid in operation " + index + ": " + e.message);
        }
        try {
            this.Amount(operation.amount);
        }
        catch (e) {
            throw new errors_1.AsserterError("operation.amount is invalid in operation " + index + ": " + e.message);
        }
        if (operation.coin_change == null)
            return null;
        try {
            this.CoinChange(operation.coin_change);
        }
        catch (e) {
            throw new errors_1.AsserterError("operation.coin_change is invalid in operation " + index + ": " + e.message);
        }
    };
    RosettaAsserter.prototype.BlockIdentifier = function (blockIdentifier) {
        if (blockIdentifier == null) {
            throw new errors_1.AsserterError('BlockIdentifier is null');
        }
        if (!blockIdentifier.hash) {
            throw new errors_1.AsserterError('BlockIdentifier.hash is missing');
        }
        if (blockIdentifier.index < 0) {
            throw new errors_1.AsserterError('BlockIdentifier.index is negative');
        }
    };
    RosettaAsserter.prototype.PartialBlockIdentifier = function (partialBlockIdentifier) {
        if (partialBlockIdentifier == null) {
            throw new errors_1.AsserterError('PartialBlockIdentifier is null');
        }
        if (!!partialBlockIdentifier.hash) {
            return null;
        }
        if (partialBlockIdentifier.index != null &&
            partialBlockIdentifier.index >= 0) {
            return null;
        }
        throw new errors_1.AsserterError('Neither PartialBlockIdentifier.hash nor PartialBlockIdentifier.index is set');
    };
    RosettaAsserter.prototype.TransactionIdentifier = function (transactionIdentifier) {
        if (transactionIdentifier == null) {
            throw new errors_1.AsserterError('TransactionIdentifier is null');
        }
        if (!transactionIdentifier.hash) {
            throw new errors_1.AsserterError('TransactionIdentifier.hash is missing');
        }
    };
    RosettaAsserter.prototype.Operations = function (operations, construction) {
        var e_12, _a;
        if (construction === void 0) { construction = false; }
        if (!operations)
            throw new errors_1.AsserterError('Operations cannot be null');
        if (operations.length == 0 && construction) {
            throw new errors_1.AsserterError('Operations cannot be empty for construction');
        }
        for (var i = 0; i < operations.length; ++i) {
            var operation = operations[i];
            this.Operation(operation, i, construction);
            var relatedIndices = [];
            if (!operation.related_operations)
                continue;
            try {
                for (var _b = (e_12 = void 0, __values(operation.related_operations)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var relatedOperation = _c.value;
                    if (relatedOperation.index >=
                        operation.operation_identifier.index) {
                        throw new errors_1.AsserterError("Related operation index " + relatedOperation.index +
                            (" >= operation index " + operation.operation_identifier.index));
                    }
                    if (relatedIndices.includes(relatedOperation.index)) {
                        throw new errors_1.AsserterError("Found duplicate related operation index" +
                            (" " + relatedOperation.index + " for operation index " + operation.operation_identifier.index));
                    }
                    relatedIndices.push(relatedOperation.index);
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_12) throw e_12.error; }
            }
        }
    };
    RosettaAsserter.prototype.Transaction = function (transaction) {
        if (transaction == null) {
            throw new errors_1.AsserterError('Transaction is null');
        }
        this.TransactionIdentifier(transaction.transaction_identifier);
        if (!Array.isArray(transaction.operations)) {
            throw new errors_1.AsserterError('Transaction.operations must be an array');
        }
        try {
            this.Operations(transaction.operations);
        }
        catch (e) {
            throw new errors_1.AsserterError("Invalid operation in transaction " +
                (transaction.transaction_identifier.hash + ": " + e.message));
        }
    };
    RosettaAsserter.prototype.Block = function (block) {
        var e_13, _a;
        if (block == null) {
            throw new errors_1.AsserterError('Block is null');
        }
        this.BlockIdentifier(block.block_identifier);
        this.BlockIdentifier(block.parent_block_identifier);
        if (this.genesisBlockIdentifier.index != block.block_identifier.index) {
            if (block.block_identifier.hash ==
                block.parent_block_identifier.hash) {
                throw new errors_1.AsserterError('BlockIdentifier.hash == ParentBlockIdentifier.hash');
            }
            if (block.block_identifier.index <=
                block.parent_block_identifier.index) {
                throw new errors_1.AsserterError('BlockIdentifier.index <= ParentBlockIdentifier.index');
            }
            this.Timestamp(block.timestamp);
        }
        try {
            for (var _b = __values(block.transactions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transaction = _c.value;
                this.Transaction(transaction);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
    };
    RosettaAsserter.NewServer = function (supportedOperationTypes, historicalBalanceLookup, supportedNetworks) {
        var tmp = new RosettaAsserter(); // ToDo: alter methods to static
        tmp.OperationTypes(supportedOperationTypes);
        tmp.SupportedNetworks(supportedNetworks);
        return new RosettaAsserter({
            supportedNetworks: supportedNetworks,
            historicalBalanceLookup: historicalBalanceLookup,
            operationTypes: supportedOperationTypes
        });
    };
    RosettaAsserter.NewClientWithFile = function (filePath) {
        var buffer = fs_1["default"].readFileSync(filePath);
        var contents = buffer.toString();
        var json = JSON.parse(contents);
        return RosettaAsserter.NewClientWithOptions(json.network_identifier, json.genesis_block_identifier, json.allowed_operation_types, json.allowed_operation_statuses, json.allowed_errors);
    };
    RosettaAsserter.NewClientWithResponses = function (networkIdentifier, networkStatus, networkOptions) {
        var tmp = new RosettaAsserter();
        tmp.NetworkIdentifier(networkIdentifier);
        tmp.NetworkStatusResponse(networkStatus);
        tmp.NetworkOptionsResponse(networkOptions);
        return RosettaAsserter.NewClientWithOptions(networkIdentifier, networkStatus.genesis_block_identifier, networkOptions.allow.operation_types, networkOptions.allow.operation_statuses, networkOptions.allow.errors);
    };
    RosettaAsserter.prototype.OperationSuccessful = function (operation) {
        var status = this.operationStatusMap[operation.status];
        if (status == null) {
            throw new errors_1.AsserterError(operation.status + " not found in possible statuses");
        }
        return status;
    };
    RosettaAsserter.prototype.getClientConfiguration = function () {
        var e_14, _a, e_15, _b;
        var operationStatuses = [];
        var errors = [];
        try {
            for (var _c = __values(Object.keys(this.operationStatusMap)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var key = _d.value;
                var value = this.operationStatusMap[key];
                var operationStatus = new Types.OperationStatus(key, value);
                // Validate
                // this.OperationStatus(operationStatus);
                operationStatuses.push(operationStatus);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_14) throw e_14.error; }
        }
        try {
            for (var _e = __values(Object.keys(this.errorTypeMap)), _f = _e.next(); !_f.done; _f = _e.next()) {
                var key = _f.value;
                var value = this.errorTypeMap[key];
                errors.push(value);
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_15) throw e_15.error; }
        }
        var ret = {
            network_identifier: this.networkIdentifier,
            supportedNetworks: this.supportedNetworks,
            genesis_block_identifier: this.genesisBlockIdentifier,
            allowed_operation_types: this.operationTypes,
            allowed_operation_statuses: operationStatuses,
            allowed_errors: errors
        };
        return ret;
    };
    RosettaAsserter.NewClientWithOptions = function (networkIdentifier, genesisBlockIdentifier, operationTypes, operationStatuses, errors) {
        if (operationStatuses === void 0) { operationStatuses = []; }
        if (errors === void 0) { errors = []; }
        var tmp = new RosettaAsserter();
        tmp.NetworkIdentifier(networkIdentifier);
        tmp.BlockIdentifier(genesisBlockIdentifier);
        tmp.OperationStatuses(operationStatuses);
        tmp.OperationTypes(operationTypes);
        var r = new RosettaAsserter({
            operationTypes: operationTypes,
            genesisBlockIdentifier: genesisBlockIdentifier
        });
        r.networkIdentifier = networkIdentifier;
        r.errorTypeMap = (function () {
            var e_16, _a;
            var ret = {};
            try {
                for (var errors_2 = __values(errors), errors_2_1 = errors_2.next(); !errors_2_1.done; errors_2_1 = errors_2.next()) {
                    var error = errors_2_1.value;
                    ret[error.code] = error;
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (errors_2_1 && !errors_2_1.done && (_a = errors_2["return"])) _a.call(errors_2);
                }
                finally { if (e_16) throw e_16.error; }
            }
            return ret;
        })();
        r.operationStatusMap = (function () {
            var e_17, _a;
            var ret = {};
            try {
                for (var operationStatuses_3 = __values(operationStatuses), operationStatuses_3_1 = operationStatuses_3.next(); !operationStatuses_3_1.done; operationStatuses_3_1 = operationStatuses_3.next()) {
                    var status = operationStatuses_3_1.value;
                    ret[status.status] = status.successful;
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (operationStatuses_3_1 && !operationStatuses_3_1.done && (_a = operationStatuses_3["return"])) _a.call(operationStatuses_3);
                }
                finally { if (e_17) throw e_17.error; }
            }
            return ret;
        })();
        return r;
    };
    RosettaAsserter.MinUnixEpoch = 946713600000; // 01/01/2000 at 12:00:00 AM.
    RosettaAsserter.MaxUnixEpoch = 2209017600000; // 01/01/2040 at 12:00:00 AM.
    return RosettaAsserter;
}());
exports["default"] = RosettaAsserter;