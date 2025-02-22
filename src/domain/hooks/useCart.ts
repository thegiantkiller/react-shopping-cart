import { useAppSelector, useAppDispatch } from 'store';
import { updateCart, getCart, deleteCartItem, selectCartItem } from 'domain/store/feature/cart/cartSlice';
import { CartProductType } from 'domain/types';
import { calculateCartProductTotal, calculateCartTotalAmount } from 'domain/utils';
import { getData, postData } from 'common/utils/axios';
import { AxiosResponse } from 'axios';

const useCart = () => {
  const cartList = useAppSelector((state) => state.cartReducer.cartList);
  const selectedCartItem = useAppSelector((state) => state.cartReducer.selectedCartItem);
  const status = useAppSelector((state) => state.cartReducer.status);
  const dispatch = useAppDispatch();
  const totalAmount = cartList && calculateCartTotalAmount(cartList);
  const totalPrice = cartList && calculateCartProductTotal(cartList);

  const getCartItems = () => {
    dispatch(getCart('/carts'));
  };

  // 변수명 겹침
  const SelectCartItem = (cartProduct: CartProductType) => {
    dispatch(selectCartItem(cartProduct));
  };

  const addCartItem = async (product: CartProductType) => {
    try {
      const response = (await postData('/carts', product)) as AxiosResponse;
      if (response.status === 400) {
        throw new Error();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateCartItem = (product: CartProductType) => {
    dispatch(updateCart(product));
  };

  const updateOrderedCartItem = async (ischecked: boolean) => {
    const cartItem = (await getData('/carts')) as CartProductType[];
    cartItem.forEach((product) => {
      updateCartItem({
        ...product,
        isOrder: !ischecked,
      });
    });
  };

  const deleteOrderedCartItem = async () => {
    const cartItem = (await getData('/carts')) as CartProductType[];
    cartItem.forEach((product) => {
      if (product.isOrder) {
        dispatch(deleteCartItem(product));
      }
    });
  };

  return {
    addCartItem,
    cartList,
    getCartItems,
    totalAmount,
    totalPrice,
    updateOrderedCartItem,
    deleteOrderedCartItem,
    selectedCartItem,
    SelectCartItem,
    updateCartItem,
    status,
  };
};
export default useCart;
