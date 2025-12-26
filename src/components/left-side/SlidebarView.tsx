import { Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import
    {
        CreateLinkEvent,
        GetSessionDataManager,
        LocalizeText,
        MessengerIconState, ReportType,
        VisitDesktop
    } from '../../api';
import
    {
        Base,
        Flex,
        LayoutAvatarImageView,
        LayoutItemCountView,
        Text,
        TransitionAnimation,
        TransitionAnimationTypes
    } from '../../common';
import
    {
        useAchievements,
        useFriends,
        useHelp,
        useInventoryUnseenTracker,
        useMessageEvent,
        useMessenger, useNavigator,
        useRoomEngineEvent,
        useSessionInfo
    } from '../../hooks';
import { ToolbarMeView } from '../toolbar/ToolbarMeView';

export const SliderbarView: FC<{ isInRoom: boolean }> = (props) =>
{
    const { isInRoom } = props;
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ useGuideTool, setUseGuideTool ] = useState(false);
    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { report = null } = useHelp();
    const { navigatorData = null } = useNavigator();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const isMod = GetSessionDataManager().isModerator;

    const handleToggle = () => 
    {
        setMeExpanded(!isMeExpanded);
    };

    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
    {
        const parser = event.getParser();

        setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
    });

    useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

            if (!target) return;

            image.className = 'toolbar-icon-animation';
            image.style.visibility = 'visible';
            image.style.left = (x + 'px');
            image.style.top = (y + 'px');

            document.body.append(image);

            const targetBounds = target.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();

            const left = (imageBounds.x - targetBounds.x);
            const top = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height = 20;

            const motionName = (`ToolbarBouncing[${ iconName }]`);

            if (!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

            Motions.runMotion(motion);
        }

        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

    return (
        isInRoom ? (
            <>
                <Flex pointer className="house-btn house" style={ { zIndex: '99' } } onClick={ event => CreateLinkEvent('navigator/goto/home') }>
                    <Base className="house-icon"/>
                    <hr className="vertical"/>
                    <Text style={ { textShadow: '0 2px white' } } bold variant="black">{ LocalizeText('navigator.homeroom') }</Text>
                </Flex> 
                <nav className="Sidebar rooms" style={ { zIndex: '99' } }>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button rooms"
                            onClick={ event => CreateLinkEvent('navigator/toggle') }>
                            <div className="Sidebar-buttonImage icon icon-rooms"/>
                            <span className="Sidebar-buttonText">{ LocalizeText('toolbar.icon.label.navigator') }</span>
                        </button>
                    </div>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button"
                            onClick={ event => CreateLinkEvent('catalog/toggle') }>
                            <div className="Sidebar-buttonImage icon icon-catalog"/>
                            <span className="Sidebar-buttonText">{ LocalizeText('catalog.title') }</span>
                        </button>
                    </div>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button"
                            onClick={ event => CreateLinkEvent('inventory/toggle') }>
                            <div className="Sidebar-buttonImage icon icon-inventory">
                                { (getFullCount > 0) && <LayoutItemCountView count={ getFullCount }/> }
                            </div>
                            <span className="Sidebar-buttonText">{ LocalizeText('inventory.title') }</span>
                        </button>
                    </div>
                </nav>
            </>
        ) : (
            <>
                <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isMeExpanded } timeout={ 300 }>
                    <ToolbarMeView useGuideTool={ useGuideTool } unseenAchievementCount={ getTotalUnseen } setMeExpanded={ setMeExpanded } />
                </TransitionAnimation>
                <Flex pointer className="house-btn rooms" style={ { zIndex: '99' } }
                    onClick={ () => report(ReportType.ROOM, { roomId: navigatorData.enteredGuestRoom.roomId, roomName: navigatorData.enteredGuestRoom.roomName }) }>
                    <Base className="panic-icon"/>
                    <hr className="vertical"/>
                    <Text style={ { textShadow: '0 2px white' } } bold variant="black">{ LocalizeText('panic.button.caption') }</Text>
                </Flex>
                <nav className="Sidebar" style={ { zIndex: '99' } }>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button" onClick={ event => VisitDesktop() }>
                            <div className="Sidebar-buttonImage icon icon-habbo"/>
                        </button>
                    </div>
                    <hr className="horizontal"/>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button"
                            onClick={ event => CreateLinkEvent('navigator/toggle') }>
                            <div className="Sidebar-buttonImage icon icon-rooms"/>
                            <Text className="Sidebar-buttonText">{ LocalizeText('toolbar.icon.label.navigator') }</Text>
                        </button>
                    </div>
                    <Flex column gap={ 0 } alignItems="center" className="Sidebar-group ">
                        <button type="button" className="Sidebar-button"
                            onClick={ event => CreateLinkEvent('catalog/toggle') }>
                            <div className="Sidebar-buttonImage icon icon-catalog"/>
                            <Text className="Sidebar-buttonText">{ LocalizeText('catalog.title') }</Text>
                        </button>
                    </Flex>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button"
                            onClick={ event => CreateLinkEvent('inventory/toggle') }>
                            <div className="Sidebar-buttonImage icon icon-inventory">
                                { (getFullCount > 0) && <LayoutItemCountView count={ getFullCount }/> }
                            </div>
                            <Text className="Sidebar-buttonText">{ LocalizeText('inventory.title') }</Text>
                        </button>
                    </div>
                    <div className="Sidebar-group ">
                        <button type="button" className="Sidebar-button navigation-item item-avatar"
                            onClick={ handleToggle }>
                            <LayoutAvatarImageView figure={ userFigure } direction={ 2 }
                                className="Sidebar-buttonImage Sidebar-item-avatar"/>
                            { (getTotalUnseen > 0) &&
                                <LayoutItemCountView count={ getTotalUnseen }/> }
                            <span className="Sidebar-buttonText">{ LocalizeText('toolbar.icon.label.memenu') }</span>
                            <div className="rightBoxHover"></div>
                        </button>
                    </div>
                </nav>
            </>
        )
    );
};
