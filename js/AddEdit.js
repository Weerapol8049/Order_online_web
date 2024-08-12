//let SERVER_2 = 'http://localhost:4462/';
//let SERVER_2 = 'http://starmark.work/retailsov2_api/';
//let SERVER_2 = 'http://starmark.work/order_online_api_test/';
// let SERVER_2 = 'http://starmark.work/order_online_api/';

// let API_CREATE = SERVER_2 + "api/retailso/create";
// let API_UPDATE = SERVER_2 + "api/retailso/edit";
// let API_DEPOSIT_CREATE = SERVER_2 + "api/retailso/deposit/create";
// let API_CREATE_POOL = SERVER_2 + "api/retailso/pool/create";
// let API_DEPOSIT_UPDATE = SERVER_2 + "api/retailso/deposit/update";

// //let SERVER_2 = 'http://localhost:2179/';
// let SERVER_2 = 'http://starmark.work/OrderOnline_API_HUB/';
// let API_CREATE = SERVER_2 + "api/OrderOnline/order/create";
// let API_UPDATE = SERVER_2 + "api/OrderOnline/order/edit";
// let API_DEPOSIT_CREATE = SERVER_2 + "api/OrderOnline/order/deposit/create";
// let API_CREATE_POOL = SERVER_2 + "api/OrderOnline/order/pool/create";
// let API_DEPOSIT_UPDATE = SERVER_2 + "api/OrderOnline/order/deposit/update";

// let SERVER_2_ax = 'http://starmark.work/OrderOnline_API_AIF/';//Live

//let SERVER_2_ax = 'http://starmark.work/OrderOnline_API_AIF_test/';
let SERVER_2_ax = "http://localhost:4377/";

let API_CREATE = SERVER_2_ax + "api/order/create";
let API_UPDATE = SERVER_2_ax + "api/order/edit";
let API_DEPOSIT_CREATE = SERVER_2_ax + "api/deposit/create";
let API_CREATE_POOL = SERVER_2_ax + "api/order/pool/create";
let API_DEPOSIT_UPDATE = SERVER_2_ax + "api/deposit/update";

function create() {
  let _morePool = "";
  // ------ multiple select pool ---------
  const morePool = $("#pool").val();
  morePool.forEach((pool) => {
    _morePool += `${pool},`;
  });
  const pools = _morePool.slice(0, -1);

  let warning = 0;
  const elements = document.querySelectorAll(`[id^="paymDate"]`);
  elements.forEach((element) => {
    let paymdate = document.getElementById(element.id).value;
    if (paymdate == "") warning++;
  });

  if (warning > 0) {
    warning_message(
      "โปรดระบุวันที่จ่ายเงินมัดจำ",
      "กรุณาระบุวันที่จ่ายเงินมัดจำก่อนทำการสร้าง"
    );
    return;
  }

  Swal.fire({
    title: "ยืนยันการสร้างรายการ",
    //text: "You won't be able to revert this!",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "สร้าง",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", API_CREATE);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          Date: dateFormat(getElementVal("salesDate")),
          StoreId: getElementVal("store"),
          SalesId: getElementVal("salesOrder"),
          PurchId: getElementVal("purchOrder"),
          CustName: getElementVal("custName"),
          PersonnelNumber: getElementVal("personnelNumber"),
          Pool: pools, //getElementVal('pool'),
          Qty: getElementVal("qty"),
          Amount: getElementVal("amount"),
          Region: getElementVal("region"),

          ProvinceId: document.getElementById("province").value,
          CreateBy: localStorage.getItem("username_val"), //from SignIn.js

          AddressStreet: getElementVal("addressStreet"),
          AddressDistrict: getElementVal("addressDistrict"),
          AddressCity: getElementVal("addressCity"),
          AddressState: getElementVal("addressProvince"),
          AddressZipcode: getElementVal("addressZipcode"),
          ShippingCost: getElementVal("shippingCost"),
          Discount: getElementVal("discount"),
          InstallTeam: getElementVal("installTeam"),
          Free: getElementVal("free"),
          Remark: getElementVal("remark"),
          TaxNum: getElementVal("taxnum")
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //console.log(this.responseText);
          var trHTML = "";

          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            createPool(objects.RecId);

            Swal.fire(
              "สร้างรายการสำเร็จ",
              "รายการถูกสร้างไปที่หน้า Orders แล้ว คุณสามารถเข้าไปดูรายการได้โดยกดปุ่ม OK.",
              "success"
            ).then(() => {
              window.location = "OrdersPage.html";
            });
          } else {
            Swal.fire({
              icon: "error",
              title: objects.Status
              //text: 'Something went wrong!',
            });
          }
        }
      };
    }
  });
}

function createPool(recId) {
  let id = 0;
  let arrRow = [];
  const rowsData = { Data: arrRow };
  const morePool = $("#pool").val();
  morePool.forEach((pool) => {
    arrRow.push({
      PoolId: pool,
      SalesSoDaily: recId
    });
  });

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_CREATE_POOL);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(rowsData));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
        createDeposit(recId);
      } else {
        Swal.fire({
          icon: "error",
          title: objects.Status
        });
      }
    }
  };
}

function createDeposit(recId) {
  let id = 0;
  let arrRow = [];
  const rowsData = { Data: arrRow };

  let arrRowUpdate = [];
  const rowsDataUpdate = { Data: arrRowUpdate };

  const elements = document.querySelectorAll(`[id^="SEQ"]`);
  elements.forEach((element) => {
    id = parseInt(document.getElementById(element.id).innerText);
    let _recid = parseInt(document.getElementById("RECID" + id).innerText);

    //รายการที่เพิ่มงวดมัดจำใหม่
    if (_recid == 0) {
      arrRow.push({
        TransDate: dateFormat(document.getElementById("paymDate" + id).value),
        Installment: document.getElementById("installment" + id).value,
        Amount: document.getElementById("payment" + id).value,
        SalesSoDaily: recId,
        Remark: document.getElementById("remark" + id).value
        //Cancel:  document.getElementById("checkCancel" + id).checked
      });
    } else {
      arrRowUpdate.push({
        RecId: _recid,
        TransDate: dateFormat(document.getElementById("paymDate" + id).value),
        Amount: document.getElementById("payment" + id).value,
        Remark: document.getElementById("remark" + id).value
      });
    }
  });

  // const elements_cancel = document.querySelectorAll(`[id^="SEQCANCEL"]`);
  // elements_cancel.forEach(element => {
  //     id = parseInt(document.getElementById(element.id).innerText);
  //     console.log(id);
  //     arrRow.push({
  //         TransDate: document.getElementById("paymDate-cancel" + id).value,
  //         Installment: document.getElementById("installment-cancel" + id).value,
  //         Amount: document.getElementById("payment-cancel" + id).value,
  //         SalesSoDaily: recId,
  //         Remark: document.getElementById("remark-cancel" + id).value,
  //         Cancel:  true
  //       });
  // });
  if (arrRow.length > 0) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", API_DEPOSIT_CREATE);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(rowsData));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        if (objects.Status == "OK") {
        } else {
          Swal.fire({
            icon: "error",
            title: objects.Status
          });
        }
      }
    };
  }

  if (arrRowUpdate.length > 0) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", API_DEPOSIT_UPDATE);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(rowsDataUpdate));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        if (objects.Status == "OK") {
        } else {
          Swal.fire({
            icon: "error",
            title: objects.Status
          });
        }
      }
    };
  }
}

function edit() {
  let _morePool = "";
  // ------ multiple select pool ---------
  const morePool = $("#pool").val();
  morePool.forEach((pool) => {
    _morePool += `${pool},`;
  });
  const pools = _morePool.slice(0, -1);

  Swal.fire({
    title: "ยืนยันบันทึกรายการ",
    text: "คุณต้องการบันทึกรายการที่แก้ไขนี้หรือไม่",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "บันทึก",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", API_UPDATE);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          RecId: getElementVal("recId"),
          Date: dateFormat(getElementVal("salesDate")),
          StoreId: getElementVal("store"),
          SalesId: getElementVal("salesOrder"),
          PurchId: getElementVal("purchOrder"),
          CustName: getElementVal("custName"),
          PersonnelNumber: getElementVal("personnelNumber"),
          Pool: pools,
          Qty: getElementVal("qty"),
          Amount: getElementVal("amount"),
          Region: getElementVal("region"),
          ProvinceId: document.getElementById("province").value,
          CreateBy: "",

          AddressStreet: getElementVal("addressStreet"),
          AddressDistrict: getElementVal("addressDistrict"),
          AddressCity: getElementVal("addressCity"),
          AddressState: getElementVal("addressProvince"),
          AddressZipcode: getElementVal("addressZipcode"),
          ShippingCost: getElementVal("shippingCost"),
          Discount: getElementVal("discount"),
          InstallTeam: getElementVal("installTeam"),
          Free: getElementVal("free"),
          Remark: getElementVal("remark"),
          TaxNum: getElementVal("taxnum")
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            createPool(objects.RecId);

            Swal.fire(
              "บันทึกรายการสำเร็จ",
              "รายการถูกบันทึกไปที่หน้า Orders แล้ว คุณสามารถเข้าไปดูรายการได้โดยกดปุ่ม OK.",
              "success"
            ).then(() => {
              window.location = "OrdersPage.html";
            });
          } else {
            Swal.fire({
              icon: "error",
              title: objects.Status
              //text: 'Something went wrong!',
            });
          }
        }
      };
    }
  });
}

function chkInvoice(value) {

  let display = 'none'
  if (value){
    display = 'block';

    let street = document.getElementById("addressStreet").value;
    let district = document.getElementById("addressDistrict").value;
    let city = document.getElementById("addressCity").value;
    let province = document.getElementById("addressProvince").value;
    let zipcode = document.getElementById("addressZipcode").value;

    document.getElementById("txtDefaultInvoice").value = street + ' ตำบล' + district + ' \nอำเภอ' + city + ' จังหวัด' + province + '\n' + zipcode;
  }

  document.getElementById("rowchkInvoice").style.display = display;
  document.getElementById("cardInvoice").style.display = 'none';
}

function addInvoiceAddress(){
  document.getElementById("cardInvoice").style.display = 'block';
  document.getElementById("rowchkInvoice").style.display = 'none';
  document.getElementById("radioDefaultInvoice").checked = false;
}

function getElementVal(element) {
  return document.getElementById(element).value;
}

function dateFormat(date) {
  var dateParts = date.split("/");
  var d = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  let y = d.getFullYear();
  let _date =
    y +
    "-" +
    (d.getMonth() + 1).toLocaleString("th-TH", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "-" +
    d
      .getDate()
      .toLocaleString("th-TH", { minimumIntegerDigits: 2, useGrouping: false });
  return _date;
}
