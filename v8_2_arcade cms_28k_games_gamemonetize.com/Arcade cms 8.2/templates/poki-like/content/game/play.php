<script language="javascript">
    var PageType = "";
    var ids = "";
</script>

<div id="content" class="fn-clear">
    <div class="play-game-list-grid-container">
    <div>{{ADS_SIDEBAR}}</div>
    <div>{{ADS_HEADER}}</div>
    <div>{{ADS_300}}</div>
    <div class="home-search-container">
        <a href="/" class="logo-home hide-text" aria-label="home">
            Home
        </a>
        <div class="home-search">
            <a href="/" class="home-icon">
                <i class="fa fa-home" aria-hidden="true"></i>
            </a>
            <div id="search" class="home-icon">
                <i class="fa fa-search" aria-hidden="true"></i>
            </div>
        </div>
    </div>
    <div id="search-left">
        <div class="search-container">
            <div id="search-left-close">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
            <div class="search-form">
                <form id="search-data-form" onsubmit="return false;">
                    <img src="/templates/poki-like/image/poki-circle-logo.png" class="poki-circle-logo" alt="poki-circle-logo">
                    <div class="divider"></div>
                    <input type="text" class="txt fn-left search-input" id="Search-InArea" name="search_parameter" type="text" placeholder="What are you playing today?">
                    <input type="submit" class="btn" value="" id="search" aria-label="search-button">
                    <div id="clear-search">
                        <i class="fa fa-close" aria-hidden="true"></i>
                    </div>
                </form>
            </div>
            <div id="search-results" class="search-results games-list">
                <!-- Hasil pencarian akan muncul di sini -->
            </div>
            <div id="tag-and-games-contaner">
                <div class="tag-container">
                    <div class="tag-list">
                        {{TAGS_LIST_HOME}}
                    </div>
                </div>
                <p class="title">Popular Games</p>
                <div class="games-list">
                    {{POPULAR_GAME_LIST}}
                </div>
                <p class="title">Last Played</p>
                <div class="games-list played-games">
                    {{GAMES_PLAYED_LEFT}}
                </div>
            </div>
        </div>
    </div>
    <div></div>
    <div class="game-container game-col">
        <div class="game-info">
        <div id="loader_container">
            <div id="preloader_box"></div>
        </div>
        <div id="gameDiv">
            <div id="ava-game_container" class="game-box" data-norate="1">

                <div id="gamePlay-content" oncontextmenu="return false" style="position: relative;">
                    <img class="gamePlay-bg" src="{{PLAY_GAME_IMAGE}}" alt="image {{PLAY_GAME_NAME}}">
                    <div class="gamePlay-icon-btn">
                        <div class="gamePlay-icon" style="background-image: url({{PLAY_GAME_IMAGE}});background-size: 160px;background-position-x: 50%;background-position-y: 50%;"></div>
                        <div class="gamePlay-title">{{PLAY_GAME_NAME}}</div>
                        <div class="gamePlay-button">Play Now!</div>
                        <div class="gamePlay-button gamePlay-button-mobile">
                            <div class="play-icon">
                                <i class="fa fa-play" aria-hidden="true"></i>
                            </div>
                            <div class="play-text">Play Now!</div>
                        </div>
                    </div>
                </div>
                <div id="pre-count">
                    <font lib="game-loading">Game loading..</font>
                    <div id="pre-count-num">25</div>
                </div>
                <div id="game-preloading"></div>
                <div id="game-preloader"></div>
                <div id="game-box">
                </div>

                <div id="adsContainer">
                    <div id="adContainer"></div>
                    <video id="videoElement"></video>
                </div>

                <div class="close-fullscreen" onclick="location.reload();return false;">
                    <i class="fa-solid fa-chevron-left"></i>
                    <img src="/templates/poki-like/image/poki-circle-logo.png" class="poki-circle-logo" alt="poki-circle-logo">
                </div>
            </div>
        </div>
    </div>
    <div class="game-zoom">
        <!-- <a href="/" class="game-zoom-logo hide-text">Play Best Online Games</a> -->
        <div class="game-zoom-info">
            <div class="game-image" style="background-image: url({{PLAY_GAME_IMAGE}});"></div>
            <p>{{PLAY_GAME_NAME}}</p>
        </div>
        <div>
            <div class="game-zoom-btn">
                <a href="#" id="gameFull" title="Play game fullscreen" onclick="GameFullscreen();return false;"></a>
            </div>
        </div>
        <!-- <div>
            <a href="#" id="gameReplay" title="Replay this game" onclick="ReplayGame();return false;"></a>
        </div> -->
    </div>
</div>
{{PLAY_SIDEBAR_WIDGETS}}

<div class="game-name-mobile">
    {{PLAY_GAME_NAME}}
</div>
{{TAGS_LIST_GRID}}
<div id="game-bottom" class="bgs">
        <h1 class="pl game-title" style="font-size: 25px !important;">{{PLAY_GAME_NAME}}</h1>
        <div id="play-game-desc" class="d-text" style="margin-top:15px;font-size:14px;position:relative;">
            {{PLAY_GAME_DESC}}
        </div>
        <div class="game-tags">
            {{PLAY_GAME_TAGS}}
        </div>
    </div>
    

<div class="tags-walkthrough-container">
    <div class="game-walkthrough bgs fn-clear">
        <p>Play {{PLAY_GAME_NAME}} {{PLAY_GAME_WALKTHROUGH}}</p>
        <div class="description" id="gamemonetize-video">
        </div>
        <script type="text/javascript">
            window.VIDEO_OPTIONS = {
                gameid : "{{GAME_UNIQUE_ID}}",
                width  : "100%",
                height : "480px",
                color  : "#3f007e"
            };
            (function (a, b, c) {
                var d = a.getElementsByTagName(b)[0];
                a.getElementById(c) || (a = a.createElement(b), a.id = c, a.src = "https://api.gamemonetize.com/video.js?v=" + Date.now(), d.parentNode.insertBefore(a, d))
            })(document, "script", "gamemonetize-video-api"); 
        </script>  
    </div>
</div>
</div>

</div>
</div>

<script type="text/javascript">
    var objGameFlash = null;
    var percentage = 0;
    t1 = setInterval("getPercentage()", 200);

    function getPercentage() {
        if (objGameFlash == null) objGameFlash = getGameFlashObj();
        if (objGameFlash) {
            try {
                percentage = objGameFlash.PercentLoaded();
                if (percentage < 0 || typeof(percentage) == 'undefined') percentage = 100;
            } catch (e) {
                percentage = 100;
            }
        } else {
            percentage = 100;
        }
        if (percentage == 100) {
            clearInterval(t1);
        }
        return percentage;
    }

    function getGameFlashObj() {
        if (window.document.GameEmbedSWF) return window.document.GameEmbedSWF;
    }

    function showGame() {
        $("#loader_container").css({
            visibility: "hidden",
            display: "none"

        });
        $("#gameDiv").css({
            visibility: "visible",
            display: "block",
            height: "100%"
        });
        showGameBox();
        u3dplay();
    }
</script>

{{FOOTER_CONTENT}}

<script type="text/javascript">
    var PreGameAdURL = "{{ADS_VIDEO}}";

    function getcookie(name) {
        var cookie_start = document.cookie.indexOf(name);
        var cookie_end = document.cookie.indexOf(";", cookie_start);
        return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
    }

    function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
        var expires = new Date();
        expires.setTime(expires.getTime() + seconds);
        document.cookie = escape(cookieName) + '=' + escape(cookieValue) +
            (expires ? '; expires=' + expires.toGMTString() : '') +
            (path ? '; path=' + path : '/') +
            (domain ? '; domain=' + domain : '') +
            (secure ? '; secure' : '');
    }

    function ClearPlayedGames() {
        setcookie("lastplayedgames", "", -360000, "/");
        return false;
    }

    function PlayedGames(game_id) {
        var playedgames = getcookie("playedgames");
        if (playedgames.indexOf("," + game_id + ",") > -1) {
            playedgames = playedgames.replace("," + game_id + ",", '');
        } else {
            if (playedgames == "" || playedgames == ",") {
                playedgames = "," + game_id + ",";
            } else {
                playedgames = "," + game_id + "," + playedgames;
            }
        }
        setcookie("playedgames", playedgames, 25920000000, "/");
    }
    $(document).ready(function() {
        PlayedGames({{PLAY_GAME_ID}});
    });

    window.setTimeout(function() {
        __upGame_rx8({{PLAY_GAME_ID}})
    }, 2000);
    var descriptionURL = "{{DESCRIPTION_URL}}";
    var iframe = '{{PLAY_GAME_EMBED}}';
    $(document).ready(function() {
        $('.gamePlay-button').click(function(e) {  
            SkipAdAndShowGame();
            $("#game-box").html(iframe);
            $("#gamePlay-content").hide();
            // $('#adsContainer').show();
            
            if ($( document ).width() < 600) {
                $("#header").hide();
                $("#topad").hide();
                $("#game-bottom").hide();
                $(".play-game-bottom").hide();
                $(".tags-walkthrough-container").hide();
                $(".h-head").hide();
                $(".game-zoom").hide();
                // $("#adsContainer").hide();
                $("#game-col").css("margin", "0px");
                $("#game-col").css("height", "100svh");
                $("#gameDiv").css("height", "100svh");
                $("#gameDiv").css("width", "100vw");
                $("#gameDiv").css("position", "fixed");
                $("#gameDiv").css("top", "0");
                $("#gameDiv").css("left", "0");
                $("#gameDiv").css("z-index", "9999");
                $("#ava-game_container").css("height", "100svh");
                $('body').css('overflow', 'hidden');
                $('.close-fullscreen').css('display', 'flex');
                // GameFullscreen()
                // $("#game-preloading").show();
                // setTimeout(
                // function() 
                // {
                //     $("#game-preloading").hide();
                //     PreRollAd.start();
                // }, 550);
                // Tambahkan fungsi fullscreen
                function ReqGameFullscreen() {
                    let gameElement = document.getElementById('gameDiv');
                    if (gameElement.requestFullscreen) {
                        gameElement.requestFullscreen();
                    } else if (gameElement.mozRequestFullScreen) { // Mozilla
                        gameElement.mozRequestFullScreen();
                    } else if (gameElement.webkitRequestFullscreen) { // Webkit
                        gameElement.webkitRequestFullscreen();
                    } else if (gameElement.msRequestFullscreen) { // IE/Edge
                        gameElement.msRequestFullscreen();
                    }
                }

                // Panggil fungsi fullscreen
                ReqGameFullscreen();
                }
        });
    });

    function SkipAdAndShowGame() {
        $("#adsContainer").hide();
        $("#game-box").html(iframe);
    }

    $(function() {
        $('.ad300').eq(0).show();
        if ($('.ad300').size() > 1) {
            setInterval(function() {
                var first = $('.ad300').eq(0);
                first.hide();
                $('.ad300').last().after(first);
                $('.ad300').eq(0).fadeIn();
            }, 3000);
        }
        $('.adsmall').eq(0).show();
        if ($('.adsmall').size() > 1) {
            setInterval(function() {
                var first = $('.adsmall').eq(0);
                first.hide();
                $('.adsmall').last().after(first);
                $('.adsmall').eq(0).fadeIn();
            }, 3000);
        }
    })
</script>

{{IMA_SDK}}

<script>
    $(document).ready(function() {
        $("#adsContainer").hide();
        $("#game-box").html(iframe);
    });
</script>

<!-- <div id="BackTop"></div> -->
</div>

<script src="{{CONFIG_THEME_PATH}}/js/libs/jquery.show-more.js"></script>
<script>
	if (window.innerWidth <= 768) {
		$('#play-game-desc').showMore({
			minheight: 145,
			maxWidth: "100%",
		});
	}
var cat = "{{CATEGORYID}}";
</script>