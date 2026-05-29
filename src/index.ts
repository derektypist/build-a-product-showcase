interface Item {
  type: "book" | "electronics" | "clothing";
  id: string;
  price: number;
}

interface Book extends Item {
  type: "book",
  title: string,
  author: string
}

interface Electronics extends Item {
  type: "electronics",
  item: string,
  model: string,
  warranty?: number
}

interface Clothing extends Item {
  type: "clothing",
  item: string,
  brand: string,
  size?: "S" | "M" | "L"
}

type Product = Book | Electronics | Clothing;

class Collection<T> {
  items: T[];
  constructor(items: T[]) {
    this.items = items;
  }

getAll(): T[] {
    return this.items;
  }

filter(callback: (item: T) => boolean): T[] {
   return this.items.filter(callback);
}
}

function renderProduct(p: Product): string {
  const createProductCard = (id: string, content: string, price: number): string => {
	return `
	  <div class="item" id="${id}">
	    ${content}
	    <div class="price">$${price}</div>
	  </div>
	`;
  };

  if (p.type === "book") {
    const content = `<strong>Book:</strong> ${p.title} by ${p.author}`;
    return createProductCard(p.id,content,p.price); 
  }

  if (p.type === "electronics") {
    const warranty = p.warranty ? ` - Warranty: ${p.warranty} year(s)` : ``;
    const content = `<strong>Electronics:</strong> ${p.item} - ${p.model}${warranty}`;
    return createProductCard(p.id,content, p.price)
  }

  if (p.type === "clothing") {
     const size = p.size ? ` - Size ${p.size}` : ``;
     const content = `<strong>Clothing:</strong> ${p.item} by ${p.brand}${size}`;
     return createProductCard(p.id,content,p.price);
  }

  const _never: never = p;
  throw new Error(`Unknown product type: ${JSON.stringify(p)}`);

}

const products = new Collection<Product>(
  [
    {id: "e1", type: "electronics", item: "Laptop", model: "Dell Latitude 5490", warranty: 1, price: 250},
    {id: "c1", type: "clothing", item: "shirt", brand: "Marks & Spencer", size: "M", price: 6},
    {id: "b1", type: "book", title: "Get it Right This Time" , author: "Amy Schoen", price: 15.99},
    {id: "e2", type: "electronics", item: "Encyclopaedia Britannica", model: "Franklin", price: 99},
    {id: "b2", type: "book", title: "Start Programming with the Electron", author: "Masoud Yazdani", price: 15},
    {id: "c2", type: "clothing", item: "tie", brand: "Primark", price: 1},
    {id: "c3", type: "clothing", item: "suit", brand: "Marks & Spencer", size: "M", price: 99},
    {id: "b3", type: "book", title: "Bromley Football Club 1892-1992", author: "Muriel V Searle", price: 10}
  ]);

const output = document.getElementById("output");
let currentFilter: Product["type"] | undefined = undefined;

function showProducts(filter?: Product["type"]): void {
  if (!output) return;
  let itemsToShow: Product[];
  if (currentFilter === filter || filter === undefined) {
    itemsToShow = products.getAll();
    currentFilter = undefined;
    setActiveButton(undefined);
  } else {
    itemsToShow = products.filter((p: Product): boolean => p.type === filter);
    currentFilter = filter;
    setActiveButton(filter);
  }

  output.innerHTML = itemsToShow.map(renderProduct).join("");
}

function setActiveButton(filter: Product["type"] | undefined): void {
  const buttons: { [key: string]: HTMLElement | null } = {
    all: document.getElementById("all"),
    book: document.getElementById("books"),
    electronics: document.getElementById("electronics"),
    clothing: document.getElementById("clothing"),

 };

 for (const key in buttons) {
    buttons[key]?.classList.remove("active");
 }

 if (filter == undefined) {
    buttons["all"]?.classList.add("active");
 } else {
    buttons[filter]?.classList.add("active");

  }
}

document.getElementById("all")?.addEventListener("click", (): void => showProducts());
document.getElementById("books")?.addEventListener("click", (): void => showProducts("book"));
document.getElementById("electronics")?.addEventListener("click", (): void => showProducts("electronics"));
document.getElementById("clothing")?.addEventListener("click", (): void => showProducts("clothing"));


document.addEventListener("DOMContentLoaded", (): void => showProducts());
