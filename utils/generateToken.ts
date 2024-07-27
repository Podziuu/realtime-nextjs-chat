import jwt from "jsonwebtoken";

const generateToken = ({userId, username}: {userId: string, username: string}) => {
  // @ts-ignore
  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export default generateToken;