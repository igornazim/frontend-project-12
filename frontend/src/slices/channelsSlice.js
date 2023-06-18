import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
  },
});
// END

export const { setChannels, addChannel, updateChannel, removeChannel } = channelsSlice.actions;
export const channelsSelector = channelsAdapter.getSelectors((state) => state.channelsReducer);
export default channelsSlice.reducer;