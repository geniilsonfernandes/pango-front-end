import dayjs from 'dayjs';

import 'dayjs/locale/pt-br'; // Importa o locale em português do Brasil

import { useState } from 'react';

// Configurar o locale para pt-br
dayjs.locale('pt-br');

export type UseCalendarResult = {
  currentDate: dayjs.Dayjs;
  nextMonth: () => void;
  previousMonth: () => void;
  formattedMonth: string;
  setValue: (date: Date | null) => void;
};

export const useCalendar = (): UseCalendarResult => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Avança para o próximo mês
  const nextMonth = () => {
    setCurrentDate((prevDate) => prevDate.add(1, 'month'));
  };

  // Retrocede para o mês anterior
  const previousMonth = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, 'month'));
  };

  const setValue = (date: Date | null) => {
    setCurrentDate(dayjs(date));
  };

  // Retorna o mês e ano formatado
  const formattedMonth = currentDate.format('MMMM YYYY'); // Ex.: "Janeiro 2025"

  return {
    currentDate,
    nextMonth,
    previousMonth,
    formattedMonth,
    setValue,
  };
};
