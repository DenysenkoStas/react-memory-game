export const generateId = () => Math.floor(Math.random() * Date.now());

export const randomInteger = (max) => Math.floor(Math.random() * (max + 1));

export const randomRgbColor = () => {
  let r = randomInteger(255);
  let g = randomInteger(255);
  let b = randomInteger(255);
  return `rgb(${r}, ${g}, ${b})`;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const generateArray = (array = [], sliceEnd = 2) => {
  const firstArray = array?.slice(0, sliceEnd).map((icon) => ({
    id: generateId(),
    value: icon,
    color: randomRgbColor()
  }));
  const secondArray = firstArray?.map((obj) => ({...obj, id: generateId()}));
  const concatArray = [...firstArray, ...secondArray];
  return shuffleArray(concatArray);
};
