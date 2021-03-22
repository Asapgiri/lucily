function nCr(n, r) {
    return factorial(n) / ( factorial(r) * factorial(n - r) )
}

function factorial(x) {
    if (x != 0) {
       osszeg = x--;
       while(x != 0) {
           osszeg = osszeg * x--;
       }
       return osszeg;
    }
    return 1;
}

ertekek = 0;
proba = 7;
n = 100;
p = 1/37;

for (i = 0; i <= proba; i++) {
    ertekek += nCr(n, i) * Math.pow(p, i) * Math.pow(1-p, n-i);
    console.log(`Processing number ${i}, actual value: ${ertekek}`);
}

console.log(ertekek);