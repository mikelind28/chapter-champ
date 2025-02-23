
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

export default function MyShelfCards({ title, numbooks, image, description }: CardProps) {
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
    }
  }

  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          width="340"
          image={image}
          alt={title}
        />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {numbooks} 
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
