"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
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
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var axios_1 = __importDefault(require("axios"));
var handler = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    function searchYouTube(query_1) {
        return __awaiter(this, arguments, void 0, function (query, type) {
            var response, error_2;
            if (type === void 0) { type = 'video'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
                                params: {
                                    part: 'snippet',
                                    q: query,
                                    type: type,
                                    key: YOUTUBE_API_KEY,
                                    maxResults: 1
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.items[0]];
                    case 2:
                        error_2 = _a.sent();
                        console.error("YouTube API Error:", error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var DISCOGS_TOKEN, YOUTUBE_API_KEY, _a, genre, style, year, country, _b, type, searchParams, randomYear, searchUrl, initialResponse, totalItems, maxItems, attempts, MAX_ATTEMPTS, randomPage, randomResponse, release, detailsResponse, fullRelease, artist, title, query, youtubeData, playlist, videoIds, video, innerError_1, error_1, errorData;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                // Only allow GET requests
                if (event.httpMethod !== "GET") {
                    return [2 /*return*/, {
                            statusCode: 405,
                            body: JSON.stringify({ error: "Method Not Allowed" }),
                        }];
                }
                DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || "ZVQpZIZeFkvNaxSKslHgiAEhhwpvwSfXKLJQiXGA";
                YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyBEYhVFn2QDsumv32BjOBVg89OpUYRzWTk";
                _g.label = 1;
            case 1:
                _g.trys.push([1, 15, , 16]);
                _a = event.queryStringParameters || {}, genre = _a.genre, style = _a.style, year = _a.year, country = _a.country, _b = _a.type, type = _b === void 0 ? 'release' : _b;
                console.log("Searching with: genre=".concat(genre, ", style=").concat(style, ", year=").concat(year, ", country=").concat(country));
                searchParams = new URLSearchParams({
                    token: DISCOGS_TOKEN,
                    type: type,
                    format: 'album',
                    per_page: '1',
                });
                if (genre)
                    searchParams.append('genre', genre);
                if (style)
                    searchParams.append('style', style);
                if (country)
                    searchParams.append('country', country);
                // Handle decade selection
                if (year) {
                    if (year.toString().length === 3) {
                        randomYear = Math.floor(Math.random() * 10) + parseInt(year.toString() + "0");
                        searchParams.append('year', randomYear.toString());
                    }
                    else {
                        searchParams.append('year', year);
                    }
                }
                searchUrl = "https://api.discogs.com/database/search?".concat(searchParams.toString());
                return [4 /*yield*/, axios_1.default.get(searchUrl, {
                        headers: { 'User-Agent': 'DiscogsRandomizer/1.0' }
                    })];
            case 2:
                initialResponse = _g.sent();
                totalItems = initialResponse.data.pagination.items;
                if (totalItems === 0) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            body: JSON.stringify({ error: "No releases found with these filters." }),
                        }];
                }
                maxItems = Math.min(totalItems, 10000);
                attempts = 0;
                MAX_ATTEMPTS = 10;
                _g.label = 3;
            case 3:
                if (!(attempts < MAX_ATTEMPTS)) return [3 /*break*/, 14];
                attempts++;
                randomPage = Math.floor(Math.random() * maxItems) + 1;
                _g.label = 4;
            case 4:
                _g.trys.push([4, 12, , 13]);
                return [4 /*yield*/, axios_1.default.get("".concat(searchUrl, "&page=").concat(randomPage), {
                        headers: { 'User-Agent': 'DiscogsRandomizer/1.0' }
                    })];
            case 5:
                randomResponse = _g.sent();
                release = (_c = randomResponse.data.results) === null || _c === void 0 ? void 0 : _c[0];
                if (!(release && release.id)) return [3 /*break*/, 11];
                return [4 /*yield*/, axios_1.default.get("https://api.discogs.com/releases/".concat(release.id, "?token=").concat(DISCOGS_TOKEN), {
                        headers: { 'User-Agent': 'DiscogsRandomizer/1.0' }
                    })];
            case 6:
                detailsResponse = _g.sent();
                fullRelease = detailsResponse.data;
                artist = ((_e = (_d = fullRelease.artists) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.name) || "";
                title = fullRelease.title || "";
                query = "".concat(artist, " - ").concat(title);
                youtubeData = null;
                return [4 /*yield*/, searchYouTube(query, 'playlist')];
            case 7:
                playlist = _g.sent();
                if (!playlist) return [3 /*break*/, 8];
                youtubeData = { type: 'playlist', id: playlist.id.playlistId };
                return [3 /*break*/, 10];
            case 8:
                // 2. If no playlist, check Discogs videos
                if (fullRelease.videos && fullRelease.videos.length > 0) {
                    videoIds = fullRelease.videos.map(function (v) {
                        // Handle standard watch URLs and short URLs
                        var match = v.uri.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:&|\?|$)/);
                        return match ? match[1] : null;
                    }).filter(Boolean);
                    if (videoIds.length > 0) {
                        youtubeData = { type: 'videos', ids: videoIds };
                    }
                }
                if (!!youtubeData) return [3 /*break*/, 10];
                return [4 /*yield*/, searchYouTube(query, 'video')];
            case 9:
                video = _g.sent();
                if (video) {
                    youtubeData = { type: 'videos', ids: [video.id.videoId] };
                }
                _g.label = 10;
            case 10:
                if (youtubeData) {
                    console.log("Found release with YouTube content after ".concat(attempts, " attempts: ").concat(fullRelease.title));
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify(__assign(__assign({}, fullRelease), { youtube: youtubeData })),
                        }];
                }
                _g.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                innerError_1 = _g.sent();
                console.warn("Attempt ".concat(attempts, " failed"), innerError_1);
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 3];
            case 14: return [2 /*return*/, {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Could not find a release with YouTube links after several attempts. Try different filters." }),
                }];
            case 15:
                error_1 = _g.sent();
                errorData = (_f = error_1.response) === null || _f === void 0 ? void 0 : _f.data;
                console.error("Discogs API Error:", errorData || error_1.message);
                if ((errorData === null || errorData === void 0 ? void 0 : errorData.message) === "You are making requests too quickly.") {
                    return [2 /*return*/, {
                            statusCode: 429,
                            body: JSON.stringify({ error: "Discogs rate limit exceeded. Please wait a moment." }),
                        }];
                }
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ error: (errorData === null || errorData === void 0 ? void 0 : errorData.message) || "Failed to fetch from Discogs." }),
                    }];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
