export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString === today;
};

export const isThisWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

export const getDaysInWeek = (): string[] => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(formatDate(day));
  }
  return days;
};

export const getStreakCount = (completions: string[]): number => {
  if (completions.length === 0) return 0;
  
  const sortedDates = completions.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = formatDate(new Date());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const completion of sortedDates) {
    const completionDate = formatDate(currentDate);
    if (completion === completionDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};