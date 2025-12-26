import { FC, useEffect, useState } from 'react';
import
    {
        AchievementUtilities,
        LocalizeBadgeDescription,
        LocalizeBadgeName,
        LocalizeText,
        UnseenItemCategory
    } from '../../../../api';
import
    {
        Column,
        Flex,
        Grid,
        Text
    } from '../../../../common';
import { useAchievements, useInventoryBadges, useInventoryUnseenTracker } from '../../../../hooks';
import { AchievementBadgeView } from '../../../achievements/views';

export const InventoryAchievementView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const {
        badgeCodes = [],
        activeBadgeCodes = [],
        selectedBadgeCode = null,
        isWearingBadge = null,
        canWearBadges = null,
        toggleBadge = null,
        getBadgeId = null,
        activate = null,
        deactivate = null
    } = useInventoryBadges();

    const {
        achievementCategories = [],
        selectedCategoryCode = null,
        setSelectedCategoryCode = null,
        achievementScore = 0,
        getProgress = 0,
        getMaxProgress = 0,
        selectedCategory = null,
        getAllAchievements = []
    } = useAchievements();

    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if (!selectedBadgeCode || !isUnseen(UnseenItemCategory.ACHIEVEMENTS, getBadgeId(selectedBadgeCode))) return;

        removeUnseen(UnseenItemCategory.ACHIEVEMENTS, getBadgeId(selectedBadgeCode));
    }, [ selectedBadgeCode, isUnseen, removeUnseen, getBadgeId ]);

    useEffect(() =>
    {
        if (!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    return (
        <Flex fullWidth alignItems="start" justifyContent="start"
            className="text-black flex-column inventory-ach-main-view"
            gap={ 2 }>
            <Column fullWidth justifyContent={ 'start' } className={ 'inventory-ach-view overflow-auto' }>
                { getAllAchievements.map((achievement, index) =>
                {
                    return (
                        <Grid key={ index } alignItems="start" className={ 'flex-column inventory-ach-item p-2 ' }>
                            <Column className="ach-badge-container" size={ 1 } alignItems={ 'start' }>
                                <AchievementBadgeView className="badge-image" achievement={ achievement }/>
                            </Column>
                            <Column size={ 11 } alignItems={ 'start' }>
                                <Text bold className={ 'text-volter-bold' } truncate>
                                    { LocalizeBadgeName(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                                </Text>
                                <Text italics textBreak className={ 'text-volter' }>
                                    { LocalizeBadgeDescription(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                                </Text>
                                { ((achievement.levelRewardPoints > 0) || (achievement.scoreLimit > 0)) &&
                                    <div className={ 'd-inline, text-volter' }>

                                        { (achievement.scoreLimit > 0) &&
                                            <Text bold>{ LocalizeText('achievements.details.progress', [ 'progress', 'limit' ], [ (achievement.currentPoints + achievement.scoreAtStartOfLevel).toString(), (achievement.scoreLimit + achievement.scoreAtStartOfLevel).toString() ]) }, </Text>

                                        }
                                        { (achievement.levelRewardPoints > 0) &&
                                            <Text bold truncate className="text-volter">
                                                { LocalizeText('achievements.details.reward') } { achievement.levelRewardPoints } pixels
                                            </Text>
                                        }
                                    </div> }
                            </Column>

                        </Grid>)
                }) }
            </Column>
            <Flex justifyContent="center" alignItems="center" fullWidth className="nitro-progress-bar text-white mt-1">
                <Text small center style={ { marginTop: '-1px' } }>{ LocalizeText('achievements.categories.score', [ 'score' ], [ achievementScore.toString() ]) }</Text>
            </Flex>
        </Flex>
    );
}
