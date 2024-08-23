let title = document.getElementsByTagName("title")[0].innerText;
let userAccountType = localStorage.getItem("type_val"); // 2 Manager

let SERVER_CB_order = "http://starmark.work/OrderOnline_API_Order_test/";
let SERVER_CB_ax = "http://starmark.work/OrderOnline_API_AIF_test/";

//let SERVER_CB_ax = "http://localhost:4377/";
//let SERVER_CB_order = "http://localhost:54871/";

let API_EMPLOYEE = SERVER_CB_order + "api/order/employee";
let API_STORE = SERVER_CB_order + "api/order/stored";
let API_POOLS = SERVER_CB_order + "api/order/pools";
let API_REGION = SERVER_CB_order + "api/order/region";
let API_PROVINCE = SERVER_CB_order + "api/order/province";
let API_GETREGION = SERVER_CB_order + "api/order/findRegion";
let API_DEPOSIT = SERVER_CB_order + "api/order/deposit";
let API_DEPOSIT_DELETE = SERVER_CB_ax + "api/deposit/delete";
let API_DEPOSIT_CANCEL = SERVER_CB_ax + "api/deposit/cancel";

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

  OrderId: getValue("OrderId_val"),
  ShippingCost: getValue("ShippingCost_val"),
  Discount: getValue("Discount_val"),
  InstallTeam: getValue("InstallTeam_val"),
  Free: getValue("Free_val"),
  Remark: getValue("Remark_val"),
  TaxNum: getValue("TaxNum_val"),
  Phone: getValue("Phone_val")
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
  OrderId,
  ShippingCost,
  Discount,
  InstallTeam,
  Free,
  Remark,
  TaxNum,
  Phone
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
    //loadRegion("");
    //loadProvince("");
    loadAddressProvince("addressProvince_inv");
  } else if (title == "Edit Order") {
    setElementVal("recId", recId);
    setElementVal("qty", qty);
    setElementVal("amount", amount);
    setElementVal("custName", custName);
    setElementVal("salesOrder", salesId);
    setElementVal("purchOrder", purchId);
    setElementVal("store", storeId);

    setElementVal("orderId", OrderId);
    setElementVal("shippingcost", ShippingCost);
    setElementVal("discount", Discount);
    setElementVal("installTeam", InstallTeam);
    setElementVal("free", Free);
    setElementVal("remark", Remark);
    setElementVal("taxnum", TaxNum);
    setElementVal("phone", Phone);

    loadEmployee(userId);
    loadStore(
      storeId,
      localStorage.getItem("usr_val"),
      localStorage.getItem("type_val")
    );
    loadPools(pool);
    //loadRegion(region);
    //loadProvince(provinceId);
    loadDeposit(recId);
    setDatePicker("#salesDate", date);

    calculateTotal();
    loadAddress(recId);

  }
};


function readXMLFile(filePath) {
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, true);
    xmlhttp.onload = function () {
      if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
        // Parse the XML response
        const xmlDoc = new DOMParser().parseFromString(
          xmlhttp.response,
          "text/xml"
        );
        resolve(xmlDoc);
      } else {
        reject(new Error("Error loading XML file"));
      }
    };
    xmlhttp.onerror = function () {
      reject(new Error("Error loading XML file"));
    };
    xmlhttp.send();
  });
}

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
      let row = createElement("div", { id: "row" + id, className: "row" });
      let seq = createElement("div", {
        id: "seq" + id,
        className: "col-sm-1",
        style: "text-align: center;"
      });
      let group = createElement("div", {
        id: "group" + id,
        className: "form-group",
        style: "margin-bottom: 0;"
      });
      let label = createElement("label", {
        id: "label" + id,
        innerText: "ลำดับ"
      });
      let group2 = createElement("div", {
        id: "grouplbl" + id,
        className: "form-group"
      });
      let curseq = createElement("label", {
        id: "CURRSEQ" + id,
        innerText: id.toString()
      });
      let seq2 = createElement("label", {
        id: "SEQ" + id,
        innerText: id.toString(),
        style: "display:none;"
      });
      let lblRecId = createElement("label", {
        id: "RECID" + id,
        innerText: object.RecId,
        style: "display:none;"
      });

      document.getElementById("cardDeposit").appendChild(ul);

      ul.appendChild(row);
      row.appendChild(seq);
      seq.appendChild(group);
      group.appendChild(label);
      seq.appendChild(group2);
      group2.appendChild(curseq);
      group2.appendChild(seq2);
      group2.appendChild(lblRecId);

      //------------------------------- วันที่จ่าย ---------------------------------------------

      let colPaymDate = createElement("div", {
        id: "colPaymDate" + id,
        className: "col-sm-3"
      });
      let lblpaymdate = createElement("label", {
        id: "lblPaymDate" + id,
        innerText: "วันที่จ่าย"
      });
      let icon = createElement("div", {
        id: "icon" + id,
        className: "input-icons"
      });
      let fa = createElement("i", {
        id: "fa" + id,
        className: "fa fa-calendar icon"
      });
      let inputDate = createElement("input", {
        id: "paymDate" + id,
        type: "text",
        className: "form-control flatpickr",
        style: "background-color: white; padding-left: 30px;"
      });

      row.appendChild(colPaymDate);
      colPaymDate.appendChild(lblpaymdate);
      colPaymDate.appendChild(icon);
      icon.appendChild(fa);
      icon.appendChild(inputDate);

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
      let groupinstall = createElement("div", {
        id: "groupinstallment" + id,
        className: "form-group"
      });
      let lblinstall = createElement("label", {
        id: "lblinstallment" + id,
        innerText: "งวด"
      });
      let sInstall = createElement("select", {
        id: "installment" + id,
        className: "form-control select2bs4",
        style: "width: 100%;",
        value: 0
      });

      row.appendChild(colinstall);
      colinstall.appendChild(groupinstall);
      groupinstall.appendChild(lblinstall);
      groupinstall.appendChild(sInstall);
      sInstall.onchange = function () {
        onchangeInstallment(this.value, id);
      };

      //---------------------------------------- มูลค่า -------------------------------------------------

      let colamount = createElement("div", {
        id: "colamount" + id,
        className: "col-sm-3"
      });
      let groupAmount = createElement("div", {
        id: "groupAmount" + id,
        className: "form-group"
      });
      let lblAmount = createElement("label", {
        id: "lblAmount" + id,
        innerText: "มูลค่า"
      });
      let inputAmount = createElement("input", {
        id: "payment" + id,
        className: "form-control",
        value: object.Amount,
        type: "number",
        min: 0
      });

      row.appendChild(colamount);
      colamount.appendChild(groupAmount);
      groupAmount.appendChild(lblAmount);
      groupAmount.appendChild(inputAmount);
      inputAmount.onchange = function () {
        onchangePayment(this.value, id);
      };
      inputAmount.oninput = function () {
        this.value = Math.abs(this.value);
      };

      //---------------------------------------- button delete -------------------------------------------------

      let coldelete = createElement("div", {
        id: "coldelete" + id,
        className: "col-sm-1"
      });
      let groupdelete = createElement("div", {
        id: "groupdelete" + id,
        className: "form-group",
        style: "margin-top: 25px;"
      });
      let linkDelete = createElement("a", {
        id: "linkDelete" + id,
        style: "cursor: pointer;"
      });
      let imgDelete = createElement("img", {
        id: "imgDelete" + id,
        src: "../images/1398920_red circle_close_cross_cancel_remove_icon.png"
      });
      let linkCancel = createElement("a", {
        id: "linkCancel" + id,
        style: "cursor: pointer; display: none;"
      });
      let imgCancel = createElement("img", {
        id: "imgCancel" + id,
        style: "cursor: pointer; with: 48px; height: 48px",
        src: "../images/vecteezy_cancelled-rubber-stamp-on-white-background-vector-illustration_19495927.jpg"
      });

      row.appendChild(coldelete);
      coldelete.appendChild(groupdelete);
      groupdelete.appendChild(linkDelete);
      linkDelete.onclick = function () {
        deleteGroup(
          "groupDeposit" + linkDelete.id.substring(10, 13),
          `${object.RecId}`
        );
      };

      linkDelete.appendChild(imgDelete);
      groupdelete.appendChild(linkCancel);
      groupdelete.appendChild(imgCancel);
      imgCancel.onclick = function () {
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
      let groupprint = createElement("div", {
        id: "groupprint" + id,
        className: "form-group",
        style: "margin-top: 35px;"
      });
      let linkPrint = createElement("a", {
        id: "linkPrint" + id,
        style: "cursor: pointer;"
      });
      let imgPrint = createElement("img", {
        id: "imgPrint" + id,
        src: "../images/image_print_outline.png"
      });

      row.appendChild(coldprint);
      coldprint.appendChild(groupprint);
      groupprint.appendChild(linkPrint);
      linkPrint.onclick = function () {
        printDeposit(object.RecId);
      };
      linkPrint.appendChild(imgPrint);

      //---------------------------------------- button cancel -------------------------------------------------

      let colcancel = createElement("div", {
        id: "colcancel" + id,
        className: "col-sm-1"
      });
      let groupcancel = createElement("div", {
        id: "groupcancel" + id,
        className: "form-group",
        style: "margin-top: 38px;"
      });
      let btnCancel = createElement("button", {
        id: "btnCancel" + id,
        className: "btn btn-block btn-outline-info btn-xs",
        innerText: "Cancel",
        style: "margin-top: 38px;"
      });

      row.appendChild(colcancel);
      colcancel.appendChild(groupcancel);
      groupcancel.appendChild(btnCancel);
      btnCancel.onclick = function () {
        cancelDeposit(btnCancel.id.substring(9, 11));
      };

      //---------------------------------------- remark -------------------------------------------------

      let rowPaymRemark = createElement("div", {
        id: "rowPaymRemark" + id,
        className: "row"
      });
      let colPaymempty = createElement("div", {
        id: "colPaymempty" + id,
        className: "col-sm-1"
      });
      let colDepositId = createElement("div", {
        id: "colDepositId" + id,
        className: "col-sm-3"
      });
      let groupDepositId = createElement("div", {
        id: "groupDepositId" + id,
        className: "form-group"
      });
      let inputDepositId = createElement("input", {
        id: "inputDepositId" + id,
        className: "form-control",
        type: "text",
        value: object.DepositId,
        disabled: true
      });
      let colPaymRemark = createElement("div", {
        id: "colPaymRemark" + id,
        className: "col-sm-8"
      });
      let groupPaymRemark = createElement("div", {
        id: "groupPaymRemark" + id,
        className: "form-group"
      });
      let inputPaymRemark = createElement("input", {
        id: "inputPaymRemark" + id,
        className: "form-control",
        type: "text",
        value: object.PaymRemark,
        placeholder: "ชำระค่า"
      });

      ul.appendChild(rowPaymRemark);
      rowPaymRemark.appendChild(colPaymempty);
      rowPaymRemark.appendChild(colDepositId);
      colDepositId.appendChild(groupDepositId);
      groupDepositId.appendChild(inputDepositId);
      rowPaymRemark.appendChild(colPaymRemark);
      colPaymRemark.appendChild(groupPaymRemark);
      groupPaymRemark.appendChild(inputPaymRemark);
      inputPaymRemark.onchange = function () {
        onchangeRemark(this.value, inputPaymRemark.id.substring(6, 8));
      };

      //---------------------------------------- remark -------------------------------------------------

      let rowRemark = createElement("div", {
        id: "rowRemark" + id,
        className: "row"
      });
      let colempty = createElement("div", {
        id: "colempty" + id,
        className: "col-sm-1"
      });
      let colRemark = createElement("div", {
        id: "colRemark" + id,
        className: "col-sm-11"
      });
      let groupRemark = createElement("div", {
        id: "groupRemark" + id,
        className: "form-group"
      });
      let inputRemark = createElement("input", {
        id: "remark" + id,
        className: "form-control",
        type: "text",
        value: object.Remark,
        placeholder: "หมายเหตุ"
      });

      ul.appendChild(rowRemark);
      rowRemark.appendChild(colempty);
      rowRemark.appendChild(colRemark);
      colRemark.appendChild(groupRemark);
      groupRemark.appendChild(inputRemark);
      inputRemark.onchange = function () {
        onchangeRemark(this.value, inputRemark.id.substring(6, 8));
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

      // //---------------------------------------- วิธีชำระเงิน -------------------------------------------------

      let rowPaym = createElement("div", {
        className: "row",
        id: "rowPaym" + id,
        style: "padding-left: 50px;"
      });
      let colPaym = createElement("div", {
        className: "col-sm-3",
        id: "colPaym" + id
      });
      let lbl = createElement("label", {
        innerHTML: "วิธีชำระเงิน",
        style: "font-weight: bold;"
      });
      let colPaymCash = createElement("div", {
        className: "col-sm-3",
        id: "colPaymCash" + id
      });
      let chkPaymCash = createElement("input", {
        type: "checkbox",
        id: "chkPaymCash" + id,
        checked: object.PaymType == 1 ? true : false,
        class: "form-group"
      });
      let lblCash = createElement("label", {
        innerHTML: "เงินสด",
        style: "padding-left: 5px;"
      });

      let colPaymCheque = createElement("div", {
        className: "col-sm-3",
        id: "colPaymCheque" + id
      });
      let chkPaymCheque = createElement("input", {
        type: "checkbox",
        id: "chkPaymCheque" + id,
        checked: object.PaymType == 2 ? true : false,
        class: "form-group"
      });
      let lblCheque = createElement("label", {
        innerHTML: "เช็คธนาคาร",
        style: "padding-left: 5px;"
      });

      let colPaymCredit = createElement("div", {
        className: "col-sm-3",
        id: "colPaymCredit" + id
      });
      let chkPaymCredit = createElement("input", {
        type: "checkbox",
        id: "chkPaymCredit" + id,
        checked: object.PaymType == 3 ? true : false,
        class: "form-group"
      });
      let lblCredit = createElement("label", {
        innerHTML: "บัตรเครดิต",
        style: "padding-left: 5px;"
      });

      ul.appendChild(rowPaym);
      rowPaym.appendChild(colPaym);
      colPaym.appendChild(lbl);
      rowPaym.appendChild(colPaymCash);
      colPaymCash.appendChild(chkPaymCash);
      chkPaymCash.onchange = function () {
        let seq = this.id.substring(11, 12);
        createPaymentCash(this.checked, seq, object);
      };

      colPaymCash.appendChild(lblCash);
      rowPaym.appendChild(colPaymCheque);
      colPaymCheque.appendChild(chkPaymCheque);
      chkPaymCheque.onchange = function () {
        let seq = this.id.substring(13, 14);
        createPaymentCheque(this.checked, seq, object);
      };

      colPaymCheque.appendChild(lblCheque);
      rowPaym.appendChild(colPaymCredit);
      colPaymCredit.appendChild(chkPaymCredit);
      chkPaymCredit.onchange = function () {
        let seq = this.id.substring(13, 14);
        createPaymentCreditCard(this.checked, seq, object);
      };
      colPaymCredit.appendChild(lblCredit);

      if (object.PaymType == 1) {
        createPaymentCash(true, id, object);
      } else if (object.PaymType == 2) {
        createPaymentCheque(true, id, object);
      } else if (object.PaymType == 3) {
        createPaymentCreditCard(true, id, object);
      }
    }
    id++;
  });
}

function addCardDeposit_original(event) {
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
    let row = createElement("div", { id: "row" + id, className: "row" });
    let seq = createElement("div", {
      id: "seq" + id,
      className: "col-sm-1",
      style: "text-align: center;"
    });
    let group = createElement("div", {
      id: "group" + id,
      className: "form-group",
      style: "margin-bottom: 0;"
    });
    let label = createElement("label", {
      id: "label" + id,
      innerText: "ลำดับ"
    });
    let group2 = createElement("div", {
      id: "grouplbl" + id,
      className: "form-group"
    });
    let curseq = createElement("label", {
      id: "CURRSEQ" + id,
      innerText: id.toString()
    });
    let seq2 = createElement("label", {
      id: "SEQ" + id,
      innerText: id.toString(),
      style: "display:none;"
    });
    let lblRecId = createElement("label", {
      id: "RECID" + id,
      innerText: 0,
      style: "display:none;"
    });

    document.getElementById("cardDeposit").appendChild(ul);
    ul.appendChild(row);
    row.appendChild(seq);
    seq.appendChild(group);
    group.appendChild(label);
    seq.appendChild(group2);
    group2.appendChild(curseq);
    group2.appendChild(seq2);
    group2.appendChild(lblRecId);

    //------------------------------- วันที่จ่าย ---------------------------------------------

    let colPaymDate = createElement("div", {
      id: "colPaymDate" + id,
      className: "col-sm-3"
    });
    let lblpaymdate = createElement("label", {
      id: "lblPaymDate" + id,
      innerText: "วันที่จ่าย"
    });
    let icon = createElement("div", {
      id: "icon" + id,
      className: "input-icons"
    });
    let fa = createElement("i", {
      id: "fa" + id,
      className: "fa fa-calendar icon"
    });
    let inputDate = createElement("input", {
      id: "paymDate" + id,
      type: "text",
      className: "form-control flatpickr",
      style: "background-color: white; padding-left: 30px;"
    });

    row.appendChild(colPaymDate);
    colPaymDate.appendChild(lblpaymdate);
    colPaymDate.appendChild(icon);
    icon.appendChild(fa);
    icon.appendChild(inputDate);
    inputDate.onchange = function () {
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
    let groupinstall = createElement("div", {
      id: "groupinstallment" + id,
      className: "form-group"
    });
    let lblinstall = createElement("label", {
      id: "lblinstallment" + id,
      innerText: "งวด"
    });
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

    row.appendChild(colinstall);
    colinstall.appendChild(groupinstall);
    groupinstall.appendChild(lblinstall);
    groupinstall.appendChild(sInstall);
    sInstall.disabled = true;

    //---------------------------------------- มูลค่า -------------------------------------------------

    let colamount = createElement("div", {
      id: "colamount" + id,
      className: "col-sm-3"
    });
    let groupAmount = createElement("div", {
      id: "groupAmount" + id,
      className: "form-group"
    });
    let lblAmount = createElement("label", {
      id: "lblAmount" + id,
      innerText: "มูลค่า"
    });
    let inputAmount = createElement("input", {
      id: "payment" + id,
      className: "form-control",
      type: "number",
      min: 0
    });

    row.appendChild(colamount);
    colamount.appendChild(groupAmount);
    groupAmount.appendChild(lblAmount);
    groupAmount.appendChild(inputAmount);
    inputAmount.onchange = function () {
      onchangePayment(this.value, id);
    };
    inputAmount.oninput = function () {
      this.value = Math.abs(this.value);
    };

    //---------------------------------------- button delete -------------------------------------------------

    let coldelete = createElement("div", {
      id: "coldelete" + id,
      className: "col-sm-1"
    });
    let groupdelete = createElement("div", {
      id: "groupdelete" + id,
      className: "form-group",
      style: "margin-top: 25px;"
    });
    let linkDelete = createElement("a", {
      id: "linkDelete" + id,
      style: "cursor: pointer;"
    });
    let imgDelete = createElement("img", {
      id: "imgDelete" + id,
      src: "../images/1398920_red circle_close_cross_cancel_remove_icon.png"
    });

    row.appendChild(coldelete);
    coldelete.appendChild(groupdelete);
    groupdelete.appendChild(linkDelete);
    linkDelete.onclick = function () {
      deleteGroup("groupDeposit" + linkDelete.id.substring(10, 13));
    };
    linkDelete.appendChild(imgDelete);

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

    //---------------------------------------- วิธีชำระเงิน -------------------------------------------------

    let rowPaym = createElement("div", {
      className: "row",
      id: "rowPaym" + id,
      style: "padding-left: 50px;"
    });
    let colPaym = createElement("div", {
      className: "col-sm-3",
      id: "colPaym" + id
    });
    let lbl = createElement("label", {
      innerHTML: "วิธีชำระเงิน",
      style: "font-weight: bold;"
    });
    let colPaymCash = createElement("div", {
      className: "col-sm-3",
      id: "colPaymCash" + id
    });
    let chkPaymCash = createElement("input", {
      type: "checkbox",
      id: "chkPaymCash" + id,
      class: "form-group"
    });
    let lblCash = createElement("label", {
      innerHTML: "เงินสด",
      style: "padding-left: 5px;"
    });
    let colPaymCheque = createElement("div", {
      className: "col-sm-3",
      id: "colPaymCheque" + id
    });
    let chkPaymCheque = createElement("input", {
      type: "checkbox",
      id: "chkPaymCheque" + id,
      class: "form-group"
    });
    let lblCheque = createElement("label", {
      innerHTML: "เช็คธนาคาร",
      style: "padding-left: 5px;"
    });
    let colPaymCredit = createElement("div", {
      className: "col-sm-3",
      id: "colPaymCredit" + id
    });
    let chkPaymCredit = createElement("input", {
      type: "checkbox",
      id: "chkPaymCredit" + id,
      class: "form-group"
    });
    let lblCredit = createElement("label", {
      innerHTML: "บัตรเครดิต",
      style: "padding-left: 5px;"
    });

    ul.appendChild(rowPaym);
    rowPaym.appendChild(colPaym);
    colPaym.appendChild(lbl);
    rowPaym.appendChild(colPaymCash);
    colPaymCash.appendChild(chkPaymCash);
    chkPaymCash.onchange = function () {
      if (chkPaymCash.checked) {
        createPaymentCash(chkPaymCash.checked, id);
      } else {
      }
    };
    colPaymCash.appendChild(lblCash);
    rowPaym.appendChild(colPaymCheque);
    colPaymCheque.appendChild(chkPaymCheque);
    chkPaymCheque.onchange = function () {};
    colPaymCheque.appendChild(lblCheque);
    rowPaym.appendChild(colPaymCredit);
    colPaymCredit.appendChild(chkPaymCredit);
    chkPaymCredit.onchange = function () {};
    colPaymCredit.appendChild(lblCredit);
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

    //---------------------------------------- ชำระค่า -------------------------------------------------

    let rowPaymRemark = createElement("div", {
      id: "rowPaymRemark" + id,
      className: "row"
    });
    document.getElementById("groupDeposit" + id).appendChild(rowPaymRemark);

    let colPaymEmpty = createElement("div", {
      id: "colPaymEmpty" + id,
      className: "col-sm-1"
    });
    rowPaymRemark.appendChild(colPaymEmpty);

    let colPaymRemark = createElement("div", {
      id: "colPaymRemark" + id,
      className: "col-sm-11"
    });
    rowPaymRemark.appendChild(colPaymRemark);

    let groupPaymRemark = createElement("div", {
      id: "groupPaymRemark" + id,
      className: "form-group"
    });
    colPaymRemark.appendChild(groupPaymRemark);

    let inputPaymRemark = createElement("input", {
      id: "inputPaymRemark" + id,
      className: "form-control",
      type: "text",
      placeholder: "ชำระค่า"
    });
    groupPaymRemark.appendChild(inputPaymRemark);

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
    rowRemark.appendChild(colempty);

    let colRemark = createElement("div", {
      id: "colRemark" + id,
      className: "col-sm-11"
    });
    rowRemark.appendChild(colRemark);

    let groupRemark = createElement("div", {
      id: "groupRemark" + id,
      className: "form-group"
    });
    colRemark.appendChild(groupRemark);

    let inputRemark = createElement("input", {
      id: "remark" + id,
      className: "form-control",
      type: "text",
      placeholder: "หมายเหตุ"
    });
    groupRemark.appendChild(inputRemark);
    inputRemark.onchange = function () {
      onchangeRemark(this.value, id);
    };

    document.getElementById("countDeposit").value = id;
    onchangeInstallment(0, id);
    refreshSequence(`CURRSEQ`);

    //---------------------------------------- วิธีชำระเงิน -------------------------------------------------

    let rowPaym = createElement("div", {
      className: "row",
      id: "rowPaym" + id,
      style: "padding-left: 50px;"
    });
    document.getElementById("groupDeposit" + id).appendChild(rowPaym);

    let colPaym = createElement("div", {
      className: "col-sm-3",
      id: "colPaym" + id
    });
    document.getElementById(rowPaym.id).appendChild(colPaym);

    let lbl = createElement("label", {
      innerHTML: "วิธีชำระเงิน",
      style: "font-weight: bold;"
    });
    document.getElementById(colPaym.id).appendChild(lbl);

    /// เงินสด
    let colPaymCash = createElement("div", {
      className: "col-sm-3",
      id: "colPaymCash" + id
    });
    document.getElementById(rowPaym.id).appendChild(colPaymCash);

    let chkPaymCash = createElement("input", {
      type: "checkbox",
      id: "chkPaymCash" + id,
      class: "form-group"
    });
    document.getElementById(colPaymCash.id).appendChild(chkPaymCash);
    chkPaymCash.onchange = function () {
      createPaymentCash(chkPaymCash.checked, id);
    };

    let lblCash = createElement("label", {
      innerHTML: "เงินสด",
      style: "padding-left: 5px;"
    });
    document.getElementById(colPaymCash.id).appendChild(lblCash);

    /// เช็คธนาคาร
    let colPaymCheque = createElement("div", {
      className: "col-sm-3",
      id: "colPaymCheque" + id
    });
    document.getElementById(rowPaym.id).appendChild(colPaymCheque);

    let chkPaymCheque = createElement("input", {
      type: "checkbox",
      id: "chkPaymCheque" + id,
      class: "form-group"
    });
    document.getElementById(colPaymCheque.id).appendChild(chkPaymCheque);
    chkPaymCheque.onchange = function () {
      createPaymentCheque(chkPaymCheque.checked, id);
    };

    let lblCheque = createElement("label", {
      innerHTML: "เช็คธนาคาร",
      style: "padding-left: 5px;"
    });
    document.getElementById(colPaymCheque.id).appendChild(lblCheque);

    /// บัตรเครดิต
    let colPaymCredit = createElement("div", {
      className: "col-sm-3",
      id: "colPaymCredit" + id
    });
    document.getElementById(rowPaym.id).appendChild(colPaymCredit);

    let chkPaymCredit = createElement("input", {
      type: "checkbox",
      id: "chkPaymCredit" + id,
      class: "form-group"
    });
    document.getElementById(colPaymCredit.id).appendChild(chkPaymCredit);
    chkPaymCredit.onchange = function () {
      createPaymentCreditCard(chkPaymCredit.checked, id);
    };

    let lblCredit = createElement("label", {
      innerHTML: "บัตรเครดิต",
      style: "padding-left: 5px;"
    });
    document.getElementById(colPaymCredit.id).appendChild(lblCredit);
  }
}

function loadCardDeposit_original(data) {
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
      document.getElementById(ul.id).appendChild(row);

      let seq = createElement("div", {
        id: "seq" + id,
        className: "col-sm-1",
        style: "text-align: center;"
      });
      document.getElementById(row.id).appendChild(seq);

      let group = createElement("div", {
        id: "group" + id,
        className: "form-group",
        style: "margin-bottom: 0;"
      });
      document.getElementById(seq.id).appendChild(group);

      let label = createElement("label", {
        id: "label" + id,
        innerText: "ลำดับ"
      });
      document.getElementById(group.id).appendChild(label);

      let group2 = createElement("div", {
        id: "grouplbl" + id,
        className: "form-group"
      });
      document.getElementById(seq.id).appendChild(group2);

      let curseq = createElement("label", {
        id: "CURRSEQ" + id,
        innerText: id.toString()
      });
      document.getElementById(group2.id).appendChild(curseq);

      let seq2 = createElement("label", {
        id: "SEQ" + id,
        innerText: id.toString(),
        style: "display:none;"
      });
      document.getElementById(group2.id).appendChild(seq2);

      let lblRecId = createElement("label", {
        id: "RECID" + id,
        innerText: object.RecId,
        style: "display:none;"
      });
      document.getElementById(group2.id).appendChild(lblRecId);

      //------------------------------- วันที่จ่าย ---------------------------------------------

      let colPaymDate = createElement("div", {
        id: "colPaymDate" + id,
        className: "col-sm-3"
      });
      document.getElementById(row.id).appendChild(colPaymDate);

      let lblpaymdate = createElement("label", {
        id: "lblPaymDate" + id,
        innerText: "วันที่จ่าย"
      });
      document.getElementById(colPaymDate.id).appendChild(lblpaymdate);

      let icon = createElement("div", {
        id: "icon" + id,
        className: "input-icons"
      });
      document.getElementById(colPaymDate.id).appendChild(icon);

      let fa = createElement("i", {
        id: "fa" + id,
        className: "fa fa-calendar icon"
      });
      document.getElementById(icon.id).appendChild(fa);

      let inputDate = createElement("input", {
        id: "paymDate" + id,
        type: "text",
        className: "form-control flatpickr",
        style: "background-color: white; padding-left: 30px;"
      });
      document.getElementById(icon.id).appendChild(inputDate);

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
      document.getElementById(row.id).appendChild(colinstall);

      let groupinstall = createElement("div", {
        id: "groupinstallment" + id,
        className: "form-group"
      });
      document.getElementById(colinstall.id).appendChild(groupinstall);

      let lblinstall = createElement("label", {
        id: "lblinstallment" + id,
        innerText: "งวด"
      });
      document.getElementById(groupinstall.id).appendChild(lblinstall);

      let sInstall = createElement("select", {
        id: "installment" + id,
        className: "form-control select2bs4",
        style: "width: 100%;",
        value: 0
      });
      document.getElementById(groupinstall.id).appendChild(sInstall);
      sInstall.onchange = function () {
        onchangeInstallment(this.value, id);
      };

      //---------------------------------------- มูลค่า -------------------------------------------------

      let colamount = createElement("div", {
        id: "colamount" + id,
        className: "col-sm-3"
      });
      document.getElementById(row.id).appendChild(colamount);

      let groupAmount = createElement("div", {
        id: "groupAmount" + id,
        className: "form-group"
      });
      document.getElementById(colamount.id).appendChild(groupAmount);

      let lblAmount = createElement("label", {
        id: "lblAmount" + id,
        innerText: "มูลค่า"
      });
      document.getElementById(groupAmount.id).appendChild(lblAmount);

      let inputAmount = createElement("input", {
        id: "payment" + id,
        className: "form-control",
        value: object.Amount,
        type: "number",
        min: 0
      });
      document.getElementById(groupAmount.id).appendChild(inputAmount);
      inputAmount.onchange = function () {
        onchangePayment(this.value, id);
      };
      inputAmount.oninput = function () {
        this.value = Math.abs(this.value);
      };

      //---------------------------------------- button delete -------------------------------------------------

      let coldelete = createElement("div", {
        id: "coldelete" + id,
        className: "col-sm-1"
      });
      document.getElementById(row.id).appendChild(coldelete);

      let groupdelete = createElement("div", {
        id: "groupdelete" + id,
        className: "form-group",
        style: "margin-top: 25px;"
      });
      document.getElementById(coldelete.id).appendChild(groupdelete);

      let linkDelete = createElement("a", {
        id: "linkDelete" + id,
        style: "cursor: pointer;"
      });
      document.getElementById(groupdelete.id).appendChild(linkDelete);
      linkDelete.onclick = function () {
        deleteGroup(
          "groupDeposit" + linkDelete.id.substring(10, 13),
          `${object.RecId}`
        );
      };

      let imgDelete = createElement("img", {
        id: "imgDelete" + id,
        src: "../images/1398920_red circle_close_cross_cancel_remove_icon.png"
      });
      document.getElementById(linkDelete.id).appendChild(imgDelete);

      let linkCancel = createElement("a", {
        id: "linkCancel" + id,
        style: "cursor: pointer; display: none;"
      });
      document.getElementById(groupdelete.id).appendChild(linkCancel);

      let imgCancel = createElement("img", {
        id: "imgCancel" + id,
        style: "cursor: pointer; with: 48px; height: 48px",
        src: "../images/vecteezy_cancelled-rubber-stamp-on-white-background-vector-illustration_19495927.jpg"
      });
      document.getElementById(groupdelete.id).appendChild(imgCancel);
      imgCancel.onclick = function () {
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
      document.getElementById(row.id).appendChild(coldprint);

      let groupprint = createElement("div", {
        id: "groupprint" + id,
        className: "form-group",
        style: "margin-top: 35px;"
      });
      document.getElementById(coldprint.id).appendChild(groupprint);

      let linkPrint = createElement("a", {
        id: "linkPrint" + id,
        style: "cursor: pointer;"
      });
      document.getElementById(groupprint.id).appendChild(linkPrint);
      linkPrint.onclick = function () {
        printDeposit(object.RecId);
      };

      let imgPrint = createElement("img", {
        id: "imgPrint" + id,
        src: "../images/image_print_outline.png"
      });
      document.getElementById(linkPrint.id).appendChild(imgPrint);

      //---------------------------------------- button cancel -------------------------------------------------

      let colcancel = createElement("div", {
        id: "colcancel" + id,
        className: "col-sm-1"
      });
      document.getElementById(row.id).appendChild(colcancel);

      let groupcancel = createElement("div", {
        id: "groupcancel" + id,
        className: "form-group",
        style: "margin-top: 38px;"
      });
      document.getElementById(colcancel.id).appendChild(groupcancel);

      let btnCancel = createElement("button", {
        id: "btnCancel" + id,
        className: "btn btn-block btn-outline-info btn-xs",
        innerText: "Cancel",
        style: "margin-top: 38px;"
      });
      document.getElementById(groupcancel.id).appendChild(btnCancel);
      btnCancel.onclick = function () {
        cancelDeposit(btnCancel.id.substring(9, 11));
      };

      //---------------------------------------- remark -------------------------------------------------

      let rowRemark = createElement("div", {
        id: "rowRemark" + id,
        className: "row"
      });
      document.getElementById(ul.id).appendChild(rowRemark);

      let colempty = createElement("div", {
        id: "colempty" + id,
        className: "col-sm-1"
      });
      document.getElementById(rowRemark.id).appendChild(colempty);

      //------------------------------

      let colDepositId = createElement("div", {
        id: "colDepositId" + id,
        className: "col-sm-3"
      });
      document.getElementById(rowRemark.id).appendChild(colDepositId);

      let groupDepositId = createElement("div", {
        id: "groupDepositId" + id,
        className: "form-group"
      });
      document.getElementById(colDepositId.id).appendChild(groupDepositId);

      let inputDepositId = createElement("input", {
        id: "inputDepositId" + id,
        className: "form-control",
        type: "text",
        value: object.DepositId,
        disabled: true
      });
      document.getElementById(groupDepositId.id).appendChild(inputDepositId);

      //------------------------------

      let colRemark = createElement("div", {
        id: "colRemark" + id,
        className: "col-sm-8"
      });
      document.getElementById(rowRemark.id).appendChild(colRemark);

      let groupRemark = createElement("div", {
        id: "groupRemark" + id,
        className: "form-group"
      });
      document.getElementById(colRemark.id).appendChild(groupRemark);

      let inputRemark = createElement("input", {
        id: "remark" + id,
        className: "form-control",
        type: "text",
        value: object.Remark,
        placeholder: "หมายเหตุ"
      });
      document.getElementById(groupRemark.id).appendChild(inputRemark);
      inputRemark.onchange = function () {
        onchangeRemark(this.value, inputRemark.id.substring(6, 8));
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

      //---------------------------------------- วิธีชำระเงิน -------------------------------------------------

      let rowPaym = createElement("div", {
        className: "row",
        id: "rowPaym" + id,
        style: "padding-left: 50px;"
      });
      document.getElementById(ul.id).appendChild(rowPaym);

      let colPaym = createElement("div", {
        className: "col-sm-3",
        id: "colPaym" + id
      });
      document.getElementById(rowPaym.id).appendChild(colPaym);

      let lbl = createElement("label", {
        innerHTML: "วิธีชำระเงิน",
        style: "font-weight: bold;"
      });
      document.getElementById(colPaym.id).appendChild(lbl);

      /// เงินสด
      let colPaymCash = createElement("div", {
        className: "col-sm-3",
        id: "colPaymCash" + id
      });
      document.getElementById(rowPaym.id).appendChild(colPaymCash);

      let chkPaymCash = createElement("input", {
        type: "checkbox",
        id: "chkPaymCash" + id,
        class: "form-group"
      });
      document.getElementById(colPaymCash.id).appendChild(chkPaymCash);
      chkPaymCash.onchange = function () {
        if (chkPaymCash.checked) {
          createPaymentCash(chkPaymCash.checked, id, null);
        } else {
        }
      };

      let lblCash = createElement("label", {
        innerHTML: "เงินสด",
        style: "padding-left: 5px;"
      });
      document.getElementById(colPaymCash.id).appendChild(lblCash);

      /// เช็คธนาคาร
      let colPaymCheque = createElement("div", {
        className: "col-sm-3",
        id: "colPaymCheque" + id
      });
      document.getElementById(rowPaym.id).appendChild(colPaymCheque);

      let chkPaymCheque = createElement("input", {
        type: "checkbox",
        id: "chkPaymCheque" + id,
        class: "form-group"
      });
      document.getElementById(colPaymCheque.id).appendChild(chkPaymCheque);
      chkPaymCheque.onchange = function () {};

      let lblCheque = createElement("label", {
        innerHTML: "เช็คธนาคาร",
        style: "padding-left: 5px;"
      });
      document.getElementById(colPaymCheque.id).appendChild(lblCheque);

      /// บัตรเครดิต
      let colPaymCredit = createElement("div", {
        className: "col-sm-3",
        id: "colPaymCredit" + id
      });
      document.getElementById(rowPaym.id).appendChild(colPaymCredit);

      let chkPaymCredit = createElement("input", {
        type: "checkbox",
        id: "chkPaymCredit" + id,
        class: "form-group"
      });
      document.getElementById(colPaymCredit.id).appendChild(chkPaymCredit);
      chkPaymCredit.onchange = function () {};

      let lblCredit = createElement("label", {
        innerHTML: "บัตรเครดิต",
        style: "padding-left: 5px;"
      });
      document.getElementById(colPaymCredit.id).appendChild(lblCredit);
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

function createPaymentCash(checked, id, value = null) {
  if (checked) {
    let bank = "",
      branch = "";
    if (value && value.PaymType == 1) {
      bank = value.PaymBank;
      branch = value.PaymBankBranch;
    }
    console.log(bank);
    var element = document.getElementById("cash" + id);
    if (typeof element != "undefined" && element != null) {
      //Exists element
      element.remove();
    }
    document.getElementById("chkPaymCredit" + id).checked = false;
    document.getElementById("chkPaymCheque" + id).checked = false;

    let rowCash = createElement("div", {
      className: "row",
      id: "cash" + id,
      style: "margin-left: 50px; display: block;"
    });
    document.getElementById("groupDeposit" + id).appendChild(rowCash);

    let _colCash = createElement("div", {
      className: "col-sm-12",
      id: "_colCash" + id
    });

    let card = createElement("div", { className: "card", id: "card" + id });
    let ul = createElement("ul", {
      id: "ulGroupCash" + id,
      className: "list-group list-group-flush"
    });

    let rowcard = createElement("div", {
      className: "row",
      id: "rowcard" + id,
      style: "padding: 10px"
    });
    let colCardCash = createElement("div", {
      className: "col-sm-4",
      id: "colCardCash" + id
    });
    let colGroup = createElement("div", {
      className: "form-group",
      id: "colGroup" + id
    });
    let lblCash = createElement("label", {
      id: "lblCash" + id,
      innerHTML: "ชื่อธนาคาร "
    });
    // let bankCash = createElement("input", {
    //   id: "bankCash" + id,
    //   class: "form-control",
    //   type: "text",
    //   value: bank
    // });
    let colCardBranch = createElement("div", {
      className: "col-sm-4",
      id: "colCardBranch" + id,
      style: "padding-left: 10px;"
    });
    let colGroupBranch = createElement("div", {
      className: "form-group",
      id: "colGroupBranch" + id
    });
    let lblbranch = createElement("label", {
      id: "lblbranch" + id,
      innerHTML: "สาขา ",
      style: "padding-right: 20px",
      for: "bankBranch" + id
    });
    let bankBranch = createElement("input", {
      id: "bankBranch" + id,
      class: "form-control",
      type: "text",
      value: branch
    });

    let bankCash = createElement("select", {
      className: "form-control select2bs4",
      id: "bankCash" + id
    });

    var bankName = new Array(
      "",
      "กรุงเทพ",
      "กสิกรไทย",
      "กรุงไทย",
      "ทีทีบี",
      "ออมสิน",
      "กรุงศรีอยุธยา",
      "เกียรตินาคิน",
      "ซีไอเอ็มบีไทย",
      "ทิสโก้",
      "ซิตี้แบงค์",
      "ธนาคารยูโอบี",
      "แลนด์แอนด์เฮาส์",
      "ไอซีบีซี",
      "เอชเอสบีซี",
      "อาคารสงเคราะห์",
      "อิสลามแห่งประเทศไทย",
      "มิซูโฮ",
      "สแตนดาร์ดชาร์เตอร์ด",
      "ซูมิโตโม",
      "ไทยเครดิต"
    );

    for (var i = 0; i < bankName.length; ++i) {
      var option = document.createElement("option");
      option.value = bankName[i];
      option.text = bankName[i];

      if (bank == bankName[i]) {
        option.selected = true;
      }
      bankCash.appendChild(option);
    }

    rowCash.appendChild(_colCash);
    _colCash.appendChild(card);
    card.appendChild(ul);
    ul.appendChild(rowcard);
    rowcard.appendChild(colCardCash);
    colCardCash.appendChild(colGroup);
    colGroup.appendChild(lblCash);
    colGroup.appendChild(bankCash);
    rowcard.appendChild(colCardBranch);
    colCardBranch.appendChild(colGroupBranch);
    colGroupBranch.appendChild(lblbranch);
    colGroupBranch.appendChild(bankBranch);
  } else {
    document.getElementById("cash" + id).remove();
  }
}

function createPaymentCheque(checked, id, value = null) {
  if (checked) {
    var element = document.getElementById("cash" + id);
    if (typeof element != "undefined" && element != null) {
      //Exists element
      element.remove();
    }

    let bankNum = "";
    if (value && value.PaymType == 2) {
      bankNum = value.PaymNum;
    }

    document.getElementById("chkPaymCredit" + id).checked = false;
    document.getElementById("chkPaymCash" + id).checked = false;

    let rowCash = createElement("div", {
      className: "row",
      id: "cash" + id,
      style: "margin-left: 50px; display: block;"
    });
    document.getElementById("groupDeposit" + id).appendChild(rowCash);

    let _colCash = createElement("div", {
      className: "col-sm-12",
      id: "_colCash" + id
    });

    let card = createElement("div", { className: "card", id: "card" + id });
    let rowcard = createElement("div", {
      className: "row",
      id: "rowcard" + id,
      style: "padding: 10px"
    });
    let colCardCash = createElement("div", {
      className: "col-sm-4",
      id: "colCardCash" + id
    });
    let colGroup = createElement("div", {
      className: "form-group",
      id: "colGroup" + id
    });
    let lblCash = createElement("label", {
      id: "lblCash" + id,
      innerHTML: "เลขที่เช็ค "
    });
    let bankCash = createElement("input", {
      id: "chequeNum" + id,
      class: "form-control",
      type: "text",
      value: bankNum
    });
    let colCardBranch = createElement("div", {
      className: "col-sm-4",
      id: "colCardBranch" + id,
      style: "padding-left: 10px;"
    });
    let colGroupBranch = createElement("div", {
      className: "form-group",
      id: "colGroupBranch" + id
    });

    rowCash.appendChild(_colCash);
    _colCash.appendChild(card);
    card.appendChild(rowcard);
    rowcard.appendChild(colCardCash);
    colCardCash.appendChild(colGroup);
    colGroup.appendChild(lblCash);
    colGroup.appendChild(bankCash);
    rowcard.appendChild(colCardBranch);
    colCardBranch.appendChild(colGroupBranch);
  } else {
    document.getElementById("cash" + id).remove();
  }
}

function createPaymentCreditCard(checked, id, value = null) {
  if (checked) {
    var element = document.getElementById("cash" + id);
    if (typeof element != "undefined" && element != null) {
      //Exists element
      element.remove();
    }

    let bank = "",
      bankNum = "";
    if (value && value.PaymType == 3) {
      bank = value.PaymBank;
      bankNum = value.PaymNum;
    }

    document.getElementById("chkPaymCheque" + id).checked = false;
    document.getElementById("chkPaymCash" + id).checked = false;

    let rowCash = createElement("div", {
      className: "row",
      id: "cash" + id,
      style: "margin-left: 50px; display: block;"
    });
    let _colCash = createElement("div", {
      className: "col-sm-12",
      id: "_colCash" + id
    });
    let card = createElement("div", { className: "card", id: "card" + id });
    let rowcard = createElement("div", {
      className: "row",
      id: "rowcard" + id,
      style: "padding: 10px"
    });
    let colCardCash = createElement("div", {
      className: "col-sm-4",
      id: "colCardCash" + id
    });
    let colGroup = createElement("div", {
      className: "form-group",
      id: "colGroup" + id
    });
    let lblCash = createElement("label", {
      id: "lblCash" + id,
      innerHTML: "ชื่อธนาคาร "
    });
    // let bankCash = createElement("input", {
    //   id: "bankCredit" + id,
    //   class: "form-control",
    //   type: "text",
    //   value: bank
    // });
    let colCardBranch = createElement("div", {
      className: "col-sm-4",
      id: "colCardBranch" + id,
      style: "padding-left: 10px;"
    });
    let colGroupBranch = createElement("div", {
      className: "form-group",
      id: "colGroupBranch" + id
    });
    let lblbranch = createElement("label", {
      id: "lblbranch" + id,
      innerHTML: "เลขที่บัตร ",
      for: "bankCreditNum" + id
    });
    let bankBranch = createElement("input", {
      id: "bankCreditNum" + id,
      class: "form-control",
      type: "text",
      value: bankNum
    });

    let bankCash = createElement("select", {
      className: "form-control select2bs4",
      id: "bankCredit" + id
    });

    var bankName = new Array(
      "",
      "กรุงเทพ",
      "กสิกรไทย",
      "กรุงไทย",
      "ทีทีบี",
      "ออมสิน",
      "กรุงศรีอยุธยา",
      "เกียรตินาคิน",
      "ซีไอเอ็มบีไทย",
      "ทิสโก้",
      "ซิตี้แบงค์",
      "ธนาคารยูโอบี",
      "แลนด์แอนด์เฮาส์",
      "ไอซีบีซี",
      "เอชเอสบีซี",
      "อาคารสงเคราะห์",
      "อิสลามแห่งประเทศไทย",
      "มิซูโฮ",
      "สแตนดาร์ดชาร์เตอร์ด",
      "ซูมิโตโม",
      "ไทยเครดิต"
    );

    for (var i = 0; i < bankName.length; ++i) {
      bankCash[bankCash.length] = new Option(bankName[i], bankName[i]);
    }

    document.getElementById("groupDeposit" + id).appendChild(rowCash);

    rowCash.appendChild(_colCash);
    _colCash.appendChild(card);
    card.appendChild(rowcard);
    rowcard.appendChild(colCardCash);
    colCardCash.appendChild(colGroup);
    colGroup.appendChild(lblCash);
    colGroup.appendChild(bankCash);
    rowcard.appendChild(colCardBranch);
    colCardBranch.appendChild(colGroupBranch);
    colGroupBranch.appendChild(lblbranch);
    colGroupBranch.appendChild(bankBranch);
  } else {
    document.getElementById("cash" + id).remove();
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
        <input type="text" id="recid-delete" class="form-control" style="display:block;" value="${recid}">`,
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

// function loadRegion(selected) {
//   const xhttp = new XMLHttpRequest();
//   xhttp.open("GET", API_REGION);
//   xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   xhttp.send();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       var trHTML = "";
//       const objects = JSON.parse(this.responseText);
//       trHTML += `<option value="" selected="selected">------ None ------</option>`;
//       for (let object of objects) {
//         let _id = object["RegionId"];
//         let _name = object["Name"];

//         if (selected == _id)
//           trHTML += `<option value="${_id}" selected>${_name}</option>`;
//         else trHTML += `<option value="${_id}">${_name}</option>`;
//       }
//       document.getElementById("region").innerHTML = trHTML;
//     }
//   };
// }

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

//----------------------------- ที่อยู่เริ่มต้น ----------------------------------
function loadAddress(recid) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_LOAD_ADDRESS + recid);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      console.log(data);
      data.map((row) => {
        if (row.Type == 1) {
          //ที่อยู่ใบกำกับภาษี
          loadAddressProvince("addressProvince_inv", row.State);
          loadAddressCity("addressCity_inv", row.State, row.City);
          loadAddressDistrict(
            "addressDistrict_inv",
            row.State,
            row.City,
            row.District
          );
          setElementVal("addressStreet_inv", row.Street);
          setElementVal("addressZipcode_inv", row.Zipcode);

          if (row.UseDefaultDeliveryAddress == 1) {
            document.getElementById("chkDefaultDelivery").checked = true;
            document.getElementById("chkNewDelivery").checked = false;

            document.getElementById("txtDefaultDelivery").value =
              row.Street +
              " ตำบล" +
              row.District +
              " \nอำเภอ" +
              row.City +
              " จังหวัด" +
              row.ProvinceName +
              "\n" +
              row.Zipcode;
            document.getElementById("rowchkDelivery").style.display = "block";
            document.getElementById("cardDelivery").style.display = "none";
          }
        }
        if (row.Type == 2) {
          //ที่อยู่จัดส่ง

          document.getElementById("cardDelivery").style.display = "block";
          document.getElementById("rowchkDelivery").style.display = "none";
          document.getElementById("chkNewDelivery").checked = true;

          loadAddressProvince("addressProvince_delivery", row.State);
          loadAddressCity("addressCity_delivery", row.State, row.City);
          loadAddressDistrict(
            "addressDistrict_delivery",
            row.State,
            row.City,
            row.District
          );
          setElementVal("addressStreet_delivery", row.Street);
          setElementVal("addressZipcode_delivery", row.Zipcode);
        }
      });

      if (data.length == 0) {
        loadAddressProvince("addressProvince_inv");
      }
    }
  };
}

function findAddress(name, value) {
  let district = "";
  let city = "";
  let province = "";

  if (name == "Invoice") {
    district = "addressDistrict_inv";
    city = "addressCity_inv";
    province = "addressProvince_inv";
  } else if (name == "Delivery") {
    district = "addressDistrict_delivery";
    city = "addressCity_delivery";
    province = "addressProvince_delivery";
  }

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

          loadAddressProvince(province, data[0].StateId);
          loadAddressCity(city, data[0].StateId, data[0].City);

          document.getElementById(district).innerHTML = HTMLDistrict;
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
    document.getElementById(city).innerHTML = ``;
    document.getElementById(district).innerHTML = ``;
  }
}

function loadAddressProvince(name, selected) {
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
          if (selected == row.StateId) {
            HTMLProvince += `<option value="${row.StateId}" selected>${row.State}</option>`;
          } else
            HTMLProvince += `<option value="${row.StateId}">${row.State}</option>`;
        });
      }

      document.getElementById(name).innerHTML = HTMLProvince; //address province
    }
  };
}

function loadAddressDistrict(name, province, city, selected) {
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

        document.getElementById(name).innerHTML = HTML; // address district
      }
    }
  };
}

function loadAddressCity(name, province, selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_ADDRESS_CITY + province);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var HTML = "";
      let stateId = "",
        zone = "";
      const data = JSON.parse(this.responseText);

      if (data.length > 0) {
        HTML += `<option value="None"></option>`;
        data.map((row) => {
          stateId = row.StateId;
          zone = row.Zone;

          if (selected == row.City) {
            HTML += `<option value="${row.City}" selected>${row.City}</option>`;
          } else HTML += `<option value="${row.City}">${row.City}</option>`;
        });
      }

      document.getElementById(name).innerHTML = HTML; //address city
    }
  };
}

function loadAddressZipCode(name, province, city, district) {
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
            document.getElementById(name).value = row.Zipcode;
          });
        }
      }
    };
  }
}

function chkInvoice(value) {
  let display = "none";
  if (value) {
    display = "block";

    document.getElementById("chkDefaultInvoice").checked = true;
    document.getElementById("chkNewInvoice").checked = false;

    let street = document.getElementById("addressStreet").value;
    let district = document.getElementById("addressDistrict").value;
    let city = document.getElementById("addressCity").value;
    let province = document.getElementById("addressProvince").value;
    let zipcode = document.getElementById("addressZipcode").value;

    document.getElementById("txtDefaultInvoice").value =
      street +
      " ตำบล" +
      district +
      " \nอำเภอ" +
      city +
      " จังหวัด" +
      province +
      "\n" +
      zipcode;
  }

  document.getElementById("rowchkInvoice").style.display = display;
  document.getElementById("cardInvoice").style.display = "none";
}

function chkNewInvoice(value) {
  if (value) {
    document.getElementById("cardInvoice").style.display = "block";
    document.getElementById("rowchkInvoice").style.display = "none";
    document.getElementById("chkDefaultInvoice").checked = false;
    loadAddressProvince("addressProvince_inv");
  } else {
    document.getElementById("cardInvoice").style.display = "none";
    document.getElementById("rowchkInvoice").style.display = "none";
    document.getElementById("chkDefaultInvoice").checked = false;

    document.getElementById("addressZipcode_inv").value = "";
    document.getElementById("addressProvince_inv").value = "";
    document.getElementById("addressCity_inv").value = "";
    document.getElementById("addressDistrict_inv").value = "";
    document.getElementById("addressStreet_inv").value = "";
  }
}

function chkDelivery(value) {
  let display = "none";
  if (value) {
    display = "block";

    document.getElementById("chkDefaultDelivery").checked = true;
    document.getElementById("chkNewDelivery").checked = false;

    let street = document.getElementById("addressStreet_inv").value;
    let district = document.getElementById("addressDistrict_inv").value;
    let city = document.getElementById("addressCity_inv").value;
    let province = document.getElementById("addressProvince_inv");
    let zipcode = document.getElementById("addressZipcode_inv").value;

    document.getElementById("txtDefaultDelivery").value =
      street +
      " ตำบล" +
      district +
      " \nอำเภอ" +
      city +
      " จังหวัด" +
      province.options[province.selectedIndex].text +
      "\n" +
      zipcode;
  }

  document.getElementById("rowchkDelivery").style.display = display;
  document.getElementById("cardDelivery").style.display = "none";
  //document.getElementById("chkNewDelivery").checked = false;
}

function chkNewDelivery(value) {
  if (value) {
    document.getElementById("cardDelivery").style.display = "block";
    document.getElementById("rowchkDelivery").style.display = "none";
    document.getElementById("chkDefaultDelivery").checked = false;
    loadAddressProvince("addressProvince_delivery");
  } else {
    document.getElementById("cardDelivery").style.display = "none";
    document.getElementById("rowchkDelivery").style.display = "none";
    document.getElementById("chkDefaultDelivery").checked = false;

    document.getElementById("addressZipcode_delivery").value = "";
    document.getElementById("addressProvince_delivery").value = "";
    document.getElementById("addressCity_delivery").value = "";
    document.getElementById("addressDistrict_delivery").value = "";
    document.getElementById("addressStreet_delivery").value = "";
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
