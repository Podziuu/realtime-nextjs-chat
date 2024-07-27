import Sidebar from "@/components/sidebar";
import { IUser, IMessage, IToken } from "@/types";
import { getMessages } from "@/actions/user.action";
import MessagePanel from "@/components/messagePanel";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { useUserStore } from "@/store/userState";

const page = () => {
  const token = cookies().get("token");
  const decoded = jwtDecode<IToken>(token!.value);
  const currentUserId = decoded.userId;

  return (
    <section className="flex h-screen">
      <Sidebar />
      <MessagePanel/>
    </section>
  );
};

export default page;