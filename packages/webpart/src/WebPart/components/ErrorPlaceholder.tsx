import * as React from 'react';
import * as strings from 'WebPartStrings';
import { Placeholder } from '../../min-sp-controls-react/controls/placeholder';
import { UtilsService } from '../services/UtilsService';

export const ErrorPlaceholder = (props: {
  error: Error;
}) => {

  const placeholderIconName = strings.Error;
  const placeholderIconText = strings.placeholderIconTextUnableShowVisio

  const description = UtilsService.stringifyError(props.error);

  return (
    <Placeholder
      iconName={placeholderIconName}
      iconText={placeholderIconText}
      description={description}
      buttonLabel={strings.FieldConfigureLabel}
      hideButton
    />
  );
};
