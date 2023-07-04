import React from 'react';
import { useSelector } from 'react-redux';
import { messagesSelector } from '../../slices/messagesSlice';
import useAuth from '../../hooks/Index';

const filter = require('leo-profanity');

filter.loadDictionary('en');

const Messages = () => {
  const currentId = useSelector((state) => state.channelsReducer.currentChannelId);
  const messages = useSelector(messagesSelector.selectAll)
    .filter(({ channelId }) => channelId === currentId);

  const { currentUser } = useAuth();
  return messages.map(({ body, id }) => (
    <div key={id} className="text-break mb-2">
      <b>
        {currentUser.username}
        :
      </b>
      {` ${filter.clean(JSON.parse(body))}`}
    </div>
  ));
};

export default Messages;
