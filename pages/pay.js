import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Payment from "../components/Payment";

const Pay = () => {
  return (
    <div style={{ height: "90vh" }}>
      <Payment />
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
