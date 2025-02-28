
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface CardProps {
  title?: string;
  numbooks?: string;
  description?: string;
  image?: string;
}


export default function MyShelfCards({
  title,
  numbooks,
  image,
  description,
}: CardProps) {
  const handleClick = () => {
    switch (title) {
      case "Want to Read":
        window.location.assign("/want-to-read");
        break;
      case "Currently Reading":
        window.location.assign("/currently-reading");
        break;
      case "Finished Reading":
        window.location.assign("/finished-reading");
        break;
      case "Favorites":
        window.location.assign("/favorites");
        break;
      case "Complete the Bingo Challenge":
        window.location.assign("/bingo");
        break;
    }
  };


  return (
    <Card sx={{ maxWidth: 250, cursor: "pointer", boxShadow: 3 }} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{
            height: 180,
            width: "100%",
            objectFit: "contain",
            backgroundColor: "#f5f5f5",
            padding: "10px",
          }}
          image={image || "/src/assets/images/no-image.png"}
          alt={title}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/src/assets/images/no-image.png";
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" textAlign="center">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {description}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mt: 1 }}>
            {numbooks}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
