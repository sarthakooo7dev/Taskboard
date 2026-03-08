import { getServerSession } from "next-auth";
import { json } from "stream/consumers";
import { authOptions } from "./lib/auth";
import AuthModal from './components/auth/authModal'



const page = async () => {



  return <> Landing page Taksboard

    <div >
      <AuthModal />

    </div>  </>;
};

export default page;