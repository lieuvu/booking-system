// Library
require('module-alias/register')

// Typescript
import { app } from '@src/app';
import { config } from '@src/config';
import { log } from '@util/logger';

app.listen(config.PORT, () => log.info(`Zervant subscription API started on port: ${config.PORT}`));
