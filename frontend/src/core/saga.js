import { all } from "redux-saga/effects";
import MetaDataSaga from "./sagas/MetaDataSaga";
import UserAuthenticationSaga from "./sagas/userAuthenticationSaga";
import SupplierSaga from "./sagas/SupplierSaga";
import productSaga from "./sagas/productSaga";
import userManagementSaga from "./sagas/userManageSaga";
import documentEntitySaga from "./sagas/documentEntitySaga";
import notificationSaga from "./sagas/notificationSaga";

export default function* rootSaga() {
  yield all([
    UserAuthenticationSaga(),
    MetaDataSaga(),
    productSaga(),
    SupplierSaga(),
    userManagementSaga(),
    documentEntitySaga(),
    notificationSaga()
  ]);
}
