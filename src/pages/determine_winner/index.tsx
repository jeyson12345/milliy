import { Segmented } from 'antd';
import Lottie from 'lottie-react';
import { useState } from 'react';
import CountUp from 'react-countup';
import {
  useSelectDailyWinnerMutation,
  useSelectMonthlyWinnerMutation,
  useSelectWeeklyWinnerMutation,
} from 'src/app/services/users';
import { IUser } from 'src/app/services/users/type';
import loadingAnimation from 'src/assets/lottie/loading.json';
import ContentTop from 'src/components/cards/content_top';
import ConfettiEffect from './confetti';
import s from './style.module.scss';

const MyCounter = ({
  number,
  delay,
  start,
}: {
  number: number;
  delay: number;
  start: number;
}) => {
  return (
    <CountUp
      start={start * 10000}
      end={number}
      // @ts-ignore
      duration={delay * 0.8}
      formattingFn={(value: any) => {
        const str = Math.floor(value).toString();
        return str.charAt(0);
      }}
    />
  );
};

const DetermineWinnerPage = () => {
  const [daily, { isLoading: dLoading }] = useSelectDailyWinnerMutation();
  const [weekly, { isLoading: wLoading }] = useSelectWeeklyWinnerMutation();
  const [monthly, { isLoading: mLoading }] = useSelectMonthlyWinnerMutation();
  const loading = dLoading || wLoading || mLoading;

  const [winner, setWinner] = useState<IUser | undefined>();
  const [type, setType] = useState('Bugun');

  const onSubmit = () => {
    if (type === 'Bugun') {
      daily()
        .unwrap()
        .then((res) => {
          setWinner(res);
        });
    } else if (type === 'Oxirgi hafta') {
      weekly()
        .unwrap()
        .then((res) => {
          setWinner(res);
        });
    } else if (type === 'Oxirgi oy') {
      monthly()
        .unwrap()
        .then((res) => {
          setWinner(res);
        });
    }
  };

  return (
    <div className={s.container}>
      <ContentTop>
        <Segmented<string>
          options={['Bugun', 'Oxirgi hafta', 'Oxirgi oy']}
          onChange={(value) => {
            setType(value);
            setWinner(undefined);
          }}
          size="large"
          defaultValue="Bugun"
          value={type}
          type="primary"
        />
      </ContentTop>

      <div className={s.content}>
        {loading ? (
          <Lottie animationData={loadingAnimation} loop={true} width={300} />
        ) : winner ? (
          <div className={s.winner}>
            <div className={s.phone}>
              +
              {/* <MyCounter number={9} delay={3} start={326} />
              <MyCounter number={9} delay={3.5} start={895} />
              <MyCounter number={8} delay={4} start={456} /> */}
              998&nbsp;(
              {/* <MyCounter
                number={+winner?.phoneNumber?.slice(4, 5)}
                delay={4.5}
                start={102}
              /> */}
              {/* <MyCounter
                number={+winner?.phoneNumber?.slice(5, 6)}
                delay={4.5}
                start={102}
              /> */}
              **)&nbsp;
              <MyCounter
                number={+winner?.phoneNumber?.slice(6, 7)}
                delay={5}
                start={523}
              />
              <MyCounter
                number={+winner?.phoneNumber?.slice(7, 8)}
                delay={5.5}
                start={498}
              />
              <MyCounter
                number={+winner?.phoneNumber?.slice(8, 9)}
                delay={6}
                start={789}
              />
              &nbsp;
              <MyCounter
                number={+winner?.phoneNumber?.slice(9, 10)}
                delay={6.5}
                start={987}
              />
              <MyCounter
                number={+winner?.phoneNumber?.slice(10, 11)}
                delay={7}
                start={234}
              />
              &nbsp;
              <MyCounter
                number={+winner?.phoneNumber?.slice(11, 12)}
                delay={7.5}
                start={103}
              />
              <MyCounter
                number={+winner?.phoneNumber?.slice(12, 13)}
                delay={8}
                start={689}
              />
            </div>

            <div className={s.info} style={{ height: 57 }}>
              <div>
                {winner?.firstName} {winner?.secondName}
              </div>
            </div>
            <ConfettiEffect />
          </div>
        ) : (
          <button className={s.button_64} onClick={onSubmit}>
            <span>G‘olibni aniqlash 🎉</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DetermineWinnerPage;
