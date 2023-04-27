import { rest } from 'msw';
import data from '../data/products.json';

const PRODUCT_LENGTH = 8;
const TOTAL_PAGE = Math.ceil(data.products.length / PRODUCT_LENGTH);

// 페이지네이션 모킹
export const getProducts = rest.get('/products', async (req, res, ctx) => {
  const currentPage = Number(req.url.searchParams.get('page'));

  if (typeof currentPage !== 'number') {
    return res(ctx.status(400));
  }

  const offset = (currentPage - 1) * PRODUCT_LENGTH;
  const newProduct = data.products.slice(offset, offset + PRODUCT_LENGTH);

  return res(ctx.delay(1000), ctx.json({ products: newProduct, TOTAL_PAGE }));
});
