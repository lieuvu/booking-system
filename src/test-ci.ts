interface Link {
  url: string;
}

export function filterByTerm(input: Array<Link>, searchTerm: string) {
  if (!searchTerm) throw Error("searchTerm cannot be empty");
  if (!input.length) throw Error("input cannot be empty");
  const regex = new RegExp(searchTerm, "i");
  return input.filter(function (arrayElement) {
    return arrayElement.url.match(regex);
  });
}

console.log(filterByTerm([{ url: "string1" }, { url: "string2" }, { url: "java1" }], "java"));
