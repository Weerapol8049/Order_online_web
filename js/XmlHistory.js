let SERVER_order = "http://starmark.work/OrderOnline_API_Order_test/";

let API_XML_LOAD = SERVER_order + "api/xml/load/";
let API_XML_LINE_LOAD = SERVER_order + "api/xml/line/load/";

load();

function load() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_XML_LOAD + 0);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      let trBody = "";
      document.getElementById("body").innerHTML = "";
      trBody += `<table id="example1" class="table table-bordered table-hover" >
                  <thead>
                      <tr>
                        <th>No.</th>
                        <th>Item number</th>
                        <th>Customer</th>
                        <th>File name</th>
                        <th>Upload by</th>
                        <th>Upload date</th>
                        <th>View</th>
                      </tr>
                  </thead>
                  <tbody id="body-data" >
                `;

      data.map((row) => {
        trBody += `<tr>
                        <td>${row.Seq}</td>
                        <td>${row.ItemId}</td>
                        <td>${row.ItemName}</td>
                        <td>${row.FileName}</td>
                        <td>${row.UploadBy}</td>
                        <td>${dateFormat(row.CreatedDate)}</td>
                        <td>
                            <button type="button" class="btn btn-block btn-outline-success btn-xs" 
                                onclick="load_line(${row.RecId})">Lines (${
          row.Lines
        })</button>
                        </td>
                    </tr>
                    `;
      });

      trBody += `</table>`;
      document.getElementById("body").innerHTML = trBody;
    }
  };
}

function load_line(recId) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_XML_LINE_LOAD + recId);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      let trBody = "";
      document.getElementById("body").innerHTML = "";
      trBody += `<table id="xmlLine" class="table fold-table table-bordered table-hover " >
                  <thead>
                      <tr>
                        <th style="width: 10%">N0.</th>
                        <th>Article</th>

                        <th style="width: 20%">Price</th>
                      </tr>
                  </thead>
                  <tbody id="body-data" >
                `;

      data.map((row) => {
        trBody += `<tr class="view">
                        <td >${row.Seq}</td>
                        <td>${row.Article}</td>
                        
                        <td align="right">${numberFormat(row.Price)}</td>
                    </tr>
                    `;

        if (row.BaseLine.length > 0) {
          trBody += `<tr class="fold" style="padding-left: 50px">
                      <td colspan="5">
                        <div class="fold-content">
                          <h3>Article : ${row.Article}</h3>
                            <table>
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Item number</th>
                                  <th>Name</th>
                                  <th style="width: 12%">Lead time</th>
                                  <th style="width: 12%">On-hand</th>
                                </tr>
                              </thead>
                              <tbody>`;

          row.BaseLine.map((baseline) => {
            trBody += `
                      <tr>
                        <td>${baseline.Seq}</td>
                        <td>${baseline.ItemId}</td>
                        <td>${baseline.ItemName}</td>
                        <td align="right">${numberFormat(
                          baseline.LeadTime
                        )}</td>
                        <td align="right">${numberFormat(baseline.Onhand)}</td>
                      </tr>
                    `;
          });
          trBody += `
                </tbody>
              </table>
            </div>
          </td>
         </tr>`;
        }
      });

      trBody += `</table>`;
      document.getElementById("body").innerHTML = trBody;
    }

    var table = document.getElementById("xmlLine");
    var rows = table.getElementsByClassName("view");
    console.log(table);
    for (i = 1; i < rows.length; i++) {
      var row = table.rows[i];
      row.onclick = (function (myrow) {
        return function () {
          var cell = myrow.getElementsByTagName("td")[0];
          var id = cell.innerHTML;

          myrow.classList.toggle("open");

          var fold = table.getElementsByClassName("fold")[0];
          fold.classList.toggle("open");

          var view = table.getElementsByClassName("view")[0];
          var view_open = table.getElementsByClassName("view open")[0];

          if (view.length > 0) fold.style.display = "none";

          if (view_open.length > 0) fold.style.display = "block";
        };
      })(row);
    }
  };
}

function dateFormat(date) {
  if (date == "-") {
    return date;
  } else {
    var d = new Date(date);

    let year = d.getFullYear() + 543;
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
      year;
    return _date;
  }
}

function numberFormat(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
