(function () {
  window.playerInitArray = [], setInterval(function () {
    playerInitArray.splice(0x0, 0x1), playerInitArray[0x0] != null && _0x3673fe.createPlayer($('#' + playerInitArray[0x0].id), playerInitArray[0x0].options, playerInitArray[0x0].callback);
  }, 0x3e8);
  function _0x157637(_0x4c591f) {
    for (var _0x230e6f = 0x0; 0x0 < window.playerInitArray.length; _0x230e6f++) {
      window.playerInitArray[_0x230e6f].id == _0x4c591f.id && (playerInitArray.splice(_0x230e6f, 0x1), _0x230e6f--);
    }
    playerInitArray.push(_0x4c591f);
  }
  window.setSubtitleStyleAfterResize = function (_0x3407e5) {
    setTimeout(() => {
      var _0x54234c = $("#vjs_" + _0x3407e5.id).height(),
        _0xc7eab5 = document.querySelector(":root"),
        _0x546a44 = _0x3407e5.options.subtitleStyle;
      _0x546a44 ? (_0x546a44.color && _0xc7eab5.style.setProperty('--subtitleColor', _0x546a44.color), _0x546a44.fontSize ? _0xc7eab5.style.setProperty("--fontSize", (_0x54234c / 0x438 * _0x546a44.fontSize).toFixed(0x2) + 'px') : _0xc7eab5.style.setProperty("--fontSize", (_0x54234c / 0x438 * 0x28).toFixed(0x2) + 'px'), _0x546a44.bottomHeight ? _0xc7eab5.style.setProperty("--bottom", _0x546a44.bottomHeight + 'px') : _0xc7eab5.style.setProperty('--bottom', '20px')) : (_0xc7eab5.style.setProperty("--fontSize", (_0x54234c / 0x438 * 0x28).toFixed(0x2) + 'px'), _0xc7eab5.style.setProperty("--bottom", "20px"));
    });
  }, $.fn.Ableplayer = function (_0x368a76, _0x4bf276) {
    var _0x5d3e0d = {
      'id': $(this).attr('id'),
      'options': _0x368a76,
      'callback': _0x4bf276
    };
    _0x157637(_0x5d3e0d);
  };
  var _0x3673fe = {
    'globalOptions': {
      'image': '',
      'schoolIp': ![],
      'defaltplayertype': 0x1,
      'debugMode': ![],
      'autostart': !![],
      'control': {
        'controlBar': 0x1,
        'rateBtn': !![],
        'trackBtn': !![],
        'definiBtn': !![],
        'volumeBtn': !![],
        'fullBtn': !![],
        'bigPlayerBtn': !![],
        'playTime': !![],
        'errorBar': !![],
        'danmuBtn': ![],
        'nextBtn': ![],
        'customFullScreen': ![]
      },
      'isCustomFullScreen': 0x0
    },
    'playerTypes': {
      'vjs': 0x3,
      'letv': 0x2,
      'auto': 0x1
    },
    'defaultPlayerType': '1',
    'currentPlayerType': '-1',
    'currentFullPlayer': '',
    'playerArray': [],
    'createPlayer': function (_0x27717f, _0x3c89aa, _0xab3067) {
      _0x27717f.addClass('able-player-container'), _0x27717f.css("background-color", '#000');
      try {
        ablePlayerX(_0x27717f.attr('id')).dispose();
      } catch (_0x3b37ef) {}
      _0x3c89aa = $.extend({}, this.globalOptions, _0x3c89aa);
      (_0x3c89aa.image == null || _0x3c89aa.image == '') && (_0x3c89aa.image = 'about:blank');
      PlayerUtil.debugMode = _0x3c89aa.debugMode, PlayerUtil.log("视频ID:" + _0x3c89aa.id), PlayerUtil.log("视频SRC:" + _0x3c89aa.src);
      var _0x4f0d37 = {
        'id': _0x27717f.attr('id'),
        'uuid': uuid.v4(),
        'options': PlayerUtil.clone(_0x3c89aa),
        'defOptions': PlayerUtil.clone(_0x3c89aa),
        'callback': _0xab3067,
        'times': {
          'firstLoadTime': 0x0,
          'initEndTime': 0x0,
          'creatTime': 0x0,
          'waitingTime': 0x0
        },
        'courseInfo': {
          'schoolId': '',
          'schoolName': '',
          'classId': '',
          'className': '',
          'courseId': '',
          'courseName': '',
          'LiveCourseId': ''
        }
      };
      this.playerArray.push(_0x4f0d37), _0x4f0d37.options = this.initControls(_0x27717f, _0x4f0d37.options);
      if (!PlayerUtil.supportVideo()) {
        if (!PlayerUtil.hasFlash()) {
          _0x3673fe.showError(_0x4f0d37, '04', '无法播放,请安装flash插件!');
          return;
        }
      }
      PlayerUtil.log("加载videoJS播放器"), _0x27717f.videojsPlayer(_0x4f0d37), this.listener(_0x4f0d37);
    },
    'showError': function (_0xf3c0ca, _0xd6302f, _0x5c6b68) {
      var _0x4f12b1 = '';
      _0xf3c0ca.options.control.errorBar ? (_0x4f12b1 += "<div class=\"ablePlayerError\">", _0x4f12b1 += "<div class=\"ablePlayerErrorCode\">代码:" + _0xd6302f + "</div>", _0x4f12b1 += "<div class=\"ablePlayerErrorText\">" + _0x5c6b68 + '</div>', _0x4f12b1 += "</div>") : _0x4f12b1 += "<div class=\"ablePlayerErrorText2\">" + _0x5c6b68 + '(代码:' + _0xd6302f + ')</div>';
      (_0xd6302f == '04' || _0xd6302f == '03') && MonitorUtil.errorLog(_0xf3c0ca);
      if (typeof _0xf3c0ca.$videoArea == 'undefined') {
        var _0x4118a4 = $('#' + _0xf3c0ca.id);
        _0x4118a4.html(''), _0x4118a4.css("position", "relative"), _0x4118a4.append(_0x4f12b1);
      } else _0xf3c0ca.$videoArea.append(_0x4f12b1);
    },
    'lisFull_progressBar': function (_0x1c58e8) {
      setTimeout(function () {
        if (_0x1c58e8.currentPlayerType == 0x2) {
          var _0x496de8 = parseInt(_0x1c58e8.player.sdk.getVideoSetting().duration),
            _0x1f26cc = parseInt(_0x1c58e8.player.sdk.getVideoTime()),
            _0x107115 = $('#' + _0x1c58e8.id).width(),
            _0x4f18c2 = _0x1f26cc / _0x496de8 * (_0x107115 - $('#' + _0x1c58e8.id + " .progressBall").width());
          $('#' + _0x1c58e8.id + " .progressBall").css("left", _0x4f18c2 + 'px'), $('#' + _0x1c58e8.id + " .progressBall").css("margin-left", '0px');
        } else {
          var _0x496de8 = parseInt(_0x1c58e8.player.duration()),
            _0x1f26cc = parseInt(_0x1c58e8.player.currentTime()),
            _0x107115 = $('#' + _0x1c58e8.id).width(),
            _0x4f18c2 = _0x1f26cc / _0x496de8 * (_0x107115 - $('#' + _0x1c58e8.id + " .progressBall").width());
          $('#' + _0x1c58e8.id + " .progressBall").css("left", _0x4f18c2 + 'px');
        }
      }, 0xc8);
    },
    'listener': function (_0x454596) {
      this.listenerFullscreenchange(_0x454596), this.listenerEsc();
    },
    'listenerEsc': function () {
      (window.isIE8 || window.isIE9 || window.isIE10) && $(document).keyup(function (_0x48d56f) {
        _0x48d56f.keyCode == 0x1b && this.exitFullPlay();
      });
    },
    'listenerFullscreenchange': function (_0x58bafb) {
      screenfull.enabled && $(document).on(screenfull.raw.fullscreenchange, function () {
        if (!screenfull.isFullscreen) this.exitFullPlay();else {}
        setSubtitleStyleAfterResize(_0x58bafb);
      });
    },
    'get': function (_0x13e741) {
      for (var _0x75124a = 0x0; 0x0 < this.playerArray.length; _0x75124a++) {
        var _0xaaa220 = this.playerArray[_0x75124a];
        if (_0xaaa220.id == _0x13e741) return _0xaaa220;
      }
      return null;
    },
    'del': function (_0x241035) {
      for (var _0x9c7a8c = 0x0; 0x0 < this.playerArray.length; _0x9c7a8c++) {
        var _0x21a5fd = this.playerArray[_0x9c7a8c];
        _0x21a5fd.id == _0x241035 && this.playerArray.splice(_0x9c7a8c, 0x1);
      }
    },
    'initOptions': function (_0x28417c, _0x1211b6) {},
    'initControls': function (_0x18767a, _0x1ed783) {
      var _0x4be8a5 = _0x3673fe.get(_0x18767a.attr('id')).defOptions;
      _0x18767a.width() < 0x23f ? (_0x1ed783.control.rateBtn = ![], _0x1ed783.control.trackBtn = ![], _0x1ed783.control.definiBtn = ![], _0x1ed783.control.danmuBtn = ![]) : (_0x1ed783.control.rateBtn = !![], _0x1ed783.control.trackBtn = !![], _0x1ed783.control.definiBtn = !![], _0x4be8a5.control.danmuBtn && (_0x1ed783.control.danmuBtn = !![]));
      var _0x3d283a = _0x1ed783.control.volumeBtn;
      _0x18767a.width() < 0x14f ? _0x1ed783.control.volumeBtn = ![] : _0x1ed783.control.volumeBtn = !![];
      _0x3d283a == ![] && (_0x1ed783.control.volumeBtn = ![]);
      !_0x1ed783.control.customFullScreen && (_0x18767a.width() < 0xc8 ? (_0x1ed783.control.fullBtn = ![], _0x1ed783.control.playTime = ![]) : (_0x1ed783.control.fullBtn = !![], _0x1ed783.control.playTime = !![]));
      _0x18767a.height() < 0xc8 ? _0x1ed783.control.bigPlayerBtn = ![] : _0x1ed783.control.bigPlayerBtn = !![];
      _0x1ed783.mp3Mode && (_0x18767a.height(0x28), _0x1ed783.control.rateBtn = ![], _0x1ed783.control.trackBtn = ![], _0x1ed783.control.definiBtn = ![], _0x1ed783.control.bigPlayerBtn = ![], _0x1ed783.control.fullBtn = ![], _0x1ed783.control.danmuBtn = ![], _0x1ed783.control.controlBar = 0x0);
      _0x18767a.height() < 0x8c || _0x18767a.width() < 0xc8 ? _0x1ed783.control.errorBar = ![] : _0x1ed783.control.errorBar = !![];
      var _0x4394de = _0x1ed783.id;
      return (!_0x4394de || typeof _0x4394de == "undefined") && (_0x1ed783.defaltplayertype = _0x3673fe.playerTypes.vjs, _0x1ed783.control.trackBtn = ![], _0x1ed783.control.definiBtn = ![]), _0x1ed783;
    },
    'resetControls': function (_0x105de6) {
      var _0x55c78b = _0x105de6.id,
        _0x4daeeb = $('#' + _0x55c78b),
        _0x11b557 = _0x105de6.options;
      _0x11b557 = this.initControls(_0x4daeeb, _0x105de6.options);
      var _0x930847 = $('#' + _0x55c78b + " .speedBox");
      _0x11b557.control.rateBtn ? _0x930847.show() : _0x930847.hide();
      var _0x437d20 = $('#' + _0x55c78b + '\x20.fullScreen');
      _0x11b557.control.fullBtn ? _0x437d20.show() : _0x437d20.hide();
      var _0x92d5b1 = $('#' + _0x55c78b + '\x20.notFullScreen');
      _0x11b557.control.fullBtn ? _0x92d5b1.show() : _0x92d5b1.hide();
      var _0x470c08 = $('#' + _0x55c78b + " .volumeBox");
      _0x11b557.control.volumeBtn ? _0x470c08.show() : _0x470c08.hide();
      var _0x1c8523 = $('#' + _0x55c78b + '\x20.definiBox');
      _0x105de6.options.control.definiBtn ? _0x1c8523.show() : _0x1c8523.hide();
      var _0x11d039 = $('#' + _0x55c78b + " .commonBoxDef"),
        _0x4d938a = $('#' + _0x55c78b + '\x20.commonBox');
      !_0x105de6.options.control.trackBtn || _0x105de6.options.track == null || _0x105de6.options.track.length == 0x1 ? (_0x11d039.hide(), _0x4d938a.hide()) : ($.trim(_0x4d938a.find(".trackList").html()) != '' && _0x4d938a.show(), $.trim(_0x11d039.children().html()) != '' && _0x11d039.show());
      var _0x16819e = $('#' + _0x55c78b + " #danmu");
      _0x11b557.control.danmuBtn ? _0x16819e.show() : _0x16819e.hide();
      var _0x249b69 = $('#' + _0x55c78b + '\x20.nPlayTime');
      _0x11b557.control.playTime ? _0x249b69.show() : _0x249b69.hide();
    },
    'autoLoad': function (_0x14423c) {
      $.ajax({
        'url': "http://file.livecourse.com/ipserver/serverVideos.json",
        'dataType': "jsonp",
        'jsonp': 'callback',
        'jsonpCallback': "videos",
        'async': ![],
        'success': function (_0x35da49) {
          this.checkIp(_0x14423c, _0x35da49);
        },
        'error': function () {
          this.autoLoad(_0x14423c), PlayerUtil.log("加载校内IP列表失败");
        }
      });
    },
    'checkIp': function (_0x5f5015, _0x40526b) {
      var _0x172ac4 = $('#' + _0x5f5015.id);
      $.ajax({
        'url': '//newbase.zhihuishu.com/video/getClientIp?jsonpCallBack=?',
        'dataType': "jsonp",
        'jsonp': "jsonp",
        'async': !![],
        'cache': ![],
        'success': function (_0x2d590b) {
          _0x5f5015.options.schoolIp = !![], PlayerUtil.log('校内IP加载vjs播放器'), _0x172ac4.videojsPlayer(_0x5f5015);
        }
      });
    },
    'checkIsInSchoolIps': function (_0xaeec93, _0x37620d) {
      var _0x600dc9 = ![];
      return _0x37620d != '' && $.each(_0x37620d, function (_0x39a29c, _0x50eb4e) {
        var _0x438022 = _0x50eb4e.schoolIps;
        if (!/^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/.test(_0xaeec93)) return ![];
        var _0x5e62ce = _0x438022.indexOf('-'),
          _0x37c855 = _0x2102bd(_0x438022.substring(0x0, _0x5e62ce).split('.')),
          _0x24b822 = _0x2102bd(_0x438022.substring(_0x5e62ce + 0x1).split('.')),
          _0x964cac = _0x2102bd(_0xaeec93.split('.'));
        function _0x2102bd(_0x46c188) {
          for (var _0x119e93 = 0x0; 0x0 < _0x46c188.length; _0x119e93++) {
            _0x46c188[_0x119e93] = parseInt(_0x46c188[_0x119e93]);
          }
          return _0x46c188;
        }
        for (var _0x39a29c = 0x0; 0x0 < 0x3; _0x39a29c++) {
          var _0x486929 = _0x964cac[_0x39a29c] >= _0x37c855[_0x39a29c] && _0x964cac[_0x39a29c] <= _0x24b822[_0x39a29c];
          if (!_0x486929) return !![];
        }
        if (_0x37c855[0x2] == _0x24b822[0x2]) {
          if (_0x964cac[0x3] >= _0x37c855[0x3] && _0x964cac[0x3] <= _0x24b822[0x3]) return _0x600dc9 = !![], ![];
        } else {
          if (_0x964cac[0x2] == _0x37c855[0x2]) {
            if (_0x964cac[0x3] >= _0x37c855[0x3]) return _0x600dc9 = !![], ![];
          } else {
            if (_0x964cac[0x2] == _0x24b822[0x2]) {
              if (_0x964cac[0x3] <= _0x24b822[0x3]) return _0x600dc9 = !![], ![];
            } else return _0x600dc9 = !![], ![];
          }
        }
      }), _0x600dc9 && PlayerUtil.log('检测到校内IP'), _0x600dc9;
    },
    'requestFullPlay': function (_0x1defa3) {
      var _0x3c897a = _0x1defa3.callback,
        _0x1d23d7 = _0x1defa3.id,
        _0x1b0a6e = $('#' + _0x1d23d7),
        _0x165c99 = _0x1defa3.options,
        _0x495c0d = _0x165c99.screenElemId ? $('#' + _0x165c99.screenElemId) : '';
      _0x165c99.isFullscreen = 0x1, this.currentFullPlayer = _0x1defa3, _0x1defa3.defaultHeight = _0x1b0a6e.height(), _0x1defa3.defaultWidth = _0x1b0a6e.width();
      if (screenfull.enabled) {
        var _0x26e0a0 = _0x495c0d ? _0x495c0d[0x0] : _0x1b0a6e[0x0];
        screenfull.request(_0x26e0a0);
      }
      window.docOrigOverflow = document.documentElement.style.overflow, document.documentElement.style.overflow = "hidden", _0x1b0a6e.addClass('ableVideoPlayer-full'), _0x1b0a6e.css("z-index", "9999"), _0x1b0a6e.children('div\x20:eq(0)').css('z-index', "9999"), $('#' + _0x1d23d7 + " .fullScreen").attr("class", "notFullScreen");
      if (!window.isIE8) {}
      var _0x5c2cba = $('#' + _0x1d23d7 + '\x20.commonBoxDef'),
        _0x3214e8 = $('#' + _0x1d23d7 + " .commonBox");
      try {
        $.trim(_0x3214e8.children().html()) != '' && _0x3214e8.show(), $.trim(_0x5c2cba.children().html()) != '' && _0x5c2cba.show();
      } catch (_0x2cadf7) {
        PlayerUtil.log("进入全屏调整字幕按钮失败.");
      }
      typeof _0x3c897a != "undefined" && PlayerUtil.isExitsFunction(_0x3c897a.onEnterFullScreen) && _0x3c897a.onEnterFullScreen(), this.lisFull_progressBar(_0x1defa3), this.ieFullPlayer(_0x1defa3), _0x3673fe.resetControls(_0x1defa3);
    },
    'exitFullPlay': function () {
      if (this.currentFullPlayer == null || this.currentFullPlayer == '') return;
      var _0x10c3d3 = $('#' + this.currentFullPlayer.id);
      this.currentFullPlayer.options.isFullscreen != 0x0 && !screenfull.isFullscreen && MonitorUtil.saveAction(this.currentFullPlayer, "exitFull");
      this.currentFullPlayer.options.isFullscreen = 0x0;
      screenfull.enabled && screenfull.isFullscreen && (MonitorUtil.saveAction(this.currentFullPlayer, "exitFull"), screenfull.exit());
      _0x10c3d3.removeClass("ableVideoPlayer-full"), _0x10c3d3.css("z-index", ''), _0x10c3d3.children("div :eq(0)").css('z-index', ''), document.documentElement.style.overflow = window.docOrigOverflow, $('#' + this.currentFullPlayer.id + " .notFullScreen").attr("class", 'fullScreen'), _0x10c3d3.height(this.currentFullPlayer.defaultHeight), _0x10c3d3.width(this.currentFullPlayer.defaultWidth);
      if (!window.isIE8) {}
      this.lisFull_progressBar(this.currentFullPlayer);
      typeof this.currentFullPlayer.callback != "undefined" && PlayerUtil.isExitsFunction(this.currentFullPlayer.callback.onExitFullScreen) && this.currentFullPlayer.callback.onExitFullScreen(), this.ieExitPlayer(this.currentFullPlayer), _0x3673fe.resetControls(this.currentFullPlayer);
    },
    'requestCustomFullPlay': function (_0x20df74) {
      var _0x368bc5 = _0x20df74.callback,
        _0x287f75 = _0x20df74.id,
        _0xd561cd = $('#' + _0x287f75),
        _0x592ff5 = _0x20df74.options.screenElemId ? $('#' + _0x20df74.options.screenElemId) : '',
        _0x547bfd = _0x20df74.options;
      _0x547bfd.isFullscreen = 0x1, this.currentFullPlayer = _0x20df74, _0x20df74.defaultHeight = _0xd561cd.height(), _0x20df74.defaultWidth = _0xd561cd.width();
      if (screenfull.enabled) {
        console.log("screenfull", screenfull);
        var _0x3a8b91 = _0x592ff5 ? _0x592ff5[0x0] : _0xd561cd[0x0];
        screenfull.request(_0x3a8b91);
      }
      window.docOrigOverflow = document.documentElement.style.overflow, document.documentElement.style.overflow = "hidden", _0xd561cd.addClass('ableVideoPlayer-full'), _0xd561cd.css('z-index', '9999'), _0xd561cd.children("div :eq(0)").css('z-index', "9999"), $('#' + _0x287f75 + '\x20.customFullScreen').attr("class", "notCustomFullScreen");
      if (!window.isIE8) {}
      var _0x202c7f = $('#' + _0x287f75 + " .commonBoxDef"),
        _0x3f1436 = $('#' + _0x287f75 + " .commonBox");
      try {
        $.trim(_0x3f1436.children().html()) != '' && _0x3f1436.show(), $.trim(_0x202c7f.children().html()) != '' && _0x202c7f.show();
      } catch (_0x591f2c) {
        PlayerUtil.log("进入全屏调整字幕按钮失败.");
      }
      typeof _0x368bc5 != 'undefined' && PlayerUtil.isExitsFunction(_0x368bc5.onEnterCustomFullScreen) && _0x368bc5.onEnterCustomFullScreen(), this.lisFull_progressBar(_0x20df74), this.ieFullPlayer(_0x20df74), _0x3673fe.resetControls(_0x20df74);
    },
    'exitCustomFullPlay': function () {
      alert(0xc);
      if (this.currentFullPlayer == null || this.currentFullPlayer == '') return;
      var _0x540d38 = $('#' + this.currentFullPlayer.id);
      this.currentFullPlayer.options.isFullscreen != 0x0 && !screenfull.isFullscreen && MonitorUtil.saveAction(this.currentFullPlayer, "exitFull");
      this.currentFullPlayer.options.isFullscreen = 0x0;
      screenfull.enabled && screenfull.isFullscreen && (MonitorUtil.saveAction(this.currentFullPlayer, "exitFull"), screenfull.exit());
      _0x540d38.removeClass("ableVideoPlayer-full"), _0x540d38.css("z-index", ''), _0x540d38.children("div :eq(0)").css("z-index", ''), document.documentElement.style.overflow = window.docOrigOverflow, $('#' + this.currentFullPlayer.id + " .notCustomFullScreen").attr('class', "customFullScreen"), _0x540d38.height(this.currentFullPlayer.defaultHeight), _0x540d38.width(this.currentFullPlayer.defaultWidth);
      if (!window.isIE8) {}
      this.lisFull_progressBar(this.currentFullPlayer);
      typeof this.currentFullPlayer.callback != "undefined" && PlayerUtil.isExitsFunction(this.currentFullPlayer.callback.onExitCustomFullScreen) && this.currentFullPlayer.callback.onExitCustomFullScreen(), this.ieExitPlayer(this.currentFullPlayer), _0x3673fe.resetControls(this.currentFullPlayer);
    },
    'ieFullPlayer': function (_0x26cdc7) {
      if (window.isIE8 || window.isIE9 || window.isIE10) {
        var _0x4a2c19 = _0x26cdc7.id,
          _0x46b5f5 = $('#' + _0x4a2c19);
        $("body").css("visibility", "hidden"), _0x46b5f5.css("visibility", "visible");
      }
    },
    'ieExitPlayer': function (_0x251e54) {
      (window.isIE8 || window.isIE9 || window.isIE10) && $("body").css("visibility", 'visible');
    }
  };
  window.PlayerStarter = _0x3673fe;
})(), function () {
  var _0x1b0c41 = function (_0x470385) {
    try {
      var _0x3bd924 = PlayerStarter.get(_0x470385);
      return new vjsAPI(_0x3bd924);
    } catch (_0x7d230c) {
      return PlayerUtil.log('ablePlayerX\x20获取播放器API对象失败,获取空API对象,containerId:' + _0x470385), new _0x42cc5b(_0x470385);
    }
  };
  function _0x42cc5b(_0x5dd213) {
    this.id = _0x5dd213;
  }
  _0x42cc5b.prototype = {
    'seek': function (_0x416f3d) {},
    'setFullscreen': function (_0x5787a2) {},
    'play': function () {},
    'pause': function () {},
    'getDuration': function () {},
    'getPosition': function () {},
    'addCourseInfo': function () {},
    'dispose': function () {},
    'getFullStatus': function () {},
    'exitFullPlay': function () {},
    'resize': function (_0x1c5449, _0x75293a) {
      try {
        var _0x2dc44f = $('#' + this.id);
        _0x2dc44f.width(_0x1c5449), _0x2dc44f.height(_0x75293a);
      } catch (_0x1e54b5) {
        PlayerUtil.log("errorAPI改变播放器大小失败!");
      }
    },
    'insertPopup': function (_0x58ce4c) {},
    'removePopup': function () {},
    'sendDanmu': function () {}
  }, window.ablePlayerX = _0x1b0c41;
}(), function () {
  var _0x2ea06a = '',
    _0x3f42ec = '';
  try {
    _0x2ea06a = jQuery.parseJSON($.cookie("CASLOGC")), _0x2ea06a.username != undefined && _0x2ea06a.userId != undefined && _0x2ea06a.realName != undefined && (_0x3f42ec = _0x2ea06a.userId, _0x2e0457 = _0x2ea06a.username, _0x27249d = _0x2ea06a.realName);
  } catch (_0x5c787e) {}
  _0x3d5f8f();
  var _0x2ed9af = {
    'init': function (_0x5ecbf0) {
      try {} catch (_0x4df2ed) {}
    },
    'videoLogBase': function (_0x367c31) {
      setTimeout(function () {
        try {
          _0x447435(_0x367c31);
        } catch (_0x5f1b65) {
          PlayerUtil.log('日志添加失败');
        }
      }, 0x3e8);
    },
    'saveAction': function (_0x4680f3, _0x664772, _0x457de1, _0x507f78) {
      try {
        _0xad64ae(_0x4680f3, _0x664772, _0x457de1, _0x507f78);
      } catch (_0xa6c7a1) {
        PlayerUtil.log("日志添加失败", _0xa6c7a1);
      }
    },
    'errorLog': function (_0x36de79) {
      try {
        _0x421842(_0x36de79);
      } catch (_0x2123e3) {}
    }
  };
  window.MonitorUtil = _0x2ed9af;
  var _0x447435 = function (_0x30c6bd) {
      _0x3d5f8f();
      var _0x3bee03 = '';
      _0x3bee03 += '[' + _0x30c6bd.options.id + ',' + new Date().getTime();
      _0x2ea06a.userId != null && _0x2ea06a.userId != "undefined" ? _0x3bee03 += ',' + _0x2ea06a.userId : _0x3bee03 += ',';
      _0x30c6bd.courseInfo.courseId != null || _0x30c6bd.courseInfo.courseId != "undefined" ? _0x3bee03 += ',' + _0x30c6bd.courseInfo.courseId : _0x3bee03 += ',';
      _0x3bee03 += ',', _0x3bee03 += ',', _0x3bee03 += ",PC,,,,,", _0x3bee03 += ',' + '', _0x3bee03 += ",,,";
      for (var _0x3b9d90 = 0x0; 0x0 < _0x30c6bd.options.sourceSrc.lines.length; _0x3b9d90++) {
        _0x30c6bd.options.sourceSrc.lines[_0x3b9d90].lineDefault && (_0x3bee03 += ',' + _0x30c6bd.options.sourceSrc.lines[_0x3b9d90].lineID);
      }
      var _0x3edc71 = 0x0;
      _0x30c6bd.times.initEndTime > 0x0 && (_0x3edc71 = _0x30c6bd.times.initEndTime - _0x30c6bd.times.creatTime);
      _0x3bee03 += ',' + _0x3edc71;
      var _0x2a11b9 = 0x0;
      _0x30c6bd.times.firstLoadTime > 0x0 && (_0x2a11b9 = _0x30c6bd.times.firstLoadTime - _0x30c6bd.times.creatTime), _0x3bee03 += ',' + _0x2a11b9, _0x3bee03 += ',' + '' + ',' + '' + ',' + '', _0x3bee03 += ',' + _0x30c6bd.uuid + ']', PlayerUtil.log(_0x3bee03), _0x101a67(_0x3bee03);
    },
    _0x101a67 = function (_0x2f2091) {},
    _0xad64ae = function (_0x5be622, _0x3d572f, _0xc9b2e, _0x1ab9f7) {
      var _0xe9bd95 = '';
      ("play" == _0x3d572f || "pause" == _0x3d572f || "exit" == _0x3d572f || 'full' == _0x3d572f || "exitFull" == _0x3d572f) && (_0xe9bd95 = '[' + _0x3d572f + ',' + new Date().getTime() + ',' + parseInt(_0x5be622.player.currentTime()) + ",,,,,,," + _0x5be622.uuid + ']|'), "changeRate" == _0x3d572f && (_0xe9bd95 = '[' + _0x3d572f + ',' + new Date().getTime() + ',' + parseInt(_0x5be622.player.currentTime()) + ",,,,,," + _0x5be622.player.playbackRate() + ',' + _0x5be622.uuid + ']|'), 'changeLine' == _0x3d572f && (_0xe9bd95 = '[' + _0x3d572f + ',' + new Date().getTime() + ',' + parseInt(_0x5be622.options.seek) + ",,,,,," + _0x5be622.options.lineID + ',' + _0x5be622.uuid + ']|'), "drag" == _0x3d572f && (_0xe9bd95 = '[' + _0x3d572f + ',' + new Date().getTime() + ',' + parseInt(_0xc9b2e) + ',' + parseInt(_0xc9b2e) + ',' + parseInt(_0x1ab9f7) + ',,,,,' + _0x5be622.uuid + ']|'), "kadun" == _0x3d572f && (_0xe9bd95 = '[' + _0x3d572f + ',' + new Date().getTime() + ',' + parseInt(_0x5be622.player.currentTime()) + ',,,,,,' + parseInt(_0x5be622.options.kadun) + ',' + _0x5be622.uuid + ']|'), _0x5be622.options.videoLog ? _0x5be622.options.videoLog = _0x5be622.options.videoLog + _0xe9bd95 : _0x5be622.options.videoLog = _0xe9bd95;
    },
    _0x421842 = function (_0x2b9947) {
      var _0x13591c = '校内';
      _0x2b9947.options.chooseLine == 0x0 && (_0x13591c = '高清');
      _0x2b9947.options.chooseLine == 0x1 && (_0x13591c = '流畅');
      _0x2b9947.options.chooseLine == 0x2 && (_0x13591c = '校内');
      var _0xe1c0b = {
        'videoId': _0x2b9947.options.id,
        'module': 'VIDEO_ERROR_LOG',
        'uuid': _0x2b9947.uuid,
        'lineName': _0x13591c,
        'videoStorage': _0x2b9947.options.src
      };
      _0x3f42ec != null && _0x3f42ec != '' && _0x3f42ec != 'undefined' && (_0xe1c0b.userId = _0x3f42ec);
      var _0x2317be = {
        'data': [_0xe1c0b]
      };
      $.ajax({
        'url': '//collector.zhihuishu.com/public/collect',
        'type': "POST",
        'data': {
          'json': JSON.stringify(_0x2317be)
        },
        'success': function (_0x543234) {},
        'error': function () {}
      });
    };
  setInterval(function () {
    try {
      for (var _0x50c8cd = 0x0; 0x0 < PlayerStarter.playerArray.length; _0x50c8cd++) {
        var _0x4db98a = PlayerStarter.playerArray[_0x50c8cd],
          _0x228401 = _0x4db98a.options.videoLog;
        _0x228401 && (_0x4db98a.options.videoLog = '', _0x101a67(_0x228401));
        if (!_0x4db98a.player.ended()) {
          var _0x35a2eb = '[continue,' + new Date().getTime() + ',' + parseInt(_0x4db98a.player.currentTime()) + ",,,,,,," + _0x4db98a.uuid + ']';
          _0x101a67(_0x35a2eb);
        }
      }
    } catch (_0x2fdc9e) {}
  }, 0x7530);
  function _0x3d5f8f() {
    try {
      $.ajax({
        'url': "//newbase.zhihuishu.com/video/getClientIp2?jsonpCallBack=?",
        'dataType': "jsonp",
        'jsonp': "jsonp",
        'async': !![],
        'cache': ![],
        'success': function (_0x3eec96) {
          _0x2ea888 = _0x3eec96.clientIp, _0x43a4fc = _0x3eec96.pro, _0x4a0ec0 = _0x3eec96.city, _0x2ab4cd = _0x3eec96.addr;
        }
      });
    } catch (_0x65d3d1) {}
  }
}(), function (_0x5b54e0) {
  var _0x297d57 = function (_0xe513e5) {
      _0x5d473c(_0xe513e5), PlayerUtil.supportVideo() ? _0x3f5023(_0xe513e5) : setTimeout(function () {
        _0x3f5023(_0xe513e5);
      }, 0x12c);
    },
    _0x5d473c = function (_0x5f53c6) {
      $('#' + _0x5f53c6.id).children().addClass("able-player-skin"), $('#' + _0x5f53c6.id).on("contextmenu", function () {
        return ![];
      });
    },
    _0x3f5023 = function (_0x3436d3) {
      console.log('objsssss', _0x3436d3);
      var _0x3ca764 = $('#' + _0x3436d3.id).children(),
        _0x35b02c = $("<div class=\"videoArea\" style=\"width: 100%;height: 100%;z-index:1;position: absolute\" ></div>"),
        _0x5dbc5c = $('<div\x20class=\x22controlsBar\x22\x20style=\x22z-index:\x202\x22></div>');
      _0x3ca764.append(_0x35b02c), _0x3ca764.append(_0x5dbc5c), _0x3436d3.$video = _0x3ca764, _0x3436d3.$videoArea = _0x35b02c, _0x3436d3.$ableControlBar = _0x5dbc5c, _0x3436d3.options.mp3Mode && _0x35b02c.css('backgroundColor', "#000"), _0x5c71bf(_0x3436d3), _0x49ee68(_0x3436d3), _0x1efc58(_0x3436d3), _0x3ffa96(_0x3436d3), _0x11c8f7(_0x3436d3), _0x714977(_0x3436d3), _0x233054(_0x3436d3), _0x1498c8(_0x3436d3), _0x54ebf8(_0x3436d3), _0x6a17f2(_0x3436d3), _0x4b77b1(_0x3436d3), _0x5ef91a(_0x3436d3);
    },
    _0x5c71bf = function (_0x42f0c2) {
      var _0x1ab0ff = _0x42f0c2.$video,
        _0x27a32d = _0x42f0c2.player,
        _0x4c5a2b = _0x42f0c2.options,
        _0x2ca482 = '<div\x20class=\x22definiArea\x22\x20\x20style=\x22z-index:\x202\x22\x20>';
      _0x2ca482 += '<div\x20class=\x22definiHead\x22><span>清晰度</span><b\x20class=\x22defCloseBtn\x22></b></div>', _0x2ca482 += "<div class=\"definiLines\">", _0x2ca482 += '<div\x20class=\x22line1\x22><span>线路一</span><b\x20class=\x22line1bq\x22></b><b\x20class=\x22line1gq\x22></b><b\x20class=\x22line1cq\x22></b></div>', _0x2ca482 += "<div class=\"line2\"><span>线路二</span><b class=\"line2cq\"></b></div>", _0x2ca482 += '</div>', _0x2ca482 += "<div class=\"definiSpeedUp\"><span>校内加速</span><b class=\"xiaonei\"></b></div>", _0x2ca482 += "</div>", _0x1ab0ff.append(_0x2ca482), $('#' + _0x42f0c2.id + '\x20.defCloseBtn').on('click', function () {
        $('#' + _0x42f0c2.id + " .definiArea").hide();
      });
      var _0x8fc780 = $('#' + _0x42f0c2.id + '\x20.line1bq'),
        _0x24810e = $('#' + _0x42f0c2.id + " .line1gq"),
        _0x4bc28b = $('#' + _0x42f0c2.id + " .line1cq"),
        _0x2257a9 = $('#' + _0x42f0c2.id + " .line2cq"),
        _0x4432ab = $('#' + _0x42f0c2.id + " .xiaonei"),
        _0x282b76 = $('#' + _0x42f0c2.id + '\x20.definiArea');
      !_0x4c5a2b.schoolIp && _0x4432ab.addClass("xiaoneioff");
      _0x8fc780.on("click", function () {
        _0x27a32d.sdk.setDefinition('350'), _0x8fc780.attr("class", "line1bq_1"), _0x24810e.attr('class', 'line1gq'), _0x4bc28b.attr("class", "line1cq"), _0x282b76.hide();
      }), _0x24810e.on("click", function () {
        _0x27a32d.sdk.setDefinition("1000"), _0x8fc780.attr("class", "line1bq"), _0x24810e.attr("class", "line1gq_1"), _0x4bc28b.attr("class", 'line1cq'), _0x282b76.hide();
      }), _0x4bc28b.on("click", function () {
        _0x27a32d.sdk.setDefinition("1300"), _0x8fc780.attr("class", "line1bq"), _0x24810e.attr("class", "line1gq"), _0x4bc28b.attr('class', "line1cq_1"), _0x282b76.hide();
      }), _0x2257a9.on('click', function () {
        _0x4c5a2b.rate = null, _0x4c5a2b.defini = "line2cq", _0x1fb2fb(_0x42f0c2);
      }), _0x4432ab.on("click", function () {
        _0x4c5a2b.rate = null, _0x4c5a2b.defini = 'xiaonei', _0x1fb2fb(_0x42f0c2);
      });
      if (_0x4c5a2b.defini != null) {
        $('#' + _0x42f0c2.id + '\x20.' + _0x4c5a2b.defini).addClass(_0x4c5a2b.defini + '_1');
        if (_0x4c5a2b.defini == "line1bq") _0x27a32d.sdk.setDefinition("350");else {
          if (_0x4c5a2b.defini == 'line1gq') _0x27a32d.sdk.setDefinition('1000');else _0x4c5a2b.defini == 'line1cq' && _0x27a32d.sdk.setDefinition("1300");
        }
      } else {
        var _0x4d93d3 = _0x27a32d.sdk.getDefaultDefinition();
        if (_0x4d93d3 == "350") _0x4d93d3 = "line1bq";else {
          if (_0x4d93d3 == "1000") _0x4d93d3 = "line1gq";else _0x4d93d3 == "1300" && (_0x4d93d3 = "line1cq");
        }
        _0x4d93d3 != '' && $('#' + _0x42f0c2.id + '\x20.' + _0x4d93d3).addClass(_0x4d93d3 + '_1');
      }
    },
    _0x49ee68 = function (_0x15bcdf) {
      var _0x38c607 = "<div class=\"progress\">";
      _0x38c607 += "<div class=\"progressBar\">", _0x38c607 += "<div class=\"progressBall\">", _0x38c607 += "<div class=\"progressNumber\">00:00</div>", _0x38c607 += "</div>", _0x38c607 += "<div class=\"passTime\"></div>", _0x38c607 += "</div>", _0x38c607 += '</div>', _0x15bcdf.$ableControlBar.append(_0x38c607);
      var _0x3d2a7a = _0x15bcdf.player,
        _0xf84b4b = $('#' + _0x15bcdf.id + " .progress"),
        _0x25c42a = $('#' + _0x15bcdf.id + " .progressBar"),
        _0x51df9a = $('#' + _0x15bcdf.id + " .progressBall"),
        _0x13e975 = $('#' + _0x15bcdf.id + " .progressNumber"),
        _0x42025a = $('#' + _0x15bcdf.id + " .passTime"),
        _0x1f33ea;
      _0x3d2a7a.on('timeupdate', '', function () {
        if (!_0x13e975.is(':visible')) {
          var _0x502aec = parseInt(_0x3d2a7a.sdk.getVideoSetting().duration),
            _0x16a890 = parseInt(_0x3d2a7a.sdk.getVideoTime()),
            _0x4c02da = _0x16a890 / _0x502aec * 0x64;
          _0x1f33ea = $('#' + _0x15bcdf.id).width();
          var _0x2b54d6 = _0x16a890 / _0x502aec * (_0x1f33ea - _0x51df9a.width());
          _0x51df9a.css("left", _0x2b54d6 + 'px'), _0x42025a.css("width", _0x4c02da + '%');
        }
      }), _0xf84b4b.on('mousedown', function (_0x244c27) {
        var _0x1f550d = _0x244c27.pageX - _0x25c42a.offset().left - parseInt(_0x51df9a.css("width")) / 0x2,
          _0x56f42f = parseInt(_0x25c42a.css("width")) - parseInt(_0x51df9a.css("width")),
          _0x93813 = _0x1f550d / _0x56f42f * _0x3d2a7a.sdk.getVideoSetting().duration;
        _0x13e975.html(PlayerUtil.parseSeconds(Math.round(_0x93813))), _0x13e975.show(), _0x3d2a7a.sdk.seekTo(_0x93813), $('#' + _0x15bcdf.id + " #playButton").attr("class", "pauseButton"), $('#' + _0x15bcdf.id + " .bigPlayButton").hide();
        if (_0x1f550d <= 0x0) _0x51df9a.css('left', "0px");else _0x1f550d > _0x56f42f ? (_0x51df9a.css("left", _0x56f42f + 'px'), _0x42025a.css("width", _0x25c42a.css("width"))) : (_0x51df9a.css("left", _0x1f550d + 'px'), _0x42025a.css("width", _0x1f550d));
      }), $(_0xf84b4b).on("mouseup", function () {
        _0x13e975.hide();
      }), _0x51df9a.on("mousedown", function () {
        $(document).on("mousemove.progressBar", function (_0x442475) {
          var _0x30d851 = _0x442475.pageX - _0x25c42a.offset().left - parseInt(_0x51df9a.css("width")) / 0x2,
            _0x31e114 = parseInt(_0x25c42a.css("width")) - parseInt(_0x51df9a.css('width'));
          _0x13e975.show();
          if (_0x30d851 <= 0x0) _0x51df9a.css("left", "0px");else {
            if (_0x30d851 > _0x31e114) _0x51df9a.css('left', _0x31e114 + 'px'), _0x42025a.css("width", _0x25c42a.css("width"));else {
              var _0xb7f05 = PlayerUtil.parseSeconds(Math.round(_0x30d851 / _0x31e114 * _0x3d2a7a.sdk.getVideoSetting().duration));
              _0x13e975.html(_0xb7f05), _0x51df9a.css("left", _0x30d851 + 'px'), _0x42025a.css('width', _0x30d851);
            }
          }
        }), $(document).on("mouseup.progressBar", function (_0x51a93a) {
          var _0x414397 = _0x51a93a.pageX - _0x25c42a.offset().left - parseInt(_0x51df9a.css('width')) / 0x2,
            _0x47b4bd = parseInt(_0x25c42a.css("width")) - parseInt(_0x51df9a.css('width'));
          _0x3d2a7a.sdk.seekTo(_0x414397 / _0x47b4bd * _0x3d2a7a.sdk.getVideoSetting().duration);
          if (_0x3d2a7a.paused) _0x3d2a7a.sdk.pauseVideo();
          _0x13e975.hide(), $(document).off(".progressBar");
        });
      });
    },
    _0x1efc58 = function (_0x4f71dc) {
      var _0x418f36 = '<div\x20id=\x22playButton\x22\x20class=\x22playButton\x20pointer\x22>';
      _0x418f36 += "<div class=\"bigPlayButton pointer\"></div>", _0x418f36 += "</div>", _0x4f71dc.$ableControlBar.append(_0x418f36);
      var _0x5bc1d2 = _0x4f71dc.options,
        _0x192b1b = _0x4f71dc.player,
        _0x12fbfe = $('#' + _0x4f71dc.id + " #playButton"),
        _0x341ebe = $('#' + _0x4f71dc.id + " .bigPlayButton");
      _0x5bc1d2.autostart ? (_0x5bc1d2.beStart = !![], _0x192b1b.paused = ![], _0x12fbfe.attr("class", "pauseButton"), _0x341ebe.hide()) : (_0x192b1b.paused = !![], _0x5bc1d2.beStart = ![], _0x12fbfe.attr('class', 'playButton'), _0x5bc1d2.control.bigPlayerBtn ? _0x341ebe.show() : _0x341ebe.hide()), _0x12fbfe.on('click', function () {
        _0x192b1b.paused ? (_0x12fbfe.attr("class", "pauseButton"), _0x341ebe.hide(), _0x5bc1d2.beStart ? _0x192b1b.sdk.resumeVideo() : (_0x192b1b.sdk.startUp(), _0x5bc1d2.beStart = !![]), _0x192b1b.paused = ![]) : (_0x12fbfe.attr("class", "playButton"), _0x5bc1d2.control.bigPlayerBtn && _0x341ebe.show(), _0x192b1b.sdk.pauseVideo(), _0x192b1b.paused = !![]);
      });
    },
    _0x3ffa96 = function (_0x37a641) {
      var _0x4e2e78 = "<div class=\"nPlayTime\">";
      _0x4e2e78 += "<span class=\"currentTime\">00:00:00</span>/<span class=\"duration\">00:00:00</span>", _0x4e2e78 += "</div>", _0x37a641.$ableControlBar.append(_0x4e2e78);
      var _0x142cd0 = _0x37a641.player,
        _0x48dd17 = parseInt(_0x142cd0.sdk.getVideoSetting().duration);
      _0x48dd17 = PlayerUtil.parseSeconds(_0x48dd17), $('#' + _0x37a641.id + " .duration").html(_0x48dd17 == "NaN:NaN:NaN" ? "00:00:00" : _0x48dd17), _0x142cd0.on("timeupdate", '', function (_0x5384d0) {
        var _0x394076 = parseInt(_0x142cd0.sdk.getVideoTime());
        _0x394076 = PlayerUtil.parseSeconds(_0x394076), $('#' + _0x37a641.id + " .currentTime").html(_0x394076);
      });
    },
    _0x1498c8 = function (_0x3d2b6f) {
      var _0x470e8d = _0x3d2b6f.options;
      if (!PlayerUtil.supportVideo()) return;
      var _0x249ea6 = "<div class=\"speedBox\">";
      _0x249ea6 += '<div\x20class=\x22speedList\x22>', _0x249ea6 += "<div class=\"speedTab05\" rate=\"0.5\" ></div>", _0x249ea6 += "<div class=\"speedTab10\" rate=\"1.0\" ></div>", _0x249ea6 += "<div class=\"speedTab15\" rate=\"1.5\" ></div>", _0x249ea6 += "</div>", _0x249ea6 += "</div>", _0x249ea6 += '</div>', _0x3d2b6f.$ableControlBar.append(_0x249ea6);
      var _0x3e812b = $('#' + _0x3d2b6f.id + " .speedList"),
        _0x49175d = $('#' + _0x3d2b6f.id + " .speedBox");
      !_0x470e8d.control.rateBtn && _0x49175d.hide(), _0x3e812b.children().each(function (_0x526caf, _0x3f0e17) {
        var _0x157f96 = $(_0x3f0e17),
          _0x15e5de = _0x157f96.attr('rate');
        _0x15e5de != "1.0" && _0x157f96.on("click", function () {
          _0x470e8d.defini = null, _0x470e8d.rate = _0x15e5de, _0x1fb2fb(_0x3d2b6f);
        });
      });
    },
    _0x11c8f7 = function (_0x5d221e) {
      _0x5d221e.$ableControlBar.append("<div class=\"fullScreen\"></div>");
      var _0x5260e8 = _0x5d221e.options,
        _0x271e42 = $('#' + _0x5d221e.id + " .fullScreen");
      !_0x5260e8.control.fullBtn && _0x271e42.hide(), _0x5260e8.isFullscreen = 0x0, _0x271e42.on("click", function () {
        _0x5260e8.isFullscreen == 0x0 ? PlayerStarter.requestFullPlay(_0x5d221e) : PlayerStarter.exitFullPlay();
      });
    },
    _0x714977 = function (_0x27878e) {
      var _0x20b186 = "<div class=\"volumeBox\">";
      _0x20b186 += "<div class=\"volumeIcon\"></div>", _0x20b186 += "<div class=\"volumeBarWrap>\"", _0x20b186 += "<div class=\"volumeBar\">", _0x20b186 += "<div class=\"volumeBall\">", _0x20b186 += '<div\x20class=\x22volumeNumber\x22>0%</div>', _0x20b186 += "</div>", _0x20b186 += "<div class=\"passVolume\"></div>", _0x20b186 += "</div>", _0x20b186 += '</div>', _0x20b186 += "</div>", _0x27878e.$ableControlBar.append(_0x20b186);
      var _0x2900fc = _0x27878e.options;
      !_0x2900fc.control.volumeBtn && $('#' + _0x27878e.id + " .volumeBox").hide(), _0x37f6c4(_0x27878e), _0x356410(_0x27878e), _0x4b3a1e(_0x27878e), _0x465f6d(_0x27878e);
    },
    _0x37f6c4 = function (_0x7eb054) {
      var _0x575843 = _0x7eb054.player,
        _0x1e1754 = 0.5;
      setTimeout(function () {
        _0x575843.sdk.setVolume(_0x1e1754);
      }, 0x64);
      var _0x2bdacf = $('#' + _0x7eb054.id + '\x20.volumeBall'),
        _0x27b13e = $('#' + _0x7eb054.id + " .volumeBar"),
        _0x1bd3a5 = $('#' + _0x7eb054.id + '\x20.passVolume'),
        _0x2208b8 = parseInt(_0x27b13e.css("width")) - parseInt(_0x2bdacf.css("width"));
      _0x2bdacf.css("left", _0x2208b8 * _0x1e1754 + 'px'), _0x1bd3a5.css("width", _0x2208b8 * _0x1e1754);
    },
    _0x356410 = function (_0x99fc8f) {
      var _0x22013f = _0x99fc8f.player,
        _0x293c61 = $('#' + _0x99fc8f.id + " .volumeBall"),
        _0x27836c = $('#' + _0x99fc8f.id + " .volumeBar"),
        _0x8ca6cb = $('#' + _0x99fc8f.id + " .volumeBox"),
        _0x218d98 = $('#' + _0x99fc8f.id + " .passVolume"),
        _0x56c4e5 = $('#' + _0x99fc8f.id + " .volumeIcon"),
        _0x5a203a = parseInt(_0x27836c.css("width")) - parseInt(_0x293c61.css("width")),
        _0x28ee0f = 0x0,
        _0x33c537 = 0x0;
      _0x56c4e5.on("mousedown", function () {
        _0x8ca6cb.toggleClass("volumeNone"), _0x33c537 = _0x22013f.sdk.getVideoSetting().volume, _0x33c537 == 0x0 ? (_0x22013f.sdk.setVolume(_0x28ee0f), _0x293c61.css("left", _0x28ee0f * _0x5a203a + 'px'), _0x218d98.css("width", _0x28ee0f * _0x5a203a)) : (_0x28ee0f = _0x33c537, _0x22013f.sdk.setVolume(0x0), _0x293c61.css('left', '0px'), _0x218d98.css("width", "0px"));
      });
    },
    _0x465f6d = function (_0x20908b) {
      var _0x3ed6a5 = _0x20908b.player,
        _0x53f0cd = $('#' + _0x20908b.id + " .volumeBall"),
        _0x57cd27 = $('#' + _0x20908b.id + " .volumeNumber"),
        _0x2b8f08 = $('#' + _0x20908b.id + '\x20.volumeBar'),
        _0x20a5f3 = $('#' + _0x20908b.id + '\x20.volumeBox'),
        _0x52689e = $('#' + _0x20908b.id + '\x20.passVolume');
      _0x2b8f08.on("mousedown", function (_0x8f8b8c) {
        _0x57cd27.show();
        var _0x2184e5 = _0x8f8b8c.pageX - _0x2b8f08.offset().left - parseInt(_0x53f0cd.css("width")) / 0x2,
          _0x1f2e0c = parseInt(_0x2b8f08.css("width")) - parseInt(_0x53f0cd.css("width")),
          _0x637abe = _0x2184e5 / _0x1f2e0c;
        _0x637abe <= 0x1 && _0x637abe >= 0x0 && _0x3ed6a5.sdk.setVolume(_0x637abe);
        if (_0x2184e5 <= 0x0) _0x53f0cd.css('left', "0px"), _0x57cd27.html('0%'), _0x20a5f3.addClass("volumeNone");else _0x2184e5 > _0x1f2e0c ? (_0x53f0cd.css('left', _0x1f2e0c + 'px'), _0x52689e.css("width", _0x2b8f08.css('width')), _0x57cd27.html("100%"), _0x20a5f3.removeClass("volumeNone")) : (_0x53f0cd.css("left", _0x2184e5 + 'px'), _0x52689e.css('width', _0x2184e5), _0x57cd27.html(Math.round(_0x637abe * 0x64) + '%'), _0x20a5f3.removeClass("volumeNone"));
      }), _0x2b8f08.on("mouseup", function () {
        _0x57cd27.hide();
      });
    },
    _0x4b3a1e = function (_0x409a38) {
      var _0xa3e2e5 = _0x409a38.player,
        _0x2f1481 = $('#' + _0x409a38.id + " .volumeBall"),
        _0x27fd9e = $('#' + _0x409a38.id + " .volumeNumber"),
        _0x31d7b9 = $('#' + _0x409a38.id + '\x20.volumeBar'),
        _0x15aaf6 = $('#' + _0x409a38.id + '\x20.volumeBox'),
        _0x1229c6 = $('#' + _0x409a38.id + " .passVolume");
      _0x2f1481.on("mousedown", function () {
        $(document).on('mousemove.volumeBar', function (_0x4dd605) {
          _0x27fd9e.show();
          var _0x2df7a5 = _0x4dd605.pageX - _0x31d7b9.offset().left - parseInt(_0x2f1481.css("width")) / 0x2,
            _0x5aae99 = parseInt(_0x31d7b9.css("width")) - parseInt(_0x2f1481.css('width')),
            _0x2d8cef = _0x2df7a5 / _0x5aae99;
          _0x2d8cef <= 0x1 && _0x2d8cef >= 0x0 && _0xa3e2e5.sdk.setVolume(_0x2d8cef);
          if (_0x2df7a5 <= 0x0) _0x2f1481.css("left", "0px"), _0x27fd9e.html('0%'), _0x15aaf6.addClass('volumeNone');else _0x2df7a5 > _0x5aae99 ? (_0x2f1481.css("left", _0x5aae99 + 'px'), _0x1229c6.css("width", _0x31d7b9.css('width')), _0x27fd9e.html('100%'), _0x15aaf6.removeClass("volumeNone")) : (_0x2f1481.css("left", _0x2df7a5 + 'px'), _0x1229c6.css('width', _0x2df7a5), _0x27fd9e.html(Math.round(_0x2d8cef * 0x64) + '%'), _0x15aaf6.removeClass("volumeNone"));
        }), $(document).on("mouseup.volumeBar", function () {
          _0x27fd9e.hide(), $(document).off(".volumeBar");
        });
      });
    },
    _0x233054 = function (_0x5eee0c) {
      var _0xb1332c = '<div\x20class=\x22definiBox\x22>';
      _0xb1332c += "</div>", _0x5eee0c.$ableControlBar.append(_0xb1332c);
      var _0x1b7806 = _0x5eee0c.id,
        _0x27f146 = $('#' + _0x1b7806 + " .definiBox");
      !_0x5eee0c.options.control.definiBtn && _0x27f146.hide(), _0x27f146.on("click", function () {
        $('#' + _0x1b7806 + '\x20.definiArea').toggle();
      });
    },
    _0x54ebf8 = function (_0x492c74) {
      var _0xd55f69 = "<div class=\"commonBoxDef\">";
      _0xd55f69 += "<div class=\"trackList\">", _0xd55f69 += "</div>", _0xd55f69 += "</div>", _0x492c74.$ableControlBar.append(_0xd55f69), (!_0x492c74.options.control.trackBtn || _0x492c74.options.track == null || _0x492c74.options.track.length == 0x1) && $('#' + _0x492c74.id + " .commonBoxDef").hide(), _0x77a4ac(_0x492c74), _0xc0f951(_0x492c74);
    },
    _0x77a4ac = function (_0x39ddac) {
      var _0x592fdc = _0x39ddac.options,
        _0x45288b = $('#' + _0x39ddac.id + '\x20.commonBoxDef'),
        _0x6bd9f5 = $('#' + _0x39ddac.id + " .trackList");
      _0x592fdc.track == null || _0x592fdc.track.length < 0x1 ? (_0x45288b.hide(), _0x592fdc.control.trackBtn = ![]) : $(_0x592fdc.track).each(function (_0x403169, _0x35304d) {
        var _0x50d178 = _0x592fdc.track[_0x403169].language;
        _0x50d178 == '0' && (_0x50d178 = 'zh', _0x20fb91 = '中文');
        _0x50d178 == '1' && (_0x50d178 = 'en', _0x20fb91 = '英文');
        if (_0x50d178 == '2') return !![];
        _0x6bd9f5.append("<div class=\"speedTab" + _0x50d178 + "\" language=\"" + _0x50d178 + "\"></div>");
      });
    },
    _0xc0f951 = function (_0x3d0908) {
      var _0x30a293 = _0x3d0908.options,
        _0x251e35 = $('#' + _0x3d0908.id + " .trackList");
      _0x251e35.children().each(function (_0x3ab32, _0x478570) {
        var _0x1fc016 = $(_0x478570);
        _0x1fc016.on('click', function () {
          _0x30a293.rate = null, _0x30a293.defini = null, _0x30a293.language = _0x1fc016.attr("language"), _0x1fb2fb(_0x3d0908);
        });
      });
    },
    _0x6a17f2 = function (_0xeb1d44) {
      var _0xdad6f9 = "<div id=\"danmu\" class=\"bulletSwitch bulletSwitchOn\">";
      _0xdad6f9 += "</div>", _0xeb1d44.$ableControlBar.append(_0xdad6f9);
      var _0x17d618 = _0xeb1d44.id;
      !_0xeb1d44.options.control.danmuBtn && $('#' + _0x17d618 + '\x20#danmu').hide(), _0xeb1d44.$videoArea.addClass("container"), _0xeb1d44.$videoArea.parent().addClass('abp'), !window.isIE8 && (_0xeb1d44.cm = new CommentManager(_0xeb1d44.$videoArea[0x0]), _0xeb1d44.cm.init(), _0xeb1d44.cm.start()), $('#' + _0x17d618 + " #danmu").on('click', function () {
        var _0x7b8829 = $(this);
        if (_0x7b8829.hasClass('bulletSwitchOn')) {
          _0x7b8829.removeClass("bulletSwitchOn"), _0x7b8829.addClass("bulletSwitchOff");
          !window.isIE8 && _0xeb1d44.cm.clear();
          return;
        }
        if (_0x7b8829.hasClass('bulletSwitchOff')) {
          _0x7b8829.removeClass("bulletSwitchOff"), _0x7b8829.addClass("bulletSwitchOn");
          return;
        }
      });
    },
    _0x1fb2fb = function (_0x4003d6) {
      PlayerStarter.exitFullPlay();
      var _0x279b14;
      ["webkit", "moz", 'o', 'ms'].forEach(function (_0x1cc080) {
        "undefined" != typeof document[_0x1cc080 + 'Hidden'] && (_0x279b14 = _0x1cc080);
      }), $(document).off(_0x279b14 + "visibilitychange", _0x4003d6.letvztBugFn), $(document).off("visibilitychange", _0x4003d6.letvztBugFn), $('#' + _0x4003d6.id).videojsPlayer(_0x4003d6);
    },
    _0x4b77b1 = function (_0x10e697) {
      if (_0x10e697.options.control.controlBar == 0x0) return;
      var _0x355ae4 = _0x10e697.player,
        _0x58dc8d = _0x10e697.id;
      _0x355ae4.on('useractive', _0x58dc8d, function () {
        _0x10e697.$ableControlBar.show();
      }), _0x355ae4.on("userinactive", _0x58dc8d, function () {
        _0x10e697.$ableControlBar.slideUp();
      });
    },
    _0x5ef91a = function (_0x2850cb) {
      var _0x57421f = _0x2850cb.player,
        _0x3fff05 = _0x2850cb.options,
        _0x22a9bf = _0x2850cb.$videoArea;
      _0x22a9bf.on("click", function () {
        clearTimeout(null), _0x2302c4 = setTimeout(function () {
          var _0x31f84e = $('#' + _0x2850cb.id + " #playButton"),
            _0x38c9f9 = $('#' + _0x2850cb.id + '\x20.bigPlayButton');
          _0x57421f.paused ? (_0x31f84e.attr("class", "pauseButton"), _0x38c9f9.hide(), _0x57421f.sdk.resumeVideo(), _0x57421f.paused = ![]) : (_0x31f84e.attr("class", "playButton"), _0x3fff05.control.bigPlayerBtn && _0x38c9f9.show(), _0x57421f.sdk.pauseVideo(), _0x57421f.paused = !![]);
        }, 0x12c);
      }), _0x22a9bf.on("dblclick", function () {
        clearTimeout(_0x2302c4), _0x3fff05.isFullscreen == 0x0 ? PlayerStarter.requestFullPlay(_0x2850cb) : PlayerStarter.exitFullPlay();
      });
    };
  window.letvComponent = _0x297d57, window.letvCB = function (_0x5b35a4, _0x387043, _0xdcc53f) {
    var _0x6704c8 = _0xdcc53f.options,
      _0x143940 = $('#' + _0xdcc53f.id + '\x20#playButton'),
      _0x5dbb31 = $('#' + _0xdcc53f.id + '\x20.bigPlayButton');
    if (_0x5b35a4 == "videoStop") {
      _0x6704c8.beStart && (_0xdcc53f.player.paused = !![], _0x143940.attr("class", "playButton"), _0x6704c8.control.bigPlayerBtn ? _0x5dbb31.show() : _0x5dbb31.hide());
      var _0x2717ed = parseInt(_0xdcc53f.player.sdk.getVideoSetting().duration);
      _0x2717ed = PlayerUtil.parseSeconds(_0x2717ed), $('#' + _0xdcc53f.id + " .currentTime").html(_0x2717ed), $('#' + _0xdcc53f.id + " .progressBall").css('left', '100%'), $('#' + _0xdcc53f.id + '\x20.progressBall').css("margin-left", "-16px");
    }
    (_0x5b35a4 == "videoStart" || _0x5b35a4 == "videoResume") && ($('#' + _0xdcc53f.id + " .progressBall").css("margin-left", "0px"), _0x143940.attr("class", 'pauseButton'), _0x5dbb31.hide(), !window.isIE8 && _0xdcc53f.cm.start()), _0x5b35a4 == "videoPause" && (_0x143940.attr('class', 'playButton'), _0x6704c8.control.bigPlayerBtn ? _0x5dbb31.show() : _0x5dbb31.hide(), !window.isIE8 && _0xdcc53f.cm.stop());
  };
  function _0x42a704(_0x5d8d8b) {
    this.obj = _0x5d8d8b;
  }
  _0x42a704.prototype = {
    'seek': function (_0xf124b4) {
      try {
        this.obj.player.sdk.seekTo(_0xf124b4);
      } catch (_0x3ba622) {
        PlayerUtil.log('letv跳转进度失败!');
      }
    },
    'setFullscreen': function () {},
    'play': function () {
      try {
        this.obj.player.sdk.resumeVideo(), this.obj.player.paused = ![];
      } catch (_0x333124) {
        PlayerUtil.log("letv播放失败!");
      }
    },
    'pause': function () {
      try {
        this.obj.player.sdk.pauseVideo(), this.obj.player.paused = !![];
      } catch (_0x114f56) {
        PlayerUtil.log("letv暂停失败!");
      }
    },
    'getDuration': function () {
      try {
        return this.obj.player.sdk.getVideoSetting().duration;
      } catch (_0x3939e2) {
        PlayerUtil.log("letv获取总时间失败!");
      }
    },
    'getPosition': function () {
      try {
        return this.obj.player.sdk.getVideoTime();
      } catch (_0xab96bd) {
        PlayerUtil.log("letv获取播放进度失败!");
      }
    },
    'addCourseInfo': function (_0x1b8be6) {
      try {
        this.obj.courseInfo = $.extend(this.obj.courseInfo, _0x1b8be6);
      } catch (_0xbdf8c4) {
        PlayerUtil.log("letv添加课程信息失败!");
      }
    },
    'dispose': function () {
      try {
        this.obj.player.sdk.shutDown();
        var _0x594801;
        ['webkit', "moz", 'o', 'ms'].forEach(function (_0x21867f) {
          "undefined" != typeof document[_0x21867f + 'Hidden'] && (_0x594801 = _0x21867f);
        }), $(document).off(_0x594801 + "visibilitychange", this.obj.letvztBugFn), $(document).off("visibilitychange", this.obj.letvztBugFn), PlayerStarter.del(this.obj.id);
      } catch (_0x3e1eb0) {
        PlayerUtil.log('letv销毁视频失败!');
      }
    },
    'getFullStatus': function () {
      try {
        return this.obj.options.isFullscreen != 0x0;
      } catch (_0x426c33) {
        PlayerUtil.log('letv获取全屏状态失败!');
      }
    },
    'exitFullPlay': function () {
      try {
        PlayerStarter.exitFullPlay();
      } catch (_0x53a5d2) {
        PlayerUtil.log("letv退出全屏失败");
      }
    },
    'resize': function (_0x201649, _0x4460a4) {
      try {
        if (!this.getFullStatus()) {
          var _0x1bcd9b = $('#' + this.obj.id);
          _0x1bcd9b.width(_0x201649), _0x1bcd9b.height(_0x4460a4), PlayerStarter.resetControls(this.obj), !window.isIE8 && this.obj.cm.init();
        }
      } catch (_0x848e32) {
        PlayerUtil.log("vjs改变播放器大小失败!");
      }
    },
    'insertPopup': function (_0x4b64f2) {
      try {
        var _0x5df1bd = $("<div class=\"ablePlayerPopup-container\"><table class=\"tbl-pop\"><tr><td align=\"center\"><div class=\"reset-ele\"></div></td></tr></table></div>");
        _0x5df1bd.find(".reset-ele").append(_0x4b64f2);
        var _0x3df3e8 = $('#' + this.obj.id);
        _0x3df3e8.children("div :eq(0)").append(_0x5df1bd[0x0]);
      } catch (_0x144baf) {
        PlayerUtil.log('vjs添加弹出层失败!');
      }
    },
    'removePopup': function () {
      try {
        var _0x10e607 = $('#' + this.obj.id + '\x20.ablePlayerPopup-container');
        _0x10e607.remove();
      } catch (_0x49dcaa) {
        PlayerUtil.log("vjs删除弹出层失败!");
      }
    },
    'sendDanmu': function (_0x590cf4) {
      try {
        if (this.obj.defOptions.control.danmuBtn && $('#' + this.obj.id + " #danmu").hasClass('bulletSwitchOn') && !window.isIE8) {
          var _0x2f8168 = cclUtil.getMsgObj(_0x590cf4);
          this.obj.cm.send(_0x2f8168);
        }
      } catch (_0x331e3e) {
        PlayerUtil.log('letv发送弹幕失败!');
      }
    }
  }, window.letvAPI = _0x42a704;
}(), function () {
  var _0x4f5613 = function () {
      CloudVodPlayer.prototype.on = function (_0x2d6206, _0xe2039d, _0xd774a5) {
        if (_0x2d6206 == "timeupdate") _0x227848(this, _0xd774a5);else {
          if (_0x2d6206 == "userinactive") _0x1714a6(_0xe2039d, _0xd774a5);else _0x2d6206 == 'useractive' && _0x41ae34(_0xe2039d, _0xd774a5);
        }
      };
    },
    _0x227848 = function (_0x8f49e6, _0x10525f) {
      var _0x1c1bed = _0x8f49e6.sdk.getVideoTime();
      setInterval(function () {
        var _0x12e702 = _0x8f49e6.sdk.getVideoTime();
        _0x12e702 != _0x1c1bed && _0x12e702 != 0x0 && (_0x10525f(), _0x1c1bed = _0x12e702);
      }, 0x1f4);
    },
    _0x1714a6 = function (_0x3c24ae, _0x398301) {
      var _0x10e9af = $('#' + _0x3c24ae),
        _0x138421 = 0x0,
        _0x3dab80 = 0x0,
        _0x2a331c = 0x1f4,
        _0x35c683 = 0x7d0 / _0x2a331c,
        _0x3086a8 = 0x0;
      _0x10e9af.mousemove(function (_0x4f49e2) {
        _0x138421 = _0x4f49e2.offsetX, _0x3dab80 = _0x4f49e2.offsetY;
      }), setInterval(function () {
        0x0 == _0x138421 && 0x0 == _0x3dab80 ? _0x3086a8++ : (_0x32308e = _0x138421, _0x59c5a9 = _0x3dab80, _0x3086a8 = 0x1), _0x3086a8 == _0x35c683 && _0x398301();
      }, _0x2a331c);
    },
    _0x41ae34 = function (_0x597fc2, _0x59ef37) {
      $('#' + _0x597fc2).mousemove(function (_0x51d683) {
        _0x59ef37();
      });
    };
  window.letvExtend = _0x4f5613;
}(), function () {
  $.fn.letvPlayer = function (_0x4619be) {
    _0x5e44c7(_0x4619be);
  };
  var _0x5e44c7 = function (_0x12093e) {
      _0x12093e.times.creatTime = new Date().getTime(), _0x12093e.currentPlayerType = PlayerStarter.playerTypes.letv;
      var _0x108481 = _0x12093e.options;
      $.ajax({
        'type': 'get',
        'data': {},
        'url': '//base1.zhihuishu.com/able-commons/letvvideo/getVideo?id=' + _0x108481.id + '&jsonp=?',
        'dataType': 'jsonp',
        'jsonp': "jsonp",
        'async': !![],
        'cache': ![],
        'success': function (_0x3b5da6) {
          _0x3b5da6.code != '1' && (_0x3b5da6.data = {
            'code': '0',
            'data': {
              'video_unique': ''
            }
          });
          var _0x1be08d = _0x3b5da6.data;
          if (_0x1be08d.code == '0') {
            var _0x4e6afb = _0x1be08d.data,
              _0x5719db = _0x4e6afb.status;
            _0x108481.vuid = _0x4e6afb.video_unique, _0x4af134(_0x12093e);
            if ('10' == _0x5719db) {} else {
              if ('30' == _0x5719db) PlayerUtil.log("视频处理中!");else {
                if ('20' == _0x5719db) PlayerUtil.log("视频处理失败!");else '40' == _0x5719db ? PlayerUtil.log('抱歉,\x20音/视频已停用!') : PlayerUtil.log("音/视频状态异常!请重新上传!");
              }
            }
          }
        },
        'error': function (_0x49000e) {}
      });
    },
    _0x4af134 = function (_0x13e694) {
      var _0xe0b015,
        _0x2067d9 = {
          'id': _0x13e694.options.id,
          'host': ''
        };
      $.getJSON("//base1.zhihuishu.com/able-commons/cdn/media/ableplayerV4/?d=a&jsoncallback=?", _0x2067d9, function (_0x1c2033) {
        _0x1c2033.sources[0x1].status == '10' ? (_0xe0b015 = _0x1c2033.sources[0x1].file, _0xe0b015 != '' ? (_0x13e694.options.track = _0x1c2033.subtitle, _0x1ea900(_0x13e694)) : PlayerUtil.log("未查询到视频src!")) : (PlayerUtil.log("视频转码未成功!"), PlayerStarter.showError(_0x13e694, '01', "视频转码中,请稍后重试"), PlayerStarter.del(_0x13e694.id));
      });
    };
  function _0x1ea900(_0x1b7eac) {
    var _0x29b219 = _0x1b7eac.options,
      _0x59542f = _0x1b7eac.id;
    PlayerUtil.log('vu:' + _0x29b219.vuid), PlayerUtil.log("uu:2b686d84e3");
    var _0x4c771d = $('#' + _0x1b7eac.id);
    _0x29b219.width = _0x4c771d.width(), _0x29b219.height = _0x4c771d.height();
    var _0x487b6a = new CloudVodPlayer(),
      _0xc85eae = _0x29b219.autostart == !![] ? 0x1 : 0x0;
    _0x487b6a.init({
      'uu': "2b686d84e3",
      'vu': _0x29b219.vuid,
      'controls': '0',
      'autoplay': _0xc85eae,
      'skinnable': '0',
      'isPauseOrResume': 0x1,
      'type': PlayerUtil.supportVideo() ? "video" : "swf",
      'pic': _0x29b219.image,
      'callbackJs': _0x59542f + "call"
    }, _0x59542f), _0x1b7eac.player = _0x487b6a, window[_0x59542f + "call"] = function (_0x5bc7b8, _0x5c8a20) {
      _0x3e0bd9(_0x5bc7b8, _0x5c8a20, _0x1b7eac);
    };
  }
  var _0x3e0bd9 = function (_0x1def5c, _0x20634c, _0x181242) {
      var _0xefbfba = _0x181242.callback,
        _0x393fa0 = _0x181242.options;
      _0x181242.afterInit && letvCB(_0x1def5c, _0x20634c, _0x181242);
      if (_0x1def5c == 'playerInit') {
        var _0x213fb2;
        ["webkit", "moz", 'o', 'ms'].forEach(function (_0x38b3c2) {
          "undefined" != typeof document[_0x38b3c2 + 'Hidden'] && (_0x213fb2 = _0x38b3c2);
        }), _0x181242.letvztBugFn = function () {
          !_0x181242.player.paused && _0x181242.player.sdk.resumeVideo();
        }, $(document).on(_0x213fb2 + "visibilitychange", _0x181242.letvztBugFn), $(document).on("visibilitychange", _0x181242.letvztBugFn), _0x181242.afterInit = !![], _0x181242.times.initEndTime = new Date().getTime(), _0x142477(_0x181242), typeof _0xefbfba != 'undefined' && PlayerUtil.isExitsFunction(_0xefbfba.onReady) && _0xefbfba.onReady();
      }
      _0x1def5c == "videoStop" && _0x393fa0.beStart && typeof _0xefbfba != 'undefined' && PlayerUtil.isExitsFunction(_0xefbfba.onComplete) && _0xefbfba.onComplete(), _0x1def5c == "videoPause" && typeof _0xefbfba != "undefined" && PlayerUtil.isExitsFunction(_0xefbfba.onPause) && _0xefbfba.onPause(), _0x1def5c == "videoResume" && typeof _0xefbfba != "undefined" && PlayerUtil.isExitsFunction(_0xefbfba.onPlay) && _0xefbfba.onPlay(), _0x1def5c == "videoStart" && typeof _0xefbfba != "undefined" && PlayerUtil.isExitsFunction(_0xefbfba.onPlay) && _0xefbfba.onPlay(), _0x1def5c == "videoError" && (_0x142477(_0x181242), _0x181242.$videoArea.prev().remove(), PlayerStarter.showError(_0x181242, '02', "视频异常:请切换线路二"), PlayerStarter.del(_0x181242.id));
    },
    _0x142477 = function (_0x47459d) {
      try {} catch (_0x2b6cdb) {}
      letvExtend(), letvComponent(_0x47459d), _0x97767a(_0x47459d), PlayerUtil.log('乐视播放器初始化完成!');
    },
    _0x97767a = function (_0x147690) {
      var _0x10a4d1 = _0x147690.options,
        _0x30a232 = _0x147690.player,
        _0x42007a = _0x147690.callback,
        _0x106d9b = _0x10a4d1.seek;
      _0x10a4d1.seek > 0x2 && setTimeout(function () {
        _0x30a232.sdk.seekTo(_0x106d9b);
      }, 0x3e8), _0x30a232.on('timeupdate', '', function () {
        _0x10a4d1.seek = _0x30a232.sdk.getVideoTime(), _0x147690.times.firstLoadTime == 0x0 && (_0x147690.times.firstLoadTime = new Date().getTime()), typeof _0x42007a != "undefined" && PlayerUtil.isExitsFunction(_0x42007a.onTime) && _0x42007a.onTime(_0x10a4d1.seek);
      });
    };
}(), function () {
  var _0x57b676 = {
    'getMsgObj': function (_0x5484a2) {
      var _0x49ab29 = parseInt(Math.random() * 0xb, 0xa),
        _0x1fda6a = ['000000', 'C0C0C0', "ffffff", 'ff0000', "00ff00", '0000ff', "ffff00", "00ffff", 'ff00ff', "ffffff", "ffffff", 'ffffff', "ffffff", "ffffff", "ffffff", "ffffff", "ffffff"][_0x49ab29],
        _0x9fcf15 = {
          'mode': 0x1,
          'text': _0x3666b6(_0x5484a2),
          'dur': 0x1770,
          'size': 0x21,
          'color': _0x1fda6a
        };
      return _0x9fcf15;
    }
  };
  function _0x3666b6(_0x243323) {
    return _0x243323 = _0x243323.replace(/\[呲牙\]/g, '<span\x20class=\x22face-item\x20face-item-cy\x22></span>'), _0x243323 = _0x243323.replace(/\[可爱\]/g, "<span class=\"face-item face-item-ka\"></span>"), _0x243323 = _0x243323.replace(/\[发怒\]/g, "<span class=\"face-item face-item-fn\"></span>"), _0x243323 = _0x243323.replace(/\[擦汗\]/g, '<span\x20class=\x22face-item\x20face-item-ch\x22></span>'), _0x243323 = _0x243323.replace(/\[坏笑\]/g, "<span class=\"face-item face-item-huaix\"></span>"), _0x243323 = _0x243323.replace(/\[惊恐\]/g, "<span class=\"face-item face-item-jk\"></span>"), _0x243323 = _0x243323.replace(/\[流泪\]/g, "<span class=\"face-item face-item-ll\"></span>"), _0x243323 = _0x243323.replace(/\[偷笑\]/g, '<span\x20class=\x22face-item\x20face-item-tx\x22></span>'), _0x243323 = _0x243323.replace(/\[调皮\]/g, "<span class=\"face-item face-item-tp\"></span>"), _0x243323 = _0x243323.replace(/\[咒骂\]/g, "<span class=\"face-item face-item-zhm\"></span>"), _0x243323 = _0x243323.replace(/\[委屈\]/g, "<span class=\"face-item face-item-wq\"></span>"), _0x243323 = _0x243323.replace(/\[晕\]/g, "<span class=\"face-item face-item-yun\"></span>"), _0x243323 = _0x243323.replace(/\[抓狂\]/g, "<span class=\"face-item face-item-zk\"></span>"), _0x243323 = _0x243323.replace(/\[色\]/g, "<span class=\"face-item face-item-se\"></span>"), _0x243323 = _0x243323.replace(/\[鄙视\]/g, "<span class=\"face-item face-item-bs\"></span>"), _0x243323 = _0x243323.replace(/\[闭嘴\]/g, "<span class=\"face-item face-item-bz\"></span>"), _0x243323 = _0x243323.replace(/\[发呆\]/g, "<span class=\"face-item face-item-fd\"></span>"), _0x243323 = _0x243323.replace(/\[困\]/g, "<span class=\"face-item face-item-kun\"></span>"), _0x243323 = _0x243323.replace(/\[抠鼻\]/g, "<span class=\"face-item face-item-kb\"></span>"), _0x243323 = _0x243323.replace(/\[阴险\]/g, "<span class=\"face-item face-item-yx\"></span>"), _0x243323 = _0x243323.replace(/\[吐\]/g, "<span class=\"face-item face-item-tuu\"></span>"), _0x243323 = _0x243323.replace(/\[奋斗\]/g, '<span\x20class=\x22face-item\x20face-item-fendou\x22></span>'), _0x243323 = _0x243323.replace(/\[惊讶\]/g, "<span class=\"face-item face-item-jy\"></span>"), _0x243323 = _0x243323.replace(/\[流汗\]/g, '<span\x20class=\x22face-item\x20face-item-lh\x22></span>'), _0x243323 = _0x243323.replace(/\[疑问\]/g, "<span class=\"face-item face-item-yiw\"></span>"), _0x243323 = _0x243323.replace(/\[嘘\]/g, "<span class=\"face-item face-item-xu\"></span>"), _0x243323 = _0x243323.replace(/\[冷汗\]/g, "<span class=\"face-item face-item-lengh\"></span>"), _0x243323 = _0x243323.replace(/\[鼓掌\]/g, "<span class=\"face-item face-item-gz\"></span>"), _0x243323 = _0x243323.replace(/\[哈欠\]/g, '<span\x20class=\x22face-item\x20face-item-hq\x22></span>'), _0x243323 = _0x243323.replace(/\[憨笑\]/g, '<span\x20class=\x22face-item\x20face-item-hanx\x22></span>'), _0x243323 = _0x243323.replace(/\[得意\]/g, "<span class=\"face-item face-item-dy\"></span>"), _0x243323 = _0x243323.replace(/\[亲亲\]/g, "<span class=\"face-item face-item-qq\"></span>"), _0x243323 = _0x243323.replace(/\[睡\]/g, '<span\x20class=\x22face-item\x20face-item-shui\x22></span>'), _0x243323 = _0x243323.replace(/\[右哼哼\]/g, '<span\x20class=\x22face-item\x20face-item-yhh\x22></span>'), _0x243323 = _0x243323.replace(/\[左哼哼\]/g, '<span\x20class=\x22face-item\x20face-item-zhh\x22></span>'), _0x243323 = _0x243323.replace(/\[折磨\]/g, "<span class=\"face-item face-item-zhem\"></span>"), _0x243323 = _0x243323.replace(/\[快哭了\]/g, '<span\x20class=\x22face-item\x20face-item-kk\x22></span>'), _0x243323 = _0x243323.replace(/\[可怜\]/g, '<span\x20class=\x22face-item\x20face-item-kel\x22></span>'), _0x243323 = _0x243323.replace(/\[糗大了\]/g, "<span class=\"face-item face-item-qd\"></span>"), _0x243323 = _0x243323.replace(/\[傲慢\]/g, "<span class=\"face-item face-item-am\"></span>"), _0x243323 = _0x243323.replace(/\[吓\]/g, "<span class=\"face-item face-item-xia\"></span>"), _0x243323 = _0x243323.replace(/\[酷\]/g, "<span class=\"face-item face-item-kuk\"></span>"), _0x243323 = _0x243323.replace(/\[大兵\]/g, '<span\x20class=\x22face-item\x20face-item-db\x22></span>'), _0x243323 = _0x243323.replace(/\[饥饿\]/g, "<span class=\"face-item face-item-jie\"></span>"), _0x243323 = _0x243323.replace(/\[衰\]/g, "<span class=\"face-item face-item-shuai\"></span>"), _0x243323 = _0x243323.replace(/\[骷髅\]/g, "<span class=\"face-item face-item-kl\"></span>"), _0x243323 = _0x243323.replace(/\[强\]/g, "<span class=\"face-item face-item-qiang\"></span>"), _0x243323 = _0x243323.replace(/\[弱\]/g, "<span class=\"face-item face-item-ruo\"></span>"), _0x243323 = _0x243323.replace(/\[敲打\]/g, "<span class=\"face-item face-item-qiao\"></span>"), _0x243323 = _0x243323.replace(/\[心碎\]/g, '<span\x20class=\x22face-item\x20face-item-xs\x22></span>'), _0x243323 = _0x243323.replace(/\[握手\]/g, "<span class=\"face-item face-item-ws\"></span>"), _0x243323 = _0x243323.replace(/\[胜利\]/g, "<span class=\"face-item face-item-shl\"></span>"), _0x243323 = _0x243323.replace(/\[差劲\]/g, "<span class=\"face-item face-item-cj\"></span>"), _0x243323 = _0x243323.replace(/\[NO\]/g, "<span class=\"face-item face-item-bu\"></span>"), _0x243323 = _0x243323.replace(/\[拳头\]/g, "<span class=\"face-item face-item-qt\"></span>"), _0x243323 = _0x243323.replace(/\[菜刀\]/g, '<span\x20class=\x22face-item\x20face-item-cd\x22></span>'), _0x243323 = _0x243323.replace(/\[炸弹\]/g, "<span class=\"face-item face-item-zhd\"></span>"), _0x243323 = _0x243323.replace(/\[便便\]/g, "<span class=\"face-item face-item-bb\"></span>"), _0x243323 = _0x243323.replace(/\[篮球\]/g, "<span class=\"face-item face-item-lq\"></span>"), _0x243323 = _0x243323.replace(/\[足球\]/g, "<span class=\"face-item face-item-zq\"></span>"), _0x243323 = _0x243323.replace(/\[闪电\]/g, '<span\x20class=\x22face-item\x20face-item-shd\x22></span>'), _0x243323 = _0x243323.replace(/\[猪头\]/g, "<span class=\"face-item face-item-zt\"></span>"), _0x243323 = _0x243323.replace(/\[乒乓\]/g, "<span class=\"face-item face-item-pp\"></span>"), _0x243323;
  }
  window.cclUtil = _0x57b676;
}(), !function (_0x32e2b2) {
  "function" == typeof define && define.amd ? define(["jquery"], _0x32e2b2) : "object" == typeof exports ? _0x32e2b2(require('jquery')) : _0x32e2b2(jQuery);
}(function (_0x37aafc) {
  function _0x9f70b8(_0x3a9994) {
    return _0x161aa0.raw ? _0x3a9994 : encodeURIComponent(_0x3a9994);
  }
  function _0x1a066c(_0x240716) {
    return _0x161aa0.raw ? _0x240716 : decodeURIComponent(_0x240716);
  }
  function _0x7f66b6(_0x49e55b) {
    return _0x9f70b8(_0x161aa0.json ? JSON.stringify(_0x49e55b) : String(_0x49e55b));
  }
  function _0x296c03(_0x22ef72) {
    0x0 === _0x22ef72.indexOf('\x22') && (_0x22ef72 = _0x22ef72.slice(0x1, -0x1).replace(/\\"/g, '\x22').replace(/\\\\/g, '\x5c'));
    try {
      return _0x22ef72 = decodeURIComponent(_0x22ef72.replace(_0x2522cd, '\x20')), _0x161aa0.json ? JSON.parse(_0x22ef72) : _0x22ef72;
    } catch (_0x286981) {}
  }
  function _0x463742(_0x1bcb06, _0x23bf68) {
    var _0x2ed1a4 = _0x161aa0.raw ? _0x1bcb06 : _0x296c03(_0x1bcb06);
    return _0x37aafc.isFunction(_0x23bf68) ? _0x23bf68(_0x2ed1a4) : _0x2ed1a4;
  }
  var _0x2522cd = /\+/g,
    _0x161aa0 = _0x37aafc.cookie = function (_0x4275e5, _0x1e577e, _0x226eac) {
      if (void 0x0 !== _0x1e577e && !_0x37aafc.isFunction(_0x1e577e)) {
        if (_0x226eac = _0x37aafc.extend({}, _0x161aa0.defaults, _0x226eac), "number" == typeof _0x226eac.expires) {
          var _0x17b963 = _0x226eac.expires,
            _0x56bdb6 = _0x226eac.expires = new Date();
          _0x56bdb6.setTime(+_0x56bdb6 + 0x5265c00 * _0x17b963);
        }
        return document.cookie = [_0x9f70b8(_0x4275e5), '=', _0x7f66b6(_0x1e577e), _0x226eac.expires ? "; expires=" + _0x226eac.expires.toUTCString() : '', _0x226eac.path ? "; path=" + _0x226eac.path : '', _0x226eac.domain ? "; domain=" + _0x226eac.domain : '', _0x226eac.secure ? "; secure" : ''].join('');
      }
      for (var _0x38f7ff = _0x4275e5 ? void 0x0 : {}, _0x2adc1a = document.cookie ? document.cookie.split(';\x20') : [], _0x18f17d = 0x0, _0x24cdb7 = _0x2adc1a.length; _0x24cdb7 > 0x0; _0x18f17d++) {
        var _0x367e02 = _0x2adc1a[_0x18f17d].split('='),
          _0x3e552b = _0x1a066c(_0x367e02.shift()),
          _0x5834d6 = _0x367e02.join('=');
        if (_0x4275e5 && _0x4275e5 === _0x3e552b) {
          _0x38f7ff = _0x463742(_0x5834d6, _0x1e577e);
          break;
        }
        _0x4275e5 || void 0x0 === (_0x5834d6 = _0x463742(_0x5834d6)) || (_0x38f7ff[_0x3e552b] = _0x5834d6);
      }
      return _0x38f7ff;
    };
  _0x161aa0.defaults = {}, _0x37aafc.removeCookie = function (_0x46a58c, _0x176521) {
    return void 0x0 === _0x37aafc.cookie(_0x46a58c) ? !0x1 : (_0x37aafc.cookie(_0x46a58c, '', _0x37aafc.extend({}, _0x176521, {
      'expires': -0x1
    })), !_0x37aafc.cookie(_0x46a58c));
  };
});
typeof JSON !== "object" && (JSON = {});
(function () {
  'use strict';

  var _0x43ab36 = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    _0x40c586 = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  function _0x29f271(_0x3d10b2) {
    return _0x3d10b2 < 0xa ? '0' + _0x3d10b2 : _0x3d10b2;
  }
  function _0x369a71() {
    return this.valueOf();
  }
  typeof Date.prototype.toJSON !== "function" && (Date.prototype.toJSON = function () {
    return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + _0x29f271(this.getUTCMonth() + 0x1) + '-' + _0x29f271(this.getUTCDate()) + 'T' + _0x29f271(this.getUTCHours()) + ':' + _0x29f271(this.getUTCMinutes()) + ':' + _0x29f271(this.getUTCSeconds()) + 'Z' : null;
  }, Boolean.prototype.toJSON = _0x369a71, Number.prototype.toJSON = _0x369a71, String.prototype.toJSON = _0x369a71);
  var _0xb7edb5, _0x1e46c6, _0x5d6798, _0x47603f;
  function _0x19a6cb(_0x5b40a1) {
    return _0x43ab36.lastIndex = 0x0, _0x43ab36.test(_0x5b40a1) ? '\x22' + _0x5b40a1.replace(_0x43ab36, function (_0x261124) {
      var _0x54e1eb = _0x5d6798[_0x261124];
      return typeof _0x54e1eb === "string" ? _0x54e1eb : '\x5cu' + ('0000' + _0x261124.charCodeAt(0x0).toString(0x10)).slice(-0x4);
    }) + '\x22' : '\x22' + _0x5b40a1 + '\x22';
  }
  function _0x3fb9ee(_0x550e07, _0x34f591) {
    var _0x5f4155,
      _0x38a2e8,
      _0x580295,
      _0x734d20,
      _0x3883b3 = _0xb7edb5,
      _0x36bf82,
      _0x8a36d8 = _0x34f591[_0x550e07];
    _0x8a36d8 && typeof _0x8a36d8 === "object" && typeof _0x8a36d8.toJSON === "function" && (_0x8a36d8 = _0x8a36d8.toJSON(_0x550e07));
    typeof _0x47603f === 'function' && (_0x8a36d8 = _0x47603f.call(_0x34f591, _0x550e07, _0x8a36d8));
    switch (typeof _0x8a36d8) {
      case "string":
        return _0x19a6cb(_0x8a36d8);
      case "number":
        return isFinite(_0x8a36d8) ? String(_0x8a36d8) : "null";
      case 'boolean':
      case "null":
        return String(_0x8a36d8);
      case "object":
        if (!_0x8a36d8) return 'null';
        _0xb7edb5 += _0x1e46c6, _0x36bf82 = [];
        if (Object.prototype.toString.apply(_0x8a36d8) === "[object Array]") {
          _0x734d20 = _0x8a36d8.length;
          for (_0x5f4155 = 0x0; _0x5f4155 < _0x734d20; _0x5f4155 += 0x1) {
            _0x36bf82[_0x5f4155] = _0x3fb9ee(_0x5f4155, _0x8a36d8) || "null";
          }
          return _0x580295 = _0x36bf82.length === 0x0 ? '[]' : _0xb7edb5 ? '[\x0a' + _0xb7edb5 + _0x36bf82.join(',\x0a' + _0xb7edb5) + '\x0a' + _0x3883b3 + ']' : '[' + _0x36bf82.join(',') + ']', _0xb7edb5 = _0x3883b3, _0x580295;
        }
        if (_0x47603f && typeof _0x47603f === "object") {
          _0x734d20 = _0x47603f.length;
          for (_0x5f4155 = 0x0; _0x5f4155 < _0x734d20; _0x5f4155 += 0x1) {
            typeof _0x47603f[_0x5f4155] === "string" && (_0x38a2e8 = _0x47603f[_0x5f4155], _0x580295 = _0x3fb9ee(_0x38a2e8, _0x8a36d8), _0x580295 && _0x36bf82.push(_0x19a6cb(_0x38a2e8) + (_0xb7edb5 ? ':\x20' : ':') + _0x580295));
          }
        } else for (_0x38a2e8 in _0x8a36d8) {
          Object.prototype.hasOwnProperty.call(_0x8a36d8, _0x38a2e8) && (_0x580295 = _0x3fb9ee(_0x38a2e8, _0x8a36d8), _0x580295 && _0x36bf82.push(_0x19a6cb(_0x38a2e8) + (_0xb7edb5 ? ':\x20' : ':') + _0x580295));
        }
        _0x580295 = _0x36bf82.length === 0x0 ? '{}' : _0xb7edb5 ? '{\x0a' + _0xb7edb5 + _0x36bf82.join(',\x0a' + _0xb7edb5) + '\x0a' + _0x3883b3 + '}' : '{' + _0x36bf82.join(',') + '}', _0xb7edb5 = _0x3883b3;
        return _0x580295;
    }
  }
  typeof JSON.stringify !== "function" && (_0x5d6798 = {
    '\x08': '\x5cb',
    '\x09': '\x5ct',
    '\x0a': '\x5cn',
    '\x0c': '\x5cf',
    '\x0d': '\x5cr',
    '\x22': '\x5c\x22',
    '\x5c': '\x5c\x5c'
  }, JSON.stringify = function (_0xf5944, _0x36639f, _0x43c9da) {
    var _0x8b57d9;
    _0xb7edb5 = '', _0x1e46c6 = '';
    if (typeof _0x43c9da === 'number') for (_0x8b57d9 = 0x0; _0x8b57d9 < _0x43c9da; _0x8b57d9 += 0x1) {
      _0x1e46c6 += '\x20';
    } else typeof _0x43c9da === "string" && (_0x1e46c6 = _0x43c9da);
    _0x47603f = _0x36639f;
    if (_0x36639f && typeof _0x36639f !== "function" && (typeof _0x36639f !== "object" || typeof _0x36639f.length !== "number")) throw new Error("JSON.stringify");
    return _0x3fb9ee('', {
      '': _0xf5944
    });
  }), typeof JSON.parse !== "function" && (JSON.parse = function (_0x7a33dc, _0x2a6f39) {
    var _0x5005a1;
    function _0x2f2d1c(_0x3b4356, _0x293ba7) {
      var _0x14b046,
        _0x872bd,
        _0x1d3a38 = _0x3b4356[_0x293ba7];
      if (_0x1d3a38 && typeof _0x1d3a38 === 'object') for (_0x14b046 in _0x1d3a38) {
        Object.prototype.hasOwnProperty.call(_0x1d3a38, _0x14b046) && (_0x872bd = _0x2f2d1c(_0x1d3a38, _0x14b046), _0x872bd !== undefined ? _0x1d3a38[_0x14b046] = _0x872bd : delete _0x1d3a38[_0x14b046]);
      }
      return _0x2a6f39.call(_0x3b4356, _0x293ba7, _0x1d3a38);
    }
    _0x7a33dc = String(_0x7a33dc), _0x40c586.lastIndex = 0x0;
    _0x40c586.test(_0x7a33dc) && (_0x7a33dc = _0x7a33dc.replace(_0x40c586, function (_0x396ba7) {
      return '\x5cu' + ("0000" + _0x396ba7.charCodeAt(0x0).toString(0x10)).slice(-0x4);
    }));
    if (/^[\],:{}\s]*$/.test(_0x7a33dc.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) return _0x5005a1 = eval('(' + _0x7a33dc + ')'), typeof _0x2a6f39 === "function" ? _0x2f2d1c({
      '': _0x5005a1
    }, '') : _0x5005a1;
    throw new SyntaxError("JSON.parse");
  });
})(), function () {
  $(function () {
    window.isIE8 = /MSIE\s8\.0/.test(navigator.userAgent), window.isIE9 = /MSIE\s9\.0/.test(navigator.userAgent), window.isIE10 = /MSIE\s10\.0/.test(navigator.userAgent);
  });
  var _0x5e383f = {
    'debugMode': ![],
    'getQueryString': function (_0x1e1bea) {
      var _0x326c5a = new RegExp("(^|&)" + _0x1e1bea + "=([^&]*)(&|$)", 'i'),
        _0x12dae9 = window.location.search.substr(0x1).match(_0x326c5a);
      if (_0x12dae9 != null) return decodeURI(_0x12dae9[0x2]);
      return null;
    },
    'log': function (_0x2333a6) {
      (this.getQueryString("debugMode") == 0x1 || this.debugMode) && window.console && console.log(_0x2333a6);
    },
    'parseSeconds': function (_0x26f9a2) {
      var _0x426a05 = Math.floor(_0x26f9a2 / 0xe10);
      _0x426a05 < 0xa && (_0x426a05 = '0' + _0x426a05);
      var _0x315cee = _0x26f9a2 % 0xe10 % 0x3c;
      _0x315cee < 0xa && (_0x315cee = '0' + _0x315cee);
      var _0x358b4b = Math.floor(_0x26f9a2 % 0xe10 / 0x3c);
      return _0x358b4b < 0xa && (_0x358b4b = '0' + _0x358b4b), _0x426a05 + ':' + _0x358b4b + ':' + _0x315cee;
    },
    'supportVideo': function () {
      return !!document.createElement('video').canPlayType && !window.isIE9 && !this.isXPandFireFox();
    },
    'hasFlash': function () {
      var _0x29bfa0 = ![];
      try {
        _0x29bfa0 = Boolean(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"));
      } catch (_0x41833b) {
        _0x29bfa0 = "undefined" != typeof navigator.mimeTypes["application/x-shockwave-flash"];
      }
      return _0x29bfa0;
    },
    'isExitsFunction': function (_0x56e948) {
      try {
        if (typeof eval(_0x56e948) == "function") return !![];
      } catch (_0x4f4946) {}
      return ![];
    },
    'clone': function (_0x15f8d6) {
      var _0x2cdca3;
      if (typeof _0x15f8d6 == "object") {
        if (_0x15f8d6 === null) _0x2cdca3 = null;else {
          if (_0x15f8d6 instanceof Array) {
            _0x2cdca3 = [];
            for (var _0x3c3743 = 0x0, _0x4eab28 = _0x15f8d6.length; 0x0 < _0x4eab28; _0x3c3743++) {
              _0x2cdca3.push(this.clone(_0x15f8d6[_0x3c3743]));
            }
          } else {
            _0x2cdca3 = {};
            for (var _0x53b6af in _0x15f8d6) {
              _0x2cdca3[_0x53b6af] = this.clone(_0x15f8d6[_0x53b6af]);
            }
          }
        }
      } else _0x2cdca3 = _0x15f8d6;
      return _0x2cdca3;
    },
    'isXPandFireFox': function () {
      var _0x12b9c7 = navigator.userAgent.toUpperCase().indexOf("FIREFOX") ? !![] : ![],
        _0x2fc713 = navigator.userAgent.indexOf('Windows\x20NT\x205.1') > -0x1 || navigator.userAgent.indexOf('Windows\x20XP') > -0x1;
      return _0x2fc713 && _0x12b9c7;
    }
  };
  window.PlayerUtil = _0x5e383f;
}(), function () {
  'use strict';

  var _0x455d8a = typeof module !== "undefined" && module.exports,
    _0x49b506 = typeof Element !== "undefined" && "ALLOW_KEYBOARD_INPUT" in Element,
    _0x52e549 = function () {
      var _0xc5c847,
        _0x410e02,
        _0x102868 = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", 'webkitExitFullscreen', "webkitFullscreenElement", 'webkitFullscreenEnabled', "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", 'mozCancelFullScreen', "mozFullScreenElement", 'mozFullScreenEnabled', "mozfullscreenchange", "mozfullscreenerror"], ['msRequestFullscreen', "msExitFullscreen", 'msFullscreenElement', "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]],
        _0x50acb2 = _0x102868.length,
        _0x4ba02b = {};
      for (; 0x0 < _0x50acb2; _0x313775++) {
        _0xc5c847 = _0x102868[_0x313775];
        if (_0xc5c847 && _0xc5c847[0x1] in document) {
          for (_0x313775 = 0x0, _0x410e02 = _0xc5c847.length; _0x313775 < _0x410e02; _0x313775++) {
            _0x4ba02b[_0x102868[0x0][_0x313775]] = _0xc5c847[_0x313775];
          }
          return _0x4ba02b;
        }
      }
      return ![];
    }(),
    _0x3699c8 = {
      'request': function (_0x19f275) {
        var _0x26c3a3 = _0x52e549.requestFullscreen;
        _0x19f275 = _0x19f275 || document.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? _0x19f275[_0x26c3a3]() : _0x49b506 ? _0x19f275[_0x26c3a3](Element.ALLOW_KEYBOARD_INPUT) : _0x19f275[_0x26c3a3]({
          'navigationUI': 'auto'
        });
      },
      'exit': function () {
        document[_0x52e549.exitFullscreen]();
      },
      'toggle': function (_0x3a79db) {
        this.isFullscreen ? this.exit() : this.request(_0x3a79db);
      },
      'raw': _0x52e549
    };
  if (!_0x52e549) {
    _0x455d8a ? module.exports = ![] : window.screenfull = ![];
    return;
  }
  Object.defineProperties(_0x3699c8, {
    'isFullscreen': {
      'get': function () {
        return Boolean(document[_0x52e549.fullscreenElement]);
      }
    },
    'element': {
      'enumerable': !![],
      'get': function () {
        return document[_0x52e549.fullscreenElement];
      }
    },
    'enabled': {
      'enumerable': !![],
      'get': function () {
        return Boolean(document[_0x52e549.fullscreenEnabled]);
      }
    }
  }), _0x455d8a ? module.exports = _0x3699c8 : window.screenfull = _0x3699c8;
}(), function (_0xd9dfda) {
  'use strict';

  var _0x1d51ab, _0x481192, _0x43972c, _0x3f5c24, _0x763641;
  function _0x3fd54b() {
    var _0x5f4eb2 = _0xd9dfda.crypto || _0xd9dfda.msCrypto;
    if (!_0x1d51ab && _0x5f4eb2 && _0x5f4eb2.getRandomValues) try {
      var _0x1f839c = new Uint8Array(0x10);
      _0x3f5c24 = _0x1d51ab = function _0x39f43f() {
        return _0x5f4eb2.getRandomValues(_0x1f839c), _0x1f839c;
      }, _0x1d51ab();
    } catch (_0x420b47) {}
    if (!_0x1d51ab) {
      var _0x4dfe8a = new Array(0x10);
      _0x481192 = _0x1d51ab = function () {
        for (var _0x5bf2a8 = 0x0, _0x3a17be; 0x0 < 0x10; _0x5bf2a8++) {
          (_0x5bf2a8 & 0x3) === 0x0 && (_0x3a17be = Math.random() * 0x100000000), _0x4dfe8a[_0x5bf2a8] = _0x3a17be >>> ((_0x5bf2a8 & 0x3) << 0x3) & 0xff;
        }
        return _0x4dfe8a;
      }, "undefined" !== typeof console && console.warn && console.warn('[SECURITY]\x20node-uuid:\x20crypto\x20not\x20usable,\x20falling\x20back\x20to\x20insecure\x20Math.random()');
    }
  }
  function _0x1cf4aa() {
    if ("function" === typeof require) try {
      var _0x2a40e0 = require("crypto").randomBytes;
      _0x43972c = _0x1d51ab = _0x2a40e0 && function () {
        return _0x2a40e0(0x10);
      }, _0x1d51ab();
    } catch (_0x36ae62) {}
  }
  _0xd9dfda ? _0x3fd54b() : _0x1cf4aa();
  var _0x195785 = "function" === typeof Buffer ? Buffer : Array,
    _0x448ac3 = [],
    _0x503af3 = {};
  for (var _0x1941d9 = 0x0; 0x0 < 0x100; _0x1941d9++) {
    _0x448ac3[_0x1941d9] = (_0x1941d9 + 0x100).toString(0x10).substr(0x1), _0x503af3[_0x448ac3[_0x1941d9]] = _0x1941d9;
  }
  function _0x38c6e6(_0x2c0ce6, _0x111dcd, _0x55c33b) {
    var _0x56975a = _0x111dcd && _0x55c33b || 0x0;
    _0x111dcd = _0x111dcd || [], _0x2c0ce6.toLowerCase().replace(/[0-9a-f]{2}/g, function (_0x4e6bf6) {
      0x0 < 0x10 && (_0x111dcd[_0x56975a + _0x9fa9a7++] = _0x503af3[_0x4e6bf6]);
    });
    while (_0x9fa9a7 < 0x10) {
      _0x111dcd[_0x56975a + _0x9fa9a7++] = 0x0;
    }
    return _0x111dcd;
  }
  function _0x8ed356(_0x435b61, _0x31e398) {
    var _0x571099 = _0x31e398 || 0x0,
      _0x25b56c = _0x448ac3;
    return _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + '-' + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + '-' + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + '-' + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + '-' + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]] + _0x25b56c[_0x435b61[_0x571099++]];
  }
  var _0x321681 = _0x1d51ab(),
    _0x3b80b5 = [_0x321681[0x0] | 0x1, _0x321681[0x1], _0x321681[0x2], _0x321681[0x3], _0x321681[0x4], _0x321681[0x5]],
    _0x5144b3 = (_0x321681[0x6] << 0x8 | _0x321681[0x7]) & 0x3fff,
    _0x100974 = 0x0,
    _0x147e6d = 0x0;
  function _0x52f710(_0x564171, _0x40be9b, _0x521d90) {
    var _0x1581c3 = _0x40be9b && _0x521d90 || 0x0,
      _0x51d567 = _0x40be9b || [];
    _0x564171 = _0x564171 || {};
    var _0x4cc641 = _0x564171.clockseq != null ? _0x564171.clockseq : _0x5144b3,
      _0x537198 = _0x564171.msecs != null ? _0x564171.msecs : new Date().getTime(),
      _0x2ca382 = _0x564171.nsecs != null ? _0x564171.nsecs : _0x147e6d + 0x1,
      _0xc16532 = _0x537198 - _0x100974 + (_0x2ca382 - _0x147e6d) / 0x2710;
    _0xc16532 < 0x0 && _0x564171.clockseq == null && (_0x4cc641 = _0x4cc641 + 0x1 & 0x3fff);
    (_0xc16532 < 0x0 || _0x537198 > _0x100974) && _0x564171.nsecs == null && (_0x2ca382 = 0x0);
    if (_0x2ca382 >= 0x2710) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    _0x100974 = _0x537198, _0x147e6d = _0x2ca382, _0x5144b3 = _0x4cc641, _0x537198 += 0xb1d069b5400;
    var _0x42e46b = ((_0x537198 & 0xfffffff) * 0x2710 + _0x2ca382) % 0x100000000;
    _0x51d567[_0x1581c3++] = _0x42e46b >>> 0x18 & 0xff, _0x51d567[_0x1581c3++] = _0x42e46b >>> 0x10 & 0xff, _0x51d567[_0x1581c3++] = _0x42e46b >>> 0x8 & 0xff, _0x51d567[_0x1581c3++] = _0x42e46b & 0xff;
    var _0x4e2a7a = _0x537198 / 0x100000000 * 0x2710 & 0xfffffff;
    _0x51d567[_0x1581c3++] = _0x4e2a7a >>> 0x8 & 0xff, _0x51d567[_0x1581c3++] = _0x4e2a7a & 0xff, _0x51d567[_0x1581c3++] = _0x4e2a7a >>> 0x18 & 0xf | 0x10, _0x51d567[_0x1581c3++] = _0x4e2a7a >>> 0x10 & 0xff, _0x51d567[_0x1581c3++] = _0x4cc641 >>> 0x8 | 0x80, _0x51d567[_0x1581c3++] = _0x4cc641 & 0xff;
    var _0x318b43 = _0x564171.node || _0x3b80b5;
    for (var _0x2198db = 0x0; 0x0 < 0x6; _0x2198db++) {
      _0x51d567[_0x1581c3 + _0x2198db] = _0x318b43[_0x2198db];
    }
    return _0x40be9b ? _0x40be9b : _0x8ed356(_0x51d567);
  }
  function _0x324a7d(_0x1c2e92, _0x98ba46, _0x29ae1d) {
    var _0x546c03 = _0x98ba46 && _0x29ae1d || 0x0;
    typeof _0x1c2e92 === "string" && (_0x98ba46 = _0x1c2e92 === "binary" ? new _0x195785(0x10) : null, _0x1c2e92 = null);
    _0x1c2e92 = _0x1c2e92 || {};
    var _0x8577ee = _0x1c2e92.random || (_0x1c2e92.rng || _0x1d51ab)();
    _0x8577ee[0x6] = _0x8577ee[0x6] & 0xf | 0x40, _0x8577ee[0x8] = _0x8577ee[0x8] & 0x3f | 0x80;
    if (_0x98ba46) for (var _0x23fb40 = 0x0; 0x0 < 0x10; _0x23fb40++) {
      _0x98ba46[_0x546c03 + _0x23fb40] = _0x8577ee[_0x23fb40];
    }
    return _0x98ba46 || _0x8ed356(_0x8577ee);
  }
  var _0x546b8a = _0x324a7d;
  _0x546b8a.v1 = _0x52f710, _0x546b8a.v4 = _0x324a7d, _0x546b8a.parse = _0x38c6e6, _0x546b8a.unparse = _0x8ed356, _0x546b8a.BufferClass = _0x195785, _0x546b8a._rng = _0x1d51ab, _0x546b8a._mathRNG = _0x481192, _0x546b8a._nodeRNG = _0x43972c, _0x546b8a._whatwgRNG = _0x3f5c24;
  if ("undefined" !== typeof module && module.exports) module.exports = _0x546b8a;else typeof define === "function" && define.amd ? define(function () {
    return _0x546b8a;
  }) : (_0x763641 = _0xd9dfda.uuid, _0x546b8a.noConflict = function () {
    return _0xd9dfda.uuid = _0x763641, _0x546b8a;
  }, _0xd9dfda.uuid = _0x546b8a);
}("undefined" !== typeof window ? window : null), function (_0x12896b, _0x121ad2) {
  var _0x2b3e2d = _0x121ad2.documentElement,
    _0x61be96 = _0x121ad2.body,
    _0x204aa5 = function (_0x23fabf, _0x410567, _0x422521) {
      typeof _0x23fabf[_0x410567] === "undefined" && Object.defineProperty(_0x23fabf, _0x410567, {
        'get': _0x422521
      });
    };
  return _0x204aa5(_0x12896b, "innerWidth", function () {
    return _0x2b3e2d.clientWidth;
  }), _0x204aa5(_0x12896b, "innerHeight", function () {
    return _0x2b3e2d.clientHeight;
  }), _0x204aa5(_0x12896b, "scrollX", function () {
    return _0x12896b.pageXOffset || _0x2b3e2d.scrollLeft;
  }), _0x204aa5(_0x12896b, "scrollY", function () {
    return _0x12896b.pageYOffset || _0x2b3e2d.scrollTop;
  }), _0x204aa5(_0x121ad2, 'width', function () {
    return Math.max(_0x61be96.scrollWidth, _0x2b3e2d.scrollWidth, _0x61be96.offsetWidth, _0x2b3e2d.offsetWidth, _0x61be96.clientWidth, _0x2b3e2d.clientWidth);
  }), _0x204aa5(_0x121ad2, "height", function () {
    return Math.max(_0x61be96.scrollHeight, _0x2b3e2d.scrollHeight, _0x61be96.offsetHeight, _0x2b3e2d.offsetHeight, _0x61be96.clientHeight, _0x2b3e2d.clientHeight);
  }), _0x204aa5;
}(window, document), function (_0x5da0d0) {
  var _0xe94523 = function (_0x266c52) {
    _0x52127c(_0x266c52), _0x5e8cec(_0x266c52);
  };
  window.vjsComponent = _0xe94523;
  var _0x52127c = function (_0x1c015e) {
      var _0x353bad = $('#' + _0x1c015e.id);
      _0x353bad.on("contextmenu", function () {
        return ![];
      });
    },
    _0x5e8cec = function (_0x372453) {
      var _0x53e635 = $('#' + _0x372453.id).children(),
        _0x57eb47 = '';
      _0x372453.options.videoTitleTxt != null && _0x372453.options.videoTitleTxt != '' && _0x372453.options.videoTitleTxt != undefined && (_0x57eb47 = _0x372453.options.videoTitleTxt);
      ;
      var _0x9fd165 = $('<div\x20class=\x22videoArea\x22\x20style=\x22width:\x20100%;height:\x20100%;z-index:1;position:\x20absolute\x22\x20></div>'),
        _0x3ea914 = $("<div class=\"videoTitle\" style=\"display:none;\">" + _0x57eb47 + "</div>"),
        _0x280a12 = $('<div\x20class=\x22controlsBar\x22\x20style=\x22z-index:\x202;overflow:\x20inherit;\x22></div>');
      _0x53e635.append(_0x9fd165), _0x53e635.append(_0x3ea914), _0x53e635.append(_0x280a12), _0x372453.$video = _0x53e635, _0x372453.$videoArea = _0x9fd165, _0x372453.$ableControlBar = _0x280a12, _0x372453.$videoTitle = _0x3ea914, _0x372453.options.mp3Mode && _0x9fd165.css('backgroundColor', "#000"), _0x4f0120(_0x372453), _0x7180c(_0x372453), _0x5e29db(_0x372453), _0x4c765d(_0x372453), _0x3f69d7(_0x372453), _0x38ac77(_0x372453), _0x321f0d(_0x372453), _0x5e6e92(_0x372453), _0x413e0a(_0x372453), _0x199e9f(_0x372453), _0x601ef(_0x372453), _0x54420b(_0x372453), _0x4bdc6a(_0x372453), !_0x372453.options.mp3Mode && _0x372453.options.src.indexOf('.mp3') != -0x1 && _0x53e635.append("<div class='mp3BackGroundImage'><img src=\"//image.zhihuishu.com/zhs/ablecommons/demo/201905/b3c2408e1a90407d9694565e22fa9900.png\" style=\"width: 100%;height: auto;max-width: 100%;display:block;position: absolute;left:0;top:50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-ms-transform: translateY(-50%);\"></div>");
    },
    _0x4f0120 = function (_0x617130) {
      var _0x528e9d = "<div class=\"progress\">";
      _0x528e9d += '<div\x20class=\x22progressBar\x22>', _0x528e9d += "<div class=\"progressBall\">", _0x528e9d += "<div class=\"progressNumber\">00:00</div>", _0x528e9d += '</div>', _0x528e9d += "<div class=\"passTime\"></div>", _0x528e9d += "</div>", _0x528e9d += "</div>", _0x617130.$ableControlBar.append(_0x528e9d);
      var _0x235b63 = _0x617130.id,
        _0x13fe1b = _0x617130.player,
        _0x3028eb = $('#' + _0x235b63 + " .progress"),
        _0xda6210 = $('#' + _0x235b63 + " .progressBar"),
        _0x4a8524 = $('#' + _0x235b63 + " .progressBall"),
        _0x13ac1d = $('#' + _0x235b63 + " .progressNumber"),
        _0x2f7761 = $('#' + _0x235b63 + " .passTime"),
        _0x17134b = $('#' + _0x235b63 + '\x20#playButton'),
        _0x307434 = $('#' + _0x235b63 + '\x20.bigPlayButton'),
        _0x149377;
      _0x13fe1b.on("timeupdate", function (_0x267b02) {
        if (!_0x13ac1d.is(":visible")) {
          var _0x541a73 = parseInt(_0x13fe1b.duration()),
            _0x38736c = parseInt(_0x13fe1b.currentTime()),
            _0xa45e79 = _0x38736c / _0x541a73 * 0x64;
          _0x149377 = $('#' + _0x617130.id).width();
          var _0x5a90a2 = _0x38736c / _0x541a73 * (_0x149377 - _0x4a8524.width());
          _0x4a8524.css("left", _0x5a90a2 + 'px'), _0x2f7761.css("width", _0xa45e79 + '%');
        }
      }), _0x3028eb.on('mousedown', function (_0x30ec0a) {
        var _0x39d1f6 = _0x30ec0a.pageX - _0xda6210.offset().left - parseInt(_0x4a8524.css("width")) / 0x2,
          _0x19f9df = parseInt(_0xda6210.css("width")) - parseInt(_0x4a8524.css('width')),
          _0x543614 = _0x13fe1b.currentTime();
        _0x617130.options.progressOldTime = _0x543614;
        var _0x11daae = _0x39d1f6 / _0x19f9df * _0x13fe1b.duration();
        _0x13fe1b.currentTime(_0x11daae), _0x13ac1d.html(PlayerUtil.parseSeconds(Math.round(_0x11daae))), _0x13ac1d.show(), _0x17134b.attr("class", 'pauseButton'), _0x307434.hide();
        var _0x3aef24 = _0x13fe1b.playbackRate();
        _0x13fe1b.play(), _0x13fe1b.playbackRate(_0x3aef24);
        if (_0x39d1f6 <= 0x0) _0x4a8524.css("left", "0px");else _0x39d1f6 > _0x19f9df ? (_0x4a8524.css('left', _0x19f9df + 'px'), _0x2f7761.css("width", _0xda6210.css("width"))) : (_0x4a8524.css("left", _0x39d1f6 + 'px'), _0x2f7761.css("width", _0x39d1f6));
      }), _0x3028eb.on("mouseup", function (_0x4c20c3) {
        var _0x4653c0 = _0x4c20c3.pageX - _0xda6210.offset().left - parseInt(_0x4a8524.css("width")) / 0x2,
          _0x56eb01 = parseInt(_0xda6210.css("width")) - parseInt(_0x4a8524.css('width')),
          _0x59900d = _0x4653c0 / _0x56eb01 * _0x13fe1b.duration();
        MonitorUtil.saveAction(_0x617130, "drag", _0x617130.options.progressOldTime, _0x59900d), _0x13ac1d.hide();
      }), _0x4a8524.on("mousedown", function () {
        var _0x565574 = _0x13fe1b.currentTime();
        _0x617130.options.progressOldTime = _0x565574, $(document).on("mousemove.progressBar", function (_0x18ae13) {
          var _0x4aff76 = _0x18ae13.pageX - _0xda6210.offset().left - parseInt(_0x4a8524.css('width')) / 0x2,
            _0x587082 = parseInt(_0xda6210.css("width")) - parseInt(_0x4a8524.css('width'));
          _0x13ac1d.show();
          if (_0x4aff76 <= 0x0) _0x4a8524.css('left', "0px");else {
            if (_0x4aff76 > _0x587082) _0x4a8524.css("left", _0x587082 + 'px'), _0x2f7761.css('width', _0xda6210.css("width"));else {
              var _0x21db73 = PlayerUtil.parseSeconds(Math.round(_0x4aff76 / _0x587082 * _0x13fe1b.duration()));
              _0x13ac1d.html(_0x21db73), _0x4a8524.css("left", _0x4aff76 + 'px'), _0x2f7761.css('width', _0x4aff76);
            }
          }
        }), $(document).on("mouseup.progressBar", function (_0x160b2f) {
          var _0x54e74a = _0x160b2f.pageX - _0xda6210.offset().left - parseInt(_0x4a8524.css('width')) / 0x2,
            _0x5c9673 = parseInt(_0xda6210.css("width")) - parseInt(_0x4a8524.css("width"));
          _0x13fe1b.currentTime(_0x54e74a / _0x5c9673 * _0x13fe1b.duration()), _0x13ac1d.hide(), $(document).off(".progressBar");
        });
      });
    },
    _0x7180c = function (_0x524fb3) {
      var _0x29ad63 = '<div\x20id=\x22playButton\x22\x20class=\x22playButton\x20pointer\x22>';
      _0x29ad63 += '<div\x20class=\x22bigPlayButton\x20pointer\x22></div>', _0x29ad63 += "</div>", _0x524fb3.$ableControlBar.append(_0x29ad63);
      var _0x1197eb = _0x524fb3.id,
        _0x336e5a = _0x524fb3.player,
        _0x9868b = _0x524fb3.options,
        _0x8ec82b = $('#' + _0x1197eb + " #playButton"),
        _0x4a0087 = $('#' + _0x1197eb + " .bigPlayButton");
      _0x9868b.autostart ? (_0x8ec82b.attr("class", 'pauseButton'), _0x4a0087.hide()) : (_0x8ec82b.attr("class", "playButton"), _0x9868b.control.bigPlayerBtn ? _0x4a0087.show() : _0x4a0087.hide()), _0x8ec82b.on("click", function () {
        if (_0x336e5a.paused()) {
          _0x8ec82b.attr("class", "pauseButton"), _0x4a0087.hide();
          var _0x23e2e1 = _0x336e5a.playbackRate();
          _0x336e5a.play(), _0x336e5a.playbackRate(_0x23e2e1), MonitorUtil.saveAction(_0x524fb3, "play");
        } else _0x8ec82b.attr("class", "playButton"), _0x9868b.control.bigPlayerBtn && _0x4a0087.show(), _0x336e5a.pause(), MonitorUtil.saveAction(_0x524fb3, 'pause');
      });
    },
    _0x5e29db = function (_0x5a3dcb) {
      var _0x1b7326 = "<div id=\"nextBtn\" class=\"nextButton\">";
      _0x1b7326 += '</div>', _0x5a3dcb.$ableControlBar.append(_0x1b7326);
      var _0x332724 = _0x5a3dcb.id;
      !_0x5a3dcb.options.control.nextBtn && $('#' + _0x332724 + '\x20#nextBtn').hide();
      var _0x576c43 = $('#' + _0x332724 + " #nextBtn");
      _0x576c43.on("click", function () {
        typeof _0x5a3dcb.callback != "undefined" && PlayerUtil.isExitsFunction(_0x5a3dcb.callback.playerNext) && (PlayerUtil.log("next video"), _0x5a3dcb.options.isFullscreen != 0x0 && PlayerStarter.exitFullPlay(), _0x5a3dcb.callback.playerNext());
      });
    },
    _0x4c765d = function (_0x16ed83) {
      var _0x509521 = "<div class=\"nPlayTime 33322\">";
      _0x509521 += "<span class=\"currentTime\">00:00:00</span>/<span class=\"duration\">00:00:00</span>", _0x509521 += '</div>', _0x16ed83.$ableControlBar.append(_0x509521);
      var _0x2725f1 = _0x16ed83.player,
        _0x2f7da7 = _0x16ed83.id;
      _0x2725f1.on("loadeddata", function () {
        var _0x5c5bb9 = parseInt(_0x2725f1.duration());
        _0x5c5bb9 = PlayerUtil.parseSeconds(_0x5c5bb9), $('#' + _0x2f7da7 + " .duration").html(_0x5c5bb9);
      }), _0x2725f1.on("timeupdate", function () {
        var _0x1edad0 = parseInt(_0x2725f1.currentTime());
        _0x1edad0 = PlayerUtil.parseSeconds(_0x1edad0), $('#' + _0x2f7da7 + " .currentTime").html(_0x1edad0);
      });
    },
    _0x413e0a = function (_0x538efa) {
      if (!PlayerUtil.supportVideo()) return;
      var _0xce7495 = "<div class=\"speedBox\"><span>X 1.0</span>",
        _0x5b7c11 = _0x538efa.options.isIncreaseRate;
      if (_0x5b7c11) _0xce7495 += "<div class=\"speedList\">", _0xce7495 += "<div class=\"speedTab speedTab30\" rate=\"3.0\" >X 3.0</div>", _0xce7495 += "<div class=\"speedTab speedTab25\" rate=\"2.5\" >X 2.5</div>", _0xce7495 += "<div class=\"speedTab speedTab20\" rate=\"2.0\" >X 2.0</div>", _0xce7495 += "<div class=\"speedTab speedTab15\" rate=\"1.5\" >X 1.5</div>", _0xce7495 += "<div class=\"speedTab speedTab10\" rate=\"1.25\" >X 1.25</div>", _0xce7495 += "<div class=\"speedTab speedTab05\" rate=\"1.0\" >X 1.0</div>";else {
        _0xce7495 += "<div class=\"speedList\">";
        var _0x5b7c11 = _0x538efa.options.isIncreaseRate;
        _0xce7495 += "<div class=\"speedTab speedTab15\" rate=\"1.5\" >X 1.5</div>", _0xce7495 += "<div class=\"speedTab speedTab10\" rate=\"1.25\" >X 1.25</div>", _0xce7495 += "<div class=\"speedTab speedTab05\" rate=\"1.0\" >X 1.0</div>";
      }
      _0xce7495 += "</div>", _0xce7495 += "</div>", _0xce7495 += '</div>', _0x538efa.$ableControlBar.append(_0xce7495);
      var _0x51f01e = _0x538efa.id,
        _0x6fcdd3 = _0x538efa.player,
        _0x1d7cc3 = _0x538efa.options,
        _0x2c5c83 = $('#' + _0x51f01e + " .speedList"),
        _0x1a91ae = $('#' + _0x51f01e + " .speedBox");
      !_0x1d7cc3.control.rateBtn && _0x1a91ae.hide(), _0x2c5c83.children().each(function (_0x4fd93b, _0x2f7673) {
        var _0x2ef4b5 = $(_0x2f7673);
        _0x2ef4b5.on('click', function () {
          var _0x405001 = _0x2ef4b5.attr("rate");
          _0x6fcdd3.playbackRate(_0x405001), _0x1d7cc3.rate = _0x6fcdd3.playbackRate();
          typeof _0x538efa.callback != "undefined" && PlayerUtil.isExitsFunction(_0x538efa.callback.playbackRate) && _0x538efa.callback.playbackRate(_0x6fcdd3.playbackRate());
          var _0xe2fed3 = _0x2ef4b5.text();
          _0x1a91ae.find('span').text(_0xe2fed3), MonitorUtil.saveAction(_0x538efa, 'changeRate');
        });
      }), _0x1d7cc3.rate != null && (setTimeout(function () {
        _0x6fcdd3.playbackRate(_0x1d7cc3.rate);
      }, 0x64), _0x2c5c83.children().each(function (_0x4bcaed, _0x4d58f9) {
        var _0x330344 = $(_0x4d58f9),
          _0x16783c = _0x330344.attr("rate");
        if (_0x1d7cc3.rate == _0x16783c) {
          var _0x248e2b = _0x330344.text();
          _0x1a91ae.find("span").text(_0x248e2b);
        }
      }));
    },
    _0x3f69d7 = function (_0x3a195f) {
      _0x3a195f.$ableControlBar.append('<div\x20class=\x22fullScreen\x20111\x22></div>');
      var _0x45b545 = _0x3a195f.id,
        _0xb1f695 = _0x3a195f.options,
        _0x61002d = $('#' + _0x45b545 + '\x20.fullScreen');
      !_0xb1f695.control.fullBtn && _0x61002d.hide(), _0xb1f695.isFullscreen == undefined && (_0xb1f695.isFullscreen = 0x0), $videoTitle = _0x3a195f.$videoTitle, _0x61002d.on('click', function () {
        _0xb1f695.isFullscreen == 0x0 ? (MonitorUtil.saveAction(_0x3a195f, "full"), PlayerStarter.requestFullPlay(_0x3a195f)) : ($videoTitle.hide(), PlayerStarter.exitFullPlay());
        var _0x5b858f;
        window.isIE8 || window.isIE9 ? _0x5b858f = {
          'backgroundOpacity': "0.5",
          'textOpacity': '1',
          'edgeStyle': 'dropshadow',
          'color': "#FFF",
          'backgroundColor': "#000",
          'fontPercent': 0x1
        } : _0x5b858f = {
          'backgroundOpacity': '0',
          'textOpacity': '1',
          'windowOpacity': '0',
          'edgeStyle': "dropshadow",
          'color': "#FFF"
        }, _0x3a195f.player.textTrackSettings.setValues(_0x5b858f);
      });
    },
    _0x38ac77 = function (_0x4543b7) {
      _0x4543b7.$ableControlBar.append('<div\x20class=\x22customFullScreen\x22></div>'), console.log('objssss', _0x4543b7);
      var _0x2072a9 = _0x4543b7.id,
        _0x33a18e = _0x4543b7.options,
        _0x201fa9 = $('#' + _0x2072a9 + '\x20.customFullScreen');
      !_0x33a18e.control.customFullScreen && _0x201fa9.hide(), console.log("点击全屏===：", _0x201fa9), _0x201fa9.on("click", function () {
        console.log("点击全屏11：", _0x4543b7.callback), typeof _0x4543b7.callback != "undefined" && (_0x4543b7.options.isCustomFullScreen = _0x4543b7.options.isCustomFullScreen == 0x0 ? 0x1 : 0x0, _0x4543b7.options.isCustomFullScreen != 0x0 ? PlayerStarter.requestCustomFullPlay(_0x4543b7) : ($videoTitle.hide(), PlayerStarter.exitCustomFullPlay()));
      });
    },
    _0x321f0d = function (_0x321f81) {
      var _0x1d687d = "<div class=\"volumeBox\">";
      _0x1d687d += "<div class=\"volumeIcon\"></div>", _0x1d687d += "<div class=\"volumeBarWrap\">", _0x1d687d += "<div class=\"volumeBarWrapBg\">", _0x1d687d += "<div class=\"volumeBar\">", _0x1d687d += "<div class=\"volumeBall\">", _0x1d687d += "<div class=\"volumeNumber\">0%</div>", _0x1d687d += '</div>', _0x1d687d += "<div class=\"passVolume\"></div>", _0x1d687d += "</div>", _0x1d687d += "</div>", _0x1d687d += "</div>", _0x1d687d += "</div>", _0x321f81.$ableControlBar.append(_0x1d687d);
      var _0x29d68f = _0x321f81.options;
      !_0x29d68f.control.volumeBtn && $('#' + _0x321f81.id + " .volumeBox").hide(), _0x23185e(_0x321f81), _0x5d25e7(_0x321f81), _0x1a885d(_0x321f81), _0x22e2b6(_0x321f81);
    },
    _0x23185e = function (_0x41228e) {
      var _0x59e378 = _0x41228e.id,
        _0x2d7a0f = _0x41228e.player,
        _0x5bc741 = $('#' + _0x59e378 + " .volumeBall"),
        _0x494e2e = $('#' + _0x59e378 + '\x20.volumeBar'),
        _0x2cee93 = parseInt(_0x494e2e.css("height")) - parseInt(_0x5bc741.css('height')),
        _0x59c3f4 = 0.5,
        _0x1c3f42;
      if (_0x41228e.options.volume == undefined || _0x41228e.options.volume == "undefined") _0x2d7a0f.volume(_0x59c3f4), _0x1c3f42 = _0x59c3f4;else {
        _0x2d7a0f.volume(_0x41228e.options.volume), _0x1c3f42 = _0x41228e.options.volume;
        if (_0x41228e.options.volume == 0x0) {
          var _0x260465 = $('#' + _0x59e378 + '\x20.volumeBox');
          _0x260465.toggleClass("volumeNone");
        }
      }
      _0x5bc741.css("bottom", _0x2cee93 * _0x1c3f42 + 'px'), $('#' + _0x59e378 + " .passVolume").css('height', _0x2cee93 * _0x1c3f42);
    },
    _0x5d25e7 = function (_0x66c7ea) {
      var _0xff5762 = _0x66c7ea.id,
        _0x4b312b = _0x66c7ea.player,
        _0x2f51f4 = $('#' + _0xff5762 + '\x20.volumeBall'),
        _0xacc2c1 = $('#' + _0xff5762 + " .volumeBar"),
        _0x136579 = $('#' + _0xff5762 + '\x20.volumeBox'),
        _0x213d28 = $('#' + _0xff5762 + '\x20.passVolume'),
        _0x484ff9 = $('#' + _0xff5762 + '\x20.volumeIcon'),
        _0x51d3b9 = parseInt(_0xacc2c1.css("height")) - parseInt(_0x2f51f4.css("height")),
        _0x25df47 = 0x0,
        _0x1d07d3 = 0x0;
      _0x484ff9.on("click", function () {
        _0x136579.toggleClass("volumeNone"), _0x1d07d3 = _0x4b312b.volume(), _0x1d07d3 == 0x0 ? (_0x4b312b.volume(_0x25df47), _0x2f51f4.css("bottom", _0x25df47 * _0x51d3b9 + 'px'), _0x213d28.css("height", _0x25df47 * _0x51d3b9)) : (_0x25df47 = _0x1d07d3, _0x4b312b.volume(0x0), _0x2f51f4.css('bottom', "0px"), _0x213d28.css("height", "0px"));
      });
    },
    _0x22e2b6 = function (_0x1299f8) {
      var _0x5b39fc = _0x1299f8.id,
        _0x132fae = _0x1299f8.player,
        _0x579078 = $('#' + _0x5b39fc + " .volumeBall"),
        _0x157f35 = $('#' + _0x5b39fc + " .volumeNumber"),
        _0x1be609 = $('#' + _0x5b39fc + " .volumeBar"),
        _0x12002e = $('#' + _0x5b39fc + " .volumeBox"),
        _0x4502b1 = $('#' + _0x5b39fc + " .passVolume");
      _0x1be609.on("mousedown", function (_0x1d436d) {
        _0x157f35.show();
        var _0x4dab0a = parseInt(_0x1be609.css("height")) - (_0x1d436d.pageY - _0x1be609.offset().top) - parseInt(_0x579078.css("height")) / 0x2,
          _0xb92cb8 = parseInt(_0x1be609.css("height")) - parseInt(_0x579078.css("height")),
          _0x4dffc2 = _0x4dab0a / _0xb92cb8;
        _0x132fae.volume(_0x4dffc2);
        if (_0x4dab0a <= 0x0) _0x579078.css('bottom', '0px'), _0x157f35.html('0%'), _0x12002e.addClass("volumeNone");else _0x4dab0a > _0xb92cb8 ? (_0x579078.css("bottom", _0x1be609.css("height") + 'px'), _0x4502b1.css("height", _0x1be609.css('height')), _0x157f35.html("100%"), _0x12002e.removeClass("volumeNone")) : (_0x579078.css('bottom', _0x4dab0a + 'px'), _0x4502b1.css("height", _0x4dab0a), _0x157f35.html(Math.round(_0x4dffc2 * 0x64) + '%'), _0x12002e.removeClass("volumeNone"));
      }), _0x1be609.on("mouseup", function (_0x28eed8) {
        _0x157f35.hide();
      });
    },
    _0x1a885d = function (_0x510cd7) {
      var _0x17faaa = _0x510cd7.id,
        _0x1c32a0 = _0x510cd7.player,
        _0x1add66 = $('#' + _0x17faaa + " .volumeBall"),
        _0x5093f5 = $('#' + _0x17faaa + " .volumeNumber"),
        _0x571f96 = $('#' + _0x17faaa + " .volumeBar"),
        _0x33c7d8 = $('#' + _0x17faaa + " .volumeBox"),
        _0x3eef8d = $('#' + _0x17faaa + " .passVolume");
      _0x1add66.on("mousedown", function () {
        $(document).on("mousemove.volumeBar", function (_0x260612) {
          _0x5093f5.show();
          var _0x4fcf04 = parseInt(_0x571f96.css("height")) - (_0x260612.pageY - _0x571f96.offset().top) - parseInt(_0x1add66.css("width")) / 0x2,
            _0x598476 = parseInt(_0x571f96.css('height')) - parseInt(_0x1add66.css("height")),
            _0x3f6c6a = _0x4fcf04 / _0x598476;
          _0x1c32a0.volume(_0x3f6c6a);
          if (_0x4fcf04 <= 0x0) _0x1add66.css("bottom", "0px"), _0x5093f5.html('0%'), _0x33c7d8.addClass("volumeNone");else _0x4fcf04 > _0x598476 ? (_0x1add66.css("bottom", _0x571f96.css('height') + 'px'), _0x3eef8d.css("height", _0x571f96.css('height')), _0x5093f5.html("100%"), _0x33c7d8.removeClass('volumeNone')) : (_0x1add66.css("bottom", _0x4fcf04 + 'px'), _0x3eef8d.css("height", _0x4fcf04), _0x5093f5.html(Math.round(_0x3f6c6a * 0x64) + '%'), _0x33c7d8.removeClass("volumeNone"));
        }), $(document).on('mouseup.volumeBar', function () {
          _0x5093f5.hide(), $(document).off('.volumeBar');
        });
      });
    },
    _0x5e6e92 = function (_0x122dbe) {
      var _0x532431 = "<div class=\"definiBox\"><span>校内</span>";
      _0x532431 += "<div class=\"definiLines\">", _0x532431 += "<b class=\"line1bq switchLine\">流畅</b><b class=\"line1gq switchLine\">高清</b>", _0x532431 += '</div></div>', _0x122dbe.$ableControlBar.append(_0x532431), $(".definiLines").hide();
      if (_0x122dbe.options.hasSchool) $('#' + _0x122dbe.id + " .definiLines").append("<b class=\"xiaonei switchLine\">校内</b>");else {}
      $('.definiBox').hover(function () {
        $(this).find('.definiLines').show();
      }, function () {
        $(this).find('.definiLines').hide();
      });
      !_0x122dbe.options.control.definiBtn && $('#' + _0x122dbe.id + " .definiBox").hide();
      var _0x1e1fb8 = _0x122dbe.id,
        _0xfd0cab = _0x122dbe.player,
        _0x160da9 = _0x122dbe.options,
        _0x369380 = $('#' + _0x1e1fb8 + " .line1bq"),
        _0x482585 = $('#' + _0x1e1fb8 + " .line1gq"),
        _0x37ef50 = $('#' + _0x1e1fb8 + '\x20.xiaonei');
      $('#' + _0x1e1fb8 + '\x20b').removeClass("active"), $('#' + _0x1e1fb8 + '\x20.' + ["line1gq", "line1bq", "xiaonei"][_0x122dbe.options.chooseLine]).addClass("active"), $definiBox = $('#' + _0x122dbe.id + '\x20.definiBox');
      var _0x8621e3 = $definiBox.css("background-image");
      _0x8621e3 = _0x8621e3.substring(0x0, _0x8621e3.lastIndexOf('/') + 0x1), _0x122dbe.options.chooseLine == 0x0 && $definiBox.find("span").text('高清'), _0x122dbe.options.chooseLine == 0x1 && $definiBox.find("span").text('流畅'), _0x122dbe.options.chooseLine == 0x2 && $definiBox.find("span").text('校内'), _0x369380.on('click', function () {
        _0x160da9.defini = "line1bq", _0x160da9.volume = _0xfd0cab.volume(), _0x160da9.vjsPaused = _0xfd0cab.paused(), _0xfd0cab.dispose();
        for (var _0x43f7f7 = 0x0; 0x0 < _0x122dbe.options.sourceSrc.lines.length; _0x43f7f7++) {
          _0x122dbe.options.sourceSrc.lines[_0x43f7f7].lineName == '流畅' && (_0x122dbe.options.lineID = _0x122dbe.options.sourceSrc.lines[_0x43f7f7].lineID);
        }
        MonitorUtil.saveAction(_0x122dbe, 'changeLine'), _0x3ff88d(_0x122dbe);
      }), _0x482585.on("click", function () {
        _0x160da9.defini = 'line1gq', _0x160da9.volume = _0xfd0cab.volume(), _0x160da9.vjsPaused = _0xfd0cab.paused(), _0xfd0cab.dispose();
        for (var _0x2a67db = 0x0; 0x0 < _0x122dbe.options.sourceSrc.lines.length; _0x2a67db++) {
          _0x122dbe.options.sourceSrc.lines[_0x2a67db].lineName == '标准' && (_0x122dbe.options.lineID = _0x122dbe.options.sourceSrc.lines[_0x2a67db].lineID);
        }
        MonitorUtil.saveAction(_0x122dbe, "changeLine"), _0x3ff88d(_0x122dbe);
      }), _0x37ef50.on("click", function () {
        _0x160da9.defini = "xiaonei", _0x160da9.volume = _0xfd0cab.volume(), _0x160da9.vjsPaused = _0xfd0cab.paused(), _0xfd0cab.dispose();
        for (var _0x184adc = 0x0; 0x0 < _0x122dbe.options.sourceSrc.lines.length; _0x184adc++) {
          _0x122dbe.options.sourceSrc.lines[_0x184adc].lineName == '校内' && (_0x122dbe.options.lineID = _0x122dbe.options.sourceSrc.lines[_0x184adc].lineID);
        }
        MonitorUtil.saveAction(_0x122dbe, "changeLine"), _0x3ff88d(_0x122dbe);
      });
    },
    _0x3ff88d = function (_0x4fb2dd) {
      console.log(_0x4fb2dd, "chosen"), _0x4fb2dd.options.videotype = 0x1, $.ajax({
        'url': '//newbase.zhihuishu.com/video/changeVideoLine',
        'data': {
          'videoID': _0x4fb2dd.options.id,
          'lineID': _0x4fb2dd.options.lineID,
          'uuid': _0x4fb2dd.options.sourceSrc.uuid
        },
        'dataType': "jsonp",
        'async': ![],
        'jsonp': "jsonpCallBack",
        'jsonpCallback': "result",
        'success': function (_0x5ddb35) {
          var _0x3e39a6 = _0x4fb2dd.id,
            _0xcb0f0a = $('#' + _0x3e39a6);
          _0x4fb2dd.options.src = _0x5ddb35.result;
          for (var _0x4e77d4 = 0x0; 0x0 < _0x4fb2dd.options.sourceSrc.lines.length; _0x4e77d4++) {
            _0x4fb2dd.options.sourceSrc.lines[_0x4e77d4].lineID == _0x4fb2dd.options.lineID && (_0x4fb2dd.options.chooseLine = _0x4e77d4);
          }
          PlayerUtil.log("切换请求视频源" + _0x4fb2dd.options.src), _0xcb0f0a.videojsPlayer(_0x4fb2dd);
        },
        'error': function (_0x1befcc) {
          PlayerUtil.log("err");
        }
      });
    },
    _0x199e9f = function (_0x41b132) {
      var _0x29bc77 = '<div\x20class=\x22commonBox\x22>';
      _0x29bc77 += "<span>中文</span>", _0x29bc77 += "<div class=\"trackList\">", _0x29bc77 += '</div>', _0x29bc77 += '</div>', _0x41b132.$ableControlBar.append(_0x29bc77), (!_0x41b132.options.control.trackBtn || _0x41b132.options.track == null || _0x41b132.options.track.length == 0x1) && $('#' + _0x41b132.id + " .commonBox").hide(), _0x3e076b(_0x41b132), _0x1b48ab(_0x41b132);
    },
    _0x3e076b = function (_0x9c5431) {
      var _0x53ef2a = _0x9c5431.id,
        _0x120e73 = _0x9c5431.options,
        _0x2f0a71 = _0x9c5431.player,
        _0x4f7688 = $('#' + _0x53ef2a + '\x20.commonBox'),
        _0x563604 = $('#' + _0x53ef2a + " .trackList");
      if (_0x120e73.track == null || _0x120e73.track.length < 0x1) _0x4f7688.hide(), _0x120e73.control.trackBtn = ![];else {
        if (_0x120e73.track.length == 0x1) {
          if (_0x120e73.track[0x0].language == 0x1) {
            var _0x4ec8c1 = _0x4f7688.css("background-image");
            _0x4ec8c1 = _0x4ec8c1.substring(0x0, _0x4ec8c1.lastIndexOf('/') + 0x1), _0x4f7688.css("background-image", _0x4ec8c1 + "en.png");
          }
          ;
        }
        _0x120e73.track.length > 0x1 && _0x563604.append("<div class=\"speedTaben\" language=\"double\">中英文</div>"), $(_0x120e73.track).each(function (_0x11ad35, _0x3f1c3f) {
          var _0x1f4e1a = _0x120e73.track[_0x11ad35].language,
            _0x574fb3;
          _0x1f4e1a == '0' && (_0x1f4e1a = 'zh', _0x574fb3 = '中文');
          _0x1f4e1a == '1' && (_0x1f4e1a = 'en', _0x574fb3 = '英文');
          if (_0x1f4e1a == '2') return !![];
          _0x563604.append("<div class=\"speedTab" + _0x1f4e1a + "\" language=\"" + _0x1f4e1a + '\x22>' + _0x574fb3 + "</div>");
          var _0x1a3781 = {
            'kind': "subtitles",
            'lable': _0x574fb3,
            'language': _0x1f4e1a,
            'srclang': _0x1f4e1a,
            'src': _0x120e73.track[_0x11ad35].src
          };
          _0x2f0a71.addRemoteTextTrack(_0x1a3781);
        });
      }
    },
    _0x5e2f9c = function (_0x584449) {
      var _0x49c6cb = _0x584449.player,
        _0x118a1d = _0x49c6cb.textTracks();
      for (let _0x29ce19 = 0x0; 0x0 < _0x118a1d.length; _0x29ce19++) {
        _0x118a1d[_0x29ce19].language == 'en' && (_0x118a1d[_0x29ce19].mode = "showing", setTimeout(() => {
          _0x118a1d[_0x29ce19].mode = "hidden";
        })), _0xa25d4d(_0x584449, _0x118a1d[_0x29ce19]), _0x118a1d[_0x29ce19].oncuechange = function () {
          _0xa25d4d(_0x584449, _0x118a1d[_0x29ce19]);
        };
      }
    },
    _0xa25d4d = function (_0x107261, _0x445cd2) {
      var _0x3647c9 = document.querySelector('#vjs_' + _0x107261.id + " .zh-subtitles"),
        _0x2f8cf0 = document.querySelector("#vjs_" + _0x107261.id + '\x20.en-subtitles');
      setSubtitleStyleAfterResize(_0x107261);
      if (!_0x445cd2) return;
      for (var _0x3d441f = 0x0; 0x0 < _0x445cd2.activeCues.length; _0x3d441f++) {
        var _0x42d2e7 = _0x445cd2.activeCues[_0x3d441f];
        _0x445cd2.language == 'zh' ? _0x3647c9.innerText = _0x42d2e7.text : _0x2f8cf0.innerText = _0x42d2e7.text;
      }
    },
    _0x619eab = function (_0xaf8748) {
      var _0x5e944a = document.querySelector("#vjs_" + _0xaf8748.id + " .zh-subtitles"),
        _0x128192 = document.querySelector('#vjs_' + _0xaf8748.id + '\x20.en-subtitles'),
        _0x16a84c = _0xaf8748.player,
        _0x2b8f6e = _0x16a84c.textTracks();
      for (var _0x429f01 = 0x0; 0x0 < _0x2b8f6e.length; _0x429f01++) {
        _0x2b8f6e[_0x429f01].oncuechange = null;
      }
      _0x5e944a.innerText = '', _0x128192.innerText = '';
    },
    _0x23dccf = function (_0x240752) {
      var _0x40a155 = $("#vjs_" + _0x240752.id),
        _0x7c2d39 = $('#vjs_' + _0x240752.id + " .vjs-double-subtitles");
      if (_0x7c2d39.length < 0x1) {
        var _0x5ceb2c = document.createElement('div');
        _0x5ceb2c.innerHTML = "<div class=\"double-subtitles-box\">\n                                  <div class=\"zh-subtitles subtitles-item\" data-lang=\"zh\"></div>\n                                  <div class=\"en-subtitles subtitles-item\" data-lang=\"en\"></div>\n                               </div>", _0x5ceb2c.setAttribute("class", "vjs-double-subtitles"), _0x40a155.append(_0x5ceb2c);
      }
    },
    _0x1b48ab = function (_0x46c739) {
      _0x23dccf(_0x46c739), _0x46c739.player.on('ended', function () {
        _0x619eab(_0x46c739);
        var _0x56e851 = $('#' + _0x751780 + " .commonBox");
        _0x56e851.find("span").text('中文');
      });
      var _0x751780 = _0x46c739.id,
        _0x595a24 = _0x46c739.options,
        _0x5452d4 = $('#' + _0x751780 + " .commonBox"),
        _0x238af2 = $('#' + _0x751780 + " .trackList");
      _0x238af2.children().each(function (_0x30fc3c, _0x4c5825) {
        var _0x5d357b = $(_0x4c5825);
        if (_0x595a24.language == undefined || _0x595a24.language == "undefined") {
          _0x30fc3c > 0x0 ? _0x5d357b.attr("language") == 'zh' && _0x4e6175(_0x5d357b.attr("language"), _0x46c739) : _0x4e6175(_0x5d357b.attr("language"), _0x46c739);
          ;
        } else _0x4e6175(_0x595a24.language, _0x46c739);
        _0x5d357b.on('click', function () {
          if (_0x5d357b.attr("language") == "double") {
            var _0x512eb0 = _0x46c739.player.remoteTextTracks();
            for (var _0x2c38f1 = 0x0; 0x0 < _0x512eb0.length; _0x2c38f1++) {
              var _0x255242 = _0x512eb0[_0x2c38f1];
              _0x255242.mode = 'hidden';
            }
            _0x5e2f9c(_0x46c739);
          } else _0x619eab(_0x46c739), _0x4e6175(_0x5d357b.attr('language'), _0x46c739), _0x595a24.language = _0x5d357b.attr("language");
          var _0x2284be = '中文';
          if (_0x5d357b.attr("language") == 'zh') _0x2284be = '中文';else {
            if (_0x5d357b.attr("language") == 'en') _0x2284be = '英文';else _0x5d357b.attr("language") == "double" && (_0x2284be = '中英文');
          }
          _0x5452d4.find("span").text(_0x2284be);
        });
      }), _0x595a24.language != null && _0x238af2.children().each(function (_0x5bb7d6, _0xa8d561) {
        var _0x4e3324 = $(_0xa8d561);
        _0x595a24.language == _0x4e3324.attr("language") && _0x4e3324.trigger("click");
      });
    },
    _0x4e6175 = function (_0x4fd7e1, _0x4ca743) {
      var _0x3274a4 = _0x4ca743.player.remoteTextTracks();
      for (var _0x572523 = 0x0; 0x0 < _0x3274a4.length; _0x572523++) {
        var _0xcb8c01 = _0x3274a4[_0x572523];
        _0xcb8c01.language === _0x4fd7e1 ? _0xcb8c01.mode = "showing" : _0xcb8c01.mode = "hidden";
      }
    },
    _0x601ef = function (_0x31ba20) {
      if (_0x31ba20.options.control.controlBar == 0x0) return;
      var _0x38f000 = _0x31ba20.id,
        _0x10971c = _0x31ba20.$ableControlBar,
        _0x5e4c43 = _0x31ba20.$videoTitle;
      vjsExtend('useractive', _0x38f000, function () {
        _0x10971c.css("overflow", 'inherit'), _0x10971c.show();
        _0x31ba20.options.isFullscreen == 0x1 ? _0x5e4c43.show() : _0x5e4c43.hide();
        ;
      }), vjsExtend("userinactive", _0x38f000, function () {
        _0x10971c.slideUp();
        _0x31ba20.options.isFullscreen == 0x1 ? _0x5e4c43.slideUp() : _0x5e4c43.hide();
        ;
      });
    },
    _0x54420b = function (_0x1eaa2a) {
      var _0x26f654 = _0x1eaa2a.id,
        _0x1c1dff = $('#' + _0x26f654 + '\x20.videoArea'),
        _0x12e15f = _0x1eaa2a.player,
        _0x264514 = _0x1eaa2a.options;
      _0x1c1dff.on("click", function () {
        clearTimeout(null), _0x1adc57 = setTimeout(function () {
          var _0x1b57a8 = $('#' + _0x26f654 + " #playButton"),
            _0x5e4bdc = $('#' + _0x26f654 + '\x20.bigPlayButton');
          if (_0x12e15f.paused()) {
            _0x1b57a8.attr('class', "pauseButton"), _0x5e4bdc.hide();
            var _0x3943d0 = _0x12e15f.playbackRate();
            _0x12e15f.play(), _0x12e15f.playbackRate(_0x3943d0), MonitorUtil.saveAction(_0x1eaa2a, "play");
          } else _0x1b57a8.attr("class", "playButton"), _0x264514.control.bigPlayerBtn && _0x5e4bdc.show(), _0x12e15f.pause(), MonitorUtil.saveAction(_0x1eaa2a, "pause");
        }, 0x12c);
      }), _0x1c1dff.on("dblclick", function () {
        clearTimeout(_0x1adc57), _0x264514.isFullscreen == 0x0 ? (MonitorUtil.saveAction(_0x1eaa2a, 'full'), PlayerStarter.requestFullPlay(_0x1eaa2a)) : PlayerStarter.exitFullPlay();
      });
    };
  function _0x4bdc6a(_0x578670) {
    var _0x335e98 = _0x578670.id,
      _0x4553a5 = _0x578670.player,
      _0x25b461 = _0x578670.options,
      _0x291ada = $('#' + _0x335e98 + " #playButton"),
      _0x34278d = $('#' + _0x335e98 + " .bigPlayButton");
    _0x4553a5.on("play", function (_0x1b2319) {
      _0x291ada.attr("class", 'pauseButton'), _0x34278d.hide(), $('#' + _0x578670.id + " .ablePlayerError").remove();
      if (!window.isIE8) {}
    }), _0x4553a5.on("pause", function (_0x19b2fb) {
      _0x291ada.attr("class", "playButton");
      _0x25b461.control.bigPlayerBtn ? _0x34278d.show() : _0x34278d.hide();
      if (!window.isIE8) {}
    }), _0x4553a5.on("ended", function (_0x5cae2b) {
      _0x291ada.attr("class", "playButton"), _0x25b461.control.bigPlayerBtn ? _0x34278d.show() : _0x34278d.hide();
    });
  }
  function _0x3c7fb(_0x282df8) {
    this.obj = _0x282df8;
  }
  _0x3c7fb.prototype = {
    'seek': function (_0x46f151) {
      try {
        PlayerUtil.log("seek:" + _0x46f151), this.obj.player.currentTime(_0x46f151);
      } catch (_0x3391fb) {
        PlayerUtil.log('vjs跳转进度失败!');
      }
    },
    'setFullscreen': function (_0xc6a566) {},
    'play': function () {
      try {
        this.obj.player.play();
      } catch (_0x48d3e1) {
        PlayerUtil.log("vjs播放失败!");
      }
    },
    'pause': function () {
      try {
        this.obj.player.pause();
      } catch (_0x62af) {
        PlayerUtil.log("vjs暂停失败!");
      }
    },
    'getDuration': function () {
      try {
        return this.obj.player.duration();
      } catch (_0x2c657d) {
        PlayerUtil.log("vjs获取视频时长失败!");
      }
    },
    'getPosition': function () {
      try {
        return this.obj.player.currentTime();
      } catch (_0x4a39dd) {
        PlayerUtil.log("vjs获取当前播放进度失败!");
      }
    },
    'addCourseInfo': function (_0x363499) {
      try {
        this.obj.courseInfo = $.extend(this.obj.courseInfo, _0x363499);
      } catch (_0x484b3b) {
        PlayerUtil.log("vjs添加课程信息失败!");
      }
    },
    'dispose': function () {
      try {
        this.obj.player.dispose(), PlayerStarter.del(this.obj.id);
      } catch (_0x40ae64) {
        PlayerUtil.log("vjs销毁实例失败!");
      }
    },
    'getFullStatus': function () {
      try {
        return this.obj.options.isFullscreen != 0x0;
      } catch (_0x363632) {
        PlayerUtil.log("vjs获取全屏状态失败!");
      }
    },
    'exitFullPlay': function () {
      try {
        PlayerStarter.exitFullPlay();
      } catch (_0x2deb41) {
        PlayerUtil.log("vjs退出全屏失败!");
      }
    },
    'resize': function (_0x48cc46, _0x27bfc9) {
      try {
        if (!this.getFullStatus()) {
          var _0x243e8e = $('#' + this.obj.id);
          _0x243e8e.width(_0x48cc46), _0x243e8e.height(_0x27bfc9), PlayerStarter.resetControls(this.obj), !window.isIE8 && this.obj.cm.init();
        }
      } catch (_0x1029d3) {
        PlayerUtil.log("vjs改变播放器大小失败!");
      }
    },
    'insertPopup': function (_0x18d895) {
      try {
        var _0x1aa234 = $("<div class=\"ablePlayerPopup-container\"><table class=\"tbl-pop\"><tr><td align=\"center\"><div class=\"reset-ele\"></div></td></tr></table></div>");
        _0x1aa234.find(".reset-ele").append(_0x18d895);
        var _0x578601 = $('#' + this.obj.id);
        _0x578601.children("div :eq(0)").append(_0x1aa234[0x0]);
      } catch (_0x4fa358) {
        PlayerUtil.log("vjs添加弹出层失败!");
      }
    },
    'removePopup': function () {
      try {
        var _0x335c51 = $('#' + this.obj.id + " .ablePlayerPopup-container");
        _0x335c51.remove();
      } catch (_0x3e5bb6) {
        PlayerUtil.log("vjs删除弹出层失败!");
      }
    },
    'sendDanmu': function (_0x56d45a) {
      try {
        if (this.obj.defOptions.control.danmuBtn && $('#' + this.obj.id + " #danmu").hasClass("bulletSwitchOn") && !window.isIE8) {
          var _0x514a47 = cclUtil.getMsgObj(_0x56d45a);
          this.obj.cm.send(_0x514a47);
        }
      } catch (_0x22686a) {
        PlayerUtil.log("vjs发送弹幕失败!");
      }
    }
  }, window.vjsAPI = _0x3c7fb;
}(), function () {
  var _0x2a3744 = function (_0x5b7755, _0x47c53c, _0x1f0ff3) {
      if (_0x5b7755 == 'userinactive') _0x12d9f6(_0x47c53c, _0x1f0ff3);else _0x5b7755 == "useractive" && _0x6ff3ba(_0x47c53c, _0x1f0ff3);
    },
    _0x12d9f6 = function (_0x260a70, _0x21ca50) {
      var _0x4076a4 = $('#' + _0x260a70),
        _0x571b6e = 0x0,
        _0x298c73 = 0x0,
        _0x1da437 = 0x1f4,
        _0x3f2b1d = 0x7d0 / _0x1da437,
        _0x2daffe = 0x0;
      _0x4076a4.mousemove(function (_0x59d9f1) {
        _0x571b6e = _0x59d9f1.offsetX, _0x298c73 = _0x59d9f1.offsetY;
      }), setInterval(function () {
        0x0 == _0x571b6e && 0x0 == _0x298c73 ? _0x2daffe++ : (_0x36b1bf = _0x571b6e, _0x54c30c = _0x298c73, _0x2daffe = 0x1), _0x2daffe == _0x3f2b1d && _0x21ca50();
      }, _0x1da437);
    },
    _0x6ff3ba = function (_0x32f70f, _0x3307ef) {
      $('#' + _0x32f70f).mousemove(function (_0xa64bb8) {
        _0x3307ef();
      });
    };
  window.vjsExtend = _0x2a3744;
}(), function () {
  $.fn.videojsPlayer = function (_0x4655be) {
    _0x2cd9b9(_0x4655be);
  };
  var _0x2cd9b9 = function (_0x5a8a77) {
      _0x5a8a77.times.creatTime = new Date().getTime(), videojs.options.flash.swf = "//lc.zhihuishu.com/ableVideoPlayer/swf/5.10.7/video-js.swf", _0x5a8a77.currentPlayerType = PlayerStarter.playerTypes.vjs;
      _0x5a8a77.options.id ? (PlayerUtil.log('智慧树视频'), _0x44fe83(_0x5a8a77)) : (PlayerUtil.log('非智慧树视频'), _0x54095c(_0x5a8a77));
    },
    _0x44fe83 = function (_0x15699a) {
      if (_0x15699a.options.videotype == undefined || _0x15699a.options.videotype == "undefined" || _0x15699a.options.videotype == null) {
        var _0x389876 = _0x15699a.options,
          _0x199559 = {
            'id': _0x389876.id,
            'host': ''
          };
        $.getJSON("//newbase.zhihuishu.com/video/subtitleV1/?d=a&jsoncallback=?", _0x199559, function (_0x843692) {
          _0x843692 && (_0x389876.track = JSON.parse(_0x843692.subtitles), _0x843692.subtitleConfig && (_0x15699a.options.subtitleStyle = _0x843692.subtitleConfig)), ![] ? (PlayerUtil.log("默认接入视频源:" + _0x389876.src), _0x54095c(_0x15699a)) : _0x39c948 = !![];
        }), $.ajax({
          'url': "//newbase.zhihuishu.com/video/initVideo",
          'data': {
            'videoID': _0x389876.id
          },
          'dataType': "jsonp",
          'async': ![],
          'jsonp': "jsonpCallBack",
          'jsonpCallback': "result",
          'success': function (_0x4898e0) {
            if (_0x4898e0.successful) {
              _0x389876.sourceSrc = _0x4898e0.result, _0x389876.hasSchool = ![];
              for (var _0x2ab550 = 0x0; 0x0 < _0x389876.sourceSrc.lines.length; _0x2ab550++) {
                _0x389876.sourceSrc.lines[_0x2ab550].lineDefault && (_0x389876.src = _0x389876.sourceSrc.lines[_0x2ab550].lineUrl, _0x389876.chooseLine = _0x2ab550, _0x389876.rate = 0x1, _0x389876.isFullscreen = 0x0, PlayerUtil.log('请求默认源视频:' + _0x389876.src)), _0x389876.sourceSrc.lines[_0x2ab550].lineName == '校内' && (_0x389876.hasSchool = !![]);
              }
              _0x39c948 ? (PlayerUtil.log("默认接入视频源:" + _0x389876.src), _0x54095c(_0x15699a)) : _0x39c948 = !![];
            } else {
              if (_0x4898e0.errorCode == '1001') PlayerStarter.showError(_0x15699a, '01', "视频文件不存在!");else {
                if (_0x4898e0.errorCode == "1002") PlayerStarter.showError(_0x15699a, '02', "视频转码中,请稍后重试!");else {
                  if (_0x4898e0.errorCode == "1003") {
                    PlayerStarter.showError(_0x15699a, '03', "视频无法播放,请尝试切换其他线路!");
                    var _0x1e2fab = _0x15699a.id,
                      _0x242a5a = $('#' + _0x1e2fab + '\x20.line1bq'),
                      _0x1d2dd1 = $('#' + _0x1e2fab + " .line1gq"),
                      _0x3cf1b2 = $('#' + _0x1e2fab + " .xiaonei");
                    if (!window.line1bqClick) _0x242a5a.click(), window.line1bqClick = !![], console.log('切换到标准线路'), _0x321eb3(_0x15699a, "切换到标准线路");else {
                      if (!window.line1gqClick) _0x1d2dd1.click(), window.line1gqClick = !![], _0x321eb3(_0x15699a, "切换到高清线路"), console.log("切换到高清线路");else {
                        if (!window.xiaoneiClick) {
                          var _0x281f05 = ![];
                          for (var _0x2ab550 = 0x0; 0x0 < _0x15699a.options.sourceSrc.lines; _0x2ab550++) {
                            _0x15699a.options.sourceSrc.lines[_0x2ab550].lineName == '校内' && (_0x3cf1b2.click(), window.xiaoneiClick = !![], _0x281f05 = !![], _0x321eb3(_0x15699a, "切换到校内线路"), console.log('切换到校内线路'));
                          }
                          _0x281f05 == ![] && (_0x321eb3(_0x15699a, "两个线路全都执行了，还不可以播放"), console.log("两个线路全都执行了，还不可以播放"));
                        } else _0x321eb3(_0x15699a, "三个路线全都执行，还不可以播放"), console.log('三个路线全都执行，还不可以播放');
                      }
                    }
                    console.log(window.vjsComponent, "window.vjsComponent1111");
                  } else _0x4898e0.errorCode == "1004" && PlayerStarter.showError(_0x15699a, '04', "视频异常!");
                }
              }
              PlayerStarter.del(_0x15699a.id);
            }
          },
          'error': function () {
            PlayerUtil.log("调取接口失败");
          }
        });
      } else PlayerUtil.log("切换接入视频源" + _0x15699a.options.src), _0x54095c(_0x15699a);
    };
  function _0x54095c(_0xa27a01) {
    var _0xd18fa2 = 'vjs_' + _0xa27a01.id,
      _0x17c933 = _0xa27a01.options,
      _0x34529e = $('<video/>', {
        'id': _0xd18fa2,
        'class': "video-js vjs-default-skin able-player-skin",
        'poster': _0x17c933.image
      });
    _0x34529e.append("<p class=\"vjs-no-js\">Sorry 您可能需要下载新版本的浏览器来支持html5并播放本视频. <br> 请下载如下浏览器: Firefox3.5+ 或 Chrome3+</p>");
    var _0x4c5eb1 = $('#' + _0xa27a01.id);
    _0x4c5eb1.html('').append(_0x34529e);
    !_0x17c933.autostart && _0x17c933.vjsPaused == ![] && (_0x16cbd9 = !![]);
  }
  function _0x321eb3(_0x25e3ae, _0x458e2a) {
    var _0x13bb06 = _0x2da6e1("CASLOGC") ? JSON.parse(_0x2da6e1("CASLOGC")).uuid || '' : '',
      _0xd658ab = {
        'appType': 'PC',
        'appPlatform': 'PC',
        'appVersion': '',
        'data': [{
          'module': "videoLine",
          'uuid': _0x13bb06,
          'type': "switch",
          'videoId': _0x25e3ae.options.id,
          'videoUrl': _0x25e3ae.options.src,
          'clientIp': '',
          'createTime': new Date(),
          'message': _0x458e2a
        }]
      };
    $.ajax({
      'url': 'https://collector2c.zhihuishu.com/public/collect',
      'async': ![],
      'data': {
        'json': JSON.stringify(_0xd658ab)
      },
      'type': "POST",
      'success': function (_0x5e1bfb) {
        console.log("视频切换线路异常，日志上传成功！");
      },
      'error': function (_0x5ddc5a, _0x51d1b4, _0x4a4a93) {
        return console.log("服务器异常，请稍后再试！"), ![];
      }
    });
  }
  function _0x2da6e1(_0x26f08c) {
    if (document.cookie.length > 0x0) {
      var _0x54e2c2 = document.cookie.indexOf(_0x26f08c + '=');
      if (_0x54e2c2 != -0x1) {
        _0x54e2c2 = _0x54e2c2 + _0x26f08c.length + 0x1;
        var _0x3a12de = document.cookie.indexOf(';', _0x54e2c2);
        if (_0x3a12de == -0x1) _0x3a12de = document.cookie.length;
        return decodeURIComponent(document.cookie.substring(_0x54e2c2, _0x3a12de));
      }
    }
    return '';
  }
}(), !function (_0x1ddc8c, _0x198446) {
  "undefined" == typeof _0x1ddc8c.HTMLVideoElement && (_0x198446.createElement("video"), _0x198446.createElement("audio"), _0x198446.createElement("track")), function (_0x5a2d25, _0x2008e9) {
    'use strict';

    "function" == typeof define && define.amd ? define(_0x2008e9) : "object" == typeof exports ? module.exports = _0x2008e9() : _0x5a2d25.returnExports = _0x2008e9();
  }(this, function () {
    var _0x2ebcce,
      _0x599948 = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag,
      _0x1103d7 = function (_0x47eab9) {
        try {
          return Function.prototype.toString.call(_0x47eab9), !0x0;
        } catch (_0x530f3e) {
          return !0x1;
        }
      };
    _0x2ebcce = function (_0x399c21) {
      if ("function" != typeof _0x399c21) return !0x1;
      if (_0x599948) return _0x1103d7(_0x399c21);
      var _0x2646f2 = Object.prototype.toString.call(_0x399c21);
      return _0x2646f2 === "[object Function]" || _0x2646f2 === "[object GeneratorFunction]";
    };
    var _0x44eb8a,
      _0x4b253f = function (_0x48c2ff) {
        try {
          return RegExp.prototype.exec.call(_0x48c2ff), !0x0;
        } catch (_0x9a0786) {
          return !0x1;
        }
      };
    _0x44eb8a = function (_0x4bf087) {
      return 'object' != typeof _0x4bf087 ? !0x1 : _0x599948 ? _0x4b253f(_0x4bf087) : Object.prototype.toString.call(_0x4bf087) === "[object RegExp]";
    };
    var _0x1b091f,
      _0x55e242 = function (_0x265ebe) {
        try {
          return String.prototype.valueOf.call(_0x265ebe), !0x0;
        } catch (_0x1d9354) {
          return !0x1;
        }
      };
    _0x1b091f = function (_0x1c2bbf) {
      return "string" == typeof _0x1c2bbf ? !0x0 : "object" != typeof _0x1c2bbf ? !0x1 : _0x599948 ? _0x55e242(_0x1c2bbf) : Object.prototype.toString.call(_0x1c2bbf) === "[object String]";
    };
    var _0x4e1a09 = function (_0x477003) {
        var _0x44018b,
          _0x3132e0 = Object.defineProperty && function () {
            try {
              var _0x10fdce = {};
              Object.defineProperty(_0x10fdce, 'x', {
                'enumerable': !0x1,
                'value': _0x10fdce
              });
              for (var _0x441932 in _0x10fdce) return !0x1;
              return _0x10fdce.x === _0x10fdce;
            } catch (_0x213566) {
              return !0x1;
            }
          }();
        return _0x44018b = _0x3132e0 ? function (_0x5db83b, _0x468de4, _0x4c73d2, _0xc74156) {
          !_0xc74156 && _0x468de4 in _0x5db83b || Object.defineProperty(_0x5db83b, _0x468de4, {
            'configurable': !0x0,
            'enumerable': !0x1,
            'writable': !0x0,
            'value': _0x4c73d2
          });
        } : function (_0x427f71, _0x59a40b, _0x5355f9, _0x2a33cb) {
          !_0x2a33cb && _0x59a40b in _0x427f71 || (_0x427f71[_0x59a40b] = _0x5355f9);
        }, function (_0x15cc6b, _0xda6186, _0x5a75de) {
          for (var _0x9edf6 in _0xda6186) _0x477003.call(_0xda6186, _0x9edf6) && _0x44018b(_0x15cc6b, _0x9edf6, _0xda6186[_0x9edf6], _0x5a75de);
        };
      }(Object.prototype.hasOwnProperty),
      _0x20ec97 = function (_0x584e2f) {
        var _0x11ac05 = typeof _0x584e2f;
        return null === _0x584e2f || "object" !== _0x11ac05 && "function" !== _0x11ac05;
      },
      _0x1f7cc0 = Number.isNaN || function (_0xf3828a) {
        return _0xf3828a !== _0xf3828a;
      },
      _0x4ebb1f = {
        'ToInteger': function (_0x5ac6a1) {
          var _0x4e2da2 = +_0x5ac6a1;
          return _0x1f7cc0(_0x4e2da2) ? _0x4e2da2 = 0x0 : 0x0 !== _0x4e2da2 && _0x4e2da2 !== 0x1 / 0x0 && _0x4e2da2 !== -(0x1 / 0x0) && (_0x4e2da2 = (_0x4e2da2 > 0x0 || -0x1) * Math.floor(Math.abs(_0x4e2da2))), _0x4e2da2;
        },
        'ToPrimitive': function (_0x136559) {
          var _0x499388, _0x3d9e39, _0x4c460b;
          if (_0x20ec97(_0x136559)) return _0x136559;
          if (_0x3d9e39 = _0x136559.valueOf, _0x2ebcce(_0x3d9e39) && (_0x499388 = _0x3d9e39.call(_0x136559), _0x20ec97(_0x499388))) return _0x499388;
          if (_0x4c460b = _0x136559.toString, _0x2ebcce(_0x4c460b) && (_0x499388 = _0x4c460b.call(_0x136559), _0x20ec97(_0x499388))) return _0x499388;
          throw new TypeError();
        },
        'ToObject': function (_0x330e65) {
          if (null == _0x330e65) throw new TypeError('can\x27t\x20convert\x20' + _0x330e65 + " to object");
          return Object(_0x330e65);
        },
        'ToUint32': function (_0x1cb28d) {
          return _0x1cb28d >>> 0x0;
        }
      },
      _0x16dfb7 = function () {};
    _0x4e1a09(Function.prototype, {
      'bind': function (_0x55541c) {
        if (!_0x2ebcce(this)) throw new TypeError("Function.prototype.bind called on incompatible " + this);
        for (var _0xa646f1, _0x32571d = Array.prototype.slice.call(arguments, 0x1), _0x22a968 = function () {
            if (this instanceof _0xa646f1) {
              var _0x23fb36 = this.apply(this, Array.prototype.concat.call(_0x32571d, Array.prototype.slice.call(arguments)));
              return Object(_0x23fb36) === _0x23fb36 ? _0x23fb36 : this;
            }
            return this.apply(_0x55541c, Array.prototype.concat.call(_0x32571d, Array.prototype.slice.call(arguments)));
          }, _0x67c61a = Math.max(0x0, this.length - _0x32571d.length), _0x52d50a = [], _0x557be5 = 0x0; _0x67c61a > 0x0; _0x557be5++) Array.prototype.push.call(_0x52d50a, '$' + _0x557be5);
        return _0xa646f1 = Function('binder', "return function (" + _0x52d50a.join(',') + "){ return binder.apply(this, arguments); }")(_0x22a968), this.prototype && (_0x16dfb7.prototype = this.prototype, _0xa646f1.prototype = new _0x16dfb7(), _0x16dfb7.prototype = null), _0xa646f1;
      }
    });
    var _0x5c0632 = Function.prototype.call.bind(Object.prototype.hasOwnProperty),
      _0x548523 = Function.prototype.call.bind(Object.prototype.toString),
      _0x51b27c = Function.prototype.call.bind(String.prototype.slice),
      _0x28752a = Function.prototype.call.bind(String.prototype.split),
      _0x4b4168 = Function.prototype.call.bind(String.prototype.indexOf),
      _0x2cb479 = Function.prototype.call.bind(Array.prototype.push),
      _0x41dadd = Array.isArray || function (_0x2f451a) {
        return '[object\x20Array]' === _0x548523(_0x2f451a);
      },
      _0x3d7bf8 = 0x1 !== [].unshift(0x0);
    _0x4e1a09(Array.prototype, {
      'unshift': function () {
        return Array.prototype.unshift.apply(this, arguments), this.length;
      }
    }, _0x3d7bf8), _0x4e1a09(Array, {
      'isArray': _0x41dadd
    });
    var _0x1ccfca = Object('a'),
      _0x8992bc = 'a' !== _0x1ccfca[0x0] || !(0x0 in _0x1ccfca),
      _0x44cc4d = function (_0x32809b) {
        var _0x5d114f = !0x0,
          _0x2a480e = !0x0;
        return _0x32809b && (_0x32809b.call('foo', function (_0x56d3d8, _0x256995, _0x261744) {
          "object" != typeof _0x261744 && (_0x5d114f = !0x1);
        }), _0x32809b.call([0x1], function () {
          'use strict';

          _0x2a480e = 'string' == typeof this;
        }, 'x')), !!_0x32809b && _0x5d114f && _0x2a480e;
      };
    _0x4e1a09(Array.prototype, {
      'forEach': function (_0xcb9258) {
        var _0x22d3ee,
          _0x2016a1 = _0x4ebb1f.ToObject(this),
          _0x16c0b3 = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x2016a1,
          _0x271011 = -0x1,
          _0x26ef51 = _0x4ebb1f.ToUint32(_0x16c0b3.length);
        if (arguments.length > 0x1 && (_0x22d3ee = arguments[0x1]), !_0x2ebcce(_0xcb9258)) throw new TypeError("Array.prototype.forEach callback must be a function");
        for (; ++_0x271011 < _0x26ef51;) _0x271011 in _0x16c0b3 && ('undefined' == typeof _0x22d3ee ? _0xcb9258(_0x16c0b3[_0x271011], _0x271011, _0x2016a1) : _0xcb9258.call(_0x22d3ee, _0x16c0b3[_0x271011], _0x271011, _0x2016a1));
      }
    }, !_0x44cc4d(Array.prototype.forEach)), _0x4e1a09(Array.prototype, {
      'map': function (_0x2aba2e) {
        var _0x1658e5,
          _0x3d4895 = _0x4ebb1f.ToObject(this),
          _0x3d95d9 = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x3d4895,
          _0x5ed9f9 = _0x4ebb1f.ToUint32(_0x3d95d9.length),
          _0x18c601 = Array(_0x5ed9f9);
        if (arguments.length > 0x1 && (_0x1658e5 = arguments[0x1]), !_0x2ebcce(_0x2aba2e)) throw new TypeError('Array.prototype.map\x20callback\x20must\x20be\x20a\x20function');
        for (var _0x34e135 = 0x0; _0x5ed9f9 > 0x0; _0x34e135++) _0x34e135 in _0x3d95d9 && ("undefined" == typeof _0x1658e5 ? _0x18c601[_0x34e135] = _0x2aba2e(_0x3d95d9[_0x34e135], _0x34e135, _0x3d4895) : _0x18c601[_0x34e135] = _0x2aba2e.call(_0x1658e5, _0x3d95d9[_0x34e135], _0x34e135, _0x3d4895));
        return _0x18c601;
      }
    }, !_0x44cc4d(Array.prototype.map)), _0x4e1a09(Array.prototype, {
      'filter': function (_0x7d22b) {
        var _0x48c1e5,
          _0x5c6ce9,
          _0x4c6f84 = _0x4ebb1f.ToObject(this),
          _0x319155 = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x4c6f84,
          _0x171299 = _0x4ebb1f.ToUint32(_0x319155.length),
          _0x1da6f3 = [];
        if (arguments.length > 0x1 && (_0x5c6ce9 = arguments[0x1]), !_0x2ebcce(_0x7d22b)) throw new TypeError("Array.prototype.filter callback must be a function");
        for (var _0x1981e5 = 0x0; _0x171299 > 0x0; _0x1981e5++) _0x1981e5 in _0x319155 && (_0x48c1e5 = _0x319155[_0x1981e5], ("undefined" == typeof _0x5c6ce9 ? _0x7d22b(_0x48c1e5, _0x1981e5, _0x4c6f84) : _0x7d22b.call(_0x5c6ce9, _0x48c1e5, _0x1981e5, _0x4c6f84)) && _0x2cb479(_0x1da6f3, _0x48c1e5));
        return _0x1da6f3;
      }
    }, !_0x44cc4d(Array.prototype.filter)), _0x4e1a09(Array.prototype, {
      'every': function (_0x5a8e20) {
        var _0x26b2c0,
          _0x570094 = _0x4ebb1f.ToObject(this),
          _0xd68eb0 = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x570094,
          _0x4f7825 = _0x4ebb1f.ToUint32(_0xd68eb0.length);
        if (arguments.length > 0x1 && (_0x26b2c0 = arguments[0x1]), !_0x2ebcce(_0x5a8e20)) throw new TypeError("Array.prototype.every callback must be a function");
        for (var _0x42b108 = 0x0; _0x4f7825 > 0x0; _0x42b108++) if (_0x42b108 in _0xd68eb0 && !('undefined' == typeof _0x26b2c0 ? _0x5a8e20(_0xd68eb0[_0x42b108], _0x42b108, _0x570094) : _0x5a8e20.call(_0x26b2c0, _0xd68eb0[_0x42b108], _0x42b108, _0x570094))) return !0x1;
        return !0x0;
      }
    }, !_0x44cc4d(Array.prototype.every)), _0x4e1a09(Array.prototype, {
      'some': function (_0x1f553a) {
        var _0x47a153,
          _0x210d78 = _0x4ebb1f.ToObject(this),
          _0x27313e = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x210d78,
          _0x2ae87b = _0x4ebb1f.ToUint32(_0x27313e.length);
        if (arguments.length > 0x1 && (_0x47a153 = arguments[0x1]), !_0x2ebcce(_0x1f553a)) throw new TypeError('Array.prototype.some\x20callback\x20must\x20be\x20a\x20function');
        for (var _0x17a4c2 = 0x0; _0x2ae87b > 0x0; _0x17a4c2++) if (_0x17a4c2 in _0x27313e && ("undefined" == typeof _0x47a153 ? _0x1f553a(_0x27313e[_0x17a4c2], _0x17a4c2, _0x210d78) : _0x1f553a.call(_0x47a153, _0x27313e[_0x17a4c2], _0x17a4c2, _0x210d78))) return !0x0;
        return !0x1;
      }
    }, !_0x44cc4d(Array.prototype.some));
    var _0x2e9b6d = !0x1;
    Array.prototype.reduce && (_0x2e9b6d = "object" == typeof Array.prototype.reduce.call("es5", function (_0x1b2e9f, _0x58d090, _0x173c07, _0x42d3c8) {
      return _0x42d3c8;
    })), _0x4e1a09(Array.prototype, {
      'reduce': function (_0x179f16) {
        var _0x27a27a = _0x4ebb1f.ToObject(this),
          _0x247bfb = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x27a27a,
          _0x592198 = _0x4ebb1f.ToUint32(_0x247bfb.length);
        if (!_0x2ebcce(_0x179f16)) throw new TypeError('Array.prototype.reduce\x20callback\x20must\x20be\x20a\x20function');
        if (0x0 === _0x592198 && 0x1 === arguments.length) throw new TypeError("reduce of empty array with no initial value");
        var _0xa74b7e;
        if (arguments.length >= 0x2) _0xa74b7e = arguments[0x1];else for (;;) {
          if (0x0 in _0x247bfb) {
            _0xa74b7e = _0x247bfb[_0x12d2f1++];
            break;
          }
          if (++_0x12d2f1 >= _0x592198) throw new TypeError("reduce of empty array with no initial value");
        }
        for (; _0x592198 > _0x12d2f1; _0x12d2f1++) _0x12d2f1 in _0x247bfb && (_0xa74b7e = _0x179f16(_0xa74b7e, _0x247bfb[_0x12d2f1], _0x12d2f1, _0x27a27a));
        return _0xa74b7e;
      }
    }, !_0x2e9b6d);
    var _0x5d679a = !0x1;
    Array.prototype.reduceRight && (_0x5d679a = 'object' == typeof Array.prototype.reduceRight.call("es5", function (_0x4292f6, _0x4e95c1, _0x188354, _0x3a9ed0) {
      return _0x3a9ed0;
    })), _0x4e1a09(Array.prototype, {
      'reduceRight': function (_0x4ddfc0) {
        var _0x1f9d6d = _0x4ebb1f.ToObject(this),
          _0x3eae0e = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x1f9d6d,
          _0xa1ca48 = _0x4ebb1f.ToUint32(_0x3eae0e.length);
        if (!_0x2ebcce(_0x4ddfc0)) throw new TypeError("Array.prototype.reduceRight callback must be a function");
        if (0x0 === _0xa1ca48 && 0x1 === arguments.length) throw new TypeError("reduceRight of empty array with no initial value");
        var _0x5473bd,
          _0x13822d = _0xa1ca48 - 0x1;
        if (arguments.length >= 0x2) _0x5473bd = arguments[0x1];else for (;;) {
          if (_0x13822d in _0x3eae0e) {
            _0x5473bd = _0x3eae0e[_0x13822d--];
            break;
          }
          if (--_0x13822d < 0x0) throw new TypeError('reduceRight\x20of\x20empty\x20array\x20with\x20no\x20initial\x20value');
        }
        if (0x0 > _0x13822d) return _0x5473bd;
        do _0x13822d in _0x3eae0e && (_0x5473bd = _0x4ddfc0(_0x5473bd, _0x3eae0e[_0x13822d], _0x13822d, _0x1f9d6d)); while (_0x13822d--);
        return _0x5473bd;
      }
    }, !_0x5d679a);
    var _0x47bd7b = Array.prototype.indexOf && -0x1 !== [0x0, 0x1].indexOf(0x1, 0x2);
    _0x4e1a09(Array.prototype, {
      'indexOf': function (_0x124dad) {
        var _0x3ff335 = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x4ebb1f.ToObject(this),
          _0x1e8fa1 = _0x4ebb1f.ToUint32(_0x3ff335.length);
        if (0x0 === _0x1e8fa1) return -0x1;
        var _0x27dbbd = 0x0;
        for (arguments.length > 0x1 && (_0x27dbbd = _0x4ebb1f.ToInteger(arguments[0x1])), _0x27dbbd = _0x27dbbd >= 0x0 ? _0x27dbbd : Math.max(0x0, _0x1e8fa1 + _0x27dbbd); _0x1e8fa1 > _0x27dbbd; _0x27dbbd++) if (_0x27dbbd in _0x3ff335 && _0x3ff335[_0x27dbbd] === _0x124dad) return _0x27dbbd;
        return -0x1;
      }
    }, _0x47bd7b);
    var _0x40b975 = Array.prototype.lastIndexOf && -0x1 !== [0x0, 0x1].lastIndexOf(0x0, -0x3);
    _0x4e1a09(Array.prototype, {
      'lastIndexOf': function (_0x467dd0) {
        var _0x5e58b4 = _0x8992bc && _0x1b091f(this) ? _0x28752a(this, '') : _0x4ebb1f.ToObject(this),
          _0x153c21 = _0x4ebb1f.ToUint32(_0x5e58b4.length);
        if (0x0 === _0x153c21) return -0x1;
        var _0x477b2d = _0x153c21 - 0x1;
        for (arguments.length > 0x1 && (_0x477b2d = Math.min(_0x477b2d, _0x4ebb1f.ToInteger(arguments[0x1]))), _0x477b2d = _0x477b2d >= 0x0 ? _0x477b2d : _0x153c21 - Math.abs(_0x477b2d); _0x477b2d >= 0x0; _0x477b2d--) if (_0x477b2d in _0x5e58b4 && _0x467dd0 === _0x5e58b4[_0x477b2d]) return _0x477b2d;
        return -0x1;
      }
    }, _0x40b975);
    var _0x338eb2 = function () {
      var _0x15eebe = [0x1, 0x2],
        _0x43008f = _0x15eebe.splice();
      return 0x2 === _0x15eebe.length && _0x41dadd(_0x43008f) && 0x0 === _0x43008f.length;
    }();
    _0x4e1a09(Array.prototype, {
      'splice': function (_0x58928a, _0x7d529) {
        return 0x0 === arguments.length ? [] : Array.prototype.splice.apply(this, arguments);
      }
    }, !_0x338eb2);
    var _0x2141e4 = function () {
      var _0x2fdab5 = {};
      return Array.prototype.splice.call(_0x2fdab5, 0x0, 0x0, 0x1), 0x1 === _0x2fdab5.length;
    }();
    _0x4e1a09(Array.prototype, {
      'splice': function (_0x33fea7, _0x41d731) {
        if (0x0 === arguments.length) return [];
        var _0x398a8b = arguments;
        return this.length = Math.max(_0x4ebb1f.ToInteger(this.length), 0x0), arguments.length > 0x0 && "number" != typeof _0x41d731 && (_0x398a8b = Array.prototype.slice.call(arguments), _0x398a8b.length < 0x2 ? _0x2cb479(_0x398a8b, this.length - _0x33fea7) : _0x398a8b[0x1] = _0x4ebb1f.ToInteger(_0x41d731)), Array.prototype.splice.apply(this, _0x398a8b);
      }
    }, !_0x2141e4);
    var _0x1435a8 = function () {
        var _0x3bf2b9 = new Array(0x186a0);
        return _0x3bf2b9[0x8] = 'x', _0x3bf2b9.splice(0x1, 0x1), 0x7 === _0x3bf2b9.indexOf('x');
      }(),
      _0xdc9b95 = function () {
        var _0x4761ef = 0x100,
          _0xbf3aed = [];
        return _0xbf3aed[_0x4761ef] = 'a', _0xbf3aed.splice(_0x4761ef + 0x1, 0x0, 'b'), 'a' === _0xbf3aed[_0x4761ef];
      }();
    _0x4e1a09(Array.prototype, {
      'splice': function (_0x4d5de9, _0x38150c) {
        for (var _0x119d49, _0x5b3e0d = _0x4ebb1f.ToObject(this), _0x20dbca = [], _0x1cc89a = _0x4ebb1f.ToUint32(_0x5b3e0d.length), _0x5e5efa = _0x4ebb1f.ToInteger(_0x4d5de9), _0x497462 = 0x0 > _0x5e5efa ? Math.max(_0x1cc89a + _0x5e5efa, 0x0) : Math.min(_0x5e5efa, _0x1cc89a), _0x2aae1f = Math.min(Math.max(_0x4ebb1f.ToInteger(_0x38150c), 0x0), _0x1cc89a - _0x497462), _0x387e80 = 0x0; _0x2aae1f > _0x387e80;) _0x119d49 = String(_0x497462 + _0x387e80), _0x5c0632(_0x5b3e0d, _0x119d49) && (_0x20dbca[_0x387e80] = _0x5b3e0d[_0x119d49]), _0x387e80 += 0x1;
        var _0x21e791,
          _0x1ea829 = Array.prototype.slice.call(arguments, 0x2),
          _0x57dab6 = _0x1ea829.length;
        if (_0x2aae1f > _0x57dab6) {
          for (_0x387e80 = _0x497462; _0x1cc89a - _0x2aae1f > _0x387e80;) _0x119d49 = String(_0x387e80 + _0x2aae1f), _0x21e791 = String(_0x387e80 + _0x57dab6), _0x5c0632(_0x5b3e0d, _0x119d49) ? _0x5b3e0d[_0x21e791] = _0x5b3e0d[_0x119d49] : delete _0x5b3e0d[_0x21e791], _0x387e80 += 0x1;
          for (_0x387e80 = _0x1cc89a; _0x387e80 > _0x1cc89a - _0x2aae1f + _0x57dab6;) _0x387e80 -= 0x1;
        } else {
          if (_0x57dab6 > _0x2aae1f) {
            for (_0x387e80 = _0x1cc89a - _0x2aae1f; _0x387e80 > _0x497462;) _0x119d49 = String(_0x387e80 + _0x2aae1f - 0x1), _0x21e791 = String(_0x387e80 + _0x57dab6 - 0x1), _0x5c0632(_0x5b3e0d, _0x119d49) ? _0x5b3e0d[_0x21e791] = _0x5b3e0d[_0x119d49] : delete _0x5b3e0d[_0x21e791], _0x387e80 -= 0x1;
          }
        }
        _0x387e80 = _0x497462;
        for (var _0x5487a6 = 0x0; 0x0 < _0x1ea829.length; ++_0x5487a6) _0x5b3e0d[_0x387e80] = _0x1ea829[_0x5487a6], _0x387e80 += 0x1;
        return _0x5b3e0d.length = _0x1cc89a - _0x2aae1f + _0x57dab6, _0x20dbca;
      }
    }, !_0x1435a8 || !_0xdc9b95);
    var _0x521f8b = "1,2" !== [0x1, 0x2].join(void 0x0);
    _0x4e1a09(Array.prototype, {
      'join': function (_0x5794be) {
        return Array.prototype.join.call(this, "undefined" == typeof _0x5794be ? ',' : _0x5794be);
      }
    }, _0x521f8b);
    var _0x3e8a6a = function (_0x4bfe31) {
        for (var _0x233c93 = _0x4ebb1f.ToObject(this), _0x2c110f = _0x4ebb1f.ToUint32(_0x233c93.length), _0x156d63 = 0x0; _0x156d63 < arguments.length;) _0x233c93[_0x2c110f + _0x156d63] = arguments[_0x156d63], _0x156d63 += 0x1;
        return _0x233c93.length = _0x2c110f + _0x156d63, _0x2c110f + _0x156d63;
      },
      _0x59e28b = function () {
        var _0xf5a257 = {},
          _0x63e954 = Array.prototype.push.call(_0xf5a257, void 0x0);
        return 0x1 !== _0x63e954 || 0x1 !== _0xf5a257.length || "undefined" != typeof _0xf5a257[0x0] || !_0x5c0632(_0xf5a257, 0x0);
      }();
    _0x4e1a09(Array.prototype, {
      'push': function (_0x82960a) {
        return _0x41dadd(this) ? Array.prototype.push.apply(this, arguments) : _0x3e8a6a.apply(this, arguments);
      }
    }, _0x59e28b);
    var _0x32327f = function () {
      var _0xfa9d11 = [],
        _0x218ebc = _0xfa9d11.push(void 0x0);
      return 0x1 !== _0x218ebc || 0x1 !== _0xfa9d11.length || "undefined" != typeof _0xfa9d11[0x0] || !_0x5c0632(_0xfa9d11, 0x0);
    }();
    _0x4e1a09(Array.prototype, {
      'push': _0x3e8a6a
    }, _0x32327f);
    var _0x213618 = !{
        'toString': null
      }.propertyIsEnumerable("toString"),
      _0x2dbed1 = function () {}.propertyIsEnumerable('prototype'),
      _0x10ed32 = !_0x5c0632('x', '0'),
      _0x19bf6a = function (_0x439aeb) {
        var _0x45259d = _0x439aeb.constructor;
        return _0x45259d && _0x45259d.prototype === _0x439aeb;
      },
      _0x502188 = function () {
        if ("undefined" == typeof _0x1ddc8c) return !0x1;
        for (var _0x1771fa in _0x1ddc8c) try {
          !{
            '$window': !0x0,
            '$console': !0x0,
            '$parent': !0x0,
            '$self': !0x0,
            '$frame': !0x0,
            '$frames': !0x0,
            '$frameElement': !0x0,
            '$webkitIndexedDB': !0x0,
            '$webkitStorageInfo': !0x0
          }['$' + _0x1771fa] && _0x5c0632(_0x1ddc8c, _0x1771fa) && null !== _0x1ddc8c[_0x1771fa] && "object" == typeof _0x1ddc8c[_0x1771fa] && _0x19bf6a(_0x1ddc8c[_0x1771fa]);
        } catch (_0x5a6565) {
          return !0x0;
        }
        return !0x1;
      }(),
      _0x4d9c3c = function (_0x2045ac) {
        if ('undefined' == typeof _0x1ddc8c || !_0x502188) return _0x19bf6a(_0x2045ac);
        try {
          return _0x19bf6a(_0x2045ac);
        } catch (_0x2842f2) {
          return !0x1;
        }
      },
      _0x34997c = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", 'propertyIsEnumerable', "constructor"],
      _0x104daa = _0x34997c.length,
      _0x51a72f = function (_0x168dff) {
        return '[object\x20Arguments]' === _0x548523(_0x168dff);
      },
      _0x2ca5fc = function (_0x2417e7) {
        return null !== _0x2417e7 && "object" == typeof _0x2417e7 && "number" == typeof _0x2417e7.length && _0x2417e7.length >= 0x0 && !_0x41dadd(_0x2417e7) && _0x2ebcce(_0x2417e7.callee);
      },
      _0x3fa2ac = _0x51a72f(arguments) ? _0x51a72f : _0x2ca5fc;
    _0x4e1a09(Object, {
      'keys': function (_0x2adc31) {
        var _0x5a950f = _0x2ebcce(_0x2adc31),
          _0x36d904 = _0x3fa2ac(_0x2adc31),
          _0x3a6950 = null !== _0x2adc31 && "object" == typeof _0x2adc31,
          _0x585442 = _0x3a6950 && _0x1b091f(_0x2adc31);
        if (!_0x3a6950 && !_0x5a950f && !_0x36d904) throw new TypeError("Object.keys called on a non-object");
        var _0x1ef42e = [],
          _0x5f0c52 = _0x2dbed1 && _0x5a950f;
        if (_0x585442 && _0x10ed32 || _0x36d904) {
          for (var _0x209225 = 0x0; 0x0 < _0x2adc31.length; ++_0x209225) _0x2cb479(_0x1ef42e, String(_0x209225));
        }
        if (!_0x36d904) {
          for (var _0x17aace in _0x2adc31) _0x5f0c52 && 'prototype' === _0x17aace || !_0x5c0632(_0x2adc31, _0x17aace) || _0x2cb479(_0x1ef42e, String(_0x17aace));
        }
        if (_0x213618) for (var _0x3f6158 = _0x4d9c3c(_0x2adc31), _0x116c83 = 0x0; _0x104daa > 0x0; _0x116c83++) {
          var _0x37bf51 = _0x34997c[_0x116c83];
          _0x3f6158 && "constructor" === _0x37bf51 || !_0x5c0632(_0x2adc31, _0x37bf51) || _0x2cb479(_0x1ef42e, _0x37bf51);
        }
        return _0x1ef42e;
      }
    });
    var _0x9c962f = Object.keys && function () {
        return 0x2 === Object.keys(arguments).length;
      }(0x1, 0x2),
      _0x5ddba4 = Object.keys && function () {
        var _0x145276 = Object.keys(arguments);
        return 0x1 !== arguments.length || 0x1 !== _0x145276.length || 0x1 !== _0x145276[0x0];
      }(0x1);
    _0x4e1a09(Object, {
      'keys': function (_0x516de0) {
        return Object.keys(_0x3fa2ac(_0x516de0) ? Array.prototype.slice.call(_0x516de0) : _0x516de0);
      }
    }, !_0x9c962f || _0x5ddba4);
    var _0x2de7c2 = -0x3891c6b58c00,
      _0x3255d4 = '-000001',
      _0x22fe18 = Date.prototype.toISOString && -0x1 === new Date(_0x2de7c2).toISOString().indexOf(_0x3255d4),
      _0x2a8028 = Date.prototype.toISOString && "1969-12-31T23:59:59.999Z" !== new Date(-0x1).toISOString();
    _0x4e1a09(Date.prototype, {
      'toISOString': function () {
        var _0x43c738, _0x320653, _0x459dca, _0x4a577b, _0xbbcb49;
        if (!isFinite(this)) throw new RangeError('Date.prototype.toISOString\x20called\x20on\x20non-finite\x20value.');
        for (_0x4a577b = this.getUTCFullYear(), _0xbbcb49 = this.getUTCMonth(), _0x4a577b += Math.floor(_0xbbcb49 / 0xc), _0xbbcb49 = (_0xbbcb49 % 0xc + 0xc) % 0xc, _0x43c738 = [_0xbbcb49 + 0x1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()], _0x4a577b = (0x0 > _0x4a577b ? '-' : _0x4a577b > 0x270f ? '+' : '') + _0x51b27c("00000" + Math.abs(_0x4a577b), _0x4a577b >= 0x0 && 0x270f >= _0x4a577b ? -0x4 : -0x6), _0x320653 = _0x43c738.length; _0x320653--;) _0x459dca = _0x43c738[_0x320653], 0xa > _0x459dca && (_0x43c738[_0x320653] = '0' + _0x459dca);
        return _0x4a577b + '-' + Array.prototype.slice.call(_0x43c738, 0x0, 0x2).join('-') + 'T' + Array.prototype.slice.call(_0x43c738, 0x2).join(':') + '.' + _0x51b27c("000" + this.getUTCMilliseconds(), -0x3) + 'Z';
      }
    }, _0x22fe18 || _0x2a8028);
    var _0x43f779 = function () {
      try {
        return Date.prototype.toJSON && null === new Date(NaN).toJSON() && -0x1 !== new Date(_0x2de7c2).toJSON().indexOf(_0x3255d4) && Date.prototype.toJSON.call({
          'toISOString': function () {
            return !0x0;
          }
        });
      } catch (_0x5195d4) {
        return !0x1;
      }
    }();
    _0x43f779 || (Date.prototype.toJSON = function (_0x2b1737) {
      var _0x325510 = Object(this),
        _0x50c2ba = _0x4ebb1f.ToPrimitive(_0x325510);
      if ("number" == typeof _0x50c2ba && !isFinite(_0x50c2ba)) return null;
      var _0x11244f = _0x325510.toISOString;
      if (!_0x2ebcce(_0x11244f)) throw new TypeError("toISOString property is not callable");
      return _0x11244f.call(_0x325510);
    });
    var _0x35f6ff = 0x38d7ea4c68000 === Date.parse("+033658-09-27T01:46:40.000Z"),
      _0x342cea = !isNaN(Date.parse("2012-04-04T24:00:00.500Z")) || !isNaN(Date.parse("2012-11-31T23:59:59.000Z")) || !isNaN(Date.parse("2012-12-31T23:59:60.000Z")),
      _0x4a921a = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (_0x4a921a || _0x342cea || !_0x35f6ff) {
      var _0x35f72f = Math.pow(0x2, 0x1f) - 0x1,
        _0xd68d3b = (Math.floor(_0x35f72f / 0x3e8), _0x1f7cc0(new Date(0x7b2, 0x0, 0x1, 0x0, 0x0, 0x0, _0x35f72f + 0x1).getTime()));
      Date = function (_0x1c34a2) {
        var _0x5c9be0 = function (_0x598198, _0x2ef290, _0x3c0787, _0x68962, _0x39631e, _0x34e0d8, _0x304305) {
            var _0x14796c;
            if (this instanceof _0x1c34a2) {
              var _0x3e9b61 = _0x34e0d8,
                _0x2f32bd = _0x304305;
              if (_0xd68d3b && arguments.length >= 0x7 && _0x304305 > _0x35f72f) {
                var _0x4b2603 = Math.floor(_0x304305 / _0x35f72f) * _0x35f72f,
                  _0x5cb842 = Math.floor(_0x4b2603 / 0x3e8);
                _0x3e9b61 += _0x5cb842, _0x2f32bd -= 0x3e8 * _0x5cb842;
              }
              _0x14796c = 0x1 === arguments.length && String(_0x598198) === _0x598198 ? new _0x1c34a2(_0x5c9be0.parse(_0x598198)) : arguments.length >= 0x7 ? new _0x1c34a2(_0x598198, _0x2ef290, _0x3c0787, _0x68962, _0x39631e, _0x3e9b61, _0x2f32bd) : arguments.length >= 0x6 ? new _0x1c34a2(_0x598198, _0x2ef290, _0x3c0787, _0x68962, _0x39631e, _0x3e9b61) : arguments.length >= 0x5 ? new _0x1c34a2(_0x598198, _0x2ef290, _0x3c0787, _0x68962, _0x39631e) : arguments.length >= 0x4 ? new _0x1c34a2(_0x598198, _0x2ef290, _0x3c0787, _0x68962) : arguments.length >= 0x3 ? new _0x1c34a2(_0x598198, _0x2ef290, _0x3c0787) : arguments.length >= 0x2 ? new _0x1c34a2(_0x598198, _0x2ef290) : arguments.length >= 0x1 ? new _0x1c34a2(_0x598198) : new _0x1c34a2();
            } else _0x14796c = _0x1c34a2.apply(this, arguments);
            return _0x20ec97(_0x14796c) || _0x4e1a09(_0x14796c, {
              'constructor': _0x5c9be0
            }, !0x0), _0x14796c;
          },
          _0x178ec8 = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"),
          _0x28481c = function (_0x1abfeb, _0x2e2010) {
            var _0x3b8970 = _0x2e2010 > 0x1 ? 0x1 : 0x0;
            return [0x0, 0x1f, 0x3b, 0x5a, 0x78, 0x97, 0xb5, 0xd4, 0xf3, 0x111, 0x130, 0x14e, 0x16d][_0x2e2010] + Math.floor((_0x1abfeb - 0x7b1 + _0x3b8970) / 0x4) - Math.floor((_0x1abfeb - 0x76d + _0x3b8970) / 0x64) + Math.floor((_0x1abfeb - 0x641 + _0x3b8970) / 0x190) + 0x16d * (_0x1abfeb - 0x7b2);
          },
          _0x36e9b7 = function (_0x4f2cce) {
            var _0x4fbd99 = 0x0,
              _0x2f333e = _0x4f2cce;
            if (_0xd68d3b && _0x2f333e > _0x35f72f) {
              var _0x5c1204 = Math.floor(_0x2f333e / _0x35f72f) * _0x35f72f,
                _0x2b63fc = Math.floor(_0x5c1204 / 0x3e8);
              _0x4fbd99 += _0x2b63fc, _0x2f333e -= 0x3e8 * _0x2b63fc;
            }
            return Number(new _0x1c34a2(0x7b2, 0x0, 0x1, 0x0, 0x0, _0x4fbd99, _0x2f333e));
          };
        for (var _0x24fd58 in _0x1c34a2) _0x5c0632(_0x1c34a2, _0x24fd58) && (_0x5c9be0[_0x24fd58] = _0x1c34a2[_0x24fd58]);
        _0x4e1a09(_0x5c9be0, {
          'now': _0x1c34a2.now,
          'UTC': _0x1c34a2.UTC
        }, !0x0), _0x5c9be0.prototype = _0x1c34a2.prototype, _0x4e1a09(_0x5c9be0.prototype, {
          'constructor': _0x5c9be0
        }, !0x0);
        var _0x539688 = function (_0x3ed2f6) {
          var _0x4db2a4 = _0x178ec8.exec(_0x3ed2f6);
          if (_0x4db2a4) {
            var _0x38e95d,
              _0x1eadab = Number(_0x4db2a4[0x1]),
              _0x247b2c = Number(_0x4db2a4[0x2] || 0x1) - 0x1,
              _0x4df415 = Number(_0x4db2a4[0x3] || 0x1) - 0x1,
              _0x5af602 = Number(_0x4db2a4[0x4] || 0x0),
              _0x24c426 = Number(_0x4db2a4[0x5] || 0x0),
              _0x4f0ab2 = Number(_0x4db2a4[0x6] || 0x0),
              _0x2dfe70 = Math.floor(0x3e8 * Number(_0x4db2a4[0x7] || 0x0)),
              _0x463ec1 = Boolean(_0x4db2a4[0x4] && !_0x4db2a4[0x8]),
              _0x3b1040 = '-' === _0x4db2a4[0x9] ? 0x1 : -0x1,
              _0x447b87 = Number(_0x4db2a4[0xa] || 0x0),
              _0x42cc3e = Number(_0x4db2a4[0xb] || 0x0),
              _0x538587 = _0x24c426 > 0x0 || _0x4f0ab2 > 0x0 || _0x2dfe70 > 0x0;
            return (_0x538587 ? 0x18 : 0x19) > _0x5af602 && 0x3c > _0x24c426 && 0x3c > _0x4f0ab2 && 0x3e8 > _0x2dfe70 && _0x247b2c > -0x1 && 0xc > _0x247b2c && 0x18 > _0x447b87 && 0x3c > _0x42cc3e && _0x4df415 > -0x1 && _0x4df415 < _0x28481c(_0x1eadab, _0x247b2c + 0x1) - _0x28481c(_0x1eadab, _0x247b2c) && (_0x38e95d = 0x3c * (0x18 * (_0x28481c(_0x1eadab, _0x247b2c) + _0x4df415) + _0x5af602 + _0x447b87 * _0x3b1040), _0x38e95d = 0x3e8 * (0x3c * (_0x38e95d + _0x24c426 + _0x42cc3e * _0x3b1040) + _0x4f0ab2) + _0x2dfe70, _0x463ec1 && (_0x38e95d = _0x36e9b7(_0x38e95d)), _0x38e95d >= -0x1eb208c2dc0000 && 0x1eb208c2dc0000 >= _0x38e95d) ? _0x38e95d : NaN;
          }
          return _0x1c34a2.parse.apply(this, arguments);
        };
        return _0x4e1a09(_0x5c9be0, {
          'parse': _0x539688
        }), _0x5c9be0;
      }(Date);
    }
    Date.now || (Date.now = function () {
      return new Date().getTime();
    });
    var _0x1ed8f0 = Number.prototype.toFixed && ("0.000" !== 0.00008.toFixed(0x3) || '1' !== 0.9.toFixed(0x0) || '1.25' !== 1.255.toFixed(0x2) || "1000000000000000128" !== 0xde0b6b3a7640080.toFixed(0x0)),
      _0x2775d9 = {
        'base': 0x989680,
        'size': 0x6,
        'data': [0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        'multiply': function (_0x234cff, _0x505e4c) {
          for (var _0x20e07b = -0x1, _0x5250c4 = _0x505e4c; ++_0x20e07b < _0x2775d9.size;) _0x5250c4 += _0x234cff * _0x2775d9.data[_0x20e07b], _0x2775d9.data[_0x20e07b] = _0x5250c4 % _0x2775d9.base, _0x5250c4 = Math.floor(_0x5250c4 / _0x2775d9.base);
        },
        'divide': function (_0x1b5509) {
          for (var _0xce4c31 = _0x2775d9.size, _0x97f59b = 0x0; --_0xce4c31 >= 0x0;) _0x97f59b += _0x2775d9.data[_0xce4c31], _0x2775d9.data[_0xce4c31] = Math.floor(_0x97f59b / _0x1b5509), _0x97f59b = _0x97f59b % _0x1b5509 * _0x2775d9.base;
        },
        'numToString': function () {
          for (var _0x567d7d = _0x2775d9.size, _0x2e5f9b = ''; --_0x567d7d >= 0x0;) if ('' !== _0x2e5f9b || 0x0 === _0x567d7d || 0x0 !== _0x2775d9.data[_0x567d7d]) {
            var _0x5a2252 = String(_0x2775d9.data[_0x567d7d]);
            '' === _0x2e5f9b ? _0x2e5f9b = _0x5a2252 : _0x2e5f9b += _0x51b27c('0000000', 0x0, 0x7 - _0x5a2252.length) + _0x5a2252;
          }
          return _0x2e5f9b;
        },
        'pow': function _0x538f91(_0x5217d1, _0x63e5f, _0x3e21d7) {
          return 0x0 === _0x63e5f ? _0x3e21d7 : _0x63e5f % 0x2 === 0x1 ? _0x538f91(_0x5217d1, _0x63e5f - 0x1, _0x3e21d7 * _0x5217d1) : _0x538f91(_0x5217d1 * _0x5217d1, _0x63e5f / 0x2, _0x3e21d7);
        },
        'log': function (_0x4ebfb5) {
          for (var _0x4c1778 = 0x0, _0xc8bacc = _0x4ebfb5; _0xc8bacc >= 0x1000;) _0x4c1778 += 0xc, _0xc8bacc /= 0x1000;
          for (; _0xc8bacc >= 0x2;) _0x4c1778 += 0x1, _0xc8bacc /= 0x2;
          return _0x4c1778;
        }
      },
      _0x4d1a9f = function (_0x27d6ad) {
        var _0x3f257d, _0x15b2f6, _0x1f7854, _0x460571, _0x13caea, _0x38332a, _0x33911f, _0x2c4e07;
        if (_0x3f257d = Number(_0x27d6ad), _0x3f257d = _0x1f7cc0(_0x3f257d) ? 0x0 : Math.floor(_0x3f257d), 0x0 > _0x3f257d || _0x3f257d > 0x14) throw new RangeError("Number.toFixed called with invalid number of decimals");
        if (_0x15b2f6 = Number(this), _0x1f7cc0(_0x15b2f6)) return "NaN";
        if (-0x3635c9adc5dea00000 >= _0x15b2f6 || _0x15b2f6 >= 0x3635c9adc5dea00000) return String(_0x15b2f6);
        if (_0x1f7854 = '', 0x0 > _0x15b2f6 && (_0x1f7854 = '-', _0x15b2f6 = -_0x15b2f6), _0x460571 = '0', _0x15b2f6 > 1e-21) {
          if (_0x13caea = _0x2775d9.log(_0x15b2f6 * _0x2775d9.pow(0x2, 0x45, 0x1)) - 0x45, _0x38332a = 0x0 > _0x13caea ? _0x15b2f6 * _0x2775d9.pow(0x2, -_0x13caea, 0x1) : _0x15b2f6 / _0x2775d9.pow(0x2, _0x13caea, 0x1), _0x38332a *= 0x10000000000000, _0x13caea = 0x34 - _0x13caea, _0x13caea > 0x0) {
            for (_0x2775d9.multiply(0x0, _0x38332a), _0x33911f = _0x3f257d; _0x33911f >= 0x7;) _0x2775d9.multiply(0x989680, 0x0), _0x33911f -= 0x7;
            for (_0x2775d9.multiply(_0x2775d9.pow(0xa, _0x33911f, 0x1), 0x0), _0x33911f = _0x13caea - 0x1; _0x33911f >= 0x17;) _0x2775d9.divide(0x1 << 0x17), _0x33911f -= 0x17;
            _0x2775d9.divide(0x1 << _0x33911f), _0x2775d9.multiply(0x1, 0x1), _0x2775d9.divide(0x2), _0x460571 = _0x2775d9.numToString();
          } else _0x2775d9.multiply(0x0, _0x38332a), _0x2775d9.multiply(0x1 << -_0x13caea, 0x0), _0x460571 = _0x2775d9.numToString() + _0x51b27c("0.00000000000000000000", 0x2, 0x2 + _0x3f257d);
        }
        return _0x3f257d > 0x0 ? (_0x2c4e07 = _0x460571.length, _0x460571 = _0x3f257d >= _0x2c4e07 ? _0x1f7854 + _0x51b27c('0.0000000000000000000', 0x0, _0x3f257d - _0x2c4e07 + 0x2) + _0x460571 : _0x1f7854 + _0x51b27c(_0x460571, 0x0, _0x2c4e07 - _0x3f257d) + '.' + _0x51b27c(_0x460571, _0x2c4e07 - _0x3f257d)) : _0x460571 = _0x1f7854 + _0x460571, _0x460571;
      };
    _0x4e1a09(Number.prototype, {
      'toFixed': _0x4d1a9f
    }, _0x1ed8f0);
    var _0x30254b = function () {
      try {
        return '1' === 0x1.toPrecision(void 0x0);
      } catch (_0xb88634) {
        return !0x0;
      }
    }();
    _0x4e1a09(Number.prototype, {
      'toPrecision': function (_0x5b6f20) {
        return 'undefined' == typeof _0x5b6f20 ? Number.prototype.toPrecision.call(this) : Number.prototype.toPrecision.call(this, _0x5b6f20);
      }
    }, _0x30254b), 0x2 !== 'ab'.split(/(?:ab)*/).length || 0x4 !== '.'.split(/(.?)(.?)/).length || 't' === 'tesst'.split(/(s)*/)[0x1] || 0x4 !== "test".split(/(?:)/, -0x1).length || ''.split(/.?/).length || '.'.split(/()()/).length > 0x1 ? !function () {
      var _0x2a3749 = "undefined" == typeof /()??/.exec('')[0x1],
        _0x3cf87d = Math.pow(0x2, 0x20) - 0x1;
      String.prototype.split = function (_0xc84060, _0x5a641c) {
        var _0x289cbb = this;
        if ("undefined" == typeof _0xc84060 && 0x0 === _0x5a641c) return [];
        if (!_0x44eb8a(_0xc84060)) return _0x28752a(this, _0xc84060, _0x5a641c);
        var _0x32a8ee,
          _0x2eafdd,
          _0x1af421,
          _0x2a29b8,
          _0x360043 = [],
          _0x29d89e = (_0xc84060.ignoreCase ? 'i' : '') + (_0xc84060.multiline ? 'm' : '') + (_0xc84060.unicode ? 'u' : '') + (_0xc84060.sticky ? 'y' : ''),
          _0x53cd76 = 0x0,
          _0x27a0b1 = new RegExp(_0xc84060.source, _0x29d89e + 'g');
        _0x289cbb += '', _0x2a3749 || (_0x32a8ee = new RegExp('^' + _0x27a0b1.source + "$(?!\\s)", _0x29d89e));
        var _0x27df28 = "undefined" == typeof _0x5a641c ? _0x3cf87d : _0x4ebb1f.ToUint32(_0x5a641c);
        for (_0x2eafdd = _0x27a0b1.exec(_0x289cbb); _0x2eafdd && (_0x1af421 = _0x2eafdd.index + _0x2eafdd[0x0].length, !(_0x1af421 > _0x53cd76 && (_0x2cb479(_0x360043, _0x51b27c(_0x289cbb, _0x53cd76, _0x2eafdd.index)), !_0x2a3749 && _0x2eafdd.length > 0x1 && _0x2eafdd[0x0].replace(_0x32a8ee, function () {
          for (var _0x46fbe8 = 0x1; 0x1 < arguments.length - 0x2; _0x46fbe8++) 'undefined' == typeof arguments[_0x46fbe8] && (_0x2eafdd[_0x46fbe8] = void 0x0);
        }), _0x2eafdd.length > 0x1 && _0x2eafdd.index < _0x289cbb.length && Array.prototype.push.apply(_0x360043, Array.prototype.slice.call(_0x2eafdd, 0x1)), _0x2a29b8 = _0x2eafdd[0x0].length, _0x53cd76 = _0x1af421, _0x360043.length >= _0x27df28)));) _0x27a0b1.lastIndex === _0x2eafdd.index && _0x27a0b1.lastIndex++, _0x2eafdd = _0x27a0b1.exec(_0x289cbb);
        return _0x53cd76 === _0x289cbb.length ? (_0x2a29b8 || !_0x27a0b1.test('')) && _0x2cb479(_0x360043, '') : _0x2cb479(_0x360043, _0x51b27c(_0x289cbb, _0x53cd76)), _0x360043.length > _0x27df28 ? _0x51b27c(_0x360043, 0x0, _0x27df28) : _0x360043;
      };
    }() : '0'.split(void 0x0, 0x0).length && (String.prototype.split = function (_0xaecace, _0x451cd1) {
      return 'undefined' == typeof _0xaecace && 0x0 === _0x451cd1 ? [] : _0x28752a(this, _0xaecace, _0x451cd1);
    });
    var _0x5bc949 = function () {
      var _0x47fbe0 = [];
      return 'x'.replace(/x(.)?/g, function (_0x5a62fe, _0x52fc24) {
        _0x2cb479(_0x47fbe0, _0x52fc24);
      }), 0x1 === _0x47fbe0.length && "undefined" == typeof _0x47fbe0[0x0];
    }();
    _0x5bc949 || (String.prototype.replace = function (_0x1ccb66, _0x30988e) {
      var _0x37b1f5 = _0x2ebcce(_0x30988e),
        _0x27675b = _0x44eb8a(_0x1ccb66) && /\)[*?]/.test(_0x1ccb66.source);
      if (_0x37b1f5 && _0x27675b) {
        var _0x4d9443 = function (_0x2cbd4d) {
          var _0x16b389 = _0x1ccb66.lastIndex;
          _0x1ccb66.lastIndex = 0x0;
          var _0x8e1976 = _0x1ccb66.exec(_0x2cbd4d) || [];
          return _0x1ccb66.lastIndex = _0x16b389, _0x2cb479(_0x8e1976, arguments[arguments.length - 0x2], arguments[arguments.length - 0x1]), _0x30988e.apply(this, _0x8e1976);
        };
        return String.prototype.replace.call(this, _0x1ccb66, _0x4d9443);
      }
      return String.prototype.replace.call(this, _0x1ccb66, _0x30988e);
    });
    var _0x1d5fcf = ''.substr && 'b' !== '0b'.substr(-0x1);
    _0x4e1a09(String.prototype, {
      'substr': function (_0xf7788, _0x1d4741) {
        var _0x3b7d4c = _0xf7788;
        return 0x0 > _0xf7788 && (_0x3b7d4c = Math.max(this.length + _0xf7788, 0x0)), String.prototype.substr.call(this, _0x3b7d4c, _0x1d4741);
      }
    }, _0x1d5fcf);
    var _0x2b37c6 = "\t\n\f\r \xA0\u1680᠎\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029﻿",
      _0x524f13 = '[' + _0x2b37c6 + ']',
      _0xe773e8 = new RegExp('^' + _0x524f13 + _0x524f13 + '*'),
      _0x159b98 = new RegExp(_0x524f13 + _0x524f13 + '*$'),
      _0x5885ec = String.prototype.trim && (_0x2b37c6.trim() || !'​'.trim());
    _0x4e1a09(String.prototype, {
      'trim': function () {
        if ("undefined" == typeof this || null === this) throw new TypeError("can't convert " + this + " to object");
        return String(this).replace(_0xe773e8, '').replace(_0x159b98, '');
      }
    }, _0x5885ec);
    var _0x111e63 = String.prototype.lastIndexOf && -0x1 !== "abcあい".lastIndexOf('あい', 0x2);
    _0x4e1a09(String.prototype, {
      'lastIndexOf': function (_0x309000) {
        if ('undefined' == typeof this || null === this) throw new TypeError("can't convert " + this + " to object");
        for (var _0x28051e = String(this), _0x57b7f6 = String(_0x309000), _0x32a8aa = arguments.length > 0x1 ? Number(arguments[0x1]) : NaN, _0x44cb7b = _0x1f7cc0(_0x32a8aa) ? 0x1 / 0x0 : _0x4ebb1f.ToInteger(_0x32a8aa), _0x4cfe1a = Math.min(Math.max(_0x44cb7b, 0x0), _0x28051e.length), _0x348fc6 = _0x57b7f6.length, _0x523623 = _0x4cfe1a + _0x348fc6; _0x523623 > 0x0;) {
          _0x523623 = Math.max(0x0, _0x523623 - _0x348fc6);
          var _0x3beb2d = _0x4b4168(_0x51b27c(_0x28051e, _0x523623, _0x4cfe1a + _0x348fc6), _0x57b7f6);
          if (-0x1 !== _0x3beb2d) return _0x523623 + _0x3beb2d;
        }
        return -0x1;
      }
    }, _0x111e63);
    if (_0x4e1a09(String.prototype, {
      'lastIndexOf': function (_0x38fd09) {
        return String.prototype.lastIndexOf.apply(this, arguments);
      }
    }, 0x1 !== String.prototype.lastIndexOf.length), (0x8 !== parseInt(_0x2b37c6 + '08') || 0x16 !== parseInt(_0x2b37c6 + "0x16")) && (parseInt = function (_0x3cb00e) {
      return function (_0x571b4f, _0x1a2da8) {
        var _0xad78bc = String(_0x571b4f).trim(),
          _0x309173 = Number(_0x1a2da8) || (/^[\-+]?0[xX]/.test(_0xad78bc) ? 0x10 : 0xa);
        return _0x3cb00e(_0xad78bc, _0x309173);
      };
    }(parseInt)), "RangeError: test" !== String(new RangeError("test"))) {
      var _0x29e26e = function () {
        if ("undefined" == typeof this || null === this) throw new TypeError("can't convert " + this + '\x20to\x20object');
        var _0x5d088b = this.name;
        "undefined" == typeof _0x5d088b ? _0x5d088b = "Error" : "string" != typeof _0x5d088b && (_0x5d088b = String(_0x5d088b));
        var _0x2c1e9c = this.message;
        return "undefined" == typeof _0x2c1e9c ? _0x2c1e9c = '' : 'string' != typeof _0x2c1e9c && (_0x2c1e9c = String(_0x2c1e9c)), _0x5d088b ? _0x2c1e9c ? _0x5d088b + ':\x20' + _0x2c1e9c : _0x5d088b : _0x2c1e9c;
      };
      Error.prototype.toString = _0x29e26e;
    }
  }), function (_0xcbc9ce, _0x44ff63) {
    'use strict';

    'function' == typeof define && define.amd ? define(_0x44ff63) : "object" == typeof exports ? module.exports = _0x44ff63() : _0xcbc9ce.returnExports = _0x44ff63();
  }(this, function () {
    var _0x4f269f,
      _0xdf4e86,
      _0x58dd7e,
      _0x30abcb,
      _0x2d2a9a = Function.prototype.call.bind(Object.prototype.hasOwnProperty),
      _0xbc151a = Function.prototype.call.bind(Object.prototype.propertyIsEnumerable),
      _0x5036a7 = Function.prototype.call.bind(Object.prototype.toString),
      _0x166ca2 = _0x2d2a9a(Object.prototype, "__defineGetter__");
    _0x166ca2 && (_0x4f269f = Function.prototype.call.bind(Object.prototype.__defineGetter__), _0xdf4e86 = Function.prototype.call.bind(Object.prototype.__defineSetter__), _0x58dd7e = Function.prototype.call.bind(Object.prototype.__lookupGetter__), _0x30abcb = Function.prototype.call.bind(Object.prototype.__lookupSetter__)), Object.getPrototypeOf || (Object.getPrototypeOf = function (_0x2bce42) {
      var _0x33662f = _0x2bce42.__proto__;
      return _0x33662f || null === _0x33662f ? _0x33662f : "[object Function]" === _0x5036a7(_0x2bce42.constructor) ? _0x2bce42.constructor.prototype : _0x2bce42 instanceof Object ? Object.prototype : null;
    });
    var _0x45dd2e = function (_0x5c1ee8) {
      try {
        return _0x5c1ee8.sentinel = 0x0, 0x0 === Object.getOwnPropertyDescriptor(_0x5c1ee8, 'sentinel').value;
      } catch (_0x5af7ce) {
        return !0x1;
      }
    };
    if (Object.defineProperty) {
      var _0x2c8143 = _0x45dd2e({}),
        _0x12b2ee = "undefined" == typeof _0x198446 || _0x45dd2e(_0x198446.createElement("div"));
      if (!_0x12b2ee || !_0x2c8143) {}
    }
    if (!Object.getOwnPropertyDescriptor || Object.getOwnPropertyDescriptor) {
      Object.getOwnPropertyDescriptor = function (_0x3f7feb, _0x131bbc) {
        if ("object" != typeof _0x3f7feb && 'function' != typeof _0x3f7feb || null === _0x3f7feb) throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object: " + _0x3f7feb);
        if (Object.getOwnPropertyDescriptor) try {
          return Object.getOwnPropertyDescriptor.call(Object, _0x3f7feb, _0x131bbc);
        } catch (_0x39c5b2) {}
        var _0x19a275;
        if (!_0x2d2a9a(_0x3f7feb, _0x131bbc)) return _0x19a275;
        if (_0x19a275 = {
          'enumerable': _0xbc151a(_0x3f7feb, _0x131bbc),
          'configurable': !0x0
        }, _0x166ca2) {
          var _0x319b62 = _0x3f7feb.__proto__,
            _0x51868e = _0x3f7feb !== Object.prototype;
          _0x51868e && (_0x3f7feb.__proto__ = Object.prototype);
          var _0x176de2 = _0x58dd7e(_0x3f7feb, _0x131bbc),
            _0x2cda16 = _0x30abcb(_0x3f7feb, _0x131bbc);
          if (_0x51868e && (_0x3f7feb.__proto__ = _0x319b62), _0x176de2 || _0x2cda16) return _0x176de2 && (_0x19a275.get = _0x176de2), _0x2cda16 && (_0x19a275.set = _0x2cda16), _0x19a275;
        }
        return _0x19a275.value = _0x3f7feb[_0x131bbc], _0x19a275.writable = !0x0, _0x19a275;
      };
    }
    if (Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function (_0x3ad191) {
      return Object.keys(_0x3ad191);
    }), !Object.create) {
      var _0x4fb6a4,
        _0x5c6a09 = !({
          '__proto__': null
        } instanceof Object),
        _0x3238b8 = function () {
          if (!_0x198446.domain) return !0x1;
          try {
            return !!new ActiveXObject("htmlfile");
          } catch (_0x2b9aee) {
            return !0x1;
          }
        },
        _0x24c8f1 = function () {
          var _0xdf0742, _0xb7a9fb;
          return _0xb7a9fb = new ActiveXObject("htmlfile"), _0xb7a9fb.write("<script></script>"), _0xb7a9fb.close(), _0xdf0742 = _0xb7a9fb.parentWindow.Object.prototype, _0xb7a9fb = null, _0xdf0742;
        },
        _0x1b030f = function () {
          var _0x3c3c7f,
            _0x62af1e = _0x198446.createElement("iframe"),
            _0x23aaf4 = _0x198446.body || _0x198446.documentElement;
          return _0x62af1e.style.display = "none", _0x23aaf4.appendChild(_0x62af1e), _0x62af1e.src = "javascript:", _0x3c3c7f = _0x62af1e.contentWindow.Object.prototype, _0x23aaf4.removeChild(_0x62af1e), _0x62af1e = null, _0x3c3c7f;
        };
      _0x4fb6a4 = _0x5c6a09 || 'undefined' == typeof _0x198446 ? function () {
        return {
          '__proto__': null
        };
      } : function () {
        var _0x15e574 = _0x3238b8() ? _0x24c8f1() : _0x1b030f();
        delete _0x15e574.valueOf;
        var _0x411e14 = function () {};
        return _0x411e14.prototype = _0x15e574, _0x4fb6a4 = function () {
          return new _0x411e14();
        }, new _0x411e14();
      }, Object.create = function (_0x135bb8, _0x28e17d) {
        var _0x4900e3,
          _0x499f0c = function () {};
        if (null === _0x135bb8) _0x4900e3 = _0x4fb6a4();else {
          if ("object" != typeof _0x135bb8 && "function" != typeof _0x135bb8) throw new TypeError("Object prototype may only be an Object or null");
          _0x499f0c.prototype = _0x135bb8, _0x4900e3 = new _0x499f0c(), _0x4900e3.__proto__ = _0x135bb8;
        }
        return void 0x0 !== _0x28e17d && Object.defineProperties(_0x4900e3, _0x28e17d), _0x4900e3;
      };
    }
    var _0x471481 = function (_0x29db22) {
      try {
        return Object.defineProperty(_0x29db22, "sentinel", {}), "sentinel" in _0x29db22;
      } catch (_0x4b7078) {
        return !0x1;
      }
    };
    if (Object.defineProperty) {
      var _0x457b28 = _0x471481({}),
        _0x2e071a = "undefined" == typeof _0x198446 || _0x471481(_0x198446.createElement("div"));
      if (!_0x457b28 || !_0x2e071a) {}
    }
    if (!Object.defineProperty || Object.defineProperty) {
      Object.defineProperty = function (_0x31eec1, _0x3a829f, _0x55ed29) {
        if ('object' != typeof _0x31eec1 && "function" != typeof _0x31eec1 || null === _0x31eec1) throw new TypeError("Object.defineProperty called on non-object: " + _0x31eec1);
        if ("object" != typeof _0x55ed29 && "function" != typeof _0x55ed29 || null === _0x55ed29) throw new TypeError('Property\x20description\x20must\x20be\x20an\x20object:\x20' + _0x55ed29);
        if (Object.defineProperty) try {
          return Object.defineProperty.call(Object, _0x31eec1, _0x3a829f, _0x55ed29);
        } catch (_0x42c285) {}
        if ("value" in _0x55ed29) {
          if (_0x166ca2 && (_0x58dd7e(_0x31eec1, _0x3a829f) || _0x30abcb(_0x31eec1, _0x3a829f))) {
            var _0x8a8c4d = _0x31eec1.__proto__;
            _0x31eec1.__proto__ = Object.prototype, _0x31eec1[_0x3a829f] = _0x55ed29.value, _0x31eec1.__proto__ = _0x8a8c4d;
          } else _0x31eec1[_0x3a829f] = _0x55ed29.value;
        } else {
          if (!_0x166ca2 && ('get' in _0x55ed29 || "set" in _0x55ed29)) throw new TypeError('getters\x20&\x20setters\x20can\x20not\x20be\x20defined\x20on\x20this\x20javascript\x20engine');
          'get' in _0x55ed29 && _0x4f269f(_0x31eec1, _0x3a829f, _0x55ed29.get), "set" in _0x55ed29 && _0xdf4e86(_0x31eec1, _0x3a829f, _0x55ed29.set);
        }
        return _0x31eec1;
      };
    }
    (!Object.defineProperties || Object.defineProperties) && (Object.defineProperties = function (_0x5b1328, _0x500925) {
      if (Object.defineProperties) try {
        return Object.defineProperties.call(Object, _0x5b1328, _0x500925);
      } catch (_0x4abfee) {}
      return Object.keys(_0x500925).forEach(function (_0xc8c9a8) {
        '__proto__' !== _0xc8c9a8 && Object.defineProperty(_0x5b1328, _0xc8c9a8, _0x500925[_0xc8c9a8]);
      }), _0x5b1328;
    }), Object.seal || (Object.seal = function (_0x86da18) {
      if (_0x86da18 !== _0x86da18) throw new TypeError("Object.seal can only be called on Objects.");
      return _0x86da18;
    }), Object.freeze || (Object.freeze = function (_0x2d678f) {
      if (_0x2d678f !== _0x2d678f) throw new TypeError("Object.freeze can only be called on Objects.");
      return _0x2d678f;
    });
    try {
      Object.freeze(function () {});
    } catch (_0x1e79b2) {
      Object.freeze = function (_0x1fcbf7) {
        return function (_0x1b9053) {
          return "function" == typeof _0x1b9053 ? _0x1b9053 : _0x1fcbf7(_0x1b9053);
        };
      }(Object.freeze);
    }
    Object.preventExtensions || (Object.preventExtensions = function (_0x15dfa4) {
      if (_0x15dfa4 !== _0x15dfa4) throw new TypeError("Object.preventExtensions can only be called on Objects.");
      return _0x15dfa4;
    }), Object.isSealed || (Object.isSealed = function (_0x327cca) {
      if (_0x327cca !== _0x327cca) throw new TypeError("Object.isSealed can only be called on Objects.");
      return !0x1;
    }), Object.isFrozen || (Object.isFrozen = function (_0x3f2b10) {
      if (_0x3f2b10 !== _0x3f2b10) throw new TypeError("Object.isFrozen can only be called on Objects.");
      return !0x1;
    }), Object.isExtensible || (Object.isExtensible = function (_0x27c68d) {
      if (_0x27c68d !== _0x27c68d) throw new TypeError("Object.isExtensible can only be called on Objects.");
      for (var _0x5b958e = ''; _0x2d2a9a(_0x27c68d, '');) _0x5b958e += '?';
      _0x27c68d[_0x5b958e] = !0x0;
      var _0x58bcdc = _0x2d2a9a(_0x27c68d, _0x5b958e);
      return _0x58bcdc;
    });
  });
}(window, document), !function (_0x34d17d) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = _0x34d17d();else {
    if ("function" == typeof define && define.amd) define([], _0x34d17d);else {
      var _0x37f51d;
      _0x37f51d = 'undefined' != typeof window ? window : 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : this, _0x37f51d.videojs = _0x34d17d();
    }
  }
}(function () {
  var _0x329a5e;
  return function _0x256754(_0x1cf0d5, _0x320ba5, _0x5df874) {
    function _0x544147(_0x539732, _0x56a0dd) {
      if (!_0x320ba5[_0x539732]) {
        if (!_0x1cf0d5[_0x539732]) {
          var _0x2771d7 = 'function' == typeof require && require;
          if (!_0x56a0dd && _0x2771d7) return _0x2771d7(_0x539732, !0x0);
          if (_0x2a1405) return _0x2a1405(_0x539732, !0x0);
          var _0x60374a = new Error("Cannot find module '" + _0x539732 + '\x27');
          throw _0x60374a.code = "MODULE_NOT_FOUND", _0x60374a;
        }
        var _0x5e25d5 = _0x320ba5[_0x539732] = {
          'exports': {}
        };
        _0x1cf0d5[_0x539732][0x0].call(_0x5e25d5.exports, function (_0x2e90fa) {
          var _0x59de20 = _0x1cf0d5[_0x539732][0x1][_0x2e90fa];
          return _0x544147(_0x59de20 ? _0x59de20 : _0x2e90fa);
        }, _0x5e25d5, _0x5e25d5.exports, _0x256754, _0x1cf0d5, _0x320ba5, _0x5df874);
      }
      return _0x320ba5[_0x539732].exports;
    }
    for (var _0x2a1405 = "function" == typeof require && require, _0x5a930a = 0x0; 0x0 < _0x5df874.length; _0x5a930a++) _0x544147(_0x5df874[_0x5a930a]);
    return _0x544147;
  }({
    0x1: [function (_0xdf9239, _0x405a89) {
      (function (_0x3e4af0) {
        var _0x5d4400 = "undefined" != typeof _0x3e4af0 ? _0x3e4af0 : "undefined" != typeof window ? window : {},
          _0x188908 = _0xdf9239("min-document");
        if ("undefined" != typeof document) _0x405a89.exports = document;else {
          var _0x4ac723 = _0x5d4400["__GLOBAL_DOCUMENT_CACHE@4"];
          _0x4ac723 || (_0x4ac723 = _0x5d4400["__GLOBAL_DOCUMENT_CACHE@4"] = _0x188908), _0x405a89.exports = _0x4ac723;
        }
      }).call(this, 'undefined' != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      'min-document': 0x3
    }],
    0x2: [function (_0x4b4c55, _0x3e94ac) {
      (function (_0x4a365b) {
        _0x3e94ac.exports = "undefined" != typeof window ? window : "undefined" != typeof _0x4a365b ? _0x4a365b : 'undefined' != typeof self ? self : {};
      }).call(this, "undefined" != typeof global ? global : 'undefined' != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    0x3: [function () {}, {}],
    0x4: [function (_0xa2d733, _0x260e44) {
      var _0x49222f = _0xa2d733("../internal/getNative"),
        _0x3a4732 = _0x49222f(Date, "now"),
        _0xd90dcf = _0x3a4732 || function () {
          return new Date().getTime();
        };
      _0x260e44.exports = _0xd90dcf;
    }, {
      '../internal/getNative': 0x14
    }],
    0x5: [function (_0x13b5e1, _0xfd96c7) {
      function _0x36f901(_0x46656d, _0x326180, _0xce0484) {
        function _0x141462() {
          _0x192a37 && clearTimeout(_0x192a37), _0x4c6c6b && clearTimeout(_0x4c6c6b), _0x5d00c5 = 0x0, _0x4c6c6b = _0x192a37 = _0x54704f = void 0x0;
        }
        function _0x5831e1(_0x27da09, _0x11628c) {
          _0x11628c && clearTimeout(_0x11628c), _0x4c6c6b = _0x192a37 = _0x54704f = void 0x0, _0x27da09 && (_0x5d00c5 = _0x1bf912(), _0x3ab46c = _0x46656d.apply(_0x790dc3, _0x41974f), _0x192a37 || _0x4c6c6b || (_0x41974f = _0x790dc3 = void 0x0));
        }
        function _0x5b1b29() {
          var _0x1b2325 = _0x326180 - (_0x1bf912() - _0x1a6124);
          0x0 >= _0x1b2325 || _0x1b2325 > _0x326180 ? _0x5831e1(_0x54704f, _0x4c6c6b) : _0x192a37 = setTimeout(_0x5b1b29, _0x1b2325);
        }
        function _0x1ed5bb() {
          _0x5831e1(_0x314deb, _0x192a37);
        }
        function _0x27a7cd() {
          if (_0x41974f = arguments, _0x1a6124 = _0x1bf912(), _0x790dc3 = this, _0x54704f = _0x314deb && (_0x192a37 || !_0x2d19d3), _0x49105c === !0x1) var _0x24f06f = _0x2d19d3 && !_0x192a37;else {
            _0x4c6c6b || _0x2d19d3 || (_0x5d00c5 = _0x1a6124);
            var _0x14cc8c = _0x49105c - (_0x1a6124 - _0x5d00c5),
              _0xb59050 = 0x0 >= _0x14cc8c || _0x14cc8c > _0x49105c;
            _0xb59050 ? (_0x4c6c6b && (_0x4c6c6b = clearTimeout(_0x4c6c6b)), _0x5d00c5 = _0x1a6124, _0x3ab46c = _0x46656d.apply(_0x790dc3, _0x41974f)) : _0x4c6c6b || (_0x4c6c6b = setTimeout(_0x1ed5bb, _0x14cc8c));
          }
          return _0xb59050 && _0x192a37 ? _0x192a37 = clearTimeout(_0x192a37) : _0x192a37 || _0x326180 === _0x49105c || (_0x192a37 = setTimeout(_0x5b1b29, _0x326180)), _0x24f06f && (_0xb59050 = !0x0, _0x3ab46c = _0x46656d.apply(_0x790dc3, _0x41974f)), !_0xb59050 || _0x192a37 || _0x4c6c6b || (_0x41974f = _0x790dc3 = void 0x0), _0x3ab46c;
        }
        var _0x41974f,
          _0x4c6c6b,
          _0x3ab46c,
          _0x1a6124,
          _0x790dc3,
          _0x192a37,
          _0x54704f,
          _0x5d00c5 = 0x0,
          _0x49105c = !0x1,
          _0x314deb = !0x0;
        if ("function" != typeof _0x46656d) throw new TypeError(_0x50f303);
        if (_0x326180 = 0x0 > _0x326180 ? 0x0 : +_0x326180 || 0x0, _0xce0484 === !0x0) {
          var _0x2d19d3 = !0x0;
          _0x314deb = !0x1;
        } else _0x47bb75(_0xce0484) && (_0x2d19d3 = !!_0xce0484.leading, _0x49105c = "maxWait" in _0xce0484 && _0x5214d6(+_0xce0484.maxWait || 0x0, _0x326180), _0x314deb = "trailing" in _0xce0484 ? !!_0xce0484.trailing : _0x314deb);
        return _0x27a7cd.cancel = _0x141462, _0x27a7cd;
      }
      var _0x47bb75 = _0x13b5e1("../lang/isObject"),
        _0x1bf912 = _0x13b5e1("../date/now"),
        _0x50f303 = "Expected a function",
        _0x5214d6 = Math.max;
      _0xfd96c7.exports = _0x36f901;
    }, {
      '../date/now': 0x4,
      '../lang/isObject': 0x21
    }],
    0x6: [function (_0x165e66, _0x2b3869) {
      function _0x57bab2(_0x163073, _0x1fbeeb) {
        if ("function" != typeof _0x163073) throw new TypeError(_0x1e6bc5);
        return _0x1fbeeb = _0x227916(void 0x0 === _0x1fbeeb ? _0x163073.length - 0x1 : +_0x1fbeeb || 0x0, 0x0), function () {
          for (var _0x11c06b = arguments, _0x582b19 = -0x1, _0x2e4fac = _0x227916(arguments.length - _0x1fbeeb, 0x0), _0x1fc0e6 = Array(_0x2e4fac); ++_0x582b19 < _0x2e4fac;) _0x1fc0e6[_0x582b19] = arguments[_0x1fbeeb + _0x582b19];
          switch (_0x1fbeeb) {
            case 0x0:
              return _0x163073.call(this, _0x1fc0e6);
            case 0x1:
              return _0x163073.call(this, arguments[0x0], _0x1fc0e6);
            case 0x2:
              return _0x163073.call(this, arguments[0x0], arguments[0x1], _0x1fc0e6);
          }
          var _0x1f5a3d = Array(_0x1fbeeb + 0x1);
          for (_0x582b19 = -0x1; ++_0x582b19 < _0x1fbeeb;) _0x1f5a3d[_0x582b19] = arguments[_0x582b19];
          return _0x1f5a3d[_0x1fbeeb] = _0x1fc0e6, _0x163073.apply(this, _0x1f5a3d);
        };
      }
      var _0x1e6bc5 = 'Expected\x20a\x20function',
        _0x227916 = Math.max;
      _0x2b3869.exports = _0x57bab2;
    }, {}],
    0x7: [function (_0x58d228, _0x3d4bc4) {
      function _0x39e7d9(_0x4bb743, _0x2ab1bf, _0x30d4b7) {
        var _0xec4c94 = !0x0;
        if ('function' != typeof _0x4bb743) throw new TypeError(_0x1469a9);
        return _0x30d4b7 === !0x1 ? _0xec4c94 = !0x1 : _0x28a7f1(_0x30d4b7) && (_0xec4c94 = "leading" in _0x30d4b7 ? !!_0x30d4b7.leading : _0xec4c94, _0x22d9d3 = "trailing" in _0x30d4b7 ? !!_0x30d4b7.trailing : !0x0), _0x59eafa(_0x4bb743, _0x2ab1bf, {
          'leading': _0xec4c94,
          'maxWait': +_0x2ab1bf,
          'trailing': _0x22d9d3
        });
      }
      var _0x59eafa = _0x58d228('./debounce'),
        _0x28a7f1 = _0x58d228("../lang/isObject"),
        _0x1469a9 = "Expected a function";
      _0x3d4bc4.exports = _0x39e7d9;
    }, {
      '../lang/isObject': 0x21,
      './debounce': 0x5
    }],
    0x8: [function (_0x843817, _0x425145) {
      function _0xd03c81(_0x5401c6, _0x19c0ff) {
        var _0x18be9b = -0x1,
          _0x15844a = _0x5401c6.length;
        for (_0x19c0ff || (_0x19c0ff = Array(_0x15844a)); ++_0x18be9b < _0x15844a;) _0x19c0ff[_0x18be9b] = _0x5401c6[_0x18be9b];
        return _0x19c0ff;
      }
      _0x425145.exports = _0xd03c81;
    }, {}],
    0x9: [function (_0x507214, _0xdc530f) {
      function _0x59b605(_0x141b6c, _0x4c6590) {
        for (var _0x266baf = -0x1, _0x4b4ab2 = _0x141b6c.length; ++_0x266baf < _0x4b4ab2 && _0x4c6590(_0x141b6c[_0x266baf], _0x266baf, _0x141b6c) !== !0x1;);
        return _0x141b6c;
      }
      _0xdc530f.exports = _0x59b605;
    }, {}],
    0xa: [function (_0x28d1e2, _0x2c2b1c) {
      function _0xff67d7(_0x1e2fdd, _0x3ea5ee, _0x395802) {
        _0x395802 || (_0x395802 = {});
        for (var _0x540646 = -0x1, _0x40e386 = _0x3ea5ee.length; ++_0x540646 < _0x40e386;) {
          var _0x4570ed = _0x3ea5ee[_0x540646];
          _0x395802[_0x4570ed] = _0x1e2fdd[_0x4570ed];
        }
        return _0x395802;
      }
      _0x2c2b1c.exports = _0xff67d7;
    }, {}],
    0xb: [function (_0x4565ee, _0x238da3) {
      var _0x1920ba = _0x4565ee("./createBaseFor"),
        _0x4297e5 = _0x1920ba();
      _0x238da3.exports = _0x4297e5;
    }, {
      './createBaseFor': 0x12
    }],
    0xc: [function (_0x485328, _0x5d4027) {
      function _0x40bbf1(_0x1d1fa3, _0x8080a9) {
        return _0x2d4d04(_0x1d1fa3, _0x8080a9, _0xe859a9);
      }
      var _0x2d4d04 = _0x485328('./baseFor'),
        _0xe859a9 = _0x485328('../object/keysIn');
      _0x5d4027.exports = _0x40bbf1;
    }, {
      '../object/keysIn': 0x27,
      './baseFor': 0xb
    }],
    0xd: [function (_0x52476d, _0x596099) {
      function _0x49e777(_0x56a395, _0x401d28, _0x2de0ab, _0x5b47d9, _0x548eb2) {
        if (!_0x3122c5(_0x56a395)) return _0x56a395;
        var _0x246ea4 = _0x18bde5(_0x401d28) && (_0x1da899(_0x401d28) || _0x302c17(_0x401d28)),
          _0x47b53e = _0x246ea4 ? void 0x0 : _0x487e70(_0x401d28);
        return _0x552d5b(_0x47b53e || _0x401d28, function (_0x5bba92, _0x419232) {
          if (_0x47b53e && (_0x419232 = _0x5bba92, _0x5bba92 = _0x401d28[_0x419232]), _0x4948eb(_0x5bba92)) _0x5b47d9 || (_0x5b47d9 = []), _0x548eb2 || (_0x548eb2 = []), _0x3c19c9(_0x56a395, _0x401d28, _0x419232, _0x49e777, _0x2de0ab, _0x5b47d9, _0x548eb2);else {
            var _0x29e1ca = _0x56a395[_0x419232],
              _0x2d2055 = _0x2de0ab ? _0x2de0ab(_0x29e1ca, _0x5bba92, _0x419232, _0x56a395, _0x401d28) : void 0x0,
              _0x7e4ff6 = void 0x0 === _0x2d2055;
            _0x7e4ff6 && (_0x2d2055 = _0x5bba92), void 0x0 === _0x2d2055 && (!_0x246ea4 || _0x419232 in _0x56a395) || !_0x7e4ff6 && (_0x2d2055 === _0x2d2055 ? _0x2d2055 === _0x29e1ca : _0x29e1ca !== _0x29e1ca) || (_0x56a395[_0x419232] = _0x2d2055);
          }
        }), _0x56a395;
      }
      var _0x552d5b = _0x52476d("./arrayEach"),
        _0x3c19c9 = _0x52476d("./baseMergeDeep"),
        _0x1da899 = _0x52476d("../lang/isArray"),
        _0x18bde5 = _0x52476d("./isArrayLike"),
        _0x3122c5 = _0x52476d('../lang/isObject'),
        _0x4948eb = _0x52476d("./isObjectLike"),
        _0x302c17 = _0x52476d('../lang/isTypedArray'),
        _0x487e70 = _0x52476d("../object/keys");
      _0x596099.exports = _0x49e777;
    }, {
      '../lang/isArray': 0x1e,
      '../lang/isObject': 0x21,
      '../lang/isTypedArray': 0x24,
      '../object/keys': 0x26,
      './arrayEach': 0x9,
      './baseMergeDeep': 0xe,
      './isArrayLike': 0x15,
      './isObjectLike': 0x1a
    }],
    0xe: [function (_0x43d730, _0x561831) {
      function _0x2fa0f5(_0x7095ec, _0x29af06, _0x22e31a, _0xe23885, _0x347bca, _0x5c4b94, _0x213b68) {
        for (var _0x5a969a = _0x5c4b94.length, _0x5c5aba = _0x29af06[_0x22e31a]; _0x5a969a--;) if (_0x5c4b94[_0x5a969a] == _0x5c5aba) return void (_0x7095ec[_0x22e31a] = _0x213b68[_0x5a969a]);
        var _0x14f394 = _0x7095ec[_0x22e31a],
          _0x3c73b0 = _0x347bca ? _0x347bca(_0x14f394, _0x5c5aba, _0x22e31a, _0x7095ec, _0x29af06) : void 0x0,
          _0x24999e = void 0x0 === _0x3c73b0;
        _0x24999e && (_0x3c73b0 = _0x5c5aba, _0x1ab12d(_0x5c5aba) && (_0x535779(_0x5c5aba) || _0x439834(_0x5c5aba)) ? _0x3c73b0 = _0x535779(_0x14f394) ? _0x14f394 : _0x1ab12d(_0x14f394) ? _0x5a6a0e(_0x14f394) : [] : _0x10f923(_0x5c5aba) || _0x254cd6(_0x5c5aba) ? _0x3c73b0 = _0x254cd6(_0x14f394) ? _0x53b316(_0x14f394) : _0x10f923(_0x14f394) ? _0x14f394 : {} : _0x24999e = !0x1), _0x5c4b94.push(_0x5c5aba), _0x213b68.push(_0x3c73b0), _0x24999e ? _0x7095ec[_0x22e31a] = _0xe23885(_0x3c73b0, _0x5c5aba, _0x347bca, _0x5c4b94, _0x213b68) : (_0x3c73b0 === _0x3c73b0 ? _0x3c73b0 !== _0x14f394 : _0x14f394 === _0x14f394) && (_0x7095ec[_0x22e31a] = _0x3c73b0);
      }
      var _0x5a6a0e = _0x43d730("./arrayCopy"),
        _0x254cd6 = _0x43d730('../lang/isArguments'),
        _0x535779 = _0x43d730("../lang/isArray"),
        _0x1ab12d = _0x43d730("./isArrayLike"),
        _0x10f923 = _0x43d730("../lang/isPlainObject"),
        _0x439834 = _0x43d730("../lang/isTypedArray"),
        _0x53b316 = _0x43d730("../lang/toPlainObject");
      _0x561831.exports = _0x2fa0f5;
    }, {
      '../lang/isArguments': 0x1d,
      '../lang/isArray': 0x1e,
      '../lang/isPlainObject': 0x22,
      '../lang/isTypedArray': 0x24,
      '../lang/toPlainObject': 0x25,
      './arrayCopy': 0x8,
      './isArrayLike': 0x15
    }],
    0xf: [function (_0x19029b, _0x5d4154) {
      function _0x2fd8b6(_0x88ac6f) {
        return function (_0xb763a9) {
          return null == _0xb763a9 ? void 0x0 : _0x2215e4(_0xb763a9)[_0x88ac6f];
        };
      }
      var _0x2215e4 = _0x19029b('./toObject');
      _0x5d4154.exports = _0x2fd8b6;
    }, {
      './toObject': 0x1c
    }],
    0x10: [function (_0x22ce1c, _0x5e6946) {
      function _0x1275b1(_0x5d80ba, _0x9699d5, _0x54acda) {
        if ('function' != typeof _0x5d80ba) return _0x5ce2ec;
        if (void 0x0 === _0x9699d5) return _0x5d80ba;
        switch (_0x54acda) {
          case 0x1:
            return function (_0x9984b8) {
              return _0x5d80ba.call(_0x9699d5, _0x9984b8);
            };
          case 0x3:
            return function (_0x46c54c, _0x382699, _0x5c2432) {
              return _0x5d80ba.call(_0x9699d5, _0x46c54c, _0x382699, _0x5c2432);
            };
          case 0x4:
            return function (_0x49da9e, _0x56e62b, _0x33e07c, _0x1a8594) {
              return _0x5d80ba.call(_0x9699d5, _0x49da9e, _0x56e62b, _0x33e07c, _0x1a8594);
            };
          case 0x5:
            return function (_0x5ec0a1, _0x278f4b, _0x4b0fb9, _0x4634ae, _0x66d945) {
              return _0x5d80ba.call(_0x9699d5, _0x5ec0a1, _0x278f4b, _0x4b0fb9, _0x4634ae, _0x66d945);
            };
        }
        return function () {
          return _0x5d80ba.apply(_0x9699d5, arguments);
        };
      }
      var _0x5ce2ec = _0x22ce1c("../utility/identity");
      _0x5e6946.exports = _0x1275b1;
    }, {
      '../utility/identity': 0x2a
    }],
    0x11: [function (_0x3532ec, _0x169405) {
      function _0x21abf6(_0x2a016a) {
        return _0x320b0d(function (_0x2ba306, _0x302bee) {
          var _0x316d40 = -0x1,
            _0x4806c8 = null == _0x2ba306 ? 0x0 : _0x302bee.length,
            _0x42d5fb = _0x4806c8 > 0x2 ? _0x302bee[_0x4806c8 - 0x2] : void 0x0,
            _0x1ef212 = _0x4806c8 > 0x2 ? _0x302bee[0x2] : void 0x0,
            _0x212c28 = _0x4806c8 > 0x1 ? _0x302bee[_0x4806c8 - 0x1] : void 0x0;
          for ('function' == typeof _0x42d5fb ? (_0x42d5fb = _0x357de(_0x42d5fb, _0x212c28, 0x5), _0x4806c8 -= 0x2) : (_0x42d5fb = "function" == typeof _0x212c28 ? _0x212c28 : void 0x0, _0x4806c8 -= _0x42d5fb ? 0x1 : 0x0), _0x1ef212 && _0x4da15d(_0x302bee[0x0], _0x302bee[0x1], _0x1ef212) && (_0x42d5fb = 0x3 > _0x4806c8 ? void 0x0 : _0x42d5fb, _0x4806c8 = 0x1); ++_0x316d40 < _0x4806c8;) {
            var _0x599aa4 = _0x302bee[_0x316d40];
            _0x599aa4 && _0x2a016a(_0x2ba306, _0x599aa4, _0x42d5fb);
          }
          return _0x2ba306;
        });
      }
      var _0x357de = _0x3532ec('./bindCallback'),
        _0x4da15d = _0x3532ec("./isIterateeCall"),
        _0x320b0d = _0x3532ec("../function/restParam");
      _0x169405.exports = _0x21abf6;
    }, {
      '../function/restParam': 0x6,
      './bindCallback': 0x10,
      './isIterateeCall': 0x18
    }],
    0x12: [function (_0x5e66b8, _0x3178c8) {
      function _0x3d4543(_0x11fa4a) {
        return function (_0x41af03, _0x4b9bc0, _0x5790dc) {
          for (var _0x3ed0d8 = _0x4510fd(_0x41af03), _0x2d7096 = _0x5790dc(_0x41af03), _0x42fa40 = _0x2d7096.length, _0x3c0a07 = _0x11fa4a ? _0x42fa40 : -0x1; _0x11fa4a ? _0x3c0a07-- : ++_0x3c0a07 < _0x42fa40;) {
            var _0x45e5ac = _0x2d7096[_0x3c0a07];
            if (_0x4b9bc0(_0x3ed0d8[_0x45e5ac], _0x45e5ac, _0x3ed0d8) === !0x1) break;
          }
          return _0x41af03;
        };
      }
      var _0x4510fd = _0x5e66b8('./toObject');
      _0x3178c8.exports = _0x3d4543;
    }, {
      './toObject': 0x1c
    }],
    0x13: [function (_0x2bcf0b, _0x495071) {
      var _0x113e2f = _0x2bcf0b('./baseProperty'),
        _0x1b2b09 = _0x113e2f("length");
      _0x495071.exports = _0x1b2b09;
    }, {
      './baseProperty': 0xf
    }],
    0x14: [function (_0x2802c9, _0x208529) {
      function _0x6e5dc5(_0x2dcd89, _0x4b8243) {
        var _0x3baa6c = null == _0x2dcd89 ? void 0x0 : _0x2dcd89[_0x4b8243];
        return _0x34b63f(_0x3baa6c) ? _0x3baa6c : void 0x0;
      }
      var _0x34b63f = _0x2802c9("../lang/isNative");
      _0x208529.exports = _0x6e5dc5;
    }, {
      '../lang/isNative': 0x20
    }],
    0x15: [function (_0x348ea7, _0x45bc48) {
      function _0x5e52d7(_0x2971bc) {
        return null != _0x2971bc && _0x5364e1(_0x575deb(_0x2971bc));
      }
      var _0x575deb = _0x348ea7("./getLength"),
        _0x5364e1 = _0x348ea7("./isLength");
      _0x45bc48.exports = _0x5e52d7;
    }, {
      './getLength': 0x13,
      './isLength': 0x19
    }],
    0x16: [function (_0x4467b1, _0x2efd2e) {
      var _0x439408 = function () {
        try {
          Object({
            'toString': 0x0
          } + '');
        } catch (_0x3dc0c5) {
          return function () {
            return !0x1;
          };
        }
        return function (_0x43cc24) {
          return "function" != typeof _0x43cc24.toString && "string" == typeof (_0x43cc24 + '');
        };
      }();
      _0x2efd2e.exports = _0x439408;
    }, {}],
    0x17: [function (_0x507d54, _0xf184ec) {
      function _0x31d061(_0xac231, _0x42a94e) {
        return _0xac231 = 'number' == typeof _0xac231 || _0x4a0785.test(_0xac231) ? +_0xac231 : -0x1, _0x42a94e = null == _0x42a94e ? _0x7047b8 : _0x42a94e, _0xac231 > -0x1 && _0xac231 % 0x1 == 0x0 && _0x42a94e > _0xac231;
      }
      var _0x4a0785 = /^\d+$/,
        _0x7047b8 = 0x1fffffffffffff;
      _0xf184ec.exports = _0x31d061;
    }, {}],
    0x18: [function (_0x17281b, _0x21221f) {
      function _0x369009(_0x43d19a, _0x103f50, _0x18b483) {
        if (!_0x138754(_0x18b483)) return !0x1;
        var _0x3cd410 = typeof _0x103f50;
        if ("number" == _0x3cd410 ? _0x36c142(_0x18b483) && _0x5f56e8(_0x103f50, _0x18b483.length) : "string" == _0x3cd410 && _0x103f50 in _0x18b483) {
          var _0x40c4b4 = _0x18b483[_0x103f50];
          return _0x43d19a === _0x43d19a ? _0x43d19a === _0x40c4b4 : _0x40c4b4 !== _0x40c4b4;
        }
        return !0x1;
      }
      var _0x36c142 = _0x17281b('./isArrayLike'),
        _0x5f56e8 = _0x17281b("./isIndex"),
        _0x138754 = _0x17281b('../lang/isObject');
      _0x21221f.exports = _0x369009;
    }, {
      '../lang/isObject': 0x21,
      './isArrayLike': 0x15,
      './isIndex': 0x17
    }],
    0x19: [function (_0x21a4c0, _0x3292d9) {
      function _0x32b9e8(_0x21e6a8) {
        return 'number' == typeof _0x21e6a8 && _0x21e6a8 > -0x1 && _0x21e6a8 % 0x1 == 0x0 && _0x422051 >= _0x21e6a8;
      }
      var _0x422051 = 0x1fffffffffffff;
      _0x3292d9.exports = _0x32b9e8;
    }, {}],
    0x1a: [function (_0x431617, _0x56ec9c) {
      function _0x3bb39e(_0x3b950e) {
        return !!_0x3b950e && "object" == typeof _0x3b950e;
      }
      _0x56ec9c.exports = _0x3bb39e;
    }, {}],
    0x1b: [function (_0xc7ef6d, _0x231cda) {
      function _0x323ef5(_0x2d32ec) {
        for (var _0x4ea960 = _0xa28a4d(_0x2d32ec), _0x38233e = _0x4ea960.length, _0x5de79e = _0x38233e && _0x2d32ec.length, _0x3e31a2 = !!_0x5de79e && _0x4f9b81(_0x5de79e) && (_0x463625(_0x2d32ec) || _0x51522b(_0x2d32ec) || _0x116d4b(_0x2d32ec)), _0x291758 = -0x1, _0x31508b = []; ++_0x291758 < _0x38233e;) {
          var _0x1c8987 = _0x4ea960[_0x291758];
          (_0x3e31a2 && _0x1f5811(_0x1c8987, _0x5de79e) || _0x403544.call(_0x2d32ec, _0x1c8987)) && _0x31508b.push(_0x1c8987);
        }
        return _0x31508b;
      }
      var _0x51522b = _0xc7ef6d("../lang/isArguments"),
        _0x463625 = _0xc7ef6d("../lang/isArray"),
        _0x1f5811 = _0xc7ef6d("./isIndex"),
        _0x4f9b81 = _0xc7ef6d('./isLength'),
        _0x116d4b = _0xc7ef6d('../lang/isString'),
        _0xa28a4d = _0xc7ef6d("../object/keysIn"),
        _0x403544 = Object.prototype.hasOwnProperty;
      _0x231cda.exports = _0x323ef5;
    }, {
      '../lang/isArguments': 0x1d,
      '../lang/isArray': 0x1e,
      '../lang/isString': 0x23,
      '../object/keysIn': 0x27,
      './isIndex': 0x17,
      './isLength': 0x19
    }],
    0x1c: [function (_0x54cb9b, _0x33af76) {
      function _0xe6c88(_0x513e59) {
        if (_0x5913fe.unindexedChars && _0x3407dc(_0x513e59)) {
          for (var _0x1dc5f0 = -0x1, _0x34a7b1 = _0x513e59.length, _0x2040d3 = _0x513e59; ++_0x1dc5f0 < _0x34a7b1;) _0x2040d3[_0x1dc5f0] = _0x513e59.charAt(_0x1dc5f0);
          return _0x2040d3;
        }
        return _0x58d015(_0x513e59) ? _0x513e59 : _0x513e59;
      }
      var _0x58d015 = _0x54cb9b("../lang/isObject"),
        _0x3407dc = _0x54cb9b("../lang/isString"),
        _0x5913fe = _0x54cb9b("../support");
      _0x33af76.exports = _0xe6c88;
    }, {
      '../lang/isObject': 0x21,
      '../lang/isString': 0x23,
      '../support': 0x29
    }],
    0x1d: [function (_0x48a7d4, _0x419066) {
      function _0x42b18c(_0x3fe120) {
        return _0x5842d7(_0x3fe120) && _0x23e0d1(_0x3fe120) && _0x16a835.call(_0x3fe120, 'callee') && !_0x466a2a.call(_0x3fe120, "callee");
      }
      var _0x23e0d1 = _0x48a7d4("../internal/isArrayLike"),
        _0x5842d7 = _0x48a7d4("../internal/isObjectLike"),
        _0x16a835 = Object.prototype.hasOwnProperty,
        _0x466a2a = Object.prototype.propertyIsEnumerable;
      _0x419066.exports = _0x42b18c;
    }, {
      '../internal/isArrayLike': 0x15,
      '../internal/isObjectLike': 0x1a
    }],
    0x1e: [function (_0xbbf107, _0x4919a4) {
      var _0x4575ef = _0xbbf107('../internal/getNative'),
        _0x5474a1 = _0xbbf107('../internal/isLength'),
        _0x42701b = _0xbbf107('../internal/isObjectLike'),
        _0x420fbb = _0x4575ef(Array, 'isArray'),
        _0x40245 = _0x420fbb || function (_0x616ef) {
          return _0x42701b(_0x616ef) && _0x5474a1(_0x616ef.length) && Object.prototype.toString.call(_0x616ef) == "[object Array]";
        };
      _0x4919a4.exports = _0x40245;
    }, {
      '../internal/getNative': 0x14,
      '../internal/isLength': 0x19,
      '../internal/isObjectLike': 0x1a
    }],
    0x1f: [function (_0x3cf1c0, _0x1890e3) {
      function _0x3ba007(_0x1af7f0) {
        return _0x38d7cb(_0x1af7f0) && _0x1a5766.call(_0x1af7f0) == _0x29228a;
      }
      var _0x38d7cb = _0x3cf1c0("./isObject"),
        _0x29228a = "[object Function]",
        _0x1a5766 = Object.prototype.toString;
      _0x1890e3.exports = _0x3ba007;
    }, {
      './isObject': 0x21
    }],
    0x20: [function (_0x290b8e, _0x10e374) {
      function _0x54591f(_0x85ade1) {
        return null == _0x85ade1 ? !0x1 : _0x21c84d(_0x85ade1) ? _0x51f5ff.test(Function.prototype.toString.call(_0x85ade1)) : _0x2db48f(_0x85ade1) && (_0xd3d5b3(_0x85ade1) ? _0x51f5ff : _0x3aa075).test(_0x85ade1);
      }
      var _0x21c84d = _0x290b8e("./isFunction"),
        _0xd3d5b3 = _0x290b8e("../internal/isHostObject"),
        _0x2db48f = _0x290b8e("../internal/isObjectLike"),
        _0x3aa075 = /^\[object .+?Constructor\]$/,
        _0x51f5ff = RegExp('^' + Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + '$');
      _0x10e374.exports = _0x54591f;
    }, {
      '../internal/isHostObject': 0x16,
      '../internal/isObjectLike': 0x1a,
      './isFunction': 0x1f
    }],
    0x21: [function (_0x1409e0, _0x4cb947) {
      function _0x5d2b9d(_0x72d7bc) {
        var _0x545f17 = typeof _0x72d7bc;
        return !!_0x72d7bc && ('object' == _0x545f17 || "function" == _0x545f17);
      }
      _0x4cb947.exports = _0x5d2b9d;
    }, {}],
    0x22: [function (_0x239451, _0x138e6c) {
      function _0x46fee4(_0x2e5280) {
        var _0x5d9a22;
        if (!_0x3c8cdc(_0x2e5280) || _0x113905.call(_0x2e5280) != _0x39feb1 || _0x487157(_0x2e5280) || _0x380879(_0x2e5280) || !_0x277295.call(_0x2e5280, "constructor") && (_0x5d9a22 = _0x2e5280.constructor, 'function' == typeof _0x5d9a22 && !(_0x5d9a22 instanceof _0x5d9a22))) return !0x1;
        var _0x58e501;
        return _0x5b1633.ownLast ? (_0x2e7863(_0x2e5280, function (_0x5d6580, _0x24e312, _0x3e393b) {
          return _0x58e501 = _0x277295.call(_0x3e393b, _0x24e312), !0x1;
        }), _0x58e501 !== !0x1) : (_0x2e7863(_0x2e5280, function (_0x2f6c1e, _0x18c90b) {
          _0x58e501 = _0x18c90b;
        }), void 0x0 === _0x58e501 || _0x277295.call(_0x2e5280, _0x58e501));
      }
      var _0x2e7863 = _0x239451("../internal/baseForIn"),
        _0x380879 = _0x239451("./isArguments"),
        _0x487157 = _0x239451("../internal/isHostObject"),
        _0x3c8cdc = _0x239451("../internal/isObjectLike"),
        _0x5b1633 = _0x239451('../support'),
        _0x39feb1 = "[object Object]",
        _0x277295 = Object.prototype.hasOwnProperty,
        _0x113905 = Object.prototype.toString;
      _0x138e6c.exports = _0x46fee4;
    }, {
      '../internal/baseForIn': 0xc,
      '../internal/isHostObject': 0x16,
      '../internal/isObjectLike': 0x1a,
      '../support': 0x29,
      './isArguments': 0x1d
    }],
    0x23: [function (_0x571595, _0x12e480) {
      function _0x34f7db(_0x871be1) {
        return "string" == typeof _0x871be1 || _0x427ae1(_0x871be1) && _0x87e2f9.call(_0x871be1) == _0x124125;
      }
      var _0x427ae1 = _0x571595("../internal/isObjectLike"),
        _0x124125 = "[object String]",
        _0x87e2f9 = Object.prototype.toString;
      _0x12e480.exports = _0x34f7db;
    }, {
      '../internal/isObjectLike': 0x1a
    }],
    0x24: [function (_0x4e5903, _0x3bce86) {
      function _0x3c8262(_0x55977e) {
        return _0x39df3a(_0x55977e) && _0x5aaed4(_0x55977e.length) && !!_0x116d26[_0xa34c8b.call(_0x55977e)];
      }
      var _0x5aaed4 = _0x4e5903("../internal/isLength"),
        _0x39df3a = _0x4e5903("../internal/isObjectLike"),
        _0x116d26 = {};
      _0x116d26["[object Float32Array]"] = _0x116d26["[object Float64Array]"] = _0x116d26["[object Int8Array]"] = _0x116d26["[object Int16Array]"] = _0x116d26['[object\x20Int32Array]'] = _0x116d26["[object Uint8Array]"] = _0x116d26['[object\x20Uint8ClampedArray]'] = _0x116d26['[object\x20Uint16Array]'] = _0x116d26['[object\x20Uint32Array]'] = !0x0, _0x116d26["[object Arguments]"] = _0x116d26["[object Array]"] = _0x116d26['[object\x20ArrayBuffer]'] = _0x116d26["[object Boolean]"] = _0x116d26["[object Date]"] = _0x116d26['[object\x20Error]'] = _0x116d26["[object Function]"] = _0x116d26["[object Map]"] = _0x116d26['[object\x20Number]'] = _0x116d26["[object Object]"] = _0x116d26["[object RegExp]"] = _0x116d26["[object Set]"] = _0x116d26['[object\x20String]'] = _0x116d26['[object\x20WeakMap]'] = !0x1;
      var _0xa34c8b = Object.prototype.toString;
      _0x3bce86.exports = _0x3c8262;
    }, {
      '../internal/isLength': 0x19,
      '../internal/isObjectLike': 0x1a
    }],
    0x25: [function (_0x331f4d, _0x5d4591) {
      function _0x45eb2e(_0x2cbab7) {
        return _0x29d467(_0x2cbab7, _0x237216(_0x2cbab7));
      }
      var _0x29d467 = _0x331f4d("../internal/baseCopy"),
        _0x237216 = _0x331f4d("../object/keysIn");
      _0x5d4591.exports = _0x45eb2e;
    }, {
      '../internal/baseCopy': 0xa,
      '../object/keysIn': 0x27
    }],
    0x26: [function (_0x1084e1, _0x47692b) {
      var _0x98e57 = _0x1084e1("../internal/getNative"),
        _0x2ccad4 = _0x1084e1('../internal/isArrayLike'),
        _0xdbf843 = _0x1084e1("../lang/isObject"),
        _0xfb4a56 = _0x1084e1("../internal/shimKeys"),
        _0xd0b110 = _0x1084e1("../support"),
        _0x5429be = _0x98e57(Object, "keys"),
        _0x542a09 = _0x5429be ? function (_0x3a63c2) {
          var _0x32182a = null == _0x3a63c2 ? void 0x0 : _0x3a63c2.constructor;
          return "function" == typeof _0x32182a && _0x32182a.prototype === _0x3a63c2 || ("function" == typeof _0x3a63c2 ? _0xd0b110.enumPrototypes : _0x2ccad4(_0x3a63c2)) ? _0xfb4a56(_0x3a63c2) : _0xdbf843(_0x3a63c2) ? _0x5429be(_0x3a63c2) : [];
        } : _0xfb4a56;
      _0x47692b.exports = _0x542a09;
    }, {
      '../internal/getNative': 0x14,
      '../internal/isArrayLike': 0x15,
      '../internal/shimKeys': 0x1b,
      '../lang/isObject': 0x21,
      '../support': 0x29
    }],
    0x27: [function (_0x410d01, _0x452bae) {
      function _0x13319b(_0x11a93a) {
        if (null == _0x11a93a) return [];
        _0x10e1a5(_0x11a93a) || (_0x11a93a = _0x11a93a);
        var _0xc4a11a = _0x11a93a.length;
        _0xc4a11a = _0xc4a11a && _0x176970(_0xc4a11a) && (_0x2131a0(_0x11a93a) || _0x2e5882(_0x11a93a) || _0x2b7c73(_0x11a93a)) && _0xc4a11a || 0x0;
        for (var _0x16668f = _0x11a93a.constructor, _0x3685f4 = -0x1, _0x5a3af4 = _0x4e2bed(_0x16668f) && _0x16668f.prototype || Object.prototype, _0x49a3ce = _0x5a3af4 === _0x11a93a, _0x15475b = Array(_0xc4a11a), _0x32f77d = _0xc4a11a > 0x0, _0x156bfb = _0x1e00ec.enumErrorProps && (_0x11a93a === _0x1d4eb4 || _0x11a93a instanceof Error), _0x2c4b75 = _0x1e00ec.enumPrototypes && _0x4e2bed(_0x11a93a); ++_0x3685f4 < _0xc4a11a;) _0x15475b[_0x3685f4] = _0x3685f4 + '';
        for (var _0x323c5d in _0x11a93a) _0x2c4b75 && "prototype" == _0x323c5d || _0x156bfb && ("message" == _0x323c5d || "name" == _0x323c5d) || _0x32f77d && _0x294d6b(_0x323c5d, _0xc4a11a) || "constructor" == _0x323c5d && (_0x49a3ce || !Object.prototype.hasOwnProperty.call(_0x11a93a, _0x323c5d)) || _0x15475b.push(_0x323c5d);
        if (_0x1e00ec.nonEnumShadows && _0x11a93a !== Object.prototype) {
          var _0x1a7a1f = _0x11a93a === _0x435bc1 ? _0x183272 : _0x11a93a === _0x1d4eb4 ? _0x432b8f : _0x308caf.call(_0x11a93a),
            _0x26f31f = _0x341992[_0x1a7a1f] || _0x341992[_0x3324e4];
          for (_0x1a7a1f == _0x3324e4 && (_0x5a3af4 = Object.prototype), _0xc4a11a = _0x3e8f89.length; _0xc4a11a--;) {
            _0x323c5d = _0x3e8f89[_0xc4a11a];
            var _0xdf0ec7 = _0x26f31f[_0x323c5d];
            _0x49a3ce && _0xdf0ec7 || (_0xdf0ec7 ? !Object.prototype.hasOwnProperty.call(_0x11a93a, _0x323c5d) : _0x11a93a[_0x323c5d] === _0x5a3af4[_0x323c5d]) || _0x15475b.push(_0x323c5d);
          }
        }
        return _0x15475b;
      }
      var _0x4e5efe = _0x410d01("../internal/arrayEach"),
        _0x2e5882 = _0x410d01("../lang/isArguments"),
        _0x2131a0 = _0x410d01("../lang/isArray"),
        _0x4e2bed = _0x410d01("../lang/isFunction"),
        _0x294d6b = _0x410d01("../internal/isIndex"),
        _0x176970 = _0x410d01("../internal/isLength"),
        _0x10e1a5 = _0x410d01("../lang/isObject"),
        _0x2b7c73 = _0x410d01("../lang/isString"),
        _0x1e00ec = _0x410d01('../support'),
        _0x1d4eb4 = Error.prototype,
        _0x435bc1 = String.prototype,
        _0x308caf = Object.prototype.toString,
        _0x341992 = {};
      _0x341992["[object Array]"] = _0x341992["[object Date]"] = _0x341992["[object Number]"] = {
        'constructor': !0x0,
        'toLocaleString': !0x0,
        'toString': !0x0,
        'valueOf': !0x0
      }, _0x341992["[object Boolean]"] = _0x341992["[object String]"] = {
        'constructor': !0x0,
        'toString': !0x0,
        'valueOf': !0x0
      }, _0x341992["[object Error]"] = _0x341992['[object\x20Function]'] = _0x341992['[object\x20RegExp]'] = {
        'constructor': !0x0,
        'toString': !0x0
      }, _0x341992['[object\x20Object]'] = {
        'constructor': !0x0
      }, _0x4e5efe(["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", 'toLocaleString', 'toString', "valueOf"], function (_0x4793b0) {
        for (var _0x288f56 in _0x341992) if (Object.prototype.hasOwnProperty.call(_0x341992, _0x288f56)) {
          var _0x11e914 = _0x341992[_0x288f56];
          _0x11e914[_0x4793b0] = Object.prototype.hasOwnProperty.call(_0x11e914, _0x4793b0);
        }
      }), _0x452bae.exports = _0x13319b;
    }, {
      '../internal/arrayEach': 0x9,
      '../internal/isIndex': 0x17,
      '../internal/isLength': 0x19,
      '../lang/isArguments': 0x1d,
      '../lang/isArray': 0x1e,
      '../lang/isFunction': 0x1f,
      '../lang/isObject': 0x21,
      '../lang/isString': 0x23,
      '../support': 0x29
    }],
    0x28: [function (_0x1fd173, _0x70e714) {
      var _0x5d0311 = _0x1fd173("../internal/baseMerge"),
        _0x42400b = _0x1fd173('../internal/createAssigner'),
        _0x53decc = _0x42400b(_0x5d0311);
      _0x70e714.exports = _0x53decc;
    }, {
      '../internal/baseMerge': 0xd,
      '../internal/createAssigner': 0x11
    }],
    0x29: [function (_0x520797, _0x513f27) {
      var _0x4debef = {};
      !function (_0x25a056) {
        var _0x18c2d4 = function () {
            this.x = _0x25a056;
          },
          _0x44882e = {
            0x0: _0x25a056,
            'length': _0x25a056
          },
          _0xe8076a = [];
        _0x18c2d4.prototype = {
          'valueOf': _0x25a056,
          'y': _0x25a056
        };
        for (var _0x33823a in new _0x18c2d4()) _0xe8076a.push(_0x33823a);
        _0x4debef.enumErrorProps = Object.prototype.propertyIsEnumerable.call(Error.prototype, "message") || Object.prototype.propertyIsEnumerable.call(Error.prototype, "name"), _0x4debef.enumPrototypes = Object.prototype.propertyIsEnumerable.call(_0x18c2d4, "prototype"), _0x4debef.nonEnumShadows = !/valueOf/.test(_0xe8076a), _0x4debef.ownLast = 'x' != _0xe8076a[0x0], _0x4debef.spliceObjects = (Array.prototype.splice.call(_0x44882e, 0x0, 0x1), !_0x44882e[0x0]), _0x4debef.unindexedChars = 'x'[0x0] + Object('x')[0x0] != 'xx';
      }(0x1, 0x0), _0x513f27.exports = _0x4debef;
    }, {}],
    0x2a: [function (_0x591753, _0x531d62) {
      function _0x2373a1(_0x167366) {
        return _0x167366;
      }
      _0x531d62.exports = _0x2373a1;
    }, {}],
    0x2b: [function (_0x3398fb, _0x3cd815) {
      'use strict';

      var _0x576f8d = _0x3398fb('object-keys');
      _0x3cd815.exports = function () {
        if ('function' != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols) return !0x1;
        if ("symbol" == typeof Symbol.iterator) return !0x0;
        var _0x3ebe26 = {},
          _0x1878ad = Symbol("test");
        if ("string" == typeof _0x1878ad) return !0x1;
        var _0x275f21 = 0x2a;
        _0x3ebe26[_0x1878ad] = _0x275f21;
        for (_0x1878ad in _0x3ebe26) return !0x1;
        if (0x0 !== _0x576f8d(_0x3ebe26).length) return !0x1;
        if ('function' == typeof Object.keys && 0x0 !== Object.keys(_0x3ebe26).length) return !0x1;
        if ("function" == typeof Object.getOwnPropertyNames && 0x0 !== Object.getOwnPropertyNames(_0x3ebe26).length) return !0x1;
        var _0x3b4646 = Object.getOwnPropertySymbols(_0x3ebe26);
        if (0x1 !== _0x3b4646.length || _0x3b4646[0x0] !== _0x1878ad) return !0x1;
        if (!Object.prototype.propertyIsEnumerable.call(_0x3ebe26, _0x1878ad)) return !0x1;
        if ("function" == typeof Object.getOwnPropertyDescriptor) {
          var _0x166286 = Object.getOwnPropertyDescriptor(_0x3ebe26, _0x1878ad);
          if (_0x166286.value !== _0x275f21 || _0x166286.enumerable !== !0x0) return !0x1;
        }
        return !0x0;
      };
    }, {
      'object-keys': 0x32
    }],
    0x2c: [function (_0xcbb1ca, _0x2eaf58) {
      'use strict';

      var _0x4bcd94 = _0xcbb1ca("object-keys"),
        _0x1d2e67 = _0xcbb1ca('function-bind'),
        _0x14c714 = function (_0x4d2e27) {
          return "undefined" != typeof _0x4d2e27 && null !== _0x4d2e27;
        },
        _0x22d20e = _0xcbb1ca("./hasSymbols")(),
        _0x28b0aa = _0x1d2e67.call(Function.call, Array.prototype.push),
        _0xa73819 = _0x1d2e67.call(Function.call, Object.prototype.propertyIsEnumerable);
      _0x2eaf58.exports = function (_0x4ead4f) {
        if (!_0x14c714(_0x4ead4f)) throw new TypeError("target must be an object");
        var _0x318128,
          _0x38dade,
          _0x4011ef,
          _0x17b4c5,
          _0x2a4486,
          _0x30b677,
          _0x25bd13,
          _0x587cc1 = Object(_0x4ead4f);
        for (_0x318128 = 0x1; _0x318128 < arguments.length; ++_0x318128) {
          if (_0x38dade = Object(arguments[_0x318128]), _0x17b4c5 = _0x4bcd94(_0x38dade), _0x22d20e && Object.getOwnPropertySymbols) {
            for (_0x2a4486 = Object.getOwnPropertySymbols(_0x38dade), _0x4011ef = 0x0; _0x4011ef < _0x2a4486.length; ++_0x4011ef) _0x25bd13 = _0x2a4486[_0x4011ef], _0xa73819(_0x38dade, _0x25bd13) && _0x28b0aa(_0x17b4c5, _0x25bd13);
          }
          for (_0x4011ef = 0x0; _0x4011ef < _0x17b4c5.length; ++_0x4011ef) _0x25bd13 = _0x17b4c5[_0x4011ef], _0x30b677 = _0x38dade[_0x25bd13], _0xa73819(_0x38dade, _0x25bd13) && (_0x587cc1[_0x25bd13] = _0x30b677);
        }
        return _0x587cc1;
      };
    }, {
      './hasSymbols': 0x2b,
      'function-bind': 0x31,
      'object-keys': 0x32
    }],
    0x2d: [function (_0x593cc4, _0x11e356) {
      'use strict';

      var _0x405838 = _0x593cc4('define-properties'),
        _0x47844e = _0x593cc4('./implementation'),
        _0x1c8614 = _0x593cc4("./polyfill"),
        _0x35fd8f = _0x593cc4("./shim");
      _0x405838(_0x47844e, {
        'implementation': _0x47844e,
        'getPolyfill': _0x1c8614,
        'shim': _0x35fd8f
      }), _0x11e356.exports = _0x47844e;
    }, {
      './implementation': 0x2c,
      './polyfill': 0x34,
      './shim': 0x35,
      'define-properties': 0x2e
    }],
    0x2e: [function (_0x3deb2a, _0x1062d2) {
      'use strict';

      var _0x55be96 = _0x3deb2a("object-keys"),
        _0x441629 = _0x3deb2a("foreach"),
        _0x2bccb0 = "function" == typeof Symbol && "symbol" == typeof Symbol(),
        _0x58c7e2 = function (_0x5d1a1c) {
          return 'function' == typeof _0x5d1a1c && "[object Function]" === Object.prototype.toString.call(_0x5d1a1c);
        },
        _0x5e6196 = function () {
          var _0x307a39 = {};
          try {
            Object.defineProperty(_0x307a39, 'x', {
              'enumerable': !0x1,
              'value': _0x307a39
            });
            for (var _0x268c29 in _0x307a39) return !0x1;
            return _0x307a39.x === _0x307a39;
          } catch (_0x5e0b5d) {
            return !0x1;
          }
        },
        _0x274c8d = Object.defineProperty && _0x5e6196(),
        _0x3cf470 = function (_0xa3fc53, _0x1f2454, _0x48e7b4, _0x4ab086) {
          (!(_0x1f2454 in _0xa3fc53) || _0x58c7e2(_0x4ab086) && _0x4ab086()) && (_0x274c8d ? Object.defineProperty(_0xa3fc53, _0x1f2454, {
            'configurable': !0x0,
            'enumerable': !0x1,
            'value': _0x48e7b4,
            'writable': !0x0
          }) : _0xa3fc53[_0x1f2454] = _0x48e7b4);
        },
        _0x5458e5 = function (_0x372fea, _0x4ef526) {
          var _0x24e9d7 = arguments.length > 0x2 ? arguments[0x2] : {},
            _0x4c4d61 = _0x55be96(_0x4ef526);
          _0x2bccb0 && (_0x4c4d61 = _0x4c4d61.concat(Object.getOwnPropertySymbols(_0x4ef526))), _0x441629(_0x4c4d61, function (_0x3e7c86) {
            _0x3cf470(_0x372fea, _0x3e7c86, _0x4ef526[_0x3e7c86], _0x24e9d7[_0x3e7c86]);
          });
        };
      _0x5458e5.supportsDescriptors = !!_0x274c8d, _0x1062d2.exports = _0x5458e5;
    }, {
      'foreach': 0x2f,
      'object-keys': 0x32
    }],
    0x2f: [function (_0x28c422, _0x154f74) {
      _0x154f74.exports = function (_0x3ca6ba, _0x72bd96, _0x35fbbe) {
        if ("[object Function]" !== Object.prototype.toString.call(_0x72bd96)) throw new TypeError('iterator\x20must\x20be\x20a\x20function');
        var _0x5efa97 = _0x3ca6ba.length;
        if (_0x5efa97 === +_0x5efa97) {
          for (var _0x4cb25a = 0x0; _0x5efa97 > 0x0; _0x4cb25a++) _0x72bd96.call(_0x35fbbe, _0x3ca6ba[_0x4cb25a], _0x4cb25a, _0x3ca6ba);
        } else {
          for (var _0x4ec8a9 in _0x3ca6ba) Object.prototype.hasOwnProperty.call(_0x3ca6ba, _0x4ec8a9) && _0x72bd96.call(_0x35fbbe, _0x3ca6ba[_0x4ec8a9], _0x4ec8a9, _0x3ca6ba);
        }
      };
    }, {}],
    0x30: [function (_0x22d877, _0x5a8099) {
      _0x5a8099.exports = function (_0x4324b7) {
        if ("function" != typeof this || Object.prototype.toString.call(this) !== '[object\x20Function]') throw new TypeError("Function.prototype.bind called on incompatible " + this);
        for (var _0xb479b2, _0x2eee35 = Array.prototype.slice.call(arguments, 0x1), _0x306f84 = function () {
            if (this instanceof _0xb479b2) {
              var _0x1e216a = this.apply(this, _0x2eee35.concat(Array.prototype.slice.call(arguments)));
              return _0x1e216a === _0x1e216a ? _0x1e216a : this;
            }
            return this.apply(_0x4324b7, _0x2eee35.concat(Array.prototype.slice.call(arguments)));
          }, _0x8fae33 = Math.max(0x0, this.length - _0x2eee35.length), _0x48ea08 = [], _0x30052f = 0x0; _0x8fae33 > 0x0; _0x30052f++) _0x48ea08.push('$' + _0x30052f);
        if (_0xb479b2 = Function("binder", "return function (" + _0x48ea08.join(',') + "){ return binder.apply(this,arguments); }")(_0x306f84), this.prototype) {
          var _0x44bfc9 = function () {};
          _0x44bfc9.prototype = this.prototype, _0xb479b2.prototype = new _0x44bfc9(), _0x44bfc9.prototype = null;
        }
        return _0xb479b2;
      };
    }, {}],
    0x31: [function (_0x3a5928, _0x439f8e) {
      var _0x3a9576 = _0x3a5928('./implementation');
      _0x439f8e.exports = Function.prototype.bind || _0x3a9576;
    }, {
      './implementation': 0x30
    }],
    0x32: [function (_0x36a0a1, _0x352fb7) {
      'use strict';

      var _0x4649ec = _0x36a0a1("./isArguments"),
        _0x43686e = !{
          'toString': null
        }.propertyIsEnumerable('toString'),
        _0x5eea38 = function () {}.propertyIsEnumerable('prototype'),
        _0x447f48 = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", 'constructor'],
        _0x15e02b = function (_0x5c6e50) {
          var _0x2d6aa8 = _0x5c6e50.constructor;
          return _0x2d6aa8 && _0x2d6aa8.prototype === _0x5c6e50;
        },
        _0x17290a = function () {
          if ("undefined" == typeof window) return !0x1;
          for (var _0x591706 in window) try {
            if (!{
              '$console': !0x0,
              '$frame': !0x0,
              '$frameElement': !0x0,
              '$frames': !0x0,
              '$parent': !0x0,
              '$self': !0x0,
              '$webkitIndexedDB': !0x0,
              '$webkitStorageInfo': !0x0,
              '$window': !0x0
            }['$' + _0x591706] && Object.prototype.hasOwnProperty.call(window, _0x591706) && null !== window[_0x591706] && "object" == typeof window[_0x591706]) try {
              _0x15e02b(window[_0x591706]);
            } catch (_0x35bcf2) {
              return !0x0;
            }
          } catch (_0x47a6fe) {
            return !0x0;
          }
          return !0x1;
        }(),
        _0x2e62e2 = function (_0x10570) {
          if ('undefined' == typeof window || !_0x17290a) return _0x15e02b(_0x10570);
          try {
            return _0x15e02b(_0x10570);
          } catch (_0x5c70c8) {
            return !0x1;
          }
        },
        _0x33b4c9 = function (_0x2cc479) {
          var _0x54ce68 = null !== _0x2cc479 && "object" == typeof _0x2cc479,
            _0x55838a = "[object Function]" === Object.prototype.toString.call(_0x2cc479),
            _0x1bd67f = _0x4649ec(_0x2cc479),
            _0x50ad77 = _0x54ce68 && '[object\x20String]' === Object.prototype.toString.call(_0x2cc479),
            _0x5997ea = [];
          if (!_0x54ce68 && !_0x55838a && !_0x1bd67f) throw new TypeError('Object.keys\x20called\x20on\x20a\x20non-object');
          var _0x39b40d = _0x5eea38 && _0x55838a;
          if (_0x50ad77 && _0x2cc479.length > 0x0 && !Object.prototype.hasOwnProperty.call(_0x2cc479, 0x0)) {
            for (var _0x15fc40 = 0x0; 0x0 < _0x2cc479.length; ++_0x15fc40) _0x5997ea.push(String(_0x15fc40));
          }
          if (_0x1bd67f && _0x2cc479.length > 0x0) {
            for (var _0xca0b3a = 0x0; 0x0 < _0x2cc479.length; ++_0xca0b3a) _0x5997ea.push(String(_0xca0b3a));
          } else {
            for (var _0x13934e in _0x2cc479) _0x39b40d && "prototype" === _0x13934e || !Object.prototype.hasOwnProperty.call(_0x2cc479, _0x13934e) || _0x5997ea.push(String(_0x13934e));
          }
          if (_0x43686e) {
            for (var _0x210991 = _0x2e62e2(_0x2cc479), _0x4dfaa8 = 0x0; 0x0 < _0x447f48.length; ++_0x4dfaa8) _0x210991 && "constructor" === _0x447f48[_0x4dfaa8] || !Object.prototype.hasOwnProperty.call(_0x2cc479, _0x447f48[_0x4dfaa8]) || _0x5997ea.push(_0x447f48[_0x4dfaa8]);
          }
          return _0x5997ea;
        };
      _0x33b4c9.shim = function () {
        if (Object.keys) {
          var _0x572200 = function () {
            return 0x2 === (Object.keys(arguments) || '').length;
          }(0x1, 0x2);
          if (!_0x572200) {
            Object.keys = function (_0x3b1736) {
              return Object.keys(_0x4649ec(_0x3b1736) ? Array.prototype.slice.call(_0x3b1736) : _0x3b1736);
            };
          }
        } else Object.keys = _0x33b4c9;
        return Object.keys || _0x33b4c9;
      }, _0x352fb7.exports = _0x33b4c9;
    }, {
      './isArguments': 0x33
    }],
    0x33: [function (_0x50e099, _0xb262b4) {
      'use strict';

      _0xb262b4.exports = function (_0x1ebb20) {
        var _0x5c32f6 = Object.prototype.toString.call(_0x1ebb20),
          _0x3ff8c1 = "[object Arguments]" === _0x5c32f6;
        return _0x3ff8c1 || (_0x3ff8c1 = "[object Array]" !== _0x5c32f6 && null !== _0x1ebb20 && "object" == typeof _0x1ebb20 && "number" == typeof _0x1ebb20.length && _0x1ebb20.length >= 0x0 && "[object Function]" === Object.prototype.toString.call(_0x1ebb20.callee)), _0x3ff8c1;
      };
    }, {}],
    0x34: [function (_0x24ba49, _0xd623e) {
      'use strict';

      var _0xef12c0 = _0x24ba49('./implementation'),
        _0x422c2a = function () {
          if (!Object.assign) return !0x1;
          for (var _0x4447b8 = "abcdefghijklmnopqrst", _0x2545fd = _0x4447b8.split(''), _0x5f0b32 = {}, _0x2f866a = 0x0; 0x0 < _0x2545fd.length; ++_0x2f866a) _0x5f0b32[_0x2545fd[_0x2f866a]] = _0x2545fd[_0x2f866a];
          var _0x3fc2b2 = Object.assign({}, _0x5f0b32),
            _0x20d45d = '';
          for (var _0x113125 in _0x3fc2b2) _0x20d45d += _0x113125;
          return _0x4447b8 !== _0x20d45d;
        },
        _0x58b996 = function () {
          if (!Object.assign || !Object.preventExtensions) return !0x1;
          var _0x25f32a = Object.preventExtensions({
            0x1: 0x2
          });
          try {
            Object.assign(_0x25f32a, 'xy');
          } catch (_0x59b5b8) {
            return 'y' === _0x25f32a[0x1];
          }
        };
      _0xd623e.exports = function () {
        return Object.assign ? _0x422c2a() ? _0xef12c0 : _0x58b996() ? _0xef12c0 : Object.assign : _0xef12c0;
      };
    }, {
      './implementation': 0x2c
    }],
    0x35: [function (_0x44c188, _0xb0dc7e) {
      'use strict';

      var _0x2fd65d = _0x44c188("define-properties"),
        _0x109a78 = _0x44c188("./polyfill");
      _0xb0dc7e.exports = function () {
        var _0x14240c = _0x109a78();
        return _0x2fd65d(Object, {
          'assign': _0x14240c
        }, {
          'assign': function () {
            return Object.assign !== _0x14240c;
          }
        }), _0x14240c;
      };
    }, {
      './polyfill': 0x34,
      'define-properties': 0x2e
    }],
    0x36: [function (_0x44548e, _0x4788e7) {
      function _0x4d1664(_0x3af77d, _0x29395c) {
        var _0x262cc4,
          _0x578b1c = null;
        try {
          _0x262cc4 = JSON.parse(_0x3af77d, _0x29395c);
        } catch (_0xeceb04) {
          _0x578b1c = _0xeceb04;
        }
        return [_0x578b1c, _0x262cc4];
      }
      _0x4788e7.exports = _0x4d1664;
    }, {}],
    0x37: [function (_0x190222, _0x902d95) {
      function _0x450911(_0x4dc650) {
        return _0x4dc650.replace(/\n\r?\s*/g, '');
      }
      _0x902d95.exports = function (_0x685b60) {
        for (var _0x28a35c = '', _0x29c682 = 0x0; 0x0 < arguments.length; _0x29c682++) _0x28a35c += _0x450911(_0x685b60[_0x29c682]) + (arguments[_0x29c682 + 0x1] || '');
        return _0x28a35c;
      };
    }, {}],
    0x38: [function (_0x58d85f, _0x4c5e73) {
      'use strict';

      function _0x471741(_0x36c933, _0x5e04ee) {
        for (var _0x536347 = 0x0; 0x0 < _0x36c933.length; _0x536347++) _0x5e04ee(_0x36c933[_0x536347]);
      }
      function _0x2b97fd(_0x30e02b) {
        for (var _0x30b390 in _0x30e02b) if (_0x30e02b.hasOwnProperty(_0x30b390)) return !0x1;
        return !0x0;
      }
      function _0x2043e9(_0xc20f89, _0x4d5f4d, _0x84a89c) {
        var _0x4aa13f = _0xc20f89;
        return _0x4723d7(_0x4d5f4d) ? (_0x84a89c = _0x4d5f4d, "string" == typeof _0xc20f89 && (_0x4aa13f = {
          'uri': _0xc20f89
        })) : _0x4aa13f = _0xc5593b(_0x4d5f4d, {
          'uri': _0xc20f89
        }), _0x4aa13f.callback = _0x84a89c, _0x4aa13f;
      }
      function _0x3a1081(_0x473616, _0x456627, _0x250cf5) {
        return _0x456627 = _0x2043e9(_0x473616, _0x456627, _0x250cf5), _0x39203d(_0x456627);
      }
      function _0x39203d(_0x4f9eb6) {
        function _0x2a96fa() {
          0x4 === _0xa09d90.readyState && _0x39daf8();
        }
        function _0x502230() {
          var _0x2f5f9a = void 0x0;
          if (_0xa09d90.response ? _0x2f5f9a = _0xa09d90.response : 'text' !== _0xa09d90.responseType && _0xa09d90.responseType || (_0x2f5f9a = _0xa09d90.responseText || _0xa09d90.responseXML), _0x876a72) try {
            _0x2f5f9a = JSON.parse(_0x2f5f9a);
          } catch (_0xdce789) {}
          return _0x2f5f9a;
        }
        function _0x483b92(_0x3b4b1d) {
          clearTimeout(_0x1a916f), _0x3b4b1d instanceof Error || (_0x3b4b1d = new Error('' + (_0x3b4b1d || "Unknown XMLHttpRequest Error"))), _0x3b4b1d.statusCode = 0x0, _0x401e3e(_0x3b4b1d, _0x4aafc4);
        }
        function _0x39daf8() {
          if (!_0x116e62) {
            var _0x588607;
            clearTimeout(_0x1a916f), _0x588607 = _0x4f9eb6.useXDR && void 0x0 === _0xa09d90.status ? 0xc8 : 0x4c7 === _0xa09d90.status ? 0xcc : _0xa09d90.status;
            var _0x5f4d2d = _0x4aafc4,
              _0x71db06 = null;
            0x0 !== _0x588607 ? (_0x5f4d2d = {
              'body': _0x502230(),
              'statusCode': _0x588607,
              'method': _0x2e4923,
              'headers': {},
              'url': _0x3c0672,
              'rawRequest': _0xa09d90
            }, _0xa09d90.getAllResponseHeaders && (_0x5f4d2d.headers = _0x38a52e(_0xa09d90.getAllResponseHeaders()))) : _0x71db06 = new Error("Internal XMLHttpRequest Error"), _0x401e3e(_0x71db06, _0x5f4d2d, _0x5f4d2d.body);
          }
        }
        var _0x401e3e = _0x4f9eb6.callback;
        if ("undefined" == typeof _0x401e3e) throw new Error('callback\x20argument\x20missing');
        _0x401e3e = _0x536df5(_0x401e3e);
        var _0x4aafc4 = {
            'body': void 0x0,
            'headers': {},
            'statusCode': 0x0,
            'method': _0x2e4923,
            'url': _0x3c0672,
            'rawRequest': _0xa09d90
          },
          _0xa09d90 = _0x4f9eb6.xhr || null;
        _0xa09d90 || (_0xa09d90 = _0x4f9eb6.cors || _0x4f9eb6.useXDR ? new _0x3a1081.XDomainRequest() : new _0x3a1081.XMLHttpRequest());
        var _0x5f1888,
          _0x116e62,
          _0x1a916f,
          _0x3c0672 = _0xa09d90.url = _0x4f9eb6.uri || _0x4f9eb6.url,
          _0x2e4923 = _0xa09d90.method = _0x4f9eb6.method || 'GET',
          _0x1badd6 = _0x4f9eb6.body || _0x4f9eb6.data || null,
          _0x91cc2a = _0xa09d90.headers = _0x4f9eb6.headers || {},
          _0x3165f8 = !!_0x4f9eb6.sync,
          _0x876a72 = !0x1;
        if ('json' in _0x4f9eb6 && (_0x876a72 = !0x0, _0x91cc2a.accept || _0x91cc2a.Accept || (_0x91cc2a.Accept = "application/json"), 'GET' !== _0x2e4923 && "HEAD" !== _0x2e4923 && (_0x91cc2a['content-type'] || _0x91cc2a["Content-Type"] || (_0x91cc2a["Content-Type"] = "application/json"), _0x1badd6 = JSON.stringify(_0x4f9eb6.json))), _0xa09d90.onreadystatechange = _0x2a96fa, _0xa09d90.onload = _0x39daf8, _0xa09d90.onerror = _0x483b92, _0xa09d90.onprogress = function () {}, _0xa09d90.ontimeout = _0x483b92, _0xa09d90.open(_0x2e4923, _0x3c0672, !_0x3165f8, _0x4f9eb6.username, _0x4f9eb6.password), _0x3165f8 || (_0xa09d90.withCredentials = !!_0x4f9eb6.withCredentials), !_0x3165f8 && _0x4f9eb6.timeout > 0x0 && (_0x1a916f = setTimeout(function () {
          _0x116e62 = !0x0, _0xa09d90.abort("timeout");
          var _0x572a94 = new Error("XMLHttpRequest timeout");
          _0x572a94.code = "ETIMEDOUT", _0x483b92(_0x572a94);
        }, _0x4f9eb6.timeout)), _0xa09d90.setRequestHeader) {
          for (_0x5f1888 in _0x91cc2a) _0x91cc2a.hasOwnProperty(_0x5f1888) && _0xa09d90.setRequestHeader(_0x5f1888, _0x91cc2a[_0x5f1888]);
        } else {
          if (_0x4f9eb6.headers && !_0x2b97fd(_0x4f9eb6.headers)) throw new Error("Headers cannot be set on an XDomainRequest object");
        }
        return 'responseType' in _0x4f9eb6 && (_0xa09d90.responseType = _0x4f9eb6.responseType), "beforeSend" in _0x4f9eb6 && "function" == typeof _0x4f9eb6.beforeSend && _0x4f9eb6.beforeSend(_0xa09d90), _0xa09d90.send(_0x1badd6), _0xa09d90;
      }
      function _0x300417() {}
      var _0x4d2c6f = _0x58d85f("global/window"),
        _0x536df5 = _0x58d85f("once"),
        _0x4723d7 = _0x58d85f("is-function"),
        _0x38a52e = _0x58d85f("parse-headers"),
        _0xc5593b = _0x58d85f("xtend");
      _0x4c5e73.exports = _0x3a1081, _0x3a1081.XMLHttpRequest = _0x4d2c6f.XMLHttpRequest || _0x300417, _0x3a1081.XDomainRequest = 'withCredentials' in new _0x3a1081.XMLHttpRequest() ? _0x3a1081.XMLHttpRequest : _0x4d2c6f.XDomainRequest, _0x471741(['get', "put", "post", "patch", 'head', "delete"], function (_0xc3335c) {
        _0x3a1081["delete" === _0xc3335c ? "del" : _0xc3335c] = function (_0x4b83ef, _0x5acb17, _0x5b6697) {
          return _0x5acb17 = _0x2043e9(_0x4b83ef, _0x5acb17, _0x5b6697), _0x5acb17.method = _0xc3335c.toUpperCase(), _0x39203d(_0x5acb17);
        };
      });
    }, {
      'global/window': 0x2,
      'is-function': 0x39,
      'once': 0x3a,
      'parse-headers': 0x3d,
      'xtend': 0x3e
    }],
    0x39: [function (_0x3bd565, _0xd03c0b) {
      function _0x315dcc(_0x36ad71) {
        var _0x23c5b0 = _0x1cf426.call(_0x36ad71);
        return "[object Function]" === _0x23c5b0 || 'function' == typeof _0x36ad71 && "[object RegExp]" !== _0x23c5b0 || "undefined" != typeof window && (_0x36ad71 === window.setTimeout || _0x36ad71 === window.alert || _0x36ad71 === window.confirm || _0x36ad71 === window.prompt);
      }
      _0xd03c0b.exports = _0x315dcc;
      var _0x1cf426 = Object.prototype.toString;
    }, {}],
    0x3a: [function (_0x267f9e, _0x4b8b7e) {
      function _0x153a95(_0x99317e) {
        return function () {
          return !0x1 ? void 0x0 : (_0x1b5262 = !0x0, _0x99317e.apply(this, arguments));
        };
      }
      _0x4b8b7e.exports = _0x153a95, _0x153a95.proto = _0x153a95(function () {
        Object.defineProperty(Function.prototype, "once", {
          'value': function () {
            return _0x153a95(this);
          },
          'configurable': !0x0
        });
      });
    }, {}],
    0x3b: [function (_0x1bde9e, _0x4e4196) {
      function _0x54761e(_0x27a27c, _0x4e9565, _0x23bf54) {
        if (!_0xb7e525(_0x4e9565)) throw new TypeError("iterator must be a function");
        arguments.length < 0x3 && (_0x23bf54 = this), '[object\x20Array]' === _0x3f58f6.call(_0x27a27c) ? _0x288137(_0x27a27c, _0x4e9565, _0x23bf54) : "string" == typeof _0x27a27c ? _0x55afd0(_0x27a27c, _0x4e9565, _0x23bf54) : _0x53b7de(_0x27a27c, _0x4e9565, _0x23bf54);
      }
      function _0x288137(_0x1fae4b, _0xb6c719, _0x4035c8) {
        for (var _0x56880e = 0x0, _0x277646 = _0x1fae4b.length; _0x277646 > 0x0; _0x56880e++) _0x5a0a2b.call(_0x1fae4b, _0x56880e) && _0xb6c719.call(_0x4035c8, _0x1fae4b[_0x56880e], _0x56880e, _0x1fae4b);
      }
      function _0x55afd0(_0x245464, _0xc05e0f, _0x44e461) {
        for (var _0x32b622 = 0x0, _0x3290d3 = _0x245464.length; _0x3290d3 > 0x0; _0x32b622++) _0xc05e0f.call(_0x44e461, _0x245464.charAt(_0x32b622), _0x32b622, _0x245464);
      }
      function _0x53b7de(_0x5a3880, _0x483f1c, _0x1b3f2e) {
        for (var _0x28c555 in _0x5a3880) _0x5a0a2b.call(_0x5a3880, _0x28c555) && _0x483f1c.call(_0x1b3f2e, _0x5a3880[_0x28c555], _0x28c555, _0x5a3880);
      }
      var _0xb7e525 = _0x1bde9e("is-function");
      _0x4e4196.exports = _0x54761e;
      var _0x3f58f6 = Object.prototype.toString,
        _0x5a0a2b = Object.prototype.hasOwnProperty;
    }, {
      'is-function': 0x39
    }],
    0x3c: [function (_0x3f8a8f, _0x22f6d7, _0x4867d9) {
      function _0x19cfdd(_0x14c3b9) {
        return _0x14c3b9.replace(/^\s*|\s*$/g, '');
      }
      _0x4867d9 = _0x22f6d7.exports = _0x19cfdd, _0x4867d9.left = function (_0x109955) {
        return _0x109955.replace(/^\s*/, '');
      }, _0x4867d9.right = function (_0x3d11cb) {
        return _0x3d11cb.replace(/\s*$/, '');
      };
    }, {}],
    0x3d: [function (_0x18d614, _0x264ca9) {
      var _0x4131a3 = _0x18d614('trim'),
        _0x3ba7ea = _0x18d614("for-each"),
        _0x4b65d3 = function (_0x4aa06c) {
          return "[object Array]" === Object.prototype.toString.call(_0x4aa06c);
        };
      _0x264ca9.exports = function (_0x51fafa) {
        if (!_0x51fafa) return {};
        var _0x352c97 = {};
        return _0x3ba7ea(_0x4131a3(_0x51fafa).split('\x0a'), function (_0x4ae953) {
          var _0x3707ea = _0x4ae953.indexOf(':'),
            _0x38f996 = _0x4131a3(_0x4ae953.slice(0x0, _0x3707ea)).toLowerCase(),
            _0x4e9a3a = _0x4131a3(_0x4ae953.slice(_0x3707ea + 0x1));
          'undefined' == typeof _0x352c97[_0x38f996] ? _0x352c97[_0x38f996] = _0x4e9a3a : _0x4b65d3(_0x352c97[_0x38f996]) ? _0x352c97[_0x38f996].push(_0x4e9a3a) : _0x352c97[_0x38f996] = [_0x352c97[_0x38f996], _0x4e9a3a];
        }), _0x352c97;
      };
    }, {
      'for-each': 0x3b,
      'trim': 0x3c
    }],
    0x3e: [function (_0x3d3e8f, _0x251ddf) {
      function _0x41e7ea() {
        for (var _0x527680 = {}, _0x9f3e = 0x0; 0x0 < arguments.length; _0x9f3e++) {
          var _0x3f35f3 = arguments[_0x9f3e];
          for (var _0x1315f7 in _0x3f35f3) _0x176286.call(_0x3f35f3, _0x1315f7) && (_0x527680[_0x1315f7] = _0x3f35f3[_0x1315f7]);
        }
        return _0x527680;
      }
      _0x251ddf.exports = _0x41e7ea;
      var _0x176286 = Object.prototype.hasOwnProperty;
    }, {}],
    0x3f: [function (_0x2c81c7, _0x1856f0, _0x277faf) {
      'use strict';

      function _0x12105e(_0x310d37) {
        return _0x310d37 && _0x310d37.__esModule ? _0x310d37 : {
          'default': _0x310d37
        };
      }
      function _0x21ad20(_0x1f2c12, _0x181cd0) {
        if (!(_0x1f2c12 instanceof _0x181cd0)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x4f6038(_0x627fce, _0x2ff449) {
        if ("function" != typeof _0x2ff449 && null !== _0x2ff449) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x2ff449);
        _0x627fce.prototype = Object.create(_0x2ff449 && _0x2ff449.prototype, {
          'constructor': {
            'value': _0x627fce,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x2ff449 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x627fce, _0x2ff449) : _0x627fce.__proto__ = _0x2ff449);
      }
      _0x277faf.__esModule = !0x0;
      var _0x2e811c = _0x2c81c7("./button.js"),
        _0x56e219 = _0x12105e(_0x2e811c),
        _0x2b0db0 = _0x2c81c7('./component.js'),
        _0x5bf387 = _0x12105e(_0x2b0db0),
        _0x3a990d = function (_0x1c4aa3) {
          function _0x3c23ac(_0x40e3ad, _0x45ede0) {
            _0x21ad20(this, _0x3c23ac), _0x1c4aa3.call(this, _0x40e3ad, _0x45ede0);
          }
          return _0x4f6038(_0x3c23ac, _0x1c4aa3), _0x3c23ac.prototype.buildCSSClass = function () {
            return "vjs-big-play-button";
          }, _0x3c23ac.prototype.handleClick = function () {
            this.player_.play();
          }, _0x3c23ac;
        }(_0x56e219["default"]);
      _0x3a990d.prototype.controlText_ = "Play Video", _0x5bf387['default'].registerComponent('BigPlayButton', _0x3a990d), _0x277faf['default'] = _0x3a990d, _0x1856f0.exports = _0x277faf["default"];
    }, {
      './button.js': 0x40,
      './component.js': 0x43
    }],
    0x40: [function (_0x8061e1, _0xa3aaac, _0x2316a5) {
      'use strict';

      function _0x181158(_0x1be8ac) {
        if (_0x1be8ac && _0x1be8ac.__esModule) return _0x1be8ac;
        var _0x3900fe = {};
        if (null != _0x1be8ac) {
          for (var _0x4ec1bd in _0x1be8ac) Object.prototype.hasOwnProperty.call(_0x1be8ac, _0x4ec1bd) && (_0x3900fe[_0x4ec1bd] = _0x1be8ac[_0x4ec1bd]);
        }
        return _0x3900fe['default'] = _0x1be8ac, _0x3900fe;
      }
      function _0x18a731(_0xc7ced7) {
        return _0xc7ced7 && _0xc7ced7.__esModule ? _0xc7ced7 : {
          'default': _0xc7ced7
        };
      }
      function _0x8fc597(_0x4464fd, _0x2976cc) {
        if (!(_0x4464fd instanceof _0x2976cc)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x4df884(_0x342b9d, _0x12c7ba) {
        if ("function" != typeof _0x12c7ba && null !== _0x12c7ba) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x12c7ba);
        _0x342b9d.prototype = Object.create(_0x12c7ba && _0x12c7ba.prototype, {
          'constructor': {
            'value': _0x342b9d,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x12c7ba && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x342b9d, _0x12c7ba) : _0x342b9d.__proto__ = _0x12c7ba);
      }
      _0x2316a5.__esModule = !0x0;
      var _0xe222b2 = _0x8061e1("./clickable-component.js"),
        _0x26056e = _0x18a731(_0xe222b2),
        _0x1234e6 = _0x8061e1("./component"),
        _0x22af7c = _0x18a731(_0x1234e6),
        _0x36ad2b = _0x8061e1("./utils/events.js"),
        _0x391f60 = (_0x181158(_0x36ad2b), _0x8061e1("./utils/fn.js")),
        _0x4b52f4 = (_0x181158(_0x391f60), _0x8061e1("./utils/log.js")),
        _0x5bb8fe = _0x18a731(_0x4b52f4),
        _0x3ca6e7 = _0x8061e1("global/document"),
        _0x51e914 = (_0x18a731(_0x3ca6e7), _0x8061e1("object.assign")),
        _0x297585 = _0x18a731(_0x51e914),
        _0x37a454 = function (_0x3caf83) {
          function _0x57afc6(_0x4f8dd1, _0x16885d) {
            _0x8fc597(this, _0x57afc6), _0x3caf83.call(this, _0x4f8dd1, _0x16885d);
          }
          return _0x4df884(_0x57afc6, _0x3caf83), _0x57afc6.prototype.createEl = function () {
            var _0xc80a62 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? "button" : arguments[0x0],
              _0x53edbe = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1],
              _0x45366a = arguments.length <= 0x2 || void 0x0 === arguments[0x2] ? {} : arguments[0x2];
            _0x53edbe = _0x297585["default"]({
              'className': this.buildCSSClass()
            }, _0x53edbe), "button" !== _0xc80a62 && (_0x5bb8fe["default"].warn("Creating a Button with an HTML element of " + _0xc80a62 + '\x20is\x20deprecated;\x20use\x20ClickableComponent\x20instead.'), _0x53edbe = _0x297585["default"]({
              'tabIndex': 0x0
            }, _0x53edbe), _0x45366a = _0x297585['default']({
              'role': "button"
            }, _0x45366a)), _0x45366a = _0x297585["default"]({
              'type': 'button',
              'aria-live': "polite"
            }, _0x45366a);
            var _0x14944b = _0x22af7c["default"].prototype.createEl.call(this, _0xc80a62, _0x53edbe, _0x45366a);
            return this.createControlTextEl(_0x14944b), _0x14944b;
          }, _0x57afc6.prototype.addChild = function (_0x37c793) {
            var _0x2317d9 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            return _0x5bb8fe['default'].warn("Adding an actionable (user controllable) child to a Button (" + this.constructor.name + ") is not supported; use a ClickableComponent instead."), _0x22af7c["default"].prototype.addChild.call(this, _0x37c793, _0x2317d9);
          }, _0x57afc6.prototype.handleKeyPress = function (_0x398e93) {
            0x20 === _0x398e93.which || 0xd === _0x398e93.which || _0x3caf83.prototype.handleKeyPress.call(this, _0x398e93);
          }, _0x57afc6;
        }(_0x26056e["default"]);
      _0x22af7c["default"].registerComponent("Button", _0x37a454), _0x2316a5["default"] = _0x37a454, _0xa3aaac.exports = _0x2316a5['default'];
    }, {
      './clickable-component.js': 0x41,
      './component': 0x43,
      './utils/events.js': 0x90,
      './utils/fn.js': 0x91,
      './utils/log.js': 0x94,
      'global/document': 0x1,
      'object.assign': 0x2d
    }],
    0x41: [function (_0x4dd58c, _0x55a6c1, _0x36ea6b) {
      'use strict';

      function _0x23b4be(_0xd4531d) {
        if (_0xd4531d && _0xd4531d.__esModule) return _0xd4531d;
        var _0x49b474 = {};
        if (null != _0xd4531d) {
          for (var _0x15bc20 in _0xd4531d) Object.prototype.hasOwnProperty.call(_0xd4531d, _0x15bc20) && (_0x49b474[_0x15bc20] = _0xd4531d[_0x15bc20]);
        }
        return _0x49b474["default"] = _0xd4531d, _0x49b474;
      }
      function _0x405014(_0x1819f2) {
        return _0x1819f2 && _0x1819f2.__esModule ? _0x1819f2 : {
          'default': _0x1819f2
        };
      }
      function _0x3d50c3(_0x5c4f9a, _0x36393f) {
        if (!(_0x5c4f9a instanceof _0x36393f)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x3e36e1(_0x1507af, _0x3699cf) {
        if ("function" != typeof _0x3699cf && null !== _0x3699cf) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x3699cf);
        _0x1507af.prototype = Object.create(_0x3699cf && _0x3699cf.prototype, {
          'constructor': {
            'value': _0x1507af,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x3699cf && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x1507af, _0x3699cf) : _0x1507af.__proto__ = _0x3699cf);
      }
      _0x36ea6b.__esModule = !0x0;
      var _0x2704ef = _0x4dd58c("./component"),
        _0x58ad8e = _0x405014(_0x2704ef),
        _0x30eafe = _0x4dd58c("./utils/dom.js"),
        _0x3c86f7 = _0x23b4be(_0x30eafe),
        _0x5a9513 = _0x4dd58c("./utils/events.js"),
        _0x90b55b = _0x23b4be(_0x5a9513),
        _0x426933 = _0x4dd58c("./utils/fn.js"),
        _0x5d5929 = _0x23b4be(_0x426933),
        _0xc7dc2a = _0x4dd58c('./utils/log.js'),
        _0x26fe59 = _0x405014(_0xc7dc2a),
        _0x36d07e = _0x4dd58c('global/document'),
        _0x7ebd76 = _0x405014(_0x36d07e),
        _0x59099b = _0x4dd58c("object.assign"),
        _0x5db8c9 = _0x405014(_0x59099b),
        _0x26f99d = function (_0xcccfd9) {
          function _0x50ebf7(_0x15a50c, _0xc024bb) {
            _0x3d50c3(this, _0x50ebf7), _0xcccfd9.call(this, _0x15a50c, _0xc024bb), this.emitTapEvents(), this.on("tap", this.handleClick), this.on('click', this.handleClick), this.on("focus", this.handleFocus), this.on("blur", this.handleBlur);
          }
          return _0x3e36e1(_0x50ebf7, _0xcccfd9), _0x50ebf7.prototype.createEl = function () {
            var _0x5960d9 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? "div" : arguments[0x0],
              _0x168ed7 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1],
              _0x13646c = arguments.length <= 0x2 || void 0x0 === arguments[0x2] ? {} : arguments[0x2];
            _0x168ed7 = _0x5db8c9["default"]({
              'className': this.buildCSSClass(),
              'tabIndex': 0x0
            }, _0x168ed7), 'button' === _0x5960d9 && _0x26fe59["default"].error("Creating a ClickableComponent with an HTML element of " + _0x5960d9 + '\x20is\x20not\x20supported;\x20use\x20a\x20Button\x20instead.'), _0x13646c = _0x5db8c9["default"]({
              'role': "button",
              'aria-live': "polite"
            }, _0x13646c);
            var _0x720aab = _0xcccfd9.prototype.createEl.call(this, _0x5960d9, _0x168ed7, _0x13646c);
            return this.createControlTextEl(_0x720aab), _0x720aab;
          }, _0x50ebf7.prototype.createControlTextEl = function (_0x1defa4) {
            return this.controlTextEl_ = _0x3c86f7.createEl("span", {
              'className': "vjs-control-text"
            }), _0x1defa4 && _0x1defa4.appendChild(this.controlTextEl_), this.controlText(this.controlText_), this.controlTextEl_;
          }, _0x50ebf7.prototype.controlText = function (_0x17b5c7) {
            return _0x17b5c7 ? (this.controlText_ = _0x17b5c7, this.controlTextEl_.innerHTML = this.localize(this.controlText_), this) : this.controlText_ || "Need Text";
          }, _0x50ebf7.prototype.buildCSSClass = function () {
            return "vjs-control vjs-button " + _0xcccfd9.prototype.buildCSSClass.call(this);
          }, _0x50ebf7.prototype.addChild = function (_0x22c210) {
            var _0x205745 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            return _0xcccfd9.prototype.addChild.call(this, _0x22c210, _0x205745);
          }, _0x50ebf7.prototype.enable = function () {
            return this.removeClass("vjs-disabled"), this.el_.setAttribute("aria-disabled", 'false'), this;
          }, _0x50ebf7.prototype.disable = function () {
            return this.addClass("vjs-disabled"), this.el_.setAttribute('aria-disabled', "true"), this;
          }, _0x50ebf7.prototype.handleClick = function () {}, _0x50ebf7.prototype.handleFocus = function () {
            _0x90b55b.on(_0x7ebd76["default"], "keydown", _0x5d5929.bind(this, this.handleKeyPress));
          }, _0x50ebf7.prototype.handleKeyPress = function (_0x4c273e) {
            0x20 === _0x4c273e.which || 0xd === _0x4c273e.which ? (_0x4c273e.preventDefault(), this.handleClick(_0x4c273e)) : _0xcccfd9.prototype.handleKeyPress && _0xcccfd9.prototype.handleKeyPress.call(this, _0x4c273e);
          }, _0x50ebf7.prototype.handleBlur = function () {
            _0x90b55b.off(_0x7ebd76["default"], "keydown", _0x5d5929.bind(this, this.handleKeyPress));
          }, _0x50ebf7;
        }(_0x58ad8e["default"]);
      _0x58ad8e["default"].registerComponent("ClickableComponent", _0x26f99d), _0x36ea6b["default"] = _0x26f99d, _0x55a6c1.exports = _0x36ea6b["default"];
    }, {
      './component': 0x43,
      './utils/dom.js': 0x8f,
      './utils/events.js': 0x90,
      './utils/fn.js': 0x91,
      './utils/log.js': 0x94,
      'global/document': 0x1,
      'object.assign': 0x2d
    }],
    0x42: [function (_0x2519e6, _0x1ac7b5, _0x3f27d6) {
      'use strict';

      function _0x594a5a(_0x206216) {
        return _0x206216 && _0x206216.__esModule ? _0x206216 : {
          'default': _0x206216
        };
      }
      function _0xf3bf2f(_0x454752, _0x5b7d00) {
        if (!(_0x454752 instanceof _0x5b7d00)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x32ffd9(_0x2629a8, _0x57e7ef) {
        if ("function" != typeof _0x57e7ef && null !== _0x57e7ef) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x57e7ef);
        _0x2629a8.prototype = Object.create(_0x57e7ef && _0x57e7ef.prototype, {
          'constructor': {
            'value': _0x2629a8,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x57e7ef && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2629a8, _0x57e7ef) : _0x2629a8.__proto__ = _0x57e7ef);
      }
      _0x3f27d6.__esModule = !0x0;
      var _0x5b4f04 = _0x2519e6("./button"),
        _0x34a68b = _0x594a5a(_0x5b4f04),
        _0x4f59d1 = _0x2519e6("./component"),
        _0x2762b7 = _0x594a5a(_0x4f59d1),
        _0x48817b = function (_0x51dbce) {
          function _0x404f77(_0x229439, _0x41e789) {
            _0xf3bf2f(this, _0x404f77), _0x51dbce.call(this, _0x229439, _0x41e789), this.controlText(_0x41e789 && _0x41e789.controlText || this.localize("Close"));
          }
          return _0x32ffd9(_0x404f77, _0x51dbce), _0x404f77.prototype.buildCSSClass = function () {
            return "vjs-close-button " + _0x51dbce.prototype.buildCSSClass.call(this);
          }, _0x404f77.prototype.handleClick = function () {
            this.trigger({
              'type': 'close',
              'bubbles': !0x1
            });
          }, _0x404f77;
        }(_0x34a68b["default"]);
      _0x2762b7["default"].registerComponent("CloseButton", _0x48817b), _0x3f27d6['default'] = _0x48817b, _0x1ac7b5.exports = _0x3f27d6['default'];
    }, {
      './button': 0x40,
      './component': 0x43
    }],
    0x43: [function (_0x387f83, _0x2b6f30, _0x397b8a) {
      'use strict';

      function _0x355ea3(_0x22d36d) {
        if (_0x22d36d && _0x22d36d.__esModule) return _0x22d36d;
        var _0x24d4c9 = {};
        if (null != _0x22d36d) {
          for (var _0xc101cf in _0x22d36d) Object.prototype.hasOwnProperty.call(_0x22d36d, _0xc101cf) && (_0x24d4c9[_0xc101cf] = _0x22d36d[_0xc101cf]);
        }
        return _0x24d4c9["default"] = _0x22d36d, _0x24d4c9;
      }
      function _0x37ee55(_0x2ce897) {
        return _0x2ce897 && _0x2ce897.__esModule ? _0x2ce897 : {
          'default': _0x2ce897
        };
      }
      function _0x148ff7(_0x1da009, _0x3ade70) {
        if (!(_0x1da009 instanceof _0x3ade70)) throw new TypeError("Cannot call a class as a function");
      }
      _0x397b8a.__esModule = !0x0;
      var _0x2c46b7 = _0x387f83("global/window"),
        _0xdc5d85 = _0x37ee55(_0x2c46b7),
        _0x1a0fec = _0x387f83("./utils/dom.js"),
        _0x82dfe6 = _0x355ea3(_0x1a0fec),
        _0x5551ed = _0x387f83("./utils/fn.js"),
        _0x4f9d6f = _0x355ea3(_0x5551ed),
        _0x5add8c = _0x387f83("./utils/guid.js"),
        _0x156d44 = _0x355ea3(_0x5add8c),
        _0x18c539 = _0x387f83('./utils/events.js'),
        _0x8fb453 = _0x355ea3(_0x18c539),
        _0x3308be = _0x387f83("./utils/log.js"),
        _0x2d5de0 = _0x37ee55(_0x3308be),
        _0x3d9a15 = _0x387f83("./utils/to-title-case.js"),
        _0x580cdf = _0x37ee55(_0x3d9a15),
        _0x484a28 = _0x387f83('object.assign'),
        _0x320ccb = _0x37ee55(_0x484a28),
        _0x14ac45 = _0x387f83("./utils/merge-options.js"),
        _0x15f0ac = _0x37ee55(_0x14ac45),
        _0x470e6e = function () {
          function _0x1da516(_0x1ecd23, _0x9d9787, _0x9a26c7) {
            if (_0x148ff7(this, _0x1da516), this.player_ = !_0x1ecd23 && this.play ? _0x1ecd23 = this : _0x1ecd23, this.options_ = _0x15f0ac['default']({}, this.options_), _0x9d9787 = this.options_ = _0x15f0ac["default"](this.options_, _0x9d9787), this.id_ = _0x9d9787.id || _0x9d9787.el && _0x9d9787.el.id, !this.id_) {
              var _0x4134e8 = _0x1ecd23 && _0x1ecd23.id && _0x1ecd23.id() || "no_player";
              this.id_ = _0x4134e8 + "_component_" + _0x156d44.newGUID();
            }
            this.name_ = _0x9d9787.name || null, _0x9d9787.el ? this.el_ = _0x9d9787.el : _0x9d9787.createEl !== !0x1 && (this.el_ = this.createEl()), this.children_ = [], this.childIndex_ = {}, this.childNameIndex_ = {}, _0x9d9787.initChildren !== !0x1 && this.initChildren(), this.ready(_0x9a26c7), _0x9d9787.reportTouchActivity !== !0x1 && this.enableTouchActivity();
          }
          return _0x1da516.prototype.dispose = function () {
            if (this.trigger({
              'type': "dispose",
              'bubbles': !0x1
            }), this.children_) {
              for (var _0x4e7235 = this.children_.length - 0x1; _0x4e7235 >= 0x0; _0x4e7235--) this.children_[_0x4e7235].dispose && this.children_[_0x4e7235].dispose();
            }
            this.children_ = null, this.childIndex_ = null, this.childNameIndex_ = null, this.off(), this.el_.parentNode && this.el_.parentNode.removeChild(this.el_), _0x82dfe6.removeElData(this.el_), this.el_ = null;
          }, _0x1da516.prototype.player = function () {
            return this.player_;
          }, _0x1da516.prototype.options = function (_0x1cbd2e) {
            return _0x2d5de0['default'].warn('this.options()\x20has\x20been\x20deprecated\x20and\x20will\x20be\x20moved\x20to\x20the\x20constructor\x20in\x206.0'), _0x1cbd2e ? (this.options_ = _0x15f0ac["default"](this.options_, _0x1cbd2e), this.options_) : this.options_;
          }, _0x1da516.prototype.el = function () {
            return this.el_;
          }, _0x1da516.prototype.createEl = function (_0x4f1ca7, _0x3cd5f8, _0x461800) {
            return _0x82dfe6.createEl(_0x4f1ca7, _0x3cd5f8, _0x461800);
          }, _0x1da516.prototype.localize = function (_0x8acdf8) {
            var _0x43b1fb = this.player_.language && this.player_.language(),
              _0x36f50d = this.player_.languages && this.player_.languages();
            if (!_0x43b1fb || !_0x36f50d) return _0x8acdf8;
            var _0x574ead = _0x36f50d[_0x43b1fb];
            if (_0x574ead && _0x574ead[_0x8acdf8]) return _0x574ead[_0x8acdf8];
            var _0x2233bc = _0x43b1fb.split('-')[0x0],
              _0x27ed41 = _0x36f50d[_0x2233bc];
            return _0x27ed41 && _0x27ed41[_0x8acdf8] ? _0x27ed41[_0x8acdf8] : _0x8acdf8;
          }, _0x1da516.prototype.contentEl = function () {
            return this.contentEl_ || this.el_;
          }, _0x1da516.prototype.id = function () {
            return this.id_;
          }, _0x1da516.prototype.name = function () {
            return this.name_;
          }, _0x1da516.prototype.children = function () {
            return this.children_;
          }, _0x1da516.prototype.getChildById = function (_0x10b09a) {
            return this.childIndex_[_0x10b09a];
          }, _0x1da516.prototype.getChild = function (_0x3c26dc) {
            return this.childNameIndex_[_0x3c26dc];
          }, _0x1da516.prototype.addChild = function (_0x2c5f14) {
            var _0x39e4c9 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1],
              _0x4162be = arguments.length <= 0x2 || void 0x0 === arguments[0x2] ? this.children_.length : arguments[0x2],
              _0x2b8358 = void 0x0,
              _0x2c215d = void 0x0;
            if ('string' == typeof _0x2c5f14) {
              _0x2c215d = _0x2c5f14, _0x39e4c9 || (_0x39e4c9 = {}), _0x39e4c9 === !0x0 && (_0x2d5de0["default"].warn("Initializing a child component with `true` is deprecated. Children should be defined in an array when possible, but if necessary use an object instead of `true`."), _0x39e4c9 = {});
              var _0xeddac1 = _0x39e4c9.componentClass || _0x580cdf["default"](_0x2c215d);
              _0x39e4c9.name = _0x2c215d;
              var _0x4dd822 = _0x1da516.getComponent(_0xeddac1);
              if (!_0x4dd822) throw new Error("Component " + _0xeddac1 + '\x20does\x20not\x20exist');
              if ("function" != typeof _0x4dd822) return null;
              _0x2b8358 = new _0x4dd822(this.player_ || this, _0x39e4c9);
            } else _0x2b8358 = _0x2c5f14;
            if (this.children_.splice(_0x4162be, 0x0, _0x2b8358), "function" == typeof _0x2b8358.id && (this.childIndex_[_0x2b8358.id()] = _0x2b8358), _0x2c215d = _0x2c215d || _0x2b8358.name && _0x2b8358.name(), _0x2c215d && (this.childNameIndex_[_0x2c215d] = _0x2b8358), "function" == typeof _0x2b8358.el && _0x2b8358.el()) {
              var _0x14a7f5 = this.contentEl().children,
                _0x5182ad = _0x14a7f5[_0x4162be] || null;
              this.contentEl().insertBefore(_0x2b8358.el(), _0x5182ad);
            }
            return _0x2b8358;
          }, _0x1da516.prototype.removeChild = function (_0x2a1332) {
            if ("string" == typeof _0x2a1332 && (_0x2a1332 = this.getChild(_0x2a1332)), _0x2a1332 && this.children_) {
              for (var _0x291aae = !0x1, _0x8b86b5 = this.children_.length - 0x1; _0x8b86b5 >= 0x0; _0x8b86b5--) if (this.children_[_0x8b86b5] === _0x2a1332) {
                _0x291aae = !0x0, this.children_.splice(_0x8b86b5, 0x1);
                break;
              }
              if (_0x291aae) {
                this.childIndex_[_0x2a1332.id()] = null, this.childNameIndex_[_0x2a1332.name()] = null;
                var _0x51ce5a = _0x2a1332.el();
                _0x51ce5a && _0x51ce5a.parentNode === this.contentEl() && this.contentEl().removeChild(_0x2a1332.el());
              }
            }
          }, _0x1da516.prototype.initChildren = function () {
            this.options_.children && !function () {
              var _0x33ea6b = function (_0x52b7c6) {
                  var _0x2520eb = _0x52b7c6.name,
                    _0x91381b = _0x52b7c6.opts;
                  if (void 0x0 !== this.options_[_0x2520eb] && (_0x91381b = this.options_[_0x2520eb]), _0x91381b !== !0x1) {
                    _0x91381b === !0x0 && (_0x91381b = {}), _0x91381b.playerOptions = this.options_.playerOptions;
                    var _0x2ba63c = this.addChild(_0x2520eb, _0x91381b);
                    _0x2ba63c && (this[_0x2520eb] = _0x2ba63c);
                  }
                },
                _0x50cda3 = void 0x0,
                _0x48052f = _0x1da516.getComponent("Tech");
              _0x50cda3 = Array.isArray(this.options_.children) ? this.options_.children : Object.keys(this.options_.children), _0x50cda3.concat(Object.keys(this.options_).filter(function (_0x2aa5e9) {
                return !_0x50cda3.some(function (_0x3cbe1a) {
                  return "string" == typeof _0x3cbe1a ? _0x2aa5e9 === _0x3cbe1a : _0x2aa5e9 === _0x3cbe1a.name;
                });
              })).map(function (_0x707b87) {
                var _0x53459c = void 0x0,
                  _0x36ac0e = void 0x0;
                return "string" == typeof _0x707b87 ? (_0x53459c = _0x707b87, _0x36ac0e = this.options_.children[_0x53459c] || this.options_[_0x53459c] || {}) : (_0x53459c = _0x707b87.name, _0x36ac0e = _0x707b87), {
                  'name': _0x53459c,
                  'opts': _0x36ac0e
                };
              }).filter(function (_0x2a5d9b) {
                var _0x276d61 = _0x1da516.getComponent(_0x2a5d9b.opts.componentClass || _0x580cdf["default"](_0x2a5d9b.name));
                return _0x276d61 && !_0x48052f.isTech(_0x276d61);
              }).forEach(_0x33ea6b);
            }();
          }, _0x1da516.prototype.buildCSSClass = function () {
            return '';
          }, _0x1da516.prototype.on = function (_0x2df035, _0x138e7d, _0x2a8bd3) {
            return 'string' == typeof _0x2df035 || Array.isArray(_0x2df035) ? _0x8fb453.on(this.el_, _0x2df035, _0x4f9d6f.bind(this, _0x138e7d)) : !function () {
              var _0x4cb7df = _0x2df035,
                _0x396db7 = _0x138e7d,
                _0x23203c = _0x4f9d6f.bind(this, _0x2a8bd3),
                _0x456714 = function () {
                  return this.off(_0x4cb7df, _0x396db7, _0x23203c);
                };
              _0x456714.guid = _0x23203c.guid, this.on("dispose", _0x456714);
              var _0x10612e = function () {
                return this.off("dispose", _0x456714);
              };
              _0x10612e.guid = _0x23203c.guid, _0x2df035.nodeName ? (_0x8fb453.on(_0x4cb7df, _0x396db7, _0x23203c), _0x8fb453.on(_0x4cb7df, "dispose", _0x10612e)) : "function" == typeof _0x2df035.on && (_0x4cb7df.on(_0x396db7, _0x23203c), _0x4cb7df.on("dispose", _0x10612e));
            }(), this;
          }, _0x1da516.prototype.off = function (_0x27df48, _0x1b7c6c, _0x2d19f8) {
            if (!_0x27df48 || "string" == typeof _0x27df48 || Array.isArray(_0x27df48)) _0x8fb453.off(this.el_, _0x27df48, _0x1b7c6c);else {
              var _0x540ab4 = _0x27df48,
                _0x350ce1 = _0x1b7c6c,
                _0x58c39a = _0x4f9d6f.bind(this, _0x2d19f8);
              this.off("dispose", _0x58c39a), _0x27df48.nodeName ? (_0x8fb453.off(_0x540ab4, _0x350ce1, _0x58c39a), _0x8fb453.off(_0x540ab4, "dispose", _0x58c39a)) : (_0x540ab4.off(_0x350ce1, _0x58c39a), _0x540ab4.off("dispose", _0x58c39a));
            }
            return this;
          }, _0x1da516.prototype.one = function (_0x35d263, _0x424381, _0x15470e) {
            return "string" == typeof _0x35d263 || Array.isArray(_0x35d263) ? _0x8fb453.one(this.el_, _0x35d263, _0x4f9d6f.bind(this, _0x424381)) : !function () {
              var _0x457b35 = _0x35d263,
                _0x13049d = _0x424381,
                _0x199c37 = _0x4f9d6f.bind(this, _0x15470e),
                _0x3cf6ce = function _0x2e17c5() {
                  this.off(_0x457b35, _0x13049d, _0x2e17c5), _0x199c37.apply(null, arguments);
                };
              _0x3cf6ce.guid = _0x199c37.guid, this.on(_0x457b35, _0x13049d, _0x3cf6ce);
            }(), this;
          }, _0x1da516.prototype.trigger = function (_0x4037bb, _0x14c7fa) {
            return _0x8fb453.trigger(this.el_, _0x4037bb, _0x14c7fa), this;
          }, _0x1da516.prototype.ready = function (_0x2d35ce) {
            var _0x12311d = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? !0x1 : arguments[0x1];
            return _0x2d35ce && (this.isReady_ ? _0x12311d ? _0x2d35ce.call(this) : this.setTimeout(_0x2d35ce, 0x1) : (this.readyQueue_ = this.readyQueue_ || [], this.readyQueue_.push(_0x2d35ce))), this;
          }, _0x1da516.prototype.triggerReady = function () {
            this.isReady_ = !0x0, this.setTimeout(function () {
              this.readyQueue_ = [], this.readyQueue_ && this.readyQueue_.length > 0x0 && this.readyQueue_.forEach(function (_0x2c39f8) {
                _0x2c39f8.call(this);
              }, this), this.trigger("ready");
            }, 0x1);
          }, _0x1da516.prototype.$ = function (_0x27b40a, _0x1203c3) {
            return _0x82dfe6.$(_0x27b40a, _0x1203c3 || this.contentEl());
          }, _0x1da516.prototype.$$ = function (_0x3bdff5, _0x2eaa9e) {
            return _0x82dfe6.$$(_0x3bdff5, _0x2eaa9e || this.contentEl());
          }, _0x1da516.prototype.hasClass = function (_0x2a3e23) {
            return _0x82dfe6.hasElClass(this.el_, _0x2a3e23);
          }, _0x1da516.prototype.addClass = function (_0xa5a5e3) {
            return _0x82dfe6.addElClass(this.el_, _0xa5a5e3), this;
          }, _0x1da516.prototype.removeClass = function (_0x43d7fc) {
            return _0x82dfe6.removeElClass(this.el_, _0x43d7fc), this;
          }, _0x1da516.prototype.toggleClass = function (_0x436ddd, _0x232fb2) {
            return _0x82dfe6.toggleElClass(this.el_, _0x436ddd, _0x232fb2), this;
          }, _0x1da516.prototype.show = function () {
            return this.removeClass("vjs-hidden"), this;
          }, _0x1da516.prototype.hide = function () {
            return this.addClass("vjs-hidden"), this;
          }, _0x1da516.prototype.lockShowing = function () {
            return this.addClass("vjs-lock-showing"), this;
          }, _0x1da516.prototype.unlockShowing = function () {
            return this.removeClass("vjs-lock-showing"), this;
          }, _0x1da516.prototype.width = function (_0x5f3c19, _0xedc267) {
            return this.dimension("width", _0x5f3c19, _0xedc267);
          }, _0x1da516.prototype.height = function (_0x1370c2, _0x6dd773) {
            return this.dimension('height', _0x1370c2, _0x6dd773);
          }, _0x1da516.prototype.dimensions = function (_0x36f3ca, _0xb7b01) {
            return this.width(_0x36f3ca, !0x0).height(_0xb7b01);
          }, _0x1da516.prototype.dimension = function (_0x850fae, _0x3ae6ed, _0x98ebb7) {
            if (void 0x0 !== _0x3ae6ed) return (null === _0x3ae6ed || _0x3ae6ed !== _0x3ae6ed) && (_0x3ae6ed = 0x0), this.el_.style[_0x850fae] = -0x1 !== ('' + _0x3ae6ed).indexOf('%') || -0x1 !== ('' + _0x3ae6ed).indexOf('px') ? _0x3ae6ed : "auto" === _0x3ae6ed ? '' : _0x3ae6ed + 'px', _0x98ebb7 || this.trigger('resize'), this;
            if (!this.el_) return 0x0;
            var _0x3b8f9d = this.el_.style[_0x850fae],
              _0x417f30 = _0x3b8f9d.indexOf('px');
            return -0x1 !== _0x417f30 ? parseInt(_0x3b8f9d.slice(0x0, _0x417f30), 0xa) : parseInt(this.el_['offset' + _0x580cdf["default"](_0x850fae)], 0xa);
          }, _0x1da516.prototype.currentDimension = function (_0x5dc978) {
            var _0x4afe63 = 0x0;
            if ("width" !== _0x5dc978 && "height" !== _0x5dc978) throw new Error('currentDimension\x20only\x20accepts\x20width\x20or\x20height\x20value');
            if ("function" == typeof _0xdc5d85["default"].getComputedStyle) {
              var _0x559d49 = _0xdc5d85["default"].getComputedStyle(this.el_);
              _0x4afe63 = _0x559d49.getPropertyValue(_0x5dc978) || _0x559d49[_0x5dc978];
            } else {
              if (this.el_.currentStyle) {
                var _0xcb6b0 = 'offset' + _0x580cdf['default'](_0x5dc978);
                _0x4afe63 = this.el_[_0xcb6b0];
              }
            }
            return _0x4afe63 = parseFloat(_0x4afe63);
          }, _0x1da516.prototype.currentDimensions = function () {
            return {
              'width': this.currentDimension("width"),
              'height': this.currentDimension("height")
            };
          }, _0x1da516.prototype.currentWidth = function () {
            return this.currentDimension("width");
          }, _0x1da516.prototype.currentHeight = function () {
            return this.currentDimension('height');
          }, _0x1da516.prototype.emitTapEvents = function () {
            var _0x5583e0 = 0x0,
              _0x578a1a = null,
              _0x1f506c = void 0x0;
            this.on('touchstart', function (_0x54e4ac) {
              0x1 === _0x54e4ac.touches.length && (_0x578a1a = _0x320ccb["default"]({}, _0x54e4ac.touches[0x0]), _0x5583e0 = new Date().getTime(), _0x1f506c = !0x0);
            }), this.on("touchmove", function (_0x53b8a3) {
              if (_0x53b8a3.touches.length > 0x1) _0x1f506c = !0x1;else {
                if (_0x578a1a) {
                  var _0x4af08a = _0x53b8a3.touches[0x0].pageX - _0x578a1a.pageX,
                    _0xf889a2 = _0x53b8a3.touches[0x0].pageY - _0x578a1a.pageY,
                    _0x94f472 = Math.sqrt(_0x4af08a * _0x4af08a + _0xf889a2 * _0xf889a2);
                  _0x94f472 > 0xa && (_0x1f506c = !0x1);
                }
              }
            });
            var _0x2e527c = function () {
              _0x1f506c = !0x1;
            };
            this.on("touchleave", _0x2e527c), this.on('touchcancel', _0x2e527c), this.on("touchend", function (_0xc22e76) {
              if (_0x578a1a = null, _0x1f506c === !0x0) {
                var _0x1959c0 = new Date().getTime() - _0x5583e0;
                0xc8 > _0x1959c0 && (_0xc22e76.preventDefault(), this.trigger("tap"));
              }
            });
          }, _0x1da516.prototype.enableTouchActivity = function () {
            if (this.player() && this.player().reportUserActivity) {
              var _0x3fff82 = _0x4f9d6f.bind(this.player(), this.player().reportUserActivity);
              this.on('touchstart', function () {
                _0x3fff82(), this.clearInterval(void 0x0), _0x5ccf04 = this.setInterval(_0x3fff82, 0xfa);
              });
              var _0x5010ea = function () {
                _0x3fff82(), this.clearInterval(_0x5ccf04);
              };
              this.on('touchmove', _0x3fff82), this.on("touchend", _0x5010ea), this.on("touchcancel", _0x5010ea);
            }
          }, _0x1da516.prototype.setTimeout = function (_0x3dd7bd, _0x402351) {
            _0x3dd7bd = _0x4f9d6f.bind(this, _0x3dd7bd);
            var _0xefe5d5 = _0xdc5d85["default"].setTimeout(_0x3dd7bd, _0x402351),
              _0x3764c2 = function () {
                this.clearTimeout(_0xefe5d5);
              };
            return _0x3764c2.guid = "vjs-timeout-" + _0xefe5d5, this.on("dispose", _0x3764c2), _0xefe5d5;
          }, _0x1da516.prototype.clearTimeout = function (_0x20ceb5) {
            _0xdc5d85["default"].clearTimeout(_0x20ceb5);
            var _0x1589c5 = function () {};
            return _0x1589c5.guid = "vjs-timeout-" + _0x20ceb5, this.off("dispose", _0x1589c5), _0x20ceb5;
          }, _0x1da516.prototype.setInterval = function (_0x4cc772, _0x256d37) {
            _0x4cc772 = _0x4f9d6f.bind(this, _0x4cc772);
            var _0x2fb379 = _0xdc5d85["default"].setInterval(_0x4cc772, _0x256d37),
              _0x170005 = function () {
                this.clearInterval(_0x2fb379);
              };
            return _0x170005.guid = "vjs-interval-" + _0x2fb379, this.on("dispose", _0x170005), _0x2fb379;
          }, _0x1da516.prototype.clearInterval = function (_0x1bf51c) {
            _0xdc5d85["default"].clearInterval(_0x1bf51c);
            var _0xc24c40 = function () {};
            return _0xc24c40.guid = "vjs-interval-" + _0x1bf51c, this.off("dispose", _0xc24c40), _0x1bf51c;
          }, _0x1da516.registerComponent = function (_0x4f932b, _0x4ef4b2) {
            return _0x1da516.components_ || (_0x1da516.components_ = {}), _0x1da516.components_[_0x4f932b] = _0x4ef4b2, _0x4ef4b2;
          }, _0x1da516.getComponent = function (_0x9a84d6) {
            return _0x1da516.components_ && _0x1da516.components_[_0x9a84d6] ? _0x1da516.components_[_0x9a84d6] : _0xdc5d85["default"] && _0xdc5d85["default"].videojs && _0xdc5d85['default'].videojs[_0x9a84d6] ? (_0x2d5de0['default'].warn("The " + _0x9a84d6 + " component was added to the videojs object when it should be registered using videojs.registerComponent(name, component)"), _0xdc5d85["default"].videojs[_0x9a84d6]) : void 0x0;
          }, _0x1da516.extend = function (_0x4db4bf) {
            _0x4db4bf = _0x4db4bf || {}, _0x2d5de0['default'].warn("Component.extend({}) has been deprecated, use videojs.extend(Component, {}) instead");
            var _0x28386b = _0x4db4bf.init || _0x4db4bf.init || this.prototype.init || this.prototype.init || function () {},
              _0x298493 = function () {
                _0x28386b.apply(this, arguments);
              };
            _0x298493.prototype = Object.create(this.prototype), _0x298493.prototype.constructor = _0x298493, _0x298493.extend = _0x1da516.extend;
            for (var _0x1ad4d5 in _0x4db4bf) _0x4db4bf.hasOwnProperty(_0x1ad4d5) && (_0x298493.prototype[_0x1ad4d5] = _0x4db4bf[_0x1ad4d5]);
            return _0x298493;
          }, _0x1da516;
        }();
      _0x470e6e.registerComponent("Component", _0x470e6e), _0x397b8a['default'] = _0x470e6e, _0x2b6f30.exports = _0x397b8a["default"];
    }, {
      './utils/dom.js': 0x8f,
      './utils/events.js': 0x90,
      './utils/fn.js': 0x91,
      './utils/guid.js': 0x93,
      './utils/log.js': 0x94,
      './utils/merge-options.js': 0x95,
      './utils/to-title-case.js': 0x98,
      'global/window': 0x2,
      'object.assign': 0x2d
    }],
    0x44: [function (_0x429600, _0x1d53b5, _0x254d72) {
      'use strict';

      function _0x548c83(_0x1ff032) {
        if (_0x1ff032 && _0x1ff032.__esModule) return _0x1ff032;
        var _0x218110 = {};
        if (null != _0x1ff032) {
          for (var _0x4069b9 in _0x1ff032) Object.prototype.hasOwnProperty.call(_0x1ff032, _0x4069b9) && (_0x218110[_0x4069b9] = _0x1ff032[_0x4069b9]);
        }
        return _0x218110['default'] = _0x1ff032, _0x218110;
      }
      function _0x28bd9a(_0x2bb529) {
        return _0x2bb529 && _0x2bb529.__esModule ? _0x2bb529 : {
          'default': _0x2bb529
        };
      }
      function _0x27f572(_0x27fffc, _0x1ea7c2) {
        if (!(_0x27fffc instanceof _0x1ea7c2)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x15f0e3(_0x3efadd, _0x4a5716) {
        if ("function" != typeof _0x4a5716 && null !== _0x4a5716) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x4a5716);
        _0x3efadd.prototype = Object.create(_0x4a5716 && _0x4a5716.prototype, {
          'constructor': {
            'value': _0x3efadd,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x4a5716 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3efadd, _0x4a5716) : _0x3efadd.__proto__ = _0x4a5716);
      }
      _0x254d72.__esModule = !0x0;
      var _0x4de7df = _0x429600("../track-button.js"),
        _0x4c2f78 = _0x28bd9a(_0x4de7df),
        _0x37b33a = _0x429600("../../component.js"),
        _0x4b22e4 = _0x28bd9a(_0x37b33a),
        _0x5a810c = _0x429600('../../utils/fn.js'),
        _0x3af835 = (_0x548c83(_0x5a810c), _0x429600('./audio-track-menu-item.js')),
        _0x3066c6 = _0x28bd9a(_0x3af835),
        _0x7908fe = function (_0x155643) {
          function _0x70c80(_0x29edd1) {
            var _0x54f519 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            _0x27f572(this, _0x70c80), _0x54f519.tracks = _0x29edd1.audioTracks && _0x29edd1.audioTracks(), _0x155643.call(this, _0x29edd1, _0x54f519), this.el_.setAttribute("aria-label", "Audio Menu");
          }
          return _0x15f0e3(_0x70c80, _0x155643), _0x70c80.prototype.buildCSSClass = function () {
            return "vjs-audio-button " + _0x155643.prototype.buildCSSClass.call(this);
          }, _0x70c80.prototype.createItems = function () {
            var _0x456ca8 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0],
              _0x598d65 = this.player_.audioTracks && this.player_.audioTracks();
            if (!_0x598d65) return _0x456ca8;
            for (var _0x18dfcb = 0x0; 0x0 < _0x598d65.length; _0x18dfcb++) {
              var _0x32d151 = _0x598d65[_0x18dfcb];
              _0x456ca8.push(new _0x3066c6["default"](this.player_, {
                'selectable': !0x0,
                'track': _0x32d151
              }));
            }
            return _0x456ca8;
          }, _0x70c80;
        }(_0x4c2f78['default']);
      _0x4b22e4['default'].registerComponent("AudioTrackButton", _0x7908fe), _0x254d72['default'] = _0x7908fe, _0x1d53b5.exports = _0x254d72["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/fn.js': 0x91,
      '../track-button.js': 0x62,
      './audio-track-menu-item.js': 0x45
    }],
    0x45: [function (_0x19ba29, _0x261f62, _0x2f10fc) {
      'use strict';

      function _0x467136(_0xf5fd0c) {
        if (_0xf5fd0c && _0xf5fd0c.__esModule) return _0xf5fd0c;
        var _0x4e594c = {};
        if (null != _0xf5fd0c) {
          for (var _0x59cb1c in _0xf5fd0c) Object.prototype.hasOwnProperty.call(_0xf5fd0c, _0x59cb1c) && (_0x4e594c[_0x59cb1c] = _0xf5fd0c[_0x59cb1c]);
        }
        return _0x4e594c["default"] = _0xf5fd0c, _0x4e594c;
      }
      function _0x5c0f27(_0x3c334d) {
        return _0x3c334d && _0x3c334d.__esModule ? _0x3c334d : {
          'default': _0x3c334d
        };
      }
      function _0x54a304(_0x12a548, _0x59c325) {
        if (!(_0x12a548 instanceof _0x59c325)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x5cff68(_0x164b2a, _0x3d8d73) {
        if ("function" != typeof _0x3d8d73 && null !== _0x3d8d73) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x3d8d73);
        _0x164b2a.prototype = Object.create(_0x3d8d73 && _0x3d8d73.prototype, {
          'constructor': {
            'value': _0x164b2a,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x3d8d73 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x164b2a, _0x3d8d73) : _0x164b2a.__proto__ = _0x3d8d73);
      }
      _0x2f10fc.__esModule = !0x0;
      var _0x50fe96 = _0x19ba29("../../menu/menu-item.js"),
        _0x44296e = _0x5c0f27(_0x50fe96),
        _0x281489 = _0x19ba29("../../component.js"),
        _0xded1e3 = _0x5c0f27(_0x281489),
        _0x17a8d0 = _0x19ba29("../../utils/fn.js"),
        _0x1c7310 = _0x467136(_0x17a8d0),
        _0x5d303e = function (_0x54518b) {
          function _0x48b096(_0x1852f5, _0x580f10) {
            _0x54a304(this, _0x48b096);
            var _0x5a46ef = _0x580f10.track,
              _0x22c1b3 = _0x1852f5.audioTracks();
            _0x580f10.label = _0x5a46ef.label || _0x5a46ef.language || "Unknown", _0x580f10.selected = _0x5a46ef.enabled, _0x54518b.call(this, _0x1852f5, _0x580f10), this.track = _0x5a46ef, _0x22c1b3 && !function () {
              var _0x2c36d5 = _0x1c7310.bind(this, this.handleTracksChange);
              _0x22c1b3.addEventListener('change', _0x2c36d5), this.on("dispose", function () {
                _0x22c1b3.removeEventListener('change', _0x2c36d5);
              });
            }();
          }
          return _0x5cff68(_0x48b096, _0x54518b), _0x48b096.prototype.handleClick = function (_0x1acafa) {
            var _0x34e9af = this.player_.audioTracks();
            if (_0x54518b.prototype.handleClick.call(this, _0x1acafa), _0x34e9af) for (var _0x3433b9 = 0x0; 0x0 < _0x34e9af.length; _0x3433b9++) {
              var _0xd432d = _0x34e9af[_0x3433b9];
              _0xd432d === this.track && (_0xd432d.enabled = !0x0);
            }
          }, _0x48b096.prototype.handleTracksChange = function () {
            this.selected(this.track.enabled);
          }, _0x48b096;
        }(_0x44296e["default"]);
      _0xded1e3["default"].registerComponent('AudioTrackMenuItem', _0x5d303e), _0x2f10fc["default"] = _0x5d303e, _0x261f62.exports = _0x2f10fc["default"];
    }, {
      '../../component.js': 0x43,
      '../../menu/menu-item.js': 0x6e,
      '../../utils/fn.js': 0x91
    }],
    0x46: [function (_0x27df1c, _0x380b3e, _0x5ef7c9) {
      'use strict';

      function _0x1ebbf3(_0x50050f) {
        return _0x50050f && _0x50050f.__esModule ? _0x50050f : {
          'default': _0x50050f
        };
      }
      function _0x6c392f(_0x58714f, _0x3afae6) {
        if (!(_0x58714f instanceof _0x3afae6)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x31a4c7(_0x2b05a1, _0x2b963f) {
        if ("function" != typeof _0x2b963f && null !== _0x2b963f) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x2b963f);
        _0x2b05a1.prototype = Object.create(_0x2b963f && _0x2b963f.prototype, {
          'constructor': {
            'value': _0x2b05a1,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x2b963f && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2b05a1, _0x2b963f) : _0x2b05a1.__proto__ = _0x2b963f);
      }
      _0x5ef7c9.__esModule = !0x0;
      var _0x5f1109 = _0x27df1c("../component.js"),
        _0x3220cd = _0x1ebbf3(_0x5f1109),
        _0x17b4ac = _0x27df1c("./play-toggle.js"),
        _0x519a57 = (_0x1ebbf3(_0x17b4ac), _0x27df1c("./time-controls/current-time-display.js")),
        _0x2788b0 = (_0x1ebbf3(_0x519a57), _0x27df1c('./time-controls/duration-display.js')),
        _0x1bbbce = (_0x1ebbf3(_0x2788b0), _0x27df1c('./time-controls/time-divider.js')),
        _0x430ab4 = (_0x1ebbf3(_0x1bbbce), _0x27df1c("./time-controls/remaining-time-display.js")),
        _0x1c51dc = (_0x1ebbf3(_0x430ab4), _0x27df1c('./live-display.js')),
        _0x467fde = (_0x1ebbf3(_0x1c51dc), _0x27df1c("./progress-control/progress-control.js")),
        _0x49fd25 = (_0x1ebbf3(_0x467fde), _0x27df1c("./fullscreen-toggle.js")),
        _0x590c61 = (_0x1ebbf3(_0x49fd25), _0x27df1c("./volume-control/volume-control.js")),
        _0x306058 = (_0x1ebbf3(_0x590c61), _0x27df1c("./volume-menu-button.js")),
        _0x48cd47 = (_0x1ebbf3(_0x306058), _0x27df1c("./mute-toggle.js")),
        _0x1fb36d = (_0x1ebbf3(_0x48cd47), _0x27df1c("./text-track-controls/chapters-button.js")),
        _0x153bc9 = (_0x1ebbf3(_0x1fb36d), _0x27df1c("./text-track-controls/descriptions-button.js")),
        _0x76028d = (_0x1ebbf3(_0x153bc9), _0x27df1c("./text-track-controls/subtitles-button.js")),
        _0x3988a2 = (_0x1ebbf3(_0x76028d), _0x27df1c("./text-track-controls/captions-button.js")),
        _0x4e88e5 = (_0x1ebbf3(_0x3988a2), _0x27df1c("./audio-track-controls/audio-track-button.js")),
        _0x3d810a = (_0x1ebbf3(_0x4e88e5), _0x27df1c('./playback-rate-menu/playback-rate-menu-button.js')),
        _0x5a83a0 = (_0x1ebbf3(_0x3d810a), _0x27df1c("./spacer-controls/custom-control-spacer.js")),
        _0x193dc0 = (_0x1ebbf3(_0x5a83a0), function (_0x12dfbb) {
          function _0x1793c1() {
            _0x6c392f(this, _0x1793c1), _0x12dfbb.apply(this, arguments);
          }
          return _0x31a4c7(_0x1793c1, _0x12dfbb), _0x1793c1.prototype.createEl = function () {
            return _0x12dfbb.prototype.createEl.call(this, "div", {
              'className': "vjs-control-bar",
              'dir': "ltr"
            }, {
              'role': "group"
            });
          }, _0x1793c1;
        }(_0x3220cd['default']));
      _0x193dc0.prototype.options_ = {
        'children': ["playToggle", 'volumeMenuButton', "currentTimeDisplay", "timeDivider", "durationDisplay", "progressControl", "liveDisplay", "remainingTimeDisplay", 'customControlSpacer', "playbackRateMenuButton", 'chaptersButton', "descriptionsButton", 'subtitlesButton', "captionsButton", "audioTrackButton", "fullscreenToggle"]
      }, _0x3220cd['default'].registerComponent("ControlBar", _0x193dc0), _0x5ef7c9["default"] = _0x193dc0, _0x380b3e.exports = _0x5ef7c9['default'];
    }, {
      '../component.js': 0x43,
      './audio-track-controls/audio-track-button.js': 0x44,
      './fullscreen-toggle.js': 0x47,
      './live-display.js': 0x48,
      './mute-toggle.js': 0x49,
      './play-toggle.js': 0x4a,
      './playback-rate-menu/playback-rate-menu-button.js': 0x4b,
      './progress-control/progress-control.js': 0x50,
      './spacer-controls/custom-control-spacer.js': 0x53,
      './text-track-controls/captions-button.js': 0x56,
      './text-track-controls/chapters-button.js': 0x57,
      './text-track-controls/descriptions-button.js': 0x59,
      './text-track-controls/subtitles-button.js': 0x5b,
      './time-controls/current-time-display.js': 0x5e,
      './time-controls/duration-display.js': 0x5f,
      './time-controls/remaining-time-display.js': 0x60,
      './time-controls/time-divider.js': 0x61,
      './volume-control/volume-control.js': 0x64,
      './volume-menu-button.js': 0x66
    }],
    0x47: [function (_0x324cb3, _0x4d1865, _0x4bfbfc) {
      'use strict';

      function _0x14fde8(_0x597b4e) {
        return _0x597b4e && _0x597b4e.__esModule ? _0x597b4e : {
          'default': _0x597b4e
        };
      }
      function _0x46bd65(_0x1377dd, _0x272a98) {
        if (!(_0x1377dd instanceof _0x272a98)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x29d94(_0x262fce, _0x35e31a) {
        if ("function" != typeof _0x35e31a && null !== _0x35e31a) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x35e31a);
        _0x262fce.prototype = Object.create(_0x35e31a && _0x35e31a.prototype, {
          'constructor': {
            'value': _0x262fce,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x35e31a && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x262fce, _0x35e31a) : _0x262fce.__proto__ = _0x35e31a);
      }
      _0x4bfbfc.__esModule = !0x0;
      var _0x5e6bc5 = _0x324cb3("../button.js"),
        _0x42baa5 = _0x14fde8(_0x5e6bc5),
        _0x5df241 = _0x324cb3("../component.js"),
        _0x48159a = _0x14fde8(_0x5df241),
        _0x4f82cc = function (_0x318a42) {
          function _0x32826e() {
            _0x46bd65(this, _0x32826e), _0x318a42.apply(this, arguments);
          }
          return _0x29d94(_0x32826e, _0x318a42), _0x32826e.prototype.buildCSSClass = function () {
            return "vjs-fullscreen-control " + _0x318a42.prototype.buildCSSClass.call(this);
          }, _0x32826e.prototype.handleClick = function () {
            this.player_.isFullscreen() ? (this.player_.exitFullscreen(), this.controlText("Fullscreen")) : (this.player_.requestFullscreen(), this.controlText('Non-Fullscreen'));
          }, _0x32826e;
        }(_0x42baa5["default"]);
      _0x4f82cc.prototype.controlText_ = "Fullscreen", _0x48159a["default"].registerComponent("FullscreenToggle", _0x4f82cc), _0x4bfbfc['default'] = _0x4f82cc, _0x4d1865.exports = _0x4bfbfc["default"];
    }, {
      '../button.js': 0x40,
      '../component.js': 0x43
    }],
    0x48: [function (_0x4167e0, _0x85ffe0, _0x289001) {
      'use strict';

      function _0x5c1571(_0x2c5e29) {
        if (_0x2c5e29 && _0x2c5e29.__esModule) return _0x2c5e29;
        var _0x4bceb0 = {};
        if (null != _0x2c5e29) {
          for (var _0x3db6f2 in _0x2c5e29) Object.prototype.hasOwnProperty.call(_0x2c5e29, _0x3db6f2) && (_0x4bceb0[_0x3db6f2] = _0x2c5e29[_0x3db6f2]);
        }
        return _0x4bceb0['default'] = _0x2c5e29, _0x4bceb0;
      }
      function _0x2febac(_0x313234) {
        return _0x313234 && _0x313234.__esModule ? _0x313234 : {
          'default': _0x313234
        };
      }
      function _0x2a376f(_0x4533a7, _0x5d04a6) {
        if (!(_0x4533a7 instanceof _0x5d04a6)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x4a6912(_0x23499f, _0x3acdee) {
        if ("function" != typeof _0x3acdee && null !== _0x3acdee) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x3acdee);
        _0x23499f.prototype = Object.create(_0x3acdee && _0x3acdee.prototype, {
          'constructor': {
            'value': _0x23499f,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x3acdee && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x23499f, _0x3acdee) : _0x23499f.__proto__ = _0x3acdee);
      }
      _0x289001.__esModule = !0x0;
      var _0x3ba2a3 = _0x4167e0("../component"),
        _0x290295 = _0x2febac(_0x3ba2a3),
        _0x391249 = _0x4167e0("../utils/dom.js"),
        _0x50a230 = _0x5c1571(_0x391249),
        _0x31e56a = function (_0x5d0bfa) {
          function _0x1b1253(_0x427951, _0x29cffe) {
            _0x2a376f(this, _0x1b1253), _0x5d0bfa.call(this, _0x427951, _0x29cffe), this.updateShowing(), this.on(this.player(), "durationchange", this.updateShowing);
          }
          return _0x4a6912(_0x1b1253, _0x5d0bfa), _0x1b1253.prototype.createEl = function () {
            var _0x17a286 = _0x5d0bfa.prototype.createEl.call(this, 'div', {
              'className': 'vjs-live-control\x20vjs-control'
            });
            return this.contentEl_ = _0x50a230.createEl('div', {
              'className': "vjs-live-display",
              'innerHTML': "<span class=\"vjs-control-text\">" + this.localize("Stream Type") + "</span>" + this.localize("LIVE")
            }, {
              'aria-live': "off"
            }), _0x17a286.appendChild(this.contentEl_), _0x17a286;
          }, _0x1b1253.prototype.updateShowing = function () {
            this.player().duration() === 0x1 / 0x0 ? this.show() : this.hide();
          }, _0x1b1253;
        }(_0x290295["default"]);
      _0x290295['default'].registerComponent('LiveDisplay', _0x31e56a), _0x289001["default"] = _0x31e56a, _0x85ffe0.exports = _0x289001["default"];
    }, {
      '../component': 0x43,
      '../utils/dom.js': 0x8f
    }],
    0x49: [function (_0x57cbaa, _0x118a32, _0x214841) {
      'use strict';

      function _0x2b4f13(_0x43382f) {
        if (_0x43382f && _0x43382f.__esModule) return _0x43382f;
        var _0x246cff = {};
        if (null != _0x43382f) {
          for (var _0x53b653 in _0x43382f) Object.prototype.hasOwnProperty.call(_0x43382f, _0x53b653) && (_0x246cff[_0x53b653] = _0x43382f[_0x53b653]);
        }
        return _0x246cff['default'] = _0x43382f, _0x246cff;
      }
      function _0x155b3e(_0x4a2e10) {
        return _0x4a2e10 && _0x4a2e10.__esModule ? _0x4a2e10 : {
          'default': _0x4a2e10
        };
      }
      function _0x5b2628(_0x45d07f, _0x8e48de) {
        if (!(_0x45d07f instanceof _0x8e48de)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x414002(_0xdb79e9, _0x563de4) {
        if ("function" != typeof _0x563de4 && null !== _0x563de4) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x563de4);
        _0xdb79e9.prototype = Object.create(_0x563de4 && _0x563de4.prototype, {
          'constructor': {
            'value': _0xdb79e9,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x563de4 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0xdb79e9, _0x563de4) : _0xdb79e9.__proto__ = _0x563de4);
      }
      _0x214841.__esModule = !0x0;
      var _0x171e6b = _0x57cbaa("../button"),
        _0x4ded71 = _0x155b3e(_0x171e6b),
        _0x2dba67 = _0x57cbaa("../component"),
        _0x22f861 = _0x155b3e(_0x2dba67),
        _0x3afaf8 = _0x57cbaa("../utils/dom.js"),
        _0x57b105 = _0x2b4f13(_0x3afaf8),
        _0x43404b = function (_0x5c6b4c) {
          function _0x45ef54(_0x262092, _0x1984b9) {
            _0x5b2628(this, _0x45ef54), _0x5c6b4c.call(this, _0x262092, _0x1984b9), this.on(_0x262092, "volumechange", this.update), _0x262092.tech_ && _0x262092.tech_.featuresVolumeControl === !0x1 && this.addClass("vjs-hidden"), this.on(_0x262092, "loadstart", function () {
              this.update(), _0x262092.tech_.featuresVolumeControl === !0x1 ? this.addClass('vjs-hidden') : this.removeClass("vjs-hidden");
            });
          }
          return _0x414002(_0x45ef54, _0x5c6b4c), _0x45ef54.prototype.buildCSSClass = function () {
            return "vjs-mute-control " + _0x5c6b4c.prototype.buildCSSClass.call(this);
          }, _0x45ef54.prototype.handleClick = function () {
            this.player_.muted(this.player_.muted() ? !0x1 : !0x0);
          }, _0x45ef54.prototype.update = function () {
            var _0x3b2476 = this.player_.volume(),
              _0x2a5766 = 0x3;
            0x0 === _0x3b2476 || this.player_.muted() ? _0x2a5766 = 0x0 : 0.33 > _0x3b2476 ? _0x2a5766 = 0x1 : 0.67 > _0x3b2476 && (_0x2a5766 = 0x2);
            var _0xf5b30c = this.player_.muted() ? "Unmute" : "Mute";
            this.controlText() !== _0xf5b30c && this.controlText(_0xf5b30c);
            for (var _0x1b4dfb = 0x0; 0x4 > 0x0; _0x1b4dfb++) _0x57b105.removeElClass(this.el_, "vjs-vol-" + _0x1b4dfb);
            _0x57b105.addElClass(this.el_, "vjs-vol-" + _0x2a5766);
          }, _0x45ef54;
        }(_0x4ded71["default"]);
      _0x43404b.prototype.controlText_ = "Mute", _0x22f861['default'].registerComponent('MuteToggle', _0x43404b), _0x214841["default"] = _0x43404b, _0x118a32.exports = _0x214841["default"];
    }, {
      '../button': 0x40,
      '../component': 0x43,
      '../utils/dom.js': 0x8f
    }],
    0x4a: [function (_0xa93be5, _0x3fe717, _0x21f726) {
      'use strict';

      function _0x2b1dfd(_0x526a2c) {
        return _0x526a2c && _0x526a2c.__esModule ? _0x526a2c : {
          'default': _0x526a2c
        };
      }
      function _0x3794d8(_0x345610, _0x90e872) {
        if (!(_0x345610 instanceof _0x90e872)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x5e2817(_0x5ddb0c, _0x71325e) {
        if ("function" != typeof _0x71325e && null !== _0x71325e) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x71325e);
        _0x5ddb0c.prototype = Object.create(_0x71325e && _0x71325e.prototype, {
          'constructor': {
            'value': _0x5ddb0c,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x71325e && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x5ddb0c, _0x71325e) : _0x5ddb0c.__proto__ = _0x71325e);
      }
      _0x21f726.__esModule = !0x0;
      var _0x28f8ae = _0xa93be5("../button.js"),
        _0x4361eb = _0x2b1dfd(_0x28f8ae),
        _0x44a4b5 = _0xa93be5("../component.js"),
        _0xf3d073 = _0x2b1dfd(_0x44a4b5),
        _0x3c1f5e = function (_0x514e6f) {
          function _0x19615c(_0x727fbf, _0x574219) {
            _0x3794d8(this, _0x19615c), _0x514e6f.call(this, _0x727fbf, _0x574219), this.on(_0x727fbf, 'play', this.handlePlay), this.on(_0x727fbf, 'pause', this.handlePause);
          }
          return _0x5e2817(_0x19615c, _0x514e6f), _0x19615c.prototype.buildCSSClass = function () {
            return 'vjs-play-control\x20' + _0x514e6f.prototype.buildCSSClass.call(this);
          }, _0x19615c.prototype.handleClick = function () {
            this.player_.paused() ? this.player_.play() : this.player_.pause();
          }, _0x19615c.prototype.handlePlay = function () {
            this.removeClass("vjs-paused"), this.addClass("vjs-playing"), this.controlText('Pause');
          }, _0x19615c.prototype.handlePause = function () {
            this.removeClass('vjs-playing'), this.addClass("vjs-paused"), this.controlText("Play");
          }, _0x19615c;
        }(_0x4361eb["default"]);
      _0x3c1f5e.prototype.controlText_ = "Play", _0xf3d073["default"].registerComponent("PlayToggle", _0x3c1f5e), _0x21f726["default"] = _0x3c1f5e, _0x3fe717.exports = _0x21f726['default'];
    }, {
      '../button.js': 0x40,
      '../component.js': 0x43
    }],
    0x4b: [function (_0x3a0838, _0x1deed3, _0x1957df) {
      'use strict';

      function _0x2764ef(_0x306e68) {
        if (_0x306e68 && _0x306e68.__esModule) return _0x306e68;
        var _0x5a45c8 = {};
        if (null != _0x306e68) {
          for (var _0x3e45dd in _0x306e68) Object.prototype.hasOwnProperty.call(_0x306e68, _0x3e45dd) && (_0x5a45c8[_0x3e45dd] = _0x306e68[_0x3e45dd]);
        }
        return _0x5a45c8["default"] = _0x306e68, _0x5a45c8;
      }
      function _0x16a748(_0x18ec78) {
        return _0x18ec78 && _0x18ec78.__esModule ? _0x18ec78 : {
          'default': _0x18ec78
        };
      }
      function _0x4fb100(_0x13202a, _0x38967d) {
        if (!(_0x13202a instanceof _0x38967d)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x1e21db(_0x51554a, _0x5dafca) {
        if ("function" != typeof _0x5dafca && null !== _0x5dafca) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x5dafca);
        _0x51554a.prototype = Object.create(_0x5dafca && _0x5dafca.prototype, {
          'constructor': {
            'value': _0x51554a,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x5dafca && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x51554a, _0x5dafca) : _0x51554a.__proto__ = _0x5dafca);
      }
      _0x1957df.__esModule = !0x0;
      var _0x5ea172 = _0x3a0838("../../menu/menu-button.js"),
        _0x16c309 = _0x16a748(_0x5ea172),
        _0x488fce = _0x3a0838("../../menu/menu.js"),
        _0x513cd5 = _0x16a748(_0x488fce),
        _0x24cac6 = _0x3a0838("./playback-rate-menu-item.js"),
        _0x377f48 = _0x16a748(_0x24cac6),
        _0x519165 = _0x3a0838('../../component.js'),
        _0x2093c2 = _0x16a748(_0x519165),
        _0x13c317 = _0x3a0838('../../utils/dom.js'),
        _0x32122d = _0x2764ef(_0x13c317),
        _0x22e273 = function (_0x51ca68) {
          function _0x3dc6c9(_0xac31e4, _0x1bc58a) {
            _0x4fb100(this, _0x3dc6c9), _0x51ca68.call(this, _0xac31e4, _0x1bc58a), this.updateVisibility(), this.updateLabel(), this.on(_0xac31e4, "loadstart", this.updateVisibility), this.on(_0xac31e4, "ratechange", this.updateLabel);
          }
          return _0x1e21db(_0x3dc6c9, _0x51ca68), _0x3dc6c9.prototype.createEl = function () {
            var _0x108da3 = _0x51ca68.prototype.createEl.call(this);
            return this.labelEl_ = _0x32122d.createEl("div", {
              'className': "vjs-playback-rate-value",
              'innerHTML': 0x1
            }), _0x108da3.appendChild(this.labelEl_), _0x108da3;
          }, _0x3dc6c9.prototype.buildCSSClass = function () {
            return "vjs-playback-rate " + _0x51ca68.prototype.buildCSSClass.call(this);
          }, _0x3dc6c9.prototype.createMenu = function () {
            var _0x4d4b28 = new _0x513cd5["default"](this.player()),
              _0x5935c8 = this.playbackRates();
            if (_0x5935c8) {
              for (var _0x37609e = _0x5935c8.length - 0x1; _0x37609e >= 0x0; _0x37609e--) _0x4d4b28.addChild(new _0x377f48['default'](this.player(), {
                'rate': _0x5935c8[_0x37609e] + 'x'
              }));
            }
            return _0x4d4b28;
          }, _0x3dc6c9.prototype.updateARIAAttributes = function () {
            this.el().setAttribute('aria-valuenow', this.player().playbackRate());
          }, _0x3dc6c9.prototype.handleClick = function () {
            for (var _0x167873 = this.player().playbackRate(), _0x8eef11 = this.playbackRates(), _0x5add8a = _0x8eef11[0x0], _0x38b643 = 0x0; 0x0 < _0x8eef11.length; _0x38b643++) if (_0x8eef11[_0x38b643] > _0x167873) {
              _0x5add8a = _0x8eef11[_0x38b643];
              break;
            }
            this.player().playbackRate(_0x5add8a);
          }, _0x3dc6c9.prototype.playbackRates = function () {
            return this.options_.playbackRates || this.options_.playerOptions && this.options_.playerOptions.playbackRates;
          }, _0x3dc6c9.prototype.playbackRateSupported = function () {
            return this.player().tech_ && this.player().tech_.featuresPlaybackRate && this.playbackRates() && this.playbackRates().length > 0x0;
          }, _0x3dc6c9.prototype.updateVisibility = function () {
            this.playbackRateSupported() ? this.removeClass("vjs-hidden") : this.addClass('vjs-hidden');
          }, _0x3dc6c9.prototype.updateLabel = function () {
            this.playbackRateSupported() && (this.labelEl_.innerHTML = this.player().playbackRate() + 'x');
          }, _0x3dc6c9;
        }(_0x16c309["default"]);
      _0x22e273.prototype.controlText_ = "Playback Rate", _0x2093c2["default"].registerComponent('PlaybackRateMenuButton', _0x22e273), _0x1957df["default"] = _0x22e273, _0x1deed3.exports = _0x1957df["default"];
    }, {
      '../../component.js': 0x43,
      '../../menu/menu-button.js': 0x6d,
      '../../menu/menu.js': 0x6f,
      '../../utils/dom.js': 0x8f,
      './playback-rate-menu-item.js': 0x4c
    }],
    0x4c: [function (_0x54cfa1, _0x3a66dd, _0x220797) {
      'use strict';

      function _0x166925(_0x565bd6) {
        return _0x565bd6 && _0x565bd6.__esModule ? _0x565bd6 : {
          'default': _0x565bd6
        };
      }
      function _0xad48c4(_0x43bdae, _0x50f376) {
        if (!(_0x43bdae instanceof _0x50f376)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x3a39d8(_0x10fb06, _0x217347) {
        if ('function' != typeof _0x217347 && null !== _0x217347) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x217347);
        _0x10fb06.prototype = Object.create(_0x217347 && _0x217347.prototype, {
          'constructor': {
            'value': _0x10fb06,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x217347 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x10fb06, _0x217347) : _0x10fb06.__proto__ = _0x217347);
      }
      _0x220797.__esModule = !0x0;
      var _0x48d9d0 = _0x54cfa1("../../menu/menu-item.js"),
        _0x43f581 = _0x166925(_0x48d9d0),
        _0x4fceb1 = _0x54cfa1("../../component.js"),
        _0x5689bb = _0x166925(_0x4fceb1),
        _0x20fba6 = function (_0x40c05f) {
          function _0x2f987d(_0x88fdef, _0x1139b5) {
            _0xad48c4(this, _0x2f987d);
            var _0x135735 = _0x1139b5.rate,
              _0x40c224 = parseFloat(_0x135735, 0xa);
            _0x1139b5.label = _0x135735, _0x1139b5.selected = 0x1 === _0x40c224, _0x40c05f.call(this, _0x88fdef, _0x1139b5), this.label = _0x135735, this.rate = _0x40c224, this.on(_0x88fdef, 'ratechange', this.update);
          }
          return _0x3a39d8(_0x2f987d, _0x40c05f), _0x2f987d.prototype.handleClick = function () {
            _0x40c05f.prototype.handleClick.call(this), this.player().playbackRate(this.rate);
          }, _0x2f987d.prototype.update = function () {
            this.selected(this.player().playbackRate() === this.rate);
          }, _0x2f987d;
        }(_0x43f581['default']);
      _0x20fba6.prototype.contentElType = "button", _0x5689bb['default'].registerComponent("PlaybackRateMenuItem", _0x20fba6), _0x220797["default"] = _0x20fba6, _0x3a66dd.exports = _0x220797['default'];
    }, {
      '../../component.js': 0x43,
      '../../menu/menu-item.js': 0x6e
    }],
    0x4d: [function (_0x28d912, _0x21bb53, _0x308328) {
      'use strict';

      function _0x3479fa(_0x36e29c) {
        if (_0x36e29c && _0x36e29c.__esModule) return _0x36e29c;
        var _0x6ba57a = {};
        if (null != _0x36e29c) {
          for (var _0x20585e in _0x36e29c) Object.prototype.hasOwnProperty.call(_0x36e29c, _0x20585e) && (_0x6ba57a[_0x20585e] = _0x36e29c[_0x20585e]);
        }
        return _0x6ba57a["default"] = _0x36e29c, _0x6ba57a;
      }
      function _0x2b7353(_0x541bcb) {
        return _0x541bcb && _0x541bcb.__esModule ? _0x541bcb : {
          'default': _0x541bcb
        };
      }
      function _0x22fb41(_0x5f1432, _0x182a14) {
        if (!(_0x5f1432 instanceof _0x182a14)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x581307(_0xd0cd68, _0x34c578) {
        if ("function" != typeof _0x34c578 && null !== _0x34c578) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x34c578);
        _0xd0cd68.prototype = Object.create(_0x34c578 && _0x34c578.prototype, {
          'constructor': {
            'value': _0xd0cd68,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x34c578 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0xd0cd68, _0x34c578) : _0xd0cd68.__proto__ = _0x34c578);
      }
      _0x308328.__esModule = !0x0;
      var _0x5812e2 = _0x28d912('../../component.js'),
        _0xdca22 = _0x2b7353(_0x5812e2),
        _0x54fdcc = _0x28d912('../../utils/dom.js'),
        _0x41477d = _0x3479fa(_0x54fdcc),
        _0x3a2786 = function (_0x22e6e6) {
          function _0x3005e2(_0x4ce2e4, _0x2b6baf) {
            _0x22fb41(this, _0x3005e2), _0x22e6e6.call(this, _0x4ce2e4, _0x2b6baf), this.on(_0x4ce2e4, "progress", this.update);
          }
          return _0x581307(_0x3005e2, _0x22e6e6), _0x3005e2.prototype.createEl = function () {
            return _0x22e6e6.prototype.createEl.call(this, "div", {
              'className': 'vjs-load-progress',
              'innerHTML': "<span class=\"vjs-control-text\"><span>" + this.localize("Loaded") + "</span>: 0%</span>"
            });
          }, _0x3005e2.prototype.update = function () {
            var _0x552e64 = this.player_.buffered(),
              _0x5211f7 = this.player_.duration(),
              _0x101d2b = this.player_.bufferedEnd(),
              _0x3f9ca6 = function (_0x4ae519, _0x584b28) {
                var _0x32761e = _0x4ae519 / _0x584b28 || 0x0;
                return 0x64 * (_0x32761e >= 0x1 ? 0x1 : _0x32761e) + '%';
              };
            this.el_.style.width = _0x3f9ca6(_0x101d2b, _0x5211f7);
            for (var _0x2b01f9 = 0x0; 0x0 < _0x552e64.length; _0x2b01f9++) {
              var _0x528e6b = _0x552e64.start(_0x2b01f9),
                _0x103bc9 = _0x552e64.end(_0x2b01f9),
                _0x507a6b = this.el_.children[_0x2b01f9];
              _0x507a6b || (_0x507a6b = this.el_.appendChild(_0x41477d.createEl())), _0x507a6b.style.left = _0x3f9ca6(_0x528e6b, _0x101d2b), _0x507a6b.style.width = _0x3f9ca6(_0x103bc9 - _0x528e6b, _0x101d2b);
            }
            for (var _0x2b01f9 = this.el_.children.length; this.el_.children.length > _0x552e64.length; _0x2b01f9--) this.el_.removeChild(this.el_.children[_0x2b01f9 - 0x1]);
          }, _0x3005e2;
        }(_0xdca22["default"]);
      _0xdca22["default"].registerComponent('LoadProgressBar', _0x3a2786), _0x308328["default"] = _0x3a2786, _0x21bb53.exports = _0x308328["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f
    }],
    0x4e: [function (_0x2cfcad, _0x4fdf31, _0x5cf7a5) {
      'use strict';

      function _0x1b54bc(_0x1f6a58) {
        if (_0x1f6a58 && _0x1f6a58.__esModule) return _0x1f6a58;
        var _0x555d2a = {};
        if (null != _0x1f6a58) {
          for (var _0x2d5887 in _0x1f6a58) Object.prototype.hasOwnProperty.call(_0x1f6a58, _0x2d5887) && (_0x555d2a[_0x2d5887] = _0x1f6a58[_0x2d5887]);
        }
        return _0x555d2a["default"] = _0x1f6a58, _0x555d2a;
      }
      function _0x3b7e12(_0x515d85) {
        return _0x515d85 && _0x515d85.__esModule ? _0x515d85 : {
          'default': _0x515d85
        };
      }
      function _0xb320ff(_0x4f31e3, _0x2f5c00) {
        if (!(_0x4f31e3 instanceof _0x2f5c00)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x532041(_0x3c1631, _0x2e4abe) {
        if ('function' != typeof _0x2e4abe && null !== _0x2e4abe) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x2e4abe);
        _0x3c1631.prototype = Object.create(_0x2e4abe && _0x2e4abe.prototype, {
          'constructor': {
            'value': _0x3c1631,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x2e4abe && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3c1631, _0x2e4abe) : _0x3c1631.__proto__ = _0x2e4abe);
      }
      _0x5cf7a5.__esModule = !0x0;
      var _0x47470a = _0x2cfcad("global/window"),
        _0x3bbd74 = _0x3b7e12(_0x47470a),
        _0x21e154 = _0x2cfcad("../../component.js"),
        _0x4b7ca1 = _0x3b7e12(_0x21e154),
        _0x5af245 = _0x2cfcad("../../utils/dom.js"),
        _0x641e7e = _0x1b54bc(_0x5af245),
        _0x21dec6 = _0x2cfcad("../../utils/fn.js"),
        _0x51b6e2 = _0x1b54bc(_0x21dec6),
        _0x4f0eba = _0x2cfcad("../../utils/format-time.js"),
        _0x3d430a = _0x3b7e12(_0x4f0eba),
        _0x35d112 = _0x2cfcad("lodash-compat/function/throttle"),
        _0x35d910 = _0x3b7e12(_0x35d112),
        _0x279cc5 = function (_0x62e9fd) {
          function _0x567889(_0x4f4c95, _0x3d4241) {
            _0xb320ff(this, _0x567889), _0x62e9fd.call(this, _0x4f4c95, _0x3d4241), _0x3d4241.playerOptions && _0x3d4241.playerOptions.controlBar && _0x3d4241.playerOptions.controlBar.progressControl && _0x3d4241.playerOptions.controlBar.progressControl.keepTooltipsInside && (this.keepTooltipsInside = _0x3d4241.playerOptions.controlBar.progressControl.keepTooltipsInside), this.keepTooltipsInside && (this.tooltip = _0x641e7e.createEl("div", {
              'className': "vjs-time-tooltip"
            }), this.el().appendChild(this.tooltip), this.addClass('vjs-keep-tooltips-inside')), this.update(0x0, 0x0), _0x4f4c95.on("ready", function () {
              this.on(_0x4f4c95.controlBar.progressControl.el(), "mousemove", _0x35d910['default'](_0x51b6e2.bind(this, this.handleMouseMove), 0x19));
            });
          }
          return _0x532041(_0x567889, _0x62e9fd), _0x567889.prototype.createEl = function () {
            return _0x62e9fd.prototype.createEl.call(this, "div", {
              'className': "vjs-mouse-display"
            });
          }, _0x567889.prototype.handleMouseMove = function (_0x2b9c95) {
            var _0x25be63 = this.player_.duration(),
              _0xa0367 = this.calculateDistance(_0x2b9c95) * _0x25be63,
              _0x2472ad = _0x2b9c95.pageX - _0x641e7e.findElPosition(this.el().parentNode).left;
            this.update(_0xa0367, _0x2472ad);
          }, _0x567889.prototype.update = function (_0x5de3be, _0x1babe5) {
            var _0x1a4364 = _0x3d430a["default"](_0x5de3be, this.player_.duration());
            if (this.el().style.left = _0x1babe5 + 'px', this.el().setAttribute('data-current-time', _0x1a4364), this.keepTooltipsInside) {
              var _0xcd7d = this.clampPosition_(_0x1babe5),
                _0x2ccee1 = _0x1babe5 - _0xcd7d + 0x1,
                _0x5df350 = parseFloat(_0x3bbd74['default'].getComputedStyle(this.tooltip).width),
                _0x5bc040 = _0x5df350 / 0x2;
              this.tooltip.innerHTML = _0x1a4364, this.tooltip.style.right = '-' + (_0x5bc040 - _0x2ccee1) + 'px';
            }
          }, _0x567889.prototype.calculateDistance = function (_0x4a5bb8) {
            return _0x641e7e.getPointerPosition(this.el().parentNode, _0x4a5bb8).x;
          }, _0x567889.prototype.clampPosition_ = function (_0xdf4d3) {
            if (!this.keepTooltipsInside) return _0xdf4d3;
            var _0x51ef7d = parseFloat(_0x3bbd74["default"].getComputedStyle(this.player().el()).width),
              _0x42e07d = parseFloat(_0x3bbd74["default"].getComputedStyle(this.tooltip).width),
              _0x48bf3c = _0x42e07d / 0x2,
              _0x307818 = _0xdf4d3;
            return _0x48bf3c > _0xdf4d3 ? _0x307818 = Math.ceil(_0x48bf3c) : _0xdf4d3 > _0x51ef7d - _0x48bf3c && (_0x307818 = Math.floor(_0x51ef7d - _0x48bf3c)), _0x307818;
          }, _0x567889;
        }(_0x4b7ca1["default"]);
      _0x4b7ca1["default"].registerComponent("MouseTimeDisplay", _0x279cc5), _0x5cf7a5["default"] = _0x279cc5, _0x4fdf31.exports = _0x5cf7a5["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f,
      '../../utils/fn.js': 0x91,
      '../../utils/format-time.js': 0x92,
      'global/window': 0x2,
      'lodash-compat/function/throttle': 0x7
    }],
    0x4f: [function (_0x9fca7a, _0x87ea72, _0x142313) {
      'use strict';

      function _0x4cfbbc(_0x40072d) {
        if (_0x40072d && _0x40072d.__esModule) return _0x40072d;
        var _0x4ede17 = {};
        if (null != _0x40072d) {
          for (var _0x27d87e in _0x40072d) Object.prototype.hasOwnProperty.call(_0x40072d, _0x27d87e) && (_0x4ede17[_0x27d87e] = _0x40072d[_0x27d87e]);
        }
        return _0x4ede17["default"] = _0x40072d, _0x4ede17;
      }
      function _0x39bec5(_0x3245da) {
        return _0x3245da && _0x3245da.__esModule ? _0x3245da : {
          'default': _0x3245da
        };
      }
      function _0x2ce083(_0x2bf312, _0x5e8d7e) {
        if (!(_0x2bf312 instanceof _0x5e8d7e)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x112a3c(_0x853b32, _0x4d528c) {
        if ("function" != typeof _0x4d528c && null !== _0x4d528c) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x4d528c);
        _0x853b32.prototype = Object.create(_0x4d528c && _0x4d528c.prototype, {
          'constructor': {
            'value': _0x853b32,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x4d528c && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x853b32, _0x4d528c) : _0x853b32.__proto__ = _0x4d528c);
      }
      _0x142313.__esModule = !0x0;
      var _0x233172 = _0x9fca7a('../../component.js'),
        _0x3aa609 = _0x39bec5(_0x233172),
        _0x164eed = _0x9fca7a("../../utils/fn.js"),
        _0x520965 = _0x4cfbbc(_0x164eed),
        _0x13094e = _0x9fca7a("../../utils/dom.js"),
        _0x40d2c7 = (_0x4cfbbc(_0x13094e), _0x9fca7a("../../utils/format-time.js")),
        _0x35f092 = _0x39bec5(_0x40d2c7),
        _0x406fc7 = function (_0x55db3e) {
          function _0x56eaa2(_0x2de355, _0x577b7c) {
            _0x2ce083(this, _0x56eaa2), _0x55db3e.call(this, _0x2de355, _0x577b7c), this.updateDataAttr(), this.on(_0x2de355, "timeupdate", this.updateDataAttr), _0x2de355.ready(_0x520965.bind(this, this.updateDataAttr)), _0x577b7c.playerOptions && _0x577b7c.playerOptions.controlBar && _0x577b7c.playerOptions.controlBar.progressControl && _0x577b7c.playerOptions.controlBar.progressControl.keepTooltipsInside && (this.keepTooltipsInside = _0x577b7c.playerOptions.controlBar.progressControl.keepTooltipsInside), this.keepTooltipsInside && this.addClass("vjs-keep-tooltips-inside");
          }
          return _0x112a3c(_0x56eaa2, _0x55db3e), _0x56eaa2.prototype.createEl = function () {
            return _0x55db3e.prototype.createEl.call(this, 'div', {
              'className': "vjs-play-progress vjs-slider-bar",
              'innerHTML': "<span class=\"vjs-control-text\"><span>" + this.localize("Progress") + "</span>: 0%</span>"
            });
          }, _0x56eaa2.prototype.updateDataAttr = function () {
            var _0x1ab467 = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();
            this.el_.setAttribute('data-current-time', _0x35f092["default"](_0x1ab467, this.player_.duration()));
          }, _0x56eaa2;
        }(_0x3aa609["default"]);
      _0x3aa609["default"].registerComponent('PlayProgressBar', _0x406fc7), _0x142313["default"] = _0x406fc7, _0x87ea72.exports = _0x142313["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f,
      '../../utils/fn.js': 0x91,
      '../../utils/format-time.js': 0x92
    }],
    0x50: [function (_0x86d02d, _0x1ad7b2, _0x3705de) {
      'use strict';

      function _0x4de52b(_0x38f425) {
        return _0x38f425 && _0x38f425.__esModule ? _0x38f425 : {
          'default': _0x38f425
        };
      }
      function _0x1c9276(_0x321a53, _0x352cfc) {
        if (!(_0x321a53 instanceof _0x352cfc)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x5bf66f(_0xc92e17, _0x55d648) {
        if ("function" != typeof _0x55d648 && null !== _0x55d648) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x55d648);
        _0xc92e17.prototype = Object.create(_0x55d648 && _0x55d648.prototype, {
          'constructor': {
            'value': _0xc92e17,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x55d648 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0xc92e17, _0x55d648) : _0xc92e17.__proto__ = _0x55d648);
      }
      _0x3705de.__esModule = !0x0;
      var _0x40d16b = _0x86d02d("../../component.js"),
        _0xb06327 = _0x4de52b(_0x40d16b),
        _0x6f064b = _0x86d02d("./seek-bar.js"),
        _0x255be1 = (_0x4de52b(_0x6f064b), _0x86d02d("./mouse-time-display.js")),
        _0x4be3bb = (_0x4de52b(_0x255be1), function (_0x1f0706) {
          function _0x53dcad() {
            _0x1c9276(this, _0x53dcad), _0x1f0706.apply(this, arguments);
          }
          return _0x5bf66f(_0x53dcad, _0x1f0706), _0x53dcad.prototype.createEl = function () {
            return _0x1f0706.prototype.createEl.call(this, "div", {
              'className': "vjs-progress-control vjs-control"
            });
          }, _0x53dcad;
        }(_0xb06327['default']));
      _0x4be3bb.prototype.options_ = {
        'children': ["seekBar"]
      }, _0xb06327["default"].registerComponent("ProgressControl", _0x4be3bb), _0x3705de["default"] = _0x4be3bb, _0x1ad7b2.exports = _0x3705de["default"];
    }, {
      '../../component.js': 0x43,
      './mouse-time-display.js': 0x4e,
      './seek-bar.js': 0x51
    }],
    0x51: [function (_0x518a44, _0x503397, _0x4abf6e) {
      'use strict';

      function _0x26c0ab(_0x3ca902) {
        if (_0x3ca902 && _0x3ca902.__esModule) return _0x3ca902;
        var _0x3f64e2 = {};
        if (null != _0x3ca902) {
          for (var _0x463174 in _0x3ca902) Object.prototype.hasOwnProperty.call(_0x3ca902, _0x463174) && (_0x3f64e2[_0x463174] = _0x3ca902[_0x463174]);
        }
        return _0x3f64e2["default"] = _0x3ca902, _0x3f64e2;
      }
      function _0x414af1(_0x737d45) {
        return _0x737d45 && _0x737d45.__esModule ? _0x737d45 : {
          'default': _0x737d45
        };
      }
      function _0x439324(_0x33dca0, _0x2165fd) {
        if (!(_0x33dca0 instanceof _0x2165fd)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x237abb(_0x8842d0, _0x457dca) {
        if ("function" != typeof _0x457dca && null !== _0x457dca) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x457dca);
        _0x8842d0.prototype = Object.create(_0x457dca && _0x457dca.prototype, {
          'constructor': {
            'value': _0x8842d0,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x457dca && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x8842d0, _0x457dca) : _0x8842d0.__proto__ = _0x457dca);
      }
      _0x4abf6e.__esModule = !0x0;
      var _0x137135 = _0x518a44("global/window"),
        _0x3898d1 = _0x414af1(_0x137135),
        _0x36fa42 = _0x518a44("../../slider/slider.js"),
        _0x59a161 = _0x414af1(_0x36fa42),
        _0xecb0c = _0x518a44('../../component.js'),
        _0x168625 = _0x414af1(_0xecb0c),
        _0x262cd5 = _0x518a44("./load-progress-bar.js"),
        _0x35cd3c = (_0x414af1(_0x262cd5), _0x518a44("./play-progress-bar.js")),
        _0xf29819 = (_0x414af1(_0x35cd3c), _0x518a44("./tooltip-progress-bar.js")),
        _0x2aa17e = (_0x414af1(_0xf29819), _0x518a44("../../utils/fn.js")),
        _0x2e8303 = _0x26c0ab(_0x2aa17e),
        _0x1555c1 = _0x518a44("../../utils/format-time.js"),
        _0x74c780 = _0x414af1(_0x1555c1),
        _0x31868a = _0x518a44("object.assign"),
        _0x27d930 = (_0x414af1(_0x31868a), function (_0x58e543) {
          function _0xfbc0ad(_0x51d53a, _0x51867d) {
            _0x439324(this, _0xfbc0ad), _0x58e543.call(this, _0x51d53a, _0x51867d), this.on(_0x51d53a, "timeupdate", this.updateProgress), this.on(_0x51d53a, "ended", this.updateProgress), _0x51d53a.ready(_0x2e8303.bind(this, this.updateProgress)), _0x51867d.playerOptions && _0x51867d.playerOptions.controlBar && _0x51867d.playerOptions.controlBar.progressControl && _0x51867d.playerOptions.controlBar.progressControl.keepTooltipsInside && (this.keepTooltipsInside = _0x51867d.playerOptions.controlBar.progressControl.keepTooltipsInside), this.keepTooltipsInside && (this.tooltipProgressBar = this.addChild("TooltipProgressBar"));
          }
          return _0x237abb(_0xfbc0ad, _0x58e543), _0xfbc0ad.prototype.createEl = function () {
            return _0x58e543.prototype.createEl.call(this, 'div', {
              'className': 'vjs-progress-holder'
            }, {
              'aria-label': 'progress\x20bar'
            });
          }, _0xfbc0ad.prototype.updateProgress = function () {
            if (this.updateAriaAttributes(this.el_), this.keepTooltipsInside) {
              this.updateAriaAttributes(this.tooltipProgressBar.el_), this.tooltipProgressBar.el_.style.width = this.bar.el_.style.width;
              var _0x42c477 = parseFloat(_0x3898d1["default"].getComputedStyle(this.player().el()).width),
                _0xb6c59f = parseFloat(_0x3898d1["default"].getComputedStyle(this.tooltipProgressBar.tooltip).width),
                _0xaef3f4 = this.tooltipProgressBar.el().style;
              _0xaef3f4.maxWidth = Math.floor(_0x42c477 - _0xb6c59f / 0x2) + 'px', _0xaef3f4.minWidth = Math.ceil(_0xb6c59f / 0x2) + 'px', _0xaef3f4.right = '-' + _0xb6c59f / 0x2 + 'px';
            }
          }, _0xfbc0ad.prototype.updateAriaAttributes = function (_0x29cbc5) {
            var _0x1f655b = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();
            _0x29cbc5.setAttribute("aria-valuenow", (0x64 * this.getPercent()).toFixed(0x2)), _0x29cbc5.setAttribute("aria-valuetext", _0x74c780["default"](_0x1f655b, this.player_.duration()));
          }, _0xfbc0ad.prototype.getPercent = function () {
            var _0xc3df7e = this.player_.currentTime() / this.player_.duration();
            return _0xc3df7e >= 0x1 ? 0x1 : _0xc3df7e;
          }, _0xfbc0ad.prototype.handleMouseDown = function (_0x166736) {
            _0x58e543.prototype.handleMouseDown.call(this, _0x166736), this.player_.scrubbing(!0x0), this.videoWasPlaying = !this.player_.paused(), this.player_.pause();
          }, _0xfbc0ad.prototype.handleMouseMove = function (_0x4f1c3f) {
            var _0x18a48f = this.calculateDistance(_0x4f1c3f) * this.player_.duration();
            _0x18a48f === this.player_.duration() && (_0x18a48f -= 0.1), this.player_.currentTime(_0x18a48f);
          }, _0xfbc0ad.prototype.handleMouseUp = function (_0x3aac41) {
            _0x58e543.prototype.handleMouseUp.call(this, _0x3aac41), this.player_.scrubbing(!0x1), this.videoWasPlaying && this.player_.play();
          }, _0xfbc0ad.prototype.stepForward = function () {
            this.player_.currentTime(this.player_.currentTime() + 0x5);
          }, _0xfbc0ad.prototype.stepBack = function () {
            this.player_.currentTime(this.player_.currentTime() - 0x5);
          }, _0xfbc0ad;
        }(_0x59a161["default"]));
      _0x27d930.prototype.options_ = {
        'children': ["loadProgressBar", "mouseTimeDisplay", 'playProgressBar'],
        'barName': "playProgressBar"
      }, _0x27d930.prototype.playerEvent = "timeupdate", _0x168625["default"].registerComponent("SeekBar", _0x27d930), _0x4abf6e["default"] = _0x27d930, _0x503397.exports = _0x4abf6e['default'];
    }, {
      '../../component.js': 0x43,
      '../../slider/slider.js': 0x77,
      '../../utils/fn.js': 0x91,
      '../../utils/format-time.js': 0x92,
      './load-progress-bar.js': 0x4d,
      './play-progress-bar.js': 0x4f,
      './tooltip-progress-bar.js': 0x52,
      'global/window': 0x2,
      'object.assign': 0x2d
    }],
    0x52: [function (_0x1ef0ed, _0x15597f, _0x218f20) {
      'use strict';

      function _0xa79237(_0x41728a) {
        if (_0x41728a && _0x41728a.__esModule) return _0x41728a;
        var _0x2f990c = {};
        if (null != _0x41728a) {
          for (var _0x21f649 in _0x41728a) Object.prototype.hasOwnProperty.call(_0x41728a, _0x21f649) && (_0x2f990c[_0x21f649] = _0x41728a[_0x21f649]);
        }
        return _0x2f990c["default"] = _0x41728a, _0x2f990c;
      }
      function _0x8fa74a(_0x18a094) {
        return _0x18a094 && _0x18a094.__esModule ? _0x18a094 : {
          'default': _0x18a094
        };
      }
      function _0x268f05(_0x41d0ba, _0x1cdba9) {
        if (!(_0x41d0ba instanceof _0x1cdba9)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x48a7d1(_0x3165dd, _0x7b76e4) {
        if ("function" != typeof _0x7b76e4 && null !== _0x7b76e4) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x7b76e4);
        _0x3165dd.prototype = Object.create(_0x7b76e4 && _0x7b76e4.prototype, {
          'constructor': {
            'value': _0x3165dd,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x7b76e4 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3165dd, _0x7b76e4) : _0x3165dd.__proto__ = _0x7b76e4);
      }
      _0x218f20.__esModule = !0x0;
      var _0x4e632a = _0x1ef0ed('../../component.js'),
        _0xe84077 = _0x8fa74a(_0x4e632a),
        _0x3b51ce = _0x1ef0ed("../../utils/fn.js"),
        _0x59a589 = _0xa79237(_0x3b51ce),
        _0x9538f8 = _0x1ef0ed("../../utils/dom.js"),
        _0x2f9c73 = (_0xa79237(_0x9538f8), _0x1ef0ed('../../utils/format-time.js')),
        _0x5326db = _0x8fa74a(_0x2f9c73),
        _0x11d72a = function (_0x10e5ff) {
          function _0x51e9e0(_0x5a561a, _0x18d482) {
            _0x268f05(this, _0x51e9e0), _0x10e5ff.call(this, _0x5a561a, _0x18d482), this.updateDataAttr(), this.on(_0x5a561a, "timeupdate", this.updateDataAttr), _0x5a561a.ready(_0x59a589.bind(this, this.updateDataAttr));
          }
          return _0x48a7d1(_0x51e9e0, _0x10e5ff), _0x51e9e0.prototype.createEl = function () {
            var _0x1c819a = _0x10e5ff.prototype.createEl.call(this, "div", {
              'className': 'vjs-tooltip-progress-bar\x20vjs-slider-bar',
              'innerHTML': "<div class=\"vjs-time-tooltip\"></div>\n        <span class=\"vjs-control-text\"><span>" + this.localize("Progress") + "</span>: 0%</span>"
            });
            return this.tooltip = _0x1c819a.querySelector('.vjs-time-tooltip'), _0x1c819a;
          }, _0x51e9e0.prototype.updateDataAttr = function () {
            var _0x2b76ac = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime(),
              _0x19c196 = _0x5326db["default"](_0x2b76ac, this.player_.duration());
            this.el_.setAttribute("data-current-time", _0x19c196), this.tooltip.innerHTML = _0x19c196;
          }, _0x51e9e0;
        }(_0xe84077['default']);
      _0xe84077["default"].registerComponent("TooltipProgressBar", _0x11d72a), _0x218f20["default"] = _0x11d72a, _0x15597f.exports = _0x218f20["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f,
      '../../utils/fn.js': 0x91,
      '../../utils/format-time.js': 0x92
    }],
    0x53: [function (_0x4593f6, _0x58fa1b, _0x7ea48a) {
      'use strict';

      function _0x856c80(_0x888bf7) {
        return _0x888bf7 && _0x888bf7.__esModule ? _0x888bf7 : {
          'default': _0x888bf7
        };
      }
      function _0x2de79c(_0x35634a, _0x42041b) {
        if (!(_0x35634a instanceof _0x42041b)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x1988f7(_0x1ba6b7, _0x4a9286) {
        if ("function" != typeof _0x4a9286 && null !== _0x4a9286) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x4a9286);
        _0x1ba6b7.prototype = Object.create(_0x4a9286 && _0x4a9286.prototype, {
          'constructor': {
            'value': _0x1ba6b7,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x4a9286 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x1ba6b7, _0x4a9286) : _0x1ba6b7.__proto__ = _0x4a9286);
      }
      _0x7ea48a.__esModule = !0x0;
      var _0x2fda7a = _0x4593f6("./spacer.js"),
        _0x58015e = _0x856c80(_0x2fda7a),
        _0x102e48 = _0x4593f6('../../component.js'),
        _0x41136a = _0x856c80(_0x102e48),
        _0x2380e7 = function (_0x16ec14) {
          function _0x30ee99() {
            _0x2de79c(this, _0x30ee99), _0x16ec14.apply(this, arguments);
          }
          return _0x1988f7(_0x30ee99, _0x16ec14), _0x30ee99.prototype.buildCSSClass = function () {
            return 'vjs-custom-control-spacer\x20' + _0x16ec14.prototype.buildCSSClass.call(this);
          }, _0x30ee99.prototype.createEl = function () {
            var _0x30425c = _0x16ec14.prototype.createEl.call(this, {
              'className': this.buildCSSClass()
            });
            return _0x30425c.innerHTML = "&nbsp;", _0x30425c;
          }, _0x30ee99;
        }(_0x58015e["default"]);
      _0x41136a['default'].registerComponent("CustomControlSpacer", _0x2380e7), _0x7ea48a['default'] = _0x2380e7, _0x58fa1b.exports = _0x7ea48a["default"];
    }, {
      '../../component.js': 0x43,
      './spacer.js': 0x54
    }],
    0x54: [function (_0x2ba462, _0x3dc58f, _0xc35ed6) {
      'use strict';

      function _0x42a054(_0x2a2d79) {
        return _0x2a2d79 && _0x2a2d79.__esModule ? _0x2a2d79 : {
          'default': _0x2a2d79
        };
      }
      function _0x533488(_0x55b182, _0x180547) {
        if (!(_0x55b182 instanceof _0x180547)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x9c728(_0x173acf, _0x18e3fa) {
        if ('function' != typeof _0x18e3fa && null !== _0x18e3fa) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x18e3fa);
        _0x173acf.prototype = Object.create(_0x18e3fa && _0x18e3fa.prototype, {
          'constructor': {
            'value': _0x173acf,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x18e3fa && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x173acf, _0x18e3fa) : _0x173acf.__proto__ = _0x18e3fa);
      }
      _0xc35ed6.__esModule = !0x0;
      var _0xd86755 = _0x2ba462("../../component.js"),
        _0x3e1e33 = _0x42a054(_0xd86755),
        _0x32080a = function (_0x33d5be) {
          function _0x1498f3() {
            _0x533488(this, _0x1498f3), _0x33d5be.apply(this, arguments);
          }
          return _0x9c728(_0x1498f3, _0x33d5be), _0x1498f3.prototype.buildCSSClass = function () {
            return 'vjs-spacer\x20' + _0x33d5be.prototype.buildCSSClass.call(this);
          }, _0x1498f3.prototype.createEl = function () {
            return _0x33d5be.prototype.createEl.call(this, "div", {
              'className': this.buildCSSClass()
            });
          }, _0x1498f3;
        }(_0x3e1e33["default"]);
      _0x3e1e33["default"].registerComponent("Spacer", _0x32080a), _0xc35ed6["default"] = _0x32080a, _0x3dc58f.exports = _0xc35ed6["default"];
    }, {
      '../../component.js': 0x43
    }],
    0x55: [function (_0x26c781, _0x41415e, _0x5c1ec9) {
      'use strict';

      function _0x1ce8dd(_0x115f5a) {
        return _0x115f5a && _0x115f5a.__esModule ? _0x115f5a : {
          'default': _0x115f5a
        };
      }
      function _0x4aac05(_0x378ba1, _0x12c617) {
        if (!(_0x378ba1 instanceof _0x12c617)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x35b7da(_0x231077, _0x5eb7ef) {
        if ("function" != typeof _0x5eb7ef && null !== _0x5eb7ef) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x5eb7ef);
        _0x231077.prototype = Object.create(_0x5eb7ef && _0x5eb7ef.prototype, {
          'constructor': {
            'value': _0x231077,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x5eb7ef && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x231077, _0x5eb7ef) : _0x231077.__proto__ = _0x5eb7ef);
      }
      _0x5c1ec9.__esModule = !0x0;
      var _0x2baac7 = _0x26c781("./text-track-menu-item.js"),
        _0x5be9ff = _0x1ce8dd(_0x2baac7),
        _0x368330 = _0x26c781("../../component.js"),
        _0x598862 = _0x1ce8dd(_0x368330),
        _0x1b612a = function (_0x2bce21) {
          function _0x2138c5(_0x7a76ad, _0x6a47f3) {
            _0x4aac05(this, _0x2138c5), _0x6a47f3.track = {
              'kind': _0x6a47f3.kind,
              'player': _0x7a76ad,
              'label': _0x6a47f3.kind + " settings",
              'selectable': !0x1,
              'default': !0x1,
              'mode': "disabled"
            }, _0x6a47f3.selectable = !0x1, _0x2bce21.call(this, _0x7a76ad, _0x6a47f3), this.addClass("vjs-texttrack-settings"), this.controlText(", opens " + _0x6a47f3.kind + " settings dialog");
          }
          return _0x35b7da(_0x2138c5, _0x2bce21), _0x2138c5.prototype.handleClick = function () {
            this.player().getChild("textTrackSettings").show(), this.player().getChild("textTrackSettings").el_.focus();
          }, _0x2138c5;
        }(_0x5be9ff["default"]);
      _0x598862['default'].registerComponent("CaptionSettingsMenuItem", _0x1b612a), _0x5c1ec9["default"] = _0x1b612a, _0x41415e.exports = _0x5c1ec9["default"];
    }, {
      '../../component.js': 0x43,
      './text-track-menu-item.js': 0x5d
    }],
    0x56: [function (_0x375564, _0x51d0d3, _0x1ba424) {
      'use strict';

      function _0x53576c(_0x4139c1) {
        return _0x4139c1 && _0x4139c1.__esModule ? _0x4139c1 : {
          'default': _0x4139c1
        };
      }
      function _0x58d9ec(_0x2d9ac6, _0x25b521) {
        if (!(_0x2d9ac6 instanceof _0x25b521)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x4f0d0d(_0x53e4b5, _0xe1e467) {
        if ("function" != typeof _0xe1e467 && null !== _0xe1e467) throw new TypeError("Super expression must either be null or a function, not " + typeof _0xe1e467);
        _0x53e4b5.prototype = Object.create(_0xe1e467 && _0xe1e467.prototype, {
          'constructor': {
            'value': _0x53e4b5,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0xe1e467 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x53e4b5, _0xe1e467) : _0x53e4b5.__proto__ = _0xe1e467);
      }
      _0x1ba424.__esModule = !0x0;
      var _0x264229 = _0x375564("./text-track-button.js"),
        _0x235b9d = _0x53576c(_0x264229),
        _0xb23550 = _0x375564('../../component.js'),
        _0x1ef6ff = _0x53576c(_0xb23550),
        _0x32aa1f = _0x375564("./caption-settings-menu-item.js"),
        _0x244184 = _0x53576c(_0x32aa1f),
        _0x5cf91c = function (_0x47cf4e) {
          function _0x369eed(_0x361d20, _0x148be9, _0x3e16f0) {
            _0x58d9ec(this, _0x369eed), _0x47cf4e.call(this, _0x361d20, _0x148be9, _0x3e16f0), this.el_.setAttribute("aria-label", 'Captions\x20Menu');
          }
          return _0x4f0d0d(_0x369eed, _0x47cf4e), _0x369eed.prototype.buildCSSClass = function () {
            return "vjs-captions-button " + _0x47cf4e.prototype.buildCSSClass.call(this);
          }, _0x369eed.prototype.update = function () {
            var _0x1a1f0f = 0x2;
            _0x47cf4e.prototype.update.call(this), this.player().tech_ && this.player().tech_.featuresNativeTextTracks && (_0x1a1f0f = 0x1), this.items && this.items.length > _0x1a1f0f ? this.show() : this.hide();
          }, _0x369eed.prototype.createItems = function () {
            var _0x17fffe = [];
            return this.player().tech_ && this.player().tech_.featuresNativeTextTracks || _0x17fffe.push(new _0x244184["default"](this.player_, {
              'kind': this.kind_
            })), _0x47cf4e.prototype.createItems.call(this, _0x17fffe);
          }, _0x369eed;
        }(_0x235b9d['default']);
      _0x5cf91c.prototype.kind_ = 'captions', _0x5cf91c.prototype.controlText_ = 'Captions', _0x1ef6ff['default'].registerComponent("CaptionsButton", _0x5cf91c), _0x1ba424["default"] = _0x5cf91c, _0x51d0d3.exports = _0x1ba424["default"];
    }, {
      '../../component.js': 0x43,
      './caption-settings-menu-item.js': 0x55,
      './text-track-button.js': 0x5c
    }],
    0x57: [function (_0x16402d, _0x36eeb8, _0x34260a) {
      'use strict';

      function _0x15272b(_0x4db160) {
        if (_0x4db160 && _0x4db160.__esModule) return _0x4db160;
        var _0x59f735 = {};
        if (null != _0x4db160) {
          for (var _0x32dcc5 in _0x4db160) Object.prototype.hasOwnProperty.call(_0x4db160, _0x32dcc5) && (_0x59f735[_0x32dcc5] = _0x4db160[_0x32dcc5]);
        }
        return _0x59f735["default"] = _0x4db160, _0x59f735;
      }
      function _0x357711(_0x1699b5) {
        return _0x1699b5 && _0x1699b5.__esModule ? _0x1699b5 : {
          'default': _0x1699b5
        };
      }
      function _0x53a4da(_0x596848, _0x170d55) {
        if (!(_0x596848 instanceof _0x170d55)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x1dd3d1(_0x2fe4cd, _0x1b2230) {
        if ("function" != typeof _0x1b2230 && null !== _0x1b2230) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x1b2230);
        _0x2fe4cd.prototype = Object.create(_0x1b2230 && _0x1b2230.prototype, {
          'constructor': {
            'value': _0x2fe4cd,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x1b2230 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2fe4cd, _0x1b2230) : _0x2fe4cd.__proto__ = _0x1b2230);
      }
      _0x34260a.__esModule = !0x0;
      var _0x4b5805 = _0x16402d("./text-track-button.js"),
        _0x441ec1 = _0x357711(_0x4b5805),
        _0x5427d4 = _0x16402d("../../component.js"),
        _0x2fbc99 = _0x357711(_0x5427d4),
        _0x5a6888 = _0x16402d("./text-track-menu-item.js"),
        _0x2ce2e8 = _0x357711(_0x5a6888),
        _0x27616e = _0x16402d("./chapters-track-menu-item.js"),
        _0x17694f = _0x357711(_0x27616e),
        _0x23896c = _0x16402d("../../menu/menu.js"),
        _0x2dffac = _0x357711(_0x23896c),
        _0x5d6881 = _0x16402d("../../utils/dom.js"),
        _0x4892a = _0x15272b(_0x5d6881),
        _0x3947ba = _0x16402d("../../utils/fn.js"),
        _0x42b576 = (_0x15272b(_0x3947ba), _0x16402d("../../utils/to-title-case.js")),
        _0x335aea = _0x357711(_0x42b576),
        _0x3d4641 = _0x16402d("global/window"),
        _0x1e7634 = (_0x357711(_0x3d4641), function (_0x22bb93) {
          function _0x232eb8(_0x216be5, _0x29e71a, _0x4a5072) {
            _0x53a4da(this, _0x232eb8), _0x22bb93.call(this, _0x216be5, _0x29e71a, _0x4a5072), this.el_.setAttribute("aria-label", "Chapters Menu");
          }
          return _0x1dd3d1(_0x232eb8, _0x22bb93), _0x232eb8.prototype.buildCSSClass = function () {
            return "vjs-chapters-button " + _0x22bb93.prototype.buildCSSClass.call(this);
          }, _0x232eb8.prototype.createItems = function () {
            var _0x2d453f = [],
              _0x46641d = this.player_.textTracks();
            if (!_0x46641d) return _0x2d453f;
            for (var _0x5d1cb6 = 0x0; 0x0 < _0x46641d.length; _0x5d1cb6++) {
              var _0x13793a = _0x46641d[_0x5d1cb6];
              _0x13793a.kind === this.kind_ && _0x2d453f.push(new _0x2ce2e8["default"](this.player_, {
                'track': _0x13793a
              }));
            }
            return _0x2d453f;
          }, _0x232eb8.prototype.createMenu = function () {
            for (var _0x3831a0 = this, _0xe75153 = this.player_.textTracks() || [], _0x1326cb = void 0x0, _0x4a739b = this.items || [], _0x1ac5e9 = _0xe75153.length - 0x1; _0x1ac5e9 >= 0x0; _0x1ac5e9--) {
              var _0x666555 = _0xe75153[_0x1ac5e9];
              if (_0x666555.kind === this.kind_) {
                _0x1326cb = _0x666555;
                break;
              }
            }
            if (void 0x0 === this.menu) {
              _0x1ee928 = new _0x2dffac["default"](this.player_);
              var _0x234666 = _0x4892a.createEl('li', {
                'className': 'vjs-menu-title',
                'innerHTML': _0x335aea["default"](this.kind_),
                'tabIndex': -0x1
              });
              this.menu.children_.unshift(_0x234666), _0x4892a.insertElFirst(_0x234666, this.menu.contentEl());
            } else _0x4a739b.forEach(function (_0x2e1ca3) {
              return this.menu.removeChild(_0x2e1ca3);
            }), _0x4a739b = [];
            if (_0x1326cb && null == _0x1326cb.cues) {
              _0x1326cb.mode = "hidden";
              var _0x395f31 = this.player_.remoteTextTrackEls().getTrackElementByTrack_(_0x1326cb);
              _0x395f31 && _0x395f31.addEventListener('load', function () {
                return this.update();
              });
            }
            if (_0x1326cb && _0x1326cb.cues && _0x1326cb.cues.length > 0x0) for (var _0xc5f7b7 = _0x1326cb.cues, _0x405ff8 = void 0x0, _0x1ac5e9 = 0x0, _0xd0f5be = _0xc5f7b7.length; _0xd0f5be > 0x0; _0x1ac5e9++) {
              _0x405ff8 = _0xc5f7b7[_0x1ac5e9];
              var _0x4658af = new _0x17694f["default"](this.player_, {
                'track': _0x1326cb,
                'cue': _0x405ff8
              });
              _0x4a739b.push(_0x4658af), this.menu.addChild(_0x4658af);
            }
            return _0x4a739b.length > 0x0 && this.show(), this.items = _0x4a739b, this.menu;
          }, _0x232eb8;
        }(_0x441ec1["default"]));
      _0x1e7634.prototype.kind_ = "chapters", _0x1e7634.prototype.controlText_ = "Chapters", _0x2fbc99["default"].registerComponent("ChaptersButton", _0x1e7634), _0x34260a["default"] = _0x1e7634, _0x36eeb8.exports = _0x34260a["default"];
    }, {
      '../../component.js': 0x43,
      '../../menu/menu.js': 0x6f,
      '../../utils/dom.js': 0x8f,
      '../../utils/fn.js': 0x91,
      '../../utils/to-title-case.js': 0x98,
      './chapters-track-menu-item.js': 0x58,
      './text-track-button.js': 0x5c,
      './text-track-menu-item.js': 0x5d,
      'global/window': 0x2
    }],
    0x58: [function (_0x3da4de, _0x2cd895, _0x1d79e6) {
      'use strict';

      function _0x50f08b(_0x512a01) {
        if (_0x512a01 && _0x512a01.__esModule) return _0x512a01;
        var _0x1541fd = {};
        if (null != _0x512a01) {
          for (var _0x1e4615 in _0x512a01) Object.prototype.hasOwnProperty.call(_0x512a01, _0x1e4615) && (_0x1541fd[_0x1e4615] = _0x512a01[_0x1e4615]);
        }
        return _0x1541fd["default"] = _0x512a01, _0x1541fd;
      }
      function _0xb1ffc6(_0x8e44af) {
        return _0x8e44af && _0x8e44af.__esModule ? _0x8e44af : {
          'default': _0x8e44af
        };
      }
      function _0x3d202c(_0x22cfc7, _0x5c7220) {
        if (!(_0x22cfc7 instanceof _0x5c7220)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x1e4a47(_0xf263e, _0x26e67b) {
        if ("function" != typeof _0x26e67b && null !== _0x26e67b) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x26e67b);
        _0xf263e.prototype = Object.create(_0x26e67b && _0x26e67b.prototype, {
          'constructor': {
            'value': _0xf263e,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x26e67b && (Object.setPrototypeOf ? Object.setPrototypeOf(_0xf263e, _0x26e67b) : _0xf263e.__proto__ = _0x26e67b);
      }
      _0x1d79e6.__esModule = !0x0;
      var _0x554004 = _0x3da4de('../../menu/menu-item.js'),
        _0x265c24 = _0xb1ffc6(_0x554004),
        _0x55698a = _0x3da4de("../../component.js"),
        _0x426876 = _0xb1ffc6(_0x55698a),
        _0x427bf0 = _0x3da4de("../../utils/fn.js"),
        _0xd62c69 = _0x50f08b(_0x427bf0),
        _0x5555d8 = function (_0x493b65) {
          function _0x575319(_0x48dbac, _0x3218cf) {
            _0x3d202c(this, _0x575319);
            var _0x5be3c2 = _0x3218cf.track,
              _0x4e2f1b = _0x3218cf.cue,
              _0x1c459c = _0x48dbac.currentTime();
            _0x3218cf.label = _0x4e2f1b.text, _0x3218cf.selected = _0x4e2f1b.startTime <= _0x1c459c && _0x1c459c < _0x4e2f1b.endTime, _0x493b65.call(this, _0x48dbac, _0x3218cf), this.track = _0x5be3c2, this.cue = _0x4e2f1b, _0x5be3c2.addEventListener("cuechange", _0xd62c69.bind(this, this.update));
          }
          return _0x1e4a47(_0x575319, _0x493b65), _0x575319.prototype.handleClick = function () {
            _0x493b65.prototype.handleClick.call(this), this.player_.currentTime(this.cue.startTime), this.update(this.cue.startTime);
          }, _0x575319.prototype.update = function () {
            var _0x2008d1 = this.player_.currentTime();
            this.selected(this.cue.startTime <= _0x2008d1 && _0x2008d1 < this.cue.endTime);
          }, _0x575319;
        }(_0x265c24["default"]);
      _0x426876["default"].registerComponent("ChaptersTrackMenuItem", _0x5555d8), _0x1d79e6["default"] = _0x5555d8, _0x2cd895.exports = _0x1d79e6["default"];
    }, {
      '../../component.js': 0x43,
      '../../menu/menu-item.js': 0x6e,
      '../../utils/fn.js': 0x91
    }],
    0x59: [function (_0x116db4, _0x58ff6f, _0x4d6efa) {
      'use strict';

      function _0x5ec414(_0x15e538) {
        if (_0x15e538 && _0x15e538.__esModule) return _0x15e538;
        var _0x5652e0 = {};
        if (null != _0x15e538) {
          for (var _0x1d75b8 in _0x15e538) Object.prototype.hasOwnProperty.call(_0x15e538, _0x1d75b8) && (_0x5652e0[_0x1d75b8] = _0x15e538[_0x1d75b8]);
        }
        return _0x5652e0["default"] = _0x15e538, _0x5652e0;
      }
      function _0x4f5345(_0x16af56) {
        return _0x16af56 && _0x16af56.__esModule ? _0x16af56 : {
          'default': _0x16af56
        };
      }
      function _0x21412d(_0x35241d, _0x2d43c7) {
        if (!(_0x35241d instanceof _0x2d43c7)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x18eea5(_0x27f3cb, _0x5ed22a) {
        if ("function" != typeof _0x5ed22a && null !== _0x5ed22a) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x5ed22a);
        _0x27f3cb.prototype = Object.create(_0x5ed22a && _0x5ed22a.prototype, {
          'constructor': {
            'value': _0x27f3cb,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x5ed22a && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x27f3cb, _0x5ed22a) : _0x27f3cb.__proto__ = _0x5ed22a);
      }
      _0x4d6efa.__esModule = !0x0;
      var _0xba507 = _0x116db4('./text-track-button.js'),
        _0x4bf59b = _0x4f5345(_0xba507),
        _0x5d89d3 = _0x116db4("../../component.js"),
        _0x19eb42 = _0x4f5345(_0x5d89d3),
        _0x4ee8cb = _0x116db4("../../utils/fn.js"),
        _0x38ff4e = _0x5ec414(_0x4ee8cb),
        _0x1a5b0e = function (_0x155464) {
          function _0x2a46ce(_0x2ee201, _0x188aec, _0x1ed979) {
            _0x21412d(this, _0x2a46ce), _0x155464.call(this, _0x2ee201, _0x188aec, _0x1ed979), this.el_.setAttribute("aria-label", "Descriptions Menu");
            var _0x5bb5c9 = _0x2ee201.textTracks();
            _0x5bb5c9 && !function () {
              var _0xefb71a = _0x38ff4e.bind(this, this.handleTracksChange);
              _0x5bb5c9.addEventListener("change", _0xefb71a), this.on("dispose", function () {
                _0x5bb5c9.removeEventListener("change", _0xefb71a);
              });
            }();
          }
          return _0x18eea5(_0x2a46ce, _0x155464), _0x2a46ce.prototype.handleTracksChange = function () {
            for (var _0x9eaf9a = this.player().textTracks(), _0x371a2d = !0x1, _0x177a85 = 0x0, _0x588213 = _0x9eaf9a.length; _0x588213 > 0x0; _0x177a85++) {
              var _0x371bd2 = _0x9eaf9a[_0x177a85];
              if (_0x371bd2.kind !== this.kind_ && "showing" === _0x371bd2.mode) {
                _0x371a2d = !0x0;
                break;
              }
            }
            _0x371a2d ? this.disable() : this.enable();
          }, _0x2a46ce.prototype.buildCSSClass = function () {
            return "vjs-descriptions-button " + _0x155464.prototype.buildCSSClass.call(this);
          }, _0x2a46ce;
        }(_0x4bf59b["default"]);
      _0x1a5b0e.prototype.kind_ = "descriptions", _0x1a5b0e.prototype.controlText_ = "Descriptions", _0x19eb42['default'].registerComponent("DescriptionsButton", _0x1a5b0e), _0x4d6efa["default"] = _0x1a5b0e, _0x58ff6f.exports = _0x4d6efa["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/fn.js': 0x91,
      './text-track-button.js': 0x5c
    }],
    0x5a: [function (_0x1b0d3e, _0x15c738, _0x33d64c) {
      'use strict';

      function _0x4f3e9f(_0x179f90) {
        return _0x179f90 && _0x179f90.__esModule ? _0x179f90 : {
          'default': _0x179f90
        };
      }
      function _0x13bdef(_0x54e5ec, _0xa5edb6) {
        if (!(_0x54e5ec instanceof _0xa5edb6)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x50cec9(_0x21d5e3, _0x48ee44) {
        if ("function" != typeof _0x48ee44 && null !== _0x48ee44) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x48ee44);
        _0x21d5e3.prototype = Object.create(_0x48ee44 && _0x48ee44.prototype, {
          'constructor': {
            'value': _0x21d5e3,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x48ee44 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x21d5e3, _0x48ee44) : _0x21d5e3.__proto__ = _0x48ee44);
      }
      _0x33d64c.__esModule = !0x0;
      var _0x23d956 = _0x1b0d3e("./text-track-menu-item.js"),
        _0x1aecf = _0x4f3e9f(_0x23d956),
        _0x28eed6 = _0x1b0d3e("../../component.js"),
        _0x17e454 = _0x4f3e9f(_0x28eed6),
        _0x31db36 = function (_0x38695c) {
          function _0x3cb7b9(_0x2c48dc, _0x455971) {
            _0x13bdef(this, _0x3cb7b9), _0x455971.track = {
              'kind': _0x455971.kind,
              'player': _0x2c48dc,
              'label': _0x455971.kind + " off",
              'default': !0x1,
              'mode': "disabled"
            }, _0x455971.selectable = !0x0, _0x38695c.call(this, _0x2c48dc, _0x455971), this.selected(!0x0);
          }
          return _0x50cec9(_0x3cb7b9, _0x38695c), _0x3cb7b9.prototype.handleTracksChange = function () {
            for (var _0x25e38d = this.player().textTracks(), _0x8928b3 = !0x0, _0x338be5 = 0x0, _0xc51c8f = _0x25e38d.length; _0xc51c8f > 0x0; _0x338be5++) {
              var _0x47e5e9 = _0x25e38d[_0x338be5];
              if (_0x47e5e9.kind === this.track.kind && "showing" === _0x47e5e9.mode) {
                _0x8928b3 = !0x1;
                break;
              }
            }
            this.selected(_0x8928b3);
          }, _0x3cb7b9;
        }(_0x1aecf["default"]);
      _0x17e454["default"].registerComponent('OffTextTrackMenuItem', _0x31db36), _0x33d64c["default"] = _0x31db36, _0x15c738.exports = _0x33d64c['default'];
    }, {
      '../../component.js': 0x43,
      './text-track-menu-item.js': 0x5d
    }],
    0x5b: [function (_0x1dd56b, _0x25de58, _0x211c91) {
      'use strict';

      function _0x383c92(_0x361794) {
        return _0x361794 && _0x361794.__esModule ? _0x361794 : {
          'default': _0x361794
        };
      }
      function _0x1438df(_0x32ec43, _0x6ac4f0) {
        if (!(_0x32ec43 instanceof _0x6ac4f0)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x2cda85(_0x3460ce, _0x3191fa) {
        if ("function" != typeof _0x3191fa && null !== _0x3191fa) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x3191fa);
        _0x3460ce.prototype = Object.create(_0x3191fa && _0x3191fa.prototype, {
          'constructor': {
            'value': _0x3460ce,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x3191fa && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3460ce, _0x3191fa) : _0x3460ce.__proto__ = _0x3191fa);
      }
      _0x211c91.__esModule = !0x0;
      var _0x16c585 = _0x1dd56b('./text-track-button.js'),
        _0x560aa6 = _0x383c92(_0x16c585),
        _0x16e4ee = _0x1dd56b('../../component.js'),
        _0x21dcf1 = _0x383c92(_0x16e4ee),
        _0x27fb58 = function (_0x103b1a) {
          function _0x18828d(_0x4ec301, _0x2fdcf2, _0x209810) {
            _0x1438df(this, _0x18828d), _0x103b1a.call(this, _0x4ec301, _0x2fdcf2, _0x209810), this.el_.setAttribute("aria-label", "Subtitles Menu");
          }
          return _0x2cda85(_0x18828d, _0x103b1a), _0x18828d.prototype.buildCSSClass = function () {
            return "vjs-subtitles-button " + _0x103b1a.prototype.buildCSSClass.call(this);
          }, _0x18828d;
        }(_0x560aa6["default"]);
      _0x27fb58.prototype.kind_ = 'subtitles', _0x27fb58.prototype.controlText_ = 'Subtitles', _0x21dcf1["default"].registerComponent('SubtitlesButton', _0x27fb58), _0x211c91["default"] = _0x27fb58, _0x25de58.exports = _0x211c91["default"];
    }, {
      '../../component.js': 0x43,
      './text-track-button.js': 0x5c
    }],
    0x5c: [function (_0x38ddae, _0x242691, _0xccb3c3) {
      'use strict';

      function _0x238eb2(_0x2642c3) {
        if (_0x2642c3 && _0x2642c3.__esModule) return _0x2642c3;
        var _0x29eec7 = {};
        if (null != _0x2642c3) {
          for (var _0x1610e4 in _0x2642c3) Object.prototype.hasOwnProperty.call(_0x2642c3, _0x1610e4) && (_0x29eec7[_0x1610e4] = _0x2642c3[_0x1610e4]);
        }
        return _0x29eec7["default"] = _0x2642c3, _0x29eec7;
      }
      function _0x3133fd(_0x1c49fa) {
        return _0x1c49fa && _0x1c49fa.__esModule ? _0x1c49fa : {
          'default': _0x1c49fa
        };
      }
      function _0x4ca457(_0x348af7, _0x40a11b) {
        if (!(_0x348af7 instanceof _0x40a11b)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x41db19(_0x12960e, _0x598404) {
        if ('function' != typeof _0x598404 && null !== _0x598404) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x598404);
        _0x12960e.prototype = Object.create(_0x598404 && _0x598404.prototype, {
          'constructor': {
            'value': _0x12960e,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x598404 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x12960e, _0x598404) : _0x12960e.__proto__ = _0x598404);
      }
      _0xccb3c3.__esModule = !0x0;
      var _0x1fa51f = _0x38ddae('../track-button.js'),
        _0x2403cc = _0x3133fd(_0x1fa51f),
        _0x355911 = _0x38ddae('../../component.js'),
        _0x1f32d1 = _0x3133fd(_0x355911),
        _0x136c94 = _0x38ddae("../../utils/fn.js"),
        _0x41edbf = (_0x238eb2(_0x136c94), _0x38ddae('./text-track-menu-item.js')),
        _0x2c33ba = _0x3133fd(_0x41edbf),
        _0x2bf06b = _0x38ddae('./off-text-track-menu-item.js'),
        _0x4b6612 = _0x3133fd(_0x2bf06b),
        _0x2f38e4 = function (_0x24ffab) {
          function _0x26a20e(_0x3248cd) {
            var _0x56f6aa = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            _0x4ca457(this, _0x26a20e), _0x56f6aa.tracks = _0x3248cd.textTracks(), _0x24ffab.call(this, _0x3248cd, _0x56f6aa);
          }
          return _0x41db19(_0x26a20e, _0x24ffab), _0x26a20e.prototype.createItems = function () {
            var _0x5ed46f = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0];
            _0x5ed46f.push(new _0x4b6612["default"](this.player_, {
              'kind': this.kind_
            }));
            var _0x3858d1 = this.player_.textTracks();
            if (!_0x3858d1) return _0x5ed46f;
            for (var _0x357b71 = 0x0; 0x0 < _0x3858d1.length; _0x357b71++) {
              var _0x12307d = _0x3858d1[_0x357b71];
              _0x12307d.kind === this.kind_ && _0x5ed46f.push(new _0x2c33ba["default"](this.player_, {
                'selectable': !0x0,
                'track': _0x12307d
              }));
            }
            return _0x5ed46f;
          }, _0x26a20e;
        }(_0x2403cc["default"]);
      _0x1f32d1["default"].registerComponent("TextTrackButton", _0x2f38e4), _0xccb3c3["default"] = _0x2f38e4, _0x242691.exports = _0xccb3c3["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/fn.js': 0x91,
      '../track-button.js': 0x62,
      './off-text-track-menu-item.js': 0x5a,
      './text-track-menu-item.js': 0x5d
    }],
    0x5d: [function (_0x426f83, _0x4db57d, _0x18c8bf) {
      'use strict';

      function _0x51e9a1(_0x530251) {
        if (_0x530251 && _0x530251.__esModule) return _0x530251;
        var _0x37603f = {};
        if (null != _0x530251) {
          for (var _0x156644 in _0x530251) Object.prototype.hasOwnProperty.call(_0x530251, _0x156644) && (_0x37603f[_0x156644] = _0x530251[_0x156644]);
        }
        return _0x37603f["default"] = _0x530251, _0x37603f;
      }
      function _0x1efe1c(_0x4764e0) {
        return _0x4764e0 && _0x4764e0.__esModule ? _0x4764e0 : {
          'default': _0x4764e0
        };
      }
      function _0x2ff935(_0x5720cc, _0x8def9a) {
        if (!(_0x5720cc instanceof _0x8def9a)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x42efda(_0x5290cf, _0x2daa12) {
        if ("function" != typeof _0x2daa12 && null !== _0x2daa12) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x2daa12);
        _0x5290cf.prototype = Object.create(_0x2daa12 && _0x2daa12.prototype, {
          'constructor': {
            'value': _0x5290cf,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x2daa12 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x5290cf, _0x2daa12) : _0x5290cf.__proto__ = _0x2daa12);
      }
      _0x18c8bf.__esModule = !0x0;
      var _0x59d1de = _0x426f83('../../menu/menu-item.js'),
        _0x2011c7 = _0x1efe1c(_0x59d1de),
        _0x3dcd15 = _0x426f83("../../component.js"),
        _0x3c23ae = _0x1efe1c(_0x3dcd15),
        _0x5b65d3 = _0x426f83("../../utils/fn.js"),
        _0x3b4c2c = _0x51e9a1(_0x5b65d3),
        _0x143c7f = _0x426f83("global/window"),
        _0x21be5a = _0x1efe1c(_0x143c7f),
        _0x39a35e = _0x426f83('global/document'),
        _0x34e3d6 = _0x1efe1c(_0x39a35e),
        _0x2b932b = function (_0xd9df11) {
          function _0x32e36c(_0x24b496, _0x79f56b) {
            _0x2ff935(this, _0x32e36c);
            var _0x118196 = _0x79f56b.track,
              _0x251f34 = _0x24b496.textTracks();
            _0x79f56b.label = _0x118196.label || _0x118196.language || "Unknown", _0x79f56b.selected = _0x118196['default'] || "showing" === _0x118196.mode, _0xd9df11.call(this, _0x24b496, _0x79f56b), this.track = _0x118196, _0x251f34 && !function () {
              var _0x40eddc = _0x3b4c2c.bind(this, this.handleTracksChange);
              _0x251f34.addEventListener("change", _0x40eddc), this.on("dispose", function () {
                _0x251f34.removeEventListener("change", _0x40eddc);
              });
            }(), _0x251f34 && void 0x0 === _0x251f34.onchange && !function () {
              var _0x2c17f0 = void 0x0;
              this.on(['tap', "click"], function () {
                if ("object" != typeof _0x21be5a["default"].Event) try {
                  _0x2c17f0 = new _0x21be5a['default'].Event("change");
                } catch (_0x5d164c) {}
                _0x2c17f0 || (_0x2c17f0 = _0x34e3d6['default'].createEvent("Event"), _0x2c17f0.initEvent("change", !0x0, !0x0)), _0x251f34.dispatchEvent(_0x2c17f0);
              });
            }();
          }
          return _0x42efda(_0x32e36c, _0xd9df11), _0x32e36c.prototype.handleClick = function (_0xae76b5) {
            var _0x126df6 = this.player_.textTracks();
            if (_0xd9df11.prototype.handleClick.call(this, _0xae76b5), _0x126df6) for (var _0x4d13c5 = 0x0; 0x0 < _0x126df6.length; _0x4d13c5++) {
              var _0x3db839 = _0x126df6[_0x4d13c5];
              _0x3db839.kind === this.track.kind && (_0x3db839.mode = _0x3db839 === this.track ? "showing" : 'disabled');
            }
          }, _0x32e36c.prototype.handleTracksChange = function () {
            this.selected("showing" === this.track.mode);
          }, _0x32e36c;
        }(_0x2011c7["default"]);
      _0x3c23ae["default"].registerComponent("TextTrackMenuItem", _0x2b932b), _0x18c8bf["default"] = _0x2b932b, _0x4db57d.exports = _0x18c8bf["default"];
    }, {
      '../../component.js': 0x43,
      '../../menu/menu-item.js': 0x6e,
      '../../utils/fn.js': 0x91,
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x5e: [function (_0x235366, _0x441c86, _0x3bea23) {
      'use strict';

      function _0x349f06(_0x44ae1c) {
        if (_0x44ae1c && _0x44ae1c.__esModule) return _0x44ae1c;
        var _0x5cd973 = {};
        if (null != _0x44ae1c) {
          for (var _0x21f349 in _0x44ae1c) Object.prototype.hasOwnProperty.call(_0x44ae1c, _0x21f349) && (_0x5cd973[_0x21f349] = _0x44ae1c[_0x21f349]);
        }
        return _0x5cd973['default'] = _0x44ae1c, _0x5cd973;
      }
      function _0x316a34(_0x2d6b10) {
        return _0x2d6b10 && _0x2d6b10.__esModule ? _0x2d6b10 : {
          'default': _0x2d6b10
        };
      }
      function _0x365f7e(_0x4f09c1, _0x21bd1d) {
        if (!(_0x4f09c1 instanceof _0x21bd1d)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x48a149(_0x52f648, _0x4630bc) {
        if ("function" != typeof _0x4630bc && null !== _0x4630bc) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x4630bc);
        _0x52f648.prototype = Object.create(_0x4630bc && _0x4630bc.prototype, {
          'constructor': {
            'value': _0x52f648,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x4630bc && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x52f648, _0x4630bc) : _0x52f648.__proto__ = _0x4630bc);
      }
      _0x3bea23.__esModule = !0x0;
      var _0x2098fb = _0x235366('../../component.js'),
        _0x330d06 = _0x316a34(_0x2098fb),
        _0x27bf2f = _0x235366("../../utils/dom.js"),
        _0x4a5ade = _0x349f06(_0x27bf2f),
        _0x4d59e8 = _0x235366("../../utils/format-time.js"),
        _0x4ecb06 = _0x316a34(_0x4d59e8),
        _0x387f99 = function (_0x4aba40) {
          function _0x4bbc69(_0x137aaa, _0x4610e1) {
            _0x365f7e(this, _0x4bbc69), _0x4aba40.call(this, _0x137aaa, _0x4610e1), this.on(_0x137aaa, 'timeupdate', this.updateContent);
          }
          return _0x48a149(_0x4bbc69, _0x4aba40), _0x4bbc69.prototype.createEl = function () {
            var _0x43dcc4 = _0x4aba40.prototype.createEl.call(this, "div", {
              'className': "vjs-current-time vjs-time-control vjs-control"
            });
            return this.contentEl_ = _0x4a5ade.createEl("div", {
              'className': "vjs-current-time-display",
              'innerHTML': '<span\x20class=\x22vjs-control-text\x22>Current\x20Time\x20</span>0:00'
            }, {
              'aria-live': "off"
            }), _0x43dcc4.appendChild(this.contentEl_), _0x43dcc4;
          }, _0x4bbc69.prototype.updateContent = function () {
            var _0x3b65e1 = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime(),
              _0x2ce68b = this.localize("Current Time"),
              _0x42e2d5 = _0x4ecb06["default"](_0x3b65e1, this.player_.duration());
            _0x42e2d5 !== this.formattedTime_ && (this.formattedTime_ = _0x42e2d5, this.contentEl_.innerHTML = "<span class=\"vjs-control-text\">" + _0x2ce68b + "</span> " + _0x42e2d5);
          }, _0x4bbc69;
        }(_0x330d06["default"]);
      _0x330d06['default'].registerComponent('CurrentTimeDisplay', _0x387f99), _0x3bea23["default"] = _0x387f99, _0x441c86.exports = _0x3bea23['default'];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f,
      '../../utils/format-time.js': 0x92
    }],
    0x5f: [function (_0x38dce4, _0x2d10dd, _0x4bca07) {
      'use strict';

      function _0x247e09(_0x3b3a89) {
        if (_0x3b3a89 && _0x3b3a89.__esModule) return _0x3b3a89;
        var _0x4d35f9 = {};
        if (null != _0x3b3a89) {
          for (var _0xbd8f68 in _0x3b3a89) Object.prototype.hasOwnProperty.call(_0x3b3a89, _0xbd8f68) && (_0x4d35f9[_0xbd8f68] = _0x3b3a89[_0xbd8f68]);
        }
        return _0x4d35f9["default"] = _0x3b3a89, _0x4d35f9;
      }
      function _0x46a454(_0x14511d) {
        return _0x14511d && _0x14511d.__esModule ? _0x14511d : {
          'default': _0x14511d
        };
      }
      function _0x1773f1(_0x47b113, _0x2cca46) {
        if (!(_0x47b113 instanceof _0x2cca46)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x3029c7(_0x3a3edb, _0x36fbc2) {
        if ("function" != typeof _0x36fbc2 && null !== _0x36fbc2) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x36fbc2);
        _0x3a3edb.prototype = Object.create(_0x36fbc2 && _0x36fbc2.prototype, {
          'constructor': {
            'value': _0x3a3edb,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x36fbc2 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3a3edb, _0x36fbc2) : _0x3a3edb.__proto__ = _0x36fbc2);
      }
      _0x4bca07.__esModule = !0x0;
      var _0x45c2c8 = _0x38dce4("../../component.js"),
        _0xe95951 = _0x46a454(_0x45c2c8),
        _0x3dbc03 = _0x38dce4("../../utils/dom.js"),
        _0x1150ff = _0x247e09(_0x3dbc03),
        _0x5f157a = _0x38dce4("../../utils/format-time.js"),
        _0x10294f = _0x46a454(_0x5f157a),
        _0x2b2085 = function (_0x5ee23b) {
          function _0x1d74a2(_0x1a67c6, _0x1a41d1) {
            _0x1773f1(this, _0x1d74a2), _0x5ee23b.call(this, _0x1a67c6, _0x1a41d1), this.on(_0x1a67c6, "timeupdate", this.updateContent), this.on(_0x1a67c6, "loadedmetadata", this.updateContent);
          }
          return _0x3029c7(_0x1d74a2, _0x5ee23b), _0x1d74a2.prototype.createEl = function () {
            var _0x480f74 = _0x5ee23b.prototype.createEl.call(this, "div", {
              'className': "vjs-duration vjs-time-control vjs-control"
            });
            return this.contentEl_ = _0x1150ff.createEl('div', {
              'className': "vjs-duration-display",
              'innerHTML': "<span class=\"vjs-control-text\">" + this.localize('Duration\x20Time') + "</span> 0:00"
            }, {
              'aria-live': "off"
            }), _0x480f74.appendChild(this.contentEl_), _0x480f74;
          }, _0x1d74a2.prototype.updateContent = function () {
            var _0x9faf6c = this.player_.duration();
            if (_0x9faf6c && this.duration_ !== _0x9faf6c) {
              this.duration_ = _0x9faf6c;
              var _0x5b709e = this.localize("Duration Time"),
                _0x378535 = _0x10294f["default"](_0x9faf6c);
              this.contentEl_.innerHTML = "<span class=\"vjs-control-text\">" + _0x5b709e + "</span> " + _0x378535;
            }
          }, _0x1d74a2;
        }(_0xe95951["default"]);
      _0xe95951["default"].registerComponent('DurationDisplay', _0x2b2085), _0x4bca07["default"] = _0x2b2085, _0x2d10dd.exports = _0x4bca07['default'];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f,
      '../../utils/format-time.js': 0x92
    }],
    0x60: [function (_0x44835e, _0x732782, _0x453c76) {
      'use strict';

      function _0x30d59f(_0xc1c0c6) {
        if (_0xc1c0c6 && _0xc1c0c6.__esModule) return _0xc1c0c6;
        var _0x8130a5 = {};
        if (null != _0xc1c0c6) {
          for (var _0x3e9d82 in _0xc1c0c6) Object.prototype.hasOwnProperty.call(_0xc1c0c6, _0x3e9d82) && (_0x8130a5[_0x3e9d82] = _0xc1c0c6[_0x3e9d82]);
        }
        return _0x8130a5["default"] = _0xc1c0c6, _0x8130a5;
      }
      function _0x19dcd0(_0x59995b) {
        return _0x59995b && _0x59995b.__esModule ? _0x59995b : {
          'default': _0x59995b
        };
      }
      function _0x143084(_0x3bead7, _0x21ab82) {
        if (!(_0x3bead7 instanceof _0x21ab82)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x48012a(_0x2d57b1, _0x36a1d6) {
        if ("function" != typeof _0x36a1d6 && null !== _0x36a1d6) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x36a1d6);
        _0x2d57b1.prototype = Object.create(_0x36a1d6 && _0x36a1d6.prototype, {
          'constructor': {
            'value': _0x2d57b1,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x36a1d6 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2d57b1, _0x36a1d6) : _0x2d57b1.__proto__ = _0x36a1d6);
      }
      _0x453c76.__esModule = !0x0;
      var _0x249ebc = _0x44835e("../../component.js"),
        _0x4b524c = _0x19dcd0(_0x249ebc),
        _0x1b91a1 = _0x44835e("../../utils/dom.js"),
        _0x59b8ba = _0x30d59f(_0x1b91a1),
        _0x1a7ba3 = _0x44835e("../../utils/format-time.js"),
        _0x1af728 = _0x19dcd0(_0x1a7ba3),
        _0x3c946d = function (_0xb1dd2c) {
          function _0x8e0740(_0x168461, _0x431876) {
            _0x143084(this, _0x8e0740), _0xb1dd2c.call(this, _0x168461, _0x431876), this.on(_0x168461, 'timeupdate', this.updateContent);
          }
          return _0x48012a(_0x8e0740, _0xb1dd2c), _0x8e0740.prototype.createEl = function () {
            var _0x54bb0e = _0xb1dd2c.prototype.createEl.call(this, "div", {
              'className': 'vjs-remaining-time\x20vjs-time-control\x20vjs-control'
            });
            return this.contentEl_ = _0x59b8ba.createEl("div", {
              'className': "vjs-remaining-time-display",
              'innerHTML': "<span class=\"vjs-control-text\">" + this.localize("Remaining Time") + '</span>\x20-0:00'
            }, {
              'aria-live': "off"
            }), _0x54bb0e.appendChild(this.contentEl_), _0x54bb0e;
          }, _0x8e0740.prototype.updateContent = function () {
            if (this.player_.duration()) {
              var _0x4ba225 = this.localize("Remaining Time"),
                _0x57c9c5 = _0x1af728["default"](this.player_.remainingTime());
              _0x57c9c5 !== this.formattedTime_ && (this.formattedTime_ = _0x57c9c5, this.contentEl_.innerHTML = "<span class=\"vjs-control-text\">" + _0x4ba225 + "</span> -" + _0x57c9c5);
            }
          }, _0x8e0740;
        }(_0x4b524c["default"]);
      _0x4b524c["default"].registerComponent("RemainingTimeDisplay", _0x3c946d), _0x453c76["default"] = _0x3c946d, _0x732782.exports = _0x453c76["default"];
    }, {
      '../../component.js': 0x43,
      '../../utils/dom.js': 0x8f,
      '../../utils/format-time.js': 0x92
    }],
    0x61: [function (_0x37c081, _0x34e8cf, _0x801a35) {
      'use strict';

      function _0x2b1f2e(_0x2c8184) {
        return _0x2c8184 && _0x2c8184.__esModule ? _0x2c8184 : {
          'default': _0x2c8184
        };
      }
      function _0x47a365(_0x4ec1f0, _0x224787) {
        if (!(_0x4ec1f0 instanceof _0x224787)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x4d6872(_0x4871a1, _0x1f0ccf) {
        if ("function" != typeof _0x1f0ccf && null !== _0x1f0ccf) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x1f0ccf);
        _0x4871a1.prototype = Object.create(_0x1f0ccf && _0x1f0ccf.prototype, {
          'constructor': {
            'value': _0x4871a1,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x1f0ccf && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x4871a1, _0x1f0ccf) : _0x4871a1.__proto__ = _0x1f0ccf);
      }
      _0x801a35.__esModule = !0x0;
      var _0x48a15c = _0x37c081("../../component.js"),
        _0x5e07a9 = _0x2b1f2e(_0x48a15c),
        _0x2bf9b4 = function (_0x19acea) {
          function _0x48cb25() {
            _0x47a365(this, _0x48cb25), _0x19acea.apply(this, arguments);
          }
          return _0x4d6872(_0x48cb25, _0x19acea), _0x48cb25.prototype.createEl = function () {
            return _0x19acea.prototype.createEl.call(this, "div", {
              'className': "vjs-time-control vjs-time-divider",
              'innerHTML': '<div><span>/</span></div>'
            });
          }, _0x48cb25;
        }(_0x5e07a9["default"]);
      _0x5e07a9["default"].registerComponent("TimeDivider", _0x2bf9b4), _0x801a35["default"] = _0x2bf9b4, _0x34e8cf.exports = _0x801a35["default"];
    }, {
      '../../component.js': 0x43
    }],
    0x62: [function (_0x1f2713, _0x124f54, _0xb92f45) {
      'use strict';

      function _0x5e8f70(_0x12646a) {
        if (_0x12646a && _0x12646a.__esModule) return _0x12646a;
        var _0x42323a = {};
        if (null != _0x12646a) {
          for (var _0x2a1804 in _0x12646a) Object.prototype.hasOwnProperty.call(_0x12646a, _0x2a1804) && (_0x42323a[_0x2a1804] = _0x12646a[_0x2a1804]);
        }
        return _0x42323a["default"] = _0x12646a, _0x42323a;
      }
      function _0x559b61(_0x5aafcb) {
        return _0x5aafcb && _0x5aafcb.__esModule ? _0x5aafcb : {
          'default': _0x5aafcb
        };
      }
      function _0x31abd1(_0x4ad28f, _0x198ce7) {
        if (!(_0x4ad28f instanceof _0x198ce7)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x2393a0(_0x5b5e0f, _0x148ad6) {
        if ("function" != typeof _0x148ad6 && null !== _0x148ad6) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x148ad6);
        _0x5b5e0f.prototype = Object.create(_0x148ad6 && _0x148ad6.prototype, {
          'constructor': {
            'value': _0x5b5e0f,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x148ad6 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x5b5e0f, _0x148ad6) : _0x5b5e0f.__proto__ = _0x148ad6);
      }
      _0xb92f45.__esModule = !0x0;
      var _0x535ce5 = _0x1f2713('../menu/menu-button.js'),
        _0x2154ad = _0x559b61(_0x535ce5),
        _0x3a4771 = _0x1f2713("../component.js"),
        _0x1770b8 = _0x559b61(_0x3a4771),
        _0x18517d = _0x1f2713("../utils/fn.js"),
        _0x44250a = _0x5e8f70(_0x18517d),
        _0x4261c8 = function (_0x5ccaf5) {
          function _0x80a19e(_0x210f24, _0xbf0a65) {
            _0x31abd1(this, _0x80a19e);
            var _0x1d72ea = _0xbf0a65.tracks;
            if (_0x5ccaf5.call(this, _0x210f24, _0xbf0a65), this.items.length <= 0x1 && this.hide(), _0x1d72ea) {
              var _0x327eac = _0x44250a.bind(this, this.update);
              _0x1d72ea.addEventListener("removetrack", _0x327eac), _0x1d72ea.addEventListener("addtrack", _0x327eac), this.player_.on("dispose", function () {
                _0x1d72ea.removeEventListener("removetrack", _0x327eac), _0x1d72ea.removeEventListener("addtrack", _0x327eac);
              });
            }
          }
          return _0x2393a0(_0x80a19e, _0x5ccaf5), _0x80a19e;
        }(_0x2154ad['default']);
      _0x1770b8['default'].registerComponent("TrackButton", _0x4261c8), _0xb92f45["default"] = _0x4261c8, _0x124f54.exports = _0xb92f45["default"];
    }, {
      '../component.js': 0x43,
      '../menu/menu-button.js': 0x6d,
      '../utils/fn.js': 0x91
    }],
    0x63: [function (_0x5fd73, _0x80558f, _0xc0ed3a) {
      'use strict';

      function _0x587c5c(_0x17d85c) {
        if (_0x17d85c && _0x17d85c.__esModule) return _0x17d85c;
        var _0x3d624d = {};
        if (null != _0x17d85c) {
          for (var _0x2e07e4 in _0x17d85c) Object.prototype.hasOwnProperty.call(_0x17d85c, _0x2e07e4) && (_0x3d624d[_0x2e07e4] = _0x17d85c[_0x2e07e4]);
        }
        return _0x3d624d["default"] = _0x17d85c, _0x3d624d;
      }
      function _0x5c3134(_0x634729) {
        return _0x634729 && _0x634729.__esModule ? _0x634729 : {
          'default': _0x634729
        };
      }
      function _0x23be9b(_0x5427ea, _0x24bcbb) {
        if (!(_0x5427ea instanceof _0x24bcbb)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x327ff0(_0x55abb3, _0x4bf435) {
        if ("function" != typeof _0x4bf435 && null !== _0x4bf435) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x4bf435);
        _0x55abb3.prototype = Object.create(_0x4bf435 && _0x4bf435.prototype, {
          'constructor': {
            'value': _0x55abb3,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x4bf435 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x55abb3, _0x4bf435) : _0x55abb3.__proto__ = _0x4bf435);
      }
      _0xc0ed3a.__esModule = !0x0;
      var _0x4bb6f6 = _0x5fd73("../../slider/slider.js"),
        _0x20abd7 = _0x5c3134(_0x4bb6f6),
        _0x57ea86 = _0x5fd73("../../component.js"),
        _0x422886 = _0x5c3134(_0x57ea86),
        _0x17dc38 = _0x5fd73('../../utils/fn.js'),
        _0x6c5ee4 = _0x587c5c(_0x17dc38),
        _0xcf2f02 = _0x5fd73("./volume-level.js"),
        _0xa0fc1c = (_0x5c3134(_0xcf2f02), function (_0x252464) {
          function _0x4b0336(_0x3f0e5a, _0x571f0c) {
            _0x23be9b(this, _0x4b0336), _0x252464.call(this, _0x3f0e5a, _0x571f0c), this.on(_0x3f0e5a, "volumechange", this.updateARIAAttributes), _0x3f0e5a.ready(_0x6c5ee4.bind(this, this.updateARIAAttributes));
          }
          return _0x327ff0(_0x4b0336, _0x252464), _0x4b0336.prototype.createEl = function () {
            return _0x252464.prototype.createEl.call(this, "div", {
              'className': "vjs-volume-bar vjs-slider-bar"
            }, {
              'aria-label': "volume level"
            });
          }, _0x4b0336.prototype.handleMouseMove = function (_0x36eb77) {
            this.checkMuted(), this.player_.volume(this.calculateDistance(_0x36eb77));
          }, _0x4b0336.prototype.checkMuted = function () {
            this.player_.muted() && this.player_.muted(!0x1);
          }, _0x4b0336.prototype.getPercent = function () {
            return this.player_.muted() ? 0x0 : this.player_.volume();
          }, _0x4b0336.prototype.stepForward = function () {
            this.checkMuted(), this.player_.volume(this.player_.volume() + 0.1);
          }, _0x4b0336.prototype.stepBack = function () {
            this.checkMuted(), this.player_.volume(this.player_.volume() - 0.1);
          }, _0x4b0336.prototype.updateARIAAttributes = function () {
            var _0x7a2174 = (0x64 * this.player_.volume()).toFixed(0x2);
            this.el_.setAttribute("aria-valuenow", _0x7a2174), this.el_.setAttribute('aria-valuetext', _0x7a2174 + '%');
          }, _0x4b0336;
        }(_0x20abd7["default"]));
      _0xa0fc1c.prototype.options_ = {
        'children': ['volumeLevel'],
        'barName': "volumeLevel"
      }, _0xa0fc1c.prototype.playerEvent = "volumechange", _0x422886["default"].registerComponent("VolumeBar", _0xa0fc1c), _0xc0ed3a["default"] = _0xa0fc1c, _0x80558f.exports = _0xc0ed3a["default"];
    }, {
      '../../component.js': 0x43,
      '../../slider/slider.js': 0x77,
      '../../utils/fn.js': 0x91,
      './volume-level.js': 0x65
    }],
    0x64: [function (_0x2fe587, _0x5bd0e8, _0x46c280) {
      'use strict';

      function _0x1f7f1a(_0x5c6e62) {
        return _0x5c6e62 && _0x5c6e62.__esModule ? _0x5c6e62 : {
          'default': _0x5c6e62
        };
      }
      function _0x3d9721(_0x1e9c83, _0x44ba51) {
        if (!(_0x1e9c83 instanceof _0x44ba51)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x177575(_0x53778c, _0x2fbf57) {
        if ("function" != typeof _0x2fbf57 && null !== _0x2fbf57) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x2fbf57);
        _0x53778c.prototype = Object.create(_0x2fbf57 && _0x2fbf57.prototype, {
          'constructor': {
            'value': _0x53778c,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x2fbf57 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x53778c, _0x2fbf57) : _0x53778c.__proto__ = _0x2fbf57);
      }
      _0x46c280.__esModule = !0x0;
      var _0x342a16 = _0x2fe587("../../component.js"),
        _0x4e1c25 = _0x1f7f1a(_0x342a16),
        _0x5d4389 = _0x2fe587("./volume-bar.js"),
        _0x90e2d4 = (_0x1f7f1a(_0x5d4389), function (_0x448749) {
          function _0x121bf7(_0x4c5401, _0x16e045) {
            _0x3d9721(this, _0x121bf7), _0x448749.call(this, _0x4c5401, _0x16e045), _0x4c5401.tech_ && _0x4c5401.tech_.featuresVolumeControl === !0x1 && this.addClass('vjs-hidden'), this.on(_0x4c5401, "loadstart", function () {
              _0x4c5401.tech_.featuresVolumeControl === !0x1 ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden");
            });
          }
          return _0x177575(_0x121bf7, _0x448749), _0x121bf7.prototype.createEl = function () {
            return _0x448749.prototype.createEl.call(this, 'div', {
              'className': "vjs-volume-control vjs-control"
            });
          }, _0x121bf7;
        }(_0x4e1c25["default"]));
      _0x90e2d4.prototype.options_ = {
        'children': ["volumeBar"]
      }, _0x4e1c25["default"].registerComponent("VolumeControl", _0x90e2d4), _0x46c280["default"] = _0x90e2d4, _0x5bd0e8.exports = _0x46c280["default"];
    }, {
      '../../component.js': 0x43,
      './volume-bar.js': 0x63
    }],
    0x65: [function (_0xa75d3, _0x15aa6f, _0x193684) {
      'use strict';

      function _0x4a249b(_0x4abe2e) {
        return _0x4abe2e && _0x4abe2e.__esModule ? _0x4abe2e : {
          'default': _0x4abe2e
        };
      }
      function _0x2d1496(_0x1aa4d8, _0x55dd85) {
        if (!(_0x1aa4d8 instanceof _0x55dd85)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x543e80(_0x4c950b, _0xd6b186) {
        if ('function' != typeof _0xd6b186 && null !== _0xd6b186) throw new TypeError("Super expression must either be null or a function, not " + typeof _0xd6b186);
        _0x4c950b.prototype = Object.create(_0xd6b186 && _0xd6b186.prototype, {
          'constructor': {
            'value': _0x4c950b,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0xd6b186 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x4c950b, _0xd6b186) : _0x4c950b.__proto__ = _0xd6b186);
      }
      _0x193684.__esModule = !0x0;
      var _0x39ae7e = _0xa75d3('../../component.js'),
        _0x16ad4c = _0x4a249b(_0x39ae7e),
        _0xceb084 = function (_0x37e3f4) {
          function _0x11018e() {
            _0x2d1496(this, _0x11018e), _0x37e3f4.apply(this, arguments);
          }
          return _0x543e80(_0x11018e, _0x37e3f4), _0x11018e.prototype.createEl = function () {
            return _0x37e3f4.prototype.createEl.call(this, "div", {
              'className': 'vjs-volume-level',
              'innerHTML': "<span class=\"vjs-control-text\"></span>"
            });
          }, _0x11018e;
        }(_0x16ad4c["default"]);
      _0x16ad4c["default"].registerComponent("VolumeLevel", _0xceb084), _0x193684["default"] = _0xceb084, _0x15aa6f.exports = _0x193684["default"];
    }, {
      '../../component.js': 0x43
    }],
    0x66: [function (_0x53db24, _0x1d45b2, _0x887f35) {
      'use strict';

      function _0x586af6(_0x39c038) {
        return _0x39c038 && _0x39c038.__esModule ? _0x39c038 : {
          'default': _0x39c038
        };
      }
      function _0x117802(_0x35f913) {
        if (_0x35f913 && _0x35f913.__esModule) return _0x35f913;
        var _0x177de1 = {};
        if (null != _0x35f913) {
          for (var _0x4eae95 in _0x35f913) Object.prototype.hasOwnProperty.call(_0x35f913, _0x4eae95) && (_0x177de1[_0x4eae95] = _0x35f913[_0x4eae95]);
        }
        return _0x177de1['default'] = _0x35f913, _0x177de1;
      }
      function _0x138e13(_0x14070f, _0x12da13) {
        if (!(_0x14070f instanceof _0x12da13)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x45fc45(_0x2af420, _0x553e1c) {
        if ("function" != typeof _0x553e1c && null !== _0x553e1c) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x553e1c);
        _0x2af420.prototype = Object.create(_0x553e1c && _0x553e1c.prototype, {
          'constructor': {
            'value': _0x2af420,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x553e1c && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2af420, _0x553e1c) : _0x2af420.__proto__ = _0x553e1c);
      }
      _0x887f35.__esModule = !0x0;
      var _0x38fd28 = _0x53db24("../utils/fn.js"),
        _0x244249 = _0x117802(_0x38fd28),
        _0x43331d = _0x53db24("../component.js"),
        _0x2ee43a = _0x586af6(_0x43331d),
        _0x130c0a = _0x53db24('../popup/popup.js'),
        _0x1deae8 = _0x586af6(_0x130c0a),
        _0x1bc358 = _0x53db24("../popup/popup-button.js"),
        _0x170103 = _0x586af6(_0x1bc358),
        _0x1ae791 = _0x53db24("./mute-toggle.js"),
        _0x196a76 = _0x586af6(_0x1ae791),
        _0x48c69a = _0x53db24("./volume-control/volume-bar.js"),
        _0x3ed1fc = _0x586af6(_0x48c69a),
        _0x597004 = function (_0x5b0a3b) {
          function _0x433e82(_0x22a6f0) {
            function _0x3ef343() {
              _0x22a6f0.tech_ && _0x22a6f0.tech_.featuresVolumeControl === !0x1 ? this.addClass("vjs-hidden") : this.removeClass("vjs-hidden");
            }
            var _0x49ff80 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            _0x138e13(this, _0x433e82), void 0x0 === _0x49ff80.inline && (_0x49ff80.inline = !0x0), void 0x0 === _0x49ff80.vertical && (_0x49ff80.vertical = _0x49ff80.inline ? !0x1 : !0x0), _0x49ff80.volumeBar = _0x49ff80.volumeBar || {}, _0x49ff80.volumeBar.vertical = !!_0x49ff80.vertical, _0x5b0a3b.call(this, _0x22a6f0, _0x49ff80), this.on(_0x22a6f0, "volumechange", this.volumeUpdate), this.on(_0x22a6f0, "loadstart", this.volumeUpdate), _0x3ef343.call(this), this.on(_0x22a6f0, "loadstart", _0x3ef343), this.on(this.volumeBar, ['slideractive', "focus"], function () {
              this.addClass("vjs-slider-active");
            }), this.on(this.volumeBar, ["sliderinactive", "blur"], function () {
              this.removeClass("vjs-slider-active");
            }), this.on(this.volumeBar, ["focus"], function () {
              this.addClass("vjs-lock-showing");
            }), this.on(this.volumeBar, ["blur"], function () {
              this.removeClass("vjs-lock-showing");
            });
          }
          return _0x45fc45(_0x433e82, _0x5b0a3b), _0x433e82.prototype.buildCSSClass = function () {
            var _0x5b9ac9 = '';
            return _0x5b9ac9 = this.options_.vertical ? "vjs-volume-menu-button-vertical" : "vjs-volume-menu-button-horizontal", "vjs-volume-menu-button " + _0x5b0a3b.prototype.buildCSSClass.call(this) + '\x20' + _0x5b9ac9;
          }, _0x433e82.prototype.createPopup = function () {
            var _0x149e7d = new _0x1deae8["default"](this.player_, {
                'contentElType': "div"
              }),
              _0x1b70c4 = new _0x3ed1fc["default"](this.player_, this.options_.volumeBar);
            return _0x149e7d.addChild(_0x1b70c4), this.menuContent = _0x149e7d, this.volumeBar = _0x1b70c4, this.attachVolumeBarEvents(), _0x149e7d;
          }, _0x433e82.prototype.handleClick = function () {
            _0x196a76['default'].prototype.handleClick.call(this), _0x5b0a3b.prototype.handleClick.call(this);
          }, _0x433e82.prototype.attachVolumeBarEvents = function () {
            this.menuContent.on(["mousedown", 'touchdown'], _0x244249.bind(this, this.handleMouseDown));
          }, _0x433e82.prototype.handleMouseDown = function () {
            this.on(["mousemove", "touchmove"], _0x244249.bind(this.volumeBar, this.volumeBar.handleMouseMove)), this.on(this.el_.ownerDocument, ["mouseup", 'touchend'], this.handleMouseUp);
          }, _0x433e82.prototype.handleMouseUp = function () {
            this.off(['mousemove', 'touchmove'], _0x244249.bind(this.volumeBar, this.volumeBar.handleMouseMove));
          }, _0x433e82;
        }(_0x170103["default"]);
      _0x597004.prototype.volumeUpdate = _0x196a76['default'].prototype.update, _0x597004.prototype.controlText_ = "Mute", _0x2ee43a['default'].registerComponent("VolumeMenuButton", _0x597004), _0x887f35["default"] = _0x597004, _0x1d45b2.exports = _0x887f35["default"];
    }, {
      '../component.js': 0x43,
      '../popup/popup-button.js': 0x73,
      '../popup/popup.js': 0x74,
      '../utils/fn.js': 0x91,
      './mute-toggle.js': 0x49,
      './volume-control/volume-bar.js': 0x63
    }],
    0x67: [function (_0x1fade6, _0x58bc25, _0x113480) {
      'use strict';

      function _0x186334(_0x520ca6) {
        if (_0x520ca6 && _0x520ca6.__esModule) return _0x520ca6;
        var _0x492b1a = {};
        if (null != _0x520ca6) {
          for (var _0x2595c0 in _0x520ca6) Object.prototype.hasOwnProperty.call(_0x520ca6, _0x2595c0) && (_0x492b1a[_0x2595c0] = _0x520ca6[_0x2595c0]);
        }
        return _0x492b1a['default'] = _0x520ca6, _0x492b1a;
      }
      function _0x299353(_0x2a47bc) {
        return _0x2a47bc && _0x2a47bc.__esModule ? _0x2a47bc : {
          'default': _0x2a47bc
        };
      }
      function _0x1b74d6(_0x22e20b, _0x2fcc06) {
        if (!(_0x22e20b instanceof _0x2fcc06)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x267d9b(_0x596bcb, _0x5142c2) {
        if ('function' != typeof _0x5142c2 && null !== _0x5142c2) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x5142c2);
        _0x596bcb.prototype = Object.create(_0x5142c2 && _0x5142c2.prototype, {
          'constructor': {
            'value': _0x596bcb,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x5142c2 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x596bcb, _0x5142c2) : _0x596bcb.__proto__ = _0x5142c2);
      }
      _0x113480.__esModule = !0x0;
      var _0x23e0ba = _0x1fade6("./component"),
        _0x439ed4 = _0x299353(_0x23e0ba),
        _0xbcc709 = _0x1fade6("./modal-dialog"),
        _0xfc05ea = _0x299353(_0xbcc709),
        _0x1a8f02 = _0x1fade6("./utils/dom"),
        _0xcfdd38 = (_0x186334(_0x1a8f02), _0x1fade6("./utils/merge-options")),
        _0x5947f3 = _0x299353(_0xcfdd38),
        _0x975ba0 = function (_0x407465) {
          function _0x55fa84(_0x58d755, _0x292457) {
            _0x1b74d6(this, _0x55fa84), _0x407465.call(this, _0x58d755, _0x292457), this.on(_0x58d755, "error", this.open);
          }
          return _0x267d9b(_0x55fa84, _0x407465), _0x55fa84.prototype.buildCSSClass = function () {
            return 'vjs-error-display\x20' + _0x407465.prototype.buildCSSClass.call(this);
          }, _0x55fa84.prototype.content = function () {
            var _0x49243e = this.player().error();
            return _0x49243e ? this.localize(_0x49243e.message) : '';
          }, _0x55fa84;
        }(_0xfc05ea["default"]);
      _0x975ba0.prototype.options_ = _0x5947f3["default"](_0xfc05ea["default"].prototype.options_, {
        'fillAlways': !0x0,
        'temporary': !0x1,
        'uncloseable': !0x0
      }), _0x439ed4["default"].registerComponent("ErrorDisplay", _0x975ba0), _0x113480['default'] = _0x975ba0, _0x58bc25.exports = _0x113480['default'];
    }, {
      './component': 0x43,
      './modal-dialog': 0x70,
      './utils/dom': 0x8f,
      './utils/merge-options': 0x95
    }],
    0x68: [function (_0xc1f50d, _0x1c9402, _0x29ca90) {
      'use strict';

      function _0x12c3e9(_0x4d99c9) {
        if (_0x4d99c9 && _0x4d99c9.__esModule) return _0x4d99c9;
        var _0x2bf36b = {};
        if (null != _0x4d99c9) {
          for (var _0x4ceee4 in _0x4d99c9) Object.prototype.hasOwnProperty.call(_0x4d99c9, _0x4ceee4) && (_0x2bf36b[_0x4ceee4] = _0x4d99c9[_0x4ceee4]);
        }
        return _0x2bf36b['default'] = _0x4d99c9, _0x2bf36b;
      }
      _0x29ca90.__esModule = !0x0;
      var _0x461922 = _0xc1f50d("./utils/events.js"),
        _0x2fa08a = _0x12c3e9(_0x461922),
        _0x329a16 = function () {};
      _0x329a16.prototype.allowedEvents_ = {}, _0x329a16.prototype.on = function (_0x4ecb0b, _0x148bec) {
        this.addEventListener = function () {}, _0x2fa08a.on(this, _0x4ecb0b, _0x148bec), this.addEventListener = this.addEventListener;
      }, _0x329a16.prototype.addEventListener = _0x329a16.prototype.on, _0x329a16.prototype.off = function (_0x2ba116, _0x4d9c0f) {
        _0x2fa08a.off(this, _0x2ba116, _0x4d9c0f);
      }, _0x329a16.prototype.removeEventListener = _0x329a16.prototype.off, _0x329a16.prototype.one = function (_0x5a0aba, _0xc4fa3e) {
        this.addEventListener = function () {}, _0x2fa08a.one(this, _0x5a0aba, _0xc4fa3e), this.addEventListener = this.addEventListener;
      }, _0x329a16.prototype.trigger = function (_0x45d050) {
        var _0xf8e887 = _0x45d050.type || _0x45d050;
        "string" == typeof _0x45d050 && (_0x45d050 = {
          'type': _0xf8e887
        }), _0x45d050 = _0x2fa08a.fixEvent(_0x45d050), this.allowedEvents_[_0xf8e887] && this['on' + _0xf8e887] && this['on' + _0xf8e887](_0x45d050), _0x2fa08a.trigger(this, _0x45d050);
      }, _0x329a16.prototype.dispatchEvent = _0x329a16.prototype.trigger, _0x29ca90["default"] = _0x329a16, _0x1c9402.exports = _0x29ca90["default"];
    }, {
      './utils/events.js': 0x90
    }],
    0x69: [function (_0x31172d, _0x5da568, _0x38e0d8) {
      'use strict';

      function _0x53f875(_0x3bd24e) {
        return _0x3bd24e && _0x3bd24e.__esModule ? _0x3bd24e : {
          'default': _0x3bd24e
        };
      }
      _0x38e0d8.__esModule = !0x0;
      var _0x57e301 = _0x31172d("./utils/log"),
        _0x54af39 = _0x53f875(_0x57e301),
        _0x53e184 = function (_0x450b78, _0x2aa996) {
          if ('function' != typeof _0x2aa996 && null !== _0x2aa996) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x2aa996);
          _0x450b78.prototype = Object.create(_0x2aa996 && _0x2aa996.prototype, {
            'constructor': {
              'value': _0x450b78,
              'enumerable': !0x1,
              'writable': !0x0,
              'configurable': !0x0
            }
          }), _0x2aa996 && (_0x450b78.super_ = _0x2aa996);
        },
        _0x29cbe8 = function (_0x288f2c) {
          var _0xf37ecf = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1],
            _0x1c8601 = function () {
              _0x288f2c.apply(this, arguments);
            },
            _0x49cafb = {};
          'object' == typeof _0xf37ecf ? ("function" == typeof _0xf37ecf.init && (_0x54af39["default"].warn("Constructor logic via init() is deprecated; please use constructor() instead."), _0xf37ecf.constructor = _0xf37ecf.init), _0xf37ecf.constructor !== Object.prototype.constructor && (_0x1c8601 = _0xf37ecf.constructor), _0x49cafb = _0xf37ecf) : 'function' == typeof _0xf37ecf && (_0x1c8601 = _0xf37ecf), _0x53e184(_0x1c8601, _0x288f2c);
          for (var _0x865c33 in _0x49cafb) _0x49cafb.hasOwnProperty(_0x865c33) && (_0x1c8601.prototype[_0x865c33] = _0x49cafb[_0x865c33]);
          return _0x1c8601;
        };
      _0x38e0d8['default'] = _0x29cbe8, _0x5da568.exports = _0x38e0d8["default"];
    }, {
      './utils/log': 0x94
    }],
    0x6a: [function (_0x24bb48, _0xeabec7, _0x8d1395) {
      'use strict';

      function _0x1a86c6(_0x235012) {
        return _0x235012 && _0x235012.__esModule ? _0x235012 : {
          'default': _0x235012
        };
      }
      _0x8d1395.__esModule = !0x0;
      for (var _0x4f69f7 = _0x24bb48("global/document"), _0x1b680a = _0x1a86c6(_0x4f69f7), _0x3706c4 = {}, _0x3d6cc9 = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", 'webkitCancelFullScreen', "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", 'MSFullscreenError']], _0x5ae59b = _0x3d6cc9[0x0], _0x5f1420 = void 0x0, _0x2e26fe = 0x0; 0x0 < _0x3d6cc9.length; _0x2e26fe++) if (_0x3d6cc9[_0x2e26fe][0x1] in _0x1b680a['default']) {
        _0x5f1420 = _0x3d6cc9[_0x2e26fe];
        break;
      }
      if (_0x5f1420) {
        for (var _0x2e26fe = 0x0; 0x0 < _0x5f1420.length; _0x2e26fe++) _0x3706c4[_0x5ae59b[_0x2e26fe]] = _0x5f1420[_0x2e26fe];
      }
      _0x8d1395["default"] = _0x3706c4, _0xeabec7.exports = _0x8d1395["default"];
    }, {
      'global/document': 0x1
    }],
    0x6b: [function (_0x2441dd, _0x40939b, _0x1b7388) {
      'use strict';

      function _0xc9d234(_0x57422b) {
        return _0x57422b && _0x57422b.__esModule ? _0x57422b : {
          'default': _0x57422b
        };
      }
      function _0x1cc003(_0x3cb028, _0x40aabf) {
        if (!(_0x3cb028 instanceof _0x40aabf)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x478473(_0x4a8410, _0x5383c7) {
        if ("function" != typeof _0x5383c7 && null !== _0x5383c7) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x5383c7);
        _0x4a8410.prototype = Object.create(_0x5383c7 && _0x5383c7.prototype, {
          'constructor': {
            'value': _0x4a8410,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x5383c7 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x4a8410, _0x5383c7) : _0x4a8410.__proto__ = _0x5383c7);
      }
      _0x1b7388.__esModule = !0x0;
      var _0x20e1da = _0x2441dd("./component"),
        _0x35c70f = _0xc9d234(_0x20e1da),
        _0x2dae42 = function (_0xa3bfbe) {
          function _0x242f68() {
            _0x1cc003(this, _0x242f68), _0xa3bfbe.apply(this, arguments);
          }
          return _0x478473(_0x242f68, _0xa3bfbe), _0x242f68.prototype.createEl = function () {
            return _0xa3bfbe.prototype.createEl.call(this, "div", {
              'className': "vjs-loading-spinner",
              'dir': "ltr"
            });
          }, _0x242f68;
        }(_0x35c70f["default"]);
      _0x35c70f["default"].registerComponent("LoadingSpinner", _0x2dae42), _0x1b7388['default'] = _0x2dae42, _0x40939b.exports = _0x1b7388["default"];
    }, {
      './component': 0x43
    }],
    0x6c: [function (_0x2e713f, _0x70a0ab, _0x151950) {
      'use strict';

      function _0x2702ff(_0x36e762) {
        return _0x36e762 && _0x36e762.__esModule ? _0x36e762 : {
          'default': _0x36e762
        };
      }
      _0x151950.__esModule = !0x0;
      var _0x250095 = _0x2e713f("object.assign"),
        _0x585c91 = _0x2702ff(_0x250095),
        _0x47364b = function _0x2e83b8(_0x13baaf) {
          'number' == typeof _0x13baaf ? this.code = _0x13baaf : "string" == typeof _0x13baaf ? this.message = _0x13baaf : 'object' == typeof _0x13baaf && _0x585c91["default"](this, _0x13baaf), this.message || (this.message = _0x2e83b8.defaultMessages[this.code] || '');
        };
      _0x47364b.prototype.code = 0x0, _0x47364b.prototype.message = '', _0x47364b.prototype.status = null, _0x47364b.errorTypes = ["MEDIA_ERR_CUSTOM", "MEDIA_ERR_ABORTED", "MEDIA_ERR_NETWORK", 'MEDIA_ERR_DECODE', "MEDIA_ERR_SRC_NOT_SUPPORTED", 'MEDIA_ERR_ENCRYPTED'], _0x47364b.defaultMessages = {
        0x1: 'You\x20aborted\x20the\x20media\x20playback',
        0x2: "A network error caused the media download to fail part-way.",
        0x3: "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.",
        0x4: 'The\x20media\x20could\x20not\x20be\x20loaded,\x20either\x20because\x20the\x20server\x20or\x20network\x20failed\x20or\x20because\x20the\x20format\x20is\x20not\x20supported.',
        0x5: "The media is encrypted and we do not have the keys to decrypt it."
      };
      for (var _0x1fdee9 = 0x0; 0x0 < _0x47364b.errorTypes.length; _0x1fdee9++) _0x47364b[_0x47364b.errorTypes[_0x1fdee9]] = _0x1fdee9, _0x47364b.prototype[_0x47364b.errorTypes[_0x1fdee9]] = _0x1fdee9;
      _0x151950["default"] = _0x47364b, _0x70a0ab.exports = _0x151950["default"];
    }, {
      'object.assign': 0x2d
    }],
    0x6d: [function (_0x31cee1, _0x1656f6, _0x5bf561) {
      'use strict';

      function _0xf94f0a(_0x1c5624) {
        if (_0x1c5624 && _0x1c5624.__esModule) return _0x1c5624;
        var _0x3c3617 = {};
        if (null != _0x1c5624) {
          for (var _0x5ef568 in _0x1c5624) Object.prototype.hasOwnProperty.call(_0x1c5624, _0x5ef568) && (_0x3c3617[_0x5ef568] = _0x1c5624[_0x5ef568]);
        }
        return _0x3c3617["default"] = _0x1c5624, _0x3c3617;
      }
      function _0x1aeb6b(_0x2037d8) {
        return _0x2037d8 && _0x2037d8.__esModule ? _0x2037d8 : {
          'default': _0x2037d8
        };
      }
      function _0x3f99fc(_0x584fb6, _0x400b17) {
        if (!(_0x584fb6 instanceof _0x400b17)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x863d73(_0x463a86, _0x5bbec2) {
        if ("function" != typeof _0x5bbec2 && null !== _0x5bbec2) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x5bbec2);
        _0x463a86.prototype = Object.create(_0x5bbec2 && _0x5bbec2.prototype, {
          'constructor': {
            'value': _0x463a86,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x5bbec2 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x463a86, _0x5bbec2) : _0x463a86.__proto__ = _0x5bbec2);
      }
      _0x5bf561.__esModule = !0x0;
      var _0x13216c = _0x31cee1("../clickable-component.js"),
        _0x4b3c85 = _0x1aeb6b(_0x13216c),
        _0x5eb5f3 = _0x31cee1("../component.js"),
        _0x2eae86 = _0x1aeb6b(_0x5eb5f3),
        _0x39a92a = _0x31cee1("./menu.js"),
        _0x2798df = _0x1aeb6b(_0x39a92a),
        _0x215ade = _0x31cee1("../utils/dom.js"),
        _0x35eafd = _0xf94f0a(_0x215ade),
        _0x406dd0 = _0x31cee1("../utils/fn.js"),
        _0x3c8076 = _0xf94f0a(_0x406dd0),
        _0x189e3a = _0x31cee1("../utils/to-title-case.js"),
        _0x283015 = _0x1aeb6b(_0x189e3a),
        _0x5ae3f7 = function (_0xb83f71) {
          function _0x5b6d09(_0x49494c) {
            var _0x11ffff = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            _0x3f99fc(this, _0x5b6d09), _0xb83f71.call(this, _0x49494c, _0x11ffff), this.update(), this.enabled_ = !0x0, this.el_.setAttribute("aria-haspopup", "true"), this.el_.setAttribute("role", "menuitem"), this.on('keydown', this.handleSubmenuKeyPress);
          }
          return _0x863d73(_0x5b6d09, _0xb83f71), _0x5b6d09.prototype.update = function () {
            var _0x5cd7b6 = this.createMenu();
            this.menu && this.removeChild(this.menu), this.menu = _0x5cd7b6, this.addChild(_0x5cd7b6), this.buttonPressed_ = !0x1, this.el_.setAttribute('aria-expanded', "false"), this.items && 0x0 === this.items.length ? this.hide() : this.items && this.items.length > 0x1 && this.show();
          }, _0x5b6d09.prototype.createMenu = function () {
            var _0x1d76f2 = new _0x2798df["default"](this.player_);
            if (this.options_.title) {
              var _0x47ab25 = _0x35eafd.createEl('li', {
                'className': "vjs-menu-title",
                'innerHTML': _0x283015["default"](this.options_.title),
                'tabIndex': -0x1
              });
              _0x1d76f2.children_.unshift(_0x47ab25), _0x35eafd.insertElFirst(_0x47ab25, _0x1d76f2.contentEl());
            }
            if (this.items = this.createItems(), this.items) {
              for (var _0x4e01af = 0x0; 0x0 < this.items.length; _0x4e01af++) _0x1d76f2.addItem(this.items[_0x4e01af]);
            }
            return _0x1d76f2;
          }, _0x5b6d09.prototype.createItems = function () {}, _0x5b6d09.prototype.createEl = function () {
            return _0xb83f71.prototype.createEl.call(this, "div", {
              'className': this.buildCSSClass()
            });
          }, _0x5b6d09.prototype.buildCSSClass = function () {
            var _0x22519c = 'vjs-menu-button';
            return _0x22519c += this.options_.inline === !0x0 ? "-inline" : "-popup", 'vjs-menu-button\x20' + _0x22519c + '\x20' + _0xb83f71.prototype.buildCSSClass.call(this);
          }, _0x5b6d09.prototype.handleClick = function () {
            this.one('mouseout', _0x3c8076.bind(this, function () {
              this.menu.unlockShowing(), this.el_.blur();
            })), this.buttonPressed_ ? this.unpressButton() : this.pressButton();
          }, _0x5b6d09.prototype.handleKeyPress = function (_0x15906c) {
            0x1b === _0x15906c.which || 0x9 === _0x15906c.which ? (this.buttonPressed_ && this.unpressButton(), 0x9 !== _0x15906c.which && _0x15906c.preventDefault()) : 0x26 === _0x15906c.which || 0x28 === _0x15906c.which ? this.buttonPressed_ || (this.pressButton(), _0x15906c.preventDefault()) : _0xb83f71.prototype.handleKeyPress.call(this, _0x15906c);
          }, _0x5b6d09.prototype.handleSubmenuKeyPress = function (_0x2460b1) {
            (0x1b === _0x2460b1.which || 0x9 === _0x2460b1.which) && (this.buttonPressed_ && this.unpressButton(), 0x9 !== _0x2460b1.which && _0x2460b1.preventDefault());
          }, _0x5b6d09.prototype.pressButton = function () {
            this.enabled_ && (this.buttonPressed_ = !0x0, this.menu.lockShowing(), this.el_.setAttribute("aria-expanded", "true"), this.menu.focus());
          }, _0x5b6d09.prototype.unpressButton = function () {
            this.enabled_ && (this.buttonPressed_ = !0x1, this.menu.unlockShowing(), this.el_.setAttribute("aria-expanded", 'false'), this.el_.focus());
          }, _0x5b6d09.prototype.disable = function () {
            return this.buttonPressed_ = !0x1, this.menu.unlockShowing(), this.el_.setAttribute("aria-expanded", "false"), this.enabled_ = !0x1, _0xb83f71.prototype.disable.call(this);
          }, _0x5b6d09.prototype.enable = function () {
            return this.enabled_ = !0x0, _0xb83f71.prototype.enable.call(this);
          }, _0x5b6d09;
        }(_0x4b3c85["default"]);
      _0x2eae86["default"].registerComponent("MenuButton", _0x5ae3f7), _0x5bf561["default"] = _0x5ae3f7, _0x1656f6.exports = _0x5bf561["default"];
    }, {
      '../clickable-component.js': 0x41,
      '../component.js': 0x43,
      '../utils/dom.js': 0x8f,
      '../utils/fn.js': 0x91,
      '../utils/to-title-case.js': 0x98,
      './menu.js': 0x6f
    }],
    0x6e: [function (_0x5b7699, _0x2fceb2, _0x379616) {
      'use strict';

      function _0x379316(_0x17bab1) {
        return _0x17bab1 && _0x17bab1.__esModule ? _0x17bab1 : {
          'default': _0x17bab1
        };
      }
      function _0x10cd3c(_0x55d898, _0x55fdd3) {
        if (!(_0x55d898 instanceof _0x55fdd3)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x253901(_0x207663, _0x1daebc) {
        if ("function" != typeof _0x1daebc && null !== _0x1daebc) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x1daebc);
        _0x207663.prototype = Object.create(_0x1daebc && _0x1daebc.prototype, {
          'constructor': {
            'value': _0x207663,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x1daebc && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x207663, _0x1daebc) : _0x207663.__proto__ = _0x1daebc);
      }
      _0x379616.__esModule = !0x0;
      var _0x1319b7 = _0x5b7699("../clickable-component.js"),
        _0x521006 = _0x379316(_0x1319b7),
        _0x61b488 = _0x5b7699("../component.js"),
        _0xb7c6d3 = _0x379316(_0x61b488),
        _0x215ebb = _0x5b7699("object.assign"),
        _0x27b3ec = _0x379316(_0x215ebb),
        _0x12541f = function (_0x4fa7d5) {
          function _0x28164f(_0x97828d, _0x4af476) {
            _0x10cd3c(this, _0x28164f), _0x4fa7d5.call(this, _0x97828d, _0x4af476), this.selectable = _0x4af476.selectable, this.selected(_0x4af476.selected), this.selectable ? this.el_.setAttribute("role", "menuitemcheckbox") : this.el_.setAttribute('role', "menuitem");
          }
          return _0x253901(_0x28164f, _0x4fa7d5), _0x28164f.prototype.createEl = function (_0x4f50c1, _0x7de3af, _0x3d2963) {
            return _0x4fa7d5.prototype.createEl.call(this, 'li', _0x27b3ec["default"]({
              'className': 'vjs-menu-item',
              'innerHTML': this.localize(this.options_.label),
              'tabIndex': -0x1
            }, _0x7de3af), _0x3d2963);
          }, _0x28164f.prototype.handleClick = function () {
            this.selected(!0x0);
          }, _0x28164f.prototype.selected = function (_0x563f0d) {
            this.selectable && (_0x563f0d ? (this.addClass("vjs-selected"), this.el_.setAttribute("aria-checked", 'true'), this.controlText(',\x20selected')) : (this.removeClass("vjs-selected"), this.el_.setAttribute("aria-checked", "false"), this.controlText('\x20')));
          }, _0x28164f;
        }(_0x521006["default"]);
      _0xb7c6d3["default"].registerComponent("MenuItem", _0x12541f), _0x379616['default'] = _0x12541f, _0x2fceb2.exports = _0x379616["default"];
    }, {
      '../clickable-component.js': 0x41,
      '../component.js': 0x43,
      'object.assign': 0x2d
    }],
    0x6f: [function (_0xed4d45, _0x2bff77, _0x1e2f58) {
      'use strict';

      function _0x4bf6a9(_0x3f8899) {
        if (_0x3f8899 && _0x3f8899.__esModule) return _0x3f8899;
        var _0x58972e = {};
        if (null != _0x3f8899) {
          for (var _0x38d389 in _0x3f8899) Object.prototype.hasOwnProperty.call(_0x3f8899, _0x38d389) && (_0x58972e[_0x38d389] = _0x3f8899[_0x38d389]);
        }
        return _0x58972e['default'] = _0x3f8899, _0x58972e;
      }
      function _0x29b069(_0x494702) {
        return _0x494702 && _0x494702.__esModule ? _0x494702 : {
          'default': _0x494702
        };
      }
      function _0x2030a9(_0x1bb99d, _0x5a9783) {
        if (!(_0x1bb99d instanceof _0x5a9783)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x5ce3da(_0x5d89eb, _0x50c11e) {
        if ("function" != typeof _0x50c11e && null !== _0x50c11e) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x50c11e);
        _0x5d89eb.prototype = Object.create(_0x50c11e && _0x50c11e.prototype, {
          'constructor': {
            'value': _0x5d89eb,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x50c11e && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x5d89eb, _0x50c11e) : _0x5d89eb.__proto__ = _0x50c11e);
      }
      _0x1e2f58.__esModule = !0x0;
      var _0x52effa = _0xed4d45("../component.js"),
        _0xb12041 = _0x29b069(_0x52effa),
        _0x17834e = _0xed4d45('../utils/dom.js'),
        _0x311889 = _0x4bf6a9(_0x17834e),
        _0x3d50b6 = _0xed4d45("../utils/fn.js"),
        _0x19fb99 = _0x4bf6a9(_0x3d50b6),
        _0x3cbcf5 = _0xed4d45("../utils/events.js"),
        _0x51a356 = _0x4bf6a9(_0x3cbcf5),
        _0xcce925 = function (_0x2ef671) {
          function _0x75c8d5(_0x4e7322, _0x95c136) {
            _0x2030a9(this, _0x75c8d5), _0x2ef671.call(this, _0x4e7322, _0x95c136), this.focusedChild_ = -0x1, this.on("keydown", this.handleKeyPress);
          }
          return _0x5ce3da(_0x75c8d5, _0x2ef671), _0x75c8d5.prototype.addItem = function (_0x23835d) {
            this.addChild(_0x23835d), _0x23835d.on("click", _0x19fb99.bind(this, function () {
              this.unlockShowing();
            }));
          }, _0x75c8d5.prototype.createEl = function () {
            var _0x5ccc02 = this.options_.contentElType || 'ul';
            this.contentEl_ = _0x311889.createEl(_0x5ccc02, {
              'className': 'vjs-menu-content'
            }), this.contentEl_.setAttribute('role', "menu");
            var _0xb12f6b = _0x2ef671.prototype.createEl.call(this, "div", {
              'append': this.contentEl_,
              'className': 'vjs-menu'
            });
            return _0xb12f6b.setAttribute('role', 'presentation'), _0xb12f6b.appendChild(this.contentEl_), _0x51a356.on(_0xb12f6b, "click", function (_0x2f6150) {
              _0x2f6150.preventDefault(), _0x2f6150.stopImmediatePropagation();
            }), _0xb12f6b;
          }, _0x75c8d5.prototype.handleKeyPress = function (_0x27c3e1) {
            0x25 === _0x27c3e1.which || 0x28 === _0x27c3e1.which ? (_0x27c3e1.preventDefault(), this.stepForward()) : (0x26 === _0x27c3e1.which || 0x27 === _0x27c3e1.which) && (_0x27c3e1.preventDefault(), this.stepBack());
          }, _0x75c8d5.prototype.stepForward = function () {
            var _0x38bfd1 = 0x0;
            void 0x0 !== this.focusedChild_ && (_0x38bfd1 = this.focusedChild_ + 0x1), this.focus(_0x38bfd1);
          }, _0x75c8d5.prototype.stepBack = function () {
            var _0x52bd84 = 0x0;
            void 0x0 !== this.focusedChild_ && (_0x52bd84 = this.focusedChild_ - 0x1), this.focus(_0x52bd84);
          }, _0x75c8d5.prototype.focus = function () {
            var _0x2e85bd = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? 0x0 : arguments[0x0],
              _0x22f936 = this.children().slice(),
              _0x5615ad = _0x22f936.length && _0x22f936[0x0].className && /vjs-menu-title/.test(_0x22f936[0x0].className);
            _0x5615ad && _0x22f936.shift(), _0x22f936.length > 0x0 && (0x0 > _0x2e85bd ? _0x2e85bd = 0x0 : _0x2e85bd >= _0x22f936.length && (_0x2e85bd = _0x22f936.length - 0x1), this.focusedChild_ = _0x2e85bd, _0x22f936[_0x2e85bd].el_.focus());
          }, _0x75c8d5;
        }(_0xb12041['default']);
      _0xb12041["default"].registerComponent("Menu", _0xcce925), _0x1e2f58["default"] = _0xcce925, _0x2bff77.exports = _0x1e2f58["default"];
    }, {
      '../component.js': 0x43,
      '../utils/dom.js': 0x8f,
      '../utils/events.js': 0x90,
      '../utils/fn.js': 0x91
    }],
    0x70: [function (_0x217175, _0x325a38, _0xa42857) {
      'use strict';

      function _0x3e61a0(_0x362450) {
        return _0x362450 && _0x362450.__esModule ? _0x362450 : {
          'default': _0x362450
        };
      }
      function _0x280ab5(_0x2aa2bc) {
        if (_0x2aa2bc && _0x2aa2bc.__esModule) return _0x2aa2bc;
        var _0xdfb40a = {};
        if (null != _0x2aa2bc) {
          for (var _0x29224a in _0x2aa2bc) Object.prototype.hasOwnProperty.call(_0x2aa2bc, _0x29224a) && (_0xdfb40a[_0x29224a] = _0x2aa2bc[_0x29224a]);
        }
        return _0xdfb40a["default"] = _0x2aa2bc, _0xdfb40a;
      }
      function _0x3ba058(_0x592dcc, _0x37159d) {
        if (!(_0x592dcc instanceof _0x37159d)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x5ae3ad(_0x4f6460, _0x140f9c) {
        if ("function" != typeof _0x140f9c && null !== _0x140f9c) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x140f9c);
        _0x4f6460.prototype = Object.create(_0x140f9c && _0x140f9c.prototype, {
          'constructor': {
            'value': _0x4f6460,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x140f9c && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x4f6460, _0x140f9c) : _0x4f6460.__proto__ = _0x140f9c);
      }
      _0xa42857.__esModule = !0x0;
      var _0x4c4508 = _0x217175("./utils/dom"),
        _0x50f399 = _0x280ab5(_0x4c4508),
        _0x5693d5 = _0x217175('./utils/fn'),
        _0x502f4b = _0x280ab5(_0x5693d5),
        _0x41a623 = _0x217175("./utils/log"),
        _0x403054 = (_0x3e61a0(_0x41a623), _0x217175("./component")),
        _0xd45415 = _0x3e61a0(_0x403054),
        _0x3e4a2e = _0x217175('./close-button'),
        _0x1ac82f = (_0x3e61a0(_0x3e4a2e), "vjs-modal-dialog"),
        _0x476460 = function (_0x2a05da) {
          function _0x10b3fd(_0x3fc085, _0x12be64) {
            _0x3ba058(this, _0x10b3fd), _0x2a05da.call(this, _0x3fc085, _0x12be64), this.opened_ = this.hasBeenOpened_ = this.hasBeenFilled_ = !0x1, this.closeable(!this.options_.uncloseable), this.content(this.options_.content), this.contentEl_ = _0x50f399.createEl('div', {
              'className': _0x1ac82f + "-content"
            }, {
              'role': "document"
            }), this.descEl_ = _0x50f399.createEl('p', {
              'className': _0x1ac82f + '-description\x20vjs-offscreen',
              'id': this.el().getAttribute('aria-describedby')
            }), _0x50f399.textContent(this.descEl_, this.description()), this.el_.appendChild(this.descEl_), this.el_.appendChild(this.contentEl_);
          }
          return _0x5ae3ad(_0x10b3fd, _0x2a05da), _0x10b3fd.prototype.createEl = function () {
            return _0x2a05da.prototype.createEl.call(this, 'div', {
              'className': this.buildCSSClass(),
              'tabIndex': -0x1
            }, {
              'aria-describedby': this.id() + "_description",
              'aria-hidden': "true",
              'aria-label': this.label(),
              'role': 'dialog'
            });
          }, _0x10b3fd.prototype.buildCSSClass = function () {
            return _0x1ac82f + '\x20vjs-hidden\x20' + _0x2a05da.prototype.buildCSSClass.call(this);
          }, _0x10b3fd.prototype.handleKeyPress = function (_0x44b0de) {
            _0x44b0de.which === 0x1b && this.closeable() && this.close();
          }, _0x10b3fd.prototype.label = function () {
            return this.options_.label || this.localize('Modal\x20Window');
          }, _0x10b3fd.prototype.description = function () {
            var _0x518c87 = this.options_.description || this.localize("This is a modal window.");
            return this.closeable() && (_0x518c87 += '\x20' + this.localize("This modal can be closed by pressing the Escape key or activating the close button.")), _0x518c87;
          }, _0x10b3fd.prototype.open = function () {
            if (!this.opened_) {
              var _0xf377d = this.player();
              this.trigger("beforemodalopen"), this.opened_ = !0x0, (this.options_.fillAlways || !this.hasBeenOpened_ && !this.hasBeenFilled_) && this.fill(), this.wasPlaying_ = !_0xf377d.paused(), this.wasPlaying_ && _0xf377d.pause(), this.closeable() && this.on(this.el_.ownerDocument, "keydown", _0x502f4b.bind(this, this.handleKeyPress)), _0xf377d.controls(!0x1), this.show(), this.el().setAttribute("aria-hidden", "false"), this.trigger("modalopen"), this.hasBeenOpened_ = !0x0;
            }
            return this;
          }, _0x10b3fd.prototype.opened = function (_0x28dde5) {
            return "boolean" == typeof _0x28dde5 && this[_0x28dde5 ? "open" : "close"](), this.opened_;
          }, _0x10b3fd.prototype.close = function () {
            if (this.opened_) {
              var _0x83523c = this.player();
              this.trigger("beforemodalclose"), this.opened_ = !0x1, this.wasPlaying_ && _0x83523c.play(), this.closeable() && this.off(this.el_.ownerDocument, "keydown", _0x502f4b.bind(this, this.handleKeyPress)), _0x83523c.controls(!0x0), this.hide(), this.el().setAttribute("aria-hidden", 'true'), this.trigger('modalclose'), this.options_.temporary && this.dispose();
            }
            return this;
          }, _0x10b3fd.prototype.closeable = function _0x1251c9(_0x502e7d) {
            if ("boolean" == typeof _0x502e7d) {
              var _0x43e7b9 = this.closeable_ = !!_0x502e7d,
                _0x5a6257 = this.getChild("closeButton");
              if (_0x43e7b9 && !_0x5a6257) {
                this.contentEl_ = this.el_, _0x5a6257 = this.addChild('closeButton'), this.contentEl_ = this.contentEl_, this.on(_0x5a6257, "close", this.close);
              }
              !_0x43e7b9 && _0x5a6257 && (this.off(_0x5a6257, "close", this.close), this.removeChild(_0x5a6257), _0x5a6257.dispose());
            }
            return this.closeable_;
          }, _0x10b3fd.prototype.fill = function () {
            return this.fillWith(this.content());
          }, _0x10b3fd.prototype.fillWith = function (_0x404ed5) {
            var _0x172464 = this.contentEl(),
              _0x4b6515 = _0x172464.parentNode,
              _0x330c88 = _0x172464.nextSibling;
            return this.trigger('beforemodalfill'), this.hasBeenFilled_ = !0x0, _0x4b6515.removeChild(_0x172464), this.empty(), _0x50f399.insertContent(_0x172464, _0x404ed5), this.trigger("modalfill"), _0x330c88 ? _0x4b6515.insertBefore(_0x172464, _0x330c88) : _0x4b6515.appendChild(_0x172464), this;
          }, _0x10b3fd.prototype.empty = function () {
            return this.trigger("beforemodalempty"), _0x50f399.emptyEl(this.contentEl()), this.trigger('modalempty'), this;
          }, _0x10b3fd.prototype.content = function (_0x175d9a) {
            return 'undefined' != typeof _0x175d9a && (this.content_ = _0x175d9a), this.content_;
          }, _0x10b3fd;
        }(_0xd45415["default"]);
      _0x476460.prototype.options_ = {
        'temporary': !0x0
      }, _0xd45415["default"].registerComponent("ModalDialog", _0x476460), _0xa42857["default"] = _0x476460, _0x325a38.exports = _0xa42857["default"];
    }, {
      './close-button': 0x42,
      './component': 0x43,
      './utils/dom': 0x8f,
      './utils/fn': 0x91,
      './utils/log': 0x94
    }],
    0x71: [function (_0x5c1093, _0x2a0958, _0x55894a) {
      'use strict';

      function _0x5453e4(_0x3e087c) {
        if (_0x3e087c && _0x3e087c.__esModule) return _0x3e087c;
        var _0x3edc98 = {};
        if (null != _0x3e087c) {
          for (var _0x51c4d0 in _0x3e087c) Object.prototype.hasOwnProperty.call(_0x3e087c, _0x51c4d0) && (_0x3edc98[_0x51c4d0] = _0x3e087c[_0x51c4d0]);
        }
        return _0x3edc98["default"] = _0x3e087c, _0x3edc98;
      }
      function _0x1e6486(_0x45a3e8) {
        return _0x45a3e8 && _0x45a3e8.__esModule ? _0x45a3e8 : {
          'default': _0x45a3e8
        };
      }
      function _0x172a24(_0x33c2d7, _0x33abe5) {
        if (!(_0x33c2d7 instanceof _0x33abe5)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x32834e(_0x95e195, _0xf0780a) {
        if ("function" != typeof _0xf0780a && null !== _0xf0780a) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0xf0780a);
        _0x95e195.prototype = Object.create(_0xf0780a && _0xf0780a.prototype, {
          'constructor': {
            'value': _0x95e195,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0xf0780a && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x95e195, _0xf0780a) : _0x95e195.__proto__ = _0xf0780a);
      }
      _0x55894a.__esModule = !0x0;
      var _0x385825 = _0x5c1093('./component.js'),
        _0x2da877 = _0x1e6486(_0x385825),
        _0x4561b0 = _0x5c1093("global/document"),
        _0x5e1495 = _0x1e6486(_0x4561b0),
        _0x4e0f90 = _0x5c1093("global/window"),
        _0x181550 = _0x1e6486(_0x4e0f90),
        _0x349f50 = _0x5c1093('./utils/events.js'),
        _0xdfc1ea = _0x5453e4(_0x349f50),
        _0xe66df5 = _0x5c1093("./utils/dom.js"),
        _0x12b382 = _0x5453e4(_0xe66df5),
        _0x143f70 = _0x5c1093('./utils/fn.js'),
        _0x10cdcc = _0x5453e4(_0x143f70),
        _0x4aa9d8 = _0x5c1093('./utils/guid.js'),
        _0x5e3bcb = _0x5453e4(_0x4aa9d8),
        _0x583fc0 = _0x5c1093('./utils/browser.js'),
        _0x50c1ab = _0x5453e4(_0x583fc0),
        _0x2093b7 = _0x5c1093("./utils/log.js"),
        _0x38170e = _0x1e6486(_0x2093b7),
        _0x47df58 = _0x5c1093("./utils/to-title-case.js"),
        _0x56638c = _0x1e6486(_0x47df58),
        _0x1641b1 = _0x5c1093("./utils/time-ranges.js"),
        _0x12ba62 = _0x5c1093("./utils/buffer.js"),
        _0x572661 = _0x5c1093('./utils/stylesheet.js'),
        _0xb82dbf = _0x5453e4(_0x572661),
        _0x2d6074 = _0x5c1093('./fullscreen-api.js'),
        _0x551bf2 = _0x1e6486(_0x2d6074),
        _0x53f9e6 = _0x5c1093("./media-error.js"),
        _0x35383d = _0x1e6486(_0x53f9e6),
        _0x1ae08e = _0x5c1093("safe-json-parse/tuple"),
        _0x2d0235 = _0x1e6486(_0x1ae08e),
        _0x24b3e0 = _0x5c1093("object.assign"),
        _0x1c7882 = _0x1e6486(_0x24b3e0),
        _0x3dbdac = _0x5c1093("./utils/merge-options.js"),
        _0x3ec7a9 = _0x1e6486(_0x3dbdac),
        _0x1b56e0 = _0x5c1093('./tracks/text-track-list-converter.js'),
        _0x3fc2e6 = _0x1e6486(_0x1b56e0),
        _0x423205 = _0x5c1093("./tracks/audio-track-list.js"),
        _0x4aac40 = _0x1e6486(_0x423205),
        _0x32efb6 = _0x5c1093("./tracks/video-track-list.js"),
        _0x3f2567 = _0x1e6486(_0x32efb6),
        _0x500e5d = _0x5c1093("./tech/loader.js"),
        _0x130e02 = (_0x1e6486(_0x500e5d), _0x5c1093('./poster-image.js')),
        _0x5ce907 = (_0x1e6486(_0x130e02), _0x5c1093('./tracks/text-track-display.js')),
        _0x545b2a = (_0x1e6486(_0x5ce907), _0x5c1093('./loading-spinner.js')),
        _0x167b2e = (_0x1e6486(_0x545b2a), _0x5c1093("./big-play-button.js")),
        _0x897ea0 = (_0x1e6486(_0x167b2e), _0x5c1093("./control-bar/control-bar.js")),
        _0x868aac = (_0x1e6486(_0x897ea0), _0x5c1093("./error-display.js")),
        _0xd4c7ac = (_0x1e6486(_0x868aac), _0x5c1093('./tracks/text-track-settings.js')),
        _0x413e10 = (_0x1e6486(_0xd4c7ac), _0x5c1093('./modal-dialog')),
        _0x2017ba = _0x1e6486(_0x413e10),
        _0xb9e0d2 = _0x5c1093('./tech/tech.js'),
        _0x1573c2 = _0x1e6486(_0xb9e0d2),
        _0x35aac0 = _0x5c1093('./tech/html5.js'),
        _0x6bcfde = (_0x1e6486(_0x35aac0), function (_0x3ccbc7) {
          function _0x28cdb0(_0x3cd5d0, _0x1ea0ac, _0x2e0a42) {
            if (_0x172a24(this, _0x28cdb0), _0x3cd5d0.id = _0x3cd5d0.id || "vjs_video_" + _0x5e3bcb.newGUID(), _0x1ea0ac = _0x1c7882['default'](_0x28cdb0.getTagSettings(_0x3cd5d0), _0x1ea0ac), _0x1ea0ac.initChildren = !0x1, _0x1ea0ac.createEl = !0x1, _0x1ea0ac.reportTouchActivity = !0x1, _0x3ccbc7.call(this, null, _0x1ea0ac, _0x2e0a42), !this.options_ || !this.options_.techOrder || !this.options_.techOrder.length) throw new Error('No\x20techOrder\x20specified.\x20Did\x20you\x20overwrite\x20videojs.options\x20instead\x20of\x20just\x20changing\x20the\x20properties\x20you\x20want\x20to\x20override?');
            this.tag = _0x3cd5d0, this.tagAttributes = _0x3cd5d0 && _0x12b382.getElAttributes(_0x3cd5d0), this.language(this.options_.language), _0x1ea0ac.languages ? !function () {
              var _0x43be0e = {};
              Object.getOwnPropertyNames(_0x1ea0ac.languages).forEach(function (_0x52e71a) {
                _0x43be0e[_0x52e71a.toLowerCase()] = _0x1ea0ac.languages[_0x52e71a];
              }), this.languages_ = _0x43be0e;
            }() : this.languages_ = _0x28cdb0.prototype.options_.languages, this.cache_ = {}, this.poster_ = _0x1ea0ac.poster || '', this.controls_ = !!_0x1ea0ac.controls, _0x3cd5d0.controls = !0x1, this.scrubbing_ = !0x1, this.el_ = this.createEl();
            var _0x2af804 = _0x3ec7a9["default"](this.options_);
            _0x1ea0ac.plugins && !function () {
              var _0x5699ea = _0x1ea0ac.plugins;
              Object.getOwnPropertyNames(_0x5699ea).forEach(function (_0x3e6c65) {
                "function" == typeof this[_0x3e6c65] ? this[_0x3e6c65](_0x5699ea[_0x3e6c65]) : _0x38170e["default"].error('Unable\x20to\x20find\x20plugin:', _0x3e6c65);
              }, this);
            }(), this.options_.playerOptions = _0x2af804, this.initChildren(), this.isAudio("audio" === _0x3cd5d0.nodeName.toLowerCase()), this.addClass(this.controls() ? "vjs-controls-enabled" : "vjs-controls-disabled"), this.el_.setAttribute("role", "region"), this.isAudio() ? this.el_.setAttribute("aria-label", 'audio\x20player') : this.el_.setAttribute('aria-label', "video player"), this.isAudio() && this.addClass("vjs-audio"), this.flexNotSupported_() && this.addClass('vjs-no-flex'), _0x50c1ab.IS_IOS || this.addClass("vjs-workinghover"), _0x28cdb0.players[this.id_] = this, this.userActive(!0x0), this.reportUserActivity(), this.listenForUserActivity_(), this.on('fullscreenchange', this.handleFullscreenChange_), this.on("stageclick", this.handleStageClick_);
          }
          return _0x32834e(_0x28cdb0, _0x3ccbc7), _0x28cdb0.prototype.dispose = function () {
            this.trigger('dispose'), this.off('dispose'), this.styleEl_ && this.styleEl_.parentNode && this.styleEl_.parentNode.removeChild(this.styleEl_), _0x28cdb0.players[this.id_] = null, this.tag && this.tag.player && (this.tag.player = null), this.el_ && this.el_.player && (this.el_.player = null), this.tech_ && this.tech_.dispose(), _0x3ccbc7.prototype.dispose.call(this);
          }, _0x28cdb0.prototype.createEl = function () {
            var _0x4f634b = this.el_ = _0x3ccbc7.prototype.createEl.call(this, "div");
            this.tag.removeAttribute("width"), this.tag.removeAttribute("height");
            var _0x425042 = _0x12b382.getElAttributes(this.tag);
            if (Object.getOwnPropertyNames(_0x425042).forEach(function (_0x4b2829) {
              'class' === _0x4b2829 ? _0x4f634b.className = _0x425042[_0x4b2829] : _0x4f634b.setAttribute(_0x4b2829, _0x425042[_0x4b2829]);
            }), this.tag.playerId = this.tag.id, this.tag.id += '_html5_api', this.tag.className = 'vjs-tech', this.tag.player = _0x4f634b.player = this, this.addClass("vjs-paused"), _0x181550['default'].VIDEOJS_NO_DYNAMIC_STYLE !== !0x0) {
              this.styleEl_ = _0xb82dbf.createStyleElement("vjs-styles-dimensions");
              var _0x17adcd = _0x12b382.$(".vjs-styles-defaults"),
                _0x5e9be3 = _0x12b382.$("head");
              _0x5e9be3.insertBefore(this.styleEl_, _0x17adcd ? _0x17adcd.nextSibling : _0x5e9be3.firstChild);
            }
            this.width(this.options_.width), this.height(this.options_.height), this.fluid(this.options_.fluid), this.aspectRatio(this.options_.aspectRatio);
            for (var _0x215bae = this.tag.getElementsByTagName('a'), _0x30befa = 0x0; 0x0 < _0x215bae.length; _0x30befa++) {
              var _0x3ee32b = _0x215bae.item(_0x30befa);
              _0x12b382.addElClass(_0x3ee32b, "vjs-hidden"), _0x3ee32b.setAttribute("hidden", "hidden");
            }
            return this.tag.initNetworkState_ = this.tag.networkState, this.tag.parentNode && this.tag.parentNode.insertBefore(_0x4f634b, this.tag), _0x12b382.insertElFirst(this.tag, _0x4f634b), this.children_.unshift(this.tag), this.el_ = _0x4f634b, _0x4f634b;
          }, _0x28cdb0.prototype.width = function (_0x56ba16) {
            return this.dimension('width', _0x56ba16);
          }, _0x28cdb0.prototype.height = function (_0xb351e2) {
            return this.dimension("height", _0xb351e2);
          }, _0x28cdb0.prototype.dimension = function (_0x1e1824, _0x16cc32) {
            var _0x13d8a6 = _0x1e1824 + '_';
            if (void 0x0 === _0x16cc32) return this[_0x13d8a6] || 0x0;
            if ('' === _0x16cc32) this[_0x13d8a6] = void 0x0;else {
              var _0x3c410d = parseFloat(_0x16cc32);
              if (isNaN(_0x3c410d)) return _0x38170e["default"].error("Improper value \"" + _0x16cc32 + "\" supplied for for " + _0x1e1824), this;
              this[_0x13d8a6] = _0x3c410d;
            }
            return this.updateStyleEl_(), this;
          }, _0x28cdb0.prototype.fluid = function (_0x4b54bb) {
            return void 0x0 === _0x4b54bb ? !!this.fluid_ : (this.fluid_ = !!_0x4b54bb, void (_0x4b54bb ? this.addClass('vjs-fluid') : this.removeClass("vjs-fluid")));
          }, _0x28cdb0.prototype.aspectRatio = function (_0x235740) {
            if (void 0x0 === _0x235740) return this.aspectRatio_;
            if (!/^\d+\:\d+$/.test(_0x235740)) throw new Error('Improper\x20value\x20supplied\x20for\x20aspect\x20ratio.\x20The\x20format\x20should\x20be\x20width:height,\x20for\x20example\x2016:9.');
            this.aspectRatio_ = _0x235740, this.fluid(!0x0), this.updateStyleEl_();
          }, _0x28cdb0.prototype.updateStyleEl_ = function () {
            if (_0x181550["default"].VIDEOJS_NO_DYNAMIC_STYLE === !0x0) {
              var _0x17cd14 = "number" == typeof this.width_ ? this.width_ : this.options_.width,
                _0x1eee55 = 'number' == typeof this.height_ ? this.height_ : this.options_.height,
                _0x2c5069 = this.tech_ && this.tech_.el();
              return void (_0x2c5069 && (_0x17cd14 >= 0x0 && (_0x2c5069.width = _0x17cd14), _0x1eee55 >= 0x0 && (_0x2c5069.height = _0x1eee55)));
            }
            var _0x5d903f = void 0x0,
              _0x506b37 = void 0x0,
              _0x45f0e5 = void 0x0,
              _0x3acd98 = void 0x0;
            _0x45f0e5 = void 0x0 !== this.aspectRatio_ && "auto" !== this.aspectRatio_ ? this.aspectRatio_ : this.videoWidth() ? this.videoWidth() + ':' + this.videoHeight() : "16:9";
            var _0xaab11 = _0x45f0e5.split(':'),
              _0x18bad5 = _0xaab11[0x1] / _0xaab11[0x0];
            _0x5d903f = void 0x0 !== this.width_ ? this.width_ : void 0x0 !== this.height_ ? this.height_ / _0x18bad5 : this.videoWidth() || 0x12c, _0x506b37 = void 0x0 !== this.height_ ? this.height_ : _0x5d903f * _0x18bad5, _0x3acd98 = /^[^a-zA-Z]/.test(this.id()) ? "dimensions-" + this.id() : this.id() + '-dimensions', this.addClass(_0x3acd98), _0xb82dbf.setTextContent(this.styleEl_, "\n      ." + _0x3acd98 + " {\n        width: " + _0x5d903f + 'px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20height:\x20' + _0x506b37 + "px;\n      }\n\n      ." + _0x3acd98 + ".vjs-fluid {\n        padding-top: " + 0x64 * _0x18bad5 + "%;\n      }\n    ");
          }, _0x28cdb0.prototype.loadTech_ = function (_0xb7fa96, _0x1ab247) {
            this.tech_ && this.unloadTech_(), "Html5" !== _0xb7fa96 && this.tag && (_0x1573c2["default"].getTech("Html5").disposeMediaElement(this.tag), this.tag.player = null, this.tag = null), this.techName_ = _0xb7fa96, this.isReady_ = !0x1;
            var _0x5ee24a = _0x1c7882["default"]({
              'nativeControlsForTouch': this.options_.nativeControlsForTouch,
              'source': _0x1ab247,
              'playerId': this.id(),
              'techId': this.id() + '_' + _0xb7fa96 + "_api",
              'videoTracks': this.videoTracks_,
              'textTracks': this.textTracks_,
              'audioTracks': this.audioTracks_,
              'autoplay': this.options_.autoplay,
              'preload': this.options_.preload,
              'loop': this.options_.loop,
              'muted': this.options_.muted,
              'poster': this.poster(),
              'language': this.language(),
              'vtt.js': this.options_['vtt.js']
            }, this.options_[_0xb7fa96.toLowerCase()]);
            this.tag && (_0x5ee24a.tag = this.tag), _0x1ab247 && (this.currentType_ = _0x1ab247.type, _0x1ab247.src === this.cache_.src && this.cache_.currentTime > 0x0 && (_0x5ee24a.startTime = this.cache_.currentTime), this.cache_.src = _0x1ab247.src);
            var _0x168b47 = _0x1573c2['default'].getTech(_0xb7fa96);
            _0x168b47 || (_0x168b47 = _0x2da877['default'].getComponent(_0xb7fa96)), this.tech_ = new _0x168b47(_0x5ee24a), this.tech_.ready(_0x10cdcc.bind(this, this.handleTechReady_), !0x0), _0x3fc2e6['default'].jsonToTextTracks(this.textTracksJson_ || [], this.tech_), this.on(this.tech_, "loadstart", this.handleTechLoadStart_), this.on(this.tech_, 'waiting', this.handleTechWaiting_), this.on(this.tech_, 'canplay', this.handleTechCanPlay_), this.on(this.tech_, "canplaythrough", this.handleTechCanPlayThrough_), this.on(this.tech_, "playing", this.handleTechPlaying_), this.on(this.tech_, 'ended', this.handleTechEnded_), this.on(this.tech_, "seeking", this.handleTechSeeking_), this.on(this.tech_, "seeked", this.handleTechSeeked_), this.on(this.tech_, "play", this.handleTechPlay_), this.on(this.tech_, 'firstplay', this.handleTechFirstPlay_), this.on(this.tech_, "pause", this.handleTechPause_), this.on(this.tech_, "progress", this.handleTechProgress_), this.on(this.tech_, "durationchange", this.handleTechDurationChange_), this.on(this.tech_, "fullscreenchange", this.handleTechFullscreenChange_), this.on(this.tech_, "error", this.handleTechError_), this.on(this.tech_, "suspend", this.handleTechSuspend_), this.on(this.tech_, "abort", this.handleTechAbort_), this.on(this.tech_, "emptied", this.handleTechEmptied_), this.on(this.tech_, "stalled", this.handleTechStalled_), this.on(this.tech_, "loadedmetadata", this.handleTechLoadedMetaData_), this.on(this.tech_, "loadeddata", this.handleTechLoadedData_), this.on(this.tech_, "timeupdate", this.handleTechTimeUpdate_), this.on(this.tech_, "ratechange", this.handleTechRateChange_), this.on(this.tech_, "volumechange", this.handleTechVolumeChange_), this.on(this.tech_, "texttrackchange", this.handleTechTextTrackChange_), this.on(this.tech_, "loadedmetadata", this.updateStyleEl_), this.on(this.tech_, "posterchange", this.handleTechPosterChange_), this.usingNativeControls(this.techGet_('controls')), this.controls() && !this.usingNativeControls() && this.addTechControlsListeners_(), this.tech_.el().parentNode === this.el() || "Html5" === _0xb7fa96 && this.tag || _0x12b382.insertElFirst(this.tech_.el(), this.el()), this.tag && (this.tag.player = null, this.tag = null);
          }, _0x28cdb0.prototype.unloadTech_ = function () {
            this.videoTracks_ = this.videoTracks(), this.textTracks_ = this.textTracks(), this.audioTracks_ = this.audioTracks(), this.textTracksJson_ = _0x3fc2e6["default"].textTracksToJson(this.tech_), this.isReady_ = !0x1, this.tech_.dispose(), this.tech_ = !0x1;
          }, _0x28cdb0.prototype.tech = function (_0x214ac6) {
            if (_0x214ac6 && _0x214ac6.IWillNotUseThisInPlugins) return this.tech_;
            var _0x15111a = "\n      Please make sure that you are not using this inside of a plugin.\n      To disable this alert and error, please pass in an object with\n      `IWillNotUseThisInPlugins` to the `tech` method. See\n      https://github.com/videojs/video.js/issues/2617 for more info.\n    ";
            throw _0x181550["default"].alert(_0x15111a), new Error(_0x15111a);
          }, _0x28cdb0.prototype.addTechControlsListeners_ = function () {
            this.removeTechControlsListeners_(), this.on(this.tech_, "mousedown", this.handleTechClick_), this.on(this.tech_, "touchstart", this.handleTechTouchStart_), this.on(this.tech_, "touchmove", this.handleTechTouchMove_), this.on(this.tech_, 'touchend', this.handleTechTouchEnd_), this.on(this.tech_, "tap", this.handleTechTap_);
          }, _0x28cdb0.prototype.removeTechControlsListeners_ = function () {
            this.off(this.tech_, "tap", this.handleTechTap_), this.off(this.tech_, "touchstart", this.handleTechTouchStart_), this.off(this.tech_, 'touchmove', this.handleTechTouchMove_), this.off(this.tech_, "touchend", this.handleTechTouchEnd_), this.off(this.tech_, "mousedown", this.handleTechClick_);
          }, _0x28cdb0.prototype.handleTechReady_ = function () {
            if (this.triggerReady(), this.cache_.volume && this.techCall_("setVolume", this.cache_.volume), this.handleTechPosterChange_(), this.handleTechDurationChange_(), this.src() && this.tag && this.options_.autoplay && this.paused()) {
              try {
                delete this.tag.poster;
              } catch (_0x271548) {
                _0x38170e["default"]('deleting\x20tag.poster\x20throws\x20in\x20some\x20browsers', _0x271548);
              }
              this.play();
            }
          }, _0x28cdb0.prototype.handleTechLoadStart_ = function () {
            this.removeClass('vjs-ended'), this.error(null), this.paused() ? (this.hasStarted(!0x1), this.trigger('loadstart')) : (this.trigger('loadstart'), this.trigger("firstplay"));
          }, _0x28cdb0.prototype.hasStarted = function (_0x2374a9) {
            return void 0x0 !== _0x2374a9 ? (this.hasStarted_ !== _0x2374a9 && (this.hasStarted_ = _0x2374a9, _0x2374a9 ? (this.addClass("vjs-has-started"), this.trigger("firstplay")) : this.removeClass("vjs-has-started")), this) : !!this.hasStarted_;
          }, _0x28cdb0.prototype.handleTechPlay_ = function () {
            this.removeClass('vjs-ended'), this.removeClass("vjs-paused"), this.addClass("vjs-playing"), this.hasStarted(!0x0), this.trigger('play');
          }, _0x28cdb0.prototype.handleTechWaiting_ = function () {
            this.addClass("vjs-waiting"), this.trigger("waiting"), this.one('timeupdate', function () {
              return this.removeClass('vjs-waiting');
            });
          }, _0x28cdb0.prototype.handleTechCanPlay_ = function () {
            this.removeClass('vjs-waiting'), this.trigger("canplay");
          }, _0x28cdb0.prototype.handleTechCanPlayThrough_ = function () {
            this.removeClass('vjs-waiting'), this.trigger("canplaythrough");
          }, _0x28cdb0.prototype.handleTechPlaying_ = function () {
            this.removeClass("vjs-waiting"), this.trigger("playing");
          }, _0x28cdb0.prototype.handleTechSeeking_ = function () {
            this.addClass("vjs-seeking"), this.trigger("seeking");
          }, _0x28cdb0.prototype.handleTechSeeked_ = function () {
            this.removeClass("vjs-seeking"), this.trigger("seeked");
          }, _0x28cdb0.prototype.handleTechFirstPlay_ = function () {
            this.options_.starttime && this.currentTime(this.options_.starttime), this.addClass("vjs-has-started"), this.trigger("firstplay");
          }, _0x28cdb0.prototype.handleTechPause_ = function () {
            this.removeClass("vjs-playing"), this.addClass("vjs-paused"), this.trigger("pause");
          }, _0x28cdb0.prototype.handleTechProgress_ = function () {
            this.trigger('progress');
          }, _0x28cdb0.prototype.handleTechEnded_ = function () {
            this.addClass("vjs-ended"), this.options_.loop ? (this.currentTime(0x0), this.play()) : this.paused() || this.pause(), this.trigger("ended");
          }, _0x28cdb0.prototype.handleTechDurationChange_ = function () {
            this.duration(this.techGet_("duration"));
          }, _0x28cdb0.prototype.handleTechClick_ = function (_0x459a08) {
            0x0 === _0x459a08.button && this.controls() && (this.paused() ? this.play() : this.pause());
          }, _0x28cdb0.prototype.handleTechTap_ = function () {
            this.userActive(!this.userActive());
          }, _0x28cdb0.prototype.handleTechTouchStart_ = function () {
            this.userWasActive = this.userActive();
          }, _0x28cdb0.prototype.handleTechTouchMove_ = function () {
            this.userWasActive && this.reportUserActivity();
          }, _0x28cdb0.prototype.handleTechTouchEnd_ = function (_0x38c756) {
            _0x38c756.preventDefault();
          }, _0x28cdb0.prototype.handleFullscreenChange_ = function () {
            this.isFullscreen() ? this.addClass("vjs-fullscreen") : this.removeClass("vjs-fullscreen");
          }, _0x28cdb0.prototype.handleStageClick_ = function () {
            this.reportUserActivity();
          }, _0x28cdb0.prototype.handleTechFullscreenChange_ = function (_0xe99436, _0x1d3d36) {
            _0x1d3d36 && this.isFullscreen(_0x1d3d36.isFullscreen), this.trigger("fullscreenchange");
          }, _0x28cdb0.prototype.handleTechError_ = function () {
            var _0x5984fc = this.tech_.error();
            this.error(_0x5984fc && _0x5984fc.code);
          }, _0x28cdb0.prototype.handleTechSuspend_ = function () {
            this.trigger('suspend');
          }, _0x28cdb0.prototype.handleTechAbort_ = function () {
            this.trigger('abort');
          }, _0x28cdb0.prototype.handleTechEmptied_ = function () {
            this.trigger("emptied");
          }, _0x28cdb0.prototype.handleTechStalled_ = function () {
            this.trigger("stalled");
          }, _0x28cdb0.prototype.handleTechLoadedMetaData_ = function () {
            this.trigger("loadedmetadata");
          }, _0x28cdb0.prototype.handleTechLoadedData_ = function () {
            this.trigger('loadeddata');
          }, _0x28cdb0.prototype.handleTechTimeUpdate_ = function () {
            this.trigger('timeupdate');
          }, _0x28cdb0.prototype.handleTechRateChange_ = function () {
            this.trigger("ratechange");
          }, _0x28cdb0.prototype.handleTechVolumeChange_ = function () {
            this.trigger('volumechange');
          }, _0x28cdb0.prototype.handleTechTextTrackChange_ = function () {
            this.trigger('texttrackchange');
          }, _0x28cdb0.prototype.getCache = function () {
            return this.cache_;
          }, _0x28cdb0.prototype.techCall_ = function (_0x42befa, _0x3b792e) {
            if (this.tech_ && !this.tech_.isReady_) this.tech_.ready(function () {
              this[_0x42befa](_0x3b792e);
            }, !0x0);else try {
              this.tech_[_0x42befa](_0x3b792e);
            } catch (_0x4fb031) {
              throw _0x38170e["default"](_0x4fb031), _0x4fb031;
            }
          }, _0x28cdb0.prototype.techGet_ = function (_0x59c8de) {
            if (this.tech_ && this.tech_.isReady_) try {
              return this.tech_[_0x59c8de]();
            } catch (_0x53f3f9) {
              throw void 0x0 === this.tech_[_0x59c8de] ? _0x38170e['default']('Video.js:\x20' + _0x59c8de + '\x20method\x20not\x20defined\x20for\x20' + this.techName_ + " playback technology.", _0x53f3f9) : "TypeError" === _0x53f3f9.name ? (_0x38170e['default']("Video.js: " + _0x59c8de + " unavailable on " + this.techName_ + " playback technology element.", _0x53f3f9), this.tech_.isReady_ = !0x1) : _0x38170e["default"](_0x53f3f9), _0x53f3f9;
            }
          }, _0x28cdb0.prototype.play = function () {
            return this.techCall_("play"), this;
          }, _0x28cdb0.prototype.pause = function () {
            return this.techCall_("pause"), this;
          }, _0x28cdb0.prototype.paused = function () {
            return this.techGet_('paused') === !0x1 ? !0x1 : !0x0;
          }, _0x28cdb0.prototype.scrubbing = function (_0x3e7b9d) {
            return void 0x0 !== _0x3e7b9d ? (this.scrubbing_ = !!_0x3e7b9d, _0x3e7b9d ? this.addClass("vjs-scrubbing") : this.removeClass("vjs-scrubbing"), this) : this.scrubbing_;
          }, _0x28cdb0.prototype.currentTime = function (_0x5124b1) {
            return void 0x0 !== _0x5124b1 ? (this.techCall_("setCurrentTime", _0x5124b1), this) : this.cache_.currentTime = this.techGet_("currentTime") || 0x0;
          }, _0x28cdb0.prototype.duration = function (_0x2b6a1f) {
            return void 0x0 === _0x2b6a1f ? this.cache_.duration || 0x0 : (_0x2b6a1f = parseFloat(_0x2b6a1f) || 0x0, 0x0 > _0x2b6a1f && (_0x2b6a1f = 0x1 / 0x0), _0x2b6a1f !== this.cache_.duration && (this.cache_.duration = _0x2b6a1f, _0x2b6a1f === 0x1 / 0x0 ? this.addClass("vjs-live") : this.removeClass("vjs-live"), this.trigger('durationchange')), this);
          }, _0x28cdb0.prototype.remainingTime = function () {
            return this.duration() - this.currentTime();
          }, _0x28cdb0.prototype.buffered = function _0x317b9b() {
            var _0x514405 = this.techGet_("buffered");
            return _0x514405 && _0x514405.length || (_0x514405 = _0x1641b1.createTimeRange(0x0, 0x0)), _0x514405;
          }, _0x28cdb0.prototype.bufferedPercent = function () {
            return _0x12ba62.bufferedPercent(this.buffered(), this.duration());
          }, _0x28cdb0.prototype.bufferedEnd = function () {
            var _0x53b2fc = this.buffered(),
              _0x3277a7 = this.duration(),
              _0x2064e0 = _0x53b2fc.end(_0x53b2fc.length - 0x1);
            return _0x2064e0 > _0x3277a7 && (_0x2064e0 = _0x3277a7), _0x2064e0;
          }, _0x28cdb0.prototype.volume = function (_0x55b5ec) {
            var _0x328af3 = void 0x0;
            return void 0x0 !== _0x55b5ec ? (_0x328af3 = Math.max(0x0, Math.min(0x1, parseFloat(_0x55b5ec))), this.cache_.volume = _0x328af3, this.techCall_("setVolume", _0x328af3), this) : (_0x328af3 = parseFloat(this.techGet_("volume")), isNaN(_0x328af3) ? 0x1 : _0x328af3);
          }, _0x28cdb0.prototype.muted = function (_0x4face6) {
            return void 0x0 !== _0x4face6 ? (this.techCall_('setMuted', _0x4face6), this) : this.techGet_("muted") || !0x1;
          }, _0x28cdb0.prototype.supportsFullScreen = function () {
            return this.techGet_("supportsFullScreen") || !0x1;
          }, _0x28cdb0.prototype.isFullscreen = function (_0x3fe4d0) {
            return void 0x0 !== _0x3fe4d0 ? (this.isFullscreen_ = !!_0x3fe4d0, this) : !!this.isFullscreen_;
          }, _0x28cdb0.prototype.requestFullscreen = function () {
            var _0x5adeb6 = _0x551bf2["default"];
            return this.isFullscreen(!0x0), _0x5adeb6.requestFullscreen ? (_0xdfc1ea.on(_0x5e1495['default'], _0x5adeb6.fullscreenchange, _0x10cdcc.bind(this, function _0x3960c3() {
              this.isFullscreen(_0x5e1495["default"][_0x5adeb6.fullscreenElement]), this.isFullscreen() === !0x1 && _0xdfc1ea.off(_0x5e1495['default'], _0x5adeb6.fullscreenchange, _0x3960c3), this.trigger("fullscreenchange");
            })), this.el_[_0x5adeb6.requestFullscreen]()) : this.tech_.supportsFullScreen() ? this.techCall_("enterFullScreen") : (this.enterFullWindow(), this.trigger("fullscreenchange")), this;
          }, _0x28cdb0.prototype.exitFullscreen = function () {
            var _0x5bc4ca = _0x551bf2["default"];
            return this.isFullscreen(!0x1), _0x5bc4ca.requestFullscreen ? _0x5e1495['default'][_0x5bc4ca.exitFullscreen]() : this.tech_.supportsFullScreen() ? this.techCall_("exitFullScreen") : (this.exitFullWindow(), this.trigger("fullscreenchange")), this;
          }, _0x28cdb0.prototype.enterFullWindow = function () {
            this.isFullWindow = !0x0, this.docOrigOverflow = _0x5e1495["default"].documentElement.style.overflow, _0xdfc1ea.on(_0x5e1495['default'], "keydown", _0x10cdcc.bind(this, this.fullWindowOnEscKey)), _0x5e1495["default"].documentElement.style.overflow = "hidden", _0x12b382.addElClass(_0x5e1495["default"].body, "vjs-full-window"), this.trigger("enterFullWindow");
          }, _0x28cdb0.prototype.fullWindowOnEscKey = function (_0x3aaac7) {
            0x1b === _0x3aaac7.keyCode && (this.isFullscreen() === !0x0 ? this.exitFullscreen() : this.exitFullWindow());
          }, _0x28cdb0.prototype.exitFullWindow = function () {
            this.isFullWindow = !0x1, _0xdfc1ea.off(_0x5e1495["default"], "keydown", this.fullWindowOnEscKey), _0x5e1495['default'].documentElement.style.overflow = this.docOrigOverflow, _0x12b382.removeElClass(_0x5e1495['default'].body, "vjs-full-window"), this.trigger('exitFullWindow');
          }, _0x28cdb0.prototype.canPlayType = function (_0x2df174) {
            for (var _0x48d0df = void 0x0, _0x58008c = 0x0, _0x2ab0b1 = this.options_.techOrder; 0x0 < this.options_.techOrder.length; _0x58008c++) {
              var _0x591759 = _0x56638c["default"](this.options_.techOrder[_0x58008c]),
                _0x24bf9d = _0x1573c2["default"].getTech(_0x591759);
              if (_0x24bf9d || (_0x24bf9d = _0x2da877['default'].getComponent(_0x591759)), _0x24bf9d) {
                if (_0x24bf9d.isSupported() && (_0x48d0df = _0x24bf9d.canPlayType(_0x2df174))) return _0x48d0df;
              } else _0x38170e["default"].error("The \"" + _0x591759 + "\" tech is undefined. Skipped browser support check for that tech.");
            }
            return '';
          }, _0x28cdb0.prototype.selectSource = function (_0x54ff48) {
            var _0x55b275 = this.options_.techOrder.map(_0x56638c["default"]).map(function (_0x5daf55) {
                return [_0x5daf55, _0x1573c2['default'].getTech(_0x5daf55) || _0x2da877["default"].getComponent(_0x5daf55)];
              }).filter(function (_0x2fef94) {
                var _0x185942 = _0x2fef94[0x0],
                  _0x1224ca = _0x2fef94[0x1];
                return _0x1224ca ? _0x1224ca.isSupported() : (_0x38170e["default"].error("The \"" + _0x185942 + '\x22\x20tech\x20is\x20undefined.\x20Skipped\x20browser\x20support\x20check\x20for\x20that\x20tech.'), !0x1);
              }),
              _0x4350ab = function (_0x58aca3, _0xf77c19, _0x168b21) {
                var _0x55ab6d = void 0x0;
                return _0x58aca3.some(function (_0x4bcc30) {
                  return _0xf77c19.some(function (_0x151b4b) {
                    return _0x55ab6d = _0x168b21(_0x4bcc30, _0x151b4b), _0x55ab6d ? !0x0 : void 0x0;
                  });
                }), _0x55ab6d;
              },
              _0x488773 = void 0x0,
              _0x50bbe4 = function (_0x1daa57) {
                return function (_0xe580fa, _0x5a1679) {
                  return _0x1daa57(_0x5a1679, _0xe580fa);
                };
              },
              _0x4e475c = function (_0x4ba573, _0x4edd24) {
                var _0x4aa831 = _0x4ba573[0x0],
                  _0x4f1f3f = _0x4ba573[0x1];
                return _0x4f1f3f.canPlaySource(_0x4edd24) ? {
                  'source': _0x4edd24,
                  'tech': _0x4aa831
                } : void 0x0;
              };
            return _0x488773 = this.options_.sourceOrder ? _0x4350ab(_0x54ff48, _0x55b275, _0x50bbe4(_0x4e475c)) : _0x4350ab(_0x55b275, _0x54ff48, _0x4e475c), _0x488773 || !0x1;
          }, _0x28cdb0.prototype.src = function (_0xf5bc47) {
            if (void 0x0 === _0xf5bc47) return this.techGet_("src");
            var _0x22cfc5 = _0x1573c2["default"].getTech(this.techName_);
            return _0x22cfc5 || (_0x22cfc5 = _0x2da877["default"].getComponent(this.techName_)), Array.isArray(_0xf5bc47) ? this.sourceList_(_0xf5bc47) : "string" == typeof _0xf5bc47 ? this.src({
              'src': _0xf5bc47
            }) : _0xf5bc47 instanceof Object && (_0xf5bc47.type && !_0x22cfc5.canPlaySource(_0xf5bc47) ? this.sourceList_([_0xf5bc47]) : (this.cache_.src = _0xf5bc47.src, this.currentType_ = _0xf5bc47.type || '', this.ready(function () {
              _0x22cfc5.prototype.hasOwnProperty("setSource") ? this.techCall_("setSource", _0xf5bc47) : this.techCall_("src", _0xf5bc47.src), "auto" === this.options_.preload && this.load(), this.options_.autoplay && this.play();
            }, !0x0))), this;
          }, _0x28cdb0.prototype.sourceList_ = function (_0x5185d3) {
            var _0x2b37b7 = this.selectSource(_0x5185d3);
            _0x2b37b7 ? _0x2b37b7.tech === this.techName_ ? this.src(_0x2b37b7.source) : this.loadTech_(_0x2b37b7.tech, _0x2b37b7.source) : (this.setTimeout(function () {
              this.error({
                'code': 0x4,
                'message': this.localize(this.options_.notSupportedMessage)
              });
            }, 0x0), this.triggerReady());
          }, _0x28cdb0.prototype.load = function () {
            return this.techCall_("load"), this;
          }, _0x28cdb0.prototype.reset = function () {
            return this.loadTech_(_0x56638c['default'](this.options_.techOrder[0x0]), null), this.techCall_('reset'), this;
          }, _0x28cdb0.prototype.currentSrc = function () {
            return this.techGet_('currentSrc') || this.cache_.src || '';
          }, _0x28cdb0.prototype.currentType = function () {
            return this.currentType_ || '';
          }, _0x28cdb0.prototype.preload = function (_0x5c675e) {
            return void 0x0 !== _0x5c675e ? (this.techCall_("setPreload", _0x5c675e), this.options_.preload = _0x5c675e, this) : this.techGet_("preload");
          }, _0x28cdb0.prototype.autoplay = function (_0x486dc5) {
            return void 0x0 !== _0x486dc5 ? (this.techCall_('setAutoplay', _0x486dc5), this.options_.autoplay = _0x486dc5, this) : this.techGet_('autoplay', _0x486dc5);
          }, _0x28cdb0.prototype.loop = function (_0xe6ea6d) {
            return void 0x0 !== _0xe6ea6d ? (this.techCall_('setLoop', _0xe6ea6d), this.options_.loop = _0xe6ea6d, this) : this.techGet_("loop");
          }, _0x28cdb0.prototype.poster = function (_0x31e3f4) {
            return void 0x0 === _0x31e3f4 ? this.poster_ : (_0x31e3f4 || (_0x31e3f4 = ''), this.poster_ = _0x31e3f4, this.techCall_("setPoster", _0x31e3f4), this.trigger("posterchange"), this);
          }, _0x28cdb0.prototype.handleTechPosterChange_ = function () {
            !this.poster_ && this.tech_ && this.tech_.poster && (this.poster_ = this.tech_.poster() || '', this.trigger('posterchange'));
          }, _0x28cdb0.prototype.controls = function (_0x94bd66) {
            return void 0x0 !== _0x94bd66 ? (_0x94bd66 = !!_0x94bd66, this.controls_ !== _0x94bd66 && (this.controls_ = _0x94bd66, this.usingNativeControls() && this.techCall_('setControls', _0x94bd66), _0x94bd66 ? (this.removeClass("vjs-controls-disabled"), this.addClass("vjs-controls-enabled"), this.trigger("controlsenabled"), this.usingNativeControls() || this.addTechControlsListeners_()) : (this.removeClass("vjs-controls-enabled"), this.addClass("vjs-controls-disabled"), this.trigger("controlsdisabled"), this.usingNativeControls() || this.removeTechControlsListeners_())), this) : !!this.controls_;
          }, _0x28cdb0.prototype.usingNativeControls = function (_0x52dc55) {
            return void 0x0 !== _0x52dc55 ? (_0x52dc55 = !!_0x52dc55, this.usingNativeControls_ !== _0x52dc55 && (this.usingNativeControls_ = _0x52dc55, _0x52dc55 ? (this.addClass("vjs-using-native-controls"), this.trigger("usingnativecontrols")) : (this.removeClass("vjs-using-native-controls"), this.trigger("usingcustomcontrols"))), this) : !!this.usingNativeControls_;
          }, _0x28cdb0.prototype.error = function (_0x517a00) {
            return void 0x0 === _0x517a00 ? this.error_ || null : null === _0x517a00 ? (this.error_ = _0x517a00, this.removeClass('vjs-error'), this.errorDisplay.close(), this) : (this.error_ = _0x517a00 instanceof _0x35383d["default"] ? _0x517a00 : new _0x35383d["default"](_0x517a00), this.addClass("vjs-error"), _0x38170e["default"].error('(CODE:' + this.error_.code + '\x20' + _0x35383d['default'].errorTypes[this.error_.code] + ')', this.error_.message, this.error_), this.trigger("error"), this);
          }, _0x28cdb0.prototype.ended = function () {
            return this.techGet_("ended");
          }, _0x28cdb0.prototype.seeking = function () {
            return this.techGet_("seeking");
          }, _0x28cdb0.prototype.seekable = function () {
            return this.techGet_("seekable");
          }, _0x28cdb0.prototype.reportUserActivity = function () {
            this.userActivity_ = !0x0;
          }, _0x28cdb0.prototype.userActive = function (_0x39f3ce) {
            return void 0x0 !== _0x39f3ce ? (_0x39f3ce = !!_0x39f3ce, _0x39f3ce !== this.userActive_ && (this.userActive_ = _0x39f3ce, _0x39f3ce ? (this.userActivity_ = !0x0, this.removeClass("vjs-user-inactive"), this.addClass("vjs-user-active"), this.trigger("useractive")) : (this.userActivity_ = !0x1, this.tech_ && this.tech_.one("mousemove", function (_0x18d666) {
              _0x18d666.stopPropagation(), _0x18d666.preventDefault();
            }), this.removeClass('vjs-user-active'), this.addClass("vjs-user-inactive"), this.trigger("userinactive"))), this) : this.userActive_;
          }, _0x28cdb0.prototype.listenForUserActivity_ = function () {
            var _0x4ea62f = _0x10cdcc.bind(this, this.reportUserActivity),
              _0x43bd90 = function (_0xe53e6a) {
                (_0xe53e6a.screenX !== void 0x0 || _0xe53e6a.screenY !== void 0x0) && (_0x2b2d6c = _0xe53e6a.screenX, _0x53a2b3 = _0xe53e6a.screenY, _0x4ea62f());
              },
              _0x4ae726 = function () {
                _0x4ea62f(), this.clearInterval(void 0x0), _0x826b37 = this.setInterval(_0x4ea62f, 0xfa);
              },
              _0x5aa9fe = function () {
                _0x4ea62f(), this.clearInterval(_0x826b37);
              };
            this.on('mousedown', _0x4ae726), this.on('mousemove', _0x43bd90), this.on("mouseup", _0x5aa9fe), this.on('keydown', _0x4ea62f), this.on("keyup", _0x4ea62f);
            {
              this.setInterval(function () {
                if (this.userActivity_) {
                  this.userActivity_ = !0x1, this.userActive(!0x0), this.clearTimeout(void 0x0);
                  this.options_.inactivityTimeout > 0x0 && (_0x475a94 = this.setTimeout(function () {
                    this.userActivity_ || this.userActive(!0x1);
                  }, this.options_.inactivityTimeout));
                }
              }, 0xfa);
            }
          }, _0x28cdb0.prototype.playbackRate = function (_0xe5229f) {
            return void 0x0 !== _0xe5229f ? (this.techCall_("setPlaybackRate", _0xe5229f), this) : this.tech_ && this.tech_.featuresPlaybackRate ? this.techGet_("playbackRate") : 0x1;
          }, _0x28cdb0.prototype.isAudio = function (_0x53b9c0) {
            return void 0x0 !== _0x53b9c0 ? (this.isAudio_ = !!_0x53b9c0, this) : !!this.isAudio_;
          }, _0x28cdb0.prototype.networkState = function () {
            return this.techGet_("networkState");
          }, _0x28cdb0.prototype.readyState = function () {
            return this.techGet_("readyState");
          }, _0x28cdb0.prototype.videoTracks = function () {
            return this.tech_ ? this.tech_.videoTracks() : (this.videoTracks_ = this.videoTracks_ || new _0x3f2567["default"](), this.videoTracks_);
          }, _0x28cdb0.prototype.audioTracks = function () {
            return this.tech_ ? this.tech_.audioTracks() : (this.audioTracks_ = this.audioTracks_ || new _0x4aac40["default"](), this.audioTracks_);
          }, _0x28cdb0.prototype.textTracks = function () {
            return this.tech_ && this.tech_.textTracks();
          }, _0x28cdb0.prototype.remoteTextTracks = function () {
            return this.tech_ && this.tech_.remoteTextTracks();
          }, _0x28cdb0.prototype.remoteTextTrackEls = function () {
            return this.tech_ && this.tech_.remoteTextTrackEls();
          }, _0x28cdb0.prototype.addTextTrack = function (_0x3f8b6b, _0x4c8436, _0x31bf29) {
            return this.tech_ && this.tech_.addTextTrack(_0x3f8b6b, _0x4c8436, _0x31bf29);
          }, _0x28cdb0.prototype.addRemoteTextTrack = function (_0x552447) {
            return this.tech_ && this.tech_.addRemoteTextTrack(_0x552447);
          }, _0x28cdb0.prototype.removeRemoteTextTrack = function () {
            var _0x1a9d6b = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0],
              _0x4fcdd7 = _0x1a9d6b.track,
              _0x18b004 = void 0x0 === _0x4fcdd7 ? arguments[0x0] : _0x4fcdd7;
            this.tech_ && this.tech_.removeRemoteTextTrack(_0x18b004);
          }, _0x28cdb0.prototype.videoWidth = function () {
            return this.tech_ && this.tech_.videoWidth && this.tech_.videoWidth() || 0x0;
          }, _0x28cdb0.prototype.videoHeight = function () {
            return this.tech_ && this.tech_.videoHeight && this.tech_.videoHeight() || 0x0;
          }, _0x28cdb0.prototype.language = function (_0x26ee27) {
            return void 0x0 === _0x26ee27 ? this.language_ : (this.language_ = ('' + _0x26ee27).toLowerCase(), this);
          }, _0x28cdb0.prototype.languages = function () {
            return _0x3ec7a9["default"](_0x28cdb0.prototype.options_.languages, this.languages_);
          }, _0x28cdb0.prototype.toJSON = function () {
            var _0x3e738f = _0x3ec7a9["default"](this.options_),
              _0x17174b = _0x3e738f.tracks;
            _0x3e738f.tracks = [];
            for (var _0x1dc959 = 0x0; 0x0 < _0x17174b.length; _0x1dc959++) {
              var _0x101696 = _0x17174b[_0x1dc959];
              _0x101696 = _0x3ec7a9['default'](_0x101696), _0x101696.player = void 0x0, _0x3e738f.tracks[_0x1dc959] = _0x101696;
            }
            return _0x3e738f;
          }, _0x28cdb0.prototype.createModal = function (_0x527b6b, _0x5cbc34) {
            _0x5cbc34 = _0x5cbc34 || {}, _0x5cbc34.content = _0x527b6b || '';
            var _0x148885 = new _0x2017ba['default'](this, _0x5cbc34);
            return this.addChild(_0x148885), _0x148885.on('dispose', function () {
              this.removeChild(_0x148885);
            }), _0x148885.open();
          }, _0x28cdb0.getTagSettings = function (_0x1dbca7) {
            var _0x34b609 = {
                'sources': [],
                'tracks': []
              },
              _0xea2ecd = _0x12b382.getElAttributes(_0x1dbca7),
              _0x328703 = _0xea2ecd["data-setup"];
            if (null !== _0x328703) {
              var _0x2c1af0 = _0x2d0235["default"](_0x328703 || '{}'),
                _0x373f89 = _0x2c1af0[0x0],
                _0x2c378a = _0x2c1af0[0x1];
              _0x373f89 && _0x38170e["default"].error(_0x373f89), _0x1c7882["default"](_0xea2ecd, _0x2c378a);
            }
            if (_0x1c7882["default"](_0x34b609, _0xea2ecd), _0x1dbca7.hasChildNodes()) for (var _0xfbbcdc = _0x1dbca7.childNodes, _0x13bb41 = 0x0, _0xe60435 = _0xfbbcdc.length; _0xe60435 > 0x0; _0x13bb41++) {
              var _0x419673 = _0xfbbcdc[_0x13bb41],
                _0x142110 = _0x419673.nodeName.toLowerCase();
              'source' === _0x142110 ? _0x34b609.sources.push(_0x12b382.getElAttributes(_0x419673)) : "track" === _0x142110 && _0x34b609.tracks.push(_0x12b382.getElAttributes(_0x419673));
            }
            return _0x34b609;
          }, _0x28cdb0;
        }(_0x2da877["default"]));
      _0x6bcfde.players = {};
      var _0xc8fd90 = _0x181550["default"].navigator;
      _0x6bcfde.prototype.options_ = {
        'techOrder': ["html5", "flash"],
        'html5': {},
        'flash': {},
        'defaultVolume': 0x0,
        'inactivityTimeout': 0x7d0,
        'playbackRates': [],
        'children': ["mediaLoader", "posterImage", "textTrackDisplay", "loadingSpinner", "bigPlayButton", "controlBar", "errorDisplay", "textTrackSettings"],
        'language': _0x5e1495["default"].getElementsByTagName("html")[0x0].getAttribute("lang") || _0xc8fd90.languages && _0xc8fd90.languages[0x0] || _0xc8fd90.userLanguage || _0xc8fd90.language || 'en',
        'languages': {},
        'notSupportedMessage': "No compatible source was found for this media."
      }, _0x6bcfde.prototype.flexNotSupported_ = function () {
        var _0x1dad15 = _0x5e1495["default"].createElement('i');
        return !('flexBasis' in _0x1dad15.style || 'webkitFlexBasis' in _0x1dad15.style || "mozFlexBasis" in _0x1dad15.style || 'msFlexBasis' in _0x1dad15.style || "msFlexOrder" in _0x1dad15.style);
      }, _0x2da877["default"].registerComponent("Player", _0x6bcfde), _0x55894a["default"] = _0x6bcfde, _0x2a0958.exports = _0x55894a["default"];
    }, {
      './big-play-button.js': 0x3f,
      './component.js': 0x43,
      './control-bar/control-bar.js': 0x46,
      './error-display.js': 0x67,
      './fullscreen-api.js': 0x6a,
      './loading-spinner.js': 0x6b,
      './media-error.js': 0x6c,
      './modal-dialog': 0x70,
      './poster-image.js': 0x75,
      './tech/html5.js': 0x7a,
      './tech/loader.js': 0x7b,
      './tech/tech.js': 0x7c,
      './tracks/audio-track-list.js': 0x7d,
      './tracks/text-track-display.js': 0x82,
      './tracks/text-track-list-converter.js': 0x83,
      './tracks/text-track-settings.js': 0x85,
      './tracks/video-track-list.js': 0x8a,
      './utils/browser.js': 0x8c,
      './utils/buffer.js': 0x8d,
      './utils/dom.js': 0x8f,
      './utils/events.js': 0x90,
      './utils/fn.js': 0x91,
      './utils/guid.js': 0x93,
      './utils/log.js': 0x94,
      './utils/merge-options.js': 0x95,
      './utils/stylesheet.js': 0x96,
      './utils/time-ranges.js': 0x97,
      './utils/to-title-case.js': 0x98,
      'global/document': 0x1,
      'global/window': 0x2,
      'object.assign': 0x2d,
      'safe-json-parse/tuple': 0x36
    }],
    0x72: [function (_0x14a51a, _0x12fe52, _0x8ee43a) {
      'use strict';

      function _0xe35c20(_0x1b5a3f) {
        return _0x1b5a3f && _0x1b5a3f.__esModule ? _0x1b5a3f : {
          'default': _0x1b5a3f
        };
      }
      _0x8ee43a.__esModule = !0x0;
      var _0x2f44f7 = _0x14a51a("./player.js"),
        _0x483ab0 = _0xe35c20(_0x2f44f7),
        _0x21912a = function (_0x4dbf06, _0x5bfbe3) {
          _0x483ab0["default"].prototype[_0x4dbf06] = _0x5bfbe3;
        };
      _0x8ee43a["default"] = _0x21912a, _0x12fe52.exports = _0x8ee43a['default'];
    }, {
      './player.js': 0x71
    }],
    0x73: [function (_0x38fd91, _0x1f458b, _0x1a3bbb) {
      'use strict';

      function _0x4eaa38(_0x48428f) {
        if (_0x48428f && _0x48428f.__esModule) return _0x48428f;
        var _0x3b1267 = {};
        if (null != _0x48428f) {
          for (var _0x328b05 in _0x48428f) Object.prototype.hasOwnProperty.call(_0x48428f, _0x328b05) && (_0x3b1267[_0x328b05] = _0x48428f[_0x328b05]);
        }
        return _0x3b1267['default'] = _0x48428f, _0x3b1267;
      }
      function _0x22a5d5(_0x58bfa1) {
        return _0x58bfa1 && _0x58bfa1.__esModule ? _0x58bfa1 : {
          'default': _0x58bfa1
        };
      }
      function _0x29cd49(_0x271622, _0x554d70) {
        if (!(_0x271622 instanceof _0x554d70)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x23d018(_0x376ff7, _0xe1033) {
        if ("function" != typeof _0xe1033 && null !== _0xe1033) throw new TypeError("Super expression must either be null or a function, not " + typeof _0xe1033);
        _0x376ff7.prototype = Object.create(_0xe1033 && _0xe1033.prototype, {
          'constructor': {
            'value': _0x376ff7,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0xe1033 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x376ff7, _0xe1033) : _0x376ff7.__proto__ = _0xe1033);
      }
      _0x1a3bbb.__esModule = !0x0;
      var _0x2c6cfc = _0x38fd91("../clickable-component.js"),
        _0x38f6d1 = _0x22a5d5(_0x2c6cfc),
        _0x33cfd8 = _0x38fd91('../component.js'),
        _0x5b1ae0 = _0x22a5d5(_0x33cfd8),
        _0x511588 = _0x38fd91("./popup.js"),
        _0xb69eca = (_0x22a5d5(_0x511588), _0x38fd91("../utils/dom.js")),
        _0x1b5906 = (_0x4eaa38(_0xb69eca), _0x38fd91("../utils/fn.js")),
        _0x1a4dca = (_0x4eaa38(_0x1b5906), _0x38fd91('../utils/to-title-case.js')),
        _0x59258c = (_0x22a5d5(_0x1a4dca), function (_0x373dfb) {
          function _0x210f59(_0x2a5519) {
            var _0x55ff13 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
            _0x29cd49(this, _0x210f59), _0x373dfb.call(this, _0x2a5519, _0x55ff13), this.update();
          }
          return _0x23d018(_0x210f59, _0x373dfb), _0x210f59.prototype.update = function () {
            var _0x163d57 = this.createPopup();
            this.popup && this.removeChild(this.popup), this.popup = _0x163d57, this.addChild(_0x163d57), this.items && 0x0 === this.items.length ? this.hide() : this.items && this.items.length > 0x1 && this.show();
          }, _0x210f59.prototype.createPopup = function () {}, _0x210f59.prototype.createEl = function () {
            return _0x373dfb.prototype.createEl.call(this, "div", {
              'className': this.buildCSSClass()
            });
          }, _0x210f59.prototype.buildCSSClass = function () {
            var _0x1bb53c = "vjs-menu-button";
            return _0x1bb53c += this.options_.inline === !0x0 ? "-inline" : "-popup", 'vjs-menu-button\x20' + _0x1bb53c + '\x20' + _0x373dfb.prototype.buildCSSClass.call(this);
          }, _0x210f59;
        }(_0x38f6d1["default"]));
      _0x5b1ae0['default'].registerComponent("PopupButton", _0x59258c), _0x1a3bbb['default'] = _0x59258c, _0x1f458b.exports = _0x1a3bbb["default"];
    }, {
      '../clickable-component.js': 0x41,
      '../component.js': 0x43,
      '../utils/dom.js': 0x8f,
      '../utils/fn.js': 0x91,
      '../utils/to-title-case.js': 0x98,
      './popup.js': 0x74
    }],
    0x74: [function (_0x5edf0d, _0x4a4272, _0x307507) {
      'use strict';

      function _0x53b689(_0xdf7981) {
        if (_0xdf7981 && _0xdf7981.__esModule) return _0xdf7981;
        var _0x46acd5 = {};
        if (null != _0xdf7981) {
          for (var _0x50fb71 in _0xdf7981) Object.prototype.hasOwnProperty.call(_0xdf7981, _0x50fb71) && (_0x46acd5[_0x50fb71] = _0xdf7981[_0x50fb71]);
        }
        return _0x46acd5["default"] = _0xdf7981, _0x46acd5;
      }
      function _0x22780f(_0x5c090a) {
        return _0x5c090a && _0x5c090a.__esModule ? _0x5c090a : {
          'default': _0x5c090a
        };
      }
      function _0x5b65ef(_0x5036b5, _0x2e4753) {
        if (!(_0x5036b5 instanceof _0x2e4753)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x339bd3(_0x1587d6, _0xfe959f) {
        if ("function" != typeof _0xfe959f && null !== _0xfe959f) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0xfe959f);
        _0x1587d6.prototype = Object.create(_0xfe959f && _0xfe959f.prototype, {
          'constructor': {
            'value': _0x1587d6,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0xfe959f && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x1587d6, _0xfe959f) : _0x1587d6.__proto__ = _0xfe959f);
      }
      _0x307507.__esModule = !0x0;
      var _0x568afd = _0x5edf0d("../component.js"),
        _0x4786b3 = _0x22780f(_0x568afd),
        _0x54c0db = _0x5edf0d('../utils/dom.js'),
        _0x326c34 = _0x53b689(_0x54c0db),
        _0x1f4fcf = _0x5edf0d("../utils/fn.js"),
        _0x33463b = _0x53b689(_0x1f4fcf),
        _0x1b3da1 = _0x5edf0d("../utils/events.js"),
        _0x3253f1 = _0x53b689(_0x1b3da1),
        _0x58c921 = function (_0x552445) {
          function _0x4408d8() {
            _0x5b65ef(this, _0x4408d8), _0x552445.apply(this, arguments);
          }
          return _0x339bd3(_0x4408d8, _0x552445), _0x4408d8.prototype.addItem = function (_0x22e75f) {
            this.addChild(_0x22e75f), _0x22e75f.on("click", _0x33463b.bind(this, function () {
              this.unlockShowing();
            }));
          }, _0x4408d8.prototype.createEl = function () {
            var _0x217df8 = this.options_.contentElType || 'ul';
            this.contentEl_ = _0x326c34.createEl(_0x217df8, {
              'className': "vjs-menu-content"
            });
            var _0x444c0e = _0x552445.prototype.createEl.call(this, "div", {
              'append': this.contentEl_,
              'className': "vjs-menu"
            });
            return _0x444c0e.appendChild(this.contentEl_), _0x3253f1.on(_0x444c0e, "click", function (_0x4ca781) {
              _0x4ca781.preventDefault(), _0x4ca781.stopImmediatePropagation();
            }), _0x444c0e;
          }, _0x4408d8;
        }(_0x4786b3["default"]);
      _0x4786b3["default"].registerComponent("Popup", _0x58c921), _0x307507['default'] = _0x58c921, _0x4a4272.exports = _0x307507["default"];
    }, {
      '../component.js': 0x43,
      '../utils/dom.js': 0x8f,
      '../utils/events.js': 0x90,
      '../utils/fn.js': 0x91
    }],
    0x75: [function (_0x595f75, _0x482199, _0x1256be) {
      'use strict';

      function _0x3cda46(_0x6b9c2e) {
        if (_0x6b9c2e && _0x6b9c2e.__esModule) return _0x6b9c2e;
        var _0x257c21 = {};
        if (null != _0x6b9c2e) {
          for (var _0x4175d5 in _0x6b9c2e) Object.prototype.hasOwnProperty.call(_0x6b9c2e, _0x4175d5) && (_0x257c21[_0x4175d5] = _0x6b9c2e[_0x4175d5]);
        }
        return _0x257c21["default"] = _0x6b9c2e, _0x257c21;
      }
      function _0x4dd3a0(_0xdebbb5) {
        return _0xdebbb5 && _0xdebbb5.__esModule ? _0xdebbb5 : {
          'default': _0xdebbb5
        };
      }
      function _0x52843e(_0x106632, _0x495a56) {
        if (!(_0x106632 instanceof _0x495a56)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x567ed5(_0xd5c6ba, _0x1bf43d) {
        if ("function" != typeof _0x1bf43d && null !== _0x1bf43d) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x1bf43d);
        _0xd5c6ba.prototype = Object.create(_0x1bf43d && _0x1bf43d.prototype, {
          'constructor': {
            'value': _0xd5c6ba,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x1bf43d && (Object.setPrototypeOf ? Object.setPrototypeOf(_0xd5c6ba, _0x1bf43d) : _0xd5c6ba.__proto__ = _0x1bf43d);
      }
      _0x1256be.__esModule = !0x0;
      var _0xef9fc3 = _0x595f75('./clickable-component.js'),
        _0x2c54ae = _0x4dd3a0(_0xef9fc3),
        _0x1c857c = _0x595f75("./component.js"),
        _0x2533c4 = _0x4dd3a0(_0x1c857c),
        _0x39c33b = _0x595f75("./utils/fn.js"),
        _0x101874 = _0x3cda46(_0x39c33b),
        _0x7622ce = _0x595f75("./utils/dom.js"),
        _0xd2f88b = _0x3cda46(_0x7622ce),
        _0x928c8 = _0x595f75('./utils/browser.js'),
        _0x3eb064 = _0x3cda46(_0x928c8),
        _0x149879 = function (_0x5c78e6) {
          function _0x33af18(_0x5d5d33, _0x29fb8a) {
            _0x52843e(this, _0x33af18), _0x5c78e6.call(this, _0x5d5d33, _0x29fb8a), this.update(), _0x5d5d33.on("posterchange", _0x101874.bind(this, this.update));
          }
          return _0x567ed5(_0x33af18, _0x5c78e6), _0x33af18.prototype.dispose = function () {
            this.player().off('posterchange', this.update), _0x5c78e6.prototype.dispose.call(this);
          }, _0x33af18.prototype.createEl = function () {
            var _0xd1f4df = _0xd2f88b.createEl("div", {
              'className': "vjs-poster",
              'tabIndex': -0x1
            });
            return _0x3eb064.BACKGROUND_SIZE_SUPPORTED || (this.fallbackImg_ = _0xd2f88b.createEl('img'), _0xd1f4df.appendChild(this.fallbackImg_)), _0xd1f4df;
          }, _0x33af18.prototype.update = function () {
            var _0x4e44d8 = this.player().poster();
            this.setSrc(_0x4e44d8), _0x4e44d8 ? this.show() : this.hide();
          }, _0x33af18.prototype.setSrc = function (_0x594b6b) {
            if (this.fallbackImg_) this.fallbackImg_.src = _0x594b6b;else {
              var _0x29458e = '';
              _0x594b6b && (_0x29458e = "url(\"" + _0x594b6b + '\x22)'), this.el_.style.backgroundImage = _0x29458e;
            }
          }, _0x33af18.prototype.handleClick = function () {
            this.player_.paused() ? this.player_.play() : this.player_.pause();
          }, _0x33af18;
        }(_0x2c54ae["default"]);
      _0x2533c4["default"].registerComponent("PosterImage", _0x149879), _0x1256be["default"] = _0x149879, _0x482199.exports = _0x1256be["default"];
    }, {
      './clickable-component.js': 0x41,
      './component.js': 0x43,
      './utils/browser.js': 0x8c,
      './utils/dom.js': 0x8f,
      './utils/fn.js': 0x91
    }],
    0x76: [function (_0x1c002c, _0x313118, _0x1e093a) {
      'use strict';

      function _0x1b248e(_0x32b72a) {
        return _0x32b72a && _0x32b72a.__esModule ? _0x32b72a : {
          'default': _0x32b72a
        };
      }
      function _0x5b1012(_0x1b9a9e) {
        if (_0x1b9a9e && _0x1b9a9e.__esModule) return _0x1b9a9e;
        var _0x1ef9ef = {};
        if (null != _0x1b9a9e) {
          for (var _0x14a7c1 in _0x1b9a9e) Object.prototype.hasOwnProperty.call(_0x1b9a9e, _0x14a7c1) && (_0x1ef9ef[_0x14a7c1] = _0x1b9a9e[_0x14a7c1]);
        }
        return _0x1ef9ef["default"] = _0x1b9a9e, _0x1ef9ef;
      }
      _0x1e093a.__esModule = !0x0;
      var _0x30b40e = _0x1c002c('./utils/events.js'),
        _0x20bc12 = _0x5b1012(_0x30b40e),
        _0x11f449 = _0x1c002c("global/document"),
        _0x46c12d = _0x1b248e(_0x11f449),
        _0x490ca6 = _0x1c002c("global/window"),
        _0xed1795 = _0x1b248e(_0x490ca6),
        _0x583d1a = function () {
          var _0x2b1773 = _0x46c12d['default'].getElementsByTagName("video"),
            _0x340b3d = _0x46c12d['default'].getElementsByTagName("audio"),
            _0x18359e = [];
          if (_0x2b1773 && _0x2b1773.length > 0x0) {
            for (var _0x189c86 = 0x0, _0x203869 = _0x2b1773.length; _0x203869 > 0x0; _0x189c86++) _0x18359e.push(_0x2b1773[_0x189c86]);
          }
          if (_0x340b3d && _0x340b3d.length > 0x0) {
            for (var _0x189c86 = 0x0, _0x203869 = _0x340b3d.length; _0x203869 > 0x0; _0x189c86++) _0x18359e.push(_0x340b3d[_0x189c86]);
          }
          if (_0x18359e && _0x18359e.length > 0x0) for (var _0x189c86 = 0x0, _0x203869 = _0x18359e.length; _0x203869 > 0x0; _0x189c86++) {
            var _0x13412c = _0x18359e[_0x189c86];
            if (!_0x13412c || !_0x13412c.getAttribute) {
              _0x55f965(0x1);
              break;
            }
            if (void 0x0 === _0x13412c.player) {
              var _0xc68d22 = _0x13412c.getAttribute("data-setup");
              null !== _0xc68d22 && (void 0x0)(_0x13412c);
            }
          } else !0x1 || _0x55f965(0x1);
        },
        _0x55f965 = function (_0x282883, _0x101c10) {
          _0x101c10 && (_0x2d1633 = _0x101c10), setTimeout(_0x583d1a, _0x282883);
        };
      "complete" === _0x46c12d["default"].readyState ? _0x191608 = !0x0 : _0x20bc12.one(_0xed1795["default"], "load", function () {
        _0x191608 = !0x0;
      });
      var _0x707739 = function () {
        return _0x191608;
      };
      _0x1e093a.autoSetup = _0x583d1a, _0x1e093a.autoSetupTimeout = _0x55f965, _0x1e093a.hasLoaded = _0x707739;
    }, {
      './utils/events.js': 0x90,
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x77: [function (_0x4c9e5d, _0x50e4e0, _0x2f2648) {
      'use strict';

      function _0xb8417(_0x4695d7) {
        if (_0x4695d7 && _0x4695d7.__esModule) return _0x4695d7;
        var _0x3f6969 = {};
        if (null != _0x4695d7) {
          for (var _0x214b06 in _0x4695d7) Object.prototype.hasOwnProperty.call(_0x4695d7, _0x214b06) && (_0x3f6969[_0x214b06] = _0x4695d7[_0x214b06]);
        }
        return _0x3f6969["default"] = _0x4695d7, _0x3f6969;
      }
      function _0x5392c0(_0x4933dd) {
        return _0x4933dd && _0x4933dd.__esModule ? _0x4933dd : {
          'default': _0x4933dd
        };
      }
      function _0x57baa7(_0x188580, _0x366256) {
        if (!(_0x188580 instanceof _0x366256)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x57ece7(_0x2e1ed7, _0x286b21) {
        if ('function' != typeof _0x286b21 && null !== _0x286b21) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x286b21);
        _0x2e1ed7.prototype = Object.create(_0x286b21 && _0x286b21.prototype, {
          'constructor': {
            'value': _0x2e1ed7,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x286b21 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2e1ed7, _0x286b21) : _0x2e1ed7.__proto__ = _0x286b21);
      }
      _0x2f2648.__esModule = !0x0;
      var _0x55c32e = _0x4c9e5d("../component.js"),
        _0x39c09a = _0x5392c0(_0x55c32e),
        _0x6c4209 = _0x4c9e5d("../utils/dom.js"),
        _0x30e47e = _0xb8417(_0x6c4209),
        _0x29d5f4 = _0x4c9e5d("object.assign"),
        _0x1e9997 = _0x5392c0(_0x29d5f4),
        _0x1da4b0 = function (_0x16998c) {
          function _0x1a1a3e(_0x10aa9d, _0x5ecbcf) {
            _0x57baa7(this, _0x1a1a3e), _0x16998c.call(this, _0x10aa9d, _0x5ecbcf), this.bar = this.getChild(this.options_.barName), this.vertical(!!this.options_.vertical), this.on("mousedown", this.handleMouseDown), this.on('touchstart', this.handleMouseDown), this.on("focus", this.handleFocus), this.on("blur", this.handleBlur), this.on("click", this.handleClick), this.on(_0x10aa9d, "controlsvisible", this.update), this.on(_0x10aa9d, this.playerEvent, this.update);
          }
          return _0x57ece7(_0x1a1a3e, _0x16998c), _0x1a1a3e.prototype.createEl = function (_0x470a1a) {
            var _0x522f83 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1],
              _0x472a4d = arguments.length <= 0x2 || void 0x0 === arguments[0x2] ? {} : arguments[0x2];
            return _0x522f83.className = _0x522f83.className + " vjs-slider", _0x522f83 = _0x1e9997["default"]({
              'tabIndex': 0x0
            }, _0x522f83), _0x472a4d = _0x1e9997["default"]({
              'role': "slider",
              'aria-valuenow': 0x0,
              'aria-valuemin': 0x0,
              'aria-valuemax': 0x64,
              'tabIndex': 0x0
            }, _0x472a4d), _0x16998c.prototype.createEl.call(this, _0x470a1a, _0x522f83, _0x472a4d);
          }, _0x1a1a3e.prototype.handleMouseDown = function (_0x4a4145) {
            _0x4a4145.preventDefault(), _0x30e47e.blockTextSelection(), this.addClass('vjs-sliding'), this.trigger("slideractive"), this.on(this.bar.el_.ownerDocument, "mousemove", this.handleMouseMove), this.on(this.bar.el_.ownerDocument, 'mouseup', this.handleMouseUp), this.on(this.bar.el_.ownerDocument, "touchmove", this.handleMouseMove), this.on(this.bar.el_.ownerDocument, 'touchend', this.handleMouseUp), this.handleMouseMove(_0x4a4145);
          }, _0x1a1a3e.prototype.handleMouseMove = function () {}, _0x1a1a3e.prototype.handleMouseUp = function () {
            _0x30e47e.unblockTextSelection(), this.removeClass("vjs-sliding"), this.trigger("sliderinactive"), this.off(this.bar.el_.ownerDocument, "mousemove", this.handleMouseMove), this.off(this.bar.el_.ownerDocument, "mouseup", this.handleMouseUp), this.off(this.bar.el_.ownerDocument, "touchmove", this.handleMouseMove), this.off(this.bar.el_.ownerDocument, "touchend", this.handleMouseUp), this.update();
          }, _0x1a1a3e.prototype.update = function () {
            if (this.el_) {
              var _0x538f62 = this.getPercent();
              if (this.bar) {
                ("number" != typeof _0x538f62 || _0x538f62 !== _0x538f62 || 0x0 > _0x538f62 || _0x538f62 === 0x1 / 0x0) && (_0x538f62 = 0x0);
                var _0x85104c = (0x64 * _0x538f62).toFixed(0x2) + '%';
                this.vertical() ? this.bar.el().style.height = _0x85104c : this.bar.el().style.width = _0x85104c;
              }
            }
          }, _0x1a1a3e.prototype.calculateDistance = function (_0x4e63f9) {
            var _0x181c75 = _0x30e47e.getPointerPosition(this.el_, _0x4e63f9);
            return this.vertical() ? _0x181c75.y : _0x181c75.x;
          }, _0x1a1a3e.prototype.handleFocus = function () {
            this.on(this.bar.el_.ownerDocument, "keydown", this.handleKeyPress);
          }, _0x1a1a3e.prototype.handleKeyPress = function (_0x2772b7) {
            0x25 === _0x2772b7.which || 0x28 === _0x2772b7.which ? (_0x2772b7.preventDefault(), this.stepBack()) : (0x26 === _0x2772b7.which || 0x27 === _0x2772b7.which) && (_0x2772b7.preventDefault(), this.stepForward());
          }, _0x1a1a3e.prototype.handleBlur = function () {
            this.off(this.bar.el_.ownerDocument, "keydown", this.handleKeyPress);
          }, _0x1a1a3e.prototype.handleClick = function (_0x4d0449) {
            _0x4d0449.stopImmediatePropagation(), _0x4d0449.preventDefault();
          }, _0x1a1a3e.prototype.vertical = function (_0x3c6c24) {
            return void 0x0 === _0x3c6c24 ? this.vertical_ || !0x1 : (this.vertical_ = !!_0x3c6c24, this.addClass(this.vertical_ ? "vjs-slider-vertical" : "vjs-slider-horizontal"), this);
          }, _0x1a1a3e;
        }(_0x39c09a["default"]);
      _0x39c09a["default"].registerComponent("Slider", _0x1da4b0), _0x2f2648["default"] = _0x1da4b0, _0x50e4e0.exports = _0x2f2648["default"];
    }, {
      '../component.js': 0x43,
      '../utils/dom.js': 0x8f,
      'object.assign': 0x2d
    }],
    0x78: [function (_0x7ade08, _0x39e971, _0x164b35) {
      'use strict';

      function _0x133846(_0x2a78d0) {
        return _0x2a78d0.streamingFormats = {
          'rtmp/mp4': "MP4",
          'rtmp/flv': 'FLV'
        }, _0x2a78d0.streamFromParts = function (_0x243479, _0x30535b) {
          return _0x243479 + '&' + _0x30535b;
        }, _0x2a78d0.streamToParts = function (_0xa234b8) {
          var _0xb78cd3 = {
            'connection': '',
            'stream': ''
          };
          if (!_0xa234b8) return _0xb78cd3;
          var _0xae7bd2 = _0xa234b8.search(/&(?!\w+=)/),
            _0x5aa6f1 = void 0x0;
          return -0x1 !== _0xae7bd2 ? _0x5aa6f1 = _0xae7bd2 + 0x1 : (_0xae7bd2 = _0x5aa6f1 = _0xa234b8.lastIndexOf('/') + 0x1, 0x0 === _0xae7bd2 && (_0xae7bd2 = _0x5aa6f1 = _0xa234b8.length)), _0xb78cd3.connection = _0xa234b8.substring(0x0, _0xae7bd2), _0xb78cd3.stream = _0xa234b8.substring(_0x5aa6f1, _0xa234b8.length), _0xb78cd3;
        }, _0x2a78d0.isStreamingType = function (_0x296b00) {
          return _0x296b00 in _0x2a78d0.streamingFormats;
        }, _0x2a78d0.RTMP_RE = /^rtmp[set]?:\/\//i, _0x2a78d0.isStreamingSrc = function (_0x39e162) {
          return _0x2a78d0.RTMP_RE.test(_0x39e162);
        }, _0x2a78d0.rtmpSourceHandler = {}, _0x2a78d0.rtmpSourceHandler.canPlayType = function (_0x53db1f) {
          return _0x2a78d0.isStreamingType(_0x53db1f) ? "maybe" : '';
        }, _0x2a78d0.rtmpSourceHandler.canHandleSource = function (_0x5306df) {
          var _0x2419e2 = _0x2a78d0.rtmpSourceHandler.canPlayType(_0x5306df.type);
          return _0x2419e2 ? _0x2419e2 : _0x2a78d0.isStreamingSrc(_0x5306df.src) ? "maybe" : '';
        }, _0x2a78d0.rtmpSourceHandler.handleSource = function (_0x1a9a21, _0x593b7c) {
          var _0x3c60c7 = _0x2a78d0.streamToParts(_0x1a9a21.src);
          _0x593b7c.setRtmpConnection(_0x3c60c7.connection), _0x593b7c.setRtmpStream(_0x3c60c7.stream);
        }, _0x2a78d0.registerSourceHandler(_0x2a78d0.rtmpSourceHandler), _0x2a78d0;
      }
      _0x164b35.__esModule = !0x0, _0x164b35["default"] = _0x133846, _0x39e971.exports = _0x164b35["default"];
    }, {}],
    0x79: [function (_0xb000f6, _0x36b72e, _0xf34e2) {
      'use strict';

      function _0x15b56a(_0xa11340) {
        if (_0xa11340 && _0xa11340.__esModule) return _0xa11340;
        var _0x3814eb = {};
        if (null != _0xa11340) {
          for (var _0x1dbccc in _0xa11340) Object.prototype.hasOwnProperty.call(_0xa11340, _0x1dbccc) && (_0x3814eb[_0x1dbccc] = _0xa11340[_0x1dbccc]);
        }
        return _0x3814eb['default'] = _0xa11340, _0x3814eb;
      }
      function _0x41ef64(_0x22cc8f) {
        return _0x22cc8f && _0x22cc8f.__esModule ? _0x22cc8f : {
          'default': _0x22cc8f
        };
      }
      function _0x4f55e8(_0x2bc6a5, _0x5393d4) {
        if (!(_0x2bc6a5 instanceof _0x5393d4)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x2fc9c4(_0x98b2cb, _0x34393f) {
        if ("function" != typeof _0x34393f && null !== _0x34393f) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x34393f);
        _0x98b2cb.prototype = Object.create(_0x34393f && _0x34393f.prototype, {
          'constructor': {
            'value': _0x98b2cb,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x34393f && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x98b2cb, _0x34393f) : _0x98b2cb.__proto__ = _0x34393f);
      }
      function _0x3b4c3c(_0x446332) {
        var _0x4b169e = _0x446332.charAt(0x0).toUpperCase() + _0x446332.slice(0x1);
        _0x4be861['set' + _0x4b169e] = function (_0x425fe7) {
          return this.el_.vjs_setProperty(_0x446332, _0x425fe7);
        };
      }
      function _0x2b4c58(_0x4f6089) {
        _0x4be861[_0x4f6089] = function () {
          return this.el_.vjs_getProperty(_0x4f6089);
        };
      }
      _0xf34e2.__esModule = !0x0;
      for (var _0x178f12 = _0xb000f6("./tech"), _0x51e5d3 = _0x41ef64(_0x178f12), _0x5fc554 = _0xb000f6("../utils/dom.js"), _0x180bec = _0x15b56a(_0x5fc554), _0x320625 = _0xb000f6('../utils/url.js'), _0x3bedbd = _0x15b56a(_0x320625), _0x32d6bc = _0xb000f6("../utils/time-ranges.js"), _0x2472a3 = _0xb000f6("./flash-rtmp"), _0x4d1caa = _0x41ef64(_0x2472a3), _0x152111 = _0xb000f6("../component"), _0x16ff96 = _0x41ef64(_0x152111), _0x2f3784 = _0xb000f6("global/window"), _0x4c7dd3 = _0x41ef64(_0x2f3784), _0x5bd6db = _0xb000f6("object.assign"), _0x60d276 = _0x41ef64(_0x5bd6db), _0x8f5ce3 = _0x4c7dd3["default"].navigator, _0x22c6d3 = function (_0x3be1aa) {
          function _0x49af77(_0x37001d, _0x5a7d29) {
            _0x4f55e8(this, _0x49af77), _0x3be1aa.call(this, _0x37001d, _0x5a7d29), _0x37001d.source && this.ready(function () {
              this.setSource(_0x37001d.source);
            }, !0x0), _0x37001d.startTime && this.ready(function () {
              this.load(), this.play(), this.currentTime(_0x37001d.startTime);
            }, !0x0), _0x4c7dd3["default"].videojs = _0x4c7dd3["default"].videojs || {}, _0x4c7dd3['default'].videojs.Flash = _0x4c7dd3["default"].videojs.Flash || {}, _0x4c7dd3["default"].videojs.Flash.onReady = _0x49af77.onReady, _0x4c7dd3["default"].videojs.Flash.onEvent = _0x49af77.onEvent, _0x4c7dd3["default"].videojs.Flash.onError = _0x49af77.onError, this.on("seeked", function () {
              this.lastSeekTarget_ = void 0x0;
            });
          }
          return _0x2fc9c4(_0x49af77, _0x3be1aa), _0x49af77.prototype.createEl = function () {
            this.options_.swf || (this.options_.swf = "//vjs.zencdn.net/swf/5.0.1/video-js.swf");
            var _0x4de221 = _0x60d276["default"]({
                'readyFunction': "videojs.Flash.onReady",
                'eventProxyFunction': "videojs.Flash.onEvent",
                'errorEventProxyFunction': "videojs.Flash.onError",
                'autoplay': this.options_.autoplay,
                'preload': this.options_.preload,
                'loop': this.options_.loop,
                'muted': this.options_.muted
              }, this.options_.flashVars),
              _0x4d3730 = _0x60d276["default"]({
                'wmode': "opaque",
                'bgcolor': "#000000"
              }, this.options_.params),
              _0x4159ba = _0x60d276["default"]({
                'id': this.options_.techId,
                'name': this.options_.techId,
                'class': "vjs-tech"
              }, this.options_.attributes);
            return this.el_ = _0x49af77.embed(this.options_.swf, _0x4de221, _0x4d3730, _0x4159ba), this.el_.tech = this, this.el_;
          }, _0x49af77.prototype.play = function () {
            this.ended() && this.setCurrentTime(0x0), this.el_.vjs_play();
          }, _0x49af77.prototype.pause = function () {
            this.el_.vjs_pause();
          }, _0x49af77.prototype.src = function (_0x47f65e) {
            return void 0x0 === _0x47f65e ? this.currentSrc() : this.setSrc(_0x47f65e);
          }, _0x49af77.prototype.setSrc = function (_0x25fd67) {
            if (_0x25fd67 = _0x3bedbd.getAbsoluteURL(_0x25fd67), this.el_.vjs_src(_0x25fd67), this.autoplay()) {
              this.setTimeout(function () {
                this.play();
              }, 0x0);
            }
          }, _0x49af77.prototype.seeking = function () {
            return void 0x0 !== this.lastSeekTarget_;
          }, _0x49af77.prototype.setCurrentTime = function (_0x5833a5) {
            var _0x7406bf = this.seekable();
            _0x7406bf.length && (_0x5833a5 = _0x5833a5 > _0x7406bf.start(0x0) ? _0x5833a5 : _0x7406bf.start(0x0), _0x5833a5 = _0x5833a5 < _0x7406bf.end(_0x7406bf.length - 0x1) ? _0x5833a5 : _0x7406bf.end(_0x7406bf.length - 0x1), this.lastSeekTarget_ = _0x5833a5, this.trigger("seeking"), this.el_.vjs_setProperty("currentTime", _0x5833a5), _0x3be1aa.prototype.setCurrentTime.call(this));
          }, _0x49af77.prototype.currentTime = function () {
            return this.seeking() ? this.lastSeekTarget_ || 0x0 : this.el_.vjs_getProperty("currentTime");
          }, _0x49af77.prototype.currentSrc = function () {
            return this.currentSource_ ? this.currentSource_.src : this.el_.vjs_getProperty("currentSrc");
          }, _0x49af77.prototype.load = function () {
            this.el_.vjs_load();
          }, _0x49af77.prototype.poster = function () {
            this.el_.vjs_getProperty("poster");
          }, _0x49af77.prototype.setPoster = function () {}, _0x49af77.prototype.seekable = function () {
            var _0x13ea5d = this.duration();
            return 0x0 === _0x13ea5d ? _0x32d6bc.createTimeRange() : _0x32d6bc.createTimeRange(0x0, _0x13ea5d);
          }, _0x49af77.prototype.buffered = function () {
            var _0x56f9ba = this.el_.vjs_getProperty("buffered");
            return 0x0 === _0x56f9ba.length ? _0x32d6bc.createTimeRange() : _0x32d6bc.createTimeRange(_0x56f9ba[0x0][0x0], _0x56f9ba[0x0][0x1]);
          }, _0x49af77.prototype.supportsFullScreen = function () {
            return !0x1;
          }, _0x49af77.prototype.enterFullScreen = function () {
            return !0x1;
          }, _0x49af77;
        }(_0x51e5d3["default"]), _0x4be861 = _0x22c6d3.prototype, _0x3a87b2 = "rtmpConnection,rtmpStream,preload,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted".split(','), _0x3e30e4 = "networkState,readyState,initialTime,duration,startOffsetTime,paused,ended,videoWidth,videoHeight".split(','), _0x281657 = 0x0; 0x0 < _0x3a87b2.length; _0x281657++) _0x2b4c58(_0x3a87b2[_0x281657]), _0x3b4c3c(_0x3a87b2[_0x281657]);
      for (var _0x281657 = 0x0; 0x0 < _0x3e30e4.length; _0x281657++) _0x2b4c58(_0x3e30e4[_0x281657]);
      _0x22c6d3.isSupported = function () {
        return _0x22c6d3.version()[0x0] >= 0xa;
      }, _0x51e5d3["default"].withSourceHandlers(_0x22c6d3), _0x22c6d3.nativeSourceHandler = {}, _0x22c6d3.nativeSourceHandler.canPlayType = function (_0x506ce1) {
        return _0x506ce1 in _0x22c6d3.formats ? "maybe" : '';
      }, _0x22c6d3.nativeSourceHandler.canHandleSource = function (_0x18bfdd) {
        function _0xde12d8(_0x560e94) {
          var _0x53c82a = _0x3bedbd.getFileExtension(_0x560e94);
          return _0x53c82a ? "video/" + _0x53c82a : '';
        }
        var _0x52b7d1;
        return _0x52b7d1 = _0x18bfdd.type ? _0x18bfdd.type.replace(/;.*/, '').toLowerCase() : _0xde12d8(_0x18bfdd.src), _0x22c6d3.nativeSourceHandler.canPlayType(_0x52b7d1);
      }, _0x22c6d3.nativeSourceHandler.handleSource = function (_0x402b3b, _0x309258) {
        _0x309258.setSrc(_0x402b3b.src);
      }, _0x22c6d3.nativeSourceHandler.dispose = function () {}, _0x22c6d3.registerSourceHandler(_0x22c6d3.nativeSourceHandler), _0x22c6d3.formats = {
        'video/flv': "FLV",
        'video/x-flv': "FLV",
        'video/mp4': 'MP4',
        'video/m4v': "MP4"
      }, _0x22c6d3.onReady = function (_0x353b34) {
        var _0x254a28 = _0x180bec.getEl(_0x353b34),
          _0xcec366 = _0x254a28 && _0x254a28.tech;
        _0xcec366 && _0xcec366.el() && _0x22c6d3.checkReady(_0xcec366);
      }, _0x22c6d3.checkReady = function (_0x3a8a85) {
        _0x3a8a85.el() && (_0x3a8a85.el().vjs_getProperty ? _0x3a8a85.triggerReady() : this.setTimeout(function () {
          _0x22c6d3.checkReady(_0x3a8a85);
        }, 0x32));
      }, _0x22c6d3.onEvent = function (_0x546b89, _0x2130e9) {
        var _0x9a3afc = _0x180bec.getEl(_0x546b89).tech;
        _0x9a3afc.trigger(_0x2130e9);
      }, _0x22c6d3.onError = function (_0xf3c4c3, _0x78aafd) {
        var _0x168801 = _0x180bec.getEl(_0xf3c4c3).tech;
        return "srcnotfound" === _0x78aafd ? _0x168801.error(0x4) : void _0x168801.error("FLASH: " + _0x78aafd);
      }, _0x22c6d3.version = function () {
        var _0x316f6e = '0,0,0';
        try {
          _0x316f6e = new _0x4c7dd3['default'].ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable("$version").replace(/\D+/g, ',').match(/^,?(.+),?$/)[0x1];
        } catch (_0x3e036b) {
          try {
            _0x8f5ce3.mimeTypes["application/x-shockwave-flash"].enabledPlugin && (_0x316f6e = (_0x8f5ce3.plugins["Shockwave Flash 2.0"] || _0x8f5ce3.plugins["Shockwave Flash"]).description.replace(/\D+/g, ',').match(/^,?(.+),?$/)[0x1]);
          } catch (_0x1acd02) {}
        }
        return _0x316f6e.split(',');
      }, _0x22c6d3.embed = function (_0x2563e6, _0x4c986e, _0x509e56, _0x1d6a13) {
        var _0x1b105c = _0x22c6d3.getEmbedCode(_0x2563e6, _0x4c986e, _0x509e56, _0x1d6a13),
          _0x4bda3e = _0x180bec.createEl("div", {
            'innerHTML': _0x1b105c
          }).childNodes[0x0];
        return _0x4bda3e;
      }, _0x22c6d3.getEmbedCode = function (_0x33fc4f, _0x52be8a, _0x3d2b20, _0x1ae876) {
        var _0x3077a2 = '',
          _0x369c0a = '',
          _0xe426cc = '';
        return _0x52be8a && Object.getOwnPropertyNames(_0x52be8a).forEach(function (_0x15055e) {
          _0x3077a2 += _0x15055e + '=' + _0x52be8a[_0x15055e] + "&amp;";
        }), _0x3d2b20 = _0x60d276["default"]({
          'movie': _0x33fc4f,
          'flashvars': _0x3077a2,
          'allowScriptAccess': 'always',
          'allowNetworking': "all"
        }, _0x3d2b20), Object.getOwnPropertyNames(_0x3d2b20).forEach(function (_0x1e939c) {
          _0x369c0a += '<param\x20name=\x22' + _0x1e939c + "\" value=\"" + _0x3d2b20[_0x1e939c] + '\x22\x20/>';
        }), _0x1ae876 = _0x60d276["default"]({
          'data': _0x33fc4f,
          'width': '100%',
          'height': "100%"
        }, _0x1ae876), Object.getOwnPropertyNames(_0x1ae876).forEach(function (_0x5592d1) {
          _0xe426cc += _0x5592d1 + '=\x22' + _0x1ae876[_0x5592d1] + '\x22\x20';
        }), '' + '<object\x20type=\x22application/x-shockwave-flash\x22\x20' + _0xe426cc + '>' + _0x369c0a + "</object>";
      }, _0x4d1caa["default"](_0x22c6d3), _0x16ff96["default"].registerComponent("Flash", _0x22c6d3), _0x51e5d3["default"].registerTech('Flash', _0x22c6d3), _0xf34e2['default'] = _0x22c6d3, _0x36b72e.exports = _0xf34e2["default"];
    }, {
      '../component': 0x43,
      '../utils/dom.js': 0x8f,
      '../utils/time-ranges.js': 0x97,
      '../utils/url.js': 0x99,
      './flash-rtmp': 0x78,
      './tech': 0x7c,
      'global/window': 0x2,
      'object.assign': 0x2d
    }],
    0x7a: [function (_0x1edc8e, _0x2717f6, _0x1f4768) {
      'use strict';

      function _0x4cf64f(_0x5c716e) {
        if (_0x5c716e && _0x5c716e.__esModule) return _0x5c716e;
        var _0x360055 = {};
        if (null != _0x5c716e) {
          for (var _0x2c7f50 in _0x5c716e) Object.prototype.hasOwnProperty.call(_0x5c716e, _0x2c7f50) && (_0x360055[_0x2c7f50] = _0x5c716e[_0x2c7f50]);
        }
        return _0x360055["default"] = _0x5c716e, _0x360055;
      }
      function _0x28fbbc(_0x1f7346) {
        return _0x1f7346 && _0x1f7346.__esModule ? _0x1f7346 : {
          'default': _0x1f7346
        };
      }
      function _0x2c44f0(_0x622d49, _0x49d646) {
        if (!(_0x622d49 instanceof _0x49d646)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x532401(_0x3b2390, _0x36d757) {
        if ("function" != typeof _0x36d757 && null !== _0x36d757) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x36d757);
        _0x3b2390.prototype = Object.create(_0x36d757 && _0x36d757.prototype, {
          'constructor': {
            'value': _0x3b2390,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x36d757 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3b2390, _0x36d757) : _0x3b2390.__proto__ = _0x36d757);
      }
      function _0x223c0d(_0x14bd7b, _0x3e4065) {
        return _0x14bd7b.raw = _0x3e4065, _0x14bd7b;
      }
      _0x1f4768.__esModule = !0x0;
      var _0x562336 = _0x223c0d(["Text Tracks are being loaded from another origin but the crossorigin attribute isn't used. \n            This may prevent text tracks from loading."], ["Text Tracks are being loaded from another origin but the crossorigin attribute isn't used. \n            This may prevent text tracks from loading."]),
        _0x7e39be = _0x1edc8e("./tech.js"),
        _0x44d9da = _0x28fbbc(_0x7e39be),
        _0x2bf9a5 = _0x1edc8e('../component'),
        _0x4917af = _0x28fbbc(_0x2bf9a5),
        _0xa80997 = _0x1edc8e('../utils/dom.js'),
        _0x3555e0 = _0x4cf64f(_0xa80997),
        _0x3dc2bd = _0x1edc8e("../utils/url.js"),
        _0x4412c3 = _0x4cf64f(_0x3dc2bd),
        _0x1f42c8 = _0x1edc8e("../utils/fn.js"),
        _0xee95ba = _0x4cf64f(_0x1f42c8),
        _0x415196 = _0x1edc8e('../utils/log.js'),
        _0x2e7afe = _0x28fbbc(_0x415196),
        _0x7205f7 = _0x1edc8e("tsml"),
        _0x42834c = _0x28fbbc(_0x7205f7),
        _0x22f41e = _0x1edc8e("../../../src/js/tracks/text-track.js"),
        _0xd09160 = (_0x28fbbc(_0x22f41e), _0x1edc8e("../utils/browser.js")),
        _0x120fa4 = _0x4cf64f(_0xd09160),
        _0x30f310 = _0x1edc8e("global/document"),
        _0x39418a = _0x28fbbc(_0x30f310),
        _0x5710cb = _0x1edc8e('global/window'),
        _0x331d0c = _0x28fbbc(_0x5710cb),
        _0xc8dac9 = _0x1edc8e("object.assign"),
        _0x49e5da = _0x28fbbc(_0xc8dac9),
        _0x20e49a = _0x1edc8e('../utils/merge-options.js'),
        _0x15631d = _0x28fbbc(_0x20e49a),
        _0x5a2310 = _0x1edc8e("../utils/to-title-case.js"),
        _0x56c657 = _0x28fbbc(_0x5a2310),
        _0x445473 = function (_0x367b60) {
          function _0x15dfc8(_0x90dfb1, _0x13efdb) {
            _0x2c44f0(this, _0x15dfc8), _0x367b60.call(this, _0x90dfb1, _0x13efdb);
            var _0x225d01 = _0x90dfb1.source;
            if (_0x225d01 && (this.el_.currentSrc !== _0x225d01.src || _0x90dfb1.tag && 0x3 === _0x90dfb1.tag.initNetworkState_) ? this.setSource(_0x225d01) : this.handleLateInit_(this.el_), this.el_.hasChildNodes()) {
              for (var _0x2764fc = this.el_.childNodes, _0x2f76bf = this.el_.childNodes.length, _0x55e9b6 = []; _0x2f76bf--;) {
                var _0x4f88e7 = this.el_.childNodes[_0x2f76bf],
                  _0x30bdac = _0x4f88e7.nodeName.toLowerCase();
                "track" === _0x30bdac && (this.featuresNativeTextTracks ? (this.remoteTextTrackEls().addTrackElement_(_0x4f88e7), this.remoteTextTracks().addTrack_(_0x4f88e7.track), !0x1 || this.el_.hasAttribute("crossorigin") || !_0x4412c3.isCrossOrigin(_0x4f88e7.src) || (_0x2a3293 = !0x0)) : _0x55e9b6.push(_0x4f88e7));
              }
              for (var _0x4389eb = 0x0; 0x0 < _0x55e9b6.length; _0x4389eb++) this.el_.removeChild(_0x55e9b6[_0x4389eb]);
            }
            ['audio', "video"].forEach(function (_0x14c7f5) {
              var _0x5c2f9f = _0x56c657["default"](_0x14c7f5);
              if (this["featuresNative" + _0x5c2f9f + "Tracks"]) {
                var _0x2ea282 = this.el()[_0x14c7f5 + 'Tracks'];
                _0x2ea282 && _0x2ea282.addEventListener && (_0x2ea282.addEventListener("change", _0xee95ba.bind(this, this["handle" + _0x5c2f9f + "TrackChange_"])), _0x2ea282.addEventListener("addtrack", _0xee95ba.bind(this, this["handle" + _0x5c2f9f + "TrackAdd_"])), _0x2ea282.addEventListener("removetrack", _0xee95ba.bind(this, this['handle' + _0x5c2f9f + "TrackRemove_"])));
              }
            }), this.featuresNativeTextTracks && (_0x2a3293 && _0x2e7afe['default'].warn(_0x42834c['default'](_0x562336)), this.handleTextTrackChange_ = _0xee95ba.bind(this, this.handleTextTrackChange), this.handleTextTrackAdd_ = _0xee95ba.bind(this, this.handleTextTrackAdd), this.handleTextTrackRemove_ = _0xee95ba.bind(this, this.handleTextTrackRemove), this.proxyNativeTextTracks_()), (_0x120fa4.TOUCH_ENABLED && _0x90dfb1.nativeControlsForTouch === !0x0 || _0x120fa4.IS_IPHONE || _0x120fa4.IS_NATIVE_ANDROID) && this.setControls(!0x0), this.triggerReady();
          }
          return _0x532401(_0x15dfc8, _0x367b60), _0x15dfc8.prototype.dispose = function () {
            ["audio", "video", "text"].forEach(function (_0x17ff46) {
              var _0x139d52 = _0x56c657["default"](_0x17ff46),
                _0x397ffc = this.el_[_0x17ff46 + "Tracks"];
              _0x397ffc && _0x397ffc.removeEventListener && (_0x397ffc.removeEventListener("change", this['handle' + _0x139d52 + 'TrackChange_']), _0x397ffc.removeEventListener("addtrack", this['handle' + _0x139d52 + "TrackAdd_"]), _0x397ffc.removeEventListener("removetrack", this["handle" + _0x139d52 + "TrackRemove_"]));
            }), _0x15dfc8.disposeMediaElement(this.el_), _0x367b60.prototype.dispose.call(this);
          }, _0x15dfc8.prototype.createEl = function () {
            if (!this.options_.tag || this.movingMediaElementInDOM === !0x1) {
              if (this.options_.tag) {
                var _0x5e79ed = this.options_.tag.cloneNode(!0x0);
                this.options_.tag.parentNode.insertBefore(_0x5e79ed, this.options_.tag), _0x15dfc8.disposeMediaElement(this.options_.tag), _0x1865a5 = _0x5e79ed;
              } else {
                _0x1865a5 = _0x39418a["default"].createElement("video");
                var _0x5737a4 = this.options_.tag && _0x3555e0.getElAttributes(this.options_.tag),
                  _0x527e96 = _0x15631d["default"]({}, _0x5737a4);
                _0x120fa4.TOUCH_ENABLED && this.options_.nativeControlsForTouch === !0x0 || delete _0x527e96.controls, _0x3555e0.setElAttributes(this.options_.tag, _0x49e5da["default"](_0x527e96, {
                  'id': this.options_.techId,
                  'class': 'vjs-tech'
                }));
              }
            }
            for (var _0x1d974d = ["autoplay", "preload", "loop", "muted"], _0x1b7dae = _0x1d974d.length - 0x1; _0x1b7dae >= 0x0; _0x1b7dae--) {
              var _0x2e60b5 = _0x1d974d[_0x1b7dae],
                _0x2633eb = {};
              "undefined" != typeof this.options_[_0x2e60b5] && (_0x2633eb[_0x2e60b5] = this.options_[_0x2e60b5]), _0x3555e0.setElAttributes(this.options_.tag, _0x2633eb);
            }
            return this.options_.tag;
          }, _0x15dfc8.prototype.handleLateInit_ = function (_0x1b701f) {
            if (0x0 !== _0x1b701f.networkState && 0x3 !== _0x1b701f.networkState) {
              if (0x0 === _0x1b701f.readyState) {
                var _0x1a27ab = function () {
                  var _0x4700c0 = !0x1,
                    _0x4ff97d = function () {
                      _0x4700c0 = !0x0;
                    };
                  this.on("loadstart", _0x4ff97d);
                  var _0x31bdb9 = function () {
                    _0x4700c0 || this.trigger("loadstart");
                  };
                  return this.on('loadedmetadata', _0x31bdb9), this.ready(function () {
                    this.off('loadstart', _0x4ff97d), this.off("loadedmetadata", _0x31bdb9), _0x4700c0 || this.trigger('loadstart');
                  }), {
                    'v': void 0x0
                  };
                }();
                if ("object" == typeof _0x1a27ab) return _0x1a27ab.v;
              }
              var _0x1a5ed2 = ["loadstart"];
              _0x1a5ed2.push("loadedmetadata"), _0x1b701f.readyState >= 0x2 && _0x1a5ed2.push("loadeddata"), _0x1b701f.readyState >= 0x3 && _0x1a5ed2.push("canplay"), _0x1b701f.readyState >= 0x4 && _0x1a5ed2.push("canplaythrough"), this.ready(function () {
                _0x1a5ed2.forEach(function (_0x16c7fc) {
                  this.trigger(_0x16c7fc);
                }, this);
              });
            }
          }, _0x15dfc8.prototype.proxyNativeTextTracks_ = function () {
            var _0xb98e0e = this.el().textTracks;
            if (_0xb98e0e) {
              for (var _0xd90f65 = 0x0; 0x0 < _0xb98e0e.length; _0xd90f65++) this.textTracks().addTrack_(_0xb98e0e[_0xd90f65]);
              _0xb98e0e.addEventListener && (_0xb98e0e.addEventListener("change", this.handleTextTrackChange_), _0xb98e0e.addEventListener("addtrack", this.handleTextTrackAdd_), _0xb98e0e.addEventListener("removetrack", this.handleTextTrackRemove_));
            }
          }, _0x15dfc8.prototype.handleTextTrackChange = function () {
            var _0x1c102e = this.textTracks();
            this.textTracks().trigger({
              'type': "change",
              'target': _0x1c102e,
              'currentTarget': _0x1c102e,
              'srcElement': _0x1c102e
            });
          }, _0x15dfc8.prototype.handleTextTrackAdd = function (_0x321c72) {
            this.textTracks().addTrack_(_0x321c72.track);
          }, _0x15dfc8.prototype.handleTextTrackRemove = function (_0x409bc7) {
            this.textTracks().removeTrack_(_0x409bc7.track);
          }, _0x15dfc8.prototype.handleVideoTrackChange_ = function () {
            var _0x16f19c = this.videoTracks();
            this.videoTracks().trigger({
              'type': "change",
              'target': _0x16f19c,
              'currentTarget': _0x16f19c,
              'srcElement': _0x16f19c
            });
          }, _0x15dfc8.prototype.handleVideoTrackAdd_ = function (_0x57265d) {
            this.videoTracks().addTrack_(_0x57265d.track);
          }, _0x15dfc8.prototype.handleVideoTrackRemove_ = function (_0x141231) {
            this.videoTracks().removeTrack_(_0x141231.track);
          }, _0x15dfc8.prototype.handleAudioTrackChange_ = function () {
            var _0x186d0e = this.audioTracks();
            this.audioTracks().trigger({
              'type': "change",
              'target': _0x186d0e,
              'currentTarget': _0x186d0e,
              'srcElement': _0x186d0e
            });
          }, _0x15dfc8.prototype.handleAudioTrackAdd_ = function (_0x32bf4a) {
            this.audioTracks().addTrack_(_0x32bf4a.track);
          }, _0x15dfc8.prototype.handleAudioTrackRemove_ = function (_0x17d588) {
            this.audioTracks().removeTrack_(_0x17d588.track);
          }, _0x15dfc8.prototype.play = function () {
            this.el_.play();
          }, _0x15dfc8.prototype.pause = function () {
            this.el_.pause();
          }, _0x15dfc8.prototype.paused = function () {
            return this.el_.paused;
          }, _0x15dfc8.prototype.currentTime = function () {
            return this.el_.currentTime;
          }, _0x15dfc8.prototype.setCurrentTime = function (_0x5aedea) {
            try {
              this.el_.currentTime = _0x5aedea;
            } catch (_0x399741) {
              _0x2e7afe["default"](_0x399741, "Video is not ready. (Video.js)");
            }
          }, _0x15dfc8.prototype.duration = function () {
            return this.el_.duration || 0x0;
          }, _0x15dfc8.prototype.buffered = function () {
            return this.el_.buffered;
          }, _0x15dfc8.prototype.volume = function () {
            return this.el_.volume;
          }, _0x15dfc8.prototype.setVolume = function (_0x3b46b5) {
            this.el_.volume = _0x3b46b5;
          }, _0x15dfc8.prototype.muted = function () {
            return this.el_.muted;
          }, _0x15dfc8.prototype.setMuted = function (_0x4511ca) {
            this.el_.muted = _0x4511ca;
          }, _0x15dfc8.prototype.width = function () {
            return this.el_.offsetWidth;
          }, _0x15dfc8.prototype.height = function () {
            return this.el_.offsetHeight;
          }, _0x15dfc8.prototype.supportsFullScreen = function () {
            if ('function' == typeof this.el_.webkitEnterFullScreen) {
              var _0x220f77 = _0x331d0c['default'].navigator.userAgent;
              if (/Android/.test(_0x220f77) || !/Chrome|Mac OS X 10.5/.test(_0x220f77)) return !0x0;
            }
            return !0x1;
          }, _0x15dfc8.prototype.enterFullScreen = function () {
            "webkitDisplayingFullscreen" in this.el_ && this.one('webkitbeginfullscreen', function () {
              this.one("webkitendfullscreen", function () {
                this.trigger('fullscreenchange', {
                  'isFullscreen': !0x1
                });
              }), this.trigger("fullscreenchange", {
                'isFullscreen': !0x0
              });
            }), this.el_.paused && this.el_.networkState <= this.el_.HAVE_METADATA ? (this.el_.play(), this.setTimeout(function () {
              this.el_.pause(), this.el_.webkitEnterFullScreen();
            }, 0x0)) : this.el_.webkitEnterFullScreen();
          }, _0x15dfc8.prototype.exitFullScreen = function () {
            this.el_.webkitExitFullScreen();
          }, _0x15dfc8.prototype.src = function (_0x5429ec) {
            return void 0x0 === _0x5429ec ? this.el_.src : void this.setSrc(_0x5429ec);
          }, _0x15dfc8.prototype.setSrc = function (_0xe1d8b9) {
            this.el_.src = _0xe1d8b9;
          }, _0x15dfc8.prototype.load = function () {
            this.el_.load();
          }, _0x15dfc8.prototype.reset = function () {
            _0x15dfc8.resetMediaElement(this.el_);
          }, _0x15dfc8.prototype.currentSrc = function () {
            return this.currentSource_ ? this.currentSource_.src : this.el_.currentSrc;
          }, _0x15dfc8.prototype.poster = function () {
            return this.el_.poster;
          }, _0x15dfc8.prototype.setPoster = function (_0x33317f) {
            this.el_.poster = _0x33317f;
          }, _0x15dfc8.prototype.preload = function () {
            return this.el_.preload;
          }, _0x15dfc8.prototype.setPreload = function (_0x38d6a0) {
            this.el_.preload = _0x38d6a0;
          }, _0x15dfc8.prototype.autoplay = function () {
            return this.el_.autoplay;
          }, _0x15dfc8.prototype.setAutoplay = function (_0x35022a) {
            this.el_.autoplay = _0x35022a;
          }, _0x15dfc8.prototype.controls = function () {
            return this.el_.controls;
          }, _0x15dfc8.prototype.setControls = function (_0x5dc047) {
            this.el_.controls = !!_0x5dc047;
          }, _0x15dfc8.prototype.loop = function () {
            return this.el_.loop;
          }, _0x15dfc8.prototype.setLoop = function (_0xdfa90) {
            this.el_.loop = _0xdfa90;
          }, _0x15dfc8.prototype.error = function () {
            return this.el_.error;
          }, _0x15dfc8.prototype.seeking = function () {
            return this.el_.seeking;
          }, _0x15dfc8.prototype.seekable = function () {
            return this.el_.seekable;
          }, _0x15dfc8.prototype.ended = function () {
            return this.el_.ended;
          }, _0x15dfc8.prototype.defaultMuted = function () {
            return this.el_.defaultMuted;
          }, _0x15dfc8.prototype.playbackRate = function () {
            return this.el_.playbackRate;
          }, _0x15dfc8.prototype.played = function () {
            return this.el_.played;
          }, _0x15dfc8.prototype.setPlaybackRate = function (_0x36e976) {
            this.el_.playbackRate = _0x36e976;
          }, _0x15dfc8.prototype.networkState = function () {
            return this.el_.networkState;
          }, _0x15dfc8.prototype.readyState = function () {
            return this.el_.readyState;
          }, _0x15dfc8.prototype.videoWidth = function () {
            return this.el_.videoWidth;
          }, _0x15dfc8.prototype.videoHeight = function () {
            return this.el_.videoHeight;
          }, _0x15dfc8.prototype.textTracks = function () {
            return _0x367b60.prototype.textTracks.call(this);
          }, _0x15dfc8.prototype.addTextTrack = function (_0x175f23, _0x2d0e30, _0x10d160) {
            return this.featuresNativeTextTracks ? this.el_.addTextTrack(_0x175f23, _0x2d0e30, _0x10d160) : _0x367b60.prototype.addTextTrack.call(this, _0x175f23, _0x2d0e30, _0x10d160);
          }, _0x15dfc8.prototype.addRemoteTextTrack = function () {
            var _0x2959a1 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0];
            if (!this.featuresNativeTextTracks) return _0x367b60.prototype.addRemoteTextTrack.call(this, _0x2959a1);
            var _0x5203d9 = _0x39418a['default'].createElement('track');
            return _0x2959a1.kind && (_0x5203d9.kind = _0x2959a1.kind), _0x2959a1.label && (_0x5203d9.label = _0x2959a1.label), (_0x2959a1.language || _0x2959a1.srclang) && (_0x5203d9.srclang = _0x2959a1.language || _0x2959a1.srclang), _0x2959a1['default'] && (_0x5203d9["default"] = _0x2959a1["default"]), _0x2959a1.id && (_0x5203d9.id = _0x2959a1.id), _0x2959a1.src && (_0x5203d9.src = _0x2959a1.src), this.el().appendChild(_0x5203d9), this.remoteTextTrackEls().addTrackElement_(_0x5203d9), this.remoteTextTracks().addTrack_(_0x5203d9.track), _0x5203d9;
          }, _0x15dfc8.prototype.removeRemoteTextTrack = function (_0x3228ae) {
            if (!this.featuresNativeTextTracks) return _0x367b60.prototype.removeRemoteTextTrack.call(this, _0x3228ae);
            var _0x26410a = void 0x0,
              _0x59afb5 = void 0x0,
              _0x126d9e = this.remoteTextTrackEls().getTrackElementByTrack_(_0x3228ae);
            for (this.remoteTextTrackEls().removeTrackElement_(_0x126d9e), this.remoteTextTracks().removeTrack_(_0x3228ae), _0x26410a = this.$$('track'), _0x59afb5 = _0x26410a.length; _0x59afb5--;) (_0x3228ae === _0x26410a[_0x59afb5] || _0x3228ae === _0x26410a[_0x59afb5].track) && this.el().removeChild(_0x26410a[_0x59afb5]);
          }, _0x15dfc8;
        }(_0x44d9da["default"]);
      _0x445473.TEST_VID = _0x39418a["default"].createElement("video");
      var _0x708c10 = _0x39418a["default"].createElement("track");
      _0x708c10.kind = "captions", _0x708c10.srclang = 'en', _0x708c10.label = "English", _0x445473.TEST_VID.appendChild(_0x708c10), _0x445473.isSupported = function () {
        try {
          _0x445473.TEST_VID.volume = 0.5;
        } catch (_0x10e9d8) {
          return !0x1;
        }
        return !!_0x445473.TEST_VID.canPlayType;
      }, _0x44d9da['default'].withSourceHandlers(_0x445473), _0x445473.nativeSourceHandler = {}, _0x445473.nativeSourceHandler.canPlayType = function (_0x219288) {
        try {
          return _0x445473.TEST_VID.canPlayType(_0x219288);
        } catch (_0x550905) {
          return '';
        }
      }, _0x445473.nativeSourceHandler.canHandleSource = function (_0x59e7f2) {
        var _0x106b43;
        return _0x59e7f2.type ? _0x445473.nativeSourceHandler.canPlayType(_0x59e7f2.type) : _0x59e7f2.src ? (_0x106b43 = _0x4412c3.getFileExtension(_0x59e7f2.src), _0x445473.nativeSourceHandler.canPlayType("video/" + _0x106b43)) : '';
      }, _0x445473.nativeSourceHandler.handleSource = function (_0x40e408, _0x7ebba6) {
        _0x7ebba6.setSrc(_0x40e408.src);
      }, _0x445473.nativeSourceHandler.dispose = function () {}, _0x445473.registerSourceHandler(_0x445473.nativeSourceHandler), _0x445473.canControlVolume = function () {
        try {
          var _0x9e3cee = _0x445473.TEST_VID.volume;
          return _0x445473.TEST_VID.volume = _0x9e3cee / 0x2 + 0.1, _0x9e3cee !== _0x445473.TEST_VID.volume;
        } catch (_0x534c88) {
          return !0x1;
        }
      }, _0x445473.canControlPlaybackRate = function () {
        if (_0x120fa4.IS_ANDROID && _0x120fa4.IS_CHROME) return !0x1;
        try {
          var _0x5daabd = _0x445473.TEST_VID.playbackRate;
          return _0x445473.TEST_VID.playbackRate = _0x5daabd / 0x2 + 0.1, _0x5daabd !== _0x445473.TEST_VID.playbackRate;
        } catch (_0x4dcc73) {
          return !0x1;
        }
      }, _0x445473.supportsNativeTextTracks = function () {
        var _0x50b287;
        return _0x50b287 = !!_0x445473.TEST_VID.textTracks, _0x50b287 && _0x445473.TEST_VID.textTracks.length > 0x0 && (_0x50b287 = 'number' != typeof _0x445473.TEST_VID.textTracks[0x0].mode), _0x50b287 && _0x120fa4.IS_FIREFOX && (_0x50b287 = !0x1), !_0x50b287 || "onremovetrack" in _0x445473.TEST_VID.textTracks || (_0x50b287 = !0x1), _0x50b287;
      }, _0x445473.supportsNativeVideoTracks = function () {
        var _0x590309 = !!_0x445473.TEST_VID.videoTracks;
        return _0x590309;
      }, _0x445473.supportsNativeAudioTracks = function () {
        var _0x16ee1c = !!_0x445473.TEST_VID.audioTracks;
        return _0x16ee1c;
      }, _0x445473.Events = ["loadstart", 'suspend', "abort", 'error', "emptied", "stalled", "loadedmetadata", "loadeddata", "canplay", 'canplaythrough', 'playing', "waiting", "seeking", "seeked", "ended", "durationchange", "timeupdate", 'progress', 'play', 'pause', "ratechange", "volumechange"], _0x445473.prototype.featuresVolumeControl = _0x445473.canControlVolume(), _0x445473.prototype.featuresPlaybackRate = _0x445473.canControlPlaybackRate(), _0x445473.prototype.movingMediaElementInDOM = !_0x120fa4.IS_IOS, _0x445473.prototype.featuresFullscreenResize = !0x0, _0x445473.prototype.featuresProgressEvents = !0x0, _0x445473.prototype.featuresNativeTextTracks = _0x445473.supportsNativeTextTracks(), _0x445473.prototype.featuresNativeVideoTracks = _0x445473.supportsNativeVideoTracks(), _0x445473.prototype.featuresNativeAudioTracks = _0x445473.supportsNativeAudioTracks();
      _0x445473.patchCanPlayType = function () {
        _0x120fa4.ANDROID_VERSION >= 0x4 && (void 0x0 || (_0xb22ac0 = _0x445473.TEST_VID.constructor.prototype.canPlayType), _0x445473.TEST_VID.constructor.prototype.canPlayType = function (_0x588b02) {
          return _0x588b02 && /^application\/(?:x-|vnd\.apple\.)mpegurl/i.test(_0x588b02) ? "maybe" : _0xb22ac0.call(this, _0x588b02);
        }), _0x120fa4.IS_OLD_ANDROID && (_0xb22ac0 || (_0xb22ac0 = _0x445473.TEST_VID.constructor.prototype.canPlayType), _0x445473.TEST_VID.constructor.prototype.canPlayType = function (_0x276cf1) {
          return _0x276cf1 && /^video\/mp4/i.test(_0x276cf1) ? "maybe" : _0xb22ac0.call(this, _0x276cf1);
        });
      }, _0x445473.unpatchCanPlayType = function () {
        var _0x4c7e03 = _0x445473.TEST_VID.constructor.prototype.canPlayType;
        return _0x445473.TEST_VID.constructor.prototype.canPlayType = _0xb22ac0, _0xb22ac0 = null, _0x4c7e03;
      }, _0x445473.patchCanPlayType(), _0x445473.disposeMediaElement = function (_0x8a09f) {
        if (_0x8a09f) {
          for (_0x8a09f.parentNode && _0x8a09f.parentNode.removeChild(_0x8a09f); _0x8a09f.hasChildNodes();) _0x8a09f.removeChild(_0x8a09f.firstChild);
          _0x8a09f.removeAttribute("src"), "function" == typeof _0x8a09f.load && !function () {
            try {
              _0x8a09f.load();
            } catch (_0x325dde) {}
          }();
        }
      }, _0x445473.resetMediaElement = function (_0x54fc40) {
        if (_0x54fc40) {
          for (var _0x2b1394 = _0x54fc40.querySelectorAll("source"), _0x4c58ef = _0x2b1394.length; _0x4c58ef--;) _0x54fc40.removeChild(_0x2b1394[_0x4c58ef]);
          _0x54fc40.removeAttribute("src"), "function" == typeof _0x54fc40.load && !function () {
            try {
              _0x54fc40.load();
            } catch (_0x49f5a3) {}
          }();
        }
      }, _0x4917af["default"].registerComponent("Html5", _0x445473), _0x44d9da["default"].registerTech("Html5", _0x445473), _0x1f4768["default"] = _0x445473, _0x2717f6.exports = _0x1f4768['default'];
    }, {
      '../../../src/js/tracks/text-track.js': 0x86,
      '../component': 0x43,
      '../utils/browser.js': 0x8c,
      '../utils/dom.js': 0x8f,
      '../utils/fn.js': 0x91,
      '../utils/log.js': 0x94,
      '../utils/merge-options.js': 0x95,
      '../utils/to-title-case.js': 0x98,
      '../utils/url.js': 0x99,
      './tech.js': 0x7c,
      'global/document': 0x1,
      'global/window': 0x2,
      'object.assign': 0x2d,
      'tsml': 0x37
    }],
    0x7b: [function (_0x3ff701, _0x5a4787, _0x1cb800) {
      'use strict';

      function _0x5d664c(_0xaba861) {
        return _0xaba861 && _0xaba861.__esModule ? _0xaba861 : {
          'default': _0xaba861
        };
      }
      function _0x2f80d6(_0x5988c3, _0x5de6bf) {
        if (!(_0x5988c3 instanceof _0x5de6bf)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x521c2c(_0x533661, _0x4694cd) {
        if ("function" != typeof _0x4694cd && null !== _0x4694cd) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x4694cd);
        _0x533661.prototype = Object.create(_0x4694cd && _0x4694cd.prototype, {
          'constructor': {
            'value': _0x533661,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x4694cd && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x533661, _0x4694cd) : _0x533661.__proto__ = _0x4694cd);
      }
      _0x1cb800.__esModule = !0x0;
      var _0x317926 = _0x3ff701('../component.js'),
        _0x1ddd69 = _0x5d664c(_0x317926),
        _0x349577 = _0x3ff701("./tech.js"),
        _0x43a0df = _0x5d664c(_0x349577),
        _0x4af06e = _0x3ff701("global/window"),
        _0x2ba32b = (_0x5d664c(_0x4af06e), _0x3ff701('../utils/to-title-case.js')),
        _0x5c7744 = _0x5d664c(_0x2ba32b),
        _0x321741 = function (_0x1ca825) {
          function _0x263a4a(_0x5ba4c1, _0x15e5f3, _0x3ee278) {
            if (_0x2f80d6(this, _0x263a4a), _0x1ca825.call(this, _0x5ba4c1, _0x15e5f3, _0x3ee278), _0x15e5f3.playerOptions.sources && 0x0 !== _0x15e5f3.playerOptions.sources.length) _0x5ba4c1.src(_0x15e5f3.playerOptions.sources);else for (var _0x28f457 = 0x0, _0x121a47 = _0x15e5f3.playerOptions.techOrder; 0x0 < _0x121a47.length; _0x28f457++) {
              var _0xc73a3d = _0x5c7744["default"](_0x121a47[_0x28f457]),
                _0x2a0232 = _0x43a0df['default'].getTech(_0xc73a3d);
              if (_0xc73a3d || (_0x2a0232 = _0x1ddd69["default"].getComponent(_0xc73a3d)), _0x2a0232 && _0x2a0232.isSupported()) {
                _0x5ba4c1.loadTech_(_0xc73a3d);
                break;
              }
            }
          }
          return _0x521c2c(_0x263a4a, _0x1ca825), _0x263a4a;
        }(_0x1ddd69["default"]);
      _0x1ddd69["default"].registerComponent('MediaLoader', _0x321741), _0x1cb800['default'] = _0x321741, _0x5a4787.exports = _0x1cb800["default"];
    }, {
      '../component.js': 0x43,
      '../utils/to-title-case.js': 0x98,
      './tech.js': 0x7c,
      'global/window': 0x2
    }],
    0x7c: [function (_0x5b2015, _0x325dc3, _0x19aa86) {
      'use strict';

      function _0x19d6ec(_0xc864b3) {
        if (_0xc864b3 && _0xc864b3.__esModule) return _0xc864b3;
        var _0x2a8300 = {};
        if (null != _0xc864b3) {
          for (var _0x5e7bb3 in _0xc864b3) Object.prototype.hasOwnProperty.call(_0xc864b3, _0x5e7bb3) && (_0x2a8300[_0x5e7bb3] = _0xc864b3[_0x5e7bb3]);
        }
        return _0x2a8300["default"] = _0xc864b3, _0x2a8300;
      }
      function _0x171abf(_0x4ee74a) {
        return _0x4ee74a && _0x4ee74a.__esModule ? _0x4ee74a : {
          'default': _0x4ee74a
        };
      }
      function _0x34fe67(_0x1432c4, _0x236602) {
        if (!(_0x1432c4 instanceof _0x236602)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x586891(_0x1fbd35, _0x33a9d4) {
        if ('function' != typeof _0x33a9d4 && null !== _0x33a9d4) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x33a9d4);
        _0x1fbd35.prototype = Object.create(_0x33a9d4 && _0x33a9d4.prototype, {
          'constructor': {
            'value': _0x1fbd35,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x33a9d4 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x1fbd35, _0x33a9d4) : _0x1fbd35.__proto__ = _0x33a9d4);
      }
      _0x19aa86.__esModule = !0x0;
      var _0x274c29 = _0x5b2015('../component'),
        _0x16a1a6 = _0x171abf(_0x274c29),
        _0x14c3a2 = _0x5b2015("../tracks/html-track-element"),
        _0x55442e = _0x171abf(_0x14c3a2),
        _0x4c4bfa = _0x5b2015('../tracks/html-track-element-list'),
        _0x34e625 = _0x171abf(_0x4c4bfa),
        _0xcbf0d7 = _0x5b2015("../utils/merge-options.js"),
        _0x61dbc4 = _0x171abf(_0xcbf0d7),
        _0x55ac1a = _0x5b2015('../tracks/text-track'),
        _0x470da3 = _0x171abf(_0x55ac1a),
        _0x2c68a6 = _0x5b2015("../tracks/text-track-list"),
        _0x31a609 = _0x171abf(_0x2c68a6),
        _0x2c1e41 = _0x5b2015("../tracks/video-track"),
        _0x2f0563 = (_0x171abf(_0x2c1e41), _0x5b2015("../tracks/video-track-list")),
        _0x5dbecd = _0x171abf(_0x2f0563),
        _0x1a81f4 = _0x5b2015("../tracks/audio-track-list"),
        _0x46ca0d = _0x171abf(_0x1a81f4),
        _0x50bc1f = _0x5b2015("../tracks/audio-track"),
        _0x2b29db = (_0x171abf(_0x50bc1f), _0x5b2015('../utils/fn.js')),
        _0x332c0f = _0x19d6ec(_0x2b29db),
        _0x252704 = _0x5b2015("../utils/log.js"),
        _0x4773d4 = _0x171abf(_0x252704),
        _0x48d375 = _0x5b2015("../utils/time-ranges.js"),
        _0x2126b8 = _0x5b2015('../utils/buffer.js'),
        _0x6693bd = _0x5b2015("../media-error.js"),
        _0xe1457e = _0x171abf(_0x6693bd),
        _0x7594e7 = _0x5b2015("global/window"),
        _0x477a39 = _0x171abf(_0x7594e7),
        _0x4762f8 = _0x5b2015("global/document"),
        _0x11d944 = _0x171abf(_0x4762f8),
        _0x40a83c = function (_0x9197d6) {
          function _0xf73b2e() {
            var _0x13b44e = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0],
              _0x1537fc = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? function () {} : arguments[0x1];
            _0x34fe67(this, _0xf73b2e), _0x13b44e.reportTouchActivity = !0x1, _0x9197d6.call(this, null, _0x13b44e, _0x1537fc), this.hasStarted_ = !0x1, this.on("playing", function () {
              this.hasStarted_ = !0x0;
            }), this.on('loadstart', function () {
              this.hasStarted_ = !0x1;
            }), this.textTracks_ = _0x13b44e.textTracks, this.videoTracks_ = _0x13b44e.videoTracks, this.audioTracks_ = _0x13b44e.audioTracks, this.featuresProgressEvents || this.manualProgressOn(), this.featuresTimeupdateEvents || this.manualTimeUpdatesOn(), (_0x13b44e.nativeCaptions === !0x1 || _0x13b44e.nativeTextTracks === !0x1) && (this.featuresNativeTextTracks = !0x1), this.featuresNativeTextTracks || this.on('ready', this.emulateTextTracks), this.initTextTrackListeners(), this.initTrackListeners(), this.emitTapEvents();
          }
          return _0x586891(_0xf73b2e, _0x9197d6), _0xf73b2e.prototype.manualProgressOn = function () {
            this.on("durationchange", this.onDurationChange), this.manualProgress = !0x0, this.one("ready", this.trackProgress);
          }, _0xf73b2e.prototype.manualProgressOff = function () {
            this.manualProgress = !0x1, this.stopTrackingProgress(), this.off('durationchange', this.onDurationChange);
          }, _0xf73b2e.prototype.trackProgress = function () {
            this.stopTrackingProgress(), this.progressInterval = this.setInterval(_0x332c0f.bind(this, function () {
              var _0x1fb565 = this.bufferedPercent();
              this.bufferedPercent_ !== _0x1fb565 && this.trigger("progress"), this.bufferedPercent_ = _0x1fb565, 0x1 === _0x1fb565 && this.stopTrackingProgress();
            }), 0x1f4);
          }, _0xf73b2e.prototype.onDurationChange = function () {
            this.duration_ = this.duration();
          }, _0xf73b2e.prototype.buffered = function () {
            return _0x48d375.createTimeRange(0x0, 0x0);
          }, _0xf73b2e.prototype.bufferedPercent = function () {
            return _0x2126b8.bufferedPercent(this.buffered(), this.duration_);
          }, _0xf73b2e.prototype.stopTrackingProgress = function () {
            this.clearInterval(this.progressInterval);
          }, _0xf73b2e.prototype.manualTimeUpdatesOn = function () {
            this.manualTimeUpdates = !0x0, this.on('play', this.trackCurrentTime), this.on("pause", this.stopTrackingCurrentTime);
          }, _0xf73b2e.prototype.manualTimeUpdatesOff = function () {
            this.manualTimeUpdates = !0x1, this.stopTrackingCurrentTime(), this.off("play", this.trackCurrentTime), this.off('pause', this.stopTrackingCurrentTime);
          }, _0xf73b2e.prototype.trackCurrentTime = function () {
            this.currentTimeInterval && this.stopTrackingCurrentTime(), this.currentTimeInterval = this.setInterval(function () {
              this.trigger({
                'type': 'timeupdate',
                'target': this,
                'manuallyTriggered': !0x0
              });
            }, 0xfa);
          }, _0xf73b2e.prototype.stopTrackingCurrentTime = function () {
            this.clearInterval(this.currentTimeInterval), this.trigger({
              'type': 'timeupdate',
              'target': this,
              'manuallyTriggered': !0x0
            });
          }, _0xf73b2e.prototype.dispose = function () {
            this.clearTracks(["audio", "video", "text"]), this.manualProgress && this.manualProgressOff(), this.manualTimeUpdates && this.manualTimeUpdatesOff(), _0x9197d6.prototype.dispose.call(this);
          }, _0xf73b2e.prototype.clearTracks = function (_0x4a7d78) {
            _0x4a7d78 = [].concat(_0x4a7d78), _0x4a7d78.forEach(function (_0xd2db8a) {
              for (var _0x3e3a85 = this[_0xd2db8a + "Tracks"]() || [], _0x25e6ae = _0x3e3a85.length; _0x25e6ae--;) {
                var _0x8c981a = _0x3e3a85[_0x25e6ae];
                "text" === _0xd2db8a && this.removeRemoteTextTrack(_0x8c981a), _0x3e3a85.removeTrack_(_0x8c981a);
              }
            });
          }, _0xf73b2e.prototype.reset = function () {}, _0xf73b2e.prototype.error = function (_0x10ae52) {
            return void 0x0 !== _0x10ae52 && (this.error_ = _0x10ae52 instanceof _0xe1457e['default'] ? _0x10ae52 : new _0xe1457e['default'](_0x10ae52), this.trigger("error")), this.error_;
          }, _0xf73b2e.prototype.played = function () {
            return this.hasStarted_ ? _0x48d375.createTimeRange(0x0, 0x0) : _0x48d375.createTimeRange();
          }, _0xf73b2e.prototype.setCurrentTime = function () {
            this.manualTimeUpdates && this.trigger({
              'type': "timeupdate",
              'target': this,
              'manuallyTriggered': !0x0
            });
          }, _0xf73b2e.prototype.initTextTrackListeners = function () {
            var _0x1e7111 = _0x332c0f.bind(this, function () {
                this.trigger("texttrackchange");
              }),
              _0xeeefa7 = this.textTracks();
            _0xeeefa7 && (_0xeeefa7.addEventListener('removetrack', _0x1e7111), _0xeeefa7.addEventListener('addtrack', _0x1e7111), this.on("dispose", _0x332c0f.bind(this, function () {
              _0xeeefa7.removeEventListener('removetrack', _0x1e7111), _0xeeefa7.removeEventListener('addtrack', _0x1e7111);
            })));
          }, _0xf73b2e.prototype.initTrackListeners = function () {
            ["video", "audio"].forEach(function (_0x20777e) {
              var _0x435b98 = function () {
                  this.trigger(_0x20777e + 'trackchange');
                },
                _0x233a81 = this[_0x20777e + "Tracks"]();
              _0x233a81.addEventListener("removetrack", _0x435b98), _0x233a81.addEventListener("addtrack", _0x435b98), this.on("dispose", function () {
                _0x233a81.removeEventListener("removetrack", _0x435b98), _0x233a81.removeEventListener('addtrack', _0x435b98);
              });
            });
          }, _0xf73b2e.prototype.emulateTextTracks = function () {
            var _0x1d20d1 = this.textTracks();
            if (_0x1d20d1) {
              _0x477a39['default'].WebVTT || null == this.el().parentNode || !function () {
                var _0x2ee161 = _0x11d944["default"].createElement("script");
                _0x2ee161.src = this.options_["vtt.js"] || "https://cdn.rawgit.com/gkatsev/vtt.js/vjs-v0.12.1/dist/vtt.min.js", _0x2ee161.onload = function () {
                  this.trigger('vttjsloaded');
                }, _0x2ee161.onerror = function () {
                  this.trigger("vttjserror");
                }, this.on("dispose", function () {
                  _0x2ee161.onload = null, _0x2ee161.onerror = null;
                }), _0x477a39["default"].WebVTT = !0x0, this.el().parentNode.appendChild(_0x2ee161);
              }();
              var _0x4d4022 = function () {
                  return this.trigger("texttrackchange");
                },
                _0x388c1c = function () {
                  _0x4d4022();
                  for (var _0x1135cf = 0x0; 0x0 < _0x1d20d1.length; _0x1135cf++) {
                    var _0x542e82 = _0x1d20d1[_0x1135cf];
                    _0x542e82.removeEventListener('cuechange', _0x4d4022), 'showing' === _0x542e82.mode && _0x542e82.addEventListener("cuechange", _0x4d4022);
                  }
                };
              _0x388c1c(), _0x1d20d1.addEventListener("change", _0x388c1c), this.on("dispose", function () {
                _0x1d20d1.removeEventListener("change", _0x388c1c);
              });
            }
          }, _0xf73b2e.prototype.videoTracks = function () {
            return this.videoTracks_ = this.videoTracks_ || new _0x5dbecd["default"](), this.videoTracks_;
          }, _0xf73b2e.prototype.audioTracks = function () {
            return this.audioTracks_ = this.audioTracks_ || new _0x46ca0d['default'](), this.audioTracks_;
          }, _0xf73b2e.prototype.textTracks = function () {
            return this.textTracks_ = this.textTracks_ || new _0x31a609["default"](), this.textTracks_;
          }, _0xf73b2e.prototype.remoteTextTracks = function () {
            return this.remoteTextTracks_ = this.remoteTextTracks_ || new _0x31a609["default"](), this.remoteTextTracks_;
          }, _0xf73b2e.prototype.remoteTextTrackEls = function () {
            return this.remoteTextTrackEls_ = this.remoteTextTrackEls_ || new _0x34e625["default"](), this.remoteTextTrackEls_;
          }, _0xf73b2e.prototype.addTextTrack = function (_0x5a6826, _0x27ec5c, _0x571aea) {
            if (!_0x5a6826) throw new Error("TextTrack kind is required but was not provided");
            return _0xc40f76(this, _0x5a6826, _0x27ec5c, _0x571aea);
          }, _0xf73b2e.prototype.addRemoteTextTrack = function (_0xbe9e05) {
            var _0x2d6eec = _0x61dbc4["default"](_0xbe9e05, {
                'tech': this
              }),
              _0x3c2517 = new _0x55442e["default"](_0x2d6eec);
            return this.remoteTextTrackEls().addTrackElement_(_0x3c2517), this.remoteTextTracks().addTrack_(_0x3c2517.track), this.textTracks().addTrack_(_0x3c2517.track), _0x3c2517;
          }, _0xf73b2e.prototype.removeRemoteTextTrack = function (_0x2e8f47) {
            this.textTracks().removeTrack_(_0x2e8f47);
            var _0x17cb3b = this.remoteTextTrackEls().getTrackElementByTrack_(_0x2e8f47);
            this.remoteTextTrackEls().removeTrackElement_(_0x17cb3b), this.remoteTextTracks().removeTrack_(_0x2e8f47);
          }, _0xf73b2e.prototype.setPoster = function () {}, _0xf73b2e.prototype.canPlayType = function () {
            return '';
          }, _0xf73b2e.isTech = function (_0x153b8f) {
            return _0x153b8f.prototype instanceof _0xf73b2e || _0x153b8f instanceof _0xf73b2e || _0x153b8f === _0xf73b2e;
          }, _0xf73b2e.registerTech = function (_0xac6f51, _0x309513) {
            if (_0xf73b2e.techs_ || (_0xf73b2e.techs_ = {}), !_0xf73b2e.isTech(_0x309513)) throw new Error("Tech " + _0xac6f51 + '\x20must\x20be\x20a\x20Tech');
            return _0xf73b2e.techs_[_0xac6f51] = _0x309513, _0x309513;
          }, _0xf73b2e.getTech = function (_0x5ecbbc) {
            return _0xf73b2e.techs_ && _0xf73b2e.techs_[_0x5ecbbc] ? _0xf73b2e.techs_[_0x5ecbbc] : _0x477a39["default"] && _0x477a39['default'].videojs && _0x477a39["default"].videojs[_0x5ecbbc] ? (_0x4773d4["default"].warn("The " + _0x5ecbbc + " tech was added to the videojs object when it should be registered using videojs.registerTech(name, tech)"), _0x477a39["default"].videojs[_0x5ecbbc]) : void 0x0;
          }, _0xf73b2e;
        }(_0x16a1a6["default"]);
      _0x40a83c.prototype.videoTracks_;
      var _0xc40f76 = function (_0x15e465, _0x2701e8, _0x5bf361, _0x69e6c8) {
        var _0x2b3b29 = arguments.length <= 0x4 || void 0x0 === arguments[0x4] ? {} : arguments[0x4],
          _0x399463 = _0x15e465.textTracks();
        _0x2b3b29.kind = _0x2701e8, _0x5bf361 && (_0x2b3b29.label = _0x5bf361), _0x69e6c8 && (_0x2b3b29.language = _0x69e6c8), _0x2b3b29.tech = _0x15e465;
        var _0x4f2758 = new _0x470da3['default'](_0x2b3b29);
        return _0x399463.addTrack_(_0x4f2758), _0x4f2758;
      };
      _0x40a83c.prototype.featuresVolumeControl = !0x0, _0x40a83c.prototype.featuresFullscreenResize = !0x1, _0x40a83c.prototype.featuresPlaybackRate = !0x1, _0x40a83c.prototype.featuresProgressEvents = !0x1, _0x40a83c.prototype.featuresTimeupdateEvents = !0x1, _0x40a83c.prototype.featuresNativeTextTracks = !0x1, _0x40a83c.withSourceHandlers = function (_0x1ece24) {
        _0x1ece24.registerSourceHandler = function (_0x5aeb66, _0x54c57e) {
          var _0x18b930 = _0x1ece24.sourceHandlers;
          _0x18b930 || (_0x18b930 = _0x1ece24.sourceHandlers = []), void 0x0 === _0x54c57e && (_0x54c57e = _0x18b930.length), _0x18b930.splice(_0x54c57e, 0x0, _0x5aeb66);
        }, _0x1ece24.canPlayType = function (_0x5c05ec) {
          for (var _0x3fa6e7 = _0x1ece24.sourceHandlers || [], _0x39b55e = void 0x0, _0x34c40a = 0x0; 0x0 < _0x3fa6e7.length; _0x34c40a++) if (_0x39b55e = _0x3fa6e7[_0x34c40a].canPlayType(_0x5c05ec)) return _0x39b55e;
          return '';
        }, _0x1ece24.selectSourceHandler = function (_0x59e214) {
          for (var _0x585dee = _0x1ece24.sourceHandlers || [], _0x523354 = void 0x0, _0xf18901 = 0x0; 0x0 < _0x585dee.length; _0xf18901++) if (_0x523354 = _0x585dee[_0xf18901].canHandleSource(_0x59e214)) return _0x585dee[_0xf18901];
          return null;
        }, _0x1ece24.canPlaySource = function (_0x72b6c0) {
          var _0x221d30 = _0x1ece24.selectSourceHandler(_0x72b6c0);
          return _0x221d30 ? _0x221d30.canHandleSource(_0x72b6c0) : '';
        };
        ['seekable', "duration"].forEach(function (_0x9d93e9) {
          var _0x1c53cc = this[_0x9d93e9];
          "function" == typeof _0x1c53cc && (this[_0x9d93e9] = function () {
            return this.sourceHandler_ && this.sourceHandler_[_0x9d93e9] ? this.sourceHandler_[_0x9d93e9].apply(this.sourceHandler_, arguments) : _0x1c53cc.apply(this, arguments);
          });
        }, _0x1ece24.prototype), _0x1ece24.prototype.setSource = function (_0x23eb58) {
          var _0x4d5a63 = _0x1ece24.selectSourceHandler(_0x23eb58);
          return _0x4d5a63 || (_0x1ece24.nativeSourceHandler ? _0x4d5a63 = _0x1ece24.nativeSourceHandler : _0x4773d4["default"].error("No source hander found for the current source.")), this.disposeSourceHandler(), this.off("dispose", this.disposeSourceHandler), this.currentSource_ && (this.clearTracks(["audio", "video"]), this.currentSource_ = null), _0x4d5a63 !== _0x1ece24.nativeSourceHandler && (this.currentSource_ = _0x23eb58, this.off(this.el_, "loadstart", _0x1ece24.prototype.firstLoadStartListener_), this.off(this.el_, "loadstart", _0x1ece24.prototype.successiveLoadStartListener_), this.one(this.el_, 'loadstart', _0x1ece24.prototype.firstLoadStartListener_)), this.sourceHandler_ = _0x4d5a63.handleSource(_0x23eb58, this, this.options_), this.on("dispose", this.disposeSourceHandler), this;
        }, _0x1ece24.prototype.firstLoadStartListener_ = function () {
          this.one(this.el_, 'loadstart', _0x1ece24.prototype.successiveLoadStartListener_);
        }, _0x1ece24.prototype.successiveLoadStartListener_ = function () {
          this.currentSource_ = null, this.disposeSourceHandler(), this.one(this.el_, "loadstart", _0x1ece24.prototype.successiveLoadStartListener_);
        }, _0x1ece24.prototype.disposeSourceHandler = function () {
          this.sourceHandler_ && this.sourceHandler_.dispose && (this.off(this.el_, "loadstart", _0x1ece24.prototype.firstLoadStartListener_), this.off(this.el_, "loadstart", _0x1ece24.prototype.successiveLoadStartListener_), this.sourceHandler_.dispose(), this.sourceHandler_ = null);
        };
      }, _0x16a1a6["default"].registerComponent("Tech", _0x40a83c), _0x16a1a6["default"].registerComponent("MediaTechController", _0x40a83c), _0x40a83c.registerTech("Tech", _0x40a83c), _0x19aa86["default"] = _0x40a83c, _0x325dc3.exports = _0x19aa86["default"];
    }, {
      '../component': 0x43,
      '../media-error.js': 0x6c,
      '../tracks/audio-track': 0x7e,
      '../tracks/audio-track-list': 0x7d,
      '../tracks/html-track-element': 0x80,
      '../tracks/html-track-element-list': 0x7f,
      '../tracks/text-track': 0x86,
      '../tracks/text-track-list': 0x84,
      '../tracks/video-track': 0x8b,
      '../tracks/video-track-list': 0x8a,
      '../utils/buffer.js': 0x8d,
      '../utils/fn.js': 0x91,
      '../utils/log.js': 0x94,
      '../utils/merge-options.js': 0x95,
      '../utils/time-ranges.js': 0x97,
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x7d: [function (_0x2558cc, _0x3a07e7, _0x2790ec) {
      'use strict';

      function _0x3e7dca(_0xc6ff6c) {
        if (_0xc6ff6c && _0xc6ff6c.__esModule) return _0xc6ff6c;
        var _0x36fa90 = {};
        if (null != _0xc6ff6c) {
          for (var _0x2852c0 in _0xc6ff6c) Object.prototype.hasOwnProperty.call(_0xc6ff6c, _0x2852c0) && (_0x36fa90[_0x2852c0] = _0xc6ff6c[_0x2852c0]);
        }
        return _0x36fa90['default'] = _0xc6ff6c, _0x36fa90;
      }
      function _0x15c59d(_0x9439e8) {
        return _0x9439e8 && _0x9439e8.__esModule ? _0x9439e8 : {
          'default': _0x9439e8
        };
      }
      function _0x144036(_0x1c6d83, _0x4033c5) {
        if (!(_0x1c6d83 instanceof _0x4033c5)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x59d6c3(_0x86b931, _0x52a169) {
        if ("function" != typeof _0x52a169 && null !== _0x52a169) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x52a169);
        _0x86b931.prototype = Object.create(_0x52a169 && _0x52a169.prototype, {
          'constructor': {
            'value': _0x86b931,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x52a169 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x86b931, _0x52a169) : _0x86b931.__proto__ = _0x52a169);
      }
      _0x2790ec.__esModule = !0x0;
      var _0x475a56 = _0x2558cc('./track-list'),
        _0x3333e2 = _0x15c59d(_0x475a56),
        _0x1baf18 = _0x2558cc("../utils/browser.js"),
        _0x393de3 = _0x3e7dca(_0x1baf18),
        _0x1ee59f = _0x2558cc("global/document"),
        _0x5143ef = _0x15c59d(_0x1ee59f),
        _0x2f6d4b = function (_0x16cd40, _0x3c170b) {
          for (var _0x2e8256 = 0x0; 0x0 < _0x16cd40.length; _0x2e8256++) _0x3c170b.id !== _0x16cd40[_0x2e8256].id && (_0x16cd40[_0x2e8256].enabled = !0x1);
        },
        _0x362337 = function (_0x47dd03) {
          function _0x5035cf() {
            var _0x4bb909 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0];
            _0x144036(this, _0x5035cf);
            for (var _0x5ecd48 = void 0x0, _0x3cc835 = _0x4bb909.length - 0x1; _0x3cc835 >= 0x0; _0x3cc835--) if (_0x4bb909[_0x3cc835].enabled) {
              _0x2f6d4b(_0x4bb909, _0x4bb909[_0x3cc835]);
              break;
            }
            if (_0x393de3.IS_IE8) {
              _0x5ecd48 = _0x5143ef["default"].createElement('custom');
              for (var _0x5c8cef in _0x3333e2["default"].prototype) 'constructor' !== _0x5c8cef && (_0x5ecd48[_0x5c8cef] = _0x3333e2["default"].prototype[_0x5c8cef]);
              for (var _0x5c8cef in _0x5035cf.prototype) "constructor" !== _0x5c8cef && (_0x5ecd48[_0x5c8cef] = _0x5035cf.prototype[_0x5c8cef]);
            }
            return _0x5ecd48 = _0x47dd03.call(this, _0x4bb909, _0x5ecd48), _0x5ecd48.changing_ = !0x1, _0x5ecd48;
          }
          return _0x59d6c3(_0x5035cf, _0x47dd03), _0x5035cf.prototype.addTrack_ = function (_0xfd5cc8) {
            _0xfd5cc8.enabled && _0x2f6d4b(this, _0xfd5cc8), _0x47dd03.prototype.addTrack_.call(this, _0xfd5cc8), _0xfd5cc8.addEventListener && _0xfd5cc8.addEventListener('enabledchange', function () {
              this.changing_ || (this.changing_ = !0x0, _0x2f6d4b(this, _0xfd5cc8), this.changing_ = !0x1, this.trigger("change"));
            });
          }, _0x5035cf.prototype.addTrack = function (_0x2fe794) {
            this.addTrack_(_0x2fe794);
          }, _0x5035cf.prototype.removeTrack = function (_0x47af22) {
            _0x47dd03.prototype.removeTrack_.call(this, _0x47af22);
          }, _0x5035cf;
        }(_0x3333e2["default"]);
      _0x2790ec["default"] = _0x362337, _0x3a07e7.exports = _0x2790ec["default"];
    }, {
      '../utils/browser.js': 0x8c,
      './track-list': 0x88,
      'global/document': 0x1
    }],
    0x7e: [function (_0x35be8c, _0x6f21f1, _0x261348) {
      'use strict';

      function _0x15a062(_0xa017fd) {
        if (_0xa017fd && _0xa017fd.__esModule) return _0xa017fd;
        var _0x168574 = {};
        if (null != _0xa017fd) {
          for (var _0xfb8fdd in _0xa017fd) Object.prototype.hasOwnProperty.call(_0xa017fd, _0xfb8fdd) && (_0x168574[_0xfb8fdd] = _0xa017fd[_0xfb8fdd]);
        }
        return _0x168574["default"] = _0xa017fd, _0x168574;
      }
      function _0x572b88(_0x1bc109) {
        return _0x1bc109 && _0x1bc109.__esModule ? _0x1bc109 : {
          'default': _0x1bc109
        };
      }
      function _0x18d34a(_0x576a41, _0x40cf45) {
        if (!(_0x576a41 instanceof _0x40cf45)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x352fde(_0x2df9a2, _0x1e417b) {
        if ("function" != typeof _0x1e417b && null !== _0x1e417b) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x1e417b);
        _0x2df9a2.prototype = Object.create(_0x1e417b && _0x1e417b.prototype, {
          'constructor': {
            'value': _0x2df9a2,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x1e417b && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2df9a2, _0x1e417b) : _0x2df9a2.__proto__ = _0x1e417b);
      }
      _0x261348.__esModule = !0x0;
      var _0xfaa7e0 = _0x35be8c("./track-enums"),
        _0x302481 = _0x35be8c('./track'),
        _0x11113a = _0x572b88(_0x302481),
        _0x5c4d75 = _0x35be8c("../utils/merge-options"),
        _0x5d6434 = _0x572b88(_0x5c4d75),
        _0x1cf81d = _0x35be8c("../utils/browser.js"),
        _0x5ed21c = _0x15a062(_0x1cf81d),
        _0x4d2100 = function (_0x96c069) {
          function _0x4cd298() {
            var _0x1d5408 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0];
            _0x18d34a(this, _0x4cd298);
            var _0x5ae103 = _0x5d6434["default"](_0x1d5408, {
                'kind': _0xfaa7e0.AudioTrackKind[_0x1d5408.kind] || ''
              }),
              _0x2d8d4b = _0x96c069.call(this, _0x5ae103),
              _0x4aaa1d = !0x1;
            if (_0x5ed21c.IS_IE8) {
              for (var _0x125599 in _0x4cd298.prototype) "constructor" !== _0x125599 && (_0x2d8d4b[_0x125599] = _0x4cd298.prototype[_0x125599]);
            }
            return Object.defineProperty(_0x2d8d4b, 'enabled', {
              'get': function () {
                return _0x4aaa1d;
              },
              'set': function (_0x3c6251) {
                "boolean" == typeof _0x3c6251 && _0x3c6251 !== _0x4aaa1d && (_0x4aaa1d = _0x3c6251, this.trigger("enabledchange"));
              }
            }), _0x5ae103.enabled && (_0x2d8d4b.enabled = _0x5ae103.enabled), _0x2d8d4b.loaded_ = !0x0, _0x2d8d4b;
          }
          return _0x352fde(_0x4cd298, _0x96c069), _0x4cd298;
        }(_0x11113a["default"]);
      _0x261348["default"] = _0x4d2100, _0x6f21f1.exports = _0x261348["default"];
    }, {
      '../utils/browser.js': 0x8c,
      '../utils/merge-options': 0x95,
      './track': 0x89,
      './track-enums': 0x87
    }],
    0x7f: [function (_0x192b43, _0x5d60ee, _0x1ec9fd) {
      'use strict';

      function _0x23198c(_0x5a791a) {
        return _0x5a791a && _0x5a791a.__esModule ? _0x5a791a : {
          'default': _0x5a791a
        };
      }
      function _0x593c2c(_0x463f8f) {
        if (_0x463f8f && _0x463f8f.__esModule) return _0x463f8f;
        var _0x22d277 = {};
        if (null != _0x463f8f) {
          for (var _0x17970a in _0x463f8f) Object.prototype.hasOwnProperty.call(_0x463f8f, _0x17970a) && (_0x22d277[_0x17970a] = _0x463f8f[_0x17970a]);
        }
        return _0x22d277["default"] = _0x463f8f, _0x22d277;
      }
      function _0x2f2e73(_0x1621be, _0x3fd04a) {
        if (!(_0x1621be instanceof _0x3fd04a)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      _0x1ec9fd.__esModule = !0x0;
      var _0x275a6a = _0x192b43('../utils/browser.js'),
        _0x15185c = _0x593c2c(_0x275a6a),
        _0x5aa500 = _0x192b43("global/document"),
        _0x2e9176 = _0x23198c(_0x5aa500),
        _0x1d062b = function () {
          function _0x4a2dfd() {
            var _0x1f188e = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0];
            _0x2f2e73(this, _0x4a2dfd);
            var _0x4cb5e5 = this;
            if (_0x15185c.IS_IE8) {
              _0x4cb5e5 = _0x2e9176['default'].createElement("custom");
              for (var _0x3bf830 in _0x4a2dfd.prototype) "constructor" !== _0x3bf830 && (_0x4cb5e5[_0x3bf830] = _0x4a2dfd.prototype[_0x3bf830]);
            }
            _0x4cb5e5.trackElements_ = [], Object.defineProperty(_0x4cb5e5, "length", {
              'get': function () {
                return this.trackElements_.length;
              }
            });
            for (var _0x57f801 = 0x0, _0x448b1d = _0x1f188e.length; _0x448b1d > 0x0; _0x57f801++) _0x4cb5e5.addTrackElement_(_0x1f188e[_0x57f801]);
            return _0x15185c.IS_IE8 ? _0x4cb5e5 : void 0x0;
          }
          return _0x4a2dfd.prototype.addTrackElement_ = function (_0x1c1106) {
            this.trackElements_.push(_0x1c1106);
          }, _0x4a2dfd.prototype.getTrackElementByTrack_ = function (_0x180378) {
            for (var _0xa3a23e = void 0x0, _0x594df7 = 0x0, _0x332c8f = this.trackElements_.length; this.trackElements_.length > 0x0; _0x594df7++) if (_0x180378 === this.trackElements_[_0x594df7].track) {
              _0xa3a23e = this.trackElements_[_0x594df7];
              break;
            }
            return _0xa3a23e;
          }, _0x4a2dfd.prototype.removeTrackElement_ = function (_0xe4ab5f) {
            for (var _0x319aa3 = 0x0, _0x2c79c0 = this.trackElements_.length; this.trackElements_.length > 0x0; _0x319aa3++) if (_0xe4ab5f === this.trackElements_[_0x319aa3]) {
              this.trackElements_.splice(_0x319aa3, 0x1);
              break;
            }
          }, _0x4a2dfd;
        }();
      _0x1ec9fd["default"] = _0x1d062b, _0x5d60ee.exports = _0x1ec9fd["default"];
    }, {
      '../utils/browser.js': 0x8c,
      'global/document': 0x1
    }],
    0x80: [function (_0x1f6a57, _0x49a075, _0x257a8b) {
      'use strict';

      function _0x4815aa(_0x20ecf4) {
        return _0x20ecf4 && _0x20ecf4.__esModule ? _0x20ecf4 : {
          'default': _0x20ecf4
        };
      }
      function _0x27ba31(_0x1684cb) {
        if (_0x1684cb && _0x1684cb.__esModule) return _0x1684cb;
        var _0x175ac5 = {};
        if (null != _0x1684cb) {
          for (var _0x2fac99 in _0x1684cb) Object.prototype.hasOwnProperty.call(_0x1684cb, _0x2fac99) && (_0x175ac5[_0x2fac99] = _0x1684cb[_0x2fac99]);
        }
        return _0x175ac5["default"] = _0x1684cb, _0x175ac5;
      }
      function _0xed5d6a(_0x321c6f, _0x3ec16b) {
        if (!(_0x321c6f instanceof _0x3ec16b)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x438f3f(_0x2b5ce9, _0xbfb6c4) {
        if ("function" != typeof _0xbfb6c4 && null !== _0xbfb6c4) throw new TypeError("Super expression must either be null or a function, not " + typeof _0xbfb6c4);
        _0x2b5ce9.prototype = Object.create(_0xbfb6c4 && _0xbfb6c4.prototype, {
          'constructor': {
            'value': _0x2b5ce9,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0xbfb6c4 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x2b5ce9, _0xbfb6c4) : _0x2b5ce9.__proto__ = _0xbfb6c4);
      }
      _0x257a8b.__esModule = !0x0;
      var _0x37cf0b = _0x1f6a57("../utils/browser.js"),
        _0x39f348 = _0x27ba31(_0x37cf0b),
        _0x4b0dd8 = _0x1f6a57("global/document"),
        _0x43cdfc = _0x4815aa(_0x4b0dd8),
        _0x4fd71e = _0x1f6a57("../event-target"),
        _0x558ff6 = _0x4815aa(_0x4fd71e),
        _0x6ad20b = _0x1f6a57("../tracks/text-track"),
        _0x495e98 = _0x4815aa(_0x6ad20b),
        _0x5ecc8f = 0x0,
        _0x16dbee = 0x2,
        _0x1c2d0b = function (_0x1d5c20) {
          function _0xe937e0() {
            var _0x5a070e = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0];
            _0xed5d6a(this, _0xe937e0), _0x1d5c20.call(this);
            var _0x2b0690 = this;
            if (_0x39f348.IS_IE8) {
              _0x2b0690 = _0x43cdfc['default'].createElement("custom");
              for (var _0x4a83a0 in _0xe937e0.prototype) "constructor" !== _0x4a83a0 && (_0x2b0690[_0x4a83a0] = _0xe937e0.prototype[_0x4a83a0]);
            }
            var _0x345075 = new _0x495e98['default'](_0x5a070e);
            return _0x2b0690.kind = _0x345075.kind, _0x2b0690.src = _0x345075.src, _0x2b0690.srclang = _0x345075.language, _0x2b0690.label = _0x345075.label, _0x2b0690['default'] = _0x345075["default"], Object.defineProperty(_0x2b0690, "readyState", {
              'get': function () {
                return void 0x0;
              }
            }), Object.defineProperty(_0x2b0690, 'track', {
              'get': function () {
                return _0x345075;
              }
            }), _0x8fb173 = _0x5ecc8f, _0x345075.addEventListener("loadeddata", function () {
              _0x8fb173 = _0x16dbee, _0x2b0690.trigger({
                'type': "load",
                'target': _0x2b0690
              });
            }), _0x39f348.IS_IE8 ? _0x2b0690 : void 0x0;
          }
          return _0x438f3f(_0xe937e0, _0x1d5c20), _0xe937e0;
        }(_0x558ff6["default"]);
      _0x1c2d0b.prototype.allowedEvents_ = {
        'load': "load"
      }, _0x1c2d0b.NONE = _0x5ecc8f, _0x1c2d0b.LOADING = 0x1, _0x1c2d0b.LOADED = _0x16dbee, _0x1c2d0b.ERROR = 0x3, _0x257a8b["default"] = _0x1c2d0b, _0x49a075.exports = _0x257a8b["default"];
    }, {
      '../event-target': 0x68,
      '../tracks/text-track': 0x86,
      '../utils/browser.js': 0x8c,
      'global/document': 0x1
    }],
    0x81: [function (_0x1ab465, _0x261281, _0x253792) {
      'use strict';

      function _0x38b87d(_0x171091) {
        return _0x171091 && _0x171091.__esModule ? _0x171091 : {
          'default': _0x171091
        };
      }
      function _0x59ec3d(_0x4244f7) {
        if (_0x4244f7 && _0x4244f7.__esModule) return _0x4244f7;
        var _0x1d4908 = {};
        if (null != _0x4244f7) {
          for (var _0x8fcdd4 in _0x4244f7) Object.prototype.hasOwnProperty.call(_0x4244f7, _0x8fcdd4) && (_0x1d4908[_0x8fcdd4] = _0x4244f7[_0x8fcdd4]);
        }
        return _0x1d4908["default"] = _0x4244f7, _0x1d4908;
      }
      function _0x523ba2(_0x165491, _0x1783e0) {
        if (!(_0x165491 instanceof _0x1783e0)) throw new TypeError("Cannot call a class as a function");
      }
      _0x253792.__esModule = !0x0;
      var _0x587643 = _0x1ab465('../utils/browser.js'),
        _0x4825a5 = _0x59ec3d(_0x587643),
        _0x4e1718 = _0x1ab465("global/document"),
        _0x32cf35 = _0x38b87d(_0x4e1718),
        _0x3dff6e = function () {
          function _0x4425d0(_0x9aca85) {
            _0x523ba2(this, _0x4425d0);
            var _0x3d9faa = this;
            if (_0x4825a5.IS_IE8) {
              _0x3d9faa = _0x32cf35["default"].createElement("custom");
              for (var _0x32d4f8 in _0x4425d0.prototype) 'constructor' !== _0x32d4f8 && (_0x3d9faa[_0x32d4f8] = _0x4425d0.prototype[_0x32d4f8]);
            }
            return _0x4425d0.prototype.setCues_.call(_0x3d9faa, _0x9aca85), Object.defineProperty(_0x3d9faa, "length", {
              'get': function () {
                return this.length_;
              }
            }), _0x4825a5.IS_IE8 ? _0x3d9faa : void 0x0;
          }
          return _0x4425d0.prototype.setCues_ = function (_0x47aa4c) {
            var _0x1159ea = this.length || 0x0,
              _0x493880 = 0x0,
              _0xbfd057 = _0x47aa4c.length;
            this.cues_ = _0x47aa4c, this.length_ = _0x47aa4c.length;
            var _0xfa50f8 = function (_0x3868f4) {
              '' + _0x3868f4 in this || Object.defineProperty(this, '' + _0x3868f4, {
                'get': function () {
                  return this.cues_[_0x3868f4];
                }
              });
            };
            if (_0xbfd057 > _0x1159ea) {
              for (_0x493880 = _0x1159ea; _0xbfd057 > _0x493880; _0x493880++) _0xfa50f8.call(this, _0x493880);
            }
          }, _0x4425d0.prototype.getCueById = function (_0x3fd6b7) {
            for (var _0x20f864 = null, _0x3ba5e9 = 0x0, _0x5c8ef8 = this.length; this.length > 0x0; _0x3ba5e9++) {
              var _0x4d9450 = this[_0x3ba5e9];
              if (_0x4d9450.id === _0x3fd6b7) {
                _0x20f864 = _0x4d9450;
                break;
              }
            }
            return _0x20f864;
          }, _0x4425d0;
        }();
      _0x253792["default"] = _0x3dff6e, _0x261281.exports = _0x253792["default"];
    }, {
      '../utils/browser.js': 0x8c,
      'global/document': 0x1
    }],
    0x82: [function (_0x509672, _0x56208e, _0x106d60) {
      'use strict';

      function _0x2f9d1a(_0x5d6822) {
        if (_0x5d6822 && _0x5d6822.__esModule) return _0x5d6822;
        var _0x23b9c1 = {};
        if (null != _0x5d6822) {
          for (var _0x509930 in _0x5d6822) Object.prototype.hasOwnProperty.call(_0x5d6822, _0x509930) && (_0x23b9c1[_0x509930] = _0x5d6822[_0x509930]);
        }
        return _0x23b9c1["default"] = _0x5d6822, _0x23b9c1;
      }
      function _0xcc3cab(_0x88d35) {
        return _0x88d35 && _0x88d35.__esModule ? _0x88d35 : {
          'default': _0x88d35
        };
      }
      function _0x14d7ca(_0x3c6ae7, _0x39c815) {
        if (!(_0x3c6ae7 instanceof _0x39c815)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x11af68(_0x414a4d, _0x161f39) {
        if ("function" != typeof _0x161f39 && null !== _0x161f39) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x161f39);
        _0x414a4d.prototype = Object.create(_0x161f39 && _0x161f39.prototype, {
          'constructor': {
            'value': _0x414a4d,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x161f39 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x414a4d, _0x161f39) : _0x414a4d.__proto__ = _0x161f39);
      }
      function _0x1192c9(_0x4f115e, _0x5bc551) {
        return "rgba(" + parseInt(_0x4f115e[0x1] + _0x4f115e[0x1], 0x10) + ',' + parseInt(_0x4f115e[0x2] + _0x4f115e[0x2], 0x10) + ',' + parseInt(_0x4f115e[0x3] + _0x4f115e[0x3], 0x10) + ',' + _0x5bc551 + ')';
      }
      function _0x47d4ed(_0x17d3af, _0x9596a7, _0x3bc41f) {
        try {
          _0x17d3af.style[_0x9596a7] = _0x3bc41f;
        } catch (_0x4229a3) {}
      }
      _0x106d60.__esModule = !0x0;
      var _0x39e1af = _0x509672("../component"),
        _0x2842eb = _0xcc3cab(_0x39e1af),
        _0x1bd488 = _0x509672("../menu/menu.js"),
        _0x986613 = (_0xcc3cab(_0x1bd488), _0x509672("../menu/menu-item.js")),
        _0x33f042 = (_0xcc3cab(_0x986613), _0x509672('../menu/menu-button.js')),
        _0x45cace = (_0xcc3cab(_0x33f042), _0x509672('../utils/fn.js')),
        _0x283300 = _0x2f9d1a(_0x45cace),
        _0x1d7ea5 = _0x509672("global/document"),
        _0x49c1ae = (_0xcc3cab(_0x1d7ea5), _0x509672("global/window")),
        _0xff1e4f = _0xcc3cab(_0x49c1ae),
        _0x35354c = "#222",
        _0x34b51d = '#ccc',
        _0x12a0b7 = function (_0x150a80) {
          function _0x5086c2(_0x2ed4f4, _0x346f7c, _0x17b2ac) {
            _0x14d7ca(this, _0x5086c2), _0x150a80.call(this, _0x2ed4f4, _0x346f7c, _0x17b2ac), _0x2ed4f4.on("loadstart", _0x283300.bind(this, this.toggleDisplay)), _0x2ed4f4.on("texttrackchange", _0x283300.bind(this, this.updateDisplay)), _0x2ed4f4.ready(_0x283300.bind(this, function () {
              if (_0x2ed4f4.tech_ && _0x2ed4f4.tech_.featuresNativeTextTracks) return void this.hide();
              _0x2ed4f4.on('fullscreenchange', _0x283300.bind(this, this.updateDisplay));
              for (var _0x465627 = this.options_.playerOptions.tracks || [], _0x1d4fe6 = 0x0; 0x0 < _0x465627.length; _0x1d4fe6++) {
                var _0x568c16 = _0x465627[_0x1d4fe6];
                this.player_.addRemoteTextTrack(_0x568c16);
              }
              var _0x28f625 = this.player_.textTracks();
              if (_0x28f625) {
                for (var _0x1d4fe6 = 0x0; 0x0 < _0x28f625.length; _0x1d4fe6++) {
                  var _0x568c16 = _0x28f625[_0x1d4fe6];
                  _0x568c16['default'] && ("descriptions" !== _0x568c16.kind || void 0x0 ? _0x568c16.kind in {
                    'captions': 0x1,
                    'subtitles': 0x1
                  } && !void 0x0 && (_0x446a2e = _0x568c16) : _0x1a110c = _0x568c16);
                }
                _0x446a2e ? _0x446a2e.mode = "showing" : _0x1a110c && (_0x1a110c.mode = "showing");
              }
            }));
          }
          return _0x11af68(_0x5086c2, _0x150a80), _0x5086c2.prototype.toggleDisplay = function () {
            this.player_.tech_ && this.player_.tech_.featuresNativeTextTracks ? this.hide() : this.show();
          }, _0x5086c2.prototype.createEl = function () {
            return _0x150a80.prototype.createEl.call(this, "div", {
              'className': "vjs-text-track-display"
            }, {
              'aria-live': 'assertive',
              'aria-atomic': "true"
            });
          }, _0x5086c2.prototype.clearDisplay = function () {
            "function" == typeof _0xff1e4f["default"].WebVTT && _0xff1e4f["default"].WebVTT.processCues(_0xff1e4f["default"], [], this.el_);
          }, _0x5086c2.prototype.updateDisplay = function () {
            var _0x25673b = this.player_.textTracks();
            if (this.clearDisplay(), _0x25673b) {
              for (var _0x5f04ed = null, _0x57578d = null, _0x3d62de = _0x25673b.length; _0x3d62de--;) {
                var _0x251c85 = _0x25673b[_0x3d62de];
                "showing" === _0x251c85.mode && ("descriptions" === _0x251c85.kind ? _0x5f04ed = _0x251c85 : _0x57578d = _0x251c85);
              }
              _0x57578d ? this.updateForTrack(_0x57578d) : _0x5f04ed && this.updateForTrack(_0x5f04ed);
            }
          }, _0x5086c2.prototype.updateForTrack = function (_0x371691) {
            if ("function" == typeof _0xff1e4f["default"].WebVTT && _0x371691.activeCues) {
              for (var _0x50dd05 = this.player_.textTrackSettings.getValues(), _0x65932c = [], _0xa4349c = 0x0; 0x0 < _0x371691.activeCues.length; _0xa4349c++) _0x65932c.push(_0x371691.activeCues[_0xa4349c]);
              _0xff1e4f["default"].WebVTT.processCues(_0xff1e4f["default"], _0x65932c, this.el_);
              for (var _0x94c080 = _0x65932c.length; _0x94c080--;) {
                var _0x695dab = _0x65932c[_0x94c080];
                if (_0x695dab) {
                  var _0x7db611 = _0x695dab.displayState;
                  if (_0x50dd05.color && (_0x7db611.firstChild.style.color = _0x50dd05.color), _0x50dd05.textOpacity && _0x47d4ed(_0x7db611.firstChild, 'color', _0x1192c9(_0x50dd05.color || '#fff', _0x50dd05.textOpacity)), _0x50dd05.backgroundColor && (_0x7db611.firstChild.style.backgroundColor = _0x50dd05.backgroundColor), _0x50dd05.backgroundOpacity && _0x47d4ed(_0x7db611.firstChild, "backgroundColor", _0x1192c9(_0x50dd05.backgroundColor || '#000', _0x50dd05.backgroundOpacity)), _0x50dd05.windowColor && (_0x50dd05.windowOpacity ? _0x47d4ed(_0x7db611, "backgroundColor", _0x1192c9(_0x50dd05.windowColor, _0x50dd05.windowOpacity)) : _0x7db611.style.backgroundColor = _0x50dd05.windowColor), _0x50dd05.edgeStyle && ('dropshadow' === _0x50dd05.edgeStyle ? _0x7db611.firstChild.style.textShadow = "2px 2px 3px " + _0x35354c + ", 2px 2px 4px " + _0x35354c + ", 2px 2px 5px " + _0x35354c : 'raised' === _0x50dd05.edgeStyle ? _0x7db611.firstChild.style.textShadow = "1px 1px " + _0x35354c + ", 2px 2px " + _0x35354c + ", 3px 3px " + _0x35354c : "depressed" === _0x50dd05.edgeStyle ? _0x7db611.firstChild.style.textShadow = "1px 1px " + _0x34b51d + ',\x200\x201px\x20' + _0x34b51d + ", -1px -1px " + _0x35354c + ", 0 -1px " + _0x35354c : "uniform" === _0x50dd05.edgeStyle && (_0x7db611.firstChild.style.textShadow = "0 0 4px " + _0x35354c + ',\x200\x200\x204px\x20' + _0x35354c + ", 0 0 4px " + _0x35354c + ", 0 0 4px " + _0x35354c)), _0x50dd05.fontPercent && 0x1 !== _0x50dd05.fontPercent) {
                    var _0x27309e = _0xff1e4f["default"].parseFloat(_0x7db611.style.fontSize);
                    _0x7db611.style.fontSize = _0x27309e * _0x50dd05.fontPercent + 'px', _0x7db611.style.height = 'auto', _0x7db611.style.top = "auto", _0x7db611.style.bottom = '2px';
                  }
                  _0x50dd05.fontFamily && "default" !== _0x50dd05.fontFamily && ("small-caps" === _0x50dd05.fontFamily ? _0x7db611.firstChild.style.fontVariant = 'small-caps' : _0x7db611.firstChild.style.fontFamily = {
                    'monospace': 'monospace',
                    'sansSerif': 'sans-serif',
                    'serif': "serif",
                    'monospaceSansSerif': '\x22Andale\x20Mono\x22,\x20\x22Lucida\x20Console\x22,\x20monospace',
                    'monospaceSerif': "\"Courier New\", monospace",
                    'proportionalSansSerif': 'sans-serif',
                    'proportionalSerif': "serif",
                    'casual': '\x22Comic\x20Sans\x20MS\x22,\x20Impact,\x20fantasy',
                    'script': '\x22Monotype\x20Corsiva\x22,\x20cursive',
                    'smallcaps': "\"Andale Mono\", \"Lucida Console\", monospace, sans-serif"
                  }[_0x50dd05.fontFamily]);
                }
              }
            }
          }, _0x5086c2;
        }(_0x2842eb["default"]);
      _0x2842eb['default'].registerComponent('TextTrackDisplay', _0x12a0b7), _0x106d60["default"] = _0x12a0b7, _0x56208e.exports = _0x106d60['default'];
    }, {
      '../component': 0x43,
      '../menu/menu-button.js': 0x6d,
      '../menu/menu-item.js': 0x6e,
      '../menu/menu.js': 0x6f,
      '../utils/fn.js': 0x91,
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x83: [function (_0x4672be, _0x14dd94, _0x3f7510) {
      'use strict';

      _0x3f7510.__esModule = !0x0;
      var _0x50f950 = function (_0x4746ad) {
          var _0x229604 = ['kind', "label", "language", 'id', 'inBandMetadataTrackDispatchType', "mode", 'src'].reduce(function (_0x319d76, _0x119c8c) {
            return _0x4746ad[_0x119c8c] && (_0x319d76[_0x119c8c] = _0x4746ad[_0x119c8c]), _0x319d76;
          }, {
            'cues': _0x4746ad.cues && Array.prototype.map.call(_0x4746ad.cues, function (_0x4cc699) {
              return {
                'startTime': _0x4cc699.startTime,
                'endTime': _0x4cc699.endTime,
                'text': _0x4cc699.text,
                'id': _0x4cc699.id
              };
            })
          });
          return _0x229604;
        },
        _0x11ffa9 = function (_0x125270) {
          var _0x14107a = _0x125270.$$("track"),
            _0x425ddd = Array.prototype.map.call(_0x14107a, function (_0xcdf576) {
              return _0xcdf576.track;
            }),
            _0xe3e78c = Array.prototype.map.call(_0x14107a, function (_0xc47656) {
              var _0xd152f9 = _0x50f950(_0xc47656.track);
              return _0xc47656.src && (_0xd152f9.src = _0xc47656.src), _0xd152f9;
            });
          return _0xe3e78c.concat(Array.prototype.filter.call(_0x125270.textTracks(), function (_0x266784) {
            return -0x1 === _0x425ddd.indexOf(_0x266784);
          }).map(_0x50f950));
        },
        _0x44c03e = function (_0x4ce3ee, _0x524810) {
          return _0x4ce3ee.forEach(function (_0x14afbe) {
            var _0x14a152 = _0x524810.addRemoteTextTrack(_0x14afbe).track;
            !_0x14afbe.src && _0x14afbe.cues && _0x14afbe.cues.forEach(function (_0x1c7c3f) {
              return _0x14a152.addCue(_0x1c7c3f);
            });
          }), _0x524810.textTracks();
        };
      _0x3f7510["default"] = {
        'textTracksToJson': _0x11ffa9,
        'jsonToTextTracks': _0x44c03e,
        'trackToJson_': _0x50f950
      }, _0x14dd94.exports = _0x3f7510['default'];
    }, {}],
    0x84: [function (_0x187359, _0x3bc3ef, _0xbf77a) {
      'use strict';

      function _0x3052c6(_0x24e324) {
        if (_0x24e324 && _0x24e324.__esModule) return _0x24e324;
        var _0x159863 = {};
        if (null != _0x24e324) {
          for (var _0x1bc9b4 in _0x24e324) Object.prototype.hasOwnProperty.call(_0x24e324, _0x1bc9b4) && (_0x159863[_0x1bc9b4] = _0x24e324[_0x1bc9b4]);
        }
        return _0x159863["default"] = _0x24e324, _0x159863;
      }
      function _0x979f1(_0x5e65e0) {
        return _0x5e65e0 && _0x5e65e0.__esModule ? _0x5e65e0 : {
          'default': _0x5e65e0
        };
      }
      function _0x2bcc02(_0xc85738, _0x1e52a9) {
        if (!(_0xc85738 instanceof _0x1e52a9)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x1c9f61(_0x1470fd, _0x10c3fc) {
        if ("function" != typeof _0x10c3fc && null !== _0x10c3fc) throw new TypeError('Super\x20expression\x20must\x20either\x20be\x20null\x20or\x20a\x20function,\x20not\x20' + typeof _0x10c3fc);
        _0x1470fd.prototype = Object.create(_0x10c3fc && _0x10c3fc.prototype, {
          'constructor': {
            'value': _0x1470fd,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x10c3fc && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x1470fd, _0x10c3fc) : _0x1470fd.__proto__ = _0x10c3fc);
      }
      _0xbf77a.__esModule = !0x0;
      var _0x3a4e72 = _0x187359("./track-list"),
        _0x56bb9f = _0x979f1(_0x3a4e72),
        _0x1c2990 = _0x187359("../utils/fn.js"),
        _0x460136 = _0x3052c6(_0x1c2990),
        _0x5ce8d3 = _0x187359("../utils/browser.js"),
        _0x466b98 = _0x3052c6(_0x5ce8d3),
        _0x5080ca = _0x187359('global/document'),
        _0x6d7b42 = _0x979f1(_0x5080ca),
        _0x2a2c14 = function (_0x377429) {
          function _0xf4c242() {
            var _0x333764 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0];
            _0x2bcc02(this, _0xf4c242);
            var _0x4a4817 = void 0x0;
            if (_0x466b98.IS_IE8) {
              _0x4a4817 = _0x6d7b42["default"].createElement("custom");
              for (var _0x15777a in _0x56bb9f["default"].prototype) "constructor" !== _0x15777a && (_0x4a4817[_0x15777a] = _0x56bb9f["default"].prototype[_0x15777a]);
              for (var _0x15777a in _0xf4c242.prototype) "constructor" !== _0x15777a && (_0x4a4817[_0x15777a] = _0xf4c242.prototype[_0x15777a]);
            }
            return _0x4a4817 = _0x377429.call(this, _0x333764, _0x4a4817);
          }
          return _0x1c9f61(_0xf4c242, _0x377429), _0xf4c242.prototype.addTrack_ = function (_0x583561) {
            _0x377429.prototype.addTrack_.call(this, _0x583561), _0x583561.addEventListener("modechange", _0x460136.bind(this, function () {
              this.trigger("change");
            }));
          }, _0xf4c242.prototype.removeTrack_ = function (_0x42a188) {
            for (var _0xb64656 = void 0x0, _0x48f61a = 0x0, _0x59e16f = this.length; this.length > 0x0; _0x48f61a++) if (this[_0x48f61a] === _0x42a188) {
              _0xb64656 = this[_0x48f61a], _0xb64656.off && _0xb64656.off(), this.tracks_.splice(_0x48f61a, 0x1);
              break;
            }
            _0xb64656 && this.trigger({
              'track': _0xb64656,
              'type': "removetrack"
            });
          }, _0xf4c242.prototype.getTrackById = function (_0x5d0bc7) {
            for (var _0x178f23 = null, _0x1061c2 = 0x0, _0x399960 = this.length; this.length > 0x0; _0x1061c2++) {
              var _0x192084 = this[_0x1061c2];
              if (_0x192084.id === _0x5d0bc7) {
                _0x178f23 = _0x192084;
                break;
              }
            }
            return _0x178f23;
          }, _0xf4c242;
        }(_0x56bb9f["default"]);
      _0xbf77a["default"] = _0x2a2c14, _0x3bc3ef.exports = _0xbf77a["default"];
    }, {
      '../utils/browser.js': 0x8c,
      '../utils/fn.js': 0x91,
      './track-list': 0x88,
      'global/document': 0x1
    }],
    0x85: [function (_0x22255c, _0x58c023, _0x23ce8c) {
      'use strict';

      function _0x367852(_0x3149c8) {
        if (_0x3149c8 && _0x3149c8.__esModule) return _0x3149c8;
        var _0x4419cc = {};
        if (null != _0x3149c8) {
          for (var _0x115e8f in _0x3149c8) Object.prototype.hasOwnProperty.call(_0x3149c8, _0x115e8f) && (_0x4419cc[_0x115e8f] = _0x3149c8[_0x115e8f]);
        }
        return _0x4419cc["default"] = _0x3149c8, _0x4419cc;
      }
      function _0x44df15(_0x322651) {
        return _0x322651 && _0x322651.__esModule ? _0x322651 : {
          'default': _0x322651
        };
      }
      function _0x230264(_0x247d4a, _0x1196f0) {
        if (!(_0x247d4a instanceof _0x1196f0)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x2b9624(_0x34022e, _0x2ff1a8) {
        if ("function" != typeof _0x2ff1a8 && null !== _0x2ff1a8) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x2ff1a8);
        _0x34022e.prototype = Object.create(_0x2ff1a8 && _0x2ff1a8.prototype, {
          'constructor': {
            'value': _0x34022e,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x2ff1a8 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x34022e, _0x2ff1a8) : _0x34022e.__proto__ = _0x2ff1a8);
      }
      function _0x4a2e18(_0x11adc4) {
        var _0x24c1db = void 0x0;
        return _0x11adc4.selectedOptions ? _0x24c1db = _0x11adc4.selectedOptions[0x0] : _0x11adc4.options && (_0x24c1db = _0x11adc4.options[_0x11adc4.options.selectedIndex]), _0x24c1db.value;
      }
      function _0x2d679e(_0x24ceef, _0x58009d) {
        if (_0x58009d) {
          var _0x177750 = void 0x0;
          for (_0x177750 = 0x0; _0x177750 < _0x24ceef.options.length; _0x177750++) {
            var _0x38ed64 = _0x24ceef.options[_0x177750];
            if (_0x38ed64.value === _0x58009d) break;
          }
          _0x24ceef.selectedIndex = _0x177750;
        }
      }
      function _0x23787c() {
        return "<div class=\"vjs-tracksettings\">\n      <div class=\"vjs-tracksettings-colors\">\n        <div class=\"vjs-fg-color vjs-tracksetting\">\n            <label class=\"vjs-label\">Foreground</label>\n            <select>\n              <option value=\"\">---</option>\n              <option value=\"#FFF\">White</option>\n              <option value=\"#000\">Black</option>\n              <option value=\"#F00\">Red</option>\n              <option value=\"#0F0\">Green</option>\n              <option value=\"#00F\">Blue</option>\n              <option value=\"#FF0\">Yellow</option>\n              <option value=\"#F0F\">Magenta</option>\n              <option value=\"#0FF\">Cyan</option>\n            </select>\n            <span class=\"vjs-text-opacity vjs-opacity\">\n              <select>\n                <option value=\"\">---</option>\n                <option value=\"1\">Opaque</option>\n                <option value=\"0.5\">Semi-Opaque</option>\n              </select>\n            </span>\n        </div> <!-- vjs-fg-color -->\n        <div class=\"vjs-bg-color vjs-tracksetting\">\n            <label class=\"vjs-label\">Background</label>\n            <select>\n              <option value=\"\">---</option>\n              <option value=\"#FFF\">White</option>\n              <option value=\"#000\">Black</option>\n              <option value=\"#F00\">Red</option>\n              <option value=\"#0F0\">Green</option>\n              <option value=\"#00F\">Blue</option>\n              <option value=\"#FF0\">Yellow</option>\n              <option value=\"#F0F\">Magenta</option>\n              <option value=\"#0FF\">Cyan</option>\n            </select>\n            <span class=\"vjs-bg-opacity vjs-opacity\">\n                <select>\n                  <option value=\"\">---</option>\n                  <option value=\"1\">Opaque</option>\n                  <option value=\"0.5\">Semi-Transparent</option>\n                  <option value=\"0\">Transparent</option>\n                </select>\n            </span>\n        </div> <!-- vjs-bg-color -->\n        <div class=\"window-color vjs-tracksetting\">\n            <label class=\"vjs-label\">Window</label>\n            <select>\n              <option value=\"\">---</option>\n              <option value=\"#FFF\">White</option>\n              <option value=\"#000\">Black</option>\n              <option value=\"#F00\">Red</option>\n              <option value=\"#0F0\">Green</option>\n              <option value=\"#00F\">Blue</option>\n              <option value=\"#FF0\">Yellow</option>\n              <option value=\"#F0F\">Magenta</option>\n              <option value=\"#0FF\">Cyan</option>\n            </select>\n            <span class=\"vjs-window-opacity vjs-opacity\">\n                <select>\n                  <option value=\"\">---</option>\n                  <option value=\"1\">Opaque</option>\n                  <option value=\"0.5\">Semi-Transparent</option>\n                  <option value=\"0\">Transparent</option>\n                </select>\n            </span>\n        </div> <!-- vjs-window-color -->\n      </div> <!-- vjs-tracksettings -->\n      <div class=\"vjs-tracksettings-font\">\n        <div class=\"vjs-font-percent vjs-tracksetting\">\n          <label class=\"vjs-label\">Font Size</label>\n          <select>\n            <option value=\"0.50\">50%</option>\n            <option value=\"0.75\">75%</option>\n            <option value=\"1.00\" selected>100%</option>\n            <option value=\"1.25\">125%</option>\n            <option value=\"1.50\">150%</option>\n            <option value=\"1.75\">175%</option>\n            <option value=\"2.00\">200%</option>\n            <option value=\"3.00\">300%</option>\n            <option value=\"4.00\">400%</option>\n          </select>\n        </div> <!-- vjs-font-percent -->\n        <div class=\"vjs-edge-style vjs-tracksetting\">\n          <label class=\"vjs-label\">Text Edge Style</label>\n          <select>\n            <option value=\"none\">None</option>\n            <option value=\"raised\">Raised</option>\n            <option value=\"depressed\">Depressed</option>\n            <option value=\"uniform\">Uniform</option>\n            <option value=\"dropshadow\">Dropshadow</option>\n          </select>\n        </div> <!-- vjs-edge-style -->\n        <div class=\"vjs-font-family vjs-tracksetting\">\n          <label class=\"vjs-label\">Font Family</label>\n          <select>\n            <option value=\"\">Default</option>\n            <option value=\"monospaceSerif\">Monospace Serif</option>\n            <option value=\"proportionalSerif\">Proportional Serif</option>\n            <option value=\"monospaceSansSerif\">Monospace Sans-Serif</option>\n            <option value=\"proportionalSansSerif\">Proportional Sans-Serif</option>\n            <option value=\"casual\">Casual</option>\n            <option value=\"script\">Script</option>\n            <option value=\"small-caps\">Small Caps</option>\n          </select>\n        </div> <!-- vjs-font-family -->\n      </div>\n    </div>\n    <div class=\"vjs-tracksettings-controls\">\n      <button class=\"vjs-default-button\">Defaults</button>\n      <button class=\"vjs-done-button\">Done</button>\n    </div>";
      }
      _0x23ce8c.__esModule = !0x0;
      var _0x41326e = _0x22255c("../component"),
        _0x3f52bf = _0x44df15(_0x41326e),
        _0x3f7f30 = _0x22255c('../utils/events.js'),
        _0x500860 = _0x367852(_0x3f7f30),
        _0x148a92 = _0x22255c('../utils/fn.js'),
        _0x19c383 = _0x367852(_0x148a92),
        _0x20e10f = _0x22255c("../utils/log.js"),
        _0x491044 = _0x44df15(_0x20e10f),
        _0x149898 = _0x22255c("safe-json-parse/tuple"),
        _0x2c6481 = _0x44df15(_0x149898),
        _0x36c2e5 = _0x22255c("global/window"),
        _0x1206df = _0x44df15(_0x36c2e5),
        _0x1c0c60 = function (_0x2262b6) {
          function _0x260dd9(_0x46870f, _0x3286e8) {
            _0x230264(this, _0x260dd9), _0x2262b6.call(this, _0x46870f, _0x3286e8), this.hide(), void 0x0 === _0x3286e8.persistTextTrackSettings && (this.options_.persistTextTrackSettings = this.options_.playerOptions.persistTextTrackSettings), _0x500860.on(this.$(".vjs-done-button"), "click", _0x19c383.bind(this, function () {
              this.saveSettings(), this.hide();
            })), _0x500860.on(this.$(".vjs-default-button"), "click", _0x19c383.bind(this, function () {
              this.$(".vjs-fg-color > select").selectedIndex = 0x0, this.$(".vjs-bg-color > select").selectedIndex = 0x0, this.$(".window-color > select").selectedIndex = 0x0, this.$(".vjs-text-opacity > select").selectedIndex = 0x0, this.$(".vjs-bg-opacity > select").selectedIndex = 0x0, this.$(".vjs-window-opacity > select").selectedIndex = 0x0, this.$(".vjs-edge-style select").selectedIndex = 0x0, this.$(".vjs-font-family select").selectedIndex = 0x0, this.$(".vjs-font-percent select").selectedIndex = 0x2, this.updateDisplay();
            })), _0x500860.on(this.$(".vjs-fg-color > select"), "change", _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$('.vjs-bg-color\x20>\x20select'), "change", _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$(".window-color > select"), "change", _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$(".vjs-text-opacity > select"), 'change', _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$(".vjs-bg-opacity > select"), "change", _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$(".vjs-window-opacity > select"), 'change', _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$(".vjs-font-percent select"), "change", _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$('.vjs-edge-style\x20select'), 'change', _0x19c383.bind(this, this.updateDisplay)), _0x500860.on(this.$('.vjs-font-family\x20select'), "change", _0x19c383.bind(this, this.updateDisplay)), this.options_.persistTextTrackSettings && this.restoreSettings();
          }
          return _0x2b9624(_0x260dd9, _0x2262b6), _0x260dd9.prototype.createEl = function () {
            return _0x2262b6.prototype.createEl.call(this, "div", {
              'className': "vjs-caption-settings vjs-modal-overlay",
              'innerHTML': _0x23787c()
            });
          }, _0x260dd9.prototype.getValues = function () {
            var _0x203794 = _0x4a2e18(this.$(".vjs-edge-style select")),
              _0xd734b2 = _0x4a2e18(this.$(".vjs-font-family select")),
              _0x3e4d72 = _0x4a2e18(this.$(".vjs-fg-color > select")),
              _0x5761d7 = _0x4a2e18(this.$('.vjs-text-opacity\x20>\x20select')),
              _0xa99b05 = _0x4a2e18(this.$(".vjs-bg-color > select")),
              _0x3778db = _0x4a2e18(this.$('.vjs-bg-opacity\x20>\x20select')),
              _0x15af7b = _0x4a2e18(this.$(".window-color > select")),
              _0x570287 = _0x4a2e18(this.$(".vjs-window-opacity > select")),
              _0x2988b2 = _0x1206df["default"].parseFloat(_0x4a2e18(this.$(".vjs-font-percent > select"))),
              _0x31c2ae = {
                'backgroundOpacity': _0x3778db,
                'textOpacity': _0x5761d7,
                'windowOpacity': _0x570287,
                'edgeStyle': _0x203794,
                'fontFamily': _0xd734b2,
                'color': _0x3e4d72,
                'backgroundColor': _0xa99b05,
                'windowColor': _0x15af7b,
                'fontPercent': _0x2988b2
              };
            for (var _0x39b56a in _0x31c2ae) ('' === _0x31c2ae[_0x39b56a] || "none" === _0x31c2ae[_0x39b56a] || "fontPercent" === _0x39b56a && 0x1 === _0x31c2ae[_0x39b56a]) && delete _0x31c2ae[_0x39b56a];
            return _0x31c2ae;
          }, _0x260dd9.prototype.setValues = function (_0x3daaf5) {
            _0x2d679e(this.$(".vjs-edge-style select"), _0x3daaf5.edgeStyle), _0x2d679e(this.$(".vjs-font-family select"), _0x3daaf5.fontFamily), _0x2d679e(this.$('.vjs-fg-color\x20>\x20select'), _0x3daaf5.color), _0x2d679e(this.$(".vjs-text-opacity > select"), _0x3daaf5.textOpacity), _0x2d679e(this.$(".vjs-bg-color > select"), _0x3daaf5.backgroundColor), _0x2d679e(this.$(".vjs-bg-opacity > select"), _0x3daaf5.backgroundOpacity), _0x2d679e(this.$('.window-color\x20>\x20select'), _0x3daaf5.windowColor), _0x2d679e(this.$(".vjs-window-opacity > select"), _0x3daaf5.windowOpacity);
            var _0x22bf11 = _0x3daaf5.fontPercent;
            _0x22bf11 && (_0x22bf11 = _0x22bf11.toFixed(0x2)), _0x2d679e(this.$(".vjs-font-percent > select"), _0x22bf11);
          }, _0x260dd9.prototype.restoreSettings = function () {
            var _0x4f0be9 = void 0x0,
              _0xfc015d = void 0x0;
            try {
              var _0x16a99f = _0x2c6481["default"](_0x1206df["default"].localStorage.getItem("vjs-text-track-settings"));
              _0x4f0be9 = _0x16a99f[0x0], _0xfc015d = _0x16a99f[0x1], _0x4f0be9 && _0x491044['default'].error(_0x4f0be9);
            } catch (_0x1e3ae7) {
              _0x491044["default"].warn(_0x1e3ae7);
            }
            _0xfc015d && this.setValues(_0xfc015d);
          }, _0x260dd9.prototype.saveSettings = function () {
            if (this.options_.persistTextTrackSettings) {
              var _0x4e40f2 = this.getValues();
              try {
                Object.getOwnPropertyNames(_0x4e40f2).length > 0x0 ? _0x1206df["default"].localStorage.setItem("vjs-text-track-settings", JSON.stringify(_0x4e40f2)) : _0x1206df["default"].localStorage.removeItem("vjs-text-track-settings");
              } catch (_0x4c40e3) {
                _0x491044["default"].warn(_0x4c40e3);
              }
            }
          }, _0x260dd9.prototype.updateDisplay = function () {
            var _0x1e0b52 = this.player_.getChild('textTrackDisplay');
            _0x1e0b52 && _0x1e0b52.updateDisplay();
          }, _0x260dd9;
        }(_0x3f52bf["default"]);
      _0x3f52bf["default"].registerComponent("TextTrackSettings", _0x1c0c60), _0x23ce8c['default'] = _0x1c0c60, _0x58c023.exports = _0x23ce8c['default'];
    }, {
      '../component': 0x43,
      '../utils/events.js': 0x90,
      '../utils/fn.js': 0x91,
      '../utils/log.js': 0x94,
      'global/window': 0x2,
      'safe-json-parse/tuple': 0x36
    }],
    0x86: [function (_0x33a5a5, _0x25dd93, _0xe9ce34) {
      'use strict';

      function _0x577608(_0x368a35) {
        if (_0x368a35 && _0x368a35.__esModule) return _0x368a35;
        var _0x487b31 = {};
        if (null != _0x368a35) {
          for (var _0x207279 in _0x368a35) Object.prototype.hasOwnProperty.call(_0x368a35, _0x207279) && (_0x487b31[_0x207279] = _0x368a35[_0x207279]);
        }
        return _0x487b31['default'] = _0x368a35, _0x487b31;
      }
      function _0x1aeaae(_0x1484f0) {
        return _0x1484f0 && _0x1484f0.__esModule ? _0x1484f0 : {
          'default': _0x1484f0
        };
      }
      function _0x59e924(_0x48df48, _0x7c2818) {
        if (!(_0x48df48 instanceof _0x7c2818)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x41748d(_0x3ba769, _0x1f346d) {
        if ("function" != typeof _0x1f346d && null !== _0x1f346d) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x1f346d);
        _0x3ba769.prototype = Object.create(_0x1f346d && _0x1f346d.prototype, {
          'constructor': {
            'value': _0x3ba769,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x1f346d && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3ba769, _0x1f346d) : _0x3ba769.__proto__ = _0x1f346d);
      }
      _0xe9ce34.__esModule = !0x0;
      var _0x150413 = _0x33a5a5("./text-track-cue-list"),
        _0x11c7ec = _0x1aeaae(_0x150413),
        _0x261b83 = _0x33a5a5("../utils/fn.js"),
        _0xf09ff4 = _0x577608(_0x261b83),
        _0x2a28a4 = _0x33a5a5("./track-enums"),
        _0x3d17a5 = _0x33a5a5("../utils/log.js"),
        _0x32405a = _0x1aeaae(_0x3d17a5),
        _0x4d3fab = _0x33a5a5("global/document"),
        _0x36552a = (_0x1aeaae(_0x4d3fab), _0x33a5a5("global/window")),
        _0x5881be = _0x1aeaae(_0x36552a),
        _0x247135 = _0x33a5a5("./track.js"),
        _0x470995 = _0x1aeaae(_0x247135),
        _0x24d96e = _0x33a5a5("../utils/url.js"),
        _0x53738d = _0x33a5a5('xhr'),
        _0x17956b = _0x1aeaae(_0x53738d),
        _0x326b3c = _0x33a5a5("../utils/merge-options"),
        _0x1c6a6e = _0x1aeaae(_0x326b3c),
        _0x18f50f = _0x33a5a5('../utils/browser.js'),
        _0x482354 = _0x577608(_0x18f50f),
        _0x5bd9d2 = function (_0x400e24, _0x49881f) {
          var _0x38d4f6 = new _0x5881be['default'].WebVTT.Parser(_0x5881be["default"], _0x5881be["default"].vttjs, _0x5881be["default"].WebVTT.StringDecoder()),
            _0x232756 = [];
          _0x38d4f6.oncue = function (_0x861e45) {
            _0x49881f.addCue(_0x861e45);
          }, _0x38d4f6.onparsingerror = function (_0x148391) {
            _0x232756.push(_0x148391);
          }, _0x38d4f6.onflush = function () {
            _0x49881f.trigger({
              'type': "loadeddata",
              'target': _0x49881f
            });
          }, _0x38d4f6.parse(_0x400e24), _0x232756.length > 0x0 && (_0x232756.forEach(function (_0x3c25a3) {
            return _0x32405a["default"].error(_0x3c25a3);
          }), console.groupEnd), _0x38d4f6.flush();
        },
        _0x436ce7 = function (_0x45f99a, _0x527cfa) {
          var _0x1c2ef4 = {
              'uri': _0x45f99a
            },
            _0x59708d = _0x24d96e.isCrossOrigin(_0x45f99a);
          _0x59708d && (_0x1c2ef4.cors = _0x59708d), _0x17956b["default"](_0x1c2ef4, _0xf09ff4.bind(this, function (_0x365b58, _0x2737dc, _0x11ea91) {
            return _0x365b58 ? _0x32405a['default'].error(_0x365b58, _0x2737dc) : (_0x527cfa.loaded_ = !0x0, void ("function" != typeof _0x5881be["default"].WebVTT ? _0x527cfa.tech_ && !function () {
              var _0x24a0cf = function () {
                return _0x5bd9d2(_0x11ea91, _0x527cfa);
              };
              _0x527cfa.tech_.on('vttjsloaded', _0x24a0cf), _0x527cfa.tech_.on("vttjserror", function () {
                _0x32405a["default"].error("vttjs failed to load, stopping trying to process " + _0x527cfa.src), _0x527cfa.tech_.off("vttjsloaded", _0x24a0cf);
              });
            }() : _0x5bd9d2(_0x11ea91, _0x527cfa)));
          }));
        },
        _0x1517f3 = function (_0xb02487) {
          function _0xd602f4() {
            var _0x1e7f28 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0];
            if (_0x59e924(this, _0xd602f4), !_0x1e7f28.tech) throw new Error("A tech was not provided.");
            var _0x14e873 = _0x1c6a6e["default"](_0x1e7f28, {
                'kind': _0x2a28a4.TextTrackKind[_0x1e7f28.kind] || "subtitles",
                'language': _0x1e7f28.language || _0x1e7f28.srclang || ''
              }),
              _0x4b1045 = _0x2a28a4.TextTrackMode[_0x14e873.mode] || "disabled",
              _0x568b62 = _0x14e873["default"];
            ('metadata' === _0x14e873.kind || "chapters" === _0x14e873.kind) && (_0x4b1045 = "hidden");
            var _0x16d988 = _0xb02487.call(this, _0x14e873);
            if (_0x16d988.tech_ = _0x14e873.tech, _0x482354.IS_IE8) {
              for (var _0x105868 in _0xd602f4.prototype) "constructor" !== _0x105868 && (_0x16d988[_0x105868] = _0xd602f4.prototype[_0x105868]);
            }
            _0x16d988.cues_ = [], _0x16d988.activeCues_ = [];
            var _0x4e223e = new _0x11c7ec["default"](_0x16d988.cues_),
              _0x3ebcaf = new _0x11c7ec['default'](_0x16d988.activeCues_),
              _0xdc0f50 = !0x1,
              _0x5a223a = _0xf09ff4.bind(_0x16d988, function () {
                _0xdc0f50 && (this.trigger('cuechange'), _0xdc0f50 = !0x1);
              });
            return "disabled" !== _0x4b1045 && _0x16d988.tech_.on("timeupdate", _0x5a223a), Object.defineProperty(_0x16d988, "default", {
              'get': function () {
                return _0x568b62;
              },
              'set': function () {}
            }), Object.defineProperty(_0x16d988, 'mode', {
              'get': function () {
                return _0x4b1045;
              },
              'set': function (_0x1e8487) {
                _0x2a28a4.TextTrackMode[_0x1e8487] && (_0x4b1045 = _0x1e8487, "showing" === _0x4b1045 && this.tech_.on("timeupdate", _0x5a223a), this.trigger("modechange"));
              }
            }), Object.defineProperty(_0x16d988, 'cues', {
              'get': function () {
                return this.loaded_ ? _0x4e223e : null;
              },
              'set': function () {}
            }), Object.defineProperty(_0x16d988, "activeCues", {
              'get': function () {
                if (!this.loaded_) return null;
                if (0x0 === this.cues.length) return _0x3ebcaf;
                for (var _0x572888 = this.tech_.currentTime(), _0x1c5b12 = [], _0x20c859 = 0x0, _0x5244e3 = this.cues.length; this.cues.length > 0x0; _0x20c859++) {
                  var _0x55762e = this.cues[_0x20c859];
                  _0x55762e.startTime <= _0x572888 && _0x55762e.endTime >= _0x572888 ? _0x1c5b12.push(_0x55762e) : _0x55762e.startTime === _0x55762e.endTime && _0x55762e.startTime <= _0x572888 && _0x55762e.startTime + 0.5 >= _0x572888 && _0x1c5b12.push(_0x55762e);
                }
                if (_0xdc0f50 = !0x1, _0x1c5b12.length !== this.activeCues_.length) _0xdc0f50 = !0x0;else {
                  for (var _0x20c859 = 0x0; 0x0 < _0x1c5b12.length; _0x20c859++) -0x1 === this.activeCues_.indexOf(_0x1c5b12[_0x20c859]) && (_0xdc0f50 = !0x0);
                }
                return this.activeCues_ = _0x1c5b12, _0x3ebcaf.setCues_(this.activeCues_), _0x3ebcaf;
              },
              'set': function () {}
            }), _0x14e873.src ? (_0x16d988.src = _0x14e873.src, _0x436ce7(_0x14e873.src, _0x16d988)) : _0x16d988.loaded_ = !0x0, _0x16d988;
          }
          return _0x41748d(_0xd602f4, _0xb02487), _0xd602f4.prototype.addCue = function (_0x48a38b) {
            var _0x42d0f4 = this.tech_.textTracks();
            if (_0x42d0f4) {
              for (var _0x356720 = 0x0; 0x0 < _0x42d0f4.length; _0x356720++) _0x42d0f4[_0x356720] !== this && _0x42d0f4[_0x356720].removeCue(_0x48a38b);
            }
            this.cues_.push(_0x48a38b), this.cues.setCues_(this.cues_);
          }, _0xd602f4.prototype.removeCue = function (_0x375cf0) {
            for (var _0x47d594 = !0x1, _0x9f781d = 0x0, _0x5b3711 = this.cues_.length; this.cues_.length > 0x0; _0x9f781d++) {
              var _0x128b02 = this.cues_[_0x9f781d];
              _0x128b02 === _0x375cf0 && (this.cues_.splice(_0x9f781d, 0x1), _0x47d594 = !0x0);
            }
            _0x47d594 && this.cues.setCues_(this.cues_);
          }, _0xd602f4;
        }(_0x470995["default"]);
      _0x1517f3.prototype.allowedEvents_ = {
        'cuechange': "cuechange"
      }, _0xe9ce34['default'] = _0x1517f3, _0x25dd93.exports = _0xe9ce34["default"];
    }, {
      '../utils/browser.js': 0x8c,
      '../utils/fn.js': 0x91,
      '../utils/log.js': 0x94,
      '../utils/merge-options': 0x95,
      '../utils/url.js': 0x99,
      './text-track-cue-list': 0x81,
      './track-enums': 0x87,
      './track.js': 0x89,
      'global/document': 0x1,
      'global/window': 0x2,
      'xhr': 0x38
    }],
    0x87: [function (_0x209d9b, _0x26ba97, _0x3c7fcb) {
      'use strict';

      _0x3c7fcb.__esModule = !0x0;
      _0x3c7fcb["default"] = {
        'VideoTrackKind': {
          'alternative': "alternative",
          'captions': "captions",
          'main': "main",
          'sign': "sign",
          'subtitles': 'subtitles',
          'commentary': 'commentary'
        },
        'AudioTrackKind': {
          'alternative': "alternative",
          'descriptions': "descriptions",
          'main': "main",
          'main-desc': "main-desc",
          'translation': "translation",
          'commentary': 'commentary'
        },
        'TextTrackKind': {
          'subtitles': "subtitles",
          'captions': 'captions',
          'descriptions': 'descriptions',
          'chapters': "chapters",
          'metadata': "metadata"
        },
        'TextTrackMode': {
          'disabled': "disabled",
          'hidden': "hidden",
          'showing': "showing"
        }
      }, _0x26ba97.exports = _0x3c7fcb["default"];
    }, {}],
    0x88: [function (_0x70e1f7, _0x270ff9, _0x5cf281) {
      'use strict';

      function _0x4491fd(_0x3acf82) {
        if (_0x3acf82 && _0x3acf82.__esModule) return _0x3acf82;
        var _0x48f667 = {};
        if (null != _0x3acf82) {
          for (var _0x27fd7b in _0x3acf82) Object.prototype.hasOwnProperty.call(_0x3acf82, _0x27fd7b) && (_0x48f667[_0x27fd7b] = _0x3acf82[_0x27fd7b]);
        }
        return _0x48f667["default"] = _0x3acf82, _0x48f667;
      }
      function _0x5bbb79(_0xa52e75) {
        return _0xa52e75 && _0xa52e75.__esModule ? _0xa52e75 : {
          'default': _0xa52e75
        };
      }
      function _0x1be971(_0x412c55, _0x2f1182) {
        if (!(_0x412c55 instanceof _0x2f1182)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x1372c4(_0x3778b9, _0x3bd230) {
        if ("function" != typeof _0x3bd230 && null !== _0x3bd230) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x3bd230);
        _0x3778b9.prototype = Object.create(_0x3bd230 && _0x3bd230.prototype, {
          'constructor': {
            'value': _0x3778b9,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x3bd230 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x3778b9, _0x3bd230) : _0x3778b9.__proto__ = _0x3bd230);
      }
      _0x5cf281.__esModule = !0x0;
      var _0x417f76 = _0x70e1f7("../event-target"),
        _0x16fb03 = _0x5bbb79(_0x417f76),
        _0x59f25a = _0x70e1f7('../utils/fn.js'),
        _0x779df5 = (_0x4491fd(_0x59f25a), _0x70e1f7("../utils/browser.js")),
        _0x3e374b = _0x4491fd(_0x779df5),
        _0x14181f = _0x70e1f7('global/document'),
        _0x1ba842 = _0x5bbb79(_0x14181f),
        _0x4e82ba = function (_0x10f6e4) {
          function _0x40f638() {
            var _0x3ff7ce = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0],
              _0x810645 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? null : arguments[0x1];
            if (_0x1be971(this, _0x40f638), _0x10f6e4.call(this), !_0x810645 && (_0x810645 = this, _0x3e374b.IS_IE8)) {
              _0x810645 = _0x1ba842["default"].createElement('custom');
              for (var _0x160559 in _0x40f638.prototype) "constructor" !== _0x160559 && (_0x810645[_0x160559] = _0x40f638.prototype[_0x160559]);
            }
            _0x810645.tracks_ = [], Object.defineProperty(_0x810645, 'length', {
              'get': function () {
                return this.tracks_.length;
              }
            });
            for (var _0x3ee6c7 = 0x0; 0x0 < _0x3ff7ce.length; _0x3ee6c7++) _0x810645.addTrack_(_0x3ff7ce[_0x3ee6c7]);
            return _0x810645;
          }
          return _0x1372c4(_0x40f638, _0x10f6e4), _0x40f638.prototype.addTrack_ = function (_0x4b7513) {
            '' + this.tracks_.length in this || Object.defineProperty(this, this.tracks_.length, {
              'get': function () {
                return this.tracks_[this.tracks_.length];
              }
            }), -0x1 === this.tracks_.indexOf(_0x4b7513) && (this.tracks_.push(_0x4b7513), this.trigger({
              'track': _0x4b7513,
              'type': 'addtrack'
            }));
          }, _0x40f638.prototype.removeTrack_ = function (_0x1b3be1) {
            for (var _0x1ba84d = void 0x0, _0x24dac8 = 0x0, _0x1bd3f0 = this.length; this.length > 0x0; _0x24dac8++) if (this[_0x24dac8] === _0x1b3be1) {
              _0x1ba84d = this[_0x24dac8], _0x1ba84d.off && _0x1ba84d.off(), this.tracks_.splice(_0x24dac8, 0x1);
              break;
            }
            _0x1ba84d && this.trigger({
              'track': _0x1ba84d,
              'type': "removetrack"
            });
          }, _0x40f638.prototype.getTrackById = function (_0x2a96f6) {
            for (var _0x33ecc2 = null, _0x4c8e07 = 0x0, _0x1863e7 = this.length; this.length > 0x0; _0x4c8e07++) {
              var _0x1ab845 = this[_0x4c8e07];
              if (_0x1ab845.id === _0x2a96f6) {
                _0x33ecc2 = _0x1ab845;
                break;
              }
            }
            return _0x33ecc2;
          }, _0x40f638;
        }(_0x16fb03["default"]);
      _0x4e82ba.prototype.allowedEvents_ = {
        'change': "change",
        'addtrack': 'addtrack',
        'removetrack': "removetrack"
      };
      for (var _0x46fc07 in _0x4e82ba.prototype.allowedEvents_) _0x4e82ba.prototype['on' + _0x46fc07] = null;
      _0x5cf281['default'] = _0x4e82ba, _0x270ff9.exports = _0x5cf281["default"];
    }, {
      '../event-target': 0x68,
      '../utils/browser.js': 0x8c,
      '../utils/fn.js': 0x91,
      'global/document': 0x1
    }],
    0x89: [function (_0x3d03ae, _0x3435ec, _0xa22227) {
      'use strict';

      function _0x361dd0(_0x163500) {
        return _0x163500 && _0x163500.__esModule ? _0x163500 : {
          'default': _0x163500
        };
      }
      function _0x2f4fdb(_0x24462c) {
        if (_0x24462c && _0x24462c.__esModule) return _0x24462c;
        var _0x5d80f8 = {};
        if (null != _0x24462c) {
          for (var _0x18daea in _0x24462c) Object.prototype.hasOwnProperty.call(_0x24462c, _0x18daea) && (_0x5d80f8[_0x18daea] = _0x24462c[_0x18daea]);
        }
        return _0x5d80f8["default"] = _0x24462c, _0x5d80f8;
      }
      function _0x1d3975(_0xfa5f9d, _0x2e7fb8) {
        if (!(_0xfa5f9d instanceof _0x2e7fb8)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x4a9eed(_0x59e46d, _0x76bdac) {
        if ("function" != typeof _0x76bdac && null !== _0x76bdac) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x76bdac);
        _0x59e46d.prototype = Object.create(_0x76bdac && _0x76bdac.prototype, {
          'constructor': {
            'value': _0x59e46d,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x76bdac && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x59e46d, _0x76bdac) : _0x59e46d.__proto__ = _0x76bdac);
      }
      _0xa22227.__esModule = !0x0;
      var _0x1faa47 = _0x3d03ae("../utils/browser.js"),
        _0x217c8b = _0x2f4fdb(_0x1faa47),
        _0x459bbc = _0x3d03ae("global/document"),
        _0x7db68e = _0x361dd0(_0x459bbc),
        _0x13dc7f = _0x3d03ae('../utils/guid.js'),
        _0x1fad2a = _0x2f4fdb(_0x13dc7f),
        _0x36c9dd = _0x3d03ae("../event-target"),
        _0x1a6512 = _0x361dd0(_0x36c9dd),
        _0x100fe7 = function (_0x44c608) {
          function _0x74c117() {
            var _0x269452 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0];
            _0x1d3975(this, _0x74c117), _0x44c608.call(this);
            var _0x49ede0 = this;
            if (_0x217c8b.IS_IE8) {
              _0x49ede0 = _0x7db68e["default"].createElement("custom");
              for (var _0x4c7250 in _0x74c117.prototype) "constructor" !== _0x4c7250 && (_0x49ede0[_0x4c7250] = _0x74c117.prototype[_0x4c7250]);
            }
            var _0x2e3210 = {
                'id': _0x269452.id || "vjs_track_" + _0x1fad2a.newGUID(),
                'kind': _0x269452.kind || '',
                'label': _0x269452.label || '',
                'language': _0x269452.language || ''
              },
              _0x212bbf = function (_0x12387b) {
                Object.defineProperty(_0x49ede0, _0x12387b, {
                  'get': function () {
                    return _0x2e3210[_0x12387b];
                  },
                  'set': function () {}
                });
              };
            for (var _0x35f8ea in _0x2e3210) _0x212bbf(_0x35f8ea);
            return _0x49ede0;
          }
          return _0x4a9eed(_0x74c117, _0x44c608), _0x74c117;
        }(_0x1a6512["default"]);
      _0xa22227["default"] = _0x100fe7, _0x3435ec.exports = _0xa22227["default"];
    }, {
      '../event-target': 0x68,
      '../utils/browser.js': 0x8c,
      '../utils/guid.js': 0x93,
      'global/document': 0x1
    }],
    0x8a: [function (_0x209351, _0xb3d180, _0x22eeb9) {
      'use strict';

      function _0x262937(_0x1db4b3) {
        if (_0x1db4b3 && _0x1db4b3.__esModule) return _0x1db4b3;
        var _0x40f0d3 = {};
        if (null != _0x1db4b3) {
          for (var _0x5d12b7 in _0x1db4b3) Object.prototype.hasOwnProperty.call(_0x1db4b3, _0x5d12b7) && (_0x40f0d3[_0x5d12b7] = _0x1db4b3[_0x5d12b7]);
        }
        return _0x40f0d3["default"] = _0x1db4b3, _0x40f0d3;
      }
      function _0x116428(_0x2a66ac) {
        return _0x2a66ac && _0x2a66ac.__esModule ? _0x2a66ac : {
          'default': _0x2a66ac
        };
      }
      function _0x556e29(_0x4c8e44, _0x4b31a9) {
        if (!(_0x4c8e44 instanceof _0x4b31a9)) throw new TypeError('Cannot\x20call\x20a\x20class\x20as\x20a\x20function');
      }
      function _0x191146(_0x57c1aa, _0x35a5c1) {
        if ('function' != typeof _0x35a5c1 && null !== _0x35a5c1) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x35a5c1);
        _0x57c1aa.prototype = Object.create(_0x35a5c1 && _0x35a5c1.prototype, {
          'constructor': {
            'value': _0x57c1aa,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x35a5c1 && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x57c1aa, _0x35a5c1) : _0x57c1aa.__proto__ = _0x35a5c1);
      }
      _0x22eeb9.__esModule = !0x0;
      var _0x28747e = _0x209351("./track-list"),
        _0x15782c = _0x116428(_0x28747e),
        _0x4de610 = _0x209351("../utils/browser.js"),
        _0xc3c0e1 = _0x262937(_0x4de610),
        _0x1c4bca = _0x209351("global/document"),
        _0x51e5ad = _0x116428(_0x1c4bca),
        _0x3b8fc3 = function (_0x5617d0, _0x21a2d1) {
          for (var _0x19285f = 0x0; 0x0 < _0x5617d0.length; _0x19285f++) _0x21a2d1.id !== _0x5617d0[_0x19285f].id && (_0x5617d0[_0x19285f].selected = !0x1);
        },
        _0x295952 = function (_0x47207d) {
          function _0x13e884() {
            var _0x30ed25 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? [] : arguments[0x0];
            _0x556e29(this, _0x13e884);
            for (var _0xeb846 = void 0x0, _0x1452a5 = _0x30ed25.length - 0x1; _0x1452a5 >= 0x0; _0x1452a5--) if (_0x30ed25[_0x1452a5].selected) {
              _0x3b8fc3(_0x30ed25, _0x30ed25[_0x1452a5]);
              break;
            }
            if (_0xc3c0e1.IS_IE8) {
              _0xeb846 = _0x51e5ad["default"].createElement("custom");
              for (var _0x11e059 in _0x15782c["default"].prototype) "constructor" !== _0x11e059 && (_0xeb846[_0x11e059] = _0x15782c["default"].prototype[_0x11e059]);
              for (var _0x11e059 in _0x13e884.prototype) "constructor" !== _0x11e059 && (_0xeb846[_0x11e059] = _0x13e884.prototype[_0x11e059]);
            }
            return _0xeb846 = _0x47207d.call(this, _0x30ed25, _0xeb846), _0xeb846.changing_ = !0x1, Object.defineProperty(_0xeb846, "selectedIndex", {
              'get': function () {
                for (var _0x238e51 = 0x0; 0x0 < this.length; _0x238e51++) if (this[_0x238e51].selected) return _0x238e51;
                return -0x1;
              },
              'set': function () {}
            }), _0xeb846;
          }
          return _0x191146(_0x13e884, _0x47207d), _0x13e884.prototype.addTrack_ = function (_0x3a36e7) {
            _0x3a36e7.selected && _0x3b8fc3(this, _0x3a36e7), _0x47207d.prototype.addTrack_.call(this, _0x3a36e7), _0x3a36e7.addEventListener && _0x3a36e7.addEventListener("selectedchange", function () {
              this.changing_ || (this.changing_ = !0x0, _0x3b8fc3(this, _0x3a36e7), this.changing_ = !0x1, this.trigger("change"));
            });
          }, _0x13e884.prototype.addTrack = function (_0x283667) {
            this.addTrack_(_0x283667);
          }, _0x13e884.prototype.removeTrack = function (_0x22bb1e) {
            _0x47207d.prototype.removeTrack_.call(this, _0x22bb1e);
          }, _0x13e884;
        }(_0x15782c['default']);
      _0x22eeb9['default'] = _0x295952, _0xb3d180.exports = _0x22eeb9["default"];
    }, {
      '../utils/browser.js': 0x8c,
      './track-list': 0x88,
      'global/document': 0x1
    }],
    0x8b: [function (_0x2b3af2, _0x3582a1, _0x4ffd3b) {
      'use strict';

      function _0x127efd(_0x4385d2) {
        if (_0x4385d2 && _0x4385d2.__esModule) return _0x4385d2;
        var _0x39cdc5 = {};
        if (null != _0x4385d2) {
          for (var _0x10a4b2 in _0x4385d2) Object.prototype.hasOwnProperty.call(_0x4385d2, _0x10a4b2) && (_0x39cdc5[_0x10a4b2] = _0x4385d2[_0x10a4b2]);
        }
        return _0x39cdc5["default"] = _0x4385d2, _0x39cdc5;
      }
      function _0x38b4df(_0x14d8de) {
        return _0x14d8de && _0x14d8de.__esModule ? _0x14d8de : {
          'default': _0x14d8de
        };
      }
      function _0x43ed31(_0x19d8d6, _0x3330bb) {
        if (!(_0x19d8d6 instanceof _0x3330bb)) throw new TypeError("Cannot call a class as a function");
      }
      function _0x1baf24(_0x385a76, _0x31550c) {
        if ("function" != typeof _0x31550c && null !== _0x31550c) throw new TypeError("Super expression must either be null or a function, not " + typeof _0x31550c);
        _0x385a76.prototype = Object.create(_0x31550c && _0x31550c.prototype, {
          'constructor': {
            'value': _0x385a76,
            'enumerable': !0x1,
            'writable': !0x0,
            'configurable': !0x0
          }
        }), _0x31550c && (Object.setPrototypeOf ? Object.setPrototypeOf(_0x385a76, _0x31550c) : _0x385a76.__proto__ = _0x31550c);
      }
      _0x4ffd3b.__esModule = !0x0;
      var _0x2def0d = _0x2b3af2("./track-enums"),
        _0x340d29 = _0x2b3af2('./track'),
        _0x13cfbe = _0x38b4df(_0x340d29),
        _0x2e9f4b = _0x2b3af2('../utils/merge-options'),
        _0x3fae4e = _0x38b4df(_0x2e9f4b),
        _0x360f93 = _0x2b3af2("../utils/browser.js"),
        _0x3ebcd4 = _0x127efd(_0x360f93),
        _0x259251 = function (_0x2a807a) {
          function _0x5be54d() {
            var _0x456a26 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? {} : arguments[0x0];
            _0x43ed31(this, _0x5be54d);
            var _0x48d393 = _0x3fae4e["default"](_0x456a26, {
                'kind': _0x2def0d.VideoTrackKind[_0x456a26.kind] || ''
              }),
              _0x2691f3 = _0x2a807a.call(this, _0x48d393),
              _0x24ec8f = !0x1;
            if (_0x3ebcd4.IS_IE8) {
              for (var _0x3f688d in _0x5be54d.prototype) "constructor" !== _0x3f688d && (_0x2691f3[_0x3f688d] = _0x5be54d.prototype[_0x3f688d]);
            }
            return Object.defineProperty(_0x2691f3, "selected", {
              'get': function () {
                return _0x24ec8f;
              },
              'set': function (_0x156023) {
                "boolean" == typeof _0x156023 && _0x156023 !== _0x24ec8f && (_0x24ec8f = _0x156023, this.trigger("selectedchange"));
              }
            }), _0x48d393.selected && (_0x2691f3.selected = _0x48d393.selected), _0x2691f3;
          }
          return _0x1baf24(_0x5be54d, _0x2a807a), _0x5be54d;
        }(_0x13cfbe["default"]);
      _0x4ffd3b['default'] = _0x259251, _0x3582a1.exports = _0x4ffd3b['default'];
    }, {
      '../utils/browser.js': 0x8c,
      '../utils/merge-options': 0x95,
      './track': 0x89,
      './track-enums': 0x87
    }],
    0x8c: [function (_0x167a08, _0x5109ac, _0xfa67a9) {
      'use strict';

      function _0x164ebb(_0xb18225) {
        return _0xb18225 && _0xb18225.__esModule ? _0xb18225 : {
          'default': _0xb18225
        };
      }
      _0xfa67a9.__esModule = !0x0;
      var _0x5653e1 = _0x167a08("global/document"),
        _0x9489b7 = _0x164ebb(_0x5653e1),
        _0x304c4c = _0x167a08('global/window'),
        _0x4ce40f = _0x164ebb(_0x304c4c),
        _0x208db6 = _0x4ce40f['default'].navigator.userAgent,
        _0x5d0346 = /AppleWebKit\/([\d.]+)/i.exec(_0x208db6),
        _0x211ca5 = _0x5d0346 ? parseFloat(_0x5d0346.pop()) : null,
        _0x198f0e = /iPad/i.test(_0x208db6);
      _0xfa67a9.IS_IPAD = _0x198f0e;
      var _0x4a0c76 = /iPhone/i.test(_0x208db6) && !_0x198f0e;
      _0xfa67a9.IS_IPHONE = _0x4a0c76;
      var _0xb86f4c = /iPod/i.test(_0x208db6);
      _0xfa67a9.IS_IPOD = _0xb86f4c;
      var _0x5323b8 = _0x4a0c76 || _0x198f0e || _0xb86f4c;
      _0xfa67a9.IS_IOS = _0x5323b8;
      var _0x5ec9e4 = function () {
        var _0x493df7 = _0x208db6.match(/OS (\d+)_/i);
        return _0x493df7 && _0x493df7[0x1] ? _0x493df7[0x1] : void 0x0;
      }();
      _0xfa67a9.IOS_VERSION = _0x5ec9e4;
      var _0x51d7a4 = /Android/i.test(_0x208db6);
      _0xfa67a9.IS_ANDROID = _0x51d7a4;
      var _0x52f020 = function () {
        var _0x207a6b,
          _0x493c1f,
          _0x2c600b = _0x208db6.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
        return _0x2c600b ? (_0x207a6b = _0x2c600b[0x1] && parseFloat(_0x2c600b[0x1]), _0x493c1f = _0x2c600b[0x2] && parseFloat(_0x2c600b[0x2]), _0x207a6b && _0x493c1f ? parseFloat(_0x2c600b[0x1] + '.' + _0x2c600b[0x2]) : _0x207a6b ? _0x207a6b : null) : null;
      }();
      _0xfa67a9.ANDROID_VERSION = _0x52f020;
      var _0x471ae8 = _0x51d7a4 && /webkit/i.test(_0x208db6) && 2.3 > _0x52f020;
      _0xfa67a9.IS_OLD_ANDROID = _0x471ae8;
      var _0x595e28 = _0x51d7a4 && 0x5 > _0x52f020 && 0x219 > _0x211ca5;
      _0xfa67a9.IS_NATIVE_ANDROID = _0x595e28;
      var _0x42a8ce = /Firefox/i.test(_0x208db6);
      _0xfa67a9.IS_FIREFOX = _0x42a8ce;
      var _0x18f81b = /Edge/i.test(_0x208db6);
      _0xfa67a9.IS_EDGE = _0x18f81b;
      var _0x2d47ae = !_0x18f81b && /Chrome/i.test(_0x208db6);
      _0xfa67a9.IS_CHROME = _0x2d47ae;
      var _0x2aaf08 = /MSIE\s8\.0/.test(_0x208db6);
      _0xfa67a9.IS_IE8 = _0x2aaf08;
      var _0x5364b4 = !!("ontouchstart" in _0x4ce40f['default'] || _0x4ce40f["default"].DocumentTouch && _0x9489b7['default'] instanceof _0x4ce40f["default"].DocumentTouch);
      _0xfa67a9.TOUCH_ENABLED = _0x5364b4;
      var _0x2569d0 = "backgroundSize" in _0x9489b7["default"].createElement("video").style;
      _0xfa67a9.BACKGROUND_SIZE_SUPPORTED = _0x2569d0;
    }, {
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x8d: [function (_0x341a15, _0x28abef, _0xe238c6) {
      'use strict';

      function _0x2ce7f0(_0x135f91, _0x151f6b) {
        var _0x17ed78,
          _0x161d90,
          _0xa31132 = 0x0;
        if (!_0x151f6b) return 0x0;
        _0x135f91 && _0x135f91.length || (_0x135f91 = _0x403987.createTimeRange(0x0, 0x0));
        for (var _0x37d858 = 0x0; 0x0 < _0x135f91.length; _0x37d858++) _0x17ed78 = _0x135f91.start(_0x37d858), _0x161d90 = _0x135f91.end(_0x37d858), _0x161d90 > _0x151f6b && (_0x161d90 = _0x151f6b), _0xa31132 += _0x161d90 - _0x17ed78;
        return _0xa31132 / _0x151f6b;
      }
      _0xe238c6.__esModule = !0x0, _0xe238c6.bufferedPercent = _0x2ce7f0;
      var _0x403987 = _0x341a15("./time-ranges.js");
    }, {
      './time-ranges.js': 0x97
    }],
    0x8e: [function (_0x178b87, _0x35384e, _0x64a856) {
      'use strict';

      function _0x3c1f5b(_0x2fc4cb) {
        return _0x2fc4cb && _0x2fc4cb.__esModule ? _0x2fc4cb : {
          'default': _0x2fc4cb
        };
      }
      _0x64a856.__esModule = !0x0;
      var _0x48ee30 = _0x178b87("./log.js"),
        _0x3cc188 = _0x3c1f5b(_0x48ee30),
        _0x22c80f = {
          'get': function (_0x21f169, _0x1e5de1) {
            return _0x21f169[_0x1e5de1];
          },
          'set': function (_0x5840a2, _0x426074, _0x2d1bf5) {
            return _0x5840a2[_0x426074] = _0x2d1bf5, !0x0;
          }
        };
      _0x64a856["default"] = function (_0x28ed48) {
        var _0x45c554 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1];
        if ('function' == typeof Proxy) {
          var _0x21ab22 = function () {
            var _0x4cebc3 = {};
            return Object.keys(_0x45c554).forEach(function (_0x123476) {
              _0x22c80f.hasOwnProperty(_0x123476) && (_0x4cebc3[_0x123476] = function () {
                return _0x3cc188["default"].warn(_0x45c554[_0x123476]), _0x22c80f[_0x123476].apply(this, arguments);
              });
            }), {
              'v': new Proxy(_0x28ed48, _0x4cebc3)
            };
          }();
          if ("object" == typeof _0x21ab22) return _0x21ab22.v;
        }
        return _0x28ed48;
      }, _0x35384e.exports = _0x64a856["default"];
    }, {
      './log.js': 0x94
    }],
    0x8f: [function (_0x551d68, _0x34f21c, _0x102ccf) {
      'use strict';

      function _0xa55fa9(_0x4b6b8e) {
        if (_0x4b6b8e && _0x4b6b8e.__esModule) return _0x4b6b8e;
        var _0x7a0213 = {};
        if (null != _0x4b6b8e) {
          for (var _0x1e1a7f in _0x4b6b8e) Object.prototype.hasOwnProperty.call(_0x4b6b8e, _0x1e1a7f) && (_0x7a0213[_0x1e1a7f] = _0x4b6b8e[_0x1e1a7f]);
        }
        return _0x7a0213["default"] = _0x4b6b8e, _0x7a0213;
      }
      function _0x5dece4(_0x46ef49) {
        return _0x46ef49 && _0x46ef49.__esModule ? _0x46ef49 : {
          'default': _0x46ef49
        };
      }
      function _0x3513c6(_0x228901, _0x555726) {
        return _0x228901.raw = _0x555726, _0x228901;
      }
      function _0x2b155b(_0x127e38) {
        return 'string' == typeof _0x127e38 && /\S/.test(_0x127e38);
      }
      function _0x43b702(_0x3409d6) {
        if (/\s/.test(_0x3409d6)) throw new Error("class has illegal whitespace characters");
      }
      function _0x52c778(_0x1611ec) {
        return new RegExp("(^|\\s)" + _0x1611ec + "($|\\s)");
      }
      function _0x1f09e9(_0x721f38) {
        return function (_0x45f7c2, _0x16f308) {
          return _0x2b155b(_0x45f7c2) ? (_0x2b155b(_0x16f308) && (_0x16f308 = _0x17f90b["default"].querySelector(_0x16f308)), (_0x3363a5(_0x16f308) ? _0x16f308 : _0x17f90b["default"])[_0x721f38](_0x45f7c2)) : _0x17f90b['default'][_0x721f38](null);
        };
      }
      function _0x2e20a4(_0x40b15a) {
        return 0x0 === _0x40b15a.indexOf('#') && (_0x40b15a = _0x40b15a.slice(0x1)), _0x17f90b["default"].getElementById(_0x40b15a);
      }
      function _0x2a60ca() {
        var _0x51b804 = arguments.length <= 0x0 || void 0x0 === arguments[0x0] ? 'div' : arguments[0x0],
          _0x1b1663 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? {} : arguments[0x1],
          _0x3066eb = arguments.length <= 0x2 || void 0x0 === arguments[0x2] ? {} : arguments[0x2],
          _0x28c289 = _0x17f90b["default"].createElement(_0x51b804);
        return Object.getOwnPropertyNames(_0x1b1663).forEach(function (_0x5e3b4f) {
          var _0x3f73d2 = _0x1b1663[_0x5e3b4f];
          -0x1 !== _0x5e3b4f.indexOf("aria-") || "role" === _0x5e3b4f || "type" === _0x5e3b4f ? (_0x241aa7["default"].warn(_0x2feb45['default'](_0xdbc416, _0x5e3b4f, _0x3f73d2)), _0x28c289.setAttribute(_0x5e3b4f, _0x3f73d2)) : _0x28c289[_0x5e3b4f] = _0x3f73d2;
        }), Object.getOwnPropertyNames(_0x3066eb).forEach(function (_0x5e087c) {
          _0x28c289.setAttribute(_0x5e087c, _0x3066eb[_0x5e087c]);
        }), _0x28c289;
      }
      function _0xcc0def(_0x2644b2, _0x39ab2e) {
        "undefined" == typeof _0x2644b2.textContent ? _0x2644b2.innerText = _0x39ab2e : _0x2644b2.textContent = _0x39ab2e;
      }
      function _0x59e67e(_0x1a9d02, _0x2578e4) {
        _0x2578e4.firstChild ? _0x2578e4.insertBefore(_0x1a9d02, _0x2578e4.firstChild) : _0x2578e4.appendChild(_0x1a9d02);
      }
      function _0x556d99(_0x2c8ac5) {
        var _0x14a36a = _0x2c8ac5[_0x3fa2e8];
        return _0x14a36a || (_0x14a36a = _0x2c8ac5[_0x3fa2e8] = _0x42c485.newGUID()), _0x29b92a[_0x14a36a] || (_0x29b92a[_0x14a36a] = {}), _0x29b92a[_0x14a36a];
      }
      function _0x53685c(_0x537d82) {
        var _0x2e06b8 = _0x537d82[_0x3fa2e8];
        return _0x2e06b8 ? !!Object.getOwnPropertyNames(_0x29b92a[_0x2e06b8]).length : !0x1;
      }
      function _0x486973(_0x415d6d) {
        var _0x35d245 = _0x415d6d[_0x3fa2e8];
        if (_0x35d245) {
          delete _0x29b92a[_0x35d245];
          try {
            delete _0x415d6d[_0x3fa2e8];
          } catch (_0x3c50d4) {
            _0x415d6d.removeAttribute ? _0x415d6d.removeAttribute(_0x3fa2e8) : _0x415d6d[_0x3fa2e8] = null;
          }
        }
      }
      function _0x3849f8(_0x4c141d, _0x59d509) {
        return _0x4c141d.classList ? _0x4c141d.classList.contains(_0x59d509) : (_0x43b702(_0x59d509), _0x52c778(_0x59d509).test(_0x4c141d.className));
      }
      function _0x19d6fe(_0x4db450, _0x34d654) {
        return _0x4db450.classList ? _0x4db450.classList.add(_0x34d654) : _0x3849f8(_0x4db450, _0x34d654) || (_0x4db450.className = (_0x4db450.className + '\x20' + _0x34d654).trim()), _0x4db450;
      }
      function _0x705740(_0x300bdb, _0x49844e) {
        return _0x300bdb.classList ? _0x300bdb.classList.remove(_0x49844e) : (_0x43b702(_0x49844e), _0x300bdb.className = _0x300bdb.className.split(/\s+/).filter(function (_0xd72486) {
          return _0xd72486 !== _0x49844e;
        }).join('\x20')), _0x300bdb;
      }
      function _0x3078a7(_0xb0a82d, _0x148933, _0x1ff5a5) {
        var _0x44315e = _0x3849f8(_0xb0a82d, _0x148933);
        return 'function' == typeof _0x1ff5a5 && (_0x1ff5a5 = _0x1ff5a5(_0xb0a82d, _0x148933)), 'boolean' != typeof _0x1ff5a5 && (_0x1ff5a5 = !_0x44315e), _0x1ff5a5 !== _0x44315e ? (_0x1ff5a5 ? _0x19d6fe(_0xb0a82d, _0x148933) : _0x705740(_0xb0a82d, _0x148933), _0xb0a82d) : void 0x0;
      }
      function _0x4b7205(_0xb388b4, _0x5a6aa2) {
        Object.getOwnPropertyNames(_0x5a6aa2).forEach(function (_0x155bf4) {
          var _0x113e56 = _0x5a6aa2[_0x155bf4];
          null === _0x113e56 || 'undefined' == typeof _0x113e56 || _0x113e56 === !0x1 ? _0xb388b4.removeAttribute(_0x155bf4) : _0xb388b4.setAttribute(_0x155bf4, _0x113e56 === !0x0 ? '' : _0x113e56);
        });
      }
      function _0x14acd2(_0x3e1e39) {
        var _0x199bb4, _0x2fbe24, _0xb806c0, _0x55e46d, _0x94ce2;
        if (_0x199bb4 = {}, _0x2fbe24 = ",autoplay,controls,loop,muted,default,", _0x3e1e39 && _0x3e1e39.attributes && _0x3e1e39.attributes.length > 0x0) {
          _0xb806c0 = _0x3e1e39.attributes;
          for (var _0x2f1254 = _0xb806c0.length - 0x1; _0x2f1254 >= 0x0; _0x2f1254--) _0x55e46d = _0xb806c0[_0x2f1254].name, _0x94ce2 = _0xb806c0[_0x2f1254].value, ("boolean" == typeof _0x3e1e39[_0x55e46d] || -0x1 !== _0x2fbe24.indexOf(',' + _0x55e46d + ',')) && (_0x94ce2 = null !== _0x94ce2 ? !0x0 : !0x1), _0x199bb4[_0x55e46d] = _0x94ce2;
        }
        return _0x199bb4;
      }
      function _0x4eb29f() {
        _0x17f90b["default"].body.focus(), _0x17f90b['default'].onselectstart = function () {
          return !0x1;
        };
      }
      function _0x138d05() {
        _0x17f90b['default'].onselectstart = function () {
          return !0x0;
        };
      }
      function _0xc57b54(_0x4c51a5) {
        var _0x157ca4 = void 0x0;
        if (_0x4c51a5.getBoundingClientRect && _0x4c51a5.parentNode && (_0x157ca4 = _0x4c51a5.getBoundingClientRect()), !_0x157ca4) return {
          'left': 0x0,
          'top': 0x0
        };
        var _0x2eacc2 = _0x17f90b["default"].documentElement,
          _0x40a62b = _0x17f90b["default"].body,
          _0x6e27fc = _0x2eacc2.clientLeft || _0x40a62b.clientLeft || 0x0,
          _0x1dee76 = _0x43591c["default"].pageXOffset || _0x40a62b.scrollLeft,
          _0x53c832 = _0x157ca4.left + _0x1dee76 - _0x6e27fc,
          _0x3fdaa9 = _0x2eacc2.clientTop || _0x40a62b.clientTop || 0x0,
          _0x561b29 = _0x43591c["default"].pageYOffset || _0x40a62b.scrollTop,
          _0x481143 = _0x157ca4.top + _0x561b29 - _0x3fdaa9;
        return {
          'left': Math.round(_0x53c832),
          'top': Math.round(_0x481143)
        };
      }
      function _0x43e453(_0x3be59f, _0x5ee40f) {
        var _0x47c621 = {},
          _0xb28f14 = _0xc57b54(_0x3be59f),
          _0x31b813 = _0x3be59f.offsetWidth,
          _0x2d0e15 = _0x3be59f.offsetHeight,
          _0xcf2084 = _0xb28f14.top,
          _0x3f2174 = _0xb28f14.left,
          _0x1c3a03 = _0x5ee40f.pageY,
          _0x534161 = _0x5ee40f.pageX;
        return _0x5ee40f.changedTouches && (_0x534161 = _0x5ee40f.changedTouches[0x0].pageX, _0x1c3a03 = _0x5ee40f.changedTouches[0x0].pageY), _0x47c621.y = Math.max(0x0, Math.min(0x1, (_0xcf2084 - _0x1c3a03 + _0x2d0e15) / _0x2d0e15)), _0x47c621.x = Math.max(0x0, Math.min(0x1, (_0x534161 - _0x3f2174) / _0x31b813)), _0x47c621;
      }
      function _0x3363a5(_0x3fac71) {
        return !!_0x3fac71 && "object" == typeof _0x3fac71 && 0x1 === _0x3fac71.nodeType;
      }
      function _0xecb80f(_0x196d26) {
        return !!_0x196d26 && "object" == typeof _0x196d26 && 0x3 === _0x196d26.nodeType;
      }
      function _0x31077d(_0x224c75) {
        for (; _0x224c75.firstChild;) _0x224c75.removeChild(_0x224c75.firstChild);
        return _0x224c75;
      }
      function _0x59e6ff(_0x3f4269) {
        return 'function' == typeof _0x3f4269 && (_0x3f4269 = _0x3f4269()), (Array.isArray(_0x3f4269) ? _0x3f4269 : [_0x3f4269]).map(function (_0x1714ae) {
          return "function" == typeof _0x1714ae && (_0x1714ae = _0x1714ae()), _0x3363a5(_0x1714ae) || _0xecb80f(_0x1714ae) ? _0x1714ae : "string" == typeof _0x1714ae && /\S/.test(_0x1714ae) ? _0x17f90b['default'].createTextNode(_0x1714ae) : void 0x0;
        }).filter(function (_0x41abe3) {
          return _0x41abe3;
        });
      }
      function _0x96ae54(_0x50c116, _0x4d9ca8) {
        return _0x59e6ff(_0x4d9ca8).forEach(function (_0x492209) {
          return _0x50c116.appendChild(_0x492209);
        }), _0x50c116;
      }
      function _0x5dc72a(_0x45728e, _0x52707c) {
        return _0x96ae54(_0x31077d(_0x45728e), _0x52707c);
      }
      _0x102ccf.__esModule = !0x0, _0x102ccf.getEl = _0x2e20a4, _0x102ccf.createEl = _0x2a60ca, _0x102ccf.textContent = _0xcc0def, _0x102ccf.insertElFirst = _0x59e67e, _0x102ccf.getElData = _0x556d99, _0x102ccf.hasElData = _0x53685c, _0x102ccf.removeElData = _0x486973, _0x102ccf.hasElClass = _0x3849f8, _0x102ccf.addElClass = _0x19d6fe, _0x102ccf.removeElClass = _0x705740, _0x102ccf.toggleElClass = _0x3078a7, _0x102ccf.setElAttributes = _0x4b7205, _0x102ccf.getElAttributes = _0x14acd2, _0x102ccf.blockTextSelection = _0x4eb29f, _0x102ccf.unblockTextSelection = _0x138d05, _0x102ccf.findElPosition = _0xc57b54, _0x102ccf.getPointerPosition = _0x43e453, _0x102ccf.isEl = _0x3363a5, _0x102ccf.isTextNode = _0xecb80f, _0x102ccf.emptyEl = _0x31077d, _0x102ccf.normalizeContent = _0x59e6ff, _0x102ccf.appendContent = _0x96ae54, _0x102ccf.insertContent = _0x5dc72a;
      var _0xdbc416 = _0x3513c6(["Setting attributes in the second argument of createEl()\n                has been deprecated. Use the third argument instead.\n                createEl(type, properties, attributes). Attempting to set ", '\x20to\x20', '.'], ['Setting\x20attributes\x20in\x20the\x20second\x20argument\x20of\x20createEl()\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20has\x20been\x20deprecated.\x20Use\x20the\x20third\x20argument\x20instead.\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20createEl(type,\x20properties,\x20attributes).\x20Attempting\x20to\x20set\x20', '\x20to\x20', '.']),
        _0xb2f2a7 = _0x551d68("global/document"),
        _0x17f90b = _0x5dece4(_0xb2f2a7),
        _0x22eefc = _0x551d68("global/window"),
        _0x43591c = _0x5dece4(_0x22eefc),
        _0x559456 = _0x551d68('./guid.js'),
        _0x42c485 = _0xa55fa9(_0x559456),
        _0x68f25e = _0x551d68("./log.js"),
        _0x241aa7 = _0x5dece4(_0x68f25e),
        _0x4e2cba = _0x551d68('tsml'),
        _0x2feb45 = _0x5dece4(_0x4e2cba),
        _0x29b92a = {},
        _0x3fa2e8 = "vdata" + new Date().getTime(),
        _0x2a8bdc = _0x1f09e9("querySelector");
      _0x102ccf.$ = _0x2a8bdc;
      var _0x18e53d = _0x1f09e9('querySelectorAll');
      _0x102ccf.$$ = _0x18e53d;
    }, {
      './guid.js': 0x93,
      './log.js': 0x94,
      'global/document': 0x1,
      'global/window': 0x2,
      'tsml': 0x37
    }],
    0x90: [function (_0xa69abb, _0x108d68, _0x24177e) {
      'use strict';

      function _0x33d2b1(_0x1e0680) {
        return _0x1e0680 && _0x1e0680.__esModule ? _0x1e0680 : {
          'default': _0x1e0680
        };
      }
      function _0x25bd94(_0x27b515) {
        if (_0x27b515 && _0x27b515.__esModule) return _0x27b515;
        var _0x46b93f = {};
        if (null != _0x27b515) {
          for (var _0x2e3e69 in _0x27b515) Object.prototype.hasOwnProperty.call(_0x27b515, _0x2e3e69) && (_0x46b93f[_0x2e3e69] = _0x27b515[_0x2e3e69]);
        }
        return _0x46b93f["default"] = _0x27b515, _0x46b93f;
      }
      function _0x4750d1(_0x460926, _0x325b7e, _0xd50a7c) {
        if (Array.isArray(_0x325b7e)) return _0x5f522d(_0x4750d1, _0x460926, _0x325b7e, _0xd50a7c);
        var _0x21450a = _0x1add45.getElData(_0x460926);
        _0x21450a.handlers || (_0x21450a.handlers = {}), _0x21450a.handlers[_0x325b7e] || (_0x21450a.handlers[_0x325b7e] = []), _0xd50a7c.guid || (_0xd50a7c.guid = _0x5cc5da.newGUID()), _0x21450a.handlers[_0x325b7e].push(_0xd50a7c), _0x21450a.dispatcher || (_0x21450a.disabled = !0x1, _0x21450a.dispatcher = function (_0x3bfd16, _0x3a0a60) {
          if (!_0x21450a.disabled) {
            _0x3bfd16 = _0x156fca(_0x3bfd16);
            var _0x2d2850 = _0x21450a.handlers[_0x3bfd16.type];
            if (_0x2d2850) {
              for (var _0x5ea3f1 = _0x2d2850.slice(0x0), _0x4626b5 = 0x0, _0x21fc45 = _0x5ea3f1.length; _0x21fc45 > 0x0 && !_0x3bfd16.isImmediatePropagationStopped(); _0x4626b5++) _0x5ea3f1[_0x4626b5].call(_0x460926, _0x3bfd16, _0x3a0a60);
            }
          }
        }), 0x1 === _0x21450a.handlers[_0x325b7e].length && (_0x460926.addEventListener ? _0x460926.addEventListener(_0x325b7e, _0x21450a.dispatcher, !0x1) : _0x460926.attachEvent && _0x460926.attachEvent('on' + _0x325b7e, _0x21450a.dispatcher));
      }
      function _0x3fd649(_0x5562e3, _0x340866, _0x2c8897) {
        if (_0x1add45.hasElData(_0x5562e3)) {
          var _0x5f04f8 = _0x1add45.getElData(_0x5562e3);
          if (_0x5f04f8.handlers) {
            if (Array.isArray(_0x340866)) return _0x5f522d(_0x3fd649, _0x5562e3, _0x340866, _0x2c8897);
            var _0x43fc88 = function (_0x3f3ab2) {
              _0x5f04f8.handlers[_0x3f3ab2] = [], _0x37e060(_0x5562e3, _0x3f3ab2);
            };
            if (_0x340866) {
              var _0x74ca19 = _0x5f04f8.handlers[_0x340866];
              if (_0x74ca19) {
                if (!_0x2c8897) return void _0x43fc88(_0x340866);
                if (_0x2c8897.guid) {
                  for (var _0x111ec7 = 0x0; 0x0 < _0x74ca19.length; _0x111ec7++) _0x74ca19[_0x111ec7].guid === _0x2c8897.guid && _0x74ca19.splice(_0x111ec7--, 0x1);
                }
                _0x37e060(_0x5562e3, _0x340866);
              }
            } else {
              for (var _0x9834c9 in _0x5f04f8.handlers) _0x43fc88(_0x9834c9);
            }
          }
        }
      }
      function _0x1474dc(_0x554fdd, _0xa92a14, _0xca127e) {
        var _0x563a68 = _0x1add45.hasElData(_0x554fdd) ? _0x1add45.getElData(_0x554fdd) : {},
          _0x5d81b5 = _0x554fdd.parentNode || _0x554fdd.ownerDocument;
        if ("string" == typeof _0xa92a14 && (_0xa92a14 = {
          'type': _0xa92a14,
          'target': _0x554fdd
        }), _0xa92a14 = _0x156fca(_0xa92a14), _0x563a68.dispatcher && _0x563a68.dispatcher.call(_0x554fdd, _0xa92a14, _0xca127e), _0x5d81b5 && !_0xa92a14.isPropagationStopped() && _0xa92a14.bubbles === !0x0) _0x1474dc.call(null, _0x5d81b5, _0xa92a14, _0xca127e);else {
          if (!_0x5d81b5 && !_0xa92a14.defaultPrevented) {
            var _0x85a679 = _0x1add45.getElData(_0xa92a14.target);
            _0xa92a14.target[_0xa92a14.type] && (_0x85a679.disabled = !0x0, "function" == typeof _0xa92a14.target[_0xa92a14.type] && _0xa92a14.target[_0xa92a14.type](), _0x85a679.disabled = !0x1);
          }
        }
        return !_0xa92a14.defaultPrevented;
      }
      function _0xedf91f(_0x15d756, _0x4716fc, _0x5b4a5a) {
        if (Array.isArray(_0x4716fc)) return _0x5f522d(_0xedf91f, _0x15d756, _0x4716fc, _0x5b4a5a);
        var _0x1a567d = function _0x2406ab() {
          _0x3fd649(_0x15d756, _0x4716fc, _0x2406ab), _0x5b4a5a.apply(this, arguments);
        };
        _0x1a567d.guid = _0x5b4a5a.guid = _0x5b4a5a.guid || _0x5cc5da.newGUID(), _0x4750d1(_0x15d756, _0x4716fc, _0x1a567d);
      }
      function _0x156fca(_0x5e79a8) {
        function _0x59abac() {
          return !0x0;
        }
        function _0x338354() {
          return !0x1;
        }
        if (!_0x5e79a8 || !_0x5e79a8.isPropagationStopped) {
          var _0x36d4be = _0x5e79a8 || _0x354c92["default"].event;
          _0x5e79a8 = {};
          for (var _0xad1632 in _0x36d4be) 'layerX' !== _0xad1632 && 'layerY' !== _0xad1632 && "keyLocation" !== _0xad1632 && "webkitMovementX" !== _0xad1632 && "webkitMovementY" !== _0xad1632 && ("returnValue" === _0xad1632 && _0x36d4be.preventDefault || (_0x5e79a8[_0xad1632] = _0x36d4be[_0xad1632]));
          if (_0x5e79a8.target || (_0x5e79a8.target = _0x5e79a8.srcElement || _0x25d5dc["default"]), _0x5e79a8.relatedTarget || (_0x5e79a8.relatedTarget = _0x5e79a8.fromElement === _0x5e79a8.target ? _0x5e79a8.toElement : _0x5e79a8.fromElement), _0x5e79a8.preventDefault = function () {
            _0x36d4be.preventDefault && _0x36d4be.preventDefault(), _0x5e79a8.returnValue = !0x1, _0x36d4be.returnValue = !0x1, _0x5e79a8.defaultPrevented = !0x0;
          }, _0x5e79a8.defaultPrevented = !0x1, _0x5e79a8.stopPropagation = function () {
            _0x36d4be.stopPropagation && _0x36d4be.stopPropagation(), _0x5e79a8.cancelBubble = !0x0, _0x36d4be.cancelBubble = !0x0, _0x5e79a8.isPropagationStopped = _0x59abac;
          }, _0x5e79a8.isPropagationStopped = _0x338354, _0x5e79a8.stopImmediatePropagation = function () {
            _0x36d4be.stopImmediatePropagation && _0x36d4be.stopImmediatePropagation(), _0x5e79a8.isImmediatePropagationStopped = _0x59abac, _0x5e79a8.stopPropagation();
          }, _0x5e79a8.isImmediatePropagationStopped = _0x338354, null != _0x5e79a8.clientX) {
            var _0x427973 = _0x25d5dc["default"].documentElement,
              _0x2eab05 = _0x25d5dc["default"].body;
            _0x5e79a8.pageX = _0x5e79a8.clientX + (_0x427973 && _0x427973.scrollLeft || _0x2eab05 && _0x2eab05.scrollLeft || 0x0) - (_0x427973 && _0x427973.clientLeft || _0x2eab05 && _0x2eab05.clientLeft || 0x0), _0x5e79a8.pageY = _0x5e79a8.clientY + (_0x427973 && _0x427973.scrollTop || _0x2eab05 && _0x2eab05.scrollTop || 0x0) - (_0x427973 && _0x427973.clientTop || _0x2eab05 && _0x2eab05.clientTop || 0x0);
          }
          _0x5e79a8.which = _0x5e79a8.charCode || _0x5e79a8.keyCode, null != _0x5e79a8.button && (_0x5e79a8.button = 0x1 & _0x5e79a8.button ? 0x0 : 0x4 & _0x5e79a8.button ? 0x1 : 0x2 & _0x5e79a8.button ? 0x2 : 0x0);
        }
        return _0x5e79a8;
      }
      function _0x37e060(_0x298cd5, _0x1d7cd6) {
        var _0x1b1f0e = _0x1add45.getElData(_0x298cd5);
        0x0 === _0x1b1f0e.handlers[_0x1d7cd6].length && (_0x298cd5.removeEventListener ? _0x298cd5.removeEventListener(_0x1d7cd6, _0x1b1f0e.dispatcher, !0x1) : _0x298cd5.detachEvent && _0x298cd5.detachEvent('on' + _0x1d7cd6, _0x1b1f0e.dispatcher)), Object.getOwnPropertyNames(_0x1b1f0e.handlers).length <= 0x0 && delete _0x1b1f0e.disabled, 0x0 === Object.getOwnPropertyNames(_0x1b1f0e).length && _0x1add45.removeElData(_0x298cd5);
      }
      function _0x5f522d(_0x4fd219, _0x3e9528, _0x2a0734, _0xc7b00d) {
        _0x2a0734.forEach(function (_0x2c3a9b) {
          _0x4fd219(_0x3e9528, _0x2c3a9b, _0xc7b00d);
        });
      }
      _0x24177e.__esModule = !0x0, _0x24177e.on = _0x4750d1, _0x24177e.off = _0x3fd649, _0x24177e.trigger = _0x1474dc, _0x24177e.one = _0xedf91f, _0x24177e.fixEvent = _0x156fca;
      var _0x4423b4 = _0xa69abb("./dom.js"),
        _0x1add45 = _0x25bd94(_0x4423b4),
        _0x35f3fb = _0xa69abb("./guid.js"),
        _0x5cc5da = _0x25bd94(_0x35f3fb),
        _0x4409a8 = _0xa69abb("global/window"),
        _0x354c92 = _0x33d2b1(_0x4409a8),
        _0x406ad8 = _0xa69abb("global/document"),
        _0x25d5dc = _0x33d2b1(_0x406ad8);
    }, {
      './dom.js': 0x8f,
      './guid.js': 0x93,
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x91: [function (_0x37182d, _0x20c94f, _0x514ff9) {
      'use strict';

      _0x514ff9.__esModule = !0x0;
      var _0x113104 = _0x37182d("./guid.js"),
        _0x126788 = function (_0x10a995, _0x17cc83, _0x5b7b7e) {
          _0x17cc83.guid || (_0x17cc83.guid = _0x113104.newGUID());
          var _0x2a17d3 = function () {
            return _0x17cc83.apply(_0x10a995, arguments);
          };
          return _0x2a17d3.guid = _0x5b7b7e ? _0x5b7b7e + '_' + _0x17cc83.guid : _0x17cc83.guid, _0x2a17d3;
        };
      _0x514ff9.bind = _0x126788;
    }, {
      './guid.js': 0x93
    }],
    0x92: [function (_0x5b0104, _0x2227dc, _0x163f57) {
      'use strict';

      function _0x2cd070(_0x43a72f) {
        var _0x4d7c70 = arguments.length <= 0x1 || void 0x0 === arguments[0x1] ? _0x43a72f : arguments[0x1];
        return function () {
          _0x43a72f = 0x0 > _0x43a72f ? 0x0 : _0x43a72f;
          var _0x5671f7 = Math.floor(_0x43a72f % 0x3c),
            _0x126c63 = Math.floor(_0x43a72f / 0x3c % 0x3c),
            _0x1d352f = Math.floor(_0x43a72f / 0xe10),
            _0x21ae92 = Math.floor(_0x4d7c70 / 0x3c % 0x3c),
            _0x152b34 = Math.floor(_0x4d7c70 / 0xe10);
          return (isNaN(_0x43a72f) || _0x43a72f === 0x1 / 0x0) && (_0x1d352f = _0x126c63 = _0x5671f7 = '-'), _0x1d352f = _0x1d352f > 0x0 || _0x152b34 > 0x0 ? _0x1d352f + ':' : '', _0x126c63 = ((_0x1d352f || _0x21ae92 >= 0xa) && 0xa > _0x126c63 ? '0' + _0x126c63 : _0x126c63) + ':', _0x5671f7 = 0xa > _0x5671f7 ? '0' + _0x5671f7 : _0x5671f7, _0x1d352f + _0x126c63 + _0x5671f7;
        }();
      }
      _0x163f57.__esModule = !0x0, _0x163f57["default"] = _0x2cd070, _0x2227dc.exports = _0x163f57["default"];
    }, {}],
    0x93: [function (_0x445ace, _0x4c1a0a, _0x40d91e) {
      'use strict';

      function _0x425aa6() {
        return _0x46160f++;
      }
      _0x40d91e.__esModule = !0x0, _0x40d91e.newGUID = _0x425aa6;
      var _0x46160f = 0x1;
    }, {}],
    0x94: [function (_0x4ac4ca, _0x2b4c14, _0x3f9211) {
      'use strict';

      function _0x18fe4e(_0x477224) {
        return _0x477224 && _0x477224.__esModule ? _0x477224 : {
          'default': _0x477224
        };
      }
      function _0x4f3962(_0x232305, _0x407238) {
        var _0x27f8f7 = Array.prototype.slice.call(_0x407238),
          _0x557dc3 = function () {},
          _0x2aa98e = _0x4b4789["default"].console || {
            'log': _0x557dc3,
            'warn': _0x557dc3,
            'error': _0x557dc3
          };
        _0x232305 ? _0x27f8f7.unshift(_0x232305.toUpperCase() + ':') : _0x232305 = 'log', _0x50d44f.history.push(_0x27f8f7), _0x27f8f7.unshift("VIDEOJS:"), _0x2aa98e[_0x232305].apply ? _0x2aa98e[_0x232305].apply(_0x2aa98e, _0x27f8f7) : _0x2aa98e[_0x232305](_0x27f8f7.join('\x20'));
      }
      _0x3f9211.__esModule = !0x0;
      var _0x474dfe = _0x4ac4ca("global/window"),
        _0x4b4789 = _0x18fe4e(_0x474dfe),
        _0x50d44f = function () {
          _0x4f3962(null, arguments);
        };
      _0x50d44f.history = [], _0x50d44f.error = function () {
        _0x4f3962('error', arguments);
      }, _0x50d44f.warn = function () {
        _0x4f3962('warn', arguments);
      }, _0x3f9211['default'] = _0x50d44f, _0x2b4c14.exports = _0x3f9211["default"];
    }, {
      'global/window': 0x2
    }],
    0x95: [function (_0x2d2627, _0x470529, _0x532068) {
      'use strict';

      function _0x20fce7(_0x5d415b) {
        return _0x5d415b && _0x5d415b.__esModule ? _0x5d415b : {
          'default': _0x5d415b
        };
      }
      function _0x38a3c7(_0x9720dd) {
        return !!_0x9720dd && "object" == typeof _0x9720dd && "[object Object]" === _0x9720dd.toString() && _0x9720dd.constructor === Object;
      }
      function _0x342cdf() {
        var _0x59305d = Array.prototype.slice.call(arguments);
        return _0x59305d.unshift({}), _0x59305d.push(_0x5eb94f), _0x70f880["default"].apply(null, _0x59305d), _0x59305d[0x0];
      }
      _0x532068.__esModule = !0x0, _0x532068["default"] = _0x342cdf;
      var _0x90725e = _0x2d2627('lodash-compat/object/merge'),
        _0x70f880 = _0x20fce7(_0x90725e),
        _0x5eb94f = function (_0x535514, _0xc733fa) {
          return _0x38a3c7(_0xc733fa) ? _0x38a3c7(_0x535514) ? void 0x0 : _0x342cdf(_0xc733fa) : _0xc733fa;
        };
      _0x470529.exports = _0x532068['default'];
    }, {
      'lodash-compat/object/merge': 0x28
    }],
    0x96: [function (_0x2b7d03, _0x7c1503, _0xa4e245) {
      'use strict';

      function _0x47d71f(_0x3ed913) {
        return _0x3ed913 && _0x3ed913.__esModule ? _0x3ed913 : {
          'default': _0x3ed913
        };
      }
      _0xa4e245.__esModule = !0x0;
      var _0xd9a975 = _0x2b7d03("global/document"),
        _0x28fc46 = _0x47d71f(_0xd9a975),
        _0x51d8d4 = function (_0x5f39ca) {
          var _0x353089 = _0x28fc46["default"].createElement("style");
          return _0x353089.className = _0x5f39ca, _0x353089;
        };
      _0xa4e245.createStyleElement = _0x51d8d4;
      var _0x3a7813 = function (_0x214a85, _0x583b3c) {
        _0x214a85.styleSheet ? _0x214a85.styleSheet.cssText = _0x583b3c : _0x214a85.textContent = _0x583b3c;
      };
      _0xa4e245.setTextContent = _0x3a7813;
    }, {
      'global/document': 0x1
    }],
    0x97: [function (_0x1c2e41, _0x46a684, _0x28b8bb) {
      'use strict';

      function _0x3fc6e9(_0x4b6d55) {
        return _0x4b6d55 && _0x4b6d55.__esModule ? _0x4b6d55 : {
          'default': _0x4b6d55
        };
      }
      function _0x5d02bf(_0x144022, _0x48d803) {
        return Array.isArray(_0x144022) ? _0x36d67c(_0x144022) : void 0x0 === _0x144022 || void 0x0 === _0x48d803 ? _0x36d67c() : _0x36d67c([[_0x144022, _0x48d803]]);
      }
      function _0x36d67c(_0x56c279) {
        return void 0x0 === _0x56c279 || 0x0 === _0x56c279.length ? {
          'length': 0x0,
          'start': function () {
            throw new Error("This TimeRanges object is empty");
          },
          'end': function () {
            throw new Error("This TimeRanges object is empty");
          }
        } : {
          'length': _0x56c279.length,
          'start': _0x46bf92.bind(null, "start", 0x0, _0x56c279),
          'end': _0x46bf92.bind(null, 'end', 0x1, _0x56c279)
        };
      }
      function _0x46bf92(_0x220b5b, _0x406e, _0x20212b, _0x4cf849) {
        return void 0x0 === _0x4cf849 && (_0x227f64["default"].warn("DEPRECATED: Function '" + _0x220b5b + '\x27\x20on\x20\x27TimeRanges\x27\x20called\x20without\x20an\x20index\x20argument.'), _0x4cf849 = 0x0), _0x5e3cff(_0x220b5b, _0x4cf849, _0x20212b.length - 0x1), _0x20212b[_0x4cf849][_0x406e];
      }
      function _0x5e3cff(_0x23b6dc, _0x74d8f3, _0x36b3fc) {
        if (0x0 > _0x74d8f3 || _0x74d8f3 > _0x36b3fc) throw new Error("Failed to execute '" + _0x23b6dc + "' on 'TimeRanges': The index provided (" + _0x74d8f3 + ')\x20is\x20greater\x20than\x20or\x20equal\x20to\x20the\x20maximum\x20bound\x20(' + _0x36b3fc + ').');
      }
      _0x28b8bb.__esModule = !0x0, _0x28b8bb.createTimeRanges = _0x5d02bf;
      var _0x54b266 = _0x1c2e41("./log.js"),
        _0x227f64 = _0x3fc6e9(_0x54b266);
      _0x28b8bb.createTimeRange = _0x5d02bf;
    }, {
      './log.js': 0x94
    }],
    0x98: [function (_0x25d812, _0x516e3b, _0x36aa34) {
      'use strict';

      function _0x317def(_0x52796b) {
        return _0x52796b.charAt(0x0).toUpperCase() + _0x52796b.slice(0x1);
      }
      _0x36aa34.__esModule = !0x0, _0x36aa34['default'] = _0x317def, _0x516e3b.exports = _0x36aa34["default"];
    }, {}],
    0x99: [function (_0x3c4a32, _0x1e1b96, _0x112d5a) {
      'use strict';

      function _0xf49cec(_0x193b1f) {
        return _0x193b1f && _0x193b1f.__esModule ? _0x193b1f : {
          'default': _0x193b1f
        };
      }
      _0x112d5a.__esModule = !0x0;
      var _0x18be08 = _0x3c4a32("global/document"),
        _0x5dfdbe = _0xf49cec(_0x18be08),
        _0xbbb831 = _0x3c4a32("global/window"),
        _0x9bf8d7 = _0xf49cec(_0xbbb831),
        _0x533b6d = function (_0x3b50e2) {
          var _0x5cc29c = ['protocol', 'hostname', "port", "pathname", "search", 'hash', 'host'],
            _0x15e008 = _0x5dfdbe["default"].createElement('a');
          _0x15e008.href = _0x3b50e2;
          var _0x46a373 = '' === _0x15e008.host && "file:" !== _0x15e008.protocol,
            _0x3f6484 = void 0x0;
          _0x46a373 && (_0x3f6484 = _0x5dfdbe["default"].createElement('div'), _0x3f6484.innerHTML = "<a href=\"" + _0x3b50e2 + '\x22></a>', _0x15e008 = _0x3f6484.firstChild, _0x3f6484.setAttribute("style", "display:none; position:absolute;"), _0x5dfdbe['default'].body.appendChild(_0x3f6484));
          for (var _0x3d553f = {}, _0x580ed5 = 0x0; 0x0 < _0x5cc29c.length; _0x580ed5++) _0x3d553f[_0x5cc29c[_0x580ed5]] = _0x15e008[_0x5cc29c[_0x580ed5]];
          return 'http:' === _0x3d553f.protocol && (_0x3d553f.host = _0x3d553f.host.replace(/:80$/, '')), "https:" === _0x3d553f.protocol && (_0x3d553f.host = _0x3d553f.host.replace(/:443$/, '')), _0x46a373 && _0x5dfdbe["default"].body.removeChild(_0x3f6484), _0x3d553f;
        };
      _0x112d5a.parseUrl = _0x533b6d;
      var _0xdb5577 = function (_0x19cc02) {
        if (!_0x19cc02.match(/^https?:\/\//)) {
          var _0x1ebad3 = _0x5dfdbe["default"].createElement('div');
          _0x1ebad3.innerHTML = "<a href=\"" + _0x19cc02 + "\">x</a>", _0x19cc02 = _0x1ebad3.firstChild.href;
        }
        return _0x19cc02;
      };
      _0x112d5a.getAbsoluteURL = _0xdb5577;
      var _0xb44d6d = function (_0x5612cf) {
        if ("string" == typeof _0x5612cf) {
          var _0x33a51b = /^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/i.exec(_0x5612cf);
          if (_0x33a51b) return _0x33a51b.pop().toLowerCase();
        }
        return '';
      };
      _0x112d5a.getFileExtension = _0xb44d6d;
      var _0x41c31f = function (_0x26d1f1) {
        var _0x4c3c00 = _0x9bf8d7["default"].location,
          _0x43a747 = _0x533b6d(_0x26d1f1),
          _0x5ef6b1 = ':' === _0x43a747.protocol ? _0x4c3c00.protocol : _0x43a747.protocol,
          _0xb2a3b2 = _0x5ef6b1 + _0x43a747.host !== _0x4c3c00.protocol + _0x4c3c00.host;
        return _0xb2a3b2;
      };
      _0x112d5a.isCrossOrigin = _0x41c31f;
    }, {
      'global/document': 0x1,
      'global/window': 0x2
    }],
    0x9a: [function (_0x492e35, _0x4931a6, _0xf95f3f) {
      'use strict';

      function _0x2d6960(_0x1c62f3) {
        if (_0x1c62f3 && _0x1c62f3.__esModule) return _0x1c62f3;
        var _0x4ea0a9 = {};
        if (null != _0x1c62f3) {
          for (var _0x36f2d9 in _0x1c62f3) Object.prototype.hasOwnProperty.call(_0x1c62f3, _0x36f2d9) && (_0x4ea0a9[_0x36f2d9] = _0x1c62f3[_0x36f2d9]);
        }
        return _0x4ea0a9["default"] = _0x1c62f3, _0x4ea0a9;
      }
      function _0x3c2b2e(_0x3fd55a) {
        return _0x3fd55a && _0x3fd55a.__esModule ? _0x3fd55a : {
          'default': _0x3fd55a
        };
      }
      function _0x11331d(_0x1c85cc, _0x5d3a7a, _0x2accc2) {
        var _0x153cd9 = void 0x0;
        if ('string' == typeof _0x1c85cc) {
          if (0x0 === _0x1c85cc.indexOf('#') && (_0x1c85cc = _0x1c85cc.slice(0x1)), _0x11331d.getPlayers()[_0x1c85cc]) return _0x5d3a7a && _0x1046f1["default"].warn("Player \"" + _0x1c85cc + '\x22\x20is\x20already\x20initialised.\x20Options\x20will\x20not\x20be\x20applied.'), _0x2accc2 && _0x11331d.getPlayers()[_0x1c85cc].ready(_0x2accc2), _0x11331d.getPlayers()[_0x1c85cc];
          _0x153cd9 = _0x573d97.getEl(_0x1c85cc);
        } else _0x153cd9 = _0x1c85cc;
        if (!_0x153cd9 || !_0x153cd9.nodeName) throw new TypeError("The element or ID supplied is not valid. (videojs)");
        return _0x153cd9.player || _0x49195f["default"].players[_0x153cd9.playerId] || new _0x49195f["default"](_0x153cd9, _0x5d3a7a, _0x2accc2);
      }
      _0xf95f3f.__esModule = !0x0;
      {
        var _0x3cbbc6 = _0x492e35("global/window"),
          _0x13d958 = _0x3c2b2e(_0x3cbbc6),
          _0x38879e = _0x492e35("global/document"),
          _0x5cce7e = _0x3c2b2e(_0x38879e),
          _0x1e2cf9 = _0x492e35("./setup"),
          _0x13cfcc = _0x2d6960(_0x1e2cf9),
          _0x2112c1 = _0x492e35('./utils/stylesheet.js'),
          _0x486943 = _0x2d6960(_0x2112c1),
          _0x5573dc = _0x492e35("./component"),
          _0x500892 = _0x3c2b2e(_0x5573dc),
          _0x39ed1f = _0x492e35("./event-target"),
          _0x3a80ea = _0x3c2b2e(_0x39ed1f),
          _0x160081 = _0x492e35("./utils/events.js"),
          _0x2ae476 = _0x2d6960(_0x160081),
          _0x3b768c = _0x492e35("./player"),
          _0x49195f = _0x3c2b2e(_0x3b768c),
          _0x23c74c = _0x492e35("./plugins.js"),
          _0x1e7dd3 = _0x3c2b2e(_0x23c74c),
          _0x35f836 = _0x492e35('../../src/js/utils/merge-options.js'),
          _0x52a73d = _0x3c2b2e(_0x35f836),
          _0x29998b = _0x492e35("./utils/fn.js"),
          _0x2f4067 = _0x2d6960(_0x29998b),
          _0x5bb536 = _0x492e35("./tracks/text-track.js"),
          _0x228a06 = _0x3c2b2e(_0x5bb536),
          _0x70268a = _0x492e35("./tracks/audio-track.js"),
          _0x14d25f = _0x3c2b2e(_0x70268a),
          _0x122cb3 = _0x492e35("./tracks/video-track.js"),
          _0x24d177 = _0x3c2b2e(_0x122cb3),
          _0x303df9 = _0x492e35('object.assign'),
          _0x2f5834 = (_0x3c2b2e(_0x303df9), _0x492e35("./utils/time-ranges.js")),
          _0x385ed3 = _0x492e35("./utils/format-time.js"),
          _0x4f7163 = _0x3c2b2e(_0x385ed3),
          _0x23e611 = _0x492e35('./utils/log.js'),
          _0x1046f1 = _0x3c2b2e(_0x23e611),
          _0x5a032e = _0x492e35("./utils/dom.js"),
          _0x573d97 = _0x2d6960(_0x5a032e),
          _0x575ad7 = _0x492e35('./utils/browser.js'),
          _0x5999f1 = _0x2d6960(_0x575ad7),
          _0x3621fc = _0x492e35('./utils/url.js'),
          _0x173f47 = _0x2d6960(_0x3621fc),
          _0x1a63b2 = _0x492e35("./extend.js"),
          _0x456819 = _0x3c2b2e(_0x1a63b2),
          _0x4db4e5 = _0x492e35("lodash-compat/object/merge"),
          _0x3b2966 = _0x3c2b2e(_0x4db4e5),
          _0x135e47 = _0x492e35("./utils/create-deprecation-proxy.js"),
          _0x47618e = _0x3c2b2e(_0x135e47),
          _0x523eba = _0x492e35("xhr"),
          _0x3ba88b = _0x3c2b2e(_0x523eba),
          _0x32a45d = _0x492e35("./tech/tech.js"),
          _0x13b3a6 = _0x3c2b2e(_0x32a45d),
          _0x146902 = _0x492e35("./tech/html5.js"),
          _0x51e7df = (_0x3c2b2e(_0x146902), _0x492e35("./tech/flash.js"));
        _0x3c2b2e(_0x51e7df);
      }
      if ("undefined" == typeof HTMLVideoElement && (_0x5cce7e["default"].createElement("video"), _0x5cce7e["default"].createElement("audio"), _0x5cce7e['default'].createElement("track")), _0x13d958["default"].VIDEOJS_NO_DYNAMIC_STYLE !== !0x0) {
        var _0x164e56 = _0x573d97.$(".vjs-styles-defaults");
        if (!_0x164e56) {
          _0x164e56 = _0x486943.createStyleElement("vjs-styles-defaults");
          var _0x56410d = _0x573d97.$("head");
          _0x56410d.insertBefore(_0x164e56, _0x56410d.firstChild), _0x486943.setTextContent(_0x164e56, "\n      .video-js {\n        width: 300px;\n        height: 150px;\n      }\n\n      .vjs-fluid {\n        padding-top: 56.25%\n      }\n    ");
        }
      }
      _0x13cfcc.autoSetupTimeout(0x1, _0x11331d), _0x11331d.VERSION = '5.10.7', _0x11331d.options = _0x49195f['default'].prototype.options_, _0x11331d.getPlayers = function () {
        return _0x49195f["default"].players;
      }, _0x11331d.players = _0x47618e["default"](_0x49195f["default"].players, {
        'get': "Access to videojs.players is deprecated; use videojs.getPlayers instead",
        'set': 'Modification\x20of\x20videojs.players\x20is\x20deprecated'
      }), _0x11331d.getComponent = _0x500892["default"].getComponent, _0x11331d.registerComponent = function (_0x5116b8, _0x47073d) {
        _0x13b3a6['default'].isTech(_0x47073d) && _0x1046f1['default'].warn("The " + _0x5116b8 + " tech was registered as a component. It should instead be registered using videojs.registerTech(name, tech)"), _0x500892['default'].registerComponent.call(_0x500892["default"], _0x5116b8, _0x47073d);
      }, _0x11331d.getTech = _0x13b3a6["default"].getTech, _0x11331d.registerTech = _0x13b3a6["default"].registerTech, _0x11331d.browser = _0x5999f1, _0x11331d.TOUCH_ENABLED = _0x5999f1.TOUCH_ENABLED, _0x11331d.extend = _0x456819['default'], _0x11331d.mergeOptions = _0x52a73d["default"], _0x11331d.bind = _0x2f4067.bind, _0x11331d.plugin = _0x1e7dd3['default'], _0x11331d.addLanguage = function (_0x464cac, _0x28a70d) {
        var _0x2a32b3;
        return _0x464cac = ('' + _0x464cac).toLowerCase(), _0x3b2966["default"](_0x11331d.options.languages, (_0x2a32b3 = {}, _0x2a32b3[_0x464cac] = _0x28a70d, _0x2a32b3))[_0x464cac];
      }, _0x11331d.log = _0x1046f1["default"], _0x11331d.createTimeRange = _0x11331d.createTimeRanges = _0x2f5834.createTimeRanges, _0x11331d.formatTime = _0x4f7163["default"], _0x11331d.parseUrl = _0x173f47.parseUrl, _0x11331d.isCrossOrigin = _0x173f47.isCrossOrigin, _0x11331d.EventTarget = _0x3a80ea["default"], _0x11331d.on = _0x2ae476.on, _0x11331d.one = _0x2ae476.one, _0x11331d.off = _0x2ae476.off, _0x11331d.trigger = _0x2ae476.trigger, _0x11331d.xhr = _0x3ba88b["default"], _0x11331d.TextTrack = _0x228a06["default"], _0x11331d.AudioTrack = _0x14d25f["default"], _0x11331d.VideoTrack = _0x24d177["default"], _0x11331d.isEl = _0x573d97.isEl, _0x11331d.isTextNode = _0x573d97.isTextNode, _0x11331d.createEl = _0x573d97.createEl, _0x11331d.hasClass = _0x573d97.hasElClass, _0x11331d.addClass = _0x573d97.addElClass, _0x11331d.removeClass = _0x573d97.removeElClass, _0x11331d.toggleClass = _0x573d97.toggleElClass, _0x11331d.setAttributes = _0x573d97.setElAttributes, _0x11331d.getAttributes = _0x573d97.getElAttributes, _0x11331d.emptyEl = _0x573d97.emptyEl, _0x11331d.appendContent = _0x573d97.appendContent, _0x11331d.insertContent = _0x573d97.insertContent, "function" == typeof _0x329a5e && _0x329a5e.amd ? _0x329a5e("videojs", [], function () {
        return _0x11331d;
      }) : "object" == typeof _0xf95f3f && "object" == typeof _0x4931a6 && (_0x4931a6.exports = _0x11331d), _0xf95f3f["default"] = _0x11331d, _0x4931a6.exports = _0xf95f3f["default"];
    }, {
      '../../src/js/utils/merge-options.js': 0x95,
      './component': 0x43,
      './event-target': 0x68,
      './extend.js': 0x69,
      './player': 0x71,
      './plugins.js': 0x72,
      './setup': 0x76,
      './tech/flash.js': 0x79,
      './tech/html5.js': 0x7a,
      './tech/tech.js': 0x7c,
      './tracks/audio-track.js': 0x7e,
      './tracks/text-track.js': 0x86,
      './tracks/video-track.js': 0x8b,
      './utils/browser.js': 0x8c,
      './utils/create-deprecation-proxy.js': 0x8e,
      './utils/dom.js': 0x8f,
      './utils/events.js': 0x90,
      './utils/fn.js': 0x91,
      './utils/format-time.js': 0x92,
      './utils/log.js': 0x94,
      './utils/stylesheet.js': 0x96,
      './utils/time-ranges.js': 0x97,
      './utils/url.js': 0x99,
      'global/document': 0x1,
      'global/window': 0x2,
      'lodash-compat/object/merge': 0x28,
      'object.assign': 0x2d,
      'xhr': 0x38
    }]
  }, {}, [0x9a])(0x9a);
}), function (_0x5799ce) {
  var _0x75908a = _0x5799ce.vttjs = {},
    _0x18726c = _0x75908a.VTTCue,
    _0x38ba6e = _0x75908a.VTTRegion,
    _0x2f014a = _0x5799ce.VTTCue,
    _0x5957e4 = _0x5799ce.VTTRegion;
  _0x75908a.shim = function () {
    _0x75908a.VTTCue = _0x18726c, _0x75908a.VTTRegion = _0x38ba6e;
  }, _0x75908a.restore = function () {
    _0x75908a.VTTCue = _0x2f014a, _0x75908a.VTTRegion = _0x5957e4;
  };
}(this), function (_0x1807cd, _0x2e650b) {
  function _0x50c86b(_0x13e701) {
    if ('string' != typeof _0x13e701) return !0x1;
    var _0x38803d = _0x53220b[_0x13e701.toLowerCase()];
    return _0x38803d ? _0x13e701.toLowerCase() : !0x1;
  }
  function _0x182ae1(_0x154ceb) {
    if ("string" != typeof _0x154ceb) return !0x1;
    var _0x205d36 = _0x2b8ecc[_0x154ceb.toLowerCase()];
    return _0x205d36 ? _0x154ceb.toLowerCase() : !0x1;
  }
  function _0x2d8c6c(_0x2d3de1) {
    for (var _0x5bf13d = 0x1; 0x1 < arguments.length; _0x5bf13d++) {
      var _0x1fa011 = arguments[_0x5bf13d];
      for (var _0x190fb4 in _0x1fa011) _0x2d3de1[_0x190fb4] = _0x1fa011[_0x190fb4];
    }
    return _0x2d3de1;
  }
  function _0x1d10d2(_0x5bc109, _0x3d6399, _0x310c95) {
    var _0x5129bd = this,
      _0x5197dc = /MSIE\s8\.0/.test(navigator.userAgent),
      _0x29d35e = {};
    _0x5197dc ? _0x5129bd = document.createElement("custom") : _0x29d35e.enumerable = !0x0, _0x5129bd.hasBeenReset = !0x1;
    var _0x23bad = _0x5bc109,
      _0x213dac = _0x3d6399,
      _0x39952b = _0x310c95;
    return Object.defineProperty(_0x5129bd, 'id', _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return '';
      },
      'set': function (_0x5a7baa) {
        _0x56ec6d = '' + _0x5a7baa;
      }
    })), Object.defineProperty(_0x5129bd, 'pauseOnExit', _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return !0x1;
      },
      'set': function (_0x345ff4) {
        _0x1740d2 = !!_0x345ff4;
      }
    })), Object.defineProperty(_0x5129bd, "startTime", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return _0x23bad;
      },
      'set': function (_0x11dc07) {
        if ("number" != typeof _0x11dc07) throw new TypeError("Start time must be set to a number.");
        _0x23bad = _0x11dc07, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, 'endTime', _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return _0x213dac;
      },
      'set': function (_0x460375) {
        if ("number" != typeof _0x460375) throw new TypeError('End\x20time\x20must\x20be\x20set\x20to\x20a\x20number.');
        _0x213dac = _0x460375, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "text", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return _0x39952b;
      },
      'set': function (_0x16f62a) {
        _0x39952b = '' + _0x16f62a, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "region", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return null;
      },
      'set': function (_0x410743) {
        _0x255540 = _0x410743, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "vertical", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return '';
      },
      'set': function (_0x120f9d) {
        var _0x351277 = _0x50c86b(_0x120f9d);
        if (_0x351277 === !0x1) throw new SyntaxError("An invalid or illegal string was specified.");
        _0x47d115 = _0x351277, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "snapToLines", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return !0x0;
      },
      'set': function (_0x1c76b8) {
        _0x41b86a = !!_0x1c76b8, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "line", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return "auto";
      },
      'set': function (_0x5de689) {
        if ("number" != typeof _0x5de689 && _0x5de689 !== _0x184f3a) throw new SyntaxError("An invalid number or illegal string was specified.");
        _0x5b1a0a = _0x5de689, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "lineAlign", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return 'start';
      },
      'set': function (_0x22cf2c) {
        var _0x280719 = _0x182ae1(_0x22cf2c);
        if (!_0x280719) throw new SyntaxError("An invalid or illegal string was specified.");
        _0x172679 = _0x280719, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "position", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return 0x32;
      },
      'set': function (_0x55c933) {
        if (0x0 > _0x55c933 || _0x55c933 > 0x64) throw new Error('Position\x20must\x20be\x20between\x200\x20and\x20100.');
        _0xd21f07 = _0x55c933, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "positionAlign", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return 'middle';
      },
      'set': function (_0x1218e1) {
        var _0x12df88 = _0x182ae1(_0x1218e1);
        if (!_0x12df88) throw new SyntaxError("An invalid or illegal string was specified.");
        _0x73ca54 = _0x12df88, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "size", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return 0x32;
      },
      'set': function (_0x4e7d39) {
        if (0x0 > _0x4e7d39 || _0x4e7d39 > 0x64) throw new Error("Size must be between 0 and 100.");
        _0x47c03c = _0x4e7d39, this.hasBeenReset = !0x0;
      }
    })), Object.defineProperty(_0x5129bd, "align", _0x2d8c6c({}, _0x29d35e, {
      'get': function () {
        return 'middle';
      },
      'set': function (_0x23c275) {
        var _0x5208d7 = _0x182ae1(_0x23c275);
        if (!_0x5208d7) throw new SyntaxError("An invalid or illegal string was specified.");
        _0x5d1425 = _0x5208d7, this.hasBeenReset = !0x0;
      }
    })), _0x5129bd.displayState = void 0x0, _0x5197dc ? _0x5129bd : void 0x0;
  }
  var _0x184f3a = "auto",
    _0x53220b = {
      '': !0x0,
      'lr': !0x0,
      'rl': !0x0
    },
    _0x2b8ecc = {
      'start': !0x0,
      'middle': !0x0,
      'end': !0x0,
      'left': !0x0,
      'right': !0x0
    };
  _0x1d10d2.prototype.getCueAsHTML = function () {
    return WebVTT.convertCueToDOMTree(window, this.text);
  }, _0x1807cd.VTTCue = _0x1807cd.VTTCue || _0x1d10d2, _0x2e650b.VTTCue = _0x1d10d2;
}(this, this.vttjs || {}), function (_0x5798cb, _0x4f98ec) {
  function _0x5da68a(_0x2308cc) {
    if ("string" != typeof _0x2308cc) return !0x1;
    var _0x2a0445 = _0x409eef[_0x2308cc.toLowerCase()];
    return _0x2a0445 ? _0x2308cc.toLowerCase() : !0x1;
  }
  function _0x4b55cb(_0x3392f6) {
    return "number" == typeof _0x3392f6 && _0x3392f6 >= 0x0 && 0x64 >= _0x3392f6;
  }
  function _0x368247() {
    Object.defineProperties(this, {
      'width': {
        'enumerable': !0x0,
        'get': function () {
          return 0x64;
        },
        'set': function (_0x42053c) {
          if (!_0x4b55cb(_0x42053c)) throw new Error("Width must be between 0 and 100.");
          _0x350fb0 = _0x42053c;
        }
      },
      'lines': {
        'enumerable': !0x0,
        'get': function () {
          return 0x3;
        },
        'set': function (_0x4ad8e9) {
          if ('number' != typeof _0x4ad8e9) throw new TypeError('Lines\x20must\x20be\x20set\x20to\x20a\x20number.');
          _0x19b365 = _0x4ad8e9;
        }
      },
      'regionAnchorY': {
        'enumerable': !0x0,
        'get': function () {
          return 0x64;
        },
        'set': function (_0xcb3186) {
          if (!_0x4b55cb(_0xcb3186)) throw new Error('RegionAnchorX\x20must\x20be\x20between\x200\x20and\x20100.');
          _0x3bdf50 = _0xcb3186;
        }
      },
      'regionAnchorX': {
        'enumerable': !0x0,
        'get': function () {
          return 0x0;
        },
        'set': function (_0xe7f11c) {
          if (!_0x4b55cb(_0xe7f11c)) throw new Error("RegionAnchorY must be between 0 and 100.");
          _0x4dca48 = _0xe7f11c;
        }
      },
      'viewportAnchorY': {
        'enumerable': !0x0,
        'get': function () {
          return 0x64;
        },
        'set': function (_0x51815c) {
          if (!_0x4b55cb(_0x51815c)) throw new Error('ViewportAnchorY\x20must\x20be\x20between\x200\x20and\x20100.');
          _0x32e432 = _0x51815c;
        }
      },
      'viewportAnchorX': {
        'enumerable': !0x0,
        'get': function () {
          return 0x0;
        },
        'set': function (_0x423188) {
          if (!_0x4b55cb(_0x423188)) throw new Error("ViewportAnchorX must be between 0 and 100.");
          _0x1c6476 = _0x423188;
        }
      },
      'scroll': {
        'enumerable': !0x0,
        'get': function () {
          return '';
        },
        'set': function (_0x422ea7) {
          var _0x4f62fd = _0x5da68a(_0x422ea7);
          if (_0x4f62fd === !0x1) throw new SyntaxError("An invalid or illegal string was specified.");
          _0x4fe2f3 = _0x4f62fd;
        }
      }
    });
  }
  var _0x409eef = {
    '': !0x0,
    'up': !0x0
  };
  _0x5798cb.VTTRegion = _0x5798cb.VTTRegion || _0x368247, _0x4f98ec.VTTRegion = _0x368247;
}(this, this.vttjs || {}), function (_0x591ab2) {
  function _0x2132a9(_0x3135d5, _0x467e) {
    this.name = "ParsingError", this.code = _0x3135d5.code, this.message = _0x467e || _0x3135d5.message;
  }
  function _0x358b94(_0x4d55c6) {
    function _0x3a0aaf(_0x398721, _0x15940c, _0x27f7ab, _0x340437) {
      return 0xe10 * (0x0 | _0x398721) + 0x3c * (0x0 | _0x15940c) + (0x0 | _0x27f7ab) + (0x0 | _0x340437) / 0x3e8;
    }
    var _0x274be3 = _0x4d55c6.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
    return _0x274be3 ? _0x274be3[0x3] ? _0x3a0aaf(_0x274be3[0x1], _0x274be3[0x2], _0x274be3[0x3].replace(':', ''), _0x274be3[0x4]) : _0x274be3[0x1] > 0x3b ? _0x3a0aaf(_0x274be3[0x1], _0x274be3[0x2], 0x0, _0x274be3[0x4]) : _0x3a0aaf(0x0, _0x274be3[0x1], _0x274be3[0x2], _0x274be3[0x4]) : null;
  }
  function _0x14630f() {
    this.values = _0x58df21(null);
  }
  function _0x4ebfcd(_0x45cdc4, _0x501bfe, _0x56aae0, _0x5b410f) {
    var _0x2b5ea0 = _0x5b410f ? _0x45cdc4.split(_0x5b410f) : [_0x45cdc4];
    for (var _0x38b5e5 in _0x2b5ea0) if ("string" == typeof _0x2b5ea0[_0x38b5e5]) {
      var _0x2b910a = _0x2b5ea0[_0x38b5e5].split(_0x56aae0);
      if (0x2 === _0x2b910a.length) {
        var _0x48a4d1 = _0x2b910a[0x0],
          _0x5caac5 = _0x2b910a[0x1];
        _0x501bfe(_0x48a4d1, _0x5caac5);
      }
    }
  }
  function _0x5105c0(_0x28aed6, _0x42315c, _0x46430b) {
    function _0x51b2f4() {
      var _0x3ace28 = _0x358b94(_0x28aed6);
      if (null === _0x3ace28) throw new _0x2132a9(_0x2132a9.Errors.BadTimeStamp, "Malformed timestamp: " + _0x35787a);
      return _0x28aed6 = _0x28aed6.replace(/^[^\sa-zA-Z-]+/, ''), _0x3ace28;
    }
    function _0x1a8553(_0x206610, _0x362306) {
      var _0x5d77e0 = new _0x14630f();
      _0x4ebfcd(_0x206610, function (_0x6c0f97, _0xb0498e) {
        switch (_0x6c0f97) {
          case "region":
            for (var _0xc76f20 = _0x46430b.length - 0x1; _0xc76f20 >= 0x0; _0xc76f20--) if (_0x46430b[_0xc76f20].id === _0xb0498e) {
              _0x5d77e0.set(_0x6c0f97, _0x46430b[_0xc76f20].region);
              break;
            }
            break;
          case "vertical":
            _0x5d77e0.alt(_0x6c0f97, _0xb0498e, ['rl', 'lr']);
            break;
          case 'line':
            var _0x4a8148 = _0xb0498e.split(','),
              _0x14085e = _0x4a8148[0x0];
            _0x5d77e0.integer(_0x6c0f97, _0x14085e), _0x5d77e0.percent(_0x6c0f97, _0x14085e) ? _0x5d77e0.set("snapToLines", !0x1) : null, _0x5d77e0.alt(_0x6c0f97, _0x14085e, ["auto"]), 0x2 === _0x4a8148.length && _0x5d77e0.alt("lineAlign", _0x4a8148[0x1], ["start", "middle", "end"]);
            break;
          case "position":
            _0x4a8148 = _0xb0498e.split(','), _0x5d77e0.percent(_0x6c0f97, _0x4a8148[0x0]), 0x2 === _0x4a8148.length && _0x5d77e0.alt("positionAlign", _0x4a8148[0x1], ["start", "middle", "end"]);
            break;
          case "size":
            _0x5d77e0.percent(_0x6c0f97, _0xb0498e);
            break;
          case "align":
            _0x5d77e0.alt(_0x6c0f97, _0xb0498e, ["start", "middle", 'end', 'left', "right"]);
        }
      }, /:/, /\s/), _0x362306.region = _0x5d77e0.get("region", null), _0x362306.vertical = _0x5d77e0.get("vertical", ''), _0x362306.line = _0x5d77e0.get("line", "auto"), _0x362306.lineAlign = _0x5d77e0.get('lineAlign', "start"), _0x362306.snapToLines = _0x5d77e0.get('snapToLines', !0x0), _0x362306.size = _0x5d77e0.get("size", 0x64), _0x362306.align = _0x5d77e0.get("align", "middle"), _0x362306.position = _0x5d77e0.get("position", {
        'start': 0x0,
        'left': 0x0,
        'middle': 0x32,
        'end': 0x64,
        'right': 0x64
      }, _0x362306.align), _0x362306.positionAlign = _0x5d77e0.get("positionAlign", {
        'start': 'start',
        'left': "start",
        'middle': 'middle',
        'end': 'end',
        'right': "end"
      }, _0x362306.align);
    }
    function _0x49a620() {
      _0x28aed6 = _0x28aed6.replace(/^\s+/, '');
    }
    var _0x35787a = _0x28aed6;
    if (_0x49a620(), _0x42315c.startTime = _0x51b2f4(), _0x49a620(), "-->" !== _0x28aed6.substr(0x0, 0x3)) throw new _0x2132a9(_0x2132a9.Errors.BadTimeStamp, "Malformed time stamp (time stamps must be separated by '-->'): " + _0x35787a);
    _0x28aed6 = _0x28aed6.substr(0x3), _0x49a620(), _0x42315c.endTime = _0x51b2f4(), _0x49a620(), _0x1a8553(_0x28aed6, _0x42315c);
  }
  function _0x530f31(_0x2b4968, _0x21f6a6) {
    function _0x19747c() {
      function _0x19fc1d(_0x391694) {
        return _0x21f6a6 = _0x21f6a6.substr(_0x391694.length), _0x391694;
      }
      if (!_0x21f6a6) return null;
      var _0x2f6c75 = _0x21f6a6.match(/^([^<]*)(<[^>]+>?)?/);
      return _0x19fc1d(_0x2f6c75[0x1] ? _0x2f6c75[0x1] : _0x2f6c75[0x2]);
    }
    function _0x51810f(_0x5a50e7) {
      return _0x425b70[_0x5a50e7];
    }
    function _0x776c32(_0x39875a) {
      for (; _0x4eeb80 = _0x39875a.match(/&(amp|lt|gt|lrm|rlm|nbsp);/);) _0x39875a = _0x39875a.replace(_0x4eeb80[0x0], _0x51810f);
      return _0x39875a;
    }
    function _0x4226c7(_0x140ea3, _0x2ef634) {
      return !_0x28046a[_0x2ef634.localName] || _0x28046a[_0x2ef634.localName] === _0x140ea3.localName;
    }
    function _0x1ab99e(_0x2df5df, _0x418ac0) {
      var _0x167d7d = _0x114ab6[_0x2df5df];
      if (!_0x167d7d) return null;
      var _0x3970d2 = _0x2b4968.document.createElement(_0x167d7d);
      _0x3970d2.localName = _0x167d7d;
      var _0x2eef1e = _0x168aad[_0x2df5df];
      return _0x2eef1e && _0x418ac0 && (_0x3970d2[_0x2eef1e] = _0x418ac0.trim()), _0x3970d2;
    }
    for (var _0x37cc38, _0x42848a = _0x2b4968.document.createElement("div"), _0x825070 = _0x42848a, _0x513bd4 = []; null !== (_0x37cc38 = _0x19747c());) if ('<' !== _0x37cc38[0x0]) _0x825070.appendChild(_0x2b4968.document.createTextNode(_0x776c32(_0x37cc38)));else {
      if ('/' === _0x37cc38[0x1]) {
        _0x513bd4.length && _0x513bd4[_0x513bd4.length - 0x1] === _0x37cc38.substr(0x2).replace('>', '') && (_0x513bd4.pop(), _0x825070 = _0x825070.parentNode);
        continue;
      }
      var _0x55d826,
        _0x42ad8a = _0x358b94(_0x37cc38.substr(0x1, _0x37cc38.length - 0x2));
      if (_0x42ad8a) {
        _0x55d826 = _0x2b4968.document.createProcessingInstruction("timestamp", _0x42ad8a), _0x825070.appendChild(_0x55d826);
        continue;
      }
      var _0x4eeb80 = _0x37cc38.match(/^<([^.\s\/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
      if (!_0x4eeb80) continue;
      if (_0x55d826 = _0x1ab99e(_0x4eeb80[0x1], _0x4eeb80[0x3]), !_0x55d826) continue;
      if (!_0x4226c7(_0x825070, _0x55d826)) continue;
      _0x4eeb80[0x2] && (_0x55d826.className = _0x4eeb80[0x2].substr(0x1).replace('.', '\x20')), _0x513bd4.push(_0x4eeb80[0x1]), _0x825070.appendChild(_0x55d826), _0x825070 = _0x55d826;
    }
    return _0x42848a;
  }
  function _0x2e1193(_0x251a2c) {
    function _0x3dcb82(_0x4edff9, _0x1afe16) {
      for (var _0x1261ad = _0x1afe16.childNodes.length - 0x1; _0x1261ad >= 0x0; _0x1261ad--) _0x4edff9.push(_0x1afe16.childNodes[_0x1261ad]);
    }
    function _0x2943be(_0x279310) {
      if (!_0x279310 || !_0x279310.length) return null;
      var _0x25dd47 = _0x279310.pop(),
        _0x39189f = _0x25dd47.textContent || _0x25dd47.innerText;
      if (_0x39189f) {
        var _0x41295b = _0x39189f.match(/^.*(\n|\r)/);
        return _0x41295b ? (_0x279310.length = 0x0, _0x41295b[0x0]) : _0x39189f;
      }
      return "ruby" === _0x25dd47.tagName ? _0x2943be(_0x279310) : _0x25dd47.childNodes ? (_0x3dcb82(_0x279310, _0x25dd47), _0x2943be(_0x279310)) : void 0x0;
    }
    var _0xfd8421,
      _0x2e22c7 = [],
      _0x540743 = '';
    if (!_0x251a2c || !_0x251a2c.childNodes) return 'ltr';
    for (_0x3dcb82(_0x2e22c7, _0x251a2c); _0x540743 = _0x2943be(_0x2e22c7);) for (var _0x262898 = 0x0; 0x0 < _0x540743.length; _0x262898++) {
      _0xfd8421 = _0x540743.charCodeAt(_0x262898);
      for (var _0x1e67d5 = 0x0; 0x0 < _0x5d84d2.length; _0x1e67d5++) if (_0x5d84d2[_0x1e67d5] === _0xfd8421) return 'rtl';
    }
    return "ltr";
  }
  function _0x2e5fd3(_0x32800c) {
    if ('number' == typeof _0x32800c.line && (_0x32800c.snapToLines || _0x32800c.line >= 0x0 && _0x32800c.line <= 0x64)) return _0x32800c.line;
    if (!_0x32800c.track || !_0x32800c.track.textTrackList || !_0x32800c.track.textTrackList.mediaElement) return -0x1;
    for (var _0xd7d7ba = _0x32800c.track, _0x2b458c = _0xd7d7ba.textTrackList, _0x191d86 = 0x0, _0x29fa96 = 0x0; _0x29fa96 < _0x2b458c.length && _0x2b458c[_0x29fa96] !== _0xd7d7ba; _0x29fa96++) "showing" === _0x2b458c[_0x29fa96].mode && _0x191d86++;
    return -0x1 * ++_0x191d86;
  }
  function _0x3c9631() {}
  function _0xdf8a37(_0x748252, _0x132bd1, _0x17d32f) {
    var _0x1f3281 = /MSIE\s8\.0/.test(navigator.userAgent),
      _0x4ffe69 = "rgba(255, 255, 255, 1)",
      _0x29885f = "rgba(0, 0, 0, 0.8)";
    _0x1f3281 && (_0x4ffe69 = "rgb(255, 255, 255)", _0x29885f = "rgb(0, 0, 0)"), _0x3c9631.call(this), this.cue = _0x132bd1, this.cueDiv = _0x530f31(_0x748252, _0x132bd1.text);
    var _0x34b8c8 = {
      'color': _0x4ffe69,
      'backgroundColor': _0x29885f,
      'position': 'relative',
      'left': 0x0,
      'right': 0x0,
      'top': 0x0,
      'bottom': 0x0,
      'display': "inline"
    };
    _0x1f3281 || (_0x34b8c8.writingMode = '' === _0x132bd1.vertical ? 'horizontal-tb' : 'lr' === _0x132bd1.vertical ? "vertical-lr" : "vertical-rl", _0x34b8c8.unicodeBidi = "plaintext"), this.applyStyles(_0x34b8c8, this.cueDiv), this.div = _0x748252.document.createElement("div"), _0x34b8c8 = {
      'textAlign': "middle" === _0x132bd1.align ? 'center' : _0x132bd1.align,
      'font': _0x17d32f.font,
      'whiteSpace': "pre-line",
      'position': "absolute"
    }, _0x1f3281 || (_0x34b8c8.direction = _0x2e1193(this.cueDiv), _0x34b8c8.writingMode = '' === _0x132bd1.vertical ? "horizontal-tb" : 'lr' === _0x132bd1.vertical ? "vertical-lr" : 'vertical-rl'.stylesunicodeBidi = "plaintext"), this.applyStyles(_0x34b8c8), this.div.appendChild(this.cueDiv);
    var _0x6e1a36 = 0x0;
    switch (_0x132bd1.positionAlign) {
      case "start":
        _0x6e1a36 = _0x132bd1.position;
        break;
      case "middle":
        _0x6e1a36 = _0x132bd1.position - _0x132bd1.size / 0x2;
        break;
      case "end":
        _0x6e1a36 = _0x132bd1.position - _0x132bd1.size;
    }
    this.applyStyles('' === _0x132bd1.vertical ? {
      'left': this.formatStyle(_0x6e1a36, '%'),
      'width': this.formatStyle(_0x132bd1.size, '%')
    } : {
      'top': this.formatStyle(_0x6e1a36, '%'),
      'height': this.formatStyle(_0x132bd1.size, '%')
    }), this.move = function (_0x85373d) {
      this.applyStyles({
        'top': this.formatStyle(_0x85373d.top, 'px'),
        'bottom': this.formatStyle(_0x85373d.bottom, 'px'),
        'left': this.formatStyle(_0x85373d.left, 'px'),
        'right': this.formatStyle(_0x85373d.right, 'px'),
        'height': this.formatStyle(_0x85373d.height, 'px'),
        'width': this.formatStyle(_0x85373d.width, 'px')
      });
    };
  }
  function _0x98b98a(_0x2d75d8) {
    var _0x435a2c,
      _0x1cfbba,
      _0x55d4ee,
      _0x41b4ec,
      _0x23a834 = /MSIE\s8\.0/.test(navigator.userAgent);
    if (_0x2d75d8.div) {
      _0x1cfbba = _0x2d75d8.div.offsetHeight, _0x55d4ee = _0x2d75d8.div.offsetWidth, _0x41b4ec = _0x2d75d8.div.offsetTop;
      var _0x33ae36 = (_0x33ae36 = _0x2d75d8.div.childNodes) && (_0x33ae36 = _0x33ae36[0x0]) && _0x33ae36.getClientRects && _0x33ae36.getClientRects();
      _0x2d75d8 = _0x2d75d8.div.getBoundingClientRect(), _0x435a2c = _0x33ae36 ? Math.max(_0x33ae36[0x0] && _0x33ae36[0x0].height || 0x0, _0x2d75d8.height / _0x33ae36.length) : 0x0;
    }
    this.left = _0x2d75d8.left, this.right = _0x2d75d8.right, this.top = _0x2d75d8.top || _0x41b4ec, this.height = _0x2d75d8.height || _0x1cfbba, this.bottom = _0x2d75d8.bottom || _0x41b4ec + (_0x2d75d8.height || _0x1cfbba), this.width = _0x2d75d8.width || _0x55d4ee, this.lineHeight = void 0x0 !== _0x435a2c ? _0x435a2c : _0x2d75d8.lineHeight, _0x23a834 && !this.lineHeight && (this.lineHeight = 0xd);
  }
  function _0x2d7b80(_0x5c74a0, _0x50c931, _0x4748b6, _0x4ba44c) {
    function _0x473a36(_0x331d4e, _0x526d49) {
      for (var _0x4b4cac, _0xcf31a7 = new _0x98b98a(_0x331d4e), _0x2114ca = 0x1, _0x341929 = 0x0; 0x0 < _0x526d49.length; _0x341929++) {
        for (; _0x331d4e.overlapsOppositeAxis(_0x4748b6, _0x526d49[_0x341929]) || _0x331d4e.within(_0x4748b6) && _0x331d4e.overlapsAny(_0x4ba44c);) _0x331d4e.move(_0x526d49[_0x341929]);
        if (_0x331d4e.within(_0x4748b6)) return _0x331d4e;
        var _0x5f2c2c = _0x331d4e.intersectPercentage(_0x4748b6);
        0x1 > _0x5f2c2c && (_0x4b4cac = new _0x98b98a(_0x331d4e), _0x2114ca = _0x5f2c2c), _0x331d4e = new _0x98b98a(_0xcf31a7);
      }
      return _0x4b4cac || _0xcf31a7;
    }
    var _0x3c208c = new _0x98b98a(_0x50c931),
      _0x33ba4a = _0x50c931.cue,
      _0x5978bf = _0x2e5fd3(_0x33ba4a),
      _0xd80ec = [];
    if (_0x33ba4a.snapToLines) {
      var _0x3adf30;
      switch (_0x33ba4a.vertical) {
        case '':
          _0xd80ec = ['+y', '-y'], _0x3adf30 = "height";
          break;
        case 'rl':
          _0xd80ec = ['+x', '-x'], _0x3adf30 = "width";
          break;
        case 'lr':
          _0xd80ec = ['-x', '+x'], _0x3adf30 = "width";
      }
      var _0x590e3a = _0x3c208c.lineHeight,
        _0x542320 = _0x590e3a * Math.round(_0x5978bf),
        _0x561bd8 = _0x4748b6[_0x3adf30] + _0x590e3a,
        _0x13b4e3 = _0xd80ec[0x0];
      Math.abs(_0x542320) > _0x561bd8 && (_0x542320 = 0x0 > _0x542320 ? -0x1 : 0x1, _0x542320 *= Math.ceil(_0x561bd8 / _0x590e3a) * _0x590e3a), 0x0 > _0x5978bf && (_0x542320 += '' === _0x33ba4a.vertical ? _0x4748b6.height : _0x4748b6.width, _0xd80ec = _0xd80ec.reverse()), _0x3c208c.move(_0x13b4e3, _0x542320);
    } else {
      var _0x51702d = _0x3c208c.lineHeight / _0x4748b6.height * 0x64;
      switch (_0x33ba4a.lineAlign) {
        case "middle":
          _0x5978bf -= _0x51702d / 0x2;
          break;
        case 'end':
          _0x5978bf -= _0x51702d;
      }
      switch (_0x33ba4a.vertical) {
        case '':
          _0x50c931.applyStyles({
            'top': _0x50c931.formatStyle(_0x5978bf, '%')
          });
          break;
        case 'rl':
          _0x50c931.applyStyles({
            'left': _0x50c931.formatStyle(_0x5978bf, '%')
          });
          break;
        case 'lr':
          _0x50c931.applyStyles({
            'right': _0x50c931.formatStyle(_0x5978bf, '%')
          });
      }
      _0xd80ec = ['+y', '-x', '+x', '-y'], _0x3c208c = new _0x98b98a(_0x50c931);
    }
    var _0x382885 = _0x473a36(_0x3c208c, _0xd80ec);
    _0x50c931.move(_0x382885.toCSSCompatValues(_0x4748b6));
  }
  function _0x41c30f() {}
  var _0x58df21 = Object.create || function () {
    function _0x1901bc() {}
    return function (_0x31a49b) {
      if (0x1 !== arguments.length) throw new Error("Object.create shim only accepts one parameter.");
      return _0x1901bc.prototype = _0x31a49b, new _0x1901bc();
    };
  }();
  _0x2132a9.prototype = _0x58df21(Error.prototype), _0x2132a9.prototype.constructor = _0x2132a9, _0x2132a9.Errors = {
    'BadSignature': {
      'code': 0x0,
      'message': "Malformed WebVTT signature."
    },
    'BadTimeStamp': {
      'code': 0x1,
      'message': "Malformed time stamp."
    }
  }, _0x14630f.prototype = {
    'set': function (_0x20ade3, _0x597866) {
      this.get(_0x20ade3) || '' === _0x597866 || (this.values[_0x20ade3] = _0x597866);
    },
    'get': function (_0x59525b, _0x39c682, _0x578104) {
      return _0x578104 ? this.has(_0x59525b) ? this.values[_0x59525b] : _0x39c682[_0x578104] : this.has(_0x59525b) ? this.values[_0x59525b] : _0x39c682;
    },
    'has': function (_0xf4d51c) {
      return _0xf4d51c in this.values;
    },
    'alt': function (_0x23fabd, _0x12f140, _0x9fd814) {
      for (var _0x2be095 = 0x0; 0x0 < _0x9fd814.length; ++_0x2be095) if (_0x12f140 === _0x9fd814[_0x2be095]) {
        this.set(_0x23fabd, _0x12f140);
        break;
      }
    },
    'integer': function (_0x46f08f, _0x5103a3) {
      /^-?\d+$/.test(_0x5103a3) && this.set(_0x46f08f, parseInt(_0x5103a3, 0xa));
    },
    'percent': function (_0x50f2e2, _0x1bea56) {
      return (_0x3abfb6 = _0x1bea56.match(/^([\d]{1,3})(\.[\d]*)?%$/)) && (_0x1bea56 = parseFloat(_0x1bea56), _0x1bea56 >= 0x0 && 0x64 >= _0x1bea56) ? (this.set(_0x50f2e2, _0x1bea56), !0x0) : !0x1;
    }
  };
  var _0x425b70 = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&lrm;': '‎',
      '&rlm;': '‏',
      '&nbsp;': '\u00a0'
    },
    _0x114ab6 = {
      'c': "span",
      'i': 'i',
      'b': 'b',
      'u': 'u',
      'ruby': "ruby",
      'rt': 'rt',
      'v': "span",
      'lang': 'span'
    },
    _0x168aad = {
      'v': "title",
      'lang': "lang"
    },
    _0x28046a = {
      'rt': "ruby"
    },
    _0x5d84d2 = [0x5be, 0x5c0, 0x5c3, 0x5c6, 0x5d0, 0x5d1, 0x5d2, 0x5d3, 0x5d4, 0x5d5, 0x5d6, 0x5d7, 0x5d8, 0x5d9, 0x5da, 0x5db, 0x5dc, 0x5dd, 0x5de, 0x5df, 0x5e0, 0x5e1, 0x5e2, 0x5e3, 0x5e4, 0x5e5, 0x5e6, 0x5e7, 0x5e8, 0x5e9, 0x5ea, 0x5f0, 0x5f1, 0x5f2, 0x5f3, 0x5f4, 0x608, 0x60b, 0x60d, 0x61b, 0x61e, 0x61f, 0x620, 0x621, 0x622, 0x623, 0x624, 0x625, 0x626, 0x627, 0x628, 0x629, 0x62a, 0x62b, 0x62c, 0x62d, 0x62e, 0x62f, 0x630, 0x631, 0x632, 0x633, 0x634, 0x635, 0x636, 0x637, 0x638, 0x639, 0x63a, 0x63b, 0x63c, 0x63d, 0x63e, 0x63f, 0x640, 0x641, 0x642, 0x643, 0x644, 0x645, 0x646, 0x647, 0x648, 0x649, 0x64a, 0x66d, 0x66e, 0x66f, 0x671, 0x672, 0x673, 0x674, 0x675, 0x676, 0x677, 0x678, 0x679, 0x67a, 0x67b, 0x67c, 0x67d, 0x67e, 0x67f, 0x680, 0x681, 0x682, 0x683, 0x684, 0x685, 0x686, 0x687, 0x688, 0x689, 0x68a, 0x68b, 0x68c, 0x68d, 0x68e, 0x68f, 0x690, 0x691, 0x692, 0x693, 0x694, 0x695, 0x696, 0x697, 0x698, 0x699, 0x69a, 0x69b, 0x69c, 0x69d, 0x69e, 0x69f, 0x6a0, 0x6a1, 0x6a2, 0x6a3, 0x6a4, 0x6a5, 0x6a6, 0x6a7, 0x6a8, 0x6a9, 0x6aa, 0x6ab, 0x6ac, 0x6ad, 0x6ae, 0x6af, 0x6b0, 0x6b1, 0x6b2, 0x6b3, 0x6b4, 0x6b5, 0x6b6, 0x6b7, 0x6b8, 0x6b9, 0x6ba, 0x6bb, 0x6bc, 0x6bd, 0x6be, 0x6bf, 0x6c0, 0x6c1, 0x6c2, 0x6c3, 0x6c4, 0x6c5, 0x6c6, 0x6c7, 0x6c8, 0x6c9, 0x6ca, 0x6cb, 0x6cc, 0x6cd, 0x6ce, 0x6cf, 0x6d0, 0x6d1, 0x6d2, 0x6d3, 0x6d4, 0x6d5, 0x6e5, 0x6e6, 0x6ee, 0x6ef, 0x6fa, 0x6fb, 0x6fc, 0x6fd, 0x6fe, 0x6ff, 0x700, 0x701, 0x702, 0x703, 0x704, 0x705, 0x706, 0x707, 0x708, 0x709, 0x70a, 0x70b, 0x70c, 0x70d, 0x70f, 0x710, 0x712, 0x713, 0x714, 0x715, 0x716, 0x717, 0x718, 0x719, 0x71a, 0x71b, 0x71c, 0x71d, 0x71e, 0x71f, 0x720, 0x721, 0x722, 0x723, 0x724, 0x725, 0x726, 0x727, 0x728, 0x729, 0x72a, 0x72b, 0x72c, 0x72d, 0x72e, 0x72f, 0x74d, 0x74e, 0x74f, 0x750, 0x751, 0x752, 0x753, 0x754, 0x755, 0x756, 0x757, 0x758, 0x759, 0x75a, 0x75b, 0x75c, 0x75d, 0x75e, 0x75f, 0x760, 0x761, 0x762, 0x763, 0x764, 0x765, 0x766, 0x767, 0x768, 0x769, 0x76a, 0x76b, 0x76c, 0x76d, 0x76e, 0x76f, 0x770, 0x771, 0x772, 0x773, 0x774, 0x775, 0x776, 0x777, 0x778, 0x779, 0x77a, 0x77b, 0x77c, 0x77d, 0x77e, 0x77f, 0x780, 0x781, 0x782, 0x783, 0x784, 0x785, 0x786, 0x787, 0x788, 0x789, 0x78a, 0x78b, 0x78c, 0x78d, 0x78e, 0x78f, 0x790, 0x791, 0x792, 0x793, 0x794, 0x795, 0x796, 0x797, 0x798, 0x799, 0x79a, 0x79b, 0x79c, 0x79d, 0x79e, 0x79f, 0x7a0, 0x7a1, 0x7a2, 0x7a3, 0x7a4, 0x7a5, 0x7b1, 0x7c0, 0x7c1, 0x7c2, 0x7c3, 0x7c4, 0x7c5, 0x7c6, 0x7c7, 0x7c8, 0x7c9, 0x7ca, 0x7cb, 0x7cc, 0x7cd, 0x7ce, 0x7cf, 0x7d0, 0x7d1, 0x7d2, 0x7d3, 0x7d4, 0x7d5, 0x7d6, 0x7d7, 0x7d8, 0x7d9, 0x7da, 0x7db, 0x7dc, 0x7dd, 0x7de, 0x7df, 0x7e0, 0x7e1, 0x7e2, 0x7e3, 0x7e4, 0x7e5, 0x7e6, 0x7e7, 0x7e8, 0x7e9, 0x7ea, 0x7f4, 0x7f5, 0x7fa, 0x800, 0x801, 0x802, 0x803, 0x804, 0x805, 0x806, 0x807, 0x808, 0x809, 0x80a, 0x80b, 0x80c, 0x80d, 0x80e, 0x80f, 0x810, 0x811, 0x812, 0x813, 0x814, 0x815, 0x81a, 0x824, 0x828, 0x830, 0x831, 0x832, 0x833, 0x834, 0x835, 0x836, 0x837, 0x838, 0x839, 0x83a, 0x83b, 0x83c, 0x83d, 0x83e, 0x840, 0x841, 0x842, 0x843, 0x844, 0x845, 0x846, 0x847, 0x848, 0x849, 0x84a, 0x84b, 0x84c, 0x84d, 0x84e, 0x84f, 0x850, 0x851, 0x852, 0x853, 0x854, 0x855, 0x856, 0x857, 0x858, 0x85e, 0x8a0, 0x8a2, 0x8a3, 0x8a4, 0x8a5, 0x8a6, 0x8a7, 0x8a8, 0x8a9, 0x8aa, 0x8ab, 0x8ac, 0x200f, 0xfb1d, 0xfb1f, 0xfb20, 0xfb21, 0xfb22, 0xfb23, 0xfb24, 0xfb25, 0xfb26, 0xfb27, 0xfb28, 0xfb2a, 0xfb2b, 0xfb2c, 0xfb2d, 0xfb2e, 0xfb2f, 0xfb30, 0xfb31, 0xfb32, 0xfb33, 0xfb34, 0xfb35, 0xfb36, 0xfb38, 0xfb39, 0xfb3a, 0xfb3b, 0xfb3c, 0xfb3e, 0xfb40, 0xfb41, 0xfb43, 0xfb44, 0xfb46, 0xfb47, 0xfb48, 0xfb49, 0xfb4a, 0xfb4b, 0xfb4c, 0xfb4d, 0xfb4e, 0xfb4f, 0xfb50, 0xfb51, 0xfb52, 0xfb53, 0xfb54, 0xfb55, 0xfb56, 0xfb57, 0xfb58, 0xfb59, 0xfb5a, 0xfb5b, 0xfb5c, 0xfb5d, 0xfb5e, 0xfb5f, 0xfb60, 0xfb61, 0xfb62, 0xfb63, 0xfb64, 0xfb65, 0xfb66, 0xfb67, 0xfb68, 0xfb69, 0xfb6a, 0xfb6b, 0xfb6c, 0xfb6d, 0xfb6e, 0xfb6f, 0xfb70, 0xfb71, 0xfb72, 0xfb73, 0xfb74, 0xfb75, 0xfb76, 0xfb77, 0xfb78, 0xfb79, 0xfb7a, 0xfb7b, 0xfb7c, 0xfb7d, 0xfb7e, 0xfb7f, 0xfb80, 0xfb81, 0xfb82, 0xfb83, 0xfb84, 0xfb85, 0xfb86, 0xfb87, 0xfb88, 0xfb89, 0xfb8a, 0xfb8b, 0xfb8c, 0xfb8d, 0xfb8e, 0xfb8f, 0xfb90, 0xfb91, 0xfb92, 0xfb93, 0xfb94, 0xfb95, 0xfb96, 0xfb97, 0xfb98, 0xfb99, 0xfb9a, 0xfb9b, 0xfb9c, 0xfb9d, 0xfb9e, 0xfb9f, 0xfba0, 0xfba1, 0xfba2, 0xfba3, 0xfba4, 0xfba5, 0xfba6, 0xfba7, 0xfba8, 0xfba9, 0xfbaa, 0xfbab, 0xfbac, 0xfbad, 0xfbae, 0xfbaf, 0xfbb0, 0xfbb1, 0xfbb2, 0xfbb3, 0xfbb4, 0xfbb5, 0xfbb6, 0xfbb7, 0xfbb8, 0xfbb9, 0xfbba, 0xfbbb, 0xfbbc, 0xfbbd, 0xfbbe, 0xfbbf, 0xfbc0, 0xfbc1, 0xfbd3, 0xfbd4, 0xfbd5, 0xfbd6, 0xfbd7, 0xfbd8, 0xfbd9, 0xfbda, 0xfbdb, 0xfbdc, 0xfbdd, 0xfbde, 0xfbdf, 0xfbe0, 0xfbe1, 0xfbe2, 0xfbe3, 0xfbe4, 0xfbe5, 0xfbe6, 0xfbe7, 0xfbe8, 0xfbe9, 0xfbea, 0xfbeb, 0xfbec, 0xfbed, 0xfbee, 0xfbef, 0xfbf0, 0xfbf1, 0xfbf2, 0xfbf3, 0xfbf4, 0xfbf5, 0xfbf6, 0xfbf7, 0xfbf8, 0xfbf9, 0xfbfa, 0xfbfb, 0xfbfc, 0xfbfd, 0xfbfe, 0xfbff, 0xfc00, 0xfc01, 0xfc02, 0xfc03, 0xfc04, 0xfc05, 0xfc06, 0xfc07, 0xfc08, 0xfc09, 0xfc0a, 0xfc0b, 0xfc0c, 0xfc0d, 0xfc0e, 0xfc0f, 0xfc10, 0xfc11, 0xfc12, 0xfc13, 0xfc14, 0xfc15, 0xfc16, 0xfc17, 0xfc18, 0xfc19, 0xfc1a, 0xfc1b, 0xfc1c, 0xfc1d, 0xfc1e, 0xfc1f, 0xfc20, 0xfc21, 0xfc22, 0xfc23, 0xfc24, 0xfc25, 0xfc26, 0xfc27, 0xfc28, 0xfc29, 0xfc2a, 0xfc2b, 0xfc2c, 0xfc2d, 0xfc2e, 0xfc2f, 0xfc30, 0xfc31, 0xfc32, 0xfc33, 0xfc34, 0xfc35, 0xfc36, 0xfc37, 0xfc38, 0xfc39, 0xfc3a, 0xfc3b, 0xfc3c, 0xfc3d, 0xfc3e, 0xfc3f, 0xfc40, 0xfc41, 0xfc42, 0xfc43, 0xfc44, 0xfc45, 0xfc46, 0xfc47, 0xfc48, 0xfc49, 0xfc4a, 0xfc4b, 0xfc4c, 0xfc4d, 0xfc4e, 0xfc4f, 0xfc50, 0xfc51, 0xfc52, 0xfc53, 0xfc54, 0xfc55, 0xfc56, 0xfc57, 0xfc58, 0xfc59, 0xfc5a, 0xfc5b, 0xfc5c, 0xfc5d, 0xfc5e, 0xfc5f, 0xfc60, 0xfc61, 0xfc62, 0xfc63, 0xfc64, 0xfc65, 0xfc66, 0xfc67, 0xfc68, 0xfc69, 0xfc6a, 0xfc6b, 0xfc6c, 0xfc6d, 0xfc6e, 0xfc6f, 0xfc70, 0xfc71, 0xfc72, 0xfc73, 0xfc74, 0xfc75, 0xfc76, 0xfc77, 0xfc78, 0xfc79, 0xfc7a, 0xfc7b, 0xfc7c, 0xfc7d, 0xfc7e, 0xfc7f, 0xfc80, 0xfc81, 0xfc82, 0xfc83, 0xfc84, 0xfc85, 0xfc86, 0xfc87, 0xfc88, 0xfc89, 0xfc8a, 0xfc8b, 0xfc8c, 0xfc8d, 0xfc8e, 0xfc8f, 0xfc90, 0xfc91, 0xfc92, 0xfc93, 0xfc94, 0xfc95, 0xfc96, 0xfc97, 0xfc98, 0xfc99, 0xfc9a, 0xfc9b, 0xfc9c, 0xfc9d, 0xfc9e, 0xfc9f, 0xfca0, 0xfca1, 0xfca2, 0xfca3, 0xfca4, 0xfca5, 0xfca6, 0xfca7, 0xfca8, 0xfca9, 0xfcaa, 0xfcab, 0xfcac, 0xfcad, 0xfcae, 0xfcaf, 0xfcb0, 0xfcb1, 0xfcb2, 0xfcb3, 0xfcb4, 0xfcb5, 0xfcb6, 0xfcb7, 0xfcb8, 0xfcb9, 0xfcba, 0xfcbb, 0xfcbc, 0xfcbd, 0xfcbe, 0xfcbf, 0xfcc0, 0xfcc1, 0xfcc2, 0xfcc3, 0xfcc4, 0xfcc5, 0xfcc6, 0xfcc7, 0xfcc8, 0xfcc9, 0xfcca, 0xfccb, 0xfccc, 0xfccd, 0xfcce, 0xfccf, 0xfcd0, 0xfcd1, 0xfcd2, 0xfcd3, 0xfcd4, 0xfcd5, 0xfcd6, 0xfcd7, 0xfcd8, 0xfcd9, 0xfcda, 0xfcdb, 0xfcdc, 0xfcdd, 0xfcde, 0xfcdf, 0xfce0, 0xfce1, 0xfce2, 0xfce3, 0xfce4, 0xfce5, 0xfce6, 0xfce7, 0xfce8, 0xfce9, 0xfcea, 0xfceb, 0xfcec, 0xfced, 0xfcee, 0xfcef, 0xfcf0, 0xfcf1, 0xfcf2, 0xfcf3, 0xfcf4, 0xfcf5, 0xfcf6, 0xfcf7, 0xfcf8, 0xfcf9, 0xfcfa, 0xfcfb, 0xfcfc, 0xfcfd, 0xfcfe, 0xfcff, 0xfd00, 0xfd01, 0xfd02, 0xfd03, 0xfd04, 0xfd05, 0xfd06, 0xfd07, 0xfd08, 0xfd09, 0xfd0a, 0xfd0b, 0xfd0c, 0xfd0d, 0xfd0e, 0xfd0f, 0xfd10, 0xfd11, 0xfd12, 0xfd13, 0xfd14, 0xfd15, 0xfd16, 0xfd17, 0xfd18, 0xfd19, 0xfd1a, 0xfd1b, 0xfd1c, 0xfd1d, 0xfd1e, 0xfd1f, 0xfd20, 0xfd21, 0xfd22, 0xfd23, 0xfd24, 0xfd25, 0xfd26, 0xfd27, 0xfd28, 0xfd29, 0xfd2a, 0xfd2b, 0xfd2c, 0xfd2d, 0xfd2e, 0xfd2f, 0xfd30, 0xfd31, 0xfd32, 0xfd33, 0xfd34, 0xfd35, 0xfd36, 0xfd37, 0xfd38, 0xfd39, 0xfd3a, 0xfd3b, 0xfd3c, 0xfd3d, 0xfd50, 0xfd51, 0xfd52, 0xfd53, 0xfd54, 0xfd55, 0xfd56, 0xfd57, 0xfd58, 0xfd59, 0xfd5a, 0xfd5b, 0xfd5c, 0xfd5d, 0xfd5e, 0xfd5f, 0xfd60, 0xfd61, 0xfd62, 0xfd63, 0xfd64, 0xfd65, 0xfd66, 0xfd67, 0xfd68, 0xfd69, 0xfd6a, 0xfd6b, 0xfd6c, 0xfd6d, 0xfd6e, 0xfd6f, 0xfd70, 0xfd71, 0xfd72, 0xfd73, 0xfd74, 0xfd75, 0xfd76, 0xfd77, 0xfd78, 0xfd79, 0xfd7a, 0xfd7b, 0xfd7c, 0xfd7d, 0xfd7e, 0xfd7f, 0xfd80, 0xfd81, 0xfd82, 0xfd83, 0xfd84, 0xfd85, 0xfd86, 0xfd87, 0xfd88, 0xfd89, 0xfd8a, 0xfd8b, 0xfd8c, 0xfd8d, 0xfd8e, 0xfd8f, 0xfd92, 0xfd93, 0xfd94, 0xfd95, 0xfd96, 0xfd97, 0xfd98, 0xfd99, 0xfd9a, 0xfd9b, 0xfd9c, 0xfd9d, 0xfd9e, 0xfd9f, 0xfda0, 0xfda1, 0xfda2, 0xfda3, 0xfda4, 0xfda5, 0xfda6, 0xfda7, 0xfda8, 0xfda9, 0xfdaa, 0xfdab, 0xfdac, 0xfdad, 0xfdae, 0xfdaf, 0xfdb0, 0xfdb1, 0xfdb2, 0xfdb3, 0xfdb4, 0xfdb5, 0xfdb6, 0xfdb7, 0xfdb8, 0xfdb9, 0xfdba, 0xfdbb, 0xfdbc, 0xfdbd, 0xfdbe, 0xfdbf, 0xfdc0, 0xfdc1, 0xfdc2, 0xfdc3, 0xfdc4, 0xfdc5, 0xfdc6, 0xfdc7, 0xfdf0, 0xfdf1, 0xfdf2, 0xfdf3, 0xfdf4, 0xfdf5, 0xfdf6, 0xfdf7, 0xfdf8, 0xfdf9, 0xfdfa, 0xfdfb, 0xfdfc, 0xfe70, 0xfe71, 0xfe72, 0xfe73, 0xfe74, 0xfe76, 0xfe77, 0xfe78, 0xfe79, 0xfe7a, 0xfe7b, 0xfe7c, 0xfe7d, 0xfe7e, 0xfe7f, 0xfe80, 0xfe81, 0xfe82, 0xfe83, 0xfe84, 0xfe85, 0xfe86, 0xfe87, 0xfe88, 0xfe89, 0xfe8a, 0xfe8b, 0xfe8c, 0xfe8d, 0xfe8e, 0xfe8f, 0xfe90, 0xfe91, 0xfe92, 0xfe93, 0xfe94, 0xfe95, 0xfe96, 0xfe97, 0xfe98, 0xfe99, 0xfe9a, 0xfe9b, 0xfe9c, 0xfe9d, 0xfe9e, 0xfe9f, 0xfea0, 0xfea1, 0xfea2, 0xfea3, 0xfea4, 0xfea5, 0xfea6, 0xfea7, 0xfea8, 0xfea9, 0xfeaa, 0xfeab, 0xfeac, 0xfead, 0xfeae, 0xfeaf, 0xfeb0, 0xfeb1, 0xfeb2, 0xfeb3, 0xfeb4, 0xfeb5, 0xfeb6, 0xfeb7, 0xfeb8, 0xfeb9, 0xfeba, 0xfebb, 0xfebc, 0xfebd, 0xfebe, 0xfebf, 0xfec0, 0xfec1, 0xfec2, 0xfec3, 0xfec4, 0xfec5, 0xfec6, 0xfec7, 0xfec8, 0xfec9, 0xfeca, 0xfecb, 0xfecc, 0xfecd, 0xfece, 0xfecf, 0xfed0, 0xfed1, 0xfed2, 0xfed3, 0xfed4, 0xfed5, 0xfed6, 0xfed7, 0xfed8, 0xfed9, 0xfeda, 0xfedb, 0xfedc, 0xfedd, 0xfede, 0xfedf, 0xfee0, 0xfee1, 0xfee2, 0xfee3, 0xfee4, 0xfee5, 0xfee6, 0xfee7, 0xfee8, 0xfee9, 0xfeea, 0xfeeb, 0xfeec, 0xfeed, 0xfeee, 0xfeef, 0xfef0, 0xfef1, 0xfef2, 0xfef3, 0xfef4, 0xfef5, 0xfef6, 0xfef7, 0xfef8, 0xfef9, 0xfefa, 0xfefb, 0xfefc, 0x10800, 0x10801, 0x10802, 0x10803, 0x10804, 0x10805, 0x10808, 0x1080a, 0x1080b, 0x1080c, 0x1080d, 0x1080e, 0x1080f, 0x10810, 0x10811, 0x10812, 0x10813, 0x10814, 0x10815, 0x10816, 0x10817, 0x10818, 0x10819, 0x1081a, 0x1081b, 0x1081c, 0x1081d, 0x1081e, 0x1081f, 0x10820, 0x10821, 0x10822, 0x10823, 0x10824, 0x10825, 0x10826, 0x10827, 0x10828, 0x10829, 0x1082a, 0x1082b, 0x1082c, 0x1082d, 0x1082e, 0x1082f, 0x10830, 0x10831, 0x10832, 0x10833, 0x10834, 0x10835, 0x10837, 0x10838, 0x1083c, 0x1083f, 0x10840, 0x10841, 0x10842, 0x10843, 0x10844, 0x10845, 0x10846, 0x10847, 0x10848, 0x10849, 0x1084a, 0x1084b, 0x1084c, 0x1084d, 0x1084e, 0x1084f, 0x10850, 0x10851, 0x10852, 0x10853, 0x10854, 0x10855, 0x10857, 0x10858, 0x10859, 0x1085a, 0x1085b, 0x1085c, 0x1085d, 0x1085e, 0x1085f, 0x10900, 0x10901, 0x10902, 0x10903, 0x10904, 0x10905, 0x10906, 0x10907, 0x10908, 0x10909, 0x1090a, 0x1090b, 0x1090c, 0x1090d, 0x1090e, 0x1090f, 0x10910, 0x10911, 0x10912, 0x10913, 0x10914, 0x10915, 0x10916, 0x10917, 0x10918, 0x10919, 0x1091a, 0x1091b, 0x10920, 0x10921, 0x10922, 0x10923, 0x10924, 0x10925, 0x10926, 0x10927, 0x10928, 0x10929, 0x1092a, 0x1092b, 0x1092c, 0x1092d, 0x1092e, 0x1092f, 0x10930, 0x10931, 0x10932, 0x10933, 0x10934, 0x10935, 0x10936, 0x10937, 0x10938, 0x10939, 0x1093f, 0x10980, 0x10981, 0x10982, 0x10983, 0x10984, 0x10985, 0x10986, 0x10987, 0x10988, 0x10989, 0x1098a, 0x1098b, 0x1098c, 0x1098d, 0x1098e, 0x1098f, 0x10990, 0x10991, 0x10992, 0x10993, 0x10994, 0x10995, 0x10996, 0x10997, 0x10998, 0x10999, 0x1099a, 0x1099b, 0x1099c, 0x1099d, 0x1099e, 0x1099f, 0x109a0, 0x109a1, 0x109a2, 0x109a3, 0x109a4, 0x109a5, 0x109a6, 0x109a7, 0x109a8, 0x109a9, 0x109aa, 0x109ab, 0x109ac, 0x109ad, 0x109ae, 0x109af, 0x109b0, 0x109b1, 0x109b2, 0x109b3, 0x109b4, 0x109b5, 0x109b6, 0x109b7, 0x109be, 0x109bf, 0x10a00, 0x10a10, 0x10a11, 0x10a12, 0x10a13, 0x10a15, 0x10a16, 0x10a17, 0x10a19, 0x10a1a, 0x10a1b, 0x10a1c, 0x10a1d, 0x10a1e, 0x10a1f, 0x10a20, 0x10a21, 0x10a22, 0x10a23, 0x10a24, 0x10a25, 0x10a26, 0x10a27, 0x10a28, 0x10a29, 0x10a2a, 0x10a2b, 0x10a2c, 0x10a2d, 0x10a2e, 0x10a2f, 0x10a30, 0x10a31, 0x10a32, 0x10a33, 0x10a40, 0x10a41, 0x10a42, 0x10a43, 0x10a44, 0x10a45, 0x10a46, 0x10a47, 0x10a50, 0x10a51, 0x10a52, 0x10a53, 0x10a54, 0x10a55, 0x10a56, 0x10a57, 0x10a58, 0x10a60, 0x10a61, 0x10a62, 0x10a63, 0x10a64, 0x10a65, 0x10a66, 0x10a67, 0x10a68, 0x10a69, 0x10a6a, 0x10a6b, 0x10a6c, 0x10a6d, 0x10a6e, 0x10a6f, 0x10a70, 0x10a71, 0x10a72, 0x10a73, 0x10a74, 0x10a75, 0x10a76, 0x10a77, 0x10a78, 0x10a79, 0x10a7a, 0x10a7b, 0x10a7c, 0x10a7d, 0x10a7e, 0x10a7f, 0x10b00, 0x10b01, 0x10b02, 0x10b03, 0x10b04, 0x10b05, 0x10b06, 0x10b07, 0x10b08, 0x10b09, 0x10b0a, 0x10b0b, 0x10b0c, 0x10b0d, 0x10b0e, 0x10b0f, 0x10b10, 0x10b11, 0x10b12, 0x10b13, 0x10b14, 0x10b15, 0x10b16, 0x10b17, 0x10b18, 0x10b19, 0x10b1a, 0x10b1b, 0x10b1c, 0x10b1d, 0x10b1e, 0x10b1f, 0x10b20, 0x10b21, 0x10b22, 0x10b23, 0x10b24, 0x10b25, 0x10b26, 0x10b27, 0x10b28, 0x10b29, 0x10b2a, 0x10b2b, 0x10b2c, 0x10b2d, 0x10b2e, 0x10b2f, 0x10b30, 0x10b31, 0x10b32, 0x10b33, 0x10b34, 0x10b35, 0x10b40, 0x10b41, 0x10b42, 0x10b43, 0x10b44, 0x10b45, 0x10b46, 0x10b47, 0x10b48, 0x10b49, 0x10b4a, 0x10b4b, 0x10b4c, 0x10b4d, 0x10b4e, 0x10b4f, 0x10b50, 0x10b51, 0x10b52, 0x10b53, 0x10b54, 0x10b55, 0x10b58, 0x10b59, 0x10b5a, 0x10b5b, 0x10b5c, 0x10b5d, 0x10b5e, 0x10b5f, 0x10b60, 0x10b61, 0x10b62, 0x10b63, 0x10b64, 0x10b65, 0x10b66, 0x10b67, 0x10b68, 0x10b69, 0x10b6a, 0x10b6b, 0x10b6c, 0x10b6d, 0x10b6e, 0x10b6f, 0x10b70, 0x10b71, 0x10b72, 0x10b78, 0x10b79, 0x10b7a, 0x10b7b, 0x10b7c, 0x10b7d, 0x10b7e, 0x10b7f, 0x10c00, 0x10c01, 0x10c02, 0x10c03, 0x10c04, 0x10c05, 0x10c06, 0x10c07, 0x10c08, 0x10c09, 0x10c0a, 0x10c0b, 0x10c0c, 0x10c0d, 0x10c0e, 0x10c0f, 0x10c10, 0x10c11, 0x10c12, 0x10c13, 0x10c14, 0x10c15, 0x10c16, 0x10c17, 0x10c18, 0x10c19, 0x10c1a, 0x10c1b, 0x10c1c, 0x10c1d, 0x10c1e, 0x10c1f, 0x10c20, 0x10c21, 0x10c22, 0x10c23, 0x10c24, 0x10c25, 0x10c26, 0x10c27, 0x10c28, 0x10c29, 0x10c2a, 0x10c2b, 0x10c2c, 0x10c2d, 0x10c2e, 0x10c2f, 0x10c30, 0x10c31, 0x10c32, 0x10c33, 0x10c34, 0x10c35, 0x10c36, 0x10c37, 0x10c38, 0x10c39, 0x10c3a, 0x10c3b, 0x10c3c, 0x10c3d, 0x10c3e, 0x10c3f, 0x10c40, 0x10c41, 0x10c42, 0x10c43, 0x10c44, 0x10c45, 0x10c46, 0x10c47, 0x10c48, 0x1ee00, 0x1ee01, 0x1ee02, 0x1ee03, 0x1ee05, 0x1ee06, 0x1ee07, 0x1ee08, 0x1ee09, 0x1ee0a, 0x1ee0b, 0x1ee0c, 0x1ee0d, 0x1ee0e, 0x1ee0f, 0x1ee10, 0x1ee11, 0x1ee12, 0x1ee13, 0x1ee14, 0x1ee15, 0x1ee16, 0x1ee17, 0x1ee18, 0x1ee19, 0x1ee1a, 0x1ee1b, 0x1ee1c, 0x1ee1d, 0x1ee1e, 0x1ee1f, 0x1ee21, 0x1ee22, 0x1ee24, 0x1ee27, 0x1ee29, 0x1ee2a, 0x1ee2b, 0x1ee2c, 0x1ee2d, 0x1ee2e, 0x1ee2f, 0x1ee30, 0x1ee31, 0x1ee32, 0x1ee34, 0x1ee35, 0x1ee36, 0x1ee37, 0x1ee39, 0x1ee3b, 0x1ee42, 0x1ee47, 0x1ee49, 0x1ee4b, 0x1ee4d, 0x1ee4e, 0x1ee4f, 0x1ee51, 0x1ee52, 0x1ee54, 0x1ee57, 0x1ee59, 0x1ee5b, 0x1ee5d, 0x1ee5f, 0x1ee61, 0x1ee62, 0x1ee64, 0x1ee67, 0x1ee68, 0x1ee69, 0x1ee6a, 0x1ee6c, 0x1ee6d, 0x1ee6e, 0x1ee6f, 0x1ee70, 0x1ee71, 0x1ee72, 0x1ee74, 0x1ee75, 0x1ee76, 0x1ee77, 0x1ee79, 0x1ee7a, 0x1ee7b, 0x1ee7c, 0x1ee7e, 0x1ee80, 0x1ee81, 0x1ee82, 0x1ee83, 0x1ee84, 0x1ee85, 0x1ee86, 0x1ee87, 0x1ee88, 0x1ee89, 0x1ee8b, 0x1ee8c, 0x1ee8d, 0x1ee8e, 0x1ee8f, 0x1ee90, 0x1ee91, 0x1ee92, 0x1ee93, 0x1ee94, 0x1ee95, 0x1ee96, 0x1ee97, 0x1ee98, 0x1ee99, 0x1ee9a, 0x1ee9b, 0x1eea1, 0x1eea2, 0x1eea3, 0x1eea5, 0x1eea6, 0x1eea7, 0x1eea8, 0x1eea9, 0x1eeab, 0x1eeac, 0x1eead, 0x1eeae, 0x1eeaf, 0x1eeb0, 0x1eeb1, 0x1eeb2, 0x1eeb3, 0x1eeb4, 0x1eeb5, 0x1eeb6, 0x1eeb7, 0x1eeb8, 0x1eeb9, 0x1eeba, 0x1eebb, 0x10fffd];
  _0x3c9631.prototype.applyStyles = function (_0x23c4d9, _0x296904) {
    _0x296904 = _0x296904 || this.div;
    for (var _0x4d9d33 in _0x23c4d9) _0x23c4d9.hasOwnProperty(_0x4d9d33) && (_0x296904.style[_0x4d9d33] = _0x23c4d9[_0x4d9d33]);
  }, _0x3c9631.prototype.formatStyle = function (_0x4e9f2c, _0x3df298) {
    return 0x0 === _0x4e9f2c ? 0x0 : _0x4e9f2c + _0x3df298;
  }, _0xdf8a37.prototype = _0x58df21(_0x3c9631.prototype), _0xdf8a37.prototype.constructor = _0xdf8a37, _0x98b98a.prototype.move = function (_0x2f23b9, _0x185297) {
    switch (_0x185297 = void 0x0 !== _0x185297 ? _0x185297 : this.lineHeight, _0x2f23b9) {
      case '+x':
        this.left += _0x185297, this.right += _0x185297;
        break;
      case '-x':
        this.left -= _0x185297, this.right -= _0x185297;
        break;
      case '+y':
        this.top += _0x185297, this.bottom += _0x185297;
        break;
      case '-y':
        this.top -= _0x185297, this.bottom -= _0x185297;
    }
  }, _0x98b98a.prototype.overlaps = function (_0x1c8279) {
    return this.left < _0x1c8279.right && this.right > _0x1c8279.left && this.top < _0x1c8279.bottom && this.bottom > _0x1c8279.top;
  }, _0x98b98a.prototype.overlapsAny = function (_0xd4dd10) {
    for (var _0x2df6b6 = 0x0; 0x0 < _0xd4dd10.length; _0x2df6b6++) if (this.overlaps(_0xd4dd10[_0x2df6b6])) return !0x0;
    return !0x1;
  }, _0x98b98a.prototype.within = function (_0x331481) {
    return this.top >= _0x331481.top && this.bottom <= _0x331481.bottom && this.left >= _0x331481.left && this.right <= _0x331481.right;
  }, _0x98b98a.prototype.overlapsOppositeAxis = function (_0x3972ec, _0xeea36a) {
    switch (_0xeea36a) {
      case '+x':
        return this.left < _0x3972ec.left;
      case '-x':
        return this.right > _0x3972ec.right;
      case '+y':
        return this.top < _0x3972ec.top;
      case '-y':
        return this.bottom > _0x3972ec.bottom;
    }
  }, _0x98b98a.prototype.intersectPercentage = function (_0x4d6413) {
    var _0x3f03e3 = Math.max(0x0, Math.min(this.right, _0x4d6413.right) - Math.max(this.left, _0x4d6413.left)),
      _0x5e4ed = Math.max(0x0, Math.min(this.bottom, _0x4d6413.bottom) - Math.max(this.top, _0x4d6413.top)),
      _0x3858ef = _0x3f03e3 * _0x5e4ed;
    return _0x3858ef / (this.height * this.width);
  }, _0x98b98a.prototype.toCSSCompatValues = function (_0x2dd71e) {
    return {
      'top': this.top - _0x2dd71e.top,
      'bottom': _0x2dd71e.bottom - this.bottom,
      'left': this.left - _0x2dd71e.left,
      'right': _0x2dd71e.right - this.right,
      'height': this.height,
      'width': this.width
    };
  }, _0x98b98a.getSimpleBoxPosition = function (_0x501b65) {
    var _0x59aaa6 = _0x501b65.div ? _0x501b65.div.offsetHeight : _0x501b65.tagName ? _0x501b65.offsetHeight : 0x0,
      _0x4902b8 = _0x501b65.div ? _0x501b65.div.offsetWidth : _0x501b65.tagName ? _0x501b65.offsetWidth : 0x0,
      _0x389dfc = _0x501b65.div ? _0x501b65.div.offsetTop : _0x501b65.tagName ? _0x501b65.offsetTop : 0x0;
    _0x501b65 = _0x501b65.div ? _0x501b65.div.getBoundingClientRect() : _0x501b65.tagName ? _0x501b65.getBoundingClientRect() : _0x501b65;
    var _0x11a6b3 = {
      'left': _0x501b65.left,
      'right': _0x501b65.right,
      'top': _0x501b65.top || _0x389dfc,
      'height': _0x501b65.height || _0x59aaa6,
      'bottom': _0x501b65.bottom || _0x389dfc + (_0x501b65.height || _0x59aaa6),
      'width': _0x501b65.width || _0x4902b8
    };
    return _0x11a6b3;
  }, _0x41c30f.StringDecoder = function () {
    return {
      'decode': function (_0x29b95e) {
        if (!_0x29b95e) return '';
        if ("string" != typeof _0x29b95e) throw new Error('Error\x20-\x20expected\x20string\x20data.');
        return decodeURIComponent(encodeURIComponent(_0x29b95e));
      }
    };
  }, _0x41c30f.convertCueToDOMTree = function (_0x2a3ec9, _0x4bb1ae) {
    return _0x2a3ec9 && _0x4bb1ae ? _0x530f31(_0x2a3ec9, _0x4bb1ae) : null;
  };
  _0x41c30f.processCues = function (_0x2866e2, _0x15e649, _0x5280a1) {
    function _0x15c455(_0x20814f) {
      for (var _0x5d47ce = 0x0; 0x0 < _0x20814f.length; _0x5d47ce++) if (_0x20814f[_0x5d47ce].hasBeenReset || !_0x20814f[_0x5d47ce].displayState) return !0x0;
      return !0x1;
    }
    if (!_0x2866e2 || !_0x15e649 || !_0x5280a1) return null;
    for (; _0x5280a1.firstChild;) _0x5280a1.removeChild(_0x5280a1.firstChild);
    var _0x5cc9e6 = _0x2866e2.document.createElement("div");
    if (_0x5cc9e6.style.position = "absolute", _0x5cc9e6.style.left = '0', _0x5cc9e6.style.right = '0', _0x5cc9e6.style.top = '0', _0x5cc9e6.style.bottom = '0', _0x5cc9e6.style.margin = "1.5%", _0x5280a1.appendChild(_0x5cc9e6), _0x15c455(_0x15e649)) {
      var _0xc92bb2 = [],
        _0x1356a2 = _0x98b98a.getSimpleBoxPosition(_0x5cc9e6),
        _0x27a65c = Math.round(_0x1356a2.height * 0.05 * 0x64) / 0x64,
        _0x435504 = {
          'font': _0x27a65c + 'px\x20' + 'sans-serif'
        };
      !function () {
        for (var _0x3369a5, _0xdfdac8, _0x2f776f = 0x0; 0x0 < _0x15e649.length; _0x2f776f++) _0xdfdac8 = _0x15e649[_0x2f776f], _0x3369a5 = new _0xdf8a37(_0x2866e2, _0xdfdac8, _0x435504), _0x5cc9e6.appendChild(_0x3369a5.div), _0x2d7b80(_0x2866e2, _0x3369a5, _0x1356a2, _0xc92bb2), _0xdfdac8.displayState = _0x3369a5.div, _0xc92bb2.push(_0x98b98a.getSimpleBoxPosition(_0x3369a5));
      }();
    } else {
      for (var _0x4e42ff = 0x0; 0x0 < _0x15e649.length; _0x4e42ff++) _0x5cc9e6.appendChild(_0x15e649[_0x4e42ff].displayState);
    }
  }, _0x41c30f.Parser = function (_0x73e364, _0x2bbc99, _0x3eead3) {
    _0x3eead3 || (_0x3eead3 = _0x2bbc99, _0x2bbc99 = {}), _0x2bbc99 || (_0x2bbc99 = {}), this.window = _0x73e364, this.vttjs = _0x2bbc99, this.state = "INITIAL", this.buffer = '', this.decoder = _0x3eead3 || new TextDecoder('utf8'), this.regionList = [];
  }, _0x41c30f.Parser.prototype = {
    'reportOrThrowError': function (_0x493cc9) {
      if (!(_0x493cc9 instanceof _0x2132a9)) throw _0x493cc9;
      this.onparsingerror && this.onparsingerror(_0x493cc9);
    },
    'parse': function (_0x2483c4) {
      function _0x1500d3() {
        for (var _0x5a2bab = this.buffer, _0x109589 = 0x0; _0x109589 < this.buffer.length && '\x0d' !== this.buffer[_0x109589] && '\x0a' !== this.buffer[_0x109589];) ++_0x109589;
        var _0x159296 = this.buffer.substr(0x0, _0x109589);
        return '\x0d' === this.buffer[_0x109589] && ++_0x109589, '\x0a' === this.buffer[_0x109589] && ++_0x109589, this.buffer = this.buffer.substr(_0x109589), _0x159296;
      }
      function _0x30c0f9(_0x479ecc) {
        var _0x183edc = new _0x14630f();
        if (_0x4ebfcd(_0x479ecc, function (_0x38e847, _0x5e2004) {
          switch (_0x38e847) {
            case 'id':
              _0x183edc.set(_0x38e847, _0x5e2004);
              break;
            case "width":
              _0x183edc.percent(_0x38e847, _0x5e2004);
              break;
            case "lines":
              _0x183edc.integer(_0x38e847, _0x5e2004);
              break;
            case "regionanchor":
            case "viewportanchor":
              var _0x2e06bb = _0x5e2004.split(',');
              if (0x2 !== _0x2e06bb.length) break;
              var _0xde195e = new _0x14630f();
              if (_0xde195e.percent('x', _0x2e06bb[0x0]), _0xde195e.percent('y', _0x2e06bb[0x1]), !_0xde195e.has('x') || !_0xde195e.has('y')) break;
              _0x183edc.set(_0x38e847 + 'X', _0xde195e.get('x')), _0x183edc.set(_0x38e847 + 'Y', _0xde195e.get('y'));
              break;
            case "scroll":
              _0x183edc.alt(_0x38e847, _0x5e2004, ['up']);
          }
        }, /=/, /\s/), _0x183edc.has('id')) {
          var _0x5e48af = new (this.vttjs.VTTRegion || this.window.VTTRegion)();
          _0x5e48af.width = _0x183edc.get("width", 0x64), _0x5e48af.lines = _0x183edc.get("lines", 0x3), _0x5e48af.regionAnchorX = _0x183edc.get("regionanchorX", 0x0), _0x5e48af.regionAnchorY = _0x183edc.get("regionanchorY", 0x64), _0x5e48af.viewportAnchorX = _0x183edc.get('viewportanchorX', 0x0), _0x5e48af.viewportAnchorY = _0x183edc.get('viewportanchorY', 0x64), _0x5e48af.scroll = _0x183edc.get("scroll", ''), this.onregion && this.onregion(_0x5e48af), this.regionList.push({
            'id': _0x183edc.get('id'),
            'region': _0x5e48af
          });
        }
      }
      function _0x4c5615(_0xde6876) {
        _0x4ebfcd(_0xde6876, function (_0x4bbcec, _0x511416) {
          switch (_0x4bbcec) {
            case "Region":
              _0x30c0f9(_0x511416);
          }
        }, /:/);
      }
      _0x2483c4 && (this.buffer += this.decoder.decode(_0x2483c4, {
        'stream': !0x0
      }));
      try {
        var _0xa0c5ec;
        if ('INITIAL' === this.state) {
          if (!/\r\n|\n/.test(this.buffer)) return this;
          _0xa0c5ec = _0x1500d3();
          var _0x4999fd = _0xa0c5ec.match(/^WEBVTT([ \t].*)?$/);
          if (!_0x4999fd || !_0x4999fd[0x0]) throw new _0x2132a9(_0x2132a9.Errors.BadSignature);
          this.state = "HEADER";
        }
        for (var _0x80baf4 = !0x1; this.buffer;) {
          if (!/\r\n|\n/.test(this.buffer)) return this;
          switch (!0x1 ? _0x80baf4 = !0x1 : _0xa0c5ec = _0x1500d3(), this.state) {
            case 'HEADER':
              /:/.test(_0xa0c5ec) ? _0x4c5615(_0xa0c5ec) : _0xa0c5ec || (this.state = 'ID');
              continue;
            case 'NOTE':
              _0xa0c5ec || (this.state = 'ID');
              continue;
            case 'ID':
              if (/^NOTE($|[ \t])/.test(_0xa0c5ec)) {
                this.state = "NOTE";
                break;
              }
              if (!_0xa0c5ec) continue;
              if (this.cue = new (this.vttjs.VTTCue || this.window.VTTCue)(0x0, 0x0, ''), this.state = "CUE", -0x1 === _0xa0c5ec.indexOf("-->")) {
                this.cue.id = _0xa0c5ec;
                continue;
              }
            case 'CUE':
              try {
                _0x5105c0(_0xa0c5ec, this.cue, this.regionList);
              } catch (_0x32d8f3) {
                this.reportOrThrowError(_0x32d8f3), this.cue = null, this.state = 'BADCUE';
                continue;
              }
              this.state = "CUETEXT";
              continue;
            case 'CUETEXT':
              var _0x1c866f = -0x1 !== _0xa0c5ec.indexOf("-->");
              if (!_0xa0c5ec || _0x1c866f && (_0x80baf4 = !0x0)) {
                this.oncue && this.oncue(this.cue), this.cue = null, this.state = 'ID';
                continue;
              }
              this.cue.text && (this.cue.text += '\x0a'), this.cue.text += _0xa0c5ec;
              continue;
            case "BADCUE":
              _0xa0c5ec || (this.state = 'ID');
              continue;
          }
        }
      } catch (_0x314895) {
        this.reportOrThrowError(_0x314895), "CUETEXT" === this.state && this.cue && this.oncue && this.oncue(this.cue), this.cue = null, this.state = 'INITIAL' === this.state ? 'BADWEBVTT' : 'BADCUE';
      }
      return this;
    },
    'flush': function () {
      try {
        if (this.buffer += this.decoder.decode(), (this.cue || "HEADER" === this.state) && (this.buffer += '\x0a\x0a', this.parse()), 'INITIAL' === this.state) throw new _0x2132a9(_0x2132a9.Errors.BadSignature);
      } catch (_0xf0003f) {
        this.reportOrThrowError(_0xf0003f);
      }
      return this.onflush && this.onflush(), this;
    }
  }, _0x591ab2.WebVTT = _0x41c30f;
}(this, this.vttjs || {});