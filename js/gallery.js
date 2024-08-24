//let SERVER_upload = 'http://localhost:4462/';
//let SERVER_upload = 'http://starmark.work/retailsov2_api/';
//let SERVER_upload = 'http://starmark.work/order_online_api_test/';
// let SERVER_upload = 'http://starmark.work/order_online_api/';

// let API_LOAD_IMAGE = SERVER_upload + "api/retailso/images/load/";
// let API_UPLOAD_IMAGE = SERVER_upload + 'api/retailso/images/upload';
// let API_DELETE_IMAGE = SERVER_upload + 'api/retailso/images/delete/';

// //let SERVER_upload = 'http://localhost:2179/';
// let SERVER_upload = 'http://starmark.work/OrderOnline_API_HUB/';
// let API_LOAD_IMAGE = SERVER_upload + "api/image/load";
// let API_UPLOAD_IMAGE = SERVER_upload + 'api/image/upload';
// let API_DELETE_IMAGE = SERVER_upload + 'api/image/delete';

let SERVER_CB_order = 'https://starmark.work/OrderOnline_API_Orders/';//Live
let SERVER_CB_ax = 'https://starmark.work/OrderOnline_API_AIF/';//Live

 //let SERVER_CB_order = 'http://starmark.work/OrderOnline_API_Img/';
// let SERVER_CB_ax = 'http://starmark.work/OrderOnline_API_AIF_test/';
// let SERVER_CB_ax = 'http://localhost:4377/';
let API_LOAD_IMAGE_V2 = SERVER_CB_order + 'api/order/images/load';
//let API_LOAD_IMAGE_V2 = SERVER_CB_order + 'api/order/images/load/';
let API_ALL_UPLOAD_IMAGE = SERVER_CB_ax + 'api/order/images/upload';
let API_DELETE_IMAGE = SERVER_CB_ax + 'api/order/images/delete';

loadImage();
function loadImage() {

  if  (window.location.search === '?all')// get all image
  {
    sessionStorage.setItem("recId_img_val", 'null');
    document.getElementById("btnUpload").style.display = "none";
  }
  else 
    if (existsControl("btnUpload")){
      document.getElementById("btnUpload").style.display = "block";
    }
    const xhttp = new XMLHttpRequest();
    //xhttp.open("GET", API_LOAD_IMAGE_V2 + sessionStorage.getItem("recId_img_val") + "/" + localStorage.getItem("usr_val"));
    xhttp.open("POST", API_LOAD_IMAGE_V2);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	//xhttp.send();
    xhttp.send(JSON.stringify({
      "recid" : sessionStorage.getItem("recId_img_val"),
      "username" : localStorage.getItem("usr_val")
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const objects = JSON.parse(this.responseText);

            trHTML += ` <option value="" selected></option>`;
            for (let object of objects)
            {
                let _recid = object['RecId'];
                let _imgName = object['ImageName'];
                let _base64 = object['Base64'];

                trHTML += `<div class="card" style="width: 14rem; margin: 10px">
                                <a href="${_base64}" data-toggle="lightbox" data-title="${_imgName}" data-gallery="gallery">
                                  <img class="card-img-top" src="${_base64}" alt="Card image cap" style="border-radius: 5px;
                                  cursor: pointer;
                                  transition: 0.3s;
                                  display: block;
                                  margin-left: auto;
                                  margin-right: auto">
                                </a>
                              <div class="card-body">
                                <h5 class="card-title" id="imgName">${_imgName}</h5>
                              </div>
                              <div class="card-footer">
                                <div class="row">
                                  <div class="col-sm-8">
                                  
                                  </div>
                                  <div class="col-sm-4" style="align-items: right;">
                                    <button type="button" class="btn btn-block btn-outline-danger btn-xs" onclick="onDeleteImg(${_recid})">DELETE</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                              `;


                // trHTML += `<div class="card">
                // <div class="card-body">
                //   <div class="col-6">
                //                 <a href="${_base64}" data-toggle="lightbox" data-title="${_imgName}" data-gallery="gallery">
                //                 <img src="${_base64}" class="img-fluid mb-2"  style="border-radius: 5px;" alt="white sample"/>
                //                 </a>
                //             </div></div></div>`;
            }
            document.getElementById("rowImg").innerHTML = trHTML;
        }
    }
}

function onDeleteImg(recId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't to delete this image!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#CFCECE',
    confirmButtonText: 'YES',
    cancelButtonText: 'CANCEL'
  }).then((result) => {
    if (result.isConfirmed) {
      const xhttp = new XMLHttpRequest();
      //xhttp.open("GET", API_DELETE_IMAGE + recId);
      xhttp.open("POST", API_DELETE_IMAGE);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({
        "recid" : recId
      }));
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            if (objects.Status == "OK") {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Delete image completed.',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                    window.location = 'GalleryPage.html';
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: objects.Status,
                //text: 'Something went wrong!',
              })
            }
          }
      }
    }
  })
}
function existsControl(value) {
    let bool = false;
    var element = document.getElementById(value);
    if (typeof element != "undefined" && element != null) {
      bool = true;
    }
    return bool;
  }
function clickBrowsImg() {

    // const { value: file } = await Swal.fire({
    //     title: 'Select image',
    //     input: 'file',
    //     inputAttributes: {
    //       'accept': 'image/*',
    //       'aria-label': 'Upload your profile picture'
    //     }
        
    //   })
      
    //   if (file) {
    //     const reader = new FileReader()

    //     var formData = new FormData();
    //     const fileField = document.querySelector('input[type="file"]');
       
    //     formData.append('User', '1011405');
    //     formData.append('RecId', sessionStorage.getItem("recId_img_val"));
    //     formData.append('avatar', fileField.files[0]);
  
    //     const othePram = {
    //       //headers : {"content-type" : "application/json;charset=UTF-8"},
    //       body: formData,
    //       method : "POST"
    //     };

    //     fetch(API_UPLOAD_IMAGE, othePram)
    //     .then(data => {
    //         console.log(data);
    //         if (data.status == 200) {
    //             reader.onload = (e) => {
    //                 Swal.fire({
    //                   title: 'Your uploaded picture',
    //                   imageUrl: e.target.result,
    //                   imageAlt: 'The uploaded picture'
    //                 })
    //               }
    //               reader.readAsDataURL(file)
    //         } else {
    //             Swal.showValidationMessage(`Request failed: ${data.statusText}`)
    //         }
    //     });

    //   }
    //console.log(sessionStorage.getItem("recId_img_val"));
    Swal.fire({
      title: 'Select file image',
      input: 'file',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Upload',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var formData = new FormData();
        const fileField = document.querySelector('input[type="file"]');
       
        formData.append('User', '1011405');
        formData.append('RecId', sessionStorage.getItem("recId_img_val"));
        formData.append('avatar', fileField.files[0]);
  
        const othePram = {
          //headers : {"content-type" : "application/json;charset=UTF-8"},
          body: formData,
          method : "POST"
        };
  
        return fetch(API_ALL_UPLOAD_IMAGE, othePram)
              .then(data => {
                //console.log(data);
                if (data.status == 200) {
                    // Swal.showValidationMessage(
                    //     `Request success: ${data.statusText}`
                    //   )
                      Swal.fire({
                        title: 'image1',
                        text: 'testimage1',
                        icon: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#CFCECE',
                        confirmButtonText: 'OK',
                      }).then((result) => {
                        if (result.isConfirmed) {
                            
                        }
                      })
                      return data.json()
                } else {
                    // Swal.showValidationMessage(
                    //     `Request failed: ${data.statusText}`
                    //   )
                    Swal.fire({
                      title: 'image2',
                      text: 'testimage2',
                      icon: 'warning',
                      showCancelButton: false,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#CFCECE',
                      confirmButtonText: 'OK',
                    }).then((result) => {
                      if (result.isConfirmed) {
                          
                      }
                    })
                }
                
            });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
  
        //console.log(result.value.name);
        // Swal.fire({
        //   title: `${result.value.login}'s avatar`,
        //   imageUrl: result.value.avatar_url
        // })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Upload image completed.',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
              window.location = 'GalleryPage.html';
        });

      }
    })
  }