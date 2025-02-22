import { rest } from 'msw';
import data from '../data/products.json';
import type { CartProductListType, CartProductType } from 'domain/types';

let userCarts: CartProductListType = data.cart;

export const addCart = rest.post('/carts', async (req, res, ctx) => {
  const product = (await req.json()) as CartProductType;
  const cartList = userCarts.find((cartProduct) => cartProduct.id === product.id);

  if (!cartList) {
    userCarts.push(product);
    return res(ctx.status(201));
  } else {
    return res(ctx.status(400), ctx.json({ message: '이미 추가된 장바구니 아이템 입니다.' }));
  }
});

export const getCarts = rest.get('/carts', async (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(userCarts));
});

export const deleteCart = rest.post('/cart/delete', async (req, res, ctx) => {
  const product = (await req.json()) as CartProductType;
  const newCarts = userCarts.filter((item) => item.id !== product.id);

  userCarts = newCarts;
  return res(ctx.status(200), ctx.json(newCarts));
});
export const updateCart = rest.put('/cart/update', async (req, res, ctx) => {
  const product = (await req.json()) as CartProductType;

  const newCarts = userCarts.map((item) => {
    if (item.id === product.id) {
      return product;
    }
    return item;
  });

  if (!newCarts.length) {
    return res(ctx.status(400), ctx.json({ message: '장바구니가 비어있습니다!' }));
  }
  userCarts = newCarts;

  return res(ctx.status(200), ctx.json(newCarts));
});
