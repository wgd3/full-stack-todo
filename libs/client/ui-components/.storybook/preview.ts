import { addons } from '@storybook/addons';

export const dispatchActionToDocument = () =>
  addons
    .getChannel()
    .addListener('storybook/actions/action-event', function (action) {
      console.log(`action-event detected`, action);
      document.dispatchEvent(
        new CustomEvent(action.data.name, { detail: action.data.args })
      );
    });

dispatchActionToDocument();
