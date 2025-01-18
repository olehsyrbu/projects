import { graphql } from 'msw';

export const pingHandler = graphql.query('ping', (req, res, ctx) => {
  return res(
    ctx.data({
      msg: 'Pong',
    }),
  );
});
