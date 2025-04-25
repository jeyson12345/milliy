import { Gutter } from 'antd/es/grid/row';

// Pattern for form fields
export const phonePattern = /^\(\d{2}\)-\d{3}-\d{2}-\d{2}$/;
export const smsPattern = /^\d-\d-\d-\d$/;
export const innPattern = /^\d{3}-\d{3}-\d{3}$/;
export const sourceNumberPattern = /^\d{4}$/;

// Mask options
export const phoneMask = '00 000 00 00';

// Modal sizes
export const modalWidth = 600;

// Form sizes
export const formGutter: [Gutter, Gutter] = [24, 0];
export const baseFormItemCol = 24;

// Form validation messages
type ValueType = string | number | undefined;
export const amountFormatter = (value: ValueType) =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const amountParser = (value: ValueType) =>
  `${value}`!.replace(/\$\s?|(,*)/g, '');

// Date and time formats
export const dateFormat = 'YYYY-MM-DD';
export const monthFormat = 'YYYY-MM';
export const yearFormat = 'YYYY';

// Window size
export const windowSize =
  typeof window !== 'undefined' ? window.innerWidth : 1440;
