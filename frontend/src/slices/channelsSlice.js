import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({ currentChannelId: 1});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});
// END

export const { setChannels, addChannel, updateChannel, removeChannel, setCurrentChannelId } = channelsSlice.actions;
export const channelsSelector = channelsAdapter.getSelectors((state) => state.channelsReducer);

export default channelsSlice.reducer;