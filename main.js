// ==UserScript==
// @name         学习使用
// @namespace    http://ban.net/
// @version      0.1
// @description  学习使用。。。
// @author       Ban
// @match          *://cart.taobao.com/*
// @match          *://buy.tmall.com/*
// @include        *://cart.taobao.com/*
// @include        *://buy.taobao.com/*
// @include        *://buy.tmall.com/*
// @include        *://www.baidu.com/
// ==/UserScript==

(function () {
  'use strict';
  // 设定的时间
  let date = null;
  const REG1 = new RegExp('^.+/buy.taobao.com/.*');
  const REG2 = new RegExp("^.+/buy.tmall.com/.*");
  let interval; // 定时器
  let ban;
  let isCheck = false; // 是否勾选
  let isSubmit = false; // 是否提交订单
  if (getLocation() && new Date(getLocation().date) - new Date() > 0) ban = getLocation();
  else ban = {
    date: null, // 设定的时间
    isReload: false, // 是否需要刷新
    isLoading: false, // 是否正在运行
  };
  console.log(ban);
  setTimeout(fun, 200);

  function fun() {

    // 按钮放置位置
    let buttonSpace = document.getElementsByTagName("body")[0];
    // 布局dom
    let div = document.createElement("div");
    div.style.cssText = "display: flex; position: fixed; top: 100px; left: 10px; flex-direction: column; background: #fff; padding: 10px; box-shadow: 0 0 8px 0 rgb(0 0 0 / 50%); border-radius: 8px";
    div.innerHTML = `
        <input placeholder="输入选中范围"/>
        <input placeholder="输入时间">
        <div>
          是否需要刷新
          <input type="radio" name="isReload" value="0" checked>否
          <input type="radio" name="isReload" value="1">是
        </div> 
        <button>开始</button>
        <button>取消</button>
        <div class="msg" style="color: red"></div>
  `;
    // 按钮dom
    let button1 = div.getElementsByTagName("button")[0];
    button1.onclick = cart;
    if (ban.isLoading) button1.innerHTML = "运行中...";
    let button2 = div.getElementsByTagName("button")[1];
    button2.onclick = cancel;
    let msg = div.getElementsByTagName("div")[1];
    buttonSpace.append(div);
    if (ban.isReload) {
      document.getElementsByName("isReload")[0].removeAttribute("checked");
      document.getElementsByName("isReload")[1].setAttribute("checked", true);
    }

    function cart() {
      console.log("click");
      msg.innerHTML = "";
      let input, inputs, nowYear, nowMonth, nowDay, inputDate;
      try {
        // 选中的范围
        input = div.querySelectorAll("input")[0];
        inputs = input.value.split(',');
        nowYear = new Date().getFullYear();
        nowMonth = new Date().getMonth();
        nowDay = new Date().getDate();
        inputDate = div.querySelectorAll("input")[1].value.split(',');
        if (inputDate.length < 3) throw "error input"
        date = new Date(nowYear, nowMonth, nowDay, inputDate[0], inputDate[1], inputDate[2]);
        if (date.getTime() - new Date() < 0) throw "error time";
      } catch (e) {
        msg.innerHTML = "输入的信息存在错误";
        console.log(e);
        return;
      }
      ban.date = date;
      ban.isLoading = true;
      setLocation();
      div.getElementsByTagName("button")[0].innerHTML = "运行中...";
      interval = setInterval(loading, 200);
    }
    // 确认订单页面直接确定
    console.log(REG1.test(location.href), REG2.test(location.href));
    if (REG1.test(location.href) || REG2.test(location.href)) {
      console.log("submit");
      setTimeout(() => {
        document.querySelector("a[title='提交订单']").click();
      }, 200);
    }


    function loading() {
      if (!isCheck) {
        let checks = [null];
        let list = document.querySelector("#J_OrderList");
        let shopList = list.querySelectorAll(".J_Order");
        let inputs = div.querySelectorAll("input")[0].value.split(',');
        for (const item of shopList)
          checks.push(item.querySelector(".cart-checkbox "));
        if (inputs.length >= 1)
          for (const item of inputs)
            checks[item].querySelector("label").click();
        isCheck = true;
      }
      if (ban.isLoading) {
        if (new Date(ban.date) - new Date() < 0) {
          ban.isLoading = false;
          setLocation();
          clearInterval(interval);
          document.getElementById("J_Go").click();
        }
        console.log(new Date(ban.date) - new Date());
      } else clearInterval(interval);
    }


    function cancel() {
      console.log("cancel");
      ban.isLoading = false;
      setLocation();
      div.getElementsByTagName("button")[0].innerHTML = "开始";
      clearInterval(interval);
    }

  }

  function setLocation() {
    localStorage.setItem("ban", JSON.stringify(ban));
  }

  function removeLocation() {
    localStorage.removeItem("ban");
  }

  function getLocation() {
    return JSON.parse(localStorage.getItem("ban"));
  }

})();
