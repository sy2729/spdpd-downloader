export const id = function(num){
  let string = '1234567890qwertyuiopasdfghjklzxcvbnm';
  let result = '';
  for(let i = 0; i < num; i++) {
    result += string[Math.round(Math.random() * string.length)]
  };
  return result;
};


export const deleteTemp = function(id) {
  
}