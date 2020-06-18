// Library
import 'module-alias/register';

// App
import { app } from '@src/app';
import { config } from '@src/config';
import { log } from '@src/utils';

app.listen(config.PORT, () => log.info(`Zervant subscription API started on port: ${config.PORT}`));
