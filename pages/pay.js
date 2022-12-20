import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      }
    }
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    }
  }
}

export default Pay;
