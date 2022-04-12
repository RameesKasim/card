export const userAuthenticationRequest = ({ data }) => ({
  type: "USER_AUTHENTICATION_REQUEST",
  payload: { data },
});

export const userlogout = ({ data }) => ({
  type: "USER_LOGOUT",
  payload: { data },
});

