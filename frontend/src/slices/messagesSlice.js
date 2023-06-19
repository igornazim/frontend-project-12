import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
    removeMessages: messagesAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const id = action.payload;
      const restEntities = Object.values(state.entities).filter((e) => e.channelId !== id);
      messagesAdapter.setAll(state, restEntities);
    });
  },
});
// END

export const { setMessages, addMessage, removeMessages } = messagesSlice.actions;
export const messagesSelector = messagesAdapter.getSelectors((state) => state.messagesReducer);
export default messagesSlice.reducer;