import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Card, CardMedia } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: "100%",
  marginBottom: theme.spacing(2),
  borderRadius: "10px",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
    transition: "transform 0.3s ease",
  },
}));

const GalleryDialog = ({ open, handleClose, images, baseurl }) => {
  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="theme-color">Gallery Images</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item key={index} xs={6} sm={4} md={3}>
              <StyledCard onClick={() => handleImageClick(baseurl + image)}>
                <CardMedia component="img" height="140" image={baseurl + image} alt={`Image ${index}`} />
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GalleryDialog;
