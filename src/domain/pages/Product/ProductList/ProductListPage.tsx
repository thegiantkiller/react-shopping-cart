import * as Styled from './ProductListPage.styles';
import uuid from 'react-uuid';
import { Spinner, ErrorMessage, Pagination, Dialog } from 'common/components';
import { ProductItem } from 'domain/components';
import useProductPage from '../../hooks/useProductPage';
import { useDialog } from 'common/hooks';

const ProductListPage = () => {
  const { status, products, totalPage, errorMessage } = useProductPage();
  const { dialogTitle, isOpenDialog } = useDialog();
  if (status === 'Loading') {
    return <Spinner />;
  } else if (status === 'Fail') {
    return <ErrorMessage>{errorMessage}</ErrorMessage>;
  }

  return (
    <div>
      <Dialog title={dialogTitle} isOpen={isOpenDialog} />
      <Styled.Grid>
        {products?.map((product) => (
          <ProductItem key={uuid()} price={product.price} image={product.image} name={product.name} id={product.id} />
        ))}
      </Styled.Grid>
      <Pagination totalPage={totalPage} />
    </div>
  );
};

export default ProductListPage;
