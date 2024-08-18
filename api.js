let SERVER_order = "http://starmark.work/OrderOnline_API_Order_test/";
let SERVER_ax = "http://starmark.work/OrderOnline_API_AIF_test/";

//let SERVER_ax = "http://localhost:4377/";
//let SERVER_order = "http://localhost:54871/";

 const API_EMPLOYEE = SERVER_order + "api/order/employee";
 const API_STORE = SERVER_order + "api/order/stored";
 const API_POOLS = SERVER_order + "api/order/pools";
 const API_REGION = SERVER_order + "api/order/region";
 const API_PROVINCE = SERVER_order + "api/order/province";
 const API_GETREGION = SERVER_order + "api/order/findRegion";
 const API_DEPOSIT = SERVER_order + "api/order/deposit";
 const API_DEPOSIT_DELETE = SERVER_ax + "api/order/deposit/delete";
 const API_DEPOSIT_CANCEL = SERVER_ax + "api/order/deposit/cancel";

 const API_LOAD_ADDRESS = SERVER_order + "api/address/order/load/";

 const API_ADDRESS_ZIPCODE = SERVER_order + "api/address/zipcode/";
 const API_ADDRESS_PROVINCE = SERVER_order + "api/address/province";
 const API_ADDRESS_CITY = SERVER_order + "api/address/city/";
 const API_ADDRESS_DISTRICT = SERVER_order + "api/address/district/";

export default {API_EMPLOYEE, API_STORE, API_POOLS, API_REGION, API_PROVINCE, API_GETREGION,
    API_DEPOSIT, API_DEPOSIT_DELETE, API_DEPOSIT_CANCEL, API_LOAD_ADDRESS, API_ADDRESS_ZIPCODE,
    API_ADDRESS_PROVINCE, API_ADDRESS_CITY, API_ADDRESS_DISTRICT
}