import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import useParamsHook from 'src/hooks/params';
import '../filter.scss';

interface Props extends PaginationProps {
  pageQuery?: string;
  sizeQuery?: string;
}

export default function FilterPagination({
  total,
  pageSize = 10,
  ...rest
}: Props) {
  const { searchParams, handleMakeParams } = useParamsHook();
  const onChange: PaginationProps['onChange'] = (page, size) => {
    handleMakeParams('page', page.toString());
    handleMakeParams('size', size.toString());
  };

  const disabled = total !== undefined && total <= pageSize;

  return (
    <Pagination
      current={Number(searchParams.get('page')) || 1}
      pageSize={Number(searchParams.get('size')) || pageSize}
      total={total}
      onChange={onChange}
      disabled={disabled}
      showSizeChanger
      style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}
      className="filter-pagination"
      {...rest}
    />
  );
}
