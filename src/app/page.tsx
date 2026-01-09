import Image from "next/image";
import CharacterList from "../components/CharacterList";
import CharacterInfo from "../components/CharacterInfo";
import Favs from "../components/Favs";
import { getCharactersPage, getCharacterById } from "../actions/characters";
import type { CharactersResponse } from "@/types/api";
import type { Character } from "@/types/character";
import styles from "./page.module.css";

interface HomeProps {
  searchParams: Promise<{ characterId?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const characterId = params.characterId
    ? Number(params.characterId)
    : undefined;

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

  let selectedCharacter: Character | null = null;
  let finalSelectedCharacterId: number | undefined = characterId;

  if (characterId) {
    const characterResult = await getCharacterById(characterId);
    if (characterResult.success) {
      selectedCharacter = characterResult.data;
    }
  }

  if (!selectedCharacter && initialData.results.length > 0) {
    selectedCharacter = initialData.results[0];
    finalSelectedCharacterId = initialData.results[0].id;
  }

  return (
    <div className={styles.page}>
      <div className={styles.gradientOverlay}></div>
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
          {selectedCharacter && (
            <div className={styles.characterInfoWrapper} data-character-info>
              <CharacterInfo character={selectedCharacter} />
            </div>
          )}
          <div className={styles.rightColumn}>
            <CharacterList
              initialData={initialData}
              selectedCharacterId={finalSelectedCharacterId}
            />
            <div className={styles.favsWrapperDesktop}>
              <Favs />
            </div>
          </div>
          <div className={styles.favsWrapperMobile}>
            <Favs />
          </div>
        </div>
      </div>
    </div>
  );
}
