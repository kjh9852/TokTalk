export const getBoardPostPosition = (index) => {
  const col = index % 3;
  const row = Math.floor(index / 3);

  return {
    x: 9.8 - col * 1.8,
    y: 3 - row * 1.2,
  };
};
