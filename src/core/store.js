import { createStore, combineReducers } from "redux";

let initState = {};

const cardReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_CARD":
      return { ...action.response };
    default:
      return state;
  }
};

const combinedReducer = combineReducers({
  cardReducer,
});

const store = createStore(
  combinedReducer,
  initState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
