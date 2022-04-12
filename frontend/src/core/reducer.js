import { combineReducers } from "redux";
import metaData from "core/reducers/metaDataReducer";
import userAuthentication from "./reducers/userAuthenticationReducer";
import loadingStatus from "core/reducers/loaderReducer";
import progress from "./reducers/progressReducer";
import product from "core/reducers/productReducer";
import suppiler from "./reducers/suppilerReducer";
import infoToast from "./reducers/infoToastReducer";
import documentEntityReducer from "./reducers/documentEntityReducer";
import userManageReducer from "./reducers/userManageReducer";
import notificationReducer from "./reducers/notificationReducer";
import menuPermission from "./reducers/menuPermissionReducer";
import labSwitchReducer from "./reducers/labSwitchReducer";

export const initialState = {};

export const rootReducer = combineReducers({
  metaData,
  userAuthentication,
  loadingStatus,
  progress,
  product,
  suppiler,
  infoToast,
  documentEntityReducer,
  userManageReducer,
  notifications: notificationReducer,
  menuPermission,
  labSwitchReducer
});

export default rootReducer;
