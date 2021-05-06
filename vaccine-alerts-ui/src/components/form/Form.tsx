import * as React from "react";
import { getNotificationToken } from "../../constants";

function Form() {
  React.useEffect(() => {
    (async () => {
      const token = await getNotificationToken();
      console.log("TOKEN", token);
    })();
  }, []);
  return (
    <div className="form-container">
      <form id="alert-form"></form>
    </div>
  );
}

export default Form;
