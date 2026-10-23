import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

import "./styles.css";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";
import { use } from "react";
/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {

  const { userId } = useParams();
  const user = models.userModel(userId);
  if (!user) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            User not found
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {user.first_name + " " + user.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Job: </strong>{user.occupation}<br></br>
          <strong>Location: </strong>{user.location}<br></br>
          <strong>Description: </strong>{user.description}<br></br>

        </Typography>
        <Box>
          <Button variant="contained" component={Link} to={`/photos/${userId}`}> See Photos</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
