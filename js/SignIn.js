var input = document.getElementById("password");

input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    signIn();
  }
});

function signIn() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username == "" || password == "") {
    document.getElementById("message").innerHTML =
      '<span id="msg">username and password required.</span>';
  } else {
    const xhttp = new XMLHttpRequest();
    // xhttp.open("POST", 'http://starmark.work/retailsov2_api/api/retailso/login');
    //xhttp.open("POST", 'http://starmark.work/order_online_api_test/api/retailso/login');
    //xhttp.open("POST", 'http://localhost:4462/api/retailso/login');
    //xhttp.open("POST", 'http://localhost:2179/api/OrderOnline/login');

    //xhttp.open("POST", 'http://starmark.work/OrderOnline_API_Orders/api/login');//Live
    xhttp.open(
      "POST",
      "http://starmark.work/OrderOnline_API_Order_test/api/login"
    );
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        Username: username,
        Password: password
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);

        for (let object of objects) {
          if (object.Status == "NOK") {
            document.getElementById("message").innerHTML =
              '<span id="msg">username or password is incorrect!</span>';
          } else if (object.Status == "ADMIN") {
            localStorage.setItem("username_val", objects);
            localStorage.setItem("usr_val", objects);
            localStorage.setItem("type_val", objects);
            location.href = "./Pages/LayoutPage.html";
          } else {
            localStorage.setItem("username_val", object.Username);
            localStorage.setItem("usr_val", object.Name);
            localStorage.setItem("type_val", object.Type);
            localStorage.setItem("storename_val", object.StoreName);
            location.href = "./Pages/LayoutPage.html";
            //location.href = '../Pages/OrdersPage.html'
          }
        }
      }
    };
  }
}


function onKey() {
  //const img = document.getElementById('msg');
  //img.style.display = 'none';
}
