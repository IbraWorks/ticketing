import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter} from './routes/signin';
import { signoutRouter} from './routes/signout';
import { signupRouter} from './routes/signup';

import { errorHandler} from './middlewares/error-handler';
import { NotFoundError} from './errors/not-found-error';

const app = express();

// traffic is being proxied to our app through ingress nginx. express will see this and not trust the https connection
// we add this to make express aware that its behind a proxy and to trust it.
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };