import { useLocation } from "react-router-dom";
import models from "../../modelData/models";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "./styles.css";
function TopBar() {
  const location = useLocation();
  const pathname = location.pathname;

  let rightTitle = "";
  if (pathname.startsWith("/users/")) {
    const userId = pathname.split("/")[2];
    const user = models.userModel(userId);
    if (user) rightTitle = `${user.first_name} ${user.last_name}`;
  } else if (pathname.startsWith("/photos/")) {
    const userId = pathname.split("/")[2];
    const user = models.userModel(userId);
    if (user) rightTitle = `Photos of ${user.first_name} ${user.last_name}`;
  }

  return (
    <AppBar position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Lương Hải Vân - B23DCAT332</Typography>
        <Typography variant="h6">{rightTitle}</Typography>
      </Toolbar>
    </AppBar>
  );
}
export default TopBar;

