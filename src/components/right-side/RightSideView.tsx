import { RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { Column, Flex } from '../../common';
import { useRoomSessionManagerEvent } from '../../hooks';
import { OfferView } from '../catalog/views/targeted-offer/OfferView';
import { GroupRoomInformationView } from '../groups/views/GroupRoomInformationView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { PurseView } from '../purse/PurseView';
import { MysteryBoxExtensionView } from '../room/widgets/mysterybox/MysteryBoxExtensionView';
import { RoomPromotesWidgetView } from '../room/widgets/room-promotes/RoomPromotesWidgetView';
import { UserSettingsView } from '../user-settings/UserSettingsView';

export const RightSideView: FC<{}> = props =>
{
    const [ landingViewVisible, setLandingViewVisible ] = useState(false);

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.CREATED, event => setLandingViewVisible(false));
    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.ENDED, event => setLandingViewVisible(event.openLandingView));
    
    return (
        <Flex className={ landingViewVisible ? 'nitro-right-side landing-view' : 'nitro-right-side' }>
            <Column position="relative" gap={ 1 }>
                <PurseView />
                <UserSettingsView />
                <RoomPromotesWidgetView />
                <GroupRoomInformationView />
                <MysteryBoxExtensionView />
                <OfferView/>
                <NotificationCenterView />
            </Column>
        </Flex>
    );
}
