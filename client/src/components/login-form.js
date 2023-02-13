import { useState } from "react";
import { Input, Icon, MonochromeIcons, CallToAction } from "@magiclabs/ui";

const LoginForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">Log in</h3>
        <div className="input-wrapper">
          <Input
            placeholder="Enter your email"
            size="sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<Icon inline type={MonochromeIcons.Envelope} size={22} />}
          />
        </div>
        <div>
          <CallToAction
            leadingIcon={MonochromeIcons.PaperPlane}
            color="primary"
            size="sm"
            disabled={disabled}
            onClick={handleSubmit}
          >
            Log in
          </CallToAction>
        </div>
      </form>
      <style>{`
        form,
        .form-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .input-wrapper {
          width: 87%;
          margin: 0 auto 20px;
        }
      `}</style>
    </>
  );
};

export default LoginForm;
