const listSection = document.querySelector(".list-section");
const listContainer = document.querySelector(".list");
let username = localStorage.getItem("username_val");

let SERVER_ax = "http://starmark.work/OrderOnline_API_AIF_test/";

//let SERVER_ax = "http://localhost:4377/";

let API_XMLTABLE_CREATE = SERVER_ax + "api/xml/create";
let API_XMLLINE_CREATE = SERVER_ax + "api/xml/line/create";

let xmlTable = [];
let xmlLine = [];

const rowsData = { Data: xmlTable };

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
  Swal.fire({
    title: "ยืนยันการอัปโหลด",
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
      xhttp.open("POST", API_XMLTABLE_CREATE);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify(rowsData));
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);

          if (objects.Status == "OK") {
            Swal.fire(
                "อัปโหลดสำเร็จ",
                "",
                "success"
              ).then(() => {
                window.location = "XMLUpload.html";
              });
          }
          else
          {
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

// check the file type
function typeValidation(type) {
  //var splitType = type.split("/")[0];
  if (type == "text/xml") {
    return true;
  }
}

// upload file function
function uploadFile(file) {
  const { name, type, size } = file;

  listSection.style.display = "block";
  document.getElementById("btnUpload").style.display = 'block';

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
              <div class="file-size">${(size / (1024 * 1024)).toFixed(
                2
              )} MB</div>
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
    document.querySelectorAll(".list-upload").forEach(function (el) {
      el.style.display = "block";
    });
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

  cross.onclick = () => {
    let itemId = li.querySelector(".name").innerHTML.replace(".xml", '');
    xmlTable.map((e) => {
        if (e.ItemId == itemId) {
            xmlTable.splice(itemId, 1);
        }
    });//remove array
    
    li.remove();

    if (xmlTable.length == 0){
        document.getElementById("btnUpload").style.display = 'none';
    }
  }
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
