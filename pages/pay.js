import { withPageAuth } from "@supabase/auth-helpers-nextjs"

import Payment from "../components/Payment";
import Discount from "../components/Discount";

const Pay = ({ user }) => {
  return (
    <div style={{ height: "90vh" }}>
      <Payment />
      <Discount user={user} />
    </div>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/signin" })

export default Pay;
