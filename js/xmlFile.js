const listSection = document.querySelector(".list-section");
const listContainer = document.querySelector(".list");

let SERVER_CB_order = "http://starmark.work/OrderOnline_API_Order_test/";
let SERVER_CB_ax = "http://starmark.work/OrderOnline_API_AIF_test/";

let API_EMPLOYEE = SERVER_CB_order + "api/order/employee";

function openFile(fileupload) {
  let input = fileupload;
  console.log(input.files);
  for (var index = 0; index < input.files.length; index++) {
    let reader = new FileReader();
    reader.onload = () => {
      // this 'text' is the content of the file
      var text = reader.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      var customer = doc.getElementsByTagName("CUSTOMER").item(0);
      var aritcleNo = doc.getElementsByTagName("ARTICLENO").item(0);
      console.log(customer.textContent);

      var set = doc.getElementsByTagName("Set");
      for (var idxLine = 0; idxLine < set.length; idxLine++) {
        var setLine = set.item(idxLine);
        var pName = setLine.getElementsByTagName("Pname").item(0).textContent;
        console.log(pName);
      }
    };
    reader.readAsText(input.files[index]);
  }
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
  listSection.style.display = "block";
  var li = document.createElement("li");
  li.classList.add("in-prog");
  li.innerHTML = `
        <div class="col">
            <img src="../images/icons/${iconSelector(file.type)}" alt="">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size / (1024 * 1024)).toFixed(
              2
            )} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `;
  listContainer.prepend(li);
  var http = new XMLHttpRequest();
  var data = new FormData();
  data.append("file", file);
  http.onload = () => {
    li.classList.add("complete");
    li.classList.remove("in-prog");
  };
  http.upload.onprogress = e => {
    var percent_complete = e.loaded / e.total * 100;
    li.querySelectorAll("span")[0].innerHTML =
      Math.round(percent_complete) + "%";
    li.querySelectorAll("span")[1].style.width = percent_complete + "%";
  };
  http.open("POST", "sender.php", true);
  http.send(data);
  li.querySelector(".cross").onclick = () => http.abort();
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
