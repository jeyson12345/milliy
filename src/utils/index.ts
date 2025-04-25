import type { RcFile, UploadFile } from 'antd/es/upload/interface';

export const clearMask = (val: string) => {
  return val
    .replaceAll(' ', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('-', '');
};

export const makePhoneMask = (val: string) => {
  return `(${val[0] + val[1]})-${val[2] + val[3] + val[4]}-${val[5] + val[6]}-${
    val[7] + val[8]
  }`;
};

export const handlePreviewFile = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as RcFile);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

export const redirectToNewTab = (url: string) => {
  window.open(url, '_blank');
};

export const prettierNumber = (val: number | undefined, seperator?: string) => {
  if (val) {
    let val_arr = val.toString().split('.');
    let number = val_arr[0].split('').reverse();
    let number_rest = val_arr[1] ? '.' + val_arr[1] : '';
    let prettier_number_arr: string[] = [];

    number.forEach((item, index) => {
      if (index > 0 && index % 3 === 0)
        prettier_number_arr.push(seperator || ',');
      prettier_number_arr.push(item);
    });

    return prettier_number_arr.reverse().join('') + number_rest;
  } else return '';
};

export const prettierPhone = (val: string) => {
  return `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 9)}-${val.slice(
    9,
    11
  )}-${val.slice(11, 13)}`;
};

export const names = {
  male: 'Erkaklar',
  female: 'Ayollar',
  unknown: 'Boshqalar',
  adults: 'Yoshlar',
  teenagers: `O'smirlar`,
  middle_aged: `O'rta yosh`,
  young_adults: `Bolalar`,
  seniors: `Keksalar`,

  totalUsers: 'Umumiy foydalanuvchilar',
  newUsers: 'Yangi foydalanuvchilar',
  totalScanners: 'Umumiy skanerlar',
  todayScanners: 'Bugun skanerlar',
  activeUsers: 'Faol foydalanuvchilar',
};
