import { withPageAuth } from "@supabase/auth-helpers-nextjs"

import Payment from "../components/Payment";
import Discount from "../components/Discount";

const Pay = () => {
  return (
    <div style={{ height: "90vh" }}>
      <Payment />
      <Discount />
    </div>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/signin" })

export default Pay;
