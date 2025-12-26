import { UnseenItemCategory } from '../../../api/inventory/UnseenItemCategory';

export const TAB_FURNITURE: string = 'inventory.furni';
export const TAB_BOTS: string = 'inventory.bots';
export const TAB_PETS: string = 'inventory.furni.tab.pets';
export const TAB_ACHIEVEMENTS: string = 'inventory.achievements';
export const TAB_BADGES: string = 'inventory.badges';
export const TABS = [ TAB_FURNITURE, TAB_PETS, TAB_BOTS, TAB_BADGES, TAB_ACHIEVEMENTS ];
export const UNSEEN_CATEGORIES = [ UnseenItemCategory.FURNI, UnseenItemCategory.PET, UnseenItemCategory.BOT, UnseenItemCategory.BADGE, UnseenItemCategory.ACHIEVEMENTS ];
export const MAX_ITEMS_TO_TRADE: number = 9;
