import { FC } from 'react';
import { LocalizeText } from '../../api';
import { Base, Column, LayoutProgressBarLoad, Text } from '../../common';

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;

    return (
        <Column fullHeight position="relative" className="nitro-loading">
            <Base fullHeight className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="center">
                    <Base className="connecting-duck" />
                    <Column alignItems="center" justifyContent="center" size={ 6 } className="text-center py-4">
                        { isError && (message && message.length) ?
                            <>
                                <LayoutProgressBarLoad isLoading={ true } progress={ percent } className="mt-2 large"/>
                                <Base style={ { marginLeft: '2.5%' } } className="text-loading-havvo">{ message }... 75%</Base></>
                            :
                            <>
                                <Text fontSize={ 1 } variant="white" className="text-shadow text-loading-havvo">{LocalizeText('camera.loading')}... { percent.toFixed() }%</Text>
                                <LayoutProgressBarLoad isLoading={ true } progress={ percent } className="mt-2 large" />
                            </>
                        }

                    </Column>
                </Column>
            </Base>
        </Column>
    );
}
