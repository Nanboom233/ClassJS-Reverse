// ==UserScript==
// @name         2026智慧树自动浇水收肥料-共享课
// @namespace    wisdomzhihuishu
// @version      1.14.5.256
// @description  智慧树是一种树
// @author       wisdomzhihuishu
// @match        *://studyvideoh5.zhihuishu.com/*
// @run-at       document-end
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

  var times = 0;
  setInterval(function () {
    if (times <= 2) {
      document.getElementsByTagName("video")[0].volume = 0;
      document.getElementsByTagName("video")[0].play();
      times++;
      return;
    }
    for (var i = 0; i < document.getElementsByTagName("video").length; i++) {
      var current_video = document.getElementsByTagName("video")[i];
      current_video.volume = 0;
      current_video.playbackRate = 1.0; // Progress is calculated by real watch time. 80% is considered as finished playing. So we just set rate to 1.0x and jump to next video when it's played over 80%.

      if (
        current_video.ended ||
        document
          .querySelectorAll(".clearfix.video.current_play")[0]
          .querySelector(".fl.time_icofinish") != null
      ) {
        console.log("[*] Next lesson.");

        for (const v of document
          .querySelectorAll(".list")[0]
          .querySelectorAll(".clearfix.video")) {
          // console.log(v);
          if (v.querySelector(".fl.time_icofinish") != null) {
            continue;
          }
          // eval(v.getAttribute("onclick"));
          humanClick(v);
          break;
        }
      }
      if (current_video.paused) {
        current_video.play();
      }
    }
  }, 3000);
})();
