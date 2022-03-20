import { readFile, writeFile } from "fs/promises";
import { threadId } from "worker_threads";

// no modificar estas propiedades, agregar todas las que quieras
class Peli {
  id: number;
  title: string;
  rating?: number;
  tags: string[];
  constructor(id: number, title: string, tags: string[]) {
    this.id = id;
    this.title = title;
    this.tags = tags;
  }
}

class PelisCollection {

  filePath: string = "./pelis.json";

  async getAll(): Promise<Peli[]> {
    const buffer = await readFile(this.filePath);
    const string = buffer.toString();
    return JSON.parse(string);
  }

  async getById(id: number): Promise<Peli> {
    const todasPelis: Peli[] = await this.getAll();
    return todasPelis.find((peli: Peli) => {
      return peli.id === id;
    });
  }
  //si tiene propieda title se busca por ese string en el titulo
  //si tiene tag debe devolver las que tengan ese string en los tag
  //tags es un array, se filtra por cada tag
  async search({ title, tags }: any): Promise<Peli[]> {
    let array = await this.getAll();
    // console.log("title: " + title)
    // console.log(`tags :${tags}`)
    // console.log(tags)

    if (title) {
      array = array.filter((p) => {
        const regularExpression = new RegExp(title, "i");
        return regularExpression.test(p.title);
      });
    }

    //tags siempre es un array
    if (!tags.includes(undefined)) {
      /*
      array es igual a
      las pelis del array en las que
      alguno de sus tags(tagsDeLaPeli)
      esta incluido en los tags
      recibidos como parametro
      */
      array = array.filter(peli => {
        const tagsDeLaPeli = peli.tags
        return tagsDeLaPeli.some(tagPeli => tags.includes(tagPeli))
      })

    }

    return array;
  }

  //sin id repetido
  async add(peli: Peli): Promise<any> {
    const peliExiste = await this.getById(peli.id);
    //si el id existe...
    if (peliExiste) {
      return false;
    }
    const todasPelis = await this.getAll();
    todasPelis.push(peli);
    const json = JSON.stringify(todasPelis);
    await writeFile(this.filePath, json);
    return true;
  }
}

export { PelisCollection, Peli };
