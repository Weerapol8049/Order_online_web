

let SERVER_PF = 'http://starmark.work/retailsov2_api/';
//let SERVER_PF = 'http://localhost:4462/';
let API_STORE = SERVER_PF + "api/retailso/stored";
let API_ACCOUNT = SERVER_PF + "api/retailso/login/useraccount";

const user = { username : localStorage.getItem("usr_val"), type : localStorage.getItem("type_val"), typeName : localStorage.getItem("userType_name")};

const { username, type, typeName} = user;
document.getElementById('usName').innerText = username;
document.getElementById('usName2').innerText = username;
document.getElementById('userType').innerText = typeName;
loadAccount();
loadStore();
function load() {
    const _data = {
        name: username,
        type: type
      }
  
    const othePram = {
        headers : {"content-type" : "application/json;charset=UTF-8"},
        body: JSON.stringify(_data),
        method : "POST"
      };
      
      fetch(API_ACCOUNT, othePram)
      .then(data => {return data.json()})
      .then(res => {
        let _No = 1;
        let trBody = "";
        document.getElementById("body").innerHTML = "";
        trBody += `<table id="example1" class="table table-bordered table-hover " 
                            style="border-spacing: 0 15px">
                  <thead >
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody id="body-data">
                  `;
        for (const row of res) {
          let _name = row["Name"];
          let _userName = row["Username"];
          let _password = row["Password"];
          let _type = row["Type"];
          
          trBody += `<tr>
                        <td>${_No}</td>
                        <td>${_name}</td>
                        <td>${_userName}</td>
                        <td>${_password}</td>
                        <td>${_type}</td>
                    </tr>
                    `;
          _No++;
        }

        document.getElementById("body").innerHTML = trBody; 
  
        $("#example1").DataTable({
          "responsive": true, 
          "lengthChange": false, 
          "autoWidth": false,
          "searching": true, 
          "paging" : true,
          "info": true,
          "ordering": true
        })
        .buttons()
        .container()
        .appendTo('#example1_wrapper .col-md-6:eq(0)');
   
      })
      .catch(error => console.log(error))
  }

  function loadAccount() {
 console.log(username);
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST",API_ACCOUNT);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "Name" : username
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var HTML = '';
            
            const objects = JSON.parse(this.responseText);

            for (let object of objects)
            {
                let _username1 = object['Username'];
                let _password = object['Password'];
                let _name = object['Name'];
                let _type = object['Type'];
        
                HTML += ` <div class="card-comment">
                            <div class="comment-text">
                              <span class="username">
                                ${_username1}
                                <span class="text-muted float-right">${_type}</span>
                              </span>
                            ${_password}
                            </div>
                          </div>`;
                
            }
            console.log(objects);
            document.getElementById("card-account").innerHTML = HTML;
           
        }
    }
}

  function loadStore() {

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST",API_STORE);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "name" : username, "type" : type
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var HTML = '';
            
            const objects = JSON.parse(this.responseText);

            for (let object of objects)
            {
                let _store = object['StoreId'];
                let _name = object['StoreName'];
        
                HTML += ` <div class="card-comment">
                            <div class="comment-text">
                              <span class="username">
                                ${_store}
                                <span class="text-muted float-right">8:03 PM Today</span>
                              </span>
                            ${_name}
                            </div>
                          </div>`;
                
            }
            document.getElementById("card-store").innerHTML = HTML;
           
        }
    }
}