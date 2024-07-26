import Sidebar from "@/components/sidebar";
import { IUser, IMessage } from "@/types";
import { getMessages } from "@/actions/user.action";
import MessagePanel from "@/components/messagePanel";

const page = () => {

  return (
    <section className="flex h-screen">
      <Sidebar />
      <MessagePanel/>
    </section>
  );
};

export default page;