import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../lib/UserContext";
import { LifetimeContext } from "../lib/LifetimeContext";
import { LifetimeAccessRequestStatusContext } from "../lib/LifetimeAccessRequestStatusContext";
import { CallToAction } from "@magiclabs/ui";

const PremiumContent = () => {
  const [user] = useContext(UserContext);
  const [lifetimeAccess, setLifetimeAccess] = useContext(LifetimeContext);
  const [
    lifetimeAccessRequestStatus,
    setLifetimeAccessRequestStatus,
  ] = useContext(LifetimeAccessRequestStatusContext);
  const history = useHistory();

  // Check to see whether or not the user has paid.
  useEffect(() => {
    if (user && !user.loading && user.issuer && !lifetimeAccessRequestStatus) {
      setLifetimeAccessRequestStatus("Pending");
      window
        .fetch(`${process.env.REACT_APP_SERVER_URL}/validate-customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setLifetimeAccessRequestStatus("Complete");
          if (
            data.customer.length &&
            data.customer[0].metadata.lifetimeAccess === "true"
          ) {
            setLifetimeAccess(true);
          }
        });
    }
  });

  return (
    <>
      {
        // Display Premium Content if the user's logged in & have already paid for lifetime access
        user && lifetimeAccess ? (
          <>
            <h3 className="h3-header">Here's all of our PREMIUM content! 😍</h3>
            <div>♡ PREMIUM AWESOMENESS.</div>
            <div>♡ PREMIUM AWESOMENESS.</div>
            <div>♡ PREMIUM AWESOMENESS.</div>
            <div>♡ PREMIUM AWESOMENESS.</div>
          </>
        ) : (
          <>
            <h3 className="h3-header">So you want our PREMIUM content? 😎</h3>
            <div>🧠 Our premium content includes some AWESOME stuff.</div>

            <div>
              🪄 To access the awesomeness, purchase a Lifetime Access Pass
              below.
            </div>

            <div>💸 The Awesome Lifetime Access Pass is only $500!</div>
            {
              // If the user is logged in, go straight to payment
              user && user.issuer ? (
                <CallToAction
                  color="primary"
                  size="sm"
                  onPress={() => history.push("/payment")}
                >
                  Count Me In
                </CallToAction>
              ) : (
                // Otherwise, ask the user to sign up first
                <CallToAction
                  color="primary"
                  size="sm"
                  onPress={() => history.push("/signup")}
                >
                  Count Me In
                </CallToAction>
              )
            }
          </>
        )
      }
      <style>{`
        .h3-header {
          font-size: 22px;
          margin: 25px 0;
        }
        div {
          font-size: 17px;
          margin-bottom: 15px;
        }
      `}</style>
    </>
  );
};

export default PremiumContent;
