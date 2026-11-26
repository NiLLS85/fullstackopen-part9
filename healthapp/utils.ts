// Funciones de ayuda para validar lo que llega por la línea de comandos o por HTTP

export const isNotNumber = (value: unknown): boolean =>
  (typeof value !== 'number' && typeof value !== 'string')
  || (typeof value === 'string' && value.trim() === '')
  || isNaN(Number(value));

export const errorMessage = (error: unknown): string => {
  let message = 'Something bad happened.';
  if (error instanceof Error) {
    message += ' Error: ' + error.message;
  }
  return message;
};
