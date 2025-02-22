import * as stories from './MyOrderPage.stories';
import { screen, waitFor } from '@testing-library/react';

import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render } from 'test/rtkProvider';
import { setupServer } from 'msw/node';
import { handlers } from './mockserver';

const { Default } = composeStories(stories);

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MyOrderPage 테스트', () => {
  test('2개의 상품의정보(이미지,이름,가격,수량)가 존재한다.', async () => {
    render(<Default />);
    await waitFor(
      () => {
        const productsimg = screen.getAllByRole('img');
        expect(productsimg).toHaveLength(2);
      },
      { timeout: 3000 }
    );
    const orderName = screen.getAllByTestId('order-name');
    const productsInfo = screen.getAllByTestId('order-info');

    expect(orderName).toHaveLength(2);
    expect(productsInfo).toHaveLength(2);
  });

  test('페이지 헤더 이름은 주문 목록 이다.', async () => {
    render(<Default />);
    await waitFor(
      () => {
        const pageHeader = screen.getByRole('heading', { name: '주문 목록' });
        expect(pageHeader).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
  test('2개의 cartButton이 존재한다.', async () => {
    render(<Default />);
    await waitFor(
      () => {
        const cartButtons = screen.getAllByRole('button', { name: 'cart.svg' });
        expect(cartButtons).toHaveLength(2);
      },
      { timeout: 3000 }
    );
  });
  test('주문번호는 1이다.', async () => {
    render(<Default />);

    await waitFor(
      () => {
        const orderNumber = screen.getByTestId('order-number');
        expect(orderNumber).toHaveTextContent('주문번호 : 1');
      },
      { timeout: 3000 }
    );
  });
  test('상세보기버튼이 존재 한다.', async () => {
    render(<Default />);

    await waitFor(
      () => {
        const orderDetailButton = screen.getByRole('button', { name: '상세보기' });
        expect(orderDetailButton).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});

describe('MyOrderPage 기능 테스트', () => {
  test('장바구니 버튼을 누르면 장바구니 추가하시겠습니까? 모달창이 나온다.', async () => {
    render(<Default />);

    await waitFor(
      () => {
        const cartButtons = screen.getAllByRole('button', { name: 'cart.svg' });
        expect(cartButtons).toHaveLength(2);
      },
      { timeout: 3000 }
    );
    const cartButtons = screen.getAllByRole('button', { name: 'cart.svg' });

    await userEvent.click(cartButtons[0]);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('장바구니에 추가 하시겠습니까?');
  });

  test('상세보기를 누르면 주문내역과 동일한 2개의 상품의정보(이미지,이름,가격,수량)가 존재 한다.', async () => {
    render(<Default />);
    await waitFor(
      () => {
        const detailButton = screen.getByRole('button', { name: '상세보기' });
        expect(detailButton).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const detailButton = screen.getByRole('button', { name: '상세보기' });
    const orderPageImage = screen.getAllByRole('img');
    const orderPageName = screen.getAllByTestId('order-name');
    const orderPageInfo = screen.getAllByTestId('order-info');

    await userEvent.click(detailButton);
    await waitFor(
      () => {
        const productsimg = screen.getAllByRole('img');
        expect(productsimg).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    const orderDetailPageImage = screen.getAllByRole('img');
    const orderDetailPageName = screen.getAllByTestId('order-name');
    const orderDetailPageInfo = screen.getAllByTestId('order-info');

    expect(orderPageImage).toEqual(orderDetailPageImage);
    expect(orderPageName).toEqual(orderDetailPageName);
    expect(orderPageInfo).toEqual(orderDetailPageInfo);
  });

  test('상세보기를 누르면 페이지 헤더 이름은 주문내역 상세 이다.', async () => {
    render(<Default />);
    await waitFor(
      () => {
        const detailButton = screen.getByRole('button', { name: '상세보기' });
        expect(detailButton).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const detailButton = screen.getByRole('button', { name: '상세보기' });
    await userEvent.click(detailButton);

    await waitFor(
      () => {
        const pageHeader = screen.getByRole('heading', { name: '주문내역 상세' });
        expect(pageHeader).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test('상세보기를 누르면 결제 금액정보는 112700원이다.', async () => {
    render(<Default />);
    await waitFor(
      () => {
        const detailButton = screen.getByRole('button', { name: '상세보기' });
        expect(detailButton).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const detailButton = screen.getByRole('button', { name: '상세보기' });
    await userEvent.click(detailButton);
    await waitFor(
      () => {
        const paymentPrice = screen.getByTestId('payment-price');
        expect(paymentPrice).toHaveTextContent('112700원');
      },
      { timeout: 3000 }
    );
  });
});
