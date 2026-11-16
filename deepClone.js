function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }


  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }


  if (value instanceof Map) {
    const result = new Map();
    seen.set(value, result);

    for (const [key, item] of value) {
      result.set(deepClone(key, seen), deepClone(item, seen));
    }
    return result;
  }


  if (value instanceof Set) {
    const result = new Set();
    seen.set(value, result);

    for (const item of value) {
      result.add(deepClone(item, seen));
    }
    return result;
  }

  const result = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));

  seen.set(value, result);


  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);


    if ("value" in descriptor) {
      descriptor.value = deepClone(descriptor.value, seen);
    }

    Object.defineProperty(result, key, descriptor);
  }

  return result;
}


const original = {
  name: "Alex",
  details: {
    city: "Стамбул"
  },
  numbers: [1, 2, 3],
  createdAt: new Date("2024-01-01")
};


original.self = original;


const secretKey = Symbol("secret");
original[secretKey] = "symbol value";


original.sayHello = function () {
  return "Привет!";
};

const copy = deepClone(original);


copy.details.city = "Лондон";
copy.numbers.push(4);

console.log("Оригинальный город:", original.details.city);
console.log("Город в копии:", copy.details.city);
console.log("Оригинальный массив:", original.numbers);
console.log("Массив в копии:", copy.numbers);
console.log("Циклическая ссылка сохранена:", copy.self === copy);
console.log("Дата скопирована:", copy.createdAt instanceof Date);
console.log("Символ скопирован:", copy[secretKey]);
console.log("Функция работает:", copy.sayHello());
console.log("Функция общая:", copy.sayHello === original.sayHello);
