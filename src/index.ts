import express from 'express';
import router from './routes/api';

const app = express();
const PORT = 3000;

app.use('/api', router);


app.listen(PORT, () => {
    console.log(`server runned on http://localhost:${PORT}`)
})