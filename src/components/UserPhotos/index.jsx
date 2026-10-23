import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models"; // 1. Bổ sung import models

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId);

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Kiểm tra nếu user này chưa có ảnh nào
  if (!photos || photos.length === 0) {
    return (
      <Typography variant="h6" sx={{ p: 2 }}>
        No photos found for this user.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* VÒNG LẶP 1: Duyệt qua từng bức ảnh của user */}
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ p: 2 }}>
          {/* Ngày đăng ảnh */}
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Posted on: {formatDateTime(photo.date_time)}
          </Typography>

          {/* Hiển thị ảnh (Lấy từ thư mục src/images) */}
          <CardMedia
            component="img"
            image={require(`../../images/${photo.file_name}`)}
            alt="User photo"
            sx={{ mt: 1, mb: 2, maxHeight: 400, objectFit: "contain" }}
          />

          <Divider />

          {/* Phần bình luận */}
          <CardContent sx={{ px: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Comments:
            </Typography>

            {/* VÒNG LẶP 2: Duyệt qua từng bình luận của bức ảnh này */}
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((c) => (
                <Box key={c._id} sx={{ mb: 1.5, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  {/* Tên người comment là một link dẫn sang trang cá nhân của họ */}
                  <Typography
                    component={Link}
                    to={`/users/${c.user._id}`}
                    sx={{ fontWeight: "bold", color: "#1976d2", textDecoration: "none" }}
                  >
                    {c.user.first_name} {c.user.last_name}
                  </Typography>

                  {/* Ngày giờ comment */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {formatDateTime(c.date_time)}
                  </Typography>

                  {/* Nội dung comment */}
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {c.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
