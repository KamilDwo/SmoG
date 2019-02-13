const initialState = {
  drawerVisible: false,
  pointData: null,
  pointValues: null,
  flyMyLocation: false,
  currentPoint: null
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_DRAWER":
      return action.payload;
    case "HIDE_DRAWER":
      return action.payload;
    case "STORAGE_ADDED":
      return action.payload;
    case "FLY_TO_LOCATION":
      return action.payload;
    case "SET_CURRENT":
      return action.payload;
    default:
      return state;
  }
};

export default mainReducer;
