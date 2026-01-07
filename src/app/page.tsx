import Image from "next/image";
import CharacterList from "../components/CharacterList";
import CharacterInfo from "../components/CharacterInfo";
import { getCharactersPage } from "../actions/characters";
import type { CharactersResponse } from "@/types/api";
import styles from "./page.module.css";

export default async function Home() {
  const result = await getCharactersPage(1);
  
  const initialData: CharactersResponse = result.success
    ? result.data
    : {
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <Image
            src="/images/rickymorty_title.png"
            alt="Rick and Morty"
            width={600}
            height={200}
            priority
            className={styles.titleImage}
          />
        </div>
        <div className={styles.cardContent}>
          {initialData.results.length > 0 && (
            <CharacterInfo character={initialData.results[0]} />
          )}
          <CharacterList initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
