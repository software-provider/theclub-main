import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../lib/UserContext";
import Loading from "./loading";

export default function Payment({ Elements, PaymentForm, promise }) {
  const [user] = useContext(UserContext);
  const history = useHistory();

  // If not loading and no user found, redirect to /login
  useEffect(() => {
    user && !user.loading && !user.issuer && history.push("/login");
  }, [user, history]);

  return (
    <>
      <h3 className="h3-header">
        Purchase Lifetime Access Pass to Awesomeness 🤩
      </h3>
      <p>
        Hi again {user?.loading ? <Loading /> : user?.email}! You successfully
        signed up with your email. Please enter your card information below to
        purchase your Lifetime Access Pass securely via Stripe:
      </p>
      {user?.loading ? (
        <Loading />
      ) : (
        <Elements stripe={promise}>
          <PaymentForm email={user.email} />
        </Elements>
      )}
      <style>{`
        p {
          margin-bottom: 15px;
        }
        .h3-header {
          font-size: 22px;
          margin: 25px 0;
        }
      `}</style>
    </>
  );
}
