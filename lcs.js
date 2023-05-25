let s = process.argv.slice(2);
let l = "";
if (!s || !s.length) console.log("");
else {
  for (let i = 0; i < s[0].length; i++) {
    for (let j = i + 1; j <= s[0].length; j++) {
      let r = s[0].slice(i, j);
      s.every((str) => str.includes(r)) && r.length > l.length && (l = r);
    }
  }
  console.log(l);
}
