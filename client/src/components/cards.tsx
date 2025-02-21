
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface CardProps {
  title?: string;
  numbooks?: number;
  description?: string;
  image?: string;
}

export default function ActionAreaCard({ title, numbooks, image, description }: CardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
