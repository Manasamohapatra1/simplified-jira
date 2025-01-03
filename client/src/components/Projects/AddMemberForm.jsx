import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const AddMemberForm = ({ onAddMember }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onAddMember(email);
    setEmail("");
  };

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
