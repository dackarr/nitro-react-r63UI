import { FriendlyTime, HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { CreateLinkEvent, GetConfiguration, LocalizeText } from '../../api';
import { Column, Flex, LayoutCurrencyIcon, Text } from '../../common';
import { usePurse } from '../../hooks';
import { CurrencyView } from './views/CurrencyView';
import { SeasonalView } from './views/SeasonalView';

export const PurseView: FC<{}> = props =>
{
    const { purse = null, hcDisabled = false } = usePurse();

    const displayedCurrencies = useMemo(() => GetConfiguration<number[]>('system.currency.types', []), []);
    const currencyDisplayNumberShort = useMemo(() => GetConfiguration<boolean>('currency.display.number.short', false), []);

    const getClubText = (() =>
    {
        if(!purse) return null;

        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays);
        const minutesUntilExpiration = purse.minutesUntilExpiration;

        if(purse.clubLevel === HabboClubLevelEnum.NO_CLUB) return LocalizeText('purse.clubdays.zero.amount.text');

        else if((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24))) return FriendlyTime.shortFormat(minutesUntilExpiration * 60);
        
        else return FriendlyTime.shortFormat(totalDays * 86400);
    })();

    const getCurrencyElements = (offset: number, limit: number = -1, seasonal: boolean = false) =>
    {
        if(!purse || !purse.activityPoints || !purse.activityPoints.size) return null;

        const types = Array.from(purse.activityPoints.keys()).filter(type => (displayedCurrencies.indexOf(type) >= 0));

        let count = 0;

        while(count < offset)
        {
            types.shift();

            count++;
        }

        count = 0;

        const elements: JSX.Element[] = [];

        for(const type of types)
        {
            if((limit > -1) && (count === limit)) break;

            if(seasonal) elements.push(<SeasonalView key={ type } type={ type } amount={ purse.activityPoints.get(type) } />);
            else elements.push(<CurrencyView key={ type } type={ type } amount={ purse.activityPoints.get(type) } short={ currencyDisplayNumberShort } />);

            count++;
        }

        return elements;
    }

    if(!purse) return null;

    return (
        <Column fullWidth className="nitro-purse-container" gap={ 1 }>
            <Flex className="nitro-purse">
                <Flex fullWidth gap={ 2 }>
                    <Column gap={ 0 } fullWidth>
                        <Flex gap={ 1 }>
                            <CurrencyView type={ -1 } amount={ purse.credits } short={ currencyDisplayNumberShort } />
                            <Flex onClick={ event => CreateLinkEvent('habboUI/open/hccenter') } alignItems="center" justifyContent="center" pointer gap={ 1 } className="nitro-purse-button rounded club">
                                <Text bold truncate textEnd variant="white" grow>{ getClubText }</Text>
                                <LayoutCurrencyIcon className="club-text" type="hc" />
                            </Flex>
                        </Flex>
                        <Flex fullWidth gap={ 1 }>
                            { getCurrencyElements(0, 2) }
                        </Flex>
                    </Column>
                </Flex>
            </Flex>
            <Flex className="nitro-notification" gap={ 2 } alignItems="center" justifyContent="end">
                <Flex className="setting-purse" gap={ 2 }>
                    <Text pointer onClick={ event => CreateLinkEvent('user-settings/toggle') }>{ LocalizeText('groupforum.view.settings.header') }</Text>
                    <Text pointer onClick={ event => CreateLinkEvent('help/show') }>{ LocalizeText('toolbar.help') }</Text>
                    <Text pointer onClick={ event => CreateLinkEvent('disconnect') }>{ LocalizeText('toolbar.logout') }</Text>
                </Flex>
            </Flex>
        </Column>
    );
}
