//let SERVER_L = 'http://localhost:4462/';
//let SERVER_L = 'http://starmark.work/retailsov2_api/';
//let SERVER_L = 'http://starmark.work/order_online_api_test/';
// let SERVER_L = 'http://starmark.work/order_online_api/';
// let API_LOAD_LINE = SERVER_L + 'api/retailsoline/loaddata';
// let API_DELETE_LINE = SERVER_L + "api/retailsoline/delete/";

// //let SERVER_L = 'http://localhost:2179/';
// let SERVER_L = 'http://starmark.work/OrderOnline_API_HUB/';
// let API_LOAD_LINE = SERVER_L + 'api/OrderOnline/line/load';
// let API_DELETE_LINE = SERVER_L + "api/OrderOnline/line/delete";

let SERVER_L_order = "http://starmark.work/OrderOnline_API_Order_test/"; //Live
let SERVER_L_ax = "http://starmark.work/OrderOnline_API_AIF_test/"; //Live

// let SERVER_L_order = 'http://starmark.work/OrderOnline_API_Order_test/';//Live
// let SERVER_L_ax = 'http://starmark.work/OrderOnline_API_AIF_test/';//Live
// let SERVER_L_ax = 'http://localhost:4377/';

let API_LOAD_LINE = SERVER_L_order + "api/line/load";
let API_DELETE_LINE = SERVER_L_ax + "api/line/delete";

loadHeader();
load();

function load() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_LOAD_LINE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      recid: sessionStorage.getItem("recId_val")
    })
  );
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      let rowcount = 1;
      let trBody = "";
      document.getElementById("body").innerHTML = "";
      trBody += `<a class="btn btn-app bg-success" onclick="createline()">
                            <i class="fas fa-plus"></i> Add order line
                        </a>
                        <table id="example1" class="table table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>วันที่ขาย/ติดตั้ง</th>
                                <th>Series</th>
                                <th>Model</th>
                                <th>Item Number</th>
                                <th>Register Number</th>
                                <!-- <th>Sink</th>
                                <th>Top</th> -->
                                <th>Size</th>
                                <th style="text-align: right;">
                                    <div class="col-sm-12">
                                        จำนวน
                                    </div>
                                    <div class="col-sm-12">
                                        ยอดเงินรวม
                                    </div>
                                </th>
                              
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="body-data" >
                        `;
      objects.map(row => {
        if (row.ConfirmDate == "1900-01-01T00:00:00") {
          _confdate = "-";
        }
        if (row.No > 0) {
          trBody += `<tr>
                                    <td>${rowcount}</td>
                                    <td style="align-items: center;">
                                        <div class="col-sm-12">
                                        ${dateFormat(row.Date.toLocaleString("en-US"))}
                                        </div>
                                        <div class="col-sm-12">
                                        ${dateFormat(row.ConfirmDate.toLocaleString("en-US"))}
                                        </div>
                                    </td>
                                    <td>${row.Series}</td>
                                    <td>${row.Model}</td>
                                    <td>${row.ItemId}</td>
                                    <td><a href="#">${row.BookingId}</a></td>
                                    <!-- <td>${row.Sink}</td>
                                    <td>${row.Top}</td> -->
                                    <td>${row.SizeName}</td>
                                    <td style=" text-align: right;">
                                        <div class="col-sm-12">
                                        ${numberFormat(row.Qty)}
                                        </div>
                                        <div class="col-sm-12">
                                        ${numberFormat(row.Amount)}
                                        </div>
                                    </td>
                                  
                                    <td>
                                    <button type="button" class="btn btn-block btn-outline-success btn-xs" 
                                        onclick="clickLineEdit('${row.Date.toLocaleString("en-US")}','${row.ConfirmDate.toLocaleString("en-US")}','${row.Series}','${row.Model}','${row.Sink}','${row.Top}','${row.Qty}','${row.Amount}','${row.RecId}','${row.ItemId}','${row.ItemName}','${row.Size}','${row.BookingId}','${row.TimePeriod}')">Edit</button>
                                        <button type="button" class="btn btn-block btn-outline-danger btn-xs" onclick="clickLineDelete('${row.RecId}','${row.BookingId}','${row.Qty}')">Delete</button>
                                    </td>
                                </tr>
                                `;
          rowcount++;
        } else {
          trBody += `</tbody>
                                <tfoot>
                                    <th colspan="7">รวม</th>
                                    <th style=" text-align: right;">
                                        <div class="col-sm-12">
                                            ${numberFormat(row.Qty)}
                                        </div>
                                        <div class="col-sm-12">
                                            ${numberFormat(row.Amount)}
                                        </div>
                                    </th>
                                  
                                    <th></th>`;
        }
      });

      trBody += `</tfoot>
                    </table>`;
      document.getElementById("body").innerHTML = trBody;

      $("#example1")
        .DataTable({
          responsive: true,
          lengthChange: false,
          autoWidth: false,
          searching: false,
          paging: true,
          info: true,
          ordering: true
        })
        .buttons()
        .container()
        .appendTo("#example1_wrapper .col-md-6:eq(0)");
    }
  };
}

function loadHeader() {
  var _qty = numberFormat(getItem("qty_val"));
  var _amount = numberFormat(getItem("amount_val"));

  let provinceName = getItem("regionName_val");

  document.getElementById("header").innerHTML = "";
  let _header = `<div class="invoice p-3 mb-3" style="background-color:#EFEFEF;">
                        <div class="row">
                        <div class="col-12">
                            <h4>
                            <i class="fas fa-user"></i> ${getItem(
                              "custName_val"
                            )}
                            <small class="float-right">วันที่ขาย: ${dateFormat(
                              getItem("date_val")
                            )}</small>
                            </h4>
                        </div>
                        <!-- /.col -->
                        </div>

                        <div class="row invoice-info">
                        <div class="col-sm-4 invoice-col">
                            <b>พนักงาน : ${getItem("emp_val")}</b><br>
                            <b>Store : ${getItem("store_val")}</b><br>
                             <b>Pool : ${getItem("pool_val")}</b><br>
                        </div>
                        <div class="col-sm-4 invoice-col">
                            <b>Sales order:</b> ${getItem("salesId_val")}<br>
                            <b>Purch order:</b> ${getItem("purchId_val")}<br>
                            <b>ภูมิภาค:</b> ${getItem(
                              "provinceName_val"
                            )} ${provinceName}
                        </div>
                        <div class="col-sm-4 invoice-col">
                            <!-- <b>วันที่ติดตั้ง : ${dateFormat(
                              getItem("confirmdate_val")
                            )}</b><br> -->
                            <b>จำนวน:</b> ${_qty}<br>
                            <b>ยอดเงินรวม:</b> ${_amount}<br>
                        </div>
                        </div>
                    </div>
    `;

  document.getElementById("header").innerHTML = _header;
}

function getItem(key) {
  return sessionStorage.getItem(key);
}

function dateFormat(date) {
  if (date == "-") {
    return date;
  } else {
    var d = new Date(date);
    let y = d.getFullYear() + 543;
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
}

function onDelete(_recid, bookId, qty) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_DELETE_LINE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      recid: _recid,
      BookingId: bookId,
      Qty: qty
    })
  );
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ลบรายการสำเร็จ",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location = "LinePage.html";
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

function createline() {
  setItem("action_line", "add");
  location.href = "LineAddPage.html";
}

function clickLineEdit(
  date,
  confDate,
  series,
  model,
  sink,
  top,
  qty,
  amount,
  recid,
  itemId,
  itemName,
  size,
  bookingId,
  timePeriod
) {
  // setItem("action_line", action);
  setItem("series_val", series);
  setItem("model_val", model);
  setItem("qty_line_val", qty);
  setItem("amount_line_val", amount);
  setItem("date_line_val", date.substring(0, 10));
  setItem("confDate_line_val", confDate.substring(0, 10));
  setItem("sink_val", sink);
  setItem("top_val", top);
  setItem("recId_line_val", recid);
  setItem("itemId_line_val", itemId);
  setItem("itemName_line_val", itemName);
  setItem("size_val", size);
  setItem("bookId_val", bookingId);
  setItem("timePeriod_val", timePeriod);

  window.location = "LineEditPage.html";
}

function clickLineDelete(recid, bookId, qty) {
  Swal.fire({
    title: "ยืนยันลบรายการ",
    text:
      "คุณต้องการลบรายการนี้หรือไม่ ถ้าลบรายการนี้แล้วจะไม่สามารถเรียกคืนได้",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "YES",
    cancelButtonText: "CANCEL"
  }).then(result => {
    if (result.isConfirmed) {
      onDelete(recid, bookId, qty);
    }
  });
}

function setItem(key, val) {
  sessionStorage.setItem(key, val);
}

function numberFormat(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
