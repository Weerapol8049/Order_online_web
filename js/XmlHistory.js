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
                        <th>Name</th>
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
      trBody += `<table id="example1" class="table table-bordered table-hover" >
                  <thead>
                      <tr>
                        <th style="width: 10%">N0.</th>
                        <th>Article</th>
                        <th style="width: 20%">On-hand</th>
                        <th style="width: 20%">Price</th>
                      </tr>
                  </thead>
                  <tbody id="body-data" >
                `;

      data.map((row) => {
        trBody += `<tr>
                        <td >${row.Seq}</td>
                        <td>${row.Article}</td>
                        <td align="right">${numberFormat(row.Onhand)}</td>
                        <td align="right">${numberFormat(row.Price)}</td>
                    </tr>
                    `;
      });

      trBody += `</table>`;
      document.getElementById("body").innerHTML = trBody;
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
      d.getDate().toLocaleString("th-TH", { minimumIntegerDigits: 2, useGrouping: false }) +
      "/" +
      (d.getMonth() + 1).toLocaleString("th-TH", { minimumIntegerDigits: 2, useGrouping: false }) +
      "/" +
      year;
    return _date;
  }
}

function numberFormat(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
