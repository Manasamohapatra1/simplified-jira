import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const AddMemberForm = ({ onAddMember, userRole }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onAddMember(email);
    setEmail("");
  };
  console.log(userRole);
  console.log(["Owner", "Admin"].includes(userRole));

  if(!(["Owner", "Admin"].includes(userRole))){
    return <></>;
  }

  return (
    <div>
      <TextField
        label="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
        Add Member
      </Button>
    </div>
  );
};

export default AddMemberForm;
