// Exercise 1
const print1to100 = () => {
  for (let i = 1; i <= 100; i++) {
    console.log(i);
  }
};

// Exercise 2
const print100to1 = () => {
  for (let i = 1; i <= 100; i++) {
    console.log(101 - i);
  }
};

// Exercise 3
const Div5from5to70 = () => {
  for (let i = 5; i <= 70; i++) {
    if (i % 5 === 0) {
      console.log(i);
    }
  }
};

const getListDivisor = (n) => {
  const listDivisor = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      listDivisor.push(i);
      if (i !== n / i) {
        listDivisor.push(n / i);
      }
    }
  }
  return listDivisor;
};
// Exercise 4
const countDivisor = (n) => {
  var listDivisor = getListDivisor(n);
  return listDivisor.length;
};

// Exercise 5
const isPerfectNumber = (n) => {
  const listDivisor = getListDivisor(n);
  let sum = 0;
  listDivisor.forEach((item) => {
    if (item !== n) {
      sum += item;
    }
  });
  return sum === n;
};

// Exercise 6
const rightAngledTriangle = (num) => {
  for (let i = 0; i <= num; i++) {
    console.log("#".repeat(i));
  }
};

// Exercise 7
const leftAngledTriangle = (num) => {
  for (let i = 0; i <= num; i++) {
    console.log(" ".repeat(num - i) + "#".repeat(i));
  }
};

// rightAngledTriangle(20);
// leftAngledTriangle(5);

// Exercise 8
const countAverageOfEvenDivisor = (n) => {
  const listDivisor = getListDivisor(n);
  let sum = 0;
  let count = 0;
  listDivisor.forEach((item) => {
    if (item % 2 === 0) {
      sum += item;
      count++;
    }
  });
  return count ? parseFloat((sum / count).toFixed(2)) : 0;
};

// console.log(countAverageOfEvenDivisor(15));

// Exercise 9
const insert = (arr, pos, value) => {
  return [...arr.slice(0, pos), value, ...arr.slice(pos)];
};

const arr = [1, 2, 3, 4, 5];
const pos = 2;
const value = 99;
const newArr = insert(arr, pos, value);
// console.log(newArr); // [1, 2, 99, 3, 4, 5]

// Exercise 10
const remove = (arr, pos) => {
  return [...arr.slice(0, pos), ...arr.slice(pos + 1)];
};

// Exercise 11

const sumOfEvenNumbers = (arr) =>
  arr.reduce((acc, item) => (item % 2 === 0 ? acc + item : acc), 0);

// console.log(sumOfEvenNumbers([1, 2, 3, 4, 5, 6])); // 12

// Exercise 12
const arrayValuesTypes = (arr) => {
  arrayTypes = arr.map((item) => typeof item);
  return arrayTypes;
};

// Exercise 13
const outlierNumber = (arr) => {
  const evenNumbers = arr.filter((item) => item % 2 === 0);
  const oddNumbers = arr.filter((item) => item % 2 !== 0);
  return evenNumbers.length === 1 ? evenNumbers[0] : oddNumbers[0];
};

// console.log(outlierNumber([2, 4, 6, 8, 10, 3])); // 3

// Exercise 14
const difference = (arr1, arr2) => [
  ...arr1.filter((x) => !arr2.includes(x)),
  ...arr2.filter((x) => !arr1.includes(x)),
];

// Exercise 15
const sumMinimums = (arr2d) => {
  let sum = 0;
  arr2d.forEach((arr) => {
    const min = Math.min(...arr);
    sum += min;
  });
  return sum;
};

// console.log(
//   sumMinimums([
//     [1, 2, 3, 4, 5],
//     [5, 6, 7, 8, 9],
//     [20, 21, 34, 56, 100],
//   ]),
// );

// Exercise 16
findMinElement = (arr) => [...arr].sort((a, b) => a - b)[0];
findMaxElement = (arr) => [...arr].sort((a, b) => a - b)[arr.length - 1];

// Exercise 17
oddArr = (arr) => arr.filter((item) => item % 2 !== 0);
evenArr = (arr) => arr.filter((item) => item % 2 === 0);
distinctArr = (arr) => [...new Set(arr)];

// Exercise 18
getBudgets = (employees) =>
  employees.reduce((total, item) => total + item.budget, 0);

// console.log(
//   getBudgets([
//     { name: "John", age: 21, budget: 29000 },
//     { name: "Steve", age: 32, budget: 32000 },
//     { name: "Martin", age: 16, budget: 1600 },
//   ]),
// );

// Exercise 19
const getDistance = (pointA, pointB) => {
  return Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2);
};

// console.log(getDistance({ x: -2, y: 1 }, { x: 4, y: 3 }));

// Exercise 20
const keysAndValues = (obj) => [Object.keys(obj), Object.values(obj)];
// console.log(keysAndValues({ a: 1, b: 2, c: 3 })); // [ ['a', 'b', 'c'], [1, 2, 3] ]

// console.log(keysAndValues({ a: "Apple", b: "Microsoft", c: "Google" }));

// Exercise 21
const freeShipping = (order) => {
  const total = Object.values(order).reduce((sum, item) => sum + item, 0);
  return total >= 50;
};

// console.log(freeShipping({ "Shampoo": 5.99, "Rubber Ducks": 15.99 }));

// Exercise 22
const GUEST_LIST = {
  Randy: "Germany",
  Karla: "France",
  Wendy: "Japan",
  Norman: "England",
  Sam: "Argentina",
};

greeting = (name) => {
  if (GUEST_LIST[name])
    return `Hi! I'm ${name}, and I'm from ${GUEST_LIST[name]}`;
  else return `Hi! I'm a guest`;
};

console.log(greeting("Randy")); // Hi! I'm Randy, and I'm from Germany
