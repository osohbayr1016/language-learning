/** Admin үг үүсгэх body-д нэгтгэнэ (хоосныг алгасна). */
export function examplePatchFromTriplet(ex: {
  exampleZh: string;
  examplePinyin: string;
  exampleMn: string;
}): {
  example_zh?: string;
  example_pinyin?: string;
  example_mn?: string;
} {
  const zh = ex.exampleZh.trim();
  const py = ex.examplePinyin.trim();
  const mn = ex.exampleMn.trim();
  const o: { example_zh?: string; example_pinyin?: string; example_mn?: string } = {};
  if (zh) o.example_zh = zh;
  if (py) o.example_pinyin = py;
  if (mn) o.example_mn = mn;
  return o;
}
