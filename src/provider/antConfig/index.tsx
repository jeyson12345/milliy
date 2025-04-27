import { ConfigProvider } from 'antd';
import { ProviderProps } from '../type';
import { colors } from 'src/constants/theme';

function AntConfigProvider({ children }: ProviderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
          colorBorder: colors.stroke,
          colorText: colors.black,
          // colorTextPlaceholder: colors.text_placeholder,
          fontSize: 14,
          // fontFamily: 'Poppins',
        },
        components: {
          Table: {
            colorFillAlter: colors.white,
            borderRadius: 12,
            borderRadiusSM: 12,
            borderRadiusLG: 12,
            controlHeight: 40,
            colorText: colors.text_primary,
            colorBgContainer: colors.white,
            colorBorderSecondary: '#d1d5db',
            fontSize: 14,
            fontWeightStrong: 500,
            padding: 10,
            paddingContentVerticalLG: 5,
            rowHoverBg: '#F5F5F5',
          },
          Button: {
            // controlHeight: 56,
            paddingContentHorizontal: 30,
            // colorBorder: ,
            // colorBgTextActive: colors.white,
            colorText: colors.primary,
            // colorTextLightSolid: colors.white,
          },
          Modal: {
            titleFontSize: 20,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
            paddingContentHorizontal: 16,
            fontSize: 16,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
            paddingContentHorizontal: 16,
            fontSize: 16,
          },
          DatePicker: {
            borderRadius: 8,
            controlHeight: 40,
            paddingContentHorizontal: 16,
            fontSize: 16,
          },
          // Badge: {
          //   colorText: colors.white,
          // },
          Segmented: {
            borderRadius: 8,
            controlHeightLG: 48,
            colorText: colors.white,
            colorTextLabel: colors.white,
            itemSelectedBg: colors.primary,
            trackBg: colors.bg_primary,
            paddingContentHorizontal: 32,
          },
          // Tabs: {
          //   fontSize: 16,
          //   inkBarColor: 'transparent',
          //   colorBorder: 'transparent',
          // },
          // Form: {
          //   labelFontSize: 16,
          //   verticalLabelPadding: 4,
          // },
          // Drawer: {},
          // Checkbox: {
          //   borderRadius: 0,
          // },
          // Dropdown: {
          //   colorText: colors.black,
          // },
          // Breadcrumb: {
          //   itemColor: colors.white,
          //   separatorColor: colors.white,
          //   separatorMargin: 16,
          // },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default AntConfigProvider;
