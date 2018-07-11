import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon';
import TextArea from 'components/layout/TextArea';
import { Button } from 'components/layout/Button';
import {
    messageStates,
    setMessagesState,
    setMessageText,
    postMessage,
    getMessages,
    getMessagesAuthors,
    selectAuthor,
    markMessageAsRead,
} from './actions';

const MessageInput = styled(TextArea) `
    font-size: ${props => props.theme.fontSizes[1]}px;
    height: 76px;
`;

const MessageInputNote = styled.p`
    font-size: ${props => props.theme.fontSizes[0]}px;
    margin-top: ${props => props.theme.space[2]}px;
    margin-bottom: ${props => props.theme.space[4]}px;

    color: ${props => props.theme.colors.grayBlue};
`;

const MessageInputError = styled(MessageInputNote) `
    color: ${props => props.theme.colors.red};
`;

const MessagesInputFormContainer = styled.div`
    margin-top: ${props => props.theme.space[4]}px;
    button {
        float: right;
    }
`;

const MessageInputLabel = styled.p`
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;
    margin: 0;
    margin-bottom: ${props => props.theme.space[2]}px;
`;

const MessagesInputForm = ({ onChange, messageText, sendMessage }) => (
    <MessagesInputFormContainer>
        <MessageInputLabel>Your message</MessageInputLabel>
        <MessageInput placeholder="Your message" onChange={e => onChange(e.target.value)} value={messageText} />
        <MessageInputNote>Up to 10,000 characters</MessageInputNote>
        {messageText.length >= 10000 && <MessageInputError>Characters limit is exceeded</MessageInputError>}
        <Button primary disabled={messageText.length === 0 || messageText.length >= 10000} text="Send message" onClick={sendMessage} />
    </MessagesInputFormContainer>
);

const Section = styled(Flex) `
    margin: ${props => props.theme.space[1]}px 0px;
    background-color: ${props => props.theme.colors.white};
    padding: ${props => props.theme.space[1]}px ${props => props.theme.space[2]}px;
`;
const SectionPart = styled(Box) `
    margin: ${props => props.theme.space[1]}px 0px;

    svg {
        margin-right: ${props => props.theme.space[1]}px;
    }
`;

const UsernameSectionPart = styled(({ isRead, children, ...rest }) => <SectionPart {...rest}>{children}</SectionPart>) `
    color: ${props => props.isRead ? props.theme.colors.gray : props.theme.colors.red};
    margin-bottom: 0;
`;

const DateView = styled(SectionPart) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;
    text-align: right;
`;

const dateToString = d => `${d.toLocaleDateString().toLocaleUpperCase()} ${d.toLocaleTimeString().toLocaleUpperCase()}`;

const BaseLink = styled.a`
    cursor: pointer;
    font-size: ${props => props.theme.fontSizes[1]}px;
    color: ${props => props.theme.colors.blue};

    svg {
        margin-right: ${props => props.theme.space[2]}px;
        color: ${props => props.theme.colors.blue};
    }

    &:hover {
        text-decoration: underline;
    }
`;

const BackLink = styled(BaseLink) `
    font-size: ${props => props.theme.fontSizes[1]}px;
`;

const Heading = styled(Box) `
    margin: 0;
    font-weight: bold;
    font-size: ${props => props.theme.fontSizes[3]}px;
`;

const NewMessagesInfo = styled.span`
    color: ${props => props.theme.colors.red};
    font-weight: bold;
`;

const MessagesInfo = styled(Box) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;
    padding-top: 8px;
    min-width: 80px;

    div {
        float: left;
        margin-right: 3px;
        margin-top: -3px;
    }
`;

const UsernameContainer = styled(Flex) `
    border-bottom: 1px solid ${props => props.theme.colors.separator};
`;

const ShowMoreLink = styled(BaseLink) `
    font-size: ${props => props.theme.fontSizes[0]}px;
    text-align: center;
`;

const AuthorInfo = styled(Box) `
    width: 100%;
`;

const ShowMoreLinkContainer = styled.div`
    width: 100%;
    text-align: center;
`;

const MessageCount = ({ author }) =>
    <MessagesInfo>
        <Icon name={IconMap.Envelope} />
        {author.newMessages > 0 && <span><NewMessagesInfo>{author.newMessages} new </NewMessagesInfo> / </span>}
        {author.totalMessages}
    </MessagesInfo>

const Author = ({ backToUsers, selectedAuthor, messages, userInfo, allMessagesVisible, showAllMessages }) => {
    const isMoreLinkShown = messages && messages.length != 0 && allMessagesVisible;
    return (<AuthorInfo mt={[2, 0, 0]}>
        {selectedAuthor
            && <BackLink onClick={backToUsers}>
                <Icon name={IconMap.AngleLeft} />
                Back to users
        </BackLink>}
        {selectedAuthor
            && <UsernameContainer
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-end"
                mt={3} pb={5} mb={5}>
                <Heading>Messages from {selectedAuthor.author}</Heading>
                <MessageCount author={selectedAuthor} />
            </UsernameContainer>}
        {isMoreLinkShown && <ShowMoreLinkContainer>
            <ShowMoreLink onClick={showAllMessages}>Show more</ShowMoreLink>
        </ShowMoreLinkContainer>}
    </AuthorInfo>
)};

const getAuthorInitials = author => {
    const words = author.split(' ');
    if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return author[0].toString().toUpperCase();
};

const getUserInitialsColor = props => {
    if (props.color) return props.color;
    return props.isMyMessage ? props.theme.colors.blue : props.theme.colors.lightPink;
};


const UserInitials = styled.div`
    flex-shrink: 0;
    background-color: ${props => (getUserInitialsColor(props))};
    color: ${props => props.theme.colors.white};
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border: 1px solid ${props => (getUserInitialsColor(props))};
    border-radius: 100px;
    font-size: ${props => props.theme.fontSizes[3]}px;

    &:after {
        position: absolute;
        margin-left: 3px;
        margin-top: -3px;
        width: ${props => props.isRead ? '0' : '10'}px;
        height: ${props => props.isRead ? '0' : '10'}px;
        background-color: ${props => props.theme.colors.red};
        border: ${props => props.isRead ? '0' : '1'}px solid ${props => props.theme.colors.red};
        border-radius: 100px;
        content: '';
    }
`;

const UsernameLabel = styled.span`
    color: ${props => props.theme.colors.grayBlue};
    font-size: ${props => props.theme.fontSizes[0]}px;

    margin-top: ${props => props.theme.space[2]}px;
    margin-left: ${props => props.theme.space[7]}px;
`;

const BaseTriangle = styled.div`
    width: 0;
    height: 0;
    border-style: solid;
`;

const Triangle = styled(BaseTriangle) `
    border-width: 12px 0 0 12px;
    border-color: transparent transparent transparent ${props => props.isMyMessage ? props.theme.colors.lightGreen : props.theme.colors.lightBlue};
    margin-left: 12px;
`;

const ReverseTriangle = styled(BaseTriangle) `
    border-width: 0 0 12px 12px;
    border-color: transparent transparent ${props => props.isMyMessage ? props.theme.colors.lightGreen : props.theme.colors.lightBlue} transparent;
    margin-right: 12px;
`;

const MessageBody = styled(SectionPart) `
    background-color: ${props => props.isMyMessage ? props.theme.colors.lightGreen : props.theme.colors.lightBlue};
    font-size: ${props => props.theme.fontSizes[1]}px;
    padding: ${props => props.theme.space[3]}px ${props => props.theme.space[4]}px;
    margin: 0;
    margin-${ props => props.isMyMessage ? 'right' : 'left'}: ${44 + 12}px;
`;

const Message = ({ m, userInfo }) => {
    const isMyMessage = m.author === userInfo.username;
    return (<Section flexDirection="column" flexWrap="wrap">
        <UsernameSectionPart w={1}>
            {!isMyMessage && <Flex alignItems="flex-start" justifyContent="space-between">
                <Flex>
                    <Flex alignItems="flex-end">
                        <UserInitials isMyMessage={false} isRead={m.isRead}>
                            {getAuthorInitials(m.author)}
                        </UserInitials>
                        <Triangle isMyMessage={false} />
                    </Flex>
                    <UsernameLabel>{m.author}</UsernameLabel>
                </Flex>
                <DateView >
                    {dateToString(new Date(m.createdAt))}
                </DateView>
            </Flex>}
            {isMyMessage && <Flex alignItems="flex-start" justifyContent="space-between">
                <DateView >
                    {dateToString(new Date(m.createdAt))}
                </DateView>
                <Flex>
                    <UsernameLabel>{m.author}</UsernameLabel>
                    <Flex alignItems="flex-end">
                        <ReverseTriangle isMyMessage={true} />
                        <UserInitials isMyMessage={true} isRead={true}>
                            {getAuthorInitials(m.author)}
                        </UserInitials>
                    </Flex>
                </Flex>
            </Flex>}
        </UsernameSectionPart>
        <MessageBody isMyMessage={isMyMessage}>
            {m.body}
        </MessageBody>
    </Section>
    );
}

const ScrollToBottom = styled.button`
    cursor: pointer;
    position: fixed;
    right: 50px;
    bottom: 100px;
    width: 32px;
    height: 32px;
    background-color: ${props => props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.white};
    border-radius: 100px;
    box-shadow: 0 2px 7px 1px rgba(0,114,255,0.5);
    outline: none;
    z-index: 10;

    &:hover {
        box-shadow: 0 2px 7px 1px rgba(0, 114, 255, 1);
    }

    &:active {
        opacity: 0.5;
    }

    svg {
        color: ${props => props.theme.colors.blue};
    }
`;

class MessagesContainer extends React.Component {
    scrollToBottom = () => {
        const inputForm = ReactDOM.findDOMNode(this.inputForm)
        window.scrollTo(0, inputForm.offsetTop - inputForm.clientHeight);
    }
    render() {
        const {
            userInfo,

            messages,
            messagesToShow,
            selectedAuthor,

            messageText,
            onChange,

            sendMessage,
            backToUsers,

            showAllMessages,
            allMessagesVisible, } = this.props;

        return (
            <div>
                <Author
                    backToUsers={backToUsers}
                    selectedAuthor={selectedAuthor}

                    messages={messages}
                    userInfo={userInfo}

                    showAllMessages={showAllMessages}
                    allMessagesVisible={allMessagesVisible} />
                {messagesToShow.map((m, i) => (<Message key={i} m={m} userInfo={userInfo} />))}
                <div
                    ref={e => { this.inputForm = e; }}>
                    <MessagesInputForm
                        onChange={onChange}
                        messageText={messageText}
                        sendMessage={sendMessage} />
                </div>
                {messagesToShow.length > 5
                    && <ScrollToBottom onClick={this.scrollToBottom}>
                        <Icon name={IconMap.AngleDown} />
                    </ScrollToBottom>}
            </div>
        );
    }
}

const UserSection = styled(Section) `
    border-top: 1px solid ${props => props.theme.colors.separator};
    padding: ${props => props.theme.space[5]}px 0px;
    cursor: pointer;
    &:last-child {
        border-bottom: 1px solid ${props => props.theme.colors.separator};
    }
`;

const Focused = styled.div`
    color: ${props => props.theme.colors.blue};
`;

const MessageText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    margin:0;
    font-size: ${props => props.theme.fontSizes[1]}px;
`;

const ArrowIcon = styled(Box) `
    margin-left: 20px;
    svg {
        color: ${props => props.theme.colors.blue};
    }
`;

const MessageInner = styled(Flex) `
    flex-grow: 1;
    overflow: hidden;
`;

const USER_INITIAL_COLORS = [
    '#5CC5E6',
    '#C681D5',
    '#FDAE70',
];

const UsersList = ({ authors, selectAuthor, userInfo }) => (
    <div>
        {authors.filter(a => a.author !== userInfo.username)
            .map((a, i) => (
                <UserSection
                    key={i}
                    alignItems="center"
                    flexWrap="nowrap"
                    onClick={() => selectAuthor(a)}>
                    <UserInitials
                        isRead={a.newMessages === 0}
                        color={USER_INITIAL_COLORS[i % USER_INITIAL_COLORS.length]}>
                        {getAuthorInitials(a.author)}
                    </UserInitials>
                    <MessageInner flexDirection="column" px={3} justifyContent="space-between">
                        <Flex justifyContent="space-between">
                            <Flex flexDirection="column" justifyContent="space-between">
                                <Focused>{a.author}</Focused>
                                <MessageText>{a.lastMessage}</MessageText>
                            </Flex>
                            <Flex alignItems="center">
                                <Flex flexDirection="column">
                                    <MessageCount author={a} />
                                    <DateView >
                                        {dateToString(new Date(a.lastMessageTime))}
                                    </DateView>
                                </Flex>
                                <ArrowIcon ml={1}>
                                    <Icon name={IconMap.AngleRight} />
                                </ArrowIcon>
                            </Flex>
                        </Flex>
                    </MessageInner>
                </UserSection>
            ))}
    </div>);

const Container = styled.div`
    width: 100%;
`;

export default connect(
    ({
        app: { userInfo },
        messages,
    }) => ({
        userInfo,
        messages,
    }),
    {
        setMessagesState,
        setMessageText,
        postMessage,
        getMessages,
        getMessagesAuthors,
        selectAuthor,
        markMessageAsRead,
    }
)(
    class extends React.Component {
        state = {
            allMessagesVisible: false,
        }
        async componentDidMount() {
            const { setMessagesState, getMessages, advert, userInfo, getMessagesAuthors } = this.props;

            setMessagesState(null);
            if (userInfo.username === advert.author) {
                getMessagesAuthors(advert.id);
            } else {
                const messages = await getMessages(advert.id, userInfo.username);

                this.readMessages(messages);
            }
        }
        readMessages = messages => {
            const { userInfo, markMessageAsRead } = this.props;
            if (messages.length <= 5) {
                this.showAllMessages();
            }
            messages
                .filter(m => !m.isRead && m.author !== userInfo.username)
                .forEach(m => markMessageAsRead(m.id));
        }
        showAllMessages = () => {
            this.setState({ ...this.state, allMessagesVisible: true });
        }
        hideMessages = () => {
            this.setState({ ...this.state, allMessagesVisible: false });
        }
        sendMessage = () => {
            const {
                messages,
                advert,
                userInfo,
                postMessage,
            } = this.props;

            const message = {
                body: messages.messageText,
                advertId: advert.id,
                author: userInfo.username,
            };
            postMessage(message);
        }
        selectAuthor = async authorData => {
            const messages = await this.props.getMessages(this.props.advert.id, authorData.author);
            this.props.selectAuthor(authorData);

            this.readMessages(messages);
        }
        reply = () => {
            const {
                messages,
                advert,
                userInfo,
                postMessage,
            } = this.props;

            const message = {
                body: messages.messageText,
                advertId: advert.id,
                author: userInfo.username,
                recipient: messages.messages[0].author,
            };
            postMessage(message);
        }
        backToUsers = () => {
            const { selectAuthor, getMessagesAuthors, setMessagesState, advert } = this.props;
            this.hideMessages();
            selectAuthor(null);
            getMessagesAuthors(advert.id);
            setMessagesState(messageStates.users);
        }
        render() {
            const {
                advert,
                userInfo,

                messages,

                setMessageText,
            } = this.props;

            const state = messages.state || (userInfo.username === advert.author ? messageStates.users : messageStates.messages)

            const messagesToShow = this.state.allMessagesVisible
                ? messages.messages
                : messages.messages.slice(Math.max(messages.messages.length - 5, 0));

            return (
                <Container>
                    {state === messageStates.messages
                        && <MessagesContainer
                            advert={advert}
                            userInfo={userInfo}
                            onChange={setMessageText}
                            selectedAuthor={messages.selectedAuthor}
                            messages={messages.messages}
                            messagesToShow={messagesToShow}
                            messageText={messages.messageText}
                            backToUsers={this.backToUsers}
                            sendMessage={messages.selectedAuthor ? this.reply : this.sendMessage}
                            showAllMessages={this.showAllMessages}
                            allMessagesVisible={this.state.allMessagesVisible} />}
                    {state === messageStates.users
                        && <UsersList
                            authors={messages.authors}
                            userInfo={userInfo}
                            selectAuthor={this.selectAuthor} />}
                </Container>
            );
        }
    })
