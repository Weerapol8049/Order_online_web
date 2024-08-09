//let SERVER_M_order = "https://starmark.work/OrderOnline_API_Orders/"; //Live
let SERVER_M_ax = "https://starmark.work/OrderOnline_API_AIF/"; //Live

let SERVER_M_order = "http://localhost:54871/"; //Test

let API_LOAD = SERVER_M_order + "api/customer/load";
let API_CREATE = SERVER_M_ax + "api/customer/create";
let API_UPDATE = SERVER_M_ax + "api/customer/update";
let API_DELETE = SERVER_M_ax + "api/customer/delete";

function init() {
  load();
}
window.onload = init;

async function load(username, userAccountType, show, RG = "", Year = "") {
  if (existsControl("body-data"))
    document.getElementById("body-data").innerHTML = ``;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_LOAD);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      console.log(data);

      let rowcount = 0;
      let trBody = "";

      document.getElementById("body").innerHTML = "";

      trBody += `
              <table id="example1" class="table table-bordered table-hover " 
                                  style="border-spacing: 0 15px">
                        <thead >
                          <tr>
                            <th></th>
                            <th>ลำดับ</th>
                            <th>รหัสลูกค้า</th>
                            <th>ชื่อ</th>
                            <th>เบอร์โทร</th>
                            <th>ประเภท</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody id="body-data">
                  
                        `;

      data.map((row) => {
        console.log(row.Type);
        let type = "";
        if (row.Type == 1) type = "บุคคล";
        if (row.Type == 2) type = "องค์กร";

        trBody += `<tr>
                              <td>
                                  <div class="col-sm-12" style="margin: 5px;"> 
                                    <button type="button" id="btnEdit${row.RecId}" class="btn btn-block btn-outline-success btn-xs" 
                                      onclick="clickEdit('${row.RecId}','${row.CustId}','${row.FirstName}','${row.LastName}'
                                                      ,'${row.Amount}','${row.Name}','${row.Gender}','${row.Phone}','${row.Type}')">
                                                      Edit</button>
                                  </div>
                                  
                                  <div class="col-sm-12" style="margin: 5px;">
                                  <button type="button" id="btnDelete${row.RecId}" class="btn btn-block btn-outline-danger btn-xs" onclick="clickDelete('${row.RecId}')">
                                    Delete 
                                  </button>
                                  </div>

                              </td>
                              <td>${row.No}</td>
                              <td style="display: flex; align-items: center;">
                                  <div class="col-sm-12">
                                  ${row.CustId}
                                  </div>
                              
                              </td>
                              <td style="display: flex; align-items: center;">
                                  <div class="col-sm-12">
                                  ${row.Name}
                                  </div>
                              </td>
                              <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                  ${row.Phone}
                                </div>
                              </td>
                              <td style="display: flex; align-items: center;">
                                <div class="col-sm-12">
                                  ${type}
                                </div>
                              </td>
      
                              <td >
                                <button type="button"  class="btn btn-block btn-outline-info btn-xs" 
                                  onclick="clickAddress('${row.CustId}','${row.Name}','${row.Phone}','${type}')">
                                                  Address (${row.TotalAddress})
                                </button>
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
    }
  };
}

function clickAddress(custId, name, phone, type) {
  sessionStorage.setItem("custId_val", custId);
  sessionStorage.setItem("customerName_val", name);
  sessionStorage.setItem("custPhone_val", phone);
  sessionStorage.setItem("custType_val", type);
  window.location = "AddressPage.html";
}

function existsControl(value) {
  let bool = false;
  var element = document.getElementById(value);
  if (typeof element != "undefined" && element != null) {
    bool = true;
  }
  return bool;
}
