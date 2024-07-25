import {
  TOGGLE_FEATURES,
  SET_ACTIVE_LINK,
  RESET_ACTIVE_LINK,
  RESET_FEATURES,
} from "../../actionTypes/actionTypes";

export const toggleFeatures = (index, authStatus) => {
  return {
    type: TOGGLE_FEATURES,
    index,
    authStatus,
  };
};

export const setActiveLink = (index, authStatus) => {
  return {
    type: SET_ACTIVE_LINK,
    index,
    authStatus,
  };
};

export const resetActiveLink = () => {
  return {
    type: RESET_ACTIVE_LINK,
  };
};

export const resetFeatures = () => {
  return {
    type: RESET_FEATURES,
  };
};
