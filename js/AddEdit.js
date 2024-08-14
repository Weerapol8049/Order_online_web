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

let SERVER_2_ax = 'http://starmark.work/OrderOnline_API_AIF_test/';
//let SERVER_2_ax = "http://localhost:4377/";

let API_CREATE = SERVER_2_ax + "api/order/create";
let API_UPDATE = SERVER_2_ax + "api/order/edit";
let API_DEPOSIT_CREATE = SERVER_2_ax + "api/deposit/create";
let API_CREATE_POOL = SERVER_2_ax + "api/order/pool/create";
let API_DEPOSIT_UPDATE = SERVER_2_ax + "api/deposit/update";

let API_ADDRESS_CREATE = SERVER_2_ax + "api/Order/address/create";
let API_ADDRESS_UPDATE = SERVER_2_ax + "api/Order/address/update";
let API_ADDRESS_DELETE = SERVER_2_ax + "api/Order/address/delete";

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

          ShippingCost: document.getElementById("shippingcost").value,
          Discount: getElementVal("discount"),
          InstallTeam: getElementVal("installTeam"),
          Free: getElementVal("free"),
          Remark: getElementVal("remark"),
          TaxNum: getElementVal("taxnum"),
          Phone: getElementVal("phone")
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            createPool(objects.RecId);
            // update invoice and delivery address

            if (document.getElementById("addressProvince").value != "None") {
              createAddress(objects.RecId);
            }

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

          ShippingCost: getElementVal("shippingcost"),
          Discount: getElementVal("discount"),
          InstallTeam: getElementVal("installTeam"),
          Free: getElementVal("free"),
          Remark: getElementVal("remark"),
          TaxNum: getElementVal("taxnum"),
          Phone: getElementVal("phone")
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            createPool(objects.RecId);

            if (document.getElementById("addressProvince").value != "None") {
              createAddress(objects.RecId);
            }

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

function createAddress(recId) {
  let id = 0;
  let arrRow = [];
  const rowsData = { Data: arrRow };

  arrRow.push({
    SalesSoDaily: recId,
    UseDefaultInvAddress:
      document.getElementById("chkDefaultInvoice").checked === true ? 1 : 0,
    UseDefaultDeliveryAddress:
      document.getElementById("chkDefaultDelivery").checked === true ? 1 : 0,
    Street: getElementVal("addressStreet"),
    District: getElementVal("addressDistrict"),
    City: getElementVal("addressCity"),
    State: getElementVal("addressProvince"),
    Zipcode: getElementVal("addressZipcode"),
    Type: 3, //default address
    IsPrimary: 1
  });

  if (document.getElementById("chkNewInvoice").checked) {
    arrRow.push({
      SalesSoDaily: recId,
      Street: getElementVal("addressStreet_inv"),
      District: getElementVal("addressDistrict_inv"),
      City: getElementVal("addressCity_inv"),
      State: getElementVal("addressProvince_inv"),
      Zipcode: getElementVal("addressZipcode_inv"),
      Type: 1 //invoice address
    });
  }

  if (document.getElementById("chkNewDelivery").checked) {
    arrRow.push({
      SalesSoDaily: recId,
      Street: getElementVal("addressStreet_delivery"),
      District: getElementVal("addressDistrict_delivery"),
      City: getElementVal("addressCity_delivery"),
      State: getElementVal("addressProvince_delivery"),
      Zipcode: getElementVal("addressZipcode_delivery"),
      Type: 2 //delivery address
    });
  }

  const xhttp_del = new XMLHttpRequest();
  xhttp_del.open("POST", API_ADDRESS_DELETE);
  xhttp_del.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp_del.send(JSON.stringify({ RecId: recId }));
  xhttp_del.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", API_ADDRESS_CREATE);
        xhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xhttp.send(JSON.stringify(rowsData));
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            if (objects.Status == "OK") {
            } else {
              Swal.fire({
                icon: "error",
                title: "สร้างที่อยู่ไม่สำเร็จ"
              });
            }
          }
        };
      } else {
        Swal.fire({
          icon: "error",
          title: "สร้างที่อยู่ไม่สำเร็จ"
        });
      }
    }
  };
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
