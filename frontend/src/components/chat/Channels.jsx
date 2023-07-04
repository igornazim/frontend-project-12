import {
  Nav,
  ToggleButton,
  ButtonGroup,
  Button,
  Dropdown,
} from 'react-bootstrap';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  setCurrentChannelId,
  channelsSelector,
} from '../../slices/channelsSlice';
import { showModal } from '../../slices/modalsSlice';

const filter = require('leo-profanity');

filter.loadDictionary('en');

const renderChannels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelector.selectAll);
  const currentId = useSelector((state) => state.channelsReducer.currentChannelId);
  const { t } = useTranslation();

  if (channels.length === 0) {
    return null;
  }
  return channels.map((channel) => {
    if (channel.removable) {
      return (
        <Nav.Item key={_.uniqueId()} className="w-100">
          <Dropdown className="w-100" as={ButtonGroup}>
            <Button
              variant={currentId === channel.id ? 'secondary' : null}
              onClick={() => dispatch(setCurrentChannelId(channel.id))}
              className="w-100 rounded-0 text-start text-truncate"
            >
              {`# ${filter.clean(channel.name)}`}
            </Button>
            <Dropdown.Toggle
              split
              variant={currentId === channel.id ? 'secondary' : null}
              id="dropdown-split-basic"
            >
              <span className="visually-hidden">{t('chat.hiddenText')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => dispatch(showModal({ type: 'removing', channel }))}
                href="#/action-1"
              >
                {t('chat.dropdownItemDelete')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => dispatch(showModal({ type: 'renaiming', channel }))}
                href="#/action-2"
              >
                {t('chat.dropdownItemRename')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav.Item>
      );
    }
    return (
      <Nav.Item key={_.uniqueId()} className="w-100">
        <ToggleButton
          variant={currentId === channel.id ? 'secondary' : null}
          type="button"
          className="w-100 rounded-0 text-start"
          onClick={() => dispatch(setCurrentChannelId(channel.id))}
        >
          <span className="me-1">#</span>
          {channel.name}
        </ToggleButton>
      </Nav.Item>
    );
  });
};

export default renderChannels;
