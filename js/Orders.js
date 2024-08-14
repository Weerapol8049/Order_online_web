
//S009 rcd@1019
//let SERVER_M = 'http://localhost:4462/';
//let SERVER_M = 'http://starmark.work/retailsov2_api/';//Old
//let SERVER_M = 'http://starmark.work/order_online_api_test/';//Test
// let SERVER_M = 'http://starmark.work/order_online_api/';//Live

// let API_LOAD   = SERVER_M + 'api/retailso/loaddata';
// let API_DELETE = SERVER_M + "api/retailso/delete/";
// let API_UPLOAD_IMAGE = SERVER_M + 'api/retailso/images/upload';
// let API_DEPOSIT = SERVER_M + "api/retailso/deposit";
// let API_CANCEL = SERVER_M + "api/retailso/cancel";

// //let SERVER_M = 'http://localhost:2179/';
// let SERVER_M = 'http://starmark.work/OrderOnline_API_HUB/';//Live
// let API_LOAD = SERVER_M + "api/OrderOnline/order/load";
// let API_UPLOAD_IMAGE = SERVER_M + "api/image/upload";
// let API_DEPOSIT = SERVER_M + "api/OrderOnline/order/deposit";
// let API_CANCEL = SERVER_M + "api/OrderOnline/order/cancel";

//let SERVER_M_order = "https://starmark.work/OrderOnline_API_Orders/"; //Live
//let SERVER_M_ax = "https://starmark.work/OrderOnline_API_AIF/"; //Live

let SERVER_M_order = 'http://starmark.work/OrderOnline_API_Order_test/';
let SERVER_M_ax = 'http://starmark.work/OrderOnline_API_AIF_test/';

///let SERVER_M_order = "http://localhost:54871/";
//let SERVER_M_ax = 'http://localhost:4377/';

let API_LOAD = SERVER_M_order + "api/order/load";
let API_UPLOAD_IMAGE = SERVER_M_ax + "api/order/images/upload";
let API_DEPOSIT = SERVER_M_order + "api/order/deposit";
let API_CANCEL = SERVER_M_ax + "api/order/cancel";
let API_YEAR = SERVER_M_order + "api/order/yearfilter";

let userAccountType = localStorage.getItem("type_val"); // 2 Manager

function init() {
  const user = {
    username: localStorage.getItem("usr_val"),
    userAccountType: localStorage.getItem("type_val") // 2 Manager
  };
  const { username, userAccountType } = user;
  load(username, userAccountType, 999);
}
window.onload = init;

function existsControl(value) {
  let bool = false;
  var element = document.getElementById(value);
  if (typeof element != "undefined" && element != null) {
    bool = true;
  }
  return bool;
}

async function load(username, userAccountType, show, RG = "", Year = "") {
  if (existsControl("body-data"))
    document.getElementById("body-data").innerHTML = ``;

  if (Year == "") Year = new Date().getFullYear();

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_LOAD);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      name: username,
      type: userAccountType,
      Cancel: show,
      BookingId: RG,
      Year: Year
    })
  );
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      let rowcount = 0;
      let trBody = "";
      let _status = "";
      let show0 = "",
        show1 = "",
        show2 = "";
      let displayYear = "";
      if (show == 999) show0 = "selected";
      else if (show == 0) show1 = "selected";
      else if (show == 1) show2 = "selected";

      if (existsControl("status"))
        _status = document.getElementById(`status`).value;
      else _status = "";

      if (userAccountType == 1) displayYear = "none";
      else displayYear = "flex";

      document.getElementById("body").innerHTML = "";

      trBody += `
            <div class="row">
            <div class="col-xs-1" style="display: ${displayYear}; align-items: center;">Year :</div>
              <div class="col-sm-2" style="display: ${displayYear}">
                <select id="yearFilter" class="form-control select2bs4" style="width: 100%;" 
                  onchange="load('${username}', '${userAccountType}', '${_status}', '${RG}', this.value)">
                  
                </select>
              </div>
              <div class="col-xs-1" style="display: flex; align-items: center;">Show :</div>
              <div class="col-sm-2">
                <select id="status" class="form-control select2bs4" style="width: 100%;" 
                  onchange="load('${username}', '${userAccountType}', this.value)">
                  <option value="999" ${show0}> All </option>
                  <option value="0" ${show1}> Active </option>    
                  <option value="1" ${show2}> Cancel </option>                 
                </select>
              </div>
              <div class="col-xs-1" style="display: flex; align-items: center;">Register number :</div>
              <div class="col-sm-2">
                
                <input type="text" id="searchRG" value="${RG}" class="form-control" onchange="load('${username}', '${userAccountType}', 999, this.value)" >
              </div>
            </div>
            
            <table id="example1" class="table table-bordered table-hover " 
                                style="border-spacing: 0 15px">
                      <thead >
                        <tr>
                          <th>Manage</th>
                          <th>ลำดับ</th>
                          <th>วันที่ขาย</th>
                          <th>Store</th>
                          <th>Pool</th>
                          <th style="display: flex; align-items: center; text-align: right;">
                              <div class="col-sm-12">
                                จำนวน
                              </div>
                              <div class="col-sm-12">
                                ยอดเงินรวม
                            </div>
                          </th>
                          <th>ลูกค้า</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody id="body-data">
                
                      `;

      data.map(row => {
        let _provinceName = row.ProvinceName;
        if (_provinceName != "") _provinceName = _provinceName + " / ";

        let _cancel = row.Cancel;
        let display = "",
          displayImg = "",
          displayCancel = "";
        if (_cancel == 1) {
          displayImg = "block";
          display = "none";
          displayCancel = "none";
        } else {
          displayImg = "none";
          display = "block";

          if (userAccountType > 1)
            // manager
            displayCancel = "block";
          else displayCancel = "none";
        }

        trBody += `<tr>
                            <td>
                                <div class="col-sm-12" style="margin: 5px;"> 
                                  <button type="button" id="btnEdit${row.RecId}" class="btn btn-block btn-outline-success btn-xs" 
                                    style="display: ${display}"
                                    onclick="clickEdit('${row.EmpName}','${row.StoreId}','${row.Pool}','${row.Qty}'
                                                    ,'${row.Amount}','${row.CustName}','${row.Date.toLocaleString()}'
                                                    ,'${row.SalesId}','${row.PurchId}','${row.PersonnelNumber}','${row.RecId}'
                                                    ,'${row.Region}','${row.ProvinceId}','${row.CountPools}'
                                                    ,'${row.ShippingCost}','${row.Discount}','${row.InstallTeam}','${row.Free}','${row.Remark}','${row.TaxNum}','${row.Phone}'
                                                    )">
                                                    Edit</button>
                                </div>
                                <div class="col-sm-12" style="margin: 5px; display: ${displayCancel};">
                                  <button type="button" id="btnCancel${row.RecId}" class="btn btn-block btn-outline-danger btn-xs" 
                                  onclick="clickCancel('${row.RecId}','${row.CustName}','${row.SalesIdAX}')">
                          
                                  Cancel</button>
                                </div>
                                <div class="col-sm-12" style="margin: 5px; display: ${display};">
                                <button type="button" id="btnImage${row.RecId}" class="btn btn-block btn-outline-info btn-xs" onclick="clickBrowsImg('${row.RecId}')">
                            
                                Upload image</button>
                                </div>



                                <div class="col-sm-12" style="margin: 5px; display: ${display};">
                                <button type="button" id="btnPrint${row.RecId}" class="btn btn-block btn-outline-info btn-xs" 
                                    onclick="clickPrint('${row.RecId}')">
                                  Print</button>
                                </div>



                                <div class="col-sm-12" style="margin: 5px; display: ${displayImg};">
                                <a style="cursor: pointer; " 
                                  onclick="detailCancelDeposit('${row.CustName}', '${dateFormat(
          row.CancelDate.toLocaleString()
        )}', '${row.CancelRemark}')">
                                  <img style="with: 48px; height: 48px" src="../images/vecteezy_cancelled-rubber-stamp-on-white-background-vector-illustration_19495927.jpg" alt="Cancel deposit" >
                                </a>
                          
                                </div>
                                
                            </td>
                            <td>${row.No}</td>
                            <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                ${dateFormat(row.Date.toLocaleString())}
                                </div>
                            
                            </td>
                            <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                ${row.StoreId}
                                </div>
                                <div class="col-sm-12">
                                ${row.PersonnelNumber}
                              </div>
                            </td>
                            <td style="display: flex; align-items: center;">
                              <div class="col-sm-12">
                                ${row.Pool}
                              </div>
                              <div class="col-sm-12">
                                <small> ${row.ProvinceName} ${row.RegionName}  </small>
                                </div>
                            </td>
                            
                            <td style="display: flex; align-items: center; text-align: right;">
                                <div class="col-sm-12">
                                  ${numberFormat(row.Qty)}
                                </div>
                                <div class="col-sm-12">
                                  ${numberFormat(row.Amount)}
                                </div>
                                <div class="col-sm-12">
                                  <label style="font-weight: 500;">มัดจำ  </label> ${numberFormat(
                                    row.Installment
                                  )} <br>
                                  <label style="font-weight: 500; color: green;">คงเหลือ  </label> ${numberFormat(
                                    row.Balance
                                  )}
                                </div>
                                
                            </td>
                            <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                  <label style="font-weight: 500;">${row.CustName}</label>
                                </div>
                                <div class="col-sm-12">
                                SO : <label style="font-weight: 400;">${row.SalesId}</label>, PO : <label style="font-weight: 400;">${row.PurchId}</label>
                              </div>
                            </td>
                            
                            <td >
                              <button type="button"  class="btn btn-block btn-outline-info btn-xs" 
                                style="display: ${display}"
                                onclick="clickLine('${row.RecId}','${row.Pool}','${row.EmpName}'
                                                  ,'${row.StoreId}','${row.Qty}'
                                                  ,'${row.Amount}','${row.CustName}','${row.Date.toLocaleString()}'
                                                  ,'${row.SalesId}','${row.PurchId}'
                                                  ,'${row.PersonnelNumber}'
                                                  ,'${row.Region}','${row.RegionName}','${row.ProvinceName}'
                                                  )">
                                                Line (${row.LineCount})
                              </button>
                              <button  type="button" class="btn btn-block btn-outline-info btn-xs" 
                              style="display: ${display}"
                              onclick="clickImage('${row.RecId}')">
                                  View image (${row.ImageCount})</button>
                              </td>
                          </tr>
                          `;
        rowcount++;
      });

      trBody += `</tbody>
                  </table>`;

      document.getElementById("body").innerHTML = trBody;

      $("#example1")
        .DataTable({
          responsive: true,
          lengthChange: false,
          autoWidth: false,
          searching: true,
          paging: true,
          info: true,
          order: [[1, "desc"]] //order by ลำดับ
          // "scrollX":true
        })
        .buttons()
        .container()
        .appendTo("#example1_wrapper .col-md-6:eq(0)");

      if (userAccountType != 1) loadYear(userAccountType, Year);
    }
  };
}

function loadYear(type, selected) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_YEAR);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      Username: localStorage.getItem("username_val"),
      Type: type
    })
  );
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      var option = "";
      var Year = new Date().getFullYear();
      data.map(row => {
        if (Year == row.YearFilter || selected == row.YearFilter)
          option += `<option value="${row.YearFilter}" selected>${parseInt(
            row.YearFilter
          ) + 543}</option>`;
        else
          option += `<option value="${row.YearFilter}">${parseInt(
            row.YearFilter
          ) + 543}</option>`;
      });

      document.getElementById(`yearFilter`).innerHTML = option;
    }
  };
}

// async function load2(username, userAccountType, show, RG="") {
//   if (existsControl("body-data"))
//   document.getElementById("body-data").innerHTML = ``;

//   const xhttp = new XMLHttpRequest();
//     xhttp.open("POST",API_LOAD);
//     xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhttp.send(JSON.stringify({
//       "name": username,
//       "type": userAccountType,
//       "Cancel": show,
//       "BookingId": RG
//     }));
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {

//             const objects = JSON.parse(this.responseText);
//             let trBody = "";
//             let show0 = '', show1 = '', show2 = '';
//             if (show == 999)
//               show0 = 'selected';
//             else if (show == 0)
//               show1 = 'selected';
//             else if (show == 1)
//               show2 = 'selected';

//               document.getElementById("body").innerHTML = "";

//               let div1 = createElement('div', {id:'div1', className: 'row'});
//               document.getElementById('body').appendChild(div1);

//               let div2 = createElement('div', {id:'div2', className: 'col-xs-1', style: 'display: flex; align-items: center;'});
//               document.getElementById('div1').appendChild(div2);
//               document.getElementById('div2').innerText = 'Show :';

//               let div3 = createElement('div', {id:'div3', className: 'col-sm-2'});
//               document.getElementById('div1').appendChild(div3);

//               let select = createElement('select', {id:'status', className: 'form-control select2bs4', style: 'width: 100%;'});
//               document.getElementById('div3').appendChild(select);
//               var elestatus = document.getElementById('status');
//               elestatus.onchange = function() {load(`'${username}'`, `'${userAccountType}'`, this.value); };

//               let option1 = createElement('option', {id:'option1', value: '999'});
//               document.getElementById('status').appendChild(option1);
//               var eleoption1 = document.getElementById('option1');
//               eleoption1.setAttribute("selected", show0);
//               eleoption1

//               let option2 = createElement('option', {id:'option2', value: '0'});
//               document.getElementById('status').appendChild(option2);
//               var eleoption2 = document.getElementById('option2');
//               eleoption2.setAttribute("selected", show1);

//               let option3 = createElement('option', {id:'option3', value: '1'});
//               document.getElementById('status').appendChild(option3);
//               var eleoption3 = document.getElementById('option3');
//               eleoption3.setAttribute("selected", show2);

//               //---------------------------------------------------------------------------
//               let table = createElement('table', {id:'example1', className: 'table table-bordered table-hover', style: 'border-spacing: 0 15px'});
//               document.getElementById('body').appendChild(table);

//               let thead = createElement('thead', {id:'thead'});
//               document.getElementById('example1').appendChild(thead);

//               let tr = createElement('tr', {id:'tr'});
//               document.getElementById('thead').appendChild(tr);

//               let col1 = createElement('th', {id:'col1'});
//               document.getElementById('tr').appendChild(col1);
//               var elecol1 = document.getElementById('col1');
//               elecol1.innerText = 'Manage';

//               let col2 = createElement('th', {id:'col2'});
//               document.getElementById('tr').appendChild(col2);
//               var elecol2 = document.getElementById('col2');
//               elecol2.innerText = 'ลำดับ';

//               let col3 = createElement('th', {id:'col3'});
//               document.getElementById('tr').appendChild(col3);
//               var elecol3= document.getElementById('col3');
//               elecol3.innerText = 'วันที่ขาย';

//               let col4 = createElement('th', {id:'col4'});
//               document.getElementById('tr').appendChild(col4);
//               var elecol4= document.getElementById('col4');
//               elecol4.innerText = 'Store';

//               let col5 = createElement('th', {id:'col5'});
//               document.getElementById('tr').appendChild(col5);
//               var elecol5= document.getElementById('col5');
//               elecol5.innerText = 'Pool';

//               let col6 = createElement('th', {id:'col6', style: 'display: flex; align-items: center; text-align: right;'});
//               document.getElementById('tr').appendChild(col6);
//               let div1col6 = createElement('div', {id:'div1col6', className: 'col-sm-12'});
//               document.getElementById('col6').appendChild(div1col6);
//               var elediv1col6= document.getElementById('div1col6');
//               elediv1col6.innerText = 'จำนวน';

//               let div2col6 = createElement('div', {id:'div2col6', className: 'col-sm-12'});
//               document.getElementById('col6').appendChild(div2col6);
//               var elediv2col6= document.getElementById('div2col6');
//               elediv2col6.innerText = 'ยอดเงินรวม';

//               let col7 = createElement('th', {id:'col7'});
//               document.getElementById('tr').appendChild(col7);
//               var elecol7 = document.getElementById('col7');
//               elecol7.innerText = 'ลูกค้า';

//               let col8 = createElement('th', {id:'col8'});
//               document.getElementById('tr').appendChild(col8);
//               var elecol8 = document.getElementById('col8');
//               elecol8.innerText = 'View';

//               let tbody = createElement('tbody', {id:'body-data'});
//               document.getElementById('example1').appendChild(tbody);

//             createTable(objects);
//         }
//     }
// }

function createTable(data) {
  let id = 1;
  data.map(row => {
    let _provinceName = row.ProvinceName;
    if (_provinceName != "") _provinceName = _provinceName + " / ";

    let _cancel = row.Cancel;
    let display = "",
      displayImg = "",
      displayCancel = "";
    if (_cancel == 1) {
      displayImg = "block";
      display = "none";
      displayCancel = "none";
    } else {
      displayImg = "none";
      display = "block";

      if (userAccountType > 1)
        // manager
        displayCancel = "block";
      else displayCancel = "none";
    }

    let tr = createElement("tr", { id: "tr-body" });
    document.getElementById("body-data").appendChild(tr);

    let tdManage = createElement("td", { id: "tdManage" });
    document.getElementById("tr-body").appendChild(tdManage);

    let divManage = createElement("div", {
      id: "divManage",
      className: "col-sm-12",
      style: "margin: 5px;"
    });
    document.getElementById("tdManage").appendChild(divManage);

    let btnEdit = createElement("button", {
      id: "btnEdit" + row.RecId,
      className: "btn btn-block btn-outline-success btn-xs",
      style: "display:" + display
    });
    document.getElementById("divManage").appendChild(btnEdit);
    let elebtnEdit = document.getElementById("btnEdit" + row.RecId);
    elebtnEdit.innerText = "Edit";
    // elebtnEdit.onclick = function() {clickEdit(`'${_name}'`,`'${_store}'`,`'${_pool}'`,`'${_qty}'`
    //                                           ,`'${_amount}'`,`'${_custName}'`,`'${_date}'`
    //                                           ,`'${_salesId}'`,`'${_purchId}'`,`'${_userId}'`,`'${_recid}'`
    //                                           ,`'${_region}'`,`'${_province}'`,`'${_pools}'`
    //                                           ) };

    let tdNo = createElement("td", { id: "tdNo" });
    document.getElementById("tr-body").appendChild(tdNo);
    let eletdNo = document.getElementById("tdNo");
    eletdNo.innerText = row.No;

    let tdDate = createElement("td", {
      id: "tdDate",
      style: "display: flex; align-items: center;"
    });
    document.getElementById("tr-body").appendChild(tdDate);
    let divtdDate = createElement("div", {
      id: "divtdDate",
      className: "col-sm-12"
    });
    document.getElementById("tdDate").appendChild(divtdDate);
    let eletdDate = document.getElementById("divtdDate");
    eletdDate.innerText = dateFormat(row.Date.toLocaleString());

    id++;
  });

  $("#example1")
    .DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      searching: true,
      paging: true,
      info: true,
      order: [[1, "desc"]] //order by ลำดับ
      // "scrollX":true
    })
    .buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
}

function createElement(el, options, listen = []) {
  let element = document.createElement(el);

  Object.keys(options).forEach(function(k) {
    element[k] = options[k];
  });
  if (listen.length > 0) {
    listen.forEach(function(l) {
      element.addEventListener(l.event, l.f);
    });
  }
  return element;
}

function filterShow(username, userAccountType, value) {
  load(username, userAccountType, value);
}

function loadDeposit(recid) {
  let amount_html = ``;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_DEPOSIT);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      recid: recid
    })
  );
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      for (let object of objects) {
        let installment = object["Installment"];
        let amount = object["Amount"];

        amount_html += `<div class="col-sm-12">
                        ${numberFormat(amount)}
                      </div>`;
      }
      //document.getElementById("store").innerHTML = trHTML;
    }
  };
  return amount_html;
}

function detailCancelDeposit(customer, datecancel, remark) {
  Swal.fire({
    title: "ยกเลิก",

    html: `<div class="invoice p-3 mb-3" style="background-color:#EFEFEF;">
                  <div class="row">
                      <div class="col-12">
                          <h4>ลูกค้า ${customer} </h4>
                      </div>
                  </div>

                  <div class="row invoice-info">
                      <div class="col-sm-12 invoice-col">
                          <b>วันที่ทำการยกเลิก : ${datecancel} </b> <br>
                          <b>หมายเหตุ : ${remark}</b> 
                      </div>
                  </div>
              </div> 
       `,
    focusConfirm: false,
    icon: "info"
  }).then(result => {});
}

function htmlDeposit(response) {
  let html = "";
  const objects = JSON.parse(response);
  for (let object of objects) {
    let installment = object["Installment"];
    let amount = object["Amount"];

    html += `<div class="col-sm-12">
                ${numberFormat(amount)}
              </div>`;
  }
  return html;
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
// function onDelete(_recid)
// {
//     const xhttp = new XMLHttpRequest();
//     xhttp.open("GET",API_DELETE + _recid);
//     xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhttp.send();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {

//             const objects = JSON.parse(this.responseText);
//             if (objects == "OK") {
//               Swal.fire({
//                 position: 'top-end',
//                 icon: 'success',
//                 title: 'ลบรายการสำเร็จ',
//                 showConfirmButton: false,
//                 timer: 1500
//               }).then(() => {
//                     window.location = 'OrdersPage.html';
//               });
//             } else {
//               Swal.fire({
//                 icon: 'error',
//                 title: objects,
//                 //text: 'Something went wrong!',
//               })
//             }
//         }
//     }
// }

function clickEdit(
  emp,
  store,
  pool,
  qty,
  amount,
  name,
  date,
  sales,
  purch,
  num,
  recId,
  region,
  provinceId,
  pools,
  ShippingCost,
  Discount,
  InstallTeam,
  Free,
  Remark,
  TaxNum,
  phone
) {
  setItem("emp_val", emp); //แสดงชื่อที่ผูกกับ personnelNumber
  setItem("store_val", store);
  setItem("pool_val", pool);
  setItem("qty_val", qty);
  setItem("amount_val", amount);
  setItem("custName_val", name);
  setItem("date_val", date.substring(0, 10));

  setItem("salesId_val", sales);
  setItem("purchId_val", purch);
  setItem("userId_val", num);
  setItem("recId_val", recId);
  setItem("region_val", region);
  setItem("provinceId_val", provinceId);
  setItem("pools_val", pools);

  setItem("ShippingCost_val", ShippingCost);
  setItem("Discount_val", Discount);
  setItem("InstallTeam_val", InstallTeam);
  setItem("Free_val", Free);
  setItem("Remark_val", Remark);
  setItem("TaxNum_val", TaxNum);
  setItem("Phone_val", phone);

  window.location = "OrderEditPage.html";
}

function clickLine(
  recId,
  pool,
  emp,
  store,
  qty,
  amount,
  name,
  date,
  sales,
  purch,
  num,
  region,
  regionName,
  provinceName
) {
  //ส่งค่าไป เพือแสดงเป็น header
  setItem("recId_val", recId);
  setItem("pool_line_val", pool);
  setItem("emp_val", emp); //แสดงชื่อที่ผูกกับ personnelNumber
  setItem("store_val", store);
  setItem("pool_val", pool);
  setItem("qty_val", qty);
  setItem("amount_val", amount);
  setItem("custName_val", name);
  setItem("date_val", date.substring(0, 10));
  //setItem("confirmdate_val", confDate.substring(0,10));
  setItem("salesId_val", sales);
  setItem("purchId_val", purch);
  setItem("userId_val", num);
  setItem("region_val", region);
  setItem("regionName_val", regionName);
  setItem("provinceName_val", provinceName);

  window.location = "LinePage.html";
}

function clickCancel(recId, customer, salesIdAX) {
  if (salesIdAX !== "") {
    warning_message("ไม่สามารถยกเลิกได้", "พบรายการที่ถูกวางงานไปแล้ว");
    return;
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
    }).then(result => {
      if (result.isConfirmed) {
      }
    });
  }

  Swal.fire({
    title: "ยืนยันยกเลิก",
    html: `<label style="font-weight: 400;">คุณต้องการยกเลิกรายการลูกค้า '${customer}' หรือไม่?</label> <br>
            <input type="text" id="remark-cancel" class="form-control" placeholder="หมายเหตุ ยกเลิก">`,
    focusConfirm: false,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    preConfirm: () => {
      const remark = Swal.getPopup().querySelector("#remark-cancel").value;

      if (!remark) {
        Swal.showValidationMessage(`กรุณาใส่หมายเหตุ ยกเลิก`);
      }
      return { Remark: remark };
    }
  }).then(result => {
    onCancel(recId, result.value.Remark);
  });
}

function onCancel(_recid, remark) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_CANCEL);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      RecId: _recid,
      CancelRemark: remark
    })
  );
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ยกเลิกรายการสำเร็จ",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location = "OrdersPage.html";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: objects
          //text: 'Something went wrong!',
        });
      }
    }
  };
}

function clickBrowsImg(recId) {
  Swal.fire({
    title: "Select file image",
    input: "file",
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Upload",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      var formData = new FormData();
      const fileField = document.querySelector('input[type="file"]');

      formData.append("User", "1011405");
      formData.append("RecId", recId);
      formData.append("avatar", fileField.files[0]);

      const othePram = {
        //headers : {"content-type" : "application/json;charset=UTF-8"},
        body: formData,
        method: "POST"
      };

      return fetch(API_UPLOAD_IMAGE, othePram).then(data => {
        return data.json();
      });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Upload image completed.",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location = "OrdersPage.html";
      });
    }
  });
}

function clickPrint(recId) {
  window.open(
    `https://starmark.work/Orderonlinereports/Report/PrintorderConfirmation/5637480578`,
    "_blank",
    "location=yes,height=570,width=520,scrollbars=yes,status=yes"
  );
  //window.location='https://starmark.work/Orderonlinereports/Report/PrintOrderConfirmation/' + recId;
}

function clickImage(recId) {
  setItem("recId_img_val", recId);
  window.location = "GalleryPage.html";
}

function setItem(key, value) {
  sessionStorage.setItem(key, value);
}

function numberFormat(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
