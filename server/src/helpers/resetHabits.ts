import { Habit } from '../database/models/habit';
import { getDay, format } from 'date-fns';

const resetDailyHabits = async () => {
  try {
    const habits = await Habit.findAll();
    habits.map(habit => {
      Habit.update(
        { is_complete: false },
        { where: { frequency: 'daily' } }
      );
    });
  } catch (err) {
    console.warn('error updating daily habits: ', err);
  }
};

const resetWeeklyHabits = async () => {
  try {
    const habits = await Habit.findAll();
    const currentDayOfWk = getDay(new Date());
    const days = {
      0: 'Su',
      1: 'M',
      2: 'Tu',
      3: 'W',
      4: 'Th',
      5: 'F',
      6: 'Sa'
    }
    habits.map(habit => {
      // currently set to reset each day newly due
      if (habit.days_of_week.includes(days[currentDayOfWk])) {
        Habit.update(
          { is_complete: false },
          { where: { id: habit.id } }
        );
      }
    });
  } catch (err) {
    console.warn('error updating weekly habits: ', err);
  }
}

const resetMonthlyHabits = async () => {
  try {
    const habits = await Habit.findAll();
    const currentDateOfMonth = format(new Date(), 'd');
    habits.map(habit => {
      if (habit.frequency === 'monthly') {
        Habit.update(
          { is_complete: false },
          { where: { calendar_date: parseInt(currentDateOfMonth) } }
        );
      }
    });
  } catch (err) {
    console.warn('error updating monthly habits: ', err);
  }
}

resetDailyHabits();
resetWeeklyHabits();
resetMonthlyHabits();