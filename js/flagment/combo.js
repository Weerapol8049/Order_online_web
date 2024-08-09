let title = document.getElementsByTagName("title")[0].innerText;
let userAccountType = localStorage.getItem("type_val"); // 2 Manager

//let SERVER_CB = 'http://localhost:4462/';
//let SERVER_CB = 'http://starmark.work/retailsov2_api/';
//let SERVER_CB = 'http://starmark.work/order_online_api_test/';
// let SERVER_CB = 'http://starmark.work/order_online_api/';

// let API_EMPLOYEE = SERVER_CB + 'api/retailsoline/employee';
// let API_STORE = SERVER_CB + "api/retailso/stored";
// //let API_POOL = SERVER_CB + "api/retailso/pool";
// let API_POOLS = SERVER_CB + "api/retailso/pools";
// let API_REGION = SERVER_CB + "api/retailso/region";
// let API_PROVINCE = SERVER_CB + "api/retailso/province";
// let API_GETREGION = SERVER_CB + "api/retailso/findRegion";
// let API_DEPOSIT = SERVER_CB + "api/retailso/deposit";
// let API_DEPOSIT_DELETE = SERVER_CB + "api/retailso/deposit/delete";
// let API_DEPOSIT_CANCEL = SERVER_CB + "api/retailso/deposit/cancel";

// //let SERVER_CB = 'http://localhost:2179/';
// let SERVER_CB = 'http://starmark.work/OrderOnline_API_HUB/';
// let API_EMPLOYEE = SERVER_CB + 'api/OrderOnline/order/employee';
// let API_STORE = SERVER_CB + "api/OrderOnline/order/stored";
// let API_POOLS = SERVER_CB + "api/OrderOnline/order/pools";
// let API_REGION = SERVER_CB + "api/OrderOnline/order/region";
// let API_PROVINCE = SERVER_CB + "api/OrderOnline/order/province";
// let API_GETREGION = SERVER_CB + "api/OrderOnline/order/findRegion";
// let API_DEPOSIT = SERVER_CB + "api/OrderOnline/order/deposit";
// let API_DEPOSIT_DELETE = SERVER_CB + "api/OrderOnline/order/deposit/delete";
// let API_DEPOSIT_CANCEL = SERVER_CB + "api/OrderOnline/order/deposit/cancel";

// let SERVER_CB_order = 'http://starmark.work/OrderOnline_API_Orders/';//Live
// let SERVER_CB_ax = 'http://starmark.work/OrderOnline_API_AIF/';//Live

let SERVER_CB_order = 'http://starmark.work/OrderOnline_API_Order_test/';
//let SERVER_CB_ax = 'http://starmark.work/OrderOnline_API_AIF_test/';
let SERVER_CB_ax = "http://localhost:4377/";
//let SERVER_CB_order = "http://localhost:54871/";

let API_EMPLOYEE = SERVER_CB_order + "api/order/employee";
let API_STORE = SERVER_CB_order + "api/order/stored";
let API_POOLS = SERVER_CB_order + "api/order/pools";
let API_REGION = SERVER_CB_order + "api/order/region";
let API_PROVINCE = SERVER_CB_order + "api/order/province";
let API_GETREGION = SERVER_CB_order + "api/order/findRegion";
let API_DEPOSIT = SERVER_CB_order + "api/order/deposit";
let API_DEPOSIT_DELETE = SERVER_CB_ax + "api/order/deposit/delete";
let API_DEPOSIT_CANCEL = SERVER_CB_ax + "api/order/deposit/cancel";

let API_LOAD_ADDRESS = SERVER_CB_order + "api/address/order/load/";

let API_ADDRESS_ZIPCODE = SERVER_CB_order + "api/address/zipcode/";
let API_ADDRESS_PROVINCE = SERVER_CB_order + "api/address/province";
let API_ADDRESS_CITY = SERVER_CB_order + "api/address/city/";
let API_ADDRESS_DISTRICT = SERVER_CB_order + "api/address/district/";

let depositNum = 3; //จำนวนงวดมัดจำที่สามารถเพิ่มได้
let amountCancel = 0;

const sessionVal = {
  recId: getValue("recId_val"),
  date: getValue("date_val"),
  qty: getValue("qty_val"),
  amount: getValue("amount_val"),
  custName: getValue("custName_val"),
  salesId: getValue("salesId_val"),
  purchId: getValue("purchId_val"),
  //dateConfirm: getValue("confirmdate_val"),
  empId: getValue("emp_val"),
  storeId: getValue("store_val"),
  pool: getValue("pool_val"),
  pools: getValue("pools_val"),
  userId: getValue("userId_val"),
  region: getValue("region_val"),
  provinceId: getValue("provinceId_val"),
  paymDate: getValue("paymDate_val"),
  installment: getValue("installment_val"),
  installAmount: getValue("installAmount_val"),

  AddressStreet: getValue("AddressStreet_val"),
  AddressDistrict: getValue("AddressDistrict_val"),
  AddressCity: getValue("AddressCity_val"),
  AddressState: getValue("AddressState_val"),
  AddressZipcode: getValue("AddressZipcode_val"),
  ShippingCost: getValue("ShippingCost_val"),
  Discount: getValue("Discount_val"),
  InstallTeam: getValue("InstallTeam_val"),
  Free: getValue("Free_val"),
  Remark: getValue("Remark_val"),
  TaxNum: getValue("TaxNum_val")
};

const {
  recId,
  date,
  qty,
  amount,
  custName,
  salesId,
  purchId,
  empId,
  storeId,
  pool,
  pools,
  userId,
  region,
  provinceId,
  paymDate,
  installment,
  installAmount,
  AddressStreet,
  AddressDistrict,
  AddressCity,
  AddressState,
  AddressZipcode,
  ShippingCost,
  Discount,
  InstallTeam,
  Free,
  Remark,
  TaxNum
} = sessionVal;

var deposit_arr = [];

window.onload = function () {
  if (title == "Add Order") {
    window.sessionStorage.clear();
    var today = new Date();

    setElementVal("pool", "");
    loadEmployee("");
    loadStore(
      "",
      localStorage.getItem("usr_val"),
      localStorage.getItem("type_val")
    );
    loadPools("AddOrder");
    loadRegion("");
    loadProvince("");
    loadAddressProvince("");
  } else if (title == "Edit Order") {
    setElementVal("recId", recId);
    setElementVal("qty", qty);
    setElementVal("amount", amount);
    setElementVal("custName", custName);
    setElementVal("salesOrder", salesId);
    setElementVal("purchOrder", purchId);
    setElementVal("store", storeId);

    setElementVal("shippingcost", ShippingCost);
    setElementVal("discount", Discount);
    setElementVal("installTeam", InstallTeam);
    setElementVal("free", Free);
    setElementVal("remark", Remark);
    setElementVal("taxnum", TaxNum);

    loadEmployee(userId);
    loadStore(
      storeId,
      localStorage.getItem("usr_val"),
      localStorage.getItem("type_val")
    );
    loadPools(pool);
    loadRegion(region);
    loadProvince(provinceId);
    //loadAddress(recId);
    loadDeposit(recId);
    setDatePicker("#salesDate", date);

    loadAddressProvince(AddressState);
    loadAddressCity(AddressState, AddressCity);
    loadAddressDistrict(AddressState, AddressCity, AddressDistrict);

    setElementVal("addressStreet", AddressStreet);
    document.getElementById("addressZipcode").value = AddressZipcode;
  }
};

function setTwoNumberDecimal(event) {
  this.value = parseFloat(this.value).toFixed(2);
}

function setDatePicker(name, date) {
  config = {
    enableTime: false,
    dateFormat: "d/m/Y",
    locale: "th",
    defaultDate: new Date(date)
  };
  flatpickr(name, config);
}

function loadAddress(recid) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_LOAD_ADDRESS + recid);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      loadCardAddress(objects);
    }
  };
}

function loadCardAddress(data) {
  let id = 1;

  data.map((object) => {
    if (id <= depositNum) {
      if (id == 1)
        document.getElementById("cardDeposit").style.display = "block";

      let ul = createElement("ul", {
        id: "groupDeposit" + id,
        className: "list-group list-group-flush"
      });
      document.getElementById("cardDeposit").appendChild(ul);

      let row = createElement("div", { id: "row" + id, className: "row" });
      document.getElementById("groupDeposit" + id).appendChild(row);

      let seq = createElement("div", {
        id: "seq" + id,
        className: "col-sm-1",
        style: "text-align: center;"
      });
      document.getElementById("row" + id).appendChild(seq);

      let group = createElement("div", {
        id: "group" + id,
        className: "form-group",
        style: "margin-bottom: 0;"
      });
      document.getElementById("seq" + id).appendChild(group);

      let label = createElement("label", { id: "label" + id });
      document.getElementById("group" + id).appendChild(label);
      document.getElementById("label" + id).innerText = "ลำดับ";

      let group2 = createElement("div", {
        id: "grouplbl" + id,
        className: "form-group"
      });
      document.getElementById("seq" + id).appendChild(group2);

      let curseq = createElement("label", { id: "CURRSEQ" + id });
      document.getElementById("grouplbl" + id).appendChild(curseq);
      document.getElementById("CURRSEQ" + id).innerText = id.toString();

      let seq2 = createElement("label", {
        id: "SEQ" + id,
        style: "display:none;"
      });
      document.getElementById("grouplbl" + id).appendChild(seq2);
      document.getElementById("SEQ" + id).innerText = id.toString();

      let lblRecId = createElement("label", {
        id: "RECID" + id,
        style: "display:none;"
      });
      document.getElementById("grouplbl" + id).appendChild(lblRecId);
      document.getElementById("RECID" + id).innerText = object.RecId;

      //------------------------------- วันที่จ่าย ---------------------------------------------

      let colPaymDate = createElement("div", {
        id: "colPaymDate" + id,
        className: "col-sm-3"
      });
      document.getElementById("row" + id).appendChild(colPaymDate);

      let lblpaymdate = createElement("label", { id: "lblPaymDate" + id });
      document.getElementById("colPaymDate" + id).appendChild(lblpaymdate);
      document.getElementById("lblPaymDate" + id).innerText = "วันที่จ่าย";

      let icon = createElement("div", {
        id: "icon" + id,
        className: "input-icons"
      });
      document.getElementById("colPaymDate" + id).appendChild(icon);

      let fa = createElement("i", {
        id: "fa" + id,
        className: "fa fa-calendar icon"
      });
      document.getElementById("icon" + id).appendChild(fa);

      let inputDate = createElement("input", {
        id: "paymDate" + id,
        type: "text",
        className: "form-control flatpickr",
        style: "background-color: white; padding-left: 30px;"
      });
      document.getElementById("icon" + id).appendChild(inputDate);
      //  var elePaymDate = document.getElementById('paymDate' + id);
      //  elePaymDate.onchange = function() {onchangePaymDate(this.value, id); };

      flatpickr("#paymDate" + id, {
        locale: "th",
        dateFormat: "d/m/Y",
        defaultDate: dateFormatSlace(object.TransDate.substring(0, 10))
      });

      //---------------------------------------- งวด -------------------------------------------------

      let colinstall = createElement("div", {
        id: "colinstallment" + id,
        className: "col-sm-2"
      });
      document.getElementById("row" + id).appendChild(colinstall);

      let groupinstall = createElement("div", {
        id: "groupinstallment" + id,
        className: "form-group"
      });
      document.getElementById("colinstallment" + id).appendChild(groupinstall);

      let lblinstall = createElement("label", { id: "lblinstallment" + id });
      document.getElementById("groupinstallment" + id).appendChild(lblinstall);
      document.getElementById("lblinstallment" + id).innerText = "งวด";

      let sInstall = createElement("select", {
        id: "installment" + id,
        className: "form-control select2bs4",
        style: "width: 100%;",
        value: 0
      });
      document.getElementById("groupinstallment" + id).appendChild(sInstall);
      var eleinstallment = document.getElementById("installment" + id);
      eleinstallment.onchange = function () {
        onchangeInstallment(this.value, id);
      };

      //---------------------------------------- มูลค่า -------------------------------------------------

      let colamount = createElement("div", {
        id: "colamount" + id,
        className: "col-sm-3"
      });
      document.getElementById("row" + id).appendChild(colamount);

      let groupAmount = createElement("div", {
        id: "groupAmount" + id,
        className: "form-group"
      });
      document.getElementById("colamount" + id).appendChild(groupAmount);

      let lblAmount = createElement("label", { id: "lblAmount" + id });
      document.getElementById("groupAmount" + id).appendChild(lblAmount);
      document.getElementById("lblAmount" + id).innerText = "มูลค่า";

      let inputAmount = createElement("input", {
        id: "payment" + id,
        className: "form-control",
        value: object.Amount,
        type: "number",
        min: 0
      });
      document.getElementById("groupAmount" + id).appendChild(inputAmount);
      var elepayment = document.getElementById("payment" + id);
      elepayment.onchange = function () {
        onchangePayment(this.value, id);
      };
      elepayment.oninput = function () {
        this.value = Math.abs(this.value);
      };

      //---------------------------------------- button delete -------------------------------------------------

      let coldelete = createElement("div", {
        id: "coldelete" + id,
        className: "col-sm-1"
      });
      document.getElementById("row" + id).appendChild(coldelete);

      let groupdelete = createElement("div", {
        id: "groupdelete" + id,
        className: "form-group",
        style: "margin-top: 25px;"
      });
      document.getElementById("coldelete" + id).appendChild(groupdelete);

      let linkDelete = createElement("a", {
        id: "linkDelete" + id,
        style: "cursor: pointer;"
      });
      document.getElementById("groupdelete" + id).appendChild(linkDelete);
      var elelinkdelete = document.getElementById("linkDelete" + id);
      elelinkdelete.onclick = function () {
        deleteGroup(
          "groupDeposit" + elelinkdelete.id.substring(10, 13),
          `${object.RecId}`
        );
      };

      let imgDelete = createElement("img", {
        id: "imgDelete" + id,
        src: "../images/1398920_red circle_close_cross_cancel_remove_icon.png"
      });
      document.getElementById("linkDelete" + id).appendChild(imgDelete);

      let linkCancel = createElement("a", {
        id: "linkCancel" + id,
        style: "cursor: pointer; display: none;"
      });
      document.getElementById("groupdelete" + id).appendChild(linkCancel);

      let imgCancel = createElement("img", {
        id: "imgCancel" + id,
        style: "cursor: pointer; with: 48px; height: 48px",
        src: "../images/vecteezy_cancelled-rubber-stamp-on-white-background-vector-illustration_19495927.jpg"
      });
      document.getElementById("groupdelete" + id).appendChild(imgCancel);
      var eleimgcancel = document.getElementById("imgCancel" + id);
      eleimgcancel.onclick = function () {
        detailCancelDeposit(
          elecancel.id.substring(9, 11),
          object.CancelDate.substring(0, 10),
          object.CancelRemark
        );
      };

      //---------------------------------------- button print -------------------------------------------------

      let coldprint = createElement("div", {
        id: "coldprint" + id,
        className: "col-sm-1"
      });
      document.getElementById("row" + id).appendChild(coldprint);

      let groupprint = createElement("div", {
        id: "groupprint" + id,
        className: "form-group",
        style: "margin-top: 35px;"
      });
      document.getElementById("coldprint" + id).appendChild(groupprint);

      let linkPrint = createElement("a", {
        id: "linkPrint" + id,
        style: "cursor: pointer;"
      });
      document.getElementById("groupprint" + id).appendChild(linkPrint);
      var elelinkprint = document.getElementById("linkPrint" + id);
      elelinkprint.onclick = function () {
        printDeposit(object.RecId);
      };

      let imgPrint = createElement("img", {
        id: "imgPrint" + id,
        src: "../images/image_print_outline.png"
      });
      document.getElementById("linkPrint" + id).appendChild(imgPrint);

      //---------------------------------------- button cancel -------------------------------------------------

      let colcancel = createElement("div", {
        id: "colcancel" + id,
        className: "col-sm-1"
      });
      document.getElementById("row" + id).appendChild(colcancel);

      let groupcancel = createElement("div", {
        id: "groupcancel" + id,
        className: "form-group",
        style: "margin-top: 38px;"
      });
      document.getElementById("colcancel" + id).appendChild(groupcancel);

      let btnCancel = createElement("button", {
        id: "btnCancel" + id,
        className: "btn btn-block btn-outline-info btn-xs",
        style: "margin-top: 38px;"
      });
      document.getElementById("groupcancel" + id).appendChild(btnCancel);
      var elecancel = document.getElementById("btnCancel" + id);
      elecancel.onclick = function () {
        cancelDeposit(elecancel.id.substring(9, 11));
      };
      elecancel.innerText = "Cancel";

      //---------------------------------------- remark -------------------------------------------------

      let rowRemark = createElement("div", {
        id: "rowRemark" + id,
        className: "row"
      });
      document.getElementById("groupDeposit" + id).appendChild(rowRemark);

      let colempty = createElement("div", {
        id: "colempty" + id,
        className: "col-sm-1"
      });
      document.getElementById("rowRemark" + id).appendChild(colempty);

      let colRemark = createElement("div", {
        id: "colRemark" + id,
        className: "col-sm-11"
      });
      document.getElementById("rowRemark" + id).appendChild(colRemark);

      let groupRemark = createElement("div", {
        id: "groupRemark" + id,
        className: "form-group"
      });
      document.getElementById("colRemark" + id).appendChild(groupRemark);

      let inputRemark = createElement("input", {
        id: "remark" + id,
        className: "form-control",
        type: "text",
        value: object.Remark,
        placeholder: "หมายเหตุ"
      });
      document.getElementById("groupRemark" + id).appendChild(inputRemark);
      var eleremark = document.getElementById("remark" + id);
      eleremark.onchange = function () {
        onchangeRemark(this.value, eleremark.id.substring(6, 8));
      };

      document.getElementById("countDeposit").value = id;
      onchangeInstallment(0, id);
      refreshSequence(`CURRSEQ`);

      checkCancelDeposit(object.Cancel, id);
      if (object.Cancel == 1) {
        amountCancel += object.Amount;
        depositNum++;
      }
      //แก้ไข มัดจำ ได้ภายในวันที่สร้างเท่านั้น
      allowEditDeposit(object.AllowEdit, id);
      enableControl(id, object.Cancel);

      deposit_arr.push(document.getElementById("cardDeposit").innerHTML);
    }
    id++;
  });
}

function loadDeposit(recid) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_DEPOSIT);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      recid: recid
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      loadCardDeposit(objects);
    }
  };
}

function loadCardDeposit(data) {
  let id = 1;

  data.map((object) => {
    if (id <= depositNum) {
      if (id == 1)
        document.getElementById("cardDeposit").style.display = "block";

      let ul = createElement("ul", {
        id: "groupDeposit" + id,
        className: "list-group list-group-flush"
      });
      document.getElementById("cardDeposit").appendChild(ul);

      let row = createElement("div", { id: "row" + id, className: "row" });
      document.getElementById("groupDeposit" + id).appendChild(row);

      let seq = createElement("div", {
        id: "seq" + id,
        className: "col-sm-1",
        style: "text-align: center;"
      });
      document.getElementById("row" + id).appendChild(seq);

      let group = createElement("div", {
        id: "group" + id,
        className: "form-group",
        style: "margin-bottom: 0;"
      });
      document.getElementById("seq" + id).appendChild(group);

      let label = createElement("label", { id: "label" + id });
      document.getElementById("group" + id).appendChild(label);
      document.getElementById("label" + id).innerText = "ลำดับ";

      let group2 = createElement("div", {
        id: "grouplbl" + id,
        className: "form-group"
      });
      document.getElementById("seq" + id).appendChild(group2);

      let curseq = createElement("label", { id: "CURRSEQ" + id });
      document.getElementById("grouplbl" + id).appendChild(curseq);
      document.getElementById("CURRSEQ" + id).innerText = id.toString();

      let seq2 = createElement("label", {
        id: "SEQ" + id,
        style: "display:none;"
      });
      document.getElementById("grouplbl" + id).appendChild(seq2);
      document.getElementById("SEQ" + id).innerText = id.toString();

      let lblRecId = createElement("label", {
        id: "RECID" + id,
        style: "display:none;"
      });
      document.getElementById("grouplbl" + id).appendChild(lblRecId);
      document.getElementById("RECID" + id).innerText = object.RecId;

      //------------------------------- วันที่จ่าย ---------------------------------------------

      let colPaymDate = createElement("div", {
        id: "colPaymDate" + id,
        className: "col-sm-3"
      });
      document.getElementById("row" + id).appendChild(colPaymDate);

      let lblpaymdate = createElement("label", { id: "lblPaymDate" + id });
      document.getElementById("colPaymDate" + id).appendChild(lblpaymdate);
      document.getElementById("lblPaymDate" + id).innerText = "วันที่จ่าย";

      let icon = createElement("div", {
        id: "icon" + id,
        className: "input-icons"
      });
      document.getElementById("colPaymDate" + id).appendChild(icon);

      let fa = createElement("i", {
        id: "fa" + id,
        className: "fa fa-calendar icon"
      });
      document.getElementById("icon" + id).appendChild(fa);

      let inputDate = createElement("input", {
        id: "paymDate" + id,
        type: "text",
        className: "form-control flatpickr",
        style: "background-color: white; padding-left: 30px;"
      });
      document.getElementById("icon" + id).appendChild(inputDate);
      //  var elePaymDate = document.getElementById('paymDate' + id);
      //  elePaymDate.onchange = function() {onchangePaymDate(this.value, id); };

      flatpickr("#paymDate" + id, {
        locale: "th",
        dateFormat: "d/m/Y",
        defaultDate: dateFormatSlace(object.TransDate.substring(0, 10))
      });

      //---------------------------------------- งวด -------------------------------------------------

      let colinstall = createElement("div", {
        id: "colinstallment" + id,
        className: "col-sm-2"
      });
      document.getElementById("row" + id).appendChild(colinstall);

      let groupinstall = createElement("div", {
        id: "groupinstallment" + id,
        className: "form-group"
      });
      document.getElementById("colinstallment" + id).appendChild(groupinstall);

      let lblinstall = createElement("label", { id: "lblinstallment" + id });
      document.getElementById("groupinstallment" + id).appendChild(lblinstall);
      document.getElementById("lblinstallment" + id).innerText = "งวด";

      let sInstall = createElement("select", {
        id: "installment" + id,
        className: "form-control select2bs4",
        style: "width: 100%;",
        value: 0
      });
      document.getElementById("groupinstallment" + id).appendChild(sInstall);
      var eleinstallment = document.getElementById("installment" + id);
      eleinstallment.onchange = function () {
        onchangeInstallment(this.value, id);
      };

      //---------------------------------------- มูลค่า -------------------------------------------------

      let colamount = createElement("div", {
        id: "colamount" + id,
        className: "col-sm-3"
      });
      document.getElementById("row" + id).appendChild(colamount);

      let groupAmount = createElement("div", {
        id: "groupAmount" + id,
        className: "form-group"
      });
      document.getElementById("colamount" + id).appendChild(groupAmount);

      let lblAmount = createElement("label", { id: "lblAmount" + id });
      document.getElementById("groupAmount" + id).appendChild(lblAmount);
      document.getElementById("lblAmount" + id).innerText = "มูลค่า";

      let inputAmount = createElement("input", {
        id: "payment" + id,
        className: "form-control",
        value: object.Amount,
        type: "number",
        min: 0
      });
      document.getElementById("groupAmount" + id).appendChild(inputAmount);
      var elepayment = document.getElementById("payment" + id);
      elepayment.onchange = function () {
        onchangePayment(this.value, id);
      };
      elepayment.oninput = function () {
        this.value = Math.abs(this.value);
      };

      //---------------------------------------- button delete -------------------------------------------------

      let coldelete = createElement("div", {
        id: "coldelete" + id,
        className: "col-sm-1"
      });
      document.getElementById("row" + id).appendChild(coldelete);

      let groupdelete = createElement("div", {
        id: "groupdelete" + id,
        className: "form-group",
        style: "margin-top: 25px;"
      });
      document.getElementById("coldelete" + id).appendChild(groupdelete);

      let linkDelete = createElement("a", {
        id: "linkDelete" + id,
        style: "cursor: pointer;"
      });
      document.getElementById("groupdelete" + id).appendChild(linkDelete);
      var elelinkdelete = document.getElementById("linkDelete" + id);
      elelinkdelete.onclick = function () {
        deleteGroup(
          "groupDeposit" + elelinkdelete.id.substring(10, 13),
          `${object.RecId}`
        );
      };

      let imgDelete = createElement("img", {
        id: "imgDelete" + id,
        src: "../images/1398920_red circle_close_cross_cancel_remove_icon.png"
      });
      document.getElementById("linkDelete" + id).appendChild(imgDelete);

      let linkCancel = createElement("a", {
        id: "linkCancel" + id,
        style: "cursor: pointer; display: none;"
      });
      document.getElementById("groupdelete" + id).appendChild(linkCancel);

      let imgCancel = createElement("img", {
        id: "imgCancel" + id,
        style: "cursor: pointer; with: 48px; height: 48px",
        src: "../images/vecteezy_cancelled-rubber-stamp-on-white-background-vector-illustration_19495927.jpg"
      });
      document.getElementById("groupdelete" + id).appendChild(imgCancel);
      var eleimgcancel = document.getElementById("imgCancel" + id);
      eleimgcancel.onclick = function () {
        detailCancelDeposit(
          elecancel.id.substring(9, 11),
          object.CancelDate.substring(0, 10),
          object.CancelRemark
        );
      };

      //---------------------------------------- button print -------------------------------------------------

      let coldprint = createElement("div", {
        id: "coldprint" + id,
        className: "col-sm-1"
      });
      document.getElementById("row" + id).appendChild(coldprint);

      let groupprint = createElement("div", {
        id: "groupprint" + id,
        className: "form-group",
        style: "margin-top: 35px;"
      });
      document.getElementById("coldprint" + id).appendChild(groupprint);

      let linkPrint = createElement("a", {
        id: "linkPrint" + id,
        style: "cursor: pointer;"
      });
      document.getElementById("groupprint" + id).appendChild(linkPrint);
      var elelinkprint = document.getElementById("linkPrint" + id);
      elelinkprint.onclick = function () {
        printDeposit(object.RecId);
      };

      let imgPrint = createElement("img", {
        id: "imgPrint" + id,
        src: "../images/image_print_outline.png"
      });
      document.getElementById("linkPrint" + id).appendChild(imgPrint);

      //---------------------------------------- button cancel -------------------------------------------------

      let colcancel = createElement("div", {
        id: "colcancel" + id,
        className: "col-sm-1"
      });
      document.getElementById("row" + id).appendChild(colcancel);

      let groupcancel = createElement("div", {
        id: "groupcancel" + id,
        className: "form-group",
        style: "margin-top: 38px;"
      });
      document.getElementById("colcancel" + id).appendChild(groupcancel);

      let btnCancel = createElement("button", {
        id: "btnCancel" + id,
        className: "btn btn-block btn-outline-info btn-xs",
        style: "margin-top: 38px;"
      });
      document.getElementById("groupcancel" + id).appendChild(btnCancel);
      var elecancel = document.getElementById("btnCancel" + id);
      elecancel.onclick = function () {
        cancelDeposit(elecancel.id.substring(9, 11));
      };
      elecancel.innerText = "Cancel";

      //---------------------------------------- remark -------------------------------------------------

      let rowRemark = createElement("div", {
        id: "rowRemark" + id,
        className: "row"
      });
      document.getElementById("groupDeposit" + id).appendChild(rowRemark);

      let colempty = createElement("div", {
        id: "colempty" + id,
        className: "col-sm-1"
      });
      document.getElementById("rowRemark" + id).appendChild(colempty);

      let colRemark = createElement("div", {
        id: "colRemark" + id,
        className: "col-sm-11"
      });
      document.getElementById("rowRemark" + id).appendChild(colRemark);

      let groupRemark = createElement("div", {
        id: "groupRemark" + id,
        className: "form-group"
      });
      document.getElementById("colRemark" + id).appendChild(groupRemark);

      let inputRemark = createElement("input", {
        id: "remark" + id,
        className: "form-control",
        type: "text",
        value: object.Remark,
        placeholder: "หมายเหตุ"
      });
      document.getElementById("groupRemark" + id).appendChild(inputRemark);
      var eleremark = document.getElementById("remark" + id);
      eleremark.onchange = function () {
        onchangeRemark(this.value, eleremark.id.substring(6, 8));
      };

      document.getElementById("countDeposit").value = id;
      onchangeInstallment(0, id);
      refreshSequence(`CURRSEQ`);

      checkCancelDeposit(object.Cancel, id);
      if (object.Cancel == 1) {
        amountCancel += object.Amount;
        depositNum++;
      }
      //แก้ไข มัดจำ ได้ภายในวันที่สร้างเท่านั้น
      allowEditDeposit(object.AllowEdit, id);
      enableControl(id, object.Cancel);

      // flatpickr("#paymDate" + id, {
      //     locale: 'th',
      //     dateFormat: "d/m/Y",
      //     defaultDate : dateFormatSlace(object.TransDate.substring(0,10))
      //   })
      //   document.getElementById("paymDate" + id).setAttribute('value', dateFormatSlace(object.TransDate.substring(0,10)));

      deposit_arr.push(document.getElementById("cardDeposit").innerHTML);
    }
    id++;
  });
}

function dateFormatSlace(date) {
  var d = new Date(date);
  let y = d.getFullYear();
  let _date =
    d.getDate().toLocaleString("th-TH", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "/" +
    (d.getMonth() + 1).toLocaleString("th-TH", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "/" +
    y;
  return _date;
}

function enableControl(id, cancel) {
  //2 Manager, 3 Area
  if (userAccountType > 1) {
    if (cancel == 0)
      document.getElementById("btnCancel" + id).style.display = "block";
    else document.getElementById("btnCancel" + id).style.display = "none";
  } else {
    document.getElementById("btnCancel" + id).style.display = "none";
  }
}

function addCardDeposit(event) {
  let cardHTML = "";
  let id = parseInt(document.getElementById("countDeposit").value) + 1;
  let id2 = parseInt(document.getElementById("countDepositBox").value) + 1;

  if (onchangePayment("btnAddEdit", 0) == false) return;

  if (id2 <= depositNum) {
    if (id2 == 1)
      document.getElementById("cardDeposit").style.display = "block";

    let ul = createElement("ul", {
      id: "groupDeposit" + id,
      className: "list-group list-group-flush"
    });
    document.getElementById("cardDeposit").appendChild(ul);

    let row = createElement("div", { id: "row" + id, className: "row" });
    document.getElementById("groupDeposit" + id).appendChild(row);

    let seq = createElement("div", {
      id: "seq" + id,
      className: "col-sm-1",
      style: "text-align: center;"
    });
    document.getElementById("row" + id).appendChild(seq);

    let group = createElement("div", {
      id: "group" + id,
      className: "form-group",
      style: "margin-bottom: 0;"
    });
    document.getElementById("seq" + id).appendChild(group);

    let label = createElement("label", { id: "label" + id });
    document.getElementById("group" + id).appendChild(label);
    document.getElementById("label" + id).innerText = "ลำดับ";

    let group2 = createElement("div", {
      id: "grouplbl" + id,
      className: "form-group"
    });
    document.getElementById("seq" + id).appendChild(group2);

    let curseq = createElement("label", { id: "CURRSEQ" + id });
    document.getElementById("grouplbl" + id).appendChild(curseq);
    document.getElementById("CURRSEQ" + id).innerText = id.toString();

    let seq2 = createElement("label", {
      id: "SEQ" + id,
      style: "display:none;"
    });
    document.getElementById("grouplbl" + id).appendChild(seq2);
    document.getElementById("SEQ" + id).innerText = id.toString();

    let lblRecId = createElement("label", {
      id: "RECID" + id,
      style: "display:none;"
    });
    document.getElementById("grouplbl" + id).appendChild(lblRecId);
    document.getElementById("RECID" + id).innerText = 0;

    //------------------------------- วันที่จ่าย ---------------------------------------------

    let colPaymDate = createElement("div", {
      id: "colPaymDate" + id,
      className: "col-sm-3"
    });
    document.getElementById("row" + id).appendChild(colPaymDate);

    let lblpaymdate = createElement("label", { id: "lblPaymDate" + id });
    document.getElementById("colPaymDate" + id).appendChild(lblpaymdate);
    document.getElementById("lblPaymDate" + id).innerText = "วันที่จ่าย";

    let icon = createElement("div", {
      id: "icon" + id,
      className: "input-icons"
    });
    document.getElementById("colPaymDate" + id).appendChild(icon);

    let fa = createElement("i", {
      id: "fa" + id,
      className: "fa fa-calendar icon"
    });
    document.getElementById("icon" + id).appendChild(fa);

    let inputDate = createElement("input", {
      id: "paymDate" + id,
      type: "text",
      className: "form-control flatpickr",
      style: "background-color: white; padding-left: 30px;"
    });
    document.getElementById("icon" + id).appendChild(inputDate);
    var elePaymDate = document.getElementById("paymDate" + id);
    elePaymDate.onchange = function () {
      onchangePaymDate(this.value, id);
    };

    flatpickr("#paymDate" + id, {
      locale: "th",
      dateFormat: "d/m/Y"
      //defaultDate : '09/09/2023'
    });

    //---------------------------------------- งวด -------------------------------------------------

    let colinstall = createElement("div", {
      id: "colinstallment" + id,
      className: "col-sm-2"
    });
    document.getElementById("row" + id).appendChild(colinstall);

    let groupinstall = createElement("div", {
      id: "groupinstallment" + id,
      className: "form-group"
    });
    document.getElementById("colinstallment" + id).appendChild(groupinstall);

    let lblinstall = createElement("label", { id: "lblinstallment" + id });
    document.getElementById("groupinstallment" + id).appendChild(lblinstall);
    document.getElementById("lblinstallment" + id).innerText = "งวด";

    let sInstall = createElement(
      "select",
      {
        id: "installment" + id,
        className: "form-control select2bs4",
        style: "width: 100%;",
        value: 0
      },
      [
        {
          event: "onchange",
          f: function () {
            onchangeInstallment(this.value, id);
          }
        }
      ]
    );
    document.getElementById("groupinstallment" + id).appendChild(sInstall);
    document.getElementById("installment" + id).disabled = true;

    //---------------------------------------- มูลค่า -------------------------------------------------

    let colamount = createElement("div", {
      id: "colamount" + id,
      className: "col-sm-3"
    });
    document.getElementById("row" + id).appendChild(colamount);

    let groupAmount = createElement("div", {
      id: "groupAmount" + id,
      className: "form-group"
    });
    document.getElementById("colamount" + id).appendChild(groupAmount);

    let lblAmount = createElement("label", { id: "lblAmount" + id });
    document.getElementById("groupAmount" + id).appendChild(lblAmount);
    document.getElementById("lblAmount" + id).innerText = "มูลค่า";

    let inputAmount = createElement("input", {
      id: "payment" + id,
      className: "form-control",
      type: "number",
      min: 0
    });
    document.getElementById("groupAmount" + id).appendChild(inputAmount);
    var elepayment = document.getElementById("payment" + id);
    elepayment.onchange = function () {
      onchangePayment(this.value, id);
    };
    elepayment.oninput = function () {
      this.value = Math.abs(this.value);
    };

    //---------------------------------------- button delete -------------------------------------------------

    let coldelete = createElement("div", {
      id: "coldelete" + id,
      className: "col-sm-1"
    });
    document.getElementById("row" + id).appendChild(coldelete);

    let groupdelete = createElement("div", {
      id: "groupdelete" + id,
      className: "form-group",
      style: "margin-top: 25px;"
    });
    document.getElementById("coldelete" + id).appendChild(groupdelete);

    let linkDelete = createElement("a", {
      id: "linkDelete" + id,
      style: "cursor: pointer;"
    });
    document.getElementById("groupdelete" + id).appendChild(linkDelete);
    var elelinkdelete = document.getElementById("linkDelete" + id);
    elelinkdelete.onclick = function () {
      deleteGroup("groupDeposit" + elelinkdelete.id.substring(10, 13));
    };

    let imgDelete = createElement("img", {
      id: "imgDelete" + id,
      src: "../images/1398920_red circle_close_cross_cancel_remove_icon.png"
    });
    document.getElementById("linkDelete" + id).appendChild(imgDelete);

    //---------------------------------------- remark -------------------------------------------------

    let rowRemark = createElement("div", {
      id: "rowRemark" + id,
      className: "row"
    });
    document.getElementById("groupDeposit" + id).appendChild(rowRemark);

    let colempty = createElement("div", {
      id: "colempty" + id,
      className: "col-sm-1"
    });
    document.getElementById("rowRemark" + id).appendChild(colempty);

    let colRemark = createElement("div", {
      id: "colRemark" + id,
      className: "col-sm-11"
    });
    document.getElementById("rowRemark" + id).appendChild(colRemark);

    let groupRemark = createElement("div", {
      id: "groupRemark" + id,
      className: "form-group"
    });
    document.getElementById("colRemark" + id).appendChild(groupRemark);

    let inputRemark = createElement("input", {
      id: "remark" + id,
      className: "form-control",
      type: "text",
      placeholder: "หมายเหตุ"
    });
    document.getElementById("groupRemark" + id).appendChild(inputRemark);
    var eleremark = document.getElementById("remark" + id);
    eleremark.onchange = function () {
      onchangeRemark(this.value, id);
    };

    document.getElementById("countDeposit").value = id;
    onchangeInstallment(0, id);
    refreshSequence(`CURRSEQ`);
  }
}

function createElement(el, options, listen = []) {
  let element = document.createElement(el);

  Object.keys(options).forEach(function (k) {
    element[k] = options[k];
  });
  if (listen.length > 0) {
    listen.forEach(function (l) {
      element.addEventListener(l.event, l.f);
    });
  }
  return element;
}

function addCardDeposit2(event) {
  let cardHTML = "";
  let id = parseInt(document.getElementById("countDeposit").value) + 1;
  let id2 = parseInt(document.getElementById("countDepositBox").value) + 1;

  if (onchangePayment("btnAddEdit", 0) == false) return;

  if (id2 <= depositNum) {
    if (id2 == 1)
      document.getElementById("cardDeposit").style.display = "block";

    //cardHTML += document.getElementById("cardDeposit").innerHTML;
    cardHTML += `
                            <ul class="list-group list-group-flush" id="groupDeposit${id}">
                                <div class="row">
                    
                                    <div class="col-sm-1" style="text-align: center;">
                                        <div class="form-group" style="margin-bottom: 0;">
                                            <label>ลำดับ</label>
                                        </div>
                                        <div class="form-group">
                                            <label id="CURRSEQ${id}">${id}</label>
                                            <label id="SEQ${id}" style="display:none;">${id}</label>
                                            <label id="RECID${id}" style="display:none;">0</label>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label for="paymDate${id}">วันที่จ่าย</label>
                                            <div class="input-icons">
                                                <i class="fa fa-calendar icon"></i>
                                                <input type="text" id="paymDate${id}" class="form-control flatpickr"
                                                    style="background-color: white; padding-left: 30px;" 
                                                    onchange="onchangePaymDate(this.value, ${id});">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <div class="form-group">
                                            <label for="installment${id}">งวด</label>
                                            <select id="installment${id}" class="form-control select2bs4" 
                                            style="width: 100%;" value="0" disabled
                                            onchange="onchangeInstallment(this.value, ${id});"
                                            >
                                              
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label for="payment${id}">มูลค่า</label>
                                            <input type="number" id="payment${id}" class="form-control" min="0" oninput="this.value = Math.abs(this.value)"
                                            onchange="onchangePayment(this.value, ${id})">
                                        </div>
                                    </div>
                                    <div class="col-sm-1">
                                        <div class="form-group" style="margin-top: 25px;">
                                            <a id="linkDelete${id}" style="cursor: pointer; " 
                                                onclick="deleteGroup('groupDeposit${id}')">
                                                <img src="../images/1398920_red circle_close_cross_cancel_remove_icon.png" alt="Cancel deposit" >
                                            </a>
                                            <!-- <a style="cursor: pointer; with: 64px; height: 64px" onclick="deleteGroup('groupDeposit${id}')">
                                                <img style="cursor: pointer; with: 64px; height: 64px" src="../images/vecteezy_canceled-stamp-in-rubber-style-red-round-grunge-canceled_6566276.jpg" alt="Cancel deposit" >
                                            </a> -->
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-11">
                                        <div class="form-group">
                                            <input type="text" id="remark${id}" class="form-control" placeholder="หมายเหตุ"
                                            onchange="onchangeRemark(this.value, ${id})">
                                        </div>
                                    </div>
                                </div>
                            </ul>
                            </div>
    
                            <div id="groupDepositCancel${id}" ></div>
                            `;
    deposit_arr.push(cardHTML);

    document.getElementById("cardDeposit").innerHTML = [...deposit_arr];
    document.getElementById("countDeposit").value = id;
    onchangeInstallment(0, id);
    refreshSequence(`CURRSEQ`);

    const elements = document.querySelectorAll(`[id^="paymDate"]`);
    elements.forEach((element) => {
      let date = document.getElementById(element.id).value;

      if (date == "") {
      } else {
        flatpickr(element.id, {
          locale: "th",
          dateFormat: "d/m/Y",
          defaultDate: date
        });
        document.getElementById(element.id).setAttribute("value", date);
      }
    });

    flatpickr("paymDate" + id, {
      locale: "th",
      dateFormat: "d/m/Y",
      defaultDate: "09/09/2023"
    });
  }
}

function refreshSequence(name) {
  //refresh ลำดับ
  let i = 1;
  const eleSeries = document.querySelectorAll(`[id*="${name}"]`);
  eleSeries.forEach((eleSeries) => {
    document.getElementById(eleSeries.id).innerText = i;
    i++;
  });

  let j = i;
  document.getElementById("countDepositBox").setAttribute("value", j - 1);
}

function cancelDeposit(id) {
  let recid = document.getElementById("RECID" + id).innerText;
  let date = document.getElementById("paymDate" + id).value;
  let installment = document.getElementById("installment" + id).value;
  let amount = document.getElementById("payment" + id).value;

  Swal.fire({
    title: "ยืนยันยกเลิก",

    html: `<div class="invoice p-3 mb-3" style="background-color:#EFEFEF;">
                    <div class="row">
                        <div class="col-12">
                            <h4>เงินมัดจำงวดที่ ${installment} </h4>
                        </div>
                    </div>

                    <div class="row invoice-info">
                        <div class="col-sm-12 invoice-col">
                            <b>วันที่จ่าย : ${date} มูลค่า : ${amount}</b>
                        </div>
                        <input type="text" id="recid-cancel" value="${recid}" class="form-control" 
                            style="display:none;">
                        <input type="text" id="installment-cancel" value="${installment}" class="form-control" 
                            style="display:none;">
                        <input type="text" id="paymDate-cancel" value="${date}" class="form-control" 
                            style="display:none;">
                        <input type="text" id="payment-cancel" value="${amount}" class="form-control" 
                            style="display:none;">
                    </div>
                </div> 
         <input type="text" id="remark-cancel" class="form-control" placeholder="หมายเหตุ ยกเลิก">`,
    text: "คุณต้องการยกเลิกงวดมัดจำหรือไม่",
    focusConfirm: false,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    preConfirm: () => {
      const recid = Swal.getPopup().querySelector("#recid-cancel").value;
      const installment = Swal.getPopup().querySelector(
        "#installment-cancel"
      ).value;
      const paymDate = Swal.getPopup().querySelector("#paymDate-cancel").value;
      const payment = Swal.getPopup().querySelector("#payment-cancel").value;
      const remark = Swal.getPopup().querySelector("#remark-cancel").value;

      if (!remark) {
        Swal.showValidationMessage(`กรุณาใส่หมายเหตุ ยกเลิก`);
      }
      return {
        RecId: recid,
        Installment: installment,
        PaymDate: paymDate,
        Payment: payment,
        Remark: remark
      };
    }
  }).then((result) => {
    if (result.dismiss !== "backdrop" && result.dismiss !== "cancel") {
      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", API_DEPOSIT_CANCEL);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          CancelRemark: result.value.Remark,
          RecId: result.value.RecId
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            checkCancelDeposit(true, id);

            Swal.fire("ยกเลิกงวดมัดจำสำเร็จ", "success").then(() => {});
          } else {
            Swal.fire({
              icon: "error",
              title: objects.Status
            });
          }
        }
      };
    }
  });
}

function detailCancelDeposit(id, datecancel, remark) {
  let date = document.getElementById("paymDate" + id).value;
  let installment = document.getElementById("installment" + id).value;
  let amount = document.getElementById("payment" + id).value;

  Swal.fire({
    title: "ยกเลิก",

    html: `<div class="invoice p-3 mb-3" style="background-color:#EFEFEF;">
                    <div class="row">
                        <div class="col-12">
                            <h4>เงินมัดจำงวดที่ ${installment} </h4>
                        </div>
                    </div>

                    <div class="row invoice-info">
                        <div class="col-sm-12 invoice-col">
                            <b>วันที่ทำการยกเลิก : ${datecancel} </b> <br>
                            <b>วันที่จ่าย : ${date} มูลค่า : ${amount}</b> <br>
                            <b>หมายเหตุ : ${remark}</b> 
                        </div>
                    </div>
                </div> 
         `,
    focusConfirm: false,
    icon: "info"
  }).then((result) => {});
}

function checkCancelDeposit(check, id) {
  if (check) {
    document.getElementById("linkDelete" + id).style.display = "none";
    document.getElementById("imgCancel" + id).style.display = "block";
    document.getElementById("btnCancel" + id).style.display = "none";

    document
      .getElementById("paymDate" + id)
      .setAttribute("disabled", "disabled");
    document.getElementById("paymDate" + id).style.backgroundColor = "#EBEDEF";
    document
      .getElementById("installment" + id)
      .setAttribute("disabled", "disabled");
    document
      .getElementById("payment" + id)
      .setAttribute("disabled", "disabled");
    document.getElementById("remark" + id).setAttribute("disabled", "disabled");
  } else {
    document.getElementById("imgCancel" + id).style.display = "none";
  }
}

function allowEditDeposit(allowEdit, id) {
  if (userAccountType > 1) allowEdit = 1;
  if (allowEdit == 0) {
    document.getElementById("paymDate" + id).disabled = true;
    document.getElementById("paymDate" + id).style.backgroundColor = "#EBEDEF";
    document.getElementById("payment" + id).disabled = true;
    document.getElementById("remark" + id).disabled = true;

    document.getElementById("linkDelete" + id).style.display = "none";
  }

  document.getElementById("installment" + id).disabled = true;
}

function deleteGroup(name, recid) {
  Swal.fire({
    title: "ยืนยันลบรายการ",
    html: `<label>คุณต้องการลบรายการเงินมัดจำนี้หรือไม่?</label> <br> 
        <input type="text" id="recid-delete" class="form-control" style="display:none;" value="${recid}">`,
    text: "คุณต้องการลบงวดมัดจำหรือไม่",
    focusConfirm: false,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    preConfirm: () => {
      const recid = Swal.getPopup().querySelector("#recid-delete").value;
      return { RecId: recid };
    }
  }).then((result) => {
    if (result.dismiss !== "backdrop" && result.dismiss !== "cancel") {
      if (result.value.RecId > 0) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", API_DEPOSIT_DELETE);
        xhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xhttp.send(
          JSON.stringify({
            RecId: result.value.RecId
          })
        );
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            if (objects.Status == "OK") {
              document.getElementById(name).remove();
              refreshSequence(`CURRSEQ`);
              if (
                parseInt(document.getElementById("countDepositBox").value) == 0
              )
                document.getElementById("cardDeposit").style.display = "none";

              // Swal.fire(
              //     'ยกเลิกงวดมัดจำสำเร็จ',
              //     'success'
              //     ).then(() => {
              // });
            } else {
              Swal.fire({
                icon: "error",
                title: objects.Status
              });
            }
          }
        };
      } else {
        document.getElementById(name).remove();
        refreshSequence(`CURRSEQ`);
        if (parseInt(document.getElementById("countDepositBox").value) == 0)
          document.getElementById("cardDeposit").style.display = "none";
      }
    }
  });
}

function printDeposit(recId) {
  window.open(
    `https://starmark.work/Orderonlinereports/Report/PrintTemporaryReceipt/${recId}`,
    "_blank",
    "location=yes,height=570,width=520,scrollbars=yes,status=yes"
  );
}

function onchangePaymDate(value, id) {
  var elePaymDate = document.getElementById("paymDate" + id);
  elePaymDate.setAttribute("value", elePaymDate.value);
}

function onchangeInstallment(value, id) {
  let i = 1;
  var trHTML = "";
  const elements = document.querySelectorAll(`[id^="installment"]`);
  elements.forEach((element) => {
    let val = document.getElementById(element.id).value;
    if (val == "") {
      trHTML = `<option value="${i}" selected>งวดที่ ${i}</option>`;
    } else i++;
  });
  document.getElementById(`installment` + id).innerHTML = trHTML;
}

function onchangePayment(value, id) {
  let ret = true;
  let amount = document.getElementById("amount").value; //ยอดเงินรวม
  let total = 0;
  const elements = document.querySelectorAll(`[id^="payment"]`); //มูลค่ามัดจำ
  elements.forEach((element) => {
    let val = parseInt(document.getElementById(element.id).value);
    total += val;
  });

  total = total - amountCancel; //ตัดยอดเงินที่ cancel

  if (value == "btnAddEdit") {
    if (amount == 0) {
      warning_message(
        "โปรดระบุยอดเงินรวม",
        "กรุณาระบุยอดเงินรวมก่อนทำการเพิ่มงวดมัดจำ"
      );
      ret = false;
    } else if (amount == total) {
      warning_message("มัดจำครบแล้ว", "คุณเก็บเงินมัดจำครบตามยอดเงินรวมแล้ว");
      ret = false;
    } else if (total > amount) {
      warning_message(
        "มูลค่ามากกว่าที่กำหนด",
        "คุณระบุมูลค่าเกิน " + amount + " จากยอดเงินรวม"
      );
      ret = false;
    }
  } else {
    if (parseFloat(total) > parseFloat(amount)) {
      document.getElementById("payment" + id).value = 0;
      document.getElementById("payment" + id).setAttribute("value", 0);
      warning_message(
        "มูลค่ามากกว่าที่กำหนด",
        "คุณระบุมูลค่าเกิน " + amount + " จากยอดเงินรวม"
      );
      ret = false;
    } else document.getElementById("payment" + id).setAttribute("value", value);
  }
  return ret;
}

function onchangeRemark(value, id) {
  document.getElementById("remark" + id).setAttribute("value", value);
}

function loadEmployee(selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_EMPLOYEE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      var trHTML = "";
      const objects = JSON.parse(this.responseText);
      trHTML += `<option value="" selected="selected">------ None ------</option>`;
      for (let object of objects) {
        let _number = object["PersonnelNumber"];
        let _name = object["Name"];
        let _department = object["Department"];
        if (selected == _number)
          trHTML += `<option value="${_number}" selected>${_number} (${_name}) </option>`;
        else
          trHTML += `<option value="${_number}">${_number} (${_name})</option>`;
      }
      document.getElementById("personnelNumber").innerHTML = trHTML;
    }
  };
}

function loadStore(selected, user, type) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_STORE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      name: user,
      type: type
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      var trHTML = "";

      const objects = JSON.parse(this.responseText);
      trHTML += `<option value="" selected="selected">------ None ------</option>`;
      for (let object of objects) {
        let _store = object["StoreId"];

        if (selected == _store)
          trHTML += `<option value="${_store}" selected>${_store} (${object["StoreName"]})</option>`;
        else
          trHTML += `<option value="${_store}">${_store} (${object["StoreName"]})</option>`;
      }
      document.getElementById("store").innerHTML = trHTML;
    }
  };
}

function loadPools(selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_POOLS);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      recid: recId
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      var trHTML = "";
      const objects = JSON.parse(this.responseText);
      //trHTML += `<option value="" selected="selected">------ None ------</option>`;
      for (let object of objects) {
        let _pool = object["PoolId"];
        let _pools = object["Pools"];

        if (selected !== "AddOrder" && (selected == _pool || _pools == 1))
          trHTML += `<option value="${_pool}" selected>${_pool} (${object["Name"]})</option>`;
        else
          trHTML += `<option value="${_pool}">${_pool} (${object["Name"]})</option>`;
      }
      document.getElementById("pool").innerHTML = trHTML;
    }
  };
}

function loadRegion(selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_REGION);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      var trHTML = "";
      const objects = JSON.parse(this.responseText);
      trHTML += `<option value="" selected="selected">------ None ------</option>`;
      for (let object of objects) {
        let _id = object["RegionId"];
        let _name = object["Name"];

        if (selected == _id)
          trHTML += `<option value="${_id}" selected>${_name}</option>`;
        else trHTML += `<option value="${_id}">${_name}</option>`;
      }
      document.getElementById("region").innerHTML = trHTML;
    }
  };
}

function loadProvince(selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_PROVINCE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      const objects = JSON.parse(this.responseText);
      trHTML += `<option value="" selected="selected">------ None ------</option>`;
      for (let object of objects) {
        let _id = object["ProvinceId"];
        let _name = object["Name_TH"];

        if (selected == _id)
          trHTML += `<option value="${_id}" selected>${_name}</option>`;
        else trHTML += `<option value="${_id}">${_name}</option>`;
      }
      document.getElementById("province").innerHTML = trHTML;
    }
  };
}

function getRegion(province) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_GETREGION);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  //xhttp.send();
  xhttp.send(
    JSON.stringify({
      id: province
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        let _regionId = object["RegionId"];
        let _name = object["Name"];

        document.getElementById("region").value = _regionId;
        document.getElementById(
          "region"
        ).innerHTML = `<option value="${_regionId}" selected="selected">${_name}</option>`;
      }
    }
  };
}

function findAddress(value) {
  if (value) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", API_ADDRESS_ZIPCODE + value);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        let HTMLDistrict;
        if (data.length > 0) {
          HTMLDistrict += `<option value="None"></option>`;
          data.map((row) => {
            HTMLDistrict += `<option value="${row.District}">${row.District}</option>`;
          });

          loadAddressProvince(data[0].State);
          loadAddressCity(data[0].State, data[0].City);

          document.getElementById("addressDistrict").innerHTML = HTMLDistrict;
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่พบข้อมูล"
          });
        }
      }
    };
  } else {
    loadAddressProvince("");
    document.getElementById("addressCity").innerHTML = ``;
    document.getElementById("addressDistrict").innerHTML = ``;
  }
}

function loadAddressProvince(selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_ADDRESS_PROVINCE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var HTMLProvince = "";
      const data = JSON.parse(this.responseText);

      if (data.length > 0) {
        HTMLProvince += `<option value="None"></option>`;
        data.map((row) => {
          if (selected == row.State)
            HTMLProvince += `<option value="${row.State}" selected>${row.State}</option>`;
          else
            HTMLProvince += `<option value="${row.State}">${row.State}</option>`;
        });
      }
      document.getElementById("addressProvince").innerHTML = HTMLProvince;
    }
  };
}

function loadAddressDistrict(province, city, selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_ADDRESS_DISTRICT + province + "/" + city);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var HTML = "";
      const data = JSON.parse(this.responseText);

      if (data.length > 0) {
        //document.getElementById("addressZipcode").value = "";
        HTML += `<option value="None"></option>`;

        data.map((row) => {
          if (selected == row.District)
            HTML += `<option value="${row.District}" selected>${row.District}</option>`;
          else
            HTML += `<option value="${row.District}">${row.District}</option>`;
        });

        document.getElementById("addressDistrict").innerHTML = HTML;
      }
    }
  };
}

function loadAddressCity(province, selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_ADDRESS_CITY + province);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var HTML = "";
      const data = JSON.parse(this.responseText);

      if (data.length > 0) {
        HTML += `<option value="None"></option>`;
        data.map((row) => {
          if (selected == row.City)
            HTML += `<option value="${row.City}" selected>${row.City}</option>`;
          else HTML += `<option value="${row.City}">${row.City}</option>`;
        });
      }

      document.getElementById("addressCity").innerHTML = HTML;
    }
  };
}

function loadAddressZipCode(province, city, district) {
  if (district == "None") {
    loadAddressCity(province, city);
    document.getElementById("addressZipcode").value = "";
    document.getElementById("addressCity").value = city;
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open(
      "GET",
      API_ADDRESS_DISTRICT + province + "/" + city + "/" + district
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);

        if (data.length > 0) {
          data.map((row) => {
            document.getElementById("addressZipcode").value = row.Zipcode;
          });
        }
      }
    };
  }
}

function getValue(element) {
  return sessionStorage.getItem(element);
}
function getElementVal(element) {
  return document.getElementById(element).value;
}
function setElementVal(element, selected) {
  document.getElementById(element).value = selected;
}

function warning_message(title, text) {
  Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: false,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "OK"
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
}
