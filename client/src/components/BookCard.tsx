// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import CardActionArea from '@mui/material/CardActionArea';

// import type { Book } from '../interfaces/Book';

// export default function BookCard({ ...CardProps }: Book) {

//   return (
//     <Card sx={{ maxWidth: 300 }} key={CardProps.bookDetails.bookId}>
//       <CardActionArea href={CardProps.bookDetails.infoLink} target='_blank'>

//         <CardMedia
//           component="img"
//           height="auto"
//           width="100"
//           image={CardProps.bookDetails.thumbnail}
//           alt={CardProps.bookDetails.title}
//         />

//         <CardContent>
//             <Typography gutterBottom variant="h5" component="div">
//                 {CardProps.bookDetails.title}
//             </Typography>

//             <Typography variant="body2" color="text.secondary">
//                 {CardProps.bookDetails.authors?.join(", ")}
//             </Typography>

//             <Typography variant="body2" color="text.primary">
//                 {CardProps.bookDetails.categories?.join(", ")}
//             </Typography>

//             <Typography variant="body2" color="text.primary">
//                 {CardProps.bookDetails.description}
//             </Typography>


//         </CardContent>

//       </CardActionArea>
//     </Card>
//   );
// }
