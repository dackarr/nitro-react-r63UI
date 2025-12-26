import { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeFormattedNumber, LocalizeShortNumber } from '../../../api';
import { Flex, LayoutCurrencyIcon, Text } from '../../../common';

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const currencyClass = useMemo(() => {
        switch(type)
        {
            case -1: return 'credits';
            case 0: return 'pixels';
            case 5: return 'diamonds';
            default: return '';
        }
    }, [ type ]);

    const element = useMemo(() =>
    {
        return (
            <>
                <Flex justifyContent="center" alignItems="center" pointer gap={ 1 } className={ `nitro-purse-button rounded ${ currencyClass }` }>
                    <Text bold truncate textEnd variant="white" grow title={ LocalizeFormattedNumber(amount) }>{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</Text>
                    <LayoutCurrencyIcon className={ `${ currencyClass }-icon` } type={ type } />
                </Flex>
            </>);
    }, [ amount, short, type ]);

    if(!short) return element;
    
    return (
        <OverlayTrigger
            placement="left"
            overlay={
                <Tooltip id={ `tooltip-${ type }` }>
                    { LocalizeFormattedNumber(amount) }
                </Tooltip>
            }>
            { element }
        </OverlayTrigger>
    );
}
