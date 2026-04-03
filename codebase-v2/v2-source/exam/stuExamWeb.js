webpackJsonp([13], {
    249: function (e, t, n) {
        "use strict";
        var r = n(85)
            , i = n.n(r)
            , a = n(83)
            , o = n.n(a)
            , s = n(65)
            , u = n.n(s)
            , c = n(5)
            , l = n(254);
        c.default.use(l.a),
            t.a = new l.a.Store({
                state: {
                    userName: "",
                    userHeader: "",
                    uuid: "",
                    arrObj: {},
                    schoolId: 0,
                    answerArr: [],
                    homeWorkFlag: Boolean,
                    mainThat: {},
                    doHomeWorkObj: {},
                    doExaminationObj: {},
                    setGoErweimaObj: {},
                    courseName: "",
                    key: "",
                    examKey: "",
                    globalProperty: {},
                    aiAvatar: "https://image.zhihuishu.com/zhs/b2cm/base1/202410/08b6d7a94b1f4d579a2a8942f2f45657.png"
                },
                getters: {
                    getUserName: function (e) {
                        return e.userName
                    },
                    getMainContentFun: function (e) {
                        return e.mainThat
                    }
                },
                mutations: {
                    setAiAvatar: function (e, t) {
                        e.aiAvatar = t
                    },
                    getUserInfo: function (e, t) {
                        e.userName = t.realName,
                            e.userHeader = t.headPicUrl ? t.headPicUrl : "//image.zhihuishu.com/zhs_yanfa_150820/ablecommons/demo/201812/9c891e5b08e541c3b8458b2b9ac9d80a.jpg",
                            e.uuid = t.uuid
                    },
                    setArrTest: function (e, t) {
                        e.arrObj = u()(e.arrObj, t)
                    },
                    setGoErweimaFun: function (e, t) {
                        e.setGoErweimaObj = u()(e.setGoErweimaObj, t),
                            sessionStorage.setItem("setGoErweimaObj", o()(e.setGoErweimaObj))
                    },
                    getSchoolInfo: function (e, t) {
                        e.schoolId = t.schoolId
                    },
                    getAnswerArr: function (e, t) {
                        e.answerArr = t
                    },
                    getHomeWorkFlag: function (e, t) {
                        e.homeWorkFlag = t
                    },
                    setMainThat: function (e, t) {
                        e.mainThat = u()(e.mainThat, t)
                    },
                    setDoHomeWork: function (e, t) {
                        e.doHomeWorkObj = u()(e.doHomeWorkObj, t)
                    },
                    setDoExamination: function (e, t) {
                        e.doExaminationObj = u()(e.doExaminationObj, t)
                    },
                    setCourseName: function (e, t) {
                        e.courseName = t
                    },
                    setKey: function (e, t) {
                        e.key = t
                    },
                    setExamKey: function (e, t) {
                        e.examKey = t
                    },
                    setEnableGlobal: function (e, t) {
                        e.globalProperty = i()({}, e.globalProperty, t)
                    }
                },
                actions: {
                    getKey: function (e) {
                        var t = e.commit;
                        return labc(3).then(function (e) {
                            return t("setKey", e),
                                e
                        })
                    },
                    getExamKey: function (e) {
                        var t = e.commit;
                        return labc(5).then(function (e) {
                            return t("setExamKey", e),
                                e
                        })
                    }
                }
            })
    },
    259: function (e, t, n) {
        function r(e) {
            n(524)
        }
        var i = n(11)(n(416), n(548), r, null, null);
        e.exports = i.exports
    },
    266: function (e, t, n) {
        "use strict";
        function r(e, t) {
            return new m.a(function (n, r) {
                h.a.get(e, {
                    params: t
                }).then(function (e) {
                    n(e.data)
                }, function (e) {
                    r(e)
                }).catch(function (e) {
                    r(e)
                })
            }
            )
        }
        function i(e, t) {
            var n = this;
            return new m.a(function () {
                var r = l()(o.a.mark(function r(i, a) {
                    var s;
                    return o.a.wrap(function (n) {
                        for (; ;)
                            switch (n.prev = n.next) {
                                case 0:
                                    return n.next = 2,
                                        b();
                                case 2:
                                    s = n.sent,
                                        h.a.get(e, {
                                            params: {
                                                secretStr: yxyz(t, s)
                                            }
                                        }).then(function (e) {
                                            i(e.data)
                                        }, function (e) {
                                            a(e)
                                        }).catch(function (e) {
                                            a(e)
                                        });
                                case 4:
                                case "end":
                                    return n.stop()
                            }
                    }, r, n)
                }));
                return function (e, t) {
                    return r.apply(this, arguments)
                }
            }())
        }
        n.d(t, "a", function () {
            return x
        }),
            t.b = r,
            t.c = i;
        var a = n(346)
            , o = n.n(a)
            , s = n(65)
            , u = n.n(s)
            , c = n(345)
            , l = n.n(c)
            , d = n(68)
            , m = n.n(d)
            , f = n(70)
            , h = n.n(f)
            , p = n(77)
            , g = n.n(p)
            , v = n(29)
            , _ = n(402)
            , w = this;
        h.a.defaults.timeout = 15e3,
            h.a.defaults.withCredentials = !0,
            h.a.defaults.headers = {
                "Content-Type": "application/json;charset=UTF-8"
            },
            h.a.interceptors.request.use(function (e) {
                "post" !== e.method || e.rowBody || (e.data = g.a.stringify(e.data));
                var t = n.i(v.b)("CASLOGC") ? JSON.parse(n.i(v.b)("CASLOGC")).uuid : ""
                    , r = sessionStorage.getItem("recruitId");
                if (t && (e.url.indexOf("getStudentHomework") > 0 || e.url.indexOf("saveStudentAnswer") > 0 || e.url.indexOf("/answer/submit") > 0 || e.url.indexOf("/student/doExam") > 0 || e.url.indexOf("getStuAnswerInfoNew") > 0 || e.url.indexOf("getStudentFinalExam") > 0))
                    e.headers = {
                        "Content-Type": "application/x-www-form-urlencoded"
                    };
                else if (e.url.indexOf("getExamToken") > 0) {
                    var i = [t, r]
                        , a = _.a.Z(i);
                    e.headers = {
                        ev: a,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                } else
                    e.rowBody || (e.headers = {
                        "Content-Type": "application/x-www-form-urlencoded"
                    });
                return e
            }, function (e) {
                return m.a.reject(e)
            }),
            h.a.interceptors.response.use(function (e) {
                return 2e3 === !e.data.status ? m.a.reject(e) : e
            }, function (e) {
                if (console.log(e.response, "errorerrorerrorerror"),
                    e && e.response && 422 == e.response.status) {
                    var t = e.response.data
                        , n = t.checkType
                        , r = t.checkPlan;
                    3 == n ? window.zhsMonitor.open("nostudy") : 1 != n && 2 != n || window.zhsMonitor.open("blacklist", {
                        checkType: n,
                        checkPlan: r,
                        sourceModule: "SworkExam"
                    })
                }
                return m.a.reject(e)
            });
        var x = function () {
            var e = l()(o.a.mark(function e(t, r, i) {
                var a;
                return o.a.wrap(function (e) {
                    for (; ;)
                        switch (e.prev = e.next) {
                            case 0:
                                if (a = void 0,
                                    1 != i) {
                                    e.next = 7;
                                    break
                                }
                                return e.next = 4,
                                    n.i(v.c)();
                            case 4:
                                a = e.sent,
                                    e.next = 10;
                                break;
                            case 7:
                                return e.next = 9,
                                    n.i(v.d)();
                            case 9:
                                a = e.sent;
                            case 10:
                                return 2 != i && (r = {
                                    secretStr: yxyz(r, a)
                                }),
                                    n.i(v.e)(t) && (r = u()(r, {
                                        source: "1"
                                    })),
                                    e.abrupt("return", new m.a(function (e, n) {
                                        h.a.post(t, r).then(function (t) {
                                            e(t.data)
                                        }, function (e) {
                                            n(e)
                                        }).catch(function (e) {
                                            n(e)
                                        })
                                    }
                                    ));
                            case 13:
                            case "end":
                                return e.stop()
                        }
                }, e, this)
            }));
            return function (t, n, r) {
                return e.apply(this, arguments)
            }
        }()
            , b = function () {
                var e = l()(o.a.mark(function e() {
                    var t;
                    return o.a.wrap(function (e) {
                        for (; ;)
                            switch (e.prev = e.next) {
                                case 0:
                                    if (!(t = "")) {
                                        e.next = 3;
                                        break
                                    }
                                    return e.abrupt("return", t);
                                case 3:
                                    return e.prev = 3,
                                        e.next = 6,
                                        labc(11);
                                case 6:
                                    t = e.sent,
                                        e.next = 12;
                                    break;
                                case 9:
                                    return e.prev = 9,
                                        e.t0 = e.catch(3),
                                        e.abrupt("return", "");
                                case 12:
                                    return e.abrupt("return", t);
                                case 13:
                                case "end":
                                    return e.stop()
                            }
                    }, e, w, [[3, 9]])
                }));
                return function () {
                    return e.apply(this, arguments)
                }
            }()
    },
    29: function (e, t, n) {
        "use strict";
        function r(e) {
            if ("" != e && null != e) {
                var t = new RegExp(/(\<img )([^>]*)(src=")([^"]*")([^>]*)(\>)/, "g")
                    , n = new RegExp(/(\<img )([^>]*)(_ewebeditor_pa_src=")([^"]*")([^>]*)(\>)/, "g");
                e = e.replace(n, function (e, t, n, r, i, a, o) {
                    return t + n + a + o
                }),
                    e = e.replace(t, function (e, t, n, r, i, a, o) {
                        return "" + t + n + 'data-src="' + i + a + o
                    });
                var r = new RegExp(/<(\w+)[^>]*>(.*?<\/\1>)?/, "g").test(e);
                return -1 != e.indexOf("title=") && r ? e.replace(/title=/g, "value=") : e
            }
            return ""
        }
        function i(e) {
            return !!e && (e instanceof HTMLElement && "IMG" === e.tagName)
        }
        function a(e) {
            var t = void 0 === e ? "undefined" : w()(e);
            return "function" == t ? X.call(ae, re.call(e)) : e && "object" == t && X.call(te, toString.call(e)) || !1
        }
        function o() {
            var e, t = {}, n = navigator.userAgent.toLowerCase();
            return (e = n.match(/rv:([\d.]+)\) like gecko/)) ? t.ie = e[1] : (e = n.match(/msie ([\d\.]+)/)) ? t.ie = e[1] : (e = n.match(/edge\/([\d\.]+)/)) ? t.edge = e[1] : (e = n.match(/firefox\/([\d\.]+)/)) ? t.firefox = e[1] : (e = n.match(/(?:opera|opr).([\d\.]+)/)) ? t.opera = e[1] : (e = n.match(/chrome\/([\d\.]+)/)) ? t.chrome = e[1] : (e = n.match(/version\/([\d\.]+).*safari/)) && (t.safari = e[1]),
                t.ie ? ["PC_ie", t.ie] : t.edge ? ["PC_edge", t.edge] : t.firefox ? ["PC_firefox", t.firefox] : t.chrome ? ["PC_chrome", t.chrome] : t.opera ? ["PC_opera", t.opera] : t.safari ? ["PC_safari", t.safari] : ["PC_other"]
        }
        function s() {
            var e, t = {}, n = navigator.userAgent.toLowerCase();
            return (e = n.match(/rv:([\d.]+)\) like gecko/)) ? t.ie = e[1] : (e = n.match(/msie ([\d\.]+)/)) ? t.ie = e[1] : (e = n.match(/(ubrowser|ucbrowser)\/([\d\.]+)/)) ? t.UCBrowser = e[1] : (e = n.match(/qqBrowser\/([\d\.]+)/)) ? t.QQBrowser = e[1] : (e = n.match(/qihu/)) ? t.QIHU = 360 : (e = n.match(/edge\/([\d\.]+)/)) ? t.edge = e[1] : (e = n.match(/firefox\/([\d\.]+)/)) ? t.firefox = e[1] : (e = n.match(/(?:opera|opr).([\d\.]+)/)) ? t.opera = e[1] : (e = n.match(/chrome\/([\d\.]+)/)) ? t.chrome = e[1] : (e = n.match(/version\/([\d\.]+).*safari/)) && (t.safari = e[1]),
                t.ie ? ["ie", t.ie] : t.edge ? ["edge", t.edge] : t.firefox ? ["firefox", t.firefox] : t.chrome ? ["chrome", t.chrome] : t.opera ? ["opera", t.opera] : t.safari ? ["safari", t.safari] : t.UCBrowser ? ["UCBrowser", t.UCBrowser] : t.QQBrowser ? ["QQBrowser", t.QQBrowser] : t.QIHU ? ["360", t.QIHU] : ["unknown"]
        }
        function u() {
            var e = {
                PC_edge: 79,
                PC_firefox: 63,
                PC_chrome: 53,
                PC_safari: 10,
                PC_opera: 40
            }
                , t = o()
                , n = v()(t, 2)
                , r = n[0]
                , i = n[1];
            if (r in e) {
                var a = p()(i);
                if (!f()(a) && a > e[r])
                    return !0
            }
        }
        function c() {
            return "function" == typeof document.body.attachShadow || u()
        }
        function l() {
            return a(window.XMLHttpRequest) && a(window.XMLHttpRequest.prototype.open) && (!E.a.state.globalProperty.supportShadom || a(document.body.attachShadow)) && !window.OCS && a(JSON.parse) && a(document.getSelection) && a(window.getSelection) && a(window.prototype.call) && a(window.prototype.apply) && a(window.prototype.bind)
        }
        function d(e, t) {
            return '<pre class="code-block-wrapper"><code class="hljs code-block-body ' + t + '">' + e + "</code></pre>"
        }
        n.d(t, "E", function () {
            return k
        }),
            n.d(t, "D", function () {
                return A
            }),
            n.d(t, "k", function () {
                return T
            }),
            n.d(t, "b", function () {
                return R
            }),
            n.d(t, "l", function () {
                return N
            }),
            n.d(t, "u", function () {
                return P
            }),
            n.d(t, "B", function () {
                return U
            }),
            n.d(t, "h", function () {
                return z
            }),
            n.d(t, "C", function () {
                return M
            }),
            n.d(t, "j", function () {
                return L
            }),
            n.d(t, "z", function () {
                return O
            }),
            n.d(t, "q", function () {
                return B
            }),
            n.d(t, "r", function () {
                return $
            }),
            n.d(t, "y", function () {
                return j
            }),
            n.d(t, "f", function () {
                return F
            }),
            n.d(t, "t", function () {
                return H
            }),
            n.d(t, "A", function () {
                return D
            }),
            n.d(t, "d", function () {
                return q
            }),
            n.d(t, "c", function () {
                return Q
            }),
            n.d(t, "v", function () {
                return W
            }),
            t.w = r,
            t.x = i,
            n.d(t, "m", function () {
                return K
            }),
            n.d(t, "p", function () {
                return V
            }),
            n.d(t, "e", function () {
                return J
            }),
            t.o = o,
            t.F = s,
            t.a = c,
            t.n = l,
            n.d(t, "s", function () {
                return oe
            }),
            t.i = d,
            n.d(t, "g", function () {
                return se
            });
        var m = n(420)
            , f = n.n(m)
            , h = n(421)
            , p = n.n(h)
            , g = n(354)
            , v = n.n(g)
            , _ = n(69)
            , w = n.n(_)
            , x = n(68)
            , b = n.n(x)
            , C = n(83)
            , y = n.n(C)
            , I = n(478)
            , S = n.n(I)
            , E = n(249)
            , k = function (e, t) {
                /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
                var n = {
                    "M+": e.getMonth() + 1,
                    "d+": e.getDate(),
                    "h+": e.getHours(),
                    "m+": e.getMinutes(),
                    "s+": e.getSeconds()
                };
                for (var r in n)
                    if (new RegExp("(" + r + ")").test(t)) {
                        var i = n[r] + "";
                        t = t.replace(RegExp.$1, 1 === RegExp.$1.length ? i : function (e) {
                            return ("00" + e).substr(e.length)
                        }(i))
                    }
                return t
            }
            , A = function (e) {
                switch (!0) {
                    case 0 == e:
                        return "progressbar_00";
                    case e <= 10 && e > 0:
                        return "progressbar_10";
                    case e <= 20 && e > 10:
                        return "progressbar_20";
                    case e <= 30 && e > 20:
                        return "progressbar_30";
                    case e <= 40 && e > 30:
                        return "progressbar_40";
                    case e <= 50 && e > 40:
                        return "progressbar_50";
                    case e <= 60 && e > 50:
                        return "progressbar_60";
                    case e <= 70 && e > 60:
                        return "progressbar_70";
                    case e <= 80 && e > 70:
                        return "progressbar_80";
                    case e <= 90 && e > 80:
                        return "progressbar_90";
                    case e < 100 && e >= 95:
                        return "progressbar_95";
                    case 100 == e:
                        return "progressbar_100"
                }
            }
            , T = function (e, t) {
                var n = parseInt(e / 864e5)
                    , r = parseInt(e % 864e5 / 36e5)
                    , i = parseInt(e % 36e5 / 6e4)
                    , a = e % 6e4 / 1e3;
                if (r < 10 && (r = "0" + r),
                    i < 10 && (i = "0" + i),
                    a < 10 && (a = "0" + a),
                    0 == t) {
                    if (0 == n)
                        return {
                            time: r + ":" + i,
                            flag: !1,
                            type: t
                        };
                    if (0 != n)
                        return {
                            time: n + "天" + r + "时" + i + "分",
                            flag: !0,
                            type: t
                        }
                } else if (1 == t)
                    return r <= 0 ? {
                        time: i + ":" + a,
                        type: t
                    } : {
                        time: Number(60 * r) + Number(i) + ":" + a,
                        type: t
                    }
            }
            , R = function (e) {
                if (document.cookie.length > 0) {
                    var t = document.cookie.indexOf(e + "=");
                    if (-1 != t) {
                        t = t + e.length + 1;
                        var n = document.cookie.indexOf(";", t);
                        return -1 == n && (n = document.cookie.length),
                            decodeURIComponent(document.cookie.substring(t, n))
                    }
                }
                return ""
            }
            , N = function (e, t, n) {
                var r = new Date
                    , i = n || 3;
                r.setTime(r.getTime() + 24 * i * 60 * 60 * 1e3),
                    document.cookie = e + "=" + t + ";expires=" + r.toGMTString() + ";path=/"
            }
            , P = function (e) {
                if (document.cookie.length > 0) {
                    var t = document.cookie.indexOf(e + "=");
                    if (-1 != t) {
                        t = t + e.length + 1;
                        var n = document.cookie.indexOf(";", t);
                        return -1 == n && (n = document.cookie.length),
                            unescape(document.cookie.substring(t, n))
                    }
                }
                return ""
            }
            , U = function (e, t, n) {
                var r = new Date;
                n = n || 3,
                    r.setDate(r.getDate() + n),
                    document.cookie = e + "=" + escape(t) + (null == n ? "" : ";expires=" + r.toGMTString())
            }
            , z = function (e) {
                return String.fromCharCode(64 + parseInt(e))
            }
            , M = function (e) {
                return null == e && (e = ""),
                    e = e.substring(0, 19),
                    e = e.replace(/-/g, "/"),
                    new Date(e).getTime()
            }
            , L = function (e) {
                return e = e.toLowerCase(),
                    "mp4" == e || "flv" == e || "wmv" == e || "avi" == e || "dat" == e || "asf" == e || "rm" == e || "rmvb" == e || "ram" == e || "mpg" == e || "mpeg" == e || "3gp" == e || "mov" == e || "m4v" == e || "dvix" == e || "dv" == e || "mkv" == e || "flv" == e || "vob" == e || "qt" == e || "divx" == e || "cpk" == e || "fli" == e || "flc" == e || "mod" == e ? 1 : "doc" == e || "docx" == e || "xls" == e || "xlsx" == e || "pdf" == e || "txt" == e || "ppt" == e || "pptx" == e ? 2 : "jpg" == e || "gif" == e || "bmp" == e || "png" == e || "jpeg" == e ? 3 : "mp3" == e ? 4 : -1
            }
            , O = function (e, t) {
                return !!window.localStorage && localStorage.setItem(e, t)
            }
            , B = function (e) {
                return !!window.localStorage && localStorage.getItem(e)
            }
            , $ = function (e) {
                return !!window.localStorage && (console.log("removeLocalStorage success", localStorage.removeItem(e)),
                    localStorage.removeItem(e))
            }
            , j = function (e, t, n) {
                var r = JSON.parse(t)
                    , i = !1;
                console.log(r, "当前值");
                for (var a in r)
                    if (e.eid == r[a].eid) {
                        r[a] = e,
                            i = !0;
                        break
                    }
                return 0 == i && (r = [e]),
                    console.log(r, "合并后的arrJson"),
                    y()(r)
            }
            , F = function (e, t) {
                e.url && window.open(e.url)
            }
            , H = function (e) {
                var t = S.a.enc.Utf8.parse("86cc793c53dc851b")
                    , n = S.a.enc.Utf8.parse(e);
                return S.a.AES.encrypt(n, t, {
                    mode: S.a.mode.ECB,
                    padding: S.a.pad.Pkcs7
                }).toString()
            }
            , D = function (e) {
                var t = S.a.enc.Utf8.parse("86cc793c53dc851b")
                    , n = S.a.AES.decrypt(e, t, {
                        mode: S.a.mode.ECB,
                        padding: S.a.pad.Pkcs7
                    });
                return S.a.enc.Utf8.stringify(n).toString()
            }
            , q = function () {
                return E.a.state.key ? E.a.state.key : E.a.dispatch("getKey")
            }
            , Q = function () {
                return E.a.state.key ? E.a.state.key : E.a.dispatch("getExamKey")
            }
            , G = function () {
                var e = !1;
                try {
                    var t = Object.defineProperty({}, "passive", {
                        get: function () {
                            e = !0
                        }
                    });
                    window.addEventListener("test", null, t)
                } catch (e) { }
                return e
            }()
            , W = {
                on: function (e, t, n) {
                    var r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    G ? e.addEventListener(t, n, {
                        capture: r,
                        passive: !0
                    }) : e.addEventListener(t, n, r)
                },
                off: function (e, t, n) {
                    var r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    e.removeEventListener(t, n, r)
                }
            }
            , K = function (e, t) {
                var n = [e, t]
                    , r = 0
                    , i = function () {
                        var e = document.getElementsByClassName("yidun_icon-close");
                        e.length && (e[0].style.visibility = "hidden")
                    };
                if (window.initAbleYidunFallback)
                    return new b.a(function (e) {
                        if (!document.getElementById("captchaYidun")) {
                            var t = document.createElement("div");
                            t.setAttribute("id", "captchaYidun"),
                                document.body.appendChild(t)
                        }
                        window.initAbleYidunFallback({
                            showPop: !0,
                            capType: "space",
                            onSuccessAble: function (e, t, r) {
                                n[0](e, t)
                            },
                            onErrorAble: function (e, t, i) {
                                r += 1,
                                    n[1](e, t, i, r)
                            },
                            onCloseAble: function () { },
                            enableClose: 1,
                            captchaIns: function (t, n) {
                                t.removeCloseTag = i,
                                    t.notHaveCloseTagPopup = function () {
                                        t.popUp(),
                                            t.removeCloseTag()
                                    }
                                    ,
                                    e({
                                        instance: t,
                                        logFn: new n
                                    })
                            }
                        })
                    }
                    )
            }
            , V = function (e, t, n, r, i, a) {
                var o = r.module
                    , s = void 0 === o ? 2 : o
                    , u = r.courseId
                    , c = void 0 === u ? null : u
                    , l = r.recruitId;
                return {
                    appType: e,
                    appPlatform: "PC",
                    table: "TBL_SLIDING_VALIDATION",
                    data: [{
                        uuid: t,
                        ctimes: n,
                        module: s,
                        courseId: c,
                        recruitId: void 0 === l ? null : l,
                        errorCode: i,
                        errorMsg: a
                    }]
                }
            }
            , J = function (e) {
                return window.location.href.includes("/doexamination") && e.includes("studentExam/gateway/t/v1/answer/saveStudentAnswer")
            }
            , Y = window.originFunction
            , X = Y.RegExpTest
            , Z = Y.FunctionToString
            , ee = /[\\^$.*+?()[\]{}|]/g
            , te = /^\[object .+?Constructor\]$/
            , ne = (Function.prototype,
                Object.prototype)
            , re = Z
            , ie = ne.hasOwnProperty
            , ae = RegExp("^" + re.call(ie).replace(ee, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$")
            , oe = function (e, t) {
                return !!e && (!!e.response && e.response.status == t)
            }
            , se = function (e) {
                var t = Math.floor(e / 3600)
                    , n = Math.floor((e - 3600 * t) / 60)
                    , r = e - 3600 * t - 60 * n;
                return t ? String(t).padStart(2, "0") + ":" + String(n).padStart(2, "0") + ":" + String(r).padStart(2, "0") : String(n).padStart(2, "0") + ":" + String(r).padStart(2, "0")
            }
    },
    314: function (e, t, n) {
        function r(e) {
            n(523)
        }
        var i = n(11)(n(415), n(547), r, null, null);
        e.exports = i.exports
    },
    319: function (e, t, n) {
        "use strict";
        var r = n(5)
            , i = n(248)
            , a = n(403)
            , o = n(353);
        r.default.use(i.a),
            r.default.prototype.GLOBAL_PUBLIC = a.a;
        var s = new i.a({
            base: "/",
            scrollBehavior: function (e, t, n) {
                return n || {
                    x: 0,
                    y: 0
                }
            },
            routes: [{
                path: "/demo2",
                name: "demo2",
                component: function (e) {
                    return n.e(10).then(function () {
                        var t = [n(563)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                },
                meta: {
                    keepAlive: !0
                }
            }, {
                path: "/demo",
                name: "demo",
                component: function (e) {
                    return n.e(11).then(function () {
                        var t = [n(562)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                },
                meta: {
                    keepAlive: !0
                }
            }, {
                path: "/webExamList",
                name: "webExanList",
                component: function (e) {
                    return n.e(9).then(function () {
                        var t = [n(568)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                }
            }, {
                path: "/webExamList/dohomework/:recruitId/:stuExamId/:examId/:courseId/:schoolId/:meetCourseType",
                name: "doHomework",
                component: function (e) {
                    return n.e(1).then(function () {
                        var t = [n(567)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                },
                meta: {
                    keepAlive: !0
                }
            }, {
                path: "/webExamList/doexamination/:recruitId/:stuExamId/:examId/:courseId/:schoolId",
                name: "doExamination",
                component: function (e) {
                    return n.e(5).then(function () {
                        var t = [n(566)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                }
            }, {
                path: "/webExamList/computerExamination/:recruitId/:stuExamId/:examId/:courseId/:schoolId/:uuid",
                name: "computerExamination",
                component: function (e) {
                    return n.e(8).then(function () {
                        var t = [n(565)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                },
                meta: {
                    keepAlive: !0
                }
            }, {
                path: "/webExamList/checkHomework/:recruitId/:stuExamId/:examId/:courseId/:schoolId",
                name: "checkHomework",
                component: function (e) {
                    return n.e(0).then(function () {
                        var t = [n(564)];
                        e.apply(null, t)
                    }
                        .bind(this)).catch(n.oe)
                },
                meta: {
                    keepAlive: !0
                }
            }]
        });
        s.afterEach(function (e, t) {
            var r = n.i(o.a)(e.name);
            if (r) {
                var i = r.getRouteInfo(e);
                n.i(o.b)(i)
            }
        }),
            t.a = s
    },
    323: function (e, t) { },
    324: function (e, t) { },
    334: function (e, t, n) {
        var r = n(11)(n(413), n(543), null, null, null);
        e.exports = r.exports
    },
    335: function (e, t, n) {
        function r(e) {
            n(522)
        }
        var i = n(11)(n(414), n(546), r, null, null);
        e.exports = i.exports
    },
    336: function (e, t, n) {
        function r(e) {
            n(521)
        }
        var i = n(11)(n(417), n(545), r, "data-v-2d11d6bc", null);
        e.exports = i.exports
    },
    337: function (e, t, n) {
        function r(e) {
            n(527)
        }
        var i = n(11)(n(418), n(552), r, null, null);
        e.exports = i.exports
    },
    353: function (e, t, n) {
        "use strict";
        function r(e) {
            var t = decodeURIComponent(e.query.recruitId);
            return t = e.query.eid ? e.query.eid : n.i(d.A)(t)
        }
        function i(e) {
            var t = n.i(d.F)()[0];
            return l()({
                clientType: "PC",
                deviceNumber: t,
                data: [u()({
                    time: Date.now()
                }, e)]
            })
        }
        function a(e) {
            return f.find(function (t) {
                return t.name == e
            })
        }
        function o(e) {
            var t = encodeURIComponent(i(e));
            n.i(m.a)("https://buried-point.zhihuishu.com/gateway/t/buriedPoint/common?content=" + t, {}, 2)
        }
        t.a = a,
            t.b = o;
        var s = n(85)
            , u = n.n(s)
            , c = n(83)
            , l = n.n(c)
            , d = n(29)
            , m = n(266)
            , f = [{
                name: "webExanList",
                getRouteInfo: function (e) {
                    return {
                        bizId: "100003",
                        recruitId: r(e)
                    }
                }
            }, {
                name: "doHomework",
                getRouteInfo: function (e) {
                    var t = e.params;
                    return {
                        bizId: "100004",
                        recruitId: t.recruitId,
                        stuExamId: t.stuExamId,
                        examId: t.examId,
                        courseId: t.courseId
                    }
                }
            }, {
                name: "doExamination",
                getRouteInfo: function (e) {
                    var t = e.params;
                    return {
                        bizId: "100004",
                        recruitId: t.recruitId,
                        stuExamId: t.stuExamId,
                        examId: t.examId,
                        courseId: t.courseId
                    }
                }
            }]
    },
    402: function (e, t, n) {
        "use strict";
        var r = {
            _a: "AgrcepndtslzyohCia0uS@",
            _b: "A0ilndhga@usreztoSCpyc",
            _c: "d0@yorAtlhzSCeunpcagis",
            _d: "zzpttjd",
            X: function (e) {
                for (var t = "", n = 0; n < e[this._c[8] + this._a[4] + this._c[15] + this._a[1] + this._a[8] + this._b[6]]; n++) {
                    var r = e[this._a[3] + this._a[14] + this._c[18] + this._a[2] + this._b[18] + this._b[16] + this._c[0] + this._a[4] + this._b[0] + this._b[15]](n) ^ this._d[this._b[21] + this._b[6] + this._a[17] + this._c[5] + this._b[18] + this._c[4] + this._a[7] + this._a[4] + this._a[0] + this._c[7]](n % this._d[this._a[10] + this._b[13] + this._b[4] + this._a[1] + this._c[7] + this._a[14]]);
                    t += this.Y(r)
                }
                return t
            },
            Y: function (e) {
                var t = e[this._c[7] + this._a[13] + this._a[20] + this._b[15] + this._a[2] + this._b[2] + this._c[15] + this._c[19]](16);
                return t = t[this._b[3] + this._a[4] + this._b[4] + this._a[1] + this._c[7] + this._c[9]] < 2 ? this._b[1] + t : t,
                    t[this._a[9] + this._b[3] + this._c[20] + this._c[17] + this._c[13]](-4)
            },
            Z: function (e) {
                for (var t = "", n = 0; n < e.length; n++)
                    t += e[n] + ";";
                return t = t.substring(0, t.length - 1),
                    this.X(t)
            }
        };
        t.a = r
    },
    403: function (e, t, n) {
        "use strict";
        t.a = {
            OPEN_SCHOOL_ID: 6729
        }
    },
    404: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(178)
            , i = (n.n(r),
                n(179))
            , a = (n.n(i),
                n(184))
            , o = (n.n(a),
                n(187))
            , s = (n.n(o),
                n(188))
            , u = (n.n(s),
                n(182))
            , c = (n.n(u),
                n(185))
            , l = (n.n(c),
                n(183))
            , d = (n.n(l),
                n(186))
            , m = (n.n(d),
                n(180))
            , f = (n.n(m),
                n(181))
            , h = (n.n(f),
                n(112))
            , p = (n.n(h),
                n(169))
            , g = (n.n(p),
                n(189))
            , v = (n.n(g),
                n(190))
            , _ = (n.n(v),
                n(151))
            , w = (n.n(_),
                n(152))
            , x = (n.n(w),
                n(153))
            , b = (n.n(x),
                n(154))
            , C = (n.n(b),
                n(157))
            , y = (n.n(C),
                n(155))
            , I = (n.n(y),
                n(156))
            , S = (n.n(I),
                n(158))
            , E = (n.n(S),
                n(159))
            , k = (n.n(E),
                n(160))
            , A = (n.n(k),
                n(161))
            , T = (n.n(A),
                n(163))
            , R = (n.n(T),
                n(162))
            , N = (n.n(R),
                n(150))
            , P = (n.n(N),
                n(177))
            , U = (n.n(P),
                n(138))
            , z = (n.n(U),
                n(148))
            , M = (n.n(z),
                n(147))
            , L = (n.n(M),
                n(143))
            , O = (n.n(L),
                n(144))
            , B = (n.n(O),
                n(142))
            , $ = (n.n(B),
                n(139))
            , j = (n.n($),
                n(141))
            , F = (n.n(j),
                n(146))
            , H = (n.n(F),
                n(140))
            , D = (n.n(H),
                n(137))
            , q = (n.n(D),
                n(145))
            , Q = (n.n(q),
                n(149))
            , G = (n.n(Q),
                n(111))
            , W = (n.n(G),
                n(174))
            , K = (n.n(W),
                n(172))
            , V = (n.n(K),
                n(170))
            , J = (n.n(V),
                n(175))
            , Y = (n.n(J),
                n(176))
            , X = (n.n(Y),
                n(171))
            , Z = (n.n(X),
                n(173))
            , ee = (n.n(Z),
                n(164))
            , te = (n.n(ee),
                n(165))
            , ne = (n.n(te),
                n(166))
            , re = (n.n(ne),
                n(168))
            , ie = (n.n(re),
                n(167))
            , ae = (n.n(ie),
                n(109))
            , oe = (n.n(ae),
                n(110))
            , se = (n.n(oe),
                n(105))
            , ue = (n.n(se),
                n(108))
            , ce = (n.n(ue),
                n(107))
            , le = (n.n(ce),
                n(106))
            , de = (n.n(le),
                n(64))
            , me = (n.n(de),
                n(131))
            , fe = (n.n(me),
                n(132))
            , he = (n.n(fe),
                n(134))
            , pe = (n.n(he),
                n(133))
            , ge = (n.n(pe),
                n(130))
            , ve = (n.n(ge),
                n(136))
            , _e = (n.n(ve),
                n(135))
            , we = (n.n(_e),
                n(113))
            , xe = (n.n(we),
                n(114))
            , be = (n.n(xe),
                n(115))
            , Ce = (n.n(be),
                n(116))
            , ye = (n.n(Ce),
                n(117))
            , Ie = (n.n(ye),
                n(118))
            , Se = (n.n(Ie),
                n(119))
            , Ee = (n.n(Se),
                n(120))
            , ke = (n.n(Ee),
                n(121))
            , Ae = (n.n(ke),
                n(122))
            , Te = (n.n(Ae),
                n(124))
            , Re = (n.n(Te),
                n(123))
            , Ne = (n.n(Re),
                n(125))
            , Pe = (n.n(Ne),
                n(126))
            , Ue = (n.n(Pe),
                n(127))
            , ze = (n.n(Ue),
                n(128))
            , Me = (n.n(ze),
                n(129))
            , Le = (n.n(Me),
                n(191))
            , Oe = (n.n(Le),
                n(194))
            , Be = (n.n(Oe),
                n(192))
            , $e = (n.n(Be),
                n(193))
            , je = (n.n($e),
                n(196))
            , Fe = (n.n(je),
                n(195))
            , He = (n.n(Fe),
                n(199))
            , De = (n.n(He),
                n(198))
            , qe = (n.n(De),
                n(197))
            , Qe = (n.n(qe),
                n(82))
            , Ge = (n.n(Qe),
                n(5))
            , We = n(334)
            , Ke = n.n(We)
            , Ve = n(319)
            , Je = n(249)
            , Ye = n(36)
            , Xe = (n.n(Ye),
                n(315))
            , Ze = n.n(Xe)
            , et = n(338)
            , tt = n.n(et)
            , nt = n(79)
            , rt = (n.n(nt),
                n(259))
            , it = n.n(rt)
            , at = n(314)
            , ot = n.n(at)
            , st = n(335)
            , ut = n.n(st)
            , ct = n(336)
            , lt = n.n(ct)
            , dt = n(337)
            , mt = n.n(dt)
            , ft = n(324)
            , ht = (n.n(ft),
                n(323))
            , pt = (n.n(ht),
                n(200))
            , gt = n.n(pt)
            , vt = n(78)
            , _t = n.n(vt)
            , wt = n(80)
            , xt = (n.n(wt),
                n(201))
            , bt = n.n(xt)
            , Ct = n(202)
            , yt = n.n(Ct)
            , It = n(81)
            , St = (n.n(It),
                n(326))
            , Et = n(29);
        Ge.default.use(tt.a),
            Ge.default.use(Ze.a),
            gt.a.polyfill(),
            Ge.default.use(Ye.Tooltip),
            Ge.default.use(Ye.Dialog),
            Ge.default.use(Ye.Collapse),
            Ge.default.use(Ye.CollapseItem),
            Ge.default.use(Ye.Loading.directive),
            Ge.default.use(_t.a),
            Ge.default.use(bt.a),
            Ge.default.use(yt.a),
            Ge.default.prototype.$loading = Ye.Loading.service,
            Ge.default.prototype.$message = Ye.Message,
            Ge.default.prototype.$alert = Ye.MessageBox.alert,
            Ge.default.prototype.$confirm = Ye.MessageBox.confirm,
            Ge.default.use(St.a),
            Ge.default.config.productionTip = !1,
            Ge.default.component("my-menu", {
                template: "<MyMenu/>",
                components: {
                    MyMenu: it.a
                }
            }),
            Ge.default.component("my-left", {
                template: "<MyLeft/>",
                components: {
                    MyLeft: ot.a
                }
            }),
            Ge.default.component("my-schoolBanner", {
                template: "<MySchoolBanner/>",
                components: {
                    MySchoolBanner: mt.a
                }
            }),
            Ge.default.component("my-footer", {
                template: "<MyFooter/>",
                components: {
                    MyFooter: ut.a
                }
            }),
            Ge.default.component("my-service", {
                template: "<MyService/>",
                components: {
                    MyService: lt.a
                }
            }),
            new Ge.default({
                el: "#app",
                router: Ve.a,
                store: Je.a,
                template: "<App />",
                components: {
                    App: Ke.a
                }
            }),
            Je.a.commit("setEnableGlobal", {
                originFunction: document.body.attachShadow,
                supportShadom: n.i(Et.a)()
            }),
            Ge.default.prototype.goBack = function () {
                history.pushState(null, null, document.URL)
            }
    },
    413: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(66);
        t.default = {
            name: "app",
            data: function () {
                return {
                    isLogin: !1
                }
            },
            created: function () {
                this.IEVersion() && (window.location.href = "//www.zhihuishu.com/updateBrowser.html");
                "https:" != window.location.protocol && (window.location.href = "https:" + window.location.href.substring(window.location.protocol.length))
            },
            mounted: function () {
                this.getUserMessage()
            },
            methods: {
                getUserMessage: function () {
                    var e = this;
                    r.a.getUserMessage({
                        time: new Date
                    }).then(function (t) {
                        console.log(t.rt.loginstatus),
                            0 == t.rt.loginstatus ? window.location.href = "//studentexam-api.zhihuishu.com/studentExam/gateway/f/v1/gologin/login?fromurl=" + encodeURIComponent(window.location.href) : r.a.getUserMessageExam({
                                time: new Date
                            }).then(function (t) {
                                if (0 == t.rt.loginstatus)
                                    window.location.href = "//taurusexam-api.zhihuishu.com/taurusExam/gateway/f/v1/gologin/login?fromurl=" + encodeURIComponent(window.location.href);
                                else {
                                    var n = t.rt;
                                    e.isLogin = !0,
                                        e.$store.commit("getUserInfo", n)
                                }
                            })
                    })
                },
                IEVersion: function () {
                    return "Microsoft Internet Explorer" == navigator.appName && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) <= 9
                }
            }
        }
    },
    414: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
            t.default = {
                data: function () {
                    return {
                        showBack: !1
                    }
                },
                mounted: function () {
                    window.addEventListener("scroll", this.handleScroll)
                },
                methods: {
                    handleScroll: function () {
                        var e = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                        this.showBack = e > 200
                    },
                    backTop: function () {
                        var e = document.documentElement.scrollTop || document.body.scrollTop
                            , t = e / 30;
                        !function n() {
                            e > 0 && (e -= t,
                                window.scrollTo(0, e),
                                setTimeout(n, 10))
                        }()
                    }
                }
            }
    },
    415: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(66);
        n(29);
        t.default = {
            data: function () {
                return {
                    navIsOpen: !1,
                    isShowAppCode: !1,
                    appCodePositionX: 0,
                    userName: "",
                    userAuthReal: "",
                    isAppUser: "",
                    examTipCount: 0,
                    unCorrectTaskCount: 0,
                    redDotTip: "",
                    surveyTipCount: 0
                }
            },
            created: function () {
                this.getUserAuthReal(),
                    this.getUserAuthUseApp(),
                    this.getExamTipCount(),
                    this.getSurveyUndoCount()
            },
            computed: {
                getUserName: function () {
                    return this.$store.state.userName
                },
                getUserHeader: function () {
                    return this.$store.state.userHeader
                }
            },
            methods: {
                toggleNav: function () {
                    this.navIsOpen = !this.navIsOpen
                },
                showAppCode: function (e) {
                    this.isShowAppCode = !0
                },
                hideAppCode: function () {
                    this.isShowAppCode = !1
                },
                getUserAuthReal: function () {
                    var e = this;
                    r.a.getUserAuthReal({}).then(function (t) {
                        200 == t.status && (e.userAuthReal = t.rt,
                            console.log(e.userAuthReal, "this.userAuthReal"))
                    })
                },
                getUserAuthUseApp: function () {
                    var e = this;
                    r.a.getUserAuthUseApp({}).then(function (t) {
                        200 == t.status && (e.isAppUser = t.rt)
                    })
                },
                getExamTipCount: function () {
                    var e = this;
                    r.a.getExamTipCount({}).then(function (t) {
                        e.examTipCount = t.rt,
                            "" != t.rt && "underfined" != t.rt && null != t.rt && (e.redDotTip = "您分配有" + e.examTipCount + "个补考，请完成并上交！")
                    })
                },
                getSurveyUndoCount: function () {
                    var e = this;
                    r.a.getSurveyUndoCount({}).then(function (t) {
                        200 == t.status && (e.surveyTipCount = t.rt,
                            console.log(e.surveyTipCount, "surveyTipCount"))
                    })
                }
            }
        }
    },
    416: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(66)
            , i = n(29);
        t.default = {
            data: function () {
                return {
                    basePath: "",
                    searchKey: "",
                    isShowMyuni: 0,
                    isShowMyinst: 0,
                    isShowMyCu: 0,
                    userId: "",
                    noticeNum: "",
                    courseName: ""
                }
            },
            created: function () {
                this.basePath = "//studentexam-api.zhihuishu.com";
                var e = n.i(i.b)("CASLOGC");
                this.isShowMyuni = e ? JSON.parse(e).myuniRole : "",
                    this.isShowMyinst = e ? JSON.parse(e).myinstRole : "",
                    this.isShowMyCu = e ? JSON.parse(e).mycuRole : "",
                    this.userId = e ? JSON.parse(e).userId : "";
                var t = this
                    , r = {
                        menuPointer: t
                    };
                this.$store.commit("setArrTest", r),
                    this.getUserNotice()
            },
            mounted: function () {
                this.getCourseName()
            },
            computed: {
                getUserName: function () {
                    return this.$store.state.userName
                },
                getUserHeader: function () {
                    return this.$store.state.userHeader
                }
            },
            methods: {
                getUserNotice: function () {
                    var e = this;
                    $.ajax({
                        dataType: "jsonp",
                        jsonpCallback: "messageNum",
                        url: "//message.zhihuishu.com/msgcenter/findMsgCnt?userId=" + this.userId,
                        success: function (t) {
                            e.noticeNum = t.rt
                        }
                    })
                },
                getCourseName: function () {
                    var e = this
                        , t = this.$route.query.recruitId || this.$route.params.recruitId
                        , a = this.$route.query.eid;
                    isNaN(t) && (t = a || n.i(i.A)(decodeURIComponent(t))),
                        r.a.getCourseNameByRecruitId({
                            recruitId: t
                        }).then(function (t) {
                            200 == t.status && (e.courseName = t.rt)
                        })
                },
                logout: function () {
                    window.location.href = "https://www.zhihuishu.com/logout.html"
                }
            }
        }
    },
    417: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = (n(66),
            n(36))
            , i = (n.n(r),
                n(29));
        t.default = {
            components: {},
            props: ["customize", "state"],
            data: function () {
                return {
                    number: 0,
                    userId: ""
                }
            },
            created: function () {
                this.getUserNotice();
                var e = n.i(i.b)("CASLOGC");
                this.userId = e ? JSON.parse(e).userId : ""
            },
            methods: {
                goList: function () {
                    window.location.href = "//onlineh5.zhihuishu.com/onlineWeb.html#/student/noticeCenter?noticeType=0"
                },
                goBack: function () {
                    window.location.href = "//stuonline.zhihuishu.com/stuonline/student/index"
                },
                goTopScroll: function () {
                    $("body,html").animate({
                        scrollTop: 0
                    }, 100)
                },
                getUserNotice: function () {
                    var e = this;
                    $.ajax({
                        dataType: "jsonp",
                        jsonpCallback: "messageNum",
                        url: "//message.zhihuishu.com/msgcenter/findMsgCnt?userId=" + this.userId,
                        success: function (t) {
                            e.number = t.rt
                        }
                    })
                }
            }
        }
    },
    418: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(66)
            , i = n(29);
        t.default = {
            data: function () {
                return {
                    bannerBgColor: "",
                    bannerSrc: "",
                    schoolHomeUrl: "",
                    showCertifyBtn: !1,
                    curRecruitId: ""
                }
            },
            created: function () {
                this.curRecruitId = decodeURIComponent(this.$route.query.recruitId);
                var e = this.$route.query.eid;
                this.curRecruitId = e || n.i(i.A)(this.curRecruitId),
                    this.checkIsPublicCourse()
            },
            methods: {
                getLoginSchoolInfo: function () {
                    var e = this;
                    r.a.getLoginSchoolInfo({}).then(function (t) {
                        200 == t.status && (null == t.rt ? e.showCertifyBtn = !0 : (e.bannerBgColor = t.rt.background,
                            e.bannerSrc = t.rt.bannerPath,
                            e.schoolHomeUrl = t.rt.schoolPageUrl,
                            e.$store.commit("getSchoolInfo", t.rt)))
                    })
                },
                checkIsPublicCourse: function () {
                    var e = this;
                    r.a.checkIsPublicCourse({
                        recruitId: this.curRecruitId
                    }).then(function (t) {
                        if (200 == t.status)
                            if (t.rt.isPublicCourse) {
                                var n = {
                                    schoolId: e.GLOBAL_PUBLIC.OPEN_SCHOOL_ID
                                };
                                e.$store.commit("getSchoolInfo", n)
                            } else
                                e.getLoginSchoolInfo()
                    })
                }
            }
        }
    },
    521: function (e, t) { },
    522: function (e, t) { },
    523: function (e, t) { },
    524: function (e, t) { },
    527: function (e, t) { },
    543: function (e, t) {
        e.exports = {
            render: function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    attrs: {
                        id: "app"
                    }
                }, [n("keep-alive", [e.$route.meta.keepAlive && e.isLogin ? n("router-view") : e._e()], 1), e._v(" "), !e.$route.meta.keepAlive && e.isLogin ? n("router-view") : e._e()], 1)
            },
            staticRenderFns: []
        }
    },
    545: function (e, t) {
        e.exports = {
            render: function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", [n("div", {
                    staticClass: "rightFix"
                }, [n("div", {
                    staticClass: "message",
                    on: {
                        click: e.goList
                    }
                }, [n("img", {
                    attrs: {
                        src: "//image.zhihuishu.com/zhs_yufa_150820/ablecommons/demo/201905/bea6985e2e4a45f7be6693dc6052463a.png"
                    }
                }), e._v(" "), e.number > 0 ? n("div", {
                    staticClass: "messageFont",
                    class: e.number - 99 > 0 ? "moreNumber" : ""
                }, [e._v(e._s(e.number - 99 > 0 ? "..." : e.number))]) : e._e(), e._v(" "), n("span", [e._v("消息中心")]), e._v(" "), n("p")]), e._v(" "), e._m(0), e._v(" "), e._m(1), e._v(" "), e._m(2), e._v(" "), e._m(3), e._v(" "), n("div", {
                    staticClass: "message",
                    on: {
                        click: e.goTopScroll
                    }
                }, [n("img", {
                    attrs: {
                        src: "//image.zhihuishu.com/zhs_yufa_150820/ablecommons/demo/201905/4b9432ae6da0457e852c18e01dd287b0.png"
                    }
                }), e._v(" "), n("span", [e._v("TOP")])])])])
            },
            staticRenderFns: [function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    staticClass: "message js-service-support"
                }, [n("img", {
                    attrs: {
                        src: "//image.zhihuishu.com/zhs_yufa_150820/ablecommons/demo/201905/245933550fc74b3b93d1567ad4aed80f.png"
                    }
                }), e._v(" "), n("span", [e._v("客服")]), e._v(" "), n("p"), e._v(" "), n("div", {
                    staticClass: "hideKe"
                }, [n("div", {
                    staticClass: "font",
                    staticStyle: {
                        "margin-top": "10px"
                    }
                }, [e._v("智慧树在线客服")]), e._v(" "), n("div", {
                    staticClass: "font foWeint"
                }, [e._v("8:30-24:00")])])])
            }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("a", {
                        staticClass: "message",
                        attrs: {
                            href: "//www.zhihuishu.com/supportService-new/page/stu/index.html",
                            target: "_blank"
                        }
                    }, [n("img", {
                        attrs: {
                            src: "//image.zhihuishu.com/zhs_yufa_150820/ablecommons/demo/201905/3e9f4989fb654543ba157ddc17edc423.png"
                        }
                    }), e._v(" "), n("span", [e._v("服务中心")]), e._v(" "), n("p")])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("a", {
                        staticClass: "message",
                        attrs: {
                            href: "//www.zhihuishu.com/DownloadApp.html",
                            target: "_blank"
                        }
                    }, [n("img", {
                        attrs: {
                            src: "//image.zhihuishu.com/zhs_yufa_150820/ablecommons/demo/201905/080a26ea335b4f9b827257576551fc80.png"
                        }
                    }), e._v(" "), n("span", [e._v("APP")]), e._v(" "), n("p"), e._v(" "), n("div", {
                        staticClass: "hideMessageNew"
                    })])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("div", {
                        staticClass: "message"
                    }, [n("img", {
                        attrs: {
                            src: "//image.zhihuishu.com/zhs_yufa_150820/ablecommons/demo/201905/419b599f2aef4acda6f96cfa6df7786b.png"
                        }
                    }), e._v(" "), n("span", [e._v("公众号")]), e._v(" "), n("p"), e._v(" "), n("div", {
                        staticClass: "hideMessage"
                    })])
                }
            ]
        }
    },
    546: function (e, t) {
        e.exports = {
            render: function () {
                var e = this
                    , t = e.$createElement;
                e._self._c;
                return e._m(0)
            },
            staticRenderFns: [function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", [n("div", {
                    staticClass: "footerBox"
                }, [n("div", {
                    staticClass: "footerDetail"
                }, [n("div", {
                    staticClass: "copyright fmYh fl"
                }, [e._v("Copyright © 2003-现在 Zhihuishu. All rights reserved."), n("a", {
                    attrs: {
                        href: "https://www.zhihuishu.com/icp.html",
                        target: "_blank"
                    }
                }, [e._v("沪ICP备10007183号-5")])]), e._v(" "), n("div", {
                    staticClass: "cpLink fr"
                }, [n("a", {
                    staticClass: "fl left-line",
                    attrs: {
                        href: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010402003974",
                        target: "_blank"
                    }
                }, [n("i", {
                    staticClass: "gnr-icon"
                }), e._v("沪公网备31010402003974号\n                ")]), e._v(" "), n("a", {
                    staticClass: "fl left-line m-l-30",
                    attrs: {
                        href: "https://www.zhihuishu.com/businessLicense.html",
                        target: "_blank"
                    }
                }, [n("i", {
                    staticClass: "license-icon"
                }), e._v("电子营业执照\n                ")]), e._v(" "), n("a", {
                    staticClass: "protect-msg fl m-l-30",
                    attrs: {
                        href: "//www.zhihuishu.com/protect.html",
                        target: "_blank"
                    }
                }, [n("i", {
                    staticClass: "protect-link"
                })])])])])])
            }
            ]
        }
    },
    547: function (e, t) {
        e.exports = {
            render: function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    staticClass: "schoolLeft fl"
                }, [n("div", {
                    staticClass: "userInfoBox"
                }, [n("a", {
                    staticClass: "userHeader",
                    staticStyle: {
                        cursor: "default"
                    },
                    attrs: {
                        href: "javascript:void(0);",
                        title: e.getUserName
                    }
                }, [n("img", {
                    attrs: {
                        src: e.getUserHeader,
                        width: "110",
                        height: "100"
                    }
                })]), e._v(" "), n("span", {
                    staticClass: "userName",
                    staticStyle: {
                        cursor: "default"
                    }
                }, [n("span", {
                    staticClass: "userNameBox txtEllipsis",
                    attrs: {
                        title: e.getUserName
                    }
                }, [e._v(e._s(e.getUserName))]), e._v(" "), 1 == e.isAppUser ? n("span", {
                    staticClass: "appUserIco appUserIco_true",
                    attrs: {
                        title: "智慧树APP用户"
                    }
                }) : e._e(), e._v(" "), 0 == e.isAppUser ? n("span", {
                    staticClass: "appUserIco appUserIco_false",
                    on: {
                        mouseover: e.showAppCode,
                        mouseout: e.hideAppCode
                    }
                }, [n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.isShowAppCode,
                        expression: "isShowAppCode"
                    }],
                    staticClass: "indexCodeWrap animated fadeIn",
                    style: {
                        left: e.appCodePositionX
                    }
                }, [n("em"), e._v(" "), n("div", {
                    staticClass: "unAppUser"
                }, [e._v("您还不是智慧树APP用户，扫一扫二维码下载吧！")]), e._v(" "), e._m(0)])]) : e._e(), e._v(" "), n("a", {
                    staticClass: "verificationIcon",
                    class: e.userAuthReal > 0 ? "verificationIcon_true" : "verificationIcon_false",
                    attrs: {
                        href: "//user.zhihuishu.com/index.action#myLeague",
                        target: "_blank",
                        title: e.userAuthReal > 0 ? "实名认证成功" : "未实名认证"
                    }
                })]), e._v(" "), e._m(1)]), e._v(" "), n("div", {
                    staticClass: "sideNavBox clearfix"
                }, [n("ul", {
                    staticClass: "sideMenuList sideMenuList-stu menuItems",
                    style: {
                        height: e.navIsOpen ? "365px" : "272px"
                    }
                }, [e._m(2), e._v(" "), n("li", {
                    staticClass: "cur",
                    attrs: {
                        title: "作业考试",
                        menu_type: "student_exam"
                    }
                }, [n("a", {
                    staticClass: "taskexam_ico txtEllipsis",
                    attrs: {
                        href: "//examh5.zhihuishu.com/stuExamWeb.html#/webExamList/"
                    }
                }, [e._v("作业考试"), n("span", {
                    attrs: {
                        id: "examLeftTitle"
                    }
                }, [0 != e.examTipCount || 0 != e.unCorrectTaskCount ? n("span", {
                    staticClass: "subBox subBox-exam"
                }, [n("label", {
                    staticClass: "subBox_count",
                    attrs: {
                        id: "undoExamCount",
                        title: e.redDotTip
                    }
                }, [e._v(e._s(e.examTipCount + e.unCorrectTaskCount))])]) : e._e()])])]), e._v(" "), e._m(3), e._v(" "), e._m(4), e._v(" "), e._m(5), e._v(" "), e._m(6), e._v(" "), e._m(7), e._v(" "), e._m(8), e._v(" "), n("li", {
                    attrs: {
                        title: "教学调查",
                        menu_type: "student_teachSurvey",
                        role: "student"
                    }
                }, [n("a", {
                    staticClass: "txtEllipsis pr",
                    attrs: {
                        href: "//online.zhihuishu.com/onlineSchool/teachSurvey/listStuSurvey",
                        target: "_self"
                    }
                }, [e._v("教学调查\n                    "), 0 != e.surveyTipCount ? n("span", [n("span", {
                    staticClass: "subBox"
                }, [n("label", {
                    staticClass: "subBox_count",
                    attrs: {
                        id: "undoSurveyCount"
                    }
                }, [e._v(e._s(e.surveyTipCount))])])]) : e._e()])]), e._v(" "), e._m(9), e._v(" "), e._m(10), e._v(" "), n("li", {
                    staticClass: "magicLine",
                    staticStyle: {
                        top: "33.9832px"
                    }
                })]), e._v(" "), n("span", {
                    staticClass: "moreToolBtn moreToolBtn_teach mt10",
                    class: {
                        click: e.navIsOpen
                    },
                    on: {
                        click: e.toggleNav
                    }
                }, [e._v(e._s(e.navIsOpen ? "收起" : "展开")), n("em")])])])
            },
            staticRenderFns: [function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("ul", {
                    staticClass: "clearfix"
                }, [n("li", [n("img", {
                    attrs: {
                        src: "//image.zhihuishu.com/zhs/ablecommons/demo/201707/1d48b1e4122247b296169e754cde8ef3.jpg",
                        width: "130",
                        height: "130"
                    }
                }), n("span", [e._v("下载学上端APP")])])])
            }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("div", {
                        staticClass: "identitySelBox clearfix"
                    }, [n("span", {
                        staticClass: "fl"
                    }, [e._v("这里是学生端")]), n("a", {
                        staticClass: "statusToggle fl ml5",
                        attrs: {
                            title: "点击切换至老师端",
                            href: "//newexam.zhihuishu.com/teacherExam/exam/noConsultList"
                        }
                    })])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        staticClass: "firstList",
                        attrs: {
                            title: "我的学堂",
                            menu_type: "student_index"
                        }
                    }, [n("a", {
                        staticClass: "schoolindex_ico txtEllipsis",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/student/index",
                            target: "_self"
                        }
                    }, [e._v("我的学堂")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "课程问答 ",
                            menu_type: "student_course_bbs"
                        }
                    }, [n("a", {
                        staticClass: "coursebbs_ico txtEllipsis",
                        attrs: {
                            href: "//wenda.zhihuishu.com/shareCourse/qaAnswerIndexPage?sourceType=2",
                            target: "_self"
                        }
                    }, [e._v("课程问答")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "见面课",
                            menu_type: "student_teach_meeting"
                        }
                    }, [n("a", {
                        staticClass: "teachMeet_ico txtEllipsis",
                        staticStyle: {
                            "letter-spacing": "6px"
                        },
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/teachMeeting/stuList"
                        }
                    }, [e._v("见面课")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "学习分析",
                            menu_type: "student_learnReport"
                        }
                    }, [n("a", {
                        staticClass: "learnReport_ico txtEllipsis",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/stuLearnReport/index"
                        }
                    }, [e._v("学习分析")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "课程资料",
                            menu_type: "course_folder"
                        }
                    }, [n("a", {
                        staticClass: "coursefolder_ico txtEllipsis",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/folder/stuIndex"
                        }
                    }, [e._v("课程资料")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "学习笔记",
                            menu_type: "student_note"
                        }
                    }, [n("a", {
                        staticClass: "learningnote_ico txtEllipsis ",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/note/home",
                            target: "_self"
                        }
                    }, [e._v("学习笔记")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "我的成绩",
                            menu_type: "student_result"
                        }
                    }, [n("a", {
                        staticClass: "Performanage_ico txtEllipsis",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/stuResultManage/myResult"
                        }
                    }, [e._v("我的成绩")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "课程事务",
                            menu_type: "teacher_pbl"
                        }
                    }, [n("a", {
                        staticClass: "txtEllipsis",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/courseAffair/index",
                            target: "_self"
                        }
                    }, [e._v("课程事务")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        attrs: {
                            title: "课程表",
                            menu_type: "student_courseMaintain"
                        }
                    }, [n("a", {
                        staticClass: "txtEllipsis",
                        attrs: {
                            href: "//online.zhihuishu.com/onlineSchool/courseMaintain/studentPlanList",
                            target: "_self"
                        }
                    }, [e._v("课程表")])])
                }
            ]
        }
    },
    548: function (e, t) {
        e.exports = {
            render: function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    staticClass: "headerMenuOutside"
                }, [n("div", {
                    staticClass: "headerMenuBox"
                }, [n("div", {
                    staticClass: "headerMenu clearfix"
                }, [e._m(0), e._v(" "), n("div", {
                    staticClass: "course_name",
                    attrs: {
                        title: e.courseName
                    }
                }, [e._v(e._s(e.courseName))]), e._v(" "), n("div", {
                    staticClass: "header_userInfo"
                }, [n("a", {
                    staticClass: "fl",
                    attrs: {
                        href: "//onlineh5.zhihuishu.com/onlineWeb.html#/studentIndex",
                        target: "_blank"
                    }
                }, [n("span", {
                    staticClass: "userInfo_header"
                }, [n("img", {
                    attrs: {
                        src: e.getUserHeader,
                        width: "32",
                        height: "32"
                    }
                })])]), e._v(" "), n("div", {
                    staticClass: "userLinks"
                }, [n("ul", [e._m(1), e._v(" "), n("li", {
                    staticClass: "bg2"
                }, [n("a", {
                    staticClass: "userLinks_item",
                    attrs: {
                        href: "javascript:void(0);",
                        target: "_self",
                        rel: "external nofollow"
                    },
                    on: {
                        click: e.logout
                    }
                }, [e._v("安全退出")])])])])]), e._v(" "), e._m(2)])])])
            },
            staticRenderFns: [function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("a", {
                    staticClass: "headerMenu_logo examlogo-div",
                    attrs: {
                        href: "//www.zhihuishu.com",
                        title: "智慧树首页",
                        target: "_self"
                    }
                }, [n("img", {
                    staticClass: "logoimg",
                    attrs: {
                        src: "https://www.zhihuishu.com/assets/images/course-logo.png",
                        alt: "智慧树,www.zhihuishu.com"
                    }
                })])
            }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("li", {
                        staticClass: "bg1"
                    }, [n("a", {
                        staticClass: "userLinks_item",
                        attrs: {
                            href: "//user.zhihuishu.com/zhsuser/account/new",
                            target: "_self"
                        }
                    }, [e._v("账号设置")])])
                }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("div", {
                        staticClass: "onlineSchool_link fr"
                    }, [n("a", {
                        attrs: {
                            href: "//onlineh5.zhihuishu.com/onlineWeb.html#/studentIndex",
                            target: "_self"
                        }
                    }, [e._v("在线学堂")])])
                }
            ]
        }
    },
    552: function (e, t) {
        e.exports = {
            render: function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    staticStyle: {
                        display: "none"
                    }
                }, [e.showCertifyBtn ? e._e() : n("div", {
                    staticClass: "privite-school-header-wrap",
                    style: {
                        background: e.bannerBgColor
                    },
                    attrs: {
                        id: "privateCloudHome"
                    }
                }, [n("div", {
                    staticClass: "privite-school-header-main"
                }, [n("img", {
                    attrs: {
                        src: e.bannerSrc
                    }
                }), e._v(" "), n("ul", {
                    staticClass: "school-header-link-wrap"
                }, [n("li", {
                    staticStyle: {
                        "border-right": "1px solid #fff"
                    }
                }, [n("a", {
                    attrs: {
                        href: e.schoolHomeUrl,
                        target: "_blank"
                    }
                }, [e._v("学校主页")])]), e._v(" "), e._m(0)])])]), e._v(" "), e.showCertifyBtn ? n("div", {
                    staticClass: "certify-wrap"
                }, [e._m(1)]) : e._e()])
            },
            staticRenderFns: [function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("li", [n("a", {
                    attrs: {
                        href: "//www.zhihuishu.com/supportService/page/stu/index.html",
                        target: "_blank"
                    }
                }, [e._v("新手向导")])])
            }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("div", {
                        staticClass: "certify-main"
                    }, [n("a", {
                        staticClass: "certify-btn",
                        attrs: {
                            href: "//user.zhihuishu.com/zhsuser/certify/index",
                            target: "_self"
                        }
                    }, [e._v("立即认证")])])
                }
            ]
        }
    },
    66: function (e, t, n) {
        "use strict";
        var r = n(266)
            , i = "//studentexam-api.zhihuishu.com"
            , a = "//taurusexam-api.zhihuishu.com"
            , o = "gateway/t/v1"
            , s = "studentExam"
            , u = "taurusExam";
        t.a = {
            listAllRecruits: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/listAllRecruits", e)
            },
            getSingleRecruit: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getSingleRecruit", e)
            },
            getExamType: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getExamType", e)
            },
            getStudentFinalExam: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/getStudentFinalExam", e)
            },
            hasMakeupExam: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/hasMakeupExam", e)
            },
            getStudentRoomExam: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/getStudentRoomExam", e)
            },
            getStudentOfflineExam: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/getStudentOfflineExam", e)
            },
            residualTimes: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/residualTimes", e)
            },
            findMicroCourseVideoProgress: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/findMicroCourseVideoProgress", e)
            },
            hasDoneQuestionnaire: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/hasDoneQuestionnaire", e)
            },
            doFaQuestionnaire: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/doFaQuestionnaire", e)
            },
            getUserMessage: function (e) {
                return n.i(r.a)(i + "/" + s + "/gateway/f/v1/ulogin/getLoginUserInfo", e)
            },
            currentTime: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/currentTime", e)
            },
            getWorkLists: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/getStudentHomework", e)
            },
            getStuProgressRule: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/getStuProgressRule", e)
            },
            applyRedo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/applyRedo", e)
            },
            redoNum: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/redoNum", e)
            },
            queryIsOpenLocation: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/location/queryIsOpenLocation", e)
            },
            createEncodeImage: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/location/createEncodeImage", e)
            },
            queryEncodeImageIsExpire: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/examToApp/queryEncodeImageIsExpire", e)
            },
            queryEncodeImageIsPass: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/location/queryEncodeImageIsPass", e)
            },
            changeCodeImg: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/changeCodeImg", e)
            },
            codeImgIsRight: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/codeImgIsRight", e)
            },
            getLoginSchoolInfo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getLoginSchoolInfo", e)
            },
            getUserAuthReal: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/authReal", e)
            },
            getUserAuthUseApp: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/authUseApp", e)
            },
            getStuLimitTime: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getStuLimitTime", e)
            },
            openHomework: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/doHomework", e)
            },
            getStuAnswerInfo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/getStuAnswerInfo", e)
            },
            getStuAnswerInfoNew: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/getStuAnswerInfoNew", e)
            },
            getStuAnswerInfoExam: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/answer/getStuAnswerInfo", e)
            },
            saveStudentAnswer: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/saveStudentAnswer", e)
            },
            saveStudentAnswerExam: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/answer/saveStudentAnswer", e)
            },
            hasAnswer: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/hasAnswer", e)
            },
            hasAnswerExam: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/answer/hasAnswer", e)
            },
            checkAnswers: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/checkAnswers", e)
            },
            saveCourseTran: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/saveCourseTran", e)
            },
            getIsObject: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getIsObject", e)
            },
            getAllQuesitonAnalysis: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getAllQuesitonAnalysis", e)
            },
            checkAnswerSheetInfo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/checkAnswerSheetInfo", e)
            },
            getDiscussInfo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getDiscussInfo", e)
            },
            getExamTipCount: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/getExamTipCount", e)
            },
            getUnCorrectTaskCount: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/getUnCorrectTaskCount", e)
            },
            lookHomework: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/lookHomework", e)
            },
            savaAnswerData: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/savaAnswerData", e)
            },
            doExam: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/doExam", e)
            },
            openExam: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/doExam", e)
            },
            temporarySave: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/temporarySave", e)
            },
            submit: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/submit", e)
            },
            submitExam: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/answer/submit", e)
            },
            getSurveyUndoCount: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/investigateNum", e)
            },
            nearlyExpiredExamCount: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/nearlyExpiredExamCount", e)
            },
            doRoomExam: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/roomexam/doRoomExam", e)
            },
            computerSaveStudentAnswer: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/roomexam/saveStudentAnswer", e)
            },
            computerGetStuAnswerInfo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/roomexam/getStuAnswerInfo", e)
            },
            computerSubmit: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/roomexam/submit", e)
            },
            computerHasAnswer: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/roomexam/hasAnswer", e)
            },
            getConvertUrl: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/getConvertUrl", e)
            },
            queryFaceRecognitionResult: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/queryFaceRecognitionResult", e)
            },
            saveFaceRecognitionResult: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/saveStudentFaceRecognitionExamResult", e)
            },
            saveStudentFaceRecognitionExamInfoNew: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/saveStudentFaceRecognitionExamInfoNew", e)
            },
            queryFaceRecognitionSwitchFromWeb: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/queryFaceRecognitionSwitchFromWeb", e)
            },
            currentTimeN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/currentTime", e)
            },
            getStudentFinalExamN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/getStudentFinalExam", e)
            },
            getStudentRoomExamN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/getStudentRoomExam", e)
            },
            getStudentOfflineExamN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/getStudentOfflineExam", e)
            },
            getStuProgressRuleN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/getStuProgressRule", e)
            },
            hasMakeupExamN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/hasMakeupExam", e)
            },
            findMicroCourseVideoProgressN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/findMicroCourseVideoProgress", e)
            },
            hasDoneQuestionnaireN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/hasDoneQuestionnaire", e)
            },
            doFaQuestionnaireN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/doFaQuestionnaire", e)
            },
            getExamTypeN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/exam/getExamType", e)
            },
            changeCodeImgN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/common/changeCodeImg", e)
            },
            codeImgIsRightN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/common/codeImgIsRight", e)
            },
            residualTimesN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/student/residualTimes", e)
            },
            getStuLimitTimeN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/exam/getStuLimitTime", e)
            },
            getUserMessageExam: function (e) {
                return n.i(r.a)(a + "/" + u + "/gateway/f/v1/ulogin/getLoginUserInfo", e)
            },
            taurusLogout: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/ulogin/logout", e)
            },
            getMacAddress: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/queryMacAddress", e)
            },
            getIpAddress: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/queryComputerIp", e)
            },
            getCollector: function (e) {
                return n.i(r.a)("//collector.zhihuishu.com/public/jsonp/collect", e)
            },
            getAnswerImgInfo: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/getAnswerImgInfo", e)
            },
            getCourseNameByRecruitId: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/exam/getCourseName", e)
            },
            checkIsLock: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/appeal/checkIsLock", e)
            },
            getStuExceptionAction: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/appeal/getStuExceptionAction", e)
            },
            checkIsPublicCourse: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/appeal/checkIsPublicCourse", e)
            },
            exceptionBackExamApi: function (e) {
                return n.i(r.a)("https://newexam-api.zhihuishu.com/teacherExam/gateway/t/v1/analysis/exceptionBackExamForPc", e, 1)
            },
            saveExceptionMessage: function (e) {
                return n.i(r.a)("https://newexam-api.zhihuishu.com/teacherExam/gateway/t/v1/analysis/saveExceptionMessage", e, 1)
            },
            getExamToken: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/student/getExamToken", e)
            },
            slideVerificationIsRight: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/common/slideVerificationIsRight", e)
            },
            getSaveAnswerLockResult: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/getSaveAnswerLockResult", e)
            },
            isPublicCourse: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/isPublicCourse", e)
            },
            getMobile: function (e) {
                return n.i(r.b)("//appcomm-user-api.zhihuishu.com/app-commserv-user/gateway/t/blacklistCheck/getMobile", e, 2)
            },
            sendCodeNew: function (e) {
                return n.i(r.a)("//appcomm-user-api.zhihuishu.com/app-commserv-user/gateway/t/blacklistCheck/sendCodeNew", e, 2)
            },
            sendCode: function (e) {
                return n.i(r.a)("//appcomm-user-api.zhihuishu.com/app-commserv-user/gateway/t/blacklistCheck/sendCode", e, 2)
            },
            codeValidate: function (e) {
                return n.i(r.a)("//appcomm-user-api.zhihuishu.com/app-commserv-user/gateway/t/blacklistCheck/codeValidate", e, 2)
            },
            sendSmsCodeWithoutCheck: function (e) {
                return n.i(r.a)("//appcomm-user-api.zhihuishu.com/app-commserv-user/gateway/t/blacklistCheck/sendSmsCodeWithoutCheck", e, 2)
            },
            validateSlideToken: function (e) {
                return n.i(r.a)(i + "/" + s + "/" + o + "/answer/validateSlideToken", e)
            },
            validateSlideTokenN: function (e) {
                return n.i(r.a)(a + "/" + u + "/" + o + "/answer/validateSlideToken", e)
            },
            aiTrainingWeekPoint: function (e) {
                return n.i(r.c)("//aistudy.zhihuishu.com/gateway/t/v1/aitraining/weakPoint", e)
            },
            getBaseConfig: function (e) {
                return n.i(r.b)("//ai-course-platform.zhihuishu.com/config/get-base-config", e)
            }
        }
    },
    78: function (e, t) { },
    79: function (e, t) { },
    80: function (e, t) { },
    81: function (e, t) { }
}, [404]);
