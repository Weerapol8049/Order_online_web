// S001 rst@1212

let type = localStorage.getItem("type_val");
let type_name = "";
if (type == 1) {
    type_name = "Sales" ;
    document.getElementById("menuAdmin").style.display = 'none';
    document.getElementById("menuUser").style.display = 'none';
} else if (type == 2) {
    type_name = "Manager" ;
} else if (type == 3) {
    type_name = "Area" ;
} else if (type == 4) {
    type_name = "Admin" ;
} else if (type == 6) {
    type_name = "Installation" ;
    document.getElementById("menuOrder").style.display = 'none';
    document.getElementById("menuStockCompact").style.display = 'none';
    document.getElementById("menuStockDoorPanel").style.display = 'none';
    document.getElementById("menuGallery").style.display = 'none';
    document.getElementById("menuCommission").style.display = 'none';
    document.getElementById("menuAdmin").style.display = 'none';
    document.getElementById("menuUser").style.display = 'none';
} else if (type == 7) {
    type_name = "Key account" ;
}

document.getElementById('usName').innerText = localStorage.getItem("usr_val") + " (" + type_name + ")";
document.getElementById('storename').innerText = localStorage.getItem("storename_val");
localStorage.setItem("userType_name", type_name);


//document.getElementById("linkbooking").href="https://localhost:44316?" + type_name; 
//document.getElementById("linkbooking").href="http://starmark.work/BookingOrder_Test?" + type_name;

//document.getElementById("linkbooking").href="http://starmark.work/OrderOnline_calendar?" + type_name;//Live
document.getElementById("linkbooking").href="http://starmark.work/order_online_calendar_test?" + type_name;

function signOut() {
    localStorage.clear();
    sessionStorage.clear();
    window.location = '../index.html';
}

function onProfile() {
    window.location = '../Pages/Profile.html'
}