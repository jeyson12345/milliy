import { Button, Flex, Form, message, Modal, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Copy } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useAddLinkMutation,
  useDeleteLinkMutation,
  useEditLinkMutation,
  useGetLinksMutation,
} from 'src/app/services/users';
import { ILinkDto, ILinkRes } from 'src/app/services/users/type';
import { IBaseId } from 'src/app/type';
import { PlusIcon } from 'src/assets/icon';
import TableActions from 'src/components/cards/table_actions';
import TableContent from 'src/components/cards/table_content';
import { InputFormItem } from 'src/components/form';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';

function Links() {
  // Methods
  const { pathname } = useLocation();
  const [get, { data: allData, isLoading }] = useGetLinksMutation();
  const [data, setData] = useState<ILinkRes[]>();
  const [open, setOpen] = useState(false);
  const [linkId, setLinkId] = useState<IBaseId>();

  // Search params
  const { searchParams, params } = useParamsHook();
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  // Get
  const handleGet = () => {
    const initial = (Number(page || 1) - 1) * Number(size || 10);

    get(params)
      .unwrap()
      .then((res) => {
        setData(
          res.items.map((item, index) => {
            return {
              ...item,
              key: initial + index + 1,
            };
          })
        );
      });
  };

  useEffect(() => handleGet(), [params, pathname]);

  // Delete
  const [deleteLink, { originalArgs, isLoading: deleteLoading }] =
    useDeleteLinkMutation();
  const onDelete = (id: IBaseId) => {
    deleteLink(id)
      .unwrap()
      .then(() => {
        message.success("Havola muvaffaqiyatli o'chirildi!");
        handleGet();
      });
  };

  const columns: ColumnsType<ILinkRes> = [
    ...baseColumns,
    {
      width: 100,
      title: 'Amallar',
      dataIndex: '_id',
      key: '_id',
      fixed: 'right',
      render: (id, el) => (
        <TableActions
          onEdit={() => {
            setOpen(true);
            setLinkId(id);
            form.setFieldsValue({
              title: el.title,
              link: el.link,
            });
          }}
          onDelete={() => onDelete(id)}
          deleteLoading={originalArgs === id && deleteLoading}
        />
      ),
    },
  ];

  // Add new link
  const [form] = Form.useForm();
  const [add, { isLoading: submitLoading }] = useAddLinkMutation();
  const [edit, { isLoading: editLoading }] = useEditLinkMutation();
  const onFinish = (dto: ILinkDto) => {
    if (linkId) {
      edit({ id: linkId, body: dto })
        .unwrap()
        .then((res) => {
          message.success("Havola muvaffaqiyatli o'zgartirildi!");
          onCancel();
          setData(
            (prev) =>
              prev?.map((item) => {
                if (item._id === linkId) {
                  return {
                    ...item,
                    title: res.title,
                    link: res.link,
                  };
                }
                return item;
              })
          );
        });
    } else {
      add(dto)
        .unwrap()
        .then(() => {
          message.success('Havola muvaffaqiyatli yaratildi!');
          onCancel();
          handleGet();
        });
    }
  };

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
    setLinkId(undefined);
  };

  return (
    <>
      <TableContent
        title="Instagram havolalari"
        total={allData?.pagination?.total}
        dataSource={data}
        columns={columns}
        loading={isLoading}
        headerExtra={
          <>
            <Button
              size="large"
              type="primary"
              icon={<PlusIcon />}
              onClick={() => setOpen(true)}
            >
              Yangi havola yaratish
            </Button>
          </>
        }
      />

      {/* Add new link */}
      <Modal
        open={open}
        footer={null}
        title={linkId ? "Havolani o'zgartirish" : 'Havola yaratish'}
        onCancel={onCancel}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          initialValues={{ validityHours: 1 }}
        >
          <InputFormItem
            name="title"
            label="Nomi"
            message="Havola nomini kiriting!"
          />
          <InputFormItem
            name="link"
            label="Havola"
            message="Havolani kiriting!"
            textarea
            row={1}
          />

          <Flex justify="end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitLoading || editLoading}
            >
              Yaratish
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}

export default Links;

export const baseColumns: ColumnsType<ILinkRes> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Nom',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Havola',
    dataIndex: 'link',
    key: 'link',
    render: (link, el) => (
      <Space>
        <Button
          icon={<Copy size="20" color={colors.primary} />}
          type="link"
          onClick={() => {
            navigator.clipboard.writeText(link);
            message.success(el?.title + ' havolasi nusxalandi!');
          }}
        />

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{ color: colors.link }}
        >
          {link}
        </a>
      </Space>
    ),
  },
];
