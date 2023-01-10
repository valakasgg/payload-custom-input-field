import { Field } from 'payload/types';
import InputField from './InputField';

const reactNumberField: Field = {
  // ...
  name: 'mobile',
  type: 'number',
  admin: {
    components: {
      Field: InputField,
    },
  },
};

export default reactNumberField;

