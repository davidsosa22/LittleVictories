import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { textStyles } from '../../Stylesheets/Stylesheet';
import {
  BarChart,
  Grid,
  PieChart,
  XAxis,
  YAxis
} from 'react-native-svg-charts';
import { useUserContext } from '../../Contexts/userContext';
import { format, getDay, isLeapYear } from 'date-fns';
import { Circle, G, Image } from 'react-native-svg';
import { UserStat } from '../../Interfaces/user';

const getDatesInLastWeek = (): string[] => {
  let date: string = format(new Date(), 'MM-dd-yyyy');
  const datesInLastWeek: string[] = [date];
  let count: number = 6;
  while (count > 0) {
    let pastMonthCount: number = 0;
    let dateArr: string[] = date.split('-');
    if (parseInt(dateArr[1]) > 1) {
      dateArr[1] = `${parseInt(dateArr[1]) - 1}`;
      if (dateArr[1].length < 2) {
        dateArr[1] = `0${dateArr[1]}`;
      }
    } else {
      let monthLengths: number[];
      if (isLeapYear(new Date())) {
        monthLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      } else {
        monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      }
      const lastMonth: number = parseInt(dateArr[0]) - 1;
      const daysLastMonth: number = monthLengths[lastMonth];
      dateArr[1] = `${daysLastMonth - pastMonthCount}`;
      if (`${parseInt(dateArr[0]) - 1}`.length < 2) {
        dateArr[0] = `0${parseInt(dateArr[0]) - 1}`;
      } else {
        dateArr[0] = `${parseInt(dateArr[0]) - 1}`;
      }
      pastMonthCount++;
    }
    date = dateArr.join('-');
    datesInLastWeek.unshift(date);
    count--;
  }
  return datesInLastWeek;
};

interface MoodData {
  key: number;
  amount: number;
  mood: any;
  svg: any;
}

const MoodChart = (): PieChart => {
  const { user, userStat } = useUserContext();

  const getMoods = (): any => {
    let moodCount = {};
    // if user has just submitted a DR today, this pulls that mood
    if (userStat?.mood) {
      moodCount[userStat.mood] = 1;
    }
    const datesInLastWeek = getDatesInLastWeek();
    // does not include today in search
    for (let i = 5; i >= 0; i--) {
      const targetDate = datesInLastWeek[i];
      const foundDate = user.userStats.find((stat) => stat.date === targetDate);
      if (foundDate && foundDate.mood) {
        if (moodCount[foundDate.mood]) {
          moodCount[foundDate.mood] = moodCount[foundDate.mood] + 1;
        } else {
          moodCount[foundDate.mood] = 1;
        }
      }
    }
    return moodCount;
  };

  const moodCount: any = getMoods();
  const svgFills: string[] = [
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff'
  ];

  const data: MoodData[] = Object.keys(moodCount).map((mood, index) => {
    return {
      key: index + 1,
      amount: moodCount[mood],
      mood,
      svg: { fill: svgFills[index] }
    };
  });

  const Labels: any = ({ slices }) => {
    const Images = {
      terrible: require('../../../assets/images/emoticon-angry-outline.png'),
      great: require('../../../assets/images/emoticon-excited-outline.png'),
      good: require('../../../assets/images/emoticon-happy-outline.png'),
      ok: require('../../../assets/images/emoticon-neutral-outline.png'),
      bad: require('../../../assets/images/emoticon-sad-outline.png')
    };

    return slices.map((slice, index) => {
      const { labelCentroid, data } = slice;
      return (
        <G key={index} x={labelCentroid[0]} y={labelCentroid[1]}>
          <Circle r={15} fill={'white'} />
          <Image
            x={-17}
            y={-17}
            width={35}
            height={35}
            preserveAspectRatio='xMidYMid slice'
            href={Images[data.mood]}
          />
        </G>
      );
    });
  };

  return (
    <PieChart
      style={{ height: 200 }}
      valueAccessor={({ item }) => item.amount}
      data={data}
      spacing={0}
      outerRadius={'95%'}
    >
      <Labels />
    </PieChart>
  );
};

const SleepHoursChart = (): BarChart => {
  const { user, userStat } = useUserContext();
  const weekDays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  const getDays = (): string[] => {
    const currentDayIndex: number = getDay(new Date());
    const days: string[] = [];
    // start at currentDay Index and push in all days after that index
    for (let i: number = currentDayIndex + 1; i < weekDays.length; i++) {
      days.push(weekDays[i]);
    }
    // if needed, loop back to beginning and add rest of days
    if (currentDayIndex > 0) {
      for (let i: number = 0; i <= currentDayIndex; i++) {
        days.push(weekDays[i]);
      }
    }
    return days;
  };
  const days = getDays();

  const getData = (): number[] => {
    const datesInLastWeek: string[] = getDatesInLastWeek();
    let lastWeekStats: number[] | null;
    if (userStat) {
      lastWeekStats = [userStat.sleep_hours];
    } else {
      lastWeekStats = [0];
    }
    for (let i: number = 5; i >= 0; i--) {
      const targetDate: string = datesInLastWeek[i];
      const foundDate: UserStat = user.userStats.find(
        (stat) => stat.date === targetDate
      );
      if (foundDate) {
        lastWeekStats.unshift(foundDate.sleep_hours);
      } else {
        lastWeekStats.unshift(0);
      }
    }
    return lastWeekStats;
  };
  const data: number[] = getData();

  const getTrueCount = (condition) => {
    let trueCount: number;
    const datesInLastWeek: string[] = getDatesInLastWeek();
    if (userStat) {
      trueCount = userStat[condition] ? 1 : 0;
      for (let i: number = 5; i > 0; i--) {
        const targetDate: string = datesInLastWeek[i];
        const foundDate: UserStat = user.userStats.find(
          (stat) => stat.date === targetDate
        );
        if (foundDate && foundDate[condition]) {
          trueCount++;
        }
      }
    } else {
      trueCount = 0;
      for (let i: number = 6; i > 0; i--) {
        const targetDate: string = datesInLastWeek[i];
        const foundDate: UserStat = user.userStats.find(
          (stat) => stat.date === targetDate
        );
        if (foundDate && foundDate[condition]) {
          trueCount++;
        }
      }
    }
    return trueCount;
  };

  const getFalseCount = (condition: string) => {
    let falseCount: number;
    const datesInLastWeek: string[] = getDatesInLastWeek();
    if (userStat) {
      falseCount = userStat[condition] ? 0 : 1;
      for (let i: number = 5; i > 0; i--) {
        const targetDate: string = datesInLastWeek[i];
        const foundDate: UserStat = user.userStats.find(
          (stat) => stat.date === targetDate
        );
        if (foundDate && !foundDate[condition]) {
          falseCount++;
        }
      }
    } else {
      falseCount = 0;
      for (let i: number = 6; i > 0; i--) {
        const targetDate: string = datesInLastWeek[i];
        const foundDate: UserStat = user.userStats.find(
          (stat) => stat.date === targetDate
        );
        if (foundDate && !foundDate[condition]) {
          falseCount++;
        }
      }
    }
    return falseCount;
  };

  type AxesSvgType = {
    fontSize: number;
    fill: string;
  };

  type VerticalContentInsetType = {
    top: number;
    bottom: number;
  };

  const axesSvg: AxesSvgType = { fontSize: 16, fill: '#1D426D' };
  const verticalContentInset: VerticalContentInsetType = {
    top: 10,
    bottom: 10
  };
  const xAxisHeight: number = 30;

  return (
    <View>
      <Text style={[textStyles.text, { fontWeight: 'bold' }]}>
        Hours of Sleep
      </Text>
      <View style={{ height: 200, flexDirection: 'row', marginTop: 15 }}>
        <YAxis
          data={data}
          style={{ marginBottom: xAxisHeight }}
          contentInset={verticalContentInset}
          svg={axesSvg}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <BarChart
            style={{ flex: 1 }}
            data={data}
            contentInset={verticalContentInset}
            svg={{ stroke: '#3e6188', fill: '#1D426D' }}
          >
            <Grid />
          </BarChart>
          <XAxis
            style={{
              marginHorizontal: 10,
              height: xAxisHeight,
              marginTop: 10
            }}
            data={data}
            formatLabel={(value, index) => days[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={axesSvg}
          />
        </View>
      </View>
      <View style={{ marginBottom: 15, marginTop: 15, flexDirection: 'row' }}>
        <Text style={[textStyles.text, { fontWeight: 'bold' }]}>Ate Well?</Text>
        <Text style={textStyles.text}>
          {' '}
          Yes: {getTrueCount('eaten_well')}, No: {getFalseCount('eaten_well')}
        </Text>
      </View>
      <View style={{ marginBottom: 15, flexDirection: 'row' }}>
        <Text style={[textStyles.text, { fontWeight: 'bold' }]}>
          Exercised?
        </Text>
        <Text style={textStyles.text}>
          {' '}
          Yes: {getTrueCount('exercised')}, No: {getFalseCount('exercised')}
        </Text>
      </View>
      <Text style={[textStyles.text, { fontWeight: 'bold' }]}>Moods</Text>
      <MoodChart />
    </View>
  );
};

const WeeklyStats = () => {
  const { user } = useUserContext();
  return (
    <View style={styles.view}>
      <Text
        style={[
          user.readable_font ? textStyles.h2_big : textStyles.h2,
          { marginBottom: 10 }
        ]}
      >
        Weekly Stats
      </Text>
      <SleepHoursChart />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#8ebac6',
    borderRadius: 10,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 20,
    padding: 20
  }
});

export default WeeklyStats;
