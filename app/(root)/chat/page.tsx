import Sidebar from "@/components/sidebar";
import { IToken, SearchParamsProps } from "@/types";
import {
  getMessages,
  getChatUsers,
  getUsernameById,
} from "@/actions/user.action";
import MessagePanel from "@/components/messagePanel";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

const page = async ({ searchParams }: SearchParamsProps) => {
  const token = cookies().get("token");
  const decoded = jwtDecode<IToken>(token!.value);
  const currentUserId = decoded.userId;
  const selectedUser = searchParams.user;
  let messages;
  let username;

  if (selectedUser) {
    username = await getUsernameById(selectedUser);
  }

  const chats = await getChatUsers({ userId: currentUserId });

  if (selectedUser && currentUserId) {
    messages = await getMessages({ from: currentUserId, to: selectedUser });
  }

  return (
    <section className="flex h-screen">
      <Sidebar chats={JSON.stringify(chats)} currentUser={currentUserId} />
      {messages && (
        <MessagePanel
          messageArray={JSON.stringify(messages)}
          username={username}
        />
      )}
    </section>
  );
};

export default page;
