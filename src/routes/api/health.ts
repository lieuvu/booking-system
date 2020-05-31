// Library
import * as express from 'express';

// Router
const router = express.Router();

// Routes
router.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({'health': 'ok'});
});

// Export
export { router as healthRoute };
