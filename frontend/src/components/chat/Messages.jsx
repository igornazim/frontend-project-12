import React from 'react';
import { useSelector } from 'react-redux';
import { messagesSelector } from '../../slices/messagesSlice';
import useAuth from '../../hooks/useAuth';

const filter = require('leo-profanity');

filter.loadDictionary('en');

const Messages = () => {
  const currentId = useSelector((state) => state.channelsReducer.currentChannelId);
  const messages = useSelector(messagesSelector.selectAll)
    .filter(({ channelId }) => channelId === currentId);

  const { getUser } = useAuth();
  const user = getUser('user');
  if (!user) {
    return null;
  } return messages.map(({ body, id }) => (
    <div key={id} className="text-break mb-2">
      <b>
        {user.username}
        :
      </b>
      {` ${filter.clean(JSON.parse(body))}`}
    </div>
  ));
};

export default Messages;
