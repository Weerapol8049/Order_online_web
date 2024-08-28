const listSection = document.querySelector(".list-section");
const listContainer = document.querySelector(".list");
let username = localStorage.getItem("username_val");

let SERVER_order = "http://starmark.work/OrderOnline_API_Order_test/";
// let SERVER_CB_ax = "http://starmark.work/OrderOnline_API_AIF_test/";

//let SERVER_order = "";
let SERVER_ax = "http://localhost:4377/";

let API_XML_LOAD = SERVER_order + "api/xml/load/";
let API_XML_LINE_LOAD = SERVER_order + "api/xml/line/load/";
let API_XMLTABLE_CREATE = SERVER_ax + "api/xml/create";
let API_XMLLINE_CREATE = SERVER_ax + "api/xml/line/create";

let xmlTable = [];
let xmlLine = [];

const rowsData = { Data: xmlTable };

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
                        <th>N0.</th>
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
                        <td>${row.CreatedDate.toLocaleString("en-US")}</td>
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
                        <th>N0.</th>
                        <th>Article</th>
                        <th>On-hand</th>
                        <th>Price</th>
                      </tr>
                  </thead>
                  <tbody id="body-data" >
                `;

      data.map((row) => {
        trBody += `<tr>
                        <td>${row.Seq}</td>
                        <td>${row.Article}</td>
                        <td>${row.Onhand}</td>
                        <td>${row.Price}</td>
                    </tr>
                    `;
      });

      trBody += `</table>`;
      document.getElementById("body").innerHTML = trBody;
    }
  };
}

function openFile(fileupload) {
  let input = fileupload;

  uploadFile(input[0]);
  //input.files.length
  for (var index = 0; index < input.length; index++) {
    let reader = new FileReader();
    reader.onload = () => {
      // this 'text' is the content of the file

      var text = reader.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      let customer = doc.getElementsByTagName("CUSTOMER").item(0).textContent;
      let aritcle = doc.getElementsByTagName("ARTICLENO").item(0).textContent;

      var set = doc.getElementsByTagName("Set");
      for (var idxLine = 0; idxLine < set.length; idxLine++) {
        var setLine = set.item(idxLine);
        var pName = setLine.getElementsByTagName("Pname").item(0).textContent;
        var price = setLine
          .getElementsByTagName("ARTICLE_PRICE_INFO1")
          .item(0).textContent;

        xmlLine.push({
          Article: pName,
          Onhand: 0,
          Price: price
        });
      }

      xmlTable.push({
        ItemId: aritcle,
        ItemName: "",
        UploadBy: username,
        FileName: input[index - 1].name,
        Lines: xmlLine
      });
    };
    reader.readAsText(input[index]); //input.files[index]
  }
}

function create() {
  console.log(rowsData);

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_XMLTABLE_CREATE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(rowsData));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
    }
  };
}

// check the file type
function typeValidation(type) {
  var splitType = type.split("/")[0];
  if (
    type == "application/pdf" ||
    type == "text/xml" ||
    splitType == "image" ||
    splitType == "video"
  ) {
    return true;
  }
}

// upload file function
function uploadFile(file) {
  const { name, type, size } = file;

  listSection.style.display = "block";
  var li = document.createElement("li");
  li.classList.add("in-prog");
  li.innerHTML = `
        <div class="col">
            <img src="../images/icons/${iconSelector(type)}" alt="">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(size / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg> -->
        </div>
    `;

  listContainer.prepend(li);

  var data = new FormData();
  data.append("file", file);

  var http = new XMLHttpRequest();
  http.onload = () => {
    li.classList.add("complete");
    li.classList.remove("in-prog");
  };

  http.upload.onprogress = (e) => {
    var percent_complete = (e.loaded / e.total) * 100;
    li.querySelectorAll("span")[0].innerHTML =
      Math.round(percent_complete) + "%";
    li.querySelectorAll("span")[1].style.width = percent_complete + "%";
  };
  const cross = li.querySelector(".cross");

  http.open("POST", "", true);
  http.send(data);

  cross.onclick = () => li.remove();
  //li.querySelector(".cross").onclick = () => http.abort();
  http.onabort = () => li.remove();
}
// find icon for file
function iconSelector(type) {
  var splitType =
    type.split("/")[0] == "application"
      ? type.split("/")[1]
      : type.split("/")[0];
  return splitType + ".png";
}
