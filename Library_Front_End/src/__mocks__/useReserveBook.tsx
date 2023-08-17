export const mockDoReserveBook = jest.fn();

export const useReserveBook = () => ({
  doReserveBook: mockDoReserveBook,
});
