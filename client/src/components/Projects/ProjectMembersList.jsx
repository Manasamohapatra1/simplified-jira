import { Typography, List, ListItem, ListItemText, Button } from "@mui/material";

const ProjectMembersList = ({ members, onAddMember, onRemoveMember, onUpdateRole }) => {
  return (
    <div>
      <Typography variant="h6">Members</Typography>
      <List>
        {members.map((member) => (
          <ListItem key={member.userId}>
            <ListItemText
              primary={`${member.userId.username} (${member.role})`}
              secondary={member.userId.email}
            />
            {member.role !== "Admin" && (<Button onClick={() => onUpdateRole(member.userId._id, "Admin")}>Make Admin</Button>)}
            <Button color="error" onClick={() => onRemoveMember(member.userId._id)}>
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProjectMembersList;
