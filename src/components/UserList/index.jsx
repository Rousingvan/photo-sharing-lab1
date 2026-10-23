import React from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import models from "../../modelData/models";
import { Link } from "react-router-dom";
/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const users = models.userListModel();
  return (
    <div>
      <Typography variant="h6" sx={{ p: 2, color: "#1976d2", fontWeight: "bold" }}>
        Users
      </Typography>
      <Divider />
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItemButton component={Link} to={`/users/${item._id}`}>
              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
