// ==UserScript==
// @name         2025智慧树自动浇水收肥料
// @namespace    wisdomzhihuishu
// @version      1.14.11
// @description  智慧树是一种树（强化反调试、严格条件、延迟锁、增加防跳转/防强退拦截）
// @author       wisdomzhihuishu
// @match        *://*.zhihuishu.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @homepage     https://www.example.com
// ==/UserScript==

(function () {
    "use strict";

    function humanClick(element) {
        if (!element) return;

        // 获取元素的坐标
        const rect = element.getBoundingClientRect();
        // 在元素范围内生成随机点击位置
        const x = rect.left + rect.width / 2 + (Math.random() * 10 - 5);
        const y = rect.top + rect.height / 2 + (Math.random() * 10 - 5);

        const eventProps = {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            buttons: 1,
        };

        // 模拟完整的事件流
        ["mouseenter", "mouseover", "mousedown", "mouseup", "click"].forEach(
            (type) => {
                const ev = new MouseEvent(type, eventProps);
                element.dispatchEvent(ev);
            },
        );
    }

    // ==========================================
    // 【新增】网页跳转 / 防强退拦截模块
    // ==========================================
    try {
        // 1. 拦截 window.open
        unsafeWindow.open = function () {
            console.log("[*] 拦截到 window.open 弹窗/跳转尝试:", arguments);
            return null;
        };

        // 2. 拦截 window.location 的方法 (assign, replace, reload)
        if (unsafeWindow.Location && unsafeWindow.Location.prototype) {
            const blockLocation = function () {
                console.log("[*] 拦截到网页 location 强制跳转/刷新尝试:", arguments);
                // 劫持后什么都不做，阻断跳转
            };
            unsafeWindow.Location.prototype.assign = blockLocation;
            unsafeWindow.Location.prototype.replace = blockLocation;
            unsafeWindow.Location.prototype.reload = blockLocation;

            // 3. 拦截 location.href 的赋值跳转
            const originalHref = Object.getOwnPropertyDescriptor(unsafeWindow.Location.prototype, 'href');
            if (originalHref) {
                Object.defineProperty(unsafeWindow.Location.prototype, 'href', {
                    set: function (val) {
                        console.log("[*] 拦截到 location.href 赋值跳转尝试:", val);
                    },
                    get: originalHref.get || function () { return unsafeWindow.location.toString(); }
                });
            }
        }

        // 4. 终极兜底：beforeunload 页面离开拦截
        // 注意：现代浏览器不允许脚本“静默”阻止跳转，一定会弹出一个对话框询问用户是否离开。点“取消”即可留在当前页。
        window.addEventListener('beforeunload', function (e) {
            console.log("[*] 拦截到网页即将卸载 (可能在尝试跳转)");
            e.preventDefault();
            e.returnValue = '智慧树脚本拦截了一次强制跳转，确定要离开吗？';
            return e.returnValue;
        });

        console.log("[*] 网页跳转拦截模块加载完毕");
    } catch (err) {
        console.error("[-] 网页跳转拦截模块加载失败:", err);
    }

    // ==========================================
    // 【终极强化】反调试 / 无限 debugger 绕过模块
    // ==========================================
    try {
        const FunctionProxy = new Proxy(unsafeWindow.Function, {
            construct(target, args) {
                if (args.length > 0 && typeof args[args.length - 1] === 'string') {
                    args[args.length - 1] = args[args.length - 1].replace(/debugger/gi, '');
                }
                return new target(...args);
            },
            apply(target, thisArg, args) {
                if (args.length > 0 && typeof args[args.length - 1] === 'string') {
                    args[args.length - 1] = args[args.length - 1].replace(/debugger/gi, '');
                }
                return target.apply(thisArg, args);
            }
        });

        unsafeWindow.Function = FunctionProxy;

        Object.defineProperty(unsafeWindow.Function.prototype, 'constructor', {
            get: function () { return FunctionProxy; },
            set: function () { },
            configurable: true
        });

        unsafeWindow.eval = new Proxy(unsafeWindow.eval, {
            apply(target, thisArg, args) {
                if (args.length > 0 && typeof args[0] === 'string') {
                    args[0] = args[0].replace(/debugger/gi, '');
                }
                return target.apply(thisArg, args);
            }
        });

        const timerHandler = {
            apply(target, thisArg, args) {
                if (args.length > 0 && typeof args[0] === 'string') {
                    args[0] = args[0].replace(/debugger/gi, '');
                }
                return target.apply(thisArg, args);
            }
        };
        unsafeWindow.setInterval = new Proxy(unsafeWindow.setInterval, timerHandler);
        unsafeWindow.setTimeout = new Proxy(unsafeWindow.setTimeout, timerHandler);

        console.log("[*] 终极 Proxy 反调试(Debugger)拦截模块加载完毕");
    } catch (err) {
        console.error("[-] 反调试拦截模块加载失败:", err);
    }
    // ==========================================

    var times = 0;
    var isSwitching = false;

    setInterval(function () {
        if (isSwitching) return;

        var videos = document.getElementsByTagName("video");
        if (videos.length === 0) return;

        if (times <= 2) {
            videos[0].volume = 0;
            var playPromise = videos[0].play();
            if (playPromise !== undefined) {
                playPromise.catch(function (error) {
                    console.log("[*] 等待允许自动播放...");
                });
            }
            times++;
            return;
        }

        for (var i = 0; i < videos.length; i++) {
            var current_video = videos[i];
            current_video.volume = 0;
            current_video.playbackRate = 1.0;

            var isFinished = current_video.ended;
            var activeItem = document.querySelector(".file-item.active");
            if (activeItem && activeItem.querySelector(".icon-finish") != null) {
                isFinished = true;
            }

            if (isFinished) {
                console.log("[*] Next lesson.");
                var clicked = false;

                if (window.location.hostname === "wisdom-mooc.zhihuishu.com" ||
                    window.location.hostname === "studyvideoh5.zhihuishu.com") {
                    var nextBtn = document.querySelector("div#nextBtn.nextButton");
                    if (nextBtn) {
                        humanClick(nextBtn);
                        clicked = true;
                        console.log("[*] 已点击下一集: div#nextBtn.nextButton");
                    } else {
                        console.log("[-] 未找到符合严格条件的下一集按钮");
                    }
                } else {
                    var fileItems = document.querySelectorAll(".file-item");
                    for (var j = 0; j < fileItems.length; j++) {
                        var v = fileItems[j];
                        if (v.querySelector(".icon-finish") != null) {
                            continue;
                        }
                        var onclickAttr = v.getAttribute("onclick");
                        if (onclickAttr) {
                            eval(onclickAttr);
                        } else {
                            humanClick(v);
                        }
                        clicked = true;
                        console.log("[*] 已点击下一集: .file-item");
                        break;
                    }
                }

                if (clicked) {
                    isSwitching = true;
                    console.log("[*] 触发点击，脚本暂停 2000ms 以等待加载...");
                    setTimeout(function () {
                        isSwitching = false;
                        console.log("[*] 延迟结束，恢复脚本检测。");
                    }, 2000);
                }

            } else if (current_video.paused) {
                current_video.play();
            }
        }
    }, 2000);
})();