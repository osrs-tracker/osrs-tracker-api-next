import { Hiscore } from '../../models/player';

const HISCORE_PARTS = [
  'Total',
  'Attack',
  'Defence',
  'Strength',
  'Hitpoints',
  'Ranged',
  'Prayer',
  'Magic',
  'Cooking',
  'Woodcutting',
  'Fletching',
  'Fishing',
  'Firemaking',
  'Crafting',
  'Smithing',
  'Mining',
  'Herblore',
  'Agility',
  'Thieving',
  'Slayer',
  'Farming',
  'Runecrafting',
  'Hunter',
  'Construction',
  'MiniGameHunter',
  'MiniGameRogue',
  'MiniGameLMS',
  'ClueScrollAll',
  'ClueScrollBeginner',
  'ClueScrollEasy',
  'ClueScrollMedium',
  'ClueScrollHard',
  'ClueScrollElite',
  'ClueScrollMaster',
];

export class HiscoreUtils {

  static parseHiscore(hiscoreString: string): Hiscore {
    const hiscoreParts = hiscoreString.split('\n').filter(empty => !!empty);
    const hiscore = hiscoreParts.reduce<Hiscore>((hiscore, hiscorePart, index) => {
      hiscore[HISCORE_PARTS[index]] =
        hiscorePart.split(',').map(part => Number(part)) as [number, number, number?];
      return hiscore;
    }, {});
    return hiscore;
  }
}
