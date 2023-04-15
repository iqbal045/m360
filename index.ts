import dotenv from 'dotenv';
import dbConnect from './src/config/db';
import app from './src/app';

dotenv.config(); 


try {
  dbConnect()
  console.log('Database connected successfully!');
  app.listen(process.env.PORT  || 3000, () => {
    console.log(`Server is running on port: ${process.env.PORT || 3000}...`);
  });
} catch (err: unknown) {
  console.log(err);
  process.exit(1);
}
