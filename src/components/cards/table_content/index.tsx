import { Button, Form, Table, TableProps, Tooltip } from 'antd';
import { FilterAdd, FilterRemove } from 'iconsax-react';
import { useState } from 'react';
import FilterPagination from 'src/components/filter/pagination';
import { colors } from 'src/constants/theme';
import ContentTop from '../content_top';
import s from './styles.module.scss';
import useParamsHook from 'src/hooks/params';

interface Props extends Omit<TableProps, 'title'> {
  title?: string;
  total?: number;
  filters?: React.ReactNode;
  headerExtra?: React.ReactNode;
  tableHeightGap?: number;
}

function TableContent({
  title,
  total,
  filters,
  dataSource,
  columns,
  loading,
  headerExtra,
  tableHeightGap = 210.8,
}: Props) {
  const { params } = useParamsHook();
  const [filterVisible, setFilterVisible] = useState(params ? true : false);

  return (
    <div className={s.container}>
      <div
        className={s.left}
        style={{ width: filterVisible ? 'calc(100% - 244px)' : '100%' }}
      >
        <ContentTop title={title}>
          {/* Extra content for top */}
          {headerExtra}

          {filters && (
            <Tooltip
              title={filterVisible ? 'Filterlarni yashirish' : 'Filterlar'}
            >
              <Button
                style={{ width: 40, height: 40, borderColor: colors.primary }}
                icon={
                  filterVisible ? (
                    <FilterRemove size="20" color={colors.white} />
                  ) : (
                    <FilterAdd size="20" color={colors.primary} />
                  )
                }
                type={filterVisible ? 'primary' : 'default'}
                onClick={() => setFilterVisible((prev) => !prev)}
              />
            </Tooltip>
          )}
        </ContentTop>

        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          loading={loading}
          scroll={{ x: 1000, y: innerHeight - tableHeightGap }}
          pagination={false}
        />
        <FilterPagination total={total} />
      </div>
      {filterVisible && (
        <div className={s.right}>
          <ContentTop title="Filterlar" />
          <Form layout="vertical">{filters}</Form>
        </div>
      )}
    </div>
  );
}

export default TableContent;
