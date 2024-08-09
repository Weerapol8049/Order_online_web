//let SERVER_Avail = 'http://localhost:4462/';
//let SERVER_Avail = 'http://starmark.work/retailsov2_api/';// Test old
//let SERVER_Avail = 'http://starmark.work/order_online_api_test/'; // Test
// let SERVER_Avail = 'http://starmark.work/order_online_api/';// Live

// //let API_STOCK_POOL = SERVER_Avail + "api/stock/pool";
// let API_STOCK_SERIES = SERVER_Avail + "api/retailsoline/series";
// //let API_STOCK_MODEL = SERVER_Avail + "api/stock/salesavailable/model";
// let API_STOCK_MODEL = SERVER_Avail + 'api/retailsoline/model'
// let API_STOCK_LOAD = SERVER_Avail + "api/stock/bomline/load";
// //let API_STOCK_TOTAL = SERVER_Avail + "api/stock/salesavailable/total";
// let API_STOCK_ONORDER = SERVER_Avail + "api/stock/click/compact/onorder";
// let API_STOCK_ORDERED = SERVER_Avail + "api/stock/click/compact/ordered";

// let SERVER_SC_order = 'http://starmark.work/OrderOnline_API_Orders/'; //Live
// let SERVER_SC_Stock = 'http://starmark.work/OrderOnline_API_Stock/'; //Live

let SERVER_SC_order = 'http://starmark.work/OrderOnline_API_Order_test/';
let SERVER_SC_Stock = 'http://starmark.work/OrderOnline_API_Stock_test/';

let API_STOCK_SERIES = SERVER_SC_order + "api/line/series";
let API_STOCK_MODEL = SERVER_SC_order + 'api/line/model'
let API_STOCK_LOAD = SERVER_SC_Stock + "api/stock/compact/load";
let API_STOCK_ONORDER = SERVER_SC_Stock + "api/stock/compact/onorder";
let API_STOCK_ORDERED = SERVER_SC_Stock + "api/stock/compact/ordered";

loadSeries('','','COMPACT-LO')

function loadSeries(selected, pooledit, pool_s)
{
    let pool = pooledit == "" ? pool_s : pooledit;

    document.getElementById("model").innerHTML = "";
    document.getElementById("itemid").value = ""; 

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", API_STOCK_SERIES);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "pool" : pool 
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            var trHTML = '';
            const objects = JSON.parse(this.responseText);

            trHTML += `<option value="" selected="selected">------ None ------</option>`;
            for (let object of objects)
            {
                let _series = object['ProdSeries'];
      
                 if (selected == _series)
                    trHTML += `<option value="${_series}" selected>${_series}</option>`;
                 else
                    trHTML += `<option value="${_series}">${_series}</option>`;
            }
            document.getElementById("series").innerHTML = trHTML;
        }
    }
}

function loadModel(selected, series)
{
    document.getElementById("itemid").value = ""; 
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST",API_STOCK_MODEL);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "series" : series
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
       
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            
            trHTML += `<option value="" selected="selected">------ None ------</option>`;
            for (let object of objects)
            {
                let _model = object['Model'];
                let _itemid = object['ItemId'];
                
                if (selected == _model)
                {
                    trHTML += `<option value="${_model}" selected>${_model}</option>`;
                    document.getElementById("itemid").value = _itemid; 
                }
                else
                {
                    trHTML += `<option value="${_model}">${_model}</option>`;
                }
            }
            document.getElementById("model").innerHTML = trHTML;
        }
    }
}

function onSearch()
{
    document.getElementById("spinLoad").style.display = "block";
    document.getElementById("gridData").innerText = "";

    load('COMPACT-LO', getValue("series"), getValue("model"), getValue("itemid"));
}

function load(pool, series, model, itemid){
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST",API_STOCK_LOAD);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "pool": pool,
        "series": series,
        "model": model,
        "itemId": itemid
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //<label>ยอดคงเหลือ : 220</label>
            let rowCount = 1;
            let trBody = "";
            let classexpend = "";

            const objects = JSON.parse(this.responseText);
            document.getElementById("gridData").innerHTML = "";
            trBody += `
            <table id="example1" class="table table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>Item name</th>
                                <th style="display: flex; align-items: center; text-align: right;">
                                    <div class="col-sm-12">Physical inventory</div>
                                    <div class="col-sm-12">(ยอดในคลัง)</div>
                                </th>
                                <th style="display: flex; align-items: center; text-align: right;">
                                    <div class="col-sm-12">Ordered</div>
                                    <div class="col-sm-12">(สั่งเติม)</div>
                                </th>
                                <th style="display: flex; align-items: center; text-align: right;">
                                    <div class="col-sm-12">OnOrder</div>
                                    <div class="col-sm-12">(สั่งขาย)</div>
                                </th>
                                <th style="display: flex; align-items: center; text-align: right;">
                                    <div class="col-sm-12">Total available</div>
                                    <div class="col-sm-12">(คงเหลือ)</div>
                                </th> 
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody id="body-data" >
                        `;
            for (let data of objects)
            {
                let _seq = data["Seq"];   
                let _series = data["Series"];   
                let _model = data["Model"];   
                let _itemid = data["ItemId"]; 
                let _itemIdParent = data["ItemIdParent"];
                let _name = data["Name"];     
                let _phyInv = data["PhysicalInv"]; 
                let _ordered = data["Ordered"];  
                let _onOrder = data["OnOrder"];   
                let _totalAvail = data["TotalAvailable"];   
                let _unit = data["Unit"];

                if (_seq > 0) {

                    classexpend = ``
                    trBody += ` 
                    <tr >
                        <td >${rowCount}</td>
                        <td style="display: flex; align-items: center;">
                            <div class="row">
                                <div class="col-sm-12">
                                    <strong>${_name}</strong> </br>
                                </div>
                            </div>
                        </td>
                
                        <td style="display: flex; align-items: center; text-align: right;">${numberFormat(_phyInv)}</td>
                        <td style="display: flex; align-items: center; text-align: right; color:#339CFF; cursor:pointer;" onclick='clickOrdered("${_itemid}",${numberFormat(_ordered)});'>${numberFormat(_ordered)}</td>
                        <td style="display: flex; align-items: center; text-align: right; color:#339CFF; cursor:pointer;" onclick='clickOnOrder("${_itemIdParent}",${numberFormat(_onOrder)});'>${numberFormat(_onOrder)}</td>
                        <td style="display: flex; align-items: center; text-align: right;">${numberFormat(_totalAvail)}</td>
                        <td>${_unit}</td>
                    </tr>
                    `;
                    rowCount++;
                }
            }

            document.getElementById("gridData").innerHTML = trBody;
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

              document.getElementById("spinLoad").style.display = "none";
        }
    }
}

function clickOnOrder(itemId, qty){ 
    let tableHTML = ``;
    if (qty)
    {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST",API_STOCK_ONORDER);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({
            "pool": getValue("pool"), 
            "series": getValue("series"), 
            "model": getValue("model"),
            "itemId": itemId
        }));
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                const objects = JSON.parse(this.responseText);
                tableHTML += `<table id="example1" class="table table-bordered table-hover dataTable dtr-inline collapsed" aria-describedby="example1_info">
                <thead>
                    <tr>
                        <th style="font-size:14px;">ลำดับ</th>
                        <th style="font-size:14px;">Store</th>
                        <th style="font-size:14px;">Register number</th>
                        <th style="font-size:14px;">Sales Order AX</th>
                        <!-- <th style="font-size:14px;">Item number</th>
                            <th style="font-size:14px;">Pool</th>
                            <th style="font-size:14px;">Series</th>
                        <th style="font-size:14px;">Model</th> -->
                        <th style="font-size:14px;">Customer</th>
                        <th style="font-size:14px;">Qty</th>
                    </tr>
                </thead>
                <tbody >`;
                for (let data of objects)
                {
                    let _seq = data["Seq"];   
                    let _store = data["Store"];   
                    let _docnum = data["DocNum"];   
                    let _salesId = data["SalesId"];   
                    let _itemId = data["ItemId"];   
                    let _pool = data["Pool"]; 
                    let _series = data["Series"]; 
                    let _model = data["Model"];     
                    let _customer = data["Customer"];     
                    let _qty = data["Qty"];     

                    tableHTML += ` <tr >
                                        <td style="font-size:14px;">${_seq}</td>
                                        <td style="font-size:14px;">${_store}</td>
                                        <td style="font-size:14px;">${_docnum}</td>
                                        <td style="font-size:14px;">${_salesId}</td>
                                        <!-- <td style="font-size:14px;">${_itemId}</td>
                                            <td style="font-size:14px;">${_pool}</td>
                                            <td style="font-size:14px;">${_series}</td>
                                            <td style="font-size:14px;">${_model}</td> -->
                                        <td style="font-size:14px;">${_customer}</td>
                                        <td style="font-size:14px;">${_qty}</td>
                                    </tr>`;
                }
                tableHTML += `</tbody>
                            </table>`;
            }

            Swal.fire({
                title: '<strong>OnOrder (สั่งขาย) </strong>',
                //icon: 'info',
                html: tableHTML,
                width: "1200px",
                showCloseButton: true,
                //showCancelButton: true,
                
            });
        }
    }
}; 

function clickOrdered(itemId, qty){ 
    let tableHTML = ``;
    if (qty)
    {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST",API_STOCK_ORDERED);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({
            "itemId": itemId,
        }));
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                const objects = JSON.parse(this.responseText);
                tableHTML += `<table id="example1" class="table table-bordered table-hover dataTable dtr-inline collapsed" aria-describedby="example1_info">
                <thead>
                    <tr>
                        <th style="font-size:14px;">ลำดับ</th>
                        <th style="font-size:14px;">Delivery date</th>
                        <th style="font-size:14px;">Item name</th>
                        <th style="font-size:14px;">Qty</th>
                    </tr>
                </thead>
                <tbody >`;
                for (let data of objects)
                {
                    let _seq = data["Seq"];    
                    let _itemId = data["ItemId"];   
                    let _name = data["Name"];  
                    let _deliveryDate = data["DlvDate"]; 
                    let _qty = data["Qty"]; 

                    tableHTML += ` <tr >
                                        <td style="font-size:14px;">${_seq}</td>
                                        <td style="font-size:14px;">${dateFormat(_deliveryDate)}</td>
                                        <td style="font-size:14px;">${_name}</td>
                                        <td style="font-size:14px;">${_qty}</td>
                                    </tr>`;
                }
                tableHTML += `</tbody>
                            </table>`;
            }

            Swal.fire({
                title: '<strong>Ordered (สั่งเติม) </strong>',
                html: tableHTML,
                width: "1200px",
                showCloseButton: true,
            })

        }
    }
}; 

function getValue(element) {
    return document.getElementById(element).value;
}

function numberFormat(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function dateFormat(date) {
    if  (date == '-') {
        return date;
    }else {

        var d = new Date(date);
        let y = d.getFullYear() + 543;
        let _date = d.getDate().toLocaleString('th-TH', {minimumIntegerDigits: 2, useGrouping:false}) + '/' +
                (d.getMonth() + 1).toLocaleString('th-TH', {minimumIntegerDigits: 2, useGrouping:false}) + '/' +
                y ;
        return _date;
    }
  }


