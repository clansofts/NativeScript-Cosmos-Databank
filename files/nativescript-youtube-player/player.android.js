"use strict";
var common = require("./player-common");
var FRAGMENT_TAG = "YouTubePlayerFragmentTag";
var YouTubePlayerView = (function (_super) {
    __extends(YouTubePlayerView, _super);
    function YouTubePlayerView() {
        _super.call(this);
        var that = this;
        this._onInitializedListener = new com.google.android.youtube.player.YouTubePlayer.OnInitializedListener({
            onInitializationFailure: function (provider, error) {
                that._player = undefined;
                that._initialized = false;
                console.log("init failure: " + error);
            },
            onInitializationSuccess: function (provider, player, wasRestored) {
                player.setPlayerStateChangeListener(that._onPlayerStateChangeListener);
                player.setPlaybackEventListener(that._onPlaybackEventListener);
                if (!wasRestored) {
                    that._player = player;
                    that._initialized = true;
                    that._play();
                }
            }
        });
        this._onPlaybackEventListener = new com.google.android.youtube.player.YouTubePlayer.PlaybackEventListener({
            onBuffering: function (isBuffering) {
            },
            onPaused: function () {
            },
            onPlaying: function () {
            },
            onSeekTo: function (newPositionMillis) {
            },
            onStopped: function () {
            }
        });
        this._onPlayerStateChangeListener = new com.google.android.youtube.player.YouTubePlayer.PlayerStateChangeListener({
            onAdStarted: function () {
            },
            onError: function (reason) {
            },
            onLoaded: function (videoId) {
            },
            onLoading: function () {
            },
            onVideoEnded: function () {
            },
            onVideoStarted: function () {
            }
        });
    }
    Object.defineProperty(YouTubePlayerView.prototype, "initialized", {
        get: function () {
            return this._initialized;
        },
        enumerable: true,
        configurable: true
    });
    YouTubePlayerView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        var nativeView = this.page.android;
        nativeView.setLayerType(android.view.View.LAYER_TYPE_NONE, null);
    };
    YouTubePlayerView.prototype._createUI = function () {
        _super.prototype._createUI.call(this);
        var nativeLayout = this.android;
        this._layoutId = android.view.View.generateViewId();
        nativeLayout.setId(this._layoutId);
        this._fragment = com.google.android.youtube.player.YouTubePlayerFragment.newInstance();
        var page = this.page;
        var frame = page.frame;
        this._pageFragment = frame.android.fragmentForPage(page);
        var childManager = this._pageFragment.getChildFragmentManager();
        var transaction = childManager.beginTransaction();
        transaction.add(this._layoutId, this._fragment, FRAGMENT_TAG);
        transaction.commit();
        this._initialize();
    };
    YouTubePlayerView.prototype._onDetached = function (force) {
        _super.prototype._onDetached.call(this, force);
        if (!this._fragment) {
            return;
        }
        if (typeof this._player !== "undefined") {
            this._player.release();
            this._player = undefined;
            this._initialized = false;
        }
    };
    YouTubePlayerView.prototype._initialize = function () {
        if (this._initialized) {
            return;
        }
        if (!this._fragment) {
            return;
        }
        var key = this.apiKey;
        if (!key) {
            return;
        }
        this._fragment.initialize(key, this._onInitializedListener);
    };
    YouTubePlayerView.prototype._play = function () {
        if (!this._initialized) {
            return;
        }
        if (!this.videoKey) {
            console.log(this.videoKey);
            return;
        }
        this._player.loadVideo(this.videoKey);
    };
    YouTubePlayerView.prototype._onVideoKeyChanged = function (newValue) {
        _super.prototype._onVideoKeyChanged.call(this, newValue);
        this._play();
    };
    YouTubePlayerView.prototype._onAPIKeyChanged = function (newValue) {
        _super.prototype._onAPIKeyChanged.call(this, newValue);
        this._initialize();
    };
    YouTubePlayerView.prototype.loadPlaylist = function (playlistId) {
        this._player.loadPlaylist(playlistId);
    };
    YouTubePlayerView.prototype.next = function () {
        this._player.next();
    };
    YouTubePlayerView.prototype.previous = function () {
        this._player.previous();
    };
    YouTubePlayerView.prototype.loadVideo = function (videoId, timeMillis) {
        this._player.loadVideo(videoId, timeMillis | 5);
    };
    YouTubePlayerView.prototype.getCurrentTimeMillis = function () {
        return this._player.getCurrentTimeMillis();
    };
    YouTubePlayerView.prototype.play = function () {
        this._player.play();
    };
    YouTubePlayerView.prototype.pause = function () {
        this._player.pause();
    };
    YouTubePlayerView.prototype.setShowFullscreenButton = function (show) {
        this._player.setShowFullscreenButton(show);
    };
    return YouTubePlayerView;
}(common.YouTubePlayerView));
exports.YouTubePlayerView = YouTubePlayerView;
