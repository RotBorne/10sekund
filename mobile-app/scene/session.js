//trzyma id zalogowanego obecnie uzytkownika kiedy przechodzi miedzy oknami
let currentUser = null;

export const setSessionUser = (user) => {
  currentUser = user;
};

export const getSessionUser = () => {
  return currentUser;
};
