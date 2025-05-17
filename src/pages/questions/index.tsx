import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Flex,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { AddCircle, MinusCirlce } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useAddQuestionMutation,
  useGetQuestionAnswersMutation,
  useGetQuestionsMutation,
} from 'src/app/services/users';
import {
  IQuestionAnswerRes,
  IQuestionDto,
  IQuestionRes,
} from 'src/app/services/users/type';
import { IBaseId, IBaseTranslateRes } from 'src/app/type';
import { PlusIcon } from 'src/assets/icon';
import TableContent from 'src/components/cards/table_content';
import { InputFormItem, RadioGroupFormItem } from 'src/components/form';
import { formGutter } from 'src/constants/form';
import { colors } from 'src/constants/theme';
import useParamsHook from 'src/hooks/params';

interface IFormOptions extends IBaseTranslateRes {
  correctAnswer: boolean;
}

function Questions() {
  // Methods
  const { pathname } = useLocation();
  const [get, { isLoading }] = useGetQuestionsMutation();
  const [getAnswers, { isLoading: answersLoading }] =
    useGetQuestionAnswersMutation();
  const [data, setData] = useState<IQuestionRes[]>();
  const [detail, setDetail] = useState<IQuestionRes | null>();
  const [open, setOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);

  const [answers, setAnswers] = useState<IQuestionAnswerRes[]>([]);

  // Search params
  const { searchParams, params } = useParamsHook();
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  const handleGetAnswers = (id: IBaseId) => {
    setAnswerOpen(true);
    const initial = (Number(page || 1) - 1) * Number(size || 10);
    getAnswers(id)
      .unwrap()
      .then((res) => {
        setAnswers(
          res?.items.map((item, index) => {
            return {
              ...item,
              key: initial + index + 1,
            };
          })
        );
        console.log('res', res);
      });
  };

  // Get
  const handleGet = () => {
    get('')
      .unwrap()
      .then((res) => {
        let arr: IQuestionRes[] = [];
        res?.forEach((item, index) => {
          arr.unshift({
            ...item,
            key: index + 1,
          });
        });
        setData(arr);
      });
  };

  useEffect(() => handleGet(), [params, pathname]);

  const columns: ColumnsType<IQuestionRes> = [
    ...baseColumns,
    {
      title: 'Variantlar',
      dataIndex: 'options',
      key: 'options',
      width: 100,
      render: (val: IBaseTranslateRes[], el) =>
        val?.length > 0 ? (
          <Button
            onClick={() => setDetail(el)}
            type="link"
            style={{ padding: 0 }}
          >
            Ko'rish
          </Button>
        ) : (
          ''
        ),
    },
    {
      title: 'Javoblar',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      render: (id, el) => (
        <Button
          onClick={() => {
            handleGetAnswers(id);
            setDetail(el);
          }}
          type="link"
          style={{ padding: 0 }}
        >
          Ko'rish
        </Button>
      ),
    },
  ];

  // Add new question
  const [form] = Form.useForm();
  const [add] = useAddQuestionMutation();

  const [type, setType] = useState('');
  const [hasCorrectAnswer, setHasCorrectAnswer] = useState(false);

  const onFinish = () => {
    form.validateFields().then((val: any) => {
      let options: IBaseTranslateRes[] = [];
      let answer: IBaseTranslateRes | undefined = undefined;
      val?.options?.forEach((item: IFormOptions, index: number) => {
        const { correctAnswer, ...rest } = item;
        options.push(rest);
        if (correctAnswer) answer = rest;
      });
      let obj: IQuestionDto = {
        type: val?.type,
        hasCorrectAnswer: val?.hasCorrectAnswer || false,
        bonus: 10,
        question: {
          uz_latin: val?.uz_latin,
          uz_cyrillic: val?.uz_cyrillic,
        },
        options: options,
        correctAnswer: answer,
      };

      add(obj)
        .unwrap()
        .then(() => {
          message.success(val?.uz_latin + ' savoli yaratildi');
          handleGet();
        });
      message.success('Foydalanuvchilarga savol yuborish boshlandi');
      closeModal();
    });
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
    setHasCorrectAnswer(false);
    setType('');
  };

  return (
    <>
      <TableContent
        title="Savol javoblar"
        paginationVisible={false}
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
              Yangi savol yaratish
            </Button>
          </>
        }
      />

      {/* Question options */}
      <Drawer
        width={500}
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.question.uz_latin}
        placement="right"
        className="user-info-drawer"
      >
        {answerOpen ? (
          <Table
            dataSource={answers}
            columns={answerColumns}
            bordered
            loading={answersLoading}
            scroll={{ x: 100, y: innerHeight - 173 }}
          />
        ) : (
          <div>
            {detail?.options?.map((item, index) => (
              <div key={index} style={{ marginTop: 10 }}>
                <b>Lotin:</b> {item?.uz_latin}
                <br />
                <b>Kril:</b> {item?.uz_cyrillic}
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Add new question code */}
      <Modal
        open={open}
        footer={null}
        title="Yangi savol yaratish"
        width={900}
        onCancel={closeModal}
      >
        <Form
          layout="vertical"
          // onFinish={onFinish}
          form={form}
          initialValues={{ options: [''] }}
        >
          <Row gutter={formGutter}>
            <RadioGroupFormItem
              name="type"
              label="Savol turi"
              message="Savol turini tanlang"
              optionType="default"
              options={[
                { label: 'Ochiq', value: 'open' },
                { label: 'Javob tanlanadigan', value: 'multiple_choice' },
              ]}
              onChange={(e) => setType(e.target.value)}
            />

            {type === 'multiple_choice' && (
              <Col span={24}>
                <Form.Item
                  name="hasCorrectAnswer"
                  valuePropName="checked"
                  label={null}
                >
                  <Checkbox
                    onChange={(e) => setHasCorrectAnswer(e.target.checked)}
                  >
                    To'g'ri javob bor
                  </Checkbox>
                </Form.Item>
              </Col>
            )}

            <InputFormItem
              required
              label={`Savol (o'zbek tilida)`}
              message="Savolni o'zbek tilida kiriting"
              name="uz_latin"
              col={12}
              textarea
              row={1}
            />
            <InputFormItem
              required
              label={'Savol (kril tilida)'}
              message="Savolni kril tilida kiriting"
              name="uz_cyrillic"
              col={12}
              textarea
              row={1}
            />

            {type === 'multiple_choice' && (
              <Col span={24}>
                <Form.List name="options">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <Row
                          key={key}
                          gutter={formGutter}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            columnGap: 8.3,
                          }}
                        >
                          {hasCorrectAnswer && (
                            <Col span={2}>
                              <Form.Item
                                name={[name, 'correctAnswer']}
                                valuePropName="checked"
                                label={index === 0 ? `To'g'ri javob` : ''}
                              >
                                <Checkbox
                                  onChange={(e) => {
                                    const options: IFormOptions[] =
                                      form.getFieldValue('options');
                                    const newOptions = options.map(
                                      (item: IFormOptions, i) => {
                                        return {
                                          ...item,
                                          correctAnswer:
                                            i === index
                                              ? e.target.checked
                                              : false,
                                        };
                                      }
                                    );
                                    form.setFieldValue('options', newOptions);
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          )}

                          <InputFormItem
                            required={index === 0 ? true : false}
                            label={index === 0 ? 'Variant (lotin tilida)' : ''}
                            name={[name, 'uz_latin']}
                            col={hasCorrectAnswer ? 10 : 11}
                            textarea
                            row={1}
                            {...restField}
                          />
                          <InputFormItem
                            required={index === 0 ? true : false}
                            label={index === 0 ? 'Variant (kril tilida)' : ''}
                            name={[name, 'uz_cyrillic']}
                            col={hasCorrectAnswer ? 10 : 11}
                            textarea
                            row={1}
                            {...restField}
                          />

                          <div style={{ marginBottom: index === 0 ? -7 : 24 }}>
                            {fields.length - 1 === index ? (
                              <AddCircle
                                onClick={() => add()}
                                size="32"
                                color={colors.primary}
                                style={{
                                  cursor: 'pointer',
                                }}
                              />
                            ) : (
                              <MinusCirlce
                                style={{ cursor: 'pointer' }}
                                size="32"
                                color={colors.red}
                                onClick={() => remove(name)}
                              />
                            )}
                          </div>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
            )}
          </Row>
          <Flex justify="end">
            <Popconfirm
              title="Savolni yaratishni tasdiqlaysizmi?"
              description="Yaratilgan savol barcha foydalanuvchilarga yuboriladi va uni o'chirib bo'lmaydi!"
              onConfirm={onFinish}
              okText="Ha"
              cancelText="Yo'q"
              placement="topRight"
            >
              <Button
                type="primary"
                // htmlType="submit"
                size="large"
              >
                Yaratish
              </Button>
            </Popconfirm>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}

export default Questions;

export const baseColumns: ColumnsType<IQuestionRes> = [
  {
    title: '№',
    dataIndex: 'key',
    key: 'key',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Turi',
    dataIndex: 'type',
    key: 'type',
    // width: 110,
    render: (val) => (val === 'open' ? 'Ochiq' : 'Javob tanlanadigan'),
  },
  {
    title: "To'g'ri javob mavjudmi",
    dataIndex: 'hasCorrectAnswer',
    key: 'hasCorrectAnswer',
    // width: 110,
    render: (val) => (val ? 'Ha' : "Yo'q"),
  },
  {
    title: 'Savol',
    dataIndex: 'question',
    key: 'question',
    width: 200,
    render: (val) => val?.uz_latin,
    // render: (val) => (
    //   <div>
    //     <div>
    //       <b>Lotin:</b> {val?.uz_latin}
    //     </div>
    //     <div>
    //       <b>Kril:</b> {val?.uz_cyrillic}
    //     </div>
    //   </div>
    // ),
  },
  {
    title: 'Javob',
    dataIndex: 'correctAnswer',
    key: 'correctAnswer',
    render: (val) => val?.uz_latin,
  },
  {
    title: 'Yuborilganlar soni',
    dataIndex: 'deliveredCount',
    key: 'deliveredCount',
    render: (val: number) => val.toLocaleString(),
  },
  {
    title: 'Yuborilmaganlar soni',
    dataIndex: 'failedCount',
    key: 'failedCount',
    render: (val: number) => val.toLocaleString(),
  },
  {
    title: 'Yaratilgan vaqt',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    align: 'center',
    render: (val) => dayjs(val).format('DD-MM-YYYY HH:mm:ss'),
  },
];

export const answerColumns: ColumnsType<IQuestionAnswerRes> = [
  {
    title: 'Foydalanuvchi',
    dataIndex: 'fullName',
    key: 'deliveredCount',
  },
  {
    title: 'Javobi',
    dataIndex: 'answer',
    key: 'answer',
  },
];
