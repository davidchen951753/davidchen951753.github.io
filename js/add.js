// JavaScript Document
$(function(){
  // 當#myNavbar上的<a>連結按鈕click時, 讓整頁慢慢滑動到指定位置==============================
  $("#navbarSupportedContent a").on('click', function(event) {
    // this.hash 是取得目前URL中的錨點位置,例如:#section1
    // 當 this.hash (錨點位置) 不是空的時, 也就是有指定滑動到錨點位置時
    if (this.hash !== "") {
      // 阻止<a>連結被click時執行連結工作 (雷同return false, 但return false通常寫在最後)
      event.preventDefault();
      // 設定 hash 變數, 記錄目前的錨點
      var hash = this.hash;
      // 控制 html,body 執行 animate 動畫, 讓捲出的距離 = 目前錨點位置的 offset().top 座標
      $('html, body').animate({ scrollTop: $(hash).offset().top }, 800, function(){
        // 將錨點名稱加到URL網址列的後方
        window.location.hash = hash;
      });
    } // if end 
  }); // click end
});

$('.carousel').carousel({
  interval: 5000
})

$('.dropdown-toggle').dropdown()

$("#xr").on("click",function(){
    $("#x").attr("readonly",false);
    $("#sm").attr("readonly",true);
    $("#dop").attr("readonly",true);
});
$("#smr").on("click",function(){
    $("#x").attr("readonly",true);
    $("#sm").attr("readonly",false);
    $("#dop").attr("readonly",true);
});
$("#dopr").on("click",function(){
    $("#x").attr("readonly",true);
    $("#sm").attr("readonly",true);
    $("#dop").attr("readonly",false);
});
$("#pinr").on("click",function(){
    if ($('#pinr').prop('checked')){
        $("#pin").attr("readonly",false);
    }else{
        $("#pin").attr("readonly",true);
    }  
});

function getSpanNo(x){   // 適當的跨齒數
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var vp2 = Math.atan(Math.tan(pa)/Math.cos(beta));
    var tk = 0;
    
    var f = x / z;
    var t1 = 1 + Math.pow(Math.sin(beta), 2) / (Math.pow(Math.cos(beta), 2) + Math.pow(Math.tan(pa), 2));
    var t2 = Math.pow(Math.cos(beta), 2) + Math.pow(Math.tan(pa), 2);
    var t3 = Math.pow(1/Math.cos(beta) + 2 * f, 2);
    if (t2 * t3 < 1){
        tk = 2;
    } else {     
        var t4 = Math.pow(t2 * t3 - 1, 0.5); // t2*t3必須>=1，否則計算式 t4 會產生虛數
        var k = (t1 * t4 - (Math.tan(vp2) - vp2) - 2 * f * Math.tan(pa)) / PI;
        var tk = Math.round(z * k + 0.5); 
        if (tk < 2) {
            tk = 2;
        }
    }
    return tk;
}

function getSpan(smn,x){   // 跨齒厚
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var vp2 = Math.atan(Math.tan(pa)/Math.cos(beta));
    
    var tk = mn * Math.cos(pa) * (PI * (smn - 0.5) + z * (Math.tan(vp2) - vp2)) + 2 * x * mn * Math.sin(pa);    
    return tk;
}

function getDopPin(x){ // 通過節圓直徑理想的跨銷徑
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var zv= z / Math.pow(Math.cos(beta), 3); // 螺旋齒輪等價正齒輪齒數
    var t1 = PI / (2 * zv) - (Math.tan(pa) - pa) - 2 * x * Math.tan(pa) / zv;
    var t2 = Math.acos(zv * Math.cos(pa) / (zv + 2 * x)); // 銷與齒面切點上的壓力角
    var t3 = Math.tan(t2) + t1; // 通過銷中心的壓力角
    var t4 = zv * mn * Math.cos(pa) * ((Math.tan(t3) - t3) + t1); // 理想銷直徑
    var tk = Math.round(t4*100)/100;  //四捨五入，取小數點二位*/
    return tk;
}

function getDopAngle(pin,x){ // 計算通過跨銷中心與齒形的接觸角，st:節圓齒厚
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var vp2 = Math.atan(Math.tan(pa)/Math.cos(beta));
    
    var st = (PI/2+2*x*Math.tan(pa))*mn;    //節圓齒厚
    var d = mn * z / Math.cos(beta);
    var fi = st / d + (Math.tan(vp2) - vp2) + pin / (mn * z * Math.cos(pa)) - PI / z;    
    var df = 0;
    var x1 = 0;
    // 通過pin中心的壓力角的漸開線函數
    // 牛頓逼近法
    var e = 0.0000000001; // 誤差值
    var x0 = PI / 4; // 通過pin中心的壓力角的初始值
    var f = fi - Math.tan(x0) + x0; // 求解 fi=tan(x1)-x1，fi-tan(x1)+x1=0
    while (Math.abs(f) > e) {
      f = fi - Math.tan(x0) + x0;
      df = 1 - 1 / (Math.pow(Math.cos(x0), 2)); // tan(x0)-x0 的導函數
      x1 = x0 - f / df;
      x0 = x1;
    }
    return x0;
}
function getDop(pin,x){   // 計算跨銷值，st:節圓齒厚，status:0=公稱值，1=USL/LSL
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var vp2 = Math.atan(Math.tan(pa)/Math.cos(beta));
    var tk = 0;
    
    var x1 = getDopAngle(pin,x); // 計算通過跨梢中心的壓力角    
    var d = mn * z / Math.cos(beta);
    if (x1 > 0){
        if (z % 2 == 0){
          tk = d * Math.cos(vp2) / Math.cos(x1) + pin;
        }else{
          tk = d * Math.cos(vp2) / Math.cos(x1) * Math.cos(PI / (2 * z)) + pin;
        }
    }
    return tk;
}

function convertSpan2Xn(smn,sm){
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var vp2 = Math.atan(Math.tan(pa)/Math.cos(beta));
    
    var t1 = mn * Math.cos(pa) * (PI * (smn - 0.5) + z * (Math.tan(vp2) - vp2));
    var tk = (sm - t1) / (2 * mn * Math.sin(pa));
    return tk;
}
function convertDop2Xn(pin,dop,d){
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var beta = ba0 * PI / 180;
    var pa = pa0 * PI / 180;
    var vp2 = Math.atan(Math.tan(pa)/Math.cos(beta));
    var t1 = 0;
    var tk = 0;
    var t0 = z * mn * Math.cos(vp2) / Math.cos(beta); 
    
    if (z % 2 == 0) {
        t1 = Math.acos(t0 / (dop - pin))
    } else {
      t1 = Math.acos(t0 * Math.cos(PI / (2 * z)) / (dop - pin));
    }
    var t2 = (Math.tan(vp2) - vp2) + pin / (mn * z * Math.cos(pa)) - PI / z;
    var t3 = Math.tan(t1) - t1;
    var tT = (t3 - t2) * d;
    tk = (tT - (PI * mn /2) / Math.cos(beta)) / (2 * mn * Math.tan(vp2));
    return tk;
}

$("#calcGear").click(function(){
    var PI = 3.1415926;
    var mn = Number($("#mn").val());
    var z = Number($("#z").val());
    var pa0 = Number($("#pa").val());
    var ba0 = Number($("#ba").val());
    var pa = pa0*PI/180;
    var beta = ba0*PI/180;   
    var x = 0;
    var sm = 0;
    var smn = 0;
    var pin = 0;
    var dop = 0;
    
    var d = mn * z / Math.cos(beta);
    var db = d * Math.cos(pa);
    
    if ($('#xr').prop('checked')){
        x = Number($("#x").val());  
        smn = getSpanNo(x);
        sm = getSpan(smn,x);
        if ($('#pinr').prop('checked')){
            pin = Number($("#pin").val());
        } else {
            pin = getDopPin(x);
        }
        dop = getDop(pin,x);
    } else if ($('#smr').prop('checked')){    
        smn = Number($("#smn").val());
        sm = Number($("#sm").val());
        x = convertSpan2Xn(smn,sm);       
        if ($('#pinr').prop('checked')){
            pin = Number($("#pin").val());
        } else {
            pin = getDopPin(x);
        }
        dop = getDop(pin,x);
        var tk = Math.round(x*100000000)/100000000;  //四捨五入，取小數點8位*/
        $("#x:text").val(tk);
    } else if ($('#dopr').prop('checked')){
        dop = Number($("#dop").val());         
        if ($('#pinr').prop('checked')){
            pin = Number($("#pin").val());
        } else {
            pin = getDopPin(x);
        }
        x = convertDop2Xn(pin,dop,d);            
        smn = getSpanNo(x);
        sm = getSpan(smn,x);
        var tk = Math.round(x*100000000)/100000000;  //四捨五入，取小數點8位*/
        $("#x:text").val(tk);
    }
    var da = d + 2 * ((1 + x) * mn);
    var df = da - 2 * (2.25  * mn);
    var tk = Math.round(d*100000000)/100000000;
    $("#d:text").val(tk);
    var tk = Math.round(db*100000000)/100000000;
    $("#db:text").val(tk);       
    var tk = Math.round(da*100000000)/100000000;
    $("#da:text").val(tk);
    var tk = Math.round(df*100000000)/100000000;
    $("#df:text").val(tk);
    $("#smn:text").val(smn);
    var tk = Math.round(sm*100000000)/100000000;
    $("#sm:text").val(tk);
    $("#pin:text").val(pin);
    var tk = Math.round(dop*100000000)/100000000;
    $("#dop:text").val(tk);

});