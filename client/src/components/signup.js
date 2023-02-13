import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import SignUpForm from "./signup-form";

const SignUp = () => {
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const [, setUser] = useContext(UserContext);

  async function handleSignUpWithEmail(email) {
    try {
      setDisabled(true); // Disable sign up button to prevent multiple emails from being triggered

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({
        email,
      });

      // Validate didToken with server
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
      });

      if (res.status === 200) {
        // Set the UserContext to the now signed up user
        let userMetadata = await magic.user.getMetadata();
        await setUser(userMetadata);
        history.push("/payment");
      }
    } catch (error) {
      setDisabled(false); // Re-enable sign up button - user may have requested to edit their email
      console.log(error);
    }
  }

  return (
    <>
      <h3 className="h3-header">Sign Up for Lifetime Access Pass 👩🏻‍💻</h3>
      <p>
        YAY! We're excited for you to sign up for a Lifetime Access Pass to
        awesomeness. First, please sign in below to register your new account:
      </p>
      <div className="signup">
        <SignUpForm disabled={disabled} onEmailSubmit={handleSignUpWithEmail} />
      </div>
      <style>{`
        .h3-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .signup {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
};

export default SignUp;
