import * as stories from './ProductDetailPage.stories';
import { screen, waitFor, act } from '@testing-library/react';

import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render } from 'test/rtkProvider';
import { setupServer } from 'msw/node';

import { handlers } from './mockserver';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1',
  }),
}));

const { Default } = composeStories(stories);

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductDetail Page 테스트', () => {
  test('상품의 이름과 이미지 가격이 존재한다.', async () => {
    render(<Default />);

    await waitFor(
      () => {
        const productName = screen.getByTestId('product-name');
        expect(productName).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    const productimg = screen.getByRole('img');
    const price = screen.getByTestId('product-price');
    expect(price).toBeInTheDocument();
    expect(productimg).toBeInTheDocument();
  });
});

describe('ProductDetail Page 장바구니 버튼 테스트', () => {
  test('장바구니 버튼을 누르면 장바구니에 추가하시겠습니까라는 모달창이 나타난다.', async () => {
    render(<Default />);

    await waitFor(
      () => {
        const productName = screen.getByTestId('product-name');
        expect(productName).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    const cartButton = screen.getByRole('button');
    await userEvent.click(cartButton);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('장바구니에 추가 하시겠습니까?');
  });
});
