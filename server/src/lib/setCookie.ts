const setCookie = (res: any, token: any) => {
  const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // One day from now
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export default setCookie;
