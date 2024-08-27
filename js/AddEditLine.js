let pool = getItem("pool_line_val");
let action = getItem("action_line");
let series = getItem("series_val");
let model = getItem("model_val");
let item = getItem("itemId_line_val");
let size = getItem("size_val");
let refRecId = getItem("recId_val");
let bookId = getItem("bookId_val");
let confirmDate = getItem("confirmdate_val");
let username = localStorage.getItem("username_val");
let timePeriod = sessionStorage.getItem("timePeriod_val");
let title = document.getElementsByTagName("title")[0].innerText;

//let SERVER = "http://localhost:4462/";
//let SERVER = 'http://starmark.work/retailsov2_api/';
//let SERVER = 'http://starmark.work/order_online_api_test/';
// let SERVER = 'http://starmark.work/order_online_api/';

// let API_SERIES = SERVER + "api/retailsoline/series";
// let API_MODEL = SERVER + "api/retailsoline/model";
// //let API_STOCK = SERVER + "api/stock/load";
// //let API_STOCK_TOTAL = SERVER + "api/stock/total";
// let API_CREATE_LINE = SERVER + "api/retailsoline/create";
// let API_EDIT_LINE = SERVER + "api/retailsoline/edit";
// let API_ITEM = SERVER + "api/stock/item";
// let API_LOAD_SIZE = SERVER + "api/retailsoline/defaultSize";

// //let SERVER = 'http://localhost:2179/';
// let SERVER = 'http://starmark.work/OrderOnline_API_HUB/';
// let API_SERIES = SERVER + "api/OrderOnline/line/series";
// let API_MODEL = SERVER + "api/OrderOnline/line/model";
// let API_CREATE_LINE = SERVER + "api/OrderOnline/line/create";
// let API_EDIT_LINE = SERVER + "api/OrderOnline/line/edit";
// let API_ITEM = SERVER + "api/OrderOnline/line/item";
// let API_LOAD_SIZE = SERVER + "api/OrderOnline/line/defaultSize";

//let SERVER = 'http://localhost:2179/';
//let SERVER_order = "https://starmark.work/OrderOnline_API_Orders/"; //Live
//let SERVER_ax = "https://starmark.work/OrderOnline_API_AIF/"; //Live

let SERVER_order = "http://starmark.work/OrderOnline_API_Order_test/";
let SERVER_ax = "http://starmark.work/OrderOnline_API_AIF_test/";
//let SERVER_ax = 'http://localhost:4377/';
//let SERVER_order = "http://localhost:54871/";

let API_SERIES = SERVER_order + "api/line/series";
let API_MODEL = SERVER_order + "api/line/model";
let API_CREATE_LINE = SERVER_ax + "api/line/create";
let API_EDIT_LINE = SERVER_ax + "api/line/edit";
let API_ITEM = SERVER_order + "api/line/item";
let API_LOAD_SIZE = SERVER_order + "api/line/defaultSize";

if (title == "Add Line") {
  clear();
  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "-" +
    today
      .getDate()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

  setValue("salesDate_line", date);
  setValue("line_recId", refRecId);

  item = "";
  size = "";
  timePeriod = 0;
} else {
  confirmDate =
    getItem("confDate_line_val") == "-" ? "" : getItem("confDate_line_val");

  loadTimePeriod(timePeriod, 0, 0);
  loadSeries(series, pool, "");
  loadModel(model, "", series, 0);

  setValue("line_recId", getItem("recId_line_val"));
  setSalesDatePicker("#salesDate_line", getItem("date_line_val"));
  setConfirmDatePicker(
    "#confirmDate_line0",
    confirmDate,
    document.getElementById("salesDate_line").value
  );
  setValue("multiqty0", getItem("qty_line_val"));
  setValue("multiamount0", getItem("amount_line_val"));

  setValue("bookingId", bookId);
  //setMinConfirmDate(getItem("date_line_val"), 0);
  loadItem(item, pool, series, model);
  //itemName_line_val
  setValue("ItemId0", getItem("itemId_line_val"));
  setValue("ItemName0", getItem("itemName_line_val"));

  if (confirmDate == "") {
    document.getElementById("timeperiod").disabled = true;
    document.getElementById("size0").disabled = true;
  }
}

function setSalesDatePicker(name, date) {
  config = {
    enableTime: false,
    dateFormat: "d/m/Y",
    locale: "th",
    defaultDate: new Date(date)
  };
  flatpickr(name, config);
}

function setConfirmDatePicker(name, date, minDate) {
  if (date == "") {
    config = {
      enableTime: false,
      dateFormat: "d/m/Y",
      locale: "th",
      minDate: addDays(minDate, 4),
      disable: [
        function (date) {
          return date.getDay() === 0;
        }
      ]
    };
    flatpickr(name, config);
  } else {
    config = {
      enableTime: false,
      dateFormat: "d/m/Y",
      locale: "th",
      defaultDate: new Date(date),
      minDate: addDays(minDate, 4),
      disable: [
        function (date) {
          return date.getDay() === 0;
        }
      ]
    };
    flatpickr(name, config);
  }
}

function createGroupSeries() {
  //warning_message("อยู่ระหว่างดำเนินการ","");
  let htmlGroupSeries = "";
  let seq = parseInt(document.getElementById("countSeries").value) + 1;

  let card = createElement("div", {
    id: "cardMultiSeries" + seq,
    className: "card",
    style: "padding: 10px; background-color: #EAECEE;"
  });
  document.getElementById("divSeries").appendChild(card);

  let ul = createElement("ul", {
    id: "ul" + seq,
    className: "list-group list-group-flush"
  });
  card.appendChild(ul);

  let row = createElement("div", { id: "row" + seq, className: "row" });
  ul.appendChild(row);

  let colseq = createElement("div", {
    id: "colseq" + seq,
    className: "col-sm-1",
    style: "text-align: center;"
  });
  row.appendChild(colseq);

  let grouplbl = createElement("div", {
    id: "grouplbl" + seq,
    className: "form-group",
    style: "margin: 0;"
  });
  colseq.appendChild(grouplbl);

  let b = createElement("b", { id: "b" + seq, innerText: "ลำดับ" });
  colseq.appendChild(b);

  let groupseq = createElement("div", {
    id: "groupseq" + seq,
    className: "form-group",
    style: "padding-top: 15px;"
  });
  colseq.appendChild(groupseq);

  let currseq = createElement("label", {
    id: "SERIES-CURRSEQ" + seq,
    innerText: seq
  });
  groupseq.appendChild(currseq);

  let seq2 = createElement("label", {
    id: "SERIES-SEQ" + seq,
    innerText: seq,
    style: "display:none;"
  });
  groupseq.appendChild(seq2);

  //#region series
  let colseries = createElement("div", {
    id: "colseries" + seq,
    className: "col-sm-5"
  });
  row.appendChild(colseries);

  let groupseries = createElement("div", {
    id: "groupseries" + seq,
    className: "form-group"
  });
  colseries.appendChild(groupseries);

  let inputprev = createElement("input", {
    id: `card${seq}-prevSeries`,
    type: "text",
    style: "display:none;"
  });
  colseries.appendChild(inputprev);

  let lblseries = createElement("b", {
    id: "lblseries" + seq,
    innerText: "Series"
  });
  groupseries.appendChild(lblseries);

  let bseries = createElement("label", {
    id: "bseries" + seq,
    innerText: "*",
    style: "color:red;"
  });
  lblseries.appendChild(bseries);

  let series = createElement("select", {
    id: `card${seq}-series`,
    className: "form-control required select2bs4",
    style: "width: 100%;"
  });
  groupseries.appendChild(series);
  series.onchange = function () {
    enableButton(seq, this.value);
  };

  //#endregion

  //#region delete button
  let coldelete = createElement("div", {
    id: "coldelete" + seq,
    className: "col-sm-1"
  });
  row.appendChild(coldelete);

  let groupempty = createElement("div", {
    id: "groupempty" + seq,
    className: "form-group"
  });
  coldelete.appendChild(groupempty);

  let groupdelete = createElement("div", {
    id: "groupdelete" + seq,
    className: "form-group",
    style: "margin-top: 32px"
  });
  coldelete.appendChild(groupdelete);

  let btndelete = createElement("button", {
    id: `btndelete` + seq,
    type: "button",
    className: "btn btn-block btn-outline-danger",
    innerText: "X",
    style: "width: 40px;"
  });
  coldelete.appendChild(btndelete);
  btndelete.onclick = function () {
    deleteGroupSeries("cardMultiSeries" + seq);
  };
  //#endregion

  //#region add model button
  let rowbtn = createElement("div", { id: "rowbtn" + seq, className: "row" });
  ul.appendChild(rowbtn);

  let colAdd = createElement("div", {
    id: "colAdd" + seq,
    className: "col-xs-2"
  });
  rowbtn.appendChild(colAdd);

  let groupAdd = createElement("div", {
    id: `card${seq}-groupBtnModel`,
    className: "form-group",
    style: "margin-left: 10px"
  });
  colAdd.appendChild(groupAdd);

  let btnAdd = createElement("button", {
    id: "btnAdd" + seq,
    className: "btn btn-block btn-outline-success btn-xs",
    type: "button",
    innerText: "Add model",
    disabled: true
  });
  groupAdd.appendChild(btnAdd);

  let icon = createElement("i", {
    id: "icon" + seq,
    className: "fas fa-plus nav-icon"
  });
  btnAdd.appendChild(icon);
  btnAdd.onclick = function () {
    createModelGroup(
      `'${pool}'`,
      document.getElementById(`card${seq}-series`).value,
      seq
    );
  };

  let inputCount = createElement("input", {
    id: `card${seq}-countItem`,
    style: "display:none;",
    type: "number"
  });
  rowbtn.appendChild(inputCount);
  //#endregion

  //-------------------------------------- Card model ----------------------------------------
  let cardmodel = createElement("i", {
    id: `card${seq}-cardMultiItem`,
    className: "card"
  });
  ul.appendChild(cardmodel);

  let ulmodel = createElement("ul", {
    id: `ulmodel` + seq,
    className: "list-group list-group-flush"
  });
  ul.appendChild(ulmodel);

  //document.getElementById("divSeries").innerHTML = htmlGroupSeries;
  document.getElementById("countSeries").value = seq;
  document.getElementById(`card${seq}-countItem`).setAttribute("value", 0);
  loadSeries(series, pool, "", seq);
  refreshSequence("SERIES-CURRSEQ");
}

// function createGroupSeries2() {
//   //warning_message("อยู่ระหว่างดำเนินการ","");
//   let htmlGroupSeries = "";
//   let seq = parseInt(document.getElementById("countSeries").value) + 1;

//   htmlGroupSeries += document.getElementById("divSeries").innerHTML;

//   htmlGroupSeries += `
//   <div class="card" id="cardMultiSeries${seq}" style="padding: 10px; background-color: #EAECEE;">
//                 <ul class="list-group list-group-flush">
//                   <div class="row">
//                     <div class="col-sm-1" style="text-align: center;">
//                       <div class="form-group">
//                           <b>ลำดับ</b>
//                       </div>
//                       <div class="form-group" >
//                           <label id="SERIES-CURRSEQ${seq}" >${seq}</label>
//                           <label id="SERIES-SEQ${seq}" style="display: none;">${seq}</label>
//                       </div>
//                     </div>
//                     <!-- Series -->
//                     <div class="col-sm-5">
//                       <div class="form-group">
//                         <label for="series">Series <b style="color: red;">*</b></label>
//                         <select id="card${seq}-series" class="form-control required select2bs4 " style="width: 100%;"
//                           onchange="enableButton(${seq}, this.value);"
//                         >
//                         </select>
//                       </div>
//                       <input type="text" id="card${seq}-prevSeries" style="display:none;">
//                     </div>

//                     <div class="col-sm-1">
//                       <div class="form-group"></div>
//                       <div class="form-group" style="margin-top: 32px">
//                           <button type="button" class="btn btn-block btn-outline-danger"
//                           onclick="deleteGroupSeries('cardMultiSeries${seq}');"
//                           style="width: 40px;">X</button>
//                       </div>
//                     </div>

//                   </div>
//                   <!-- --------------------------------------------------------------------------------------------- -->
//                   <div class="row">
//                     <div class="col-xs-2" >
//                       <div class="form-group" style="margin-left: 10px" id="card${seq}-groupBtnModel">
//                         <button type="button"  class="btn btn-block btn-outline-success btn-xs" disabled
//                           onclick="createModelGroup('${pool}', document.getElementById('card${seq}-series').value, ${seq});">
//                           <i class="fas fa-plus nav-icon"></i>
//                           Add model
//                         </button>

//                         <!-- <button type="button" class="btn btn-block btn-outline-success btn-xs"
//                           onclick="onSelectItemId('onclick', false, ${seq});">
//                           <i class="fas fa-plus nav-icon"></i>
//                           Add item
//                         </button> -->

//                       </div>
//                       <input type="number" id="card${seq}-countItem" style="display:none;">
//                     </div>
//                   </div>
//                   <!-- ---------------------------------- Card Items ----------------------------------- -->
//                   <div class="card" id="card${seq}-cardMultiItem" >
//                     <ul class="list-group list-group-flush">

//                     </ul>
//                   </div>
//                 </ul>
//               </div>
//               `;

//   document.getElementById("divSeries").innerHTML = htmlGroupSeries;
//   document.getElementById("countSeries").value = seq;
//   document.getElementById(`card${seq}-countItem`).setAttribute("value", 0);
//   loadSeries(series, pool, "", seq);
//   refreshSequence("SERIES-CURRSEQ");
// }

function enableButton(seq, series) {
  let disable = "";
  let allowEdit = true;

  const elements = document.querySelectorAll(`[id^="card${seq}-model"]`);
  elements.forEach((element) => {
    let modelval = document.getElementById(element.id).value;
    if (modelval) {
      warning_message(
        "ไม่สามารถแก้ไขได้",
        "เนื่องจากมีการสร้างรายการ model แล้ว"
      );
      loadSeries(
        document.getElementById(`card${seq}-prevSeries`).value,
        pool,
        "",
        seq
      );
      allowEdit = false;
    }
  });

  if (series == "") {
    disable = "disabled";
  } else {
    if (allowEdit)
      document
        .getElementById(`card${seq}-prevSeries`)
        .setAttribute("value", series);
  }

  let checkbox = `<button type="button"  class="btn btn-block btn-outline-success btn-xs" ${disable}
                    onclick="createModelGroup('${pool}', document.getElementById('card${seq}-series').value, ${seq});">
                    <i class="fas fa-plus nav-icon"></i>
                    Add model
                  </button>`;
  document.getElementById(`card${seq}-groupBtnModel`).innerHTML = checkbox;
}

function createModelGroup(pool, series, seqSeries) {
  onSelectItemId(model, false, seqSeries);

  if (title == "Add Line") {
    let seq = parseInt(
      document.getElementById(`card${seqSeries}-countItem`).value
    );

    loadModel("", "", series, seqSeries, seq);

    document
      .getElementById(`card${seqSeries}-countItem`)
      .setAttribute("value", seq);
  } else if (title == "Edit Line") {
    loadSize(size, seqSeries, 0);
  }

  refreshSequence(`card${seqSeries}-CURRSEQ`);
}

function loadModel(selected, seriesedit, series_s, seqSeries, id) {
  //let series = seriesedit == "" ? series_s : seriesedit;

  loadSeries(series_s, pool, "", seqSeries);

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_MODEL);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      series: series_s
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      const objects = JSON.parse(this.responseText);

      trHTML += `<option value="" selected="selected">------ None ------</option>`;
      objects.map((row) => {
        if (selected == row.Model) {
          trHTML += `<option value="${row.Model}" selected>${row.Model}</option>`;
        } else trHTML += `<option value="${row.Model}">${row.Model}</option>`;
      });

      if (title == "Add Line")
        document.getElementById(`card${seqSeries}-model` + id).innerHTML =
          trHTML;
      else document.getElementById(`model`).innerHTML = trHTML;
    }
  };
}

function getDefaultItemId(pool, series, model, seqSeries, id) {
  let itemId = "";

  loadModel(model, "", series, seqSeries, id); // SET MODEL VALUE card1-confirmDate_line1

  document.getElementById(`card${seqSeries}-confirmDate_line` + id).value = "";

  if (model === "") {
    document
      .getElementById(`card${seqSeries}-itemId` + id)
      .setAttribute("value", "");

    onChecked(false, seqSeries, id);
    return;
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", API_ITEM);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        pool: pool,
        series: series,
        model: model
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        const itemId = document.getElementById(`card${seqSeries}-itemId` + id);
        if (objects.length > 0) {
          objects.map((row) => {
            itemId.setAttribute("value", row.ItemId);

            document
              .getElementById(`card${seqSeries}-itemName` + id)
              .setAttribute("value", row.Name);

            onChecked(row.Booking == 1 ? true : false, seqSeries, id);
          });
        } else {
          const dateObj = new Date();
          const day = dateObj.getUTCDate();
          const month = dateObj.getUTCMonth() + 1; // months from 1-12
          const year = dateObj.getUTCFullYear() + 543; // year thai พ.ศ.

          const newDate = `${year}`;
          const pMonth = month.toString().padStart(2, "0");

          itemId.value = `${newDate.substring(2, 4)}${pMonth}-*****`;
        }
      }
    };
  }
}

function onSelectItemId(model, check, seqSeries) {
  if (!existsControl(`card${seqSeries}-countItem`)) {
    let i =
      parseInt(document.getElementById(`card${seqSeries}-countItem`).value) + 1;

    let salesDate = document.getElementById("salesDate_line").value;

    if (check == true) {
      minDate = `min="${strToDate(salesDate, 4)}"`;
    }

    let ul = createElement("ul", {
      id: `card${seqSeries}-ul${i}`,
      className: "list-group list-group-flush"
    });
    document.getElementById(`card${seqSeries}-cardMultiItem`).appendChild(ul);

    let li = createElement("li", {
      id: `card${seqSeries}-li${i}`,
      className: "list-group-item"
    });
    ul.appendChild(li);

    let row = createElement("div", {
      id: `card${seqSeries}-row${i}`,
      className: "row"
    });
    li.appendChild(row);

    let colseq = createElement("div", {
      id: `card${seqSeries}-colseq${i}`,
      className: "col-xs-1",
      style:
        "font-style: normal; margin-right: 15px; margin-bottom: 0; text-align: center;"
    });
    row.appendChild(colseq);

    let grouplblseq = createElement("div", {
      id: `card${seqSeries}-grouplblseq${i}`,
      className: "form-group",
      style: "margin-bottom: 0;"
    });
    colseq.appendChild(grouplblseq);

    let b = createElement("b", {
      id: `card${seqSeries}-b${i}`,
      innerText: "ลำดับ"
    });
    grouplblseq.appendChild(b);

    let groupseq = createElement("div", {
      id: `card${seqSeries}-groupseq${i}`,
      className: "form-group",
      style: "padding-top: 10px;"
    });
    colseq.appendChild(groupseq);

    let currseq = createElement("label", {
      id: `card${seqSeries}-CURRSEQ${i}`,
      innerText: i
    });
    groupseq.appendChild(currseq);

    let seq = createElement("label", {
      id: `card${seqSeries}-SEQ${i}`,
      style: "display: none;",
      innerText: i
    });
    groupseq.appendChild(seq);

    //#region ติดตั้ง
    let colconfirm = createElement("div", {
      id: `card${seqSeries}-colconfirm${i}`,
      className: "col-xs-1",
      style: "font-style: normal; text-align: center;"
    });
    row.appendChild(colconfirm);

    let groupconfirm = createElement("div", {
      id: `card${seqSeries}-groupconfirm${i}`,
      className: "form-group",
      style: "margin-bottom: 0;"
    });
    colconfirm.appendChild(groupconfirm);

    let bconf = createElement("b", {
      id: `card${seqSeries}-bconf${i}`,
      innerText: "ติดตั้ง"
    });
    groupconfirm.appendChild(bconf);

    let groupCheck = createElement("div", {
      id: `card${seqSeries}-groupCheck${i}`,
      className: "form-group",
      style: "padding-top: 10px;"
    });
    colconfirm.appendChild(groupCheck);

    let checkBooking = createElement("input", {
      id: `card${seqSeries}-checkBooking${i}`,
      className: "form-group",
      type: "checkbox"
    });
    groupCheck.appendChild(checkBooking);
    checkBooking.onclick = function () {
      activeBooking(this.checked, i);
    };
    //#endregion

    //#region model

    let colmodel = createElement("div", {
      id: `card${seqSeries}-colmodel${i}`,
      className: "col-sm-5",
      style: "font-style: normal;"
    });
    row.appendChild(colmodel);

    let groupmodel = createElement("div", {
      id: `card${seqSeries}-groupmodel${i}`,
      className: "form-group"
    });
    colmodel.appendChild(groupmodel);

    let bmodel = createElement("b", {
      id: `card${seqSeries}-bmodel${i}`,
      innerText: "Model"
    });
    groupmodel.appendChild(bmodel);

    let bd = createElement("b", {
      id: `card${seqSeries}-b*${i}`,
      style: "color: red;",
      innerText: "*"
    });
    bmodel.appendChild(bd);

    let model = createElement("select", {
      id: `card${seqSeries}-model${i}`,
      className: "form-control required select2bs4",
      style: "width: 100%;"
    });
    groupmodel.appendChild(model);
    model.onchange = function () {
      getDefaultItemId(
        `${pool}`,
        document.getElementById(`card${seqSeries}-series`).value,
        this.value,
        seqSeries,
        parseInt(i - 1)
      );
    };

    //#endregion

    //#region Item
    let rowItem = createElement("div", {
      id: `card${seqSeries}-rowItem${i}`,
      className: "row"
    });
    li.appendChild(rowItem);

    let colItemEmpty = createElement("div", {
      id: `card${seqSeries}-colItemEmpty${i}`,
      className: "col-sm-1",
      style: "font-style: normal;"
    });
    rowItem.appendChild(colItemEmpty);

    let colItem = createElement("div", {
      id: `card${seqSeries}-colItem${i}`,
      className: "col-sm-4",
      style: "font-style: normal;"
    });
    rowItem.appendChild(colItem);

    let itemId = createElement("input", {
      id: `card${seqSeries}-itemId${i}`,
      className: "form-control",
      type: "text",
      placeholder: "รหัสสินค้า",
      disabled: true
    });
    colItem.appendChild(itemId);

    let colItemName = createElement("div", {
      id: `card${seqSeries}-colItemName${i}`,
      className: "col-sm-6",
      style: "font-style: normal;"
    });
    rowItem.appendChild(colItemName);

    let itemName = createElement("input", {
      id: `card${seqSeries}-itemName${i}`,
      className: "form-control",
      placeholder: "ชื่อสินค้า",
      type: "text"
    });
    colItemName.appendChild(itemName);

    let _default = createElement("div", { id: `default` });
    colmodel.appendChild(_default);
    //#endregion

    //#region จำนวน
    let colmultiqty = createElement("div", {
      id: `card${seqSeries}-colmultiqty${i}`,
      className: "col-md-2",
      style: "font-style: normal;"
    });
    row.appendChild(colmultiqty);

    let groupmultiqty = createElement("div", {
      id: `card${seqSeries}-groupmultiqty${i}`,
      className: "form-group"
    });
    colmultiqty.appendChild(groupmultiqty);

    let bmultiqty = createElement("b", {
      id: `card${seqSeries}-bmultiqty${i}`,
      innerText: "จำนวน"
    });
    groupmultiqty.appendChild(bmultiqty);

    let multiqty = createElement("input", {
      id: `card${seqSeries}-multiqty${i}`,
      className: "form-control",
      type: "number",
      min: 0,
      value: 0
    });
    groupmultiqty.appendChild(multiqty);
    multiqty.onchange = function () {
      setQtyValue(seqSeries, parseInt(i - 1));
    };
    multiqty.oninput = function () {
      this.value = Math.abs(this.value);
    };
    //#endregion

    //#region ยอดเงินรวม
    let colamount = createElement("div", {
      id: `card${seqSeries}-colamount${i}`,
      className: "col-md-2",
      style: "font-style: normal;"
    });
    row.appendChild(colamount);

    let groupamount = createElement("div", {
      id: `card${seqSeries}-groupamount${i}`,
      className: "form-group"
    });
    colamount.appendChild(groupamount);

    let bamount = createElement("b", {
      id: `card${seqSeries}-bamount${i}`,
      innerText: "ยอดเงินรวม"
    });
    groupamount.appendChild(bamount);

    let multiamount = createElement("input", {
      id: `card${seqSeries}-multiamount${i}`,
      className: "form-control",
      type: "number",
      min: 0,
      step: ".01",
      value: "0.00"
    });
    multiamount.setAttribute("data-decimal", "2");
    multiamount.oninput = function () {
      enforceNumberValidation(this);
    };

    groupamount.appendChild(multiamount);
    multiamount.onchange = function () {
      setAmountValue(seqSeries, parseInt(i - 1));
    };

    //#endregion

    //#region delete button
    let coldelete = createElement("div", {
      id: `card${seqSeries}-coldelete${i}`,
      className: "col-sm-1",
      style: "font-style: normal;"
    });
    row.appendChild(coldelete);

    let groupEmpty = createElement("div", {
      id: `card${seqSeries}-groupEmpty${i}`,
      className: "form-group"
    });
    coldelete.appendChild(groupEmpty);

    let groupdelete = createElement("div", {
      id: `card${seqSeries}-groupdelete${i}`,
      className: "form-group",
      style: "margin-top: 25px"
    });
    coldelete.appendChild(groupdelete);

    let btndelete = createElement("div", {
      id: `card${seqSeries}-btndelete${i}`,
      innerText: "X",
      className: "btn btn-block btn-outline-danger",
      type: "button",
      style: "width: 40px;"
    });
    groupdelete.appendChild(btndelete);
    btndelete.onclick = function () {
      deleteGroup(
        `'card${seqSeries}-ul${parseInt(i - 1)}'`,
        seqSeries,
        parseInt(i - 1)
      );
    };

    //#endregion

    //#region empty

    let row2 = createElement("div", {
      id: `card${seqSeries}-row2${i}`,
      className: "row"
    });
    li.appendChild(row2);

    let colempty = createElement("div", {
      id: `card${seqSeries}-colempty${i}`,
      className: "col-sm-1",
      style: "font-style: normal;"
    });
    row2.appendChild(colempty);

    let groupEmpty1 = createElement("div", {
      id: `card${seqSeries}-groupEmpty1${i}`,
      className: "form-group"
    });
    colempty.appendChild(groupEmpty1);

    let groupEmpty2 = createElement("div", {
      id: `card${seqSeries}-groupEmpty2${i}`,
      className: "form-group"
    });
    colempty.appendChild(groupEmpty2);

    //#endregion

    //#region confirm date

    let colconfdate = createElement("div", {
      id: `card${seqSeries}-colconfdate${i}`,
      className: "col-sm-3",
      style: "font-style: normal;"
    });
    row2.appendChild(colconfdate);

    let groupconfdate = createElement("div", {
      id: `card${seqSeries}-groupconfdate${i}`,
      className: "form-group"
    });
    colconfdate.appendChild(groupconfdate);

    let bconfdate = createElement("b", {
      id: `card${seqSeries}-bconfdate${i}`,
      innerText: "วันที่ติดตั้ง"
    });
    groupconfdate.appendChild(bconfdate);

    let icons = createElement("div", {
      id: `card${seqSeries}-icons${i}`,
      className: "input-icons"
    });
    groupconfdate.appendChild(icons);

    let iicons = createElement("i", {
      id: `card${seqSeries}-iicons${i}`,
      className: "fa fa-calendar icon"
    });
    icons.appendChild(iicons);

    let confirmDate_line = createElement("input", {
      id: `card${seqSeries}-confirmDate_line${i}`,
      className: "form-control flatpickr",
      type: "text",
      style: "background-color: white; padding-left: 30px;"
    });
    icons.appendChild(confirmDate_line);

    flatpickr(`#card${seqSeries}-confirmDate_line${i}`, {
      locale: "th",
      dateFormat: "d/m/Y",
      minDate: addDays(document.getElementById("salesDate_line").value, 4),
      disable: [
        function (date) {
          return date.getDay() === 0;
        }
      ]
    });

    confirmDate_line.onchange = function () {
      activeTimePeriod(this.value, seqSeries, parseInt(i - 1));
    };
    //#endregion

    //#region ช่วงเวลา

    let coltime = createElement("div", {
      id: `card${seqSeries}-coltime${i}`,
      className: "col-sm-2",
      style: "font-style: normal;"
    });
    row2.appendChild(coltime);

    let grouptime = createElement("div", {
      id: `card${seqSeries}-grouptime${i}`,
      className: "form-group"
    });
    coltime.appendChild(grouptime);

    let btime = createElement("b", {
      id: `card${seqSeries}-btime${i}`,
      innerText: "ช่วงเวลา"
    });
    grouptime.appendChild(btime);

    let timeperiod = createElement("select", {
      id: `card${seqSeries}-timeperiod${i}`,
      className: "form-control select2bs4",
      style: "width: 100%;"
    });
    grouptime.appendChild(timeperiod);
    timeperiod.onchange = function () {
      loadTimePeriod(this.value, seqSeries, parseInt(i - 1));
    };

    const opt1 = document.createElement("option");
    const opt2 = document.createElement("option");
    const opt3 = document.createElement("option");

    opt1.value = "0";
    opt1.text = "";

    opt2.value = "1";
    opt2.text = "เช้า";

    opt3.value = "2";
    opt3.text = "บ่าย";

    timeperiod.add(opt1, null);
    timeperiod.add(opt2, null);
    timeperiod.add(opt3, null);

    //#endregion

    //#region size
    let colsize = createElement("div", {
      id: `card${seqSeries}-colsize${i}`,
      className: "col-sm-3",
      style: "font-style: normal;"
    });
    row2.appendChild(colsize);

    let groupsize = createElement("div", {
      id: `card${seqSeries}-groupsize${i}`,
      className: "form-group"
    });
    colsize.appendChild(groupsize);

    let bsize = createElement("b", { id: `card${seqSeries}-bsize${i}` });
    groupsize.appendChild(bsize);
    bsize.innerText = "Size";

    let size = createElement("select", {
      id: `card${seqSeries}-size${i}`,
      className: "form-control select2bs4",
      style: "width: 100%;"
    });
    groupsize.appendChild(size);
    size.onchange = function () {
      loadSize(this.value, seqSeries, parseInt(i - 1));
    };

    const optS1 = document.createElement("option");
    const optS2 = document.createElement("option");
    const optS3 = document.createElement("option");
    const optS4 = document.createElement("option");

    optS1.value = "";
    optS1.text = "";

    optS2.value = "S";
    optS2.text = "S (1-3 เมตร)";

    optS3.value = "M";
    optS3.text = "M (3-7 เมตร)";

    optS4.value = "L";
    optS4.text = "L (มากกว่า 7 เมตร)";

    size.add(optS1, null);
    size.add(optS2, null);
    size.add(optS3, null);
    size.add(optS4, null);
    //#endregion

    i++;
    //let inputConfDate = createElement('input', {id:`card${seqSeries}-confirmDate_line${i}`, className: 'form-control', type: 'text', min: strToDate(salesDate, 4)});
    document.getElementById(`card${seqSeries}-countItem`).value = parseInt(
      i - 1
    ); //เก็บจำนวน item ที่เลือก
  }
}

function createElement(el, options, listen = []) {
  let element = document.createElement(el);

  Object.keys(options).forEach(function (k) {
    element[k] = options[k];
  });
  if (listen.length > 0) {
    listen.forEach(function (l) {
      element.addEventListener(l.event, l.f);
    });
  }
  return element;
}

// function onSelectItemId2(model, check, seqSeries) {
//   var multipleItem = "";

//   if (!existsControl(`card${seqSeries}-countItem`)) {
//     let i =
//       parseInt(document.getElementById(`card${seqSeries}-countItem`).value) + 1;
//     //let model = document.getElementById(`card${seqSeries}-model`).value;
//     let defaultCheck = "";
//     let minDate = "";
//     let enableTS = "disabled";
//     let enableConfirmDate = "disabled";
//     let salesDate = document.getElementById("salesDate_line").value;

//     if (check == true) {
//       minDate = `min="${strToDate(salesDate, 4)}"`;
//     }

//     multipleItem += document.getElementById(`card${seqSeries}-cardMultiItem`)
//       .innerHTML;

//     multipleItem += `<ul class="list-group list-group-flush "
//                           id="card${seqSeries}-ul${i}">
//                           <li class="list-group-item">
//                           <div class="row">
//                               <div class="col-xs-1"
//                               style="margin-right: 15px; margin-bottom: 0; text-align: center;">
//                                 <div class="form-group" style="margin-bottom: 0;">
//                                     <b>ลำดับ</b>
//                                 </div>
//                                 <div class="form-group" >
//                                     <label id="card${seqSeries}-CURRSEQ${i}">${i}</label>
//                                     <label id="card${seqSeries}-SEQ${i}" style="display: none;">${i}</label>
//                                 </div>
//                               </div>
//                               <div class="col-xs-1" style="text-align: center;">
//                                 <div class="form-group" style="margin-bottom: 0;">
//                                   <b>ติดตั้ง</b>
//                                 </div>
//                                 <div class="form-group" id="card${seqSeries}-groupCheck${i}">

//                                     <input type="checkbox" id="card${seqSeries}-checkBooking${i}"
//                                     onclick="activeBooking(this.checked,${seqSeries}, ${i})">

//                                 </div>
//                               </div>

//                               <div class="col-sm-5 ">
//                                 <div class="form-group">
//                                 <b>Model <b style="color: red;">*</b></b>
//                                 <select id="card${seqSeries}-model${i}"
//                                   class="form-control required select2bs4" style="width: 100%;"
//                                   onchange="getDefaultItemId('${pool}',document.getElementById('card${seqSeries}-series').value, this.value, ${seqSeries}, ${i})"
//                                   >
//                                 </select>

//                                     <input type="text" id="card${seqSeries}-itemId${i}" style="display:none;">

//                                     <div id="default"></div>
//                                 </div>
//                               </div>

//                               <div class="col-md-2">
//                                 <div class="form-group">
//                                     <b>จำนวน</b>
//                                     <input type="number" id="card${seqSeries}-multiqty${i}" value="0"  class="form-control"
//                                     min="0" oninput="this.value = Math.abs(this.value)"
//                                     onchange="setQtyValue(${seqSeries},${i})">
//                                 </div>
//                               </div>

//                               <div class="col-md-2">
//                                 <div class="form-group">
//                                   <b>ยอดเงินรวม</b>
//                                   <input type="number" id="card${seqSeries}-multiamount${i}" value="0" class="form-control"
//                                   min="0" oninput="this.value = Math.abs(this.value)"
//                                   onchange="setAmountValue(${seqSeries},${i})">
//                                 </div>
//                               </div>

//                               <div class="col-sm-1">
//                                 <div class="form-group"></div>
//                                 <div class="form-group" style="margin-top: 25px">
//                                     <button type="button" class="btn btn-block btn-outline-danger"
//                                         onclick="deleteGroup('card${seqSeries}-ul${i}', ${seqSeries});"
//                                     style="width: 40px;">X</button>
//                                 </div>
//                               </div>

//                           </div>
//                           <div class="row">
//                               <div class="col-sm-1" >
//                                 <div class="form-group" >

//                                 </div>
//                                 <div class="form-group" >

//                                 </div>
//                               </div>

//                               <div class="col-sm-2" style="display: none;">
//                                 <div class="form-group">

//                                     <input type="date" id="salesDate_line${i}" class="form-control" value="${salesDate}"
//                                     onchange="setMinConfirmDate(this.value, 0);">

//                                 </div>
//                               </div>

//                               <div class="col-sm-3">
//                                 <div class="form-group">
//                                     <b>วันที่ติดตั้ง</b>
//                                     <div id="card${seqSeries}-groupConfirmDate_line${i}">
//                                       <div class="input-icons" id="card${seqSeries}-icons${i}">
//                                         <i class="fa fa-calendar icon"></i>
//                                       </div>
//                                     </div>
//                                 </div>
//                               </div>

//                               <div class="col-sm-2">
//                               <div class="form-group">
//                                   <b>ช่วงเวลา</b>
//                                   <select id="card${seqSeries}-timeperiod${i}" class="form-control select2bs4" style="width: 100%;" ${enableTS}
//                                   onchange="loadTimePeriod(this.value, ${seqSeries}, ${i});"
//                                   >
//                                   <option value="0" selected></option>
//                                   <option value="1">เช้า</option>
//                                   <option value="2">บ่าย</option>
//                                   </select>
//                               </div>
//                               </div>
//                               <div class="col-sm-3">
//                               <div class="form-group">
//                                   <b>Size</b>
//                                   <select id="card${seqSeries}-size${i}" class="form-control select2bs4 required" ${enableTS}
//                                   onchange="loadSize(this.value,${seqSeries}, ${i})">
//                                   <option value="" selected></option>
//                                   <option value="S">S (1-3 เมตร)</option>
//                                   <option value="M">M (3-7 เมตร)</option>
//                                   <option value="L">L (มากกว่า 7 เมตร)</option>
//                                   </select>
//                               </div>
//                               </div>

//                           </div>
//                           </li>
//                         <hr>
//                       </ul>`;
//     i++;

//     let j = parseInt(i - 1);

//     document.getElementById(`card${seqSeries}-countItem`).value = j; //เก็บจำนวน item ที่เลือก
//     document.getElementById(
//       `card${seqSeries}-cardMultiItem`
//     ).innerHTML = multipleItem;

//     let rows = createElement("input", {
//       id: `card${seqSeries}-confirmDate_line${j}`,
//       className: "form-control flatpickr",
//       type: "text",
//       style: "background-color: white; padding-left: 30px;"
//     });
//     document.getElementById(`card${seqSeries}-icons${j}`).appendChild(rows);

//     flatpickr(`#card${seqSeries}-confirmDate_line${j}`, {
//       locale: "th",
//       dateFormat: "d/m/Y",
//       minDate: addDays(document.getElementById("salesDate_line").value, 4),
//       disable: [
//         function(date) {
//           return date.getDay() === 0;
//         }
//       ]

//       //defaultDate : dateFormatSlace(object.TransDate.substring(0,10))
//     });

//     var eleconfdate = document.getElementById(
//       `card${seqSeries}-confirmDate_line${j}`
//     );
//     eleconfdate.onchange = function() {
//       activeTimePeriod(this.value, seqSeries, j);
//     };
//   }
// }

function addDays(date_string, addDay) {
  let parts_of_date = date_string.split("/");
  let d = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
  d.setDate(d.getDate() + addDay);

  let y = d.getFullYear();
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
    y;
  return _date;
}

function setValueCheckBox(seqSeries, id, check) {
  let checkbox = `<input type="checkbox" id="card${seqSeries}-checkBooking${id}" ${check}  onclick="activeBooking(this.checked,${seqSeries}, ${id})">`;
  document.getElementById(`card${seqSeries}-groupCheck${id}`).innerHTML =
    checkbox;
}

function loadSeries(selected, pooledit, pool_s, seqSeries) {
  let pool = pooledit == "" ? pool_s : pooledit;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_SERIES);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      pool: pool
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      const objects = JSON.parse(this.responseText);

      trHTML += `<option value="" selected="selected">------ None ------</option>`;
      objects.map((row) => {
        if (selected == row.ProdSeries)
          trHTML += `<option value="${row.ProdSeries}" selected>${row.ProdSeries}</option>`;
        else
          trHTML += `<option value="${row.ProdSeries}">${row.ProdSeries}</option>`;
      });

      if (title == "Add Line")
        document.getElementById(`card${seqSeries}-series`).innerHTML = trHTML;
      else document.getElementById(`series`).innerHTML = trHTML;
    }
  };
}

function loadItem(selected, pool, series, model, seqSeries) {
  let _checked = false;

  if (model == "") {
    document.getElementById(`itemId`).value = "";
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_ITEM);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      pool: pool,
      series: series,
      model: model
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      let _ItemId = "";
      var _default = "";
      const objects = JSON.parse(this.responseText);
      let _size = "";

      if (objects.length > 0) {
        objects.map((row) => {
          _ItemId = row.ItemId;
          _size = row.Size;
          _checked = row.Booking == 1 ? true : false;
        });
      }
      onSelectItemId(model, _checked, seqSeries);

      if (!existsControl(`card${seqSeries}-countItem`)) {
        let seq = parseInt(
          document.getElementById(`card${seqSeries}-countItem`).value
        );

        loadModel("", "", series, seqSeries, seq);
        document.getElementById(`card${seqSeries}-itemId` + seq).value =
          _ItemId;
        document.getElementById("default").innerHTML = _default;
        document
          .getElementById(`card${seqSeries}-countItem`)
          .setAttribute("value", seq);

        // var checkbox = document.getElementById(`card${seqSeries}-checkBooking` + seq);
        // checkbox.setAttribute('checked', _checked);

        onChecked(_checked, seqSeries, seq);
      } else {
        //document.getElementById(name + seq).innerHTML = trHTML;
        //trHTML = createDemoItems(trHTML, selected, 0);
        //document.getElementById(name).innerHTML = trHTML;

        if (title == "Add Line") loadSize(_size, seqSeries, 0);
        else if (title == "Edit Line") {
          document.getElementById(`itemId`).value = _ItemId;
          loadSize(size, seqSeries, 0);
        }
      }

      refreshSequence(`card${seqSeries}-CURRSEQ`);
    }
  };
}

function deleteGroupSeries(name) {
  document.getElementById(name).remove();
  refreshSequence("SERIES-CURRSEQ");
}

function deleteGroup(name, seqSeries, id) {
  const rev = document.getElementById(`card${seqSeries}-ul${id}`);
  rev.remove();

  refreshSequence(`card${seqSeries}-CURRSEQ`);
}

function refreshSequence(name) {
  //refresh ลำดับ
  let i = 1;
  const eleSeries = document.querySelectorAll(`[id*="${name}"]`);
  eleSeries.forEach((eleSeries) => {
    document.getElementById(eleSeries.id).innerText = i;
    i++;
  });
}

function setQtyValue(seqSeries, id) {
  var input = document.getElementById(`card${seqSeries}-multiqty` + id);
  input.setAttribute("value", input.value);
}

function setAmountValue(seqSeries, id) {
  var input = document.getElementById(`card${seqSeries}-multiamount` + id);
  input.setAttribute("value", input.value);
}

// function setValueInputDate(seqSeries, id, value) {
//   let inputDate = `<input type="date" id="card${seqSeries}-confirmDate_line${id}"  class="form-control"
//   ${minDate} onchange="activeTimePeriod(this.value,${seqSeries}, ${id}) " ${enableConfirmDate}>`;
//   document.getElementById(`card${seqSeries}-groupConfirmDate_line${id}`).innerHTML = inputDate;
// }

function activeBooking(active, seqSeries, id) {
  let disable = "";
  if (active) disable = false;
  else disable = true;

  setValueCheckBox(seqSeries, id, active == true ? "checked" : "");

  document.getElementById(`card${seqSeries}-confirmDate_line` + id).disabled =
    disable;
  if (disable) {
    document.getElementById(`card${seqSeries}-size` + id).disabled = disable;
    document.getElementById(`card${seqSeries}-timeperiod` + id).disabled =
      disable;

    loadSize(0, seqSeries, id);
    loadTimePeriod(0, seqSeries, id);
  }
  document.getElementById(`card${seqSeries}-confirmDate_line` + id).value = "";
  document
    .getElementById(`card${seqSeries}-confirmDate_line` + id)
    .removeAttribute("value");
  setMinConfirmDate(document.getElementById("salesDate_line").value, seqSeries);
}

function activeTimePeriod(value, seqSeries, id) {
  let disable = "";
  if (value == "") disable = true;
  else disable = false;
  console.log("date click");
  document
    .getElementById(`card${seqSeries}-confirmDate_line` + id)
    .setAttribute("value", value);
  document.getElementById(`card${seqSeries}-timeperiod` + id).disabled =
    disable;
  document.getElementById(`card${seqSeries}-size` + id).disabled = disable;

  if (disable) {
    document.getElementById(`card${seqSeries}-timeperiod` + id).value = "";
    document.getElementById(`card${seqSeries}-size` + id).value = "";
  }

  confDateChange(value, seqSeries, id);
}

function loadTimePeriod(selected, seqSeries, id) {
  var trHTML = "";
  let valN = "",
    valM = "",
    valA = "";

  if (selected == 0) valN = "selected";
  else if (selected == 1) valM = "selected";
  else if (selected == 2) valA = "selected";

  trHTML += `<option value="0" ${valN}>----- None -----</option>`;
  trHTML += `<option value="1" ${valM}>เช้า</option>`;
  trHTML += `<option value="2" ${valA}>บ่าย</option>`;

  if (title == "Add Line") {
    //let seq = parseInt(document.getElementById(`card${seqSeries}-countItem`).value);
    document.getElementById(`card${seqSeries}-timeperiod` + id).innerHTML =
      trHTML;
  } else {
    document.getElementById(`timeperiod`).innerHTML = trHTML;
  }
}

function loadDefaultSize(itemId, seqSeries, id) {
  let series = "";
  model = "";
  if (title == "Add Line") {
    series = `card${seqSeries}-series`;
    model = `card${seqSeries}-model`;
  } else {
    series = "series";
    model = "model";
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_LOAD_SIZE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      pool: sessionStorage.getItem("pool_line_val"),
      series: document.getElementById(series).value,
      model: document.getElementById(model + id).value,
      itemId: itemId
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      objects.map((row) => {
        loadSize(row.Size, seqSeries, id);
      });
    }
  };
}

function loadSize(val, seqSeries, id) {
  let selectN = "",
    selectS = "",
    selectM = "",
    selectL = "";

  if (title == "Edit Line") {
    //edit line

    if (val == "") val = 0;
    else if (val == "S") val = 1;
    else if (val == "M") val = 2;
    else if (val == "L") val = 3;
  }

  if (val == 0) selectN = "selected";
  else if (val == 1) selectS = "selected";
  else if (val == 2) selectM = "selected";
  else if (val == 3) selectL = "selected";

  if (val == "") selectN = "selected";
  else if (val == "S") selectS = "selected";
  else if (val == "M") selectM = "selected";
  else if (val == "L") selectL = "selected";

  var HTML = `<option value="" ${selectN}>----- None -----</option>
                <option value="S" ${selectS}>S (1-3 เมตร)</option>
                <option value="M" ${selectM}>M (3-7 เมตร)</option>
                <option value="L" ${selectL}>L (มากกว่า 7 เมตร)</option>`;

  if (title == "Add Line")
    document.getElementById(`card${seqSeries}-size` + id).innerHTML = HTML;
  else document.getElementById(`size0`).innerHTML = HTML;
}

function onChecked(checked, seqSeries, id) {
  //Check header change on sub Checkbox
  let seq = 1;

  setValueCheckBox(seqSeries, id, checked == true ? "checked" : "");

  var element = document.getElementById(`card${seqSeries}-checkBooking` + id);
  if (typeof element != "undefined" && element != null) {
    element.setAttribute("value", checked);
    //element.value = checked;
    seq = id; // parseInt(document.getElementById(`card${seqSeries}-countItem`).value);
    const confirmdate = document.getElementById(
      `card${seqSeries}-confirmDate_line` + seq
    );
    if (checked) {
      confirmdate.disabled = false;
    } else confirmdate.disabled = true;

    if (confirmdate.value == "") {
      document.getElementById(
        `card${seqSeries}-timeperiod` + seq
      ).disabled = true;
      document.getElementById(`card${seqSeries}-size` + seq).disabled = true;
      loadSize(0, seqSeries, seq); //set default none
      loadTimePeriod(0, seqSeries, seq);
      setMinConfirmDate(
        document.getElementById("salesDate_line").value,
        seqSeries
      );
    } else {
      document.getElementById(
        `card${seqSeries}-timeperiod` + seq
      ).disabled = true;
      document.getElementById(`card${seqSeries}-size` + seq).disabled = true;
      loadTimePeriod(0, seqSeries, seq);
      loadDefaultSize(
        document.getElementById(`card${seqSeries}-itemId` + seq).value,
        seqSeries,
        seq
      );
    }
  }
}

function pushArray() {
  var monthNames = ["January", "February"];
  var month = {};
  var monthsArray = [];
  for (let i = 0; i < 2; i++) {
    month.id = i + 1;
    month.name = monthNames[i];
    monthsArray.push({ ...month });
  }
}

function validate() {
  let j = 0;
  let msg = "",
    msg2 = "";
  let status = false;
  const eleSeries = document.querySelectorAll(`[id^="SERIES-SEQ"]`);
  eleSeries.forEach((eleSeries) => {
    let k = 0;
    j = parseInt(document.getElementById(eleSeries.id).innerText);

    let salesdate = document.getElementById("salesDate_line").value;
    let series = document.getElementById(`card${j}-series`).value;

    if (salesdate == "") {
      msg += `<label> <b style="color: red;">*</b> วันที่ขาย </label> <br>`;
    }
    if (series == "") {
      msg += `<label> <b style="color: red;">*</b> Series </label> <br>`;
    }

    const eleModels = document.querySelectorAll(`[id^="card${j}-model"]`);
    eleModels.forEach((eleSeries) => {
      let model = document.getElementById(eleSeries.id).value;

      if (model == "" && status == false) {
        msg += `<label> <b style="color: red;">*</b> Model </label> <br>`;
        status = true;
      }
    });

    if (msg !== "") {
      msg2 +=
        `<label> กรุณาระบุข้อมูลดังนี้ ก่อนทำการบันทึก </label> <br>` + msg;
    }
  });
  return msg2;
}

function dateFormatYMD(date) {
  var dateParts = date.split("/");
  var d = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  let y = d.getFullYear();
  let _date =
    y +
    "-" +
    (d.getMonth() + 1).toLocaleString("th-TH", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "-" +
    d
      .getDate()
      .toLocaleString("th-TH", { minimumIntegerDigits: 2, useGrouping: false });
  return _date;
}

function create_line() {
  var i = 1,
    j = 1;
  let strMoreItem = "";
  let swalSize = "500px";
  let arrRow = [];
  let checkMsg = true;
  let validateSizeCount = 0;
  var totalQty = 0,
    totalAmount = 0;

  const rowsData = { Data: arrRow };
  swalSize = "850px";
  strMoreItem += `<label> คุณต้องการสร้างรายการดังนี้หรือไม่ </label> <br>`;

  const eleSeries = document.querySelectorAll(`[id^="SERIES-SEQ"]`);
  eleSeries.forEach((eleSeries) => {
    j = parseInt(document.getElementById(eleSeries.id).innerText);

    const elements = document.querySelectorAll(`[id^="card${j}-SEQ"]`);
    elements.forEach((element) => {
      i = parseInt(document.getElementById(element.id).innerText);

      if (
        document.getElementById(`card${j}-confirmDate_line` + i).value !== "" &&
        document.getElementById(`card${j}-size` + i).value === ""
      )
        validateSizeCount = 1;

      let multiqty = document.getElementById(`card${j}-multiqty` + i);
      let multiamount = document.getElementById(`card${j}-multiamount` + i);

      arrRow.push({
        RecIdHeader: document.getElementById("line_recId").value,
        Series: document.getElementById(`card${j}-series`).value,
        Model: document.getElementById(`card${j}-model` + i).value,
        Qty: multiqty.value,
        Amount: multiamount.value,
        Date: dateFormatYMD(document.getElementById("salesDate_line").value),
        ItemId: document.getElementById(`card${j}-itemId` + i).value,
        ItemName: document.getElementById(`card${j}-itemName` + i).value,
        Size: document.getElementById(`card${j}-size` + i).value,
        Zone: sessionStorage.getItem("region_val"),
        Pool: sessionStorage.getItem("pool_val"),
        CustName: sessionStorage.getItem("custName_val"),
        ConfirmDate: dateFormatYMD(
          document.getElementById(`card${j}-confirmDate_line` + i).value
        ),
        TimePeriod: document.getElementById(`card${j}-timeperiod` + i).value,
        CreateBy: username,
        IsBooking: 1 //สร้างรายการจอง RG
      });
    });
  });

  const sumByKey = (arr, key, value) => {
    const map = new Map();
    for (const obj of arr) {
      const currSum = map.get(obj[key]) || 0;
      map.set(obj[key], currSum + Number(obj[value]));
    }
    const res = Array.from(map, ([k, v]) => ({ [key]: k, [value]: v }));
    return res;
  };

  let k = 0;
  const eleSum = sumByKey(arrRow, "Model", "Amount");
  eleSum.forEach((element) => {
    let sumQty = sumByKey(arrRow, "Model", "Qty")[k].Qty;
    let sumAmount = sumByKey(arrRow, "Model", "Amount")[k].Amount;
    strMoreItem += ` <label> Model : ${element.Model}, จำนวน : ${sumQty}, ยอดเงินรวม : ${sumAmount} </label> <br>`;
    k++;
  });

  if (validate() !== "") {
    Swal.fire({
      title: "คุณระบุข้อมูลไม่ครบ",
      html: validate(),
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#CFCECE",
      confirmButtonText: "OK"
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  } else if (validateSizeCount > 0) {
    warning_message(
      "โปรดเลือก Size",
      "พบรายการที่คุณกดจอง แต่ไม่ได้เลือก Size"
    );
  } else {
    Swal.fire({
      title: "ยืนยันการสร้างรายการ",
      text: "คุณต้องการสร้างรายการดังนี้หรือไม่",
      html: strMoreItem,
      icon: "info",
      width: swalSize,
      heightAuto: true,
      showCancelButton: true,
      confirmButtonColor: "#41BD23",
      cancelButtonColor: "#CFCECE",
      confirmButtonText: "สร้าง",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", API_CREATE_LINE);
        xhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xhttp.send(JSON.stringify(rowsData));

        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            if (objects.Status == "OK") {
              Swal.fire(
                "สร้างรายการสำเร็จ",
                "รายการถูกสร้างไปที่หน้า Line แล้ว คุณสามารถเข้าไปดูรายการได้โดยกดปุ่ม OK.",
                "success"
              ).then(() => {
                const eleSeries =
                  document.querySelectorAll(`[id^="SERIES-SEQ"]`);
                eleSeries.forEach((eleSeries) => {
                  j = parseInt(document.getElementById(eleSeries.id).innerText);
                  document.getElementById(`card${j}-countItem`).value = 0;
                });

                window.location = "LinePage.html";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: objects.Status
                //text: 'Something went wrong!',
              });
            }
          }
        };
      }
    });
  }
}

function edit_line() {
  if (getElement("salesDate_line") == "") {
    warning_message(
      "โปรดระบุ วันที่ขาย",
      "กรุณาใส่ข้อมูลให้ครบถ้วนก่อนทำการบันทึก"
    );
  } else if (getElement("series") == "") {
    warning_message(
      "โปรดเลือก Series",
      "กรุณาใส่ข้อมูลให้ครบถ้วนก่อนทำการบันทึก"
    );
  } else if (getElement("model") == "") {
    warning_message(
      "โปรดเลือก Model",
      "กรุณาใส่ข้อมูลให้ครบถ้วนก่อนทำการบันทึก"
    );
  } else if (
    getElement("confirmDate_line0") !== "" &&
    getElement("size0") == ""
  ) {
    // else if (getElement("itemId") == "") {
    //   warning_message(
    //     "โปรดเลือก Item number",
    //     "กรุณาใส่ข้อมูลให้ครบถ้วนก่อนทำการบันทึก"
    //   );
    // }
    warning_message(
      "โปรดเลือก Size",
      "คุณได้กำหนดวันที่ติดตั้ง จึงจำเป็นต้องเลือก Size"
    );
  } else {
    let status = 0;

    //แก้ไข รายการที่ไม่ได้จองไว้โดยใส่วันที่ และ size ให้สร้างเลข RG
    if (
      getElement("confirmDate_line0") !== "" &&
      getElement("size0") !== "" &&
      getElement("bookingId") == ""
    ) {
      status = 1;
    }
    //เลือก size แต่ไม่ได้ระบุวันที่ติดตั้ง
    if (getElement("size0") !== "" && getElement("confirmDate_line0") == "") {
      warning_message(
        "คุณไม่ได้ระบุวันที่ติดตั้ง",
        "กรุณาระบุวันที่ติดตั้งก่อนทำการบันทึก"
      );
    } else {
      Swal.fire({
        title: "ยืนยันบันทึกรายการ",
        text: "คุณต้องการบันทึกรายการที่แก้ไขนี้หรือไม่",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#41BD23",
        cancelButtonColor: "#CFCECE",
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
          excecuteEditLine(status);
        }
      });
    }
  }
}

function excecuteEditLine(status) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_EDIT_LINE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      RecId: document.getElementById("line_recId").value,
      Series: document.getElementById("series").value,
      Model: document.getElementById("model").value,
      Qty: document.getElementById("multiqty0").value,
      Amount: document.getElementById("multiamount0").value,
      Date: dateFormatYMD(document.getElementById("salesDate_line").value),
      ItemId: document.getElementById("ItemId0").value,
      ItemName: document.getElementById("ItemName0").value,
      Size: document.getElementById("size0").value,
      Zone: sessionStorage.getItem("region_val"),
      Pool: sessionStorage.getItem("pool_val"),
      CustName: sessionStorage.getItem("custName_val"),
      ConfirmDate: dateFormatYMD(
        document.getElementById("confirmDate_line0").value
      ),
      TimePeriod: document.getElementById("timeperiod").value,
      BookingId: document.getElementById("bookingId").value,
      CreateBy: username,
      IsBooking: status
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
        Swal.fire(
          "บันทึกรายการสำเร็จ",
          "รายการถูกบันทึกไปที่หน้า Line แล้ว คุณสามารถเข้าไปดูรายการได้โดยกดปุ่ม OK.",
          "success"
        ).then(() => {
          window.location = "LinePage.html";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: objects.Status
          //text: 'Something went wrong!',
        });
      }
    }
  };
}

function warning_message(title, text) {
  Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: false,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "OK"
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
}

function changeConfirmDate(val) {
  if (val == "") {
    document.getElementById("size0").disabled = true;
  } else {
    //sessionStorage.setItem("status_booking",0);
    document.getElementById("size0").disabled = false;
  }
}

function confDateChange(val, seqSeries, id) {
  let parts_of_date = val.split("/");
  const today = new Date(
    +parts_of_date[2],
    parts_of_date[1] - 1,
    +parts_of_date[0]
  );
  //const today = new Date(val);
  const sunday = new Date(today.setDate(today.getDate() - today.getDay()));

  const date1 = strToDate(sunday, 0);
  const date2 = strToDate(val, 0);
  let confname = "",
    timePeriod = "",
    size = "",
    itemid = "";

  if (title == "Add Line") {
    confname = `card${seqSeries}-confirmDate_line` + id;
    timePeriod = `card${seqSeries}-timeperiod` + id;
    size = `card${seqSeries}-size` + id;
    itemid = `card${seqSeries}-itemId` + id;
  } else {
    confname = `confirmDate_line0`;
    timePeriod = `timeperiod`;
    size = `size0`;
    itemid = `itemId`;
  }

  if (date1 === date2 && val !== "" && val !== "-") {
    warning_message(
      "ไม่สามารถลงวันที่ติดตั้งวันนี้ได้",
      "กรุณาเลือกวันติดตั้งวันอื่น เนื่องจากวันนี้เป็นวันหยุด"
    );
    document.getElementById(confname).value = "";
  }

  if (document.getElementById(confname).value == "") {
    loadTimePeriod(0, seqSeries, id);
    loadSize(0, seqSeries, id);
    document.getElementById(timePeriod).disabled = true;
    document.getElementById(size).disabled = true;
    // document.getElementById(size).value = '';
  } else {
    document.getElementById(timePeriod).disabled = false;
    document.getElementById(size).disabled = false;
    loadDefaultSize(document.getElementById(itemid).value, seqSeries, id);
  }
}

function setValue(element, selected) {
  document.getElementById(element).value = selected;
}

function setMinConfirmDate(date, seqSeries) {
  //multiple เปลี่ยนวันที่ sales date ของแต่ละ item

  let countItem = "";
  let datevalue = "";

  //compare วันที่ salesDate มากกว่า วันที่คีย์ confirm
  if (!compareDate(date, confirmDate)) {
    datevalue = confirmDate;
  }
  if (title == "Add Line") {
    const elementseries = document.querySelectorAll(`[id^="cardMultiSeries"]`);
    elementseries.forEach((ele) => {
      let seriesId = 0;
      seriesId = parseInt(ele.id.substring(15, 17));

      const elements = document.querySelectorAll(`[id^="card${seriesId}-SEQ"]`);
      elements.forEach((element) => {
        let i = 0;
        i = parseInt(document.getElementById(element.id).innerText);
        setConfirmDatePicker(`#card${seriesId}-confirmDate_line` + i, "", date);
      });
    });
  } else {
    setConfirmDatePicker("#confirmDate_line0", "", date);
    // document.getElementById(`confirmDate_line0`).min = strToDate(date, 4);
  }
}

function existsControl(value) {
  let bool = true;
  var element = document.getElementById(value);
  if (typeof element != "undefined" && element != null) {
    bool = false;
  }
  return bool;
}

function strToDate(value, addDays) {
  var date = new Date(value);
  date.setDate(date.getDate() + addDays);

  var dateResult =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "-" +
    date
      .getDate()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

  return dateResult;
}

function compareDate(value1, value2) {
  let bool = false;
  var date1 = new Date(value1);
  var date2 = new Date(value2);

  if (date1 > date2) {
    bool = true;
  }

  return bool;
}

function getElement(element) {
  return document.getElementById(element).value;
}

function getItem(key) {
  return sessionStorage.getItem(key);
}

function enforceNumberValidation(ele) {
  if ($(ele).data("decimal") != null) {
    // found valid rule for decimal
    var decimal = parseInt($(ele).data("decimal")) || 0;
    var val = $(ele).val();
    if (decimal > 0) {
      var splitVal = val.split(".");
      if (splitVal.length == 2 && splitVal[1].length > decimal) {
        // user entered invalid input
        $(ele).val(splitVal[0] + "." + splitVal[1].substr(0, decimal));
      }
    } else if (decimal == 0) {
      // do not allow decimal place
      var splitVal = val.split(".");
      if (splitVal.length > 1) {
        // user entered invalid input
        $(ele).val(splitVal[0]); // always trim everything after '.'
      }
    }
  }
}

function clear() {
  sessionStorage.setItem("recId_line_val", "");
  sessionStorage.setItem("date_line_val", "");
  sessionStorage.setItem("amount_line_val", "");
  sessionStorage.setItem("qty_line_val", "");
  series = "";
  model = "";
  // sessionStorage.setItem("sink_val","");
  // sessionStorage.setItem("top_val","");
}
