import { AsyncProps, AsyncSelect } from 'chakra-react-select';
import { BaseProps } from 'formik-chakra-ui';
import { GroupBase } from 'react-select';

export type CharacterSelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = BaseProps & {
  selectProps?: AsyncProps<Option, IsMulti, Group>;
};

export const CharacterSelect = <Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: CharacterSelectProps<Option, IsMulti, Group>
) => {
  const { name, selectProps } = props;

  return (
    <AsyncSelect
      id={name}
      {...selectProps}
      noOptionsMessage={({ inputValue }) =>
        inputValue && inputValue.trim() !== ''
          ? 'Character not found'
          : null
      }
    />
  );
};
