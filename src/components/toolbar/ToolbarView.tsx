import { Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, GetConfiguration, GetSessionDataManager, LocalizeText, MessengerIconState, OpenMessengerChat, VisitDesktop } from '../../api';
import { Base, Flex, LayoutAvatarImageView, LayoutItemCountView, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useMessageEvent, useMessenger, useRoomEngineEvent, useSessionInfo } from '../../hooks';
import { ToolbarMeView } from './ToolbarMeView';

export const ToolbarView: FC<{ isInRoom: boolean }> = props =>
{
    const { isInRoom } = props;
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ leftSideCollapsed, setLeftSideCollapsed ] = useState(true);
    const [ rightSideCollapsed, setRightSideCollapsed ] = useState(true);
    const [ useGuideTool, setUseGuideTool ] = useState(false);
    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const isMod = GetSessionDataManager().isModerator;

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

            if(!target) return;

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

            if(!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

            Motions.runMotion(motion);
        }

        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

    return (
        <>
            <Flex alignItems="center" justifyContent="center" id="toolbar-chat-input-container" />
            <Flex alignItems="center" justifyContent="center" gap={ 2 } className="nitro-toolbar py-1 px-3">
                <Flex gap={ 2 } alignItems="center" className="toolbar-left-side">
                    <Flex alignItems="center" justifyContent="start" gap={ 2 }>
                        <Flex justifyContent="end" gap={ 2 } className={ ((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) ? '' : '' }>
                            { ((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) &&
                                <Base pointer className={ `navigation-item icon icon-message ${ (iconState === MessengerIconState.UNREAD) && 'is-unseen' }` } onClick={ event => OpenMessengerChat() } /> }
                        </Flex>
                        { isInRoom &&
                            <Base pointer className="navigation-item icon icon-camera" onClick={ event => CreateLinkEvent('camera/toggle') } /> }
                        { isMod &&
                            <Base pointer className="navigation-item icon icon-modtools" onClick={ event => CreateLinkEvent('mod-tools/toggle') } /> }
                    </Flex>
                </Flex>
                <Flex alignItems="center" gap={ 2 } className="toolbar-right-side">
                    <Base id="toolbar-friend-bar-container" className={ rightSideCollapsed ? 'd-none d-lg-block' : 'd-none' } />
                </Flex>
                <Flex alignItems="center" justifyContent="end" gap={ 2 } className="friendship-icons">
                    <text style={ { textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' } } onClick={ event => CreateLinkEvent('friends/toggle') }>{ LocalizeText('friendbar.link.friendlist') } </text>
                    <Base pointer className="navigation-item icon icon-friendsearch" title={ LocalizeText('friendlist.tip.search') } onClick={ event => CreateLinkEvent('friends/search') }></Base>
                </Flex>
            </Flex>
        </>
    );
}
