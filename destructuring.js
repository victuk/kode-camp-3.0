let arrToObj = [
    ["name", "Victor"],
    ["language", "JavaScript"],
    ["country", "Nigeria"],
    ["mood", "Happy Mode"]
  ];


const result = arrToObj.map(arr => {
    let obj = {};
    obj[arr[0]] = arr[1];
    return obj
});

console.log(result);