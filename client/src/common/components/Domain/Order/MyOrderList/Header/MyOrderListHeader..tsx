import * as Styled from './MyOrderListHeader.styles';
import type { MyOrderListHeaderProps } from './MyOrderListHeader.types';
import useMyOrderList from '../../hooks/useMyOrderList';

const MyOrderListHeader = ({ id }: MyOrderListHeaderProps) => {
  const { moveToDetailPage, isActiveDetailPage } = useMyOrderList(id);
  return (
    <Styled.Layout>
      <Styled.Text>{`주문번호 : ${id}`}</Styled.Text>
      {!isActiveDetailPage && <Styled.Text onClick={() => moveToDetailPage(`${id}`)}>상세보기</Styled.Text>}
    </Styled.Layout>
  );
};
export default MyOrderListHeader;
