// Xổ số Vietlott:

var Power6_55 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
];

var Mega6_45 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45,
];

var Max3D = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];

var participatePower6_55 = [];
var participateMega6_45 = [];
var participateMax3D = [];
// lotteryVietlott;
$(".gameList").on("click", function (e) {
  let _shelf = $(e.target);
  let msg = _shelf.is(".elective")
    ? $(".elective").html()
    : "Thống kê kết quả lô đề, cờ bạc!";
  if ($(e.target).is(".elective")) {
    if ($("h1").html().trim() != "Xổ số Vietlott") showLotteryVietlott();
  } else if ($("h1").html().trim() != "Thống kê kết quả lô đề, cờ bạc!") {
    location.reload();
  }
  $("h1").html(msg);
});

function showLotteryVietlott() {
  $(".result").html(`
  <div class="predictResults">
    <div class="menu_item">
      <div class="Power6_55 lottery" title="Power6_55" onclick="bindId(title)">Power6_55</div>
      <div class="Mega6_45 lottery" title="Mega6_45" onclick="bindId(title)">Mega6_45</div>
      <div class="Max3D lottery" title="Max3D" onclick="bindId(title)">Max3D</div>
    </div>
    <div class="predict" id="Power6_55">
      <h2 class="titlePredict">Dự đoán kết quả Vietlott 6/55 kỳ</h2 >
      <i>(Mở thưởng Ngày ${new Date().getDate()} tháng ${new Date().getMonth()} năm ${new Date().getFullYear()})</i>
      <div class="numbersPredict">
        <div class="topPred"></div>
        <div class="topPred"></div>
        <div class="topPred"></div>
        <div class="topPred"></div>
        <div class="topPred"></div>
        <div class="topPred"></div>
        <div class="topPred"></div>
        <div class="rollNumbers"></div>
      </div>
      <div id="Power6_55" class="btn" onclick="renderNumber(id)">Click me!</div>
    </div>
 </div>
  `);

  $(".predictResults").show(1000);
}

let randomNum = [];
let createNumber = function (arrInit) {
  var length = arrInit.length;
  if (length > 0 && randomNum.length < 6) {
    let n = Math.floor(Math.random() * length) + 1;
    let check = randomNum.includes(n);
    if (!check) {
      randomNum.push(n);
    } else {
      while (check) {
        n = Math.floor(Math.random() * length) + 1;
        check = randomNum.includes(n);
        if (!check) {
          randomNum.push(n);
        }
      }
    }
    createNumber(arrInit);
  }
  return randomNum;
};
var numJ = 0;
var k = 0;
function bindId(titlePre) {
  let msg = "";
  if (titlePre === "Power6_55") {
    msg = "Power 6/55";
  } else if (titlePre === "Mega6_45") {
    msg = "Mega 6/45";
  } else {
    msg = "Max 3D";
  }
  $(".titlePredict").html(`Gợi ý kết quả Vietlott ${msg} kỳ`);
  $(".btn")[0].id = titlePre;
  showNumbersPredict();
}

function showNumbersPredict() {
  k = 0;
  numJ = 0;
  $(".topPred").html("");
  $(".rollNumbers").html("");
  $(".numbersPredict").hide(800);
  $(".numbersPredict").show(1000);
}
function showSuggestedResults() {
  if (randomNum.length > 0) {
    var n = numJ - 1;
    var ele = `${$.map(randomNum, function (it, i) {
      k++;
      it = it < 10 ? `0${it}` : `${it}`;
      return `<span class='numResults' style="--delay:${k}">${it}</span>`;
    })}`;
    $(".topPred").eq(n).html(ele.split(","));
  }
  numJ++;
}

function showRandomRepNum(repNumber) {
  var ele = `${$.map(repNumber, function (it, i) {
    it = it < 10 ? `0${it}` : `${it}`;
    return `<span class='numResults' style="--delay:${i}">${it}</span>`;
  })}`;
  $(".rollNumbers").html(ele.split(","));
}
/* =================== */

let randomRepNum = [];
let sumRandomNum = [];
function renderNumber(arrNum) {
  randomRepNum = [];
  sumRandomNum = [];
  k = 0;
  numJ = 0;
  $(".topPred").html("");
  $(".rollNumbers").html("");
  if (arrNum === "Power6_55") {
    createNumPredict(Power6_55);
  } else if (arrNum === "Mega6_45") {
    createNumPredict(Mega6_45);
  } else {
    createNumPredict(Max3D);
  }
  $(".numbersPredict").show(1000);
  showRandomRepNum(randomRepNum);
}

var ele = $(".topPred");
function createNumPredict(params) {
  const findIntersection = function (arrInit) {
    arr = arrInit;
    sumRandomNum = [];
    for (let i = 0; i <= 3333; i++) {
      randomNum = [];
      createNumber(arr);
      sumRandomNum.push(
        randomNum.sort(function (a, b) {
          return a - b;
        })
      );
    }
    /* ========================= */

    var all = sumRandomNum.reduce(function (a, b) {
      return a.concat(b);
    });
    for (var i = 0, obj = {}, l = all.length; i < l; i++) {
      var key = all[i];
      if (!obj[key]) obj[key] = 0;
      obj[key]++;
    }
    var value = 0,
      repNum = 0;
    Object.keys(obj).filter(function (el) {
      if (obj[el] > value) value = obj[el];
      if (obj[el] === value) repNum = el;
    });
    /* =============== */
    return repNum;
  };

  showSuggestedResults(randomNum);

  if (randomRepNum == [] || randomRepNum.length < 7) {
    let n = findIntersection(params);
    let check = randomRepNum.includes(n);
    if (!check) {
      randomRepNum.push(n);
    } else {
      while (check) {
        n = findIntersection(params);
        check = randomRepNum.includes(n);
        if (!check) {
          randomRepNum.push(n);
        }
      }
    }
    createNumPredict(params);
  }
  /* =========================== */

  return randomRepNum.sort(function (a, b) {
    return a - b;
  });
}

["1", "17", "18", "23", "32", "40", "48"];
