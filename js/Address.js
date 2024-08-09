//let SERVER_M_order = "https://starmark.work/OrderOnline_API_Orders/"; //Live
let SERVER_M_ax = "https://starmark.work/OrderOnline_API_AIF/"; //Live

let SERVER_M_order = "http://localhost:54871/"; //Test

let API_LOAD = SERVER_M_order + "api/customeraddress/load/";
let API_CREATE = SERVER_M_ax + "api/customeraddress/create";
let API_UPDATE = SERVER_M_ax + "api/customeraddress/update";
let API_DELETE = SERVER_M_ax + "api/customeraddress/delete";

function init() {
  loadHeader();
  load(sessionStorage.getItem("custId_val"));
}
window.onload = init;

function loadHeader() {
  document.getElementById("header").innerHTML = "";
  let _header = `<div class="invoice p-3 mb-3" style="background-color:#EFEFEF;">
                        <div class="row">
                        <div class="col-12">
                            <h4>
                            <i class="fas fa-user"></i> ${sessionStorage.getItem("customerName_val") +
                              "(" + sessionStorage.getItem("custId_val") +")"}
                            <small class="float-right">ประเภท : ${sessionStorage.getItem("custType_val")}</small>
                            </h4>
                        </div>
                        <!-- /.col -->
                        </div>

                        <div class="row invoice-info">
                            <div class="col-sm-4 invoice-col">
                                <b>โทร : ${sessionStorage.getItem("custPhone_val")}</b><br>
                            </div>
                          
                        </div>
                    </div>
    `;

  document.getElementById("header").innerHTML = _header;
}

async function load(custId) {
  if (existsControl("body-data"))
    document.getElementById("body-data").innerHTML = ``;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_LOAD + custId);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      let rowcount = 0;
      let trBody = "";

      document.getElementById("body").innerHTML = "";

      trBody += `<a class="btn btn-app bg-success" onclick="createline()">
                            <i class="fas fa-plus"></i> Add address
                        </a>
              <table id="example1" class="table table-bordered table-hover " 
                                  style="border-spacing: 0 15px">
                        <thead >
                          <tr>
  
                                <th>ลำดับ</th>
                                <th>ที่อยู่</th>
                                <th>อำเภอ</th>
                                <th>จังหวัด</th>
                                <th>รหัสไปรษณีย์</th>
                                <th>รายการหลัก</th>
                                <th>Manage</th>
                          </tr>
                        </thead>
                        <tbody id="body-data">
                        `;

      data.map(row => {
        let primary = "";
        if (row.IsPrimary) primary = "ใช้งาน";

        trBody += `<tr>
                              
                              <td>${row.No}</td>
                              <td style="display: flex; align-items: center;">
                                  <div class="col-sm-12">
                                  ${row.Street}
                                  </div>
                              
                              </td>
                              <td style="display: flex; align-items: center;">
                                  <div class="col-sm-12">
                                  ${row.City}
                                  </div>
                              </td>
                              <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                  ${row.State}
                                </div>
                              </td>
                              <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                  ${row.Zipcode}
                                </div>
                              </td>
                              <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                  ${primary}
                                </div>
                              </td>
      
                              <td>
                                  <div class="col-sm-12" style="margin: 5px;"> 
                                    <button type="button" id="btnEdit${row.RecId}" class="btn btn-block btn-outline-success btn-xs" 
                                      onclick="clickEdit('${row.RecId}','${row.CustId}','${row.Street}','${row.City}'
                                                      ,'${row.State}','${row.Zipcode}','${row.IsPrimary}')">
                                                      Edit</button>
                                  </div>
                                  
                                  <div class="col-sm-12" style="margin: 5px;">
                                  <button type="button" id="btnDelete${row.RecId}" class="btn btn-block btn-outline-danger btn-xs" onclick="clickDelete('${row.RecId}')">
                                    Delete 
                                  </button>
                                  </div>
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
          searching: false,
          paging: true,
          info: true,
          order: [[1, "desc"]] //order by ลำดับ
          // "scrollX":true
        })
        .buttons()
        .container()
        .appendTo("#example1_wrapper .col-md-6:eq(0)");
    }
  };
}

function existsControl(value) {
  let bool = false;
  var element = document.getElementById(value);
  if (typeof element != "undefined" && element != null) {
    bool = true;
  }
  return bool;
}
