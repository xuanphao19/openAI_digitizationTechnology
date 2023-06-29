"use strict";
(function ($) {
  const liEle = ((sum) => {
    let item = "";
    for (let i = 0; i < sum; i++) {
      let j = i < 10 ? `0${i}` : i;
      item +=
        i % 10 === 0
          ? `<li class="num evenTens" data-num="${j}"></li>`
          : `<li class="num" data-num="${j}"></li>`;
    }
    return item;
  })(100);
  // console.log(liEle);
  const getDaysInMonth = (mm, yy = 2023) => {
    return new Date(yy, mm, 0).getDate();
  };
  const createDay = (sd, mon) => {
    var html = "";
    for (let j = 1; j <= sd; j++) {
      j = j < 10 ? `0${j}` : `${j}`;
      html += `<li class="dayInfo info" data-day="${j}-${mon}-2023">
          <span>${j}</span> <ul>${liEle}</ul></li>`;
    }
    return html;
  };
  const createStatistic = (ele) => {
    if (ele && !$(ele).find("#statistical")[0]) {
      $(ele).append(`<li class="dayInfo" id="statistical">
          <span>Sum</span>
          <ul class="statisticList flex flex-col">${liEle}</ul>
          </li>`);
    }
  };
  $(document).ready(function () {
    const toggleMonth = (dd, mm, yy) => {
      $(".num").mouseenter((e) => {
        let _self = e.target,
          appeared = 0,
          lastCycle = 0,
          num = $(_self).attr("data-num"),
          idDays = $(`.info .num[data-num="${num}"]`),
          sumNum = $(`.statisticList .num[data-num="${num}"]`)[0].innerHTML;
        sumNum = sumNum ? sumNum : 0;
        $(idDays).each(function (i, item) {
          var val = $(item).html();
          var currentDay = $(item).parents(".info").attr("data-day");
          var curDayIdex = currentDay == `${dd}-${mm}-${yy}` ? i + 1 : 0;
          if (val) appeared = i + 1;
          if (currentDay == `${dd}-${mm}-${yy}`)
            if (curDayIdex > 0) lastCycle = curDayIdex - appeared;
        });
        let positLeft = $(_self).position().left,
          milestone = $("li#statistical.dayInfo").position().left - 150;
        if (positLeft >= milestone) {
          $(_self)[0].style.setProperty("--tr_slate", "-104%");
        }
        $(`.num[data-num="${num}"]`).css("background-color", "#beffd0");
        $(_self)[0].style.setProperty(
          "--ct",
          `"(${num}) ⭐ Tần Xuất: ${sumNum} Gan: (${lastCycle}) ngày chưa ra!"`
        );
        $(_self).addClass("active");
      });
      $(".num").mouseleave((e) => {
        let _self = e.target,
          eleAct = $(".num.active"),
          numAct = eleAct.attr("data-num"),
          rowActed = $(`.num[data-num="${numAct}"]`);
        if (eleAct[0]) eleAct[0].style.setProperty("--ct", ``);
        if (numAct && rowActed) rowActed.css("background-color", "transparent");
        $(_self).removeClass("active");
      });
    };
    //  id = "month${mm}_${yy}";
    const curDate = (function () {
      let dd = new Date().getDate(),
        mm = new Date().getMonth() + 1;
      (dd = dd < 10 ? `0${dd}` : `${dd}`), (mm = mm < 10 ? `0${mm}` : `${mm}`);
      return {
        dd: dd,
        mm: mm,
        yy: new Date().getFullYear(),
      };
    })();

    const showDaysInMonth = function (dd, mm, yy, callback) {
      dd = mm === curDate.mm ? curDate.dd : "01";
      mm = mm ? mm : curDate.mm;
      yy = yy ? yy : curDate.yy;
      let fullDates = "",
        sumDays = getDaysInMonth(mm, yy);
      fullDates += `
        <div  class="mon flex" data-mon="${sumDays}">
          <div class="monSpan" id="${mm}">
            <span class="month${mm}">(Ngày ${dd} Tháng ${mm}/${yy})</span>
            <span class="lotteryPred" title="Click Me!">Dự đoán kết quả 👉</span>
            <span class="lotteryPredRs">00</span>
          </div>
            <span class="preMonth" data-current-mon="${mm}">◁ Pre</span>
            <div class="wrapDate">
              <ul class="listDate" id = "month${mm}_${yy}">
                ${createDay(`${sumDays}`, `${mm}`)}
              </ul>
            </div>
        </div>`;
      if (callback && $.isFunction(callback)) {
        callback(fullDates);
      } else {
        $(".result").html(fullDates);
      }
      showValue(mm, sumDays);
      createStatistic($(".listDate"));
      frequencyStatistical();
      toggleMonth(dd, mm, yy);
    };
    showDaysInMonth(curDate.dd, curDate.mm, curDate.yy);

    $(".listMonth").on("click", (e) => {
      $(".listMonth").toggleClass("active");
      let month = $(e.target).attr(`data-mon-select`);
      var idMon = $(".monSpan")[0].id;
      if (month === curDate.mm && idMon === month) {
        return;
      } else {
        if (month) showDaysInMonth("", month);
      }
    });
    $(".result").on("click", function (e) {
      if (e.target.classList[0] === "preMonth") {
        let m = `${$(".preMonth").attr("data-current-mon") - 1}`,
          month = m < 10 ? `0${m}` : m;
        $(".preMonth").css("z-index", "1");
        function insertDates(dates) {
          $(dates).insertBefore($(".mon")[0]);
          $(".preMonth")[0].style.setProperty("data-current-mon", month);
          $(`.preMonth[data-current-mon="${month}"]`).before(
            `<span class="closeMonth">❌</span>`
          );
        }
        showDaysInMonth("", month, "", insertDates);
      } else if (e.target.classList[0] === "closeMonth") {
        $(this).find(".mon")[0].remove();
        frequencyStatistical();
      }
      toggleMonth(curDate.dd, curDate.mm, curDate.yy);
    });

    function showValue(candidates, sumDays) {
      let db,
        monthCandidates = dateResult[parseInt(candidates) - 1];
      $.each(monthCandidates, function (i, item) {
        for (const key in item) {
          if (key === "gdb") {
            // console.log(`Đề về ngày ${i + 1} tháng ${candidates}:` + item[key]);
          } else {
            let arrResult = item[key].replace(/[^0-9,]/gi, "").split(","),
              arrResultLength = sumDays ? sumDays : arrResult.length;
            for (let j = 0; j < arrResultLength; j++) {
              db = $(`.num[data-num="${item["gdb"]}"]`).attr(`data-num`);
              let num = arrResult[j];
              $(`.dayInfo[data-day="${key}"] .num[data-num="${num}"]`).append(
                `💔`
              );
              $(`.dayInfo[data-day="${key}"] .num[data-num="${db}"]`).addClass(
                "specialPrize"
              );
            }
          }
        }
      });
    }
    function frequencyStatistical() {
      let j = 0,
        statisticEle;
      for (let i = 0; i < 100; i++) {
        let isResult = 0,
          resultRepeat = 0;
        j = i < 10 ? `0${i}` : `${i}`;
        let resultEle = $(`.info .num[data-num="${j}"]`);
        resultEle.each(function (i, ele) {
          let lineResult = $(ele)[0].outerText;
          if (lineResult !== "") {
            isResult += lineResult.length;
            resultRepeat = `${isResult / 2}`;
            statisticEle = $(`.statisticList .num[data-num="${j}"] `);
            statisticEle.html(`${resultRepeat}`);
          }
        });
      }
    }

    var invest = [115, 115, 115, 450];
    var income = [];
    const surplusValue = (() => {
      let totalCost = 0,
        totalRevenue = 0;
      $.each(invest, function (i, item) {
        totalCost += item;
      });
      $.each(income, function (i, item) {
        totalRevenue += item;
      });
      return `${totalRevenue - totalCost}k`;
    })();
    $(".excess").text(surplusValue);

    /*  */
    let loTo = [],
      soDe = [],
      canDial = true;

    function openTraditionalLotteryPrizes(ele, p, i) {
      canDial = false;
      let j = i + 1,
        t = function (a, b) {
          return b
            ? Math.floor(Math.random() * (a - b) + b)
            : Math.floor(Math.random() * a);
        };
      window.clearInterval(countSec);
      let lo = 0;
      var countSec = setInterval(function () {
        let pr;
        switch (p) {
          case "p2":
            pr = `${t(10)}${t(10)}`;
            lo = pr.slice(0);
            break;
          case "p3":
            pr = `${t(10)}${t(10)}${t(10)}`;
            lo = pr.slice(1);
            break;
          case "p4":
            pr = `${t(10)}${t(10)}${t(10)}${t(10)}`;
            lo = pr.slice(2);
            break;
          case "p5":
          case "special":
            pr = `${t(10)}${t(10)}${t(10)}${t(10)}${t(10)}`;
            lo = pr.slice(3);
            break;
          default:
            alert("Bạn cần quay số theo thứ tự các giải!");
            break;
        }

        $(ele).html(pr).css("background", "chartreuse");
        $(".lotteryPredRs").html(lo);
      }, t(17, 6));

      var dialableTime = j === 1 ? 20000 : t(6000, 3000);
      const timeOut = setTimeout(() => {
        window.clearInterval(countSec);
        $(".lotteryPredRs").css({
          animation: "identifier 0.8s infinite linear",
        });

        j = j === 27 ? 0 : j;
        $(".prize")[j].style.background = "chartreuse";
        $(ele).css("background", "");
        const dialingDelayTime = setTimeout(() => {
          canDial = true;
          window.clearTimeout(dialingDelayTime);
        }, 1000);
        loTo.push(lo);
        console.log(loTo);
        if (loTo.length === 27) soDe.push(loTo.slice(26));
        window.clearTimeout(timeOut);
      }, dialableTime);
    }
    /* =================== */

    $(".result").on("click", function (e) {
      const eCl = e.target.className === "lotteryPred" ? true : false;
      const eId = $(e.target).parent()[0].id === curDate.mm ? true : false;
      if (loTo.length === 0) $(".prize")[1].style.background = "chartreuse";
      if (eCl && eId) {
        $(".lotteryPredRs").show();
        $(".predictOutcomeWrap").show(1000);
        const scrollTo = $(".lotteryPred")
          .css("background", "rgb(216 243 254)")
          .position().left;
        // console.log(scrollTo);
        $(".container").animate({ scrollLeft: scrollTo }, 500);
      }
      document.body.style.overflow = "hidden";
    });

    $(".predictOutcome").on("click", function (e) {
      let _shelf = e.target,
        prize = $(_shelf).attr("data-prize"),
        prizeIndex = $(".prize").index(_shelf);
      if (!canDial) return;
      const predictOutcome = (function (el, data) {
        if (el.className === "close") {
          $(".predictOutcomeWrap").hide(800);
          document.body.style.overflow = "auto";
          return;
        }
        let k = loTo.length;
        if (k + 1 === prizeIndex && canDial) {
          openTraditionalLotteryPrizes(el, data, prizeIndex);
          k++;
        } else if (k === 26 && prize === "special" && canDial) {
          openTraditionalLotteryPrizes(el, data, prizeIndex);
          k = 0;
        } else if (loTo.length === 27) {
          $(".prize")[1].style.background = "";
          swal(
            "Hết lượt quay số dự thưởng!",
            `Thống kê kết quả Dự đoán XSMB:

            - Số đề: ${soDe}
            - Lô tô: ${loTo.sort((a, b) => a - b)}

            Kết quả chỉ mang tính chất giải trí.
            Không cổ súy cờ bạc.
            Chúc các bạn vui vẻ và May mắn!`
          );
        } else {
          swal(
            "Chào mừng đến với Dự đoán XSMB!",
            `Bạn cần quay số theo thứ tự các giải:
            Từ giải Nhất đến giải 7
            Giải đặc biệt vui lòng quay cuối cùng.
            Chúc các bạn vui vẻ và May mắn!`
          );
        }
      })(_shelf, prize);
    });
  });
  $(document).on("mousedown", function (e) {
    if ($(".listMonth.active")) {
      let check = $.contains($(".listMonth")[0], $(e.target)[0]);
      if (!check) $(".listMonth.active").removeClass("active");
    }
    if ($(".swal-overlay")[0]) {
      if (
        !$.contains($(".predictOutcome")[0], $(e.target)[0]) &&
        !$.contains($(".swal-overlay")[0], $(e.target)[0]) &&
        !$(e.target)[0] === $(".swal-overlay")[0]
      )
        $(".predictOutcome").hide(800);
    }
  });
})(jQuery);

// Chú ý: phần tử muốn di chuyển phải có CSS  overflow: auto;
//  $("html, body").animate({ scrollTop: $(el).offset().top - 50 }, 500);

var dateResult = [
  [
    //January: "01",
    { gdb: "", "01-01-2023": "" },
    { gdb: "", "02-01-2023": "" },
    { gdb: "", "03-01-2023": "" },
    { gdb: "", "04-01-2023": "" },
    { gdb: "", "05-01-2023": "" },
    { gdb: "", "06-01-2023": "" },
    { gdb: "", "07-01-2023": "" },
    { gdb: "", "08-01-2023": "" },
    { gdb: "", "09-01-2023": "" },
    { gdb: "", "10-01-2023": "" },
    { gdb: "", "11-01-2023": "" },
    { gdb: "", "12-01-2023": "" },
    { gdb: "", "13-01-2023": "" },
    { gdb: "", "14-01-2023": "" },
    { gdb: "", "15-01-2023": "" },
    { gdb: "", "16-01-2023": "" },
    { gdb: "", "17-01-2023": "" },
    { gdb: "", "18-01-2023": "" },
    { gdb: "", "19-01-2023": "" },
    { gdb: "", "20-01-2023": "" },
    { gdb: "", "21-01-2023": "" },
    { gdb: "", "22-01-2023": "" },
    { gdb: "", "23-01-2023": "" },
    { gdb: "", "24-01-2023": "" },
    { gdb: "", "25-01-2023": "" },
    { gdb: "", "26-01-2023": "" },
    { gdb: "", "27-01-2023": "" },
    { gdb: "", "28-01-2023": "" },
    { gdb: "", "29-01-2023": "" },
    { gdb: "", "30-01-2023": "" },
    { gdb: "", "31-01-2023": "" },
  ],
  [
    // February: "02",
    { gdb: "", "01-02-2023": "" },
    { gdb: "", "02-02-2023": "" },
    { gdb: "", "03-02-2023": "" },
    { gdb: "", "04-02-2023": "" },
    { gdb: "", "05-02-2023": "" },
    { gdb: "", "06-02-2023": "" },
    { gdb: "", "07-02-2023": "" },
    { gdb: "", "08-02-2023": "" },
    { gdb: "", "09-02-2023": "" },
    { gdb: "", "10-02-2023": "" },
    { gdb: "", "11-02-2023": "" },
    { gdb: "", "12-02-2023": "" },
    { gdb: "", "13-02-2023": "" },
    { gdb: "", "14-02-2023": "" },
    { gdb: "", "15-02-2023": "" },
    { gdb: "", "16-02-2023": "" },
    { gdb: "", "17-02-2023": "" },
    { gdb: "", "18-02-2023": "" },
    { gdb: "", "19-02-2023": "" },
    { gdb: "", "20-02-2023": "" },
    { gdb: "", "21-02-2023": "" },
    { gdb: "", "22-02-2023": "" },
    { gdb: "", "23-02-2023": "" },
    { gdb: "", "24-02-2023": "" },
    { gdb: "", "25-02-2023": "" },
    { gdb: "", "26-02-2023": "" },
    { gdb: "", "27-02-2023": "" },
    { gdb: "", "28-02-2023": "" },
    { gdb: "", "29-02-2023": "" },
    { gdb: "", "30-02-2023": "" },
    { gdb: "", "31-02-2023": "" },
  ],
  [
    // March: "03",
    { gdb: "", "01-03-2023": "" },
    { gdb: "", "02-03-2023": "" },
    { gdb: "", "03-03-2023": "" },
    { gdb: "", "04-03-2023": "" },
    { gdb: "", "05-03-2023": "" },
    { gdb: "", "06-03-2023": "" },
    { gdb: "", "07-03-2023": "" },
    { gdb: "", "08-03-2023": "" },
    { gdb: "", "09-03-2023": "" },
    { gdb: "", "10-03-2023": "" },
    { gdb: "", "11-03-2023": "" },
    { gdb: "", "12-03-2023": "" },
    { gdb: "", "13-03-2023": "" },
    { gdb: "", "14-03-2023": "" },
    { gdb: "", "15-03-2023": "" },
    { gdb: "", "16-03-2023": "" },
    { gdb: "", "17-03-2023": "" },
    { gdb: "", "18-03-2023": "" },
    { gdb: "", "19-03-2023": "" },
    { gdb: "", "20-03-2023": "" },
    { gdb: "", "21-03-2023": "" },
    { gdb: "", "22-03-2023": "" },
    { gdb: "", "23-03-2023": "" },
    { gdb: "", "24-03-2023": "" },
    { gdb: "", "25-03-2023": "" },
    { gdb: "", "26-03-2023": "" },
    { gdb: "", "27-03-2023": "" },
    { gdb: "", "28-03-2023": "" },
    { gdb: "", "29-03-2023": "" },
    { gdb: "", "30-03-2023": "" },
    { gdb: "", "31-03-2023": "" },
  ],
  [
    // April: "04",
    {
      gdb: "44",
      "01-04-2023":
        "02, 09, 09,	18,	29, 28,	34,	44, 42, 48, 49,	58, 55, 56, 50,	61, 62, 65, 65,	76, 70, 75, 72,	85,	95, 93, 91",
    },
    {
      gdb: "44",
      "02-04-2023":
        "06, 07,	19, 17,	21, 24,	39, 36, 39,	44, 40,	57, 56, 57, 54,	67,	73, 77, 70, 77,	87, 87,	90, 99, 97, 95, 96",
    },
    {
      gdb: "33",
      "03-04-2023":
        "09,	16,	29, 23, 25,	33, 32, 32,	45, 42, 46,	52, 50, 57, 53,	69, 65,	76, 71, 78, 71,	84, 81, 84, 84, 89,	99",
    },
    {
      gdb: "45",
      "04-04-2023":
        "04, 01,	15,	24, 24, 24, 21,	33, 34, 38,	45, 45, 44,	50, 59, 50, 59,	76,	80, 82, 88, 84, 83, 88,	90, 96, 93",
    },
    {
      gdb: "26",
      "05-04-2023":
        "00,	15, 14, 14, 13, 14,	26, 20, 27, 26, 25,	47, 49, 49,	59, 59, 52, 59, 58, 55,	66,	72, 76, 79,	81, 86, 85",
    },
    {
      gdb: "11",
      "06-04-2023":
        "05, 05, 06,	11, 12, 10, 12,	21, 25,	31, 33, 36, 34,	42, 49, 44,	58, 51,	63, 60, 68, 65,	71,	89,	91, 93, 93",
    },
    {
      gdb: "36",
      "07-04-2023":
        "08, 04, 06, 00,	10, 12,	24, 29, 22,	36, 38, 30, 39,	47, 49, 47, 44,	56, 50, 58,	64, 69, 63, 65,	71, 72,	86",
    },
    {
      gdb: "15",
      "08-04-2023":
        "03, 01,	15, 18, 12, 16, 12,	20, 22,	33, 33,	44, 43, 49,	58, 55, 59, 54,	66,	73, 70, 75, 73,	80, 86, 87,	96",
    },
    {
      gdb: "26",
      "09-04-2023":
        "04, 05, 00, 03,	19, 13,	21,	32, 39, 34,	43, 46,	52, 59, 55, 56, 58, 52, 54,	63, 61,	72,	80, 87, 84,	95, 96",
    },
    {
      gdb: "63",
      "10-04-2023":
        "04, 05, 00, 03,	19, 13,	21,	32, 39, 34,	43, 46,	52, 59, 55, 56, 58, 52, 54,	63, 61,	72,	80, 87, 84,	95, 96",
    },
    {
      gdb: "39",
      "11-04-2023":
        "16, 17, 15,	23, 26, 22, 26,	39, 36, 32,	45, 40,	50, 58,	68, 69, 60, 60, 64,	71, 71,	85, 89, 84,	96, 98, 96",
    },
    {
      gdb: "95",
      "12-04-2023":
        "09, 04,	10, 19, 16, 10,	23, 29, 21, 28,	33, 39,	42, 44,	54, 56, 53, 57, 54,	69, 62, 66,	77,	82,	95, 96, 97",
    },
    {
      gdb: "65",
      "13-04-2023":
        "09, 03, 04, 08, 07,	11, 19, 12,	35, 38,	49, 46,	57,	65, 66, 60, 61, 60, 67, 60, 63,	89,	98, 99, 96, 92, 99",
    },
    {
      gdb: "34",
      "14-04-2023":
        "00, 03, 09, 02,	17,	20, 29, 23,	34, 32, 38, 32, 38,	49, 43,	51, 51, 57,	62, 60,	70, 78, 70, 79,	84, 81, 88",
    },
    {
      gdb: "14",
      "15-04-2023":
        "05, 04,	14, 10, 19, 11,	29, 20, 23, 21, 27,	30, 35, 35,	42,	55, 53,	77, 72, 75, 77,	83, 80, 88, 81,	91, 99",
    },
    {
      gdb: "48",
      "16-04-2023":
        "03, 00, 03.	10, 12.	27, 24, 22, 20, 21, 26, 28.	37, 35, 35.	48, 43, 41, 44.	56.	69, 69.	77, 70, 72.	86, 80",
    },
    {
      gdb: "76",
      "17-04-2023":
        "07, 01, 04, 07,	18, 11, 13, 12,	23, 23,	34, 33, 34, 39,	41,	50, 58,	68, 63,	76, 75, 76, 74,	80,	99, 91, 92",
    },
    {
      gdb: "61",
      "18-04-2023":
        "01, 02,	15, 17, 16, 18,	25, 27,	32, 30, 33, 34,	40, 44, 40, 44,	59, 58, 53,	61, 63, 69,	75, 74,	81, 80, 86",
    },
    {
      gdb: "85",
      "19-04-2023":
        "00, 03, 01, 04,	15, 17, 14, 13, 14, 17, 13,	36,	49, 48,	57, 50, 52, 52,	75, 77,	85, 84, 80, 88,	95, 90, 99",
    },
    {
      gdb: "23",
      "20-04-2023":
        "00,	14, 11, 17,	23, 29, 21, 23,	39, 38, 31, 35, 30,	47, 47, 41, 48, 46,	59,	60, 67,	72, 78,	87, 86,	91, 93",
    },
    {
      gdb: "14",
      "21-04-2023":
        "01, 05, 07, 07,	14, 17, 19, 19, 16,	29, 21,	39, 36, 36,	46, 48,	53, 53,	60, 62, 65,	75,	89,	97, 91, 94, 97",
    },
    {
      gdb: "52",
      "22-04-2023":
        "01, 08, 03,	24, 24, 23, 22,	39, 31, 32, 34,	42, 43, 41,	52, 52, 53, 52, 51,	63, 69, 61, 61,	71, 77,	97, 97",
    },
    {
      gdb: "79",
      "23-04-2023":
        "06,	14, 15, 16,	28, 25,	38, 31, 37, 39, 35,	48, 42,	51, 51, 53,	63, 62, 61,	79, 76,	82, 88, 88,	95, 92, 96",
    },
    {
      gdb: "05",
      "24-04-2023":
        "05, 09, 02, 03,	11, 15, 10,	21, 29, 26,	30,	46, 47, 48,	53, 51,	63,	75, 73, 79, 74, 70,	81, 86, 83, 81, 86",
    },
    {
      gdb: "83",
      "25-04-2023":
        "09, 06, 06,	15, 17, 11,	29, 27, 29, 25,	38, 35,	44, 42,	57, 50, 55, 58,	66,	73, 70, 70,	83, 88, 81, 86,	98",
    },
    {
      gdb: "75",
      "26-04-2023":
        "00, 06, 03,	17, 11, 11, 17,	22, 26,	30,	41, 42, 48, 45, 45, 48, 41,	56, 55,	68, 60,	75,	89, 87,	97, 95, 90",
    },
    {
      gdb: "55",
      "27-04-2023":
        "02,	16,	24, 27,	38, 32,	41, 45, 43,	55, 57, 50,	64, 68, 65,	79, 73, 70, 73, 74, 70, 74,	86, 84,	95, 93, 90",
    },
    {
      gdb: "96",
      "28-04-2023":
        "00, 08, 12, 19, 10, 28, 26, 20, 24, 31, 31, 38, 57, 50, 53, 60, 67, 64, 62, 66, 70, 85, 85, 96, 99, 93, 96",
    },
    {
      gdb: "39",
      "29-04-2023":
        "05, 06, 07, 03, 19, 24, 24, 23, 29, 21, 39, 35, 30, 31, 45, 56, 55, 52, 64, 62, 60, 70, 82, 91, 98, 90, 91",
    },
    {
      gdb: "19",
      "30-04-2023":
        "06, 01, 06, 19, 13, 11, 27, 22, 38, 37, 38, 46, 40, 50, 62, 68, 65, 63, 76, 78, 70, 83, 83, 86, 89, 84, 88",
    },
  ],
  [
    // May: "05",
    {
      gdb: "20",
      "01-05-2023":
        "01, 06, 00, 18, 12, 16, 14, 20, 22, 47, 48, 48, 52, 58, 58, 65, 71, 74, 80, 89, 80, 88, 89, 84, 98, 91, 94",
    },
    {
      gdb: "65",
      "02-05-2023":
        "08, 08, 02, 08, 02, 18, 21, 30, 43, 44, 56, 57, 52, 65, 60, 66, 69, 61, 77, 73, 70, 70, 81, 88, 86, 98, 93",
    },
    {
      gdb: "76",
      "03-05-2023":
        "00, 06, 12, 13, 12, 28, 20, 29, 28, 35, 32, 37, 41, 55, 59, 65, 61, 62, 61, 67, 76, 76, 89, 80, 90, 90, 93",
    },
    {
      gdb: "18",
      "04-05-2023":
        "00, 00, 06, 18, 10, 11, 24, 22, 28, 36, 35, 49, 42, 49, 42, 53, 61, 67, 68, 60, 61, 77, 77, 83, 87, 97, 96",
    },
    {
      gdb: "47",
      "05-05-2023":
        "11, 16, 14, 27, 26, 24, 36, 32, 34, 39, 47, 46, 45, 42, 42, 58, 54, 55, 55, 59, 60, 61, 78, 72, 87, 94, 92",
    },
    {
      gdb: "04",
      "06-05-2023":
        "04, 00, 06, 08, 16, 11, 19, 12, 16, 19, 27, 22, 25, 27, 26, 37, 35, 38, 42, 58, 51, 62, 68, 60, 62, 74, 97",
    },
    {
      gdb: "60",
      "07-05-2023":
        "03,10, 13, 16,24, 21,35, 36, 31, 36, 37,43, 40, 40, 42,60, 65, 67, 60, 68, 64,84, 87, 86,98, 99, 95",
    },
    {
      gdb: "81",
      "08-05-2023":
        "00, 09,16,21, 26,32, 36, 36,48, 45, 40, 41, 44,55,61, 62, 62, 62,71, 71,81, 84, 84, 83,97, 93, 92",
    },
    {
      gdb: "46",
      "09-05-2023":
        "08,14,23, 27, 26, 21, 25,38, 30,46, 42, 42,52, 59, 54,68, 67, 67, 65, 60, 64,70, 71, 78,88, 83,94",
    },
    {
      gdb: "96",
      "10-05-2023":
        "02, 09, 02, 05,19,25, 27,35,46, 49, 43,50, 51, 56, 59, 59, 56,67, 64,79, 79,84, 84, 84,96, 91, 91",
    },
    {
      gdb: "34",
      "11-05-2023":
        "06, 16, 27, 34, 36, 38, 49, 41, 40, 59, 53, 58, 55, 69, 66, 64, 60, 74, 75, 71, 78, 73, 88, 84, 80, 90, 97",
    },
    {
      gdb: "02",
      "12-05-2023":
        "02, 01, 03, 00, 14, 18, 18, 10, 31, 30, 41, 40, 45, 44, 43, 57, 50, 65, 76, 70, 71, 75, 84, 81, 92, 97, 90",
    },
    {
      gdb: "49",
      "13-05-2023":
        "03, 05, 09, 08, 12, 15, 15, 10, 22, 21, 33, 36, 49, 47, 43, 44, 68, 68, 68, 74, 75, 81, 93, 96, 91, 97, 90",
    },
    {
      gdb: "53",
      "14-05-2023":
        "07, 07, 08, 17, 12, 23, 23, 36, 43, 48, 48, 43, 53, 56, 53, 54, 52, 51, 64, 67, 70, 79, 76, 85, 99, 96, 96",
    },
    {
      gdb: "56",
      "15-05-2023":
        "01, 00, 02, 06, 07, 05, 18, 20, 38, 30, 38, 32, 44, 42, 56, 53, 58, 53, 62, 61, 71, 87, 80, 87, 80, 93, 95",
    },
    {
      gdb: "31",
      "16-05-2023":
        "02, 08, 13, 14, 31, 39, 38, 31, 30, 37, 41, 41, 49, 59, 58, 51, 63, 79, 70, 78, 84, 80, 82, 82, 92, 99, 94",
    },
    {
      gdb: "49",
      "17-05-2023":
        "00, 00, 13, 12, 18, 13, 24, 28, 26, 28, 36, 39, 30, 38, 49, 41, 44, 41, 49, 42, 54, 53, 52, 72, 76, 79, 93",
    },
    {
      gdb: "32",
      "18-05-2023":
        "19, 16, 18, 27, 28, 28, 21, 32, 32, 32, 37, 31, 43, 41, 56, 52, 53, 54, 62, 67, 72, 72, 70, 82, 81, 90, 99",
    },
    {
      gdb: "17",
      "19-05-2023":
        "06, 02, 17, 11, 15, 12, 29, 33, 31, 36, 50, 56, 57, 56, 51, 52, 56, 63, 66, 71, 78, 87, 89, 86, 86, 87, 91",
    },
    {
      gdb: "52",
      "20-05-2023":
        "01,    04,      27,      34, 37, 30, 34, 33, 45, 52, 57, 57, 56, 67, 62, 77, 74, 79, 79, 70, 77, 88, 83, 83, 97, 95, 99",
    },
    {
      gdb: "97",
      "21-05-2023":
        "05, 05, 13, 21, 21, 29, 33, 39, 40, 49, 41, 42, 42, 43, 54, 50, 64, 66, 77, 75, 70, 76, 97, 96, 97, 93, 90",
    },
    {
      gdb: "54",
      "22-05-2023":
        "04, 07, 09, 09, 17, 14, 19, 15, 27, 38, 34, 40, 43, 54, 53, 59, 57, 50, 61, 63, 65, 84, 82, 97, 92, 93, 90",
    },
    {
      gdb: "72",
      "23-05-2023":
        "07, 01, 08, 16, 19, 17, 21, 27, 30, 30, 47, 40, 44, 57, 51, 58, 66, 67, 61, 72, 82, 89, 82, 90, 95, 91, 90",
    },
    {
      gdb: "66",
      "24-05-2023":
        "04, 01, 16, 17, 45, 41, 44, 40, 52, 54, 66, 62, 64, 67, 64, 63, 76, 74, 72, 73, 85, 87, 80, 87, 94, 96, 95",
    },
    {
      gdb: "19",
      "25-05-2023":
        "00, 08, 02, 00, 00, 19, 15, 21, 32, 37, 32, 49, 43, 51, 56, 69, 67, 77, 74, 84, 81, 86, 87, 84, 89, 91, 96",
    },
    {
      gdb: "91",
      "26-05-2023":
        " 08, 03, 03, 16, 13, 10, 10, 11, 25, 20, 39, 39, 36, 31, 47, 48, 42, 56, 51, 55, 53, 63, 72, 86, 88, 91, 95",
    },
    {
      gdb: "37",
      "27-05-2023":
        "01, 19, 19, 11, 25, 24, 37, 33, 31, 44, 46, 40, 43, 49, 45, 54, 54, 64, 67, 62, 79, 75, 76, 88, 81, 98, 91",
    },
    {
      gdb: "59",
      "28-05-2023":
        "18, 13, 24, 28, 26, 27, 20, 39, 37, 32, 48, 59, 56, 50, 67, 74, 77, 76, 72, 71, 85, 89, 83, 81, 87, 80, 91",
    },
    {
      gdb: "67",
      "29-05-2023":
        "15, 15, 26, 23, 21, 38, 38, 36, 37, 34, 42, 42, 49, 49, 42, 48, 53, 67, 67, 65, 65, 71, 78, 92, 94, 91, 91",
    },
    {
      gdb: "65",
      "30-05-2023":
        "07, 00, 04, 18, 21, 37, 33, 30, 37, 40, 46, 50, 51, 50, 65, 68, 65, 61, 60, 62, 60, 71, 85, 87, 87, 93, 96",
    },
    {
      gdb: "61",
      "31-05-2023":
        "08, 08, 07, 02, 12, 16, 13, 24, 26, 22, -, 44, 43, 56, 61, 63, 66, 67, 60, 62, 69, 78, 79, 87, 84, 87, 96, 91",
    },
  ],

  [
    //June: "06",
    {
      gdb: "21",
      "01-06-2023":
        "04, 00, 18, 17, 17, 21, 28, 29, 27, 20, 35, 41, 43, 64, 72, 72, 75, 77, 79, 71, 85, 88, 82, 81, 98, 91, 98",
    },
    {
      gdb: "63",
      "02-06-2023":
        "05, 05, 08, 07, 19, 16, 19, 25, 20, 23, 29, 34, 34, 42, 55, 54, 58, 51, 53, 63, 62, 63, 76, 73, 85, 84, 97",
    },
    {
      gdb: "70",
      "03-06-2023":
        "05, 05, 08, 08, 12, 26, 26, 25, 39, 30, 46, 42, 41, 44, 41, 45, 40, 57, 65, 70, 75, 79, 82, 83, 83, 93, 99",
    },
    {
      gdb: "08",
      "04-06-2023":
        "08, 00, 06, 10, 15, 22, 41, 40, 55, 52, 50, 67, 69, 64, 67, 76, 75, 70, 73, 84, 89, 82, 93, 93, 97, 93, 90",
    },
    {
      gdb: "81",
      "05-06-2023":
        "05,	15,	21, 27, 20, 25, 20, 28,	37, 34,	44, 46, 46, 48,	57, 58, 51, 57, 50,	65,	70, 79,	81, 83, 83,	95, 92",
    },
    {
      gdb: "79",
      "06-06-2023":
        "08, 07,	17, 18, 13, 19,	20, 22, 25,	31, 34, 36, 34,	47, 43,	57, 58, 59,	61, 62, 68,	79, 76, 70,	86,	98, 90",
    },
    {
      gdb: "57",
      "07-06-2023":
        "18, 16, 14, 17,	23, 22, 26, 24,	34, 38,	49, 46,	57, 56, 52, 58, 56,	66, 63, 69,	77, 72,	88, 81, 82, 82,	95",
    },
    {
      gdb: "37",
      "08-06-2023":
        "05, 03,	18, 13, 11, 15,	24, 25, 26, 24,	37, 35, 34, 31,	45, 44, 48,	59, 54,	66,	77, 72, 77,	81, 86, 88,	92",
    },
    {
      gdb: "88",
      "09-06-2023":
        "63, 25, 00, 40, 76, 83, 66, 98, 88, 91, 21, 49, 86, 00, 89, 81, 70, 98, 26, 46, 45, 43, 84, 68, 82, 38",
    },
    {
      gdb: "36",
      "10-06-2023":
        "02, 07, 02,	14, 16,	28, 22,	36, 37, 38, 33, 36, 39,	40, 47, 45, 44,	54, 52, 58, 50,	63, 68,	84, 81, 88,	95",
    },
    {
      gdb: "60",
      "11-06-2023":
        "04, 20, 25, 21, 27, 21,	34, 39,	43, 48, 49, 45, 43,	58, 57, 54, 56, 57,	68,60, 63, 67, 64,	73, 78,	84,	96",
    },
    {
      gdb: "42",
      "12-06-2023":
        "03, 02,42, 02, 01,	11, 14,	23, 26,	34, 39, 37, 39,	48,	51, 58, 53,	63, 66, 63, 68,	73,	81,	94, 97, 98, 94",
    },
    {
      gdb: "61",
      "13-06-2023":
        "07, 05, 04, 05,	10, 11,	30,	41, 47, 44, 47, 48,	50,	61, 65,	70, 71, 73, 72, 78, 73, 79,	83, 86, 81, 81,	94",
    },
    {
      gdb: "54",
      "14-06-2023":
        "05, 08, 00, 07, 06,	11,	20,	39, 37, 36, 31, 37, 32,	41, 48, 48, 49,	54, 52, 54, 50,	66, 66,	77,	86,	91, 90",
    },
    {
      gdb: "04",
      "15-06-2023":
        "04, 00, 06, 07,	13, 14,	29,	37, 33,	48, 44, 44, 42, 41,	51, 51, 50, 57, 59,	61, 68, 61, 63, 64,	72,	89,	98",
    },
    {
      gdb: "30",
      "16-06-2023":
        "08, 07, 09, 02, 07, 02, 01,	19,	20, 22,	30, 39, 35, 32,	49,	53, 55,	67, 66,	72, 74,	88, 84, 88,	93, 96, 97",
    },
    {
      gdb: "61",
      "17-06-2023":
        "03, 06, 01,	16, 19, 18, 16,	25,	49, 45, 42, 45,	52,	61, 64, 68, 61,	70, 77, 74, 79,	88, 85, 87,	98, 98, 95",
    },
    {
      gdb: "51",
      "18-06-2023":
        "01, 03, 06,	13, 15, 19,	26, 23, 27,	39,	42,	51, 52, 53, 52, 58, 57, 75, 76, 72,	83, 88,	99, 94, 92, 92, 99",
    },

    {
      gdb: "15", // Dự đoán 51 có về lô
      "19-06-2023":
        "	01,	15, 14,	23, 24,	33, 31,	46,	50, 51, 58, 56, 52,	64, 61, 63, 66,	70, 79, 71, 71,	87, 84,	99, 99, 91, 96",
    },
    {
      gdb: "32", // Dự đoán 31 ko về lô
      "20-06-2023":
        "07, 01, 08, 06, 02,	15, 18, 13, 15,	29, 22, 25, 24,	32, 33,	49,	53,	67, 66, 62, 68, 60,	76, 73,	88, 82,	95",
    },
    {
      gdb: "34", // Dự đoán 24 có về lô
      "21-06-2023":
        "01, 04, 02, 06,	13, 11,	24, 25, 21, 22, 28, 26,	34, 30,	48, 47, 49,	55, 59, 57,	78, 75,	83,	91, 90, 90, 95",
    },
    {
      gdb: "67", // Dự đoán 32 ko về lô; trùng xiên đầu 6
      "22-06-2023":
        "02, 09, 00,	13, 16, 16, 17,	24,	35,	44, 43, 42, 46, 44, 42,	57, 57, 51,	67, 66, 68, 69,	81, 87, 82, 84,	99",
    },
    {
      gdb: "60", // Dự đoán 585 có về lô 585
      "23-06-2023":
        "09, 01, 07, 05, 05,	17, 39, 36, 36,	46, 41, 44,	56, 52,	60, 61, 67, 62, 62, 69,	70,	85, 87, 84,	96, 99, 97",
    },
    {
      gdb: "70", // Dự đoán 59524 có về lô 024
      "24-06-2023":
        "05, 03, 05,	18, 15,	24, 20, 27,	33, 30, 39,	47, 48, 43,	56, 58, 57, 54,	69, 61,	70, 72, 73, 74,	87, 89,	91",
    },

    {
      gdb: "34", // Dự đoán 08275 ko về lô
      "25-06-2023":
        "07, 06, 09,	12, 13, 16,	34, 35, 34, 33,	46, 44, 48, 46, 47, 43,	55,	68, 68, 62,	73, 78,	84, 89, 81, 87,	95",
    },
    {
      gdb: "93", // Dự đoán 08500 ko về lô
      "26-06-2023":
        "02, 05, 28, 28, 21,	30,	42,	54, 51, 55, 50, 57,	69, 69, 60,	78, 79, 78, 71, 77,	87, 82,	93, 96, 99, 93, 95",
    },
    {
      gdb: "95",
      "27-06-2023":
        "06, 07, 07, 09, 09,	13, 19,	23, 29, 24,	39, 36,	43, 44,	59,	62, 63, 61,	71, 74, 79,	81, 82,	95, 96, 97, 92",
    },

    {
      gdb: "95",
      "28-06-2023":
        "06, 05, 06, 03,	18, 15,	20, 20,	32, 30,	49, 47, 48, 47,	68, 65, 61,	76,	89, 83, 89, 82,	95, 93, 94, 98, 96",
    },

    {
      gdb: "20",
      "29-06-2023":
        "01,	16, 17, 13,	20, 26, 24,	36, 38, 35, 36,	44, 43, 47,	60, 68,	75, 76, 73,	83, 83, 87,	99, 90, 92, 92, 98",
    },

    {
      gdb: "38", // Dự đoán 45238 ko về lô
      "30-06-2023":
        "01,05,06,15,16,21,21,23,30,32,34,38,44,45,59,66,68,69,69,72,72,74,77,83,89,96,98",
    },
    { gdb: "", "31-06-2023": "" },
  ],
  [
    // July: "07",
    { gdb: "", "01-07-2023": "" },
    { gdb: "", "02-07-2023": "" },
    { gdb: "", "03-07-2023": "" },
    { gdb: "", "04-07-2023": "" },
    { gdb: "", "05-07-2023": "" },
    { gdb: "", "06-07-2023": "" },
    { gdb: "", "07-07-2023": "" },
    { gdb: "", "08-07-2023": "" },
    { gdb: "", "09-07-2023": "" },
    { gdb: "", "10-07-2023": "" },
    { gdb: "", "11-07-2023": "" },
    { gdb: "", "12-07-2023": "" },
    { gdb: "", "13-07-2023": "" },
    { gdb: "", "14-07-2023": "" },
    { gdb: "", "15-07-2023": "" },
    { gdb: "", "16-07-2023": "" },
    { gdb: "", "17-07-2023": "" },
    { gdb: "", "18-07-2023": "" },
    { gdb: "", "19-07-2023": "" },
    { gdb: "", "20-07-2023": "" },
    { gdb: "", "21-07-2023": "" },
    { gdb: "", "22-07-2023": "" },
    { gdb: "", "23-07-2023": "" },
    { gdb: "", "24-07-2023": "" },
    { gdb: "", "25-07-2023": "" },
    { gdb: "", "26-07-2023": "" },
    { gdb: "", "27-07-2023": "" },
    { gdb: "", "28-07-2023": "" },
    { gdb: "", "29-07-2023": "" },
    { gdb: "", "30-07-2023": "" },
    { gdb: "", "31-07-2023": "" },
  ],

  [
    // August: "08",
    { gdb: "", "01-08-2023": "" },
    { gdb: "", "02-08-2023": "" },
    { gdb: "", "03-08-2023": "" },
    { gdb: "", "04-08-2023": "" },
    { gdb: "", "05-08-2023": "" },
    { gdb: "", "06-08-2023": "" },
    { gdb: "", "07-08-2023": "" },
    { gdb: "", "08-08-2023": "" },
    { gdb: "", "09-08-2023": "" },
    { gdb: "", "10-08-2023": "" },
    { gdb: "", "11-08-2023": "" },
    { gdb: "", "12-08-2023": "" },
    { gdb: "", "13-08-2023": "" },
    { gdb: "", "14-08-2023": "" },
    { gdb: "", "15-08-2023": "" },
    { gdb: "", "16-08-2023": "" },
    { gdb: "", "17-08-2023": "" },
    { gdb: "", "18-08-2023": "" },
    { gdb: "", "19-08-2023": "" },
    { gdb: "", "20-08-2023": "" },
    { gdb: "", "21-08-2023": "" },
    { gdb: "", "22-08-2023": "" },
    { gdb: "", "23-08-2023": "" },
    { gdb: "", "24-08-2023": "" },
    { gdb: "", "25-08-2023": "" },
    { gdb: "", "26-08-2023": "" },
    { gdb: "", "27-08-2023": "" },
    { gdb: "", "28-08-2023": "" },
    { gdb: "", "29-08-2023": "" },
    { gdb: "", "30-08-2023": "" },
    { gdb: "", "31-08-2023": "" },
  ],

  [
    //September: "09",
    { gdb: "", "01-09-2023": "" },
    { gdb: "", "02-09-2023": "" },
    { gdb: "", "03-09-2023": "" },
    { gdb: "", "04-09-2023": "" },
    { gdb: "", "05-09-2023": "" },
    { gdb: "", "06-09-2023": "" },
    { gdb: "", "07-09-2023": "" },
    { gdb: "", "08-09-2023": "" },
    { gdb: "", "09-09-2023": "" },
    { gdb: "", "10-09-2023": "" },
    { gdb: "", "11-09-2023": "" },
    { gdb: "", "12-09-2023": "" },
    { gdb: "", "13-09-2023": "" },
    { gdb: "", "14-09-2023": "" },
    { gdb: "", "15-09-2023": "" },
    { gdb: "", "16-09-2023": "" },
    { gdb: "", "17-09-2023": "" },
    { gdb: "", "18-09-2023": "" },
    { gdb: "", "19-09-2023": "" },
    { gdb: "", "20-09-2023": "" },
    { gdb: "", "21-09-2023": "" },
    { gdb: "", "22-09-2023": "" },
    { gdb: "", "23-09-2023": "" },
    { gdb: "", "24-09-2023": "" },
    { gdb: "", "25-09-2023": "" },
    { gdb: "", "26-09-2023": "" },
    { gdb: "", "27-09-2023": "" },
    { gdb: "", "28-09-2023": "" },
    { gdb: "", "29-09-2023": "" },
    { gdb: "", "30-09-2023": "" },
    { gdb: "", "31-09-2023": "" },
  ],

  [
    //October: "10",
    { gdb: "", "01-10-2023": "" },
    { gdb: "", "02-10-2023": "" },
    { gdb: "", "03-10-2023": "" },
    { gdb: "", "04-10-2023": "" },
    { gdb: "", "05-10-2023": "" },
    { gdb: "", "06-10-2023": "" },
    { gdb: "", "07-10-2023": "" },
    { gdb: "", "08-10-2023": "" },
    { gdb: "", "09-10-2023": "" },
    { gdb: "", "10-10-2023": "" },
    { gdb: "", "11-10-2023": "" },
    { gdb: "", "12-10-2023": "" },
    { gdb: "", "13-10-2023": "" },
    { gdb: "", "14-10-2023": "" },
    { gdb: "", "15-10-2023": "" },
    { gdb: "", "16-10-2023": "" },
    { gdb: "", "17-10-2023": "" },
    { gdb: "", "18-10-2023": "" },
    { gdb: "", "19-10-2023": "" },
    { gdb: "", "20-10-2023": "" },
    { gdb: "", "21-10-2023": "" },
    { gdb: "", "22-10-2023": "" },
    { gdb: "", "23-10-2023": "" },
    { gdb: "", "24-10-2023": "" },
    { gdb: "", "25-10-2023": "" },
    { gdb: "", "26-10-2023": "" },
    { gdb: "", "27-10-2023": "" },
    { gdb: "", "28-10-2023": "" },
    { gdb: "", "29-10-2023": "" },
    { gdb: "", "30-10-2023": "" },
    { gdb: "", "31-10-2023": "" },
  ],

  [
    // November: "11",
    { gdb: "", "01-11-2023": "" },
    { gdb: "", "02-11-2023": "" },
    { gdb: "", "03-11-2023": "" },
    { gdb: "", "04-11-2023": "" },
    { gdb: "", "05-11-2023": "" },
    { gdb: "", "06-11-2023": "" },
    { gdb: "", "07-11-2023": "" },
    { gdb: "", "08-11-2023": "" },
    { gdb: "", "09-11-2023": "" },
    { gdb: "", "10-11-2023": "" },
    { gdb: "", "11-11-2023": "" },
    { gdb: "", "12-11-2023": "" },
    { gdb: "", "13-11-2023": "" },
    { gdb: "", "14-11-2023": "" },
    { gdb: "", "15-11-2023": "" },
    { gdb: "", "16-11-2023": "" },
    { gdb: "", "17-11-2023": "" },
    { gdb: "", "18-11-2023": "" },
    { gdb: "", "19-11-2023": "" },
    { gdb: "", "20-11-2023": "" },
    { gdb: "", "21-11-2023": "" },
    { gdb: "", "22-11-2023": "" },
    { gdb: "", "23-11-2023": "" },
    { gdb: "", "24-11-2023": "" },
    { gdb: "", "25-11-2023": "" },
    { gdb: "", "26-11-2023": "" },
    { gdb: "", "27-11-2023": "" },
    { gdb: "", "28-11-2023": "" },
    { gdb: "", "29-11-2023": "" },
    { gdb: "", "30-11-2023": "" },
    { gdb: "", "31-11-2023": "" },
  ],

  [
    //December:"12",
    { gdb: "", "01-12-2023": "" },
    { gdb: "", "02-12-2023": "" },
    { gdb: "", "03-12-2023": "" },
    { gdb: "", "04-12-2023": "" },
    { gdb: "", "05-12-2023": "" },
    { gdb: "", "06-12-2023": "" },
    { gdb: "", "07-12-2023": "" },
    { gdb: "", "08-12-2023": "" },
    { gdb: "", "09-12-2023": "" },
    { gdb: "", "10-12-2023": "" },
    { gdb: "", "11-12-2023": "" },
    { gdb: "", "12-12-2023": "" },
    { gdb: "", "13-12-2023": "" },
    { gdb: "", "14-12-2023": "" },
    { gdb: "", "15-12-2023": "" },
    { gdb: "", "16-12-2023": "" },
    { gdb: "", "17-12-2023": "" },
    { gdb: "", "18-12-2023": "" },
    { gdb: "", "19-12-2023": "" },
    { gdb: "", "20-12-2023": "" },
    { gdb: "", "21-12-2023": "" },
    { gdb: "", "22-12-2023": "" },
    { gdb: "", "23-12-2023": "" },
    { gdb: "", "24-12-2023": "" },
    { gdb: "", "25-12-2023": "" },
    { gdb: "", "26-12-2023": "" },
    { gdb: "", "27-12-2023": "" },
    { gdb: "", "28-12-2023": "" },
    { gdb: "", "29-12-2023": "" },
    { gdb: "", "30-12-2023": "" },
    { gdb: "", "31-12-2023": "" },
  ],
];

// Chú ý: phần tử muốn di chuyển phải có CSS  overflow: auto;
//  $("html, body").animate({ scrollTop: $(el).offset().top - 50 }, 500);

/* Cả vòng lặp forvà forEach()đều cho phép bạn lặp qua các mục của mảng, nhưng điểm khác biệt giữa chúng là vòng forlặp cho phép bạn thoát ra nếu một điều kiện nhất định được đáp ứng.
Hãy xem xét đoạn mã sau:
JavaScript
Sao chép
let numbers = [1, 2, -1, 4, 5];
for(let i = 0; i< numbers.length; i++>) {
  if (numbers[i] < 0) {
    break;
  }
  console.log(numbers[i]);
}
Thêm break làm cho vòng lặp dừng lại ở một mục phủ định. Vòng forEach()lặp không thể làm điều đó. */
