/** Admin үг үүсгэх body-д нэгтгэнэ (хоосныг алгасна). */
export function examplePatchFromTriplet(ex: {
  exampleJp: string;
  exampleRomaji: string;
  exampleMn: string;
}): {
  example_jp?: string;
  example_romaji?: string;
  example_mn?: string;
} {
  const jp = ex.exampleJp.trim();
  const ro = ex.exampleRomaji.trim();
  const mn = ex.exampleMn.trim();
  const o: { example_jp?: string; example_romaji?: string; example_mn?: string } = {};
  if (jp) o.example_jp = jp;
  if (ro) o.example_romaji = ro;
  if (mn) o.example_mn = mn;
  return o;
}
