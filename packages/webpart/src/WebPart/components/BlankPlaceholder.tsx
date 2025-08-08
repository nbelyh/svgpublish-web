import * as React from 'react';
import * as strings from 'WebPartStrings';
import { Placeholder } from '../../min-sp-controls-react/controls/placeholder';

export const BlankPlaceholder = (props: {
  isTeams?: boolean;
  isPropertyPaneOpen?: boolean;
  isReadOnly?: boolean;
  onConfigure?: () => void;
}) => {

  const placeholderIconName = strings.Edit;
  const placeholderIconText = strings.placeholderIconTextVisioNotSelected

  const placeholderDescription = props.isPropertyPaneOpen
    ? strings.placeholderIconTextPleaseclickBrowse
    : props.isReadOnly
      ? (props.isTeams
        ? strings.placeholderIconTextPleaseclickSettings
        : strings.placeholderIconTextPleaseclickEdit
      )
      : strings.placeholderIconTextPleaseclickConfigure

  return (
    <Placeholder
      iconName={placeholderIconName}
      iconText={placeholderIconText}
      description={placeholderDescription}
      buttonLabel={strings.FieldConfigureLabel}
      onConfigure={props.onConfigure}
      hideButton={props.isReadOnly}
      disableButton={props.isPropertyPaneOpen}
    />
  );
};
