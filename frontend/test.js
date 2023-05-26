var test = "card/0/";
var word = test.split('/');
let copy = [0,0,0,0]
const labels = test.split('/');
            labels.map( (label) =>{
              if(label === '0')
            {
              copy[0] += 1;
            }
            else if (label === "Mobile phone")
            {
              copy[1] += 1;
            }
            else if (label === "card")
            {
              copy[2] += 1;
            }
            else if(label ==="license-plate")
            {
              copy[3] += 1;
            }})

console.log(copy);